"use client";

import { useEffect } from "react";

/**
 * Drives the scroll-reveal system. An IntersectionObserver flips
 * data-reveal / data-reveal-group attributes to "in" as they enter the
 * viewport; the CSS in globals.css does the rest. Renders nothing.
 *
 * A MutationObserver feeds newly added targets to the
 * IntersectionObserver, because content arrives after this layout
 * component hydrates: streamed server payloads, client navigations, and
 * re-keyed client components (e.g. the guide band switcher) would all be
 * missed by a single mount-time scan.
 *
 * The reveal styles only apply under html[data-motion], which the root
 * layout sets pre-paint when JS is running AND the user has no
 * reduced-motion preference, so bots, no-JS visitors and reduced-motion
 * users always get a fully visible page.
 */
export function MotionObserver() {
  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-motion")) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          if (el.hasAttribute("data-reveal-group")) {
            el.setAttribute("data-reveal-group", "in");
          } else {
            el.setAttribute("data-reveal", "in");
          }
          io.unobserve(el);
        }
      },
      // The huge top margin keeps everything ABOVE the viewport
      // "intersecting", so fast scrolls and anchor jumps that skip an
      // element entirely still reveal it; new content only animates as
      // it crosses the bottom line.
      { rootMargin: "100000px 0px -12% 0px", threshold: 0.08 },
    );

    const SELECTOR =
      '[data-reveal]:not([data-reveal="in"]), [data-reveal-group]:not([data-reveal-group="in"])';

    const scan = (root: ParentNode) => {
      root.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    };

    scan(document.body);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SELECTOR)) io.observe(node);
          scan(node);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
