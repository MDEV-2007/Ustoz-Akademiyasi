'use client';

import React from 'react';
import { Award, Users, Check, ChevronRight } from 'lucide-react';
import { AuthenticVisualPlate } from '@/components/ui/AuthenticVisualPlate';

export default function CourseDiscoverySection({
  t,
  courses = [],
  courseFilter = 'all',
  setCourseFilter,
  customPhotos = {},
  navigate,
}) {
  const visibleCourses =
    courseFilter === 'all' || courseFilter === 'Barchasi'
      ? courses
      : courses.filter((c) => {
          if (courseFilter === 'kids') return c.category.includes('Bolalar');
          if (courseFilter === 'adults') return c.category.includes("Boshlang'ich");
          if (courseFilter === 'cert') return c.category.includes('Sertifikat') || c.title.includes('CEFR');
          if (courseFilter === 'conv') return c.category.includes('Muloqot');
          return true;
        });

  return (
    <section className="py-16 lg:py-20 bg-[#F8FAF8] border-b border-[#073F31]/10">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal-on-scroll">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
              {t.courses?.sectionBadge || 'O‘quv yo‘nalishlari'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#14231F] mt-1">
              {t.courses?.title || 'Maqsadingiz va yoshingizga mos arab tili kurslari'}
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar flex-nowrap sm:flex-wrap">
            {[
              { key: 'all', label: t.courses?.filterAll || 'Barchasi' },
              { key: 'kids', label: t.courses?.filterKids || 'Bolalar uchun' },
              { key: 'adults', label: t.courses?.filterAdults || "Boshlang'ich" },
              { key: 'cert', label: t.courses?.filterCert || 'CEFR' },
              { key: 'conv', label: t.courses?.filterConversation || 'So‘zlashuv' },
            ].map((filterItem) => {
              const active =
                courseFilter === filterItem.key ||
                (filterItem.key === 'all' && (courseFilter === 'Barchasi' || courseFilter === 'all'));
              return (
                <button
                  key={filterItem.key}
                  onClick={() => setCourseFilter(filterItem.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer min-h-[40px] flex-shrink-0 sm:flex-shrink ${
                    active
                      ? 'bg-[#073F31] text-white shadow-xs'
                      : 'bg-white text-[#14231F] border border-[#073F31]/15 hover:border-[#07966F]'
                  }`}
                >
                  {filterItem.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {visibleCourses.map((course, idx) => (
            <article
              key={course.slug}
              className={`bg-white rounded-2xl border border-[#073F31]/15 overflow-hidden flex flex-col justify-between shadow-xs motion-card group reveal-on-scroll stagger-${
                (idx % 4) + 1
              }`}
            >
              <div>
                <div className="h-56 border-b border-[#073F31]/10 overflow-hidden">
                  <AuthenticVisualPlate
                    type={course.plateType}
                    customImage={customPhotos[course.slug]}
                    altText={course.title}
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#07966F]/12 text-[#073F31] text-xs font-semibold border border-[#07966F]/20">
                      <Award className="w-3.5 h-3.5 text-[#07966F]" />
                      <span>
                        {course.category} • {course.level}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#65756F] font-medium">
                      <Users className="w-3.5 h-3.5 text-[#07966F]" />
                      <span>{course.audience}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#14231F] group-hover:text-[#07966F] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[#65756F] leading-relaxed">
                    {course.shortSummary}
                  </p>

                  <ul className="space-y-2.5 pt-1">
                    {course.objectives.slice(0, 3).map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#14231F]">
                        <div className="w-5 h-5 rounded-full bg-[#07966F]/12 border border-[#07966F]/25 text-[#07966F] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-4 bg-[#F8FAF8] border-t border-[#073F31]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => navigate(`/kurslar/${course.slug}`)}
                  className="text-xs font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-1 cursor-pointer transition-colors py-1"
                >
                  <span>{t.courses?.viewDetails || 'Batafsil ma’lumot'}</span>
                  <ChevronRight className="w-4 h-4 motion-arrow" />
                </button>

                <button
                  onClick={() =>
                    navigate('/royxatdan-otish', { courseSlug: course.slug })
                  }
                  className="motion-button w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#073F31] hover:bg-[#07966F] text-white text-xs font-semibold transition cursor-pointer min-h-[40px] text-center"
                >
                  {t.courses?.enrollNow || 'Sinov darsiga yozilish'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
