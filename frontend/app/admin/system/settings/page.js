'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin-context';
import AdminApi from '@/lib/admin-api';
import { ADMIN_THEME } from '@/lib/admin-theme';
import {
  Settings,
  Save,
  Building,
  Phone,
  Mail,
  MapPin,
  Bot,
  Bell,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  academy_name: 'Ustoz Akademiyasi',
  academy_slogan: 'Professional Arab Tili Ta’lim Markazi',
  academy_phone: '+998 55 518 44 00',
  academy_email: 'info@ustozakademiyasi.uz',
  academy_address: 'Toshkent shahri, Chilonzor tumani, Bunyodkor ko‘chasi, 42-uy',
  working_hours: 'Dushanba - Shanba: 09:00 - 21:00',
  telegram_channel: 'https://t.me/ustozakademiyasi',
  instagram_page: 'https://instagram.com/ustozakademiyasi',
  telegram_admin_chat_id: '-1002345678901',
  notify_lead_telegram: 'true',
  notify_lead_email: 'false',
  registration_open: 'true',
};

export default function SystemSettingsPage() {
  const { notify } = useAdmin();
  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await AdminApi.settings.list();
        const list = Array.isArray(res) ? res : [];
        const mapped = { ...DEFAULT_SETTINGS };
        list.forEach((item) => {
          if (mapped[item.key] !== undefined) {
            mapped[item.key] = item.value;
          }
        });
        setFormData(mapped);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const [key, val] of Object.entries(formData)) {
        await AdminApi.settings.update(key, val, 'Tizim umumiy sozlamalari');
      }
      notify('Tizim sozlamalari muvaffaqiyatli saqlandi!', 'success');
    } catch (err) {
      notify(err.message || 'Saqlashda xatolik', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${ADMIN_THEME.pageContainer} max-w-5xl`}>
      {/* Page Header */}
      <div className={ADMIN_THEME.pageHeader}>
        <div>
          <h1 className={ADMIN_THEME.pageTitle}>Tizim va Akademiya Sozlamalari</h1>
          <p className={ADMIN_THEME.pageSubtitle}>
            Ustoz Akademiyasi rekvizitlari, markaziy aloqa liniyalari, xabarnoma sozlamalari va Telegram integratsiyasi
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={ADMIN_THEME.btnPrimary}
        >
          <Save size={16} />
          <span>{saving ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academy Profile */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Akademiya Rekvizitlari</h3>
          <p className="text-xs text-[#667085] mb-5">
            Barcha sahifalar, arizalar va shartnomalarda ko‘rinuvchi rasmiy ma’lumotlar
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={ADMIN_THEME.label}>Akademiya Nomi</label>
              <input
                type="text"
                value={formData.academy_name}
                onChange={(e) => handleChange('academy_name', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Rasmiy Shior</label>
              <input
                type="text"
                value={formData.academy_slogan}
                onChange={(e) => handleChange('academy_slogan', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Yagona Call Center Telefoni</label>
              <input
                type="text"
                value={formData.academy_phone}
                onChange={(e) => handleChange('academy_phone', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Rasmiy Email Manzili</label>
              <input
                type="email"
                value={formData.academy_email}
                onChange={(e) => handleChange('academy_email', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={ADMIN_THEME.label}>Bosh Ofis Manzili</label>
              <input
                type="text"
                value={formData.academy_address}
                onChange={(e) => handleChange('academy_address', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={ADMIN_THEME.label}>Ish Tartibi va Soatlari</label>
              <input
                type="text"
                value={formData.working_hours}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>
          </div>
        </div>

        {/* Telegram & Bot Integration */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Telegram va Bot Integratsiyasi</h3>
          <p className="text-xs text-[#667085] mb-5">
            Yangi arizalar tushganda ma’murlar guruhiga darhol xabar yetkazish
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={ADMIN_THEME.label}>Admin Guruhi Chat ID (Telegram)</label>
              <input
                type="text"
                value={formData.telegram_admin_chat_id}
                onChange={(e) => handleChange('telegram_admin_chat_id', e.target.value)}
                placeholder="-100XXXXXXXXXX"
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Rasmiy Telegram Kanal Havolasi</label>
              <input
                type="text"
                value={formData.telegram_channel}
                onChange={(e) => handleChange('telegram_channel', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Instagram Sahifa Havolasi</label>
              <input
                type="text"
                value={formData.instagram_page}
                onChange={(e) => handleChange('instagram_page', e.target.value)}
                className={ADMIN_THEME.input}
              />
            </div>

            <div>
              <label className={ADMIN_THEME.label}>Arizalarni Telegramga Yuborish</label>
              <select
                value={formData.notify_lead_telegram}
                onChange={(e) => handleChange('notify_lead_telegram', e.target.value)}
                className={ADMIN_THEME.select}
              >
                <option value="true">Yoqilgan (Tavsiya etiladi)</option>
                <option value="false">O‘chirilgan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational Status */}
        <div className={ADMIN_THEME.cardPadded}>
          <h3 className="text-sm font-bold text-[#17212F] mb-1">Qabul Jarayoni Holati</h3>
          <p className="text-xs text-[#667085] mb-5">
            Veb-sayt va botda arizalarni qabul qilish ochiqligi
          </p>

          <div className="max-w-md">
            <label className={ADMIN_THEME.label}>Yangi Talabalar Qabuli</label>
            <select
              value={formData.registration_open}
              onChange={(e) => handleChange('registration_open', e.target.value)}
              className={ADMIN_THEME.select}
            >
              <option value="true">Qabul Ochiq (Ro‘yxatdan o‘tish faol)</option>
              <option value="false">Qabul Vaqtincha Yopiq (Mavsumiy to‘xtatish)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className={ADMIN_THEME.btnPrimary}
          >
            <Save size={16} />
            <span>{saving ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
