"use client";

import { useCallback, useRef } from "react";
import SoundManager, { type SoundName } from "./sound-manager";
import { useSoundEnabled } from "./sound-context";

interface UseSoundReturn {
  play: () => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
}

/**
 * Hook to play a specific sound effect.
 * Automatically respects the global sound enabled state.
 */
export function useSound(soundName: SoundName): UseSoundReturn {
  const [enabled] = useSoundEnabled();
  const playingRef = useRef(false);

  const play = useCallback(async () => {
    if (!enabled) return;
    const manager = SoundManager.getInstance();
    manager.setEnabled(true);
    const started = await manager.play(soundName);
    playingRef.current = started;
  }, [enabled, soundName]);

  const stop = useCallback(() => {
    const manager = SoundManager.getInstance();
    manager.stop(soundName);
    playingRef.current = false;
  }, [soundName]);

  return {
    play,
    stop,
    isPlaying: playingRef.current,
  };
}
