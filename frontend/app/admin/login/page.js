'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Award,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, error: authError } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Iltimos, email va parolni to‘liq kiriting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.push('/admin/dashboard');
    } catch (err) {
      setLocalError(
        err.message || 'Kirishda xatolik yuz berdi. Email yoki parol noto‘g‘ri.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#132E25] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Ambient background glow & subtle organic particles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1E5242]/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#0E261E]/80 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#1B4B3D]/30 blur-2xl pointer-events-none" />

      {/* Main Split Login Card */}
      <div className="relative z-10 w-full max-w-[1100px] bg-[#1E4336] rounded-[28px] sm:rounded-[36px] shadow-2xl border border-emerald-900/40 overflow-hidden flex flex-col lg:flex-row min-h-[620px] transition-all">
        
        {/* ================= LEFT SECTION: White organic panel with brand & illustration ================= */}
        <div className="relative lg:w-[58%] bg-[#FFFFFF] p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Subtle decorative background organic shape */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8F5EE] rounded-full filter blur-2xl -mr-20 -mt-20 pointer-events-none opacity-70" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F0FDF4] rounded-full filter blur-xl -ml-16 -mb-16 pointer-events-none opacity-80" />

          {/* Top-Left: Brand Emblem & Academy Name */}
          <div className="relative z-10 flex items-center gap-3.5">
            {/* Authentic Ustoz Akademiyasi Emblem */}
            <div className="w-12 h-12 rounded-2xl bg-[#086641] shadow-md flex items-center justify-center p-2 shrink-0 border border-emerald-600/30">
              <svg viewBox="0 0 100 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 34C26 14 74 14 94 34V52C94 81 50 102 50 102C50 102 6 81 6 52V34Z"
                  fill="#059E6B"
                />
                <line x1="50" y1="43" x2="50" y2="20" stroke="#FFF" strokeWidth="6" strokeLinecap="round" />
                <line x1="36" y1="50" x2="19" y2="36" stroke="#FFF" strokeWidth="6" strokeLinecap="round" />
                <line x1="64" y1="50" x2="81" y2="36" stroke="#FFF" strokeWidth="6" strokeLinecap="round" />
                <path d="M41 54L50 46L59 54" stroke="#FFF" strokeWidth="6" strokeLinecap="round" />
                <path
                  d="M23 63C23 69 32 69 44 69C48 69 50 72 50 74.5C50 72 52 69 56 69C68 69 77 69 77 63"
                  stroke="#FFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-wider text-[#064E3B] block uppercase leading-tight font-sans">
                USTOZ <span className="text-[#059E6B]">AKADEMIYASI</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest block">
                Arab Tili O‘quv Markazi
              </span>
            </div>
          </div>

          {/* Center: Educational Illustration */}
          <div className="relative z-10 my-6 sm:my-8 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 max-w-full drop-shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/academy_login_illustration.jpg"
                alt="Ustoz Akademiyasi ta’lim tasviri"
                fill
                priority
                className="object-contain rounded-3xl"
              />
            </div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold tracking-wide">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                «O‘QI VA KO‘TARIL!»
              </span>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Zulmatlardan Nur tomon — Sifatli va tizimli arab tili ta’limi
              </p>
            </div>
          </div>

          {/* Bottom-Left: Footer copyright & info */}
          <div className="relative z-10 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>© 2026 Ustoz Akademiyasi • Toshkent</span>
            <span className="hidden sm:inline font-medium text-emerald-700">8 ta rasmiy filial</span>
          </div>

          {/* Right-side curved wave separator (desktop only) */}
          <div className="hidden lg:block absolute -right-1 top-0 bottom-0 w-16 pointer-events-none z-20">
            <svg
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
              className="w-full h-full text-[#1E4336] fill-current"
            >
              <path d="M0,0 Q60,180 20,400 Q-10,600 60,800 L100,800 L100,0 Z" />
            </svg>
          </div>
        </div>

        {/* ================= RIGHT SECTION: Dark green login form ================= */}
        <div className="lg:w-[42%] bg-[#1E4336] p-7 sm:p-10 lg:p-12 flex flex-col justify-between text-white relative z-10">
          <div>
            {/* Header */}
            <div className="mb-7">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Login
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/70 font-normal">
                Boshqaruv va CRM tizimiga kirish uchun xizmat hisobingiz ma’lumotlarini kiriting.
              </p>
            </div>

            {/* Error Message */}
            {(localError || authError) && (
              <div className="mb-5 p-3.5 bg-rose-950/70 border border-rose-500/40 rounded-2xl flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in duration-200 shadow-sm">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{localError || authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username/Email Input */}
              <div>
                <label className="block text-xs font-medium text-emerald-100/85 mb-2 ml-1">
                  Username yoki Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#122F25] border border-emerald-700/60 rounded-full text-sm text-white placeholder-emerald-300/40 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/25 transition-all shadow-inner"
                  />
                  <Mail className="w-4 h-4 text-emerald-400/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-emerald-100/85 mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#122F25] border border-emerald-700/60 rounded-full text-sm text-white placeholder-emerald-300/40 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/25 transition-all shadow-inner pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-white transition-colors cursor-pointer p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2.5 px-1">
                  <label className="flex items-center gap-2 text-xs text-emerald-100/75 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#4DA199] border-emerald-700 bg-[#122F25] focus:ring-teal-400 focus:ring-offset-0"
                    />
                    Eslab qolish
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Parolni tiklash uchun tizim administratori yoki bosh texnik xodim bilan bog‘laning: +998 55 518 44 00"
                      )
                    }
                    className="text-xs text-teal-300 hover:text-teal-200 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Submit Button (Pill shaped teal button) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#4DA199] hover:bg-[#3FA096] active:bg-[#348C83] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-teal-900/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Tizimga kirish</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Hint for admin access */}
            <div className="mt-5 text-center">
              <span className="text-[11px] text-emerald-200/50 block">
                Faqat vakolatli ma’muriyat xodimlari uchun
              </span>
            </div>
          </div>

          {/* Bottom Security / Support note */}
          <div className="mt-8 pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-200/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>256-bit SSL Himoyalangan</span>
            </div>
            <a
              href="tel:+998555184400"
              className="hover:text-emerald-100 transition-colors"
            >
              Texnik yordam: +998 55 518 44 00
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
