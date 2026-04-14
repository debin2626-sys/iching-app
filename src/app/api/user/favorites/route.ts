import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitGeneral } from "@/lib/rate-limit";
import { createFavoriteSchema, validateBody } from "@/lib/validations";

// GET /api/user/favorites
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
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
          hexagram: {
            select: { id: true, number: true, nameZh: true, nameEn: true, symbol: true },
          },
        },
      }),
      prisma.favorite.count({ where }),
    ]);

    return NextResponse.json({
      favorites,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST /api/user/favorites
export async function POST(request: NextRequest) {
  try {
    const limited = await rateLimitGeneral(request);
    if (limited) return limited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateBody(createFavoriteSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { hexagramId, notes, tags } = validation.data;

    const existing = await prisma.favorite.findUnique({
      where: { userId_hexagramId: { userId: session.user.id, hexagramId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already favorited" }, { status: 409 });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: session.user.id, hexagramId, notes: notes || null, tags: tags || null },
      include: {
        hexagram: { select: { id: true, number: true, nameZh: true, nameEn: true, symbol: true } },
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("添加收藏失败:", error);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}
