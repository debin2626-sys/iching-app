export const SCENARIO_IDS = ['career', 'love', 'wealth', 'study', 'health'] as const;

export type ScenarioId = typeof SCENARIO_IDS[number];

export const SCENARIO_HEXAGRAMS: Record<ScenarioId, number[]> = {
  career: [1, 3, 7, 11, 14, 16, 26, 34, 35, 43, 46, 49, 50, 55],
  love:   [2, 11, 17, 31, 32, 37, 38, 44, 53, 54, 58, 61],
  wealth: [5, 8, 9, 11, 14, 19, 42, 45, 48, 55, 60, 63],
  study:  [4, 15, 20, 24, 25, 26, 29, 41, 51, 52, 57, 58],
  health: [2, 24, 27, 29, 40, 47, 52, 60, 63, 64],
};

export interface ScenarioMeta {
  nameZh: string;
  nameEn: string;
  nameZhTW: string;
  descZh: string;
  descEn: string;
  descZhTW: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const SCENARIO_META: Record<ScenarioId, ScenarioMeta> = {
  career: {
    nameZh:   '事业运势',
    nameEn:   'Career',
    nameZhTW: '事業運勢',
    descZh:   '职场发展、升职加薪、创业决策',
    descEn:   'Career development, promotion, entrepreneurship',
    descZhTW: '職場發展、升職加薪、創業決策',
    icon:     'Briefcase',
    color:    'text-blue-600',
    bgColor:  'bg-blue-50',
  },
  love: {
    nameZh:   '感情姻缘',
    nameEn:   'Love & Relationships',
    nameZhTW: '感情姻緣',
    descZh:   '恋爱关系、婚姻缘分、感情走向',
    descEn:   'Romance, marriage, relationship guidance',
    descZhTW: '戀愛關係、婚姻緣分、感情走向',
    icon:     'Heart',
    color:    'text-rose-600',
    bgColor:  'bg-rose-50',
  },
  wealth: {
    nameZh:   '财运投资',
    nameEn:   'Wealth & Finance',
    nameZhTW: '財運投資',
    descZh:   '财富积累、投资决策、商业机遇',
    descEn:   'Wealth, investment, business opportunities',
    descZhTW: '財富積累、投資決策、商業機遇',
    icon:     'DollarSign',
    color:    'text-amber-600',
    bgColor:  'bg-amber-50',
  },
  study: {
    nameZh:   '学业考试',
    nameEn:   'Study & Growth',
    nameZhTW: '學業考試',
    descZh:   '学习进步、考试升学、知识积累',
    descEn:   'Learning, exams, personal growth',
    descZhTW: '學習進步、考試升學、知識積累',
    icon:     'GraduationCap',
    color:    'text-violet-600',
    bgColor:  'bg-violet-50',
  },
  health: {
    nameZh:   '健康养生',
    nameEn:   'Health & Wellness',
    nameZhTW: '健康養生',
    descZh:   '身心健康、调养休息、生活平衡',
    descEn:   'Physical health, rest, life balance',
    descZhTW: '身心健康、調養休息、生活平衡',
    icon:     'Leaf',
    color:    'text-green-600',
    bgColor:  'bg-green-50',
  },
};

// ─── Types and data for ScenarioSelector / SubScenarioPanel ───────────────────

export interface SubScenario {
  id: string;
  name: { zh: string; en: string; 'zh-TW'?: string };
  template: { zh: string; en: string; 'zh-TW'?: string };
}

export interface Scenario {
  id: string;
  name: { zh: string; en: string; 'zh-TW'?: string };
  description: { zh: string; en: string; 'zh-TW'?: string };
  emoji: string;
  subScenarios: SubScenario[];
}

export const scenarios: Scenario[] = [
  {
    id: 'career',
    name: { zh: '事业', en: 'Career', 'zh-TW': '事業' },
    description: { zh: '职场·创业·升职', en: 'Work · Growth · Leadership', 'zh-TW': '職場·創業·升職' },
    emoji: '💼',
    subScenarios: [
      { id: 'promotion', name: { zh: '升职加薪', en: 'Promotion', 'zh-TW': '升職加薪' }, template: { zh: '我想了解近期升职加薪的运势', en: 'I want to know about my promotion prospects', 'zh-TW': '我想了解近期升職加薪的運勢' } },
      { id: 'startup', name: { zh: '创业决策', en: 'Entrepreneurship', 'zh-TW': '創業決策' }, template: { zh: '我正在考虑创业，想了解时机是否合适', en: 'I am considering starting a business, is the timing right?', 'zh-TW': '我正在考慮創業，想了解時機是否合適' } },
      { id: 'job-change', name: { zh: '跳槽换工作', en: 'Job Change', 'zh-TW': '跳槽換工作' }, template: { zh: '我在考虑换工作，想了解这个决定是否明智', en: 'I am considering changing jobs, is this a wise decision?', 'zh-TW': '我在考慮換工作，想了解這個決定是否明智' } },
      { id: 'workplace', name: { zh: '职场关系', en: 'Workplace Relations', 'zh-TW': '職場關係' }, template: { zh: '我想了解当前职场人际关系的走向', en: 'I want to understand my current workplace relationships', 'zh-TW': '我想了解當前職場人際關係的走向' } },
      { id: 'project', name: { zh: '项目进展', en: 'Project Progress', 'zh-TW': '項目進展' }, template: { zh: '我想了解手头项目的进展和结果', en: 'I want to know about the progress and outcome of my project', 'zh-TW': '我想了解手頭項目的進展和結果' } },
    ],
  },
  {
    id: 'love',
    name: { zh: '感情', en: 'Love', 'zh-TW': '感情' },
    description: { zh: '恋爱·婚姻·缘分', en: 'Romance · Marriage · Fate', 'zh-TW': '戀愛·婚姻·緣分' },
    emoji: '❤️',
    subScenarios: [
      { id: 'new-love', name: { zh: '新感情发展', en: 'New Relationship', 'zh-TW': '新感情發展' }, template: { zh: '我想了解这段新感情的发展走向', en: 'I want to know how this new relationship will develop', 'zh-TW': '我想了解這段新感情的發展走向' } },
      { id: 'marriage', name: { zh: '婚姻缘分', en: 'Marriage', 'zh-TW': '婚姻緣分' }, template: { zh: '我想了解自己的婚姻缘分和时机', en: 'I want to know about my marriage fate and timing', 'zh-TW': '我想了解自己的婚姻緣分和時機' } },
      { id: 'reconcile', name: { zh: '复合挽回', en: 'Reconciliation', 'zh-TW': '復合挽回' }, template: { zh: '我想了解与前任复合的可能性', en: 'I want to know the possibility of reconciling with my ex', 'zh-TW': '我想了解與前任復合的可能性' } },
      { id: 'relationship', name: { zh: '感情走向', en: 'Relationship Direction', 'zh-TW': '感情走向' }, template: { zh: '我想了解当前感情关系的走向', en: 'I want to understand the direction of my current relationship', 'zh-TW': '我想了解當前感情關係的走向' } },
      { id: 'single', name: { zh: '单身脱单', en: 'Finding Love', 'zh-TW': '單身脫單' }, template: { zh: '我想了解近期脱单的运势和机会', en: 'I want to know about my prospects for finding love', 'zh-TW': '我想了解近期脫單的運勢和機會' } },
    ],
  },
  {
    id: 'wealth',
    name: { zh: '财运', en: 'Wealth', 'zh-TW': '財運' },
    description: { zh: '投资·财富·商机', en: 'Investment · Fortune · Business', 'zh-TW': '投資·財富·商機' },
    emoji: '💰',
    subScenarios: [
      { id: 'investment', name: { zh: '投资决策', en: 'Investment', 'zh-TW': '投資決策' }, template: { zh: '我想了解这次投资的运势和风险', en: 'I want to know about the prospects and risks of this investment', 'zh-TW': '我想了解這次投資的運勢和風險' } },
      { id: 'business', name: { zh: '生意合作', en: 'Business Partnership', 'zh-TW': '生意合作' }, template: { zh: '我想了解这次商业合作的前景', en: 'I want to know about the prospects of this business partnership', 'zh-TW': '我想了解這次商業合作的前景' } },
      { id: 'fortune', name: { zh: '整体财运', en: 'Overall Fortune', 'zh-TW': '整體財運' }, template: { zh: '我想了解近期整体财运走势', en: 'I want to know about my overall financial fortune recently', 'zh-TW': '我想了解近期整體財運走勢' } },
      { id: 'debt', name: { zh: '债务借贷', en: 'Debt & Loans', 'zh-TW': '債務借貸' }, template: { zh: '我想了解关于债务或借贷的运势', en: 'I want to know about the prospects regarding debt or loans', 'zh-TW': '我想了解關於債務或借貸的運勢' } },
    ],
  },
  {
    id: 'study',
    name: { zh: '学业', en: 'Study', 'zh-TW': '學業' },
    description: { zh: '考试·升学·成长', en: 'Exams · Growth · Wisdom', 'zh-TW': '考試·升學·成長' },
    emoji: '📚',
    subScenarios: [
      { id: 'exam', name: { zh: '考试运势', en: 'Exam Fortune', 'zh-TW': '考試運勢' }, template: { zh: '我想了解即将到来的考试运势', en: 'I want to know about my fortune for the upcoming exam', 'zh-TW': '我想了解即將到來的考試運勢' } },
      { id: 'admission', name: { zh: '升学申请', en: 'School Admission', 'zh-TW': '升學申請' }, template: { zh: '我想了解升学申请的成功可能性', en: 'I want to know about the chances of my school application', 'zh-TW': '我想了解升學申請的成功可能性' } },
      { id: 'learning', name: { zh: '学习进步', en: 'Learning Progress', 'zh-TW': '學習進步' }, template: { zh: '我想了解如何提升学习效率和进步', en: 'I want to know how to improve my learning efficiency', 'zh-TW': '我想了解如何提升學習效率和進步' } },
      { id: 'career-study', name: { zh: '职业发展学习', en: 'Professional Development', 'zh-TW': '職業發展學習' }, template: { zh: '我想了解进修或职业培训的运势', en: 'I want to know about the prospects of further education or training', 'zh-TW': '我想了解進修或職業培訓的運勢' } },
    ],
  },
  {
    id: 'health',
    name: { zh: '健康', en: 'Health', 'zh-TW': '健康' },
    description: { zh: '身心·调养·平衡', en: 'Body · Mind · Balance', 'zh-TW': '身心·調養·平衡' },
    emoji: '🌿',
    subScenarios: [
      { id: 'physical', name: { zh: '身体健康', en: 'Physical Health', 'zh-TW': '身體健康' }, template: { zh: '我想了解近期身体健康状况的运势', en: 'I want to know about my physical health prospects', 'zh-TW': '我想了解近期身體健康狀況的運勢' } },
      { id: 'mental', name: { zh: '心理状态', en: 'Mental Wellbeing', 'zh-TW': '心理狀態' }, template: { zh: '我想了解如何改善心理状态和情绪', en: 'I want to know how to improve my mental state and emotions', 'zh-TW': '我想了解如何改善心理狀態和情緒' } },
      { id: 'recovery', name: { zh: '康复调养', en: 'Recovery', 'zh-TW': '康復調養' }, template: { zh: '我想了解康复调养的运势和建议', en: 'I want to know about recovery prospects and guidance', 'zh-TW': '我想了解康復調養的運勢和建議' } },
      { id: 'lifestyle', name: { zh: '生活平衡', en: 'Life Balance', 'zh-TW': '生活平衡' }, template: { zh: '我想了解如何达到更好的生活平衡', en: 'I want to know how to achieve better life balance', 'zh-TW': '我想了解如何達到更好的生活平衡' } },
    ],
  },
];
