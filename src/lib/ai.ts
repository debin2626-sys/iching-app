import OpenAI from 'openai';
import { calculateBazi, type BirthInfo } from './iching/bazi';
import { getScenarioPrompt } from './prompts/scenarios';
import { searchKnowledgeWithTimeout, formatRAGContext } from './rag';

// 双客户端：国内走 DeepSeek，海外走 OpenAI
const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type InterpretDepth = 'simple' | 'detailed' | 'deep';

interface InterpretationParams {
  hexagramNumber: number;
  changingLines: number[];
  question: string;
  locale: string;
  depth?: InterpretDepth;
  birthInfo?: BirthInfo;
  gender?: string;
  scenarioId?: string;
  subScenarioId?: string;
}

const SYSTEM_PROMPT_ZH = `你是一位精通周易和命理学的国学大师，同时也是一个特别会聊天的朋友。你的易学功底很深，但你从不掉书袋、不装腔作势。

你的表达风格：
- 用大白话解释卦象，别堆砌文言文。该引用原文时引用，但一定要紧跟着用白话翻译
- 像跟朋友聊天一样给建议，亲切自然，有温度
- 多用比喻和生活中的例子，让人一听就懂
- 少用"故""乃""则""宜""忌"等文言词汇
- 多用"就是说""简单来说""打个比方""换句话说"等口语连接词
- 可以适当用一些接地气的表达，但不要太随意，保持专业感
- 给建议要具体、实在，别说空话套话

记住：你的目标是让完全不懂易经的人也能听明白，并且觉得"这个建议真的有用"。`;

const SYSTEM_PROMPT_EN = `You are a holistic wellness guide who draws upon the ancient wisdom of the I Ching (Book of Changes). Your interpretations focus on personal growth, mindfulness, and well-being. Blend Eastern philosophy with modern wellness practices. Respond with warmth, empathy, and actionable self-care insights.`;

function buildUserPromptZH(params: InterpretationParams): string {
  const { hexagramNumber, changingLines, question, birthInfo, gender, depth = 'detailed', scenarioId } = params;
  const changingDesc = changingLines.length > 0
    ? `动爻：第 ${changingLines.join('、')} 爻`
    : '无动爻';

  const genderDesc = gender === 'male' ? '男' : gender === 'female' ? '女' : '';

  let baziSection = '';
  if (birthInfo) {
    const bazi = calculateBazi(birthInfo);
    baziSection = `
## 命主八字信息
- 四柱：${bazi.yearPillar.gan}${bazi.yearPillar.zhi}年 ${bazi.monthPillar.gan}${bazi.monthPillar.zhi}月 ${bazi.dayPillar.gan}${bazi.dayPillar.zhi}日 ${bazi.hourPillar.gan}${bazi.hourPillar.zhi}时
- 日主：${bazi.dayMaster}（${bazi.dayMasterElement}）
- 日主强弱：${bazi.strength}
- 五行分布：金${bazi.wuxing['金']} 木${bazi.wuxing['木']} 水${bazi.wuxing['水']} 火${bazi.wuxing['火']} 土${bazi.wuxing['土']}
- 出生年份：${birthInfo.year}年${genderDesc ? `\n- 性别：${genderDesc}` : ''}

`;
  }

  // Depth-specific instructions
  const depthInstructions = getDepthInstructions(depth);

  // Scenario-specific guidance
  const scenarioPrompt = getScenarioPrompt(scenarioId);
  const scenarioGuidance = scenarioPrompt ? `\n${scenarioPrompt.guidance.zh}\n` : '';

  if (birthInfo) {
    return `${baziSection}我求得第 ${hexagramNumber} 卦，${changingDesc}。

我的问题是：${question}

${depthInstructions}
${scenarioGuidance}
${scenarioGuidance ? '' : `请从以下维度进行综合解读：

1. **命主八字分析**：根据四柱八字，分析命主的先天禀赋、性格特质和五行喜忌
2. **当前运势概览**：结合流年运势，分析命主当前所处的运势阶段
3. **卦象与命理交叉解读**：此卦象如何呼应命主当前的运势？卦象揭示的信息与八字命理是否一致？有何互补之处？
4. **针对所问之事的综合判断**：结合八字运势和卦象，对所问之事给出全面的分析和判断
5. **行动建议**：结合命主五行喜忌和卦象启示，给出具体可行的建议`}

请保持解读的深度与实用性，将命理与卦象有机融合，体现传统文化底蕴。`;
  }

  return `我求得第 ${hexagramNumber} 卦，${changingDesc}。

我的问题是：${question}

${depthInstructions}
${scenarioGuidance}
${scenarioGuidance ? '' : `请从以下维度进行解读：

1. **卦象总论**：引用卦辞、彖辞，阐述此卦的核心义理，结合问题给出整体判断
2. **动爻解析**：${changingLines.length > 0 ? '逐一引用爻辞原文，解读每个动爻的含义及其对当前处境的启示' : '本卦无动爻，请解读卦辞的静态含义'}
3. **变卦趋势**：${changingLines.length > 0 ? '变卦所揭示的发展方向与未来走势' : '当前局势的稳定性分析'}
4. **行动建议**：结合传统智慧与现代生活，给出具体可行的建议`}

请保持解读的深度与实用性，体现传统文化底蕴。`;
}

/** Depth-specific prompt instructions */
function getDepthInstructions(depth: InterpretDepth): string {
  switch (depth) {
    case 'simple':
      return '【要求】请用100字以内简要回答，只给出核心要点和结论，不需要展开分析。语言精炼，直击要害。';
    case 'deep':
      return '【要求】请进行800字以上的深度解读，包含：历史典故引用、五行生克分析、卦象象数详解、古籍原文引用（如《周易正义》《易传》等），以及与当代生活的深层关联。力求全面深入，展现易学精髓。';
    case 'detailed':
    default:
      return '【要求】请用300-500字进行完整分析，涵盖各个维度，给出清晰的判断和建议。';
  }
}

function buildUserPromptEN(params: InterpretationParams): string {
  const { hexagramNumber, changingLines, question, scenarioId } = params;
  const changingDesc = changingLines.length > 0
    ? `Changing lines: line ${changingLines.join(', ')}`
    : 'No changing lines';

  // Scenario-specific guidance
  const scenarioPrompt = getScenarioPrompt(scenarioId);
  const scenarioGuidance = scenarioPrompt ? `\n${scenarioPrompt.guidance.en}\n` : '';

  return `I cast Hexagram ${hexagramNumber}. ${changingDesc}.

My question: ${question}
${scenarioGuidance}
${scenarioGuidance ? '' : `Please interpret from a wellness perspective:

1. **Overview**: Core meaning of this hexagram as it relates to my personal growth and well-being
2. **Changing Lines Analysis**: ${changingLines.length > 0 ? 'Interpret each changing line as guidance for my inner journey' : 'No changing lines — interpret the stable energy and what it means for my current state'}
3. **Transformation Trend**: ${changingLines.length > 0 ? 'What the transformed hexagram reveals about my path forward' : 'Analysis of the present equilibrium and how to maintain it'}
4. **Wellness Advice**: Concrete self-care practices, mindfulness tips, and actionable steps for daily life`}

Keep the interpretation grounded in well-being while honoring the ancient wisdom.`;
}

/** max_tokens by depth */
function getMaxTokensForDepth(depth: InterpretDepth): number {
  switch (depth) {
    case 'simple': return 500;
    case 'deep': return 4000;
    case 'detailed':
    default: return 2000;
  }
}

/** 根据 locale 选择客户端和模型，返回流式响应（含 RAG 知识注入） */
export async function getAIInterpretation(params: InterpretationParams) {
  const isZH = !params.locale || params.locale.startsWith('zh');
  const depth = params.depth || 'detailed';

  // 场景化系统提示词：如果有场景，使用场景专属的系统提示词
  const scenarioPrompt = getScenarioPrompt(params.scenarioId);
  let systemPrompt: string;
  if (scenarioPrompt) {
    systemPrompt = isZH ? scenarioPrompt.system.zh : scenarioPrompt.system.en;
  } else {
    systemPrompt = isZH ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;
  }

  const userPrompt = isZH ? buildUserPromptZH(params) : buildUserPromptEN(params);

  // RAG 知识检索（3秒超时，失败则跳过）
  let ragContext = '';
  if (isZH && params.question) {
    try {
      const ragResult = await searchKnowledgeWithTimeout(
        params.question,
        params.hexagramNumber,
        5,
        3000
      );
      ragContext = formatRAGContext(ragResult);
    } catch {
      // RAG 失败不影响主流程
    }
  }

  // 将 RAG 知识注入到用户 prompt 前面
  const finalUserPrompt = ragContext
    ? `${ragContext}\n\n---\n\n${userPrompt}`
    : userPrompt;

  return {
    client: isZH ? deepseekClient : openaiClient,
    model: isZH ? 'deepseek-chat' : 'gpt-4o',
    messages: [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: finalUserPrompt },
    ],
    stream: true as const,
    temperature: 0.8,
    max_tokens: getMaxTokensForDepth(depth),
  };
}
