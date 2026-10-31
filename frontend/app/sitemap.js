import { SUPPORTED_LOCALES } from '@/lib/i18n/config';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabdemo-front.duckdns.org';
  const lastModified = new Date();

  const coreRoutes = [
    '',
    '/kurslar',
    '/filiallar',
    '/ustozlar',
    '/markaz-haqida',
    '/natijalar',
    '/maqolalar',
    '/savol-javob',
    '/aloqa',
    '/royxatdan-otish',
    '/interaktiv-arab-tili',
    '/maxfiylik-siyosati',
  ];

  const courseSlugs = [
    'kids-arab-tili',
    'professional-fonetika',
    'grammatika-va-cefr',
    'kundalik-va-kasbiy-arab-tili',
  ];

  const branchSlugs = [
    'archakocha',
    'yangi-toshmi',
    'qoraqamish',
    'algoritm',
    'yunusobod',
    'sergeli',
    'tinchlik',
    'beruniy',
  ];

  const entries = [];

  // 1. Root and language homepages
  entries.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  for (const locale of SUPPORTED_LOCALES) {
    // Core pages
    for (const route of coreRoutes) {
      const path = route ? `/${locale}${route}` : `/${locale}`;
      const isHome = !route;
      const isHighPriority = route === '/kurslar' || route === '/filiallar' || route === '/royxatdan-otish';

      entries.push({
        url: `${baseUrl}${path}`,
        lastModified,
        changeFrequency: isHome ? 'daily' : 'weekly',
        priority: isHome ? 1.0 : isHighPriority ? 0.9 : 0.8,
      });
    }

    // Courses
    for (const slug of courseSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/kurslar/${slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }

    // Branches
    for (const slug of branchSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/filiallar/${slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  return entries;
}

