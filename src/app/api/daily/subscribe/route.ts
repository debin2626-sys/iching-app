import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { sendVerificationEmail } from '@/lib/email'
import { normalizeEmail } from '@/lib/normalizeEmail'

/**
 * Verify Turnstile token server-side.
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('[subscribe] TURNSTILE_SECRET_KEY not set — skipping verification')
    return true
  }
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })
    const data = await res.json()
    return data.success === true
  } catch (err) {
    console.error('[subscribe] Turnstile verification error:', err)
    return false
  }
}

/**
 * POST /api/daily/subscribe
 * Body: { email: string, school: "yijing" | "daoist" | "all", turnstileToken: string }
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; school?: string; turnstileToken?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, school, turnstileToken } = body

  // Turnstile verification
  if (!turnstileToken) {
    return NextResponse.json({ error: '请完成人机验证' }, { status: 400 })
  }
  const turnstileOk = await verifyTurnstile(turnstileToken)
  if (!turnstileOk) {
    return NextResponse.json({ error: '人机验证失败，请重试' }, { status: 403 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Normalize email before storing
  const normalized = normalizeEmail(email)

  const validSchools = ['yijing', 'daoist', 'all']
  const selectedSchool = school && validSchools.includes(school) ? school : 'all'

  try {
    // Check if already subscribed
    const existing = await prisma.emailSubscription.findUnique({
      where: { email_school: { email: normalized, school: selectedSchool } },
    })

    if (existing?.verified) {
      return NextResponse.json({
        status: 'already_subscribed',
        message: '您已订阅，无需重复操作。',
      })
    }

    const verifyToken = randomBytes(32).toString('hex')

    await prisma.emailSubscription.upsert({
      where: { email_school: { email: normalized, school: selectedSchool } },
      update: { verifyToken },
      create: {
        email: normalized,
        school: selectedSchool,
        verifyToken,
      },
    })

    // Send verification email via Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn('[subscribe] RESEND_API_KEY is not set — skipping email send')
    } else {
      try {
        await sendVerificationEmail({ to: normalized, verifyToken, school: selectedSchool })
      } catch (emailError) {
        // Subscription is saved; email can be retried — don't fail the request
        console.error('[subscribe] Email send failed (subscription saved):', emailError)
      }
    }

    const response: Record<string, string> = {
      status: 'pending_verification',
      message: '验证邮件已发送，请查收邮箱完成订阅。',
    }

    if (process.env.NODE_ENV === 'development') {
      response.verifyToken = verifyToken
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[subscribe] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
