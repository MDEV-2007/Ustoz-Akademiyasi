'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  MessagesSquare,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Save,
  Bot,
  Zap,
} from 'lucide-react';

export default function BotFaqManager() {
  const { notify } = useAdmin();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Telegram Bot',
    sortOrder: 1,
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.faq.list();
      const list = Array.isArray(res) ? res : res?.items || [];
      setFaqs(list);
    } catch {
      notify('Bot FAQ ma’lumotlarini yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openCreateModal = () => {
    setCurrentId(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Telegram Bot',
      sortOrder: faqs.length + 1,
      status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setCurrentId(faq.id);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'Telegram Bot',
      sortOrder: faq.sortOrder || 1,
      status: faq.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentId) {
        await AdminApi.faq.update(currentId, formData);
        notify('Bot FAQ muvaffaqiyatli yangilandi!', 'success');
      } else {
        await AdminApi.faq.create(formData);
        notify('Yangi savol-javob botga qo‘shildi!', 'success');
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
      notify('Savol o‘chirildi', 'info');
      loadFaqs();
    } catch (err) {
      notify(err.message || 'O‘chirishda xatolik', 'error');
    }
  };

  const filtered = faqs.filter(
    (f) =>
      f.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Telegram Bot Tezkor Savollari (FAQ)</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Telegram bot foydalanuvchilariga avtomatik yuboriluvchi savol-javoblar va yo‘riqnomalar
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
            <span className={ADMIN_THEME.metricLabel}>Jami Bot Savollari</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <MessagesSquare size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{faqs.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Telegram bot menyusida faol</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Avto-Javob Tezligi</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Zap size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>&lt; 0.2 soniya</p>
          <p className={ADMIN_THEME.metricMeta}>Foydalanuvchi tugmani bosganda</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Xizmat Tili</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Bot size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>O‘zbekcha (Lotin)</p>
          <p className={ADMIN_THEME.metricMeta}>Barcha arizachilar uchun tushunarli</p>
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
            placeholder="Bot savol yoki javobi bo‘yicha qidirish..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>
      </div>

      {/* FAQs Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Savol Matni</th>
                <th className={ADMIN_THEME.th}>Avto-Javob</th>
                <th className={ADMIN_THEME.th}>Tartib</th>
                <th className={ADMIN_THEME.th}>Holat</th>
                <th className={`${ADMIN_THEME.th} text-right`}>Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[#667085] text-xs">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[#667085] text-xs">
                    Savollar topilmadi.
                  </td>
                </tr>
              ) : (
                filtered.map((faq) => (
                  <tr key={faq.id} className="hover:bg-[#F6F8FA] transition-colors">
                    <td className={`${ADMIN_THEME.td} font-bold text-[#17212F] max-w-xs`}>
                      {faq.question}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-[#667085] text-xs max-w-md truncate`}>
                      {faq.answer}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-mono text-xs font-semibold text-[#17212F]`}>
                      #{faq.sortOrder}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={12} /> Faol
                      </span>
                    </td>
                    <td className={`${ADMIN_THEME.td} text-right`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(faq)}
                          className="p-1.5 rounded-lg text-[#17212F] bg-[#F6F8FA] hover:bg-[#E4E7EC] transition-colors cursor-pointer border border-[#E4E7EC]"
                          title="Tahrirlash"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id, faq.question)}
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

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E4E7EC] overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <h3 className="text-sm font-bold text-[#17212F]">
                {currentId ? 'Bot Savolini Tahrirlash' : 'Yangi Bot Savoli Qo‘shish'}
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
                  placeholder="Masalan: Darslar qaysi filialda bo‘ladi?"
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Tartib Raqami</label>
                <input
                  type="number"
                  min={1}
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                  className={ADMIN_THEME.input}
                />
              </div>

              <div>
                <label className={ADMIN_THEME.label}>Bot Avtomatik Javobi *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Telegram foydalanuvchisiga yuboriladigan to‘liq javob matni..."
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
