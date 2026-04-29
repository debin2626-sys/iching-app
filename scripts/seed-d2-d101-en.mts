/**
 * seed-d2-d101-en.mts
 *
 * Stage 3: Parse English daily-lesson content for D2–D101,
 * run 8-item preflight checks, and output dry-run samples.
 *
 * Usage:
 *   npx tsx scripts/seed-d2-d101-en.mts --dry-run
 *   npx tsx scripts/seed-d2-d101-en.mts          # real upsert (Stage 4)
 */

// env vars loaded via shell: set -a; source .env.production.local; set +a
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { execSync } from 'child_process';

// ── DB setup ────────────────────────────────────────────────────────────────
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || !args.includes('--execute');

// ── Constants ───────────────────────────────────────────────────────────────
const DATA_FILE = '/tmp/hermes-d2-d101-v2.txt';
const FIELDS = ['slug', 'title', 'subtitle', 'classicText', 'wisdom', 'action', 'caution', 'sourceRef', 'wc'] as const;
type FieldName = (typeof FIELDS)[number];

interface ParsedLesson {
  dayIndex: number;
  slug: string;
  title: string;
  subtitle: string;
  classicText: string;
  wisdom: string;
  action: string;
  caution: string;
  sourceRef: string;
  wc: string;
  id: string;
}

// ── (A) Parser ──────────────────────────────────────────────────────────────

function parseFile(filePath: string): ParsedLesson[] {
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Split by === D(\d+) === markers
  const dayRegex = /^=== D(\d+) ===$/m;
  const parts = raw.split(dayRegex);
  // parts: [preamble, "2", content2, "3", content3, ...]

  const lessons: ParsedLesson[] = [];

  for (let i = 1; i < parts.length; i += 2) {
    const dayIndex = parseInt(parts[i], 10);
    const content = parts[i + 1];

    // Parse fields using line scanner
    const lines = content.split('\n');
    const fieldSet = new Set<string>(FIELDS);
    let currentField: string | null = null;
    const buffers: Record<string, string[]> = {};

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match && fieldSet.has(match[1])) {
        currentField = match[1];
        if (!buffers[currentField]) {
          buffers[currentField] = [];
        }
        buffers[currentField].push(match[2]);
      } else if (currentField) {
        buffers[currentField].push(line);
      }
    }

    // Finalize: join and trim each field
    const get = (f: string): string => (buffers[f] ?? []).join('\n').trim();

    const slug = get('slug');
    const id = `en_d${dayIndex}_${slug.replace(/-/g, '_')}_${dayIndex.toString().padStart(3, '0')}`;

    lessons.push({
      dayIndex,
      slug,
      title: get('title'),
      subtitle: get('subtitle'),
      classicText: get('classicText'),
      wisdom: get('wisdom'),
      action: get('action'),
      caution: get('caution'),
      sourceRef: get('sourceRef'),
      wc: get('wc'),
      id,
    });
  }

  return lessons;
}

// ── (C) Preflight checks ────────────────────────────────────────────────────

async function runPreflight(lessons: ParsedLesson[]): Promise<boolean> {
  let allPass = true;
  const fail = (check: string, msg: string) => {
    console.log(`  FAIL  ${msg}`);
    allPass = false;
  };
  const pass = (check: string, msg: string) => {
    console.log(`  PASS  ${msg}`);
  };

  // ── Check 1: sha256sum of data file ──
  console.log('\n═══ PREFLIGHT CHECK 1: sha256sum ═══');
  const hash = crypto.createHash('sha256').update(fs.readFileSync(DATA_FILE)).digest('hex');
  const shellHash = execSync(`sha256sum ${DATA_FILE}`).toString().trim();
  pass('1', `sha256sum: ${shellHash}`);

  // ── Check 2: record count == 100, dayIndex set == {2..101} ──
  console.log('\n═══ PREFLIGHT CHECK 2: record count & dayIndex range ═══');
  const dayIndices = new Set(lessons.map((l) => l.dayIndex));
  const expectedSet = new Set(Array.from({ length: 100 }, (_, i) => i + 2));
  const missing = [...expectedSet].filter((d) => !dayIndices.has(d));
  const extra = [...dayIndices].filter((d) => !expectedSet.has(d));

  if (lessons.length === 100 && missing.length === 0 && extra.length === 0) {
    pass('2', `record count = ${lessons.length}, dayIndex set = {2..101} — exact match`);
  } else {
    fail('2', `record count = ${lessons.length} (expected 100), missing dayIndices: [${missing.join(',')}], extra: [${extra.join(',')}]`);
  }

  // ── Check 3: 8 required fields non-empty (caution key must exist, value can be empty) ──
  console.log('\n═══ PREFLIGHT CHECK 3: required fields non-empty ═══');
  const requiredNonEmpty = ['slug', 'title', 'subtitle', 'classicText', 'wisdom', 'action', 'sourceRef'] as const;
  let check3Pass = true;
  for (const l of lessons) {
    const missingFields: string[] = [];
    for (const f of requiredNonEmpty) {
      if (!l[f] || l[f].trim() === '') missingFields.push(f);
    }
    // caution: key must exist (it always does in our struct), value can be empty
    if (l.caution === undefined || l.caution === null) missingFields.push('caution(key missing)');
    if (missingFields.length > 0) {
      fail('3', `D${l.dayIndex}: missing/empty fields: ${missingFields.join(', ')}`);
      check3Pass = false;
    }
  }
  if (check3Pass) pass('3', 'all 100 records have 8 required fields present');

  // ── Check 4: classicText has \n, split length == 2, second part starts with "Image:" ──
  console.log('\n═══ PREFLIGHT CHECK 4: classicText structure ═══');
  let check4Pass = true;
  for (const l of lessons) {
    const parts = l.classicText.split('\n');
    if (parts.length !== 2) {
      fail('4', `D${l.dayIndex}: classicText split('\\n').length = ${parts.length} (expected 2)`);
      check4Pass = false;
    } else if (!parts[1].trimStart().startsWith('Image:')) {
      fail('4', `D${l.dayIndex}: classicText second line does not start with 'Image:' — got: "${parts[1].substring(0, 60)}"`);
      check4Pass = false;
    }
  }
  if (check4Pass) pass('4', 'all 100 classicText fields: 2 lines, second starts with "Image:"');

  // ── Check 5: sourceRef matches / · Line [1-6]$/ ──
  console.log('\n═══ PREFLIGHT CHECK 5: sourceRef format ═══');
  const sourceRefRegex = / · Line [1-6]$/;
  let check5Pass = true;
  for (const l of lessons) {
    if (!sourceRefRegex.test(l.sourceRef)) {
      fail('5', `D${l.dayIndex}: sourceRef = "${l.sourceRef}"`);
      check5Pass = false;
    }
  }
  if (check5Pass) pass('5', 'all 100 sourceRef match / · Line [1-6]$/');

  // ── Check 6: slug matches prod DB zh slugs ──
  console.log('\n═══ PREFLIGHT CHECK 6: slug vs prod DB ═══');
  let check6Pass = true;
  try {
    const dbResult = execSync(
      `psql "$DATABASE_URL" -c "SELECT \\"dayIndex\\", slug FROM \\"DailyLesson\\" WHERE school='yijing' AND locale='zh' AND \\"dayIndex\\" BETWEEN 2 AND 101 ORDER BY \\"dayIndex\\";" -t -A -F'|'`,
      { encoding: 'utf-8' }
    ).trim();

    const dbMap = new Map<number, string>();
    for (const line of dbResult.split('\n')) {
      const [di, slug] = line.split('|');
      dbMap.set(parseInt(di, 10), slug);
    }

    for (const l of lessons) {
      const prodSlug = dbMap.get(l.dayIndex);
      if (!prodSlug) {
        fail('6', `D${l.dayIndex}: no prod zh record found`);
        check6Pass = false;
      } else if (l.slug !== prodSlug) {
        fail('6', `D${l.dayIndex}: parsed="${l.slug}" vs prod="${prodSlug}"`);
        check6Pass = false;
      }
    }
    if (check6Pass) pass('6', 'all 100 slugs match prod DB zh slugs exactly');
  } catch (err) {
    fail('6', `DB query failed: ${err}`);
  }

  // ── Check 7: no Chinese characters in 8 content fields ──
  console.log('\n═══ PREFLIGHT CHECK 7: no Chinese characters ═══');
  const cjkRegex = /[\u4e00-\u9fff]/;
  const contentFields = ['slug', 'title', 'subtitle', 'classicText', 'wisdom', 'action', 'caution', 'sourceRef'] as const;
  let check7Pass = true;
  let cjkCount = 0;
  for (const l of lessons) {
    for (const f of contentFields) {
      if (cjkRegex.test(l[f])) {
        fail('7', `D${l.dayIndex}.${f} contains Chinese characters`);
        check7Pass = false;
        cjkCount++;
      }
    }
  }
  if (check7Pass) pass('7', `0 Chinese characters found across 800 field values (100 records × 8 fields)`);

  // ── Check 8: id format and uniqueness ──
  console.log('\n═══ PREFLIGHT CHECK 8: id format & uniqueness ═══');
  const idRegex = /^en_d\d+_[a-z0-9_]+_\d{3}$/;
  let check8Pass = true;
  const idSet = new Set<string>();
  const badIds: string[] = [];
  for (const l of lessons) {
    if (!idRegex.test(l.id)) {
      badIds.push(`D${l.dayIndex}: "${l.id}"`);
      check8Pass = false;
    }
    if (idSet.has(l.id)) {
      fail('8', `duplicate id: "${l.id}"`);
      check8Pass = false;
    }
    idSet.add(l.id);
  }
  if (badIds.length > 0) {
    fail('8', `ids not matching format: ${badIds.join(', ')}`);
  }
  if (check8Pass) {
    pass('8', `100 unique ids, all match /^en_d\\d+_[a-z0-9_]+_\\d{3}$/`);
    // Print all 100 ids
    console.log('\n── 100 id preview ──');
    for (const l of lessons) {
      console.log(`  D${l.dayIndex.toString().padStart(3)}: ${l.id}`);
    }
  }

  // ── Summary ──
  console.log('\n═══ PREFLIGHT SUMMARY ═══');
  if (allPass) {
    console.log('✅ ALL 8 CHECKS PASSED');
  } else {
    console.log('❌ SOME CHECKS FAILED — see above');
  }

  return allPass;
}

// ── (D) Dry-run output ──────────────────────────────────────────────────────

function printVerbatimSamples(lessons: ParsedLesson[]) {
  const sampleDays = [2, 24, 50, 89, 101];
  console.log('\n═══ VERBATIM SAMPLES: D2, D24, D50, D89, D101 ═══');

  for (const di of sampleDays) {
    const l = lessons.find((x) => x.dayIndex === di);
    if (!l) {
      console.log(`\n── D${di}: NOT FOUND ──`);
      continue;
    }
    console.log(`\n── D${di} ──`);
    console.log(`id:          ${l.id}`);
    console.log(`slug:        ${l.slug}`);
    console.log(`title:       ${l.title}`);
    console.log(`subtitle:    ${l.subtitle}`);
    console.log(`classicText: ${l.classicText}`);
    console.log(`wisdom:      ${l.wisdom}`);
    console.log(`action:      ${l.action}`);
    console.log(`caution:     ${l.caution}`);
    console.log(`sourceRef:   ${l.sourceRef}`);
    console.log(`wc:          ${l.wc}`);
  }
}

function printCompactTable(lessons: ParsedLesson[]) {
  console.log('\n═══ COMPACT TABLE: 100 records ═══');
  console.log('dayIndex | slug | id | sourceRef | classicText (first 80 chars) | wc');
  console.log('─'.repeat(140));

  for (const l of lessons.sort((a, b) => a.dayIndex - b.dayIndex)) {
    const ctFirst = l.classicText.split('\n')[0].substring(0, 80);
    console.log(
      `D${l.dayIndex.toString().padStart(3)} | ${l.slug} | ${l.id} | ${l.sourceRef} | ${ctFirst} | ${l.wc}`
    );
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱 seed-d2-d101-en.mts — ${dryRun ? 'DRY-RUN' : 'LIVE UPSERT'} mode\n`);

  // Parse
  console.log(`📂 Parsing ${DATA_FILE} ...`);
  const lessons = parseFile(DATA_FILE);
  console.log(`   Parsed ${lessons.length} records\n`);

  // Preflight
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('                         PREFLIGHT CHECKS (8 items)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const allPass = await runPreflight(lessons);

  if (!allPass) {
    console.log('\n❌ PREFLIGHT FAILED — stopping before dry-run output.');
    console.log('STOP for sign-off.');
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  }

  if (dryRun) {
    // (D) Dry-run samples
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('                         DRY-RUN OUTPUT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    printVerbatimSamples(lessons);
    printCompactTable(lessons);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('DRY-RUN COMPLETE. STOP for sign-off.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } else {
    // (E) Real upsert — Stage 4
    console.log('\n🚀 Starting upsert...');

    // Fetch hexagramId mapping from prod zh records
    const hexMap = new Map<number, number>();
    const hexResult = execSync(
      `psql "$DATABASE_URL" -c "SELECT \\"dayIndex\\", \\"hexagramId\\" FROM \\"DailyLesson\\" WHERE school='yijing' AND locale='zh' AND \\"dayIndex\\" BETWEEN 2 AND 101 ORDER BY \\"dayIndex\\";" -t -A -F'|'`,
      { encoding: 'utf-8' }
    ).trim();
    for (const line of hexResult.split('\n')) {
      const [di, hid] = line.split('|');
      hexMap.set(parseInt(di, 10), parseInt(hid, 10));
    }

    let upserted = 0;
    let failed = 0;
    for (const l of lessons) {
      try {
        await prisma.dailyLesson.upsert({
          where: {
            school_slug_locale: {
              school: 'yijing',
              slug: l.slug,
              locale: 'en',
            },
          },
          update: {
            id: l.id,
            dayIndex: l.dayIndex,
            title: l.title,
            subtitle: l.subtitle,
            classicText: l.classicText,
            wisdom: l.wisdom,
            action: l.action,
            caution: l.caution || null,
            hexagramId: hexMap.get(l.dayIndex) ?? null,
            sourceRef: l.sourceRef || null,
            locale: 'en',
          },
          create: {
            id: l.id,
            school: 'yijing',
            dayIndex: l.dayIndex,
            slug: l.slug,
            title: l.title,
            subtitle: l.subtitle,
            classicText: l.classicText,
            wisdom: l.wisdom,
            action: l.action,
            caution: l.caution || null,
            hexagramId: hexMap.get(l.dayIndex) ?? null,
            sourceRef: l.sourceRef || null,
            locale: 'en',
          },
        });
        upserted++;
        console.log(`  ✅ ${upserted}/100: D${l.dayIndex} ${l.slug}`);
      } catch (err) {
        failed++;
        console.error(`  ❌ D${l.dayIndex} ${l.slug}: ${err}`);
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`UPSERT COMPLETE: ${upserted} succeeded, ${failed} failed`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
