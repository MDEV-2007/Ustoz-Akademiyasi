'use client';

import React from 'react';
import { OfficialBrandShield } from './BrandShield';

export const BrandSplashScreen = ({ isVisible, text = 'Zulmatlardan Nur tomon' }) => {
  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05271E] text-white transition-opacity duration-300 pointer-events-auto"
    >
      {/* Radial soft emerald background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full bg-[#00D98B]/15 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Brand Shield Logo with glowing halo */}
        <div className="relative mb-4 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-[#00D98B]/25 blur-xl animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div className="relative transform hover:scale-105 transition-transform duration-300 animate-pulse">
            <OfficialBrandShield size={72} />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-xl sm:text-2xl font-extrabold tracking-wider uppercase text-white font-sans">
          USTOZ <span className="text-[#00D98B]">AKADEMIYASI</span>
        </div>

        {/* Brand Slogan */}
        <div className="mt-2 text-sm sm:text-base font-medium tracking-wide text-[#A3E9D0] flex items-center gap-2.5">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#00D98B]/70" />
          <span className="italic font-serif tracking-normal text-white/95 text-base sm:text-lg">
            {text}
          </span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#00D98B]/70" />
        </div>

        {/* Smooth Loader Line */}
        <div className="mt-7 w-40 sm:w-52 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00D98B] via-[#63E6BE] to-[#00D98B] rounded-full w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default BrandSplashScreen;
