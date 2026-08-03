// Helpers for translating between pitch/duration representations:
// scientific pitch names ('Bb5') → VexFlow keys ('bb/5'), and quarter-note
// beat counts → sequences of (possibly tied) notated durations.

export interface ParsedNote {
  letter: string;
  accidental: "#" | "b" | null;
  octave: number;
  vexKey: string;
}

export const parseNote = (note: string): ParsedNote => {
  const match = note.match(/^([A-G])(#|b)?(\d)$/);
  if (!match) {
    throw new Error(`Unrecognized note name: ${note}`);
  }
  const [, letter, accidental, octave] = match;
  return {
    letter,
    accidental: (accidental as "#" | "b") ?? null,
    octave: Number(octave),
    vexKey: `${letter.toLowerCase()}${accidental ?? ""}/${octave}`,
  };
};

export const prettyNoteName = (note: string): string =>
  note.replace("#", "♯").replace("b", "♭");

// Tempo used to realize notated durations. At 60 BPM a quarter note ('4n')
// lasts exactly one second.
export const BPM = 60;

export const beatsToSeconds = (beats: number): number => beats * (60 / BPM);

// Diatonic staff position (each unit = one line-or-space step); used to
// decide how much headroom a stave needs above the top line
export const staffSteps = (note: string): number => {
  const { letter, octave } = parseNote(note);
  return octave * 7 + "CDEFGAB".indexOf(letter);
};

export interface NotatedDuration {
  // VexFlow duration code: 'w' | 'h' | 'q' | '8' | '16'
  vexDuration: string;
  dotted: boolean;
}

const DURATION_TABLE: Array<[number, string, boolean]> = [
  [4, "w", false],
  [3, "h", true],
  [2, "h", false],
  [1.5, "q", true],
  [1, "q", false],
  [0.75, "8", true],
  [0.5, "8", false],
  [0.375, "16", true],
  [0.25, "16", false],
];

// Greedily decompose a beat count into notated values; callers tie the
// resulting notes together. E.g. 2.75 beats → half tied to dotted eighth.
export const beatsToNotation = (beats: number): NotatedDuration[] => {
  const result: NotatedDuration[] = [];
  let remaining = beats;
  const epsilon = 1e-6;

  while (remaining > epsilon) {
    const entry = DURATION_TABLE.find(
      ([value]) => value <= remaining + epsilon,
    );
    if (!entry) {
      throw new Error(`Cannot notate remaining duration of ${remaining} beats`);
    }
    const [value, vexDuration, dotted] = entry;
    result.push({ vexDuration, dotted });
    remaining -= value;
  }

  return result;
};

const DURATION_NAMES: Record<string, string> = {
  w: "whole",
  h: "half",
  q: "quarter",
  "8": "eighth",
  "16": "sixteenth",
};

// Human-readable duration, e.g. 2.75 → 'half tied to dotted eighth'
export const durationLabel = (beats: number): string =>
  beatsToNotation(beats)
    .map(
      ({ vexDuration, dotted }) =>
        `${dotted ? "dotted " : ""}${DURATION_NAMES[vexDuration]}`,
    )
    .join(" tied to ");
