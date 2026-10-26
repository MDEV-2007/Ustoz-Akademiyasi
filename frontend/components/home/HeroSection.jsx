'use client';

import React from 'react';
import { ArrowRight, GraduationCap, Building2, Award } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export default function HeroSection({
  t,
  brandConfig,
  navigate,
}) {
  return (
    <section className="relative overflow-hidden bg-[#073F31] text-white min-h-[calc(100vh-5rem)] 2xl:min-h-[calc(100vh-5rem)] flex items-end pt-12 lg:pt-16 pb-[12vh] lg:pb-[16vh] 2xl:pb-[20vh] border-b border-white/10">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        {/* Deep emerald brand gradient overlay to ensure perfect contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04281F]/90 via-[#073F31]/80 to-[#04281F]/88" />
        <div className="absolute inset-0 islamic-pattern-bg ambient-hero-pattern opacity-35 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1360px] 2xl:max-w-[1520px] min-[1920px]:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-14 items-center">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-5 lg:space-y-6 2xl:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63E6BE]/15 border border-[#63E6BE]/30 text-[#63E6BE] text-xs font-bold uppercase tracking-wider motion-fade-up-1">
              <span className="w-2 h-2 rounded-full bg-[#63E6BE] animate-pulse" />
              <span>
                {brandConfig.sloganPrimary} • {brandConfig.sloganSecondary}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[44px] xl:text-[48px] 2xl:text-[54px] min-[1920px]:text-[62px] font-bold tracking-tight text-white leading-[1.12] motion-fade-up-2">
              {t.hero?.titleLine1} <span className="text-[#63E6BE]">{t.hero?.titleLine2}</span>
            </h1>

            <p className="text-white/85 text-sm sm:text-base lg:text-lg 2xl:text-xl min-[1920px]:text-2xl leading-relaxed max-w-2xl 2xl:max-w-3xl motion-fade-up-3">
              {t.hero?.subtitle}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 2xl:gap-4 pt-2 w-full motion-fade-up-4">
              <button
                onClick={() => navigate('/royxatdan-otish')}
                className="motion-button w-full sm:w-auto px-6 2xl:px-8 py-3.5 2xl:py-4 rounded-xl 2xl:rounded-2xl bg-[#63E6BE] hover:bg-[#63E6BE]/90 text-[#14231F] font-bold text-sm sm:text-base 2xl:text-lg transition flex items-center justify-center gap-2 2xl:gap-2.5 cursor-pointer group min-h-[48px] 2xl:min-h-[54px] shadow-sm active:scale-[0.99]"
              >
                <span>{t.hero?.primaryCta || 'Bepul sinov darsiga yozilish'}</span>
                <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5 motion-arrow" />
              </button>

              <button
                onClick={() => navigate('/kurslar')}
                className="motion-button w-full sm:w-auto px-6 2xl:px-8 py-3.5 2xl:py-4 rounded-xl 2xl:rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base 2xl:text-lg transition flex items-center justify-center cursor-pointer min-h-[48px] 2xl:min-h-[54px]"
              >
                {t.hero?.secondaryCta || 'Kurslarni ko‘rish'}
              </button>
            </div>
          </div>

          {/* Right Column: Verified Trust Indicators */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-4.5">
            {/* Indicator 1: Bitiruvchilar */}
            <div className="motion-fade-up-4 stagger-1 p-5 2xl:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#63E6BE]/50 transition-all duration-300 flex items-center gap-4.5 group shadow-sm hover:translate-y-[-2px]">
              <div className="w-13 h-13 2xl:w-14 2xl:h-14 rounded-2xl bg-[#63E6BE]/15 border border-[#63E6BE]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-[#63E6BE]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-[#63E6BE] leading-tight">
                  <AnimatedCounter end={15000} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-white/85 font-medium mt-0.5">
                  {t.hero?.statGraduates || 'Muvaffaqiyatli bitiruvchilar'}
                </div>
                <div className="text-[11px] text-white/55 mt-0.5">
                  Rasmiy Instagram (@ustoz_akademiyasi) tasdiqlangan
                </div>
              </div>
            </div>

            {/* Indicator 2: 8 ta filial */}
            <div className="motion-fade-up-5 stagger-2 p-5 2xl:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/40 transition-all duration-300 flex items-center gap-4.5 group shadow-sm hover:translate-y-[-2px]">
              <div className="w-13 h-13 2xl:w-14 2xl:h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-white leading-tight">
                  <AnimatedCounter end={brandConfig.branchesCount} suffix=" ta" duration={800} />
                </div>
                <div className="text-xs sm:text-sm text-white/85 font-medium mt-0.5">
                  {t.hero?.statBranches || 'Toshkentdagi rasmiy filiallar'}
                </div>
                <div className="text-[11px] text-white/55 mt-0.5">
                  Qulay transport va metroga yaqin lokatsiyalar
                </div>
              </div>
            </div>

            {/* Indicator 3: CEFR C1 */}
            <div className="motion-fade-up-6 stagger-3 p-5 2xl:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#E8B84A]/50 transition-all duration-300 flex items-center gap-4.5 group shadow-sm hover:translate-y-[-2px]">
              <div className="w-13 h-13 2xl:w-14 2xl:h-14 rounded-2xl bg-[#E8B84A]/15 border border-[#E8B84A]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Award className="w-7 h-7 text-[#E8B84A]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-[#E8B84A] leading-tight">
                  CEFR C1
                </div>
                <div className="text-xs sm:text-sm text-white/85 font-medium mt-0.5">
                  {t.hero?.statCefr || 'Oliy toifali ustozlar jamoasi'}
                </div>
                <div className="text-[11px] text-white/55 mt-0.5">
                  Xalqaro diplom va milliy C1 sertifikatiga ega
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
