'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ImageWithSkeleton({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  priority = false,
  aspectRatio,
  style = {},
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // If browser already has image in cache, it might be marked complete instantly
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={{
        ...(aspectRatio ? { aspectRatio } : {}),
        ...style,
      }}
    >
      {/* Animated Shimmer Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-0 bg-[#064E3B]/10 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite]" />
          <div className="w-8 h-8 rounded-full border-2 border-[#047857]/20 border-t-[#047857] animate-spin opacity-40" />
        </div>
      )}

      {/* Fallback in case of error */}
      {error && (
        <div className="absolute inset-0 z-0 bg-[#064E3B]/10 flex flex-col items-center justify-center text-emerald-800/40 p-2 text-center text-xs">
          <span>Rasm yuklanmadi</span>
        </div>
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`${className} transition-opacity duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
