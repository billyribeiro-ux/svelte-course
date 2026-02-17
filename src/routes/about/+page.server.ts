import type { PageServerLoad } from './$types';
import { team } from '$data/team';

export const load: PageServerLoad = async () => {
  return { team };
};
