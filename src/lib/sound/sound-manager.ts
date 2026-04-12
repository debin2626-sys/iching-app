/**
 * Sound Manager — singleton audio manager for file-based sound effects.
 * Lazy-loads AudioContext on first play (iOS Safari compatible).
 * Sound files are in /sounds/*.mp3 (public directory).
 */

type SoundName =
  | "coin-throw"
  | "coin-land"
  | "complete-chime"
  | "bg-guqin"
  | "ambient-wind";

class SoundManager {
  private static instance: SoundManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private activeSources = new Map<string, AudioBufferSourceNode>();
  private enabled = true;
  private volume = 0.5;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /** Lazily create AudioContext — must be called after user interaction on iOS */
  private async ensureContext(): Promise<AudioContext> {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    // iOS Safari: resume suspended context
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  /** Preload sound files into memory */
  async preload(soundNames: SoundName[]): Promise<void> {
    const ctx = await this.ensureContext();
    const promises = soundNames.map(async (name) => {
      if (this.buffers.has(name)) return;
      try {
        const response = await fetch(`/sounds/${name}.mp3`);
        if (!response.ok) return; // Silently skip missing files
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
      } catch {
        // Silently ignore decode errors (placeholder files, etc.)
      }
    });
    await Promise.allSettled(promises);
  }

  /** Play a sound by name. Returns true if playback started. */
  async play(soundName: SoundName, loop = false): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      const ctx = await this.ensureContext();

      // Load on demand if not preloaded
      if (!this.buffers.has(soundName)) {
        await this.preload([soundName]);
      }

      const buffer = this.buffers.get(soundName);
      if (!buffer) return false;

      // Stop existing instance of same sound
      this.stop(soundName);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;
      source.connect(this.masterGain!);
      source.start(0);

      this.activeSources.set(soundName, source);
      source.onended = () => {
        this.activeSources.delete(soundName);
      };

      return true;
    } catch {
      return false;
    }
  }

  /** Stop a specific sound */
  stop(soundName: SoundName): void {
    const source = this.activeSources.get(soundName);
    if (source) {
      try {
        source.stop();
      } catch {
        // Already stopped
      }
      this.activeSources.delete(soundName);
    }
  }

  /** Stop all sounds */
  stopAll(): void {
    this.activeSources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Already stopped
      }
    });
    this.activeSources.clear();
  }

  /** Enable/disable all sounds globally */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  getEnabled(): boolean {
    return this.enabled;
  }

  /** Set master volume (0-1) */
  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.volume,
        this.masterGain.context.currentTime,
        0.05
      );
    }
  }

  getVolume(): number {
    return this.volume;
  }

  /** Check if a sound is currently playing */
  isPlaying(soundName: SoundName): boolean {
    return this.activeSources.has(soundName);
  }
}

export type { SoundName };
export default SoundManager;
