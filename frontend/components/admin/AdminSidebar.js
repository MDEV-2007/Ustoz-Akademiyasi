'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import {
  LayoutDashboard,
  Inbox,
  Users2,
  CalendarCheck2,
  ListTodo,
  BookOpen,
  GraduationCap,
  Building2,
  CalendarDays,
  LayoutTemplate,
  FileText,
  Newspaper,
  HelpCircle,
  Image as ImageIcon,
  SearchCode,
  Bot,
  MessageSquareCode,
  MessagesSquare,
  BotMessageSquare,
  BellRing,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const NAVIGATION_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'CRM',
    items: [
      { label: 'Murojaatlar', href: '/admin/crm/leads', icon: Inbox },
      { label: 'Mijozlar', href: '/admin/crm/clients', icon: Users2 },
      { label: 'Sinov darslari', href: '/admin/crm/trial-lessons', icon: CalendarCheck2 },
      { label: 'Vazifalar va eslatmalar', href: '/admin/crm/tasks', icon: ListTodo },
    ],
  },
  {
    title: 'ACADEMY',
    items: [
      { label: 'Kurslar', href: '/admin/academy/courses', icon: BookOpen },
      { label: 'Ustozlar', href: '/admin/academy/teachers', icon: GraduationCap },
      { label: 'Filiallar', href: '/admin/academy/branches', icon: Building2 },
      { label: 'Dars jadvali', href: '/admin/academy/schedules', icon: CalendarDays },
    ],
  },
  {
    title: 'WEBSITE',
    items: [
      { label: 'Bosh sahifa', href: '/admin/website/homepage', icon: LayoutTemplate },
      { label: 'Sahifalar', href: '/admin/website/pages', icon: FileText },
      { label: 'Yangiliklar va maqolalar', href: '/admin/website/articles', icon: Newspaper },
      { label: 'FAQ', href: '/admin/website/faq', icon: HelpCircle },
      { label: 'Media kutubxonasi', href: '/admin/website/media', icon: ImageIcon },
      { label: 'SEO sozlamalari', href: '/admin/website/seo', icon: SearchCode },
    ],
  },
  {
    title: 'TELEGRAM BOT',
    items: [
      { label: 'Bot boshqaruvi', href: '/admin/bot/overview', icon: Bot, badge: 'Live' },
      { label: 'Xabarlar va menyular', href: '/admin/bot/messages', icon: MessageSquareCode },
      { label: 'Bot FAQ', href: '/admin/bot/faq', icon: MessagesSquare },
      { label: 'Botdan kelgan arizalar', href: '/admin/bot/leads', icon: BotMessageSquare },
      { label: 'Bildirishnomalar', href: '/admin/bot/notifications', icon: BellRing },
      { label: 'Bot statistikasi', href: '/admin/bot/stats', icon: BarChart3 },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Hisobotlar', href: '/admin/system/reports', icon: TrendingUp },
      { label: 'Xodimlar va ruxsatlar', href: '/admin/system/staff', icon: ShieldCheck },
      { label: 'Audit jurnali', href: '/admin/system/audit-logs', icon: History },
      { label: 'Sozlamalar', href: '/admin/system/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, sidebarCollapsed, setSidebarCollapsed } = useAdmin();

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 select-none ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60 flex-shrink-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 overflow-hidden text-left focus:outline-none"
        >
          {/* Logo Shield SVG */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#086641] to-[#064E3B] flex items-center justify-center p-1.5 shadow-md flex-shrink-0 border border-emerald-500/30">
            <svg viewBox="0 0 100 108" fill="none" className="w-full h-full">
              <path
                d="M6 6H94V52C94 81 50 102 50 102C50 102 6 81 6 52V6Z"
                fill="#00E599"
              />
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

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black tracking-wider uppercase text-white truncate">
                USTOZ <span className="text-emerald-400">AKADEMIYASI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF65]">
                Admin & CRM Suite
              </span>
            </div>
          )}
        </Link>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Kengaytirish' : 'Kichraytirish'}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            {!sidebarCollapsed ? (
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                {group.title}
              </div>
            ) : (
              <div className="h-[1px] bg-slate-800 mx-2 my-2" />
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  {!sidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}

                  {!sidebarCollapsed && item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] uppercase font-extrabold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex-shrink-0 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            {!sidebarCollapsed && 'Saytni ochish'}
          </span>
          {!sidebarCollapsed && <span className="text-[10px] text-slate-500">↗</span>}
        </Link>

        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow-inner">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user?.fullName || 'Administrator'}
                </p>
                <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider truncate">
                  {user?.role || 'SUPER_ADMIN'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            title="Tizimdan chiqish"
            aria-label="Tizimdan chiqish"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
