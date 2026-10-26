'use client';

import React, { useState } from 'react';
import { X, Copy } from 'lucide-react';

export default function AdminDevModal({
  adminDrawerOpen,
  setAdminDrawerOpen,
  telegramBotConfig,
  setTelegramBotConfig,
  customPhotos,
  handleCustomPhotoUpload
}) {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!adminDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#073F31]/15 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-[#07966F]">
              Texnik Boshqaruv va Integratsiya
            </span>
            <h2 id="admin-modal-title" className="text-xl font-bold text-[#14231F]">
              Sinov darsi API integratsiyasi va Haqiqiy Fotolavhalar
            </h2>
          </div>
          <button
            onClick={() => setAdminDrawerOpen(false)}
            className="p-2 rounded-lg bg-[#F8FAF8] hover:bg-gray-200 text-[#14231F] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Live Telegram Bot Bridge for Real Lead Delivery */}
        <div className="p-5 rounded-xl bg-[#F8FAF8] border border-[#073F31]/15 space-y-3">
          <div className="text-sm font-bold text-[#14231F]">
            1. Telegram Bot orqali jonli arizalarni qabul qilish (Ixtiyoriy sinov)
          </div>
          <p className="text-xs text-[#65756F]">
            Agar Bot Token va Chat ID kiritsangiz, «Bepul sinov darsiga yozilish» formasi haqiqiy Telegram xabarini yuboradi va tasdiqlash sahifasiga (`/royxatdan-otish/tasdiq`) o‘tadi.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="password"
              placeholder="Bot Token (masalan: 123456:ABC-DEF...)"
              value={telegramBotConfig?.botToken || ''}
              onChange={(e) =>
                setTelegramBotConfig({ ...telegramBotConfig, botToken: e.target.value })
              }
              className="px-3 py-2 rounded-lg border border-[#073F31]/20 text-xs bg-white"
            />
            <input
              type="text"
              placeholder="Chat ID (masalan: -100123456789)"
              value={telegramBotConfig?.chatId || ''}
              onChange={(e) =>
                setTelegramBotConfig({ ...telegramBotConfig, chatId: e.target.value })
              }
              className="px-3 py-2 rounded-lg border border-[#073F31]/20 text-xs bg-white"
            />
          </div>
        </div>

        {/* 2. Upload Authentic Academy Classroom Photos */}
        <div className="p-5 rounded-xl bg-[#F8FAF8] border border-[#073F31]/15 space-y-3">
          <div className="text-sm font-bold text-[#14231F]">
            2. Markazning haqiqiy sinfxona va filial suratlarini yuklash
          </div>
          <p className="text-xs text-[#65756F]">
            Begona fotobaza (stock photo) ishlatmaslik qoidasiga binoan, bu yerdan markazning o‘z suratlarini biriktirishingiz mumkin:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'hero', label: 'Hero (Bosh sahifa) surati' },
              { key: 'hilol-kids', label: 'Hilol Kids 4+ surati' },
              { key: 'professional-fonetika', label: 'Professional Fonetika surati' },
              { key: 'grammatika-va-cefr', label: 'Grammatika va CEFR surati' }
            ].map((slot) => (
              <label
                key={slot.key}
                className="p-3 rounded-lg bg-white border border-[#073F31]/20 flex items-center justify-between cursor-pointer hover:border-[#07966F]"
              >
                <span className="font-semibold text-[#14231F]">{slot.label}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCustomPhotoUpload(slot.key, e)}
                  className="hidden"
                />
                <span className="text-[#07966F] font-bold">
                  {customPhotos?.[slot.key] ? '✓ Yuklandi' : '+ Tanlash'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Next.js API Route Contract (/api/trial-registrations) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#14231F]">
              3. Server API Route kodi (app/api/trial-registrations/route.js)
            </span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `export async function POST(req) {\n  const body = await req.json();\n  // Validate +998 phone and forward to CRM / Telegram\n  return Response.json({ ok: true, referenceId: 'UA-' + Date.now() });\n}`
                );
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="text-xs font-bold text-[#07966F] flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'Nusxalandi!' : 'Nusxa olish'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-[#14231F] text-[#63E6BE] text-[11px] overflow-x-auto">
{`// app/api/trial-registrations/route.js
export async function POST(request) {
  const payload = await request.json();
  const { fullName, phone, courseSlug, branchSlug } = payload;
  if (!fullName || !/^\\+998\\d{9}$/.test(phone)) {
    return Response.json({ error: "Ma'lumotlar to'liq emas" }, { status: 400 });
  }
  return Response.json({ ok: true, referenceId: 'UA-' + Math.floor(100000 + Math.random() * 900000) });
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
