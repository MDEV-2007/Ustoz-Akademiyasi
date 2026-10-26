'use client';

import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Phone,
  Maximize2,
  HeartHandshake,
  Calendar,
  History,
  TrendingUp
} from 'lucide-react';
import AuthenticVisualPlate from '@/components/ui/AuthenticVisualPlate';
import GraduatesSection from '@/components/graduates/GraduatesSection';
import ImageLightbox from '@/components/ui/ImageLightbox';
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton';

const METHODOLOGY_GUIDES = [
  {
    id: 1,
    image: '/about/methodology_1.png',
    title: 'Farzandingiz darsni o‘zlashtirishda qiynalyaptimi?',
    badge: 'Asosiy savol',
    step: 'Muammo tahlili',
    subtitle: 'Ustoz Akademiyasi ota-onalar uchun metodik qo‘llanmasi',
    desc: 'Ko‘pincha bolalarning darsdan sovishi yoki qiynalishi noto‘g‘ri yondashuv va ortiqcha bosim natijasida yuzaga keladi. Ustoz Akademiyasida biz majburlash va taqqoslash o‘rniga erkin qiziqish, ko‘rgazmali o‘yinlar va mehrga asoslangan metodikani qo‘llaymiz.',
    keyPoints: [
      'Erta yoshda darsni ortiqcha bosimsiz olib borish',
      'Bola nima uchun qiynalayotganini tushunish',
      'Har bir bolaga individual yondashuvni ta’minlash'
    ]
  },
  {
    id: 2,
    image: '/about/methodology_2.png',
    title: 'Bosim emas — qo‘llab-quvvatlash kerak',
    badge: '1-Qoida',
    step: 'Ruhiy xotirjamlik',
    subtitle: 'Majburlash va qattiq talab o‘rniga erkin rag‘bat',
    desc: 'Qattiq talab, majburlash va boshqalar bilan taqqoslashdan butunlay saqlaning. Har bir bola o‘z shaxsiy tempida o‘rganadi.',
    dontList: ['Qattiq talab', 'Majburlash', 'Taqqoslash'],
    doList: ['Bolaga bosim qilmang', 'Har bir bola o‘z tempida o‘rganadi', 'Charchagan paytda dars qildirmang']
  },
  {
    id: 3,
    image: '/about/methodology_3.png',
    title: 'Qisqa, lekin samarali takrorlash',
    badge: '2-Qoida',
    step: 'Vaqt me’yori',
    subtitle: 'Kuniga 5–7 daqiqa quvnoq takrorlash kifoya',
    desc: 'Soatlab charchatuvchi darslar emas, kun davomida 5–7 daqiqa o‘yin shaklidagi takrorlash va audio mashqlar eng yuqori samara beradi.',
    doList: ['Kuniga 5–7 daqiqa yetarli', 'O‘yin shaklida takrorlash foydaliroq', 'Audiolardan muntazam foydalaning']
  },
  {
    id: 4,
    image: '/about/methodology_4.png',
    title: 'Hech qachon boshqa bolalar bilan solishtirmang',
    badge: '3-Qoida',
    step: 'O‘ziga ishonch',
    subtitle: 'Har bir kichik yutuqni e’tirof etish va «Sen eplading»',
    desc: 'Farzandingizning kuchli tomonlarini toping va kichik qadamlarini ham e’tirof eting. «Sen eplading» degan samimiy so‘z bolada katta ishonch uyg‘otadi.',
    doList: ['Kichik yutuqlarni ham maqtang', '«Sen eplading» degan so‘z kuchli ta’sir qiladi', 'Farzandingizning kuchli tomonini toping']
  },
  {
    id: 5,
    image: '/about/methodology_5.png',
    title: 'Individual yondashuv — Ustoz Akademiyasida',
    badge: 'Asosiy yechim',
    step: 'Natija',
    subtitle: 'Har bir bola bilan individual yondashuv asosida ishlanadi',
    desc: 'Ustoz Akademiyasida bolalar 8–10 kishilik kichik guruhlarda, tajribali ustozlar rahbarligida mehr va individual e’tibor bilan tahsil oladilar.',
    phone: '55 518 44 00'
  }
];

const HISTORY_ITEMS = [
  {
    id: 'history-2019',
    year: '2019-yil',
    badge: 'Tashkil topish',
    step: 'Ilk qadam',
    title: '«Hilol Ta’lim» nomi ostida asos solindi',
    image: '/about/history_2019.png',
    quote:
      '«Hilol Ta\'lim — 2019-yilda asos solingan va hozirda 1000 ga yaqin talabalarga ilm va yaxshilik ulashib kelayotgan o‘quv markazimizga...»',
    desc:
      'O‘quv markazimiz 2019-yilda samimiy niyat va yuksak maqsadlar bilan «Hilol Ta’lim» brendi ostida o‘z faoliyatini boshlagan. Ilk yillardayoq 1000 ga yaqin talabaga arab tili alifbosi, harflar maxraji va to‘g‘ri talaffuz bo‘yicha mustahkam poydevor yaratildi.',
    statsLabel: 'Ilk talabalar soni',
    statsValue: '1,000 ga yaqin talaba',
    features: [
      'Arab tili alifbosi va harflar maxraji',
      'Kichik guruhlarda samimiy va erkin muhit',
      'Ilk bitiruvchilar va yuqori ishonch'
    ]
  },
  {
    id: 'history-2024',
    year: '2024-yil Sentabr',
    badge: 'Katta Rebranding',
    step: 'Yangi bosqich',
    title: '«Ustoz Akademiyasi» — yangi taraqqiyot sari qadam',
    image: '/about/history_2024.png',
    quote:
      '«2024-yil sentabr oyidan boshlab o‘sish va taraqqiyot sari yangi qadam qo‘ydik. Hilol ta\'lim o‘rniga Ustoz akademiyasi nomi bilan xizmat ko‘rsatishni boshladik. Bizning maqsadimiz — sizga yanada yuqori darajada ta\'lim va bilim berishdir.»',
    desc:
      'Ta’lim ko‘lamini kengaytirish, zamonaviy standartlar va innovatsion metodikalarni joriy etish maqsadida markazimiz yangi bosqichga ko‘tarildi. Bugungi kunda akademiyamiz 8 ta filial va 15,000 dan ortiq muvaffaqiyatli bitiruvchilarga ega nufuzli ta’lim maskanidir.',
    statsLabel: 'Bugungi natija',
    statsValue: '8 ta filial • 15,000+ bitiruvchi',
    features: [
      'Toshkent bo‘ylab 8 ta zamonaviy filial tarmog‘i',
      'C1 darajali CEFR ustozlari jamoasi',
      'Hilol Kids 4+ innovatsion bolalar metodikasi',
      '15,000 dan ortiq mamnun o‘quvchilar'
    ]
  }
];

export default function AboutFacultyPage({
  path,
  teachers = [],
  departments = [],
  navigate,
  t = {}
}) {
  const [methodologyLightbox, setMethodologyLightbox] = useState({
    isOpen: false,
    currentIndex: 0
  });

  const [historyLightbox, setHistoryLightbox] = useState({
    isOpen: false,
    currentIndex: 0
  });

  const openLightboxAtIndex = (idx) => {
    setMethodologyLightbox({
      isOpen: true,
      currentIndex: idx
    });
  };

  const openHistoryLightboxAtIndex = (idx) => {
    setHistoryLightbox({
      isOpen: true,
      currentIndex: idx
    });
  };

  // ROUTE 7: ABOUT THE ACADEMY (/markaz-haqida)
  if (path === '/markaz-haqida') {
    const heroGuide = METHODOLOGY_GUIDES[0];
    const supportingGuides = METHODOLOGY_GUIDES.slice(1);

    return (
      <div className="py-12 lg:py-16 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-16">
        {/* Academy Mission & Facts Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
            {t.aboutPage?.badge || 'Ustoz Akademiyasi Haqida'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14231F] tracking-tight">
            {t.aboutPage?.title || 'Zulmatlardan Nur tomon — O‘qi va ko‘taril!'}
          </h1>
          <p className="text-base sm:text-lg text-[#65756F] leading-relaxed">
            {t.aboutPage?.intro ||
              'Ustoz Akademiyasi — Toshkent shahrida 8 ta filialiga va 15,000 dan ortiq bitiruvchilarga ega bo‘lgan arab tili o‘quv markazidir. Markazimiz bolajonlar (4+ yosh), 0 dan boshlovchilar hamda CEFR sertifikatiga tayyorlanuvchilar uchun tizimli dasturlarni taqdim etadi.'}
          </p>
        </div>

        {/* Real Academy Reach & Digital Presence Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#073F31]/15 space-y-2 shadow-sm">
            <div className="text-xs font-bold uppercase text-[#07966F] tracking-wider">
              {t.aboutPage?.instagramTitle || 'Instagram Rasmiy Sahifasi'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#14231F]">
              {t.aboutPage?.instagramFollowers || '134K+ obunachilar'}
            </div>
            <p className="text-xs sm:text-sm text-[#65756F] leading-relaxed">
              {t.aboutPage?.instagramDesc ||
                '716+ post va video lavhalar orqali dars jarayonlari, so‘z boyligi va bitiruv tadbirlari yoritib boriladi.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#073F31]/15 space-y-2 shadow-sm">
            <div className="text-xs font-bold uppercase text-[#07966F] tracking-wider">
              {t.aboutPage?.telegramTitle || 'Telegram Ta’lim Kanali'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#14231F]">
              {t.aboutPage?.telegramStats || '270+ video va 764 foto'}
            </div>
            <p className="text-xs sm:text-sm text-[#65756F] leading-relaxed">
              {t.aboutPage?.telegramDesc ||
                't.me/ustozakademiyasi kanalida bolalar uchun arabcha multfilmlar, viktorinalar (116+ so‘rovnoma) va bepul kitoblar joylangan.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#073F31]/15 space-y-2 shadow-sm">
            <div className="text-xs font-bold uppercase text-[#07966F] tracking-wider">
              {t.aboutPage?.graduatesTitle || 'Bitiruvchilar'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#14231F]">
              {t.aboutPage?.graduatesCount || '15,000+ o‘quvchilar'}
            </div>
            <p className="text-xs sm:text-sm text-[#65756F] leading-relaxed">
              {t.aboutPage?.graduatesDesc ||
                'Fonetika, grammatika, CEFR va Hilol Kids 4+ yo‘nalishlarida tahsil olgan bitiruvchilar.'}
            </p>
          </div>
        </div>

        {/* Section: Center History & Rebranding Story */}
        <section id="tariximiz" className="space-y-10 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-[#073F31]/10">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#07966F] flex items-center gap-1.5">
                <History className="w-4 h-4" />
                <span>Markaz Tarixi va Rebranding Yo‘li</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14231F] tracking-tight">
                «Hilol Ta’lim»dan «Ustoz Akademiyasi» sari
              </h2>
              <p className="text-sm sm:text-base text-[#65756F] leading-relaxed">
                2019-yildagi ilk qadamlardan — bugungi 8 ta filial va 15,000 dan ortiq bitiruvchilarga ega zamonaviy akademiyagacha bo‘lgan rivojlanish tarixi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#07966F]/10 text-[#073F31] text-xs font-bold flex items-center gap-1.5 border border-[#07966F]/20 shadow-xs">
                <TrendingUp className="w-3.5 h-3.5 text-[#07966F]" />
                <span>2019 — 2024+ rivojlanish</span>
              </span>
            </div>
          </div>

          {/* 2 Chronological History Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {HISTORY_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#073F31]/15 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-[#07966F]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Year and Badge */}
                  <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAF8]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#073F31] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#073F31] block">
                          {item.year}
                        </span>
                        <span className="text-[11px] text-[#65756F]">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#07966F] px-2.5 py-1 rounded-lg bg-[#07966F]/10">
                      {item.statsValue}
                    </span>
                  </div>

                  {/* Visual Plate & Quote Area */}
                  <div className="p-6 sm:p-7 space-y-5">
                    {/* Authentic Announcement Image */}
                    <div
                      onClick={() => openHistoryLightboxAtIndex(idx)}
                      className="relative rounded-2xl overflow-hidden aspect-[4/5] max-h-[360px] bg-[#073F31]/5 border border-[#073F31]/15 cursor-pointer group/img mx-auto w-full max-w-[280px] sm:max-w-[320px] shadow-sm"
                    >
                      <ImageWithSkeleton
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                        containerClassName="w-full h-full"
                      />

                      <div className="absolute inset-0 bg-[#073F31]/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-[#073F31] text-xs font-bold shadow-md flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Kattalashtirish</span>
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#14231F] leading-snug">
                      {item.title}
                    </h3>

                    {/* Official announcement quote */}
                    <div className="p-4 rounded-2xl bg-[#07966F]/8 border-l-4 border-[#07966F] text-xs sm:text-sm text-[#14231F] font-medium leading-relaxed italic">
                      {item.quote}
                    </div>

                    <p className="text-xs sm:text-sm text-[#65756F] leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Milestone Features */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {item.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs text-[#14231F]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#07966F] flex-shrink-0" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => openHistoryLightboxAtIndex(idx)}
                    className="w-full py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#073F31] hover:text-white text-[#073F31] font-semibold text-xs border border-[#073F31]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Rasmiy e’lon suratini to‘liq ko‘rish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Authentic Methodology & Parent Guidance Sequence */}
        <section id="metodika" className="space-y-10 pt-4">
          {/* Section Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-[#073F31]/10">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
                Ta’lim Metodikasi • Ota-onalar Uchun Tavsiyalar
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14231F] tracking-tight">
                Farzandingiz darsni o‘zlashtirishda qiynalyaptimi?
              </h2>
              <p className="text-sm sm:text-base text-[#65756F] leading-relaxed">
                Ustoz Akademiyasi o‘qituvchilari tomonidan ishlab chiqilgan va amaliyotda 15,000 dan ortiq o‘quvchilarda sinovdan o‘tgan ta’lim metodikasi va ota-onalar uchun 4 ta oltin qoida.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-[#07966F]/10 text-[#073F31] text-xs font-semibold">
                5 ta amaliy tavsiya
              </span>
            </div>
          </div>

          {/* Hero Feature Showcase (Image 1: Notebook & Question Plate) */}
          <div className="bg-white rounded-3xl border border-[#073F31]/15 p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image Plate */}
            <div
              onClick={() => openLightboxAtIndex(0)}
              className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/5] max-h-[520px] bg-[#073F31]/5 border border-[#073F31]/15 cursor-pointer group shadow-sm mx-auto w-full max-w-[380px] lg:max-w-none"
            >
              <ImageWithSkeleton
                src={heroGuide.image}
                alt={heroGuide.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                containerClassName="w-full h-full"
                priority
              />

              <div className="absolute inset-0 bg-[#073F31]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-white/95 text-[#073F31] text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Qo‘llanmani to‘liq ko‘rish</span>
                </span>
              </div>

              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="px-2.5 py-1 rounded bg-[#073F31]/90 text-white text-[11px] font-medium backdrop-blur-xs">
                  {heroGuide.badge}
                </span>
              </div>
            </div>

            {/* Editorial Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
                  {heroGuide.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#14231F] tracking-tight leading-snug">
                  {heroGuide.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#65756F] leading-relaxed">
                {heroGuide.desc}
              </p>

              {/* 3 Key Pillars */}
              <div className="space-y-3 pt-2 border-t border-[#073F31]/10">
                {heroGuide.keyPoints.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#07966F]/10 text-[#07966F] flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#14231F]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openLightboxAtIndex(0)}
                  className="px-5 py-2.5 rounded-xl bg-[#073F31] hover:bg-[#07966F] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Qo‘llanmani varaqlash (1 / 5)</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/royxatdan-otish')}
                  className="px-5 py-2.5 rounded-xl border border-[#073F31]/20 text-[#073F31] hover:bg-[#F8FAF8] text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Sinov darsiga yozilish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 4 Supporting Infographic Rules Grid (Images 2, 3, 4, 5) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#073F31]/10 pb-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#14231F]">
                Amaliy qoidalar va yondashuv
              </h3>
              <span className="text-xs text-[#65756F]">
                Rasmlarni kattalashtirish uchun ustiga bosing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportingGuides.map((guide, idx) => {
                const globalIndex = idx + 1;
                return (
                  <div
                    key={guide.id}
                    className="bg-white rounded-2xl border border-[#073F31]/15 overflow-hidden flex flex-col justify-between group hover:border-[#07966F]/50 hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Photo Container */}
                      <div
                        onClick={() => openLightboxAtIndex(globalIndex)}
                        className="relative aspect-[4/5] w-full overflow-hidden bg-[#073F31]/5 cursor-pointer"
                      >
                        <ImageWithSkeleton
                          src={guide.image}
                          alt={guide.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          containerClassName="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-lg bg-white/95 text-[#073F31] text-[11px] font-bold shadow-md flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            <span>Kattalashtirish</span>
                          </span>
                        </div>

                        {/* Step badge */}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#073F31]/85 backdrop-blur-md text-[#63E6BE] text-[10px] font-bold border border-white/20">
                          {guide.badge}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <span className="text-[11px] font-semibold text-[#07966F] uppercase tracking-wider block">
                            {guide.step}
                          </span>
                          <h4 className="text-base font-bold text-[#14231F] leading-snug group-hover:text-[#07966F] transition-colors mt-0.5">
                            {guide.title}
                          </h4>
                        </div>

                        <p className="text-xs text-[#65756F] leading-relaxed">
                          {guide.desc}
                        </p>

                        {/* Dont list (Red) */}
                        {guide.dontList && (
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                              Nimalardan saqlanish kerak:
                            </div>
                            {guide.dontList.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2 text-xs text-red-700">
                                <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Do list (Green) */}
                        {guide.doList && (
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#07966F]">
                              Tavsiya etiladi:
                            </div>
                            {guide.doList.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2 text-xs text-[#14231F]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#07966F] flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Contact details for Card 5 */}
                        {guide.phone && (
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-[#073F31] font-semibold">
                              <Phone className="w-3.5 h-3.5 text-[#07966F]" />
                              <span>Murojaat uchun: <strong>{guide.phone}</strong></span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() => openLightboxAtIndex(globalIndex)}
                        className="w-full py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#073F31] hover:text-white text-[#073F31] font-semibold text-xs border border-[#073F31]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Suratni ko‘rish</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Conversion Callout */}
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#064E3B] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#63E6BE]">
                Farzandingiz kelajagi uchun to‘g‘ri poydevor
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Ustoz Akademiyasida birinchi sinov darsi — mutlaqo bepul
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                Tajribali ustozlarimiz farzandingizning qiziqish darajasini aniqlab, bolalar psixologiyasiga mos eng qulay dars guruhini tavsiya etadilar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full sm:w-auto">
              <a
                href="tel:555184400"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 font-bold text-xs sm:text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>55 518 44 00</span>
              </a>

              <button
                type="button"
                onClick={() => navigate('/royxatdan-otish')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-[#064E3B] hover:bg-white/95 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-md text-center"
              >
                Sinov darsiga yozilish
              </button>
            </div>
          </div>
        </section>

        {/* Photography-First Image Lightbox for Methodology sequence */}
        <ImageLightbox
          isOpen={methodologyLightbox.isOpen}
          onClose={() => setMethodologyLightbox((prev) => ({ ...prev, isOpen: false }))}
          items={METHODOLOGY_GUIDES}
          currentIndex={methodologyLightbox.currentIndex}
          onNavigate={(newIdx) => setMethodologyLightbox((prev) => ({ ...prev, currentIndex: newIdx }))}
        />

        {/* History & Rebranding Lightbox */}
        <ImageLightbox
          isOpen={historyLightbox.isOpen}
          onClose={() => setHistoryLightbox((prev) => ({ ...prev, isOpen: false }))}
          items={HISTORY_ITEMS}
          currentIndex={historyLightbox.currentIndex}
          onNavigate={(newIdx) => setHistoryLightbox((prev) => ({ ...prev, currentIndex: newIdx }))}
        />
      </div>
    );
  }

  // ROUTE 8: TEACHING TEAM (/ustozlar)
  if (path === '/ustozlar') {
    return (
      <div className="py-12 lg:py-16 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
            {t.teachersPage?.badge || 'Akademik Jamoa'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#14231F]">
            {t.teachersPage?.title || 'Ustoz Akademiyasi o‘qituvchilar jamoasi va kafedralar'}
          </h1>
          <p className="text-sm sm:text-base text-[#65756F]">
            {t.teachersPage?.intro ||
              'Markazimizda darslar C1 darajali sertifikatga ega ustozlar, professional fonetika mutaxassislari hamda bolalar pedagogikasini chuqur egallagan ustozalar tomonidan olib boriladi.'}
          </p>
        </div>

        {/* 4 Official Teachers with Verified Photos */}
        <div>
          <h2 className="text-xl font-bold text-[#14231F] mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#07966F]" />
            <span>{t.teachersPage?.heading || 'O‘qituvchilarimiz'}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#073F31]/15 flex flex-col justify-between group hover:border-[#07966F]/50 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900/5">
                    <ImageWithSkeleton
                      src={teacher.image}
                      alt={teacher.fullName}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#073F31]/85 backdrop-blur-md text-[#63E6BE] text-[11px] font-bold border border-white/20">
                      {teacher.badge}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold shadow-xs">
                      {teacher.experience}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-[#14231F] group-hover:text-[#07966F] transition-colors">
                        {teacher.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-[#07966F] mt-0.5">
                        {teacher.role}
                      </p>
                    </div>

                    <p className="text-[11px] font-medium text-emerald-900 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100/70 leading-snug">
                      {teacher.motto}
                    </p>

                    <p className="text-xs text-[#65756F] leading-relaxed">
                      {teacher.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {teacher.courses.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      const teacherCleanName = teacher.fullName?.replace(/^Ustoz\s+/i, '').trim() || teacher.fullName;
                      const courseSlug =
                        teacher.fullName?.includes('Muhammad')
                          ? 'sarf-nahv-grammatika'
                          : teacher.fullName?.includes('Ibrohim')
                          ? 'intensiv-sozlashuv'
                          : 'professional-fonetika';

                      navigate('/royxatdan-otish', {
                        teacher: teacher.fullName,
                        courseSlug,
                        notes: `Ustoz: ${teacherCleanName} ustozni tanladi`
                      });
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#073F31] hover:text-white text-[#073F31] font-semibold text-xs border border-[#073F31]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Ushbu ustoz guruhiga yozilish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Departments */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#14231F] mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#07966F]" />
            <span>{t.departments?.title || t.teachersPage?.heading || 'O‘quv kafedralari va yo‘nalishlar'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#073F31]/15 flex flex-col justify-between group hover:border-[#07966F]/50 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {dept.image ? (
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900/5">
                      <ImageWithSkeleton
                        src={dept.image}
                        alt={dept.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#073F31]/85 backdrop-blur-md text-[#63E6BE] text-[11px] font-bold border border-white/20">
                        {dept.badge}
                      </span>
                      <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold shadow-xs">
                        {dept.coursesTaught?.join(' • ')}
                      </span>
                    </div>
                  ) : (
                    <div className="p-5 pb-0">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#07966F]/12 text-[#073F31] text-xs font-semibold border border-[#07966F]/20">
                        {dept.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-[#14231F] group-hover:text-[#07966F] transition-colors">
                        {dept.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#07966F] mt-0.5">
                        {dept.qualification}
                      </p>
                    </div>

                    <p className="text-xs text-[#65756F] leading-relaxed line-clamp-3">
                      {dept.focus}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() =>
                      navigate('/royxatdan-otish', {
                        notes: `Kafedra: ${dept.title} bo‘yicha sinov darsi`
                      })
                    }
                    className="w-full py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#073F31] hover:text-white text-[#073F31] font-semibold text-xs border border-[#073F31]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{t.teachersPage?.enrollDept || 'Ushbu kafedrada sinov darsiga yozilish →'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ROUTE 9: GRADUATE RESULTS (/natijalar)
  return (
    <div className="space-y-12">
      {/* Editorial Graduates Gallery & Ceremonies */}
      <GraduatesSection isFullPage={true} navigate={navigate} t={t} />

      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid md:grid-cols-2 gap-7 pb-16">
        <div className="bg-white rounded-2xl border border-[#073F31]/15 overflow-hidden">
          <div className="h-56">
            <AuthenticVisualPlate type="graduation-cefr" />
          </div>
          <div className="p-6 space-y-2">
            <h2 className="text-xl font-bold text-[#14231F]">
              {t.resultsPage?.card1Title || 'Barcha filiallardagi bitiruv tadbirlari'}
            </h2>
            <p className="text-sm text-[#65756F]">
              {t.resultsPage?.card1Desc ||
                'O‘quvchilarimiz va bolajonlarimiz bosqich yakunida sinovlardan o‘tib, rasmiy sertifikatlar bilan taqdirlanadilar. Haqiqiy video va fotolavhalar @ustoz_akademiyasi Instagram sahifamizning «Bitiruvchilar» va «O‘quvchilar» ruknlarida jamlangan.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#073F31]/15 overflow-hidden">
          <div className="h-56">
            <AuthenticVisualPlate type="cefr" />
          </div>
          <div className="p-6 space-y-2">
            <h2 className="text-xl font-bold text-[#14231F]">
              {t.resultsPage?.card2Title || 'C1 daraja va CEFR sertifikatlari'}
            </h2>
            <p className="text-sm text-[#65756F]">
              {t.resultsPage?.card2Desc ||
                'Katta yoshdagilar va o‘qituvchilikka tayyorlanayotgan talabalarimiz davlat va xalqaro miqyosdagi CEFR C1 sertifikatlarini qo‘lga kiritmoqdalar.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
