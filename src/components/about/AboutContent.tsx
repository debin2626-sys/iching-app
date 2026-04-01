"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageLayout } from "@/components/ui";

const SECTIONS_ZH = [
  {
    icon: "🏛️",
    title: "我们是谁",
    content:
      "51yijing.com 由资深国学研究者与 AI 工程师联合打造。我们的团队深耕易经研究多年，致力于将三千年易经智慧与现代 AI 技术相结合，让古老的东方智慧焕发新的生命力。",
  },
  {
    icon: "📜",
    title: "算法与学术基础",
    content:
      "我们的占卜算法严格基于《易经》原文，参考朱熹《周易本义》、孔颖达《周易正义》、王弼《周易注》等历代大儒注解，确保每一卦的解读都有深厚的学术根基。三币起卦法遵循传统古法，六爻成卦，忠实还原千年占卜仪式。",
  },
  {
    icon: "🤖",
    title: "AI 智能解读",
    content:
      "我们的 AI 解读系统结合传统卦辞爻辞、RAG 知识库与场景化分析，能够根据您的具体问题给出个性化的解读。AI 不是替代传统智慧，而是帮助您更好地理解卦象中蕴含的深意。",
  },
  {
    icon: "🎯",
    title: "我们的使命",
    content:
      "让每个人都能轻松获得易经智慧的指引。无论您是易经爱好者、国学研究者，还是初次接触易经的朋友，我们都希望为您提供一个专业、便捷、美观的在线占卜体验。",
  },
];

const SECTIONS_EN = [
  {
    icon: "🏛️",
    title: "Who We Are",
    content:
      "51yijing.com is built by a team of I Ching scholars and AI engineers. With years of deep research into the Book of Changes, we are dedicated to bridging 3,000 years of ancient wisdom with cutting-edge AI technology.",
  },
  {
    icon: "📜",
    title: "Academic Foundation",
    content:
      "Our divination algorithm is strictly based on the original I Ching text, referencing authoritative commentaries by Zhu Xi (Zhouyi Benyi), Kong Yingda (Zhouyi Zhengyi), and Wang Bi (Zhouyi Zhu). The traditional three-coin method faithfully recreates the ancient divination ritual.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Interpretation",
    content:
      "Our AI interpretation system combines traditional hexagram and line texts with a RAG knowledge base and contextual analysis, delivering personalized readings based on your specific questions. AI enhances — not replaces — traditional wisdom.",
  },
  {
    icon: "🎯",
    title: "Our Mission",
    content:
      "Making ancient I Ching wisdom accessible to everyone. Whether you are a seasoned scholar, an enthusiast, or a curious newcomer, we aim to provide a professional, convenient, and beautiful online divination experience.",
  },
];

export default function AboutContent() {
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const isZh = locale === "zh" || locale === "zh-TW";
  const sections = isZh ? SECTIONS_ZH : SECTIONS_EN;

  const navItems = [
    { label: tNav("divination"), href: "/", icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams", icon: <span>📖</span> },
    { label: tNav("history"), href: "/history", icon: <span>📜</span> },
    { label: tNav("about"), href: "/about", icon: <span>ℹ️</span> },
  ];

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-4xl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-4xl mb-4 block">☯</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-3">
            {isZh ? "关于 51yijing.com" : "About 51yijing.com"}
          </h1>
          <p className="text-gray-400 text-lg">
            {isZh
              ? "古老智慧，现代传承"
              : "Ancient Wisdom, Modern Legacy"}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <section
              key={i}
              className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.12)] rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-amber-400/90 mb-3 flex items-center gap-2">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-full border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 transition-all duration-300"
          >
            {isZh ? "开始占卜" : "Start Divination"}
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
