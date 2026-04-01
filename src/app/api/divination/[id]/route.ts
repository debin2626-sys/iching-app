
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const divination = await prisma.divination.findUnique({
      where: { id },
      include: {
        hexagram: true,
        changedHexagram: true,
      },
    });

    if (!divination) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(divination);
  } catch (error) {
    console.error("获取占卜详情失败:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
