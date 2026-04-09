/* Google Analytics 4 custom event tracking */

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
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

// ── 防重复触发工具 ──

const _firedOnce = new Set<string>();

/** 仅触发一次的事件（页面级去重，刷新后重置） */
function sendEventOnce(key: string, event: GTagEvent) {
  if (_firedOnce.has(key)) return;
  _firedOnce.add(key);
  sendEvent(event);
}

// ══════════════════════════════════════════════
//  转化漏斗事件（funnel_*）
// ══════════════════════════════════════════════

// ── 1. funnel_home_view ──

interface FunnelHomeViewParams {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
}

export function trackFunnelHomeView(params?: FunnelHomeViewParams) {
  sendEventOnce("funnel_home_view", {
    action: "funnel_home_view",
    referrer: params?.referrer,
    utm_source: params?.utm_source,
    utm_medium: params?.utm_medium,
  });
}

// ── 2. funnel_start_click ──

interface FunnelStartClickParams {
  entry_type: "direct_click" | "scenario_select";
  scenario?: string;
  sub_scenario?: string;
}

export function trackFunnelStartClick(params: FunnelStartClickParams) {
  sendEvent({
    action: "funnel_start_click",
    entry_type: params.entry_type,
    scenario: params.scenario,
    sub_scenario: params.sub_scenario,
  });
}

// ── 3. funnel_question_submit ──

interface FunnelQuestionSubmitParams {
  question_length: number;
  has_birth_info: boolean;
  has_gender: boolean;
  scenario?: string;
  sub_scenario?: string;
}

export function trackFunnelQuestionSubmit(params: FunnelQuestionSubmitParams) {
  sendEvent({
    action: "funnel_question_submit",
    question_length: params.question_length,
    has_birth_info: params.has_birth_info,
    has_gender: params.has_gender,
    scenario: params.scenario,
    sub_scenario: params.sub_scenario,
  });
}

// ── 4. funnel_birth_fill ──

interface FunnelBirthFillParams {
  birth_year: string;
  birth_hour: string;
  gender: string;
}

export function trackFunnelBirthFill(params: FunnelBirthFillParams) {
  sendEvent({
    action: "funnel_birth_fill",
    birth_year: params.birth_year,
    birth_hour: params.birth_hour,
    gender: params.gender,
  });
}

// ── 5. funnel_meditation_start ──

export function trackFunnelMeditationStart() {
  sendEvent({ action: "funnel_meditation_start" });
}

// ── 6. funnel_meditation_skip ──

interface FunnelMeditationSkipParams {
  skip_time_seconds: number;
}

export function trackFunnelMeditationSkip(params: FunnelMeditationSkipParams) {
  sendEvent({
    action: "funnel_meditation_skip",
    skip_time_seconds: params.skip_time_seconds,
  });
}

// ── 7. funnel_meditation_complete ──

interface FunnelMeditationCompleteParams {
  duration_seconds: number;
}

export function trackFunnelMeditationComplete(params: FunnelMeditationCompleteParams) {
  sendEvent({
    action: "funnel_meditation_complete",
    duration_seconds: params.duration_seconds,
  });
}

// ── 8. funnel_coin_toss ──

interface FunnelCoinTossParams {
  yao_index: number;
  line_value: number;
  is_changing: boolean;
}

export function trackFunnelCoinToss(params: FunnelCoinTossParams) {
  sendEvent({
    action: "funnel_coin_toss",
    yao_index: params.yao_index,
    line_value: params.line_value,
    is_changing: params.is_changing,
  });
}

// ── 9. funnel_hexagram_formed ──

interface FunnelHexagramFormedParams {
  hexagram_number: number;
  hexagram_name: string;
  changing_lines_count: number;
  total_toss_duration_seconds: number;
}

export function trackFunnelHexagramFormed(params: FunnelHexagramFormedParams) {
  sendEventOnce("funnel_hexagram_formed", {
    action: "funnel_hexagram_formed",
    hexagram_number: params.hexagram_number,
    hexagram_name: params.hexagram_name,
    changing_lines_count: params.changing_lines_count,
    total_toss_duration_seconds: params.total_toss_duration_seconds,
  });
}

// ── 10. funnel_result_view ──

interface FunnelResultViewParams {
  hexagram_number: number;
  hexagram_name: string;
  question_length: number;
  has_birth_info: boolean;
  scenario?: string;
  interpret_mode?: "simple" | "multi-dimension";
}

export function trackFunnelResultView(params: FunnelResultViewParams) {
  sendEventOnce("funnel_result_view", {
    action: "funnel_result_view",
    hexagram_number: params.hexagram_number,
    hexagram_name: params.hexagram_name,
    question_length: params.question_length,
    has_birth_info: params.has_birth_info,
    scenario: params.scenario,
    interpret_mode: params.interpret_mode,
  });
}

// ── 11. funnel_ai_interpret_start ──

interface FunnelAIInterpretStartParams {
  hexagram_number: number;
  interpret_mode: string;
}

export function trackFunnelAIInterpretStart(params: FunnelAIInterpretStartParams) {
  sendEvent({
    action: "funnel_ai_interpret_start",
    hexagram_number: params.hexagram_number,
    interpret_mode: params.interpret_mode,
  });
}

// ── 12. funnel_ai_interpret_complete ──

interface FunnelAIInterpretCompleteParams {
  hexagram_number: number;
  interpret_mode: string;
  duration_seconds: number;
  success: boolean;
}

export function trackFunnelAIInterpretComplete(params: FunnelAIInterpretCompleteParams) {
  sendEvent({
    action: "funnel_ai_interpret_complete",
    hexagram_number: params.hexagram_number,
    interpret_mode: params.interpret_mode,
    duration_seconds: params.duration_seconds,
    success: params.success,
  });
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

// ── 每日限制商业化事件 ──

/** 用户达到每日3次上限，尝试再次占卜时 */
export function trackDivinationLimitReached(userId?: string | null) {
  sendEvent({
    action: "divination_limit_reached",
    category: "monetization",
    userId: userId ?? undefined,
  });
}

/** "次数用尽" 弹窗成功展示时 */
export function trackViewLimitPopup(userId?: string | null) {
  sendEvent({
    action: "view_limit_popup",
    category: "monetization",
    userId: userId ?? undefined,
  });
}

/** 用户点击"升级到 Pro"按钮时 */
export function trackClickUpgradePro() {
  sendEvent({
    action: "click_upgrade_pro",
    category: "monetization",
    source: "limit_popup",
  });
}

/** 用户点击"去 Ko-fi 打赏"按钮时 */
export function trackClickKofiDonate() {
  sendEvent({
    action: "click_kofi_donate",
    category: "monetization",
    source: "limit_popup",
  });
}

/** 用户通过 "X" 图标关闭弹窗时 */
export function trackCloseLimitPopup(userId?: string | null) {
  sendEvent({
    action: "close_limit_popup",
    category: "monetization",
    userId: userId ?? undefined,
  });
}
