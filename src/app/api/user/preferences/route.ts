
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
        language: "zh",
        theme: "system",
        aiDepth: "simple",
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
    const { language, theme, aiDepth, notifications } = body;

    const data: Record<string, unknown> = {};
    if (language !== undefined) data.language = language;
    if (theme !== undefined) data.theme = theme;
    if (aiDepth !== undefined) data.aiDepth = aiDepth;
    if (notifications !== undefined) data.notifications = notifications;

    const preferences = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        userId: session.user.id,
        language: language || "zh",
        theme: theme || "system",
        aiDepth: aiDepth || "simple",
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
