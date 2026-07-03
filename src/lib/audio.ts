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

export const playNote = (noteName: string, duration: string = '8n'): void => {
  if (!synth) {
    console.error('Synth not initialized. Call initAudio() first.');
    return;
  }

  // Play the note with the given duration
  synth.triggerAttackRelease(noteName, duration);
};

// Play a cryptogram unit with its exact notated duration. Initializes the
// audio context on first call — safe because this always runs from a user
// gesture (button click).
export const playUnit = async (unit: SoundUnit): Promise<void> => {
  await initAudio();
  synth?.triggerAttackRelease(unit.note, beatsToSeconds(unit.beats));
};
