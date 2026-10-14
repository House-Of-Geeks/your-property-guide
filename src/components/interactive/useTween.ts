"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that glides to its new value when it changes (about 450ms), so
 * a result visibly answers the slider. Starts at the target, so the server
 * and the first client render agree. Reduced motion: it jumps.
 */
export function useTween(target: number, ms = 450): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const a = from.current;
    const b = target;
    if (a === b) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - t0) / ms);
      const v = a + (b - a) * (1 - Math.pow(1 - p, 4));
      from.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

export const aud = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
