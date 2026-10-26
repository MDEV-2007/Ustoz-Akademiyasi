'use client';

import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import TrustMetricsSection from '@/components/home/TrustMetricsSection';
import CourseDiscoverySection from '@/components/home/CourseDiscoverySection';
import InteractivePlaygroundWidget from '@/components/home/InteractivePlaygroundWidget';
import TeachersSection from '@/components/home/TeachersSection';
import BranchesSection from '@/components/home/BranchesSection';
import GraduatesSection from '@/components/graduates/GraduatesSection';
import ArticlesSection from '@/components/home/ArticlesSection';
import FAQSection from '@/components/home/FAQSection';
import FinalCTASection from '@/components/home/FinalCTASection';

export default function HomePage({
  brandConfig,
  courses,
  branches,
  teachers,
  departments,
  articles,
  graduates,
  kidsGraduates,
  faqItems,
  navigate,
  courseFilter,
  setCourseFilter,
  visibleCourses,
  customPhotos,
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
  regForm,
  regErrors = {},
  handleRegChange,
  handleRegistrationSubmit,
  submitStatus,
  apiDiagnostic,
  t = {}
}) {
  return (
    <div className="space-y-0">
      {/* A. HERO SECTION */}
      <HeroSection
        brandConfig={brandConfig}
        navigate={navigate}
        customPhotos={customPhotos}
        t={t}
      />

      {/* D. VERIFIED TRUST & SOCIAL PROOF */}
      <TrustMetricsSection
        brandConfig={brandConfig}
        t={t}
      />

      {/* E. COURSE DISCOVERY */}
      <CourseDiscoverySection
        courses={courses}
        visibleCourses={visibleCourses}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        customPhotos={customPhotos}
        navigate={navigate}
        t={t}
      />

      {/* F. LEARNING EXPERIENCE PREVIEW */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#073F31]/10">
        <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="max-w-3xl mb-8 reveal-on-scroll">
            <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
              {t.playground?.sectionBadge || 'Amaliy sinov maydonchasi'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#14231F] mt-1">
              {t.playground?.title || 'Arab harflari maxraji va so‘zlarini hoziroq sinab ko‘ring'}
            </h2>
            <p className="text-sm sm:text-base text-[#65756F] mt-2">
              {t.playground?.subtitle ||
                'Quyidagi interaktiv modul orqali arab harflarining yozuvdagi shakllarini, talaffuz qoidalarini va bolajonlar uchun raqam topish mashqini bevosita brauzeringizda bajaring.'}
            </p>
          </div>

          <div className="reveal-on-scroll stagger-1">
            <InteractivePlaygroundWidget
              isCompact={true}
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
        </div>
      </section>

      {/* G. TEACHING TEAM & ACADEMIC METHODOLOGY */}
      <TeachersSection
        teachers={teachers}
        departments={departments}
        navigate={navigate}
        t={t}
      />

      {/* H. 8 BRANCHES DIRECTORY PREVIEW */}
      <BranchesSection
        branches={branches}
        navigate={navigate}
        t={t}
      />

      {/* I. GRADUATE OUTCOMES & VERIFIED RESULTS */}
      <GraduatesSection
        graduates={graduates}
        kidsGraduates={kidsGraduates}
        navigate={navigate}
        t={t}
      />

      {/* J. EDITORIAL CONTENT */}
      <ArticlesSection
        articles={articles}
        navigate={navigate}
        playArabicPronunciation={playArabicPronunciation}
        t={t}
      />

      {/* K. ACCESSIBLE FAQ ACCORDION */}
      <FAQSection
        faqItems={faqItems}
        t={t}
      />

      {/* L. FINAL CONVERSION SECTION */}
      <FinalCTASection
        brandConfig={brandConfig}
        courses={courses}
        branches={branches}
        regForm={regForm}
        regErrors={regErrors}
        handleRegChange={handleRegChange}
        handleRegistrationSubmit={handleRegistrationSubmit}
        submitStatus={submitStatus}
        apiDiagnostic={apiDiagnostic}
        t={t}
      />
    </div>
  );
}
