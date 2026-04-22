# Scripts

Utility scripts for the iching-app. Run with `npx tsx scripts/<script-name>.ts`.

## Available Scripts

### `seed-knowledge-chunks.ts`
Seeds the database with hexagram knowledge chunks from JSON source files. Used to populate RAG (retrieval-augmented generation) content.

```bash
npx tsx scripts/seed-knowledge-chunks.ts
```

### `rag-chunk.ts`
Splits hexagram text content into smaller chunks suitable for embedding and semantic search.

```bash
npx tsx scripts/rag-chunk.ts
```

### `rag-embed.ts`
Generates vector embeddings for knowledge chunks and stores them in the database for semantic search.

```bash
npx tsx scripts/rag-embed.ts
```

### `seed-hexagram-nature.ts`
Updates all 64 hexagrams with their traditional nature classification:
- `ji` (吉) — auspicious
- `xiong` (凶) — inauspicious
- `ping` (平) — neutral
- `mixed` (吉凶参半) — mixed

Safe to run multiple times (idempotent).

```bash
npx tsx scripts/seed-hexagram-nature.ts
```

### `seed-daily-lessons.ts`
Seeds the `DailyLesson` table from pre-generated JSON files in `scripts/data/`.

Reads from:
- `scripts/data/yijing-lessons.json` — I Ching line-by-line lessons (384 records)
- `scripts/data/daoist-lessons.json` — Daoist philosophy lessons

Upserts are idempotent via the `(school, slug, locale)` unique constraint — safe to re-run.

```bash
# Seed all schools
npx tsx scripts/seed-daily-lessons.ts --school=all

# Seed a specific school
npx tsx scripts/seed-daily-lessons.ts --school=yijing
npx tsx scripts/seed-daily-lessons.ts --school=daoist

# Preview without writing
npx tsx scripts/seed-daily-lessons.ts --school=all --dry-run
```

**JSON file format** (`scripts/data/*.json`): array of objects with fields:
`school`, `dayIndex`, `slug`, `title`, `subtitle`, `classicText`, `wisdom`, `action`,
and optionally `caution`, `meditation`, `hexagramId`, `sourceRef`, `locale` (defaults to `zh`).
