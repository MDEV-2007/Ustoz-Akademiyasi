import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabdemo-front.duckdns.org';

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#073F31",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arab Tili — Toshkentdagi Zamonaviy Arab Tili O‘quv Markazi",
    template: "%s | Arab Tili",
  },
  description:
    "Toshkent bo‘ylab 8 ta zamonaviy filial va 5,000+ muvaffaqiyatli bitiruvchiga ega yetakchi arab tili o‘quv markazi. Kids 4+ dasturi, Professional Fonetika, Grammatika (Sarf-Nahv) va CEFR C1 xalqaro sertifikatiga tayyorlov kurslari.",
  keywords: [
    "Arab tili",
    "Arab tili kurslari",
    "Arab tili Toshkent",
    "Arab tili o'rganish",
    "Kids 4+ arab tili",
    "CEFR C1 arab tili",
    "Arab tili fonetika",
    "Arab tili grammatika",
    "Sarf va Nahv",
    "Arab tili repetitor",
    "Arab tili bolalar uchun",
    "Toshkent arab tili filiali",
    "Arab tili sertifikat",
    "Bepul sinov darsi arab tili",
  ],
  authors: [{ name: "Arab Tili O‘quv Markazi", url: SITE_URL }],
  creator: "Arab Tili",
  publisher: "Arab Tili",
  applicationName: "Arab Tili",
  alternates: {
    canonical: "/",
    languages: {
      "uz-UZ": "/uz",
      "ru-RU": "/ru",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    url: SITE_URL,
    siteName: "Arab Tili O‘quv Markazi",
    title: "Arab Tili — Toshkentdagi N1 Arab Tili O‘quv Markazi",
    description:
      "Toshkent bo‘ylab 8 ta zamonaviy filial va 5,000+ muvaffaqiyatli bitiruvchilar. Kids 4+ va CEFR C1 darajagacha sifatli arab tili ta’limi.",
    images: [
      {
        url: "/academy_login_illustration.jpg",
        width: 1200,
        height: 630,
        alt: "Arab Tili O‘quv Markazi Toshkent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arab Tili — Toshkentdagi Zamonaviy Arab Tili O‘quv Markazi",
    description:
      "8 ta filial, Kids 4+ va CEFR C1 gacha mukammal arab tili ta’limi.",
    images: ["/academy_login_illustration.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Arab Tili",
  alternateName: "Arab Tili O‘quv Markazi",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: `${SITE_URL}/academy_login_illustration.jpg`,
  description:
    "Toshkent bo‘ylab 8 ta filial va 5,000+ bitiruvchilarga ega yetakchi arab tili o‘quv markazi.",
  telephone: "+998712000000",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toshkent",
    addressRegion: "Toshkent shahri",
    addressCountry: "UZ",
  },
  sameAs: [
    "https://t.me/arabtili_demo",
    "https://instagram.com/arabtili_demo",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Arab Tili Ta’lim Kurslari",
    itemListElement: [
      {
        "@type": "Course",
        name: "Kids 4+ Arab Tili",
        description: "4 yoshdan katta bolalar uchun maxsus interaktiv arab tili dasturi",
        provider: { "@type": "Organization", name: "Arab Tili" },
      },
      {
        "@type": "Course",
        name: "Professional Fonetika",
        description: "Maxraj va harflar talaffuzini mukammal o‘rganish kursi",
        provider: { "@type": "Organization", name: "Arab Tili" },
      },
      {
        "@type": "Course",
        name: "Grammatika va CEFR Tayyorlov",
        description: "Sarf, Nahv va xalqaro CEFR C1 sertifikatiga tayyorlov kursi",
        provider: { "@type": "Organization", name: "Arab Tili" },
      },
      {
        "@type": "Course",
        name: "Kundalik va Kasbiy Arab Tili",
        description: "Arab tilida erkin so‘zlashish va muloqot ko‘nikmalarini rivojlantirish",
        provider: { "@type": "Organization", name: "Arab Tili" },
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/brand/siteicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen bg-[#F8FAF8] text-[#14231F] antialiased">
        {children}
      </body>
    </html>
  );
}
