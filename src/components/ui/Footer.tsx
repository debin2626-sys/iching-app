"use client";

import { useLocale } from "next-intl";

const DISCLAIMERS: Record<string, string> = {
  zh: "本站占卜结果由 AI 生成，仅供娱乐与心理启迪参考，不构成医疗、投资、法律等专业建议。如需专业帮助，请咨询相关领域专家。",
  "zh-TW": "本站占卜結果由 AI 生成，僅供娛樂與心理啟迪參考，不構成醫療、投資、法律等專業建議。如需專業幫助，請諮詢相關領域專家。",
  en: "Divination results are AI-generated and intended for entertainment and personal reflection only. They do not constitute medical, financial, legal, or other professional advice. Please consult qualified professionals for specific guidance.",
};

export default function Footer() {
  const locale = useLocale();
  const disclaimer = DISCLAIMERS[locale] || DISCLAIMERS.en;
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[rgba(201,169,110,0.1)] mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-6 text-center">
        <p className="text-[11px] leading-relaxed text-gray-600 mb-2">
          {disclaimer}
        </p>
        <p className="text-[11px] text-gray-700">
          © {year} 51yijing.com
        </p>
      </div>
    </footer>
  );
}
