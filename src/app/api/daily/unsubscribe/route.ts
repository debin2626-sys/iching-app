import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/daily/unsubscribe?token=xxx
 * 取消邮件订阅
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  try {
    const subscription = await prisma.emailSubscription.findFirst({
      where: { unsubToken: token },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: '退订链接无效。' },
        { status: 404 }
      )
    }

    await prisma.emailSubscription.delete({
      where: { id: subscription.id },
    })

    return NextResponse.json({
      status: 'unsubscribed',
      message: '已取消订阅。如需重新订阅，请访问 51yijing.com/daily',
    })
  } catch (error) {
    console.error('[unsubscribe] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
