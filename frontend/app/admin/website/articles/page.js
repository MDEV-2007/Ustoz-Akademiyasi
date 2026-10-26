'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  Calendar,
  Eye,
  CheckCircle2,
  X,
  Save,
  Loader2,
  Tag,
  Languages,
  Sparkles,
} from 'lucide-react';

export default function ArticlesManager() {
  const { notify } = useAdmin();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    topic: 'Arab tili darslari',
    coverImageUrl: '',
    status: 'PUBLISHED',
    items: [],
  });

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.articles.list();
      const list = res?.items || (Array.isArray(res) ? res : []);
      setArticles(list);
    } catch {
      notify('Maqolalarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      topic: 'Arab tili darslari',
      coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      status: 'PUBLISHED',
      items: [
        { arabicText: 'السَّلَامُ عَلَيْكُمْ', translit: 'As-salamu alaykum', translation: 'Sizga tinchlik va omonlik bo‘lsin', sortOrder: 1 },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (article) => {
    setModalMode('edit');
    setCurrentId(article.id);
    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      topic: article.topic || 'Arab tili darslari',
      coverImageUrl: article.coverImageUrl || '',
      status: article.status || 'PUBLISHED',
      items: Array.isArray(article.items) ? article.items : [],
    });
    setModalOpen(true);
  };

  const handleSlugAuto = (title) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({ ...prev, title, slug: prev.slug || slug }));
  };

  const addVocabItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { arabicText: '', translit: '', translation: '', sortOrder: prev.items.length + 1 },
      ],
    }));
  };

  const removeVocabItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateVocabItem = (index, field, value) => {
    setFormData((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await AdminApi.articles.create(formData);
        notify('Yangi maqola muvaffaqiyatli chop etildi!', 'success');
      } else {
        await AdminApi.articles.update(currentId, formData);
        notify('Maqola yangilandi!', 'success');
      }
      setModalOpen(false);
      loadArticles();
    } catch (err) {
      notify(err.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" maqolasini o‘chirishni / arxivlashni tasdiqlaysizmi?`)) return;
    try {
      await AdminApi.articles.delete(id);
      notify('Maqola muvaffaqiyatli arxivlandi', 'info');
      loadArticles();
    } catch (err) {
      notify(err.message || 'O‘chirishda xatolik', 'error');
    }
  };

  const filtered = articles.filter((art) => {
    const matchesSearch =
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || art.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Yangiliklar va Maqolalar CMS</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Sayt va talabalar uchun arab tili lug‘atlari, qo‘llanmalar va e’lonlar boshqaruvi
          </p>
        </div>

        <button onClick={openCreateModal} className={ADMIN_THEME.btnPrimary}>
          <Plus size={16} />
          <span>Yangi Maqola Yozish</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Maqolalar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <Newspaper size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{articles.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Arab tili maqolalari va lug‘atlari</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Chop Etilganlar</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>
            {articles.filter((a) => a.status === 'PUBLISHED').length}
          </p>
          <p className={ADMIN_THEME.metricMeta}>Veb-saytda ochiq ko‘rinadi</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Arab Tili Lug‘at Birligi</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Languages size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>120+ so‘z</p>
          <p className={ADMIN_THEME.metricMeta}>Transliteratsiya va talaffuz bilan</p>
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
            placeholder="Maqola sarlavhasi yoki mavzusi bo‘yicha..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={15} className="text-[#667085] hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
          >
            <option value="ALL">Barcha Holatlar</option>
            <option value="PUBLISHED">Chop etilgan (Published)</option>
            <option value="DRAFT">Qoralama (Draft)</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Maqola Sarlavhasi</th>
                <th className={ADMIN_THEME.th}>Mavzu</th>
                <th className={ADMIN_THEME.th}>Lug‘at So‘zlari</th>
                <th className={ADMIN_THEME.th}>Chop Sanasi</th>
                <th className={ADMIN_THEME.th}>Holat</th>
                <th className={`${ADMIN_THEME.th} text-right`}>Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-[#086641] border-t-transparent animate-spin" />
                      <span>Maqolalar yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085] text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <Newspaper size={32} className="text-[#667085]/40" />
                      <span className="font-semibold">Maqolalar topilmadi</span>
                      <span className="text-[11px] text-[#667085]">
                        Yangi maqola yozish orqali talabalar uchun darsliklar e’lon qiling.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-[#F6F8FA] transition-colors">
                    <td className={ADMIN_THEME.td}>
                      <div>
                        <p className="font-bold text-[#17212F]">{art.title}</p>
                        <p className="text-[11px] font-mono text-[#086641] mt-0.5">
                          /{art.slug}
                        </p>
                      </div>
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#F6F8FA] text-[#17212F] border border-[#E4E7EC]">
                        {art.topic || 'Arab tili darslari'}
                      </span>
                    </td>
                    <td className={`${ADMIN_THEME.td} font-medium text-[#17212F]`}>
                      {art.items?.length || 0} ta so‘z
                    </td>
                    <td className={`${ADMIN_THEME.td} text-xs text-[#667085]`}>
                      {new Date(art.publishedAt || art.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={12} /> Chop etilgan
                      </span>
                    </td>
                    <td className={`${ADMIN_THEME.td} text-right`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-1.5 rounded-lg text-[#17212F] bg-[#F6F8FA] hover:bg-[#E4E7EC] transition-colors cursor-pointer border border-[#E4E7EC]"
                          title="Tahrirlash"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 rounded-lg text-[#667085] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="O‘chirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-sm font-bold text-[#17212F]">
                {modalMode === 'create' ? 'Yangi Maqola Yozish' : 'Maqolani Tahrirlash'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={ADMIN_THEME.label}>Maqola Sarlavhasi *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleSlugAuto(e.target.value)}
                    placeholder="Masalan: Arab tilida salomlashish odoblari"
                    className={ADMIN_THEME.input}
                  />
                </div>
                <div>
                  <label className={ADMIN_THEME.label}>Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className={ADMIN_THEME.input}
                  />
                </div>
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Mavzu (Kategoriya)</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Masalan: Boshlang‘ich darslar, Lug‘at, Tajvid"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Qisqacha Tavsif (Excerpt)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Maqola haqida qisqacha ma’lumot..."
                  className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Asosiy Matn (Content)</label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Maqolaning to‘liq matnini kiriting..."
                  className="w-full p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
                />
              </div>

              {/* Vocab Items Builder */}
              <div className="pt-3 border-t border-[#E4E7EC]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#17212F]">Arabcha So‘zlar / Lug‘at Birliklari</h4>
                    <p className="text-[11px] text-[#667085]">Transliteratsiya va talaffuzi bilan</p>
                  </div>
                  <button
                    type="button"
                    onClick={addVocabItem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#086641] bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    <Plus size={13} />
                    <span>So‘z qo‘shish</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Arabcha (مثال)"
                        dir="rtl"
                        value={item.arabicText}
                        onChange={(e) => updateVocabItem(idx, 'arabicText', e.target.value)}
                        className="w-1/3 h-9 px-2.5 rounded-lg bg-white border border-[#E4E7EC] text-xs font-bold text-right"
                      />
                      <input
                        type="text"
                        placeholder="Transliteratsiya"
                        value={item.translit}
                        onChange={(e) => updateVocabItem(idx, 'translit', e.target.value)}
                        className="w-1/3 h-9 px-2.5 rounded-lg bg-white border border-[#E4E7EC] text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="O‘zbekcha ma’nosi"
                        value={item.translation}
                        onChange={(e) => updateVocabItem(idx, 'translation', e.target.value)}
                        className="w-1/3 h-9 px-2.5 rounded-lg bg-white border border-[#E4E7EC] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeVocabItem(idx)}
                        className="p-1.5 text-[#667085] hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
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
                <button type="submit" disabled={submitting} className={ADMIN_THEME.btnPrimary}>
                  <Save size={15} />
                  <span>{submitting ? 'Saqlanmoqda...' : 'Chop Etish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
