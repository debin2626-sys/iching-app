"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SoundTheme } from "@/lib/sound-synth";

// ─── localStorage 持久化 ───

const STORAGE_KEY = "iching_sound_prefs";

interface SoundPrefs {
  theme: SoundTheme;
  volume: number; // 0-1
  muted: boolean;
}

const DEFAULT_PREFS: SoundPrefs = {
  theme: "bell",
  volume: 0.5,
  muted: true, // 默认静音，尊重用户
};

function loadPrefs(): SoundPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        theme: parsed.theme || DEFAULT_PREFS.theme,
        volume: typeof parsed.volume === "number" ? parsed.volume : DEFAULT_PREFS.volume,
        muted: typeof parsed.muted === "boolean" ? parsed.muted : DEFAULT_PREFS.muted,
      };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_PREFS };
}

function savePrefs(prefs: SoundPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

// ─── Hook ───

export interface UseSoundEffect {
  /** 当前音效主题 */
  theme: SoundTheme;
  /** 音量 0-1 */
  volume: number;
  /** 是否静音 */
  muted: boolean;
  /** 是否首次使用（从未改过设置） */
  isFirstUse: boolean;
  /** 切换音效主题 */
  setTheme: (theme: SoundTheme) => void;
  /** 设置音量 */
  setVolume: (v: number) => void;
  /** 切换静音 */
  toggleMute: () => void;
  /** 播放背景循环音 */
  playBackground: () => void;
  /** 停止背景音 */
  stopBackground: () => void;
  /** 播放铜钱落地音效 */
  playCoin: () => void;
  /** 播放爻显现音效 */
  playYao: () => void;
}

export function useSoundEffect(): UseSoundEffect {
  const [prefs, setPrefs] = useState<SoundPrefs>(DEFAULT_PREFS);
  const [isFirstUse, setIsFirstUse] = useState(true);

  // 懒加载的音频模块引用
  const synthRef = useRef<typeof import("@/lib/sound-synth") | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const bgHandleRef = useRef<{ stop: () => void } | null>(null);

  // 从 localStorage 加载偏好
  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs(loaded);
    setIsFirstUse(!localStorage.getItem(STORAGE_KEY));
  }, []);

  // 懒加载音效合成模块
  const ensureSynth = useCallback(async () => {
    if (!synthRef.current) {
      synthRef.current = await import("@/lib/sound-synth");
    }
    const synth = synthRef.current;

    if (!ctxRef.current) {
      ctxRef.current = synth.getAudioContext();
    }
    await synth.ensureAudioResumed();

    if (!masterGainRef.current) {
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.connect(ctxRef.current.destination);
    }

    return synth;
  }, []);

  // 同步音量到 GainNode
  useEffect(() => {
    if (masterGainRef.current) {
      const effectiveVolume = prefs.muted ? 0 : prefs.volume;
      masterGainRef.current.gain.setTargetAtTime(
        effectiveVolume,
        masterGainRef.current.context.currentTime,
        0.05,
      );
    }
  }, [prefs.volume, prefs.muted]);

  const updatePrefs = useCallback((partial: Partial<SoundPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      savePrefs(next);
      setIsFirstUse(false);
      return next;
    });
  }, []);

  const setTheme = useCallback(
    (theme: SoundTheme) => {
      // 如果背景音正在播放，切换主题时重启
      const wasPlaying = !!bgHandleRef.current;
      if (wasPlaying) {
        bgHandleRef.current?.stop();
        bgHandleRef.current = null;
      }
      updatePrefs({ theme });
      // 延迟重启背景音，等 state 更新
      if (wasPlaying) {
        setTimeout(async () => {
          const synth = await ensureSynth();
          const ctx = ctxRef.current!;
          const gain = masterGainRef.current!;
          bgHandleRef.current = synth.playBackground(ctx, gain, theme);
        }, 50);
      }
    },
    [updatePrefs, ensureSynth],
  );

  const setVolume = useCallback(
    (v: number) => {
      updatePrefs({ volume: Math.max(0, Math.min(1, v)) });
    },
    [updatePrefs],
  );

  const toggleMute = useCallback(() => {
    updatePrefs({ muted: !prefs.muted });
  }, [prefs.muted, updatePrefs]);

  const playBackground = useCallback(async () => {
    const synth = await ensureSynth();
    const ctx = ctxRef.current!;
    const gain = masterGainRef.current!;

    // 先停止旧的
    bgHandleRef.current?.stop();
    bgHandleRef.current = synth.playBackground(ctx, gain, prefs.theme);
  }, [ensureSynth, prefs.theme]);

  const stopBackground = useCallback(() => {
    bgHandleRef.current?.stop();
    bgHandleRef.current = null;
  }, []);

  const playCoin = useCallback(async () => {
    if (prefs.muted) return;
    const synth = await ensureSynth();
    const ctx = ctxRef.current!;
    const gain = masterGainRef.current!;
    synth.playCoinSound(ctx, gain, prefs.theme);
  }, [ensureSynth, prefs.theme, prefs.muted]);

  const playYao = useCallback(async () => {
    if (prefs.muted) return;
    const synth = await ensureSynth();
    const ctx = ctxRef.current!;
    const gain = masterGainRef.current!;
    synth.playYaoSound(ctx, gain, prefs.theme);
  }, [ensureSynth, prefs.theme, prefs.muted]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      bgHandleRef.current?.stop();
      bgHandleRef.current = null;
    };
  }, []);

  return {
    theme: prefs.theme,
    volume: prefs.volume,
    muted: prefs.muted,
    isFirstUse,
    setTheme,
    setVolume,
    toggleMute,
    playBackground,
    stopBackground,
    playCoin,
    playYao,
  };
}
