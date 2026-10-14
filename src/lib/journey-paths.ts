// Which move a page belongs to (Oct 2026): the header's plan button and the
// phone bar read it, so a stamp duty page offers a buying plan and a
// commission page a selling plan.

import type { Journey } from "@/lib/lead-kinds";

export function moveForPath(pathname: string): Journey | null {
  const on = (p: string) => pathname === p || pathname.startsWith(p + "/");
  if (["/buying-and-selling", "/guides/sell-first-or-buy-first", "/bridging-loan-calculator", "/guides/bridging-loans-guide", "/guides/bridging-loan-alternatives"].some(on)) return "buying-and-selling";
  if (["/buying", "/buying-guide", "/first-home-buyers", "/investing", "/upgrading", "/buyers-agents", "/stamp-duty-calculator", "/borrowing-power-calculator", "/mortgage-calculator", "/affordability-calculator", "/lmi-calculator", "/help-to-buy-calculator", "/fhss-calculator"].some(on)) return "buying";
  if (["/selling", "/selling-guide", "/appraisal", "/property-valuation", "/selling-costs-calculator", "/real-estate-commission-calculator", "/tools/agent-proposal-worksheet"].some(on)) return "selling";
  return null;
}

