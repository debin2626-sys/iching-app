import crypto from 'crypto';

export interface KofiWebhookData {
  type: 'Donation' | 'Subscription' | 'Shop Order' | 'Commission';
  data: {
    message_id: string;
    amount: string;
    currency: string;
    from_name: string;
    message?: string;
    timestamp: string;
    is_public: boolean;
    url?: string;
    email?: string;
    is_subscription_payment?: boolean;
    is_first_subscription_payment?: boolean;
    subscription_id?: string;
    kofi_transaction_id?: string;
  };
  email?: string;
  kofi_username?: string;
}

export interface CreatePaymentParams {
  amount: number;
  currency?: string;
  description?: string;
  redirectUrl?: string;
  userId?: string;
  tier?: 'BASIC' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
}

export class KofiService {
  private apiKey: string;
  private webhookSecret: string;
  private username: string;
  
  constructor() {
    this.apiKey = process.env.KOFI_API_KEY || '';
    this.webhookSecret = process.env.KOFI_WEBHOOK_SECRET || '';
    this.username = process.env.KOFI_USERNAME || 'guoguo';
  }
  
  /**
   * 验证 Webhook 签名
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    if (!this.webhookSecret) {
      console.warn('KOFI_WEBHOOK_SECRET not set, skipping signature verification');
      return true;
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');
    
    return signature === expectedSignature;
  }
  
  /**
   * 解析 Webhook 数据
   */
  parseWebhookData(body: string): KofiWebhookData {
    try {
      return JSON.parse(body);
    } catch (error) {
      throw new Error('Invalid webhook data format');
    }
  }
  
  /**
   * 创建 Ko-fi 支付链接
   * 注意：Ko-fi API 有限制，这里使用标准 Ko-fi 按钮方式
   */
  createPaymentLink(params: CreatePaymentParams): string {
    const { amount, description, tier = 'BASIC' } = params;
    
    // Ko-fi 标准支付链接格式
    const baseUrl = `https://ko-fi.com/${this.username}`;
    
    // 添加自定义参数
    const queryParams = new URLSearchParams();
    
    if (amount) {
      queryParams.set('amount', amount.toString());
    }
    
    if (description) {
      queryParams.set('description', description);
    }
    
    // 添加自定义数据用于跟踪
    const customData = {
      tier,
      userId: params.userId,
      timestamp: Date.now()
    };
    
    queryParams.set('custom', JSON.stringify(customData));
    
    // 重定向URL
    if (params.redirectUrl) {
      queryParams.set('redirect', params.redirectUrl);
    }
    
    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
  
  /**
   * 获取支付项目配置
   */
  getPaymentItems() {
    return {
      BASIC: {
        name: '单次占卜',
        description: '解锁一次深度AI占卜解读',
        amount: 5,
        currency: 'USD'
      },
      MONTHLY: {
        name: '月度会员',
        description: '无限次占卜 + 优先解读',
        amount: 15,
        currency: 'USD'
      },
      QUARTERLY: {
        name: '季度会员',
        description: '3个月无限占卜 + 专属功能',
        amount: 40,
        currency: 'USD' // 40 USD for 3 months (save $5)
      },
      ANNUAL: {
        name: '年度会员',
        description: '全年无限占卜 + 所有高级功能',
        amount: 120,
        currency: 'USD' // 120 USD for 12 months (save $60)
      }
    };
  }
  
  /**
   * 根据层级获取支付项目
   */
  getPaymentItem(tier: string) {
    const items = this.getPaymentItems();
    return items[tier as keyof typeof items] || items.BASIC;
  }
}