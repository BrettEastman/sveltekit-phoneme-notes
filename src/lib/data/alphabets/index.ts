import type { Alphabet, SoundUnit } from "../../types";
import { completeFlute } from "./complete-flute";
import { contraforte } from "./contraforte";
import { french } from "./french";
import { messiaen } from "./messiaen";

// Display order on the landing page
export const alphabets: Alphabet[] = [
  french,
  completeFlute,
  messiaen,
  contraforte,
];

export const getAlphabet = (id: string): Alphabet | undefined =>
  alphabets.find((alphabet) => alphabet.id === id);

export const getUnitIndex = (alphabet: Alphabet, slug: string): number =>
  alphabet.units.findIndex((unit) => unit.slug === slug);

export const getUnit = (
  alphabet: Alphabet,
  slug: string,
): SoundUnit | undefined => alphabet.units[getUnitIndex(alphabet, slug)];
