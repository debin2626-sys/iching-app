
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;
  const num = parseInt(number, 10);

  if (isNaN(num) || num < 1 || num > 64) {
    return NextResponse.json({ error: "Invalid hexagram number" }, { status: 400 });
  }

  let hexagram = await prisma.hexagram.findUnique({
    where: { number: num },
  });

  // Fallback: If not found or incomplete, try to load from seed
  if (!hexagram || !hexagram.judgmentZh) {
    const seedDir = path.join(process.cwd(), "prisma/seed");
    const files = fs.readdirSync(seedDir).filter((f) => f.startsWith("hexagrams-") && f.endsWith(".json"));
    
    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(seedDir, file), "utf-8"));
        const found = data.find((h: any) => h.number === num);
        if (found) {
            hexagram = { ...hexagram, ...found, id: hexagram?.id || -1 };
            break;
        }
    }
  }

  if (!hexagram || !hexagram.judgmentZh) {
    return NextResponse.json({ error: "Hexagram not found" }, { status: 404 });
  }

  return NextResponse.json(hexagram);
}
