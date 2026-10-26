'use client';

import React from 'react';
import {
  User,
  Phone,
  BookOpen,
  MapPin,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Award
} from 'lucide-react';
import { formatUzbekPhoneInput } from '@/features/registration/validation';

export default function LeadRegistrationForm({
  compact = false,
  t = {},
  brandConfig = {},
  courses = [],
  branches = [],
  regForm = {
    fullName: '',
    phone: '+998 ',
    courseSlug: 'professional-fonetika',
    branchSlug: 'archakocha',
    notes: ''
  },
  setRegForm,
  handleRegChange,
  regErrors = {},
  setRegErrors,
  regSubmitStatus = 'idle',
  confirmedLead = null,
  handleRegistrationSubmit = (e) => e?.preventDefault?.(),
  setAdminDrawerOpen,
  navigate
}) {
  const onChangeField = (field, val) => {
    if (handleRegChange) {
      handleRegChange(field, val);
    } else if (setRegForm) {
      setRegForm((prev) => ({ ...prev, [field]: val }));
    }
    if (setRegErrors && regErrors[field]) {
      setRegErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#073F31]/15 p-6 sm:p-8 shadow-sm">
      <div className="border-b border-[#073F31]/10 pb-4 mb-5">
        <span className="inline-block px-2.5 py-0.5 rounded bg-[#07966F]/15 text-[#073F31] text-xs font-semibold">
          {t?.trialRegistration?.openBadge || 'Qabul ochiq • 8 ta filial'}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-[#14231F] mt-1.5">
          {t?.trialRegistration?.formTitle ||
            t?.registrationModal?.modalTitle ||
            'Bepul sinov darsiga yozilish'}
        </h3>
        <p className="text-xs sm:text-sm text-[#65756F] mt-1">
          {t?.trialRegistration?.formSubtitle ||
            t?.registrationModal?.modalSubtitle ||
            'Ma’lumotlaringizni qoldiring. Ma’muriyatimiz darajangizga mos guruh va dars vaqtini tasdiqlash uchun bog‘lanadi.'}
        </p>
      </div>


      {regErrors?.duplicate && (
        <div
          role="alert"
          className="mb-4 p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-xs font-medium text-amber-950 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <span>{regErrors.duplicate}</span>
        </div>
      )}

      {regErrors?.general && (
        <div
          role="alert"
          className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-900 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{regErrors.general}</span>
        </div>
      )}

      <form onSubmit={handleRegistrationSubmit} noValidate className="space-y-4">
        {/* Selected Teacher Banner */}
        {regForm?.selectedTeacher && (
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#064E3B]/10 border border-[#064E3B]/20 flex items-center justify-between text-xs text-[#064E3B] animate-in fade-in">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#047857] flex-shrink-0" />
              <span>
                Tanlangan ustoz: <strong className="font-bold text-[#172421]">{regForm.selectedTeacher}</strong>
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#047857] text-[10px] font-bold shadow-xs">
              Guruhiga yozilish
            </span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label
            htmlFor="reg-fullname"
            className="block text-xs font-semibold text-[#14231F] mb-1.5"
          >
            {t?.registrationModal?.fullNameLabel || 'Ism va familiyangiz'}{' '}
            <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#07966F] pointer-events-none">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <input
              id="reg-fullname"
              type="text"
              required
              autoComplete="name"
              placeholder={
                t?.registrationModal?.fullNamePlaceholder || 'Masalan: Abdulloh Karimov'
              }
              value={regForm?.fullName || ''}
              onChange={(e) => onChangeField('fullName', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-base sm:text-sm text-[#14231F] bg-[#F8FAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07966F] min-h-[44px] transition-all ${
                regErrors?.fullName ? 'border-red-500' : 'border-[#073F31]/20'
              }`}
            />
          </div>
          {regErrors?.fullName && (
            <p className="text-[11px] text-red-600 mt-1">{regErrors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="reg-phone"
            className="block text-xs font-semibold text-[#14231F] mb-1.5"
          >
            {t?.registrationModal?.phoneLabel || 'Telefon raqamingiz'}{' '}
            <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#07966F] pointer-events-none">
              <Phone className="w-4 h-4 stroke-[2]" />
            </div>
            <input
              id="reg-phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="+998 90 123 45 67"
              value={regForm?.phone || '+998 '}
              onChange={(e) => onChangeField('phone', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-base sm:text-sm text-[#14231F] bg-[#F8FAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07966F] min-h-[44px] transition-all ${
                regErrors?.phone ? 'border-red-500' : 'border-[#073F31]/20'
              }`}
            />
          </div>
          {regErrors?.phone ? (
            <p className="text-[11px] text-red-600 mt-1">{regErrors.phone}</p>
          ) : (
            <p className="text-[10px] text-[#65756F] mt-1">
              {t?.registrationModal?.phoneHint || 'O‘zbekiston raqamlari (+998)'}
            </p>
          )}
        </div>

        {/* Course Selection */}
        <div>
          <label
            htmlFor="reg-course"
            className="block text-xs font-semibold text-[#14231F] mb-1.5"
          >
            {t?.registrationModal?.courseLabel || 'Qiziqayotgan o‘quv kursi'}{' '}
            <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#07966F] pointer-events-none">
              <BookOpen className="w-4 h-4 stroke-[2]" />
            </div>
            <select
              id="reg-course"
              value={regForm?.courseSlug || ''}
              onChange={(e) => onChangeField('courseSlug', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-base sm:text-sm text-[#14231F] bg-[#F8FAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07966F] min-h-[44px] transition-all cursor-pointer ${
                regErrors?.courseSlug ? 'border-red-500' : 'border-[#073F31]/20'
              }`}
            >
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>
          {regErrors?.courseSlug && (
            <p className="text-[11px] text-red-600 mt-1">{regErrors.courseSlug}</p>
          )}
        </div>

        {/* Branch Selection */}
        <div>
          <label
            htmlFor="reg-branch"
            className="block text-xs font-semibold text-[#14231F] mb-1.5"
          >
            {t?.registrationModal?.branchLabel || 'Sizga eng yaqin filial'}{' '}
            <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#07966F] pointer-events-none">
              <MapPin className="w-4 h-4 stroke-[2]" />
            </div>
            <select
              id="reg-branch"
              value={regForm?.branchSlug || ''}
              onChange={(e) => onChangeField('branchSlug', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-base sm:text-sm text-[#14231F] bg-[#F8FAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07966F] min-h-[44px] transition-all cursor-pointer ${
                regErrors?.branchSlug ? 'border-red-500' : 'border-[#073F31]/20'
              }`}
            >
              {branches.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name} ({b.area})
                </option>
              ))}
            </select>
          </div>
          {regErrors?.branchSlug && (
            <p className="text-[11px] text-red-600 mt-1">{regErrors.branchSlug}</p>
          )}
        </div>

        {/* Notes (Optional) */}
        {!compact && (
          <div>
            <label
              htmlFor="reg-notes"
              className="block text-xs font-semibold text-[#14231F] mb-1.5"
            >
              {t?.registrationModal?.notesLabel || 'Qo‘shimcha izoh yoki savolingiz'}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 text-[#07966F] pointer-events-none">
                <MessageSquare className="w-4 h-4 stroke-[2]" />
              </div>
              <textarea
                id="reg-notes"
                rows={2}
                placeholder={
                  t?.registrationModal?.notesPlaceholder ||
                  'Masalan: qulay dars vaqti yoki farzandingiz yoshi...'
                }
                value={regForm?.notes || ''}
                onChange={(e) => onChangeField('notes', e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#073F31]/20 text-base sm:text-sm text-[#14231F] bg-[#F8FAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#07966F] transition-all"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={regSubmitStatus === 'submitting'}
            className="w-full py-3.5 px-6 rounded-xl bg-[#073F31] hover:bg-[#07966F] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed min-h-[48px]"
          >
            <span>
              {regSubmitStatus === 'submitting'
                ? t?.registrationModal?.submittingBtn || 'Yuborilmoqda...'
                : t?.registrationModal?.submitBtn || 'Bepul sinov darsiga yozilish'}
            </span>
            <ArrowRight className="w-4 h-4 text-[#63E6BE]" />
          </button>
        </div>

        <p className="text-[11px] text-[#65756F] text-center pt-1 leading-relaxed">
          {t?.trialRegistration?.privacyNotice ||
            t?.registrationModal?.privacyNotice ||
            'Tugmani bosish orqali siz shaxsiy ma’lumotlaringizni qayta ishlashga rozilik bildirasiz.'}
        </p>
      </form>
    </div>
  );
}
