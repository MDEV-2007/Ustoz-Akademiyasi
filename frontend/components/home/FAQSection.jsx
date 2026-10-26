'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { INITIAL_FAQ_ITEMS } from '@/lib/constants/academy-data';

export default function FAQSection({
  faqItems = [],
  t = {}
}) {
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Fallback to INITIAL_FAQ_ITEMS if empty to ensure questions are always visible
  const items = faqItems && faqItems.length > 0 ? faqItems : INITIAL_FAQ_ITEMS;

  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  const renderFaqCard = (item, itemIndex) => {
    const open = openFaqIdx === itemIndex;
    return (
      <div
        key={item.q || itemIndex}
        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
          open ? 'border-[#07966F] shadow-sm' : 'border-[#073F31]/15 hover:border-[#07966F]/40'
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpenFaqIdx(open ? -1 : itemIndex)}
          className="w-full p-4 sm:p-5 lg:p-6 text-left flex items-start justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-[#F8FAF8]/70 transition-colors"
        >
          <span className="text-sm sm:text-base font-bold text-[#14231F] leading-snug">
            {item.q}
          </span>
          <span
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 mt-0.5 ${
              open ? 'bg-[#07966F]/10 text-[#07966F]' : 'bg-[#073F31]/5 text-[#073F31]'
            }`}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                open ? 'rotate-180 text-[#07966F]' : ''
              }`}
            />
          </span>
        </button>
        {open && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6 pt-1 text-xs sm:text-sm text-[#4A5D56] border-t border-[#073F31]/10 leading-relaxed">
            {item.a}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 lg:py-20 bg-[#F8FAF8] border-b border-[#073F31]/10">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
            {t.faq?.sectionBadge || 'SAVOL-JAVOBLAR'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#14231F] mt-1">
            {t.faq?.title || 'Ko‘p Beriladigan Savollar'}
          </h2>
          {t.faq?.subtitle && (
            <p className="text-xs sm:text-sm md:text-base text-[#65756F] mt-2 max-w-xl mx-auto">
              {t.faq.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
          <div className="space-y-4">
            {leftItems.map((item, idx) => renderFaqCard(item, idx))}
          </div>
          <div className="space-y-4">
            {rightItems.map((item, idx) => renderFaqCard(item, mid + idx))}
          </div>
        </div>
      </div>
    </section>
  );
}
