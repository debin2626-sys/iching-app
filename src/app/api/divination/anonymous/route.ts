import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface AnonymousDivinationRequest {
  id: string;
  question: string | null;
  coinResults: number[];
  hexagramId: number;
  changedHexagramId: number | null;
  changingLines: number[];
  aiInterpretation: string | null;
  createdAt: string;
  anonymousSessionId: string;
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
}

// POST: 保存匿名占卜记录到数据库
export async function POST(request: NextRequest) {
  try {
    const body: AnonymousDivinationRequest = await request.json();
    const {
      question,
      coinResults,
      hexagramId,
      changedHexagramId,
      changingLines,
      aiInterpretation,
      createdAt,
      anonymousSessionId,
    } = body;

    if (!anonymousSessionId) {
      return NextResponse.json({ error: "缺少匿名会话ID" }, { status: 400 });
    }

    // 检查是否已存在相同记录（避免重复）
    const existing = await prisma.divination.findFirst({
      where: {
        anonymousSessionId,
        hexagramId,
        coinResults: coinResults as any,
        createdAt: {
          gte: new Date(new Date(createdAt).getTime() - 60000), // 1分钟误差范围
          lte: new Date(new Date(createdAt).getTime() + 60000),
        },
      },
    });

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: "记录已存在",
        id: existing.id 
      });
    }

    // 创建匿名记录
    const divination = await prisma.divination.create({
      data: {
        anonymousSessionId,
        question: question || null,
        coinResults: coinResults,
        hexagramId,
        changedHexagramId: changedHexagramId || null,
        changingLines: changingLines || [],
        aiInterpretation: aiInterpretation || null,
        createdAt: new Date(createdAt),
      },
    });

    return NextResponse.json({
      success: true,
      id: divination.id,
      message: "匿名记录保存成功",
    });
  } catch (error) {
    console.error("保存匿名记录失败:", error);
    return NextResponse.json(
      { error: "保存失败", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}