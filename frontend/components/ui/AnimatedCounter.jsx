'use client';

import React from 'react';
import { useAnimatedCounter } from '@/lib/motion';

export function AnimatedCounter({ end, suffix = '', duration = 1200 }) {
  const [ref, count] = useAnimatedCounter(end, duration);
  return (
    <span ref={ref} aria-label={`${end}${suffix}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default AnimatedCounter;
