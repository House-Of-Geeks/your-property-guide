"use client";

import { useEffect, useRef } from "react";

/**
 * Count-up for editorial stats. Server-renders the FINAL value as real
 * text (SEO/no-JS safe); on scroll into view the digits run up over
 * ~1.1s via direct textContent writes (no React re-renders). Non-numeric
 * values and reduced-motion users keep the static text.
 */
export function StatNumber({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/^([^0-9]*)([\d,]+)(.*)$/);
    if (!match) return;
    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits.replace(/,/g, ""), 10);
    if (!Number.isFinite(target) || target === 0) return;

    const fmt = new Intl.NumberFormat("en-AU");
    let raf = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const t0 = performance.now();
        const dur = 1100;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = `${prefix}${fmt.format(Math.round(target * eased))}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className ? `tabular-nums ${className}` : "tabular-nums"} aria-label={value}>
      {value}
    </span>
  );
}
