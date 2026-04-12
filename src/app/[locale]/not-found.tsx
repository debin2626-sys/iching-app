"use client";

import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-4 text-center">
      {/* 404 符号 */}
      <div className="text-8xl mb-4 opacity-50 animate-pulse-glow">☯</div>

      {/* 主标题 */}
      <h1 className="font-title text-4xl sm:text-5xl font-bold text-gold-glow mb-4">
        此卦不在六十四卦之中
      </h1>

      {/* 副标题 */}
      <p className="text-gray-400 text-base tracking-wider mb-2 max-w-md">
        你所寻之道，不在此处
      </p>
      <p className="text-gray-600 text-sm tracking-wide mb-8">
        404 — Page not found
      </p>

      {/* 分割线 */}
      <div className="divider-gold w-24 mb-8" />

      {/* 返回首页 */}
      <Link
        href="/"
        className="px-8 py-3 rounded-xl border border-amber-500/30 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 hover:border-amber-500/50 transition-all duration-300 tracking-wider font-title inline-block"
      >
        🏠 归返太极
      </Link>

      {/* 底部装饰 */}
      <div className="mt-12 text-amber-600/20 text-xs tracking-[0.5em]">
        ䷀ ䷁ ䷂ ䷃ ䷄ ䷅ ䷆ ䷇
      </div>
    </div>
  );
}
