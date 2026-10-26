'use client';

import React from 'react';
import { GraduationCap, Building2, Users, PhoneCall } from 'lucide-react';
import { PremiumIconBadge } from '@/components/ui/BrandShield';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export default function TrustMetricsSection({ brandConfig }) {
  return (
    <section className="py-14 bg-white border-b border-[#073F31]/10">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="reveal-on-scroll stagger-1 p-6 rounded-2xl bg-[#F8FAF8] border border-[#073F31]/10 group hover:border-[#07966F]/40 hover:shadow-md transition-all duration-300 motion-card">
            <div className="flex items-center justify-between mb-4">
              <PremiumIconBadge icon={GraduationCap} variant="emerald" size="md" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#07966F]/10 text-[#07966F]">
                Rasmiy
              </span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#07966F]">
              Bitiruvchilar ko‘rsatkichi
            </div>
            <div className="text-2xl 2xl:text-3xl font-bold text-[#14231F] mt-1.5">
              <AnimatedCounter end={15000} suffix="+" /> bitiruvchilar
            </div>
            <p className="text-xs text-[#65756F] mt-2 leading-relaxed">
              Rasmiy Instagram (@ustoz_akademiyasi) bio ma’lumoti (Telegram kanalida 5,000+ bosqich qayd etilgan).
            </p>
          </div>

          <div className="reveal-on-scroll stagger-2 p-6 rounded-2xl bg-[#F8FAF8] border border-[#073F31]/10 group hover:border-[#07966F]/40 hover:shadow-md transition-all duration-300 motion-card">
            <div className="flex items-center justify-between mb-4">
              <PremiumIconBadge icon={Building2} variant="emerald" size="md" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#07966F]/10 text-[#07966F]">
                Toshkent
              </span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#07966F]">
              Toshkent tarmog‘i
            </div>
            <div className="text-2xl 2xl:text-3xl font-bold text-[#14231F] mt-1.5">
              <AnimatedCounter end={brandConfig.branchesCount} suffix=" ta" duration={800} /> rasmiy filial
            </div>
            <p className="text-xs text-[#65756F] mt-2 leading-relaxed">
              Archako‘cha, Yangi ToshMI, Qoraqamish, Algoritm, Yunusobod, Sergeli, Tinchlik va Katta qani.
            </p>
          </div>

          <div className="reveal-on-scroll stagger-3 p-6 rounded-2xl bg-[#F8FAF8] border border-[#073F31]/10 group hover:border-[#07966F]/40 hover:shadow-md transition-all duration-300 motion-card">
            <div className="flex items-center justify-between mb-4">
              <PremiumIconBadge icon={Users} variant="emerald" size="md" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#07966F]/10 text-[#07966F]">
                Auditoriya
              </span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#07966F]">
              Jamoatchilik ishonchi
            </div>
            <div className="text-2xl 2xl:text-3xl font-bold text-[#14231F] mt-1.5">
              <AnimatedCounter end={134} suffix="K+" duration={1000} /> kuzatuvchilar
            </div>
            <p className="text-xs text-[#65756F] mt-2 leading-relaxed">
              Instagramda 716+ o‘quv lavhalar hamda Telegramda 764 ta foto va 270 ta video darsliklar.
            </p>
          </div>

          <div className="reveal-on-scroll stagger-4 p-6 rounded-2xl bg-[#F8FAF8] border border-[#073F31]/10 group hover:border-[#07966F]/40 hover:shadow-md transition-all duration-300 motion-card">
            <div className="flex items-center justify-between mb-4">
              <PremiumIconBadge icon={PhoneCall} variant="emerald" size="md" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#07966F]/10 text-[#07966F]">
                Yagona
              </span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#07966F]">
              Yagona Call-Markaz
            </div>
            <div className="text-2xl 2xl:text-3xl font-bold text-[#14231F] mt-1.5">
              55 518 44 00
            </div>
            <p className="text-xs text-[#65756F] mt-2 leading-relaxed">
              Barcha filiallar bo‘yicha guruh vaqtlari va sinov darslariga yozilish markazi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
