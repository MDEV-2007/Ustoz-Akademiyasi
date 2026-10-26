'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  Send,
  BookOpen,
  Sparkles,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Compass,
  Award
} from 'lucide-react';

function TopicBadge({ topic = '', className = '' }) {
  const t = (topic || '').toLowerCase();
  
  let Icon = BookOpen;
  if (t.includes('metod') || t.includes('tavsiya')) {
    Icon = Compass;
  } else if (t.includes('kasb') || t.includes('kelajak')) {
    Icon = GraduationCap;
  } else if (t.includes('kid') || t.includes('bola')) {
    Icon = Award;
  } else if (t.includes("lug'at") || t.includes('so‘z') || t.includes('soz') || t.includes('ibora')) {
    Icon = BookOpen;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1 rounded-full bg-gradient-to-r from-[#073F31] via-[#094F3E] to-[#073F31] text-white text-xs font-semibold tracking-wide border border-[#63E6BE]/35 shadow-[0_2px_10px_rgba(7,63,49,0.25)] ring-1 ring-white/10 ${className}`}
    >
      <div className="w-5 h-5 rounded-full bg-[#63E6BE]/20 border border-[#63E6BE]/35 flex items-center justify-center flex-shrink-0 shadow-inner">
        <Icon className="w-3 h-3 text-[#63E6BE]" />
      </div>
      <span className="font-semibold text-white/95 text-[12px]">{topic}</span>
    </div>
  );
}

export default function ArticlesPage({
  path,
  articles = [],
  courses = [],
  navigate,
  playArabicPronunciation,
  t = {}
}) {
  const [articleTopicFilter, setArticleTopicFilter] = useState('Barchasi');
  const [activeAudioIdx, setActiveAudioIdx] = useState(null);
  const [copied, setCopied] = useState(false);

  // Format read time without duplicate strings
  const formatReadTime = (rt) => {
    if (!rt) return '4 daqiqa mutolaa';
    const num = String(rt).match(/\d+/)?.[0] || '4';
    if (t.locale === 'ru') return `${num} мин чтения`;
    if (t.locale === 'en') return `${num} min read`;
    return `${num} daqiqa mutolaa`;
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePlayAudio = (arabicText, translit, idx) => {
    setActiveAudioIdx(idx);
    playArabicPronunciation?.(arabicText, 330, translit);
    setTimeout(() => {
      setActiveAudioIdx((curr) => (curr === idx ? null : curr));
    }, 2200);
  };

  // ==========================================
  // ROUTE: INDIVIDUAL ARTICLE (/maqolalar/:slug)
  // ==========================================
  if (path.startsWith('/maqolalar/')) {
    const slug = path.replace('/maqolalar/', '');
    const article = articles.find((a) => a.slug === slug) || articles[0];
    const relatedCourse = (courses || []).find((c) => c.slug === article?.relatedCourseSlug);
    const otherArticles = (articles || []).filter((a) => a.slug !== article?.slug).slice(0, 3);

    return (
      <div className="py-8 sm:py-12 lg:py-16 bg-[#F8FAF8] text-[#14231F]">
        <div className="max-w-[1360px] 2xl:max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          
          {/* Top Bar: Back Link + Share Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#073F31]/10">
            <button
              onClick={() => navigate('/maqolalar')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#073F31] hover:text-[#07966F] bg-white px-3.5 py-2 rounded-xl border border-[#073F31]/15 hover:border-[#07966F] transition-all cursor-pointer shadow-2xs group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{t.articles?.backToList || 'Barcha maqolalarga qaytish'}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-[#073F31]/15 text-[#14231F] hover:bg-[#F8FAF8] hover:border-[#07966F] transition cursor-pointer shadow-2xs"
                title="Havolani nusxalash"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#07966F]" />
                    <span className="text-[#07966F]">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#65756F]" />
                    <span>Ulashish</span>
                  </>
                )}
              </button>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article?.title || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/25 transition cursor-pointer"
                title="Telegramda ulashish"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Telegram</span>
              </a>
            </div>
          </div>

          {/* Article Editorial Hero Header */}
          <header className="mb-10 lg:mb-12 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
              <TopicBadge topic={article.topic} />

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#073F31]/15 text-[#65756F] font-medium shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#07966F]" />
                {formatReadTime(article.readTime)}
              </span>

              {article.sourceNote && (
                <a
                  href="https://t.me/ustozakademiyasi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07966F]/10 hover:bg-[#07966F]/20 text-[#073F31] font-medium transition"
                >
                  <Send className="w-3 h-3 text-[#07966F]" />
                  <span>{article.sourceNote}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#14231F] leading-[1.25] tracking-tight">
              {article.title}
            </h1>

            {article.intro && (
              <div className="bg-gradient-to-r from-[#073F31]/[0.05] via-white to-emerald-50/40 border-l-4 border-[#07966F] p-5 sm:p-6 rounded-r-2xl shadow-2xs mt-4">
                <p className="text-base sm:text-lg text-[#2C3E38] leading-relaxed">
                  {article.intro}
                </p>
              </div>
            )}
          </header>

          {/* Main 2-Column Layout */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Main Column: The Article Content Cards */}
            <main className="lg:col-span-8 space-y-6">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#073F31]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
                  Tavsiyalar va O‘quv Bloklari ({article.items?.length || 0})
                </span>
                <span className="text-xs text-[#65756F]">
                  Talaffuzni eshitish uchun dinamik tugmasini bosing
                </span>
              </div>

              {/* Items / Sirlar list */}
              <div className="space-y-5">
                {(article.items || []).map((item, idx) => {
                  const isPlaying = activeAudioIdx === idx;
                  const itemNumber = String(idx + 1).padStart(2, '0');

                  return (
                    <article
                      key={idx}
                      id={`sir-${idx + 1}`}
                      className="bg-white rounded-2xl p-6 sm:p-7 border border-[#073F31]/15 shadow-2xs hover:shadow-md hover:border-[#07966F] transition-all duration-200 relative group overflow-hidden"
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3.5">
                          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#073F31] text-[#63E6BE] font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                            {itemNumber}
                          </span>
                          <div>
                            <h2 className="text-base sm:text-lg font-bold text-[#14231F] leading-snug">
                              {item.tr || item.translit}
                            </h2>
                            <span className="text-[11px] font-semibold text-[#07966F] uppercase tracking-wider">
                              Ustoz Akademiyasi Metodikasi
                            </span>
                          </div>
                        </div>

                        {/* Interactive Audio Button */}
                        <button
                          onClick={() =>
                            handlePlayAudio(
                              item.ar || item.arabicText,
                              item.tr || item.translit,
                              idx
                            )
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex-shrink-0 border ${
                            isPlaying
                              ? 'bg-[#073F31] text-[#63E6BE] border-[#073F31] shadow-md scale-105'
                              : 'bg-[#F8FAF8] hover:bg-[#073F31] hover:text-white text-[#073F31] border-[#073F31]/15'
                          }`}
                          title={t.playground?.playPronunciation || 'Talaffuzni tinglash'}
                        >
                          <Volume2
                            className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-[#63E6BE]' : ''}`}
                          />
                          <span className="hidden sm:inline">
                            {isPlaying ? 'Tinglanmoqda...' : 'Tinglash'}
                          </span>
                        </button>
                      </div>

                      {/* Arabic Calligraphy Banner */}
                      <div className="bg-gradient-to-r from-[#073F31]/[0.04] via-emerald-50/30 to-[#07966F]/[0.04] border border-[#073F31]/10 rounded-xl p-4 sm:p-5 mb-4 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#65756F]">
                          Arabcha yozilishi:
                        </span>
                        <div
                          className="font-arabic text-2xl sm:text-3xl font-bold text-[#073F31] tracking-wide select-all"
                          dir="rtl"
                          style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                        >
                          {item.ar || item.arabicText}
                        </div>
                      </div>

                      {/* Explanation Text */}
                      <div className="pt-1">
                        <p className="text-sm sm:text-base text-[#3A4D46] leading-relaxed">
                          {item.uz || item.translation}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* High-conversion Masterclass CTA Card */}
              <div className="bg-gradient-to-br from-[#073F31] via-[#094F3E] to-[#04281F] text-white rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden border border-[#07966F]/30 mt-10">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#63E6BE]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1 rounded-full bg-gradient-to-r from-[#63E6BE]/25 via-[#63E6BE]/15 to-[#63E6BE]/5 text-[#63E6BE] text-xs font-bold uppercase tracking-wider border border-[#63E6BE]/40 shadow-[0_0_15px_rgba(99,230,190,0.2)] backdrop-blur-md">
                    <div className="w-5 h-5 rounded-full bg-[#63E6BE] text-[#073F31] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <GraduationCap className="w-3 h-3" />
                    </div>
                    <span className="tracking-widest font-extrabold text-[11px] text-[#63E6BE]">
                      {t.trialRegistration?.badge || 'Qabul Bo‘limi'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                    Arab tilini malakali ustozlar bilan tizimli o‘rganing
                  </h3>

                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
                    Mustaqil o‘qish muhim, ammo ustoz nazoratisiz talaffuz va grammatika xatolari sezilmay qoladi.
                    Birinchi bepul sinov darsimizda o‘z darajangizni aniqlang va to‘g‘ri poydevor quring!
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs text-emerald-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#63E6BE]" />
                      <span>100% Bepul sinov darsi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#63E6BE]" />
                      <span>Erkaklar & ayollar alohida</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#63E6BE]" />
                      <span>Toshkentda 8 ta filial</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        navigate('/royxatdan-otish', {
                          courseSlug: article.relatedCourseSlug || 'professional-fonetika'
                        })
                      }
                      className="px-6 py-3.5 rounded-xl bg-[#63E6BE] hover:bg-[#4edaa8] text-[#073F31] font-bold text-sm text-center transition cursor-pointer shadow-md hover:shadow-lg"
                    >
                      {t.hero?.primaryCta || 'Bepul sinov darsiga yozilish →'}
                    </button>

                    <button
                      onClick={() => navigate('/kurslar')}
                      className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm text-center border border-white/20 transition cursor-pointer"
                    >
                      Barcha kurslarni ko‘rish
                    </button>
                  </div>
                </div>
              </div>

            </main>

            {/* Right Sticky Sidebar (col-span-4) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* Quick Navigation / Mundarija */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#073F31]/15 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#07966F]">
                  <BookOpen className="w-4 h-4" />
                  <span>Maqola Mundarijasi</span>
                </div>

                <nav className="space-y-1.5">
                  {(article.items || []).map((item, idx) => (
                    <a
                      key={idx}
                      href={`#sir-${idx + 1}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-[#14231F] hover:bg-[#F8FAF8] hover:text-[#07966F] transition"
                    >
                      <span className="w-5 h-5 rounded bg-[#073F31]/10 text-[#073F31] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{item.tr || item.translit}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Related Course Card */}
              {relatedCourse && (
                <div className="bg-gradient-to-br from-[#073F31]/[0.03] to-[#07966F]/[0.08] rounded-2xl p-5 sm:p-6 border border-[#07966F]/30 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#07966F]">
                    <GraduationCap className="w-4 h-4" />
                    <span>Tavsiya Etiladigan Kurs</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#073F31] text-white">
                      {relatedCourse.level || 'Boshlang‘ich'}
                    </span>
                    <h4 className="text-base font-bold text-[#14231F] mt-2">
                      {relatedCourse.title}
                    </h4>
                    <p className="text-xs text-[#65756F] mt-1 line-clamp-2">
                      {relatedCourse.tagline || relatedCourse.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#073F31]/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-[#65756F] block">Davomiyligi:</span>
                      <span className="font-bold text-[#14231F]">{relatedCourse.duration}</span>
                    </div>
                    <button
                      onClick={() =>
                        navigate('/royxatdan-otish', { courseSlug: relatedCourse.slug })
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#073F31] hover:bg-[#07966F] text-white font-bold text-xs transition cursor-pointer"
                    >
                      Yozilish →
                    </button>
                  </div>
                </div>
              )}

              {/* Telegram Community Card */}
              <div className="bg-[#0088cc]/[0.06] rounded-2xl p-5 border border-[#0088cc]/20 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0088cc] text-white flex items-center justify-center flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#14231F]">
                      Rasmiy Telegram Kanal
                    </h4>
                    <span className="text-[11px] text-[#0088cc] font-medium">
                      @ustozakademiyasi
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#65756F] leading-relaxed">
                  Har kuni yangi dars audiolari, lug‘atlar va maxsus metodik qo‘llanmalar e’lon qilinadi.
                </p>
                <a
                  href="https://t.me/ustozakademiyasi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs transition shadow-2xs"
                >
                  <span>Kanalga A‘zo Bo‘lish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Other Useful Articles */}
              {otherArticles.length > 0 && (
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#073F31]/15 shadow-2xs space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#07966F] block">
                    Boshqa Foydali Maqolalar
                  </span>

                  <div className="space-y-3">
                    {otherArticles.map((art) => (
                      <div
                        key={art.slug}
                        onClick={() => navigate(`/maqolalar/${art.slug}`)}
                        className="p-3 rounded-xl hover:bg-[#F8FAF8] border border-transparent hover:border-[#073F31]/10 transition cursor-pointer group"
                      >
                        <span className="text-[11px] font-semibold text-[#07966F] block">
                          {art.topic}
                        </span>
                        <h5 className="text-xs font-bold text-[#14231F] group-hover:text-[#07966F] transition line-clamp-2 mt-0.5">
                          {art.title}
                        </h5>
                        <span className="text-[11px] text-[#65756F] mt-1 block">
                          {formatReadTime(art.readTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </aside>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ROUTE: ARTICLES LISTING (/maqolalar)
  // ==========================================
  const allLabel = t.courses?.filterAll || 'Barchasi';
  const topics = [allLabel, ...new Set(articles.map((a) => a.topic))];
  const list =
    articleTopicFilter === 'Barchasi' || articleTopicFilter === allLabel
      ? articles
      : articles.filter((a) => a.topic === articleTopicFilter);

  return (
    <div className="py-10 lg:py-16 bg-[#F8FAF8] text-[#14231F]">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-10">
        
        {/* Header with Title and Topic Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#073F31]/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#073F31]/10 text-[#073F31] text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#07966F]" />
              {t.articles?.sectionBadge || 'O‘quv Maqolalari va Lug‘at'}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14231F] tracking-tight">
              {t.articles?.title || 'Arab tilini o‘rganuvchilar uchun foydali maqolalar'}
            </h1>
            <p className="text-sm sm:text-base text-[#65756F] mt-2 max-w-2xl">
              Ustoz Akademiyasi ustozlari va metodistlari tomonidan tayyorlangan maxsus qo‘llanmalar, tavsiyalar va audio lug‘atlar to‘plami.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {topics.map((itemTopic) => {
              const isActive =
                articleTopicFilter === itemTopic ||
                ((itemTopic === allLabel || itemTopic === 'Barchasi') &&
                  (articleTopicFilter === 'Barchasi' || articleTopicFilter === allLabel));

              return (
                <button
                  key={itemTopic}
                  onClick={() => setArticleTopicFilter(itemTopic)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shadow-2xs ${
                    isActive
                      ? 'bg-[#073F31] text-white shadow-sm'
                      : 'bg-white text-[#14231F] border border-[#073F31]/15 hover:border-[#07966F]'
                  }`}
                >
                  {itemTopic}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {list.map((art) => (
            <article
              key={art.slug}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#073F31]/15 hover:border-[#07966F] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <TopicBadge topic={art.topic} />
                  <span className="flex items-center gap-1 text-[#65756F] font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#07966F]" />
                    {formatReadTime(art.readTime)}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#14231F] group-hover:text-[#07966F] transition-colors leading-snug">
                  {art.title}
                </h2>

                <p className="text-sm text-[#65756F] leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>

                {/* Preview count */}
                {art.items && art.items.length > 0 && (
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-[#07966F] font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{art.items.length} ta o‘quv tavsiyasi & audio</span>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-6 border-t border-[#073F31]/10 flex items-center justify-between">
                <span className="text-[11px] text-[#65756F] truncate max-w-[180px]">
                  {art.sourceNote || 'Ustoz Akademiyasi'}
                </span>
                <button
                  onClick={() => navigate(`/maqolalar/${art.slug}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#073F31] group-hover:text-[#07966F] cursor-pointer transition"
                >
                  <span>{t.articles?.readMore || 'To‘liq o‘qish'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
