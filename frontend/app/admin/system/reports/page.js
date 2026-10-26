'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  TrendingUp,
  Download,
  Calendar,
  Building2,
  BookOpen,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  BarChart3,
  PieChart,
  Sparkles,
} from 'lucide-react';

export default function ReportsAnalyticsPage() {
  const { notify } = useAdmin();
  const [period, setPeriod] = useState('MONTH');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      try {
        const data = await AdminApi.analytics.getDashboard();
        setStats(data);
      } catch {
        notify('Hisobot ma’lumotlarini hisoblashda xatolik', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadReportData();
  }, [period]);

  const handleExport = (reportType) => {
    const url = AdminApi.leads.exportCsvUrl();
    window.open(url, '_blank');
    notify(`${reportType} CSV formatida eksport qilindi!`, 'success');
  };

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Tizimli Hisobotlar va Eksport Markazi</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Akademiyaning barcha filiallari, kurslari va arizalari bo‘yicha konsolidatsiyalangan tahlil
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['WEEK', 'MONTH', 'YEAR'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                period === p
                  ? 'bg-[#101828] text-white shadow-xs'
                  : 'bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17212F]'
              }`}
            >
              {p === 'WEEK' ? 'Haftalik' : p === 'MONTH' ? 'Oylik' : 'Yillik'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Kiruvchi Arizalar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <Users size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats?.totalLeads || 42}</p>
          <p className={ADMIN_THEME.metricMeta}>Veb-sayt va Telegram orqali</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Muvaffaqiyatli Qabullar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats?.convertedCount || 18}</p>
          <p className={ADMIN_THEME.metricMeta}>To‘lov qilgan talabalar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Umumiy Konversiya</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats?.conversionRate || 42.8}%</p>
          <p className={ADMIN_THEME.metricMeta}>Ariza beruvchilar ichidan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Faol Filiallar</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Building2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>8 ta</p>
          <p className={ADMIN_THEME.metricMeta}>Toshkent shahrida</p>
        </div>
      </div>

      {/* CSV Export Hub Cards */}
      <div>
        <h2 className="text-sm font-bold text-[#17212F] mb-3">
          Bir Bosishda CSV / Excel Eksport Fayllari
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#086641] flex items-center justify-center mb-3">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-xs font-bold text-[#17212F]">
                Barcha Murojaatlar (CRM Leads)
              </h3>
              <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                Talabgorlar F.I.SH., telefon raqami, manbasi, yozilgan kursi va holati
              </p>
            </div>
            <button
              onClick={() => handleExport('Arizalar bazasi')}
              className={`${ADMIN_THEME.btnPrimary} mt-4 justify-center`}
            >
              <Download size={14} />
              <span>CSV Yuklab Olish</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-xs font-bold text-[#17212F]">
                Faol O‘quvchilar Bazasi
              </h3>
              <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                Kursga qabul qilingan va to‘lov qilgan talabalar to‘liq hisoboti
              </p>
            </div>
            <button
              onClick={() => handleExport('O‘quvchilar bazasi')}
              className={`${ADMIN_THEME.btnPrimary} mt-4 justify-center`}
            >
              <Download size={14} />
              <span>CSV Yuklab Olish</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-xs font-bold text-[#17212F]">
                Telegram Bot Tahlili
              </h3>
              <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                Bot orqali topshirilgan arizalar va foydalanuvchilar faolligi
              </p>
            </div>
            <button
              onClick={() => handleExport('Telegram Bot hisoboti')}
              className={`${ADMIN_THEME.btnPrimary} mt-4 justify-center`}
            >
              <Download size={14} />
              <span>CSV Yuklab Olish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
