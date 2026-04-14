import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { searchKnowledgeWithTimeout } from '@/lib/rag';
import { rateLimitGeneral } from '@/lib/rate-limit';

const SearchSchema = z.object({
  question: z.string().min(1).max(500),
  hexagramId: z.number().int().min(1).max(64),
  limit: z.number().int().min(1).max(20).optional(),
});

export async function POST(req: NextRequest) {
  // Rate limit
  const limited = await rateLimitGeneral(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = SearchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '参数错误', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { question, hexagramId, limit } = parsed.data;

    const result = await searchKnowledgeWithTimeout(question, hexagramId, limit ?? 5);

    return NextResponse.json({
      chunks: result.chunks,
      scores: result.scores,
    });
  } catch (err) {
    console.error('[RAG Search Error]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
