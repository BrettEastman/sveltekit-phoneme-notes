import type { Alphabet, SoundUnit } from '../../types';

// Normalized from "ALPHABETs - ALL.musicxml", section "Eastman alphabet for
// contraforte". Bass clef throughout; some grace ornaments use x or inverted
// triangle noteheads in the score.
const units: SoundUnit[] = [
  { slug: 'a', symbol: 'A', category: 'letter', note: 'A3', duration: '8n', beats: 0.5 },
  { slug: 'b', symbol: 'B', category: 'letter', note: 'Bb3', duration: '4n', beats: 1 },
  { slug: 'c', symbol: 'C', category: 'letter', note: 'C4', duration: '16n', beats: 0.25 },
  { slug: 'd', symbol: 'D', category: 'letter', note: 'D4', duration: '8n', beats: 0.5 },
  { slug: 'e', symbol: 'E', category: 'letter', note: 'E4', duration: '8n', beats: 0.5 },
  { slug: 'f', symbol: 'F', category: 'letter', note: 'F4', duration: '8n', beats: 0.5, grace: { note: 'F4', notehead: 'normal' } },
  { slug: 'g', symbol: 'G', category: 'letter', note: 'G4', duration: '8n', beats: 0.5 },
  { slug: 'h', symbol: 'H', category: 'letter', note: 'B3', duration: '8n.', beats: 0.75 },
  { slug: 'i', symbol: 'I', category: 'letter', note: 'F#4', duration: '16n', beats: 0.25 },
  { slug: 'j', symbol: 'J', category: 'letter', note: 'F#3', duration: '16n', beats: 0.25, grace: { note: 'F#3', notehead: 'triangle-inverted' } },
  { slug: 'k', symbol: 'K', category: 'letter', note: 'C3', duration: '4n.', beats: 1.5, grace: { note: 'C3', notehead: 'normal' } },
  { slug: 'l', symbol: 'L', category: 'letter', note: 'Ab3', duration: '8n', beats: 0.5 },
  { slug: 'm', symbol: 'M', category: 'letter', note: 'Eb4', duration: '16n', beats: 0.25 },
  { slug: 'n', symbol: 'N', category: 'letter', note: 'A2', duration: '4n.', beats: 1.5 },
  { slug: 'o', symbol: 'O', category: 'letter', note: 'D3', duration: '2n + 8n.', beats: 2.75 },
  { slug: 'p', symbol: 'P', category: 'letter', note: 'Bb4', duration: '8n', beats: 0.5, grace: { note: 'Bb4', notehead: 'normal' } },
  { slug: 'q', symbol: 'Q', category: 'letter', note: 'C2', duration: '2n', beats: 2 },
  { slug: 'r', symbol: 'R', category: 'letter', note: 'Ab2', duration: '4n.', beats: 1.5 },
  { slug: 's', symbol: 'S', category: 'letter', note: 'C#5', duration: '16n', beats: 0.25, grace: { note: 'C#5', notehead: 'normal' } },
  { slug: 't', symbol: 'T', category: 'letter', note: 'G3', duration: '2n', beats: 2, grace: { note: 'G3', notehead: 'normal' } },
  { slug: 'u', symbol: 'U', category: 'letter', note: 'C3', duration: '2n + 8n', beats: 2.5 },
  { slug: 'v', symbol: 'V', category: 'letter', note: 'B2', duration: '2n', beats: 2, grace: { note: 'B2', notehead: 'triangle-inverted' } },
  { slug: 'w', symbol: 'W', category: 'letter', note: 'B1', duration: '2n', beats: 2 },
  { slug: 'x', symbol: 'X', category: 'letter', note: 'F2', duration: '2n', beats: 2 },
  { slug: 'y', symbol: 'Y', category: 'letter', note: 'F#3', duration: '8n', beats: 0.5 },
  { slug: 'z', symbol: 'Z', category: 'letter', note: 'C#2', duration: '4n.', beats: 1.5, grace: { note: 'C#2', notehead: 'triangle-inverted' } }
];

export const contraforte: Alphabet = {
  id: 'contraforte',
  name: 'Contraforte',
  description:
    'An original A–Z alphabet for contraforte — the contrabassoon’s modern cousin — living deep in the bass clef, from B1 up to C#5.',
  clef: 'bass',
  kind: 'letter',
  categories: [{ id: 'letter', label: 'Letters' }],
  units
};
