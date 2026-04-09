import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: paymentId } = await params;
    
    // 验证用户会话
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
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
    
    // 获取支付记录
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        subscription: true
      }
    });
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // 验证支付记录属于当前用户
    if (payment.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        provider: payment.provider,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
        paymentUrl: payment.paymentUrl,
        subscription: payment.subscription ? {
          tier: payment.subscription.tier,
          status: payment.subscription.status,
          startDate: payment.subscription.startDate,
          endDate: payment.subscription.endDate
        } : null
      }
    });
    
  } catch (error: any) {
    console.error('Get payment error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to get payment'
      },
      { status: 500 }
    );
  }
}