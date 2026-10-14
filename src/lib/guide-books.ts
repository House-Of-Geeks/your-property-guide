// The two free guides as books (Oct 2026): cover art, colours and the ten
// chapters each. The landing pages, the homepage shelf and the 3D book read
// them from here so the contents never drift between pages.

export type GuideBookId = "selling" | "buying";

export interface GuideChapter {
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
  { title: "Is now the right time to sell?", sub: "Market conditions, seasonality, sell-first vs buy-first" },
  { title: "What your property is really worth", sub: "Appraisals vs valuations, how agents price, underquoting traps" },
  { title: "The real cost of selling", sub: "Commission by state, marketing, conveyancing, the lot" },
  { title: "Preparing your property", sub: "The fixes that pay for themselves, and the ones that don't" },
  { title: "Choosing your agent", sub: "The 10 interview questions, fee negotiation, agreement types" },
  { title: "Auction vs private treaty vs off-market", sub: "Which method fits your property and state" },
  { title: "Marketing that actually sells", sub: "Portals, photography, copy, open homes" },
  { title: "Offers, negotiation and exchange", sub: "Cooling-off, conditions, reading buyer signals" },
  { title: "Legals and settlement", sub: "Contracts, vendor statements, conveyancer vs solicitor" },
  { title: "Your 12-week selling timeline", sub: "A printable week-by-week checklist" },
];

export const BUYING_CHAPTERS: readonly GuideChapter[] = [
  { title: "Which buyer are you?", sub: "First home, upgrader, investor, downsizer: the playbook for each" },
  { title: "What you can actually spend", sub: "Borrowing power, the lender buffer, deposits, LMI, true upfront costs" },
  { title: "Schemes, state by state", sub: "2026 settings: 5% Deposit Scheme, Help to Buy, FHOG, duty concessions" },
  { title: "Finding the right suburb", sub: "The data that matters, school catchments, growth signals" },
  { title: "Inspecting like a professional", sub: "The 30-minute method, building and pest, strata, when to walk" },
  { title: "How the selling side plays you", sub: "Underquoting, price guides decoded, auction psychology" },
  { title: "Making the offer", sub: "Negotiation, protective conditions, auction strategy" },
  { title: "Finance to unconditional", sub: "Pre-approval realities, valuation shortfalls, investor lending" },
  { title: "Contracts to keys", sub: "Conveyancing, cooling-off by state, settlement day" },
  { title: "Your 12-week buying timeline", sub: "A printable week-by-week plan, persona footnotes included" },
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
