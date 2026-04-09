import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 验证用户会话
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // 获取用户
    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // 获取支付历史
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: {
          subscription: true
        }
      }),
      prisma.payment.count({
        where: { userId: user.id }
      })
    ]);
    
    // 获取用户订阅状态
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        endDate: {
          gt: new Date()
        }
      },
      orderBy: {
        endDate: 'desc'
      },
      include: {
        payment: true
      }
    });
    
    return NextResponse.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment.id,
        provider: payment.provider,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
        subscription: payment.subscription ? {
          tier: payment.subscription.tier,
          status: payment.subscription.status
        } : null
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasMore: skip + limit < total
      },
      userStats: {
        totalDonated: user.totalDonated,
        totalPayments: total,
        activeSubscription: activeSubscription ? {
          tier: activeSubscription.tier,
          status: activeSubscription.status,
          startDate: activeSubscription.startDate,
          endDate: activeSubscription.endDate,
          amount: activeSubscription.payment?.amount
        } : null
      }
    });
    
  } catch (error: any) {
    console.error('Get payment history error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to get payment history'
      },
      { status: 500 }
    );
  }
}