import { error } from '@sveltejs/kit';
import { getUnitIndex, units } from '$lib/data/units';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const index = getUnitIndex(params.slug);

  if (index === -1) {
    error(404, `No sound found for "${params.slug}"`);
  }

  const count = units.length;
  return {
    unit: units[index],
    prevUnit: units[(index - 1 + count) % count],
    nextUnit: units[(index + 1) % count]
  };
};
