'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const LeafletBranchesView = dynamic(() => import('@/components/LeafletBranchesView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
      Xarita yuklanmoqda...
    </div>
  )
});

export default function BranchesPage({
  path,
  branches = [],
  navigate,
  brandConfig = {},
  locale = 'uz',
  t = {}
}) {
  const slug = path.startsWith('/filiallar/') ? path.replace('/filiallar/', '') : 'archakocha';
  const branch = branches.find((b) => b.slug === slug) || branches[0];

  return (
    <div className="py-10 lg:py-14 max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#07966F]">
            {t.branchesPage?.badge || 'Toshkent Shahri Bo‘ylab'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#14231F] mt-0.5">
            {path === '/filiallar'
              ? (t.branchesPage?.title || 'Ustoz Akademiyasi — 8 ta rasmiy filial va xaritasi')
              : `Ustoz Akademiyasi — ${branch?.name || ''}`}
          </h1>
        </div>

        <button
          onClick={() => navigate('/royxatdan-otish', { branchSlug: branch?.slug })}
          className="py-3 px-6 rounded-xl bg-[#073F31] hover:bg-[#07966F] text-white font-bold text-sm transition cursor-pointer shadow-sm active:scale-[0.99]"
        >
          {t.branchesPage?.enrollBtn || 'Yozilish'}
        </button>
      </div>

      <LeafletBranchesView
        branches={branches}
        initialBranchSlug={slug}
        onEnroll={(branchSlug) => navigate('/royxatdan-otish', { branchSlug })}
        phoneDisplay={brandConfig?.phoneDisplay}
        phoneHref={brandConfig?.phoneHref}
        locale={locale}
      />
    </div>
  );
}
