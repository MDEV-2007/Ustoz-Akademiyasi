'use client';

import React from 'react';

export default function Breadcrumbs({ breadcrumbs = [], navigate }) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Sahifa yo'li" className="bg-white border-b border-[#073F31]/10 py-3">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-[#65756F]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {!isLast ? (
                  <>
                    <button
                      onClick={() => navigate(crumb.path)}
                      className="hover:text-[#073F31] underline cursor-pointer"
                    >
                      {crumb.label}
                    </button>
                    <span>/</span>
                  </>
                ) : (
                  <span className="font-semibold text-[#14231F]" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
