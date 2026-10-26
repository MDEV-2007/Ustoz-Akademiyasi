'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';

export default function TeachersSection({
  t,
  teachers = [],
  departments = [],
  navigate,
}) {
  return (
    <section className="py-16 lg:py-20 bg-[#F8FAF8] border-b border-[#073F31]/10">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 reveal-on-scroll">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
              {t.teachers?.sectionBadge || 'Ustozlar va Metodika'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#14231F] mt-1">
              {t.teachers?.title || 'Ustoz Akademiyasining tajribali ustozlari'}
            </h2>
            <p className="text-sm text-[#65756F] mt-2 max-w-2xl">
              {t.teachers?.subtitle ||
                'Darslarimiz xalqaro C1 sertifikatiga ega, arab fonetikasi va bolalar pedagogikasini chuqur egallagan professional ustozlar tomonidan olib boriladi.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/ustozlar')}
            className="text-xs font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-1 cursor-pointer"
          >
            <span>{t.nav?.teachers || 'Barcha ustozlar va kafedralar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Official Teachers Grid with Real Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teachers.map((teacher, idx) => (
            <div
              key={teacher.id}
              className={`bg-white rounded-2xl overflow-hidden border border-[#073F31]/15 flex flex-col justify-between group hover:border-[#07966F]/50 hover:shadow-xl transition-all duration-300 reveal-on-scroll stagger-${
                idx + 1
              }`}
            >
              <div>
                {/* Photo Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900/5">
                  <ImageWithSkeleton
                    src={teacher.image}
                    alt={teacher.fullName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Floating Badges */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#073F31]/85 backdrop-blur-md text-[#63E6BE] text-[11px] font-bold border border-white/20">
                    {teacher.badge}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold shadow-xs">
                    {teacher.experience}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#14231F] group-hover:text-[#07966F] transition-colors">
                      {teacher.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-[#07966F] mt-0.5">
                      {teacher.role}
                    </p>
                  </div>

                  <p className="text-[11px] font-medium text-emerald-900 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100/70 leading-snug">
                    {teacher.motto}
                  </p>

                  <p className="text-xs text-[#65756F] leading-relaxed line-clamp-3">
                    {teacher.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    const teacherCleanName = teacher.fullName?.replace(/^Ustoz\s+/i, '').trim() || teacher.fullName;
                    const courseSlug =
                      teacher.fullName?.includes('Muhammad')
                        ? 'sarf-nahv-grammatika'
                        : teacher.fullName?.includes('Ibrohim')
                        ? 'intensiv-sozlashuv'
                        : 'professional-fonetika';

                    navigate('/royxatdan-otish', {
                      teacher: teacher.fullName,
                      courseSlug,
                      notes: `Ustoz: ${teacherCleanName} ustozni tanladi`
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#073F31] hover:text-white text-[#073F31] font-semibold text-xs border border-[#073F31]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{t.nav?.trialBtn || 'Sinov darsiga yozilish'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Kafedralar Section Header */}
        <div className="mb-6 pt-6 border-t border-[#073F31]/10 reveal-on-scroll">
          <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
            {t.departments?.sectionBadge || 'Akademik Tuzilma'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#14231F] mt-1">
            {t.departments?.title || 'Ixtisoslashgan o‘quv kafedralarimiz'}
          </h3>
        </div>

        {/* 3 Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full">
          {departments.map((dept, idx) => (
            <div
              key={dept.id}
              className={`bg-white rounded-2xl overflow-hidden border border-[#073F31]/15 flex flex-col justify-between group hover:border-[#07966F]/50 hover:shadow-xl transition-all duration-300 reveal-on-scroll stagger-${
                idx + 1
              }`}
            >
              <div>
                {/* Photo Container */}
                {dept.image ? (
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900/5">
                    <ImageWithSkeleton
                      src={dept.image}
                      alt={dept.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Floating Badges */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#073F31]/85 backdrop-blur-md text-[#63E6BE] text-[11px] font-bold border border-white/20">
                      {dept.badge}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold shadow-xs">
                      {dept.coursesTaught?.join(' • ')}
                    </span>
                  </div>
                ) : (
                  <div className="p-5 pb-0">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#07966F]/12 text-[#073F31] text-xs font-semibold border border-[#07966F]/20">
                      {dept.badge}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#14231F] group-hover:text-[#07966F] transition-colors">
                      {dept.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#07966F] mt-0.5">
                      {dept.qualification}
                    </p>
                  </div>

                  <p className="text-xs text-[#65756F] leading-relaxed line-clamp-3">
                    {dept.focus}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => navigate('/royxatdan-otish')}
                  className="w-full py-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#073F31] hover:text-white text-[#073F31] font-semibold text-xs border border-[#073F31]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{t.teachersPage?.trialBtn || 'Sinov darsiga yozilish'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
