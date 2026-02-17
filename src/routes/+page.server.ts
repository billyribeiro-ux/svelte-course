import type { PageServerLoad } from './$types';
import { testimonials } from '$data/testimonials';
import { courses } from '$data/courses';

export const load: PageServerLoad = async () => {
  return {
    featuredTestimonials: testimonials.slice(0, 3),
    featuredCourses: courses.slice(0, 3)
  };
};
