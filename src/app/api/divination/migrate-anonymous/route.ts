import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface AnonymousDivinationRequest {
  userId: string;
  divinations: Array<{
    id: string;
    question: string | null;
    coinResults: number[];
    hexagramId: number;
    changedHexagramId: number | null;
    changingLines: number[];
    aiInterpretation: string | null;
    createdAt: string;
    hexagram: {
      number: number;
      nameZh: string;
      nameEn: string;
      symbol: string;
    };
    changedHexagram?: {
      number: number;
      nameZh: string;
      nameEn: string;
      symbol: string;
    } | null;
  }>;
}

// POST: 迁移匿名占卜记录到用户账户
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body: AnonymousDivinationRequest = await request.json();
    const { userId, divinations } = body;

    // 验证用户ID匹配
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "用户ID不匹配" }, { status: 403 });
    }

    if (!divinations || !Array.isArray(divinations) || divinations.length === 0) {
      return NextResponse.json({ success: true, migrated: 0 });
    }

    let migratedCount = 0;
    const errors: string[] = [];

    // 批量迁移记录
    for (const div of divinations) {
      try {
        // 检查是否已存在相同记录（基于时间戳和内容）
        const existing = await prisma.divination.findFirst({
          where: {
            userId,
            hexagramId: div.hexagramId,
            coinResults: {
              equals: div.coinResults as Prisma.InputJsonValue,
            },
            createdAt: {
              gte: new Date(new Date(div.createdAt).getTime() - 60000), // 1分钟误差范围
              lte: new Date(new Date(div.createdAt).getTime() + 60000),
            },
          },
        });

        if (existing) {
          // 记录已存在，跳过
          continue;
        }

        // 创建新记录
        await prisma.divination.create({
          data: {
            userId,
            question: div.question || null,
            coinResults: div.coinResults,
            hexagramId: div.hexagramId,
            changedHexagramId: div.changedHexagramId || null,
            changingLines: div.changingLines || [],
            aiInterpretation: div.aiInterpretation || null,
            createdAt: new Date(div.createdAt),
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
      total: divinations.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("迁移匿名记录失败:", error);
    return NextResponse.json(
      { error: "迁移失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}