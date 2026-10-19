"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { moveForPath } from "@/lib/journey-paths";
import { PLAN_CTA_BAR } from "@/lib/plans/name";
import { planStartHref } from "@/lib/plans/start";
import { DEFAULT_MOVE, journeyForMove, usePublishedMove, usePublishedPlace } from "@/components/interactive/move-context";

// The phone bar (Oct 2026, "confident moves"): two actions that fit the page's
// move. The first is always the learning step (the next-step plan for that
// move, the same first step as the header and the homepage hero since
// 19 Oct 2026); the second is personal help for that move. On the homepage
// both follow the move picked in the hero, and (20 Oct 2026) the suburb
// picked there too, built by the same planStartHref as the hero's button. It hides where the page is itself a
// form, and while any field has focus, so it never sits over what someone is
// typing or over the keyboard.

const HIDE_ON = [
  "/plan", "/get-help", "/selling-guide", "/buying-guide", "/appraisal", "/find-an-expert", "/agreement-check",
  "/get-connected", "/contact", "/dashboard", "/feedback", "/tools/agent-proposal-worksheet",
];

const matches = (pathname: string, p: string) => pathname === p || pathname.startsWith(`${p}/`);

// The page the bar was tapped on, for Lead.attribution.entry ("bar-guides-stamp-duty-nsw").
const barEntry = (pathname: string) =>
  `bar-${pathname.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "home"}`.slice(0, 100);

// Education first: the next-step plan for the page's move, then an agent.
const HELP = {
  buying: { label: "Find a buyer’s agent", service: "buyers-agent" },
  selling: { label: "Find an agent", service: "selling-agent" },
  "buying-and-selling": { label: "Find an agent", service: "both" },
  none: { label: "Find an agent", service: null },
} as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  // Guides and posts mark their reader ([data-guide-audience]); read it once
  // the new page has committed so the server HTML still matches.
  const [pageAudience, setPageAudience] = useState<"buying" | "selling" | null>(null);
  const [typing, setTyping] = useState(false);
  const published = usePublishedMove();
  const publishedPlace = usePublishedPlace();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const value = document.querySelector<HTMLElement>("[data-guide-audience]")?.dataset.guideAudience;
      setPageAudience(value === "buying" || value === "selling" ? value : null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.matches("input, textarea, select") || el.isContentEditable);
    const onIn = (e: FocusEvent) => setTyping(isField(e.target));
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  if (HIDE_ON.some((p) => matches(pathname, p))) return null;

  const onHome = pathname === "/";
  const move = moveForPath(pathname) ?? (onHome ? journeyForMove(published ?? DEFAULT_MOVE) : pageAudience);
  const place = onHome ? publishedPlace : null;
  const help = HELP[move ?? "none"];
  const from = barEntry(pathname);
  const planHref = planStartHref({ journey: move, place, from });
  const helpQs = new URLSearchParams();
  if (help.service) helpQs.set("service", help.service);
  if (place) helpQs.set("suburb", place.slug);
  if (help.service) helpQs.set("from", from);
  const helpHref = helpQs.toString() ? `/get-help?${helpQs.toString()}` : "/get-help";

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-40 border-t border-line bg-cream/95 backdrop-blur-md sm:hidden print:hidden transition-transform duration-200 ${typing ? "translate-y-full" : ""}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Next steps"
      aria-hidden={typing || undefined}
      inert={typing || undefined}
    >
      <div className="grid grid-cols-2 gap-2 px-3 py-2">
        <Link href={planHref} className="flex items-center justify-center rounded-md bg-cta hover:bg-cta-hover text-white px-2 py-2.5 text-sm font-semibold">
          {PLAN_CTA_BAR}
        </Link>
        <Link href={helpHref} className="flex items-center justify-center rounded-md border border-ink text-ink px-2 py-2.5 text-sm font-semibold">
          {help.label}
        </Link>
      </div>
    </nav>
  );
}
