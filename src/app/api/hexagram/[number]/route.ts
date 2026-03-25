import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;
  const num = parseInt(number, 10);

  if (isNaN(num) || num < 1 || num > 64) {
    return NextResponse.json({ error: "Invalid hexagram number" }, { status: 400 });
  }

  const hexagram = await prisma.hexagram.findUnique({
    where: { number: num },
  });

  if (!hexagram) {
    return NextResponse.json({ error: "Hexagram not found" }, { status: 404 });
  }

  return NextResponse.json(hexagram);
}
