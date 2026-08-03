import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

// Pre-alphabets URL pointed at the French phoneme set
export const load: PageLoad = () => {
  redirect(301, "/french/melody");
};
