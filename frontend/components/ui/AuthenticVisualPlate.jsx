'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Award } from 'lucide-react';
import { OfficialBrandShield } from './BrandShield';

export const AuthenticVisualPlate = ({ type, customImage, altText }) => {
  const { t, locale } = useI18n();

  if (customImage) {
    return (
      <div className="relative w-full h-full min-h-[220px] bg-[#073F31] overflow-hidden">
        <img
          src={customImage}
          alt={
            altText ||
            (locale === 'ru'
              ? 'Официальное фото Ustoz Akademiyasi'
              : locale === 'en'
              ? 'Official photo of Ustoz Akademiyasi'
              : 'Ustoz Akademiyasi rasmiy fotolavhasi')
          }
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Plate 1: "BOLAJONLAR BILAN RAQAMLARNI TOPISH O'YINI"
  if (type === 'kids-numbers') {
    return (
      <div
        role="img"
        aria-label="Hilol Kids 4+"
        className="w-full h-full min-h-[230px] bg-[#073F31] text-white p-5 flex flex-col justify-between relative overflow-hidden select-none"
      >
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-2">
            <OfficialBrandShield size={24} />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#63E6BE]">
              {locale === 'ru'
                ? 'Hilol Kids 4+ • Игровая методика'
                : locale === 'en'
                ? 'Hilol Kids 4+ • Playful Method'
                : 'Hilol Kids 4+ • O‘yin metodikasi'}
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/90">
            {locale === 'ru' ? '4+ года' : locale === 'en' ? '4+ years' : '4+ yosh'}
          </span>
        </div>

        {/* Classroom Arabic Number Poster Simulation */}
        <div className="my-3 grid grid-cols-4 gap-2 bg-[#F8FAF8] text-[#14231F] p-3 rounded-lg border-2 border-[#E8B84A]">
          {[
            { ar: '١', uz: locale === 'ru' ? '1 • Вахид' : locale === 'en' ? '1 • Wahid' : '1 • Vohid' },
            { ar: '٢', uz: locale === 'ru' ? '2 • Иснани' : locale === 'en' ? '2 • Ithnan' : '2 • Isnan' },
            { ar: '٣', uz: locale === 'ru' ? '3 • Саласа' : locale === 'en' ? '3 • Thalatha' : '3 • Salasa' },
            { ar: '٤', uz: locale === 'ru' ? '4 • Арбаа' : locale === 'en' ? '4 • Arba‘a' : '4 • Arba‘a' }
          ].map((item) => (
            <div
              key={item.ar}
              className="bg-white border border-[#073F31]/15 rounded p-2 text-center shadow-sm"
            >
              <div className="font-arabic text-2xl font-bold text-[#073F31] leading-none">
                {item.ar}
              </div>
              <div className="text-[10px] font-medium text-[#65756F] mt-1">{item.uz}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#63E6BE] font-semibold">
            {t.playgroundExtra?.workshopBadge || 'Amaliy mashg‘ulot'}
          </div>
          <div className="text-sm font-bold tracking-tight text-white mt-0.5">
            {t.playgroundExtra?.numbersGameTitle || 'BOLAJONLAR BILAN RAQAMLARNI VA HARFLARNI TOPISH O‘YINI'}
          </div>
        </div>
      </div>
    );
  }

  // Plate 2: "Professional Fonetika & Maxraj"
  if (type === 'phonetics-calligraphy') {
    return (
      <div
        role="img"
        aria-label="Professional Fonetika"
        className="w-full h-full min-h-[230px] bg-[#14231F] text-white p-5 flex flex-col justify-between relative overflow-hidden select-none"
      >
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-2">
            <OfficialBrandShield size={24} />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#63E6BE]">
              {t.courses?.items?.['professional-fonetika']?.title || 'Professional Fonetika'}
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#07966F]/30 text-[#63E6BE]">
            {locale === 'ru'
              ? 'Правила махраджа и таджвида'
              : locale === 'en'
              ? 'Makhraj and Tajweed Rules'
              : 'Maxraj va Tajvid qoidalari'}
          </span>
        </div>

        <div className="my-3 flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-lg p-3.5">
          <div className="space-y-1">
            <div className="text-xs text-[#63E6BE] font-medium">
              {locale === 'ru'
                ? 'Гортанный и корневой махрадж'
                : locale === 'en'
                ? 'Throat & Root Makhraj'
                : 'Bo‘g‘iz va Til maxraji'}
            </div>
            <div className="text-sm font-semibold text-white">
              {locale === 'ru'
                ? 'Точная артикуляция каждого звука'
                : locale === 'en'
                ? 'Precise articulation of each letter'
                : 'Har bir harfning aniq artikulyatsion nuqtasi'}
            </div>
            <div className="text-xs text-white/70">
              Fatha (ـَ), Kasra (ـِ), Damma (ـُ), Sukun (ـْ)
            </div>
          </div>
          <div
            dir="rtl"
            className="font-arabic text-4xl font-bold text-[#E8B84A] bg-[#073F31] px-4 py-2.5 rounded-lg border border-[#63E6BE]/30"
          >
            اقْرَأْ
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#E8B84A] font-semibold">
            {locale === 'ru'
              ? 'От 0 до беглого чтения'
              : locale === 'en'
              ? 'From scratch to fluent reading'
              : '0 dan ravon o‘qishgacha'}
          </div>
          <div className="text-sm font-bold tracking-tight text-white mt-0.5">
            {locale === 'ru'
              ? 'ПРАВИЛЬНОЕ ПРОИЗНОШЕНИЕ 28 АРАБСКИХ БУКВ ИЗ ИХ МАХРАДЖА'
              : locale === 'en'
              ? 'ACCURATE ARTICULATION OF 28 ARABIC LETTERS FROM MAKHRAJ'
              : '28 TA ARAB HARFINI ASL MAXRAJIDAN TO‘G‘RI TALAFFUZ QILISH'}
          </div>
        </div>
      </div>
    );
  }

  // Plate 3: "BITIRUV TADBIRI va CEFR"
  if (type === 'graduation-cefr') {
    return (
      <div
        role="img"
        aria-label="CEFR"
        className="w-full h-full min-h-[230px] bg-[#073F31] text-white p-5 flex flex-col justify-between relative overflow-hidden select-none"
      >
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-2">
            <OfficialBrandShield size={24} />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#63E6BE]">
              {t.courses?.items?.['grammatika-va-cefr']?.title || 'Grammatika va CEFR'}
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8B84A]/20 text-[#E8B84A] font-semibold">
            A2 • B1 • B2 • C1
          </span>
        </div>

        {/* Certificate Specimen */}
        <div className="my-3 bg-[#F8FAF8] text-[#14231F] p-3.5 rounded-lg border-2 border-[#E8B84A] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#07966F]">
              USTOZ AKADEMIYASI • {locale === 'ru' ? 'СЕРТИФИКАТ' : locale === 'en' ? 'CERTIFICATE' : 'SERTIFIKAT'}
            </div>
            <div className="text-sm font-bold text-[#14231F] mt-0.5">
              {locale === 'ru' ? 'Сарф, Нахв и уровни CEFR' : locale === 'en' ? 'Sarf, Nahw & CEFR Levels' : 'Sarf, Nahv va CEFR Bosqichlari'}
            </div>
            <div className="text-xs text-[#65756F] mt-0.5">
              {locale === 'ru'
                ? 'Присоединяйтесь к 15 000+ выпускникам'
                : locale === 'en'
                ? 'Join our 15,000+ alumni network'
                : '15,000+ bitiruvchilar safiga qo‘shiling'}
            </div>
          </div>
          <Award className="w-9 h-9 text-[#07966F] flex-shrink-0" />
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#63E6BE] font-semibold">
            {locale === 'ru' ? 'Подтверждённые результаты' : locale === 'en' ? 'Proven results' : 'Tasdiqlangan natijalar'}
          </div>
          <div className="text-sm font-bold tracking-tight text-white mt-0.5">
            {locale === 'ru'
              ? 'ВЫПУСКНЫЕ МЕРОПРИЯТИЯ И ПОДГОТОВКА К CEFR'
              : locale === 'en'
              ? 'GRADUATION CEREMONIES & CEFR PREPARATION'
              : 'FILIALLARIMIZDA BITIRUV TADBIRLARI VA CEFR TAYYORLOV'}
          </div>
        </div>
      </div>
    );
  }

  // Plate 4: "Arab tilidagi kasblar" Chalkboard
  return (
    <div
      role="img"
      aria-label="Kundalik va kasbiy arab tili"
      className="w-full h-full min-h-[230px] bg-[#073F31] text-white p-5 flex flex-col justify-between relative overflow-hidden select-none"
    >
      <div className="flex items-center justify-between border-b border-white/15 pb-3">
        <div className="flex items-center gap-2">
          <OfficialBrandShield size={24} />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#63E6BE]">
            {locale === 'ru'
              ? 'Общение и деловая карьера'
              : locale === 'en'
              ? 'Communication & Careers'
              : 'Muloqot va Kasbiy Yo‘nalish'}
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/90">
          {locale === 'ru' ? 'Живая речь' : locale === 'en' ? 'Spoken fluency' : 'Amaliy nutq'}
        </span>
      </div>

      {/* Chalkboard Frame */}
      <div className="my-3 bg-[#1E2623] border-4 border-[#8C6D46] rounded-lg p-3.5 text-center shadow-inner">
        <div className="font-serif italic text-lg text-white/95 leading-snug">
          {locale === 'ru'
            ? '«Профессии на арабском и необходимые повседневные фразы»'
            : locale === 'en'
            ? '“Careers in Arabic and everyday spoken expressions”'
            : '“Arab tilidagi kasblar va kundalik hayotda kerak bo‘ladigan so‘zlar”'}
        </div>
        <div className="font-arabic text-base text-[#63E6BE] mt-1" dir="rtl">
          مُعَلِّمٌ • مُتَرْجِمٌ • مُرْشِدٌ
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#63E6BE] font-semibold">
          {locale === 'ru' ? 'Живой диалог' : locale === 'en' ? 'Live dialogue' : 'Jonli muloqot'}
        </div>
        <div className="text-sm font-bold tracking-tight text-white mt-0.5">
          {locale === 'ru'
            ? 'РАЗГОВОРНЫЙ И ДЕЛОВОЙ АРАБСКИЙ ЯЗЫК'
            : locale === 'en'
            ? 'SPOKEN & PROFESSIONAL BUSINESS ARABIC'
            : 'KUNDALIK SO‘ZLASHUV VA KASBIY ARAB TILI'}
        </div>
      </div>
    </div>
  );
};

export default AuthenticVisualPlate;
