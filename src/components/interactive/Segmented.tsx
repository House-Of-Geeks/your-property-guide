"use client";

import type { KeyboardEvent } from "react";

// A switch of two to four choices with a thumb that slides to the chosen
// one. A radiogroup underneath, so arrow keys and screen readers work.

interface SegmentedProps<T extends string> {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "md" | "lg";
  className?: string;
}

export function Segmented<T extends string>({ label, options, value, onChange, size = "md", className = "" }: SegmentedProps<T>) {
  const i = Math.max(0, options.findIndex((o) => o.id === value));
  const pad = size === "lg" ? "h-14 text-[16px] sm:text-[17px]" : "h-11 text-[15px]";
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
    onChange(options[next].id);
    (e.currentTarget.querySelectorAll("button")[next] as HTMLButtonElement | undefined)?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      className={`relative grid rounded-xl bg-surface-warm p-1 ${className}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-lg bg-ink shadow-[0_2px_8px_rgb(22_25_29/0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ width: `calc((100% - 0.5rem) / ${options.length})`, transform: `translateX(${i * 100}%)` }}
      />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          tabIndex={o.id === value ? 0 : -1}
          onClick={() => onChange(o.id)}
          className={`relative z-10 rounded-lg px-3 font-semibold transition-colors duration-200 ${pad} ${o.id === value ? "text-ink-inverse" : "text-ink-muted hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Small choice chips for a question (state, timing, stage). */
export function Chips<T extends string>({ label, options, value, onChange, className = "" }: { label: string; options: readonly { id: T; label: string }[]; value: T | null; onChange: (v: T) => void; className?: string }) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={`press rounded-lg border px-3.5 py-2 text-[15px] font-semibold transition-colors ${on ? "border-ink bg-ink text-ink-inverse" : "border-line-strong bg-white text-ink hover:border-ink"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
