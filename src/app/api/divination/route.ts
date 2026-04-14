import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitDivination, checkDailyDivinationLimit } from "@/lib/rate-limit";
import { createDivinationSchema, validateBody } from "@/lib/validations";

// POST: 保存占卜记录（支持匿名用户）
export async function POST(request: NextRequest) {
  try {
    // 尝试获取当前用户（未登录则为 null）
    let userId: string | null = null;
    try {
      const session = await auth();
      userId = session?.user?.id ?? null;
    } catch {
      // 未登录，userId 保持 null
    }

    // Rate limit: per-user + per-IP
    const limited = await rateLimitDivination(request, userId);
    if (limited) return limited;

    const body = await request.json();

    // ── 每日占卜次数校验（服务端防绕过）──
    const anonymousSessionId = typeof body?.anonymousSessionId === "string" ? body.anonymousSessionId : null;
    const isDailyLimitReached = await checkDailyDivinationLimit(userId, anonymousSessionId);
    if (isDailyLimitReached) {
      return NextResponse.json(
        {
          error: "今日占卜次数已达上限（每日最多3次），请明日再来",
          code: "DAILY_LIMIT_EXCEEDED",
        },
        {
          status: 429,
          headers: { "Retry-After": "86400" },
        }
      );
    }

    // Input validation
    const validation = validateBody(createDivinationSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { question, coinResults, hexagramId, changedHexagramId, changingLines } = validation.data;

    // 获取卦象信息
    const hexagram = await prisma.hexagram.findUnique({
      where: { id: hexagramId },
      select: { number: true, nameZh: true, nameEn: true, symbol: true },
    });

    if (!hexagram) {
      return NextResponse.json({ error: "卦象不存在" }, { status: 404 });
    }

    let changedHexagram = null;
    if (changedHexagramId) {
      changedHexagram = await prisma.hexagram.findUnique({
        where: { id: changedHexagramId },
        select: { number: true, nameZh: true, nameEn: true, symbol: true },
      });
    }

    const divination = await prisma.divination.create({
      data: {
        userId,
        question: question || null,
        coinResults,
        hexagramId,
        changedHexagramId: changedHexagramId ?? null,
        changingLines: changingLines || [],
      },
      include: {
        hexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
        changedHexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
      },
    });

    return NextResponse.json(divination, { status: 201 });
  } catch (error) {
    console.error("保存占卜记录失败:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// GET: 获取当前用户的占卜历史列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const [divinations, total] = await Promise.all([
      prisma.divination.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          hexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
          changedHexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
        },
      }),
      prisma.divination.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      divinations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("获取占卜历史失败:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
