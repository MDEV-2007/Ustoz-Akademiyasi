'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  Inbox,
  Search,
  Filter,
  Download,
  Phone,
  UserCheck,
  Calendar,
  Clock,
  MessageSquare,
  Bot,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  History,
  Send,
  Building2,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Barcha statuslar' },
  { value: 'NEW', label: 'Yangi' },
  { value: 'CONTACTED', label: 'Bog‘lanildi' },
  { value: 'CALLBACK', label: 'Qayta qo‘ng‘iroq' },
  { value: 'INTERESTED', label: 'Qiziqmoqda' },
  { value: 'TRIAL_BOOKED', label: 'Sinov darsi belgilandi' },
  { value: 'ENROLLED', label: 'Qabul qilindi (Talaba)' },
  { value: 'NOT_INTERESTED', label: 'Qiziqmadi' },
  { value: 'UNREACHABLE', label: 'Bog‘lanib bo‘lmadi' },
  { value: 'DUPLICATE', label: 'Takroriy ariza' },
  { value: 'SCHEDULED', label: 'Sinov darsi' },
  { value: 'ATTENDED', label: 'Qatnashdi' },
  { value: 'CONVERTED', label: 'Talaba bo‘ldi (To‘lov)' },
  { value: 'CANCELLED', label: 'Bekor qilindi' },
  { value: 'SPAM', label: 'Spam / Noto‘g‘ri' },
];

const STATUS_BADGES = {
  NEW: { label: 'Yangi', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  CONTACTED: { label: 'Bog‘lanildi', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  CALLBACK: { label: 'Qayta qo‘ng‘iroq', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  INTERESTED: { label: 'Qiziqmoqda', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  TRIAL_BOOKED: { label: 'Sinov darsi', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ENROLLED: { label: 'Qabul qilindi', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' },
  NOT_INTERESTED: { label: 'Qiziqmadi', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  UNREACHABLE: { label: 'Bog‘lanib bo‘lmadi', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  DUPLICATE: { label: 'Takroriy', color: 'bg-yellow-50 text-yellow-800 border-yellow-300' },
  SCHEDULED: { label: 'Sinov darsi', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ATTENDED: { label: 'Qatnashdi', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  CONVERTED: { label: 'Talaba bo‘ldi', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' },
  CANCELLED: { label: 'Bekor qilindi', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  SPAM: { label: 'Spam / Xato', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

function LeadsContent() {
  const searchParams = useSearchParams();
  const { notify } = useAdmin();

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [source, setSource] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  // Sync when search URL param changes
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== undefined) {
      setSearch(q);
    }
  }, [searchParams]);

  // Data state
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Status update form state inside drawer
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Load leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AdminApi.leads.list({
        search,
        status: status !== 'ALL' ? status : undefined,
        source: source !== 'ALL' ? source : undefined,
        page,
        limit,
      });
      const items = Array.isArray(data) ? data : (data?.data || data?.items || []);
      setLeads(items);
    } catch (err) {
      console.error('[Fetch Leads Error]', err);
      notify('Arizalarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, status, source, page, limit, notify]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Open lead detail
  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setStatusComment('');
    setInternalNotes(lead.internalNotes || '');
    setDrawerOpen(true);
  };

  // Handle status update
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLead || !newStatus) return;

    setUpdating(true);
    try {
      await AdminApi.leads.updateStatus(selectedLead.id, newStatus, statusComment);
      notify(`Status «${STATUS_BADGES[newStatus]?.label || newStatus}» ga yangilandi`, 'success');
      setDrawerOpen(false);
      fetchLeads();
    } catch (err) {
      notify(err.message || 'Statusni yangilashda xatolik', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Handle notes update
  const handleNotesSubmit = async () => {
    if (!selectedLead) return;
    setUpdating(true);
    try {
      await AdminApi.leads.updateNotes(selectedLead.id, internalNotes);
      notify('Ichki qaydlar saqlandi', 'success');
      fetchLeads();
    } catch (err) {
      notify(err.message || 'Qaydlarni saqlashda xatolik', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Handle Telegram notification retry
  const handleRetryTelegram = async () => {
    if (!selectedLead) return;
    setUpdating(true);
    try {
      const res = await AdminApi.leads.retryNotification(selectedLead.id);
      setSelectedLead((prev) => ({ ...prev, ...res }));
      notify('Telegram operator kanaliga xabarnoma muvaffaqiyatli yuborildi!', 'success');
      fetchLeads();
    } catch (err) {
      notify(err.message || 'Telegramga yuborishda xatolik yuz berdi', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const newCount = leads.filter((l) => l.status === 'NEW').length;
  const scheduledCount = leads.filter((l) => l.status === 'SCHEDULED' || l.status === 'ATTENDED').length;
  const convertedCount = leads.filter((l) => l.status === 'CONVERTED').length;

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Top Header & Export */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>
            Murojaatlar va Arizalar (CRM)
          </h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Veb-sayt va Telegram bot orqali kelib tushgan barcha arizalar yagona boshqaruv bazasi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={AdminApi.leads.exportCsvUrl({
              status: status !== 'ALL' ? status : undefined,
              source: source !== 'ALL' ? source : undefined,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className={ADMIN_THEME.btnSecondary}
          >
            <Download size={15} />
            <span>CSV Eksport</span>
          </a>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Arizalar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <Inbox size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{leads.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Barcha manbalardan kelgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Yangi (Ko‘rilmagan)</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{newCount}</p>
          <p className={ADMIN_THEME.metricMeta}>Tezkor qo‘ng‘iroq talab etiladi</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Sinov Darsida</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{scheduledCount}</p>
          <p className={ADMIN_THEME.metricMeta}>Belgilangan yoki qatnashgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Muvaffaqiyatli Talabalar</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{convertedCount}</p>
          <p className={ADMIN_THEME.metricMeta}>Kursga to‘lov qilib yozilgan</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish (ism, telefon, ID)..."
              className={`${ADMIN_THEME.input} pr-8`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                title="Tozalash"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={ADMIN_THEME.select}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={ADMIN_THEME.select}
            >
              <option value="ALL">Barcha manbalar</option>
              <option value="TELEGRAM_BOT">Telegram Boti (@ustozakademiya_bot)</option>
              <option value="WEBSITE">Rasmiy Veb-Sayt</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div>
            <button
              onClick={() => {
                setSearch('');
                setStatus('ALL');
                setSource('ALL');
                setPage(1);
              }}
              className="w-full h-10 rounded-xl bg-[#F6F8FA] hover:bg-[#E4E7EC] text-[#344054] font-semibold text-xs transition-colors cursor-pointer border border-[#E4E7EC]"
            >
              Filtrlarni tozalash
            </button>
          </div>
        </div>
      </div>

      {/* Main CRM Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Ariza ID</th>
                <th className={ADMIN_THEME.th}>Mijoz Ismi</th>
                <th className={ADMIN_THEME.th}>Telefon</th>
                <th className={ADMIN_THEME.th}>Kurs</th>
                <th className={ADMIN_THEME.th}>Filial</th>
                <th className={ADMIN_THEME.th}>Manba</th>
                <th className={ADMIN_THEME.th}>Holat</th>
                <th className={ADMIN_THEME.th}>Sana</th>
                <th className={`${ADMIN_THEME.th} text-right`}>Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-[#086641] border-t-transparent animate-spin" />
                      <span>Arizalar yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox size={32} className="text-[#667085]/40" />
                      <span className="font-semibold">Murojaatlar topilmadi</span>
                      <span className="text-[11px] text-[#667085]">
                        Qidiruv so‘rovi yoki filtrlarni o‘zgartirib ko‘ring.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const badge = STATUS_BADGES[lead.status] || {
                    label: lead.status,
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenLead(lead)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      <td className={`${ADMIN_THEME.td} font-mono font-bold text-[#086641]`}>
                        {lead.referenceId}
                      </td>
                      <td className={`${ADMIN_THEME.td} font-bold text-[#17212F] group-hover:text-[#086641] transition-colors`}>
                        {lead.fullName}
                      </td>
                      <td className={`${ADMIN_THEME.td} font-mono text-[#667085]`}>
                        {lead.phoneFormatted || lead.phone}
                      </td>
                      <td className={`${ADMIN_THEME.td} text-[#17212F] font-medium`}>
                        {lead.course?.title || 'Umumiy dars'}
                      </td>
                      <td className={`${ADMIN_THEME.td} text-[#667085]`}>
                        {lead.branch?.name || 'Markaziy'}
                      </td>
                      <td className={ADMIN_THEME.td}>
                        {lead.source === 'TELEGRAM_BOT' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Bot size={11} /> Bot
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Globe size={11} /> Sayt
                          </span>
                        )}
                      </td>
                      <td className={ADMIN_THEME.td}>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className={`${ADMIN_THEME.td} text-xs text-[#667085] whitespace-nowrap`}>
                        {new Date(lead.createdAt).toLocaleDateString('uz-UZ', {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className={`${ADMIN_THEME.td} text-right`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLead(lead);
                          }}
                          className="p-1.5 rounded-lg text-[#667085] hover:text-[#086641] hover:bg-[#F2F4F7] transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer for Lead Details and Status Updates */}
      {drawerOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E4E7EC] animate-slide-left">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="text-base font-bold text-[#17212F] leading-tight">
                  {selectedLead.fullName}
                </h3>
                <span className="font-mono text-xs font-bold text-[#086641]">
                  {selectedLead.referenceId}
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Card */}
              <div className="p-4 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <Phone size={14} /> Telefon:
                  </span>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="font-mono font-bold text-[#086641] hover:underline"
                  >
                    {selectedLead.phoneFormatted || selectedLead.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <Calendar size={14} /> Yuborilgan sana:
                  </span>
                  <span className="font-semibold text-[#17212F]">
                    {new Date(selectedLead.createdAt).toLocaleString('uz-UZ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <Building2 size={14} /> Tanlangan filial:
                  </span>
                  <span className="font-bold text-[#17212F]">
                    {selectedLead.branch?.name || 'Markaziy'}
                  </span>
                </div>

                {/* Telegram Operator Channel Status */}
                <div className="pt-2 border-t border-[#E4E7EC] flex items-center justify-between text-xs">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <Send size={14} className="text-[#086641]" /> Telegram Xabarnoma:
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedLead.notificationStatus === 'SENT' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={11} /> Yetkazildi {selectedLead.telegramMessageId ? `(#${selectedLead.telegramMessageId})` : ''}
                      </span>
                    ) : selectedLead.notificationStatus === 'FAILED' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200" title={selectedLead.notificationError}>
                          <AlertCircle size={11} /> Xatolik
                        </span>
                        <button
                          type="button"
                          onClick={handleRetryTelegram}
                          disabled={updating}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#086641] text-white hover:bg-[#073F31] transition-colors cursor-pointer"
                        >
                          Qayta yuborish
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Kutilmoqda
                        </span>
                        <button
                          type="button"
                          onClick={handleRetryTelegram}
                          disabled={updating}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#086641] text-white hover:bg-[#073F31] transition-colors cursor-pointer"
                        >
                          Yuborish
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {selectedLead.telegramUsername && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-1.5">
                      <Bot size={14} /> Telegram Profil:
                    </span>
                    <a
                      href={`https://t.me/${selectedLead.telegramUsername.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      @{selectedLead.telegramUsername.replace('@', '')} <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Statusni Yangilash
                </h4>

                <div>
                  <label className={ADMIN_THEME.label}>Yangi Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={ADMIN_THEME.select}
                  >
                    {STATUS_OPTIONS.filter((o) => o.value !== 'ALL').map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={ADMIN_THEME.label}>O‘zgarish Izohi (Tarixda saqlanadi)</label>
                  <input
                    type="text"
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Masalan: Telefon orqali bog‘lanildi, darsga rozi bo‘ldi"
                    className={ADMIN_THEME.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className={`${ADMIN_THEME.btnPrimary} w-full justify-center`}
                >
                  <CheckCircle2 size={15} />
                  <span>{updating ? 'Saqlanmoqda...' : 'Statusni Saqlash'}</span>
                </button>
              </form>

              {/* Internal Notes */}
              <div className="space-y-3 pt-4 border-t border-[#E4E7EC]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Menejer Qaydlari (Ichki Izohlar)
                </h4>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Mijoz haqidagi maxsus eslatmalar, o‘qish maqsadi, qulay vaqtlari..."
                  className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                />
                <button
                  onClick={handleNotesSubmit}
                  disabled={updating}
                  className={`${ADMIN_THEME.btnSecondary} w-full justify-center`}
                >
                  <span>Qaydlarni Saqlash</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E4E7EC] bg-[#F8FAFC] flex items-center justify-between">
              <a
                href={`tel:${selectedLead.phone}`}
                className={ADMIN_THEME.btnPrimary}
              >
                <Phone size={15} />
                <span>Qo‘ng‘iroq Qilish</span>
              </a>

              <button
                onClick={() => setDrawerOpen(false)}
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

export default function AdminLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#086641] border-t-transparent animate-spin mx-auto mb-2" />
          <span className="text-xs text-[#667085]">Arizalar yuklanmoqda...</span>
        </div>
      }
    >
      <LeadsContent />
    </Suspense>
  );
}
