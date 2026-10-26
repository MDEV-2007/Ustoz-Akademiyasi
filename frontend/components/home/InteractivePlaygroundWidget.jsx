'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  GraduationCap,
  Volume2,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { OfficialBrandShield } from '@/components/ui/BrandShield';
import {
  ARABIC_PLAYGROUND_LETTERS,
  PLAYGROUND_QUIZ,
  KIDS_NUMBERS_DATA,
} from '@/lib/constants/academy-data';
import { useI18n } from '@/lib/i18n';

export default function InteractivePlaygroundWidget({
  isPreview = false,
  navigate,
  playArabicPronunciation,
  audioStatus = 'idle',
  audioMessage = '',
  setAudioMessage = () => {},
  t: propT,
}) {
  const { t: contextT, locale } = useI18n();
  const t = propT || contextT;

  const [playgroundTab, setPlaygroundTab] = useState('harflar');
  const [activeLetter, setActiveLetter] = useState(ARABIC_PLAYGROUND_LETTERS[0]);
  const [selectedHarakat, setSelectedHarakat] = useState('fatha');

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Kids Game state
  const [targetKidNumber, setTargetKidNumber] = useState(KIDS_NUMBERS_DATA[0]);
  const [kidGameScore, setKidGameScore] = useState(0);
  const [kidGameFeedback, setKidGameFeedback] = useState(null);

  const currentQuiz = PLAYGROUND_QUIZ[quizStep] || PLAYGROUND_QUIZ[0];

  // Multilingual dynamic helpers
  const letterName =
    activeLetter[`name${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz'}`] ||
    activeLetter.nameUz;
  const makhrajZone =
    activeLetter[`makhrajZone${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : ''}`] ||
    activeLetter.makhrajZone;
  const makhrajDesc =
    activeLetter[`makhrajDesc${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : ''}`] ||
    activeLetter.makhrajDesc;
  const exampleWordTrans =
    activeLetter[`example${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz'}`] ||
    activeLetter.exampleUz;

  const quizQuestion =
    currentQuiz[`question${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : ''}`] ||
    currentQuiz.question;
  const quizOptions =
    currentQuiz[`options${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : ''}`] ||
    currentQuiz.options;
  const quizFeedback =
    currentQuiz[`feedback${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : ''}`] ||
    currentQuiz.feedback;

  const targetLabel =
    targetKidNumber[`label${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz'}`] ||
    targetKidNumber.labelUz;

  const letterFormsLabel =
    locale === 'ru'
      ? '4 формы написания буквы (справа налево):'
      : locale === 'en'
      ? '4 Positional letter forms (right-to-left):'
      : 'Yozuvdagi 4 xil ko‘rinishi (o‘ngdan chapga):';

  const letterHeadingSuffix =
    locale === 'ru' ? 'буква' : locale === 'en' ? 'letter' : 'harfi';

  return (
    <div className="bg-white rounded-2xl border border-[#073F31]/15 shadow-sm overflow-hidden">
      {/* Top Mode Bar */}
      <div className="bg-[#073F31] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <OfficialBrandShield size={28} />
          <div>
            <div className="text-xs uppercase tracking-wider text-[#63E6BE] font-semibold">
              {t.playgroundExtra?.interactiveBadge || 'Interaktiv O‘quv Tajribasi'}
            </div>
            <div className="text-base font-bold text-white">
              {t.playgroundExtra?.interactiveTitle ||
                'Arab Harflari Maxraji, Viktorina va Raqamlar Mashqi'}
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap sm:flex-nowrap gap-1.5 w-full sm:w-auto"
          role="tablist"
          aria-label="Interaktiv mashq turlari"
        >
          {[
            {
              id: 'harflar',
              label: t.playground?.tabLetters || 'Harflar va Maxraj',
              icon: BookOpen,
            },
            {
              id: 'viktorina',
              label: t.playground?.tabQuiz || 'Viktorina',
              icon: Award,
            },
            {
              id: 'raqamlar',
              label: t.playground?.tabNumbers || 'Raqamlar O‘yini',
              icon: GraduationCap,
            },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={playgroundTab === tab.id}
                onClick={() => setPlaygroundTab(tab.id)}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  playgroundTab === tab.id
                    ? 'bg-[#63E6BE] text-[#14231F] font-bold shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Status Banner */}
      {audioMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`px-5 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
            audioStatus === 'fallback'
              ? 'bg-[#E8B84A]/15 text-[#14231F] border-[#E8B84A]/40'
              : 'bg-[#F8FAF8] text-[#073F31] border-[#073F31]/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#07966F] flex-shrink-0" />
            <span>{audioMessage}</span>
          </div>
          <button
            onClick={() => setAudioMessage('')}
            className="text-xs underline text-[#65756F] hover:text-[#14231F] ml-4 cursor-pointer"
          >
            {locale === 'ru' ? 'Закрыть' : locale === 'en' ? 'Close' : 'Yopish'}
          </button>
        </div>
      )}

      {/* TAB 1: HARFLAR VA MAXRAJ */}
      {playgroundTab === 'harflar' && (
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Right-to-Left Letter Selector Grid */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#65756F]">
                {t.playground?.selectLetterLabel || 'Harfni tanlang (O‘ngdan chapga — RTL):'}
              </span>
              <span className="text-xs text-[#07966F] font-semibold">
                {t.playground?.pronunciationNote || 'Talaffuz va maxraj bilan'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-2.5" dir="rtl">
              {ARABIC_PLAYGROUND_LETTERS.map((item) => {
                const selected = activeLetter.id === item.id;
                const iName =
                  item[`name${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz'}`] ||
                  item.nameUz;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveLetter(item);
                      playArabicPronunciation?.(item.glyph, item.freq, `${iName}`);
                    }}
                    className={`p-2 sm:p-3 rounded-xl border text-center transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#07966F] min-h-[56px] flex flex-col items-center justify-center ${
                      selected
                        ? 'bg-[#073F31] text-white border-[#073F31] shadow-sm'
                        : 'bg-[#F8FAF8] hover:bg-white text-[#14231F] border-[#073F31]/15'
                    }`}
                  >
                    <div className="font-arabic text-2xl sm:text-3xl font-bold leading-none mb-1">
                      {item.glyph}
                    </div>
                    <div
                      dir="ltr"
                      className={`text-[10px] sm:text-[11px] font-semibold ${
                        selected ? 'text-[#63E6BE]' : 'text-[#65756F]'
                      }`}
                    >
                      {iName}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Harakat Selector */}
            <div className="mt-5 p-4 rounded-xl bg-[#F8FAF8] border border-[#073F31]/10">
              <div className="text-xs font-semibold text-[#14231F] mb-2.5">
                {t.playground?.harakatTitle || 'Harakatlar (Unli belgilar) bilan o‘qilishi:'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'fatha', label: 'Fatha (ـَ)', val: activeLetter.harakat.fatha },
                  { key: 'kasra', label: 'Kasra (ـِ)', val: activeLetter.harakat.kasra },
                  { key: 'damma', label: 'Damma (ـُ)', val: activeLetter.harakat.damma },
                ].map((h) => (
                  <button
                    key={h.key}
                    onClick={() => {
                      setSelectedHarakat(h.key);
                      playArabicPronunciation?.(h.val.split(' ')[0], activeLetter.freq + 25, h.val);
                    }}
                    className={`p-2.5 rounded-lg border text-center cursor-pointer transition ${
                      selectedHarakat === h.key
                        ? 'bg-white border-[#07966F] text-[#073F31] font-bold shadow-xs'
                        : 'bg-transparent border-[#073F31]/15 text-[#65756F] hover:bg-white'
                    }`}
                  >
                    <div className="text-[11px] text-[#65756F]">{h.label}</div>
                    <div className="font-arabic text-lg font-bold text-[#14231F] mt-0.5">
                      {h.val}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Letter Details & Positional Forms */}
          <div className="lg:col-span-6 bg-[#F8FAF8] rounded-xl p-5 sm:p-6 border border-[#073F31]/15 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#073F31]/10 pb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#07966F]/15 text-[#073F31] text-xs font-semibold">
                  {t.playground?.makhrajZoneLabel || 'Maxraj nuqtasi:'} {makhrajZone}
                </span>
                <h3 className="text-2xl font-bold text-[#14231F] mt-1.5">
                  «{letterName}» {letterHeadingSuffix} — [{activeLetter.translit}]
                </h3>
              </div>
              <div
                dir="rtl"
                className="w-16 h-16 rounded-xl bg-[#073F31] text-[#63E6BE] flex items-center justify-center font-arabic text-4xl font-bold flex-shrink-0"
              >
                {activeLetter.glyph}
              </div>
            </div>

            {/* 4 Positional Forms in Arabic writing */}
            <div>
              <div className="text-xs font-semibold text-[#65756F] mb-2">
                {letterFormsLabel}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center" dir="rtl">
                <div className="bg-white p-2.5 rounded-lg border border-[#073F31]/10">
                  <div className="font-arabic text-2xl font-bold text-[#073F31]">
                    {activeLetter.forms.isolated}
                  </div>
                  <div className="text-[10px] text-[#65756F] mt-1" dir="ltr">
                    {t.playground?.isolated || 'Alohida'}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#073F31]/10">
                  <div className="font-arabic text-2xl font-bold text-[#073F31]">
                    {activeLetter.forms.initial}
                  </div>
                  <div className="text-[10px] text-[#65756F] mt-1" dir="ltr">
                    {t.playground?.initial || 'So‘z boshida'}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#073F31]/10">
                  <div className="font-arabic text-2xl font-bold text-[#073F31]">
                    {activeLetter.forms.medial}
                  </div>
                  <div className="text-[10px] text-[#65756F] mt-1" dir="ltr">
                    {t.playground?.medial || 'So‘z o‘rtasida'}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#073F31]/10">
                  <div className="font-arabic text-2xl font-bold text-[#073F31]">
                    {activeLetter.forms.final}
                  </div>
                  <div className="text-[10px] text-[#65756F] mt-1" dir="ltr">
                    {t.playground?.final || 'So‘z oxirida'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-[#073F31]/10">
              <div className="text-xs font-bold text-[#073F31] uppercase tracking-wider">
                {t.playground?.makhrajDescLabel || 'Talaffuz qoidasi (Maxraj):'}
              </div>
              <p className="text-sm text-[#14231F] mt-1 leading-relaxed">
                {makhrajDesc}
              </p>
            </div>

            {/* Example Word Card */}
            <div className="p-4 rounded-xl bg-[#073F31] text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#63E6BE] font-semibold">
                  {t.playground?.exampleLabel || 'Namunaviy so‘z:'}
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-arabic text-3xl font-bold text-white" dir="rtl">
                    {activeLetter.exampleAr}
                  </span>
                  <span className="text-sm text-white/90 font-medium">
                    ({activeLetter.exampleTr}) — <strong>{exampleWordTrans}</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  playArabicPronunciation?.(
                    activeLetter.exampleAr,
                    activeLetter.freq,
                    exampleWordTrans
                  )
                }
                className="px-4 py-2.5 rounded-lg bg-[#63E6BE] hover:bg-[#63E6BE]/90 text-[#14231F] font-bold text-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.playground?.listenWord || 'So‘zni eshitish'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BILIMDONLAR VIKTORINASI */}
      {playgroundTab === 'viktorina' && (
        <div className="p-5 sm:p-8 max-w-3xl mx-auto">
          {!quizCompleted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#073F31]/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
                  {t.playground?.quizQuestion || 'Savol'} {quizStep + 1} / {PLAYGROUND_QUIZ.length}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F8FAF8] border border-[#073F31]/15 text-[#14231F]">
                  {t.playground?.scoreLabel || 'To‘g‘ri javoblar:'} {quizScore}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#F8FAF8] p-5 rounded-xl border border-[#073F31]/15">
                <button
                  onClick={() =>
                    playArabicPronunciation?.(currentQuiz.arabicPrompt, 340, 'Quiz question')
                  }
                  className="w-24 h-24 rounded-xl bg-[#073F31] text-[#63E6BE] flex flex-col items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#07966F] hover:text-white transition"
                  title={t.playground?.listen || 'Tinglash'}
                >
                  <span className="font-arabic text-3xl font-bold" dir="rtl">
                    {currentQuiz.arabicPrompt}
                  </span>
                  <span className="text-[10px] text-white/80 mt-1 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> {t.playground?.listen || 'Tinglash'}
                  </span>
                </button>
                <h3 className="text-base sm:text-lg font-bold text-[#14231F] leading-snug">
                  {quizQuestion}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {quizOptions.map((opt, idx) => {
                  const isCorrect = idx === currentQuiz.correctIndex;
                  const isPicked = quizSelected === idx;

                  let cardClass =
                    'bg-white hover:bg-[#F8FAF8] border-[#073F31]/20 text-[#14231F]';
                  if (quizSelected !== null) {
                    if (isCorrect) {
                      cardClass = 'bg-[#07966F] text-white border-[#07966F] font-bold';
                    } else if (isPicked) {
                      cardClass = 'bg-red-50 text-red-900 border-red-300';
                    } else {
                      cardClass = 'bg-[#F8FAF8] text-[#65756F] border-[#073F31]/10 opacity-75';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (quizSelected !== null) return;
                        setQuizSelected(idx);
                        if (isCorrect) setQuizScore((s) => s + 1);
                      }}
                      className={`p-4 rounded-xl border text-left text-sm font-medium transition cursor-pointer flex items-center justify-between ${cardClass}`}
                    >
                      <span>{opt}</span>
                      {quizSelected !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSelected !== null && (
                <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#07966F]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-[#14231F]">{quizFeedback}</p>
                  <button
                    onClick={() => {
                      if (quizStep + 1 < PLAYGROUND_QUIZ.length) {
                        setQuizStep((s) => s + 1);
                        setQuizSelected(null);
                      } else {
                        setQuizCompleted(true);
                      }
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#073F31] hover:bg-[#07966F] text-white font-semibold text-xs flex-shrink-0 cursor-pointer transition"
                  >
                    {quizStep + 1 < PLAYGROUND_QUIZ.length
                      ? (t.playground?.nextQuestion || 'Keyingi savol →')
                      : (t.playground?.finishQuiz || 'Yakuniy natija →')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#07966F]/15 text-[#073F31] flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#14231F]">
                {t.playground?.quizCompleted || 'Viktorina yakunlandi:'} {quizScore} / {PLAYGROUND_QUIZ.length}
              </h3>
              <p className="text-sm text-[#65756F] max-w-md mx-auto">
                {t.playground?.quizCompletedDesc ||
                  'Arab tili harflari va so‘zlarini ustoz yordamida chuqurroq o‘rganish uchun bepul sinov darsimizga taklif etamiz.'}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() =>
                    navigate?.('/royxatdan-otish', { courseSlug: 'professional-fonetika' })
                  }
                  className="px-5 py-2.5 rounded-lg bg-[#073F31] text-white font-semibold text-xs cursor-pointer hover:bg-[#07966F] transition"
                >
                  {t.hero?.primaryCta || 'Bepul sinov darsiga yozilish'}
                </button>
                <button
                  onClick={() => {
                    setQuizStep(0);
                    setQuizScore(0);
                    setQuizSelected(null);
                    setQuizCompleted(false);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-[#073F31]/20 text-[#14231F] font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {t.playground?.restartQuiz || 'Qayta boshlash'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOLAJONLAR BILAN RAQAMLARNI TOPISH O'YINI */}
      {playgroundTab === 'raqamlar' && (
        <div className="p-5 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F8FAF8] p-4 rounded-xl border border-[#073F31]/15">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
                {t.playground?.kidsBadge || 'Hilol Kids 4+ mashg‘uloti asosida'}
              </div>
              <div className="text-base sm:text-lg font-bold text-[#14231F] mt-0.5">
                {locale === 'ru'
                  ? `Задание: найдите арабскую цифру к числу «${targetLabel}» (${targetKidNumber.numLatin})!`
                  : locale === 'en'
                  ? `Task: find the Arabic numeral for «${targetLabel}» (${targetKidNumber.numLatin})!`
                  : `Topshiriq: «${targetLabel}» (${targetKidNumber.numLatin}) soniga mos arab raqamini toping!`}
              </div>
              <div className="text-xs text-[#65756F]">
                {t.playground?.kidsPronunciation || 'Arabcha aytilishi:'}{' '}
                <strong>{targetKidNumber.readUz}</strong> ({targetKidNumber.wordAr})
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  playArabicPronunciation?.(
                    targetKidNumber.wordAr,
                    350,
                    `${targetLabel} - ${targetKidNumber.readUz}`
                  )
                }
                className="px-3.5 py-2 rounded-lg bg-[#073F31] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-[#07966F] transition"
              >
                <Volume2 className="w-4 h-4 text-[#63E6BE]" />
                {t.playground?.playPronunciation || 'Talaffuzni eshitish'}
              </button>
              <div className="px-3.5 py-2 rounded-lg bg-white border border-[#073F31]/15 text-xs font-bold text-[#073F31]">
                {t.playground?.scoreLabel || 'Ball:'} {kidGameScore}
              </div>
            </div>
          </div>

          {kidGameFeedback && (
            <div
              className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                kidGameFeedback.ok
                  ? 'bg-[#07966F]/15 text-[#073F31] border border-[#07966F]/30'
                  : 'bg-amber-50 text-amber-900 border border-amber-300'
              }`}
            >
              <span>{kidGameFeedback.text}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {KIDS_NUMBERS_DATA.map((item) => {
              const itemLabel =
                item[`label${locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz'}`] ||
                item.labelUz;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playArabicPronunciation?.(item.wordAr, 320, item.readUz);
                    if (item.id === targetKidNumber.id) {
                      setKidGameScore((s) => s + 1);

                      let okText = `Barakalla! ${item.arNum} — ${item.readUz} (${item.numLatin} - ${itemLabel}). Endi keyingi raqamni toping!`;
                      if (locale === 'ru') {
                        okText = `Молодец! ${item.arNum} — ${item.readUz} (${item.numLatin} - ${itemLabel}). Теперь найдите следующую цифру!`;
                      } else if (locale === 'en') {
                        okText = `Well done! ${item.arNum} — ${item.readUz} (${item.numLatin} - ${itemLabel}). Now find the next number!`;
                      }

                      setKidGameFeedback({
                        ok: true,
                        text: okText,
                      });
                      const others = KIDS_NUMBERS_DATA.filter((x) => x.id !== item.id);
                      const nextRand = others[Math.floor(Math.random() * others.length)];
                      setTargetKidNumber(nextRand);
                    } else {
                      let errText = `Bu «${item.arNum}» (${item.numLatin} - ${itemLabel}) raqami. Biz esa «${targetLabel}» (${targetKidNumber.numLatin}) raqamini qidiryapmiz.`;
                      if (locale === 'ru') {
                        errText = `Это цифра «${item.arNum}» (${item.numLatin} - ${itemLabel}). Мы ищем «${targetLabel}» (${targetKidNumber.numLatin}).`;
                      } else if (locale === 'en') {
                        errText = `This is «${item.arNum}» (${item.numLatin} - ${itemLabel}). We are looking for «${targetLabel}» (${targetKidNumber.numLatin}).`;
                      }

                      setKidGameFeedback({
                        ok: false,
                        text: errText,
                      });
                    }
                  }}
                  className="p-4 rounded-xl bg-white hover:bg-[#F8FAF8] border border-[#073F31]/15 hover:border-[#07966F] transition text-center cursor-pointer group"
                >
                  <div className="font-arabic text-4xl font-bold text-[#073F31] group-hover:text-[#07966F]">
                    {item.arNum}
                  </div>
                  <div className="font-arabic text-sm text-[#65756F] mt-1" dir="rtl">
                    {item.wordAr}
                  </div>
                  <div className="text-xs font-semibold text-[#14231F] mt-1">
                    {item.readUz} ({itemLabel})
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer link if rendered as homepage preview */}
      {isPreview && (
        <div className="bg-[#F8FAF8] px-5 py-3.5 border-t border-[#073F31]/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#65756F]">
            {locale === 'ru'
              ? 'На полной странице доступны все интерактивные упражнения.'
              : locale === 'en'
              ? 'All interactive exercises and sound drills are available on the full page.'
              : 'To‘liq sahifada barcha mashqlar va klaviatura boshqaruvi mavjud.'}
          </span>
          <button
            onClick={() => navigate?.('/interaktiv-arab-tili')}
            className="text-xs font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-1 cursor-pointer"
          >
            <span>
              {locale === 'ru'
                ? 'Открыть интерактивную площадку полностью'
                : locale === 'en'
                ? 'Open full interactive learning lab'
                : 'Interaktiv o‘quv maydonchasini to‘liq ochish'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
