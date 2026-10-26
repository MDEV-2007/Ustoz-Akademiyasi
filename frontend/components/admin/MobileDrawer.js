'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import {
  X,
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
  LogOut,
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

export default function MobileDrawer() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, user, logout } = useAdmin();

  if (!mobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] h-full bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-300">
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-xs">
              UA
            </div>
            <span className="font-bold text-white text-sm">Ustoz Akademiyasi</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-[10px] text-emerald-400 truncate">{user?.role || 'SUPER_ADMIN'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
