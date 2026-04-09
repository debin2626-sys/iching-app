export function getHexagramName(num: number): string {
  const names: Record<number, string> = {
    1: "乾", 2: "坤", 3: "屯", 4: "蒙", 5: "需", 6: "讼", 7: "师", 8: "比",
    9: "小畜", 10: "履", 11: "泰", 12: "否", 13: "同人", 14: "大有", 15: "谦", 16: "豫",
    17: "随", 18: "蛊", 19: "临", 20: "观", 21: "噬嗑", 22: "贲", 23: "剥", 24: "复",
    25: "无妄", 26: "大畜", 27: "颐", 28: "大过", 29: "坎", 30: "离", 31: "咸", 32: "恒",
    33: "遁", 34: "大壮", 35: "晋", 36: "明夷", 37: "家人", 38: "睽", 39: "蹇", 40: "解",
    41: "损", 42: "益", 43: "夬", 44: "姤", 45: "萃", 46: "升", 47: "困", 48: "井",
    49: "革", 50: "鼎", 51: "震", 52: "艮", 53: "渐", 54: "归妹", 55: "丰", 56: "旅",
    57: "巽", 58: "兑", 59: "涣", 60: "节", 61: "中孚", 62: "小过", 63: "既济", 64: "未济"
  };
  return names[num] || "";
}

export function buildMultiDimensionPrompt({
  hexagramName,
  hexagramNumber,
  changingLines,
  question,
  scenario,
  ragContext
}: {
  hexagramName: string;
  hexagramNumber: number;
  changingLines: number[];
  question: string;
  scenario?: string;
  ragContext?: string;
}) {
  const changingDesc = changingLines.length > 0
    ? `动爻：第 ${changingLines.join('、')} 爻`
    : '无动爻';

  const systemPrompt = `你是一位精通周易的易学大师，擅长从多个维度（象、数、理、占）对卦象进行立体式分析。

你的风格：
1. 深入浅出，用现代语言解释古老智慧
2. 结构清晰，多用小标题分段
3. 具有人文关怀，提供切实可行的建议

分析维度建议：
- 卦象本义与时代启示
- 所问之事在当前卦象下的演变趋势
- 阴阳消长与五行生克的逻辑分析
- 给用户具体的行动建议（宜做/不宜做）`;

  const userPrompt = `
${ragContext ? `参考知识：\n${ragContext}\n\n` : ''}
我求得第 ${hexagramNumber} 卦（${hexagramName}卦），${changingDesc}。
我的问题是：${question}

请结合周易原理和现代心理学/决策学，进行多维度分析：

1. **核心象义**：这个卦象在当前问题情境下代表什么核心意象？
2. **演变逻辑**：结合动爻，分析这件事的发展趋势和关键转折点。
3. **多维洞察**：
   - 心理维度：当前状态下的心态如何调整？
   - 行动维度：有哪些具体的建议或避坑指南？
4. **结语建议**：总结一下对我的建议。

请用深入浅出的语言，分段清晰地回答。`;

  return { systemPrompt, userPrompt };
}
