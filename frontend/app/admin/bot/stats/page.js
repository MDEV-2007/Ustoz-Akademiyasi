'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  BarChart3,
  Bot,
  Users,
  CheckCircle2,
  TrendingUp,
  Clock,
  Building2,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function BotStatsPage() {
  const { notify } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [botLeads, setBotLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    scheduledCount: 0,
    attendedCount: 0,
    convertedCount: 0,
    cancelledCount: 0,
    conversionRate: 0,
    topCourses: [],
    topBranches: [],
  });

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        let items = [];
        try {
          const res = await AdminApi.leads.list({ source: 'TELEGRAM_BOT', limit: 100 });
          items = res?.items || (Array.isArray(res) ? res : res?.data || []);
        } catch {
          const fallbackRes = await AdminApi.leads.list({ limit: 100 });
          const all = fallbackRes?.items || (Array.isArray(fallbackRes) ? fallbackRes : fallbackRes?.data || []);
          items = all.filter(
            (i) => i.source === 'TELEGRAM_BOT' || i.source?.includes('BOT') || i.notes?.includes('Telegram')
          );
        }
        setBotLeads(items);

        const total = items.length;
        const newCount = items.filter((l) => l.status === 'NEW').length;
        const contactedCount = items.filter((l) => l.status === 'CONTACTED').length;
        const scheduledCount = items.filter((l) => l.status === 'SCHEDULED').length;
        const attendedCount = items.filter((l) => l.status === 'ATTENDED').length;
        const convertedCount = items.filter((l) => l.status === 'CONVERTED').length;
        const cancelledCount = items.filter((l) => l.status === 'CANCELLED').length;
        const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(1) : 0;

        // Course counts
        const courseMap = {};
        items.forEach((l) => {
          const name = l.course?.title || 'Umumiy Arab Tili';
          courseMap[name] = (courseMap[name] || 0) + 1;
        });
        const topCourses = Object.entries(courseMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        // Branch counts
        const branchMap = {};
        items.forEach((l) => {
          const name = l.branch?.name || 'Chilonzor';
          branchMap[name] = (branchMap[name] || 0) + 1;
        });
        const topBranches = Object.entries(branchMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setStats({
          total,
          newCount,
          contactedCount,
          scheduledCount,
          attendedCount,
          convertedCount,
          cancelledCount,
          conversionRate,
          topCourses,
          topBranches,
        });
      } catch (err) {
        console.warn('Bot stats calculation error:', err.message);
        notify('Bot statistikasini hisoblashda xatolik yuz berdi', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [notify]);

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Telegram Bot Analitikasi va Statistikasi</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Real vaqt rejimida bot orqali tushgan murojaatlar, viktorina ishtiroki va konversiya ko‘rsatkichlari
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Telegram Arizalari</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Bot size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.total} ta</p>
          <p className={ADMIN_THEME.metricMeta}>Bot foydalanuvchilaridan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Kutilayotgan Arizalar</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.newCount} ta</p>
          <p className={ADMIN_THEME.metricMeta}>Yangi statusdagi talabgorlar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Talabaga Aylanganlar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.convertedCount} ta</p>
          <p className={ADMIN_THEME.metricMeta}>Shartnoma tuzgan va to‘lov qilgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Bot Konversiyasi</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.conversionRate}%</p>
          <p className={ADMIN_THEME.metricMeta}>Murojaatdan mijozgacha bo‘lgan ulush</p>
        </div>
      </div>

      {/* Funnel breakdown & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel breakdown */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#086641]" />
            <span>Bot Arizalari Holati Taqsimoti</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Yangi murojaatlar (NEW)', count: stats.newCount, color: 'bg-blue-500' },
              { label: 'Bog‘lanildi (CONTACTED)', count: stats.contactedCount, color: 'bg-amber-500' },
              { label: 'Sinov darsiga belgilandi (SCHEDULED)', count: stats.scheduledCount, color: 'bg-purple-500' },
              { label: 'Darsga qatnashdi (ATTENDED)', count: stats.attendedCount, color: 'bg-teal-500' },
              { label: 'Mijozga aylandi (CONVERTED)', count: stats.convertedCount, color: 'bg-emerald-600' },
              { label: 'Bekor qilindi (CANCELLED)', count: stats.cancelledCount, color: 'bg-slate-400' },
            ].map((item, idx) => {
              const pct = stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(0) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#17212F] font-medium">{item.label}</span>
                    <span className="font-bold text-[#17212F]">
                      {item.count} ta ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F6F8FA] rounded-full overflow-hidden border border-[#E4E7EC]">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Courses from Bot */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-[#086641]" />
            <span>Bot Orqali Eng Ko‘p Tanlangan Kurslar</span>
          </h3>

          {stats.topCourses.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#667085]">
              Kurslar ma’lumotlari topilmadi.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.topCourses.map((c, idx) => {
                const pct = stats.total > 0 ? ((c.count / stats.total) * 100).toFixed(0) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17212F] truncate">{c.name}</span>
                      <span className="font-bold text-[#086641] font-mono">{c.count} ta ariza</span>
                    </div>
                    <div className="h-2 w-full bg-[#F6F8FA] rounded-full overflow-hidden border border-[#E4E7EC]">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-[#086641] rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Branches from Bot */}
      <div className={ADMIN_THEME.cardPadded}>
        <h3 className="text-sm font-bold text-[#17212F] mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-[#086641]" />
          <span>Filiallar Bo‘yicha Talablar Taqsimoti (Toshkent 8 ta filial)</span>
        </h3>

        {stats.topBranches.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#667085]">
            Filiallar taqsimoti bo‘yicha arizalar kutilmoqda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.topBranches.map((b, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#17212F] block">{b.name}</span>
                  <span className="text-[10px] text-[#667085]">Filial tanlovi</span>
                </div>
                <span className="text-base font-black text-[#086641] font-mono">{b.count} ta</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
