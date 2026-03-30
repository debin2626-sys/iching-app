"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)]">
      {/* 太极旋转动画 */}
      <div className="taichi-rotate mb-8">
        <div className="taichi-symbol" />
      </div>

      {/* 加载文字 */}
      <p className="glow-text text-lg tracking-[0.3em] font-title animate-pulse-glow">
        正在推演天机...
      </p>

      {/* 装饰卦象 */}
      <div className="mt-6 flex items-center gap-2 text-amber-600/30 text-xs tracking-[0.5em]">
        ䷀ ䷁ ䷂ ䷃
      </div>
    </div>
  );
}
