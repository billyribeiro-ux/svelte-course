import type { RequestHandler } from './$types';
import { blogPosts } from '$lib/data/blog-posts';
import { courses } from '$lib/data/courses';

const SITE_URL = 'https://revolutiontradingpros.com';

export const GET: RequestHandler = async () => {
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/courses', priority: '0.9', changefreq: 'weekly' },
    { path: '/testimonials', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/lead-magnet', priority: '0.9', changefreq: 'monthly' }
  ];

  const coursePages = courses.map(c => ({
    path: `/courses/${c.slug}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  const blogPages = blogPosts.map(p => ({
    path: `/blog/${p.slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const allPages = [...staticPages, ...coursePages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
};
