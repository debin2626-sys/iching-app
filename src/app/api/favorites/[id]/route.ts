
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 获取单个收藏详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    const favorite = await prisma.favorite.findFirst({
      where: { id, userId: session.user.id },
      include: {
        hexagram: true,
      },
    });

    if (!favorite) {
      return NextResponse.json({ error: "收藏不存在" }, { status: 404 });
    }

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("获取收藏详情失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// PATCH: 更新收藏（笔记、标签）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { note, tags } = body;

    // 确认收藏属于当前用户
    const existing = await prisma.favorite.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "收藏不存在" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (note !== undefined) data.notes = note;
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags : [];

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
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
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
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    // 确认收藏属于当前用户
    const existing = await prisma.favorite.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "收藏不存在" }, { status: 404 });
    }

    await prisma.favorite.delete({ where: { id } });

    return NextResponse.json({ message: "已取消收藏" });
  } catch (error) {
    console.error("删除收藏失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
