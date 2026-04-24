import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Resend Webhook handler for bounce / complaint events.
 * Endpoint: POST /api/webhooks/resend
 *
 * Resend sends events like:
 *   { type: "email.bounced", data: { to: ["user@example.com"], ... } }
 *   { type: "email.complained", data: { to: ["user@example.com"], ... } }
 *
 * We mark matching EmailSubscription records as bounced.
 */

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET ?? '';

export async function POST(req: NextRequest) {
  try {
    // Optional: verify webhook signature via svix headers
    // For now, use a shared secret in query param as simple auth
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');
    if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const eventType: string = body?.type ?? '';
    const recipients: string[] = body?.data?.to ?? [];

    if (!['email.bounced', 'email.complained'].includes(eventType)) {
      // Acknowledge but ignore non-bounce events
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (recipients.length === 0) {
      return NextResponse.json({ ok: true, noRecipients: true });
    }

    // Mark all matching subscriptions as bounced
    const now = new Date();
    const result = await prisma.emailSubscription.updateMany({
      where: {
        email: { in: recipients.map((e) => e.toLowerCase()) },
        bounced: false,
      },
      data: {
        bounced: true,
        bouncedAt: now,
      },
    });

    return NextResponse.json({
      ok: true,
      event: eventType,
      updated: result.count,
    });
  } catch (err) {
    console.error('[resend-webhook] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
