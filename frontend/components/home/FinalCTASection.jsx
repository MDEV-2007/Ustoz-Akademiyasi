'use client';

import React from 'react';
import { Phone, CheckCircle2 } from 'lucide-react';
import LeadRegistrationForm from '@/components/registration/LeadRegistrationForm';

export default function FinalCTASection({
  brandConfig,
  courses,
  branches,
  regForm,
  regErrors = {},
  handleRegChange,
  handleRegistrationSubmit,
  submitStatus,
  apiDiagnostic,
  t = {}
}) {
  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-[1360px] 2xl:max-w-[1520px] min-[1920px]:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center justify-center">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
                {t.registrationModal?.badge || 'Birinchi Qadam'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#14231F] leading-tight mt-1.5">
                {t.registrationModal?.modalTitle || 'O‘zingizga eng yaqin filialimizda sinov darsiga yoziling'}
              </h2>
              <p className="text-sm sm:text-base text-[#65756F] leading-relaxed mt-2.5">
                {t.registrationModal?.modalSubtitle || 'Sinov darsida ustozlarimiz bilim darajangizni aniqlab, sizga yoki farzandingizga eng mos o‘quv guruhini tavsiya etadilar.'}
              </p>
            </div>

            <div className="p-5.5 rounded-2xl bg-[#F8FAF8] border border-[#073F31]/15 space-y-3.5 shadow-2xs hover:border-[#07966F]/40 transition-all duration-300 motion-card">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#073F31]/80">
                {t.trialRegistration?.directContact || 'To‘g‘ridan-to‘g‘ri aloqa:'}
              </div>
              <a
                href={brandConfig?.phoneHref || 'tel:+998555184400'}
                className="text-xl sm:text-2xl font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-2 transition"
              >
                <Phone className="w-5 h-5 text-[#07966F]" />
                <span>{brandConfig?.phoneDisplay || '55 518 44 00'}</span>
              </a>
              <div className="text-xs text-[#65756F] flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-[#073F31]/10">
                <span>
                  Telegram:{' '}
                  <a
                    href={brandConfig?.telegramUrl || 'https://t.me/ustozakademiyasi'}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-semibold text-[#14231F]"
                  >
                    {brandConfig?.telegramHandle || '@ustozakademiyasi'}
                  </a>
                </span>
                <span>
                  Instagram:{' '}
                  <a
                    href={brandConfig?.instagramUrl || 'https://instagram.com/ustoz_akademiyasi'}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-semibold text-[#14231F]"
                  >
                    {brandConfig?.instagramHandle || '@ustoz_akademiyasi'}
                  </a>
                </span>
              </div>
            </div>

            {/* Benefits trust list */}
            <div className="space-y-2.5 pt-1">
              {(
                t.trialRegistration?.benefits || [
                  'Birinchi sinov darsi — mutlaqo bepul va majburiyatsiz',
                  'Darajangizni tajribali ustozlar bilan aniqlab berish',
                  'Toshkent bo‘ylab 8 ta filialdan birini tanlash imkoniyati',
                ]
              ).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[#14231F] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#07966F] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 reveal-on-scroll reveal-from-right stagger-1">
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
    </section>
  );
}
