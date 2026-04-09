import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/subscription — returns the user's active subscription (if any)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ subscription: null });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        endDate: { gt: new Date() },
      },
      orderBy: { endDate: "desc" },
      select: {
        id: true,
        tier: true,
        status: true,
        startDate: true,
        endDate: true,
        nextBillingDate: true,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("获取订阅状态失败:", error);
    return NextResponse.json({ subscription: null });
  }
}
