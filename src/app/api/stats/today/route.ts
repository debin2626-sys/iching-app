import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 获取今天的开始时间 (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 获取今天的结束时间 (23:59:59.999)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 统计今日占卜次数
    const todayCount = await prisma.divination.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });
    
    // 获取今日的精选评价（评分4-5星，按时间倒序）
    const todayReviews = await prisma.divination.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        accuracyScore: {
          gte: 4 // 4-5星的评价
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5 // 最多取5条
    });
    
    // 格式化评价数据
    const formattedReviews = todayReviews.map(review => ({
      id: review.id,
      userName: review.user?.name || 'Anonymous',
      userInitial: (review.user?.name?.[0] || 'A').toUpperCase(),
      content: review.reviewNote || '',
      rating: review.accuracyScore || 5,
      time: review.createdAt.toISOString(),
      locale: review.locale || 'zh'
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        todayCount,
        reviews: formattedReviews
      }
    });
    
  } catch (error) {
    console.error('Error fetching today stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch today statistics' 
      },
      { status: 500 }
    );
  }
}