import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Pre-alphabets URLs pointed at the French phoneme set
export const load: PageLoad = ({ params }) => {
  redirect(301, `/french/unit/${params.slug}`);
};
