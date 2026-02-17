import type { PageServerLoad } from './$types';
import { blogPosts } from '$data/blog-posts';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) throw error(404, 'Post not found');
  const relatedPosts = blogPosts.filter(p => p.slug !== params.slug && p.category === post.category).slice(0, 2);
  return { post, relatedPosts };
};
