'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageLightbox({
  isOpen,
  onClose,
  items = [],
  currentIndex = 0,
  onNavigate
}) {
  const currentItem = items[currentIndex] || items[0];

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (!items.length) return;
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      onNavigate?.(prevIndex);
    },
    [currentIndex, items.length, onNavigate]
  );

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (!items.length) return;
      const nextIndex = (currentIndex + 1) % items.length;
      onNavigate?.(nextIndex);
    },
    [currentIndex, items.length, onNavigate]
  );

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  const title = currentItem.name || currentItem.title || 'Fotosurat';
  const subtitle = currentItem.certificate || currentItem.course || currentItem.subtitle;
  const hasMultiple = items.length > 1;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Top Floating Bar */}
      <div
        className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption & Counter Pill */}
        <div className="pointer-events-auto max-w-[75%] sm:max-w-[85%] bg-black/60 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-white flex items-center gap-2 shadow-lg">
          <span className="text-xs sm:text-sm font-semibold truncate leading-none">
            {title}
          </span>
          {hasMultiple && (
            <span className="text-[11px] font-mono text-white/60 border-l border-white/20 pl-2 leading-none flex-shrink-0">
              {currentIndex + 1} / {items.length}
            </span>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Yopish (Escape)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Photograph Stage */}
      <div
        className="relative flex items-center justify-center max-w-full max-h-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentItem.image || currentItem.src || currentItem.url}
          alt={title}
          className="max-h-[82vh] sm:max-h-[85vh] max-w-[94vw] sm:max-w-[88vw] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none"
          draggable={false}
        />

        {/* Desktop Left/Right Navigation Floating Buttons */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="hidden sm:flex absolute -left-14 lg:-left-16 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 backdrop-blur-md items-center justify-center transition-all cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Oldingi fotosurat (Chapga strelka)"
            >
              <ChevronLeft className="w-6 h-6 -ml-0.5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="hidden sm:flex absolute -right-14 lg:-right-16 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 backdrop-blur-md items-center justify-center transition-all cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Keyingi fotosurat (O‘ngga strelka)"
            >
              <ChevronRight className="w-6 h-6 -mr-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Floating Subtitle & Mobile Controls */}
      <div
        className="absolute bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        {subtitle ? (
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-white/80 text-xs shadow-lg max-w-[80%] truncate">
            {subtitle}
          </div>
        ) : <div />}

        {/* Mobile Navigation Arrows */}
        {hasMultiple && (
          <div className="sm:hidden pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 p-1 rounded-full shadow-lg">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              aria-label="Oldingi"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              aria-label="Keyingi"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
