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
  /** The full title: "The $20 million campaign: the complete guide to selling your home". */
  title: string;
  /** The title's two halves, for covers and headings. */
  name: string;
  subtitle: string;
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
  { slug: "preparing-your-property", title: "Preparing your property for the top buyer", sub: "The fixes that pay for themselves, and the ones that don’t" },
  { slug: "choosing-your-agent", title: "Choosing your agent: hire the campaign, not the quote", sub: "The 10 questions, what a $20 million vendor asks, fees and agreements" },
  { slug: "auction-private-treaty-off-market", title: "Auction, private treaty or off-market: choose on evidence", sub: "Which method fits your property and state" },
  { slug: "marketing-your-property", title: "Launching your campaign: marketing that sells", sub: "Portals, photography, copy, open homes and the first two weeks" },
  { slug: "offers-and-negotiation", title: "Negotiating every dollar: offers, conditions and exchange", sub: "Reading offers, cooling-off by state, the tactics used on vendors" },
  { slug: "legals-and-settlement", title: "Legals and settlement", sub: "Contracts, vendor statements, conveyancer vs solicitor" },
  { slug: "selling-timeline", title: "Your 12-week campaign timeline", sub: "A printable week-by-week checklist" },
];

export const BUYING_CHAPTERS: readonly GuideChapter[] = [
  { slug: "which-buyer-are-you", title: "Which buyer are you?", sub: "First home, upgrader, investor, downsizer: the playbook for each" },
  { slug: "what-you-can-spend", title: "What you can actually spend", sub: "Borrowing power, the lender buffer, deposits, LMI, true upfront costs" },
  { slug: "schemes-by-state", title: "Schemes, state by state", sub: "2026 settings: 5% Deposit Scheme, Help to Buy, FHOG, duty concessions" },
  { slug: "finding-the-right-suburb", title: "Finding the right suburb", sub: "The data that matters, school catchments, growth signals" },
  { slug: "inspecting-property", title: "Inspecting like a professional", sub: "The 30-minute method, building and pest, strata, when to walk" },
  { slug: "how-the-selling-side-plays-you", title: "How the selling side plays you", sub: "The seller’s campaign, price guides, auctions, off-market, and how to respond" },
  { slug: "making-an-offer", title: "Making the offer", sub: "Negotiation, protective conditions, auction strategy" },
  { slug: "finance-to-unconditional", title: "Finance to unconditional", sub: "Pre-approval realities, valuation shortfalls, investor lending" },
  { slug: "contracts-to-keys", title: "Contracts to keys", sub: "Conveyancing, cooling-off by state, settlement day" },
  { slug: "buying-timeline", title: "Your 12-week buying campaign", sub: "A printable week-by-week plan, persona footnotes included" },
];

export const GUIDE_BOOKS: Record<GuideBookId, GuideBook> = {
  selling: {
    id: "selling",
    title: "The $20 million campaign: the complete guide to selling your home",
    name: "The $20 million campaign",
    subtitle: "The complete guide to selling your home",
    colour: "#0f3d2e",
    spine: "#0a2e22",
    cover: "/images/guide/selling-guide-cover.png",
    href: "/selling-guide",
    chapters: SELLING_CHAPTERS,
  },
  buying: {
    id: "buying",
    title: "Beat the campaign: the complete guide to buying property",
    name: "Beat the campaign",
    subtitle: "The complete guide to buying property",
    colour: "#a9642c",
    spine: "#8f5222",
    cover: "/images/guide/buying-guide-cover.png",
    href: "/buying-guide",
    chapters: BUYING_CHAPTERS,
  },
};

/**
 * Where a chapter lives: its own page since 15 Oct 2026 (the chapters'
 * content is in src/content/guides). Turn CHAPTER_PAGES_LIVE off to point
 * links back at the chapter in the guide page's contents list.
 */
export const CHAPTER_PAGES_LIVE = true;

export function chapterHref(guide: GuideBookId, chapter: number): string {
  const book = GUIDE_BOOKS[guide];
  const c = book.chapters[chapter - 1];
  if (!c) throw new Error(`No chapter ${chapter} in the ${guide} guide`);
  return CHAPTER_PAGES_LIVE ? `${book.href}/${c.slug}` : `${book.href}#chapter-${chapter}`;
}
