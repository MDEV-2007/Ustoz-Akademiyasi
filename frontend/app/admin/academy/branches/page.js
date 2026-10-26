'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Compass,
  ExternalLink,
  X,
  Search,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

export default function AdminBranchesPage() {
  const { notify } = useAdmin();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    officialLabel: '',
    area: 'Toshkent shahri',
    district: '',
    address: '',
    landmark: '',
    phone: '+998 55 518 44 00',
    workingHours: 'Dushanba – Shanba (09:00 – 21:00)',
    latitude: 41.311,
    longitude: 69.24,
    status: 'ACTIVE',
  });

  const loadBranches = async () => {
    setLoading(true);
    try {
      const data = await AdminApi.branches.list();
      setBranches(Array.isArray(data) ? data : []);
    } catch {
      notify('Filiallarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleOpenModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setForm({
        name: branch.name,
        slug: branch.slug,
        officialLabel: branch.officialLabel || branch.name,
        area: branch.area || 'Toshkent shahri',
        district: branch.district || '',
        address: branch.address || '',
        landmark: branch.landmark || '',
        phone: branch.phone || '+998 55 518 44 00',
        workingHours: branch.workingHours || 'Dushanba – Shanba (09:00 – 21:00)',
        latitude: branch.latitude || 41.311,
        longitude: branch.longitude || 69.24,
        status: branch.status || 'ACTIVE',
      });
    } else {
      setEditingBranch(null);
      setForm({
        name: '',
        slug: '',
        officialLabel: '',
        area: 'Toshkent shahri',
        district: '',
        address: '',
        landmark: '',
        phone: '+998 55 518 44 00',
        workingHours: 'Dushanba – Shanba (09:00 – 21:00)',
        latitude: 41.311,
        longitude: 69.24,
        status: 'ACTIVE',
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await AdminApi.branches.update(editingBranch.id, form);
        notify('Filial ma’lumotlari yangilandi', 'success');
      } else {
        await AdminApi.branches.create(form);
        notify('Yangi filial qo‘shildi', 'success');
      }
      setModalOpen(false);
      loadBranches();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`«${name}» filialini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await AdminApi.branches.delete(id);
      notify('Filial o‘chirildi', 'info');
      loadBranches();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const filteredBranches = branches.filter(
    (b) =>
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.landmark?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Filiallar Tarmoqlari</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Toshkent shahri bo‘ylab Ustoz Akademiyasining barcha o‘quv markazlari, manzillari va lokatsiyalari
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className={ADMIN_THEME.btnPrimary}>
          <Plus size={16} />
          <span>Yangi Filial Qo‘shish</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Faol Filiallar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <Building2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{branches.length || 8}</p>
          <p className={ADMIN_THEME.metricMeta}>Toshkent shahrida to‘liq qamrov</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Yagona Aloqa Markazi</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Phone size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>+998 55 518 44 00</p>
          <p className={ADMIN_THEME.metricMeta}>Barcha filiallar uchun markazlashgan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Dars Vaqtlari</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>09:00 – 21:00</p>
          <p className={ADMIN_THEME.metricMeta}>Dushanbadan shanbagacha</p>
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
            placeholder="Filial nomi, tumani yoki mo‘ljal bo‘yicha qidirish..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>
      </div>

      {/* Branches Grid */}
      {loading ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
          <div className="w-8 h-8 rounded-full border-2 border-[#086641] border-t-transparent animate-spin mx-auto mb-3" />
          <span className="text-xs text-[#667085]">Filiallar yuklanmoqda...</span>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
          <Building2 size={36} className="mx-auto text-[#667085]/40 mb-2" />
          <p className="text-xs font-semibold text-[#17212F]">Filiallar topilmadi</p>
          <p className="text-[11px] text-[#667085] mt-1">
            Yangi filial qo‘shish orqali yangi o‘quv markazini kiritishingiz mumkin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBranches.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#17212F] flex items-center gap-2">
                      <Building2 size={16} className="text-[#086641]" />
                      {b.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#086641] mt-0.5">
                      {b.officialLabel || b.name}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Faol
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 pt-3 border-t border-[#E4E7EC] text-xs">
                  <div className="flex items-start gap-2 text-[#17212F]">
                    <MapPin size={15} className="text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{b.address}</span>
                  </div>

                  {b.landmark && (
                    <div className="flex items-center gap-2 text-[#667085]">
                      <Navigation size={14} className="text-[#D4AF65] flex-shrink-0" />
                      <span>Mo‘ljal: {b.landmark}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[#667085]">
                    <Clock size={14} className="text-blue-500 flex-shrink-0" />
                    <span>{b.workingHours}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#667085]">
                    <Phone size={14} className="text-[#086641] flex-shrink-0" />
                    <span className="font-mono">{b.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E4E7EC] flex items-center justify-between">
                <a
                  href={`https://maps.google.com/?q=${b.latitude || 41.311},${b.longitude || 69.24}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#086641] hover:underline"
                >
                  <Compass size={13} />
                  <span>Xaritada ochish</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="p-1.5 rounded-lg text-[#17212F] bg-[#F6F8FA] hover:bg-[#E4E7EC] transition-colors cursor-pointer border border-[#E4E7EC]"
                    title="Tahrirlash"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.name)}
                    className="p-1.5 rounded-lg text-[#667085] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="O‘chirish"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Branch Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-sm font-bold text-[#17212F]">
                {editingBranch ? 'Filial Ma’lumotlarini Tahrirlash' : 'Yangi Filial Qo‘shish'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={ADMIN_THEME.label}>Filial Nomi *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Masalan: Chilonzor filiali"
                    className={ADMIN_THEME.input}
                  />
                </div>
                <div>
                  <label className={ADMIN_THEME.label}>Rasmiy Yorliq</label>
                  <input
                    type="text"
                    value={form.officialLabel}
                    onChange={(e) => setForm({ ...form, officialLabel: e.target.value })}
                    placeholder="Masalan: Chilonzor-19 bosh markaz"
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Tuman / Hudud</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="Masalan: Chilonzor tumani"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Aniq Manzil *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Masalan: Bunyodkor shoh ko‘chasi, 42/1-uy"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Mo‘ljal (Landmark)</label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  placeholder="Masalan: Mirzo Ulug‘bek metro bekati yonida"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={ADMIN_THEME.label}>Telefon Raqam</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={ADMIN_THEME.input}
                  />
                </div>
                <div>
                  <label className={ADMIN_THEME.label}>Ish Vaqtlari</label>
                  <input
                    type="text"
                    value={form.workingHours}
                    onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={ADMIN_THEME.label}>Kenglik (Latitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
                    className={ADMIN_THEME.input}
                  />
                </div>
                <div>
                  <label className={ADMIN_THEME.label}>Uzunlik (Longitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={ADMIN_THEME.btnSecondary}
                >
                  Bekor qilish
                </button>
                <button type="submit" className={ADMIN_THEME.btnPrimary}>
                  {editingBranch ? 'O‘zgarishlarni Saqlash' : 'Filialni Qo‘shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
