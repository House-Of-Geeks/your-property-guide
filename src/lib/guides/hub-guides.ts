// Which guides each topic hub lists, by slug. Titles and URLs come from the
// guide registry at render time, so a renamed guide cannot go stale here;
// tests/seo/guide-registry.test.ts fails if a slug stops resolving.
import { resolveGuides, type GuideEntry } from "@/lib/guides/registry";

export interface GuideLink {
  href: string;
  title: string;
  description?: string;
}

export interface GuideLinkGroup {
  /** Optional sub-heading ("By state"); linked when href is set. */
  label?: string;
  href?: string;
  links: GuideLink[];
}

interface HubGroup {
  label?: string;
  href?: string;
  slugs: readonly string[];
}

export interface HubGuideList {
  heading: string;
  intro: string;
  groups: readonly HubGroup[];
}

const STATES = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const;
const perState = (prefix: string) => STATES.map((s) => `${prefix}-${s}`);

export type HubPath = "/first-home-buyers" | "/buying-guide" | "/selling" | "/investing" | "/house-and-land";

export const HUB_GUIDE_LISTS: Record<HubPath, HubGuideList> = {
  "/first-home-buyers": {
    heading: "First home buyer guides",
    intro: "The national guide, the guide for your state, and one guide for each scheme and cost that sets how much you need to save.",
    groups: [
      {
        slugs: [
          "first-home-buyer-guide",
          "first-home-owner-grant-australia",
          "first-home-guarantee",
          "help-to-buy-scheme-australia",
          "shared-equity-schemes-australia",
          "first-home-super-saver-scheme",
          "use-super-to-buy-a-house",
          "how-much-deposit-to-buy-a-house",
          "lenders-mortgage-insurance-guide",
        ],
      },
      { label: "By state", slugs: perState("first-home-buyer") },
      { label: "Help to Buy by state", slugs: ["help-to-buy-scheme-nsw", "help-to-buy-scheme-victoria", "help-to-buy-scheme-qld", "help-to-buy-scheme-wa"] },
    ],
  },
  "/buying-guide": {
    heading: "The buying process, one guide per step",
    intro: "Free to read on the site: the deposit and pre-approval, the checks before you sign, cooling-off, auctions and the offer.",
    groups: [
      {
        slugs: [
          "buying-property-australia",
          "how-much-deposit-to-buy-a-house",
          "home-loan-pre-approval-australia",
          "due-diligence-checklist-buying-a-house",
          "building-pest-inspection",
          "conveyancing-guide",
          "cooling-off-period-by-state-australia",
          "property-auction-guide",
          "how-to-negotiate-property-price-australia",
        ],
      },
    ],
  },
  "/selling": {
    heading: "Selling guides",
    intro: "How a sale runs, choosing and signing an agent, and what selling costs in your state.",
    groups: [
      {
        slugs: [
          "how-to-sell-a-house-australia",
          "how-to-choose-a-selling-agent",
          "real-estate-agency-agreements-by-state",
          "underquoting-laws-by-state",
          "what-to-fix-before-selling-a-house",
          "home-staging-cost-australia",
          "cost-of-selling-a-house-australia",
          "real-estate-agent-fees-australia",
        ],
      },
      { label: "Cost of selling by state", slugs: perState("cost-of-selling-a-house") },
      { label: "Agent commission by state", slugs: perState("real-estate-commission") },
    ],
  },
  "/investing": {
    heading: "Investor guides",
    intro: "Tax, returns and running costs: the guides behind the numbers on this page.",
    groups: [
      {
        slugs: [
          "negative-gearing-australia",
          "cgt-changes-2026-budget",
          "negative-gearing-cgt-changes-now-law-2026",
          "property-depreciation-guide",
          "capital-growth-vs-cash-flow-australia",
          "house-vs-apartment-investment-australia",
          "rentvesting-australia",
          "rentvesting-australia-state-by-state-guide-2026",
          "smsf-property-guide",
          "property-management-fees-australia",
        ],
      },
    ],
  },
  // The house-and-land hub shows this list with or without stock; while it
  // has none, the list is most of what the page offers
  // (src/lib/house-and-land-indexability.ts).
  "/house-and-land": {
    heading: "Before you buy a house and land package",
    intro: "What a package price leaves out, how to check a builder, and the grants and stamp duty that apply to a new home in each state.",
    groups: [
      {
        slugs: [
          "house-and-land-packages-are-they-worth-it",
          "how-to-find-a-builder-australia",
          "first-home-owner-grant-australia",
          "first-home-buyer-guide",
        ],
      },
      { label: "First home buyers by state", href: "/first-home-buyers", slugs: perState("first-home-buyer") },
      { label: "Stamp duty by state", slugs: perState("stamp-duty") },
    ],
  },
};

/** The list for a hub path, or undefined for a hub that has none (/upgrading, /renovating). */
export function hubGuideList(path: string): HubGuideList | undefined {
  return (HUB_GUIDE_LISTS as Record<string, HubGuideList | undefined>)[path];
}

export interface CalculatorGuides {
  href: string;
  /** Same name the /tools page gives the calculator. */
  label: string;
  guides: readonly string[];
}

/**
 * Every calculator and the guides it pairs with, for /tools and the
 * glossary. A calculator added to /tools needs a row here
 * (tests/seo/guide-registry.test.ts checks).
 */
export const CALCULATOR_GUIDES: readonly CalculatorGuides[] = [
  { href: "/stamp-duty-calculator", label: "Stamp Duty Calculator", guides: perState("stamp-duty") },
  { href: "/borrowing-power-calculator", label: "Borrowing Power Calculator", guides: ["how-much-can-i-borrow-australia", "home-loan-pre-approval-australia"] },
  { href: "/lmi-calculator", label: "LMI Calculator", guides: ["lenders-mortgage-insurance-guide", "how-much-deposit-to-buy-a-house", "first-home-guarantee"] },
  { href: "/help-to-buy-calculator", label: "Help to Buy Calculator", guides: ["help-to-buy-scheme-australia", "first-home-guarantee", "shared-equity-schemes-australia"] },
  { href: "/fhss-calculator", label: "FHSS Calculator", guides: ["first-home-super-saver-scheme", "use-super-to-buy-a-house", "how-much-deposit-to-buy-a-house"] },
  { href: "/bridging-loan-calculator", label: "Bridging Loan Calculator", guides: ["bridging-loans-guide", "sell-first-or-buy-first", "downsizers-guide"] },
  { href: "/affordability-calculator", label: "Affordability Calculator", guides: ["how-much-deposit-to-buy-a-house", "lenders-mortgage-insurance-guide"] },
  { href: "/mortgage-calculator", label: "Mortgage Calculator", guides: ["fixed-vs-variable-rate-guide", "lenders-mortgage-insurance-guide"] },
  { href: "/refinancing-calculator", label: "Refinancing Calculator", guides: ["fixed-vs-variable-rate-guide", "offset-accounts-explained-australia"] },
  { href: "/rental-yield-calculator", label: "Rental Yield Calculator", guides: ["capital-growth-vs-cash-flow-australia", "property-management-fees-australia"] },
  { href: "/negative-gearing-calculator", label: "Negative Gearing Calculator", guides: ["negative-gearing-australia", "negative-gearing-cgt-changes-now-law-2026", "property-depreciation-guide"] },
  { href: "/cgt-calculator", label: "Capital Gains Tax Calculator", guides: ["cgt-changes-2026-budget", "negative-gearing-cgt-changes-now-law-2026"] },
  {
    href: "/real-estate-commission-calculator",
    label: "Real Estate Commission Calculator",
    guides: ["real-estate-agent-fees-australia", "how-to-negotiate-real-estate-agent-commission", ...perState("real-estate-commission")],
  },
  {
    href: "/selling-costs-calculator",
    label: "Selling Costs Calculator",
    guides: ["cost-of-selling-a-house-australia", ...perState("cost-of-selling-a-house")],
  },
  { href: "/renovation-cost-calculator", label: "Renovation Cost Calculator", guides: ["renovation-cost-australia-2026", "how-to-find-a-builder-australia"] },
];

export function getCalculator(href: string): CalculatorGuides | undefined {
  return CALCULATOR_GUIDES.find((c) => c.href === href);
}

export function toGuideLinks(guides: readonly GuideEntry[]): GuideLink[] {
  return guides.map((g) => ({ href: g.href, title: g.title, description: g.description }));
}

/** A hub's list, resolved to links; empty groups are dropped. */
export function hubGuideGroups(list: HubGuideList): GuideLinkGroup[] {
  return list.groups
    .map((g) => ({ label: g.label, href: g.href, links: toGuideLinks(resolveGuides(g.slugs)) }))
    .filter((g) => g.links.length > 0);
}

/** /tools: one group per calculator, headed by the calculator, listing its guides. */
export function calculatorGuideGroups(): GuideLinkGroup[] {
  return CALCULATOR_GUIDES.map((c) => ({ label: c.label, href: c.href, links: toGuideLinks(resolveGuides(c.guides)) }));
}
