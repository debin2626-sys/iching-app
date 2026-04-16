"use client";

import { useCallback, useState } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async () => {
    if (!enabled) return;
    const manager = SoundManager.getInstance();
    manager.setEnabled(true);
    const started = await manager.play(soundName);
    setIsPlaying(started);
  }, [enabled, soundName]);

  const stop = useCallback(() => {
    const manager = SoundManager.getInstance();
    manager.stop(soundName);
    setIsPlaying(false);
  }, [soundName]);

  return {
    play,
    stop,
    isPlaying,
  };
}
