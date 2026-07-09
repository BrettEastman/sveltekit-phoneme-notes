import type { Alphabet, SoundUnit } from '../../types';

// Normalized from "ALPHABETs - ALL.musicxml", section "Messiaen's alphabet
// for Mystère de la sainte trinité". The alphabet spans a wide register:
// several letters live in the bass clef (per-unit `clef` overrides).
const units: SoundUnit[] = [
  { slug: 'a', symbol: 'A', category: 'letter', note: 'A4', duration: '8n', beats: 0.5 },
  { slug: 'b', symbol: 'B', category: 'letter', note: 'Bb4', duration: '8n.', beats: 0.75 },
  { slug: 'c', symbol: 'C', category: 'letter', note: 'C5', duration: '8n', beats: 0.5 },
  { slug: 'd', symbol: 'D', category: 'letter', note: 'D5', duration: '8n', beats: 0.5 },
  { slug: 'e', symbol: 'E', category: 'letter', note: 'E5', duration: '16n', beats: 0.25 },
  { slug: 'f', symbol: 'F', category: 'letter', note: 'F5', duration: '4n.', beats: 1.5 },
  { slug: 'g', symbol: 'G', category: 'letter', note: 'G5', duration: '8n.', beats: 0.75 },
  { slug: 'h', symbol: 'H', category: 'letter', note: 'B4', duration: '8n.', beats: 0.75 },
  { slug: 'i', symbol: 'I', category: 'letter', note: 'F#6', duration: '16n', beats: 0.25 },
  { slug: 'j', symbol: 'J', category: 'letter', note: 'F#5', duration: '16n', beats: 0.25 },
  { slug: 'k', symbol: 'K', category: 'letter', note: 'C3', duration: '8n', beats: 0.5, clef: 'bass' },
  { slug: 'l', symbol: 'L', category: 'letter', note: 'Eb5', duration: '8n', beats: 0.5 },
  { slug: 'm', symbol: 'M', category: 'letter', note: 'Ab5', duration: '2n', beats: 2 },
  { slug: 'n', symbol: 'N', category: 'letter', note: 'Eb4', duration: '4n.', beats: 1.5 },
  { slug: 'o', symbol: 'O', category: 'letter', note: 'B5', duration: '2n + 8n.', beats: 2.75 },
  { slug: 'p', symbol: 'P', category: 'letter', note: 'G3', duration: '4n', beats: 1, clef: 'bass' },
  { slug: 'q', symbol: 'Q', category: 'letter', note: 'C4', duration: '8n', beats: 0.5, clef: 'bass' },
  { slug: 'r', symbol: 'R', category: 'letter', note: 'E6', duration: '8n.', beats: 0.75 },
  { slug: 's', symbol: 'S', category: 'letter', note: 'F6', duration: '4n', beats: 1 },
  { slug: 't', symbol: 'T', category: 'letter', note: 'D2', duration: '2n + 16n', beats: 2.25, clef: 'bass' },
  { slug: 'u', symbol: 'U', category: 'letter', note: 'C#3', duration: '4n + 16n', beats: 1.25, clef: 'bass' },
  { slug: 'v', symbol: 'V', category: 'letter', note: 'D4', duration: '8n', beats: 0.5 },
  { slug: 'w', symbol: 'W', category: 'letter', note: 'D6', duration: '8n', beats: 0.5 },
  { slug: 'x', symbol: 'X', category: 'letter', note: 'G#4', duration: '8n', beats: 0.5 },
  { slug: 'y', symbol: 'Y', category: 'letter', note: 'F#4', duration: '16n', beats: 0.25 },
  { slug: 'z', symbol: 'Z', category: 'letter', note: 'F3', duration: '4n', beats: 1, clef: 'bass' }
];

export const messiaen: Alphabet = {
  id: 'messiaen',
  name: 'Messiaen',
  description:
    'Olivier Messiaen’s "langage communicable" from Méditations sur le Mystère de la Sainte Trinité (1969) — the alphabet he used to spell text into organ music, spanning from deep bass to high treble.',
  clef: 'treble',
  kind: 'letter',
  categories: [{ id: 'letter', label: 'Letters' }],
  units
};
