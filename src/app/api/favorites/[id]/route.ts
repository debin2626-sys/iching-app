
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitGeneral } from "@/lib/rate-limit";
import { updateFavoriteSchema, validateBody } from "@/lib/validations";

// GET: 获取单个收藏详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { id } = await params;

    const favorite = await prisma.favorite.findFirst({
      where: { id, userId: session.user.id },
      include: {
        hexagram: true,
      },
    });

    if (!favorite) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("获取收藏详情失败:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PATCH: 更新收藏（笔记、标签）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit
    const limited = rateLimitGeneral(request);
    if (limited) return limited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Input validation
    const validation = validateBody(updateFavoriteSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { note, tags } = validation.data;

    // 确认收藏属于当前用户
    const existing = await prisma.favorite.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (note !== undefined) data.notes = note;
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags.join(",") : tags;

    const favorite = await prisma.favorite.update({
      where: { id },
      data,
      include: {
        hexagram: { select: { number: true, nameZh: true, nameEn: true, symbol: true } },
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("更新收藏失败:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE: 删除收藏
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { id } = await params;

    // 确认收藏属于当前用户
    const existing = await prisma.favorite.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    await prisma.favorite.delete({ where: { id } });

    return NextResponse.json({ message: "Unfavorited" });
  } catch (error) {
    console.error("删除收藏失败:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
