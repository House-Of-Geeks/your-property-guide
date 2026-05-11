"use client";

import { Suspense, useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { MatchAgent } from "./MatchAgent";

interface StickyMatchCTAProps {
  /** Optional suburb slug to pre-fill the match flow. */
  suburb?: string;
  /** Optional intent to pre-fill (buying / selling / refinancing / etc.). */
  intent?: string;
  /** Headline. Defaults to a suburb-aware version when `suburb` is set. */
  label?: string;
  /**
   * Unique key per page/context. Determines sessionStorage dismissal scope —
   * dismissing on one suburb shouldn't suppress the CTA on another.
   * Defaults to `${intent}|${suburb}` or "default".
   */
  dismissKey?: string;
  /**
   * Scroll threshold (% of document height) before the CTA appears.
   * Default 0.30 — wait until the user has actually read some of the page.
   */
  showAfterRatio?: number;
}

// Intent string is widened here because StickyMatchCTAProps takes a plain
// string. MatchAgent's typed Intent union is narrower; we cast below.
type MatchIntent = Parameters<typeof MatchAgent>[0] extends { initialIntent?: infer T } ? T : never;

/**
 * Floating "Get connected" pill that slides up once the user has scrolled
 * into the page. Sits above the mobile bottom nav on small screens, floats
 * bottom-right on desktop. Dismissible per session.
 *
 * Clicking opens a drawer with the MatchAgent form rendered inline. Pre-
 * filled with the page's suburb/intent so the visitor lands at step 2 or 3.
 * The OLD behaviour navigated to `/?suburb=...#match` — that turned
 * conversions to ~0 because most visitors won't follow a navigation away
 * from the property/suburb they're researching.
 */
export function StickyMatchCTA({
  suburb,
  intent,
  label,
  dismissKey,
  showAfterRatio = 0.3,
}: StickyMatchCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const storageKey = `stickyMatchCTA:dismiss:${dismissKey ?? `${intent ?? "any"}|${suburb ?? "any"}`}`;

  // Read sessionStorage on mount. Defer to a client-only effect so SSR
  // markup stays consistent (we render hidden until JS confirms not-dismissed).
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") setDismissed(true);
    } catch {
      // sessionStorage can throw in some sandbox / private-browsing modes.
    }
  }, [storageKey]);

  // Track scroll. rAF-throttled so the listener stays cheap.
  useEffect(() => {
    if (dismissed) return;
    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = Math.max(
        document.body.scrollHeight - window.innerHeight,
        1
      );
      const ratio = scrollY / docHeight;
      setVisible(ratio >= showAfterRatio);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [showAfterRatio, dismissed]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [drawerOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (dismissed) return null;

  const display = label ?? (suburb ? "Get connected — local specialist" : "Get connected");

  return (
    <>
      {/* The floating pill */}
      <div
        aria-hidden={!visible}
        className={`fixed z-30 inset-x-0 bottom-16 sm:bottom-6 sm:inset-x-auto sm:right-6 px-4 sm:px-0 pointer-events-none transition-all duration-300 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <div className="pointer-events-auto inline-flex items-stretch gap-0 mx-auto sm:mx-0 rounded-full bg-ink text-white shadow-2xl border border-white/10 overflow-hidden max-w-full">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 pl-5 pr-4 py-3 text-sm font-medium hover:bg-primary-darker transition-colors min-w-0 cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-cta shrink-0" aria-hidden="true" />
            <span className="truncate">{display}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              try { sessionStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
            }}
            aria-label="Dismiss"
            className="pl-2 pr-3 py-3 text-white/60 hover:text-white border-l border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer with MatchAgent inline. Mounted only when open so the
          MatchAgent component (which is heavyish) doesn't render until needed. */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[200] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel — full-width on mobile, side-drawer on desktop */}
          <div className="relative ml-auto h-full w-full sm:max-w-xl bg-surface-warm shadow-2xl overflow-y-auto animate-[slideIn_220ms_ease-out]">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
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
                Tell us your situation
              </h2>
              <p className="text-sm text-ink-muted mb-6">
                Three quick questions and we&rsquo;ll match you with the right
                specialist — usually within one business day.
              </p>

              {/* MatchAgent uses useSearchParams internally → must be in Suspense */}
              <Suspense fallback={<div className="text-sm text-ink-muted">Loading…</div>}>
                <MatchAgent
                  compact
                  initialSuburbSlug={suburb ?? null}
                  initialIntent={intent ? (intent as MatchIntent) : null}
                  source="sticky-cta-drawer"
                />
              </Suspense>
            </div>
          </div>

          {/* Inline keyframes — single use, not worth a global style */}
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0.6; }
              to   { transform: translateX(0);    opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
