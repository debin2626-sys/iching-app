import { prisma } from '@/lib/prisma';
import { SubscriptionTier } from '@prisma/client';
import { KofiService, type KofiWebhookData } from './kofi';

export class PaymentService {
  private kofiService: KofiService;
  
  constructor() {
    this.kofiService = new KofiService();
  }
  
  /**
   * 创建支付记录
   */
  async createPayment(params: {
    userId?: string;
    provider: 'KOFI' | 'STRIPE' | 'PAYPAL';
    amount: number;
    currency?: string;
    description?: string;
    tier?: 'BASIC' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
    metadata?: Record<string, unknown>;
  }) {
    const { userId, provider, amount, currency = 'USD', description, tier = 'BASIC', metadata } = params;
    
    // 获取支付项目信息
    const paymentItem = this.kofiService.getPaymentItem(tier);
    
    // 创建支付记录
    const payment = await prisma.payment.create({
      data: {
        userId,
        provider,
        amount,
        currency,
        description: description || paymentItem.description,
        status: 'PENDING',
        metadata: {
          ...metadata,
          tier,
          paymentItem
        }
      }
    });
    
    // 如果是订阅类型，创建订阅记录
    if (tier !== 'BASIC') {
      await prisma.subscription.create({
        data: {
          userId: userId!,
          tier,
          status: 'PENDING',
          paymentId: payment.id,
          metadata: {
            paymentId: payment.id,
            tier
          }
        }
      });
    }
    
    return payment;
  }
  
  /**
   * 处理 Ko-fi Webhook
   */
  async handleKofiWebhook(webhookData: KofiWebhookData) {
    const { type, data, email, kofi_username } = webhookData;
    
    console.log(`Processing Ko-fi webhook: ${type}`, { data });
    
    try {
      switch (type) {
        case 'Donation':
          return await this.handleDonation(data, email, kofi_username);
        case 'Subscription':
          return await this.handleSubscription(data, email, kofi_username);
        default:
          console.warn(`Unhandled webhook type: ${type}`);
          return null;
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }
  
  /**
   * 处理捐赠支付
   */
  private async handleDonation(
    data: KofiWebhookData['data'],
    email?: string,
    kofiUsername?: string
  ) {
    const {
      message_id: kofiId,
      amount,
      currency,
      from_name,
      message,
      timestamp,
      is_public,
      url,
      kofi_transaction_id
    } = data;
    
    // 查找用户（通过邮箱）
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email }
      });
    }
    
    // 解析自定义数据
    let customData: Record<string, unknown> = {};
    try {
      if (message) {
        const match = message.match(/custom:\s*(\{.*\})/);
        if (match) {
          customData = JSON.parse(match[1]);
        }
      }
    } catch (error) {
      console.warn('Failed to parse custom data:', error);
    }
    
    // 确定支付层级
    const tier = (customData?.tier as string) || 'BASIC';
    const userId = (customData?.userId as string) || user?.id;
    
    // 创建或更新支付记录
    const payment = await prisma.payment.upsert({
      where: { providerId: kofiId },
      update: {
        status: 'COMPLETED',
        completedAt: new Date(timestamp),
        metadata: {
          ...((await prisma.payment.findUnique({ where: { providerId: kofiId } }))?.metadata as Record<string, unknown> ?? {}),
          rawWebhookData: data,
          fromName: from_name,
          isPublic: is_public,
          url,
          kofiTransactionId: kofi_transaction_id
        }
      },
      create: {
        provider: 'KOFI',
        providerId: kofiId,
        userId,
        amount: parseFloat(amount),
        currency,
        description: message || `Donation from ${from_name}`,
        status: 'COMPLETED',
        kofiUsername,
        completedAt: new Date(timestamp),
        metadata: {
          tier,
          fromName: from_name,
          isPublic: is_public,
          url,
          kofiTransactionId: kofi_transaction_id,
          rawWebhookData: data,
          customData
        }
      }
    });
    
    // 更新用户总捐赠额
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalDonated: {
            increment: parseFloat(amount)
          }
        }
      });
    }
    
    // 如果是订阅支付，更新订阅状态
    if (tier !== 'BASIC' && userId) {
      await this.updateSubscriptionStatus(userId, tier, payment.id);
    }
    
    return payment;
  }
  
  /**
   * 处理订阅支付
   */
  private async handleSubscription(
    data: KofiWebhookData['data'],
    email?: string,
    kofiUsername?: string
  ) {
    const {
      subscription_id: subscriptionId,
      amount,
      currency,
      from_name,
      timestamp,
      is_subscription_payment: isSubscriptionPayment,
      is_first_subscription_payment: isFirstSubscriptionPayment
    } = data;
    
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }
    
    // 查找用户
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email }
      });
    }
    
    // 确定订阅层级（根据金额）
    const amountNum = parseFloat(amount);
    let tier: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' = 'MONTHLY';
    
    if (amountNum >= 40 && amountNum < 120) {
      tier = 'QUARTERLY';
    } else if (amountNum >= 120) {
      tier = 'ANNUAL';
    }
    
    // 创建支付记录
    const payment = await prisma.payment.create({
      data: {
        provider: 'KOFI',
        providerId: `sub_${subscriptionId}_${Date.now()}`,
        userId: user?.id,
        amount: amountNum,
        currency,
        description: `Subscription payment (${tier}) from ${from_name}`,
        status: 'COMPLETED',
        kofiUsername,
        completedAt: new Date(timestamp),
        metadata: {
          subscriptionId,
          tier,
          fromName: from_name,
          isSubscriptionPayment,
          isFirstSubscriptionPayment,
          rawWebhookData: data
        }
      }
    });
    
    // 更新或创建订阅记录
    if (user) {
      const startDate = new Date(timestamp);
      const endDate = new Date(startDate);
      
      // 根据层级设置结束日期
      switch (tier) {
        case 'MONTHLY':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'QUARTERLY':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'ANNUAL':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
      
      const nextBillingDate = new Date(endDate);
      
      await prisma.subscription.upsert({
        where: { kofiSubscriptionId: subscriptionId },
        update: {
          status: 'ACTIVE',
          endDate,
          nextBillingDate,
          paymentId: payment.id,
          updatedAt: new Date()
        },
        create: {
          userId: user.id,
          tier,
          status: 'ACTIVE',
          kofiSubscriptionId: subscriptionId,
          kofiUsername,
          paymentId: payment.id,
          startDate,
          endDate,
          nextBillingDate,
          metadata: {
            subscriptionId,
            tier,
            isFirstPayment: isFirstSubscriptionPayment
          }
        }
      });
      
      // 更新用户总捐赠额
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalDonated: {
            increment: amountNum
          }
        }
      });
    }
    
    return payment;
  }
  
  /**
   * 更新订阅状态
   */
  private async updateSubscriptionStatus(
    userId: string,
    tier: string,
    paymentId: string
  ) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    // 根据层级设置结束日期
    switch (tier) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'ANNUAL':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        return; // BASIC 层级不需要订阅
    }
    
    await prisma.subscription.upsert({
      where: { userId_tier: { userId, tier: tier as SubscriptionTier } },
      update: {
        status: 'ACTIVE',
        endDate,
        nextBillingDate: endDate,
        paymentId,
        updatedAt: new Date()
      },
      create: {
        userId,
        tier: tier as SubscriptionTier,
        status: 'ACTIVE',
        paymentId,
        startDate,
        endDate,
        nextBillingDate: endDate,
        metadata: {
          activatedByPayment: paymentId
        }
      }
    });
  }
  
  /**
   * 获取用户的活跃订阅
   */
  async getUserActiveSubscription(userId: string) {
    return await prisma.subscription.findFirst({
      where: {
        userId,
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
  }
  
  /**
   * 检查用户是否有特定层级的有效订阅
   */
  async hasValidSubscription(userId: string, tier?: string): Promise<boolean> {
    const where: Record<string, unknown> = {
      userId,
      status: 'ACTIVE',
      endDate: {
        gt: new Date()
      }
    };
    
    if (tier) {
      where.tier = tier;
    }
    
    const subscription = await prisma.subscription.findFirst({
      where
    });
    
    return !!subscription;
  }
  
  /**
   * 获取用户支付历史
   */
  async getUserPaymentHistory(userId: string, limit = 10) {
    return await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        subscription: true
      }
    });
  }
}