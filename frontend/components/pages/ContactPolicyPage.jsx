'use client';

import React from 'react';
import {
  Phone,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import {
  Instagram,
  FacebookIcon,
  TelegramIcon
} from '@/components/ui/BrandShield';
import LeadRegistrationForm from '@/components/registration/LeadRegistrationForm';

export default function ContactPolicyPage({
  path,
  brandConfig = {},
  courses = [],
  branches = [],
  navigate = () => {},
  regForm,
  setRegForm,
  handleRegChange,
  regErrors = {},
  setRegErrors,
  submitStatus = 'idle',
  confirmedLead = null,
  handleRegistrationSubmit = (e) => e?.preventDefault?.(),
  locale = 'uz',
  t = {}
}) {
  // ROUTE 15: CONTACT PAGE (/aloqa)
  if (path === '/aloqa') {
    const defaultBranches = [
      { name: 'Archako‘cha filiali', area: 'Shayxontohur', landmark: 'Shofayz ko‘prigi yaqinida' },
      { name: 'Yangi ToshMI filiali', area: 'Olmazor', landmark: 'Makro chorrahasi' },
      { name: 'Qoraqamish filiali', area: 'Olmazor', landmark: 'Zeb-Ziynat to‘yxonasi yonida' },
      { name: 'Chig‘atoy filiali', area: 'Olmazor', landmark: 'Tinchlik metrosi yaqinida' },
      { name: 'Yunusobod filiali', area: '18-mavze', landmark: 'Havas do‘koni 2-qavat' },
      { name: 'Sergeli filiali', area: 'Sergeli-VII', landmark: '3-metro bekati yonida' },
      { name: 'Uchtepa filiali', area: 'Katta Qani', landmark: 'Zarhal to‘yxonasi ro‘parasida' },
      { name: 'Qo‘yliq filiali', area: 'Qurilish hududi', landmark: 'Doka xleb ro‘parasida' },
    ];

    const displayBranches = (branches && branches.length > 0) ? branches : defaultBranches;

    return (
      <div className="py-12 lg:py-16 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-12">
        {/* Page Header */}
        <div className="text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07966F]/10 border border-[#07966F]/20 text-[#073F31] text-xs font-bold tracking-wide">
            <Building2 className="w-3.5 h-3.5 text-[#07966F]" />
            <span>Rasmiy Aloqa Markazi • Toshkent bo‘ylab 8 ta filial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14231F] tracking-tight">
            Biz bilan bog‘lanish va qabul markazi
          </h1>
          <p className="text-sm sm:text-base text-[#65756F] max-w-3xl leading-relaxed">
            Ustoz Akademiyasida yangi guruhlarga qabul davom etmoqda. Savollaringiz bormi, dars jadvali bilan tanishmoqchimisiz yoki bepul sinov darsiga yozilmoqchimisiz? Yagona aloqa markazimiz haftaning 7 kuni sizga xizmat ko‘rsatishga tayyor.
          </p>
        </div>

        {/* 4 Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Call-Center */}
          <a
            href={brandConfig?.phoneHref || 'tel:+998555184400'}
            className="group bg-white p-6 rounded-2xl border border-[#073F31]/15 hover:border-[#07966F] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#07966F]/10 text-[#07966F] flex items-center justify-center group-hover:bg-[#07966F] group-hover:text-white transition-colors duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#65756F]">
                  Yagona Call-Markaz
                </span>
                <div className="text-xl font-bold text-[#14231F] mt-0.5">
                  {brandConfig?.phoneDisplay || '55 518 44 00'}
                </div>
              </div>
              <p className="text-xs text-[#65756F] leading-relaxed">
                Har kuni 09:00 — 20:00 gacha barcha filiallar bo‘yicha tezkor ma’lumot.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#073F31]/10 flex items-center gap-1 text-xs font-bold text-[#07966F] group-hover:translate-x-0.5 transition-transform">
              <span>Qo‘ng‘iroq qilish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Telegram */}
          <a
            href={brandConfig?.telegramUrl || 'https://t.me/ustozakademiyasi'}
            target="_blank"
            rel="noreferrer"
            className="group bg-white p-6 rounded-2xl border border-[#073F31]/15 hover:border-[#07966F] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#07966F]/10 text-[#07966F] flex items-center justify-center group-hover:bg-[#07966F] group-hover:text-white transition-colors duration-300">
                <Send className="w-5 h-5 ml-0.5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#65756F]">
                  Rasmiy Telegram
                </span>
                <div className="text-xl font-bold text-[#14231F] mt-0.5">
                  {brandConfig?.telegramHandle || '@ustozakademiyasi'}
                </div>
              </div>
              <p className="text-xs text-[#65756F] leading-relaxed">
                Bepul o‘quv materiallari, darsliklar va ma’muriyat bilan jonli muloqot.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#073F31]/10 flex items-center gap-1 text-xs font-bold text-[#07966F] group-hover:translate-x-0.5 transition-transform">
              <span>Telegramda ochish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Instagram */}
          <a
            href={brandConfig?.instagramUrl || 'https://instagram.com/ustoz_akademiyasi'}
            target="_blank"
            rel="noreferrer"
            className="group bg-white p-6 rounded-2xl border border-[#073F31]/15 hover:border-[#07966F] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#07966F]/10 text-[#07966F] flex items-center justify-center group-hover:bg-[#07966F] group-hover:text-white transition-colors duration-300">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#65756F]">
                  Rasmiy Instagram
                </span>
                <div className="text-xl font-bold text-[#14231F] mt-0.5">
                  {brandConfig?.instagramHandle || '@ustoz_akademiyasi'}
                </div>
              </div>
              <p className="text-xs text-[#65756F] leading-relaxed">
                134,000+ obunachilar, sinfxonalardan real videolar va bitiruv lavhalari.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#073F31]/10 flex items-center gap-1 text-xs font-bold text-[#07966F] group-hover:translate-x-0.5 transition-transform">
              <span>Instagramda ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/hiloltalimuz/?ref=NONE_xav_ig_profile_page_web#"
            target="_blank"
            rel="noreferrer"
            className="group bg-white p-6 rounded-2xl border border-[#073F31]/15 hover:border-[#07966F] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#07966F]/10 text-[#07966F] flex items-center justify-center group-hover:bg-[#07966F] group-hover:text-white transition-colors duration-300">
                <FacebookIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#65756F]">
                  Rasmiy Facebook
                </span>
                <div className="text-xl font-bold text-[#14231F] mt-0.5">
                  Ustoz Akademiyasi
                </div>
              </div>
              <p className="text-xs text-[#65756F] leading-relaxed">
                Akademiya yangiliklari, ilmiy maqolalar va ota-onalar tavsiyalari.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#073F31]/10 flex items-center gap-1 text-xs font-bold text-[#07966F] group-hover:translate-x-0.5 transition-transform">
              <span>Facebook sahifasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>

        {/* Two-Column Main Section: Form (Left) & Academy Info / Branches / FAQ (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#073F31] text-white p-6 sm:p-7 rounded-2xl relative overflow-hidden shadow-sm">
              <div className="relative z-10 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#63E6BE]/20 text-[#63E6BE] text-xs font-semibold">
                  Tezkor Ro‘yxatdan O‘tish
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Onlayn so‘rov yoki sinov darsiga ariza qoldiring
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Ma’lumotlaringizni qoldiring. Ma’muriyatimiz 15 daqiqa ichida siz bilan bog‘lanib, qulay filial va mos dars vaqtini tasdiqlab beradi.
                </p>
              </div>
            </div>

            {/* Registration / Contact Form */}
            <LeadRegistrationForm
              t={t}
              brandConfig={brandConfig}
              courses={courses}
              branches={branches}
              regForm={regForm}
              setRegForm={setRegForm}
              handleRegChange={handleRegChange}
              regErrors={regErrors}
              setRegErrors={setRegErrors}
              regSubmitStatus={submitStatus}
              confirmedLead={confirmedLead}
              handleRegistrationSubmit={handleRegistrationSubmit}
              navigate={navigate}
            />
          </div>

          {/* Right Column: Office Schedule, Branch Locations & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            {/* Working Hours & Guarantee Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#073F31]/15 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-[#073F31]/10">
                <div className="w-10 h-10 rounded-xl bg-[#07966F]/10 text-[#07966F] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#14231F]">Qabul bo‘limi ish tartibi</h3>
                  <p className="text-xs text-[#65756F]">Haftaning barcha 7 kunida ochiq</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#65756F]">Dushanba — Shanba:</span>
                  <span className="font-bold text-[#14231F]">09:00 — 20:00</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#65756F]">Yakshanba:</span>
                  <span className="font-bold text-[#14231F]">09:00 — 18:00</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#65756F]">Dars smenalari:</span>
                  <span className="font-semibold text-[#073F31]">Ertalabki, kunduzgi, kechki</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#073F31]/10 space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-[#14231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#07966F] flex-shrink-0 mt-0.5" />
                  <span><strong>1-sinov darsi</strong> mutlaqo bepul taqdim etiladi</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#14231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#07966F] flex-shrink-0 mt-0.5" />
                  <span>Darajani aniqlash va o‘quv dasturini tanlash bepul</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#14231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#07966F] flex-shrink-0 mt-0.5" />
                  <span>Bolalar va kattalar uchun alohida jihozlangan xonalar</span>
                </div>
              </div>
            </div>

            {/* Quick Branch Directory Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#073F31]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#14231F]">8 ta filialimiz manzillari</h3>
                  <p className="text-xs text-[#65756F]">Toshkent bo‘ylab qulay lokatsiyalar</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#07966F]/10 text-[#073F31] text-[11px] font-bold">
                  8 filial
                </span>
              </div>

              <div className="space-y-2 pt-1 max-h-[300px] overflow-y-auto pr-1">
                {displayBranches.map((b, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate?.(`/filiallar/${b.slug || ''}`)}
                    className="p-3 rounded-xl bg-[#F8FAF8] hover:bg-[#07966F]/5 border border-[#073F31]/10 hover:border-[#07966F]/30 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#14231F] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#07966F] flex-shrink-0" />
                        <span>{b.officialLabel || b.name}</span>
                      </div>
                      <div className="text-[11px] text-[#65756F] pl-5">
                        {b.landmark || b.area || b.addressNote}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#65756F] flex-shrink-0" />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate?.('/filiallar')}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#073F31] hover:bg-[#0a4e3d] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Barcha filiallar xaritasini ko‘rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick FAQ Mini-card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#073F31]/15 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#07966F]" />
                <h3 className="text-base font-bold text-[#14231F]">Ko‘p beriladigan savollar</h3>
              </div>

              <div className="space-y-3 text-xs text-[#65756F] leading-relaxed">
                <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#073F31]/10">
                  <strong className="text-[#14231F] block mb-1">Sinov darsi rostdan ham bepulmi?</strong>
                  Ha, birinchi tanishuv darsi mutlaqo bepul. Siz dars muhiti va ustoz mahoratini baholagach, kursga yozilishni hal qilasiz.
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#073F31]/10">
                  <strong className="text-[#14231F] block mb-1">Bolalar uchun necha yoshdan boshlanadi?</strong>
                  Hilol Kids 4+ dasturimiz bo‘yicha 4 yoshdan bolajonlar qabul qilinadi. Darslar o‘yin va ko‘rgazmali metodlar asosida o‘tiladi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ROUTE 16: PRIVACY POLICY (/maxfiylik-siyosati)
  return (
    <div className="py-12 lg:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-bold text-[#14231F]">Maxfiylik siyosati</h1>
      <div className="bg-white rounded-2xl p-6 border border-[#073F31]/15 space-y-4 text-sm text-[#65756F] leading-relaxed shadow-sm">
        <p>
          <strong className="text-[#14231F]">1. Umumiy qoidalar:</strong> Ushbu maxfiylik siyosati «Ustoz Akademiyasi» veb-sayti orqali sinov darsiga yozilish vaqtida taqdim etilgan shaxsiy ma’lumotlarni (ism, telefon raqami va tanlangan filial) qayta ishlash tartibini belgilaydi.
        </p>
        <p>
          <strong className="text-[#14231F]">2. Ma’lumotlardan foydalanish maqsadi:</strong> Kiritilgan telefon raqami va ism faqatgina o‘quvchi bilan bog‘lanish, sinov darsi vaqtini belgilash hamda tanlangan filial manzilini yuborish uchungina ishlatiladi.
        </p>
        <p>
          <strong className="text-[#14231F]">3. Ma’lumotlar daxlsizligi:</strong> Foydalanuvchi ma’lumotlari uchinchi shaxslarga berilmaydi. Savollar bo‘yicha {brandConfig?.phoneDisplay || '55 518 44 00'} raqamiga murojaat qilishingiz mumkin.
        </p>
      </div>
    </div>
  );
}
