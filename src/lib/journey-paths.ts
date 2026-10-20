// Which move a page belongs to (Oct 2026): the header's plan button and the
// phone bar read it, so a stamp duty page offers a buying plan and a
// commission page a selling plan.

import type { Journey } from "@/lib/lead-kinds";

/**
 * The page's path as the layout should treat it. Next's prerender of the
 * homepage reports its path as "/index" until the router settles (seen live
 * on 20 Oct 2026: the phone bar's entry was "bar-index" and the header lost
 * the homepage's move), so "/index" is the homepage.
 */
export function sitePath(pathname: string | null): string {
  if (!pathname || pathname === "/index") return "/";
  return pathname;
}

export function moveForPath(pathname: string): Journey | null {
  const on = (p: string) => pathname === p || pathname.startsWith(p + "/");
  if (["/buying-and-selling", "/guides/sell-first-or-buy-first", "/bridging-loan-calculator", "/guides/bridging-loans-guide", "/guides/bridging-loan-alternatives"].some(on)) return "buying-and-selling";
  if (["/buying", "/buying-guide", "/first-home-buyers", "/investing", "/upgrading", "/buyers-agents", "/stamp-duty-calculator", "/borrowing-power-calculator", "/mortgage-calculator", "/affordability-calculator", "/lmi-calculator", "/help-to-buy-calculator", "/fhss-calculator"].some(on)) return "buying";
  if (["/selling", "/selling-guide", "/appraisal", "/property-valuation", "/selling-costs-calculator", "/real-estate-commission-calculator", "/tools/agent-proposal-worksheet"].some(on)) return "selling";
  return null;
}

