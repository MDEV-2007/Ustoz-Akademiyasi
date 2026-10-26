'use client';

import React, { useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';

/**
 * Premium Video Lightbox Component
 * Designed specifically for 9:16 vertical classroom & reel videos.
 * - Restrained translucent backdrop (bg-black/85 backdrop-blur-xs).
 * - True 9:16 portrait aspect ratio preserving video proportions without awkward letterboxing or nested green panels.
 * - Minimal floating frosted header with title and close button.
 * - Native video controls for reliable play, seek, volume, and fullscreen.
 * - Clean cleanup on close (immediate pause + currentTime reset).
 * - Keyboard Escape + backdrop click to close.
 * - Body scroll lock while open.
 */
export default function VideoLightbox({
  isOpen,
  onClose,
  video,
  onRegisterClick,
  registrationLabel = 'Sinov darsiga yozilish'
}) {
  const videoRef = useRef(null);

  // Stop video playback and cleanup
  const handleClose = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (err) {
        // Ignore pause errors
      }
    }
    onClose();
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title || 'Video lavha'}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      onClick={handleClose}
    >
      {/* Centered Vertical 9:16 Video Frame */}
      <div
        className="relative flex flex-col items-center justify-center max-h-[86vh] w-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Floating Top Gradient Header */}
        <div className="absolute top-0 inset-x-0 z-20 p-3 sm:p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-start justify-between pointer-events-none">
          <div className="pointer-events-auto max-w-[80%] pr-2">
            {(video.tag || video.lesson) && (
              <span className="text-[11px] font-medium text-emerald-400 block tracking-wide truncate">
                {video.tag} {video.lesson ? `• ${video.lesson}` : ''}
              </span>
            )}
            <h4 className="text-xs sm:text-sm font-semibold text-white/95 line-clamp-1 mt-0.5">
              {video.title}
            </h4>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="pointer-events-auto w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer flex-shrink-0"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Element with Native Controls */}
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full object-contain bg-black"
          controls
          autoPlay
          playsInline
        />
      </div>

      {/* Subtle Secondary Information & Registration Link Below Video */}
      <div
        className="mt-2.5 flex items-center justify-between w-full max-w-[340px] sm:max-w-[380px] px-2 text-xs text-white/70"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[11px] text-white/60 truncate">
          Ustoz Akademiyasi • Hilol Kids 4+
        </span>

        {onRegisterClick && (
          <button
            type="button"
            onClick={() => {
              handleClose();
              onRegisterClick();
            }}
            className="text-emerald-400 hover:text-emerald-300 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
          >
            <span>{registrationLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
