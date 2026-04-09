import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { KofiService } from '@/lib/kofi';
import { PaymentService } from '@/lib/payment-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 验证用户会话
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 解析请求数据
    const body = await request.json();
    const { amount, tier = 'BASIC', description, redirectUrl } = body;
    
    // 验证参数
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
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
    
    // 初始化服务
    const kofiService = new KofiService();
    const paymentService = new PaymentService();
    
    // 检查是否已有活跃订阅
    if (tier !== 'BASIC') {
      const hasActiveSubscription = await paymentService.hasValidSubscription(user.id, tier);
      
      if (hasActiveSubscription) {
        return NextResponse.json({
          error: 'Already have active subscription',
          tier,
          suggestion: 'Wait for current subscription to expire or contact support'
        }, { status: 400 });
      }
    }
    
    // 创建支付记录
    const payment = await paymentService.createPayment({
      userId: user.id,
      provider: 'KOFI',
      amount,
      tier,
      description,
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        referer: request.headers.get('referer')
      }
    });
    
    // 生成支付链接
    const paymentUrl = kofiService.createPaymentLink({
      amount,
      tier,
      description: description || `Payment for ${tier} tier`,
      redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_URL}/payment/success`,
      userId: user.id
    });
    
    // 更新支付记录中的支付链接
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentUrl,
        metadata: {
          ...(payment.metadata as any),
          paymentUrl,
          generatedAt: new Date().toISOString()
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentUrl,
      tier,
      amount,
      currency: 'USD',
      expiresIn: '30 minutes' // Ko-fi 链接有效时间
    });
    
  } catch (error: any) {
    console.error('Payment creation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create payment',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET 端点用于获取支付项目
export async function GET(request: NextRequest) {
  try {
    const kofiService = new KofiService();
    const paymentItems = kofiService.getPaymentItems();
    
    // 获取当前用户信息（如果有）
    const session = await auth();
    let userSubscription = null;
    
    if (session?.user?.email) {
      const { prisma } = await import('@/lib/prisma');
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (user) {
        const paymentService = new PaymentService();
        userSubscription = await paymentService.getUserActiveSubscription(user.id);
      }
    }
    
    return NextResponse.json({
      success: true,
      paymentItems,
      userSubscription,
      kofiUsername: process.env.KOFI_USERNAME || 'guoguo',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Get payment items error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to get payment items'
      },
      { status: 500 }
    );
  }
}