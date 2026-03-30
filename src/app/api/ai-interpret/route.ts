import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimitAiInterpret } from "@/lib/rate-limit";
import { aiInterpretDepthSchema, validateBody } from "@/lib/validations";

// POST: 请求AI解读（支持SSE流式输出）
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // Rate limit: per-user + per-IP
    const limited = rateLimitAiInterpret(request, session.user.id);
    if (limited) return limited;

    const body = await request.json();

    // Input validation
    const validation = validateBody(aiInterpretDepthSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { hexagramNumber, changingLines, question, depth, locale, birthInfo } = validation.data;

    // Validate birthInfo for personalized depth
    if (depth === "personalized" && !birthInfo) {
      return NextResponse.json(
        { error: "personalized 深度需要提供完整的 birthInfo" },
        { status: 400 }
      );
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
