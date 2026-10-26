'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  Eye,
  HardDrive,
  X,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export default function MediaLibrary() {
  const { notify } = useAdmin();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const fileInputRef = useRef(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.media.list();
      const list = Array.isArray(res) ? res : res?.items || [];
      setMediaList(list);
    } catch {
      notify('Media fayllarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      notify('Maksimal fayl hajmi: 10 MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await AdminApi.media.upload(formData);
      notify('Fayl muvaffaqiyatli yuklandi!', 'success');
      loadMedia();
    } catch (err) {
      notify(err.message || 'Yuklashda xatolik', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    notify('Havola nusxalandi!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu faylni o‘chirishni tasdiqlaysizmi?')) return;
    try {
      await AdminApi.media.delete(id);
      notify('Fayl o‘chirildi', 'info');
      loadMedia();
    } catch (err) {
      notify(err.message || 'O‘chirishda xatolik', 'error');
    }
  };

  const filtered = mediaList.filter((m) =>
    (m.filename || m.url || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Media Kutubxonasi</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Akademiya sayti, maqolalar va bot uchun rasmlar va grafik resurslar bulutli ombori
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={ADMIN_THEME.btnPrimary}
          >
            <UploadCloud size={16} />
            <span>{uploading ? 'Yuklanmoqda...' : 'Rasm Yuklash'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Media Resurslar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <ImageIcon size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{mediaList.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Yuklangan rasmlar va bannerlar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Qo‘llab-quvvatlanuvchi Formatlar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileCheck size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>WEBP, PNG, JPG</p>
          <p className={ADMIN_THEME.metricMeta}>Maksimal 10 MB hajmgacha</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>CDN Optimallashtirish</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <HardDrive size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>Tezkor Kesh</p>
          <p className={ADMIN_THEME.metricMeta}>Brauzer yuklanishi tezlangan</p>
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
            placeholder="Fayl nomi bo‘yicha qidirish..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
          <div className="w-8 h-8 rounded-full border-2 border-[#086641] border-t-transparent animate-spin mx-auto mb-3" />
          <span className="text-xs text-[#667085]">Media fayllar yuklanmoqda...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
          <ImageIcon size={36} className="mx-auto text-[#667085]/40 mb-2" />
          <p className="text-xs font-semibold text-[#17212F]">Fayllar topilmadi</p>
          <p className="text-[11px] text-[#667085] mt-1">
            Rasm yuklash tugmasi orqali yangi rasmlar joylang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-[#E4E7EC] overflow-hidden group shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div
                className="h-36 bg-[#F6F8FA] relative overflow-hidden cursor-pointer"
                onClick={() => setPreviewMedia(item)}
              >
                <img
                  src={item.url}
                  alt={item.filename || 'Media'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3 border-t border-[#E4E7EC] space-y-2">
                <p className="text-[11px] font-semibold text-[#17212F] truncate">
                  {item.filename || 'media_asset.png'}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => copyUrl(item.url, item.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#086641] hover:underline cursor-pointer"
                  >
                    {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === item.id ? 'Nusxalandi' : 'URL nusxalash'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-[#667085] hover:text-rose-600 transition-colors cursor-pointer"
                    title="O‘chirish"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#E4E7EC] animate-scale-in">
            <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-xs font-bold text-[#17212F] truncate">
                {previewMedia.filename || 'Rasm oldindan ko‘rish'}
              </h3>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex items-center justify-center bg-slate-950/5 max-h-[60vh] overflow-hidden">
              <img
                src={previewMedia.url}
                alt={previewMedia.filename || 'Preview'}
                className="max-w-full max-h-[55vh] object-contain rounded-xl shadow-xs"
              />
            </div>

            <div className="p-4 border-t border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <a
                href={previewMedia.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#086641] hover:underline"
              >
                <ExternalLink size={14} /> Asl holatda ochish
              </a>

              <button
                onClick={() => copyUrl(previewMedia.url, previewMedia.id)}
                className={ADMIN_THEME.btnPrimary}
              >
                <Copy size={14} /> Havolani nusxalash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
