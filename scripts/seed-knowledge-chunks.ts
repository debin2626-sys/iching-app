import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

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

// 生成 embedding（使用 DeepSeek API）
async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not found');
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-embedding-v3',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// 三级切片函数
async function createChunks(hexagram: Hexagram) {
  const chunks = [];

  // 1. 卦级切片（整卦概览）
  const hexagramContent = `${hexagram.nameZh}卦（第${hexagram.number}卦）
卦象：${hexagram.symbol}
上卦：${hexagram.upperTrigram}，下卦：${hexagram.lowerTrigram}
卦辞：${hexagram.judgmentZh}
象辞：${hexagram.imageZh}
释义：${hexagram.interpretationZh}`;

  const hexagramEmbedding = await generateEmbedding(hexagramContent);
  
  chunks.push({
    hexagramNumber: hexagram.number,
    chunkType: 'hexagram',
    linePosition: null,
    content: hexagramContent,
    contentEn: `${hexagram.nameEn} (Hexagram ${hexagram.number})
Symbol: ${hexagram.symbol}
Upper: ${hexagram.upperTrigram}, Lower: ${hexagram.lowerTrigram}
Judgment: ${hexagram.judgmentEn}
Image: ${hexagram.imageEn}
Interpretation: ${hexagram.interpretationEn}`,
    metadata: {
      section: 'overview',
      keywords: [hexagram.nameZh, hexagram.nameEn, hexagram.upperTrigram, hexagram.lowerTrigram],
    },
    embedding: hexagramEmbedding,
  });

  // 2. 段落级切片（卦辞、象辞、释义分开）
  const sections = [
    { name: 'judgment', contentZh: hexagram.judgmentZh, contentEn: hexagram.judgmentEn },
    { name: 'image', contentZh: hexagram.imageZh, contentEn: hexagram.imageEn },
    { name: 'interpretation', contentZh: hexagram.interpretationZh, contentEn: hexagram.interpretationEn },
  ];

  for (const section of sections) {
    const sectionContent = `${hexagram.nameZh}卦 - ${section.name === 'judgment' ? '卦辞' : section.name === 'image' ? '象辞' : '释义'}：${section.contentZh}`;
    const sectionEmbedding = await generateEmbedding(sectionContent);
    
    chunks.push({
      hexagramNumber: hexagram.number,
      chunkType: 'paragraph',
      linePosition: null,
      content: sectionContent,
      contentEn: `${hexagram.nameEn} - ${section.name}: ${section.contentEn}`,
      metadata: {
        section: section.name,
        keywords: [hexagram.nameZh, section.name],
      },
      embedding: sectionEmbedding,
    });
  }

  // 3. 爻级切片（每一爻单独切片）
  for (const line of hexagram.lines) {
    const lineContent = `${hexagram.nameZh}卦 第${line.position}爻：${line.textZh}
释义：${line.interpretationZh}`;
    
    const lineEmbedding = await generateEmbedding(lineContent);
    
    chunks.push({
      hexagramNumber: hexagram.number,
      chunkType: 'line',
      linePosition: line.position,
      content: lineContent,
      contentEn: `${hexagram.nameEn} Line ${line.position}: ${line.textEn}
Interpretation: ${line.interpretationEn}`,
      metadata: {
        section: 'line',
        linePosition: line.position,
        keywords: [hexagram.nameZh, `第${line.position}爻`],
      },
      embedding: lineEmbedding,
    });
  }

  return chunks;
}

async function main() {
  console.log('🚀 开始生成知识切片...\n');

  // 读取所有卦象 JSON 文件
  const seedDir = path.join(__dirname, '../prisma/seed');
  const files = fs.readdirSync(seedDir).filter(f => f.startsWith('hexagrams-') && f.endsWith('.json'));

  let totalChunks = 0;

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    const hexagrams: Hexagram[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`📖 处理文件: ${file} (${hexagrams.length} 个卦象)`);

    for (const hexagram of hexagrams) {
      console.log(`  ⚡ 切片卦象 ${hexagram.number}: ${hexagram.nameZh}`);
      
      try {
        const chunks = await createChunks(hexagram);
        
        // 批量写入数据库
        for (const chunk of chunks) {
          await prisma.$executeRaw`
            INSERT INTO "KnowledgeChunk" (
              id, "hexagramNumber", "chunkType", "linePosition", 
              content, "contentEn", metadata, embedding, "createdAt", "updatedAt"
            ) VALUES (
              gen_random_uuid()::text,
              ${chunk.hexagramNumber},
              ${chunk.chunkType},
              ${chunk.linePosition},
              ${chunk.content},
              ${chunk.contentEn},
              ${JSON.stringify(chunk.metadata)}::jsonb,
              ${JSON.stringify(chunk.embedding)}::vector,
              NOW(),
              NOW()
            )
          `;
        }

        totalChunks += chunks.length;
        console.log(`    ✅ 生成 ${chunks.length} 个切片`);
        
        // 避免 API 限流
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`    ❌ 处理卦象 ${hexagram.number} 失败:`, error);
      }
    }
  }

  console.log(`\n✨ 完成！共生成 ${totalChunks} 个知识切片`);
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
