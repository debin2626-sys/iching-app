import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-202ff80ed40b410788fa3aef21450530",
  baseURL: "https://api.deepseek.com",
});

// Keyword-based scenario classification
const SCENARIO_KEYWORDS: Record<string, string[]> = {
  career: ["事业", "工作", "职业", "升职", "跳槽", "创业", "生意", "项目", "career", "job", "work", "business", "promotion"],
  love: ["感情", "爱情", "恋爱", "婚姻", "伴侣", "相亲", "分手", "复合", "love", "relationship", "marriage", "romance", "partner"],
  wealth: ["财运", "财富", "投资", "理财", "钱", "收入", "赚钱", "股票", "money", "wealth", "finance", "investment", "income"],
  health: ["健康", "身体", "疾病", "养生", "医疗", "health", "body", "illness", "wellness", "medical"],
  study: ["学业", "学习", "考试", "升学", "读书", "学校", "study", "exam", "school", "education", "academic"],
};

function classifyScenario(question: string): string {
  if (!question) return "other";
  const q = question.toLowerCase();
  for (const [scenario, keywords] of Object.entries(SCENARIO_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) return scenario;
  }
  return "other";
}

function getWeekOfMonth(date: Date, monthStart: Date): number {
  const diff = date.getTime() - monthStart.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
    const locale = searchParams.get("locale") || "zh";

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const divinations = await prisma.divination.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: startDate, lte: endDate },
      },
      include: {
        hexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
        changedHexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const totalReadings = divinations.length;

    if (totalReadings === 0) {
      return NextResponse.json({
        year,
        month,
        totalReadings: 0,
        topHexagrams: [],
        scenarioBreakdown: {},
        weeklyTrend: [],
        aiSummary: null,
      });
    }

    // Top hexagrams
    const hexagramCount: Record<number, { count: number; nameZh: string; nameEn: string; symbol: string }> = {};
    for (const d of divinations) {
      const h = d.hexagram;
      if (!hexagramCount[h.number]) {
        hexagramCount[h.number] = { count: 0, nameZh: h.nameZh, nameEn: h.nameEn, symbol: h.symbol };
      }
      hexagramCount[h.number].count++;
    }
    const topHexagrams = Object.entries(hexagramCount)
      .map(([num, data]) => ({ number: parseInt(num), ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Scenario breakdown
    const scenarioBreakdown: Record<string, number> = {};
    for (const d of divinations) {
      const scenario = classifyScenario(d.question || "");
      scenarioBreakdown[scenario] = (scenarioBreakdown[scenario] || 0) + 1;
    }

    // Weekly trend (up to 5 weeks)
    const weeklyMap: Record<number, number> = {};
    for (const d of divinations) {
      const week = getWeekOfMonth(new Date(d.createdAt), startDate);
      weeklyMap[week] = (weeklyMap[week] || 0) + 1;
    }
    const maxWeek = Math.ceil(endDate.getDate() / 7);
    const weeklyTrend = Array.from({ length: maxWeek }, (_, i) => ({
      week: i + 1,
      count: weeklyMap[i + 1] || 0,
    }));

    // AI monthly summary
    const hexagramNames = topHexagrams
      .map((h) => (locale === "zh" ? `${h.symbol}${h.nameZh}（第${h.number}卦，出现${h.count}次）` : `${h.symbol} ${h.nameEn} (Hexagram ${h.number}, appeared ${h.count} times)`))
      .join("、");

    const scenarioDesc =
      locale === "zh"
        ? Object.entries(scenarioBreakdown)
            .map(([k, v]) => {
              const labels: Record<string, string> = { career: "事业", love: "感情", wealth: "财运", health: "健康", study: "学业", other: "其他" };
              return `${labels[k] || k}${v}次`;
            })
            .join("、")
        : Object.entries(scenarioBreakdown)
            .map(([k, v]) => {
              const labels: Record<string, string> = { career: "career", love: "relationships", wealth: "finances", health: "health", study: "studies", other: "other" };
              return `${labels[k] || k}: ${v}`;
            })
            .join(", ");

    const systemPrompt =
      locale === "zh"
        ? `你是一位精通周易的国学导师。请基于用户本月的占卜数据，用易经哲学的视角给出月度运势总结。
要求：
- 200-300字，语言温和、有哲学深度
- 不要算命口吻，不要说"你会发财""你会成功"等断言
- 体现易经"变易、简易、不易"的核心思想
- 结合卦象特点给出方向性建议
- 语气如同智慧长者与晚辈的对话`
        : `You are a scholar of the I Ching (Book of Changes). Based on the user's divination data for this month, provide a monthly outlook grounded in I Ching philosophy.
Requirements:
- 200-300 words, thoughtful and philosophically grounded
- Avoid fortune-telling language; focus on patterns, tendencies, and inner guidance
- Reflect the I Ching's core principles of change, simplicity, and constancy
- Offer directional insight based on the hexagram patterns observed
- Tone: like a wise mentor offering perspective, not prediction`;

    const userPrompt =
      locale === "zh"
        ? `用户本月（${year}年${month}月）共占卜${totalReadings}次。
主导卦象：${hexagramNames || "暂无"}
问题分布：${scenarioDesc || "暂无"}
请给出月度运势总结。`
        : `This month (${year}-${month}), the user consulted the I Ching ${totalReadings} times.
Dominant hexagrams: ${hexagramNames || "none"}
Topics consulted: ${scenarioDesc || "none"}
Please provide a monthly outlook summary.`;

    let aiSummary: string | null = null;
    try {
      const completion = await deepseekClient.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 600,
        temperature: 0.7,
      });
      aiSummary = completion.choices[0]?.message?.content || null;
    } catch (err) {
      console.error("[Monthly Report AI Error]", err);
    }

    return NextResponse.json({
      year,
      month,
      totalReadings,
      topHexagrams,
      scenarioBreakdown,
      weeklyTrend,
      aiSummary,
    });
  } catch (err) {
    console.error("[Monthly Report Error]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
