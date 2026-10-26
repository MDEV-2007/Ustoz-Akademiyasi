'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function VideoWithSkeleton({
  src,
  className = '',
  containerClassName = '',
  preload = 'metadata',
  muted = true,
  playsInline = true,
  autoPlay = false,
  loop = false,
  poster,
  style = {},
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`} style={style}>
      {/* Subtle Shimmer Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 z-0 bg-[#064E3B]/10 overflow-hidden flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite]" />
          <div className="w-8 h-8 rounded-full border-2 border-[#047857]/20 border-t-[#047857] animate-spin opacity-40" />
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload={preload}
        muted={muted}
        playsInline={playsInline}
        autoPlay={autoPlay}
        loop={loop}
        onLoadedData={() => setLoaded(true)}
        onCanPlay={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
