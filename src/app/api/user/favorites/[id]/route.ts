import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/user/favorites/[id]
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
