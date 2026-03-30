
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitGeneral } from "@/lib/rate-limit";
import { createFavoriteSchema, validateBody } from "@/lib/validations";

// GET: 获取用户收藏列表
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

    const where = { userId: session.user.id };

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          hexagram: { select: { id: true, number: true, nameZh: true, nameEn: true, symbol: true } },
        },
      }),
      prisma.favorite.count({ where }),
    ]);

    return NextResponse.json({
      favorites,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// POST: 添加收藏
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const limited = rateLimitGeneral(request);
    if (limited) return limited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();

    // Input validation
    const validation = validateBody(createFavoriteSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { hexagramId, notes, tags } = validation.data;

    // 检查是否已收藏（联合唯一约束）
    const existing = await prisma.favorite.findUnique({
      where: { userId_hexagramId: { userId: session.user.id, hexagramId } },
    });

    if (existing) {
      return NextResponse.json({ error: "已收藏该卦象" }, { status: 409 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        hexagramId,
        notes: notes || null,
        tags: tags || null,
      },
      include: {
        hexagram: { select: { id: true, number: true, nameZh: true, nameEn: true, symbol: true } },
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("添加收藏失败:", error);
    return NextResponse.json({ error: "添加失败" }, { status: 500 });
  }
}
