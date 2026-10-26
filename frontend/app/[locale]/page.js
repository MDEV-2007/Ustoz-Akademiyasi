import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SUPPORTED_LOCALES } from '@/lib/i18n/config';
import App from '../page';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'uz';

  const titles = {
    uz: 'Ustoz Akademiyasi — Toshkentdagi N1 Arab Tili O‘quv Markazi',
    ru: 'Ustoz Akademiyasi — Академия Арабского Языка №1 в Ташкенте',
    en: 'Ustoz Akademiyasi — #1 Arabic Language Academy in Tashkent',
  };

  const descriptions = {
    uz: 'Toshkent bo‘ylab 8 ta filial va 15,000+ bitiruvchiga ega arab tili o‘quv markazi. Hilol Kids 4+, Professional fonetika va CEFR kurslari.',
    ru: '8 филиалов в Ташкенте, 15 000+ выпускников. Программы Hilol Kids 4+, профессиональная фонетика и подготовка к экзаменам CEFR.',
    en: '8 branches across Tashkent, 15,000+ graduates. Hilol Kids 4+, professional phonetics, and CEFR preparation courses.',
  };

  return {
    title: titles[locale] || titles.uz,
    description: descriptions[locale] || descriptions.uz,
    alternates: {
      canonical: `https://ustozakademiyasi.uz/${locale}`,
      languages: {
        uz: 'https://ustozakademiyasi.uz/uz',
        ru: 'https://ustozakademiyasi.uz/ru',
        en: 'https://ustozakademiyasi.uz/en',
      },
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

async function LocaleContent({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return <App initialLocale={locale} />;
}

export default function LocalePage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAF8]" />}>
      <LocaleContent params={params} />
    </Suspense>
  );
}

