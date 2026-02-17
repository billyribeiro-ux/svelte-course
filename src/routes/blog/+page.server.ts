import type { PageServerLoad } from './$types';
import { blogPosts } from '$data/blog-posts';

export const load: PageServerLoad = async () => {
  return { posts: blogPosts };
};
