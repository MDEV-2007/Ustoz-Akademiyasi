'use client';

import React from 'react';
import {
  ArrowRight,
  Star,
  Sparkles,
  GraduationCap,
  Building2,
  Award,
} from 'lucide-react';

export default function HeroSection({
  t,
  brandConfig,
  navigate,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#061c14] via-[#082319] to-[#0a2e22] text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
      {/* Delicate Islamic Geometric & Mesh Pattern Overlay */}
      <div className="absolute inset-0 z-0 islamic-pattern-bg ambient-hero-pattern opacity-5 mix-blend-overlay pointer-events-none" />

      {/* Subtle radial emerald-gold ambient glow behind right visual column */}
      <div className="absolute right-0 top-1/3 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-500/20 via-amber-400/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-10 w-[350px] h-[350px] rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1360px] 2xl:max-w-[1520px] min-[1920px]:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 w-full">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-center">
          
          {/* ======================================================== */}
          {/* Left Column (60% width on desktop) — Content & Conversion */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Top Eyebrow Badge */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider shadow-sm max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="truncate">O‘QI VA KO‘TARIL! • ZULMATLARDAN NUR TOMON</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-6xl font-extrabold tracking-tight leading-[1.18] sm:leading-[1.14] text-white">
              Arab tilini mukammal o‘rganing:
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#34d399] via-emerald-300 to-[#fbbf24] bg-clip-text text-transparent">
                Noldan CEFR C1 darajagacha
              </span>
            </h1>

            {/* Subheadline (Cleaned of repetitive stats) */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              Xalqaro diplomga ega oliy toifali ustozlar jamoasi bilan zamonaviy metodika asosida o‘qing. Kattalar uchun intensiv kurslar va bolalar uchun maxsus Kids 4+ dasturi.
            </p>

            {/* CTA Button Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={() => navigate('/royxatdan-otish')}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.99] text-sm sm:text-base whitespace-nowrap"
              >
                <span>Bepul sinov darsiga yozilish</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/kurslar')}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/15 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center justify-center cursor-pointer font-semibold text-sm sm:text-base whitespace-nowrap"
              >
                Kurslar bilan tanishish
              </button>
            </div>

            {/* Social Proof Strip (Responsive, no ugly text breaks) */}
            <div className="flex items-center gap-3 sm:gap-3.5 pt-2">
              {/* Overlapping student avatar circles */}
              <div className="flex -space-x-2.5 overflow-hidden flex-shrink-0">
                {[
                  '/teachers/teacher_1.png',
                  '/teachers/teacher_2.png',
                  '/teachers/teacher_3.png',
                  '/teachers/teacher_4.png',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Student"
                    className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-[#061c14] object-cover"
                  />
                ))}
              </div>

              {/* Rating and review count */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400 gap-0.5 flex-shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm whitespace-nowrap">
                    4.9/5 reyting
                  </span>
                </div>
                <span className="hidden sm:inline text-slate-500">•</span>
                <span className="text-slate-300 text-[11px] sm:text-xs font-medium whitespace-nowrap">
                  15,000+ o‘quvchilar ishonchi
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Right Column (40% width on desktop) — Visual Composition */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0">
            {/* Visual Centerpiece Arch Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/5] mx-auto rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-[0_20px_50px_rgba(6,28,20,0.6)] bg-emerald-950/40 backdrop-blur-md group">
              <img
                src="/teachers/teacher_1.png"
                alt="Arab Tili Ustoz"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Ambient bottom-fade gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061c14] via-[#061c14]/40 to-transparent opacity-85" />

              {/* Stylized Glowing Arabic Calligraphy of "اقرأ" (Iqra) Centerpiece */}
              <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-[#073F31]/95 to-emerald-950/95 border border-amber-400/40 backdrop-blur-md shadow-2xl flex items-center gap-2.5 sm:gap-3 w-[92%] sm:w-[88%] max-w-[320px] justify-center z-10">
                <span
                  className="text-2xl sm:text-3xl font-bold text-amber-300 tracking-wide select-none drop-shadow-[0_2px_12px_rgba(251,191,36,0.5)]"
                  dir="rtl"
                  style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                >
                  اقْرَأْ
                </span>
                <div className="h-6 w-px bg-amber-400/30 flex-shrink-0" />
                <div className="text-left leading-tight">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    O‘qi va Ko‘taril
                  </div>
                  <div className="text-[10px] text-emerald-300 font-medium mt-0.5">
                    Ilmdan yuksaklik sari
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphic Micro-Card 1: Top-Right (CEFR C1) */}
            <div className="absolute -top-3 right-0 sm:-right-4 bg-emerald-950/90 backdrop-blur-md border border-amber-400/40 rounded-2xl p-2.5 sm:p-3 shadow-xl flex items-center gap-2 sm:gap-2.5 max-w-[200px] sm:max-w-[220px] transition-transform duration-300 hover:scale-105 z-20">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-[11px] sm:text-xs font-bold text-white leading-tight">CEFR C1</div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 mt-0.5 leading-snug">
                  Xalqaro va milliy sertifikat
                </div>
              </div>
            </div>

            {/* Floating Glassmorphic Micro-Card 2: Bottom-Left (Kids 4+) */}
            <div className="absolute -bottom-3 left-0 sm:-left-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-400/40 rounded-2xl p-2.5 sm:p-3 shadow-xl flex items-center gap-2 sm:gap-2.5 max-w-[190px] sm:max-w-[210px] transition-transform duration-300 hover:scale-105 z-20">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] sm:text-xs font-bold text-white leading-tight">Kids 4+</div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 mt-0.5 leading-snug">
                  Bolalar maxsus dasturi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Bottom Bar: Full-Width Compact Stats Strip */}
        {/* ======================================================== */}
        <div className="mt-10 sm:mt-12 lg:mt-16 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-4 sm:p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Stat 1: 15,000+ */}
            <div className="flex items-center gap-3.5 sm:gap-4 pb-4 md:pb-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-extrabold text-white">15,000+</div>
                <div className="text-xs text-slate-300 mt-0.5 font-medium">
                  Muvaffaqiyatli bitiruvchilar
                </div>
              </div>
            </div>

            {/* Stat 2: 8 ta filial */}
            <div className="flex items-center gap-3.5 sm:gap-4 py-4 md:py-0 md:pl-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-extrabold text-white">8 ta zamonaviy filial</div>
                <div className="text-xs text-slate-300 mt-0.5 font-medium">
                  Toshkent bo‘ylab metroga yaqin lokatsiyalar
                </div>
              </div>
            </div>

            {/* Stat 3: CEFR C1 */}
            <div className="flex items-center gap-3.5 sm:gap-4 pt-4 md:pt-0 md:pl-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-extrabold text-white">CEFR C1</div>
                <div className="text-xs text-slate-300 mt-0.5 font-medium">
                  Oliy toifali va xalqaro diplomli ustozlar jamoasi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
