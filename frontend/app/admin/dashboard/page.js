'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import {
  Inbox,
  UserCheck,
  CalendarCheck2,
  Clock,
  TrendingUp,
  BookOpen,
  Building2,
  Bot,
  Globe,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  Sparkles,
} from 'lucide-react';

const STATUS_CONFIG = {
  NEW: { label: 'Yangi', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  CONTACTED: { label: 'Bog‘lanildi', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  SCHEDULED: { label: 'Sinov darsi belgilandi', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ATTENDED: { label: 'Darsga qatnashdi', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  CONVERTED: { label: 'O‘quvchi bo‘ldi (To‘lov)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' },
  CANCELLED: { label: 'Bekor qilindi', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  SPAM: { label: 'Spam / Xato', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function AdminDashboardPage() {
  const { notify } = useAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('ALL'); // 'TODAY', 'WEEK', 'MONTH', 'ALL'

  const loadData = async () => {
    setLoading(true);
    try {
      let startDate;
      const now = new Date();
      if (period === 'TODAY') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startDate = today.toISOString();
      } else if (period === 'WEEK') {
        const week = new Date();
        week.setDate(now.getDate() - 7);
        startDate = week.toISOString();
      } else if (period === 'MONTH') {
        const month = new Date();
        month.setDate(now.getDate() - 30);
        startDate = month.toISOString();
      }

      const res = await AdminApi.analytics.getDashboard(startDate);
      setData(res);
    } catch (err) {
      console.error('[Dashboard Error]', err);
      notify('Dashboard ma’lumotlarini yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const summary = data?.summary || {
    totalLeads: 0,
    todayLeads: 0,
    convertedCount: 0,
    conversionRatePercent: 0,
  };

  const statusCounts = data?.statusCounts || {
    NEW: 0,
    CONTACTED: 0,
    SCHEDULED: 0,
    ATTENDED: 0,
    CONVERTED: 0,
    CANCELLED: 0,
    SPAM: 0,
  };

  const recentLeads = data?.recentLeads || [];
  const registrationsByCourse = data?.registrationsByCourse || [];
  const registrationsByBranch = data?.registrationsByBranch || [];
  const dailyTrend = data?.dailyTrend || [];

  // Calculate bot vs website sources from recent inquiries
  const botCount = recentLeads.filter((l) => l.source === 'TELEGRAM_BOT').length;
  const webCount = recentLeads.filter((l) => l.source !== 'TELEGRAM_BOT').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar: Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ustoz Akademiyasi — Operatsion Boshqaruv
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real vaqt rejimida arizalar oqimi, konversiya va filiallar monitoringi
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Period Selector Tabs */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-600">
            {[
              { id: 'ALL', label: 'Barchasi' },
              { id: 'MONTH', label: '30 kun' },
              { id: 'WEEK', label: '7 kun' },
              { id: 'TODAY', label: 'Bugun' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  period === tab.id
                    ? 'bg-white text-emerald-800 shadow-sm font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            title="Yangilash"
            aria-label="Yangilash"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-600' : ''} />
          </button>
        </div>
      </div>

      {/* 8 Primary Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Inquiries */}
        <Link
          href="/admin/crm/leads"
          className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jami Murojaatlar
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Inbox size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {summary.totalLeads}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              +{summary.todayLeads} bugun
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Barcha manbalardan kelgan arizalar</p>
        </Link>

        {/* Metric 2: New Inquiries Pending Contact */}
        <Link
          href="/admin/crm/leads?status=NEW"
          className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Yangi (Kutilayotgan)
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tight">
              {statusCounts.NEW}
            </span>
            <span className="text-xs font-medium text-slate-500">ko‘rib chiqilishi kerak</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Menejer biriktirilmagan yangi arizalar</p>
        </Link>

        {/* Metric 3: Scheduled Trial Lessons */}
        <Link
          href="/admin/crm/trial-lessons"
          className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-500/40 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sinov Darslari
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck2 size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-700 tracking-tight">
              {statusCounts.SCHEDULED}
            </span>
            <span className="text-xs font-medium text-slate-500">belgilangan</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Filiallarga tashrif kutayotgan o‘quvchilar</p>
        </Link>

        {/* Metric 4: Conversion Rate */}
        <Link
          href="/admin/crm/clients"
          className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Konversiya (To‘lov)
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
              {summary.conversionRatePercent}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {statusCounts.CONVERTED} o‘quvchi
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Arizadan haqiqiy to‘lovga aylanganlar</p>
        </Link>
      </div>

      {/* Row 2: Status Funnel + Lead Acquisition Breakdown (Web vs Telegram Bot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Funnel (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ariza Bosqichlari (CRM Voronkasi)</h3>
              <p className="text-xs text-slate-500">Barcha arizalarning joriy holati taqsimoti</p>
            </div>
            <Link
              href="/admin/crm/leads"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Batafsil CRM <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { status: 'NEW', count: statusCounts.NEW, bg: 'bg-blue-50 text-blue-700' },
              { status: 'CONTACTED', count: statusCounts.CONTACTED, bg: 'bg-amber-50 text-amber-700' },
              { status: 'SCHEDULED', count: statusCounts.SCHEDULED, bg: 'bg-purple-50 text-purple-700' },
              { status: 'ATTENDED', count: statusCounts.ATTENDED, bg: 'bg-teal-50 text-teal-700' },
              { status: 'CONVERTED', count: statusCounts.CONVERTED, bg: 'bg-emerald-50 text-emerald-800 font-bold' },
              { status: 'CANCELLED', count: statusCounts.CANCELLED, bg: 'bg-slate-100 text-slate-600' },
              { status: 'SPAM', count: statusCounts.SPAM, bg: 'bg-rose-50 text-rose-700' },
            ].map((item) => (
              <div
                key={item.status}
                className={`p-3.5 rounded-xl border border-slate-100 ${item.bg} flex flex-col justify-between`}
              >
                <span className="text-[11px] font-semibold opacity-80 truncate">
                  {STATUS_CONFIG[item.status]?.label || item.status}
                </span>
                <span className="text-2xl font-black mt-2">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Simple Visual Progress Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Umumiy oqim ulushi</span>
              <span>{summary.totalLeads} ta ariza</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(statusCounts.NEW / (summary.totalLeads || 1)) * 100}%` }}
                className="bg-blue-500 h-full"
                title={`Yangi: ${statusCounts.NEW}`}
              />
              <div
                style={{ width: `${(statusCounts.CONTACTED / (summary.totalLeads || 1)) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`Bog'lanildi: ${statusCounts.CONTACTED}`}
              />
              <div
                style={{ width: `${(statusCounts.SCHEDULED / (summary.totalLeads || 1)) * 100}%` }}
                className="bg-purple-500 h-full"
                title={`Dars belgilandi: ${statusCounts.SCHEDULED}`}
              />
              <div
                style={{ width: `${(statusCounts.CONVERTED / (summary.totalLeads || 1)) * 100}%` }}
                className="bg-emerald-500 h-full"
                title={`O'quvchi bo'ldi: ${statusCounts.CONVERTED}`}
              />
            </div>
          </div>
        </div>

        {/* Lead Source Breakdown (Web vs Telegram Bot) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Manbalar Taqsimoti</h3>
            <p className="text-xs text-slate-500 mb-5">Veb-sayt va Telegram bot solishtirmasi</p>

            <div className="space-y-4">
              {/* Telegram Bot Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Bot size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Telegram Boti</span>
                    <span className="text-[11px] text-slate-500">@ustozakademiya_bot</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-700 block">{botCount}</span>
                  <span className="text-[10px] text-slate-400">so‘nggi arizalar</span>
                </div>
              </div>

              {/* Website Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#086641] text-white flex items-center justify-center shadow-xs">
                    <Globe size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Rasmiy Veb-Sayt</span>
                    <span className="text-[11px] text-slate-500">ustozakademiyasi.uz</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-800 block">{webCount}</span>
                  <span className="text-[10px] text-slate-400">so‘nggi arizalar</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <Link href="/admin/bot/overview" className="hover:underline flex items-center gap-1">
              Bot boshqaruv paneli <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Course & Branch Popularity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-700" />
              <span>Kurslar Bo‘yicha Qiziqish</span>
            </h3>
            <Link href="/admin/academy/courses" className="text-xs font-bold text-emerald-700 hover:underline">
              Kurslarni boshqarish
            </Link>
          </div>

          {registrationsByCourse.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Ma’lumot mavjud emas</p>
          ) : (
            <div className="space-y-3">
              {registrationsByCourse.map((c) => (
                <div key={c.courseId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate">{c.courseTitle}</span>
                    <span className="font-bold text-slate-900">{c.count} ta ariza</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, (c.count / (summary.totalLeads || 1)) * 100)}%`,
                      }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Branch Performance */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={16} className="text-emerald-700" />
              <span>Filiallar Bo‘yicha Taqsimot (Toshkent 8 ta filial)</span>
            </h3>
            <Link href="/admin/academy/branches" className="text-xs font-bold text-emerald-700 hover:underline">
              Filiallar ro‘yxati
            </Link>
          </div>

          {registrationsByBranch.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Ma’lumot mavjud emas</p>
          ) : (
            <div className="space-y-3">
              {registrationsByBranch.map((b) => (
                <div key={b.branchId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate">{b.branchName}</span>
                    <span className="font-bold text-slate-900">{b.count} ta</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, (b.count / (summary.totalLeads || 1)) * 100)}%`,
                      }}
                      className="h-full bg-teal-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Recent Inquiries Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">So‘nggi Murojaatlar</h3>
            <p className="text-xs text-slate-500">Eng oxirgi kelib tushgan arizalar va ularning holati</p>
          </div>
          <Link
            href="/admin/crm/leads"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Barcha arizalarni ochish</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-3">Ariza ID</th>
                <th className="py-3 px-3">Mijoz Ismi</th>
                <th className="py-3 px-3">Telefon</th>
                <th className="py-3 px-3">Tanlangan Kurs</th>
                <th className="py-3 px-3">Filial</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Vaqt</th>
                <th className="py-3 px-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Arizalar topilmadi
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {lead.referenceId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {lead.fullName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {lead.phoneFormatted}
                    </td>
                    <td className="py-3 px-3 text-slate-800">
                      {lead.course?.title || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {lead.branch?.name || '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-bold ${
                          STATUS_CONFIG[lead.status]?.color || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {STATUS_CONFIG[lead.status]?.label || lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString('uz-UZ', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/crm/leads?id=${lead.id}`}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                      >
                        Ko‘rish
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
