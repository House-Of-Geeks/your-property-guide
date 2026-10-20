// The two free guides as books (Oct 2026): titles, the cover's colours and
// photograph, and the ten chapters each. The landing pages, the homepage,
// the covers (src/components/brand/BookCover.tsx), the printed PDFs and the
// emails read them from here, so the contents never drift between them.
//
// 20 Oct 2026 ("Clear decisions"): a matched collection. Buying a home is
// the forest-green edition, Selling a home the terracotta one, each with a
// photographic panel. The chapter slugs are live URLs and never change; only
// the visible titles were rewritten.

export type GuideBookId = "selling" | "buying";

export interface GuideChapter {
  /** The chapter's own path segment: /selling-guide/<slug>. Never change one once live. */
  slug: string;
  title: string;
  sub: string;
}

export interface GuideBook {
  id: GuideBookId;
  /** The descriptive title, for search results and page context: "Selling a home: a practical guide to selling property in Australia". */
  title: string;
  /** The short name on the cover and in links: "Selling a home". */
  name: string;
  /** The cover's subtitle, two short lines. */
  subtitle: readonly [string, string];
  /** One line saying what the guide covers, for cards and metadata. */
  summary: string;
  /** The edition number on the cover's footer ("01", "02"): buying first, as the homepage shows them. */
  edition: string;
  /** The cover colour, its spine, and the text on it. */
  colour: string;
  spine: string;
  ink: string;
  /** The cover's photographic panel (illustrative brand imagery, never a real property). */
  photo: { src: string; position: string; alt: string };
  /** The rendered cover (scripts/guides/render-pdfs.mjs): 1440 x 2036 JPEG, for structured data and sharing. */
  cover: string;
  /** The same cover for emails: 601 x 850 JPEG. */
  coverEmail: string;
  href: string;
  chapters: readonly GuideChapter[];
}

export const SELLING_CHAPTERS: readonly GuideChapter[] = [
  { slug: "right-time-to-sell", title: "Is now the right time to sell?", sub: "Your reasons, market conditions, the season, and selling first or buying first" },
  { slug: "what-your-property-is-worth", title: "What your property is worth", sub: "Appraisals and valuations, price evidence, and how agents set a price" },
  { slug: "real-cost-of-selling", title: "The real cost of selling", sub: "Commission by state, marketing, legal costs and what you could have left" },
  { slug: "preparing-your-property", title: "Preparing your property", sub: "The work that’s worth doing before a sale, and what may be better left alone" },
  { slug: "choosing-your-agent", title: "Choosing an agent and comparing proposals", sub: "The questions to ask, fees and the agency agreement" },
  { slug: "auction-private-treaty-off-market", title: "Auction, private treaty or off-market", sub: "Which way of selling suits your property and your state" },
  { slug: "marketing-your-property", title: "Marketing your property", sub: "Portals, photography, copy, open homes and the first few weeks" },
  { slug: "offers-and-negotiation", title: "Offers, negotiation and exchange", sub: "Reading offers, conditions and cooling-off by state" },
  { slug: "legals-and-settlement", title: "Contracts and settlement", sub: "Vendor disclosure, conveyancer or solicitor, and settlement day" },
  { slug: "selling-timeline", title: "Your 12-week selling timeline", sub: "A printable week-by-week checklist" },
];

export const BUYING_CHAPTERS: readonly GuideChapter[] = [
  { slug: "which-buyer-are-you", title: "Where you’re starting from", sub: "First home, next home, investing or downsizing: what changes for each" },
  { slug: "what-you-can-spend", title: "Working out your budget", sub: "Borrowing power, the lender’s buffer, deposits, LMI and the upfront costs" },
  { slug: "schemes-by-state", title: "Schemes and concessions by state", sub: "2026 settings: the 5% Deposit Scheme, Help to Buy, grants and duty concessions" },
  { slug: "finding-the-right-suburb", title: "Choosing an area", sub: "The data that helps, school catchments and what to weigh up" },
  { slug: "inspecting-property", title: "Inspecting a property", sub: "A consistent method, building and pest, strata, and when to walk away" },
  { slug: "how-the-selling-side-plays-you", title: "How homes are marketed and sold", sub: "Price guides, open homes, auctions and off-market sales, and how to respond" },
  { slug: "making-an-offer", title: "Making an offer", sub: "Negotiating, protective conditions and buying at auction" },
  { slug: "finance-to-unconditional", title: "Finance and approval", sub: "Pre-approval, valuations and what happens if one falls short" },
  { slug: "contracts-to-keys", title: "Contracts, cooling-off and settlement", sub: "Conveyancing, cooling-off by state and settlement day" },
  { slug: "buying-timeline", title: "Your 12-week buying timeline", sub: "A printable week-by-week plan" },
];

export const GUIDE_BOOKS: Record<GuideBookId, GuideBook> = {
  buying: {
    id: "buying",
    title: "Buying a home: a practical guide to buying property in Australia",
    name: "Buying a home",
    subtitle: ["From your first budget", "to the day you get the keys."],
    summary: "Work through the budget, property checks, offers and settlement, one decision at a time.",
    edition: "01",
    colour: "#244a37",
    spine: "#1b3a2b",
    ink: "#f8f6f0",
    photo: {
      src: "/images/brand/apartment-light.jpg",
      position: "50% 50%",
      alt: "Illustrative sunlit apartment opening onto a leafy balcony.",
    },
    cover: "/images/guide/buying-guide-cover.jpg",
    coverEmail: "/images/guide/buying-guide-cover-email.jpg",
    href: "/buying-guide",
    chapters: BUYING_CHAPTERS,
  },
  selling: {
    id: "selling",
    title: "Selling a home: a practical guide to selling property in Australia",
    name: "Selling a home",
    subtitle: ["Prepare with purpose.", "Move with a clearer plan."],
    summary: "Understand your costs, decide what to prepare, and compare agents and their proposals.",
    edition: "02",
    colour: "#89492f",
    spine: "#6e3a25",
    ink: "#f8f6f0",
    photo: {
      src: "/images/brand/terracotta-door.jpg",
      position: "50% 44%",
      alt: "Illustrative terracotta cottage door with bougainvillea and afternoon light.",
    },
    cover: "/images/guide/selling-guide-cover.jpg",
    coverEmail: "/images/guide/selling-guide-cover-email.jpg",
    href: "/selling-guide",
    chapters: SELLING_CHAPTERS,
  },
};

/** Both guides in the order the site shows them: buying (01), then selling (02). */
export const GUIDE_ORDER: readonly GuideBookId[] = ["buying", "selling"];

/** The cover's subtitle on one line ("From your first budget to the day you get the keys."). */
export const subtitleLine = (book: GuideBook) => book.subtitle.join(" ");

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
