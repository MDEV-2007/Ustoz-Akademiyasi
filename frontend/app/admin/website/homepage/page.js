'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  LayoutTemplate,
  Save,
  Sparkles,
  Eye,
  CheckCircle2,
  Building2,
  Phone,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminHomepageCmsPage() {
  const { notify } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: 'Ustoz Akademiyasi',
    sloganPrimary: "O'QI VA KO'TARIL!",
    sloganSecondary: 'Zulmatlardan Nur tomon',
    heroBadge: 'Arab tili akademiyasi',
    heroHeading: 'Arab tilini mukammal o‘rganing',
    heroDescription:
      'Bolalar va kattalar uchun zamonaviy metodika, malakali ustozlar va Toshkent bo‘ylab 8 ta qulay filial.',
    primaryCtaLabel: 'Sinov darsiga yozilish',
    secondaryCtaLabel: 'Kurslarni ko‘rish',
    callCenterPhone: '+998 55 518 44 00',
  });

  useEffect(() => {
    AdminApi.settings.list()
      .then((settings) => {
        const brand = settings.find((s) => s.key === 'brand_info')?.value;
        const hp = settings.find((s) => s.key === 'homepage_config')?.value;
        if (brand || hp) {
          setForm((prev) => ({
            ...prev,
            ...(brand || {}),
            ...(hp || {}),
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await AdminApi.settings.update(
        'brand_info',
        {
          name: form.name,
          sloganPrimary: form.sloganPrimary,
          sloganSecondary: form.sloganSecondary,
          branchesCount: 8,
          city: 'Toshkent shahri',
        },
        'Asosiy brend nomi va shiorlar'
      );

      await AdminApi.settings.update(
        'homepage_config',
        {
          heroBadge: form.heroBadge,
          heroHeading: form.heroHeading,
          heroDescription: form.heroDescription,
          primaryCtaLabel: form.primaryCtaLabel,
          secondaryCtaLabel: form.secondaryCtaLabel,
          callCenterPhone: form.callCenterPhone,
        },
        'Bosh sahifa matnlari va tugmalar sozlamalari'
      );

      notify('Bosh sahifa matnlari muvaffaqiyatli saqlandi va saytda yangilandi!', 'success');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${ADMIN_THEME.pageContainer} max-w-5xl`}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Bosh Sahifa Tarkibi (Homepage CMS)</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Saytning bosh sahifasidagi asosiy shiorlar, hero sarlavhalari va harakatga chorlovchi (CTA) matnlar
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={ADMIN_THEME.btnPrimary}
        >
          <Save size={16} />
          <span>{saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni Saqlash'}</span>
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#086641] to-[#064E3B] text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none rounded-l-full" />
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
            <Eye size={12} /> Bosh Sahifa jonli ko‘rinishi (Hero Preview)
          </span>
          <span className="text-[11px] font-semibold text-emerald-200">
            {form.sloganPrimary}
          </span>
        </div>

        <div className="max-w-xl space-y-3 mt-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-400/30">
            {form.heroBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {form.heroHeading}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {form.heroDescription}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-xl bg-white text-[#086641] font-bold text-xs shadow-sm">
              {form.primaryCtaLabel}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs border border-white/20">
              {form.secondaryCtaLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Form Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Group */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Brend Ma’lumotlari va Shiorlar</h3>
          <p className="text-xs text-[#667085] mb-5">
            Akademiyaning rasmiy nomi va bosh sahifaning tepa qismida aks etuvchi shiorlar
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={ADMIN_THEME.label}>Brend Nomi</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={ADMIN_THEME.input}
              />
            </div>
            <div>
              <label className={ADMIN_THEME.label}>Asosiy Shior</label>
              <input
                type="text"
                value={form.sloganPrimary}
                onChange={(e) => setForm({ ...form, sloganPrimary: e.target.value })}
                className={ADMIN_THEME.input}
              />
            </div>
            <div>
              <label className={ADMIN_THEME.label}>Qo‘shimcha Shior</label>
              <input
                type="text"
                value={form.sloganSecondary}
                onChange={(e) => setForm({ ...form, sloganSecondary: e.target.value })}
                className={ADMIN_THEME.input}
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Bosh Banner (Hero Section) Matnlari</h3>
          <p className="text-xs text-[#667085] mb-5">
            Mijoz saytga kirganda birinchi ko‘radigan asosiy sarlavha va ta’rif
          </p>

          <div className="space-y-4">
            <div>
              <label className={ADMIN_THEME.label}>Kichik Nomi (Badge)</label>
              <input
                type="text"
                value={form.heroBadge}
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Asosiy Katta Sarlavha (H1)</label>
              <input
                type="text"
                value={form.heroHeading}
                onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Batafsil Ta’rif Matni</label>
              <textarea
                rows={3}
                value={form.heroDescription}
                onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
              />
            </div>
          </div>
        </div>

        {/* CTA Buttons & Contact */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Tugmalar va Aloqa Matnlari</h3>
          <p className="text-xs text-[#667085] mb-5">
            Arizaga yo‘naltiruvchi harakat tugmalari yozuvlari
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={ADMIN_THEME.label}>Asosiy Tugma Yozuvi (CTA 1)</label>
              <input
                type="text"
                value={form.primaryCtaLabel}
                onChange={(e) => setForm({ ...form, primaryCtaLabel: e.target.value })}
                className={ADMIN_THEME.input}
              />
            </div>
            <div>
              <label className={ADMIN_THEME.label}>Ikkinchi Tugma Yozuvi (CTA 2)</label>
              <input
                type="text"
                value={form.secondaryCtaLabel}
                onChange={(e) => setForm({ ...form, secondaryCtaLabel: e.target.value })}
                className={ADMIN_THEME.input}
              />
            </div>
            <div>
              <label className={ADMIN_THEME.label}>Call Center Telefoni</label>
              <input
                type="text"
                value={form.callCenterPhone}
                onChange={(e) => setForm({ ...form, callCenterPhone: e.target.value })}
                className={ADMIN_THEME.input}
              />
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
            <span>{saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni Saqlash'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
