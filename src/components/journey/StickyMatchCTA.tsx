"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { MatchDrawer } from "./MatchDrawer";

interface StickyMatchCTAProps {
  /** Optional suburb slug to pre-fill the match flow. */
  suburb?: string;
  /** Optional intent to pre-fill (buying / selling / refinancing / etc.). */
  intent?: string;
  /** Headline. Defaults to a suburb-aware version when `suburb` is set. */
  label?: string;
  /**
   * Unique key per page/context. Determines sessionStorage dismissal scope -
   * dismissing on one suburb shouldn't suppress the CTA on another.
   * Defaults to `${intent}|${suburb}` or "default".
   */
  dismissKey?: string;
  /**
   * Scroll threshold (% of document height) before the CTA appears.
   * Default 0.30, wait until the user has actually read some of the page.
   */
  showAfterRatio?: number;
}

/**
 * Floating "Get connected" pill that slides up once the user has scrolled
 * into the page. Sits above the mobile bottom nav on small screens, floats
 * bottom-right on desktop. Dismissible per session.
 *
 * Clicking opens MatchDrawer with the page's suburb/intent pre-filled. The
 * OLD behaviour navigated to `/?suburb=...#match`, visitors lost their
 * page context and never came back.
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

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") setDismissed(true);
    } catch {
      // sessionStorage throws in some sandbox / private-browsing modes.
    }
  }, [storageKey]);

  useEffect(() => {
    if (dismissed) return;
    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      setVisible(scrollY / docHeight >= showAfterRatio);
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

  if (dismissed) return null;

  const display = label ?? (suburb ? "Get connected, local specialist" : "Get connected");

  return (
    <>
      <div
        aria-hidden={!visible}
        className={`fixed z-30 inset-x-0 bottom-16 sm:bottom-6 sm:inset-x-auto sm:right-6 px-4 sm:px-0 pointer-events-none transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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

      <MatchDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        suburb={suburb}
        intent={intent}
        source="sticky-cta-drawer"
      />
    </>
  );
}
