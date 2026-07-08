import { error } from '@sveltejs/kit';
import { getAlphabet, getUnitIndex } from '$lib/data/alphabets';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const alphabet = getAlphabet(params.alphabet);
  if (!alphabet) {
    error(404, `No alphabet found for "${params.alphabet}"`);
  }

  const index = getUnitIndex(alphabet, params.slug);
  if (index === -1) {
    error(404, `No unit found for "${params.slug}"`);
  }

  const { units } = alphabet;
  const count = units.length;
  return {
    alphabet,
    unit: units[index],
    prevUnit: units[(index - 1 + count) % count],
    nextUnit: units[(index + 1) % count]
  };
};
