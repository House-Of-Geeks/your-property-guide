"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

interface StickyMatchCTAProps {
  /** Optional suburb slug to pre-fill the guide funnel. */
  suburb?: string;
  /** Legacy prop, kept so existing call sites don't break. Only scopes dismissal. */
  intent?: string;
  /** Headline. Defaults to the guide CTA. */
  label?: string;
  /** Destination override; defaults to the selling-guide funnel. */
  href?: string;
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
 * Floating pill that slides up once the user has scrolled into the page.
 * Sits above the mobile bottom nav on small screens, floats bottom-right
 * on desktop. Dismissible per session.
 *
 * Since the June 2026 lead-gen pivot this pushes the selling-guide funnel
 * (the site's single conversion point) instead of opening the old match
 * drawer. Suburb context deep-links the funnel with step 1 pre-answered.
 */
export function StickyMatchCTA({
  suburb,
  intent,
  label,
  href: hrefProp,
  dismissKey,
  showAfterRatio = 0.3,
}: StickyMatchCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

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

  const display = label ?? "Get the free selling guide";
  const base = hrefProp ?? "/selling-guide";
  const href = suburb ? `${base}?suburb=${suburb}` : base;

  return (
    <div
      aria-hidden={!visible}
      // pill-in only while visible so the overshoot entrance replays on
      // each appearance; hiding falls back to the plain opacity transition.
      className={`fixed z-30 inset-x-0 bottom-16 sm:bottom-6 sm:inset-x-auto sm:right-6 px-4 sm:px-0 pointer-events-none transition-[opacity,transform,visibility] duration-300 ${
        visible ? "visible opacity-100 translate-y-0 pill-in" : "invisible opacity-0 translate-y-4"
      }`}
    >
      {/* pointer-events follow visibility: a hidden aria-hidden pill must
          not intercept taps or take focus. */}
      <div
        className={`inline-flex items-stretch gap-0 mx-auto sm:mx-0 rounded-full bg-ink text-white shadow-2xl border border-white/10 overflow-hidden max-w-full hover:-translate-y-0.5 transition-transform duration-200 ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <Link
          href={href}
          className="inline-flex items-center gap-2 pl-5 pr-4 py-3 text-sm font-medium hover:bg-primary-darker transition-colors min-w-0"
        >
          <span className="relative inline-flex w-1.5 h-1.5 shrink-0" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-cta opacity-75 animate-ping"
              style={{ animationIterationCount: 2 }}
              aria-hidden="true"
            />
            <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-cta shrink-0" aria-hidden="true" />
          </span>
          <span className="truncate">{display}</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try { sessionStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
          }}
          aria-label="Dismiss"
          className="pl-2 pr-3 py-3 text-white/75 hover:text-white border-l border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
