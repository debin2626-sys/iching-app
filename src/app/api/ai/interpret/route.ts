import { NextRequest, NextResponse } from 'next/server';
import { getAIInterpretation, type InterpretDepth } from '@/lib/ai';
import { buildCacheKey, getFromCache, setInCache } from '@/lib/ai-cache';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hexagramNumber, changingLines, question, locale, birthInfo, depth } = body;

    // 校验 gender
    const gender = typeof body.gender === 'string' ? body.gender : undefined;

    // 场景信息
    const scenarioId = typeof body.scenarioId === 'string' ? body.scenarioId : undefined;
    const subScenarioId = typeof body.subScenarioId === 'string' ? body.subScenarioId : undefined;

    if (!hexagramNumber || !question) {
      return NextResponse.json(
        { error: 'hexagramNumber and question are required' },
        { status: 400 }
      );
    }

    const validDepth: InterpretDepth = ['simple', 'detailed', 'deep'].includes(depth) ? depth : 'detailed';

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

    const lines = Array.isArray(changingLines) ? changingLines : [];

    // ── 缓存逻辑：通用解读（无个性化 birthInfo）走缓存 ──
    const isGeneric = !validBirthInfo;
    const scenarioSuffix = scenarioId ? `:s:${scenarioId}` : '';
    const cacheKey = isGeneric ? buildCacheKey(Number(hexagramNumber), lines, validDepth) + scenarioSuffix : '';

    if (isGeneric) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        // 命中缓存 — 以 SSE 格式一次性返回
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(ctrl) {
            ctrl.enqueue(encoder.encode(`data: ${JSON.stringify({ content: cached })}\n\n`));
            ctrl.enqueue(encoder.encode('data: [DONE]\n\n'));
            ctrl.close();
          },
        });
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        });
      }
    }

    const { client, ...chatParams } = getAIInterpretation({
      hexagramNumber: Number(hexagramNumber),
      changingLines: lines,
      question: String(question),
      locale: locale || 'zh',
      depth: validDepth,
      birthInfo: validBirthInfo,
      gender,
      scenarioId,
      subScenarioId,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

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

    // Collect full content for caching while streaming
    let fullContent = '';

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(ctrl) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullContent += content;
              ctrl.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          ctrl.enqueue(encoder.encode('data: [DONE]\n\n'));

          // Write to cache after successful stream (generic only)
          if (isGeneric && fullContent) {
            setInCache(cacheKey, fullContent);
          }
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
