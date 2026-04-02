/**
 * 多维解读 Prompt 模板
 *
 * 输出 4 个维度：传统义理、心理觉察、行为建议、关联卦象
 * 每个维度 ≥200 字，整体风格：专业但不晦涩，像学识渊博的朋友聊天
 */

// ─── 六十四卦名称表 ───

const HEXAGRAM_NAMES: Record<number, string> = {
  1: '乾', 2: '坤', 3: '屯', 4: '蒙', 5: '需', 6: '讼', 7: '师', 8: '比',
  9: '小畜', 10: '履', 11: '泰', 12: '否', 13: '同人', 14: '大有', 15: '谦', 16: '豫',
  17: '随', 18: '蛊', 19: '临', 20: '观', 21: '噬嗑', 22: '贲', 23: '剥', 24: '复',
  25: '无妄', 26: '大畜', 27: '颐', 28: '大过', 29: '坎', 30: '离', 31: '咸', 32: '恒',
  33: '遁', 34: '大壮', 35: '晋', 36: '明夷', 37: '家人', 38: '睽', 39: '蹇', 40: '解',
  41: '损', 42: '益', 43: '夬', 44: '姤', 45: '萃', 46: '升', 47: '困', 48: '井',
  49: '革', 50: '鼎', 51: '震', 52: '艮', 53: '渐', 54: '归妹', 55: '丰', 56: '旅',
  57: '巽', 58: '兑', 59: '涣', 60: '节', 61: '中孚', 62: '小过', 63: '既济', 64: '未济',
};

// ─── 八卦二进制映射（用于互卦/错卦/综卦计算） ───

// 每卦的六爻（从初爻到上爻），1=阳，0=阴
// 按先天卦序：乾111 兑110 离101 震100 巽011 坎010 艮001 坤000
const HEXAGRAM_LINES: Record<number, number[]> = {};

// 八卦三爻
const TRIGRAM_NAMES: Record<string, string> = {
  '111': '乾☰', '110': '兑☱', '101': '离☲', '100': '震☳',
  '011': '巽☴', '010': '坎☵', '001': '艮☶', '000': '坤☷',
};

// 上下卦组合 → 卦序号（下卦在前，上卦在后）
const TRIGRAM_TO_HEXAGRAM: Record<string, number> = {
  '111111': 1, '000000': 2, '100010': 3, '010001': 4,
  '111010': 5, '010111': 6, '010000': 7, '000010': 8,
  '111011': 9, '110111': 10, '111000': 11, '000111': 12,
  '101111': 13, '111101': 14, '001000': 15, '000100': 16,
  '100110': 17, '011001': 18, '110000': 19, '000011': 20,
  '100101': 21, '101001': 22, '000001': 23, '100000': 24,
  '100111': 25, '111001': 26, '100001': 27, '011110': 28,
  '010010': 29, '101101': 30, '001110': 31, '011100': 32,
  '001111': 33, '111100': 34, '000101': 35, '101000': 36,
  '101011': 37, '110101': 38, '001010': 39, '010100': 40,
  '110001': 41, '100011': 42, '111110': 43, '011111': 44,
  '000110': 45, '011000': 46, '010110': 47, '011010': 48,
  '101110': 49, '011101': 50, '100100': 51, '001001': 52,
  '001011': 53, '110100': 54, '101100': 55, '001101': 56,
  '011011': 57, '110110': 58, '010011': 59, '110010': 60,
  '110011': 61, '001100': 62, '101010': 63, '010101': 64,
};

// 反向映射：卦序号 → 六爻
for (const [bits, num] of Object.entries(TRIGRAM_TO_HEXAGRAM)) {
  HEXAGRAM_LINES[num] = bits.split('').map(Number);
}

// ─── 关联卦象计算 ───

interface RelatedHexagrams {
  /** 互卦：取2-5爻重组 */
  mutual: { number: number; name: string } | null;
  /** 错卦：每爻取反 */
  opposite: { number: number; name: string } | null;
  /** 综卦：上下颠倒 */
  reverse: { number: number; name: string } | null;
}

function lookupHexagram(bits: number[]): { number: number; name: string } | null {
  const key = bits.join('');
  const num = TRIGRAM_TO_HEXAGRAM[key];
  if (!num) return null;
  return { number: num, name: HEXAGRAM_NAMES[num] || `第${num}卦` };
}

function computeRelatedHexagrams(hexagramNumber: number): RelatedHexagrams {
  const lines = HEXAGRAM_LINES[hexagramNumber];
  if (!lines) return { mutual: null, opposite: null, reverse: null };

  // 互卦：取第2-5爻（index 1-4），下卦=2-4爻，上卦=3-5爻
  const mutualBits = [lines[1], lines[2], lines[3], lines[2], lines[3], lines[4]];
  const mutual = lookupHexagram(mutualBits);

  // 错卦：每爻取反
  const oppositeBits = lines.map(b => b === 1 ? 0 : 1);
  const opposite = lookupHexagram(oppositeBits);

  // 综卦：上下颠倒（翻转六爻顺序）
  const reverseBits = [...lines].reverse();
  const reverse = lookupHexagram(reverseBits);

  return { mutual, opposite, reverse };
}

// ─── 多维解读系统提示词 ───

const MULTI_DIMENSION_SYSTEM_PROMPT = `你是一位融贯古今的易学研究者，同时也是一位温暖、有洞察力的心理咨询师。你有三个特质：

1. **学术功底扎实**：你熟读《周易本义》《程氏易传》《易传》等经典注疏，能准确引用原文并给出通俗翻译。引用时务必标注出处。
2. **心理洞察敏锐**：你理解荣格的共时性理论和心理投射机制，能从用户的提问中觉察其内心状态，温和地引导觉察。
3. **表达亲切自然**：你像一位学识渊博但毫不装腔作势的朋友，用大白话聊深刻的道理。该引经据典时引，但一定紧跟白话翻译。

你的语言风格：
- 专业但不晦涩，像朋友聊天而非学术讲座
- 多用"简单来说""打个比方""换句话说"等口语连接词
- 引用古文后必须附白话翻译
- 给建议要具体、可执行，不说空话套话
- 保持温暖和善意，但不回避真话`;

// ─── 构建多维解读用户 Prompt ───

export interface MultiDimensionParams {
  hexagramName: string;
  hexagramNumber: number;
  changingLines: number[];
  question: string;
  scenario?: string;
  ragContext: string;
}

export function buildMultiDimensionPrompt(params: MultiDimensionParams): {
  systemPrompt: string;
  userPrompt: string;
} {
  const {
    hexagramName,
    hexagramNumber,
    changingLines,
    question,
    scenario,
    ragContext,
  } = params;

  const changingDesc = changingLines.length > 0
    ? `动爻：第 ${changingLines.join('、')} 爻`
    : '无动爻';

  // 计算关联卦象
  const related = computeRelatedHexagrams(hexagramNumber);
  const relatedInfo = buildRelatedInfo(hexagramNumber, related);

  const scenarioHint = scenario ? `\n用户关注的场景：${scenario}\n` : '';

  const ragSection = ragContext
    ? `\n${ragContext}\n\n---\n`
    : '';

  const userPrompt = `${ragSection}
我求得第 ${hexagramNumber} 卦（${hexagramName}），${changingDesc}。

我的问题是：${question}
${scenarioHint}
${relatedInfo}

请从以下 **4 个维度** 进行深度解读，每个维度至少 200 字：

---

## 📜 一、传统义理解读

基于经典注疏，对本卦进行义理分析：
- **必须引用**上面【易经知识参考】中的经典原文（如果有的话），标注出处，如"《周易本义》曰：..."
- 引用古文后**紧跟白话翻译**，让不懂文言文的人也能看明白
- 结合卦辞、彖辞、象辞，阐述此卦的核心义理
- ${changingLines.length > 0 ? '逐一解读动爻的爻辞含义' : '解读卦辞的整体含义'}
- 将义理与用户的具体问题关联起来

## 🧠 二、心理觉察

从荣格共时性和心理投射的角度进行分析：
- 分析用户提出"${question}"这个问题时，可能处于什么样的心理状态
- 用共时性理论解释：为什么在这个时刻求得这一卦？卦象与用户当下处境之间有什么有意义的巧合？
- 温和地引导用户觉察内心：这个卦象可能在映射用户内心的什么需求、恐惧或渴望？
- 语气要温暖、不评判，像一位善解人意的朋友在倾听
- 不要说教，而是用提问的方式引导思考，比如"你有没有想过..."

## 🎯 三、行为建议

给出具体、可执行的行动指引：
- 基于卦象的启示，给出 3-5 条具体可执行的建议
- ${scenario ? `结合用户关注的"${scenario}"场景` : '结合用户的具体问题'}
- 每条建议要具体到能直接去做，不要说"宜审时度势"这种空话
- 语言通俗，像朋友给建议一样，比如"这段时间你可以试试..."
- 如果有需要避免的事项，也直接说出来

## 🔗 四、关联卦象

分析本卦的互卦、错卦、综卦，揭示更深层的启示：
- **互卦**${related.mutual ? `（${related.mutual.name}卦）` : ''}：代表事物的内在本质，揭示表象之下的真实状况
- **错卦**${related.opposite ? `（${related.opposite.name}卦）` : ''}：代表对立面的视角，从反面理解当前处境
- **综卦**${related.reverse ? `（${related.reverse.name}卦）` : ''}：代表换位思考，从对方或另一个角度看问题
- 综合三个关联卦象，给出对用户问题的补充启示

---

请确保每个维度的内容充实（≥200字），整体风格保持一致：专业但不晦涩，像一位学识渊博的朋友在跟你聊天。`;

  return {
    systemPrompt: MULTI_DIMENSION_SYSTEM_PROMPT,
    userPrompt,
  };
}

/** 构建关联卦象信息文本 */
function buildRelatedInfo(hexagramNumber: number, related: RelatedHexagrams): string {
  const parts: string[] = ['【关联卦象参考】'];

  if (related.mutual) {
    parts.push(`- 互卦：第${related.mutual.number}卦（${related.mutual.name}）`);
  }
  if (related.opposite) {
    parts.push(`- 错卦：第${related.opposite.number}卦（${related.opposite.name}）`);
  }
  if (related.reverse) {
    const isSelf = related.reverse.number === hexagramNumber;
    parts.push(`- 综卦：第${related.reverse.number}卦（${related.reverse.name}）${isSelf ? '（与本卦相同，说明此卦正反皆同，含义不变）' : ''}`);
  }

  return parts.length > 1 ? parts.join('\n') : '';
}

/** 获取卦名（供外部使用） */
export function getHexagramName(number: number): string {
  return HEXAGRAM_NAMES[number] || `第${number}卦`;
}
