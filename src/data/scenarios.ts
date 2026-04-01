export interface SubScenario {
  id: string;
  name: { zh: string; en: string; "zh-TW"?: string };
  template: { zh: string; en: string; "zh-TW"?: string };
}

export interface Scenario {
  id: string;
  emoji: string;
  name: { zh: string; en: string; "zh-TW"?: string };
  description: { zh: string; en: string; "zh-TW"?: string };
  subScenarios: SubScenario[];
}

export const scenarios: Scenario[] = [
  {
    id: "career",
    emoji: "💼",
    name: { zh: "事业", en: "Career", "zh-TW": "事業" },
    description: { zh: "事业发展中的关键抉择", en: "Key decisions in career development", "zh-TW": "事業發展中的關鍵抉擇" },
    subScenarios: [
      {
        id: "civil-exam",
        name: { zh: "考公/考编", en: "Civil Service Exam", "zh-TW": "考公/考編" },
        template: {
          zh: "我正在准备[省考/国考/事业编]，目前复习了[时长]，想了解今年考试的时机和上岸的可能性",
          en: "I am preparing for [civil service exam type], have been studying for [duration], and want to know about the timing and chances of passing",
        },
      },
      {
        id: "job-change",
        name: { zh: "跳槽转行", en: "Job Change", "zh-TW": "跳槽轉行" },
        template: {
          zh: "我正在考虑换工作，目前在[行业]做[职位]已经[年数]年，想了解跳槽的时机和方向是否合适",
          en: "I am considering changing jobs, currently working as [position] in [industry] for [years] years, wondering if the timing and direction are right",
        },
      },
      {
        id: "startup",
        name: { zh: "创业开店", en: "Startup", "zh-TW": "創業開店" },
        template: {
          zh: "我计划在[领域/行业]创业，目前处于[筹备/启动/运营]阶段，想了解这个方向的前景和时机",
          en: "I plan to start a business in [field/industry], currently in [preparation/launch/operation] stage, want to know about prospects and timing",
        },
      },
      {
        id: "promotion",
        name: { zh: "升职加薪", en: "Promotion", "zh-TW": "升職加薪" },
        template: {
          zh: "我在当前公司工作了[年数]年，最近有升职的机会，想了解能否顺利晋升以及需要注意什么",
          en: "I have been working at my current company for [years] years, recently have a promotion opportunity, want to know if it will go smoothly",
        },
      },
      {
        id: "project-decision",
        name: { zh: "项目决策", en: "Project Decision", "zh-TW": "專案決策" },
        template: {
          zh: "我正在负责一个[类型]项目，面临[具体决策点]的选择，想了解哪个方向更有利",
          en: "I am leading a [type] project, facing a choice at [specific decision point], want to know which direction is more favorable",
        },
      },
    ],
  },
  {
    id: "love",
    emoji: "💕",
    name: { zh: "感情", en: "Love" },
    description: { zh: "情感关系中的困惑与抉择", en: "Confusion and choices in relationships", "zh-TW": "情感關係中的困惑與抉擇" },
    subScenarios: [
      {
        id: "confession",
        name: { zh: "表白/追求", en: "Confession" },
        template: {
          zh: "我喜欢一个[关系描述，如同事/朋友/同学]，认识了[时长]，想了解现在表白的时机是否合适，对方的态度如何",
          en: "I like a [relationship, e.g. colleague/friend/classmate], have known them for [duration], want to know if now is a good time to confess",
        },
      },
      {
        id: "reconciliation",
        name: { zh: "复合挽回", en: "Reconciliation", "zh-TW": "複合挽回" },
        template: {
          zh: "我和[前任关系]分开了[时长]，分手原因是[简要原因]，想了解是否有复合的可能以及该如何行动",
          en: "I separated from my [ex-relationship] for [duration], the reason was [brief reason], want to know if reconciliation is possible",
        },
      },
      {
        id: "marriage",
        name: { zh: "婚姻关系", en: "Marriage", "zh-TW": "婚姻關係" },
        template: {
          zh: "我和[伴侣]在一起[年数]年，目前关系中遇到了[困扰]，想了解婚姻的走向和改善方向",
          en: "I have been with my [partner] for [years] years, currently facing [issue] in the relationship, want to know the direction of the marriage",
        },
      },
      {
        id: "ambiguous",
        name: { zh: "暧昧关系", en: "Ambiguous", "zh-TW": "曖昧關係" },
        template: {
          zh: "我和一个[关系描述]之间关系暧昧，已经持续了[时长]，想了解对方的真实想法和这段关系的发展方向",
          en: "I have an ambiguous relationship with a [relationship description] for [duration], want to know their true feelings and where this is heading",
        },
      },
      {
        id: "breakup",
        name: { zh: "分手抉择", en: "Breakup", "zh-TW": "分手抉擇" },
        template: {
          zh: "我和[伴侣]在一起[年数]年，最近因为[原因]在考虑是否要分手，想了解这段感情是否还值得继续",
          en: "I have been with my [partner] for [years] years, recently considering breaking up due to [reason], want to know if this relationship is worth continuing",
        },
      },
    ],
  },
  {
    id: "wealth",
    emoji: "💰",
    name: { zh: "财运", en: "Wealth", "zh-TW": "財運" },
    description: { zh: "财富决策中的风险与机遇", en: "Risks and opportunities in financial decisions", "zh-TW": "財富決策中的風險與機遇" },
    subScenarios: [
      {
        id: "investment",
        name: { zh: "投资决策", en: "Investment", "zh-TW": "投資決策" },
        template: {
          zh: "我打算投资[股票/基金/数字货币/其他]，金额大约[金额区间]，想了解近期的投资运势和风险提示",
          en: "I plan to invest in [stocks/funds/crypto/other], about [amount range], want to know about recent investment fortune and risk warnings",
        },
      },
      {
        id: "finance",
        name: { zh: "理财规划", en: "Financial Planning", "zh-TW": "理財規劃" },
        template: {
          zh: "我目前有[大致存款区间]的积蓄，想了解适合我的理财方向和需要注意的财务风险",
          en: "I currently have savings of about [approximate range], want to know suitable financial directions and risks to watch for",
        },
      },
      {
        id: "business",
        name: { zh: "生意经营", en: "Business", "zh-TW": "生意經營" },
        template: {
          zh: "我经营[行业/类型]生意已经[时长]，目前面临[扩张/转型/困境]，想了解生意的发展前景",
          en: "I have been running a [industry/type] business for [duration], currently facing [expansion/transformation/difficulty], want to know the business outlook",
        },
      },
      {
        id: "property",
        name: { zh: "买房置业", en: "Property", "zh-TW": "買房置業" },
        template: {
          zh: "我计划在[城市/区域]购房，预算大约[金额区间]，想了解现在是否是合适的购房时机",
          en: "I plan to buy property in [city/area], budget about [amount range], want to know if now is a good time to buy",
        },
      },
    ],
  },
  {
    id: "study",
    emoji: "📚",
    name: { zh: "学业", en: "Study", "zh-TW": "學業" },
    description: { zh: "求学路上的迷茫与选择", en: "Confusion and choices on the academic path", "zh-TW": "求學路上的迷茫與選擇" },
    subScenarios: [
      {
        id: "exam",
        name: { zh: "考试运势", en: "Exam Fortune", "zh-TW": "考試運勢" },
        template: {
          zh: "我即将参加[考试名称]，考试时间在[日期]，目前准备情况[自评]，想了解考试运势和需要注意的事项",
          en: "I am about to take [exam name], scheduled for [date], current preparation [self-assessment], want to know exam fortune and things to watch for",
        },
      },
      {
        id: "school",
        name: { zh: "升学择校", en: "School Selection", "zh-TW": "升學擇校" },
        template: {
          zh: "我面临[小升初/中考/高考/考研]，目标学校是[学校名]，想了解升学的方向选择和成功的可能性",
          en: "I am facing [education transition], target school is [school name], want to know about direction choices and chances of success",
        },
      },
      {
        id: "abroad",
        name: { zh: "出国留学", en: "Study Abroad", "zh-TW": "出國留學" },
        template: {
          zh: "我计划去[国家]留学，申请[专业/学校]，目前在准备[语言考试/申请材料]，想了解留学的时机和方向",
          en: "I plan to study in [country], applying for [major/school], currently preparing [language test/application materials], want to know about timing and direction",
        },
      },
      {
        id: "certification",
        name: { zh: "考证备考", en: "Certification", "zh-TW": "考證備考" },
        template: {
          zh: "我正在备考[证书名称，如CPA/法考/教资]，计划[时间]参加考试，想了解备考方向和通过的可能性",
          en: "I am preparing for [certification, e.g. CPA/bar exam], planning to take the exam in [time], want to know about preparation direction and chances of passing",
        },
      },
    ],
  },
  {
    id: "health",
    emoji: "🏥",
    name: { zh: "健康", en: "Health" },
    description: { zh: "身心健康的关注与调养", en: "Attention and care for physical and mental health", "zh-TW": "身心健康的關注與調養" },
    subScenarios: [
      {
        id: "physical",
        name: { zh: "身体状况", en: "Physical Health", "zh-TW": "身體狀況" },
        template: {
          zh: "我最近身体出现了[症状描述]，已经持续[时长]，想从易经角度了解身体调养的方向和需要注意的事项",
          en: "I have recently experienced [symptom description] for [duration], want to understand health adjustment directions from an I Ching perspective",
        },
      },
      {
        id: "wellness",
        name: { zh: "养生方向", en: "Wellness", "zh-TW": "養生方向" },
        template: {
          zh: "我今年[年龄]岁，体质偏[寒/热/虚/实]，想了解适合我的养生方向和生活习惯调整建议",
          en: "I am [age] years old, my constitution tends to be [cold/hot/deficient/excess], want to know suitable wellness directions and lifestyle adjustments",
        },
      },
      {
        id: "mental",
        name: { zh: "心理健康", en: "Mental Health" },
        template: {
          zh: "我最近感到[焦虑/压力大/情绪低落/失眠]，持续了[时长]，想从易经智慧中寻求心理调适的方向",
          en: "I have been feeling [anxious/stressed/depressed/insomniac] for [duration], want to seek psychological adjustment directions from I Ching wisdom",
        },
      },
    ],
  },
];
