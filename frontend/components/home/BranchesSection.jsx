'use client';

import React, { useState } from 'react';
import { MapPin, ChevronRight, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { PremiumIconBadge } from '@/components/ui/BrandShield';
import ImageLightbox from '@/components/ui/ImageLightbox';

export default function BranchesSection({
  branches,
  navigate,
  t = {}
}) {
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <section className="py-16 lg:py-20 bg-[#073F31] text-white relative">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 reveal-on-scroll">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#63E6BE]">
              {t.branches?.sectionBadge || 'Barcha Filiallarning Lokatsiyalari'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1">
              {t.branches?.title || 'Toshkent bo‘ylab 8 ta filialimiz'}
            </h2>
            <p className="text-sm text-white/80 mt-2 max-w-2xl">
              {t.branches?.subtitle || 'O‘zingizga eng yaqin filialni tanlab, dars jadvali va mavjud guruhlar bilan tanishing.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/filiallar')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start md:self-auto min-h-[40px] transition-colors"
          >
            <span>{t.nav?.allBranches || 'Barcha filiallar katalogi'}</span>
            <ArrowRight className="w-4 h-4 motion-arrow" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {branches.map((branch, idx) => (
            <div
              key={branch.slug}
              className={`bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:shadow-lg hover:translate-y-[-2px] hover:border-[#63E6BE]/40 reveal-on-scroll stagger-${(idx % 4) + 1}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PremiumIconBadge icon={MapPin} variant="dark" size="sm" />
                    <h3 className="font-bold text-sm uppercase tracking-wide text-white group-hover:text-[#63E6BE] transition-colors">
                      {branch.officialLabel || branch.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#63E6BE]/15 text-[#63E6BE] text-[10px] font-bold border border-[#63E6BE]/25">
                    {branch.area}
                  </span>
                  <p className="text-xs text-white/90 font-medium leading-relaxed pt-1">
                    {branch.addressNote || branch.highlight}
                  </p>
                  {branch.landmark && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#A3E9D0] font-medium">
                      <span className="w-4 h-4 rounded-full bg-[#63E6BE]/20 flex items-center justify-center flex-shrink-0 text-[#63E6BE]">
                        <MapPin className="w-2.5 h-2.5" />
                      </span>
                      <span>{branch.landmark}</span>
                    </div>
                  )}
                </div>

                {branch.image && (
                  <button
                    type="button"
                    onClick={() => setLightboxImage({ src: branch.image, title: branch.name })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#63E6BE]/20 text-[#63E6BE] hover:text-white text-xs font-semibold border border-white/15 transition cursor-pointer w-full justify-center"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Geopozitsiya posteri (foto)</span>
                  </button>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/filiallar/${branch.slug}`)}
                  className="text-xs font-semibold text-white/90 hover:text-[#63E6BE] cursor-pointer py-1.5 flex items-center gap-1 transition-colors"
                >
                  <span>{t.courses?.viewDetails || 'Batafsil'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#63E6BE] motion-arrow" />
                </button>
                <button
                  onClick={() =>
                    navigate('/royxatdan-otish', { branchSlug: branch.slug })
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#63E6BE] hover:bg-[#63E6BE]/90 text-[#14231F] font-bold text-xs transition cursor-pointer active:scale-95 shadow-xs"
                >
                  <span>{t.hero?.primaryCta ? 'Yozilish' : 'Kursga yozilish'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Full Branch Geolocation Poster */}
      <ImageLightbox
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        items={lightboxImage ? [lightboxImage] : []}
      />
    </section>
  );
}
