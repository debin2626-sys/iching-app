"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LineValue } from "@/lib/iching/coins";

const YAO_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

/** 每爻显现的间隔（毫秒） */
const YAO_INTERVAL = 1000;

/** 单爻动画持续时间（秒） */
const YAO_FADE_DURATION = 0.6;

/** 光晕动画持续时间（秒） */
const GLOW_DURATION = 0.8;

interface HexagramRevealProps {
  /** 六爻数据，索引0=初爻，索引5=上爻 */
  lines: LineValue[];
  /** 是否启用逐爻动画，默认 true */
  animated?: boolean;
  /** 卦名（中文） */
  hexagramName?: string;
  /** 卦名（英文） */
  hexagramNameEn?: string;
  /** 动画全部完成后的回调 */
  onRevealComplete?: () => void;
}

/** 阳爻（实线）组件 */
function YangLine({ isChanging }: { isChanging: boolean }) {
  const bgColor = isChanging ? "bg-[#8b2500]" : "bg-[#c9a96e]";
  return <span className={`block w-full h-[10px] rounded-sm ${bgColor}`} />;
}

/** 阴爻（虚线）组件 */
function YinLine({ isChanging }: { isChanging: boolean }) {
  const bgColor = isChanging ? "bg-[#8b2500]" : "bg-[#c9a96e]";
  return (
    <div className="flex w-full items-center">
      <span className={`block flex-1 h-[10px] rounded-sm ${bgColor}`} />
      <span className="block w-6 shrink-0" />
      <span className={`block flex-1 h-[10px] rounded-sm ${bgColor}`} />
    </div>
  );
}

/** 金色光晕效果 */
function GlowEffect() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-sm"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        boxShadow: [
          "0 0 0px rgba(201,169,110,0)",
          "0 0 20px rgba(201,169,110,0.6)",
          "0 0 0px rgba(201,169,110,0)",
        ],
      }}
      transition={{ duration: GLOW_DURATION, ease: "easeOut" }}
    />
  );
}

export default function HexagramReveal({
  lines,
  animated = true,
  hexagramName,
  hexagramNameEn,
  onRevealComplete,
}: HexagramRevealProps) {
  // 当前已显现的爻数（0-6），从初爻开始
  const [revealedCount, setRevealedCount] = useState(animated ? 0 : 6);
  // 当前正在播放光晕的爻索引
  const [glowingIndex, setGlowingIndex] = useState<number | null>(null);
  // 全部爻显现完成
  const allRevealed = revealedCount >= 6;
  // 卦名显示完成
  const [nameVisible, setNameVisible] = useState(!animated);

  const revealNext = useCallback(() => {
    setRevealedCount((prev) => {
      const next = prev + 1;
      // 触发光晕
      setGlowingIndex(prev); // prev 是当前要显现的爻索引（0-based）
      // 光晕结束后清除
      setTimeout(() => setGlowingIndex(null), GLOW_DURATION * 1000);
      return next;
    });
  }, []);

  // 逐爻显现定时器
  useEffect(() => {
    if (!animated || allRevealed) return;

    const timer = setTimeout(revealNext, YAO_INTERVAL);
    return () => clearTimeout(timer);
  }, [animated, revealedCount, allRevealed, revealNext]);

  // 全部爻显现后，延迟显示卦名
  useEffect(() => {
    if (!animated || !allRevealed || nameVisible) return;

    const timer = setTimeout(() => {
      setNameVisible(true);
      onRevealComplete?.();
    }, 600);
    return () => clearTimeout(timer);
  }, [animated, allRevealed, nameVisible, onRevealComplete]);

  // 渲染顺序：显示时从上到下（上爻在顶），但显现顺序从初爻（底部）开始
  // lines[0]=初爻(底), lines[5]=上爻(顶)
  // 渲染时 reverse: 显示索引 ri=0 对应 lines[5](上爻), ri=5 对应 lines[0](初爻)
  const displayLines = [...lines].reverse();

  return (
    <div className="flex flex-col items-center" style={{ width: "300px", margin: "0 auto" }}>
      {/* 六爻区域 */}
      <div className="flex flex-col items-center gap-3 w-full">
        {displayLines.map((v, ri) => {
          const lineIndex = 5 - ri; // 实际爻索引（0=初爻）
          const isYang = v === 7 || v === 9;
          const isChanging = v === 6 || v === 9;
          const isRevealed = lineIndex < revealedCount;
          const isGlowing = glowingIndex === lineIndex;

          return (
            <div key={lineIndex} className="flex items-center gap-4 w-full">
              {/* 爻名标签 */}
              <span
                className="text-sm w-12 text-right shrink-0 transition-opacity duration-300"
                style={{ opacity: isRevealed ? 0.5 : 0 }}
              >
                {YAO_LABELS[lineIndex]}
              </span>

              {/* 爻线 */}
              <div className="flex items-center justify-center flex-1 relative">
                {animated ? (
                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div
                        className="w-full"
                        initial={{
                          opacity: 0,
                          scaleX: isYang ? 0.3 : 0.6,
                          scaleY: 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          scaleX: 1,
                          scaleY: 1,
                        }}
                        transition={{
                          opacity: { duration: YAO_FADE_DURATION, ease: "easeOut" },
                          scaleX: {
                            duration: isYang ? 0.5 : 0.4,
                            ease: isYang ? "easeOut" : "easeInOut",
                          },
                          scaleY: { duration: 0.3, ease: "easeOut" },
                        }}
                      >
                        {isYang ? (
                          <YangLine isChanging={isChanging} />
                        ) : (
                          <YinLine isChanging={isChanging} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  // 无动画模式：直接显示
                  isYang ? (
                    <div className="w-full">
                      <YangLine isChanging={isChanging} />
                    </div>
                  ) : (
                    <div className="w-full">
                      <YinLine isChanging={isChanging} />
                    </div>
                  )
                )}

                {/* 金色光晕 */}
                {isGlowing && <GlowEffect />}
              </div>

              {/* 动爻标记 */}
              {isChanging ? (
                <span
                  className="text-red-500 text-sm shrink-0 transition-opacity duration-300"
                  style={{ opacity: isRevealed ? 1 : 0 }}
                >
                  🔴
                </span>
              ) : (
                <span className="text-sm shrink-0 invisible">🔴</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 卦名区域 - 全部爻显现后渐入 */}
      {(hexagramName || hexagramNameEn) && (
        <div className="mt-6 text-center">
          {animated ? (
            <AnimatePresence>
              {nameVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {hexagramName && (
                    <p className="text-2xl font-title text-[#c9a96e]">{hexagramName}</p>
                  )}
                  {hexagramNameEn && (
                    <p className="text-sm text-zinc-500 mt-1">{hexagramNameEn}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <>
              {hexagramName && (
                <p className="text-2xl font-title text-[#c9a96e]">{hexagramName}</p>
              )}
              {hexagramNameEn && (
                <p className="text-sm text-zinc-500 mt-1">{hexagramNameEn}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
