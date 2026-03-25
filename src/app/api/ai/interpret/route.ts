import { NextRequest, NextResponse } from 'next/server';
import { getAIInterpretation } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hexagramNumber, changingLines, question, locale, birthInfo } = body;

    if (!hexagramNumber || !question) {
      return NextResponse.json(
        { error: 'hexagramNumber and question are required' },
        { status: 400 }
      );
    }

    // 校验 birthInfo 格式
    let validBirthInfo = undefined;
    if (birthInfo && birthInfo.year && birthInfo.month && birthInfo.day !== undefined && birthInfo.hour !== undefined) {
      validBirthInfo = {
        year: Number(birthInfo.year),
        month: Number(birthInfo.month),
        day: Number(birthInfo.day),
        hour: Number(birthInfo.hour),
      };
    }

    const { client, ...chatParams } = getAIInterpretation({
      hexagramNumber: Number(hexagramNumber),
      changingLines: Array.isArray(changingLines) ? changingLines : [],
      question: String(question),
      locale: locale || 'zh',
      birthInfo: validBirthInfo,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 八字解读内容更多，超时延长

    let response;
    try {
      response = await client.chat.completions.create(chatParams, {
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out' },
          { status: 504 }
        );
      }
      throw err;
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(ctrl) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              ctrl.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          ctrl.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Stream error';
          ctrl.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
        } finally {
          clearTimeout(timeout);
          ctrl.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    console.error('[AI Interpret Error]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
