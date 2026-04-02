/**
 * Web Audio API 音效合成器
 * 用纯合成方式生成三种风格的音效，无需外部音频文件
 */

export type SoundTheme = "ambient" | "bell" | "water";
export type SoundEvent = "background" | "coin" | "yao";

/** 获取或创建全局 AudioContext（懒初始化） */
let _ctx: AudioContext | null = null;
export function getAudioContext(): AudioContext {
  if (!_ctx) {
    _ctx = new AudioContext();
  }
  return _ctx;
}

/** 移动端需要用户交互后 resume */
export async function ensureAudioResumed(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

// ─── 白噪音主题 ───

function createWhiteNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.15;
  }
  return buffer;
}

function playAmbientBackground(ctx: AudioContext, gain: GainNode): AudioBufferSourceNode {
  const buffer = createWhiteNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // 低通滤波让白噪音更柔和
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  filter.Q.value = 0.5;

  source.connect(filter);
  filter.connect(gain);
  source.start();
  return source;
}

function playAmbientCoin(ctx: AudioContext, gain: GainNode): void {
  // 短促的噪音脉冲 + 低频共振
  const duration = 0.3;
  const buffer = createWhiteNoiseBuffer(ctx, duration);
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 2;

  const envGain = ctx.createGain();
  envGain.gain.setValueAtTime(0.4, ctx.currentTime);
  envGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(envGain);
  envGain.connect(gain);
  source.start();
  source.stop(ctx.currentTime + duration);
}

function playAmbientYao(ctx: AudioContext, gain: GainNode): void {
  // 柔和的正弦波上升音
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

  const envGain = ctx.createGain();
  envGain.gain.setValueAtTime(0, ctx.currentTime);
  envGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
  envGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

  osc.connect(envGain);
  envGain.connect(gain);
  osc.start();
  osc.stop(ctx.currentTime + 0.8);
}

// ─── 钟磬主题 ───

function playBellBackground(ctx: AudioContext, gain: GainNode): AudioBufferSourceNode {
  // 持续的低频嗡鸣 + 泛音，模拟寺庙钟声余韵
  const sampleRate = ctx.sampleRate;
  const duration = 6;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  const baseFreq = 65; // C2
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    data[i] =
      Math.sin(2 * Math.PI * baseFreq * t) * 0.08 +
      Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.04 +
      Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.02 +
      Math.sin(2 * Math.PI * baseFreq * 5.04 * t) * 0.01 + // 非谐泛音
      (Math.random() * 2 - 1) * 0.005; // 微弱噪音
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gain);
  source.start();
  return source;
}

function playBellCoin(ctx: AudioContext, gain: GainNode): void {
  // 金属碰撞声：多个高频正弦波快速衰减
  const freqs = [1200, 2400, 3600, 4800];
  const now = ctx.currentTime;

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const envGain = ctx.createGain();
    const amp = 0.15 / (i + 1);
    envGain.gain.setValueAtTime(amp, now);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(envGain);
    envGain.connect(gain);
    osc.start(now);
    osc.stop(now + 0.4);
  });
}

function playBellYao(ctx: AudioContext, gain: GainNode): void {
  // 钟磬一击：基频 + 泛音 + 长余韵
  const now = ctx.currentTime;
  const baseFreq = 523.25; // C5

  const harmonics = [1, 2.0, 3.0, 4.24, 5.04]; // 钟声特有的非谐泛音
  const amps = [0.25, 0.15, 0.08, 0.04, 0.02];
  const decays = [1.5, 1.2, 0.8, 0.6, 0.4];

  harmonics.forEach((h, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = baseFreq * h;

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(amps[i], now);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + decays[i]);

    osc.connect(envGain);
    envGain.connect(gain);
    osc.start(now);
    osc.stop(now + decays[i]);
  });
}

// ─── 流水主题 ───

function playWaterBackground(ctx: AudioContext, gain: GainNode): AudioBufferSourceNode {
  // 模拟流水：滤波白噪音 + 缓慢调制
  const sampleRate = ctx.sampleRate;
  const duration = 4;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    // 白噪音基底
    const noise = (Math.random() * 2 - 1) * 0.12;
    // 缓慢的振幅调制模拟水流起伏
    const mod = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.3 * t);
    data[i] = noise * mod;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // 带通滤波模拟水声频率
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1500;
  filter.Q.value = 0.8;

  // LFO 调制滤波频率
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 500;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  source.connect(filter);
  filter.connect(gain);
  source.start();

  // 返回 source，lfo 会随 source 断开时被 GC
  return source;
}

function playWaterCoin(ctx: AudioContext, gain: GainNode): void {
  // 水滴落入声：短促的下降频率 + 共振
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

  const envGain = ctx.createGain();
  envGain.gain.setValueAtTime(0.3, now);
  envGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(envGain);
  envGain.connect(gain);
  osc.start(now);
  osc.stop(now + 0.3);

  // 涟漪回响
  setTimeout(() => {
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(600, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);

    const env2 = ctx.createGain();
    env2.gain.setValueAtTime(0.1, ctx.currentTime);
    env2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc2.connect(env2);
    env2.connect(gain);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.25);
  }, 100);
}

function playWaterYao(ctx: AudioContext, gain: GainNode): void {
  // 水面波纹扩散：多层正弦波渐入渐出
  const now = ctx.currentTime;
  const freqs = [330, 440, 550];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const envGain = ctx.createGain();
    const delay = i * 0.1;
    envGain.gain.setValueAtTime(0, now + delay);
    envGain.gain.linearRampToValueAtTime(0.12, now + delay + 0.15);
    envGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);

    osc.connect(envGain);
    envGain.connect(gain);
    osc.start(now + delay);
    osc.stop(now + delay + 0.8);
  });
}

// ─── 统一调度 ───

export type BackgroundHandle = {
  source: AudioBufferSourceNode;
  stop: () => void;
};

export function playBackground(
  ctx: AudioContext,
  gain: GainNode,
  theme: SoundTheme,
): BackgroundHandle {
  let source: AudioBufferSourceNode;
  switch (theme) {
    case "ambient":
      source = playAmbientBackground(ctx, gain);
      break;
    case "bell":
      source = playBellBackground(ctx, gain);
      break;
    case "water":
      source = playWaterBackground(ctx, gain);
      break;
  }
  return {
    source,
    stop: () => {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // already stopped
      }
    },
  };
}

export function playCoinSound(ctx: AudioContext, gain: GainNode, theme: SoundTheme): void {
  switch (theme) {
    case "ambient":
      playAmbientCoin(ctx, gain);
      break;
    case "bell":
      playBellCoin(ctx, gain);
      break;
    case "water":
      playWaterCoin(ctx, gain);
      break;
  }
}

export function playYaoSound(ctx: AudioContext, gain: GainNode, theme: SoundTheme): void {
  switch (theme) {
    case "ambient":
      playAmbientYao(ctx, gain);
      break;
    case "bell":
      playBellYao(ctx, gain);
      break;
    case "water":
      playWaterYao(ctx, gain);
      break;
  }
}
