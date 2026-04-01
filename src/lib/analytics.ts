/* Google Analytics 4 custom event tracking */

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function sendEvent({ action, ...params }: GTagEvent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

// ── 占卜流程事件 ──

/** 用户开始占卜（进入摇卦页） */
export function trackDivinationStart(question: string) {
  sendEvent({
    action: "divination_start",
    category: "divination",
    label: question.slice(0, 100),
  });
}

/** 完成占卜（六爻已成） */
export function trackDivinationComplete(hexagramNumber: number, hexagramName: string) {
  sendEvent({
    action: "divination_complete",
    category: "divination",
    label: `${hexagramNumber}_${hexagramName}`,
    value: hexagramNumber,
    hexagram_number: hexagramNumber,
    hexagram_name: hexagramName,
  });
}

// ── 静心引导事件 ──

/** 完成静心引导 */
export function trackMeditationComplete() {
  sendEvent({
    action: "meditation_complete",
    category: "meditation",
  });
}

/** 跳过静心引导 */
export function trackMeditationSkip() {
  sendEvent({
    action: "meditation_skip",
    category: "meditation",
  });
}

// ── 场景选择事件 ──

/** 选择场景 */
export function trackScenarioSelect(scenarioId: string, subScenarioId?: string) {
  sendEvent({
    action: "scenario_select",
    category: "scenario",
    label: subScenarioId ? `${scenarioId}/${subScenarioId}` : scenarioId,
    scenario_id: scenarioId,
    sub_scenario_id: subScenarioId,
  });
}

// ── AI 解读事件 ──

/** 开始 AI 解读 */
export function trackAIInterpretStart(hexagramNumber: number, depth: string) {
  sendEvent({
    action: "ai_interpret_start",
    category: "ai",
    label: `hex_${hexagramNumber}_${depth}`,
    hexagram_number: hexagramNumber,
    depth,
  });
}

/** AI 解读完成 */
export function trackAIInterpretComplete(hexagramNumber: number, depth: string) {
  sendEvent({
    action: "ai_interpret_complete",
    category: "ai",
    label: `hex_${hexagramNumber}_${depth}`,
    hexagram_number: hexagramNumber,
    depth,
  });
}

// ── 铜钱抛掷事件 ──

/** 铜钱抛掷（每一爻） */
export function trackCoinToss(yaoIndex: number, lineValue: number) {
  sendEvent({
    action: "coin_toss",
    category: "divination",
    label: `yao_${yaoIndex + 1}`,
    value: lineValue,
    yao_index: yaoIndex,
    line_value: lineValue,
  });
}

// ── 语言切换事件 ──

/** 语言切换 */
export function trackLanguageSwitch(fromLocale: string, toLocale: string) {
  sendEvent({
    action: "language_switch",
    category: "navigation",
    label: `${fromLocale}_to_${toLocale}`,
    from_locale: fromLocale,
    to_locale: toLocale,
  });
}
