import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 获取用户偏好
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const preferences = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    });

    // 返回默认偏好（如果用户尚未设置）
    if (!preferences) {
      return NextResponse.json({
        locale: "zh",
        theme: "system",
        interpretDepth: "simple",
        notifications: true,
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("获取用户偏好失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// PUT: 更新用户偏好
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { locale, theme, interpretDepth, notifications } = body;

    const data: Record<string, unknown> = {};
    if (locale !== undefined) data.locale = locale;
    if (theme !== undefined) data.theme = theme;
    if (interpretDepth !== undefined) data.interpretDepth = interpretDepth;
    if (notifications !== undefined) data.notifications = notifications;

    const preferences = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        userId: session.user.id,
        locale: locale || "zh",
        theme: theme || "system",
        interpretDepth: interpretDepth || "simple",
        notifications: notifications ?? true,
        ...data,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("更新用户偏好失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
