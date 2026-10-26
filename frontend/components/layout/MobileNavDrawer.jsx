'use client';

import React from 'react';
import { Phone, ChevronRight, MapPin, ArrowRight } from 'lucide-react';

export default function MobileNavDrawer({
  isOpen,
  onClose,
  route,
  navigate,
  t,
  brandConfig,
  courses = [],
  branches = [],
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-[#073F31]/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over menu panel */}
      <div
        role="dialog"
        aria-label="Mobil navigatsiya menyusi"
        className="fixed top-20 left-0 right-0 bottom-0 bg-white flex flex-col justify-between overflow-y-auto overscroll-contain px-4 py-5 space-y-5 shadow-2xl border-t border-[#073F31]/15"
      >
        <div className="space-y-5">
          {/* Quick Call & Status Header */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAF8] border border-[#073F31]/12">
            <span className="text-xs text-[#65756F]">
              {t.nav?.callUs || 'Yagona Call-Markaz'}:
            </span>
            <a
              href={brandConfig.phoneHref}
              className="text-xs font-bold text-[#073F31] flex items-center gap-1.5 hover:text-[#07966F]"
            >
              <Phone className="w-3.5 h-3.5 text-[#07966F]" />
              <span>{brandConfig.phoneDisplay}</span>
            </a>
          </div>

          {/* Kurslar list */}
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#07966F] px-1">
              {t.nav?.courses || 'Kurslarimiz'}
            </div>
            <div className="grid gap-1">
              {courses.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => navigate(`/kurslar/${c.slug}`)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F8FAF8] active:bg-[#073F31]/5 text-sm font-semibold text-[#14231F] flex items-center justify-between cursor-pointer min-h-[44px]"
                >
                  <span>{c.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#07966F]" />
                </button>
              ))}
            </div>
          </div>

          {/* 8 Filial Quick Grid */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#07966F] px-1">
              {t.nav?.allBranches || '8 ta Filialimiz'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {branches.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => navigate(`/filiallar/${b.slug}`)}
                  className="text-left px-3 py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#07966F]/10 text-xs font-semibold text-[#14231F] flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#07966F] flex-shrink-0" />
                  <span className="truncate">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Links */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#073F31]/10">
            <button
              onClick={() => navigate('/interaktiv-arab-tili')}
              className={`p-3 rounded-xl text-xs font-semibold text-left cursor-pointer min-h-[44px] transition ${
                route.path === '/interaktiv-arab-tili'
                  ? 'bg-[#07966F]/15 text-[#073F31] font-bold'
                  : 'bg-[#F8FAF8] text-[#14231F] hover:bg-[#07966F]/10'
              }`}
            >
              {t.nav?.interactive || 'Interaktiv Arab Tili'}
            </button>
            <button
              onClick={() => navigate('/markaz-haqida')}
              className="p-3 rounded-xl bg-[#F8FAF8] text-[#14231F] text-xs font-semibold text-left cursor-pointer min-h-[44px]"
            >
              {t.nav?.aboutCenter || 'Markaz haqida'}
            </button>
            <button
              onClick={() => navigate('/ustozlar')}
              className="p-3 rounded-xl bg-[#F8FAF8] text-[#14231F] text-xs font-semibold text-left cursor-pointer min-h-[44px]"
            >
              {t.nav?.teachers || 'Ustozlar'}
            </button>
            <button
              onClick={() => navigate('/natijalar')}
              className="p-3 rounded-xl bg-[#F8FAF8] text-[#14231F] text-xs font-semibold text-left cursor-pointer min-h-[44px]"
            >
              {t.nav?.results || 'Bitiruvchilar (15K+)'}
            </button>
            <button
              onClick={() => navigate('/maqolalar')}
              className="p-3 rounded-xl bg-[#F8FAF8] text-[#14231F] text-xs font-semibold text-left cursor-pointer min-h-[44px]"
            >
              {t.nav?.articles || 'Maqolalar'}
            </button>
            <button
              onClick={() => navigate('/savol-javob')}
              className="p-3 rounded-xl bg-[#F8FAF8] text-[#14231F] text-xs font-semibold text-left cursor-pointer min-h-[44px]"
            >
              {t.nav?.faq || 'Savol-Javob'}
            </button>
          </div>
        </div>

        {/* Bottom Pinned Action Section */}
        <div className="pt-4 pb-2 border-t border-[#073F31]/10 space-y-2">
          <button
            onClick={() => navigate('/royxatdan-otish')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#073F31] hover:bg-[#07966F] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[48px] shadow-sm active:scale-[0.99] transition"
          >
            <span>{t.nav?.trialBtn || 'Bepul sinov darsiga yozilish'}</span>
            <ArrowRight className="w-4 h-4 text-[#63E6BE]" />
          </button>
        </div>
      </div>
    </div>
  );
}
