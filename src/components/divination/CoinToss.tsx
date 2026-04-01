"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { LineValue } from "@/lib/iching/coins";

/* ── 常量 ── */
const COIN_SIZE_DESKTOP = 100;
const COIN_SIZE_MOBILE = 80;
const TOSS_DURATION = 2.5; // 总动画时长
const COIN_STAGGER = 0.1; // 铜钱间隔
const AUTO_INTERVAL = 1000; // 自动模式间隔

const YAO_CN = ["一", "二", "三", "四", "五", "六"];

/** 单枚铜钱正反面 */
type CoinFace = 2 | 3; // 2=反面(花), 3=正面(字)

interface CoinTossProps {
  /** 当前爻序号 (0-5) */
  currentYao: number;
  /** 是否自动模式 */
  autoMode?: boolean;
  /** 单次抛掷完成回调，返回三枚铜钱面值 */
  onTossComplete: (coins: CoinFace[], lineValue: LineValue) => void;
  /** 全部6次抛掷完成 */
  onAllComplete?: () => void;
}

/* ── 铜钱正面 ── */
function CoinFront({ size }: { size: number }) {
  return (
    <div
      className="absolute inset-0 rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(ellipse at 35% 30%, #f5e6a3 0%, #d4b96a 30%, #b8943f 60%, #8a6d2f 100%)",
        boxShadow:
          "inset 0 2px 6px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.5)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* 中心方孔 */}
      <div
        className="absolute rounded-sm border-2"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          borderColor: "#6b5020",
          background: "linear-gradient(135deg, #3a2a10 0%, #1a1a2e 100%)",
        }}
      />
      {/* 文字 */}
      <span
        className="absolute font-title font-bold select-none"
        style={{
          fontSize: size * 0.18,
          color: "#3a2a10",
          top: size * 0.12,
          textShadow: "0 1px 1px rgba(255,255,255,0.3)",
        }}
      >
        通寶
      </span>
      <span
        className="absolute font-title font-bold select-none"
        style={{
          fontSize: size * 0.18,
          color: "#3a2a10",
          bottom: size * 0.12,
          textShadow: "0 1px 1px rgba(255,255,255,0.3)",
        }}
      >
        乾隆
      </span>
      {/* 外圈纹理 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `${size * 0.03}px solid rgba(138,109,47,0.6)`,
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
}

/* ── 铜钱反面 ── */
function CoinBack({ size }: { size: number }) {
  return (
    <div
      className="absolute inset-0 rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(ellipse at 65% 70%, #c9a050 0%, #a07830 40%, #7a5a20 70%, #5a4018 100%)",
        boxShadow:
          "inset 0 2px 6px rgba(255,255,255,0.2), inset 0 -2px 6px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.5)",
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
      {/* 中心方孔 */}
      <div
        className="absolute rounded-sm border-2"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          borderColor: "#5a4018",
          background: "linear-gradient(135deg, #3a2a10 0%, #1a1a2e 100%)",
        }}
      />
      {/* 满文装饰 */}
      <span
        className="absolute font-title select-none opacity-60"
        style={{
          fontSize: size * 0.16,
          color: "#3a2a10",
          left: size * 0.15,
        }}
      >
        ᠪᠣᠣ
      </span>
      <span
        className="absolute font-title select-none opacity-60"
        style={{
          fontSize: size * 0.16,
          color: "#3a2a10",
          right: size * 0.15,
        }}
      >
        ᡴᡳᠣᠸᠠᠨ
      </span>
      {/* 外圈 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `${size * 0.03}px solid rgba(90,64,24,0.6)`,
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.05)",
        }}
      />
    </div>
  );
}

/* ── 单枚铜钱动画 ── */
function AnimatedCoin({
  face,
  index,
  isTossing,
  size,
  isLanded,
}: {
  face: CoinFace;
  index: number;
  isTossing: boolean;
  size: number;
  isLanded: boolean;
}) {
  const delay = index * COIN_STAGGER;
  const isFront = face === 3;

  // 抛物线关键帧 - 每枚铜钱略有不同的水平偏移
  const xOffsets = [-30, 0, 30]; // 三枚铜钱的水平散开
  const xOffset = xOffsets[index];

  // 最终旋转角度：正面=偶数圈(0°)，反面=奇数圈(180°)
  const finalRotateY = isFront ? 1080 : 1080 + 180;

  return (
    <m.div
      className="relative"
      style={{
        width: size,
        height: size,
        perspective: 800,
        willChange: "transform",
      }}
      initial={false}
      animate={
        isTossing
          ? {
              // 抛物线轨迹：上抛 → 最高点 → 落下 → 弹跳
              y: [120, -100, -120, 0, -15, 0],
              x: [0, xOffset * 0.5, xOffset, xOffset, xOffset, xOffset],
              scale: [0.8, 1.1, 1.05, 1, 1.02, 1],
            }
          : isLanded
            ? { y: 0, x: xOffset, scale: 1 }
            : { y: 0, x: 0, scale: 1 }
      }
      transition={
        isTossing
          ? {
              duration: TOSS_DURATION,
              delay,
              times: [0, 0.12, 0.72, 0.85, 0.92, 1],
              ease: [0.22, 1, 0.36, 1],
            }
          : { duration: 0.3 }
      }
    >
      <m.div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        initial={false}
        animate={
          isTossing
            ? {
                rotateX: [0, 720, 720],
                rotateY: [0, finalRotateY, finalRotateY],
                rotateZ: [0, 360, 360],
              }
            : isLanded
              ? {
                  rotateX: 0,
                  rotateY: isFront ? 0 : 180,
                  rotateZ: 0,
                }
              : { rotateX: 0, rotateY: 0, rotateZ: 0 }
        }
        transition={
          isTossing
            ? {
                duration: TOSS_DURATION,
                delay,
                times: [0, 0.72, 1],
                ease: [0.33, 0, 0.2, 1],
              }
            : { duration: 0.3 }
        }
      >
        <CoinFront size={size} />
        <CoinBack size={size} />
      </m.div>

      {/* 落地阴影 */}
      {(isTossing || isLanded) && (
        <m.div
          className="absolute rounded-full"
          style={{
            width: size * 0.8,
            height: size * 0.15,
            left: size * 0.1,
            bottom: -size * 0.12,
            background: "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={
            isTossing
              ? {
                  opacity: [0.1, 0, 0, 0.4, 0.3, 0.35],
                  scaleX: [0.5, 0.3, 0.3, 1, 0.9, 1],
                }
              : { opacity: 0.35, scaleX: 1 }
          }
          transition={
            isTossing
              ? {
                  duration: TOSS_DURATION,
                  delay,
                  times: [0, 0.12, 0.72, 0.85, 0.92, 1],
                }
              : { duration: 0.3 }
          }
        />
      )}
    </m.div>
  );
}

/* ── 结果标签 ── */
function ResultLabel({ lineValue }: { lineValue: LineValue }) {
  const labels: Record<LineValue, { text: string; sub: string; isChanging: boolean }> = {
    9: { text: "老阳", sub: "三正 · 动爻", isChanging: true },
    6: { text: "老阴", sub: "三反 · 动爻", isChanging: true },
    7: { text: "少阳", sub: "二正一反", isChanging: false },
    8: { text: "少阴", sub: "一正二反", isChanging: false },
  };
  const info = labels[lineValue];
  const color = info.isChanging ? "#a63000" : "var(--color-gold)";

  return (
    <m.div
      className="text-center mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <span
        className="text-2xl font-title font-bold"
        style={{ color }}
      >
        {info.text}
      </span>
      <span className="block text-xs opacity-50 mt-1">{info.sub}</span>
    </m.div>
  );
}

/* ── 主组件 ── */
export default function CoinToss({
  currentYao,
  autoMode = false,
  onTossComplete,
  onAllComplete,
}: CoinTossProps) {
  const [isTossing, setIsTossing] = useState(false);
  const [coinFaces, setCoinFaces] = useState<CoinFace[]>([3, 3, 3]);
  const [lastResult, setLastResult] = useState<LineValue | null>(null);
  const [isLanded, setIsLanded] = useState(false);
  const [coinSize, setCoinSize] = useState(COIN_SIZE_DESKTOP);
  const tossCompleteRef = useRef(onTossComplete);
  tossCompleteRef.current = onTossComplete;

  // 响应式铜钱尺寸
  useEffect(() => {
    const updateSize = () => {
      setCoinSize(window.innerWidth < 640 ? COIN_SIZE_MOBILE : COIN_SIZE_DESKTOP);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const doToss = useCallback(() => {
    if (isTossing || currentYao >= 6) return;

    setIsTossing(true);
    setLastResult(null);
    setIsLanded(false);

    // 震动反馈
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }

    // 生成随机结果
    const coins: CoinFace[] = Array.from({ length: 3 }, () =>
      Math.random() < 0.5 ? 2 : 3
    ) as CoinFace[];
    const sum = coins.reduce((a: number, b: number) => a + b, 0) as LineValue;

    // 在旋转阶段中途设置面值（不影响动画）
    setCoinFaces(coins);

    // 动画结束
    const totalDuration = (TOSS_DURATION + 2 * COIN_STAGGER) * 1000;
    setTimeout(() => {
      setIsTossing(false);
      setIsLanded(true);
      setLastResult(sum);
      tossCompleteRef.current(coins, sum);

      if (currentYao + 1 >= 6) {
        setTimeout(() => onAllComplete?.(), 600);
      }
    }, totalDuration);
  }, [isTossing, currentYao, onAllComplete]);

  // 自动模式
  useEffect(() => {
    if (!autoMode || isTossing || currentYao >= 6) return;
    const timer = setTimeout(doToss, AUTO_INTERVAL);
    return () => clearTimeout(timer);
  }, [autoMode, isTossing, currentYao, doToss]);

  // 点击/触摸触发
  const handleTap = useCallback(() => {
    if (!autoMode) doToss();
  }, [autoMode, doToss]);

  const isComplete = currentYao >= 6;

  return (
    <div className="flex flex-col items-center w-full">
      {/* 提示文字 */}
      <AnimatePresence mode="wait">
        {!isComplete && (
          <m.p
            key={`toss-${currentYao}`}
            className="text-lg font-title tracking-widest mb-6 opacity-70"
            style={{ color: "var(--color-gold)" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            第{YAO_CN[Math.min(currentYao, 5)]}次抛掷
          </m.p>
        )}
      </AnimatePresence>

      {/* 铜钱区域 - 可点击 */}
      <m.div
        className="relative flex justify-center items-end gap-2 sm:gap-4 cursor-pointer select-none"
        style={{
          minHeight: coinSize + 140,
          width: "100%",
          maxWidth: coinSize * 3 + 120,
        }}
        onClick={handleTap}
        whileTap={!isTossing && !isComplete ? { scale: 0.97 } : undefined}
        role="button"
        tabIndex={0}
        aria-label={isTossing ? "抛掷中" : isComplete ? "抛掷完成" : "点击抛掷铜钱"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTap();
          }
        }}
      >
        {[0, 1, 2].map((i) => (
          <AnimatedCoin
            key={i}
            face={coinFaces[i]}
            index={i}
            isTossing={isTossing}
            size={coinSize}
            isLanded={isLanded}
          />
        ))}

        {/* 点击提示 */}
        {!isTossing && !isComplete && !isLanded && (
          <m.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs opacity-30 whitespace-nowrap"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            点击屏幕抛掷铜钱
          </m.div>
        )}
      </m.div>

      {/* 结果显示 */}
      <AnimatePresence>
        {lastResult && !isTossing && (
          <ResultLabel lineValue={lastResult} />
        )}
      </AnimatePresence>

      {/* 铜钱面值指示 */}
      {isLanded && !isTossing && (
        <m.div
          className="flex gap-4 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          {coinFaces.map((face, i) => (
            <span key={i} className="text-xs">
              {face === 3 ? "正" : "反"}
            </span>
          ))}
        </m.div>
      )}
    </div>
  );
}
