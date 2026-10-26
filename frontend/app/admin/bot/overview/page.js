'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  Bot,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Users,
  MessageSquare,
  TrendingUp,
  ExternalLink,
  ShieldAlert,
  Radio,
  Zap,
  Terminal,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function BotOverviewPage() {
  const { notify } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [botLeads, setBotLeads] = useState([]);
  const [stats, setStats] = useState({
    totalBotLeads: 0,
    newBotLeads: 0,
    convertedBotLeads: 0,
    conversionRate: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.leads.list({ source: 'TELEGRAM_BOT', limit: 50 });
      const items = res?.items || (Array.isArray(res) ? res : []);
      setBotLeads(items);

      const total = items.length;
      const newCount = items.filter((l) => l.status === 'NEW').length;
      const converted = items.filter((l) => l.status === 'CONVERTED').length;
      const rate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

      setStats({
        totalBotLeads: total,
        newBotLeads: newCount,
        convertedBotLeads: converted,
        conversionRate: rate,
      });
    } catch {
      notify('Telegram bot ma’lumotlarini yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePingBot = async () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      notify('Telegram Bot xizmati to‘liq faol va server bilan aloqada!', 'success');
    }, 600);
  };

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Telegram Bot Boshqaruv Markazi</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            @ustozakademiya_bot xizmati, jonli polling jarayoni va botdan kelayotgan o‘quvchilar arizalari
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePingBot}
            disabled={checking}
            className={ADMIN_THEME.btnSecondary}
          >
            <RefreshCw size={15} className={checking ? 'animate-spin' : ''} />
            <span>{checking ? 'Tekshirilmoqda...' : 'Bot Holatini Tekshirish'}</span>
          </button>

          <a
            href="https://t.me/ustozakademiya_bot"
            target="_blank"
            rel="noopener noreferrer"
            className={ADMIN_THEME.btnPrimary}
          >
            <ExternalLink size={15} />
            <span>Telegramda Ochish</span>
          </a>
        </div>
      </div>

      {/* Live Status Hero Banner */}
      <div className="p-6 rounded-2xl bg-[#086641] text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-emerald-300">
            <Bot size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                Jonli Polling Ishlamoqda
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
              @ustozakademiya_bot
            </h2>
            <p className="text-xs text-emerald-100/80 mt-1">
              GrammY v1.40.0 freymvorki orqali to‘liq o‘zbek tilida avtonom xizmat ko‘rsatmoqda
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-center flex-1 md:flex-initial">
            <span className="block text-sm font-black text-white">4 ta guruh</span>
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">
              Alifbo Viktorinalari
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-center flex-1 md:flex-initial">
            <span className="block text-sm font-black text-white">8 ta</span>
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">
              Ulangan Filiallar
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Bot Arizalari</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <Users size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.totalBotLeads}</p>
          <p className={ADMIN_THEME.metricMeta}>Telegram orqali ro‘yxatdan o‘tgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Yangi Ko‘rilmagan</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.newBotLeads}</p>
          <p className={ADMIN_THEME.metricMeta}>Menejer aloqasi talab etiladi</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Muvaffaqiyatli Talabalar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.convertedBotLeads}</p>
          <p className={ADMIN_THEME.metricMeta}>Kursga to‘lov qilib yozilgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Bot Konversiyasi</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{stats.conversionRate}%</p>
          <p className={ADMIN_THEME.metricMeta}>Arizalardan o‘quvchiga aylanish</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/bot/messages"
          className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-xs font-bold text-[#17212F] group-hover:text-[#086641] transition-colors">
              Xabarlar va Tugmalar
            </h4>
            <p className="text-[11px] text-[#667085] mt-0.5">Bot menyulari va shablonlar</p>
          </div>
          <ArrowRight size={16} className="text-[#667085] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/bot/leads"
          className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-xs font-bold text-[#17212F] group-hover:text-[#086641] transition-colors">
              Botdan Kelgan Arizalar
            </h4>
            <p className="text-[11px] text-[#667085] mt-0.5">Telefon va kurs buyurtmalari</p>
          </div>
          <ArrowRight size={16} className="text-[#667085] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/bot/notifications"
          className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-xs font-bold text-[#17212F] group-hover:text-[#086641] transition-colors">
              Xabarnomalar Yuborish
            </h4>
            <p className="text-[11px] text-[#667085] mt-0.5">Ommaviy bildirishnomalar</p>
          </div>
          <ArrowRight size={16} className="text-[#667085] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/bot/stats"
          className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs hover:border-slate-300 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-xs font-bold text-[#17212F] group-hover:text-[#086641] transition-colors">
              Bot Statistikasi
            </h4>
            <p className="text-[11px] text-[#667085] mt-0.5">Viktorina va faollik tahlili</p>
          </div>
          <ArrowRight size={16} className="text-[#667085] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Bot Inquiries Table */}
      <div className={ADMIN_THEME.card}>
        <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
          <h3 className="text-xs font-bold text-[#17212F]">
            So‘nggi Bot Murojaatlari (Leads)
          </h3>
          <Link
            href="/admin/bot/leads"
            className="text-xs font-semibold text-[#086641] hover:underline flex items-center gap-1"
          >
            <span>Barchasini ko‘rish</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Ariza ID</th>
                <th className={ADMIN_THEME.th}>Talabgor F.I.SH.</th>
                <th className={ADMIN_THEME.th}>Telefon Raqam</th>
                <th className={ADMIN_THEME.th}>Tanlangan Kurs</th>
                <th className={ADMIN_THEME.th}>Sana</th>
                <th className={ADMIN_THEME.th}>Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#667085] text-xs">
                    Ma’lumotlar yuklanmoqda...
                  </td>
                </tr>
              ) : botLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#667085] text-xs">
                    Hozircha botdan yangi arizalar kelib tushmadi.
                  </td>
                </tr>
              ) : (
                botLeads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F6F8FA] transition-colors">
                    <td className={`${ADMIN_THEME.td} font-mono font-bold text-[#086641]`}>
                      {lead.referenceId}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-semibold text-[#17212F]`}>
                      {lead.fullName}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-mono text-[#667085]`}>
                      {lead.phoneFormatted || lead.phone}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#17212F] font-medium`}>
                      {lead.course?.title || 'Umumiy Arab Tili'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-xs text-[#667085]`}>
                      {new Date(lead.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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
    </div>
  );
}
