"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Mobile-only sticky bar on /selling-guide. The funnel lives at the top
 * of the page; once a phone reader scrolls into the chapters/FAQ they're
 * two thumb-flicks from the form, so give them a one-tap way back.
 * Hidden from sm up, where the funnel sits beside the pitch in the hero.
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

  // The site's mobile bottom bar is hidden on the guide pages (the page is
  // the form), so the bar sits at the bottom edge.
  return (
    <div
      aria-hidden={!shown}
      className={`sm:hidden fixed inset-x-0 bottom-4 z-30 px-4 pointer-events-none transition-opacity duration-200 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <a
        href="#get-the-guide"
        tabIndex={shown ? undefined : -1}
        className={`flex items-center justify-center gap-2 rounded-[4px] bg-cta hover:bg-cta-hover text-cta-ink font-medium px-6 py-3.5 text-sm shadow-[0_8px_24px_rgb(32_61_48/0.22)] transition-colors ${
          shown ? "pointer-events-auto" : ""
        }`}
      >
        Get the free guide
        <ArrowUp className="w-4 h-4" aria-hidden="true" />
      </a>
    </div>
  );
}
