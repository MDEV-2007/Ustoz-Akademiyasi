'use client';

import React from 'react';

/**
 * OfficialBrandShield
 * Fully self-contained vector emblem for Arab Tili.
 * Uses direct fills and strokes to guarantee 100% reliable rendering
 * across all browsers, routes, and dark/light backgrounds without
 * relying on fragile external <defs> or linearGradient ID references.
 */
export const OfficialBrandShield = ({ size = 42, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative flex-shrink-0 flex items-center justify-center select-none ${className}`}
  >
    <img
      src="/brand/siteicon.png"
      alt="Arab Tili"
      width={size}
      height={size}
      className="w-full h-full rounded-xl object-contain drop-shadow-[0_2px_8px_rgba(7,150,111,0.22)]"
      loading="eager"
    />
  </div>
);

export const BrandLogo = ({ size = 42, className = '' }) => (
  <OfficialBrandShield size={size} className={className} />
);

export const Instagram = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const TelegramIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z" />
  </svg>
);

export const FacebookIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const PremiumIconBadge = ({
  icon: Icon,
  variant = 'emerald',
  size = 'md',
  className = '',
  ariaHidden = true,
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-13 h-13 rounded-2xl',
  };
  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  const variantClasses = {
    emerald:
      'bg-gradient-to-br from-[#07966F]/15 via-[#07966F]/8 to-[#073F31]/5 border border-[#07966F]/25 text-[#07966F] shadow-[0_2px_10px_rgba(7,150,111,0.08)]',
    mint:
      'bg-[#63E6BE]/20 border border-[#63E6BE]/40 text-[#073F31] shadow-xs',
    gold:
      'bg-gradient-to-br from-[#E8B84A]/20 via-[#E8B84A]/10 to-[#E8B84A]/5 border border-[#E8B84A]/35 text-[#D4AF37] shadow-[0_2px_10px_rgba(232,184,74,0.14)]',
    dark:
      'bg-white/10 hover:bg-white/15 border border-white/20 text-[#63E6BE] shadow-xs backdrop-blur-xs',
    emeraldSolid:
      'bg-[#07966F] text-white shadow-[0_2px_12px_rgba(7,150,111,0.3)]',
  };

  return (
    <div
      aria-hidden={ariaHidden}
      className={`inline-flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105 ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.emerald} ${className}`}
    >
      <Icon className={`${iconSizes[size] || iconSizes.md} stroke-[2]`} />
    </div>
  );
};

export default OfficialBrandShield;
