import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SUPPORTED_LOCALES } from '@/lib/i18n/config';
import App from '../../page';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabdemo-front.duckdns.org';

export function generateStaticParams() {
  const commonRoutes = [
    'kurslar',
    'filiallar',
    'ustozlar',
    'markaz-haqida',
    'natijalar',
    'maqolalar',
    'savol-javob',
    'aloqa',
    'royxatdan-otish',
    'interaktiv-arab-tili',
    'maxfiylik-siyosati',
  ];

  const params = [];
  for (const locale of SUPPORTED_LOCALES) {
    for (const route of commonRoutes) {
      params.push({ locale, slug: [route] });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'uz';
  const slug = resolvedParams?.slug || [];
  const path = '/' + slug.join('/');

  const titles = {
    '/kurslar': {
      uz: 'Arab Tili Kurslari — Arab Tili',
      ru: 'Курсы арабского языка — Arab Tili',
      en: 'Arabic Language Courses — Arab Tili',
    },
    '/filiallar': {
      uz: 'Toshkentdagi 8 ta Filialimiz — Arab Tili',
      ru: '8 филиалов в Ташкенте — Arab Tili',
      en: '8 Branches in Tashkent — Arab Tili',
    },
    '/ustozlar': {
      uz: 'Ustozlar Jamoasi va Kafedralar — Arab Tili',
      ru: 'Команда преподавателей — Arab Tili',
      en: 'Teaching Faculty — Arab Tili',
    },
    '/markaz-haqida': {
      uz: 'Markaz Haqida | Arab Tili — Ilm Kaliti',
      ru: 'Об академии — Arab Tili',
      en: 'About the Academy — Arab Tili',
    },
    '/natijalar': {
      uz: 'Bitiruvchilar va Natijalar (5,000+) — Arab Tili',
      ru: 'Выпускники и результаты (5 000+) — Arab Tili',
      en: 'Graduates & Results (5,000+) — Arab Tili',
    },
    '/maqolalar': {
      uz: 'Foydali Maqolalar va Lug‘atlar — Arab Tili',
      ru: 'Полезные статьи и словари — Arab Tili',
      en: 'Articles & Vocabulary — Arab Tili',
    },
    '/savol-javob': {
      uz: 'Ko‘p Beriladigan Savollar (FAQ) — Arab Tili',
      ru: 'Часто задаваемые вопросы (FAQ) — Arab Tili',
      en: 'Frequently Asked Questions (FAQ) — Arab Tili',
    },
    '/aloqa': {
      uz: 'Aloqa Markazi (+998 71 200 00 00) — Arab Tili',
      ru: 'Контакты и колл-центр — Arab Tili',
      en: 'Contact & Call Center — Arab Tili',
    },
    '/royxatdan-otish': {
      uz: 'Bepul Sinov Darsiga Yozilish — Arab Tili',
      ru: 'Запись на бесплатный пробный урок — Arab Tili',
      en: 'Register for a Free Trial Lesson — Arab Tili',
    },
    '/interaktiv-arab-tili': {
      uz: 'Interaktiv Arab Tili Mashg‘ulotlari — Arab Tili',
      ru: 'Интерактивные уроки арабского языка — Arab Tili',
      en: 'Interactive Arabic Practice — Arab Tili',
    },
    '/maxfiylik-siyosati': {
      uz: 'Maxfiylik Siyosati — Arab Tili',
      ru: 'Политика конфиденциальности — Arab Tili',
      en: 'Privacy Policy — Arab Tili',
    },
  };

  const meta = titles[path];
  const title = meta?.[locale] || meta?.uz || `Arab Tili — ${slug[0] || ''}`;

  return {
    title,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: {
        uz: `${SITE_URL}/uz${path}`,
        ru: `${SITE_URL}/ru${path}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      url: `${SITE_URL}/${locale}${path}`,
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
      images: ['/academy_login_illustration.jpg'],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/siteicon.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

async function CatchAllLocaleContent({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  const slug = resolvedParams?.slug || [];

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const initialPath = '/' + slug.join('/');

  return <App initialLocale={locale} initialPath={initialPath} />;
}

export default function CatchAllLocalePage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAF8]" />}>
      <CatchAllLocaleContent params={params} />
    </Suspense>
  );
}
