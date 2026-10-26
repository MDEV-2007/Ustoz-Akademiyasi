'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n, LOCALES_INFO } from '@/lib/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher({ className = '', dropUp = false }) {
  const { locale, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LOCALES_INFO.find((l) => l.code === locale) || LOCALES_INFO[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-white/90 hover:bg-white text-[#14231F] border border-[#073F31]/15 hover:border-[#07966F]/50 shadow-xs hover:shadow-sm transition-all cursor-pointer backdrop-blur-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Tilni tanlash / Выберите язык / Select language"
      >
        <Globe className="w-3.5 h-3.5 text-[#07966F]" />
        <span className="font-bold tracking-wide text-[#073F31]">{currentLang.shortLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#073F31]/60 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#073F31]/15 shadow-xl shadow-[#073F31]/10 z-50 py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#073F31]/50 border-b border-gray-100 mb-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-[#07966F]" />
            <span>Til / Язык / Language</span>
          </div>
          {LOCALES_INFO.map((item) => {
            const isActive = item.code === locale;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  changeLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#07966F]/10 text-[#073F31] font-bold'
                    : 'text-[#14231F] hover:bg-[#07966F]/5 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#07966F] text-white'
                        : 'bg-gray-100 text-[#073F31]'
                    }`}
                  >
                    {item.shortLabel}
                  </span>
                  <span>{item.name}</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-[#07966F]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
