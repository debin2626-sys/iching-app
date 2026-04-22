import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Traditional I Ching nature classifications
// ji (吉) = auspicious, xiong (凶) = inauspicious, ping (平) = neutral, mixed (吉凶参半) = mixed
const hexagramNatures: { number: number; nameZh: string; nature: string }[] = [
  { number: 1,  nameZh: '乾', nature: 'ji' },
  { number: 2,  nameZh: '坤', nature: 'ji' },
  { number: 3,  nameZh: '屯', nature: 'mixed' },
  { number: 4,  nameZh: '蒙', nature: 'ji' },
  { number: 5,  nameZh: '需', nature: 'ji' },
  { number: 6,  nameZh: '讼', nature: 'xiong' },
  { number: 7,  nameZh: '师', nature: 'mixed' },
  { number: 8,  nameZh: '比', nature: 'ji' },
  { number: 9,  nameZh: '小畜', nature: 'ji' },
  { number: 10, nameZh: '履', nature: 'ji' },
  { number: 11, nameZh: '泰', nature: 'ji' },
  { number: 12, nameZh: '否', nature: 'xiong' },
  { number: 13, nameZh: '同人', nature: 'ji' },
  { number: 14, nameZh: '大有', nature: 'ji' },
  { number: 15, nameZh: '谦', nature: 'ji' },
  { number: 16, nameZh: '豫', nature: 'ji' },
  { number: 17, nameZh: '随', nature: 'ji' },
  { number: 18, nameZh: '蛊', nature: 'mixed' },
  { number: 19, nameZh: '临', nature: 'ji' },
  { number: 20, nameZh: '观', nature: 'ping' },
  { number: 21, nameZh: '噬嗑', nature: 'ji' },
  { number: 22, nameZh: '贲', nature: 'ji' },
  { number: 23, nameZh: '剥', nature: 'xiong' },
  { number: 24, nameZh: '复', nature: 'ji' },
  { number: 25, nameZh: '无妄', nature: 'mixed' },
  { number: 26, nameZh: '大畜', nature: 'ji' },
  { number: 27, nameZh: '颐', nature: 'mixed' },
  { number: 28, nameZh: '大过', nature: 'xiong' },
  { number: 29, nameZh: '坎', nature: 'xiong' },
  { number: 30, nameZh: '离', nature: 'ji' },
  { number: 31, nameZh: '咸', nature: 'ji' },
  { number: 32, nameZh: '恒', nature: 'ji' },
  { number: 33, nameZh: '遁', nature: 'ping' },
  { number: 34, nameZh: '大壮', nature: 'ji' },
  { number: 35, nameZh: '晋', nature: 'ji' },
  { number: 36, nameZh: '明夷', nature: 'xiong' },
  { number: 37, nameZh: '家人', nature: 'ji' },
  { number: 38, nameZh: '睽', nature: 'mixed' },
  { number: 39, nameZh: '蹇', nature: 'xiong' },
  { number: 40, nameZh: '解', nature: 'ji' },
  { number: 41, nameZh: '损', nature: 'mixed' },
  { number: 42, nameZh: '益', nature: 'ji' },
  { number: 43, nameZh: '夬', nature: 'mixed' },
  { number: 44, nameZh: '姤', nature: 'xiong' },
  { number: 45, nameZh: '萃', nature: 'ji' },
  { number: 46, nameZh: '升', nature: 'ji' },
  { number: 47, nameZh: '困', nature: 'xiong' },
  { number: 48, nameZh: '井', nature: 'ji' },
  { number: 49, nameZh: '革', nature: 'mixed' },
  { number: 50, nameZh: '鼎', nature: 'ji' },
  { number: 51, nameZh: '震', nature: 'mixed' },
  { number: 52, nameZh: '艮', nature: 'ping' },
  { number: 53, nameZh: '渐', nature: 'ji' },
  { number: 54, nameZh: '归妹', nature: 'xiong' },
  { number: 55, nameZh: '丰', nature: 'mixed' },
  { number: 56, nameZh: '旅', nature: 'mixed' },
  { number: 57, nameZh: '巽', nature: 'ji' },
  { number: 58, nameZh: '兑', nature: 'ji' },
  { number: 59, nameZh: '涣', nature: 'mixed' },
  { number: 60, nameZh: '节', nature: 'mixed' },
  { number: 61, nameZh: '中孚', nature: 'ji' },
  { number: 62, nameZh: '小过', nature: 'mixed' },
  { number: 63, nameZh: '既济', nature: 'mixed' },
  { number: 64, nameZh: '未济', nature: 'mixed' },
];

async function main() {
  console.log('🌱 Seeding hexagram nature classifications...\n');

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const { number, nameZh, nature } of hexagramNatures) {
    const existing = await prisma.hexagram.findUnique({ where: { number } });

    if (!existing) {
      console.warn(`  ⚠️  Hexagram #${number} (${nameZh}) not found in DB — skipping`);
      notFound++;
      continue;
    }

    if (existing.nature === nature) {
      console.log(`  ✓  #${String(number).padStart(2, '0')} ${nameZh.padEnd(3)} — already set to "${nature}"`);
      skipped++;
      continue;
    }

    await prisma.hexagram.update({
      where: { number },
      data: { nature },
    });

    console.log(`  ✏️  #${String(number).padStart(2, '0')} ${nameZh.padEnd(3)} — set to "${nature}"`);
    updated++;
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Done
   Updated:   ${updated}
   Skipped:   ${skipped} (already correct)
   Not found: ${notFound}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
