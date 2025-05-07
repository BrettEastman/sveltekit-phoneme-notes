import type { Note, NoteKey } from './types';

// Define notes in the 4th octave (middle octave)
export const noteData: Record<NoteKey, Note> = {
  'C': {
    name: 'C',
    frequency: 261.63,
    octave: 4,
    fullName: 'C4'
  },
  'D': {
    name: 'D',
    frequency: 293.66,
    octave: 4,
    fullName: 'D4'
  },
  'E': {
    name: 'E',
    frequency: 329.63,
    octave: 4,
    fullName: 'E4'
  },
  'F': {
    name: 'F',
    frequency: 349.23,
    octave: 4,
    fullName: 'F4'
  },
  'G': {
    name: 'G',
    frequency: 392.00,
    octave: 4,
    fullName: 'G4'
  },
  'A': {
    name: 'A',
    frequency: 440.00,
    octave: 4,
    fullName: 'A4'
  },
  'B': {
    name: 'B',
    frequency: 493.88,
    octave: 4,
    fullName: 'B4'
  }
};

export const noteKeys: NoteKey[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
