"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";

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

export function MobileBottomNav() {
  const pathname = usePathname();
  if (HIDE_ON.some((p) => matches(pathname, p))) return null;

  const buyer = BUYER_PATHS.some((p) => matches(pathname, p));

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-white/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Get help"
    >
      <div className="grid grid-cols-[1.35fr_1fr_auto] gap-2 px-3 py-2">
        <Link
          href={buyer ? "/buying-guide" : "/selling-guide"}
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
