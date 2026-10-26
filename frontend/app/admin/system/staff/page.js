'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Lock,
  Mail,
  Phone,
  UserCheck,
  UserX,
  X,
  Save,
  Shield,
  Key,
  Filter,
} from 'lucide-react';

const ROLES_INFO = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    desc: 'Barcha tizimga to‘liq cheklovsiz kirish huquqi, xodimlar va xavfsizlik',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  ADMIN: {
    label: 'Admin',
    desc: 'CRM, kurslar, filiallar, jadval va hisobotlar boshqaruvi',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  MANAGER: {
    label: 'Menejer / Operator',
    desc: 'Murojaatlar (Leads), mijozlar, sinov darslari va eslatmalar bilan ishlash',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  CONTENT_EDITOR: {
    label: 'Kontent Muharriri',
    desc: 'Veb-sayt maqolalari, FAQ, media kutubxonasi va bot matnlari',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

export default function StaffManagementPage() {
  const { user: currentUser, notify } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'MANAGER',
    isActive: true,
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.users.list();
      const list = Array.isArray(res) ? res : res?.items || [];
      setUsers(list);
    } catch {
      notify('Xodimlar ro‘yxatini yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedId(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'MANAGER',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (staffUser) => {
    setModalMode('edit');
    setSelectedId(staffUser.id);
    const isActive = staffUser.status ? staffUser.status === 'ACTIVE' : (staffUser.isActive ?? true);
    setFormData({
      fullName: staffUser.fullName || '',
      email: staffUser.email || '',
      password: '', // Leave blank unless updating
      role: staffUser.role || 'MANAGER',
      isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const payload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
          status: formData.isActive ? 'ACTIVE' : 'INACTIVE',
        };
        await AdminApi.users.create(payload);
        notify('Yangi xodim muvaffaqiyatli qo‘shildi!', 'success');
      } else {
        const payload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
          status: formData.isActive ? 'ACTIVE' : 'INACTIVE',
        };
        if (formData.password && formData.password.trim()) {
          payload.password = formData.password.trim();
        }
        await AdminApi.users.update(selectedId, payload);
        notify('Xodim ma’lumotlari yangilandi!', 'success');
      }
      setModalOpen(false);
      loadUsers();
    } catch (err) {
      const errorMsg =
        err.data?.validationErrors?.join(', ') ||
        err.data?.message ||
        err.message ||
        'Xatolik yuz berdi';
      notify(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`«${name}» hisobini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await AdminApi.users.delete(id);
      notify('Xodim hisobi o‘chirildi', 'info');
      loadUsers();
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'O‘chirishda xatolik';
      notify(errorMsg, 'error');
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Xodimlar va Ruxsatlar Boshqaruvi</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Boshqaruv paneliga kiruvchi mas’ul administratorlar, rollar va xavfsizlik
          </p>
        </div>

        <button onClick={openCreateModal} className={ADMIN_THEME.btnPrimary}>
          <Plus size={16} />
          <span>Yangi Xodim Qo‘shish</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Xodimlar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <ShieldCheck size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{users.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Tizimga kirish huquqiga ega</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Super Adminlar</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Shield size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>
            {users.filter((u) => u.role === 'SUPER_ADMIN').length}
          </p>
          <p className={ADMIN_THEME.metricMeta}>To‘liq huquqqa ega hisoblar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Faol Seanslar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>100%</p>
          <p className={ADMIN_THEME.metricMeta}>JWT 256-bit shifrlangan</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ism yoki email bo‘yicha..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={15} className="text-[#667085] hidden sm:block" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
          >
            <option value="ALL">Barcha Rollar</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Menejer</option>
            <option value="CONTENT_EDITOR">Muharrir</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Xodim F.I.SH.</th>
                <th className={ADMIN_THEME.th}>Email / Login</th>
                <th className={ADMIN_THEME.th}>Rol</th>
                <th className={ADMIN_THEME.th}>Ruxsat Darajasi</th>
                <th className={ADMIN_THEME.th}>Holat</th>
                <th className={`${ADMIN_THEME.th} text-right`}>Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085] text-xs">
                    Xodimlar yuklanmoqda...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085] text-xs">
                    Xodimlar topilmadi.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const roleMeta = ROLES_INFO[u.role] || ROLES_INFO.MANAGER;
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-[#F6F8FA] transition-colors">
                      <td className={ADMIN_THEME.td}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#086641] font-bold text-xs flex items-center justify-center border border-emerald-200">
                            {u.fullName?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-bold text-[#17212F] flex items-center gap-1.5">
                              {u.fullName}
                              {isCurrent && (
                                <span className="text-[10px] text-[#086641] font-semibold">
                                  (Siz)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${ADMIN_THEME.td} font-mono text-xs text-[#667085]`}>
                        {u.email}
                      </td>
                      <td className={ADMIN_THEME.td}>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleMeta.badge}`}>
                          {roleMeta.label}
                        </span>
                      </td>
                      <td className={`${ADMIN_THEME.td} text-xs text-[#667085] max-w-xs truncate`}>
                        {roleMeta.desc}
                      </td>
                      <td className={ADMIN_THEME.td}>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <UserCheck size={12} /> Faol
                        </span>
                      </td>
                      <td className={`${ADMIN_THEME.td} text-right`}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-[#17212F] bg-[#F6F8FA] hover:bg-[#E4E7EC] transition-colors cursor-pointer border border-[#E4E7EC]"
                            title="Tahrirlash"
                          >
                            <Edit size={14} />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => handleDelete(u.id, u.fullName)}
                              className="p-1.5 rounded-lg text-[#667085] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="O‘chirish"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Staff Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-sm font-bold text-[#17212F]">
                {modalMode === 'create' ? 'Yangi Xodim Qo‘shish' : 'Xodim Ma’lumotlarini Tahrirlash'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={ADMIN_THEME.label}>To‘liq Ism (F.I.SH.) *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Masalan: Murodulla Olimov"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Email / Kirish Logini *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@ustozakademiyasi.uz"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>
                  {modalMode === 'create' ? 'Parol * (kamida 8 ta belgi)' : 'Yangi Parol (kamida 8 ta belgi, ixtiyoriy)'}
                </label>
                <input
                  type="password"
                  required={modalMode === 'create'}
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={modalMode === 'create' ? 'Kamida 8 ta belgidan iborat parol' : 'O‘zgartirmaslik uchun bo‘sh qoldiring'}
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Rol va Huquqlar</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={ADMIN_THEME.select}
                >
                  <option value="SUPER_ADMIN">Super Admin (To‘liq huquq)</option>
                  <option value="ADMIN">Admin (Boshqaruv)</option>
                  <option value="MANAGER">Menejer / Operator</option>
                  <option value="CONTENT_EDITOR">Kontent Muharriri</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#086641] focus:ring-[#086641] border-[#E4E7EC]"
                  />
                  <span className="text-xs font-semibold text-[#17212F]">
                    Xodim hisobi faol (tizimga kirishga ruxsat)
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={ADMIN_THEME.btnSecondary}
                >
                  Bekor qilish
                </button>
                <button type="submit" disabled={submitting} className={ADMIN_THEME.btnPrimary}>
                  <Save size={15} />
                  <span>{submitting ? 'Saqlanmoqda...' : 'Saqlash'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
