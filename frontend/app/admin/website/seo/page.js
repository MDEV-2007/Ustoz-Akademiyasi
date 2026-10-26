'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  SearchCode,
  Save,
  Globe,
  Share2,
  BarChart,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Eye,
  Sparkles,
} from 'lucide-react';

const DEFAULT_SEO_SETTINGS = {
  seo_site_title: 'Ustoz Akademiyasi — Professional Arab Tili Markazi',
  seo_meta_description: 'Toshkent shahrida professional arab tili darslari. Tajvid, grammatika, so‘zlashuv va CEFR xalqaro sertifikatiga tayyorlov kurslari.',
  seo_meta_keywords: 'arab tili toshkent, arab tili kursi, ustoz akademiyasi, tajvid darslari, arabcha so‘zlashuv',
  seo_og_title: 'Ustoz Akademiyasi — Arab Tilini Mukammal O‘rganing',
  seo_og_image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
  seo_robots_index: 'index, follow',
  seo_google_analytics: 'G-USTOZ2026',
  seo_yandex_metrika: '94812345',
};

export default function SeoSettingsPage() {
  const { notify } = useAdmin();
  const [formData, setFormData] = useState(DEFAULT_SEO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await AdminApi.settings.list();
        const list = Array.isArray(res) ? res : [];
        const mapped = { ...DEFAULT_SEO_SETTINGS };
        list.forEach((item) => {
          if (mapped[item.key] !== undefined) {
            mapped[item.key] = item.value;
          }
        });
        setFormData(mapped);
      } catch {
        // Fallback to defaults
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const [key, val] of Object.entries(formData)) {
        await AdminApi.settings.update(key, val, 'SEO & Analytics');
      }
      notify('SEO va tahlil sozlamalari muvaffaqiyatli saqlandi!', 'success');
    } catch (err) {
      notify(err.message || 'Saqlashda xatolik', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${ADMIN_THEME.pageContainer} max-w-5xl`}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Qidiruv Tizimi va SEO Sozlamalari</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Google, Yandex qidiruv natijalarida chiqish, OpenGraph ijtimoiy tarmoq kartalari va analitika kodlari
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={ADMIN_THEME.btnPrimary}
        >
          <Save size={16} />
          <span>{saving ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}</span>
        </button>
      </div>

      {/* Google Search Snippet Preview */}
      <div className="p-6 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3">
          <Eye size={12} /> Google qidiruv natijasida ko‘rinishi (Search Preview)
        </span>

        <div className="max-w-xl space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Globe size={13} className="text-[#086641]" />
            <span className="font-medium">https://ustozakademiyasi.uz</span>
            <span>› darslar</span>
          </div>
          <h3 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight">
            {formData.seo_site_title}
          </h3>
          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            {formData.seo_meta_description}
          </p>
        </div>
      </div>

      {/* Form Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Meta tags card */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Asosiy Meta Teglar</h3>
          <p className="text-xs text-[#667085] mb-5">
            Barcha sahifalar uchun standart sarlavha va qidiruv botlari ko‘radigan matn
          </p>

          <div className="space-y-4">
            <div>
              <label className={ADMIN_THEME.label}>Bosh Sahifa Sarlavhasi (Meta Title) *</label>
              <input
                type="text"
                required
                value={formData.seo_site_title}
                onChange={(e) => handleChange('seo_site_title', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Meta Tavsif (Meta Description) *</label>
              <textarea
                rows={3}
                required
                value={formData.seo_meta_description}
                onChange={(e) => handleChange('seo_meta_description', e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Kalit So‘zlar (Meta Keywords)</label>
              <input
                type="text"
                value={formData.seo_meta_keywords}
                onChange={(e) => handleChange('seo_meta_keywords', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>
          </div>
        </div>

        {/* Social Card (OpenGraph) */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Ijtimoiy Tarmoq Ulashish (OpenGraph)</h3>
          <p className="text-xs text-[#667085] mb-5">
            Telegram, Facebook va WhatsApp havolasi yuborilganda chiquvchi sarlavha va rasm
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={ADMIN_THEME.label}>Ulashish Sarlavhasi (OG Title)</label>
              <input
                type="text"
                value={formData.seo_og_title}
                onChange={(e) => handleChange('seo_og_title', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>
            <div>
              <label className={ADMIN_THEME.label}>Banner Rasm Havolasi (OG Image URL)</label>
              <input
                type="text"
                value={formData.seo_og_image}
                onChange={(e) => handleChange('seo_og_image', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>
          </div>
        </div>

        {/* Analytics & Webmasters */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Analitika va Qidiruv Botlari</h3>
          <p className="text-xs text-[#667085] mb-5">
            Trafikni kuzatish va botlarni boshqarish
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={ADMIN_THEME.label}>Google Analytics ID (GA4)</label>
              <input
                type="text"
                value={formData.seo_google_analytics}
                onChange={(e) => handleChange('seo_google_analytics', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className={ADMIN_THEME.input}
              />
            </div>
            <div>
              <label className={ADMIN_THEME.label}>Yandex Metrika ID</label>
              <input
                type="text"
                value={formData.seo_yandex_metrika}
                onChange={(e) => handleChange('seo_yandex_metrika', e.target.value)}
                placeholder="948XXXXX"
                className={ADMIN_THEME.input}
              />
            </div>
            <div>
              <label className={ADMIN_THEME.label}>Robots.txt Indekslash Qoidasi</label>
              <select
                value={formData.seo_robots_index}
                onChange={(e) => handleChange('seo_robots_index', e.target.value)}
                className={ADMIN_THEME.select}
              >
                <option value="index, follow">Index, Follow (Barchaga ochiq)</option>
                <option value="noindex, follow">Noindex, Follow</option>
                <option value="noindex, nofollow">Noindex, Nofollow (Yopiq)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className={ADMIN_THEME.btnPrimary}
          >
            <Save size={16} />
            <span>{saving ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
