'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  MessageSquareCode,
  Save,
  Smartphone,
  Eye,
  Bot,
  Send,
  CheckCircle2,
  RefreshCw,
  Copy,
  Info,
  Sparkles,
} from 'lucide-react';

const DEFAULT_BOT_CONTENT = {
  bot_welcome_text: `Assalomu alaykum va rahmatullohi va barakotuh!

<b>Ustoz Akademiyasi</b> rasmiy botiga xush kelibsiz.

Biz Toshkent shahridagi 8 ta zamonaviy filialimizda arab tilini noldan boshlab oliy darajagacha o‘rgatamiz.

Quyidagi menyudan kerakli bo‘limni tanlang:`,
  bot_contact_phone: '+998 55 518 44 00',
  bot_contact_telegram: '@ustoz_admin',
  bot_channel_link: 'https://t.me/ustozakademiyasi',
  bot_privacy_text: `Maxfiylik eslatmasi:
Kiritilgan ma’lumotlaringiz faqat dars jadvalini belgilash va siz bilan bog‘lanish uchun foydalaniladi. Ma’lumotlar uchinchi shaxslarga berilmaydi.`,
  bot_banner_url: '/site-logo.svg',
};

export default function BotMessagesEditor() {
  const { notify } = useAdmin();
  const [content, setContent] = useState(DEFAULT_BOT_CONTENT);
  const [activeTab, setActiveTab] = useState('welcome');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewTheme, setPreviewTheme] = useState('light');

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await AdminApi.settings.list();
        const list = Array.isArray(res) ? res : [];
        const mapped = { ...DEFAULT_BOT_CONTENT };
        list.forEach((item) => {
          if (mapped[item.key] !== undefined) {
            mapped[item.key] = item.value;
          }
        });
        setContent(mapped);
      } catch {
        // Fallback to default
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key, val) => {
    setContent((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const promises = Object.entries(content).map(([k, v]) =>
        AdminApi.settings.update(k, String(v), `Telegram Bot Content: ${k}`, true)
      );
      await Promise.all(promises);
      notify('Telegram bot xabarlari muvaffaqiyatli saqlandi va sinxronlandi!', 'success');
    } catch {
      notify('Saqlashda xatolik yuz berdi', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Telegram Bot Xabarlari va Jonli Simulyator</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Bot xabarlarini tahrirlash va ularning Telegram interfeysidagi real ko‘rinishini kuzatish
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={ADMIN_THEME.btnPrimary}
        >
          <Save size={16} />
          <span>{saving ? 'Sinxronlanmoqda...' : 'Botga Sinxronlash'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Message Content Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-[#F6F8FA] border border-[#E4E7EC] rounded-2xl">
            <button
              onClick={() => setActiveTab('welcome')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'welcome'
                  ? 'bg-white text-[#17212F] shadow-xs border border-[#E4E7EC]'
                  : 'text-[#667085] hover:text-[#17212F]'
              }`}
            >
              Xush kelibsiz (/start)
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-white text-[#17212F] shadow-xs border border-[#E4E7EC]'
                  : 'text-[#667085] hover:text-[#17212F]'
              }`}
            >
              Aloqa ma’lumotlari
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-white text-[#17212F] shadow-xs border border-[#E4E7EC]'
                  : 'text-[#667085] hover:text-[#17212F]'
              }`}
            >
              Maxfiylik va Ariza
            </button>
          </div>

          <div className={ADMIN_THEME.cardPadded}>
            {activeTab === 'welcome' && (
              <div className="space-y-4">
                <div>
                  <label className={ADMIN_THEME.label}>
                    Start Bosh Xabari (HTML format: &lt;b&gt;, &lt;i&gt;, &lt;a&gt;)
                  </label>
                  <textarea
                    rows={8}
                    value={content.bot_welcome_text}
                    onChange={(e) => handleChange('bot_welcome_text', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6F8FA] border border-[#E4E7EC] rounded-xl text-xs font-mono text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                  />
                  <span className="text-[11px] text-[#667085] mt-1 block">
                    Har safar yangi foydalanuvchi /start bosganda yoki menyuga qaytganda yuboriladi.
                  </span>
                </div>

                <div>
                  <label className={ADMIN_THEME.label}>
                    Bot Yuqori Banneri (Rasm / Logo URL)
                  </label>
                  <input
                    type="text"
                    value={content.bot_banner_url}
                    onChange={(e) => handleChange('bot_banner_url', e.target.value)}
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div>
                  <label className={ADMIN_THEME.label}>Call Center Telefoni</label>
                  <input
                    type="text"
                    value={content.bot_contact_phone}
                    onChange={(e) => handleChange('bot_contact_phone', e.target.value)}
                    className={ADMIN_THEME.input}
                  />
                </div>

                <div>
                  <label className={ADMIN_THEME.label}>Telegram Admin (@username)</label>
                  <input
                    type="text"
                    value={content.bot_contact_telegram}
                    onChange={(e) => handleChange('bot_contact_telegram', e.target.value)}
                    className={ADMIN_THEME.input}
                  />
                </div>

                <div>
                  <label className={ADMIN_THEME.label}>Rasmiy Telegram Kanal Havolasi</label>
                  <input
                    type="text"
                    value={content.bot_channel_link}
                    onChange={(e) => handleChange('bot_channel_link', e.target.value)}
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div>
                  <label className={ADMIN_THEME.label}>
                    Maxfiylik va Qabul Eslatmasi
                  </label>
                  <textarea
                    rows={6}
                    value={content.bot_privacy_text}
                    onChange={(e) => handleChange('bot_privacy_text', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6F8FA] border border-[#E4E7EC] rounded-xl text-xs text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className={ADMIN_THEME.btnPrimary}
              >
                <Save size={15} />
                <span>{saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni Saqlash'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview: Telegram Phone Mockup (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#17212F] flex items-center gap-1.5">
                <Smartphone size={15} className="text-[#086641]" />
                <span>Telegram Jonli Simulyatori</span>
              </span>

              <div className="flex items-center gap-1 p-0.5 bg-[#F6F8FA] rounded-lg border border-[#E4E7EC] text-[10px]">
                <button
                  onClick={() => setPreviewTheme('light')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    previewTheme === 'light' ? 'bg-white text-[#17212F] shadow-xs' : 'text-[#667085]'
                  }`}
                >
                  Yorug‘
                </button>
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    previewTheme === 'dark' ? 'bg-[#101828] text-white shadow-xs' : 'text-[#667085]'
                  }`}
                >
                  Qorong‘i
                </button>
              </div>
            </div>

            {/* Telegram Phone Device Frame */}
            <div
              className={`rounded-2xl p-4 shadow-inner border transition-colors ${
                previewTheme === 'dark'
                  ? 'bg-[#0E1621] border-[#1D2733] text-white'
                  : 'bg-[#98B4CE]/30 border-slate-300 text-[#17212F]'
              }`}
            >
              {/* Telegram Channel Header */}
              <div
                className={`flex items-center gap-3 pb-3 border-b ${
                  previewTheme === 'dark' ? 'border-white/10' : 'border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#086641] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  UA
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Ustoz Akademiyasi Bot</h4>
                  <span className="text-[10px] text-emerald-500">bot • onlayn</span>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="my-4 space-y-3">
                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] shadow-xs space-y-2 ${
                    previewTheme === 'dark'
                      ? 'bg-[#182533] border border-white/5'
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">
                    {activeTab === 'welcome' && content.bot_welcome_text}
                    {activeTab === 'contact' &&
                      `📞 Call-markaz: ${content.bot_contact_phone}\n👤 Telegram admin: ${content.bot_contact_telegram}\n📢 Rasmiy kanal: ${content.bot_channel_link}`}
                    {activeTab === 'privacy' && content.bot_privacy_text}
                  </p>
                  <div className="flex justify-end">
                    <span
                      className={`text-[9px] ${
                        previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      04:15
                    </span>
                  </div>
                </div>

                {/* Simulated Telegram Keyboards */}
                <div className="space-y-1.5 pt-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div
                      className={`p-2 rounded-xl text-center text-xs font-semibold shadow-xs select-none ${
                        previewTheme === 'dark'
                          ? 'bg-[#2B5278] text-white'
                          : 'bg-[#E1ECF4] text-[#2B5278] border border-[#C5DCED]'
                      }`}
                    >
                      📚 Kurslar
                    </div>
                    <div
                      className={`p-2 rounded-xl text-center text-xs font-semibold shadow-xs select-none ${
                        previewTheme === 'dark'
                          ? 'bg-[#2B5278] text-white'
                          : 'bg-[#E1ECF4] text-[#2B5278] border border-[#C5DCED]'
                      }`}
                    >
                      🏢 Filiallar
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div
                      className={`p-2 rounded-xl text-center text-xs font-semibold shadow-xs select-none ${
                        previewTheme === 'dark'
                          ? 'bg-[#2B5278] text-white'
                          : 'bg-[#E1ECF4] text-[#2B5278] border border-[#C5DCED]'
                      }`}
                    >
                      ✍️ Sinov darsiga yozilish
                    </div>
                    <div
                      className={`p-2 rounded-xl text-center text-xs font-semibold shadow-xs select-none ${
                        previewTheme === 'dark'
                          ? 'bg-[#2B5278] text-white'
                          : 'bg-[#E1ECF4] text-[#2B5278] border border-[#C5DCED]'
                      }`}
                    >
                      📞 Aloqa
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
