
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";


type InterpretDepth = "simple" | "deep" | "personalized";

// POST: 请求AI解读（支持SSE流式输出）
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const {
      hexagramNumber,
      changingLines,
      question,
      depth = "simple" as InterpretDepth,
      locale = "zh",
      birthInfo,
    } = body;

    if (!hexagramNumber || !question) {
      return NextResponse.json(
        { error: "hexagramNumber 和 question 为必填项" },
        { status: 400 }
      );
    }

    // 校验深度参数
    const validDepths: InterpretDepth[] = ["simple", "deep", "personalized"];
    if (!validDepths.includes(depth)) {
      return NextResponse.json(
        { error: "depth 必须为 simple、deep 或 personalized" },
        { status: 400 }
      );
    }

    // 校验 birthInfo 格式（personalized 深度需要）
    let validBirthInfo = undefined;
    if (depth === "personalized") {
      if (!birthInfo?.year || !birthInfo?.month || birthInfo?.day === undefined || birthInfo?.hour === undefined) {
        return NextResponse.json(
          { error: "personalized 深度需要提供完整的 birthInfo" },
          { status: 400 }
        );
      }
      validBirthInfo = {
        year: Number(birthInfo.year),
        month: Number(birthInfo.month),
        day: Number(birthInfo.day),
        hour: Number(birthInfo.hour),
      };
    } else if (birthInfo?.year) {
      validBirthInfo = {
        year: Number(birthInfo.year),
        month: Number(birthInfo.month),
        day: Number(birthInfo.day),
        hour: Number(birthInfo.hour),
      };
    }

    // TODO: 根据 depth 构建不同的 prompt 并调用 AI
    // simple: 简要解读，快速返回
    // deep: 深度解读，包含爻辞详解
    // personalized: 结合八字的个性化解读

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // TODO: 替换为实际的 AI 调用
          // const { client, ...chatParams } = getAIInterpretation({ ... });
          // const response = await client.chat.completions.create(chatParams);
          // for await (const chunk of response) { ... }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: `[${depth}] AI 解读功能待实现` })}\n\n`
            )
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    console.error("[AI Interpret Error]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
