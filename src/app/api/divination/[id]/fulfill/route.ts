import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fulfillDivinationSchema, validateBody } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = validateBody(fulfillDivinationSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const divination = await prisma.divination.findUnique({ where: { id } });
    if (!divination) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    if (divination.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.divination.update({
      where: { id },
      data: {
        fulfilled: validation.data.fulfilled,
        fulfilledAt: validation.data.fulfilled ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("标记还愿失败:", error);
    return NextResponse.json({ error: "Failed to update fulfillment" }, { status: 500 });
  }
}
