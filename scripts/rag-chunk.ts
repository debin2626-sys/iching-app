/**
 * RAG 知识切片脚本
 * 读取 64 卦 JSON 数据，按三级策略切片写入 knowledge_chunk 表
 * 
 * 切片策略：
 *   - hexagram 级：卦名 + 卦辞 + 象辞 + 释义（1条/卦）
 *   - yao 级：每爻的爻辞 + 释义（6条/卦）
 *   - paragraph 级：卦辞、象辞、释义各自独立（3条/卦）
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface Line {
  position: number;
  textZh: string;
  textEn: string;
  interpretationZh: string;
  interpretationEn: string;
}

interface Hexagram {
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
  lines: Line[];
}

interface Chunk {
  hexagramId: number;
  level: 'hexagram' | 'yao' | 'paragraph';
  title: string;
  content: string;
  metadata: Record<string, unknown>;
}

function buildChunks(hex: Hexagram): Chunk[] {
  const chunks: Chunk[] = [];

  // 1. 卦级切片 — 整卦概览
  chunks.push({
    hexagramId: hex.number,
    level: 'hexagram',
    title: `第${hex.number}卦 ${hex.nameZh}（${hex.nameEn}）`,
    content: [
      `【${hex.nameZh}卦】第${hex.number}卦`,
      `卦象：${hex.symbol}`,
      `上卦：${hex.upperTrigram}，下卦：${hex.lowerTrigram}`,
      `卦辞：${hex.judgmentZh}`,
      `象辞：${hex.imageZh}`,
      `释义：${hex.interpretationZh}`,
    ].join('\n'),
    metadata: {
      nameZh: hex.nameZh,
      nameEn: hex.nameEn,
      symbol: hex.symbol,
      upperTrigram: hex.upperTrigram,
      lowerTrigram: hex.lowerTrigram,
    },
  });

  // 2. 爻级切片 — 每爻独立
  for (const line of hex.lines) {
    chunks.push({
      hexagramId: hex.number,
      level: 'yao',
      title: `${hex.nameZh}卦 第${line.position}爻`,
      content: [
        `【${hex.nameZh}卦 第${line.position}爻】`,
        `爻辞：${line.textZh}`,
        `释义：${line.interpretationZh}`,
      ].join('\n'),
      metadata: {
        nameZh: hex.nameZh,
        position: line.position,
        textEn: line.textEn,
        interpretationEn: line.interpretationEn,
      },
    });
  }

  // 3. 段落级切片 — 卦辞、象辞、释义分别独立
  const sections: { key: string; label: string; zh: string; en: string }[] = [
    { key: 'judgment', label: '卦辞', zh: hex.judgmentZh, en: hex.judgmentEn },
    { key: 'image', label: '象辞', zh: hex.imageZh, en: hex.imageEn },
    { key: 'interpretation', label: '释义', zh: hex.interpretationZh, en: hex.interpretationEn },
  ];

  for (const sec of sections) {
    chunks.push({
      hexagramId: hex.number,
      level: 'paragraph',
      title: `${hex.nameZh}卦 ${sec.label}`,
      content: `【${hex.nameZh}卦 - ${sec.label}】\n${sec.zh}`,
      metadata: {
        nameZh: hex.nameZh,
        section: sec.key,
        contentEn: sec.en,
      },
    });
  }

  return chunks;
}

async function main() {
  console.log('🚀 RAG 知识切片开始...\n');

  // 先清理旧数据，避免重复
  const deleted = await prisma.$executeRawUnsafe(
    `DELETE FROM knowledge_chunk`
  );
  console.log(`🗑️  已清理旧数据 (${deleted} 条)\n`);

  const seedDir = path.join(__dirname, '../prisma/seed');
  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.startsWith('hexagrams-') && f.endsWith('.json'))
    .sort();

  let totalChunks = 0;
  let hexagramCount = 0;

  for (const file of files) {
    const hexagrams: Hexagram[] = JSON.parse(
      fs.readFileSync(path.join(seedDir, file), 'utf-8')
    );
    console.log(`📖 ${file} — ${hexagrams.length} 卦`);

    for (const hex of hexagrams) {
      const chunks = buildChunks(hex);

      // 批量插入（无 embedding，后续脚本补）
      for (const chunk of chunks) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO knowledge_chunk (id, "hexagramId", level, title, content, metadata, "createdAt", "updatedAt")
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5::jsonb, NOW(), NOW())`,
          chunk.hexagramId,
          chunk.level,
          chunk.title,
          chunk.content,
          JSON.stringify(chunk.metadata)
        );
      }

      totalChunks += chunks.length;
      hexagramCount++;
      process.stdout.write(`  ✅ 第${hex.number}卦 ${hex.nameZh} → ${chunks.length} 条切片\n`);
    }
  }

  console.log(`\n📊 统计：`);
  console.log(`   卦数：${hexagramCount}`);
  console.log(`   总切片：${totalChunks}`);

  // 验证
  const counts: { level: string; count: bigint }[] = await prisma.$queryRawUnsafe(
    `SELECT level, count(*)::bigint as count FROM knowledge_chunk GROUP BY level ORDER BY level`
  );
  for (const row of counts) {
    console.log(`   ${row.level}: ${row.count}`);
  }

  console.log('\n✨ 切片完成！');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
