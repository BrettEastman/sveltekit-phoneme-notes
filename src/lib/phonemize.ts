// Rule-based French grapheme-to-phoneme conversion. Turns a single written
// word into a sequence of cryptogram units (see data/units.ts). The rules are
// deliberately approximate: French spelling is regular enough that an ordered
// list of context-sensitive rules plus a small exception list reads most words
// correctly, and occasional misses are acceptable in a playful feature.

import { units } from './data/units';
import type { SoundUnit } from './types';

export interface PhonemeMatch {
  // The spelling slice that produced this phoneme ('' for exception words
  // beyond their first phoneme). Silent letters produce a match with no unit.
  grapheme: string;
  unit: SoundUnit | null;
}

export interface PhonemizeResult {
  // Normalized form of the input actually parsed
  word: string;
  matches: PhonemeMatch[];
  error: string | null;
}

const unitBySymbol = new Map(units.map((unit) => [unit.symbol, unit]));

const VOWEL_LETTERS = 'aàâäeéèêëiîïoôöuùûüyœ';
const isVowelLetter = (ch: string | undefined): boolean =>
  ch !== undefined && VOWEL_LETTERS.includes(ch);
const isConsonantLetter = (ch: string | undefined): boolean =>
  ch !== undefined && !VOWEL_LETTERS.includes(ch) && ch !== 'h';

// Final consonants that usually sound ("CaReFuL"); everything else is silent
const SOUNDED_FINALS = 'crfl';

interface RuleContext {
  word: string;
  // Start index of the matched grapheme, and the index just past it
  i: number;
  end: number;
}

interface Rule {
  g: string;
  out: string[];
  when?: (ctx: RuleContext) => boolean;
}

const atEnd = ({ word, end }: RuleContext): boolean => end === word.length;

// A vowel + n/m group is nasal when followed by a consonant (other than
// another n/m, which denasalizes: "bonne") or the end of the word
const nasalContext = ({ word, end }: RuleContext): boolean => {
  const next = word[end];
  return next === undefined || (!isVowelLetter(next) && next !== 'n' && next !== 'm');
};

const nextIsVowel = ({ word, end }: RuleContext): boolean => isVowelLetter(word[end]);

// Whole-word irregulars: function words with sounded schwa, common words the
// rules misread, and numbers with sounded final consonants
const EXCEPTIONS: Record<string, string[]> = {
  e: ['ə'],
  le: ['l', 'ə'],
  de: ['d', 'ə'],
  ce: ['s', 'ə'],
  que: ['k', 'ə'],
  je: ['ʒ', 'ə'],
  me: ['m', 'ə'],
  te: ['t', 'ə'],
  se: ['s', 'ə'],
  ne: ['n', 'ə'],
  et: ['e'],
  est: ['ɛ'],
  les: ['l', 'e'],
  des: ['d', 'e'],
  mes: ['m', 'e'],
  tes: ['t', 'e'],
  ses: ['s', 'e'],
  ces: ['s', 'e'],
  ville: ['v', 'i', 'l'],
  mille: ['m', 'i', 'l'],
  tranquille: ['t', 'ʁ', 'ɑ̃', 'k', 'i', 'l'],
  fils: ['f', 'i', 's'],
  femme: ['f', 'a', 'm'],
  monsieur: ['m', 'ə', 's', 'j', 'ø'],
  temps: ['t', 'ɑ̃'],
  cinq: ['s', 'ɛ̃', 'k'],
  six: ['s', 'i', 's'],
  sept: ['s', 'ɛ', 't'],
  huit: ['ɥ', 'i', 't'],
  dix: ['d', 'i', 's'],
  neuf: ['n', 'œ', 'f'],
  œuf: ['œ', 'f'],
  œil: ['œ', 'j'],
  oignon: ['ɔ', 'ɲ', 'ɔ̃'],
  blanc: ['b', 'l', 'ɑ̃'],
  mer: ['m', 'ɛ', 'ʁ'],
  fer: ['f', 'ɛ', 'ʁ'],
  cher: ['ʃ', 'ɛ', 'ʁ'],
  hier: ['j', 'ɛ', 'ʁ'],
  hiver: ['i', 'v', 'ɛ', 'ʁ']
};

// Ordered scan rules — first match at each position wins, so longer and more
// specific graphemes come before shorter and more general ones
const RULES: Rule[] = [
  // Trigraphs and endings
  { g: 'eau', out: ['o'] },
  { g: 'tion', out: ['s', 'j', 'ɔ̃'], when: atEnd },
  { g: 'ing', out: ['i', 'ŋ'], when: atEnd },
  { g: 'oin', out: ['w', 'ɛ̃'], when: nasalContext },
  // -il(l)- families carry their own vowel
  { g: 'ouill', out: ['u', 'j'] },
  { g: 'euill', out: ['œ', 'j'] },
  { g: 'ueil', out: ['œ', 'j'] },
  { g: 'euil', out: ['œ', 'j'], when: atEnd },
  { g: 'aill', out: ['a', 'j'] },
  { g: 'ail', out: ['a', 'j'], when: atEnd },
  { g: 'eill', out: ['ɛ', 'j'] },
  { g: 'eil', out: ['ɛ', 'j'], when: atEnd },
  { g: 'ill', out: ['i', 'j'], when: (c) => c.i > 0 && !isVowelLetter(c.word[c.i - 1]) },
  { g: 'ill', out: ['j'] },
  // Nasal vowels
  { g: 'ain', out: ['ɛ̃'], when: nasalContext },
  { g: 'aim', out: ['ɛ̃'], when: nasalContext },
  { g: 'ein', out: ['ɛ̃'], when: nasalContext },
  { g: 'en', out: ['ɛ̃'], when: (c) => c.word[c.i - 1] === 'i' && nasalContext(c) },
  { g: 'in', out: ['ɛ̃'], when: nasalContext },
  { g: 'im', out: ['ɛ̃'], when: nasalContext },
  { g: 'yn', out: ['ɛ̃'], when: nasalContext },
  { g: 'ym', out: ['ɛ̃'], when: nasalContext },
  { g: 'an', out: ['ɑ̃'], when: nasalContext },
  { g: 'am', out: ['ɑ̃'], when: nasalContext },
  { g: 'en', out: ['ɑ̃'], when: nasalContext },
  { g: 'em', out: ['ɑ̃'], when: nasalContext },
  { g: 'on', out: ['ɔ̃'], when: nasalContext },
  { g: 'om', out: ['ɔ̃'], when: nasalContext },
  { g: 'un', out: ['œ̃'], when: nasalContext },
  { g: 'um', out: ['œ̃'], when: nasalContext },
  // Vowel digraphs
  { g: 'au', out: ['o'] },
  { g: 'oi', out: ['w', 'a'] },
  { g: 'où', out: ['u'] },
  { g: 'oû', out: ['u'] },
  { g: 'ou', out: ['w'], when: nextIsVowel },
  { g: 'ou', out: ['u'] },
  { g: 'œu', out: ['œ'], when: (c) => c.word[c.end] === 'r' },
  { g: 'œu', out: ['ø'] },
  { g: 'œ', out: ['œ'] },
  { g: 'eu', out: ['œ'], when: (c) => c.word[c.end] === 'r' },
  { g: 'eu', out: ['ø'] },
  { g: 'ai', out: ['ɛ'] },
  { g: 'ei', out: ['ɛ'] },
  // e + final-letter endings
  { g: 'er', out: ['e'], when: atEnd },
  { g: 'ez', out: ['e'], when: atEnd },
  { g: 'et', out: ['ɛ'], when: atEnd },
  { g: 'es', out: [], when: atEnd },
  // Consonant digraphs
  { g: 'ch', out: ['ʃ'] },
  { g: 'gn', out: ['ɲ'] },
  { g: 'ng', out: ['ŋ'], when: atEnd },
  { g: 'ph', out: ['f'] },
  { g: 'th', out: ['t'] },
  { g: 'qu', out: ['k'] },
  { g: 'gu', out: ['g'], when: (c) => 'eiy'.includes(c.word[c.end] ?? '') },
  // Doubled consonants collapse
  { g: 'ss', out: ['s'] },
  { g: 'll', out: ['l'] },
  { g: 'mm', out: ['m'] },
  { g: 'nn', out: ['n'] },
  { g: 'tt', out: ['t'] },
  { g: 'pp', out: ['p'] },
  { g: 'rr', out: ['ʁ'] },
  { g: 'ff', out: ['f'] },
  { g: 'dd', out: ['d'] },
  { g: 'cc', out: ['k', 's'], when: (c) => 'eiy'.includes(c.word[c.end] ?? '') },
  { g: 'cc', out: ['k'] },
  { g: 'bb', out: ['b'] },
  { g: 'gg', out: ['g'] },
  { g: 'zz', out: ['z'] },
  // Single vowels
  { g: 'â', out: ['ɑ'] },
  { g: 'à', out: ['a'] },
  { g: 'ä', out: ['a'] },
  { g: 'a', out: ['a'] },
  { g: 'é', out: ['e'] },
  { g: 'è', out: ['ɛ'] },
  { g: 'ê', out: ['ɛ'] },
  { g: 'ë', out: ['ɛ'] },
  { g: 'e', out: [], when: atEnd },
  {
    g: 'e',
    // Closed syllable: two consonants follow → open è sound ("reste", "belle")
    out: ['ɛ'],
    when: (c) => isConsonantLetter(c.word[c.end]) && isConsonantLetter(c.word[c.end + 1])
  },
  {
    g: 'e',
    // Before a single final consonant: é if that consonant is silent
    // ("pied"), è if it sounds ("avec", "sel")
    out: ['e'],
    when: (c) =>
      isConsonantLetter(c.word[c.end]) &&
      c.end + 1 === c.word.length &&
      !SOUNDED_FINALS.includes(c.word[c.end])
  },
  {
    g: 'e',
    out: ['ɛ'],
    when: (c) => isConsonantLetter(c.word[c.end]) && c.end + 1 === c.word.length
  },
  { g: 'e', out: ['ə'] },
  { g: 'î', out: ['i'] },
  { g: 'ï', out: ['i'] },
  { g: 'i', out: ['j'], when: nextIsVowel },
  { g: 'i', out: ['i'] },
  { g: 'y', out: ['j'], when: nextIsVowel },
  { g: 'y', out: ['i'] },
  { g: 'ô', out: ['o'] },
  { g: 'ö', out: ['o'] },
  {
    g: 'o',
    // Open ɔ before a sounded (non-final) consonant: "sort", "porte"
    out: ['ɔ'],
    when: (c) => isConsonantLetter(c.word[c.end]) && c.end + 1 < c.word.length
  },
  { g: 'o', out: ['o'] },
  { g: 'û', out: ['y'] },
  { g: 'ù', out: ['y'] },
  { g: 'ü', out: ['y'] },
  { g: 'u', out: ['ɥ'], when: nextIsVowel },
  { g: 'u', out: ['y'] },
  // Consonants
  { g: 'ç', out: ['s'] },
  { g: 'c', out: ['s'], when: (c) => 'eiy'.includes(c.word[c.end] ?? '') },
  { g: 'c', out: ['k'] },
  { g: 'g', out: ['ʒ'], when: (c) => 'eiy'.includes(c.word[c.end] ?? '') },
  { g: 'g', out: ['g'] },
  { g: 's', out: ['z'], when: (c) => isVowelLetter(c.word[c.i - 1]) && isVowelLetter(c.word[c.end]) },
  { g: 's', out: ['s'] },
  { g: 'x', out: ['k', 's'] },
  { g: 'j', out: ['ʒ'] },
  { g: 'r', out: ['ʁ'] },
  { g: 'h', out: [] },
  { g: 'q', out: ['k'] },
  { g: 'w', out: ['w'] },
  { g: 'b', out: ['b'] },
  { g: 'd', out: ['d'] },
  { g: 'f', out: ['f'] },
  { g: 'k', out: ['k'] },
  { g: 'l', out: ['l'] },
  { g: 'm', out: ['m'] },
  { g: 'n', out: ['n'] },
  { g: 'p', out: ['p'] },
  { g: 't', out: ['t'] },
  { g: 'v', out: ['v'] },
  { g: 'z', out: ['z'] }
];

const symbolsToMatches = (symbols: string[], grapheme: string): PhonemeMatch[] =>
  symbols
    .map((symbol, index) => ({
      grapheme: index === 0 ? grapheme : '',
      unit: unitBySymbol.get(symbol) ?? null
    }))
    .filter((match) => match.unit !== null);

export const phonemize = (input: string): PhonemizeResult => {
  const word = input
    .trim()
    .toLowerCase()
    .normalize('NFC')
    .replace(/oe/g, 'œ');

  if (word === '') {
    return { word, matches: [], error: null };
  }
  if (!/^[a-zàâäçéèêëîïôöùûüœ]+$/.test(word)) {
    return { word, matches: [], error: 'One French word, letters only.' };
  }
  if (word.length > 24) {
    return { word, matches: [], error: 'That is a long word! Try one under 25 letters.' };
  }

  const exception = EXCEPTIONS[word];
  if (exception) {
    return { word, matches: symbolsToMatches(exception, word), error: null };
  }

  const matches: PhonemeMatch[] = [];
  let i = 0;
  while (i < word.length) {
    // Generic silent final consonant ("chat", "sans", "grand"); final c is
    // also silent after a nasal ("blanc" is an exception either way)
    if (
      i === word.length - 1 &&
      isConsonantLetter(word[i]) &&
      !SOUNDED_FINALS.includes(word[i])
    ) {
      matches.push({ grapheme: word[i], unit: null });
      i += 1;
      continue;
    }

    const rule = RULES.find((candidate) => {
      if (!word.startsWith(candidate.g, i)) return false;
      const ctx: RuleContext = { word, i, end: i + candidate.g.length };
      return candidate.when ? candidate.when(ctx) : true;
    });

    if (!rule) {
      // Unknown character (shouldn't happen after validation) — skip it
      matches.push({ grapheme: word[i], unit: null });
      i += 1;
      continue;
    }

    matches.push(...symbolsToMatches(rule.out, rule.g));
    if (rule.out.length === 0) {
      matches.push({ grapheme: rule.g, unit: null });
    }
    i += rule.g.length;
  }

  return { word, matches, error: null };
};

// Convenience: just the sounded units, in order
export const phonemizeToUnits = (input: string): SoundUnit[] =>
  phonemize(input)
    .matches.map((match) => match.unit)
    .filter((unit): unit is SoundUnit => unit !== null);
