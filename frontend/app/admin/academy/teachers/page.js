'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Award,
  Briefcase,
  Globe,
  X,
  BookOpen,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function AdminTeachersPage() {
  const { notify } = useAdmin();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    slug: '',
    department: 'Professional Fonetika kafedrasi',
    qualification: 'Magistr, Xalqaro sertifikat sohibi',
    focus: 'CEFR B2-C1, Sarf va Nahv',
    biography: '',
    photo: '',
    yearsOfExperience: 5,
  });

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const data = await AdminApi.teachers.list();
      const items = Array.isArray(data) ? data : (data?.data || data?.items || []);
      setTeachers(items);
    } catch {
      notify('Ustozlarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setForm({
        fullName: teacher.fullName,
        slug: teacher.slug,
        department: teacher.department || '',
        qualification: teacher.qualification || '',
        focus: teacher.focus || '',
        biography: teacher.biography || '',
        photo: teacher.photo || '',
        yearsOfExperience: teacher.yearsOfExperience || 5,
      });
    } else {
      setEditingTeacher(null);
      setForm({
        fullName: '',
        slug: '',
        department: 'Professional Fonetika kafedrasi',
        qualification: 'Magistr, Xalqaro sertifikat sohibi',
        focus: 'Fonetika va nutq',
        biography: '',
        photo: '/teachers/teacher_1.png',
        yearsOfExperience: 5,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await AdminApi.teachers.update(editingTeacher.id, form);
        notify('Ustoz ma’lumotlari yangilandi', 'success');
      } else {
        await AdminApi.teachers.create(form);
        notify('Yangi ustoz qo‘shildi', 'success');
      }
      setModalOpen(false);
      loadTeachers();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`«${name}»ni o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await AdminApi.teachers.delete(id);
      notify('Ustoz o‘chirildi', 'info');
      loadTeachers();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Ustozlar va Mutaxassislar</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Akademiyaning professional arab tili professor-o‘qituvchilari, malaka darajalari va kafedralari
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className={ADMIN_THEME.btnPrimary}>
          <Plus size={16} />
          <span>Yangi Ustoz Qo‘shish</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Ustozlar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <GraduationCap size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{teachers.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Doimiy va taklif etilgan mutaxassislar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Xalqaro Sertifikatlilar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Award size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>100%</p>
          <p className={ADMIN_THEME.metricMeta}>CEFR C1 / Al-Azhar / Madina bitiruvchilari</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>O‘rtacha Ish Tajribasi</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Briefcase size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>6.5 yil</p>
          <p className={ADMIN_THEME.metricMeta}>Akademik o‘qitish amaliyoti</p>
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
            placeholder="Ustoz ismi, kafedrasi yoki malakasi bo‘yicha qidirish..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
          <div className="w-8 h-8 rounded-full border-2 border-[#086641] border-t-transparent animate-spin mx-auto mb-3" />
          <span className="text-xs text-[#667085]">Ustozlar ro‘yxati yuklanmoqda...</span>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
          <GraduationCap size={36} className="mx-auto text-[#667085]/40 mb-2" />
          <p className="text-xs font-semibold text-[#17212F]">Ustozlar topilmadi</p>
          <p className="text-[11px] text-[#667085] mt-1">
            Yangi ustoz qo‘shish tugmasi orqali profil yarating.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.fullName}
                        className="w-12 h-14 rounded-xl object-cover object-top border border-emerald-300/80 shadow-xs flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#086641] border border-emerald-200/80 flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
                        {t.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-[#17212F] leading-tight">
                        {t.fullName}
                      </h3>
                      <p className="text-[11px] font-medium text-[#667085] mt-0.5">
                        {t.department || 'Arab tili kafedrasi'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#F6F8FA] text-[#17212F] border border-[#E4E7EC]">
                    {t.yearsOfExperience || 5} yil staj
                  </span>
                </div>

                <div className="mt-4 space-y-2 pt-3 border-t border-[#E4E7EC]">
                  <div className="flex items-center gap-2 text-xs text-[#17212F]">
                    <Award size={14} className="text-[#D4AF65] flex-shrink-0" />
                    <span className="truncate font-medium">{t.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#667085]">
                    <BookOpen size={14} className="text-[#086641] flex-shrink-0" />
                    <span className="truncate">{t.focus || 'Fonetika va grammatika'}</span>
                  </div>
                </div>

                {t.biography && (
                  <p className="mt-3 text-[11px] text-[#667085] line-clamp-2 leading-relaxed">
                    {t.biography}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#E4E7EC] flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(t)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#17212F] bg-[#F6F8FA] hover:bg-[#E4E7EC] transition-colors cursor-pointer border border-[#E4E7EC]"
                >
                  <Edit size={13} />
                  <span>Tahrirlash</span>
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.fullName)}
                  className="p-1.5 rounded-lg text-[#667085] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="O‘chirish"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-sm font-bold text-[#17212F]">
                {editingTeacher ? 'Ustoz Ma’lumotlarini Tahrirlash' : 'Yangi Ustoz Qo‘shish'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className={ADMIN_THEME.label}>To‘liq Ism (F.I.SH.) *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Masalan: Shayx Abdulloh Al-Ahmad"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Kafedra / Bo‘lim</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="Masalan: Arab tili grammatikasi kafedrasi"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={ADMIN_THEME.label}>Malaka va Sertifikatlar</label>
                  <input
                    type="text"
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    placeholder="Masalan: Magistr, CEFR C1"
                    className={ADMIN_THEME.input}
                  />
                </div>
                <div>
                  <label className={ADMIN_THEME.label}>Ish Tajribasi (yil)</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={form.yearsOfExperience}
                    onChange={(e) => setForm({ ...form, yearsOfExperience: parseInt(e.target.value) || 1 })}
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Yo‘nalishi / Ixtisosligi</label>
                <input
                  type="text"
                  value={form.focus}
                  onChange={(e) => setForm({ ...form, focus: e.target.value })}
                  placeholder="Masalan: CEFR B2-C1, Sarf va Nahv, So‘zlashuv"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Ustoz Rasmi (URL yoki fayl yo‘li)</label>
                <input
                  type="text"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  placeholder="/teachers/teacher_1.png"
                  className={ADMIN_THEME.input}
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-[#667085]">Mavjud rasmlar:</span>
                  {['/teachers/teacher_1.png', '/teachers/teacher_2.png', '/teachers/teacher_3.png', '/teachers/teacher_4.png'].map((p, i) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setForm({ ...form, photo: p })}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        form.photo === p
                          ? 'bg-[#086641] text-white border-[#086641]'
                          : 'bg-[#F6F8FA] text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      Rasm {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Qisqacha Tarjimai Hol (Biografiya)</label>
                <textarea
                  rows={3}
                  value={form.biography}
                  onChange={(e) => setForm({ ...form, biography: e.target.value })}
                  placeholder="Ustozning ta’lim yo‘li va yutuqlari haqida qisqacha ma’lumot..."
                  className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                />
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
                  {editingTeacher ? 'O‘zgarishlarni Saqlash' : 'Ustozni Qo‘shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
