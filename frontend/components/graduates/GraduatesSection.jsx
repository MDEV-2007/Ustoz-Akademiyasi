'use client';

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Maximize2,
  Sparkles,
  Users,
  ArrowUpRight
} from 'lucide-react';
import ImageLightbox from '@/components/ui/ImageLightbox';

export default function GraduatesSection({
  graduates = [],
  kidsGraduates = [],
  navigate = () => {},
  t = {},
  isFullPage = false
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'adults' | 'kids'
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    items: [],
    currentIndex: 0
  });

  const defaultGraduates = [
    {
      id: 'grad-group-1',
      name: "Boshlang'ich Arab tili guruhi",
      teacher: 'Ustoz: Muhammad Nur',
      course: "Boshlang'ich Arab tili kursi",
      certificate: 'Fonetika va Boshlang‘ich rasmiy sertifikatlari',
      date: '2026',
      image: '/graduates/boshlangich_guruh_bitiruvchilari.jpg',
      quote: "Ustoz Muhammad Nur guruhi o'quvchilari fonetika va boshlang'ich arab tili bosqichini a'lo natijalar bilan tamomladilar.",
      badge: 'Guruhiy bitiruv',
      achievement: "Guruh to'liq tarkibda sertifikat oldi",
      isGroup: true,
      category: 'adults'
    },
    {
      id: 'grad-1',
      name: 'Hikmatullayev Xamidullo',
      course: 'Arab tili fonetikasi kursi',
      certificate: 'Maxraj va Fonetika sertifikati',
      date: '2026',
      image: '/graduates/hikmatullayev_xamidullo.png',
      quote: 'Arab harflari maxrajini to‘g‘ri o‘zlashtirib, Qur’on va arab matnlarini ravon o‘qish darajasiga erishdim.',
      badge: 'Fonetika',
      achievement: 'A’lo baholar bilan tamomladi',
      category: 'adults'
    },
    {
      id: 'grad-2',
      name: 'To‘raboyev Bilol',
      course: 'Arab tili fonetikasi kursi',
      certificate: 'Maxraj va Fonetika sertifikati',
      date: '2026',
      image: '/graduates/toraboyev_bilol.png',
      quote: 'Ustozlar metodikasi tufayli qisqa muddatda harflarni bexato talaffuz qilishni o‘rgandim.',
      badge: 'Fonetika',
      achievement: 'Sertifikat va esdalik sovg‘asi',
      category: 'adults'
    },
    {
      id: 'grad-3',
      name: 'Alimov Abdulbosit',
      course: 'Arab tili fonetikasi kursi',
      certificate: 'Maxraj va Fonetika sertifikati',
      date: '2026',
      image: '/graduates/alimov_abdulbosit.png',
      quote: 'Darslar juda qiziqarli o‘tdi, yakuniy imtihondan a’lo bahoga o‘tib rasmiy sertifikat oldim.',
      badge: 'Fonetika',
      achievement: 'Amaliy talaffuz bo‘yicha yuqori natija',
      category: 'adults'
    },
    {
      id: 'grad-4',
      name: 'Akbarov Mirsolih',
      course: 'Arab tili fonetikasi kursi',
      certificate: 'Maxraj va Fonetika sertifikati',
      date: '2026',
      image: '/graduates/akbarov_mirsolih.png',
      quote: 'Ustoz Akademiyasida tahsil olib, fonetika bosqichini muvaffaqiyatli tamomladim.',
      badge: 'Fonetika',
      achievement: 'Mukammal maxraj sohibi',
      category: 'adults'
    },
    {
      id: 'grad-5',
      name: 'Olimov Muhammadamin',
      course: 'Arab tili fonetikasi kursi',
      certificate: 'Maxraj va Fonetika sertifikati',
      date: '2026',
      image: '/graduates/olimov_muhammadamin.png',
      quote: 'Arab tilini 0 dan boshlab, bugun rasmiy sertifikat sohibi bo‘lganimdan faxrlanaman.',
      badge: 'Fonetika',
      achievement: 'Faol va namunali o‘quvchi',
      category: 'adults'
    }
  ];

  const defaultKidsGraduates = [
    {
      id: 'kids-grad-1',
      title: 'Hilol Kids — Kichkintoylarimiz bitiruv marosimi',
      subtitle: '4+ yoshdagi o‘quvchilarimiz taqdirlandi',
      course: 'Hilol Kids 4+ dasturi',
      certificate: 'Hilol Kids rasmiy sertifikati va Oltin medallari',
      image: '/graduates/kids_bitiruvchilar.png',
      quote: 'Bolajonlarimiz o‘yinlar, ko‘rgazmali darslar va arabcha multfilmlar yordamida harflarni bexato o‘zlashtirib, birinchi katta natijalariga erishdilar.',
      badge: 'Kids bitiruvchilari',
      achievement: 'Oltin medal va rasmiy sertifikat sohiblari',
      category: 'kids'
    }
  ];

  const items = graduates.length > 0 ? graduates : defaultGraduates;
  const kidsItems = kidsGraduates.length > 0 ? kidsGraduates : defaultKidsGraduates;

  const groupItem = items.find((g) => g.isGroup) || items[0];
  const individualItems = items.filter((g) => !g.isGroup);
  const allAdultItems = [groupItem, ...individualItems];

  const openAdultGallery = (clickedItem) => {
    const index = allAdultItems.findIndex((it) => it.id === clickedItem.id);
    setLightboxState({
      isOpen: true,
      items: allAdultItems,
      currentIndex: index >= 0 ? index : 0
    });
  };

  const openKidsGallery = (clickedItem) => {
    const index = kidsItems.findIndex((it) => it.id === clickedItem.id);
    setLightboxState({
      isOpen: true,
      items: kidsItems,
      currentIndex: index >= 0 ? index : 0
    });
  };

  const showAdults = activeTab === 'all' || activeTab === 'adults';
  const showKids = activeTab === 'all' || activeTab === 'kids';

  return (
    <section className={`py-14 sm:py-20 ${isFullPage ? 'bg-transparent' : 'bg-[#F8F9F6] border-b border-[#E2E8E4]'}`}>
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-[#E2E8E4]">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#047857]">
              <span>Ustoz Akademiyasi Natijalari</span>
              <span className="w-1 h-1 rounded-full bg-[#047857]/40" />
              <span className="font-medium text-[#66736E]">15 000+ Bitiruvchi</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#172421] tracking-tight leading-[1.15]">
              15 000+ bitiruvchi — minglab muvaffaqiyat hikoyalari
            </h2>

            <p className="text-sm sm:text-base text-[#66736E] leading-relaxed max-w-2xl">
              Arab tili fonetikasi, grammatikasi va bolalar dasturlarini a’lo baholarga yakunlagan o‘quvchilarimizning rasmiy sertifikat topshirish marosimlari va erishgan natijalari.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {!isFullPage && (
              <button
                type="button"
                onClick={() => navigate('/natijalar')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#064E3B] text-[#064E3B] hover:bg-[#064E3B] hover:text-white text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer"
              >
                <span>Barcha natijalar</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters (Refined, Restrained, Accessible) */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1 scrollbar-none" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-[#064E3B] text-white'
                : 'bg-white border border-[#E2E8E4] text-[#66736E] hover:text-[#172421] hover:border-[#172421]/30'
            }`}
          >
            <span>Barchasi</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-[#F8F9F6] text-[#66736E]'}`}>
              {items.length + kidsItems.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'adults'}
            onClick={() => setActiveTab('adults')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'adults'
                ? 'bg-[#064E3B] text-white'
                : 'bg-white border border-[#E2E8E4] text-[#66736E] hover:text-[#172421] hover:border-[#172421]/30'
            }`}
          >
            <span>Arab tili bitiruvchilari</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'adults' ? 'bg-white/20 text-white' : 'bg-[#F8F9F6] text-[#66736E]'}`}>
              {items.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'kids'}
            onClick={() => setActiveTab('kids')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'kids'
                ? 'bg-[#064E3B] text-white'
                : 'bg-white border border-[#E2E8E4] text-[#66736E] hover:text-[#172421] hover:border-[#172421]/30'
            }`}
          >
            <span>Kids bitiruvchilari</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'kids' ? 'bg-white/20 text-white' : 'bg-[#F8F9F6] text-[#66736E]'}`}>
              {kidsItems.length}
            </span>
          </button>
        </div>

        {/* 1. FEATURED GRADUATION STORY & ADULT GRADUATES */}
        {showAdults && (
          <div className="space-y-12 mb-16">
            {/* Featured Story: Balanced Two-Column Editorial Composition */}
            {groupItem && (
              <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 sm:p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Large Authentic Photograph Frame */}
                <div
                  onClick={() => openAdultGallery(groupItem)}
                  className="lg:col-span-5 relative rounded-xl overflow-hidden aspect-[9/13] max-h-[500px] bg-[#064E3B]/5 border border-[#E2E8E4] cursor-pointer group"
                >
                  <img
                    src={groupItem.image}
                    alt={groupItem.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  {/* Clean bottom action overlay on hover */}
                  <div className="absolute inset-0 bg-[#064E3B]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-lg bg-white/95 text-[#064E3B] text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Fotosuratni to‘liq ochish</span>
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded bg-[#064E3B]/90 text-white text-[11px] font-medium backdrop-blur-xs">
                      Guruh marosimi • 2026
                    </span>
                  </div>
                </div>

                {/* Editorial Content Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#047857]">
                      Fonetika va Boshlang‘ich Kurs • {groupItem.teacher}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#172421] tracking-tight leading-snug">
                      Boshlang‘ich arab tili guruhi bitiruv marosimi
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-[#66736E] leading-relaxed">
                    Ustoz Muhammad Nur rahbarligida tahsil olgan ushbu guruh o‘quvchilari arab tili fonetikasi, harflar artikulyatsiyasi va ravon o‘qish bosqichini to‘liq o‘zlashtirib, yakuniy imtihonlardan a’lo baholar bilan rasmiy sertifikatlar hamda esdalik sovg‘alariga ega bo‘ldilar.
                  </p>

                  {/* Factual Highlights (Typography & Whitespace-Led) */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E2E8E4]">
                    <div className="pt-3 space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#172421]">
                        Maxraj va Talaffuz
                      </div>
                      <p className="text-xs text-[#66736E] leading-normal">
                        28 ta arab harfini aniq artikulyatsiya qilish va matnlarni to‘g‘ri o‘qish.
                      </p>
                    </div>

                    <div className="pt-3 space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#172421]">
                        100% Natija
                      </div>
                      <p className="text-xs text-[#66736E] leading-normal">
                        Guruhning barcha o‘quvchilari sinovlardan muvaffaqiyatli o‘tib sertifikat oldi.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openAdultGallery(groupItem)}
                      className="px-5 py-2.5 rounded-lg bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>Fotosuratni ko‘rish</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/kurslar')}
                      className="px-5 py-2.5 rounded-lg border border-[#E2E8E4] text-[#172421] hover:bg-[#F8F9F6] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Kurs dasturini ko‘rish
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Graduates Gallery Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8E4] pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#172421]">
                  Fonetika kursi bitiruvchilari va sertifikat egalari
                </h3>
                <span className="text-xs text-[#66736E]">
                  Rasmiy sertifikat topshirish
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {individualItems.map((grad, idx) => (
                  <div
                    key={grad.id || idx}
                    onClick={() => openAdultGallery(grad)}
                    className="bg-white rounded-xl border border-[#E2E8E4] overflow-hidden hover:border-[#047857]/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                  >
                    {/* Clean Portrait Framing */}
                    <div className="relative aspect-[9/13] bg-[#064E3B]/5 overflow-hidden">
                      <img
                        src={grad.image}
                        alt={grad.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />

                      {/* Subtle hover icon hint */}
                      <div className="absolute inset-0 bg-[#064E3B]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="p-2 rounded-full bg-white/95 text-[#064E3B] shadow-sm">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-3.5 space-y-1 bg-white">
                      <div className="text-[11px] font-medium text-[#047857]">
                        {grad.badge}
                      </div>

                      <h4 className="font-bold text-sm text-[#172421] leading-snug group-hover:text-[#047857] transition-colors line-clamp-1">
                        {grad.name}
                      </h4>

                      <p className="text-[11px] text-[#66736E] line-clamp-1">
                        {grad.achievement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. DEDICATED KIDS GRADUATION SECTION (Editorial & Warm without Clutter) */}
        {showKids && (
          <div className="mb-16">
            <div className="border-b border-[#E2E8E4] pb-3 mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#D6A63A]">
                Ustoz Kids — Kichkintoylarimiz Natijalari
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#172421] mt-1">
                Kids bitiruvchilari taqdirlandi
              </h3>
            </div>

            {kidsItems.map((kids, idx) => (
              <div
                key={kids.id || idx}
                className="bg-white rounded-2xl border border-[#E2E8E4] p-6 sm:p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Kids Graduation Photograph */}
                <div
                  onClick={() => openKidsGallery(kids)}
                  className="lg:col-span-5 relative rounded-xl overflow-hidden aspect-[9/14] max-h-[500px] bg-[#064E3B]/5 border border-[#E2E8E4] cursor-pointer group"
                >
                  <img
                    src={kids.image}
                    alt={kids.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-[#064E3B]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-lg bg-white/95 text-[#064E3B] text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Fotosuratni to‘liq ochish</span>
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded bg-[#064E3B]/90 text-white text-[11px] font-medium backdrop-blur-xs">
                      Hilol Kids • Bitiruv marosimi
                    </span>
                  </div>
                </div>

                {/* Kids Editorial Story */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#D6A63A]">
                      Hilol Kids 4+ Dasturi
                    </div>
                    <h4 className="text-2xl sm:text-3xl font-bold text-[#172421] tracking-tight leading-snug">
                      Kichkintoylarimizning ilk katta natijalari
                    </h4>
                  </div>

                  <p className="text-sm sm:text-base text-[#66736E] leading-relaxed">
                    4 yoshdan boshlab arab tilini o‘rganishni boshlagan jajji o‘quvchilarimiz alifbo, tovushlar va eng kerakli kundalik so‘zlarni ko‘rgazmali o‘yinlar hamda multfilmlar yordamida to‘liq o‘zlashtirib, ramziy tojlar, oltin medallar va ramkaga solingan rasmiy sertifikatlar bilan taqdirlandilar.
                  </p>

                  {/* 3 Restrained Achievement Details */}
                  <div className="space-y-3 pt-1 border-t border-[#E2E8E4]">
                    <div className="pt-2 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#D6A63A] mt-1.5 flex-shrink-0" />
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-[#172421]">
                          Oltin medal va rasmiy sertifikat
                        </h5>
                        <p className="text-xs text-[#66736E] mt-0.5">
                          Har bir jajji bitiruvchi muhr tushirilgan sertifikat va esdalik oltin medali bilan taqdirlandi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#047857] mt-1.5 flex-shrink-0" />
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-[#172421]">
                          Multfilmlar va interaktiv o‘yinlar
                        </h5>
                        <p className="text-xs text-[#66736E] mt-0.5">
                          Majburlashsiz, bolalar psixologiyasiga mos muhit va qiziqarli ko‘rgazmali mashg‘ulotlar.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#172421] mt-1.5 flex-shrink-0" />
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-[#172421]">
                          Erta yoshdagi to‘g‘ri poydevor
                        </h5>
                        <p className="text-xs text-[#66736E] mt-0.5">
                          Harflarni bexato talaffuz qilish va tilga bo‘lgan tabiiy muhabbatni shakllantirish.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/kurslar/hilol-kids')}
                      className="px-5 py-2.5 rounded-lg bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Hilol Kids dasturi haqida
                    </button>

                    <button
                      type="button"
                      onClick={() => openKidsGallery(kids)}
                      className="px-5 py-2.5 rounded-lg border border-[#E2E8E4] text-[#172421] hover:bg-[#F8F9F6] text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>Fotolavhani ko‘rish</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Editorial CTA Bar */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#064E3B] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#63E6BE]">
              Siz ham navbatdagi bitiruvchi bo‘ling
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Arab tilini 0 dan boshlab, rasmiy sertifikatga ega bo‘ling
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Bepul sinov darsimizda qatnashing, darajangizni aniqlang va o‘zingizga mos guruhda o‘qishni boshlang.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/royxatdan-otish')}
            className="px-6 py-3 rounded-lg bg-white text-[#064E3B] hover:bg-white/90 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex-shrink-0"
          >
            Sinov darsiga yozilish
          </button>
        </div>
      </div>

      {/* Photography-First Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        onNavigate={(newIdx) => setLightboxState((prev) => ({ ...prev, currentIndex: newIdx }))}
      />
    </section>
  );
}
