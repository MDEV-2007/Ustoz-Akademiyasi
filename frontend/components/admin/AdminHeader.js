'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import GlobalSearch from './GlobalSearch';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  X,
} from 'lucide-react';

const PATH_TITLES = {
  '/admin/dashboard': { title: 'Dashboard', group: 'Overview' },
  '/admin/crm/leads': { title: 'Murojaatlar (Arizalar)', group: 'CRM' },
  '/admin/crm/clients': { title: 'Mijozlar bazasi', group: 'CRM' },
  '/admin/crm/trial-lessons': { title: 'Sinov darslari', group: 'CRM' },
  '/admin/crm/tasks': { title: 'Vazifalar va eslatmalar', group: 'CRM' },
  '/admin/academy/courses': { title: 'O‘quv kurslari', group: 'Academy' },
  '/admin/academy/teachers': { title: 'Ustozlar jamoasi', group: 'Academy' },
  '/admin/academy/branches': { title: 'Filiallar', group: 'Academy' },
  '/admin/academy/schedules': { title: 'Dars jadvali', group: 'Academy' },
  '/admin/website/homepage': { title: 'Bosh sahifa boshqaruvi', group: 'Website CMS' },
  '/admin/website/pages': { title: 'Statik sahifalar', group: 'Website CMS' },
  '/admin/website/articles': { title: 'Yangiliklar va maqolalar', group: 'Website CMS' },
  '/admin/website/faq': { title: 'Savol-javoblar (FAQ)', group: 'Website CMS' },
  '/admin/website/media': { title: 'Media kutubxonasi', group: 'Website CMS' },
  '/admin/website/seo': { title: 'SEO sozlamalari', group: 'Website CMS' },
  '/admin/bot/overview': { title: 'Telegram Bot Boshqaruvi', group: 'Telegram Bot' },
  '/admin/bot/messages': { title: 'Xabarlar va menyular', group: 'Telegram Bot' },
  '/admin/bot/faq': { title: 'Bot FAQ', group: 'Telegram Bot' },
  '/admin/bot/leads': { title: 'Botdan kelgan arizalar', group: 'Telegram Bot' },
  '/admin/bot/notifications': { title: 'Bildirishnomalar', group: 'Telegram Bot' },
  '/admin/bot/stats': { title: 'Bot statistikasi', group: 'Telegram Bot' },
  '/admin/system/reports': { title: 'Tizim hisobotlari', group: 'System' },
  '/admin/system/staff': { title: 'Xodimlar va ruxsatlar', group: 'System' },
  '/admin/system/audit-logs': { title: 'Audit jurnali', group: 'System' },
  '/admin/system/settings': { title: 'Tizim sozlamalari', group: 'System' },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { user, sidebarCollapsed, setMobileMenuOpen } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const routeInfo = PATH_TITLES[pathname] || {
    title: 'Boshqaruv paneli',
    group: 'Admin',
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] transition-all duration-300 ${
        sidebarCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-72'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menyuni ochish"
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>

          <div className="flex flex-col min-w-0">
            {/* Breadcrumb line */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Link href="/admin/dashboard" className="hover:text-emerald-700 transition-colors">
                Asosiy
              </Link>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-slate-500">{routeInfo.group}</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-slate-800 font-semibold truncate">{routeInfo.title}</span>
            </nav>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {routeInfo.title}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
          <GlobalSearch />
        </div>

        {/* Right: Bot Status Pill, Notifications & Quick Actions */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Mobile search trigger button */}
          <button
            onClick={() => setShowMobileSearch(true)}
            aria-label="Tezkor qidiruv"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Search size={18} />
          </button>

          {/* Telegram Bot Live Health Pill */}
          <Link
            href="/admin/bot/overview"
            title="Telegram Bot holati: Ishlamoqda"
            className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="flex items-center gap-1">
              <Bot size={13} className="text-emerald-700" />
              <span className="text-[11px] font-bold">@ustozakademiya_bot</span>
            </span>
          </Link>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Bildirishnomalar"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 space-y-2 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">Bildirishnomalar</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Yangi
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                    <p className="font-semibold text-slate-800">Yangi ariza kelib tushdi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Telegram orqali «Hilol Kids 4+» kursiga ariza topshirildi.
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-1">Hozirgina</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                    <p className="font-semibold text-slate-800">Sinov darsi eslatmasi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Bugun soat 14:00 da Chilonzor filialida sinov darsi belgilangan.
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-1">1 soat oldin</span>
                  </div>
                </div>
                <Link
                  href="/admin/crm/leads"
                  onClick={() => setShowNotifications(false)}
                  className="block text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-1"
                >
                  Barcha arizalarni ko‘rish →
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Role Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#086641] to-[#064E3B] flex items-center justify-center font-bold text-white text-xs shadow-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user?.fullName || 'Bosh Administrator'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700">
                {user?.role || 'SUPER_ADMIN'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm p-4 pt-4 md:hidden flex flex-col justify-start">
          <div className="bg-white rounded-2xl p-4 shadow-2xl space-y-3 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Search size={14} className="text-emerald-600" />
                Tezkor Qidiruv
              </span>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <GlobalSearch isMobileModal onCloseMobile={() => setShowMobileSearch(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
