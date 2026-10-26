'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  HelpCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export default function FaqManager() {
  const { notify } = useAdmin();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: "Boshlang'ich",
    sortOrder: 0,
    status: 'ACTIVE',
  });

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.faq.list();
      const list = Array.isArray(res) ? res : res?.items || [];
      setFaqs(list);
    } catch {
      notify('Savol-javoblarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormData({
      question: '',
      answer: '',
      category: "Boshlang'ich",
      sortOrder: faqs.length + 1,
      status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setModalMode('edit');
    setCurrentId(faq.id);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || "Boshlang'ich",
      sortOrder: faq.sortOrder || 1,
      status: faq.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await AdminApi.faq.create(formData);
        notify('Yangi savol-javob muvaffaqiyatli qo‘shildi!', 'success');
      } else {
        await AdminApi.faq.update(currentId, formData);
        notify('Savol-javob yangilandi!', 'success');
      }
      setModalOpen(false);
      loadFaqs();
    } catch (err) {
      notify(err.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, question) => {
    if (!window.confirm(`"${question}" savolini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await AdminApi.faq.delete(id);
      notify('Savol muvaffaqiyatli o‘chirildi', 'info');
      loadFaqs();
    } catch (err) {
      notify(err.message || 'O‘chirishda xatolik', 'error');
    }
  };

  const categories = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)));

  const filtered = faqs.filter((faq) => {
    const matchesSearch =
      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || faq.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Ko‘p Beriladigan Savollar (FAQ)</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Veb-sayt va talabalar uchun darslar, to‘lovlar va qabul qoidalari bo‘yicha tez-tez beriladigan savollar
          </p>
        </div>

        <button onClick={openCreateModal} className={ADMIN_THEME.btnPrimary}>
          <Plus size={16} />
          <span>Yangi Savol Qo‘shish</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Savol-Javoblar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <HelpCircle size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{faqs.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Barcha bo‘limlar bo‘yicha</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Kategoriyalar Soni</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Tag size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{categories.length || 4} ta</p>
          <p className={ADMIN_THEME.metricMeta}>Yo‘nalishlar tasnifi</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Saytda Ko‘rinishi</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>Faol</p>
          <p className={ADMIN_THEME.metricMeta}>Akordeon ko‘rinishida ochiq</p>
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
            placeholder="Savol yoki javob matni bo‘yicha..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={15} className="text-[#667085] hidden sm:block" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
          >
            <option value="ALL">Barcha Kategoriyalar</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
            <div className="w-8 h-8 rounded-full border-2 border-[#086641] border-t-transparent animate-spin mx-auto mb-3" />
            <span className="text-xs text-[#667085]">Savol-javoblar yuklanmoqda...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-white border border-[#E4E7EC]">
            <HelpCircle size={36} className="mx-auto text-[#667085]/40 mb-2" />
            <p className="text-xs font-semibold text-[#17212F]">Savollar topilmadi</p>
            <p className="text-[11px] text-[#667085] mt-1">
              Yangi savol qo‘shish orqali foydalanuvchilar savollariga javob bering.
            </p>
          </div>
        ) : (
          filtered.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white border border-[#E4E7EC] overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#F6F8FA] text-[#086641] border border-[#E4E7EC] flex-shrink-0">
                      {faq.category || "Boshlang'ich"}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#17212F] truncate">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(faq);
                      }}
                      className="p-1.5 rounded-lg text-[#17212F] hover:bg-[#F2F4F7] transition-colors cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(faq.id, faq.question);
                      }}
                      className="p-1.5 rounded-lg text-[#667085] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="O‘chirish"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="text-[#667085] ml-1">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#667085] leading-relaxed border-t border-[#E4E7EC]/60 bg-[#F6F8FA]/40 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Dialog for FAQ Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-sm font-bold text-[#17212F]">
                {modalMode === 'create' ? 'Yangi Savol Qo‘shish' : 'Savolni Tahrirlash'}
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
                <label className={ADMIN_THEME.label}>Savol Matni *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Masalan: Darslar qaysi kunlari o‘tiladi?"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Kategoriya</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Masalan: Boshlang'ich, To‘lov, Sertifikat"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Batafsil Javob *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Foydalanuvchiga to‘liq va aniq javob bering..."
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
