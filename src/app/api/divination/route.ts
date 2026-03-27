export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: 保存占卜记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, coinResults, hexagramId, changedHexagramId, changingLines } = body;

    if (!coinResults || !hexagramId) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    // 尝试获取当前用户（未登录则为 null）
    let userId: string | null = null;
    try {
      const session = await auth();
      userId = session?.user?.id ?? null;
    } catch {
      // 未登录，userId 保持 null
    }

    const divination = await prisma.divination.create({
      data: {
        userId,
        question: question || null,
        coinResults,
        hexagramId: Number(hexagramId),
        changedHexagramId: changedHexagramId ? Number(changedHexagramId) : null,
        changingLines: changingLines || [],
      },
      include: {
        hexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
      },
    });

    return NextResponse.json(divination, { status: 201 });
  } catch (error) {
    console.error("保存占卜记录失败:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}

// GET: 获取当前用户的占卜历史列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const [divinations, total] = await Promise.all([
      prisma.divination.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          hexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
          changedHexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
        },
      }),
      prisma.divination.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      divinations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("获取占卜历史失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
