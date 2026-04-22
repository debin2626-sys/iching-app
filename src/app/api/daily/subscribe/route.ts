import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

/**
 * POST /api/daily/subscribe
 * Body: { email: string, school: "yijing" | "daoist" | "all" }
 * 创建订阅 + 生成验证 token（邮件发送由 cron 或后续集成处理）
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; school?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, school } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const validSchools = ['yijing', 'daoist', 'all']
  const selectedSchool = school && validSchools.includes(school) ? school : 'all'

  try {
    // Check if already subscribed
    const existing = await prisma.emailSubscription.findUnique({
      where: { email_school: { email, school: selectedSchool } },
    })

    if (existing?.verified) {
      return NextResponse.json({
        status: 'already_subscribed',
        message: '您已订阅，无需重复操作。',
      })
    }

    const verifyToken = randomBytes(32).toString('hex')

    await prisma.emailSubscription.upsert({
      where: { email_school: { email, school: selectedSchool } },
      update: { verifyToken },
      create: {
        email,
        school: selectedSchool,
        verifyToken,
      },
    })

    // TODO: Send verification email via Resend
    // For now, return the token in dev mode for testing
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
