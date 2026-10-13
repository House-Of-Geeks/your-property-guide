"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { guideFunnelHref, type GuideAudience } from "@/lib/guide-funnel";

// Brand v4 (Oct 2026): the phone bar carries the two actions the business
// runs on, the free guide and a free appraisal, plus a call button. Phones
// carry most visits, and the old bar (Guides, Quiz, Compare, Tools) had no
// way to ask for help.

// Hidden where the page itself is the form, so the bar never competes with it.
const HIDE_ON = [
  "/selling-guide", "/buying-guide", "/appraisal", "/find-an-expert",
  "/get-connected", "/contact", "/dashboard",
];

const BUYER_PATHS = [
  "/first-home-buyers", "/investing", "/upgrading", "/buy",
  "/stamp-duty-calculator", "/borrowing-power-calculator", "/mortgage-calculator",
  "/affordability-calculator", "/lmi-calculator", "/help-to-buy-calculator", "/fhss-calculator",
];

const matches = (pathname: string, p: string) => pathname === p || pathname.startsWith(`${p}/`);

// The page the bar was tapped on, for Lead.attribution.entry: "bar-" plus the
// path ("bar-guides-stamp-duty-nsw", "bar-home").
const barEntry = (pathname: string) =>
  `bar-${pathname.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "home"}`.slice(0, 100);

export function MobileBottomNav() {
  const pathname = usePathname();
  // Guides and posts know their reader (GuideArticleLayout and the post page
  // render a hidden [data-guide-audience] marker); a buyer guide gets the
  // buying guide here too. Read on the frame after each navigation commits,
  // so the server HTML still matches and the new page's marker is in place.
  const [pageAudience, setPageAudience] = useState<GuideAudience | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const value = document.querySelector<HTMLElement>("[data-guide-audience]")?.dataset.guideAudience;
      setPageAudience(value === "buying" || value === "selling" ? value : null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  if (HIDE_ON.some((p) => matches(pathname, p))) return null;

  const buyer = pageAudience ? pageAudience === "buying" : BUYER_PATHS.some((p) => matches(pathname, p));

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-white/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Get help"
    >
      <div className="grid grid-cols-[1.35fr_1fr_auto] gap-2 px-3 py-2">
        <Link
          href={guideFunnelHref(buyer ? "buying" : "selling", { from: barEntry(pathname) })}
          className="flex items-center justify-center rounded-md bg-cta hover:bg-cta-hover text-white px-2 py-2.5 text-sm font-semibold"
        >
          {buyer ? "Free buying guide" : "Free selling guide"}
        </Link>
        <Link
          href="/appraisal"
          className="flex items-center justify-center rounded-md border border-ink text-ink px-2 py-2.5 text-sm font-semibold"
        >
          Free appraisal
        </Link>
        <a
          href={`tel:${CONTACT_PHONE_E164}`}
          className="flex items-center justify-center rounded-md border border-line text-ink w-11"
          aria-label={`Call us on ${CONTACT_PHONE_DISPLAY}`}
        >
          <Phone className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </nav>
  );
}
