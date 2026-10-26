'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  CalendarCheck2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Building2,
  BookOpen,
  Filter,
  UserCheck,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminTrialLessonsPage() {
  const { notify } = useAdmin();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadLessons = () => {
    setLoading(true);
    // Fetch both SCHEDULED and ATTENDED leads
    Promise.all([
      AdminApi.leads.list({ status: 'SCHEDULED' }),
      AdminApi.leads.list({ status: 'ATTENDED' }),
    ])
      .then(([scheduled, attended]) => {
        const s = Array.isArray(scheduled) ? scheduled : (scheduled?.data || scheduled?.items || []);
        const a = Array.isArray(attended) ? attended : (attended?.data || attended?.items || []);
        setLessons([...s, ...a]);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const handleMarkAttended = async (id) => {
    try {
      await AdminApi.leads.updateStatus(id, 'ATTENDED', 'Sinov darsiga qatnashdi');
      notify('Darsga qatnashgan deb belgilandi', 'success');
      loadLessons();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleMarkConverted = async (id) => {
    try {
      await AdminApi.leads.updateStatus(id, 'CONVERTED', 'Sinov darsidan so‘ng kursga to‘lov qildi');
      notify('Muvaffaqiyatli o‘quvchiga aylandi!', 'success');
      loadLessons();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const filtered = lessons.filter((l) => {
    const matchesSearch =
      l.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      (l.referenceId && l.referenceId.toLowerCase().includes(search.toLowerCase())) ||
      (l.course?.title && l.course.title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || l.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const scheduledCount = lessons.filter((l) => l.status === 'SCHEDULED').length;
  const attendedCount = lessons.filter((l) => l.status === 'ATTENDED').length;

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>
            Sinov Darslari Jadvali va Davomati
          </h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Filiallarga biriktirilgan bepul sinov darsi ishtirokchilarini qabul qilish va konversiya boshqaruvi
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Ro‘yxatga Olingan</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <CalendarCheck2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{lessons.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Sinov darsiga yozilganlar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Kutilayotgan Darslar</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{scheduledCount}</p>
          <p className={ADMIN_THEME.metricMeta}>Bugun va yaqin kunlarda</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Darsga Qatnashganlar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{attendedCount}</p>
          <p className={ADMIN_THEME.metricMeta}>To‘lovga tayyor talabgorlar</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Talabgor ismi, telefon yoki ID bo‘yicha..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={15} className="text-[#667085] hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
          >
            <option value="ALL">Barcha Holatlar</option>
            <option value="SCHEDULED">Kutilayotgan (Scheduled)</option>
            <option value="ATTENDED">Qatnashgan (Attended)</option>
          </select>
        </div>
      </div>

      {/* Trial Lessons Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Ariza ID</th>
                <th className={ADMIN_THEME.th}>Talabgor F.I.SH.</th>
                <th className={ADMIN_THEME.th}>Telefon Raqam</th>
                <th className={ADMIN_THEME.th}>Tanlangan Kurs</th>
                <th className={ADMIN_THEME.th}>Filial</th>
                <th className={ADMIN_THEME.th}>Qulay Vaqt</th>
                <th className={ADMIN_THEME.th}>Holat</th>
                <th className={`${ADMIN_THEME.th} text-right`}>Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-[#086641] border-t-transparent animate-spin" />
                      <span>Sinov darslari yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarCheck2 size={32} className="text-[#667085]/40" />
                      <span className="font-semibold">Rejalashtirilgan sinov darslari topilmadi</span>
                      <span className="text-[11px] text-[#667085]">
                        Arizalar bo‘limidan yangi arizalarni sinov darsiga rejalashtirishingiz mumkin.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F6F8FA] transition-colors">
                    <td className={`${ADMIN_THEME.td} font-mono font-bold text-[#086641]`}>
                      {l.referenceId}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-semibold text-[#17212F]`}>
                      {l.fullName}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-mono text-[#667085]`}>
                      {l.phoneFormatted || l.phone}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#17212F] font-medium`}>
                      {l.course?.title || 'Umumiy Arab Tili'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#667085]`}>
                      {l.branch?.name || 'Chilonzor'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#667085] text-xs font-mono`}>
                      {l.preferredTime || '14:00 – 16:00'}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      {l.status === 'SCHEDULED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock size={12} /> Kutilmoqda
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <UserCheck size={12} /> Qatnashdi
                        </span>
                      )}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        {l.status === 'SCHEDULED' && (
                          <button
                            onClick={() => handleMarkAttended(l.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
                          >
                            <UserCheck size={13} />
                            <span>Keldi</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleMarkConverted(l.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-300"
                        >
                          <CheckCircle2 size={13} />
                          <span>Mijozga aylantirish</span>
                        </button>
                      </div>
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
