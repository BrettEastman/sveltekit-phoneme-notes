// Text → units for any alphabet. Phoneme alphabets go through the French
// spelling-rule engine; letter alphabets are a direct character lookup.

import { phonemize, type PhonemeMatch, type PhonemizeResult } from './phonemize';
import type { Alphabet, SoundUnit } from './types';

const symbolMaps = new WeakMap<Alphabet, Map<string, SoundUnit>>();

// Letters match case-insensitively; symbol units ($, quotes, …) match their
// literal character. Curly and straight quotes/apostrophes are equivalent.
const symbolMapFor = (alphabet: Alphabet): Map<string, SoundUnit> => {
  let map = symbolMaps.get(alphabet);
  if (map) return map;
  map = new Map();
  for (const unit of alphabet.units) {
    map.set(unit.symbol.toLowerCase(), unit);
  }
  const alias = (from: string, slug: string) => {
    const unit = alphabet.units.find((u) => u.slug === slug);
    if (unit && !map!.has(from)) map!.set(from, unit);
  };
  alias(' ', 'space');
  alias('’', 'apostrophe');
  alias('"', 'quote-open'); // straight quotes alternate open/close below
  symbolMaps.set(alphabet, map);
  return map;
};

const tokenizeLetters = (alphabet: Alphabet, input: string): PhonemizeResult => {
  const word = input.normalize('NFC');
  const trimmed = word.trim();
  if (trimmed === '') {
    return { word: trimmed, matches: [], error: null };
  }
  if (trimmed.length > 80) {
    return { word: trimmed, matches: [], error: 'That is a long one! Try under 80 characters.' };
  }

  const map = symbolMapFor(alphabet);
  const quoteUnits = [
    alphabet.units.find((u) => u.slug === 'quote-open'),
    alphabet.units.find((u) => u.slug === 'quote-close')
  ];
  let quoteCount = 0;

  const matches: PhonemeMatch[] = [];
  for (const char of trimmed.replace(/\s+/g, ' ')) {
    let unit = map.get(char.toLowerCase()) ?? null;
    if (char === '"' && quoteUnits[0] && quoteUnits[1]) {
      unit = quoteUnits[quoteCount % 2] ?? null;
      quoteCount += 1;
    }
    // Unknown characters are skipped, same shape as phonemize's silent letters
    matches.push({ grapheme: char, unit });
  }

  if (!matches.some((match) => match.unit)) {
    return { word: trimmed, matches: [], error: 'None of those characters are in this alphabet.' };
  }
  return { word: trimmed, matches, error: null };
};

export const tokenize = (alphabet: Alphabet, input: string): PhonemizeResult =>
  alphabet.kind === 'phoneme' ? phonemize(input) : tokenizeLetters(alphabet, input);

export const tokenizeToUnits = (alphabet: Alphabet, input: string): SoundUnit[] =>
  tokenize(alphabet, input)
    .matches.map((match) => match.unit)
    .filter((unit): unit is SoundUnit => unit !== null);
