import { error } from '@sveltejs/kit';
import { getAlphabet } from '$lib/data/alphabets';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const alphabet = getAlphabet(params.alphabet);
  if (!alphabet) {
    error(404, `No alphabet found for "${params.alphabet}"`);
  }
  return { alphabet };
};
