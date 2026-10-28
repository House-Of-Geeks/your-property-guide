"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { chapterHref, type GuideBookId } from "@/lib/guide-books";
import { GuideDownloadLink } from "@/components/guide-book/GuideDownloadLink";
import { EMAIL_A_COPY_HASH } from "@/components/guide-book/GuideAccess";

/**
 * Mobile-only sticky bar on the guide pages (/selling-guide, /buying-guide).
 * Once a phone reader scrolls into the chapters or the FAQ, the three ways
 * to get the guide are one tap away (20 Oct 2026): read online (chapter 1),
 * download the PDF, or have it emailed (#email-a-copy, which opens the form
 * in the hero). No questions first; the funnel stays further down the page.
 * Hidden from sm up, where the choices sit beside the pitch in the hero.
 */
export function StickyGuideBar({ guide }: { guide: GuideBookId }) {
  const [visible, setVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

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

    // While the hero's choices are on screen the bar would repeat them, so
    // suppress it.
    const hero = document.querySelector("#get-the-guide");
    let observer: IntersectionObserver | undefined;
    if (hero) {
      observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
      observer.observe(hero);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer?.disconnect();
    };
  }, []);

  const shown = visible && !heroVisible;
  const placement = `${guide}-guide-sticky-bar`;
  const tab = shown ? undefined : -1;
  const segment = "flex min-h-12 items-center justify-center px-2 py-3 text-center text-[14px] font-medium leading-tight text-cta-ink transition-colors hover:bg-cta-hover";

  // The site's mobile bottom bar is hidden on the guide pages (the page is
  // the guide), so the bar sits at the bottom edge.
  return (
    <div
      aria-hidden={!shown}
      className={`sm:hidden fixed inset-x-0 bottom-4 z-30 px-4 pointer-events-none transition-opacity duration-200 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <nav
        aria-label="Get the free guide"
        className={`grid grid-cols-3 divide-x divide-cta-ink/20 overflow-hidden rounded-[4px] bg-cta shadow-[0_8px_24px_rgb(32_61_48/0.22)] ${
          shown ? "pointer-events-auto" : ""
        }`}
      >
        <Link href={chapterHref(guide, 1)} tabIndex={tab} onClick={() => track("guide_read_online", { guide, placement })} className={segment}>
          Read online
        </Link>
        <GuideDownloadLink guide={guide} placement={placement} tabIndex={tab} className={segment}>
          Download PDF
        </GuideDownloadLink>
        <a href={EMAIL_A_COPY_HASH} tabIndex={tab} className={segment}>
          Email it
        </a>
      </nav>
    </div>
  );
}
