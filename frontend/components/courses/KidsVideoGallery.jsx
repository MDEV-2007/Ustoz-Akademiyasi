'use client';

import React, { useState } from 'react';
import {
  Play,
  Film,
  Maximize2,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import VideoLightbox from '../ui/VideoLightbox';
import VideoWithSkeleton from '../ui/VideoWithSkeleton';

const KIDS_VIDEOS = [
  {
    id: 1,
    src: '/kids/kids_video_1.mp4',
    title: 'Bolajonlar bilan raqamlarni topish o‘yini',
    tag: 'Guruh o‘yini',
    lesson: '1-bosqich mashg‘uloti',
    desc: 'Arabcha raqamlar va ko‘rgazmali plakatlar orqali bolalarning diqqatini jamlash va jamoada ishlash mashqi.'
  },
  {
    id: 2,
    src: '/kids/kids_video_2.mp4',
    title: 'Arab alifbosi harflarini to‘g‘ri talaffuz qilish',
    tag: 'Fonetika',
    lesson: 'Talaffuz mashqi',
    desc: 'Har bir harfning maxrajini bolalarga mos quvnoq ohangda to‘g‘ri takrorlash.'
  },
  {
    id: 3,
    src: '/kids/kids_video_3.mp4',
    title: 'Harflarni rangli kartochkalar bilan o‘rganish',
    tag: 'Ko‘rgazmali ta’lim',
    lesson: 'Xotira mashqi',
    desc: 'Rang-barang harf kartochkalari yordamida harflar shakli va yozilishini eslab qolish.'
  },
  {
    id: 4,
    src: '/kids/kids_video_4.mp4',
    title: 'Ibratli multfilm va jonli muloqot',
    tag: 'Multfilm darsi',
    lesson: 'Jonli nutq',
    desc: 'Maxsus dublyaj qilingan arabcha multfilm qahramonlari so‘zlarini takrorlash orqali eshitib tushunish.'
  },
  {
    id: 5,
    src: '/kids/kids_video_5.mp4',
    title: 'Kichkintoylarning quvnoq jamoaviy darsi',
    tag: 'Jamoaviy dars',
    lesson: 'Faol guruh',
    desc: 'Bolajonlar o‘rtasida do‘stona, qo‘llab-quvvatlovchi va erkin muhit.'
  },
  {
    id: 6,
    src: '/kids/kids_video_6.mp4',
    title: 'Bolalar psixologiyasiga mos metodika',
    tag: 'Ustoz metodikasi',
    lesson: 'Pedagogika',
    desc: 'Majburlashsiz, mehr va qiziqish orqali arab tili asoslarini o‘rgatish.'
  },
  {
    id: 7,
    src: '/kids/kids_video_7.mp4',
    title: 'Faol o‘quvchilarimizning dastlabki nutqi',
    tag: 'Amaliy mashq',
    lesson: 'Ilk so‘zlar',
    desc: 'Qisqa vaqt ichida kundalik salomlashish va o‘zini tanishtirish iboralarini aytish.'
  },
  {
    id: 8,
    src: '/kids/kids_video_8.mp4',
    title: 'Dars yakunidagi rag‘bat va taqdirlash',
    tag: 'Rag‘batlantirish',
    lesson: 'Natija',
    desc: 'Har bir dars so‘ngida bolalarning kichik g‘alabalari munosib e’tirof etiladi.'
  }
];

export default function KidsVideoGallery({ onRegisterClick }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const featuredVideo = KIDS_VIDEOS[0];
  const galleryVideos = KIDS_VIDEOS.slice(1);

  const handleOpenModal = (video) => {
    setSelectedVideo(video);
  };

  return (
    <section id="videolar" className="space-y-8 scroll-mt-24">
      {/* Section Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-[#E2E8E4]">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#047857]">
            Jonli Dars Jarayonlari
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172421] tracking-tight">
            Hilol Kids darslari — real videolar
          </h2>
          <p className="text-sm sm:text-base text-[#66736E] leading-relaxed">
            Filiallarimizdagi bolalar darslari qanday o‘tishini bevosita o‘z ko‘zingiz bilan ko‘ring: harflar talaffuzi, interaktiv o‘yinlar va ibratli multfilmlar orqali arab tilini o‘rganish jarayoni.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#064E3B]/10 text-[#064E3B] text-xs font-semibold">
            8 ta dars lavhasi
          </span>
        </div>
      </div>

      {/* Featured Video Showcase (Edge-to-edge flush layout: video touches the left edge cleanly) */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-stretch">
        {/* Large Video Preview Frame - touches top, bottom, and left borders flush with no awkward left void */}
        <div
          onClick={() => handleOpenModal(featuredVideo)}
          className="w-full lg:w-[350px] xl:w-[380px] flex-shrink-0 relative bg-[#064E3B]/10 cursor-pointer group min-h-[360px] lg:min-h-[400px]"
        >
          <VideoWithSkeleton
            src={featuredVideo.src}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            containerClassName="w-full h-full"
            preload="metadata"
            muted
            playsInline
          />

          {/* Clean Centered Play Button */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/95 text-[#064E3B] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-300">
              <Play className="w-6 h-6 ml-1 fill-current" />
            </div>
          </div>

          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="px-2.5 py-1 rounded bg-[#064E3B]/90 text-white text-[11px] font-medium backdrop-blur-xs">
              Asosiy videolavha
            </span>
          </div>
        </div>

        {/* Featured Video Editorial Details - compact, coherent, natural typography without huge gaps */}
        <div className="flex-1 min-w-0 p-6 sm:p-7 lg:p-8 flex flex-col justify-center space-y-4 sm:space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#047857]">
              {featuredVideo.tag} • {featuredVideo.lesson}
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#172421] tracking-tight leading-snug">
              {featuredVideo.title}
            </h3>
          </div>

          <p className="text-sm text-[#66736E] leading-relaxed max-w-2xl">
            {featuredVideo.desc} Bolajonlar zerikmasligi uchun dars mashg‘ulotlari doimiy ravishda harakatli o‘yinlar va ibratli hikoyalar bilan uyg‘unlashtiriladi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E2E8E4]">
            <div className="space-y-0.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#172421]">
                Dars formati
              </div>
              <p className="text-xs text-[#66736E]">
                Kichik guruhlarda (8–10 nafar bola), har bir bolaga individual e’tibor.
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#172421]">
                O‘qitish usuli
              </div>
              <p className="text-xs text-[#66736E]">
                Majburlashsiz, ko‘rgazmali quvnoq kartochkalar va multfilmlar.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenModal(featuredVideo)}
              className="px-5 py-2.5 rounded-lg bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Videoni to‘liq ko‘rish</span>
            </button>

            {onRegisterClick && (
              <button
                type="button"
                onClick={onRegisterClick}
                className="px-5 py-2.5 rounded-lg border border-[#E2E8E4] text-[#172421] hover:bg-[#F8F9F6] text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Sinov darsiga yozilish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Supporting Videos Gallery (Clean, Consistent Grid) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#E2E8E4] pb-2">
          <h3 className="text-base sm:text-lg font-bold text-[#172421]">
            Boshqa dars lavhalari
          </h3>
          <span className="text-xs text-[#66736E]">
            Filiallarimizdagi haqiqiy mashg‘ulotlar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {galleryVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleOpenModal(video)}
              className="bg-white rounded-xl border border-[#E2E8E4] overflow-hidden hover:border-[#047857]/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              {/* Uncluttered Video Thumbnail with Centered Play Button */}
              <div className="relative aspect-[9/13] bg-[#064E3B]/5 overflow-hidden">
                <VideoWithSkeleton
                  src={video.src}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  containerClassName="w-full h-full"
                  preload="metadata"
                  muted
                  playsInline
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/95 text-[#064E3B] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-200">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                    {video.tag}
                  </span>
                </div>
              </div>

              {/* Text and Metadata Cleanly Placed Beneath the Thumbnail */}
              <div className="p-3.5 space-y-1.5 bg-white">
                <div className="text-[11px] font-medium text-[#047857]">
                  {video.lesson}
                </div>

                <h4 className="font-bold text-sm text-[#172421] leading-snug group-hover:text-[#047857] transition-colors line-clamp-1">
                  {video.title}
                </h4>

                <p className="text-xs text-[#66736E] line-clamp-2 leading-relaxed">
                  {video.desc}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E2E8E4]">
                  <span className="text-[11px] text-[#66736E]">
                    Ustoz Kids
                  </span>
                  <span className="text-[11px] font-semibold text-[#047857] group-hover:underline flex items-center gap-0.5">
                    <span>Ko‘rish</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dedicated Vertical 9:16 Video Lightbox */}
      <VideoLightbox
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo}
        onRegisterClick={onRegisterClick}
      />
    </section>
  );
}
