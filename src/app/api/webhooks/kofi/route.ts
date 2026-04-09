import { NextRequest, NextResponse } from 'next/server';
import { KofiService } from '@/lib/kofi';
import { PaymentService } from '@/lib/payment-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-kofi-signature');
    
    // 初始化服务
    const kofiService = new KofiService();
    const paymentService = new PaymentService();
    
    // 验证签名
    if (!kofiService.verifyWebhookSignature(body, signature || '')) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // 解析数据
    const webhookData = kofiService.parseWebhookData(body);
    
    // 处理 webhook
    const result = await paymentService.handleKofiWebhook(webhookData);
    
    // 记录处理结果
    console.log('Webhook processed successfully:', {
      type: webhookData.type,
      paymentId: result?.id,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed',
      paymentId: result?.id 
    });
    
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    
    // 返回错误响应，但使用 200 状态码避免 Ko-fi 重试
    // Ko-fi 会在收到非 2xx 响应时重试
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 200 } // 使用 200 避免重试循环
    );
  }
}

// GET 端点用于验证 webhook URL
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'active',
    service: 'Ko-fi Webhook Handler',
    timestamp: new Date().toISOString(),
    instructions: 'This endpoint accepts POST requests from Ko-fi webhooks'
  });
}