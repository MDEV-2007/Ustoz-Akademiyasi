'use client';

import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  GraduationCap,
  Volume2,
  Award,
  MessageSquare,
  MapPin,
  Info,
  Users,
  Phone,
} from 'lucide-react';
import { OfficialBrandShield, PremiumIconBadge } from '@/components/ui/BrandShield';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header({
  route,
  navigate,
  t,
  courses = [],
  branches = [],
  openDropdown,
  setOpenDropdown,
  mobileNavOpen,
  setMobileNavOpen,
}) {
  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#073F31]/12"
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-20 flex items-center justify-between gap-3 lg:gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none cursor-pointer group flex-shrink-0"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-full bg-[#00D98B]/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
            <OfficialBrandShield
              size={42}
              className="w-[36px] h-[39px] sm:w-[44px] sm:h-[48px] relative transform group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-base sm:text-xl tracking-tight text-[#14231F] flex items-center gap-1.5">
              <span>USTOZ</span>
              <span className="text-[#07966F] font-black">AKADEMIYASI</span>
            </div>
            <div className="font-semibold text-[9px] sm:text-[10px] tracking-wider text-[#073F31]/75 uppercase whitespace-nowrap">
              Zulmatlardan Nur tomon
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Asosiy menyu">
          {/* Kurslar Dropdown */}
          <div className="relative" onMouseEnter={() => setOpenDropdown('kurslar')}>
            <button
              onClick={() => navigate('/kurslar')}
              aria-expanded={openDropdown === 'kurslar'}
              className={`px-3 py-2 rounded-xl text-[13px] xl:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                route.path.startsWith('/kurslar')
                  ? 'bg-[#07966F]/10 text-[#073F31] font-bold shadow-xs'
                  : 'text-[#14231F] hover:bg-[#F2F7F4] hover:text-[#07966F]'
              }`}
            >
              <span>{t.nav?.courses || 'Kurslar'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'kurslar' ? 'rotate-180 text-[#07966F]' : 'text-[#65756F]'
                }`}
              />
            </button>

            {openDropdown === 'kurslar' && (
              <div className="absolute left-0 top-full pt-1.5 w-80 z-50 motion-dropdown">
                <div className="bg-white rounded-xl shadow-lg border border-[#073F31]/15 p-2 space-y-1">
                  {courses.map((c) => {
                    const courseIcon =
                      c.slug === 'hilol-kids'
                        ? GraduationCap
                        : c.slug === 'professional-fonetika'
                        ? Volume2
                        : c.slug === 'grammatika-cefr'
                        ? Award
                        : MessageSquare;

                    return (
                      <button
                        key={c.slug}
                        onClick={() => navigate(`/kurslar/${c.slug}`)}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#F8FAF8] transition flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <PremiumIconBadge icon={courseIcon} variant="emerald" size="xs" />
                          <div>
                            <div className="text-xs font-bold text-[#14231F] group-hover:text-[#07966F] transition-colors">
                              {c.title}
                            </div>
                            <div className="text-[11px] text-[#65756F]">{c.category}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#07966F] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Filiallar Dropdown */}
          <div className="relative" onMouseEnter={() => setOpenDropdown('filiallar')}>
            <button
              onClick={() => navigate('/filiallar')}
              aria-expanded={openDropdown === 'filiallar'}
              className={`px-3 py-2 rounded-xl text-[13px] xl:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                route.path.startsWith('/filiallar')
                  ? 'bg-[#07966F]/10 text-[#073F31] font-bold shadow-xs'
                  : 'text-[#14231F] hover:bg-[#F2F7F4] hover:text-[#07966F]'
              }`}
            >
              <span>{t.nav?.branches || 'Filiallar'}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#07966F]/12 text-[#07966F] leading-none">
                {branches.length}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'filiallar' ? 'rotate-180 text-[#07966F]' : 'text-[#65756F]'
                }`}
              />
            </button>

            {openDropdown === 'filiallar' && (
              <div className="absolute left-0 top-full pt-1.5 w-96 z-50 motion-dropdown">
                <div className="bg-white rounded-xl shadow-lg border border-[#073F31]/15 p-3 grid grid-cols-2 gap-1">
                  {branches.map((b) => (
                    <button
                      key={b.slug}
                      onClick={() => navigate(`/filiallar/${b.slug}`)}
                      className="text-left px-3 py-2 rounded-lg hover:bg-[#F8FAF8] text-xs font-semibold text-[#14231F] flex items-center gap-1.5 cursor-pointer group"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#07966F] flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate group-hover:text-[#07966F] transition-colors">
                        {b.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Markaz / Ustozlar Dropdown */}
          <div className="relative" onMouseEnter={() => setOpenDropdown('markaz')}>
            <button
              onClick={() => navigate('/markaz-haqida')}
              aria-expanded={openDropdown === 'markaz'}
              className={`px-3 py-2 rounded-xl text-[13px] xl:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                ['/markaz-haqida', '/ustozlar', '/natijalar', '/aloqa'].some((p) =>
                  route.path.startsWith(p)
                )
                  ? 'bg-[#07966F]/10 text-[#073F31] font-bold shadow-xs'
                  : 'text-[#14231F] hover:bg-[#F2F7F4] hover:text-[#07966F]'
              }`}
            >
              <span>{t.nav?.methodology || 'Kafedralar'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'markaz' ? 'rotate-180 text-[#07966F]' : 'text-[#65756F]'
                }`}
              />
            </button>

            {openDropdown === 'markaz' && (
              <div className="absolute left-0 top-full pt-1.5 w-64 z-50 motion-dropdown">
                <div className="bg-white rounded-xl shadow-lg border border-[#073F31]/15 p-2 space-y-1">
                  {[
                    { label: t.nav?.aboutCenter || 'Markaz haqida', path: '/markaz-haqida', icon: Info },
                    { label: t.nav?.teachers || 'Ustozlar jamoasi', path: '/ustozlar', icon: Users },
                    { label: t.nav?.results || 'Bitiruvchilar va Natijalar', path: '/natijalar', icon: Award },
                    { label: t.nav?.contact || 'Aloqa ma’lumotlari', path: '/aloqa', icon: Phone },
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8FAF8] text-xs font-semibold text-[#14231F] flex items-center gap-2 cursor-pointer group"
                      >
                        <ItemIcon className="w-3.5 h-3.5 text-[#07966F] group-hover:scale-110 transition-transform" />
                        <span className="group-hover:text-[#07966F] transition-colors">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/interaktiv-arab-tili')}
            className={`px-3 py-2 rounded-xl text-[13px] xl:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              route.path === '/interaktiv-arab-tili'
                ? 'bg-[#07966F]/10 text-[#073F31] font-bold shadow-xs'
                : 'text-[#14231F] hover:bg-[#F2F7F4] hover:text-[#07966F]'
            }`}
          >
            <span className="hidden xl:inline">{t.nav?.interactive || 'Interaktiv Arab Tili'}</span>
            <span className="xl:hidden">
              {t.nav?.interactive ? t.nav.interactive.split(' ')[0] : 'Arab Tili'}
            </span>
          </button>

          <button
            onClick={() => navigate('/maqolalar')}
            className={`px-3 py-2 rounded-xl text-[13px] xl:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              route.path.startsWith('/maqolalar')
                ? 'bg-[#07966F]/10 text-[#073F31] font-bold shadow-xs'
                : 'text-[#14231F] hover:bg-[#F2F7F4] hover:text-[#07966F]'
            }`}
          >
            {t.nav?.articles || 'Maqolalar'}
          </button>

          <button
            onClick={() => navigate('/savol-javob')}
            className={`px-3 py-2 rounded-xl text-[13px] xl:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              route.path === '/savol-javob'
                ? 'bg-[#07966F]/10 text-[#073F31] font-bold shadow-xs'
                : 'text-[#14231F] hover:bg-[#F2F7F4] hover:text-[#07966F]'
            }`}
          >
            {t.nav?.faq || 'Savol-Javob'}
          </button>
        </nav>

        {/* Prominent Trial-Lesson CTA and Language Switcher */}
        <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
          <LanguageSwitcher />
          <button
            onClick={() => navigate('/royxatdan-otish')}
            className="motion-button px-4 xl:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#073F31] to-[#07966F] hover:shadow-md hover:shadow-[#07966F]/20 text-white font-semibold text-xs xl:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer group whitespace-nowrap"
          >
            <span className="hidden 2xl:inline">
              {t.nav?.trialBtn || 'Bepul sinov darsiga yozilish'}
            </span>
            <span className="2xl:hidden">{t.nav?.trialBtn || 'Sinov darsiga yozilish'}</span>
            <ArrowRight className="w-4 h-4 motion-arrow group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Actions: Language Switcher + Hamburger Button */}
        <div className="flex sm:hidden items-center gap-1.5 xs:gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? 'Mobil menyuni yopish' : 'Mobil menyuni ochish'}
            aria-expanded={mobileNavOpen}
            className="flex w-10 h-10 items-center justify-center rounded-xl border border-[#073F31]/20 text-[#14231F] hover:bg-[#F8FAF8] active:bg-[#073F31]/10 cursor-pointer transition-colors"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label={mobileNavOpen ? 'Mobil menyuni yopish' : 'Mobil menyuni ochish'}
          aria-expanded={mobileNavOpen}
          className="hidden sm:flex lg:hidden w-11 h-11 items-center justify-center rounded-xl border border-[#073F31]/20 text-[#14231F] hover:bg-[#F8FAF8] active:bg-[#073F31]/10 cursor-pointer transition-colors"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
