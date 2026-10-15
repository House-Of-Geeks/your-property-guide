// The two free guides as books (Oct 2026): cover art, colours and the ten
// chapters each. The landing pages, the homepage shelf and the 3D book read
// them from here so the contents never drift between pages.

export type GuideBookId = "selling" | "buying";

export interface GuideChapter {
  /** The chapter's own path segment: /selling-guide/<slug>. Never change one once live. */
  slug: string;
  title: string;
  sub: string;
}

export interface GuideBook {
  id: GuideBookId;
  title: string;
  /** The cover's own colour, for the spine and back. */
  colour: string;
  spine: string;
  cover: string;
  href: string;
  chapters: readonly GuideChapter[];
}

export const SELLING_CHAPTERS: readonly GuideChapter[] = [
  { slug: "right-time-to-sell", title: "Is now the right time to sell?", sub: "Market conditions, seasonality, sell-first vs buy-first" },
  { slug: "what-your-property-is-worth", title: "What your property is really worth", sub: "Appraisals vs valuations, how agents price, underquoting traps" },
  { slug: "real-cost-of-selling", title: "The real cost of selling", sub: "Commission by state, marketing, conveyancing, the lot" },
  { slug: "preparing-your-property", title: "Preparing your property", sub: "The fixes that pay for themselves, and the ones that don't" },
  { slug: "choosing-your-agent", title: "Choosing your agent", sub: "The 10 interview questions, fee negotiation, agreement types" },
  { slug: "auction-private-treaty-off-market", title: "Auction vs private treaty vs off-market", sub: "Which method fits your property and state" },
  { slug: "marketing-your-property", title: "Marketing that actually sells", sub: "Portals, photography, copy, open homes" },
  { slug: "offers-and-negotiation", title: "Offers, negotiation and exchange", sub: "Cooling-off, conditions, reading buyer signals" },
  { slug: "legals-and-settlement", title: "Legals and settlement", sub: "Contracts, vendor statements, conveyancer vs solicitor" },
  { slug: "selling-timeline", title: "Your 12-week selling timeline", sub: "A printable week-by-week checklist" },
];

export const BUYING_CHAPTERS: readonly GuideChapter[] = [
  { slug: "which-buyer-are-you", title: "Which buyer are you?", sub: "First home, upgrader, investor, downsizer: the playbook for each" },
  { slug: "what-you-can-spend", title: "What you can actually spend", sub: "Borrowing power, the lender buffer, deposits, LMI, true upfront costs" },
  { slug: "schemes-by-state", title: "Schemes, state by state", sub: "2026 settings: 5% Deposit Scheme, Help to Buy, FHOG, duty concessions" },
  { slug: "finding-the-right-suburb", title: "Finding the right suburb", sub: "The data that matters, school catchments, growth signals" },
  { slug: "inspecting-property", title: "Inspecting like a professional", sub: "The 30-minute method, building and pest, strata, when to walk" },
  { slug: "how-the-selling-side-plays-you", title: "How the selling side plays you", sub: "Underquoting, price guides decoded, auction psychology" },
  { slug: "making-an-offer", title: "Making the offer", sub: "Negotiation, protective conditions, auction strategy" },
  { slug: "finance-to-unconditional", title: "Finance to unconditional", sub: "Pre-approval realities, valuation shortfalls, investor lending" },
  { slug: "contracts-to-keys", title: "Contracts to keys", sub: "Conveyancing, cooling-off by state, settlement day" },
  { slug: "buying-timeline", title: "Your 12-week buying timeline", sub: "A printable week-by-week plan, persona footnotes included" },
];

export const GUIDE_BOOKS: Record<GuideBookId, GuideBook> = {
  selling: {
    id: "selling",
    title: "The complete guide to selling your home",
    colour: "#c24a1c",
    spine: "#a23e17",
    cover: "/images/guide/selling-guide-cover.png",
    href: "/selling-guide",
    chapters: SELLING_CHAPTERS,
  },
  buying: {
    id: "buying",
    title: "The complete guide to buying property",
    colour: "#16191d",
    spine: "#0e1013",
    cover: "/images/guide/buying-guide-cover.png",
    href: "/buying-guide",
    chapters: BUYING_CHAPTERS,
  },
};

/**
 * Where a chapter lives. The chapters are being published as pages of their
 * own (campaign rebuild, Phase 3); until then this points at the chapter in
 * the guide page's contents list, so every link already goes somewhere real.
 * Flip CHAPTER_PAGES_LIVE when the chapter pages ship.
 */
export const CHAPTER_PAGES_LIVE = false;

export function chapterHref(guide: GuideBookId, chapter: number): string {
  const book = GUIDE_BOOKS[guide];
  const c = book.chapters[chapter - 1];
  if (!c) throw new Error(`No chapter ${chapter} in the ${guide} guide`);
  return CHAPTER_PAGES_LIVE ? `${book.href}/${c.slug}` : `${book.href}#chapter-${chapter}`;
}
