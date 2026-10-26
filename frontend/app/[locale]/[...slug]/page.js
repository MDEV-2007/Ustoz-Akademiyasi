import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SUPPORTED_LOCALES } from '@/lib/i18n/config';
import App from '../../page';

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
      uz: 'Arab Tili Kurslari — Ustoz Akademiyasi',
      ru: 'Курсы арабского языка — Ustoz Akademiyasi',
      en: 'Arabic Language Courses — Ustoz Akademiyasi',
    },
    '/filiallar': {
      uz: 'Toshkentdagi 8 ta Filialimiz — Ustoz Akademiyasi',
      ru: '8 филиалов в Ташкенте — Ustoz Akademiyasi',
      en: '8 Branches in Tashkent — Ustoz Akademiyasi',
    },
    '/ustozlar': {
      uz: 'Ustozlar Jamoasi va Kafedralar — Ustoz Akademiyasi',
      ru: 'Команда преподавателей — Ustoz Akademiyasi',
      en: 'Teaching Faculty — Ustoz Akademiyasi',
    },
    '/markaz-haqida': {
      uz: 'Markaz Haqida | Zulmatlardan Nur tomon — Ustoz Akademiyasi',
      ru: 'Об академии — Ustoz Akademiyasi',
      en: 'About the Academy — Ustoz Akademiyasi',
    },
    '/natijalar': {
      uz: 'Bitiruvchilar va Natijalar (15,000+) — Ustoz Akademiyasi',
      ru: 'Выпускники и результаты (15 000+) — Ustoz Akademiyasi',
      en: 'Graduates & Results (15,000+) — Ustoz Akademiyasi',
    },
    '/maqolalar': {
      uz: 'Foydali Maqolalar va Lug‘atlar — Ustoz Akademiyasi',
      ru: 'Полезные статьи и словари — Ustoz Akademiyasi',
      en: 'Articles & Vocabulary — Ustoz Akademiyasi',
    },
    '/savol-javob': {
      uz: 'Ko‘p Beriladigan Savollar (FAQ) — Ustoz Akademiyasi',
      ru: 'Часто задаваемые вопросы (FAQ) — Ustoz Akademiyasi',
      en: 'Frequently Asked Questions (FAQ) — Ustoz Akademiyasi',
    },
    '/aloqa': {
      uz: 'Aloqa Markazi (+998 55 518 44 00) — Ustoz Akademiyasi',
      ru: 'Контакты и колл-центр — Ustoz Akademiyasi',
      en: 'Contact & Call Center — Ustoz Akademiyasi',
    },
    '/royxatdan-otish': {
      uz: 'Bepul Sinov Darsiga Yozilish — Ustoz Akademiyasi',
      ru: 'Запись на бесплатный пробный урок — Ustoz Akademiyasi',
      en: 'Register for a Free Trial Lesson — Ustoz Akademiyasi',
    },
    '/interaktiv-arab-tili': {
      uz: 'Interaktiv Arab Tili Mashg‘ulotlari — Ustoz Akademiyasi',
      ru: 'Интерактивные уроки арабского языка — Ustoz Akademiyasi',
      en: 'Interactive Arabic Practice — Ustoz Akademiyasi',
    },
    '/maxfiylik-siyosati': {
      uz: 'Maxfiylik Siyosati — Ustoz Akademiyasi',
      ru: 'Политика конфиденциальности — Ustoz Akademiyasi',
      en: 'Privacy Policy — Ustoz Akademiyasi',
    },
  };

  const meta = titles[path];
  const title = meta?.[locale] || meta?.uz || `Ustoz Akademiyasi — ${slug[0] || ''}`;

  return {
    title,
    alternates: {
      canonical: `https://ustozakademiyasi.uz/${locale}${path}`,
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
