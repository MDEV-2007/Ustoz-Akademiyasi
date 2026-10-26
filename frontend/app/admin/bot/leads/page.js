'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  BotMessageSquare,
  Search,
  Filter,
  Download,
  Phone,
  Send,
  Calendar,
  Building2,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Loader2,
  Edit3,
} from 'lucide-react';

export default function BotLeadsManager() {
  const { notify } = useAdmin();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Drawer / Detail modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadBotLeads = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.leads.list({ source: 'TELEGRAM_BOT', limit: 100 });
      const items = res?.items || (Array.isArray(res) ? res : res?.data || []);
      setLeads(items);
    } catch (err) {
      console.warn('Bot leads load error, attempting fallback:', err.message);
      try {
        const fallbackRes = await AdminApi.leads.list({ limit: 100 });
        const allItems = fallbackRes?.items || (Array.isArray(fallbackRes) ? fallbackRes : fallbackRes?.data || []);
        const botItems = allItems.filter(
          (i) => i.source === 'TELEGRAM_BOT' || i.source?.includes('BOT') || i.notes?.includes('Telegram')
        );
        setLeads(botItems.length > 0 ? botItems : allItems);
      } catch (fallbackErr) {
        notify('Bot arizalarini yuklashda xatolik yuz berdi.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBotLeads();
  }, []);

  const openLeadDrawer = (lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setInternalNotes(lead.internalNotes || '');
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSavingNote(true);
    try {
      await AdminApi.leads.updateStatus(selectedLead.id, newStatus, internalNotes);
      notify('Ariza holati muvaffaqiyatli yangilandi!', 'success');
      setSelectedLead(null);
      loadBotLeads();
    } catch (err) {
      notify(err.message || 'Yangilashda xatolik', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      (lead.referenceId && lead.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Botdan Kelgan Arizalar (Bot Leads)</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Telegram boti orqali qoldirilgan barcha arizalar, telefon raqamlar va talabgorlar
          </p>
        </div>

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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Bot Murojaatlari</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <BotMessageSquare size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{leads.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Telegram kanali orqali kelgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Yangi Ko‘rilmagan</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>
            {leads.filter((l) => l.status === 'NEW').length}
          </p>
          <p className={ADMIN_THEME.metricMeta}>Tezkor qo‘ng‘iroq talab qilinadi</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Darsga Yozilganlar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>
            {leads.filter((l) => l.status === 'CONVERTED').length}
          </p>
          <p className={ADMIN_THEME.metricMeta}>To‘lov qilgan talabalar</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <option value="NEW">Yangi (New)</option>
            <option value="CONTACTED">Bog‘lanildi (Contacted)</option>
            <option value="SCHEDULED">Sinov darsi (Scheduled)</option>
            <option value="CONVERTED">Mijozga aylandi (Converted)</option>
            <option value="ARCHIVED">Arxivlangan (Archived)</option>
          </select>
        </div>
      </div>

      {/* Bot Leads Table */}
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
                <th className={ADMIN_THEME.th}>Yuborilgan Vaqt</th>
                <th className={ADMIN_THEME.th}>Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085] text-xs">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085] text-xs">
                    Botdan arizalar topilmadi.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => openLeadDrawer(lead)}
                    className="hover:bg-[#F6F8FA] transition-colors cursor-pointer group"
                  >
                    <td className={`${ADMIN_THEME.td} font-mono font-bold text-[#086641]`}>
                      {lead.referenceId}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-semibold text-[#17212F] group-hover:text-[#086641] transition-colors`}>
                      {lead.fullName}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-mono text-[#667085]`}>
                      {lead.phoneFormatted || lead.phone}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#17212F] font-medium`}>
                      {lead.course?.title || 'Umumiy Arab Tili'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#667085]`}>
                      {lead.branch?.name || 'Chilonzor'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-xs text-[#667085]`}>
                      {new Date(lead.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F6F8FA] text-[#17212F] border border-[#E4E7EC]">
                        {lead.status}
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
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E4E7EC] animate-slide-left">
            <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <div>
                <h3 className="text-sm font-bold text-[#17212F]">
                  {selectedLead.fullName}
                </h3>
                <span className="font-mono text-xs font-semibold text-[#086641]">
                  {selectedLead.referenceId}
                </span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="p-4 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Telefon raqami:</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-mono font-bold text-[#086641]">
                    {selectedLead.phoneFormatted || selectedLead.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Manba:</span>
                  <span className="font-semibold text-[#17212F]">Telegram Bot (@ustozakademiya_bot)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Tanlangan kurs:</span>
                  <span className="font-semibold text-[#17212F]">{selectedLead.course?.title || 'Umumiy Arab Tili'}</span>
                </div>
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Ariza Holatini O‘zgartirish</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className={ADMIN_THEME.select}
                >
                  <option value="NEW">Yangi (New)</option>
                  <option value="CONTACTED">Bog‘lanildi (Contacted)</option>
                  <option value="SCHEDULED">Sinov darsi (Scheduled)</option>
                  <option value="ATTENDED">Darsga qatnashdi (Attended)</option>
                  <option value="CONVERTED">Mijozga aylandi (Converted)</option>
                  <option value="ARCHIVED">Arxivlangan (Archived)</option>
                </select>
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Ichki Izohlar va Eslatmalar</label>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Mijoz bilan gaplashilgan tafsilotlar yoki qulay vaqt haqida izoh..."
                  className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                />
              </div>

              <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-end gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className={`${ADMIN_THEME.btnSecondary} flex-1 justify-center`}
                >
                  <Phone size={14} /> Qo‘ng‘iroq
                </a>
                <button type="submit" disabled={savingNote} className={ADMIN_THEME.btnPrimary}>
                  <Save size={14} />
                  <span>{savingNote ? 'Saqlanmoqda...' : 'Saqlash'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
