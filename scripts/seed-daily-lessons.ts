import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ── Types ────────────────────────────────────────────────────────────────────

interface LessonRecord {
  school: string;
  dayIndex: number;
  slug: string;
  title: string;
  subtitle: string;
  classicText: string;
  wisdom: string;
  action: string;
  caution?: string;
  meditation?: string;
  hexagramId?: number;
  sourceRef?: string;
  locale?: string;
}

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const schoolArg = args.find((a) => a.startsWith('--school='))?.split('=')[1] ?? 'all';
const dryRun = args.includes('--dry-run');

if (!['yijing', 'daoist', 'all'].includes(schoolArg)) {
  console.error(`❌ Invalid --school value: "${schoolArg}". Must be yijing | daoist | all`);
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadJson(filePath: string): LessonRecord[] {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠️  File not found, skipping: ${abs}`);
    return [];
  }
  const raw = fs.readFileSync(abs, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected an array in ${abs}`);
  }
  return parsed as LessonRecord[];
}

function displayLabel(lesson: LessonRecord): string {
  return `${lesson.slug} (${lesson.title} · ${lesson.subtitle})`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seedLessons(lessons: LessonRecord[]): Promise<{ seeded: number; failed: number; errors: string[] }> {
  let seeded = 0;
  const errors: string[] = [];
  const total = lessons.length;

  for (const lesson of lessons) {
    const index = seeded + errors.length + 1;
    const locale = lesson.locale ?? 'zh';
    const label = displayLabel(lesson);

    if (dryRun) {
      console.log(`  [dry-run] Would upsert ${index}/${total}: ${label}`);
      seeded++;
      continue;
    }

    try {
      await prisma.dailyLesson.upsert({
        where: {
          school_slug_locale: {
            school: lesson.school,
            slug: lesson.slug,
            locale,
          },
        },
        update: {
          dayIndex: lesson.dayIndex,
          title: lesson.title,
          subtitle: lesson.subtitle,
          classicText: lesson.classicText,
          wisdom: lesson.wisdom,
          action: lesson.action,
          caution: lesson.caution ?? null,
          meditation: lesson.meditation ?? null,
          hexagramId: lesson.hexagramId ?? null,
          sourceRef: lesson.sourceRef ?? null,
          locale,
        },
        create: {
          school: lesson.school,
          dayIndex: lesson.dayIndex,
          slug: lesson.slug,
          title: lesson.title,
          subtitle: lesson.subtitle,
          classicText: lesson.classicText,
          wisdom: lesson.wisdom,
          action: lesson.action,
          caution: lesson.caution ?? null,
          meditation: lesson.meditation ?? null,
          hexagramId: lesson.hexagramId ?? null,
          sourceRef: lesson.sourceRef ?? null,
          locale,
        },
      });

      console.log(`  Seeded ${index}/${total}: ${label}`);
      seeded++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Failed ${index}/${total}: ${label} — ${msg}`);
      errors.push(`${label}: ${msg}`);
    }
  }

  return { seeded, failed: errors.length, errors };
}

async function main() {
  console.log(`🌱 Seeding daily lessons — school=${schoolArg}${dryRun ? ' [DRY RUN]' : ''}\n`);

  const dataDir = path.join(__dirname, 'data');
  const sources: { school: string; file: string }[] = [
    { school: 'yijing', file: path.join(dataDir, 'yijing-lessons.json') },
    { school: 'daoist', file: path.join(dataDir, 'daoist-lessons.json') },
  ];

  const active = schoolArg === 'all' ? sources : sources.filter((s) => s.school === schoolArg);

  let totalSeeded = 0;
  let totalFailed = 0;
  const allErrors: string[] = [];

  for (const { school, file } of active) {
    console.log(`📂 Loading ${school} lessons from ${path.relative(process.cwd(), file)}`);
    const lessons = loadJson(file);

    if (lessons.length === 0) {
      console.log(`  (no records)\n`);
      continue;
    }

    console.log(`  Found ${lessons.length} records\n`);
    const { seeded, failed, errors } = await seedLessons(lessons);
    totalSeeded += seeded;
    totalFailed += failed;
    allErrors.push(...errors);
    console.log();
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (dryRun) {
    console.log(`✅ Dry run complete — ${totalSeeded} records would be upserted`);
  } else {
    console.log(`✅ Done`);
    console.log(`   Seeded: ${totalSeeded}`);
    console.log(`   Failed: ${totalFailed}`);
  }

  if (allErrors.length > 0) {
    console.log('\n⚠️  Errors:');
    allErrors.forEach((e) => console.log(`   • ${e}`));
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((err) => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
