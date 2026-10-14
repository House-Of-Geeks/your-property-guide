"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { moveForPath } from "@/lib/journey-paths";

// The phone bar (Oct 2026, "confident moves"): two actions that fit the page's
// move. The first is always the learning step (a plan for that move); the
// second is personal help for that move. It hides where the page is itself a
// form, and while any field has focus, so it never sits over what someone is
// typing or over the keyboard.

const HIDE_ON = [
  "/plan", "/get-help", "/selling-guide", "/buying-guide", "/appraisal", "/find-an-expert",
  "/get-connected", "/contact", "/dashboard", "/feedback", "/tools/agent-proposal-worksheet",
];

const matches = (pathname: string, p: string) => pathname === p || pathname.startsWith(`${p}/`);

// The page the bar was tapped on, for Lead.attribution.entry ("bar-guides-stamp-duty-nsw").
const barEntry = (pathname: string) =>
  `bar-${pathname.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "home"}`.slice(0, 100);

// Education first: the free guide for the page's move, then an agent.
const ACTIONS = {
  buying: { plan: "Free buying guide", planHref: "/buying-guide", help: "Find a buyer’s agent", helpHref: "/get-help?service=buyers-agent" },
  selling: { plan: "Free selling guide", planHref: "/selling-guide", help: "Find an agent", helpHref: "/get-help?service=selling-agent" },
  "buying-and-selling": { plan: "Moving plan", planHref: "/plan?j=buying-and-selling", help: "Find an agent", helpHref: "/get-help?service=both" },
  none: { plan: "Free guides", planHref: "/guides", help: "Find an agent", helpHref: "/get-help" },
} as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  // Guides and posts mark their reader ([data-guide-audience]); read it once
  // the new page has committed so the server HTML still matches.
  const [pageAudience, setPageAudience] = useState<"buying" | "selling" | null>(null);
  const [typing, setTyping] = useState(false);

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

  const move = moveForPath(pathname) ?? pageAudience;
  const a = ACTIONS[move ?? "none"];
  const from = barEntry(pathname);
  const planHref = a.planHref;
  const helpHref = a.helpHref.includes("?") ? `${a.helpHref}&from=${from}` : a.helpHref;

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-40 border-t border-line bg-white/95 backdrop-blur-md sm:hidden print:hidden transition-transform duration-200 ${typing ? "translate-y-full" : ""}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Next steps"
      aria-hidden={typing || undefined}
      inert={typing || undefined}
    >
      <div className="grid grid-cols-2 gap-2 px-3 py-2">
        <Link href={planHref} className="flex items-center justify-center rounded-md bg-cta hover:bg-cta-hover text-white px-2 py-2.5 text-sm font-semibold">
          {a.plan}
        </Link>
        <Link href={helpHref} className="flex items-center justify-center rounded-md border border-ink text-ink px-2 py-2.5 text-sm font-semibold">
          {a.help}
        </Link>
      </div>
    </nav>
  );
}
