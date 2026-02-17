import type { PageServerLoad } from './$types';
import { courses } from '$data/courses';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const course = courses.find(c => c.slug === params.slug);
  if (!course) throw error(404, 'Course not found');
  return { course };
};
