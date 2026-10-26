'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Trash2,
  UserCheck,
  Check,
  Flag,
  Circle,
  Sparkles,
} from 'lucide-react';

export default function AdminTasksPage() {
  const { notify } = useAdmin();

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'UA-882288 raqamli arizachi bilan bog‘lanib, dars vaqtini tasdiqlash',
      assignedTo: 'Menejer (Operator 1)',
      priority: 'HIGH',
      dueDate: 'Bugun, 15:00',
      isOverdue: false,
      completed: false,
    },
    {
      id: '2',
      title: 'Chilonzor filialida ertangi «Hilol Kids» guruhi xonasini tayyorlash',
      assignedTo: 'Filial ma’muri',
      priority: 'MEDIUM',
      dueDate: 'Ertaga, 10:00',
      isOverdue: false,
      completed: false,
    },
    {
      id: '3',
      title: 'Bekor qilingan arizachilarga Telegram orqali so‘rovnoma yuborish',
      assignedTo: 'SMM / CRM Operator',
      priority: 'LOW',
      dueDate: '25-oktyabr',
      isOverdue: false,
      completed: true,
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [filter, setFilter] = useState('ALL');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      assignedTo: 'Menejer',
      priority: newPriority,
      dueDate: 'Bugun',
      isOverdue: false,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    notify('Yangi vazifa muvaffaqiyatli qo‘shildi', 'success');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    notify('Vazifa o‘chirildi', 'info');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ACTIVE') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>
            Vazifalar va Eslatmalar (CRM Tasks)
          </h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Mijozlar bilan qayta bog‘lanish, qo‘ng‘iroqlar va operatsion topshiriqlar nazorati
          </p>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Vazifalar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <ListTodo size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{tasks.length}</p>
          <p className={ADMIN_THEME.metricMeta}>Barcha rejalashtirilgan ishlar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Bajarilishi Kutilayotgan</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{activeCount}</p>
          <p className={ADMIN_THEME.metricMeta}>Faol topshiriqlar</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Bajarilgan</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{completedCount}</p>
          <p className={ADMIN_THEME.metricMeta}>Muvaffaqiyatli yakunlandi</p>
        </div>
      </div>

      {/* Add New Task Form */}
      <form
        onSubmit={handleAddTask}
        className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs flex flex-col sm:flex-row gap-3 items-center"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Yangi vazifa yoki eslatma kiriting (masalan: Talaba bilan bog‘lanish)..."
          className="flex-1 h-10 px-4 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all w-full sm:w-auto"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
          >
            <option value="HIGH">Yuqori muhimlik (High)</option>
            <option value="MEDIUM">O‘rtacha (Medium)</option>
            <option value="LOW">Past (Low)</option>
          </select>

          <button type="submit" className={ADMIN_THEME.btnPrimary}>
            <Plus size={16} />
            <span>Qo‘shish</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E7EC] pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'ALL'
              ? 'bg-[#101828] text-white'
              : 'text-[#667085] hover:text-[#17212F] hover:bg-[#F2F4F7]'
          }`}
        >
          Barchasi ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'ACTIVE'
              ? 'bg-[#101828] text-white'
              : 'text-[#667085] hover:text-[#17212F] hover:bg-[#F2F4F7]'
          }`}
        >
          Faol ({activeCount})
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'COMPLETED'
              ? 'bg-[#101828] text-white'
              : 'text-[#667085] hover:text-[#17212F] hover:bg-[#F2F4F7]'
          }`}
        >
          Bajarilgan ({completedCount})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#E4E7EC]">
            <ListTodo size={32} className="mx-auto text-[#667085]/40 mb-2" />
            <p className="text-xs font-semibold text-[#17212F]">Vazifalar mavjud emas</p>
            <p className="text-[11px] text-[#667085] mt-1">
              Yangi vazifa qo‘shish orqali jamoa ishlarini rejalashtiring.
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                t.completed
                  ? 'border-[#E4E7EC] bg-[#F6F8FA]/60 opacity-70'
                  : 'border-[#E4E7EC] hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                    t.completed
                      ? 'bg-[#086641] text-white'
                      : 'border-2 border-slate-300 hover:border-[#086641]'
                  }`}
                >
                  {t.completed && <Check size={14} />}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold leading-relaxed ${
                      t.completed ? 'line-through text-[#667085]' : 'text-[#17212F]'
                    }`}
                  >
                    {t.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-[#667085]">
                    <span className="flex items-center gap-1 font-medium">
                      <UserCheck size={12} /> {t.assignedTo}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={12} /> {t.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {t.priority === 'HIGH' && (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Yuqori
                  </span>
                )}
                {t.priority === 'MEDIUM' && (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    O‘rtacha
                  </span>
                )}
                {t.priority === 'LOW' && (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Oddiy
                  </span>
                )}

                <button
                  onClick={() => deleteTask(t.id)}
                  title="O‘chirish"
                  className="p-1.5 rounded-lg text-[#667085] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
