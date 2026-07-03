export interface Note {
  name: string;
  frequency: number;
  octave: number;
  fullName: string;
}

export type NoteKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

// --- Cryptogram unit types ---
// A "unit" is one symbol in the cryptogram alphabet. Today the set is the
// French phoneme inventory; a letter set (or any other symbol set) can be
// swapped in by providing a different SoundUnit[] array.

export type UnitCategory =
  | 'vowel'
  | 'semivowel'
  | 'nasal-vowel'
  | 'plosive'
  | 'nasal-consonant'
  | 'fricative'
  | 'liquid';

export interface GraceOrnament {
  note: string;
  // The score marks some ornaments with an x notehead (air/percussive attack)
  notehead: 'normal' | 'x';
}

export interface SoundUnit {
  // URL-safe identifier (IPA symbols aren't URL-friendly)
  slug: string;
  // The symbol displayed on the page, e.g. 'ɑ̃' or, later, a letter
  symbol: string;
  // Example word containing the sound
  example: string;
  category: UnitCategory;
  // Scientific pitch name Tone.js understands, e.g. 'Bb5'
  note: string;
  // Tone.js-style duration for reference, e.g. '4n.', '2n + 8n'
  duration: string;
  // Canonical duration in quarter-note beats — playback and notation derive from this
  beats: number;
  grace?: GraceOrnament;
}
