"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageLayout } from "@/components/ui";

const CONTENT = {
  zh: {
    title: "隐私政策",
    lastUpdated: "最后更新：2025年4月1日",
    sections: [
      {
        heading: "1. 数据收集",
        body: "我们收集以下信息以提供服务：\n• 账户信息：通过 Google OAuth 登录时的邮箱地址和基本个人资料\n• 占卜记录：您的提问内容、卦象结果和 AI 解读内容\n• 使用数据：页面访问、功能使用等匿名统计数据",
      },
      {
        heading: "2. Cookie 使用",
        body: "我们使用 Google Analytics 4 (GA4) 收集匿名网站使用数据，以改善用户体验。GA4 会在您的浏览器中设置 Cookie。您可以通过浏览器设置禁用 Cookie。",
      },
      {
        heading: "3. 第三方服务",
        body: "我们使用以下第三方服务：\n• Google Analytics：网站流量分析\n• Google OAuth：用户身份验证\n• DeepSeek AI：生成占卜解读内容\n\n这些服务可能会根据其各自的隐私政策收集和处理数据。",
      },
      {
        heading: "4. 数据存储与安全",
        body: "所有数据通过 HTTPS 加密传输。我们采取合理的技术和管理措施保护您的个人信息安全。占卜记录存储在安全的数据库中，仅用于为您提供历史记录查询服务。",
      },
      {
        heading: "5. 用户权利",
        body: "您有权：\n• 访问您的个人数据\n• 要求删除您的账户和所有相关数据\n• 选择退出数据收集（禁用 Cookie）\n• 导出您的占卜历史记录\n\n如需行使以上权利，请通过下方联系方式与我们联系。",
      },
      {
        heading: "6. 联系方式",
        body: "如有任何隐私相关问题，请联系：\n📧 contact@51yijing.com",
      },
    ],
  },
  "zh-TW": {
    title: "隱私政策",
    lastUpdated: "最後更新：2025年4月1日",
    sections: [
      {
        heading: "1. 資料收集",
        body: "我們收集以下資訊以提供服務：\n• 帳戶資訊：透過 Google OAuth 登入時的電子郵件地址和基本個人資料\n• 占卜記錄：您的提問內容、卦象結果和 AI 解讀內容\n• 使用資料：頁面訪問、功能使用等匿名統計資料",
      },
      {
        heading: "2. Cookie 使用",
        body: "我們使用 Google Analytics 4 (GA4) 收集匿名網站使用資料，以改善使用者體驗。GA4 會在您的瀏覽器中設定 Cookie。您可以透過瀏覽器設定停用 Cookie。",
      },
      {
        heading: "3. 第三方服務",
        body: "我們使用以下第三方服務：\n• Google Analytics：網站流量分析\n• Google OAuth：使用者身份驗證\n• DeepSeek AI：生成占卜解讀內容\n\n這些服務可能會根據其各自的隱私政策收集和處理資料。",
      },
      {
        heading: "4. 資料儲存與安全",
        body: "所有資料透過 HTTPS 加密傳輸。我們採取合理的技術和管理措施保護您的個人資訊安全。占卜記錄儲存在安全的資料庫中，僅用於為您提供歷史記錄查詢服務。",
      },
      {
        heading: "5. 使用者權利",
        body: "您有權：\n• 存取您的個人資料\n• 要求刪除您的帳戶和所有相關資料\n• 選擇退出資料收集（停用 Cookie）\n• 匯出您的占卜歷史記錄\n\n如需行使以上權利，請透過下方聯繫方式與我們聯繫。",
      },
      {
        heading: "6. 聯繫方式",
        body: "如有任何隱私相關問題，請聯繫：\n📧 contact@51yijing.com",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: April 1, 2025",
    sections: [
      {
        heading: "1. Data Collection",
        body: "We collect the following information to provide our services:\n• Account information: Email address and basic profile via Google OAuth sign-in\n• Divination records: Your questions, hexagram results, and AI interpretations\n• Usage data: Anonymous statistics on page visits and feature usage",
      },
      {
        heading: "2. Cookie Usage",
        body: "We use Google Analytics 4 (GA4) to collect anonymous website usage data to improve user experience. GA4 sets cookies in your browser. You can disable cookies through your browser settings.",
      },
      {
        heading: "3. Third-Party Services",
        body: "We use the following third-party services:\n• Google Analytics: Website traffic analysis\n• Google OAuth: User authentication\n• DeepSeek AI: Generating divination interpretations\n\nThese services may collect and process data according to their respective privacy policies.",
      },
      {
        heading: "4. Data Storage & Security",
        body: "All data is transmitted via HTTPS encryption. We take reasonable technical and administrative measures to protect your personal information. Divination records are stored in secure databases and used solely to provide you with history lookup services.",
      },
      {
        heading: "5. Your Rights",
        body: "You have the right to:\n• Access your personal data\n• Request deletion of your account and all associated data\n• Opt out of data collection (disable cookies)\n• Export your divination history\n\nTo exercise these rights, please contact us using the information below.",
      },
      {
        heading: "6. Contact",
        body: "For any privacy-related questions, please contact:\n📧 contact@51yijing.com",
      },
    ],
  },
};

export default function PrivacyContent() {
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const content = CONTENT[locale as keyof typeof CONTENT] || CONTENT.en;

  const navItems = [
    { label: tNav("home"), href: "/" as const, icon: <span>🏠</span> },
    { label: tNav("divination"), href: "/divine" as const, icon: <span>🔮</span> },
    { label: tNav("hexagrams"), href: "/hexagrams" as const, icon: <span>📖</span> },
  ];

  return (
    <PageLayout navItems={navItems} maxWidth="max-w-6xl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-4xl mb-4 block">🔒</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-gold)] mb-3">
            {content.title}
          </h1>
          <p className="text-gray-500 text-sm">{content.lastUpdated}</p>
        </div>

        <div className="space-y-8">
          {content.sections.map((section, i) => (
            <section
              key={i}
              className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,169,110,0.12)] rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-[var(--color-gold)]/90 mb-3">
                {section.heading}
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </section>
          ))}
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
