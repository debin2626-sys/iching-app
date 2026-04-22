/**
 * 日课内容批量生成脚本
 *
 * 使用 OpenAI/DeepSeek API + prompt 模板批量生成日课 JSON
 *
 * Usage:
 *   npx tsx scripts/generate-daily-lessons.ts --school=yijing --from=1 --to=12
 *   npx tsx scripts/generate-daily-lessons.ts --school=daoist --from=1 --to=5
 *   npx tsx scripts/generate-daily-lessons.ts --school=yijing --from=1 --to=12 --model=deepseek-chat
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'
import { HEXAGRAM_DATA } from '../src/data/hexagrams'
import {
  generateYijingPrompt,
  generateDaoistPrompt,
  parseYijingResponse,
  parseDaoistResponse,
  type HexagramData,
  type HexagramNature,
} from './prompts/daily-lesson-prompts'

// ── CLI args ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]

const school = getArg('school') ?? 'yijing'
const fromDay = parseInt(getArg('from') ?? '1', 10)
const toDay = parseInt(getArg('to') ?? (school === 'yijing' ? '6' : '5'), 10)
const modelName = getArg('model') ?? 'claude-sonnet-4-6'
const concurrency = parseInt(getArg('concurrency') ?? '3', 10)

if (!['yijing', 'daoist'].includes(school)) {
  console.error('❌ --school must be yijing or daoist')
  process.exit(1)
}

// ── API client ────────────────────────────────────────────────────────────

const isClaude = modelName.includes('claude')
const isDeepSeek = modelName.includes('deepseek')

let openaiClient: OpenAI | null = null
let anthropicClient: Anthropic | null = null

if (isClaude) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('❌ Missing ANTHROPIC_API_KEY')
    process.exit(1)
  }
  const baseURL = process.env.ANTHROPIC_BASE_URL
  anthropicClient = new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) })
} else {
  const apiKey = isDeepSeek ? process.env.DEEPSEEK_API_KEY : process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error(`❌ Missing API key: ${isDeepSeek ? 'DEEPSEEK_API_KEY' : 'OPENAI_API_KEY'}`)
    process.exit(1)
  }
  openaiClient = new OpenAI({
    apiKey,
    baseURL: isDeepSeek ? 'https://api.deepseek.com' : undefined,
  })
}

// ── Hexagram nature data (from seed script) ──────────────────────────────

const HEXAGRAM_NATURES: Record<number, HexagramNature> = {
  1: 'ji', 2: 'ji', 3: 'mixed', 4: 'ji', 5: 'ji', 6: 'xiong', 7: 'mixed', 8: 'ji',
  9: 'ji', 10: 'ji', 11: 'ji', 12: 'xiong', 13: 'ji', 14: 'ji', 15: 'ji', 16: 'ji',
  17: 'ji', 18: 'mixed', 19: 'ji', 20: 'ping', 21: 'ji', 22: 'ji', 23: 'xiong', 24: 'ji',
  25: 'mixed', 26: 'ji', 27: 'mixed', 28: 'xiong', 29: 'xiong', 30: 'ji', 31: 'ji', 32: 'ji',
  33: 'ping', 34: 'ji', 35: 'ji', 36: 'xiong', 37: 'ji', 38: 'mixed', 39: 'xiong', 40: 'ji',
  41: 'mixed', 42: 'ji', 43: 'mixed', 44: 'mixed', 45: 'ji', 46: 'ji', 47: 'xiong', 48: 'ji',
  49: 'mixed', 50: 'ji', 51: 'mixed', 52: 'ji', 53: 'ji', 54: 'xiong', 55: 'mixed', 56: 'mixed',
  57: 'ji', 58: 'ji', 59: 'mixed', 60: 'mixed', 61: 'ji', 62: 'mixed', 63: 'ji', 64: 'mixed',
}

// ── Generate one lesson ──────────────────────────────────────────────────

async function generateOne(dayIndex: number): Promise<Record<string, unknown> | null> {
  let prompt: string

  if (school === 'yijing') {
    const hexagramId = Math.ceil(dayIndex / 6)
    const lineIndex = ((dayIndex - 1) % 6) + 1
    const hexData = HEXAGRAM_DATA[hexagramId - 1] as unknown as HexagramData
    const nature = HEXAGRAM_NATURES[hexagramId] ?? 'ping'
    prompt = generateYijingPrompt(hexData, lineIndex, dayIndex, nature)
  } else {
    prompt = generateDaoistPrompt(dayIndex)
  }

  try {
    let content: string | null = null

    if (anthropicClient) {
      const response = await anthropicClient.messages.create({
        model: modelName,
        max_tokens: 1500,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      })
      const block = response.content[0]
      content = block.type === 'text' ? block.text : null
    } else if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      })
      content = response.choices[0]?.message?.content ?? null
    }

    if (!content) throw new Error('Empty response')

    const parsed = school === 'yijing'
      ? parseYijingResponse(content, dayIndex)
      : parseDaoistResponse(content, dayIndex)

    console.log(`  ✅ Day ${dayIndex}: ${(parsed as { title: string }).title}`)
    return parsed as unknown as Record<string, unknown>
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ❌ Day ${dayIndex}: ${msg}`)
    return null
  }
}

// ── Batch with concurrency control ───────────────────────────────────────

async function generateBatch(from: number, to: number): Promise<Record<string, unknown>[]> {
  const results: Record<string, unknown>[] = []
  const days = Array.from({ length: to - from + 1 }, (_, i) => from + i)

  for (let i = 0; i < days.length; i += concurrency) {
    const batch = days.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(generateOne))
    for (const r of batchResults) {
      if (r) results.push(r)
    }
    // Rate limit: small delay between batches
    if (i + concurrency < days.length) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  return results
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🎯 Generating ${school} lessons: Day ${fromDay}-${toDay} (model: ${modelName})\n`)

  const results = await generateBatch(fromDay, toDay)

  // Write output
  const outDir = path.join(__dirname, 'data')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const outFile = path.join(outDir, `${school}-lessons.json`)

  // Merge with existing data if file exists
  let existing: Record<string, unknown>[] = []
  if (fs.existsSync(outFile)) {
    existing = JSON.parse(fs.readFileSync(outFile, 'utf-8'))
    console.log(`\n📂 Merging with existing ${existing.length} records`)
  }

  // Merge: replace by dayIndex, append new
  const merged = [...existing]
  for (const r of results) {
    const idx = merged.findIndex((e) => e.dayIndex === r.dayIndex)
    if (idx >= 0) merged[idx] = r
    else merged.push(r)
  }
  merged.sort((a, b) => (a.dayIndex as number) - (b.dayIndex as number))

  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2), 'utf-8')

  console.log(`\n✅ Wrote ${merged.length} records to ${path.relative(process.cwd(), outFile)}`)
  console.log(`   Generated: ${results.length}, Failed: ${toDay - fromDay + 1 - results.length}`)
}

main().catch((err) => {
  console.error('❌ Fatal:', err)
  process.exit(1)
})
