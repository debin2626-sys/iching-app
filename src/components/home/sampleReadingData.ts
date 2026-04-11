// Shared content data for SampleReading (used by both server and client components)

export const SAMPLE_READING_CONTENT = {
  zh: {
    sectionTitle: "解读示例",
    sectionSubtitle: "看看 AI 如何解读卦象",
    hexName: "乾卦",
    hexSubname: "The Creative · 乾为天",
    scenario: "事业",
    originalQuote: "「乾：元，亨，利，贞。」",
    originalSource: "——《周易·乾卦》",
    paragraphs: [
      "乾卦六爻皆阳，象征天道刚健，生生不息。在事业问卦中得此卦，是极为吉利的征兆。乾卦代表着强大的创造力和领导力，暗示您当前正处于事业发展的上升期，具备充足的能量和资源去开拓新的领域。",
      "从卦象来看，天行健，君子以自强不息。这提示您应当保持积极进取的态度，不断提升自身能力。当前是推进重要项目、争取晋升机会的绝佳时机。但需注意「亢龙有悔」的警示——在追求成功的同时，保持谦逊和审慎。",
      "具体建议：近三个月内适合主动出击，展示您的专业能力和领导才华。在团队协作中发挥核心作用，但避免独断专行。财运方面，乾卦主正财旺盛，适合稳健投资，不宜投机冒进。",
    ],
    expandLabel: "查看完整解读",
    collapseLabel: "收起",
    cta: "开始你的占卜",
  },
  "zh-TW": {
    sectionTitle: "解讀示例",
    sectionSubtitle: "看看 AI 如何解讀卦象",
    hexName: "乾卦",
    hexSubname: "The Creative · 乾為天",
    scenario: "事業",
    originalQuote: "「乾：元，亨，利，貞。」",
    originalSource: "——《周易·乾卦》",
    paragraphs: [
      "乾卦六爻皆陽，象徵天道剛健，生生不息。在事業問卦中得此卦，是極為吉利的徵兆。乾卦代表著強大的創造力和領導力，暗示您當前正處於事業發展的上升期，具備充足的能量和資源去開拓新的領域。",
      "從卦象來看，天行健，君子以自強不息。這提示您應當保持積極進取的態度，不斷提升自身能力。當前是推進重要項目、爭取晉升機會的絕佳時機。但需注意「亢龍有悔」的警示——在追求成功的同時，保持謙遜和審慎。",
      "具體建議：近三個月內適合主動出擊，展示您的專業能力和領導才華。在團隊協作中發揮核心作用，但避免獨斷專行。財運方面，乾卦主正財旺盛，適合穩健投資，不宜投機冒進。",
    ],
    expandLabel: "查看完整解讀",
    collapseLabel: "收起",
    cta: "開始你的占卜",
  },
  en: {
    sectionTitle: "Sample Reading",
    sectionSubtitle: "See how AI interprets the hexagram",
    hexName: "Qián",
    hexSubname: "The Creative · Heaven over Heaven",
    scenario: "Career",
    originalQuote: '"Qián: Sublime success. Perseverance furthers."',
    originalSource: "— I Ching, Hexagram 1",
    paragraphs: [
      "Hexagram Qián consists of six unbroken yang lines, symbolizing the creative power of heaven — vigorous, ceaseless, and full of potential. Drawing this hexagram for a career reading is an exceptionally auspicious sign. It represents powerful creativity and leadership, suggesting you are in an ascending phase of professional development with abundant energy and resources to explore new frontiers.",
      'The image of heaven in motion reminds us: "As heaven maintains vigor through movement, a superior person should constantly strive for self-improvement." This signals that now is the ideal time to push forward with important projects and pursue advancement opportunities. However, heed the warning of the top line — "the arrogant dragon will have cause to repent" — maintain humility even as you reach for success.',
      "Specific guidance: The next three months favor taking initiative and showcasing your expertise and leadership. Play a central role in team collaboration while avoiding autocratic tendencies. Financially, Qián indicates strong legitimate income — steady investment is favored over speculation.",
    ],
    expandLabel: "View full reading",
    collapseLabel: "Collapse",
    cta: "Start Your Reading",
  },
};

export type SampleReadingLocale = keyof typeof SAMPLE_READING_CONTENT;
