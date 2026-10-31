import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SUPPORTED_LOCALES } from '@/lib/i18n/config';
import App from '../page';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabdemo-front.duckdns.org';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'uz';

  const titles = {
    uz: 'Arab Tili — Toshkentdagi N1 Arab Tili O‘quv Markazi',
    ru: 'Arab Tili — Академия Арабского Языка №1 в Ташкенте',
    en: 'Arab Tili — #1 Arabic Language Academy in Tashkent',
  };

  const descriptions = {
    uz: 'Toshkent bo‘ylab 8 ta filial va 5,000+ bitiruvchiga ega arab tili o‘quv markazi. Kids 4+, Professional fonetika va CEFR kurslari.',
    ru: '8 филиалов в Ташкенте, 5 000+ выпускников. Программы Kids 4+, профессиональная фонетика и подготовка к экзаменам CEFR.',
    en: '8 branches across Tashkent, 5,000+ graduates. Kids 4+, professional phonetics, and CEFR preparation courses.',
  };

  const title = titles[locale] || titles.uz;
  const description = descriptions[locale] || descriptions.uz;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        uz: `${SITE_URL}/uz`,
        ru: `${SITE_URL}/ru`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: 'Arab Tili',
      locale: locale === 'ru' ? 'ru_RU' : locale === 'en' ? 'en_US' : 'uz_UZ',
      type: 'website',
      images: [
        {
          url: '/academy_login_illustration.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/academy_login_illustration.jpg'],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', sizes: '32x32', type: 'image/png' },
        { url: '/brand/siteicon.png', sizes: '192x192', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export default async function LocalizedHomePage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}
