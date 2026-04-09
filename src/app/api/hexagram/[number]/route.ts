import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHexagramFullData } from "@/lib/hexagram-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;
  const num = parseInt(number, 10);

  if (isNaN(num) || num < 1 || num > 64) {
    return NextResponse.json({ error: "Invalid hexagram number" }, { status: 400 });
  }

  try {
    // Try DB first
    const hexagram = await prisma.hexagram.findUnique({
      where: { number: num },
    });

    if (hexagram && hexagram.judgmentZh) {
      return NextResponse.json(hexagram);
    }
  } catch {
    // DB unavailable — fall through to seed data
  }

  // Fallback: load from seed JSON files
  const seedData = getHexagramFullData(num);
  if (seedData) {
    return NextResponse.json(seedData);
  }

  return NextResponse.json({ error: "Hexagram not found" }, { status: 404 });
}
