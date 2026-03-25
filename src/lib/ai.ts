import OpenAI from 'openai';
import { calculateBazi, type BirthInfo } from './iching/bazi';

// 双客户端：国内走 DeepSeek，海外走 OpenAI
const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface InterpretationParams {
  hexagramNumber: number;
  changingLines: number[];
  question: string;
  locale: string;
  birthInfo?: BirthInfo;
}

const SYSTEM_PROMPT_ZH = `你是一位精通周易和命理学的国学大师，深谙传统文化精髓，擅长将八字命理与卦象解读相结合。你的解读植根于经典易学，引用古籍原文，语言典雅古朴而不晦涩。请以传统文化传承者的身份，用温和而庄重的语气回答，注重义理与象数的结合，给出全面深入的综合分析。`;

const SYSTEM_PROMPT_EN = `You are a holistic wellness guide who draws upon the ancient wisdom of the I Ching (Book of Changes). Your interpretations focus on personal growth, mindfulness, and well-being. Blend Eastern philosophy with modern wellness practices. Respond with warmth, empathy, and actionable self-care insights.`;

function buildUserPromptZH(params: InterpretationParams): string {
  const { hexagramNumber, changingLines, question, birthInfo } = params;
  const changingDesc = changingLines.length > 0
    ? `动爻：第 ${changingLines.join('、')} 爻`
    : '无动爻';

  let baziSection = '';
  if (birthInfo) {
    const bazi = calculateBazi(birthInfo);
    baziSection = `
## 命主八字信息
- 四柱：${bazi.yearPillar.gan}${bazi.yearPillar.zhi}年 ${bazi.monthPillar.gan}${bazi.monthPillar.zhi}月 ${bazi.dayPillar.gan}${bazi.dayPillar.zhi}日 ${bazi.hourPillar.gan}${bazi.hourPillar.zhi}时
- 日主：${bazi.dayMaster}（${bazi.dayMasterElement}）
- 日主强弱：${bazi.strength}
- 五行分布：金${bazi.wuxing['金']} 木${bazi.wuxing['木']} 水${bazi.wuxing['水']} 火${bazi.wuxing['火']} 土${bazi.wuxing['土']}
- 出生年份：${birthInfo.year}年

`;
  }

  if (birthInfo) {
    return `${baziSection}我求得第 ${hexagramNumber} 卦，${changingDesc}。

我的问题是：${question}

请从以下维度进行综合解读：

1. **命主八字分析**：根据四柱八字，分析命主的先天禀赋、性格特质和五行喜忌
2. **当前运势概览**：结合流年运势，分析命主当前所处的运势阶段
3. **卦象与命理交叉解读**：此卦象如何呼应命主当前的运势？卦象揭示的信息与八字命理是否一致？有何互补之处？
4. **针对所问之事的综合判断**：结合八字运势和卦象，对所问之事给出全面的分析和判断
5. **行动建议**：结合命主五行喜忌和卦象启示，给出具体可行的建议

请保持解读的深度与实用性，将命理与卦象有机融合，体现传统文化底蕴。`;
  }

  return `我求得第 ${hexagramNumber} 卦，${changingDesc}。

我的问题是：${question}

请从以下维度进行解读：

1. **卦象总论**：引用卦辞、彖辞，阐述此卦的核心义理，结合问题给出整体判断
2. **动爻解析**：${changingLines.length > 0 ? '逐一引用爻辞原文，解读每个动爻的含义及其对当前处境的启示' : '本卦无动爻，请解读卦辞的静态含义'}
3. **变卦趋势**：${changingLines.length > 0 ? '变卦所揭示的发展方向与未来走势' : '当前局势的稳定性分析'}
4. **行动建议**：结合传统智慧与现代生活，给出具体可行的建议

请保持解读的深度与实用性，体现传统文化底蕴。`;
}

function buildUserPromptEN(params: InterpretationParams): string {
  const { hexagramNumber, changingLines, question } = params;
  const changingDesc = changingLines.length > 0
    ? `Changing lines: line ${changingLines.join(', ')}`
    : 'No changing lines';

  return `I cast Hexagram ${hexagramNumber}. ${changingDesc}.

My question: ${question}

Please interpret from a wellness perspective:

1. **Overview**: Core meaning of this hexagram as it relates to my personal growth and well-being
2. **Changing Lines Analysis**: ${changingLines.length > 0 ? 'Interpret each changing line as guidance for my inner journey' : 'No changing lines — interpret the stable energy and what it means for my current state'}
3. **Transformation Trend**: ${changingLines.length > 0 ? 'What the transformed hexagram reveals about my path forward' : 'Analysis of the present equilibrium and how to maintain it'}
4. **Wellness Advice**: Concrete self-care practices, mindfulness tips, and actionable steps for daily life

Keep the interpretation grounded in well-being while honoring the ancient wisdom.`;
}

/** 根据 locale 选择客户端和模型，返回流式响应 */
export function getAIInterpretation(params: InterpretationParams) {
  const isZH = !params.locale || params.locale.startsWith('zh');
  const systemPrompt = isZH ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;
  const userPrompt = isZH ? buildUserPromptZH(params) : buildUserPromptEN(params);

  return {
    client: isZH ? deepseekClient : openaiClient,
    model: isZH ? 'deepseek-chat' : 'gpt-4o',
    messages: [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ],
    stream: true as const,
    temperature: 0.8,
    max_tokens: 3000, // 增加 token 上限，八字解读内容更多
  };
}
