'use client';

import React from 'react';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import LeadRegistrationForm from '@/components/registration/LeadRegistrationForm';

export default function RegistrationPage({
  path,
  courses = [],
  branches = [],
  brandConfig = {},
  regForm,
  regErrors = {},
  handleRegChange,
  handleRegistrationSubmit,
  submitStatus = 'idle',
  apiDiagnostic,
  confirmedLead,
  navigate,
  locale = 'uz',
  t = {}
}) {
  // ROUTE 14: REGISTRATION CONFIRMATION (/royxatdan-otish/tasdiq)
  if (path === '/royxatdan-otish/tasdiq') {
    return (
      <div className="py-14 lg:py-20 max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmedLead && submitStatus === 'accepted' ? (
          <div className="bg-white rounded-2xl p-7 border border-[#073F31]/15 text-center space-y-5 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#07966F]/15 text-[#07966F] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#14231F]">
              {t.trialRegistration?.successTitle || 'Arizangiz muvaffaqiyatli qabul qilindi!'}
            </h1>
            <p className="text-sm text-[#65756F]">
              {locale === 'ru'
                ? `Уважаемый(ая) ${confirmedLead.fullName}, ваша заявка зарегистрирована под номером ${confirmedLead.referenceId}.`
                : locale === 'en'
                ? `Dear ${confirmedLead.fullName}, your registration has been logged under reference number ${confirmedLead.referenceId}.`
                : `Hurmatli ${confirmedLead.fullName}, arizangiz ${confirmedLead.referenceId} raqami bilan ro‘yxatga olindi.`}
            </p>
            <div className="bg-[#F8FAF8] p-5 rounded-2xl border border-[#073F31]/15 text-left text-xs sm:text-sm space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#073F31]/10">
                <span className="text-[#65756F]">Ariza raqami:</span>
                <span className="font-mono font-bold text-[#073F31]">#{confirmedLead.referenceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#65756F]">{t.trialRegistration?.labelPhone || 'Telefon:'}</span>
                <span className="font-semibold text-[#14231F]">{confirmedLead.phoneFormatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#65756F]">{t.trialRegistration?.labelCourse || 'Tanlangan kurs:'}</span>
                <span className="font-semibold text-[#14231F]">{confirmedLead.courseTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#65756F]">{t.trialRegistration?.labelBranch || 'Tanlangan filial:'}</span>
                <span className="font-semibold text-[#14231F]">{confirmedLead.branchName}</span>
              </div>
              {confirmedLead.selectedTeacher && (
                <div className="flex items-center justify-between">
                  <span className="text-[#65756F]">Tanlangan ustoz:</span>
                  <span className="font-semibold text-[#07966F]">{confirmedLead.selectedTeacher}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#073F31]/10 flex items-center gap-2 text-xs text-[#07966F] font-semibold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Tez orada ma’muriyatimiz siz bilan bog‘lanadi</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-lg bg-[#073F31] text-white text-xs font-semibold cursor-pointer"
            >
              {t.trialRegistration?.backHome || 'Bosh sahifaga qaytish'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-7 border border-[#073F31]/15 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h1 className="text-xl font-bold text-[#14231F]">
              {t.trialRegistration?.notFoundTitle || 'Tasdiqlangan ariza topilmadi'}
            </h1>
            <p className="text-xs text-[#65756F]">
              {t.trialRegistration?.notFoundDesc || 'Tasdiqnoma sahifasi faqat ro‘yxatdan o‘tish formasi server tomonidan qabul qilingandan so‘ng ko‘rsatiladi.'}
            </p>
            <button
              onClick={() => navigate('/royxatdan-otish')}
              className="px-5 py-2.5 rounded-lg bg-[#073F31] text-white text-xs font-semibold cursor-pointer"
            >
              {t.trialRegistration?.goToForm || 'Ro‘yxatdan o‘tish sahifasiga o‘tish'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ROUTE 13: TRIAL-LESSON REGISTRATION (/royxatdan-otish)
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center py-8 lg:py-14 max-w-[1360px] 2xl:max-w-[1520px] min-[1920px]:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 w-full">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center justify-center w-full my-auto">
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
              {t.trialRegistration?.badge || 'Onlayn Ro‘yxatdan O‘tish'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#14231F] mt-1.5 leading-tight">
              {t.trialRegistration?.title || 'Sinov Darsiga Yozilish'}
            </h1>
            <p className="text-sm text-[#65756F] leading-relaxed mt-2.5">
              {t.trialRegistration?.subtitle || 'O‘zingizga qulay filial va vaqtni tanlang, operatorlarimiz 15 daqiqada siz bilan bog‘lanishadi.'}
            </p>
          </div>

          {/* Fast contact card */}
          <div className="bg-[#F8FAF8] p-5.5 rounded-2xl border border-[#073F31]/15 space-y-3.5 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#073F31]/80">
              {t.trialRegistration?.fastContact || 'To‘g‘ridan-to‘g‘ri aloqa:'}
            </div>
            <a
              href={brandConfig?.phoneHref || 'tel:+998555184400'}
              className="text-xl sm:text-2xl font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-2 transition"
            >
              <Phone className="w-5 h-5 text-[#07966F]" />
              <span>{brandConfig?.phoneDisplay || '55 518 44 00'}</span>
            </a>
            <div className="text-xs text-[#65756F] flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-[#073F31]/10">
              <span>Telegram: <strong>{brandConfig?.telegramHandle || '@ustozakademiyasi'}</strong></span>
              <span>Instagram: <strong>{brandConfig?.instagramHandle || '@ustoz_akademiyasi'}</strong></span>
            </div>
          </div>

          {/* Benefits trust list */}
          <div className="space-y-2.5 pt-1">
            {[
              'Birinchi sinov darsi — mutlaqo bepul va majburiyatsiz',
              'Darajangizni tajribali ustozlar bilan aniqlab berish',
              'Toshkent bo‘ylab 8 ta filialdan birini tanlash imkoniyati',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-[#14231F] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#07966F] flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
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
