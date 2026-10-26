'use client';

import React from 'react';
import InteractivePlaygroundWidget from '@/components/home/InteractivePlaygroundWidget';

export default function InteractiveArabicPage({
  playgroundTab,
  setPlaygroundTab,
  selectedLetter,
  setSelectedLetter,
  audioPlaying,
  playArabicPronunciation,
  quizIndex,
  quizSelectedOption,
  quizResult,
  handleQuizOptionSelect,
  resetQuiz,
  kidsGameNumber,
  kidsGameScore,
  handleKidsGuess,
  t = {}
}) {
  return (
    <div className="py-12 lg:py-16 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-8">
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
          {t.playgroundPage?.badge || 'Interaktiv Ta’lim Laboratoriyasi'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#14231F] mt-1">
          {t.playgroundPage?.title || 'Arab tili harflari, maxraji va so‘z o‘yinlari maydonchasi'}
        </h1>
        <p className="text-sm sm:text-base text-[#65756F] mt-2">
          {t.playgroundPage?.subtitle ||
            'Harflarning yozuvdagi shakllarini ko‘ring, harakatlar bilan talaffuzini tinglang, viktorina savollariga javob bering va bolajonlar uchun raqamlar o‘yinini sinab ko‘ring.'}
        </p>
      </div>

      <InteractivePlaygroundWidget
        isCompact={false}
        playgroundTab={playgroundTab}
        setPlaygroundTab={setPlaygroundTab}
        selectedLetter={selectedLetter}
        setSelectedLetter={setSelectedLetter}
        audioPlaying={audioPlaying}
        playArabicPronunciation={playArabicPronunciation}
        quizIndex={quizIndex}
        quizSelectedOption={quizSelectedOption}
        quizResult={quizResult}
        handleQuizOptionSelect={handleQuizOptionSelect}
        resetQuiz={resetQuiz}
        kidsGameNumber={kidsGameNumber}
        kidsGameScore={kidsGameScore}
        handleKidsGuess={handleKidsGuess}
        t={t}
      />
    </div>
  );
}
