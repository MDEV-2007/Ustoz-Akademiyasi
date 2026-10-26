'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  BellRing,
  Send,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Sparkles,
  ShieldCheck,
  History,
} from 'lucide-react';

const SENT_HISTORY = [
  {
    id: 'n-1',
    title: 'Yangi guruhlar ochilishi e’loni',
    audience: 'Barcha Telegram foydalanuvchilari (480 ta)',
    sentAt: '20.10.2026, 15:30',
    status: 'DELIVERED',
    deliveredCount: 468,
    failedCount: 12,
  },
  {
    id: 'n-2',
    title: 'Bepul ochiq darsga taklifnoma',
    audience: 'Sinov darsiga yozilganlar (45 ta)',
    sentAt: '18.10.2026, 11:00',
    status: 'DELIVERED',
    deliveredCount: 45,
    failedCount: 0,
  },
];

export default function BotNotificationsManager() {
  const { notify } = useAdmin();
  const [history, setHistory] = useState(SENT_HISTORY);
  const [audience, setAudience] = useState('ALL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    setTimeout(() => {
      const newRecord = {
        id: `n-${Date.now()}`,
        title,
        audience:
          audience === 'ALL'
            ? 'Barcha obunachilar (480+ ta)'
            : 'Tanlangan auditoriya guruhi',
        sentAt: 'Hozir, 01:25',
        status: 'DELIVERED',
        deliveredCount: 480,
        failedCount: 0,
      };

      setHistory([newRecord, ...history]);
      setTitle('');
      setMessage('');
      setImageUrl('');
      setSending(false);
      notify('Xabarnoma muvaffaqiyatli jo‘natildi!', 'success');
    }, 1200);
  };

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Telegram Bildirishnomalar va Broadcast</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Bot foydalanuvchilariga yangiliklar, chegirmalar va yangi guruhlar e’lonini ommaviy yuborish
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Obunachilar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <Users size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>480+ kishi</p>
          <p className={ADMIN_THEME.metricMeta}>Botni faollashtirganlar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>O‘rtacha Yetkazish</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>98.5%</p>
          <p className={ADMIN_THEME.metricMeta}>Muvaffaqiyatli yetkazilgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Yuborilgan Xabarlar</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BellRing size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{history.length} ta kampaniya</p>
          <p className={ADMIN_THEME.metricMeta}>Arxivda saqlangan</p>
        </div>
      </div>

      {/* Compose and Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className={`lg:col-span-2 ${ADMIN_THEME.cardPadded}`}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">
            Yangi Xabarnoma Yozish
          </h3>
          <p className="text-xs text-[#667085] mb-5">
            Xabar darhol bot foydalanuvchilarining Telegramiga push-bildirishnoma bilan yuboriladi
          </p>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className={ADMIN_THEME.label}>Auditoriyani Tanlang</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className={ADMIN_THEME.select}
              >
                <option value="ALL">Barcha Telegram Foydalanuvchilari (480 ta)</option>
                <option value="LEADS">Faqat Arizachilar (Sinov darsiga yozilganlar)</option>
                <option value="ACTIVE_STUDENTS">Faol To‘lov Qilgan O‘quvchilar</option>
              </select>
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Xabarnoma Sarlavhasi *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Arab tili yangi guruhlariga qabul boshlandi!"
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Rasm Havolasi (Ixtiyoriy Banner URL)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Xabar Matni *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Xabar matnini kiriting. O‘quvchilarni jalb etuvchi aniq ma’lumotlar yozing..."
                className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
              />
            </div>

            <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-end">
              <button
                type="submit"
                disabled={sending}
                className={ADMIN_THEME.btnPrimary}
              >
                <Send size={15} />
                <span>{sending ? 'Yuborilmoqda...' : 'Xabarnomani Yuborish'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Telegram Message Mockup Preview */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
            <span className="text-xs font-bold text-[#17212F] block mb-3">
              Telegramda Ko‘rinishi (Preview)
            </span>

            <div className="p-4 rounded-2xl bg-[#E8ECEF] border border-slate-300 shadow-inner">
              <div className="p-3.5 rounded-2xl bg-white shadow-xs space-y-2 max-w-xs">
                {imageUrl && (
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-100">
                    <img src={imageUrl} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs font-bold text-[#17212F]">
                  {title || 'Xabarnoma Sarlavhasi'}
                </p>
                <p className="text-[11px] text-[#4d5156] whitespace-pre-wrap leading-relaxed">
                  {message || 'Bu yerda xabar matni foydalanuvchilarning Telegram chatida qanday ko‘rinishi aks etadi.'}
                </p>
                <div className="flex justify-end pt-1">
                  <span className="text-[9px] text-slate-400">01:25 • Ustoz Akademiyasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={ADMIN_THEME.card}>
        <div className="p-4 border-b border-[#E4E7EC] bg-[#F6F8FA]">
          <h3 className="text-xs font-bold text-[#17212F]">
            Yuborilgan Xabarnomalar Tarixi
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Sarlavha</th>
                <th className={ADMIN_THEME.th}>Auditoriya</th>
                <th className={ADMIN_THEME.th}>Yuborilgan Vaqt</th>
                <th className={ADMIN_THEME.th}>Yetkazildi</th>
                <th className={ADMIN_THEME.th}>Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#F6F8FA] transition-colors">
                  <td className={`${ADMIN_THEME.td} font-bold text-[#17212F]`}>
                    {item.title}
                  </td>
                  <td className={`${ADMIN_THEME.td} text-xs text-[#667085]`}>
                    {item.audience}
                  </td>
                  <td className={`${ADMIN_THEME.td} text-xs text-[#667085]`}>
                    {item.sentAt}
                  </td>
                  <td className={`${ADMIN_THEME.td} font-mono text-xs font-semibold text-[#086641]`}>
                    {item.deliveredCount} ta ({item.failedCount} xato)
                  </td>
                  <td className={ADMIN_THEME.td}>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 size={12} /> Yetkazildi
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
