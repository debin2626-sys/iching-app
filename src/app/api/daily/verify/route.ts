import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/daily/verify?token=xxx
 * 验证邮箱订阅
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  try {
    const subscription = await prisma.emailSubscription.findFirst({
      where: { verifyToken: token },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: '验证链接无效或已过期。' },
        { status: 404 }
      )
    }

    if (subscription.verified) {
      return NextResponse.json({
        status: 'already_verified',
        message: '邮箱已验证，无需重复操作。',
      })
    }

    await prisma.emailSubscription.update({
      where: { id: subscription.id },
      data: { verified: true, verifyToken: null },
    })

    return NextResponse.json({
      status: 'verified',
      message: '订阅成功！您将在每天早上 8:00 收到古典智慧推送。',
      school: subscription.school,
    })
  } catch (error) {
    console.error('[verify] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
