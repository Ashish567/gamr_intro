// Tiny 8-bit style blip synth using WebAudio — no audio files needed.

let ctx: AudioContext | null = null;
let muted = false;
let gestureUnlocked = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

function playTone(
  audioCtx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType,
) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + duration,
  );

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function blip(freq: number, duration: number, type: OscillatorType = "square") {
  if (muted) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;

  if (audioCtx.state === "suspended") {
    // Ambient sounds (e.g. the CarRunner's background crash) can fire
    // before the user has ever clicked or pressed a key. Calling resume()
    // outside a real gesture doesn't just fail silently — Chrome logs an
    // "AudioContext was not allowed to start" warning every single time.
    // Skip quietly until unlockAudio() has run from an actual gesture.
    if (!gestureUnlocked) return;
    // A suspended context's currentTime is frozen, so scheduling start/stop
    // against it before resume() settles can land the note entirely in the
    // past by the time playback actually begins — wait for a running clock
    // before reading currentTime for real.
    audioCtx.resume().then(() => playTone(audioCtx, freq, duration, type));
  } else {
    playTone(audioCtx, freq, duration, type);
  }
}

export const sfx = {
  move: () => blip(220, 0.06),
  select: () => blip(440, 0.08),
  confirm: () => {
    blip(523, 0.08);
    setTimeout(() => blip(784, 0.12), 70);
  },
  back: () => blip(180, 0.08, "sawtooth"),
  start: () => {
    blip(392, 0.09);
    setTimeout(() => blip(523, 0.09), 90);
    setTimeout(() => blip(659, 0.16), 180);
  },
};

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

/**
 * Primes the AudioContext during the very first real user gesture on the
 * page. Without this, the CarRunner game-over sound (fired from a
 * requestAnimationFrame loop, not a gesture) could end up being the call
 * that first constructs the context — browsers then keep it permanently
 * suspended, and since the context is a cached singleton, every sound
 * after that stays silent too.
 */
export function unlockAudio() {
  gestureUnlocked = true;
  const audioCtx = getCtx();
  if (audioCtx && audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
}
