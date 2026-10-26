'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  Users2,
  Phone,
  Calendar,
  BookOpen,
  Building2,
  CheckCircle2,
  Search,
  Filter,
  Download,
  X,
  UserCheck,
  CreditCard,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    // Converted leads represent active paying clients in the academy
    AdminApi.leads.list({ status: 'CONVERTED' })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data || data?.items || []);
        setClients(items);
      })
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  const branches = Array.from(
    new Set(clients.map((c) => c.branch?.name).filter(Boolean))
  );

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.referenceId && c.referenceId.toLowerCase().includes(search.toLowerCase())) ||
      (c.course?.title && c.course.title.toLowerCase().includes(search.toLowerCase()));

    const matchesBranch =
      selectedBranch === 'ALL' || c.branch?.name === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>
            Mijozlar Bazasi (O‘quvchilar)
          </h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            To‘lov qilib, Ustoz Akademiyasi kurslariga to‘liq qabul qilingan rasmiy o‘quvchilar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const url = AdminApi.leads.exportCsvUrl();
              window.open(url, '_blank');
            }}
            className={ADMIN_THEME.btnSecondary}
          >
            <Download size={15} />
            <span>CSV Eksport</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Ro‘yxatdagi O‘quvchilar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <Users2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{clients.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Muvaffaqiyatli qabul qilingan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Qamrab Olingan Filiallar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{branches.length || 8}</p>
          <p className={ADMIN_THEME.metricMeta}>Toshkent bo‘ylab faol manzillar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>O‘rtacha Konversiya</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>100%</p>
          <p className={ADMIN_THEME.metricMeta}>To‘lov qilgan talabalar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Ta’lim Holati</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <GraduationCap size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>Faol Darslar</p>
          <p className={ADMIN_THEME.metricMeta}>Guruhlar shakllantirilgan</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, telefon raqam yoki ID orqali qidirish..."
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

      {/* Clients Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Talaba ID</th>
                <th className={ADMIN_THEME.th}>F.I.SH.</th>
                <th className={ADMIN_THEME.th}>Telefon Raqam</th>
                <th className={ADMIN_THEME.th}>Yozilgan Kurs</th>
                <th className={ADMIN_THEME.th}>Filial</th>
                <th className={ADMIN_THEME.th}>Qabul Sanasi</th>
                <th className={ADMIN_THEME.th}>Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-[#086641] border-t-transparent animate-spin" />
                      <span>Ma’lumotlar yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <Users2 size={32} className="text-[#667085]/40" />
                      <span className="font-semibold">Mijozlar topilmadi</span>
                      <span className="text-[11px] text-[#667085]">
                        Qidiruv so‘rovingizni o‘zgartiring yoki arizalarni mijozga aylantiring.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className="hover:bg-[#F6F8FA] transition-colors cursor-pointer group"
                  >
                    <td className={`${ADMIN_THEME.td} font-mono font-bold text-[#086641]`}>
                      {c.referenceId}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-semibold text-[#17212F] group-hover:text-[#086641] transition-colors`}>
                      {c.fullName}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-mono text-[#667085]`}>
                      {c.phoneFormatted || c.phone}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#17212F] font-medium`}>
                      {c.course?.title || 'Umumiy Arab Tili'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#667085]`}>
                      {c.branch?.name || 'Chilonzor'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#667085] text-[11px]`}>
                      {new Date(c.updatedAt || c.createdAt).toLocaleDateString('uz-UZ', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={12} /> Faol Talaba
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E4E7EC] animate-slide-left">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#086641] flex items-center justify-center font-bold text-sm border border-emerald-200">
                  {selectedClient.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17212F] leading-tight">
                    {selectedClient.fullName}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-[#086641]">
                    {selectedClient.referenceId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-xl text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                  Aloqa Ma’lumotlari
                </span>
                <div className="mt-2 p-4 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-2">
                      <Phone size={14} /> Telefon:
                    </span>
                    <a
                      href={`tel:${selectedClient.phone}`}
                      className="font-mono font-bold text-[#086641] hover:underline"
                    >
                      {selectedClient.phoneFormatted || selectedClient.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-2">
                      <Calendar size={14} /> Qabul qilingan sana:
                    </span>
                    <span className="font-semibold text-[#17212F]">
                      {new Date(selectedClient.updatedAt || selectedClient.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                  Ta’lim Yo‘nalishi
                </span>
                <div className="mt-2 p-4 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-2">
                      <BookOpen size={14} /> Tanlangan Kurs:
                    </span>
                    <span className="font-bold text-[#17212F]">
                      {selectedClient.course?.title || 'Umumiy Arab Tili'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-2">
                      <Building2 size={14} /> Filial:
                    </span>
                    <span className="font-semibold text-[#17212F]">
                      {selectedClient.branch?.name || 'Bosh Filial'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedClient.internalNotes && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Menejer Izohlari
                  </span>
                  <div className="mt-2 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                    {selectedClient.internalNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E4E7EC] bg-[#F6F8FA] flex items-center gap-3">
              <a
                href={`tel:${selectedClient.phone}`}
                className={`${ADMIN_THEME.btnPrimary} flex-1 justify-center`}
              >
                <Phone size={15} /> Qo‘ng‘iroq qilish
              </a>
              <button
                onClick={() => setSelectedClient(null)}
                className={ADMIN_THEME.btnSecondary}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
