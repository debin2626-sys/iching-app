"use client";

import { useLocale } from "next-intl";
import { useNavItems } from "@/hooks/useNavItems";
import { Link } from "@/i18n/navigation";
import { PageLayout } from "@/components/ui";
import { Mail } from "lucide-react";

const CONTENT = {
  zh: {
    title: "联系我们",
    subtitle: "我们期待您的反馈",
    emailLabel: "工作邮箱",
    feedbackTitle: "反馈与建议",
    feedbackDesc: "如果您在使用过程中遇到任何问题，或有功能建议和改进意见，欢迎通过邮件与我们联系。我们会尽快回复您的消息。",
    sendEmail: "发送邮件",
    responseTime: "通常在 1-3 个工作日内回复",
  },
  "zh-TW": {
    title: "聯繫我們",
    subtitle: "我們期待您的反饋",
    emailLabel: "工作郵箱",
    feedbackTitle: "反饋與建議",
    feedbackDesc: "如果您在使用過程中遇到任何問題，或有功能建議和改進意見，歡迎透過郵件與我們聯繫。我們會盡快回覆您的訊息。",
    sendEmail: "發送郵件",
    responseTime: "通常在 1-3 個工作日內回覆",
  },
  en: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you",
    emailLabel: "Email",
    feedbackTitle: "Feedback & Suggestions",
    feedbackDesc: "If you encounter any issues while using our service, or have feature suggestions and improvement ideas, please feel free to reach out via email. We'll get back to you as soon as possible.",
    sendEmail: "Send Email",
    responseTime: "We typically respond within 1-3 business days",
  },
};

export default function ContactContent() {
  const locale = useLocale();
  const content = CONTENT[locale as keyof typeof CONTENT] || CONTENT.en;

  const navItems = useNavItems();

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-6xl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-4xl mb-4 block">✉️</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-gold)] mb-3">
            {content.title}
          </h1>
          <p className="text-gray-400 text-lg">{content.subtitle}</p>
        </div>

        <div className="space-y-8">
          {/* Email Card */}
          <section className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.12)] rounded-xl p-6 text-center">
            <Mail size={32} className="text-[var(--color-gold)]/80 mx-auto mb-4" />
            <p className="text-gray-500 text-sm mb-2">{content.emailLabel}</p>
            <a
              href="mailto:contact@51yijing.com"
              className="text-xl text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
            >
              contact@51yijing.com
            </a>
          </section>

          {/* Feedback Section */}
          <section className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.12)] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[var(--color-gold)]/90 mb-3">
              {content.feedbackTitle}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {content.feedbackDesc}
            </p>
            <div className="text-center">
              <a
                href="mailto:contact@51yijing.com?subject=Feedback%20-%2051yijing.com"
                className="inline-block px-8 py-3 rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-all duration-300"
              >
                {content.sendEmail}
              </a>
              <p className="text-gray-600 text-xs mt-3">
                {content.responseTime}
              </p>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-all duration-300"
          >
            {locale === "en" ? "Back to Home" : "返回首页"}
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
