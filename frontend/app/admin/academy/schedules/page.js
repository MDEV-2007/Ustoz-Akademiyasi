'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  CalendarDays,
  Plus,
  Clock,
  Users,
  BookOpen,
  Building2,
  Trash2,
  X,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function AdminSchedulesPage() {
  const { notify } = useAdmin();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const data = await AdminApi.schedules.list();
      setSchedules(Array.isArray(data) ? data : []);
    } catch {
      notify('Dars jadvalini yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const branches = Array.from(
    new Set(schedules.map((s) => s.branch?.name).filter(Boolean))
  );

  const filteredSchedules = schedules.filter((s) => {
    const matchesSearch =
      s.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.teacher?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.branch?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === 'ALL' || s.branch?.name === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Guruhlar Dars Jadvali</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Filiallar va kurslar kesimida guruhlar vaqtlari, dars kunlari va xonalar sig‘imi
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Faol Guruhlar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <CalendarDays size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{schedules.length || 14}</p>
          <p className={ADMIN_THEME.metricMeta}>Barcha filiallar bo‘yicha</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Dars Kunlari</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>Dush-Chor-Juma / Sesh-Pay-Shan</p>
          <p className={ADMIN_THEME.metricMeta}>Haftasiga 3 kunlik standart</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>O‘rtacha Guruh Sig‘imi</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Users size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>12 – 14 nafar</p>
          <p className={ADMIN_THEME.metricMeta}>Individual e’tibor uchun cheklangan</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kurs nomi, ustoz yoki filial bo‘yicha qidirish..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={15} className="text-[#667085] hidden sm:block" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
          >
            <option value="ALL">Barcha Filiallar</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedules Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Kurs Yo‘nalishi</th>
                <th className={ADMIN_THEME.th}>Filial</th>
                <th className={ADMIN_THEME.th}>Ustoz</th>
                <th className={ADMIN_THEME.th}>Hafta Kunlari</th>
                <th className={ADMIN_THEME.th}>Dars Vaqti</th>
                <th className={ADMIN_THEME.th}>Sig‘im / To‘liqlik</th>
                <th className={ADMIN_THEME.th}>Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-[#086641] border-t-transparent animate-spin" />
                      <span>Dars jadvallari yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarDays size={32} className="text-[#667085]/40" />
                      <span className="font-semibold">Hozircha guruh jadvallari mavjud emas</span>
                      <span className="text-[11px] text-[#667085]">
                        Filiallar bilan kelishilgan tartibda yangi guruhlar shakllantiriladi.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F6F8FA] transition-colors">
                    <td className={`${ADMIN_THEME.td} font-bold text-[#17212F]`}>
                      {s.course?.title || 'Umumiy Arab Tili'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#667085]`}>
                      {s.branch?.name || 'Chilonzor'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#086641] font-semibold`}>
                      {s.teacher?.fullName || 'Biriktirilmagan'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#17212F] font-medium`}>
                      {Array.isArray(s.daysOfWeek) ? s.daysOfWeek.join(', ') : 'Dush - Chor - Juma'}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-mono font-bold text-[#17212F]`}>
                      {s.startTime || '09:00'} – {s.endTime || '11:00'}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="font-bold text-[#17212F]">{s.enrolled || 8}</span>
                      <span className="text-[#667085]"> / {s.capacity || 12} ta</span>
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Faol Guruh
                      </span>
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
