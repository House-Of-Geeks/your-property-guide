"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Mobile-only sticky bar on /selling-guide. The funnel lives at the top
 * of the page; once a phone reader scrolls into the chapters/FAQ they're
 * two thumb-flicks from the form, so give them a one-tap way back.
 * Hidden on desktop where the funnel card is sticky in the viewport.
 */
export function StickyGuideBar() {
  const [visible, setVisible] = useState(false);
  const [funnelVisible, setFunnelVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      setVisible(scrollY / docHeight >= 0.25);
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

    // While the funnel itself is on screen the bar is pointing at
    // something the reader can already see, so suppress it.
    const funnel = document.querySelector("#get-the-guide");
    let observer: IntersectionObserver | undefined;
    if (funnel) {
      observer = new IntersectionObserver(([entry]) => setFunnelVisible(entry.isIntersecting));
      observer.observe(funnel);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer?.disconnect();
    };
  }, []);

  const shown = visible && !funnelVisible;

  // bottom-16 clears the site's fixed mobile bottom nav (same offset the
  // floating guide pill uses elsewhere).
  return (
    <div
      aria-hidden={!shown}
      className={`sm:hidden fixed inset-x-0 bottom-16 z-30 px-4 pointer-events-none transition-[opacity,transform,translate,scale] duration-[400ms] ease-[var(--ease-out-quint)] ${
        shown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.97]"
      }`}
    >
      <a
        href="#get-the-guide"
        className="pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white font-semibold px-6 py-3.5 text-sm shadow-2xl border border-white/20 transition-colors"
      >
        Get the free guide
        <ArrowUp className="w-4 h-4" aria-hidden="true" />
      </a>
    </div>
  );
}
