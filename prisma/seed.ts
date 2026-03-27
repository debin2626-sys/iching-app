import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaNeon(pool as any);
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
  lines: unknown[];
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
