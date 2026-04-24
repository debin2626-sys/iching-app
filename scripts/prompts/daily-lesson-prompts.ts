/**
 * Daily Lesson Content Generation Prompt Templates
 *
 * Batch 1: Yijing (易经卦序派) + Daoist (道家清静派)
 *
 * Exports:
 *   generateYijingPrompt  — builds the OpenAI prompt for one hexagram line lesson
 *   generateDaoistPrompt  — builds the OpenAI prompt for one Daoist source lesson
 *   parseYijingResponse   — parses the JSON response into DailyLesson fields
 *   parseDaoistResponse   — parses the JSON response into DailyLesson fields
 */

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Minimal subset of HexagramSEOData fields used by the prompt generator.
 * Mirrors the shape from src/data/hexagrams.ts — kept inline to avoid
 * cross-boundary import issues when running scripts directly with ts-node.
 */
export interface HexagramData {
  number: number
  nameZh: string
  nameEn: string
  traditionalName: string
  symbol: string          // 6-char binary string, e.g. "111111" (top→bottom)
  upperTrigram: string
  lowerTrigram: string
  judgmentZh: string
  imageZh: string
  interpretationZh: string
}

export type HexagramNature = 'ji' | 'xiong' | 'ping' | 'mixed'

/** Subset of DailyLesson fields returned by the parse functions */
export interface YijingLessonFields {
  school: 'yijing'
  dayIndex: number
  hexagramId: number
  slug: string
  title: string
  subtitle: string
  classicText: string
  wisdom: string
  action: string
  caution?: string
  sourceRef: string
}

export interface DaoistLessonFields {
  school: 'daoist'
  dayIndex: number
  slug: string
  title: string
  subtitle: string
  classicText: string
  wisdom: string
  action: string
  meditation: string
  sourceRef: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Map lineIndex (1-6) to its Chinese positional name prefix */
const LINE_POSITION_ZH: Record<number, string> = {
  1: '初',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '上',
}

/**
 * Derive the line name in Chinese.
 * Yang lines use 九, yin lines use 六.
 * The hexagram symbol is a 6-char string of '0' (yin) and '1' (yang),
 * ordered from bottom (index 5) to top (index 0) in the HEXAGRAM_DATA symbol field.
 *
 * lineIndex 1 = bottom line = symbol[5]
 * lineIndex 6 = top line    = symbol[0]
 */
function getLineNameZh(symbol: string, lineIndex: number): string {
  const symbolIndex = 6 - lineIndex // symbol[0] = top (line 6), symbol[5] = bottom (line 1)
  const isYang = symbol[symbolIndex] === '1'
  const position = LINE_POSITION_ZH[lineIndex]
  const yinYang = isYang ? '九' : '六'
  // 初/上 position comes first: 初九, 上六
  // Lines 2-5: 九/六 comes first: 九二, 六三
  if (lineIndex === 1 || lineIndex === 6) {
    return `${position}${yinYang}`
  }
  return `${yinYang}${position}`
}

/**
 * Derive the line name in pinyin for slug construction.
 * e.g. 初九 → chujiu, 六二 → liuer, 上六 → shangliu
 */
const LINE_NAME_PINYIN: Record<string, string> = {
  初九: 'chujiu',
  初六: 'chuliu',
  九二: 'jiuer',
  六二: 'liuer',
  九三: 'jiusan',
  六三: 'liusan',
  九四: 'jiusi',
  六四: 'liusi',
  九五: 'jiuwu',
  六五: 'liuwu',
  上九: 'shangjiu',
  上六: 'shangliu',
}

/**
 * Map hexagram number to its pinyin slug prefix.
 * Covers all 64 hexagrams.
 */
const HEXAGRAM_PINYIN: Record<number, string> = {
  1: 'qian',
  2: 'kun',
  3: 'zhun',
  4: 'meng',
  5: 'xu',
  6: 'song',
  7: 'shi',
  8: 'bi',
  9: 'xiaoxu',
  10: 'lv',
  11: 'tai',
  12: 'pi',
  13: 'tongren',
  14: 'dayou',
  15: 'qian2', // 谦
  16: 'yu',
  17: 'sui',
  18: 'gu',
  19: 'lin',
  20: 'guan',
  21: 'shike',
  22: 'bi2', // 贲
  23: 'bo',
  24: 'fu',
  25: 'wuwang',
  26: 'daxu',
  27: 'yi',
  28: 'daguo',
  29: 'kan',
  30: 'li',
  31: 'xian',
  32: 'heng',
  33: 'dun',
  34: 'dazhuang',
  35: 'jin',
  36: 'mingyi',
  37: 'jiaren',
  38: 'kui',
  39: 'jian',
  40: 'jie',
  41: 'sun',
  42: 'yi2', // 益
  43: 'guai',
  44: 'gou',
  45: 'cui',
  46: 'sheng',
  47: 'kun2', // 困
  48: 'jing',
  49: 'ge',
  50: 'ding',
  51: 'zhen',
  52: 'gen',
  53: 'jian2', // 渐
  54: 'guimei',
  55: 'feng',
  56: 'lv2', // 旅
  57: 'xun',
  58: 'dui',
  59: 'huan',
  60: 'jie2', // 节
  61: 'zhongfu',
  62: 'xiaoguo',
  63: 'jiji',
  64: 'weiji',
}

// ── Daoist source mapping ──────────────────────────────────────────────────

interface DaoistSource {
  name: string        // 典籍名
  slugPrefix: string  // slug 前缀
  sourceRef: string   // 出处格式字符串 (use {n} for section number)
  startDay: number
  endDay: number
  totalSections: number
}

const DAOIST_SOURCES: DaoistSource[] = [
  {
    name: '道德经',
    slugPrefix: 'daodejing',
    sourceRef: '道德经第{n}章',
    startDay: 1,
    endDay: 81,
    totalSections: 81,
  },
  {
    name: '清静经',
    slugPrefix: 'qingjing',
    sourceRef: '太上老君说常清静经第{n}节',
    startDay: 82,
    endDay: 95,
    totalSections: 14,
  },
  {
    name: '太上感应篇',
    slugPrefix: 'ganying',
    sourceRef: '太上感应篇第{n}段',
    startDay: 96,
    endDay: 110,
    totalSections: 15,
  },
  {
    name: '庄子',
    slugPrefix: 'zhuangzi',
    sourceRef: '庄子选段第{n}则',
    startDay: 111,
    endDay: 120,
    totalSections: 10,
  },
]

function getDaoistSource(dayIndex: number): { source: DaoistSource; sectionIndex: number } {
  const source = DAOIST_SOURCES.find(
    (s) => dayIndex >= s.startDay && dayIndex <= s.endDay,
  )
  if (!source) throw new Error(`dayIndex ${dayIndex} out of Daoist range 1-120`)
  const sectionIndex = dayIndex - source.startDay + 1
  return { source, sectionIndex }
}

function formatDaoistSlug(slugPrefix: string, sectionIndex: number): string {
  return `${slugPrefix}-${String(sectionIndex).padStart(2, '0')}`
}

function formatDaoistSourceRef(template: string, n: number): string {
  return template.replace('{n}', String(n))
}

// ── Prompt Generators ──────────────────────────────────────────────────────

/**
 * Generate the full OpenAI prompt (system + user combined) for a Yijing daily lesson.
 *
 * @param hexagramData  - The hexagram entry from HEXAGRAM_DATA
 * @param lineIndex     - 1-6, which line of the hexagram
 * @param dayIndex      - 1-384, the overall day index
 * @param nature        - Hexagram nature: 'ji' | 'xiong' | 'ping' | 'mixed'
 */
export function generateYijingPrompt(
  hexagramData: HexagramData,
  lineIndex: number,
  dayIndex: number,
  nature: HexagramNature,
): string {
  const hexagramId = Math.ceil(dayIndex / 6)
  const lineNameZh = getLineNameZh(hexagramData.symbol, lineIndex)
  const lineNamePinyin = LINE_NAME_PINYIN[lineNameZh] ?? lineNameZh.toLowerCase()
  const hexagramPinyin = HEXAGRAM_PINYIN[hexagramId] ?? `hex${hexagramId}`

  const slug = `${hexagramPinyin}-${lineNamePinyin}`
  const title = `${hexagramData.nameZh}卦 · ${lineNameZh}`
  const cautionRequired = nature === 'xiong' || nature === 'mixed'

  const cautionInstruction = cautionRequired
    ? `caution 为必填（此卦性质为「${nature === 'xiong' ? '凶' : '吉凶混杂'}」），诚实指出此爻的潜在风险或误区，不要粉饰。40-80字，完整句子，以句号结尾。`
    : `caution 为可选。如果此爻有明显风险或常见误区，写 40-80 字完整句子；否则写「(无)」。`

  return `你是古典文化编辑专家，现在为「每日古典智慧·易经」系列撰写 Day ${dayIndex} 内容。

【基本信息】
- 卦名：${hexagramData.nameZh}卦（${hexagramData.traditionalName}）
- 爻位：${lineNameZh}
- 卦辞：${hexagramData.judgmentZh}
- 象传：${hexagramData.imageZh}
- 卦义：${hexagramData.interpretationZh}
- 上卦：${hexagramData.upperTrigram}，下卦：${hexagramData.lowerTrigram}
- 卦性：${nature}（${nature === 'ji' ? '吉' : nature === 'xiong' ? '凶' : nature === 'ping' ? '平' : '吉凶混杂'}）
- dayIndex：${dayIndex}
- slug：${slug}
- hexagramId：${hexagramId}

【输出格式】严格按下面的 Markdown 格式输出，**不要 JSON，不要代码块包裹**：

---
dayIndex: ${dayIndex}
school: yijing
hexagramId: ${hexagramId}
slug: ${slug}
title: ${title}
subtitle: （此爻的爻辞核心句，10-15字）
sourceRef: ${hexagramData.traditionalName}·${lineNameZh}
classicText: |
  （完整爻辞原文）
  （完整象辞原文）
---

## wisdom

[200-300字，三段式：
1. 爻辞本义解读（用「」引用原文关键词）
2. 现代职场/生活具体场景类比
3. 智慧总结（1-2句）
引用术语必须用「」或《》，禁止使用英文引号 "" '']

## action

[30-50字，动词开头，具体可操作的行动建议。必须以句号结尾。]

## caution

[${cautionInstruction}]

【约束条件】
1. classicText 必须是《周易》原典中该爻的实际文字，包含爻辞和象辞（象曰部分），不可杜撰。
2. wisdom 必须联系现代生活，有具体场景，避免空泛说教。wisdom 最后一个字符必须是「。」
3. action 必须以动词开头，30-50字，以句号结尾。
4. 所有字段使用简体中文。
5. 只输出上述 Markdown 格式，不要有任何前缀说明或后缀解释。
6. 引用古文术语一律用「」，引用书名用《》，禁止英文引号。

【示例输出（乾卦初九，仅供格式参考）】

---
dayIndex: 1
school: yijing
hexagramId: 1
slug: qian-chujiu
title: 乾卦 · 初九
subtitle: 潜龙勿用，蛰伏待时
sourceRef: 乾为天·初九
classicText: |
  初九：潜龙，勿用。
  象曰：潜龙勿用，阳在下也。
---

## wisdom

「潜龙勿用」是乾卦第一爻的核心教诲。「潜」字点明此时阳气虽足，却位居最下，如同蛰伏水底的龙，时机未到，不宜轻动。

在现代职场中，这份智慧处处适用：刚换新工作的你，或许已有改革想法，但贸然提出只会引发抵触；刚创业的团队，产品还未打磨成熟，过早大规模推广只会暴露短板。《象传》说「阳在下也」，正是提醒我们认清自己当前所处的位置。

真正的智者懂得在蛰伏期积蓄力量，把每一天的沉淀都变成未来腾飞的资本。

## action

识别一件你急于推进却准备不足的事，今天先做好前期调研和积累，不急于表态。

## caution

「潜龙勿用」并非永久退缩，切勿将蛰伏变成逃避行动的借口。需持续积累、静待时机，而非消极等待。

现在请为 **${hexagramData.traditionalName} · ${lineNameZh}** 生成课程内容：`
}

/**
 * Generate the full OpenAI prompt for a Daoist daily lesson.
 *
 * @param dayIndex - 1-120
 */
export function generateDaoistPrompt(dayIndex: number): string {
  const { source, sectionIndex } = getDaoistSource(dayIndex)
  const slug = formatDaoistSlug(source.slugPrefix, sectionIndex)
  const sourceRef = formatDaoistSourceRef(source.sourceRef, sectionIndex)

  // Source-specific context hints
  const sourceHints: Record<string, string> = {
    道德经: `老子《道德经》第 ${sectionIndex} 章。请引用该章的原文作为 classicText，并围绕其核心思想展开。`,
    清静经: `《太上老君说常清静经》第 ${sectionIndex} 节。这是道家修炼清静心法的经典，强调清心寡欲、返璞归真。`,
    太上感应篇: `《太上感应篇》第 ${sectionIndex} 段。这是道家劝善经典，强调因果报应、积德行善。`,
    庄子: `《庄子》选段第 ${sectionIndex} 则（可选自内篇或外篇中的经典段落）。庄子思想强调逍遥自在、顺应自然。`,
  }

  const hint = sourceHints[source.name] ?? `${source.name}第 ${sectionIndex} 节`

  return `你是一位精通道家哲学的国学导师，擅长将道家清静智慧与现代生活结合。现在为「每日古典智慧·道家」系列撰写 Day ${dayIndex} 内容。

【基本信息】
- 典籍：${source.name}
- 章节：第 ${sectionIndex} 节/章
- 出处：${sourceRef}
- dayIndex：${dayIndex}
- slug：${slug}

【典籍背景】
${hint}

【输出格式】严格按下面的 Markdown 格式输出，**不要 JSON，不要代码块包裹**：

---
dayIndex: ${dayIndex}
school: daoist
slug: ${slug}
title: （典籍名 · 章节，如：道德经 · 第十六章）
subtitle: （本章/节的核心主题或关键词，4-8字，如：归根复命）
sourceRef: ${sourceRef}
classicText: |
  （引用该章/节的经典原文核心段落，100-200字。长篇经典请节选最精华的部分，不可杜撰或改写）
---

## wisdom

[200-300字，三段式：
1. 经典原文核心思想解读（用「」引用原文关键词）
2. 现代生活具体场景类比（职场、人际、自我管理等）
3. 智慧总结（1-2句）
引用术语必须用「」或《》，禁止使用英文引号 \"\" '']

## action

[30-50字，动词开头，具体可操作的行动建议。必须以句号结尾。]

## meditation

[60-100字，2-3句话，引导读者进入冥想或反思状态。语言平和宁静，以句号结尾。]

【约束条件】
1. classicText 必须是该典籍的实际原文，不可杜撰或改写。长篇经典（如庄子）请节选最核心的100-200字段落。
2. wisdom 必须联系现代生活，有具体场景，避免空泛说教。wisdom 最后一个字符必须是「。」
3. action 必须以动词开头，30-50字，以句号结尾。
4. meditation 语言平和、引导性强，帮助读者放松身心，2-3句话，以句号结尾。
5. 所有字段使用简体中文。
6. 只输出上述 Markdown 格式，不要有任何前缀说明或后缀解释。
7. 引用古文术语一律用「」，引用书名用《》，禁止英文引号。

【示例输出（道德经第十六章，仅供格式参考）】

---
dayIndex: 16
school: daoist
slug: daodejing-16
title: 道德经 · 第十六章
subtitle: 归根复命
sourceRef: 道德经第16章
classicText: |
  致虚极，守静笃。万物并作，吾以观复。夫物芸芸，各复归其根。归根曰静，是谓复命。复命曰常，知常曰明。不知常，妄作凶。知常容，容乃公，公乃全，全乃天，天乃道，道乃久，没身不殆。
---

## wisdom

老子在这一章揭示了一个深刻的生命法则：「归根曰静，是谓复命」。万物生长繁茂，最终都要回归本源，这个回归的过程就是「静」，就是回到生命最本真的状态。

在快节奏的现代生活中，我们常常被工作、社交、信息轰炸所淹没，忘记了回归内心的宁静。一个项目刚结束就投入下一个，一条消息刚回复又来十条。我们像陀螺一样旋转，却很少停下来问自己：我的根在哪里？「致虚极，守静笃」不是要你什么都不做，而是在喧嚣中找到自己的根基。

每天留出片刻，放下手机，静坐感受呼吸，就是在践行这份归根的智慧。知道什么是恒常不变的，才能在变化中从容不迫。

## action

今天留出十分钟，放下所有电子设备，找一个安静的角落静坐，只关注自己的呼吸起伏。

## meditation

轻轻闭上眼睛，放松肩膀，感受每一次呼吸的起伏。想象自己是一棵大树，枝叶在风中摇曳，而根系深深扎入大地，稳固而宁静。让思绪如云朵般飘过，不追逐，不抗拒，只是静静观察。

现在请为 **${sourceRef}** 生成课程内容：`
}

// ── Response Parsers ───────────────────────────────────────────────────────

/**
 * Extract JSON from an LLM response that may wrap it in markdown code fences.
 */
function extractJSON(response: string): unknown {
  // Try to find ```json ... ``` block first
  const fenceMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/)
  let jsonStr = fenceMatch ? fenceMatch[1].trim() : response.trim()

  // First attempt: direct parse
  try {
    return JSON.parse(jsonStr)
  } catch {
    // Repair: fix unescaped control characters inside JSON string values
    // Replace literal newlines/tabs inside strings with escaped versions
    jsonStr = jsonStr.replace(/(?<=:\s*"[^"]*?)[\n\r]+/g, '\\n')
    // Fix smart quotes
    jsonStr = jsonStr.replace(/[\u201c\u201d]/g, '\\"')
    try {
      return JSON.parse(jsonStr)
    } catch {
      // Last resort: extract field by field with regex
      const fields: Record<string, string> = {}
      const fieldRegex = /"(\w+)"\s*:\s*"((?:[^"\\]|\\.)*)"/g
      let m
      while ((m = fieldRegex.exec(jsonStr)) !== null) {
        fields[m[1]] = m[2].replace(/\\n/g, '\n').replace(/\\"/g, '"')
      }
      if (Object.keys(fields).length >= 5) return fields
      throw new Error(`JSON repair failed, extracted only ${Object.keys(fields).length} fields`)
    }
  }
}

/**
 * Parse the LLM Markdown response for a Yijing lesson into DailyLesson fields.
 * Extracts YAML frontmatter and ## sections (wisdom, action, caution).
 */
export function parseYijingResponse(
  response: string,
  dayIndex: number,
): YijingLessonFields {
  const hexagramId = Math.ceil(dayIndex / 6)

  // Extract YAML frontmatter between --- markers
  const frontmatterMatch = response.match(/---\s*\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) {
    // Fallback: try JSON parse for backward compatibility
    const raw = extractJSON(response) as Record<string, unknown>
    return parseYijingFromRaw(raw, dayIndex, hexagramId)
  }

  const frontmatter = frontmatterMatch[1]
  const body = response.slice(frontmatterMatch.index! + frontmatterMatch[0].length)

  // Parse frontmatter fields
  const fm: Record<string, string> = {}
  let currentKey = ''
  let multilineValue = ''
  let inMultiline = false

  for (const line of frontmatter.split('\n')) {
    if (inMultiline) {
      if (/^\S/.test(line) && line.includes(':') && !line.startsWith('  ')) {
        // New key starts — save accumulated multiline
        fm[currentKey] = multilineValue.trim()
        inMultiline = false
        // Fall through to parse this line as a new key
      } else {
        multilineValue += (multilineValue ? '\n' : '') + line.replace(/^  /, '')
        continue
      }
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      const value = kvMatch[2].trim()
      if (value === '|') {
        inMultiline = true
        multilineValue = ''
      } else {
        fm[currentKey] = value
      }
    }
  }
  if (inMultiline && currentKey) {
    fm[currentKey] = multilineValue.trim()
  }

  // Extract ## sections from body
  const sections: Record<string, string> = {}
  const sectionRegex = /## (\w+)\s*\n([\s\S]*?)(?=\n## |\n*$)/g
  let match
  while ((match = sectionRegex.exec(body)) !== null) {
    sections[match[1]] = match[2].trim()
  }

  // Build result
  const result: YijingLessonFields = {
    school: 'yijing',
    dayIndex,
    hexagramId,
    slug: fm.slug ?? '',
    title: fm.title ?? '',
    subtitle: fm.subtitle ?? '',
    classicText: fm.classicText ?? '',
    wisdom: sections.wisdom ?? '',
    action: sections.action ?? '',
    sourceRef: fm.sourceRef ?? '',
  }

  // Validate required fields
  const required: (keyof YijingLessonFields)[] = ['slug', 'title', 'subtitle', 'classicText', 'wisdom', 'action', 'sourceRef']
  for (const field of required) {
    if (!result[field]) {
      throw new Error(`parseYijingResponse: missing field "${field}"`)
    }
  }

  // caution — optional, skip if "(无)" or empty
  const caution = sections.caution ?? ''
  if (caution && caution !== '(无)' && caution !== '（无）') {
    result.caution = caution
  }

  return result
}

/** Backward-compatible: parse from raw JSON object */
function parseYijingFromRaw(
  raw: Record<string, unknown>,
  dayIndex: number,
  hexagramId: number,
): YijingLessonFields {
  const required = ['slug', 'title', 'subtitle', 'classicText', 'wisdom', 'action', 'sourceRef']
  for (const field of required) {
    if (!raw[field] || typeof raw[field] !== 'string') {
      throw new Error(`parseYijingResponse: missing or invalid field "${field}"`)
    }
  }

  const result: YijingLessonFields = {
    school: 'yijing',
    dayIndex,
    hexagramId,
    slug: raw.slug as string,
    title: raw.title as string,
    subtitle: raw.subtitle as string,
    classicText: raw.classicText as string,
    wisdom: raw.wisdom as string,
    action: raw.action as string,
    sourceRef: raw.sourceRef as string,
  }

  if (raw.caution && typeof raw.caution === 'string' && raw.caution.trim()) {
    result.caution = raw.caution.trim()
  }

  return result
}

/**
 * Parse the LLM response for a Daoist lesson into DailyLesson fields.
 * Supports both Markdown (new) and JSON (legacy) formats.
 */
export function parseDaoistResponse(
  response: string,
  dayIndex: number,
): DaoistLessonFields {
  // Try Markdown format first (--- frontmatter + ## sections)
  const frontmatterMatch = response.match(/---\s*\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    return parseDaoistMarkdown(response, frontmatterMatch, dayIndex)
  }

  // Fallback: JSON format
  const raw = extractJSON(response) as Record<string, unknown>
  const required = ['slug', 'title', 'subtitle', 'classicText', 'wisdom', 'action', 'meditation', 'sourceRef']
  for (const field of required) {
    if (!raw[field] || typeof raw[field] !== 'string') {
      throw new Error(`parseDaoistResponse: missing or invalid field "${field}"`)
    }
  }

  return {
    school: 'daoist',
    dayIndex,
    slug: raw.slug as string,
    title: raw.title as string,
    subtitle: raw.subtitle as string,
    classicText: raw.classicText as string,
    wisdom: raw.wisdom as string,
    action: raw.action as string,
    meditation: raw.meditation as string,
    sourceRef: raw.sourceRef as string,
  }
}

/** Parse Daoist lesson from Markdown format (frontmatter + ## sections) */
function parseDaoistMarkdown(
  response: string,
  frontmatterMatch: RegExpMatchArray,
  dayIndex: number,
): DaoistLessonFields {
  const frontmatter = frontmatterMatch[1]
  const body = response.slice(frontmatterMatch.index! + frontmatterMatch[0].length)

  // Parse frontmatter fields (reuse same logic as Yijing parser)
  const fm: Record<string, string> = {}
  let currentKey = ''
  let multilineValue = ''
  let inMultiline = false

  for (const line of frontmatter.split('\n')) {
    if (inMultiline) {
      if (/^\S/.test(line) && line.includes(':') && !line.startsWith('  ')) {
        fm[currentKey] = multilineValue.trim()
        inMultiline = false
      } else {
        multilineValue += (multilineValue ? '\n' : '') + line.replace(/^  /, '')
        continue
      }
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      const value = kvMatch[2].trim()
      if (value === '|') {
        inMultiline = true
        multilineValue = ''
      } else {
        fm[currentKey] = value
      }
    }
  }
  if (inMultiline && currentKey) {
    fm[currentKey] = multilineValue.trim()
  }

  // Extract ## sections from body
  const sections: Record<string, string> = {}
  const sectionRegex = /## (\w+)\s*\n([\s\S]*?)(?=\n## |\n*$)/g
  let match
  while ((match = sectionRegex.exec(body)) !== null) {
    sections[match[1]] = match[2].trim()
  }

  const result: DaoistLessonFields = {
    school: 'daoist',
    dayIndex,
    slug: fm.slug ?? '',
    title: fm.title ?? '',
    subtitle: fm.subtitle ?? '',
    classicText: fm.classicText ?? '',
    wisdom: sections.wisdom ?? '',
    action: sections.action ?? '',
    meditation: sections.meditation ?? '',
    sourceRef: fm.sourceRef ?? '',
  }

  // Validate required fields
  const required: (keyof DaoistLessonFields)[] = ['slug', 'title', 'subtitle', 'classicText', 'wisdom', 'action', 'meditation', 'sourceRef']
  for (const field of required) {
    if (!result[field]) {
      throw new Error(`parseDaoistResponse: missing field "${field}"`)
    }
  }

  return result
}
