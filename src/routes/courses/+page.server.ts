import type { PageServerLoad } from './$types';
import { courses, pricingTiers } from '$data/courses';

export const load: PageServerLoad = async () => {
  return { courses, pricingTiers };
};
