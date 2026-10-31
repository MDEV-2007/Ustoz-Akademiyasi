'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { OfficialBrandShield } from '@/components/ui/BrandShield';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Live Tashkent Clock & Dynamic Time Vibe Greeting
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState({ text: 'Xayrli kun', icon: '🌤' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Tashkent time: HH:mm:ss
      const timeStr = now.toLocaleTimeString('uz-UZ', {
        timeZone: 'Asia/Tashkent',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(timeStr);

      // Determine greeting based on Tashkent hour
      const hour = parseInt(
        now.toLocaleTimeString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          hour: '2-digit',
          hour12: false,
        }),
        10
      );

      if (hour >= 6 && hour < 12) {
        setGreeting({ text: 'Xayrli tong', icon: '☀️' });
      } else if (hour >= 12 && hour < 18) {
        setGreeting({ text: 'Xayrli kun', icon: '🌤' });
      } else {
        setGreeting({ text: 'Xayrli kech', icon: '🌙' });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Iltimos, email va parolni to‘liq kiriting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result && result.success === false) {
        setLocalError(result.error || 'Email yoki parol noto‘g‘ri.');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setLocalError(
        err.message || 'Kirishda xatolik yuz berdi. Email yoki parol noto‘g‘ri.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#04120e] text-white flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Delicate Islamic Geometric Overlay */}
      <div className="absolute inset-0 z-0 islamic-pattern-bg ambient-hero-pattern opacity-5 pointer-events-none" />

      {/* Ambient radial emerald-gold glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-emerald-600/15 via-amber-400/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-950/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-900/40 blur-3xl pointer-events-none" />

      {/* Split-screen Unified Dark Luxury Emerald Card */}
      <div className="relative z-10 max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 bg-[#071f17]/90 backdrop-blur-xl flex flex-col lg:flex-row min-h-[640px]">
        
        {/* ========================================================================= */}
        {/* 2. CHAP USTUN: Brend, Vizual va 'Time Vibe' vidjeti (50% kenglik)         */}
        {/* ========================================================================= */}
        <div className="relative lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[360px] lg:min-h-full">
          {/* Background classroom photo with deep emerald gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/teachers/teacher_1.png"
              alt="Arab Tili Dars Jarayoni"
              className="w-full h-full object-cover object-center"
            />
            {/* Deep emerald brand gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04120e] via-[#061c14]/85 to-[#061c14]/65" />
          </div>

          {/* Yuqori qism: Brend logotip va Jonli Toshkent Vaqti kapsulasi */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <OfficialBrandShield size={38} className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
              <div className="leading-tight">
                <div className="font-extrabold text-sm sm:text-base text-white tracking-wider flex items-center gap-1">
                  <span>ARAB</span>
                  <span className="text-emerald-400 font-black">TILI</span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-300/80 font-semibold uppercase tracking-widest">
                  Arab Tili O‘quv Markazi
                </div>
              </div>
            </div>

            {/* Live Clock Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 backdrop-blur-md text-[11px] font-mono text-emerald-300 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTime || '12:00:00'}</span>
              <span className="text-[9px] text-slate-400 font-sans ml-0.5 hidden sm:inline">Toshkent</span>
            </div>
          </div>

          {/* Markaziy qism: Iqro xattotlik silueti, Shior va Jonli CRM Status Vidjeti */}
          <div className="relative z-10 my-auto py-8 text-center space-y-6">
            {/* Fondagi arabcha 'اقرأ' (Iqro) xattotlik silueti */}
            <div className="relative flex justify-center items-center">
              <div
                className="text-6xl sm:text-7xl font-bold text-amber-300/30 select-none tracking-wide drop-shadow-[0_0_25px_rgba(251,191,36,0.25)]"
                dir="rtl"
                style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
              >
                اقْرَأْ
              </div>
            </div>

            {/* Tilla-zumrad yorug‘lik bilan ajratilgan shior */}
            <div className="space-y-1.5 max-w-sm mx-auto">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
                O‘QI VA KO‘TARIL! • ZULMATLARDAN NUR TOMON
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Sifatli va tizimli arab tili ta’limi
              </p>
            </div>

            {/* Jonli CRM Status Vidjeti (Glassmorphic Card) */}
            <div className="mx-auto max-w-sm rounded-2xl bg-white/[0.04] border border-emerald-500/30 backdrop-blur-md p-3.5 text-left shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-white tracking-wide">
                  8 ta rasmiy filial — Tizim faol
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 pl-5 leading-snug">
                Bugungi o‘quv jarayonlari va CRM sinxronizatsiyasi tayyor.
              </p>
            </div>
          </div>

          {/* Pastki qism (Footer) */}
          <div className="relative z-10 text-xs text-slate-400/80 pt-4 border-t border-white/10 flex items-center justify-between">
            <span>© 2026 Arab Tili</span>
            <span className="text-[11px] text-slate-500">Toshkent</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. O‘NG USTUN: Login Formasi va Dinamik Salomlashuv (50% kenglik)         */}
        {/* ========================================================================= */}
        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#071f17]/70">
          <div>
            {/* Dinamik Time-Vibe Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 shadow-sm">
              <span>{greeting.icon}</span>
              <span>{greeting.text}</span>
            </div>

            {/* Sarlavha & Tavsif */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Tizimga kirish
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Boshqaruv va CRM tizimiga kirish uchun xizmat hisobingiz ma’lumotlarini kiriting.
            </p>

            {/* Xatolik xabari */}
            {localError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{localError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Input: Foydalanuvchi nomi yoki Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Foydalanuvchi nomi yoki Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Loginingizni kiriting"
                    className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Input: Maxfiy parol */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Maxfiy parol
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    className="w-full pl-10 pr-11 py-3 sm:py-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Qo‘shimcha qator: Eslab qolish & Parolni unutdingizmi */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-emerald-500/30 bg-emerald-950/60 accent-emerald-400 text-emerald-500 focus:ring-emerald-400/30 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">Eslab qolish</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Parolni tiklash uchun ma’muriyat bilan bog‘laning: +998 71 200 00 00')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
                >
                  Parolni unutdingizmi?
                </button>
              </div>

              {/* Asosiy tugma (Primary CTA) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold py-3.5 sm:py-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:shadow-[0_0_35px_rgba(52,211,153,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.99] text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Tizimga kirish</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Xavfsizlik kichik qulf eslatmasi */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Faqat vakolatli ma’muriyat xodimlari uchun</span>
              </div>
            </form>
          </div>

          {/* Eng pastki Xavfsizlik va Texnik yordam bloki */}
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <span>🛡️</span>
              <span>256-bit SSL Himoyalangan</span>
            </span>
            <span>
              Texnik yordam:{' '}
              <a href="tel:+998712000000" className="text-white hover:underline font-semibold">
                +998 71 200 00 00
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
