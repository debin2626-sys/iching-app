"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui";

interface ShareButtonsProps {
  hexagramName: string;
  hexagramId: number;
  url: string;
}

/**
 * Share button group with traditional Chinese styling.
 * Currently supports: copy link, native share (if available).
 */
export default function ShareButtons({
  hexagramName,
  hexagramId,
  url,
}: ShareButtonsProps) {
  const t = useTranslations("Result");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = `${hexagramName}（第${hexagramId}卦）— ${url}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast(t("copiedToClipboard"), "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      toast(t("copiedToClipboard"), "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: hexagramName,
        text: shareText,
        url,
      });
    } catch {
      // User cancelled
    }
  };

  const handleShareWeibo = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(weiboUrl, "_blank", "width=600,height=500");
  };

  const btnBase =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-title tracking-wider transition-all duration-300 border border-[var(--color-gold)]/40 bg-transparent hover:border-[var(--color-gold)] hover:shadow-[0_0_12px_rgba(184,146,74,0.25)]";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        className={btnBase}
        style={{ color: "var(--color-gold)" }}
      >
        <span>{copied ? "✓" : "🔗"}</span>
        <span>{copied ? t("copied") : t("copyLink")}</span>
      </button>

      {/* Native share (mobile) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={handleNativeShare}
          className={btnBase}
          style={{ color: "var(--color-gold)" }}
        >
          <span>📤</span>
          <span>{t("share")}</span>
        </button>
      )}

      {/* Share to Weibo */}
      <button
        onClick={handleShareWeibo}
        className={btnBase}
        style={{ color: "var(--color-gold)" }}
      >
        <span>📝</span>
        <span>{t("shareWeibo")}</span>
      </button>
    </div>
  );
}
