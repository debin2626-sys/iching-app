import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface AnonymousMigrationRequest {
  anonymousSessionId: string;
}

// POST: 迁移匿名会话的所有记录到当前登录用户
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body: AnonymousMigrationRequest = await request.json();
    const { anonymousSessionId } = body;

    if (!anonymousSessionId) {
      return NextResponse.json({ error: "缺少匿名会话ID" }, { status: 400 });
    }

    // 查找该匿名会话的所有记录
    const anonymousDivinations = await prisma.divination.findMany({
      where: {
        anonymousSessionId,
        userId: null, // 只迁移未关联用户的记录
      },
      include: {
        hexagram: true,
        changedHexagram: true,
      },
    });

    if (anonymousDivinations.length === 0) {
      return NextResponse.json({ 
        success: true, 
        migrated: 0,
        message: "没有找到需要迁移的匿名记录" 
      });
    }

    let migratedCount = 0;
    const errors: string[] = [];

    // 批量更新记录，关联到当前用户
    for (const div of anonymousDivinations) {
      try {
        // 检查是否已存在相同记录（避免重复）
        const existing = await prisma.divination.findFirst({
          where: {
            userId: session.user.id,
            hexagramId: div.hexagramId,
            coinResults: {
              equals: div.coinResults as any,
            },
            createdAt: {
              gte: new Date(div.createdAt.getTime() - 60000), // 1分钟误差范围
              lte: new Date(div.createdAt.getTime() + 60000),
            },
          },
        });

        if (existing) {
          // 记录已存在，删除匿名副本
          await prisma.divination.delete({
            where: { id: div.id },
          });
          continue;
        }

        // 更新记录，关联到用户并清除匿名会话ID
        await prisma.divination.update({
          where: { id: div.id },
          data: {
            userId: session.user.id,
            anonymousSessionId: null, // 清除匿名会话ID
          },
        });

        migratedCount++;
      } catch (error) {
        errors.push(`记录 ${div.id} 迁移失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    return NextResponse.json({
      success: true,
      migrated: migratedCount,
      total: anonymousDivinations.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `成功迁移 ${migratedCount} 条记录到您的账户`,
    });
  } catch (error) {
    console.error("迁移匿名会话记录失败:", error);
    return NextResponse.json(
      { error: "迁移失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}