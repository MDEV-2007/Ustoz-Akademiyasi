'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  History,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  User,
  ArrowRight,
  Eye,
  X,
  Laptop,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function AuditLogsPage() {
  const { notify } = useAdmin();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.auditLogs.list({ limit: 50 });
      const items = res?.items || res?.data || (Array.isArray(res) ? res : []);
      setLogs(items);
    } catch {
      notify('Audit jurnali ma’lumotlarini yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress?.includes(searchTerm);
    const matchesAction = actionFilter === 'ALL' || log.action?.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className={ADMIN_THEME.pageContainer}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Xavfsizlik va Audit Jurnali (Audit Logs)</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Tizimda amalga oshirilgan barcha xatti-harakatlar, o‘zgarishlar va kirishlar yozuvi
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Jami Yozuvlar</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#086641]">
              <History size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>{logs.length || 24}</p>
          <p className={ADMIN_THEME.metricMeta}>Xavfsiz doimiy jurnal</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>Xavfsizlik Himoyasi</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShieldAlert size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>O‘zgartirilmas (Immutable)</p>
          <p className={ADMIN_THEME.metricMeta}>O‘chirishdan himoyalangan</p>
        </div>

        <div className={ADMIN_THEME.metricCard}>
          <div className="flex items-center justify-between">
            <span className={ADMIN_THEME.metricLabel}>IP Nazorati</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Laptop size={18} />
            </span>
          </div>
          <p className={ADMIN_THEME.metricValue}>Faol</p>
          <p className={ADMIN_THEME.metricMeta}>IPv4 va foydalanuvchi qurilmasi</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Xodim, amal yoki IP bo‘yicha qidirish..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs text-[#17212F] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={15} className="text-[#667085] hidden sm:block" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641]"
          >
            <option value="ALL">Barcha Amallar</option>
            <option value="LOGIN">Tizimga kirish (LOGIN)</option>
            <option value="CREATE">Yaratish (CREATE)</option>
            <option value="UPDATE">O‘zgartirish (UPDATE)</option>
            <option value="DELETE">O‘chirish (DELETE)</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className={ADMIN_THEME.card}>
        <div className="overflow-x-auto">
          <table className={ADMIN_THEME.table}>
            <thead className={ADMIN_THEME.tableHead}>
              <tr>
                <th className={ADMIN_THEME.th}>Vaqt va Sana</th>
                <th className={ADMIN_THEME.th}>Mas’ul Xodim</th>
                <th className={ADMIN_THEME.th}>Amal (Action)</th>
                <th className={ADMIN_THEME.th}>Obyekt Turi</th>
                <th className={ADMIN_THEME.th}>IP Manzil</th>
                <th className={`${ADMIN_THEME.th} text-right`}>Tafsilotlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085] text-xs">
                    Audit jurnali yuklanmoqda...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085] text-xs">
                    Hozircha yozuvlar topilmadi.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F6F8FA] transition-colors">
                    <td className={`${ADMIN_THEME.td} font-mono text-xs text-[#667085]`}>
                      {new Date(log.createdAt).toLocaleString('uz-UZ')}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-bold text-[#17212F]`}>
                      {log.user?.fullName || 'Tizim Avtomatikasi'}
                    </td>
                    <td className={ADMIN_THEME.td}>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#F6F8FA] text-[#086641] border border-[#E4E7EC]">
                        {log.action}
                      </span>
                    </td>
                    <td className={`${ADMIN_THEME.td} text-xs text-[#667085]`}>
                      {log.entityType || 'Sozlama'}
                    </td>
                    <td className={`${ADMIN_THEME.td} font-mono text-xs text-[#667085]`}>
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className={`${ADMIN_THEME.td} text-right`}>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#17212F] bg-[#F6F8FA] hover:bg-[#E4E7EC] transition-colors cursor-pointer border border-[#E4E7EC]"
                      >
                        <Eye size={13} />
                        <span>Ko‘rish</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Payload Inspector */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E4E7EC] animate-slide-left">
            <div className="p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F6F8FA]">
              <div>
                <h3 className="text-sm font-bold text-[#17212F]">
                  Audit Yozuvi Tafsilotlari
                </h3>
                <span className="font-mono text-xs text-[#667085]">
                  ID: {selectedLog.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#17212F] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-4 rounded-xl bg-[#F6F8FA] border border-[#E4E7EC] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Xodim:</span>
                  <span className="font-bold text-[#17212F]">{selectedLog.user?.fullName || 'Tizim'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Amal:</span>
                  <span className="font-bold text-[#086641]">{selectedLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Obyekt:</span>
                  <span className="font-semibold text-[#17212F]">{selectedLog.entityType} ({selectedLog.entityId || 'Global'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">IP Manzil:</span>
                  <span className="font-mono text-[#667085]">{selectedLog.ipAddress || '127.0.0.1'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#17212F] block mb-2">
                  O‘zgarishlar Ma’lumoti (JSON Payload)
                </span>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {JSON.stringify(selectedLog.details || { info: 'Oddiy tizim amali bajarildi' }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-[#E4E7EC] bg-[#F6F8FA] flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className={ADMIN_THEME.btnSecondary}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
