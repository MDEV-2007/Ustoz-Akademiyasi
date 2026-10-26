'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  FileText,
  Search,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Clock,
  Eye,
  Save,
  X,
  Globe,
  Sparkles,
} from 'lucide-react';

const STATIC_PAGES = [
  {
    id: 'home',
    title: 'Bosh sahifa',
    slug: '/',
    description: 'Akademiyaning asosiy vizitka sahifasi, kurslar va ro‘yxatdan o‘tish bloki',
    status: 'PUBLISHED',
    lastModified: 'Bugun, 01:15',
    viewsCount: '14,250',
    sections: ['Hero Banner', 'Kurslar katalogi', 'Nega biz?', 'Ustozlar', 'Filiallar', 'FAQ'],
  },
  {
    id: 'about',
    title: 'Biz haqimizda',
    slug: '/#about',
    description: 'Ustoz Akademiyasi tarixi, missiyasi va professional metodikasi',
    status: 'PUBLISHED',
    lastModified: 'Kechagi kun',
    viewsCount: '3,840',
    sections: ['Akademiya missiyasi', 'Statistika', 'Litsenziya va sertifikatlar'],
  },
  {
    id: 'courses',
    title: 'Barcha kurslar',
    slug: '/#courses',
    description: 'Arab tili noldan, grammatika, so‘zlashuv va CEFR sertifikat kurslari',
    status: 'PUBLISHED',
    lastModified: '2 kun oldin',
    viewsCount: '9,120',
    sections: ['Kategoriya filtrlari', 'Kurs kartalari', 'Dars rejalari'],
  },
  {
    id: 'branches',
    title: 'Filiallar va lokatsiyalar',
    slug: '/#branches',
    description: 'Toshkent shahridagi 8 ta zamonaviy filiallar xaritasi va ma’lumotlari',
    status: 'PUBLISHED',
    lastModified: 'Hafta boshida',
    viewsCount: '5,600',
    sections: ['Filiallar xaritasi', 'Ish tartibi', 'Aloqa telefonlari'],
  },
  {
    id: 'privacy',
    title: 'Maxfiylik siyosati',
    slug: '/privacy-policy',
    description: 'Foydalanuvchi shaxsiy ma’lumotlarini himoya qilish qoidalari',
    status: 'PUBLISHED',
    lastModified: '15.10.2026',
    viewsCount: '420',
    sections: ['Umumiy qoidalar', 'Ma’lumotlar xavfsizligi', 'Foydalanuvchi huquqlari'],
  },
];

export default function WebsitePagesManager() {
  const { notify } = useAdmin();
  const [pages, setPages] = useState(STATIC_PAGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPage, setEditingPage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePage = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setPages((prev) =>
        prev.map((p) => (p.id === editingPage.id ? { ...editingPage, lastModified: 'Hozir' } : p))
      );
      notify(`"${editingPage.title}" sahifasi ma’lumotlari saqlandi!`, 'success');
      setEditingPage(null);
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Veb-sayt Sahifalari Boshqaruvi</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Akademiya rasmiy portalidagi statik sahifalar, meta-ta’riflar va faol bo‘limlar ro‘yxati
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className={ADMIN_THEME.btnSecondary}
        >
          <ExternalLink size={15} />
          <span>Saytni Ko‘rish</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Sahifalar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <FileText size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{pages.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Faol veb-yo‘laklar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Oylik Ko‘rishlar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Eye size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>33,230+</p>
          <p className={ADMIN_THEME.metricMeta}>Portal tashrif buyuruvchilari</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Indekslanish Holati</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Globe size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>100%</p>
          <p className={ADMIN_THEME.metricMeta}>Google va Yandex qidiruv tizimida</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Sahifa nomi yoki slug orqali qidirish..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Sahifa Nomi</th>
                <th className={ADMIN_THEME.th}>URL / Slug</th>
                <th className={ADMIN_THEME.th}>Tarkibidagi Bo‘limlar</th>
                <th className={ADMIN_THEME.th}>Ko‘rishlar</th>
                <th className={ADMIN_THEME.th}>Oxirgi Yangilanish</th>
                <th className={ADMIN_THEME.th}>Holat</th>
                <th className={`${ADMIN_THEME.th} text-right`}>Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-[#F6F8FA] transition-colors">
                  <td className={ADMIN_THEME.td}>
                    <div>
                      <p className="font-bold text-[#17212F]">{page.title}</p>
                      <p className="text-[11px] text-[#667085] truncate max-w-xs mt-0.5">
                        {page.description}
                      </p>
                    </div>
                  </td>
                  <td className={`${ADMIN_THEME.td} font-mono text-xs font-semibold text-[#086641]`}>
                    {page.slug}
                  </td>
                  <td className={ADMIN_THEME.td}>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {page.sections.map((sec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F6F8FA] text-[#17212F] border border-[#E4E7EC]"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`${ADMIN_THEME.td} font-mono font-semibold text-[#17212F]`}>
                    {page.viewsCount}
                  </td>
                  <td className={`${ADMIN_THEME.td} text-xs text-[#667085]`}>
                    {page.lastModified}
                  </td>
                  <td className={ADMIN_THEME.td}>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 size={12} /> Chop etilgan
                    </span>
                  </td>
                  <td className={`${ADMIN_THEME.td} text-right`}>
                    <button
                      onClick={() => setEditingPage({ ...page })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#17212F] bg-[#F6F8FA] hover:bg-[#E4E7EC] transition-colors cursor-pointer border border-[#E4E7EC]"
                    >
                      <Edit3 size={13} />
                      <span>Tahrirlash</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E4E7EC] animate-slide-left">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-sm font-bold text-[#17212F]">
                Sahifa Ma’lumotlarini Tahrirlash
              </h3>
              <button
                onClick={() => setEditingPage(null)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className={ADMIN_THEME.label}>Sahifa Sarlavhasi</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>URL Yo‘lakcha (Slug)</label>
                <input
                  type="text"
                  value={editingPage.slug}
                  disabled
                  className={`${ADMIN_THEME.input} opacity-70 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Sahifa Ta’rifi (Meta Description)</label>
                <textarea
                  rows={4}
                  value={editingPage.description}
                  onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                />
              </div>

              <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className={ADMIN_THEME.btnSecondary}
                >
                  Bekor qilish
                </button>
                <button type="submit" disabled={isSaving} className={ADMIN_THEME.btnPrimary}>
                  <Save size={15} />
                  <span>{isSaving ? 'Saqlanmoqda...' : 'Saqlash'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
