# A Cryptogram for Converting Language to Music

A web app as a tool for exploring a musical cryptogram: a composition system that maps each sound of a language to a specific musical pitch and duration, so that text can be transcribed into music. This serialized compositional approach creates a unique way to visualize and hear the relationship between language and music. It can be adhered to strictly for study, loosely as a creative exercise, or used as a starting point for further evolution.

The app hosts **four alphabets**, selectable from the landing page:

- **French Phonemes** — the 37 sounds of French (vowels, semivowels, nasal vowels, plosives, nasal consonants, fricatives, and liquids), each paired with a note and rhythm
- **Complete Flute** — an original A–Z letter alphabet, plus symbols and punctuation, where punctuation becomes rests
- **Messiaen** — the historical "langage communicable" from *Méditations sur le Mystère de la Sainte Trinité*, spanning bass to treble registers
- **Contraforte** — an original A–Z alphabet living deep in the bass clef

Each alphabet has a browsable index grouped by category, and every unit gets its own page showing:

- The symbol (IPA or letter), with an example word where applicable
- Its note rendered in standard music notation — including accidentals, dots, ties, grace-note articulations, and the alphabet's clef
- A play button that sounds the note with its exact notated duration
- Previous/next navigation through the full set

### Word Melody

Each alphabet's `/[alphabet]/melody` page turns text into music. French words go through a rule-based grapheme-to-phoneme engine ([`src/lib/phonemize.ts`](src/lib/phonemize.ts)) — no dictionary, no backend, so it works on any input, including invented words. Letter alphabets map characters directly ([`src/lib/tokenize.ts`](src/lib/tokenize.ts)); in Complete Flute, spaces and punctuation become rests, so whole phrases can be transcribed, breaths and all. The resulting melody is engraved on a staff (ties, dots, grace ornaments, rests, mid-staff clef changes, and correct accidental/natural bookkeeping) and can be played back with its exact notated rhythm.

## How it works

The entire app is driven by data files in [`src/lib/data/alphabets/`](src/lib/data/alphabets). Each alphabet bundles its units, categories, clef, and tokenizer kind; each unit is a `SoundUnit`:

```ts
{
  slug: 'gn',        // URL-safe id → /french/unit/gn
  symbol: 'ɲ',       // displayed symbol
  example: 'agneau', // example word (phoneme alphabets)
  category: 'nasal-consonant',
  note: 'A6',        // scientific pitch name (Tone.js-compatible)
  duration: '8n.',   // Tone.js-style duration, for reference
  beats: 0.75,       // canonical duration in quarter-note beats
  grace: { note: 'A6', notehead: 'x' } // optional articulation ornament
}
```

Rest units set `rest: true` instead of a note; units outside their alphabet's default register carry a `clef` override. `beats` is the source of truth: playback converts it to seconds (60 BPM, so one beat = one second), and the notation renderer decomposes it into notated values — e.g. `2.75` beats becomes a half note tied to a dotted eighth.

All alphabet data was normalized from Sibelius MusicXML exports of the original scores. Tied notes in the scores are collapsed into a single total duration; grace notes are preserved as ornaments.

### Swappable alphabets

Adding an alphabet is pure data: provide an `Alphabet` object (units, categories, clef, tokenizer kind) and register it in [`src/lib/data/alphabets/index.ts`](src/lib/data/alphabets/index.ts). Routing (`/[alphabet]/...`), components, audio, and the melody tokenizer all derive from it.

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
│   │   └── alphabets/      # One file per alphabet + registry (index.ts)
│   ├── types.ts            # Alphabet, SoundUnit, and supporting types
│   ├── music.ts            # Pitch parsing, beats → notation, duration labels
│   ├── audio.ts            # Shared Tone.js synth, playUnit / playMelody
│   ├── phonemize.ts        # Rule-based French grapheme → phoneme engine
│   ├── tokenize.ts         # Text → units dispatcher (phoneme rules or letters)
│   ├── UnitNotation.svelte # VexFlow renderer for one unit (ties, dots, graces, rests)
│   ├── MelodyNotation.svelte # VexFlow renderer for unit sequences (clef changes, rests)
│   ├── UnitPage.svelte     # Full unit page: symbol, notation, play, prev/next
│   └── Header.svelte       # Site header
├── styles/
│   ├── tokens.css          # Design system: colors, fonts, spacing, radii
│   └── base.css            # Global resets and body/heading defaults
└── routes/
    ├── +page.svelte        # Landing: pick an alphabet
    ├── [alphabet]/         # Index of one alphabet, grouped by category
    │   ├── melody/         # Word Melody: type text, hear it as music
    │   └── unit/[slug]/    # One page per unit
    ├── melody/             # Legacy redirect → /french/melody
    └── unit/[slug]/        # Legacy redirect → /french/unit/[slug]
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
- ~~Phrase transcription: multi-word melodies with rests between words~~ ✅ — Complete Flute maps spaces and punctuation to rests
- ~~Additional alphabets (A–Z letters, other phoneme sets)~~ ✅ — Complete Flute, Messiaen, and Contraforte
- More alphabets from the score: La Musique and Contrabass flute (need stroke counts and glissandi)
- Multi-note units: the Complete Flute `?` two-note figure and `!` chord
- X and inverted-triangle noteheads (data is captured; rendering pending), matching the scores
