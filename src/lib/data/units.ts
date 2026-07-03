import type { SoundUnit, UnitCategory } from '../types';

// Normalized from "FLUTE - Phonétique mastersheet 220528.musicxml"
// (Sibelius export, divisions = 256 per quarter note). Tied notes in the
// score are collapsed into a single total duration; grace notes in the score
// are kept as `grace` ornaments. `beats` is the source of truth for both
// playback and notation; `duration` is the equivalent Tone.js notation.
export const units: SoundUnit[] = [
  // Measure 1 — vowels
  { slug: 'a', symbol: 'a', example: 'patte', category: 'vowel', note: 'A5', duration: '8n', beats: 0.5 },
  { slug: 'ah', symbol: 'ɑ', example: 'pâte', category: 'vowel', note: 'Bb5', duration: '4n', beats: 1 },
  { slug: 'e', symbol: 'e', example: 'été', category: 'vowel', note: 'C6', duration: '16n', beats: 0.25 },
  { slug: 'eh', symbol: 'ɛ', example: 'mère', category: 'vowel', note: 'D6', duration: '8n', beats: 0.5 },
  { slug: 'schwa', symbol: 'ə', example: 'le', category: 'vowel', note: 'E6', duration: '8n', beats: 0.5 },
  { slug: 'oe', symbol: 'œ', example: 'peur', category: 'vowel', note: 'F6', duration: '8n', beats: 0.5 },
  { slug: 'eu', symbol: 'ø', example: 'peu', category: 'vowel', note: 'G6', duration: '8n', beats: 0.5 },
  { slug: 'o', symbol: 'o', example: 'mot', category: 'vowel', note: 'B5', duration: '8n.', beats: 0.75 },
  { slug: 'aw', symbol: 'ɔ', example: 'sort', category: 'vowel', note: 'F#6', duration: '16n', beats: 0.25 },
  { slug: 'i', symbol: 'i', example: 'si', category: 'vowel', note: 'F#5', duration: '16n', beats: 0.25 },
  { slug: 'y', symbol: 'y', example: 'tu', category: 'vowel', note: 'F#4', duration: '4n.', beats: 1.5 },
  { slug: 'u', symbol: 'u', example: 'fou', category: 'vowel', note: 'Ab5', duration: '4n.', beats: 1.5 },

  // Measure 2 — semivowels
  { slug: 'j', symbol: 'j', example: 'yeux', category: 'semivowel', note: 'Eb6', duration: '8n.', beats: 0.75 },
  { slug: 'w', symbol: 'w', example: 'oui', category: 'semivowel', note: 'B4', duration: '4n.', beats: 1.5 },
  { slug: 'ui', symbol: 'ɥ', example: 'huit', category: 'semivowel', note: 'C5', duration: '2n + 8n.', beats: 2.75 },

  // Measure 3 — nasal vowels
  { slug: 'an', symbol: 'ɑ̃', example: 'sans', category: 'nasal-vowel', note: 'A4', duration: '4n.', beats: 1.5 },
  { slug: 'on', symbol: 'ɔ̃', example: 'bon', category: 'nasal-vowel', note: 'B4', duration: '2n', beats: 2 },
  { slug: 'un', symbol: 'œ̃', example: 'brun', category: 'nasal-vowel', note: 'Ab4', duration: '4n.', beats: 1.5 },
  { slug: 'in', symbol: 'ɛ̃', example: 'vin', category: 'nasal-vowel', note: 'C#6', duration: '8n', beats: 0.5 },

  // Measures 4–5 — plosives
  { slug: 't', symbol: 't', example: 'tout', category: 'plosive', note: 'G5', duration: '2n', beats: 2, grace: { note: 'G5', notehead: 'normal' } },
  { slug: 'k', symbol: 'k', example: 'coup', category: 'plosive', note: 'C5', duration: '2n + 8n', beats: 2.5, grace: { note: 'C5', notehead: 'x' } },
  { slug: 'p', symbol: 'p', example: 'pas', category: 'plosive', note: 'Bb4', duration: '2n + 8n', beats: 2.5, grace: { note: 'Bb4', notehead: 'normal' } },
  { slug: 'b', symbol: 'b', example: 'bon', category: 'plosive', note: 'Bb5', duration: '2n', beats: 2 },
  { slug: 'd', symbol: 'd', example: 'dans', category: 'plosive', note: 'D5', duration: '2n', beats: 2 },
  { slug: 'g', symbol: 'g', example: 'gare', category: 'plosive', note: 'G5', duration: '4n', beats: 1 },

  // Measure 6 — nasal consonants
  { slug: 'm', symbol: 'm', example: 'mou', category: 'nasal-consonant', note: 'Eb4', duration: '4n + 16n', beats: 1.25 },
  { slug: 'n', symbol: 'n', example: 'nous', category: 'nasal-consonant', note: 'A4', duration: '4n', beats: 1 },
  { slug: 'gn', symbol: 'ɲ', example: 'agneau', category: 'nasal-consonant', note: 'A6', duration: '8n.', beats: 0.75 },
  { slug: 'ng', symbol: 'ŋ', example: 'parking', category: 'nasal-consonant', note: 'A5', duration: '4n + 16n', beats: 1.25 },

  // Measures 7–8 — fricatives
  { slug: 'f', symbol: 'f', example: 'feu', category: 'fricative', note: 'F5', duration: '8n.', beats: 0.75, grace: { note: 'F5', notehead: 'x' } },
  { slug: 's', symbol: 's', example: 'sou', category: 'fricative', note: 'E5', duration: '4n', beats: 1, grace: { note: 'E5', notehead: 'x' } },
  { slug: 'ch', symbol: 'ʃ', example: 'chat', category: 'fricative', note: 'Eb5', duration: '4n + 16n', beats: 1.25, grace: { note: 'Eb5', notehead: 'x' } },
  { slug: 'v', symbol: 'v', example: 'vous', category: 'fricative', note: 'Bb5', duration: '8n', beats: 0.5, grace: { note: 'Bb5', notehead: 'normal' } },
  { slug: 'z', symbol: 'z', example: 'zéro', category: 'fricative', note: 'Eb5', duration: '4n.', beats: 1.5, grace: { note: 'Eb5', notehead: 'normal' } },
  { slug: 'zh', symbol: 'ʒ', example: 'je', category: 'fricative', note: 'Eb4', duration: '4n + 16n', beats: 1.25, grace: { note: 'Eb4', notehead: 'normal' } },

  // Measure 9 — liquids
  { slug: 'l', symbol: 'l', example: 'lit', category: 'liquid', note: 'Ab4', duration: '4n', beats: 1 },
  { slug: 'r', symbol: 'ʁ', example: 'rue', category: 'liquid', note: 'Ab5', duration: '2n', beats: 2 }
];

export const categoryLabels: Record<UnitCategory, string> = {
  vowel: 'Vowels',
  semivowel: 'Semivowels',
  'nasal-vowel': 'Nasal vowels',
  plosive: 'Plosives',
  'nasal-consonant': 'Nasal consonants',
  fricative: 'Fricatives',
  liquid: 'Liquids'
};

export const categoryOrder: UnitCategory[] = [
  'vowel',
  'semivowel',
  'nasal-vowel',
  'plosive',
  'nasal-consonant',
  'fricative',
  'liquid'
];

export const getUnitIndex = (slug: string): number =>
  units.findIndex((unit) => unit.slug === slug);

export const getUnit = (slug: string): SoundUnit | undefined =>
  units[getUnitIndex(slug)];
