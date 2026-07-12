// Web MIDI output: route playback to a hardware/virtual MIDI port instead of
// the built-in synth. Chrome, Edge, and Firefox expose
// navigator.requestMIDIAccess; Safari does not, so all UI gates on
// midiSupported().

import { beatsToSeconds, parseNote } from './music';
import type { SoundUnit } from './types';

export interface MidiOutputInfo {
  id: string;
  name: string;
}

let access: MIDIAccess | null = null;

export const midiSupported = (): boolean =>
  typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;

// Resolves once the browser grants MIDI access (first call may show a
// permission prompt, so call from a user gesture). Cached afterwards.
export const initMidi = async (): Promise<MIDIAccess> => {
  if (!midiSupported()) {
    throw new Error('Web MIDI is not supported in this browser');
  }
  if (!access) {
    access = await navigator.requestMIDIAccess();
  }
  return access;
};

export const listOutputs = (): MidiOutputInfo[] =>
  access
    ? [...access.outputs.values()].map((output) => ({
        id: output.id,
        name: output.name ?? output.id
      }))
    : [];

export const getOutput = (id: string): MIDIOutput | null =>
  access?.outputs.get(id) ?? null;

// Fires on device hot-plug/unplug. Returns an unsubscribe function.
export const onMidiStateChange = (listener: () => void): (() => void) => {
  access?.addEventListener('statechange', listener);
  return () => access?.removeEventListener('statechange', listener);
};

const SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11
};

// Scientific pitch name → MIDI note number (A4 = 69)
export const noteToMidi = (note: string): number => {
  const { letter, accidental, octave } = parseNote(note);
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
  return (octave + 1) * 12 + SEMITONES[letter] + shift;
};

const NOTE_ON = 0x90; // channel 1
const NOTE_OFF = 0x80;
const VELOCITY = 96;

// Schedule a unit sequence on a MIDI port using the same timing as the synth
// path in audio.ts: rests advance time silently, and notes are shortened
// slightly so repeated pitches articulate. MIDIOutput.send timestamps are
// performance.now()-based milliseconds, so the whole melody can be queued up
// front. Returns the total duration in seconds.
export const playMelodyMidi = (output: MIDIOutput, units: SoundUnit[]): number => {
  const start = performance.now() + 50;
  let offset = 0;
  for (const unit of units) {
    const duration = beatsToSeconds(unit.beats);
    if (!unit.rest && unit.note) {
      const midiNote = noteToMidi(unit.note);
      const sounding = Math.max(duration - 0.06, 0.05);
      output.send([NOTE_ON, midiNote, VELOCITY], start + offset * 1000);
      output.send([NOTE_OFF, midiNote, 0], start + (offset + sounding) * 1000);
    }
    offset += duration;
  }
  return offset;
};

// CC 123 "all notes off" — safety valve if a device disappears mid-melody
export const stopAll = (output: MIDIOutput): void => {
  output.send([0xb0, 123, 0]);
};
