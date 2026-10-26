'use client';

import React from 'react';
import { Volume2, ArrowRight, BookOpen } from 'lucide-react';

export default function ArticlesSection({
  articles = [],
  navigate,
  playArabicPronunciation,
  t = {}
}) {
  const leadArticle =
    articles.find((a) => a.slug === 'kundalik-hayotda-kerak-boladigan-10-ta-arabcha-soz') ||
    articles[0];
  const otherArticles = articles.filter((a) => a.slug !== leadArticle?.slug);

  if (!leadArticle) return null;

  const formatReadTime = (rt) => {
    if (!rt) return '';
    const num = String(rt).match(/\d+/)?.[0] || '4';
    if (t.locale === 'ru') return `${num} мин`;
    if (t.locale === 'en') return `${num} min`;
    return `${num} daqiqa`;
  };

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-[#073F31]/10">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 reveal-on-scroll">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
              {t.articles?.sectionBadge || 'Ilm va Foydali Maqolalar'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#14231F] mt-1">
              {t.articles?.title || 'Arab tilini o‘rganuvchilar uchun qo‘llanmalar'}
            </h2>
          </div>
          <button
            onClick={() => navigate('/maqolalar')}
            className="text-xs font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{t.articles?.readMore || 'Barcha maqolalar'} ({articles.length})</span>
            <ArrowRight className="w-4 h-4 motion-arrow" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Lead Article */}
          <div className="lg:col-span-7 bg-[#F8FAF8] rounded-2xl p-6 sm:p-8 border border-[#073F31]/15 flex flex-col justify-between reveal-on-scroll reveal-from-left motion-card">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full bg-gradient-to-r from-[#073F31] via-[#094F3E] to-[#073F31] text-white font-semibold text-[11px] border border-[#63E6BE]/35 shadow-2xs">
                  <div className="w-4 h-4 rounded-full bg-[#63E6BE]/20 flex items-center justify-center">
                    <BookOpen className="w-2.5 h-2.5 text-[#63E6BE]" />
                  </div>
                  {leadArticle.topic}
                </span>
                <span className="text-[#65756F]">{formatReadTime(leadArticle.readTime)}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#14231F]">
                {leadArticle.title}
              </h3>
              <p className="text-sm text-[#65756F] leading-relaxed">
                {leadArticle.excerpt}
              </p>

              <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
                {(leadArticle.items || []).slice(0, 4).map((word, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3.5 rounded-xl border border-[#073F31]/10 flex items-center justify-between shadow-2xs hover:border-[#07966F] transition"
                  >
                    <div className="space-y-0.5">
                      <div className="font-arabic text-xl font-bold text-[#073F31]" dir="rtl">
                        {word.ar || word.arabicText}
                      </div>
                      <div className="text-xs font-semibold text-[#14231F]">{word.tr || word.translit}</div>
                      <div className="text-[11px] text-[#65756F]">{word.uz || word.translation}</div>
                    </div>
                    <button
                      onClick={() =>
                        playArabicPronunciation?.(
                          word.ar || word.arabicText,
                          340,
                          word.tr || word.translit
                        )
                      }
                      className="p-2 rounded-lg bg-[#F8FAF8] hover:bg-[#07966F] hover:text-white text-[#073F31] cursor-pointer transition flex-shrink-0"
                      title="Tinglash"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-6 border-t border-[#073F31]/10 flex items-center justify-between">
              <span className="text-xs text-[#65756F]">{leadArticle.sourceNote}</span>
              <button
                onClick={() => navigate(`/maqolalar/${leadArticle.slug}`)}
                className="text-xs font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{t.articles?.readMore || 'Maqolani to‘liq o‘qish'}</span>
                <ArrowRight className="w-3.5 h-3.5 motion-arrow" />
              </button>
            </div>
          </div>

          {/* Stacked Secondary Articles */}
          <div className="lg:col-span-5 space-y-4">
            {otherArticles.map((art, idx) => (
              <div
                key={art.slug}
                className={`bg-white rounded-xl p-5 border border-[#073F31]/15 hover:border-[#07966F] transition shadow-2xs hover:translate-y-[-2px] duration-300 reveal-on-scroll reveal-from-right stagger-${idx + 1}`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#07966F]">{art.topic}</span>
                  <span className="text-[#65756F]">{formatReadTime(art.readTime)}</span>
                </div>
                <h3 className="text-base font-bold text-[#14231F]">{art.title}</h3>
                <p className="text-xs text-[#65756F] mt-1.5 line-clamp-2">{art.excerpt}</p>
                <button
                  onClick={() => navigate(`/maqolalar/${art.slug}`)}
                  className="mt-3 text-xs font-bold text-[#073F31] hover:text-[#07966F] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{t.articles?.readMore || 'Maqolani o‘qish'}</span>
                  <ArrowRight className="w-3.5 h-3.5 motion-arrow" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
