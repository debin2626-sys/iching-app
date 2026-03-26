import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 获取用户资料
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            divinations: true,
            favorites: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("获取用户资料失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// PATCH: 更新用户资料
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { name, image } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (image !== undefined) data.image = image;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "没有需要更新的字段" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新用户资料失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
