"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-4 text-center">
      {/* 错误符号 */}
      <div className="text-7xl mb-6 opacity-60">☲</div>

      {/* 主标题 */}
      <h1 className="font-title text-3xl sm:text-4xl font-bold text-gold-glow mb-4">
        天机不可泄露
      </h1>

      {/* 副标题 */}
      <p className="text-gray-400 text-base tracking-wider mb-2 max-w-md">
        卦象推演中遭遇异变，阴阳失衡
      </p>
      <p className="text-gray-600 text-sm tracking-wide mb-8">
        Something went wrong during divination
      </p>

      {/* 分割线 */}
      <div className="divider-gold w-24 mb-8" />

      {/* 重试按钮 */}
      <button
        onClick={reset}
        className="px-8 py-3 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300 tracking-wider font-title cursor-pointer"
      >
        🔄 重新推演
      </button>
    </div>
  );
}
