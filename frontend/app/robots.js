export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabdemo-front.duckdns.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
