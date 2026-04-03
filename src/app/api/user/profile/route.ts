import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitGeneral } from "@/lib/rate-limit";
import { updateProfileSchema, validateBody } from "@/lib/validations";

// GET /api/user/profile
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user + counts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { divinations: true, favorites: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Monthly divination count
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCount = await prisma.divination.count({
      where: { userId, createdAt: { gte: monthStart } },
    });

    // Most common scenario (from question field — best effort)
    // We'll just return total + monthly for now; scenario analysis is optional
    return NextResponse.json({
      ...user,
      stats: {
        totalDivinations: user._count.divinations,
        monthlyDivinations: monthlyCount,
        totalFavorites: user._count.favorites,
      },
    });
  } catch (error) {
    console.error("获取用户资料失败:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
  try {
    const limited = rateLimitGeneral(request);
    if (limited) return limited;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateBody(updateProfileSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name } = validation.data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新用户资料失败:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// Keep PATCH for backward compat
export async function PATCH(request: NextRequest) {
  return PUT(request);
}
