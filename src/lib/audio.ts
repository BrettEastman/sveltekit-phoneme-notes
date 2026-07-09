import * as Tone from 'tone';
import type { SoundUnit } from './types';

let synth: Tone.Synth | null = null;
let unmuteElement: HTMLAudioElement | null = null;

// iOS mutes Web Audio when the ring/silent switch is on, because it runs in
// the "ambient" audio session. Playing any looping <audio> element promotes
// the session to "playback", which ignores the switch — the standard
// workaround used by web games. Only needed (and only run) on iOS.
const isIOS = (): boolean =>
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports as desktop Safari but has touch support
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

// Half a second of silence, built by hand (8kHz 8-bit mono PCM, ~4KB).
// iOS ignores looping media that is effectively zero-length, so the file
// needs real duration to hold the session in "playback".
const createSilentWavUrl = (): string => {
  const sampleRate = 8000;
  const numSamples = sampleRate / 2;
  const buffer = new ArrayBuffer(44 + numSamples);
  const view = new DataView(buffer);
  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true); // byte rate
  view.setUint16(32, 1, true); // block align
  view.setUint16(34, 8, true); // bits per sample
  writeString(36, 'data');
  view.setUint32(40, numSamples, true);
  // 8-bit PCM silence sits at the unsigned midpoint
  new Uint8Array(buffer, 44).fill(128);
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
};

const engagePlaybackSession = (): void => {
  if (!isIOS()) return;
  if (!unmuteElement) {
    unmuteElement = new Audio(createSilentWavUrl());
    unmuteElement.loop = true;
    unmuteElement.preload = 'auto';
  }
  // Rejection just means we stay in ambient mode — no worse than before
  unmuteElement.play().catch(() => {});
};

// Tempo used to realize notated durations. At 60 BPM a quarter note ('4n')
// lasts exactly one second.
export const BPM = 60;

export const beatsToSeconds = (beats: number): number => beats * (60 / BPM);

export const initAudio = async (): Promise<void> => {
  // Runs inside the click's gesture context, which iOS requires
  engagePlaybackSession();

  // Initialize audio context
  await Tone.start();

  // iOS can leave the context "interrupted" after a phone call or
  // backgrounding, and Tone.start() alone doesn't always recover it
  const rawContext = Tone.getContext().rawContext;
  if (rawContext.state !== 'running') {
    await rawContext.resume();
  }

  // Create synth if it doesn't exist
  if (!synth) {
    synth = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
  }
};

// Play a cryptogram unit with its exact notated duration. Initializes the
// audio context on first call — safe because this always runs from a user
// gesture (button click).
export const playUnit = async (unit: SoundUnit): Promise<void> => {
  await initAudio();
  // Rest units "play" as silence — the button still holds for the duration
  if (unit.rest || !unit.note) return;
  synth?.triggerAttackRelease(unit.note, beatsToSeconds(unit.beats));
};

// Play a sequence of units back to back. Returns the melody's total duration
// in seconds so callers can time UI state. Notes are shortened slightly so
// the monophonic synth articulates repeated pitches instead of slurring them.
export const playMelody = async (units: SoundUnit[]): Promise<number> => {
  await initAudio();

  const start = Tone.now() + 0.05;
  let offset = 0;
  for (const unit of units) {
    const duration = beatsToSeconds(unit.beats);
    // Rest units advance time without sounding
    if (!unit.rest && unit.note) {
      synth?.triggerAttackRelease(
        unit.note,
        Math.max(duration - 0.06, 0.05),
        start + offset
      );
    }
    offset += duration;
  }
  return offset;
};
