import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SeedHexagram {
  number: number;
  nameZh: string;
  nameEn: string;
  symbol: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgmentZh: string;
  judgmentEn: string;
  imageZh: string;
  imageEn: string;
  interpretationZh: string;
  interpretationEn: string;
  overviewZh?: string;
  overviewEn?: string;
  judgmentDetailZh?: string;
  judgmentDetailEn?: string;
  imageDetailZh?: string;
  imageDetailEn?: string;
  modernApplicationZh?: string | Record<string, string>;
  modernApplicationEn?: string | Record<string, string>;
  historicalStoryZh?: string;
  historicalStoryEn?: string;
  relatedHexagramsNote?: string;
  references?: string[];
  lines: unknown[];
}

// Helper: if value is an object, stringify it; if string, keep as-is; otherwise null
function toStringOrNull(val: unknown): string | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "string") return val;
  return JSON.stringify(val, null, 2);
}

async function main() {
  const seedDir = path.join(__dirname, "seed");
  const files = fs.readdirSync(seedDir).filter((f) => f.startsWith("hexagrams-") && f.endsWith(".json"));

  let total = 0;

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    const data: SeedHexagram[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const hex of data) {
      await prisma.hexagram.upsert({
        where: { number: hex.number },
        update: {
          nameZh: hex.nameZh,
          nameEn: hex.nameEn,
          symbol: hex.symbol,
          upperTrigram: hex.upperTrigram,
          lowerTrigram: hex.lowerTrigram,
          judgmentZh: hex.judgmentZh,
          judgmentEn: hex.judgmentEn,
          imageZh: hex.imageZh,
          imageEn: hex.imageEn,
          interpretationZh: hex.interpretationZh,
          interpretationEn: hex.interpretationEn,
          overviewZh: toStringOrNull(hex.overviewZh),
          overviewEn: toStringOrNull(hex.overviewEn),
          judgmentDetailZh: toStringOrNull(hex.judgmentDetailZh),
          judgmentDetailEn: toStringOrNull(hex.judgmentDetailEn),
          imageDetailZh: toStringOrNull(hex.imageDetailZh),
          imageDetailEn: toStringOrNull(hex.imageDetailEn),
          modernApplicationZh: toStringOrNull(hex.modernApplicationZh),
          modernApplicationEn: toStringOrNull(hex.modernApplicationEn),
          historicalStoryZh: toStringOrNull(hex.historicalStoryZh),
          historicalStoryEn: toStringOrNull(hex.historicalStoryEn),
          relatedHexagramsNote: toStringOrNull(hex.relatedHexagramsNote),
          references: (hex.references as unknown as import("@prisma/client").Prisma.InputJsonValue) ?? undefined,
          lines: hex.lines as unknown as import("@prisma/client").Prisma.InputJsonValue,
        },
        create: {
          number: hex.number,
          nameZh: hex.nameZh,
          nameEn: hex.nameEn,
          symbol: hex.symbol,
          upperTrigram: hex.upperTrigram,
          lowerTrigram: hex.lowerTrigram,
          judgmentZh: hex.judgmentZh,
          judgmentEn: hex.judgmentEn,
          imageZh: hex.imageZh,
          imageEn: hex.imageEn,
          interpretationZh: hex.interpretationZh,
          interpretationEn: hex.interpretationEn,
          overviewZh: toStringOrNull(hex.overviewZh),
          overviewEn: toStringOrNull(hex.overviewEn),
          judgmentDetailZh: toStringOrNull(hex.judgmentDetailZh),
          judgmentDetailEn: toStringOrNull(hex.judgmentDetailEn),
          imageDetailZh: toStringOrNull(hex.imageDetailZh),
          imageDetailEn: toStringOrNull(hex.imageDetailEn),
          modernApplicationZh: toStringOrNull(hex.modernApplicationZh),
          modernApplicationEn: toStringOrNull(hex.modernApplicationEn),
          historicalStoryZh: toStringOrNull(hex.historicalStoryZh),
          historicalStoryEn: toStringOrNull(hex.historicalStoryEn),
          relatedHexagramsNote: toStringOrNull(hex.relatedHexagramsNote),
          references: (hex.references as unknown as import("@prisma/client").Prisma.InputJsonValue) ?? undefined,
          lines: hex.lines as unknown as import("@prisma/client").Prisma.InputJsonValue,
        },
      });
      total++;
    }

    console.log(`✅ Loaded ${data.length} hexagrams from ${file}`);
  }

  console.log(`\n🎉 Seeded ${total} hexagrams total.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
