'use client';

import React, { useState, useEffect } from 'react';
import { AdminApi } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  GraduationCap,
  Award,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const { notify } = useAdmin();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    targetAudience: '',
    level: "Boshlang'ich",
    durationMonths: 3,
    status: 'PUBLISHED',
    featured: false,
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await AdminApi.courses.list();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      notify('Kurslarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setForm({
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription || '',
        description: course.description || '',
        targetAudience: course.targetAudience || '',
        level: course.level || "Boshlang'ich",
        durationMonths: course.durationMonths || 3,
        status: course.status || 'PUBLISHED',
        featured: course.featured || false,
      });
    } else {
      setEditingCourse(null);
      setForm({
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        targetAudience: 'Barcha qiziquvchilar',
        level: "Boshlang'ich (0 dan)",
        durationMonths: 3,
        status: 'PUBLISHED',
        featured: false,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await AdminApi.courses.update(editingCourse.id, form);
        notify('Kurs muvaffaqiyatli yangilandi', 'success');
      } else {
        await AdminApi.courses.create(form);
        notify('Yangi kurs muvaffaqiyatli yaratildi', 'success');
      }
      setModalOpen(false);
      loadCourses();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`«${title}» kursini arxivlashni tasdiqlaysizmi?`)) return;
    try {
      await AdminApi.courses.delete(id);
      notify('Kurs arxivlandi', 'info');
      loadCourses();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>O‘quv Kurslari Boshqaruvi</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Akademiya o‘quv dasturlari, davomiyligi, darajalari va nashr holati
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className={ADMIN_THEME.btnPrimary}>
          <Plus size={16} />
          <span>Yangi Kurs Qo‘shish</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Kurslar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <BookOpen size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{courses.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Kattalar va bolalar dasturlari</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Faol Dasturlar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>
            {courses.filter((c) => c.status === 'PUBLISHED').length}
          </p>
          <p className={ADMIN_THEME.metricMeta}>Veb-sayt va botda qabul ochiq</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Sertifikat Darajalari</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>CEFR A1 – C1</p>
          <p className={ADMIN_THEME.metricMeta}>Xalqaro standart sertifikatlar</p>
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
            placeholder="Kurs nomi yoki darajasi bo‘yicha..."
            className={ADMIN_THEME.input}
          />
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-[#667085]">
            <div className="w-8 h-8 rounded-full border-2 border-[#086641] border-t-transparent animate-spin mx-auto mb-2" />
            <span>Kurslar yuklanmoqda...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-xs text-[#667085]">
            <BookOpen size={36} className="mx-auto text-[#667085]/40 mb-2" />
            <p className="font-semibold text-[#17212F]">Kurslar topilmadi</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#086641] flex items-center justify-center font-bold">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {course.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF65]/15 text-[#91712C] border border-[#D4AF65]/30">
                        Tanlangan
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        course.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {course.status === 'PUBLISHED' ? 'Faol' : 'Qoralama'}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#17212F] leading-snug">{course.title}</h3>
                <p className="text-xs text-[#667085] font-mono mt-0.5">/{course.slug}</p>

                <p className="text-xs text-[#667085] mt-3 line-clamp-2 leading-relaxed">
                  {course.shortDescription || course.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between text-xs text-[#667085] font-medium">
                  <span>Daraja: {course.level}</span>
                  <span className="font-mono font-bold text-[#17212F]">{course.durationMonths} oy</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#17212F]">
                  {course.branchCourses?.length || 8} ta filialda mavjud
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(course)}
                    className="p-1.5 rounded-lg text-[#17212F] hover:bg-[#F2F4F7] transition-colors cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.title)}
                    className="p-1.5 rounded-lg text-[#667085] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Arxivlash"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F8FAFC]">
              <h3 className="text-sm font-bold text-[#17212F]">
                {editingCourse ? 'Kursni Tahrirlash' : 'Yangi Kurs Yaratish'}
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
                  <label className={ADMIN_THEME.label}>Kurs Nomi *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Masalan: Kundalik va Kasbiy Arab Tili"
                    className={ADMIN_THEME.input}
                  />
                </div>
                <div>
                  <label className={ADMIN_THEME.label}>Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="kundalik-arab-tili"
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Qisqacha Ta’rif</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Kurs haqida 1-2 jumlali ma’lumot..."
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Batafsil Tavsif</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Kurs dasturi, o‘rganiladigan mavzular..."
                  className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={ADMIN_THEME.label}>Daraja</label>
                  <input
                    type="text"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    placeholder="Boshlang'ich, A2-B1, C1"
                    className={ADMIN_THEME.input}
                  />
                </div>
                <div>
                  <label className={ADMIN_THEME.label}>Davomiyligi (oy)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={form.durationMonths}
                    onChange={(e) => setForm({ ...form, durationMonths: parseInt(e.target.value) || 1 })}
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
                  {editingCourse ? 'O‘zgarishlarni Saqlash' : 'Kursni Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
