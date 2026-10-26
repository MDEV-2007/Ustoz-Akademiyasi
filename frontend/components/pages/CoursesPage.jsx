'use client';

import React from 'react';
import { ArrowRight, Check, MapPin, Play } from 'lucide-react';
import AuthenticVisualPlate from '@/components/ui/AuthenticVisualPlate';
import LeadRegistrationForm from '@/components/registration/LeadRegistrationForm';
import KidsVideoGallery from '@/components/courses/KidsVideoGallery';

export default function CoursesPage({
  path,
  courses = [],
  branches = [],
  customPhotos = {},
  brandConfig = {},
  navigate,
  regForm,
  regErrors = {},
  handleRegChange,
  handleRegistrationSubmit,
  submitStatus = 'idle',
  apiDiagnostic,
  t = {}
}) {
  // ROUTE 3: INDIVIDUAL COURSE DETAILS (/kurslar/:slug)
  if (path.startsWith('/kurslar/')) {
    const slug = path.replace('/kurslar/', '');
    const course = courses.find((c) => c.slug === slug) || courses[0];

    // CONVERSION-FOCUSED FLOW FOR HILOL KIDS 4+
    if (slug === 'hilol-kids') {
      const scrollToRegistration = () => {
        document.getElementById('royxatdan-otish')?.scrollIntoView({ behavior: 'smooth' });
      };
      const scrollToVideos = () => {
        document.getElementById('videolar')?.scrollIntoView({ behavior: 'smooth' });
      };

      return (
        <div className="py-12 lg:py-16 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-16">
          {/* 1. COURSE HERO INTRODUCTION */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#047857]/10 text-[#047857] text-xs font-semibold uppercase tracking-wider">
                <span>Hilol Kids 4+</span>
                <span className="w-1 h-1 rounded-full bg-[#047857]/40" />
                <span>Bolalar arab tili dasturi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172421] tracking-tight leading-[1.15]">
                4+ yoshdagi bolajonlar uchun quvnoq va xavfsiz arab tili ta’limi
              </h1>

              <p className="text-base sm:text-lg text-[#66736E] leading-relaxed">
                {course.shortSummary}
              </p>

              {/* Key metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736E]">
                    Auditoriya
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#172421]">
                    4 yoshdan
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736E]">
                    Boshlang‘ich
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#172421]">
                    0 dan o‘rganish
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736E]">
                    Metodika
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#172421]">
                    Multfilm & O‘yin
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736E]">
                    Filiallar
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#172421]">
                    Toshkentda 8 ta
                  </div>
                </div>
              </div>

              {/* Early prominent CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToRegistration}
                  className="px-6 py-3 rounded-lg bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span>Sinov darsiga yozilish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={scrollToVideos}
                  className="px-5 py-3 rounded-lg border border-[#E2E8E4] text-[#172421] hover:bg-[#F8F9F6] font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current text-[#047857]" />
                  <span>Dars videolarini ko‘rish</span>
                </button>
              </div>
            </div>

            {/* Right: Authentic Visual Plate preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#E2E8E4] bg-white shadow-sm">
                <AuthenticVisualPlate
                  type={course.plateType}
                  customImage={customPhotos[course.slug]}
                  altText={course.title}
                />
              </div>
            </div>
          </div>

          {/* 2. REAL CLASSROOM VIDEO SHOWCASE (BEFORE REGISTRATION FORM) */}
          <KidsVideoGallery onRegisterClick={scrollToRegistration} />

          {/* 3. SYLLABUS, DETAILS & REGISTRATION (SIDE-BY-SIDE) */}
          <div id="royxatdan-otish" className="scroll-mt-20 pt-8 border-t border-[#E2E8E4]">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Column (7 cols): O'quv dasturi (Syllabus), Metodika va Filiallar */}
              <div className="lg:col-span-7 space-y-8">
                {/* O'quv dasturi (Syllabus) */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#047857]">
                      Bosqichma-bosqich ta’lim
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#172421] tracking-tight">
                      {t.courseDetail?.syllabusTitle || 'O‘quv dasturi (Syllabus)'}
                    </h2>
                    <p className="text-sm text-[#66736E] leading-relaxed">
                      Dastur bolalarning yosh psixologiyasiga to‘liq moslashtirilgan bo‘lib, oson va qiziqarli bosqichlardan iborat.
                    </p>
                  </div>

                  {/* Modules list (Modular clean cards) */}
                  <div className="space-y-3 pt-2">
                    {course.syllabus.map((mod, i) => (
                      <div
                        key={i}
                        className="bg-white p-5 rounded-xl border border-[#E2E8E4] hover:border-[#047857]/40 transition-colors shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#047857] px-2 py-0.5 rounded bg-[#047857]/10">
                            {i + 1}-bosqich
                          </span>
                          <span className="text-[11px] text-[#66736E]">Hilol Kids</span>
                        </div>
                        <h3 className="text-base font-bold text-[#172421]">
                          {mod.module}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#66736E] leading-relaxed">
                          {mod.topics}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* O‘qitish metodikasi */}
                <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 space-y-3 shadow-2xs">
                  <div className="text-xs uppercase tracking-wider text-[#047857] font-semibold">
                    {t.courseDetail?.methodologyTitle || 'O‘qitish metodikasi'}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#172421]">
                    Mehr, qiziqish va ijobiy rag‘batlantirishga asoslangan muhit
                  </h3>
                  <p className="text-xs sm:text-sm text-[#66736E] leading-relaxed">
                    {course.methodology}
                  </p>
                </div>

                {/* Ushbu kurs mavjud bo'lgan filiallar */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-[#172421]">
                      {t.courseDetail?.branchesTitle || 'Hilol Kids darslari mavjud filiallar (8 ta):'}
                    </h3>
                    <span className="text-xs text-[#66736E]">
                      Toshkent shahri bo‘ylab
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {branches.map((b) => (
                      <button
                        key={b.slug}
                        onClick={() => navigate(`/filiallar/${b.slug}`)}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8E4] hover:border-[#047857] hover:bg-[#F2FBF7] text-xs font-semibold text-[#172421] transition-all cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-[#047857] flex-shrink-0" />
                        <span className="group-hover:text-[#064E3B]">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Contact & Registration Form (Side by side on desktop) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2E8E4] shadow-sm space-y-5">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#047857]">
                      Bepul sinov darsi
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#172421] tracking-tight">
                      Farzandingiz uchun bepul sinov darsiga yoziling
                    </h3>
                    <p className="text-xs text-[#66736E] leading-relaxed">
                      Ma’lumotlaringizni qoldiring. Filial ma’muriyati qisqa vaqt ichida siz bilan bog‘lanib, bolajon uchun eng qulay dars vaqtini tasdiqlaydi.
                    </p>
                  </div>

                  {/* Form */}
                  <LeadRegistrationForm
                    regForm={regForm}
                    regErrors={regErrors}
                    handleRegChange={handleRegChange}
                    handleRegistrationSubmit={handleRegistrationSubmit}
                    regSubmitStatus={submitStatus}
                    courses={courses}
                    branches={branches}
                    brandConfig={brandConfig}
                    t={t}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // STANDARD 2-COLUMN LAYOUT FOR OTHER COURSES
    return (
      <div className="py-12 lg:py-16 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-12">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-3 py-1 rounded bg-[#07966F]/15 text-[#073F31] text-xs font-semibold">
              {course.category} • {course.level}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#14231F]">{course.title}</h1>
            <p className="text-base text-[#65756F] leading-relaxed">{course.shortSummary}</p>

            <div className="grid sm:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-[#073F31]/15">
              <div>
                <div className="text-xs font-bold uppercase text-[#65756F]">
                  {t.courseDetail?.targetAudience || 'Mo‘ljallangan auditoriya'}
                </div>
                <div className="text-sm font-semibold text-[#14231F] mt-1">{course.audience}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[#65756F]">
                  {t.courseDetail?.entryRequirements || 'Kirish talabi'}
                </div>
                <div className="text-sm font-semibold text-[#14231F] mt-1">
                  {course.entryRequirements}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[#65756F]">
                  {t.courseDetail?.durationSchedule || 'Davomiylik va Jadval'}
                </div>
                <div className="text-sm font-semibold text-[#14231F] mt-1">{course.durationNote}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[#65756F]">
                  {t.courseDetail?.tuitionInfo || 'To‘lov ma’lumoti'}
                </div>
                <div className="text-sm font-semibold text-[#073F31] mt-1">{course.priceStatus}</div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#14231F]">
                {t.courseDetail?.syllabusTitle || 'O‘quv dasturi (Syllabus)'}
              </h2>
              <div className="space-y-3">
                {course.syllabus.map((mod, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-xl border border-[#073F31]/15 space-y-1"
                  >
                    <div className="text-sm font-bold text-[#073F31]">{mod.module}</div>
                    <p className="text-xs sm:text-sm text-[#65756F]">{mod.topics}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div className="bg-[#073F31] text-white p-6 rounded-2xl space-y-2">
              <div className="text-xs uppercase tracking-wider text-[#63E6BE] font-semibold">
                {t.courseDetail?.methodologyTitle || 'O‘qitish metodikasi'}
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{course.methodology}</p>
            </div>

            {/* Available Branches */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-[#14231F]">
                {t.courseDetail?.branchesTitle || 'Ushbu kurs mavjud bo‘lgan filiallar (8 ta):'}
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {branches.map((b) => (
                  <button
                    key={b.slug}
                    onClick={() => navigate(`/filiallar/${b.slug}`)}
                    className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#073F31]/12 hover:border-[#07966F] hover:bg-[#F2FBF7] shadow-2xs hover:shadow-sm text-xs font-semibold text-[#14231F] transition-all duration-200 cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#07966F]/10 text-[#07966F] group-hover:bg-[#07966F] group-hover:text-white flex items-center justify-center transition-colors">
                      <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
                    </span>
                    <span className="group-hover:text-[#073F31] transition-colors">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Plate & Direct Registration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-[#073F31]/15">
              <AuthenticVisualPlate
                type={course.plateType}
                customImage={customPhotos[course.slug]}
                altText={course.title}
              />
            </div>

            {/* In-page direct trial registration form prefilled with this course */}
            <LeadRegistrationForm
              regForm={regForm}
              regErrors={regErrors}
              handleRegChange={handleRegChange}
              handleRegistrationSubmit={handleRegistrationSubmit}
              regSubmitStatus={submitStatus}
              courses={courses}
              branches={branches}
              brandConfig={brandConfig}
              t={t}
            />
          </div>
        </div>
      </div>
    );
  }

  // ROUTE 2: COURSES OVERVIEW (/kurslar)
  return (
    <div className="py-12 lg:py-16 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-12">
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
          {t.courseCatalog?.badge || 'O‘quv Dasturlari Katalogi'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#14231F] mt-1">
          {t.courseCatalog?.title || 'Ustoz Akademiyasi arab tili kurslari'}
        </h1>
        <p className="text-sm sm:text-base text-[#65756F] mt-2">
          {t.courseCatalog?.subtitle || 'Har bir kurs o‘quvchining yoshi va boshlang‘ich darajasiga qarab bosqichma-bosqich o‘rgatish uchun ishlab chiqilgan.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-7">
        {courses.map((course) => (
          <div
            key={course.slug}
            className="bg-white rounded-2xl border border-[#073F31]/15 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-52 border-b border-[#073F31]/10">
                <AuthenticVisualPlate
                  type={course.plateType}
                  customImage={customPhotos[course.slug]}
                  altText={course.title}
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="px-2.5 py-0.5 rounded bg-[#07966F]/15 text-[#073F31] text-xs font-semibold">
                  {course.category} • {course.level}
                </span>
                <h2 className="text-2xl font-bold text-[#14231F]">{course.title}</h2>
                <p className="text-sm text-[#65756F]">{course.shortSummary}</p>
                <div className="pt-2 space-y-1.5">
                  {course.objectives.map((o, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#14231F]">
                      <Check className="w-4 h-4 text-[#07966F] flex-shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#F8FAF8] border-t border-[#073F31]/10 flex items-center justify-between">
              <button
                onClick={() => navigate(`/kurslar/${course.slug}`)}
                className="text-xs font-bold text-[#073F31] hover:text-[#07966F] cursor-pointer"
              >
                {t.courseCatalog?.viewSyllabus || 'To‘liq o‘quv dasturi →'}
              </button>
              <button
                onClick={() => navigate('/royxatdan-otish', { courseSlug: course.slug })}
                className="px-4 py-2 rounded-lg bg-[#073F31] text-white text-xs font-semibold cursor-pointer"
              >
                {t.courseCatalog?.trialBtn || 'Sinov darsiga yozilish'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#073F31]/15 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#073F31]/10 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-[#14231F]">
            {t.courseCatalog?.comparisonTitle || 'Kurslarni o‘zaro taqqoslash jadvali'}
          </h2>
          <span className="text-xs text-[#65756F] sm:hidden">
            {t.courseCatalog?.tableScrollNote || '← Jadvalni o‘ngga-chapga suring →'}
          </span>
        </div>
        <div className="overflow-x-auto scroll-smooth">
          <table className="w-full min-w-[640px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F8FAF8] border-b border-[#073F31]/10 text-[#14231F]">
                <th className="p-4 font-bold">{t.courseCatalog?.tableCourseName || 'Kurs nomi'}</th>
                <th className="p-4 font-bold">{t.courseCatalog?.tableAudience || 'Kimlar uchun'}</th>
                <th className="p-4 font-bold">{t.courseCatalog?.tableRequirements || 'Kirish talabi'}</th>
                <th className="p-4 font-bold">{t.courseCatalog?.tableResult || 'Asosiy natija'}</th>
                <th className="p-4 font-bold">{t.courseCatalog?.tableAction || 'Harakat'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#073F31]/10">
              {courses.map((c) => (
                <tr key={c.slug} className="hover:bg-[#F8FAF8]/60">
                  <td className="p-4 font-bold text-[#073F31]">{c.title}</td>
                  <td className="p-4 text-[#65756F]">{c.audience}</td>
                  <td className="p-4 text-[#65756F]">{c.entryRequirements}</td>
                  <td className="p-4 text-[#14231F]">{c.objectives[0]}</td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/kurslar/${c.slug}`)}
                      className="text-xs font-bold text-[#07966F] underline cursor-pointer"
                    >
                      Batafsil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
