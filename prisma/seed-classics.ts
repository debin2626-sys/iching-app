import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";

// ─── DB setup (use @prisma/adapter-pg for Node.js compatibility) ───

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

// ─── Types ───

interface ClassicEntry {
  source: string;
  hexagram_number: number;
  hexagram_name: string;
  type: string;
  content_original: string;
  content_modern: string;
  category: string;
}

// ─── Embedding (reuse e5-small from rag.ts) ───

let extractorPromise: Promise<any> | null = null;

function getExtractor(): Promise<any> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline } = await import("@xenova/transformers" as any);
      return pipeline("feature-extraction", "Xenova/multilingual-e5-small");
    })();
  }
  return extractorPromise;
}

async function generatePassageEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  // e5 models: "passage: " prefix for documents
  const output = await extractor(`passage: ${text}`, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data) as number[];
}

// ─── Main ───

async function main() {
  const classicsDir = path.join(__dirname, "seed", "classics");

  if (!fs.existsSync(classicsDir)) {
    console.error("❌ classics/ directory not found:", classicsDir);
    process.exit(1);
  }

  const files = fs
    .readdirSync(classicsDir)
    .filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.log("⚠️  No JSON files found in classics/");
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(classicsDir, file);
    const entries: ClassicEntry[] = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    console.log(`📖 Processing ${file} (${entries.length} entries)...`);

    for (const entry of entries) {
      // Build a content string for embedding and storage
      const content = `${entry.source}\n${entry.content_original}\n${entry.content_modern}`;

      // Check if already exists (incremental: match by source + content_original)
      const existing: { id: string }[] = await prisma.$queryRawUnsafe(
        `SELECT id FROM knowledge_chunk
         WHERE metadata->>'source' = $1
           AND metadata->>'content_original' = $2
         LIMIT 1`,
        entry.source,
        entry.content_original
      );

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      // Generate embedding
      const embedding = await generatePassageEmbedding(content);
      const vecStr = `[${embedding.join(",")}]`;

      // Insert into knowledge_chunk
      await prisma.$executeRawUnsafe(
        `INSERT INTO knowledge_chunk (id, "hexagramId", level, title, content, embedding, metadata, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5::vector, $6::jsonb, NOW(), NOW())`,
        entry.hexagram_number,
        "paragraph",
        `${entry.source}`,
        content,
        vecStr,
        JSON.stringify({
          source: entry.source,
          hexagram_name: entry.hexagram_name,
          type: entry.type,
          category: entry.category,
          content_original: entry.content_original,
          content_modern: entry.content_modern,
        })
      );

      created++;
    }

    console.log(`  ✅ ${file} done`);
  }

  console.log(
    `\n🎉 Classics seed complete: ${created} created, ${skipped} skipped (already exist).`
  );
}

main()
  .catch((e) => {
    console.error("Seed classics failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
