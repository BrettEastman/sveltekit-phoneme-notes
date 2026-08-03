// --- Cryptogram alphabet types ---
// An "alphabet" is a full symbol set (French phonemes, A–Z letters, …); a
// "unit" is one symbol in it. Alphabets carry their own categories, clef,
// and tokenizer kind, so new symbol sets are pure data.

export type Clef = "treble" | "bass";

export type NoteheadStyle = "normal" | "x" | "triangle-inverted";

export interface GraceOrnament {
  note: string;
  // The score marks some ornaments with special noteheads (air/percussive attack)
  notehead: NoteheadStyle;
}

export interface SoundUnit {
  // URL-safe identifier (IPA symbols and punctuation aren't URL-friendly)
  slug: string;
  // The symbol displayed on the page, e.g. 'ɑ̃', 'A', or '¶'
  symbol: string;
  // Example word containing the sound (phoneme alphabets)
  example?: string;
  // Category id, defined by the owning Alphabet
  category: string;
  // Scientific pitch name Tone.js understands, e.g. 'Bb5'; absent for rests
  note?: string;
  // Punctuation units render and play as rests
  rest?: boolean;
  // Tone.js-style duration for reference, e.g. '4n.', '2n + 8n'
  duration: string;
  // Canonical duration in quarter-note beats — playback and notation derive from this
  beats: number;
  // Clef override for this unit (e.g. Messiaen's bass-register letters)
  clef?: Clef;
  // Special notehead on the main note (e.g. x noteheads on flute symbols)
  notehead?: NoteheadStyle;
  grace?: GraceOrnament;
}

export interface AlphabetCategory {
  id: string;
  label: string;
}

export interface Alphabet {
  // URL slug: /[id]/, /[id]/unit/[slug], /[id]/melody
  id: string;
  name: string;
  // Shown on the landing card and the alphabet's index page
  description: string;
  // Default clef; individual units may override
  clef: Clef;
  // Picks the text → units tokenizer: French spelling rules vs letter lookup
  kind: "phoneme" | "letter";
  // Display order of the index page sections
  categories: AlphabetCategory[];
  units: SoundUnit[];
}
