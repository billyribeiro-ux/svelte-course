import type { PageServerLoad } from './$types';
import { testimonials } from '$data/testimonials';

export const load: PageServerLoad = async () => {
  return { testimonials };
};
