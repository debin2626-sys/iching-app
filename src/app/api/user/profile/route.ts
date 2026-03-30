
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitGeneral } from "@/lib/rate-limit";
import { updateProfileSchema, validateBody } from "@/lib/validations";

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
    // Rate limit
    const limited = rateLimitGeneral(request);
    if (limited) return limited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();

    // Input validation
    const validation = validateBody(updateProfileSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name } = validation.data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新用户资料失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
