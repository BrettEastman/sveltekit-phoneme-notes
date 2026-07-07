import * as Tone from 'tone';
import type { SoundUnit } from './types';

let synth: Tone.Synth | null = null;

// Tempo used to realize notated durations. At 60 BPM a quarter note ('4n')
// lasts exactly one second.
export const BPM = 60;

export const beatsToSeconds = (beats: number): number => beats * (60 / BPM);

export const initAudio = async (): Promise<void> => {
  // Initialize audio context
  await Tone.start();
  
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
    synth?.triggerAttackRelease(
      unit.note,
      Math.max(duration - 0.06, 0.05),
      start + offset
    );
    offset += duration;
  }
  return offset;
};
