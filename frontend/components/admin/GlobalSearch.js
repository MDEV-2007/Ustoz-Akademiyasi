'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminApi } from '@/lib/admin-api';
import {
  Search,
  X,
  Compass,
  FileText,
  BookOpen,
  User,
  Phone,
  ChevronRight,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

const ADMIN_PAGES = [
  { path: '/admin/dashboard', title: 'Dashboard', group: 'Umumiy', keywords: 'asosiy dashboard statistika ko‘rsatkich' },
  { path: '/admin/crm/leads', title: 'Murojaatlar (Arizalar)', group: 'CRM', keywords: 'ariza arizalar murojaat lid leads qabul' },
  { path: '/admin/crm/clients', title: 'Mijozlar bazasi (O‘quvchilar)', group: 'CRM', keywords: 'talaba o‘quvchi mijoz mijozlar to‘lov qilgan' },
  { path: '/admin/crm/trial-lessons', title: 'Sinov darslari', group: 'CRM', keywords: 'sinov darsi trial lesson qatnashgan belgilangan' },
  { path: '/admin/crm/tasks', title: 'Vazifalar va eslatmalar', group: 'CRM', keywords: 'vazifa task eslatma qo‘ng‘iroq qilish reja' },
  { path: '/admin/academy/courses', title: 'O‘quv kurslari', group: 'Akademiya', keywords: 'kurs kurslar arab tili dastur ta’lim bolalar' },
  { path: '/admin/academy/teachers', title: 'Ustozlar jamoasi', group: 'Akademiya', keywords: 'ustoz ustozlar o‘qituvchi muallim mutaxassis' },
  { path: '/admin/academy/branches', title: 'Filiallar', group: 'Akademiya', keywords: 'filial filiallar chilonzor yunusobod manzil lokatsiya' },
  { path: '/admin/academy/schedules', title: 'Dars jadvali', group: 'Akademiya', keywords: 'jadval dars vaqti guruh xona darslar' },
  { path: '/admin/website/homepage', title: 'Bosh sahifa boshqaruvi', group: 'Sayt CMS', keywords: 'bosh sahifa banner hero afzallik statistika cms' },
  { path: '/admin/website/pages', title: 'Statik sahifalar', group: 'Sayt CMS', keywords: 'sahifa sahifalar biz haqimizda shartlar oferta' },
  { path: '/admin/website/articles', title: 'Yangiliklar va maqolalar', group: 'Sayt CMS', keywords: 'maqola yangilik maqolalar blog post matn' },
  { path: '/admin/website/faq', title: 'Savol-javoblar (FAQ)', group: 'Sayt CMS', keywords: 'faq savol javob tez-tez beriladigan' },
  { path: '/admin/website/media', title: 'Media kutubxonasi', group: 'Sayt CMS', keywords: 'media rasm fayl kutubxona yuklash video' },
  { path: '/admin/website/seo', title: 'SEO sozlamalari', group: 'Sayt CMS', keywords: 'seo meta title description kalit so‘z google' },
  { path: '/admin/bot/overview', title: 'Telegram Bot Boshqaruvi', group: 'Telegram Bot', keywords: 'bot telegram bot boshqaruv statistika polling' },
  { path: '/admin/bot/messages', title: 'Xabarlar va menyular', group: 'Telegram Bot', keywords: 'xabar menyu matn bot xabari salomlashish' },
  { path: '/admin/bot/faq', title: 'Bot FAQ', group: 'Telegram Bot', keywords: 'bot faq savol javob telegram savollar' },
  { path: '/admin/bot/leads', title: 'Botdan kelgan arizalar', group: 'Telegram Bot', keywords: 'bot ariza botdan kelgan telegram arizalar' },
  { path: '/admin/bot/notifications', title: 'Bildirishnomalar', group: 'Telegram Bot', keywords: 'bildirishnoma broadcast yuborish habar admin bot' },
  { path: '/admin/bot/stats', title: 'Bot statistikasi', group: 'Telegram Bot', keywords: 'bot statistika faollik foydalanuvchilar konversiya' },
  { path: '/admin/system/reports', title: 'Tizim hisobotlari', group: 'Tizim', keywords: 'hisobot analitika konversiya eksport tahlil' },
  { path: '/admin/system/staff', title: 'Xodimlar va ruxsatlar', group: 'Tizim', keywords: 'xodim xodimlar admin menejer ruxsat parol profil' },
  { path: '/admin/system/audit-logs', title: 'Audit jurnali', group: 'Tizim', keywords: 'audit log jurnal tarix harakat xavfsizlik' },
  { path: '/admin/system/settings', title: 'Tizim sozlamalari', group: 'Tizim', keywords: 'sozlama tizim konfiguratsiya kontakt telefon email' },
];

const STATUS_LABELS = {
  NEW: { label: 'Yangi', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CONTACTED: { label: 'Bog‘lanildi', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  SCHEDULED: { label: 'Sinov darsi', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  ATTENDED: { label: 'Qatnashdi', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  CONVERTED: { label: 'Qabul qilindi', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  CANCELLED: { label: 'Bekor qilindi', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function GlobalSearch({ isMobileModal = false, onCloseMobile }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Results state
  const [pageResults, setPageResults] = useState([]);
  const [leadResults, setLeadResults] = useState([]);
  const [courseResults, setCourseResults] = useState([]);

  // Cache courses to avoid repeating requests
  const coursesCacheRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Global hotkey: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        if (onCloseMobile) onCloseMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseMobile]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic
  useEffect(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      setPageResults([]);
      setLeadResults([]);
      setCourseResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Client-side match for pages
    const matchedPages = ADMIN_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(cleanQuery) ||
        p.group.toLowerCase().includes(cleanQuery) ||
        p.keywords.toLowerCase().includes(cleanQuery) ||
        p.path.toLowerCase().includes(cleanQuery)
    ).slice(0, 5);

    setPageResults(matchedPages);

    // 2. Debounced API search for Leads & Courses
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Fetch courses if not cached yet
        if (!coursesCacheRef.current) {
          try {
            const rawCourses = await AdminApi.courses.list();
            coursesCacheRef.current = Array.isArray(rawCourses)
              ? rawCourses
              : rawCourses?.data || [];
          } catch {
            coursesCacheRef.current = [];
          }
        }

        // Filter courses
        const matchedCourses = (coursesCacheRef.current || [])
          .filter(
            (c) =>
              c.title?.toLowerCase().includes(cleanQuery) ||
              c.targetAudience?.toLowerCase().includes(cleanQuery) ||
              c.level?.toLowerCase().includes(cleanQuery)
          )
          .slice(0, 4);
        setCourseResults(matchedCourses);

        // Fetch leads from backend
        const leadsData = await AdminApi.leads.list({
          search: cleanQuery,
          limit: 6,
        });

        const list = Array.isArray(leadsData)
          ? leadsData
          : leadsData?.data || leadsData?.items || [];
        setLeadResults(list);
      } catch (err) {
        console.error('[GlobalSearch Error]', err);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  const handleSelectPage = (path) => {
    setIsOpen(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
    startTransition(() => {
      router.push(path);
    });
  };

  const handleSelectLead = (lead) => {
    setIsOpen(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
    // Navigate to CRM leads filtered to this referenceId or phone
    const targetSearch = lead.referenceId || lead.phone || lead.fullName;
    startTransition(() => {
      router.push(`/admin/crm/leads?search=${encodeURIComponent(targetSearch)}`);
    });
  };

  const handleSelectCourse = () => {
    setIsOpen(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
    startTransition(() => {
      router.push('/admin/academy/courses');
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!query.trim()) return;

      setIsOpen(false);
      if (onCloseMobile) onCloseMobile();
      // If there is an exact page match, go to it
      if (pageResults.length > 0 && query.trim().length <= 4) {
        handleSelectPage(pageResults[0].path);
        return;
      }

      // Default: view all matching leads
      router.push(`/admin/crm/leads?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const hasResults = pageResults.length > 0 || leadResults.length > 0 || courseResults.length > 0;
  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Bar Input */}
      <div className="relative w-full flex items-center">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Qidiruv (mijoz, telefon, ariza ID, kurs, sahifa)..."
          className="w-full h-9 pl-9 pr-16 text-xs rounded-xl bg-slate-100/90 border border-slate-200/60 focus:border-emerald-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {loading ? (
            <Loader2 size={14} className="animate-spin text-emerald-600 mr-1" />
          ) : query ? (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X size={13} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200/70 border border-slate-300/60 rounded">
              Ctrl K
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Results Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 w-full min-w-[340px] sm:min-w-[480px] max-h-[75vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-[9999] p-2 space-y-3 animate-in fade-in zoom-in-95 backdrop-blur-md">
          {/* Quick Page Jump Results */}
          {pageResults.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass size={12} className="text-emerald-600" />
                <span>Bo‘limlar va Sahifalar</span>
              </div>
              <div className="space-y-0.5">
                {pageResults.map((p) => (
                  <button
                    key={p.path}
                    onClick={() => handleSelectPage(p.path)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                        <Compass size={13} />
                      </span>
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 group-hover:text-emerald-900 truncate">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{p.group}</p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CRM Leads Results */}
          {leadResults.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={12} className="text-blue-600" />
                <span>Arizalar va O‘quvchilar ({leadResults.length})</span>
              </div>
              <div className="space-y-1">
                {leadResults.map((lead) => {
                  const statusInfo = STATUS_LABELS[lead.status] || {
                    label: lead.status,
                    bg: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <button
                      key={lead.id}
                      onClick={() => handleSelectLead(lead)}
                      className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-blue-50/70 border border-slate-100 hover:border-blue-100 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#086641] to-[#073F31] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {lead.fullName?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900 group-hover:text-blue-900 truncate">
                              {lead.fullName}
                            </p>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {lead.referenceId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-0.5 font-mono">
                              <Phone size={10} className="text-slate-400" />
                              {lead.phoneFormatted || lead.phone}
                            </span>
                            {lead.course?.title && (
                              <span className="truncate text-slate-600 font-medium">
                                • {lead.course.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg}`}
                        >
                          {statusInfo.label}
                        </span>
                        <ChevronRight size={13} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courses Results */}
          {courseResults.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen size={12} className="text-amber-600" />
                <span>O‘quv Kurslari</span>
              </div>
              <div className="space-y-0.5">
                {courseResults.map((c) => (
                  <button
                    key={c.id || c.slug}
                    onClick={handleSelectCourse}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-amber-50/80 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-amber-100/70 text-amber-800">
                        <GraduationCap size={13} />
                      </span>
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 group-hover:text-amber-900 truncate">
                          {c.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {c.targetAudience || 'Barcha yoshlar'} • {c.level || 'Standart'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 group-hover:text-amber-700 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results empty state */}
          {!hasResults && !loading && (
            <div className="py-8 text-center px-4">
              <Search size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">Hech qanday natija topilmadi</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                «{query}» bo‘yicha ariza, mijoz, kurs yoki sahifa topilmadi. Qidiruv so‘zini tekshirib qayta urinib ko‘ring.
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-2 px-3 pb-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/70 -mx-2 -mb-2 rounded-b-2xl">
            <span className="text-[10px] text-slate-400">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px]">Enter</kbd> bosib barcha natijalarni ochish
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                if (onCloseMobile) onCloseMobile();
                router.push(`/admin/crm/leads?search=${encodeURIComponent(query.trim())}`);
              }}
              className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              Barcha arizalarda ko‘rish <ArrowRight size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
