# A Cryptogram for Converting Language to Music

A web app as a tool for exploring a musical cryptogram: a composition system that maps each sound of a language to a specific musical pitch and duration, so that text can be transcribed into music. This serialized compositional approach creates a unique way to visualize and hear the relationship between language and music. It can be adhered to strictly for study, loosely as a creative exercise, or used as a starting point for further evolution.

This current iteration is an index of **French phonemes** — 37 sounds (vowels, semivowels, nasal vowels, plosives, nasal consonants, fricatives, and liquids), each paired with a note and rhythm. Every sound gets its own page showing:

- The phoneme symbol (IPA), with an example French word
- Its note rendered in standard music notation — including accidentals, dots, ties, and grace-note articulations
- A play button that sounds the note with its exact notated duration
- Previous/next navigation through the full set

The home page is a browsable index of all sounds, grouped by phonetic category.

### Word Melody

The [`/melody`](src/routes/melody/+page.svelte) page turns any French word into music: type a word and a rule-based grapheme-to-phoneme engine ([`src/lib/phonemize.ts`](src/lib/phonemize.ts)) reads it into phonemes — no dictionary, no backend, so it works on any input, including invented words. The resulting melody is engraved on a staff (ties, dots, grace ornaments, and correct accidental/natural bookkeeping) and can be played back with its exact notated rhythm.

## How it works

The entire app is driven by a single data file: [`src/lib/data/units.ts`](src/lib/data/units.ts). Each entry is a `SoundUnit`:

```ts
{
  slug: 'gn',        // URL-safe id → /unit/gn
  symbol: 'ɲ',       // displayed symbol
  example: 'agneau', // example word
  category: 'nasal-consonant',
  note: 'A6',        // scientific pitch name (Tone.js-compatible)
  duration: '8n.',   // Tone.js-style duration, for reference
  beats: 0.75,       // canonical duration in quarter-note beats
  grace: { note: 'A6', notehead: 'x' } // optional articulation ornament
}
```

`beats` is the source of truth: playback converts it to seconds (60 BPM, so one beat = one second), and the notation renderer decomposes it into notated values — e.g. `2.75` beats becomes a half note tied to a dotted eighth.

The data was normalized from a Sibelius MusicXML export of the original score. Tied notes in the score are collapsed into a single total duration; grace notes are preserved as ornaments.

### Swappable alphabets

The unit set is intentionally generic. Routing (`/unit/[slug]`), components, and audio never hardcode the symbols or their count — swapping in a different alphabet (A–Z letters, a different language's phonemes) only requires providing a new `SoundUnit[]` array.

## Tech stack

| Layer           | Tool                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------ |
| Framework       | [SvelteKit](https://svelte.dev/docs/kit) with [Svelte 5](https://svelte.dev) (runes)       |
| Language        | TypeScript                                                                                 |
| Audio           | [Tone.js](https://tonejs.github.io) — synth playback with precise, explicit note durations |
| Notation        | [VexFlow](https://www.vexflow.com) — SVG music engraving                                   |
| Package manager | pnpm                                                                                       |

## Project structure

```
src/
├── lib/
│   ├── data/
│   │   └── units.ts        # The cryptogram mapping — the app's single data source
│   ├── types.ts            # SoundUnit and supporting types
│   ├── music.ts            # Pitch parsing, beats → notation, duration labels
│   ├── audio.ts            # Shared Tone.js synth, playUnit / playMelody
│   ├── phonemize.ts        # Rule-based French grapheme → phoneme engine
│   ├── UnitNotation.svelte # VexFlow renderer for one unit (ties, dots, graces)
│   ├── MelodyNotation.svelte # VexFlow renderer for phoneme sequences
│   ├── UnitPage.svelte     # Full unit page: symbol, notation, play, prev/next
│   └── Header.svelte       # Site header
├── styles/
│   ├── tokens.css          # Design system: colors, fonts, spacing, radii
│   └── base.css            # Global resets and body/heading defaults
└── routes/
    ├── +page.svelte        # Index of all sounds, grouped by category
    ├── melody/             # Word Melody: type a word, hear it as music
    └── unit/[slug]/        # One page per sound, driven by units.ts
```

## Developing

```bash
pnpm install
pnpm dev        # start the dev server
pnpm check      # type-check with svelte-check
pnpm build      # production build
pnpm preview    # preview the production build
```

## Roadmap

- ~~Transcription: type a word and hear it played as a melody~~ ✅ — see [Word Melody](#word-melody)
- Phrase transcription: multi-word melodies with rests between words
- Additional alphabets (A–Z letters, other phoneme sets)
- X noteheads on percussive grace-note ornaments, matching the score
