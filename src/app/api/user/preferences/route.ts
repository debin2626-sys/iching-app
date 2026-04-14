
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitGeneral } from "@/lib/rate-limit";
import { updatePreferencesSchema, validateBody } from "@/lib/validations";

// GET: 获取用户偏好
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
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
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PUT: 更新用户偏好
export async function PUT(request: NextRequest) {
  try {
    // Rate limit
    const limited = await rateLimitGeneral(request);
    if (limited) return limited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const body = await request.json();

    // Input validation
    const validation = validateBody(updatePreferencesSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { language, theme, aiDepth, notifications } = validation.data;

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
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
