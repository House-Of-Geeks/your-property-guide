"use client";

import { Suspense, useEffect } from "react";
import { X } from "lucide-react";
import { MatchAgent } from "./MatchAgent";

// Intent string is widened here because callers pass plain strings.
// MatchAgent's typed Intent union is narrower; we cast at the call site.
type MatchIntent = Parameters<typeof MatchAgent>[0] extends { initialIntent?: infer T } ? T : never;

interface MatchDrawerProps {
  open: boolean;
  onClose: () => void;
  suburb?: string | null;
  intent?: string | null;
  /** Attribution string passed to /api/leads. */
  source?: string;
  /** Override the drawer's intro headline. */
  heading?: string;
  /** Override the drawer's intro subhead. */
  subhead?: string;
}

/**
 * Slide-in side drawer hosting the MatchAgent flow inline. Mounted only
 * when `open` so the heavyish MatchAgent component doesn't render until
 * the user actually wants it. Used by StickyMatchCTA and by any in-page
 * "Match me" button (e.g. above-the-fold on suburb pages).
 *
 * Keeping this separate from any specific trigger button means callers
 * own their own button styling — the drawer is the only shared piece.
 */
export function MatchDrawer({
  open,
  onClose,
  suburb,
  intent,
  source = "match-drawer",
  heading = "Tell us your situation",
  subhead = "Three quick questions and we’ll match you with the right specialist — usually within one business day.",
}: MatchDrawerProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative ml-auto h-full w-full sm:max-w-xl bg-surface-warm shadow-2xl overflow-y-auto animate-[slideIn_220ms_ease-out]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface-raised border border-line shadow-sm flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 sm:px-8 py-8 sm:py-10">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary mb-3">
            Free, no commitment
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">
            {heading}
          </h2>
          <p className="text-sm text-ink-muted mb-6">
            {subhead}
          </p>

          <Suspense fallback={<div className="text-sm text-ink-muted">Loading…</div>}>
            <MatchAgent
              compact
              initialSuburbSlug={suburb ?? null}
              initialIntent={intent ? (intent as MatchIntent) : null}
              source={source}
            />
          </Suspense>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
