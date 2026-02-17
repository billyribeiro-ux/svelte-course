import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you

Sitemap: https://revolutiontradingpros.com/sitemap.xml`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' }
  });
};
