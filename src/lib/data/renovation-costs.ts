// Renovation cost tables for /guides/renovation-cost-australia-2026
// (commercial intent review, 30 Sep 2026, section 3.7, priority 9).
//
// One source of truth for the tables on the page, the one-sentence answers at
// the top of each room section, the People-also-ask FAQ answers and the
// estimator, so none of them can drift from the others. Every figure carries
// the id of a dated published source in RENOVATION_SOURCES; a cell with no
// published figure is null and renders as "no published range". The guide's
// own ranges (source "guide") are the figures the page has quoted since May
// 2026; the other sources are the cross-checks the review asked for.
import type { StateCode } from "./commission-rates";

export const RENOVATION_COSTS_AS_AT = "30 September 2026";
export const RENOVATION_COSTS_AS_AT_SHORT = "September 2026";

export type SourceId =
  | "guide"
  | "archicentre2026"
  | "cka2026"
  | "canstar2025"
  | "threebirds2026"
  | "houzz2023"
  | "rlb2026"
  | "absPpi2026"
  | "absBuildCost2025"
  | "canstarDemolition2024"
  | "canstarKdr2025"
  | "mba2026"
  | "mbaGdp2026"
  | "hia2025"
  | "ncc";

export interface RenovationSource {
  id: SourceId;
  /** Full citation for the Sources block. */
  label: string;
  /** Short tag for a table cell, e.g. "Archicentre 2026". */
  short: string;
  date: string;
  href: string | null;
  note?: string;
}

export const RENOVATION_SOURCES: Record<SourceId, RenovationSource> = {
  guide: {
    id: "guide",
    label: "This guide's metro Australia ranges, from builder quotes on real jobs, reviewed " + RENOVATION_COSTS_AS_AT,
    short: "this guide",
    date: RENOVATION_COSTS_AS_AT,
    href: null,
    note: "Metro Australia, including GST. Premium ranges are open-ended.",
  },
  archicentre2026: {
    id: "archicentre2026",
    label: "Archicentre Australia, Cost Guide 2026 (Renovations and Additions, Wet Area Fit Out, Flooring, Painting, Plumbing and Electrical tables)",
    short: "Archicentre 2026",
    date: "2026",
    href: "https://www.archicentreaustralia.com.au/resources/cost-guide/",
    note: "Includes GST. Standard materials, fixtures and finishes; rooms assumed sound with good access; white goods, hazardous-material removal and professional fees extra.",
  },
  cka2026: {
    id: "cka2026",
    label: "Caulfield Krivanek Architecture, Home Renovation Construction Cost Indicator, June 2026 edition, prepared with quantity surveyors Rodney Vapp and Associates",
    short: "CKA, Jun 2026",
    date: "22 June 2026",
    href: "https://caulfieldkrivanek.com/home-renovation-cost-indicator/",
    note: "Sydney construction prices as the base. Excludes GST (add 10%), professional fees (15 to 20%) and contingency. Capital-city adjustments against Sydney: Melbourne minus 1%, Brisbane plus 4%, Perth plus 5%, Adelaide and Hobart 0%, rural areas plus 5 to 15%.",
  },
  canstar2025: {
    id: "canstar2025",
    label: "Canstar, How much does it cost to renovate a house in Australia?, Alasdair Duncan",
    short: "Canstar, Jan 2025",
    date: "30 January 2025",
    href: "https://www.canstar.com.au/home-loans/how-much-does-it-cost-to-renovate/",
    note: "Per-square-metre range attributed to Soho; room figures to hipages, Refresh Renovations and others.",
  },
  threebirds2026: {
    id: "threebirds2026",
    label: "Three Birds Renovations, How much does a bathroom renovation cost in Australia in 2026?",
    short: "Three Birds, Jan 2026",
    date: "7 January 2026",
    href: "https://www.threebirdsrenovations.com/blog/how-much-does-a-bathroom-renovation-cost-2026",
  },
  houzz2023: {
    id: "houzz2023",
    label: "Houzz, 2023 AU Houzz and Home Renovation Trends Study (renovations completed to March 2023; the most recent Australian edition)",
    short: "Houzz AU, Jul 2023",
    date: "17 July 2023",
    href: "https://www.houzz.com.au/magazine/2023-au-houzz-and-home-renovation-trends-study-stsetivw-vs~169418409",
  },
  rlb2026: {
    id: "rlb2026",
    label: "Rider Levett Bucknall, Riders Digest 2026, Sydney, 54th edition (Australian construction cost ranges for custom-built single and double storey dwellings; Sydney demolition costs)",
    short: "RLB Riders Digest 2026",
    date: "January 2026",
    href: "https://www.rlb.com/oceania/insight/rlb-riders-digest-australia-2026/",
    note: "Cost per square metre of gross floor area for a new custom-built house, not a renovation. No Hobart column.",
  },
  absPpi2026: {
    id: "absPpi2026",
    label: "ABS, Producer Price Indexes, Australia, June quarter 2026 (output of the house construction industry, six capital cities)",
    short: "ABS PPI, Jun 2026",
    date: "31 July 2026",
    href: "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/producer-price-indexes-australia/latest-release",
  },
  absBuildCost2025: {
    id: "absBuildCost2025",
    label: "Landmark Valuations, Construction cost per m² Australia 2026 (average cost per square metre of new houses built in 2024-25, from ABS Building Activity, Australia, December quarter 2025 release)",
    short: "Landmark, Jul 2026 (ABS)",
    date: "15 July 2026",
    href: "https://www.landmark-valuations.com.au/blog/construction-cost-per-square-metre-australia-2026",
    note: "Every new house built, 241.5 m² average floor area, dominated by volume builders. No per-square-metre figure for Tasmania, the ACT or the NT.",
  },
  canstarDemolition2024: {
    id: "canstarDemolition2024",
    label: "Canstar, How much does it cost to demolish a house?, Mandy Beaumont (figures attributed to Oneflare)",
    short: "Canstar, Jul 2024",
    date: "19 July 2024",
    href: "https://www.canstar.com.au/home-loans/demolish-house-cost/",
  },
  canstarKdr2025: {
    id: "canstarKdr2025",
    label: "Canstar, How much does it cost to knock down and rebuild a house?, Mark Bristow (demolition range attributed to G.J. Gardner Homes; average new home cost to the ABS, 2023-24)",
    short: "Canstar, Jun 2025",
    date: "26 June 2025",
    href: "https://www.canstar.com.au/home-loans/knock-down-rebuild-costs/",
  },
  mba2026: {
    id: "mba2026",
    label: "Master Builders Australia, Building costs remain high despite easing inflation (Denita Wawn: the cost of building a home is more than 50% higher than before the pandemic; new dwelling costs up 5.7% over the year)",
    short: "Master Builders, Aug 2026",
    date: "26 August 2026",
    href: "https://masterbuilders.com.au/building-costs-remain-high-despite-easing-inflation/",
  },
  mbaGdp2026: {
    id: "mbaGdp2026",
    label: "Master Builders Australia, GDP release confirms continued construction cost escalations (Denita Wawn: building materials inflation is at a three-year high; costs more than 50% above pre-pandemic)",
    short: "Master Builders, Sep 2026",
    date: "2 September 2026",
    href: "https://masterbuilders.com.au/gdp-release-confirms-continued-construction-cost-escalations/",
  },
  hia2025: {
    id: "hia2025",
    label: "HIA, Outlook: sunny with a chance of renovations, Maurice Tapang (NSW renovation investment expected to outpace Victoria by nearly 50% in 2026)",
    short: "HIA, Oct 2025",
    date: "21 October 2025",
    href: "https://hia.com.au/our-industry/housing/in-focus/2025/10/outlook-sunny-with-a-chance-of-renovations",
  },
  ncc: {
    id: "ncc",
    label: "ABCB, NCC 2022 state and territory adoption dates (NCC 2022 adopted 1 May 2023; housing energy efficiency from 1 October 2023 in NSW and the NT, 15 January 2024 in the ACT, 1 May 2024 in Victoria, 1 October 2024 in SA, 1 May 2025 in WA; not adopted in Tasmania); ABCB, NCC 2025 released, 1 May 2026; NSW Government, NSW to adopt new National Construction Code May 2027, 25 March 2026",
    short: "ABCB",
    date: "1 May 2026",
    href: "https://www.abcb.gov.au/ncc-2022-state-and-territory-adoption-dates",
  },
};

export interface Range {
  low: number;
  high: number;
  /** True when the source gives the high figure as a floor ("$60,000+"). */
  open?: boolean;
}

export type Finish = "basic" | "mid" | "high";
export const FINISHES: Finish[] = ["basic", "mid", "high"];
export const FINISH_LABELS: Record<Finish, string> = {
  basic: "Budget or cosmetic",
  mid: "Mid-range",
  high: "Premium",
};

/** One table cell: a sourced range, or null where nothing is published. */
export interface Cell {
  range: Range | null;
  source: SourceId;
  /** True when the source publishes the figure without GST. */
  exGst?: boolean;
  note?: string;
}

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

/** "$12,000 to $18,000", "$60,000 or more" for an open range, "$3,500/m² to $5,500/m²" with a unit, "$1,967/m²" for a single figure. */
export function rangeText(r: Range, unit: "" | "/m²" = ""): string {
  if (r.low === r.high) return `${money(r.low)}${unit}${r.open ? " or more" : ""}`;
  return `${money(r.low)}${unit} to ${money(r.high)}${unit}${r.open ? " or more" : ""}`;
}

/** Table form: "$12,000 to $18,000", "$60,000+", "$3,500 to $5,500 /m²", "$1,967 /m²" for a single figure. */
export function rangeCellText(r: Range, unit: "" | "/m²" = ""): string {
  const u = unit ? ` ${unit}` : "";
  if (r.low === r.high) return `${money(r.low)}${r.open ? "+" : ""}${u}`;
  return `${money(r.low)} to ${money(r.high)}${r.open ? "+" : ""}${u}`;
}

export const NO_PUBLISHED_RANGE = "no published range";

export type ItemKey =
  | "kitchen"
  | "bathroom"
  | "laundry"
  | "living"
  | "bedroom"
  | "extension"
  | "secondStorey";

export interface CostItem {
  key: ItemKey;
  label: string;
  unit: "each" | "m2";
  /** How the estimator names a quantity of this item. */
  quantityLabel: string;
  byFinish: Record<Finish, Cell>;
  note?: string;
}

const GUIDE = "guide" as const;

/**
 * The at-a-glance table and the estimator read this list. Where the guide
 * publishes no figure for a finish level, the cell names the cross-check
 * source it uses instead; where nobody publishes one, the cell is null.
 */
export const COST_ITEMS: CostItem[] = [
  {
    key: "kitchen",
    label: "Kitchen",
    unit: "each",
    quantityLabel: "kitchen",
    byFinish: {
      basic: { range: { low: 12_000, high: 18_000 }, source: GUIDE, note: "flat-pack cabinetry, laminate benchtop, same layout" },
      mid: { range: { low: 25_000, high: 45_000 }, source: GUIDE, note: "custom or premium flat-pack cabinetry, stone benchtop" },
      high: { range: { low: 60_000, high: 60_000, open: true }, source: GUIDE, note: "designer joinery, natural stone, full replan" },
    },
  },
  {
    key: "bathroom",
    label: "Bathroom",
    unit: "each",
    quantityLabel: "bathrooms",
    byFinish: {
      basic: { range: { low: 8_000, high: 15_000 }, source: "threebirds2026", note: "cosmetic refresh with budget materials" },
      mid: { range: { low: 15_000, high: 22_000 }, source: GUIDE, note: "in-place refresh, new tiles, vanity, waterproofing to AS 3740" },
      high: { range: { low: 25_000, high: 40_000, open: true }, source: GUIDE, note: "premium tiles, frameless screen, possible layout change" },
    },
  },
  {
    key: "laundry",
    label: "Laundry",
    unit: "each",
    quantityLabel: "laundry",
    byFinish: {
      basic: { range: null, source: "archicentre2026" },
      mid: { range: { low: 10_000, high: 19_000 }, source: "archicentre2026", note: "fit-out, standard materials, white goods extra" },
      high: { range: null, source: "archicentre2026" },
    },
    note: "Archicentre publishes one laundry range for standard materials; the estimator uses it at every finish level.",
  },
  {
    key: "living",
    label: "Living areas and flooring",
    unit: "each",
    quantityLabel: "living area refresh",
    byFinish: {
      basic: { range: { low: 7_000, high: 15_000, open: true }, source: "canstar2025", note: "paint, flooring, lighting and furniture" },
      mid: { range: null, source: "canstar2025" },
      high: { range: null, source: "canstar2025" },
    },
    note: "Canstar publishes one living-room range; the estimator uses it at every finish level. Flooring and painting per square metre are in the laundry, living and bedrooms table.",
  },
  {
    key: "bedroom",
    label: "Bedroom",
    unit: "each",
    quantityLabel: "bedrooms",
    byFinish: {
      basic: { range: { low: 1_000, high: 2_000 }, source: "canstar2025", note: "paint, carpet and lighting, per room" },
      mid: { range: null, source: "canstar2025" },
      high: { range: null, source: "canstar2025", note: "Canstar: up to $35,000 or more when a new ensuite is added" },
    },
    note: "Canstar publishes a basic per-room figure only; the estimator uses it at every finish level. Add a bathroom for an ensuite.",
  },
  {
    key: "extension",
    label: "Ground-floor extension",
    unit: "m2",
    quantityLabel: "m² of ground-floor extension",
    byFinish: {
      basic: { range: { low: 2_510, high: 3_760 }, source: "cka2026", exGst: true, note: "standard home shell under 300 m², Sydney base" },
      mid: { range: { low: 3_500, high: 5_500 }, source: GUIDE, note: "slab, walls, roof and services tie-in; fit-out extra" },
      high: { range: { low: 5_000, high: 5_990 }, source: "cka2026", exGst: true, note: "luxury home shell under 300 m², Sydney base" },
    },
    note: "Shell and roof only. Add a kitchen or bathroom line for any wet area in the new space.",
  },
  {
    key: "secondStorey",
    label: "Second-storey addition",
    unit: "m2",
    quantityLabel: "m² of second storey",
    byFinish: {
      basic: { range: null, source: GUIDE },
      mid: { range: { low: 4_500, high: 7_000 }, source: GUIDE, note: "structural reinforcement, scaffold, roof lift" },
      high: { range: null, source: GUIDE },
    },
    note: "No source publishes a second-storey rate by finish level; Archicentre lists first-floor additions as an extra over its extension rate. The estimator uses the mid-range figure at every finish level.",
  },
];

export const COST_ITEM_BY_KEY: Record<ItemKey, CostItem> = Object.fromEntries(
  COST_ITEMS.map((i) => [i.key, i]),
) as Record<ItemKey, CostItem>;

/**
 * Knock-down rebuild lines for the at-a-glance table (not estimator inputs).
 * Demolition does not vary with finish level, so its one range spans the
 * three finish columns (`all`).
 */
export interface KdrRow {
  label: string;
  unit: "each" | "m2";
  byFinish?: Record<Finish, Cell>;
  all?: Cell;
  note?: string;
}

export const KDR_ROWS: KdrRow[] = [
  {
    label: "Knock-down rebuild: demolition",
    unit: "each",
    all: { range: { low: 20_000, high: 45_000 }, source: GUIDE, note: "typical detached house at any finish level; more with asbestos or difficult access" },
  },
  {
    label: "Knock-down rebuild: new house",
    unit: "m2",
    byFinish: {
      basic: { range: { low: 1_800, high: 2_800 }, source: GUIDE, note: "volume builder project home" },
      mid: { range: null, source: GUIDE, note: "the ABS average for every new house built in 2024-25 is $1,967/m² (Landmark, Jul 2026)" },
      high: { range: { low: 3_500, high: 6_000 }, source: GUIDE, note: "custom, architect-designed" },
    },
  },
];

/**
 * Capital-city adjustment the estimator applies, from the CKA indicator
 * (Sydney base). Null where CKA publishes none (Canberra, Darwin): the
 * estimator applies no adjustment and says so.
 */
export interface StateCost {
  state: StateCode;
  name: string;
  capital: string;
  /** CKA June 2026 renovation cost adjustment against Sydney, percent. */
  ckaPct: number | null;
  /** RLB Riders Digest 2026 custom-built house, $/m² GFA. */
  rlbCustom: Range | null;
  /** ABS-derived average new house cost, $/m², 2024-25. */
  absNewHousePerM2: number | null;
  /** ABS PPI house construction output, change over the year to June 2026, percent. */
  ppiAnnualPct: number | null;
}

export const STATE_COSTS: Record<StateCode, StateCost> = {
  NSW: { state: "NSW", name: "New South Wales", capital: "Sydney", ckaPct: 0, rlbCustom: { low: 2_500, high: 7_600 }, absNewHousePerM2: 2_396, ppiAnnualPct: 4.8 },
  VIC: { state: "VIC", name: "Victoria", capital: "Melbourne", ckaPct: -1, rlbCustom: { low: 2_700, high: 6_900 }, absNewHousePerM2: 1_914, ppiAnnualPct: 3.7 },
  QLD: { state: "QLD", name: "Queensland", capital: "Brisbane", ckaPct: 4, rlbCustom: { low: 3_150, high: 5_800 }, absNewHousePerM2: 1_987, ppiAnnualPct: 8.0 },
  WA: { state: "WA", name: "Western Australia", capital: "Perth", ckaPct: 5, rlbCustom: { low: 3_100, high: 5_100 }, absNewHousePerM2: 1_585, ppiAnnualPct: 8.8 },
  SA: { state: "SA", name: "South Australia", capital: "Adelaide", ckaPct: 0, rlbCustom: { low: 2_200, high: 4_000 }, absNewHousePerM2: 1_788, ppiAnnualPct: 8.5 },
  TAS: { state: "TAS", name: "Tasmania", capital: "Hobart", ckaPct: 0, rlbCustom: null, absNewHousePerM2: null, ppiAnnualPct: 11.5 },
  ACT: { state: "ACT", name: "Australian Capital Territory", capital: "Canberra", ckaPct: null, rlbCustom: { low: 2_150, high: 4_200 }, absNewHousePerM2: null, ppiAnnualPct: null },
  NT: { state: "NT", name: "Northern Territory", capital: "Darwin", ckaPct: null, rlbCustom: { low: 2_450, high: 4_500 }, absNewHousePerM2: null, ppiAnnualPct: null },
};

export const STATE_ORDER: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

/** CKA June 2026: rural areas plus 5 to 15% depending on distance from a major city. */
export const REGIONAL_ADJUSTMENT_PCT: Range = { low: 5, high: 15 };

/** National figures quoted in the FAQs and answers. */
export const ABS_NEW_HOUSE_NATIONAL_PER_M2 = 1_967;
export const ABS_NEW_HOUSE_AVG_FLOOR_M2 = 241.5;
export const ABS_PPI_HOUSE_ANNUAL_PCT = 5.9;
export const ABS_PPI_HOUSE_QUARTER_PCT = 2.0;

/** The guide's own on-costs, used by the budgeting section and the estimator. */
export const ON_COSTS = {
  designAndApprovalsPct: { low: 8, high: 15 } as Range,
  contingencyPct: { low: 10, high: 15 } as Range,
};

/** Per-square-metre by scope: this guide's tiers and what each published source says. */
export const SCOPE_PER_M2 = {
  guide: {
    cosmetic: { low: 2_000, high: 2_500 } as Range,
    mid: { low: 2_800, high: 4_500 } as Range,
    premium: { low: 5_000, high: 7_500, open: true } as Range,
  },
  archicentreExisting: { low: 1_600, high: 3_900 } as Range,
  archicentreNewAndExtension: { low: 2_700, high: 5_100 } as Range,
  ckaShell: {
    standard: { low: 2_510, high: 3_760 } as Range,
    quality: { low: 3_340, high: 4_630 } as Range,
    luxury: { low: 5_000, high: 5_990 } as Range,
  },
  canstar: { low: 1_600, high: 3_700 } as Range,
};

/**
 * Archicentre Australia Cost Guide 2026, page 3 (Renovations and Additions),
 * read 11 October 2026. All figures include GST. The new construction rate is
 * "basic shell only and the extended roofline over the shell"; the guide says
 * that where the work involves a kitchen, bathroom or laundry "you must add
 * the wet area fitout costs".
 */
export const ARCHICENTRE_2026 = {
  readOn: "11 October 2026",
  newConstructionPerM2: SCOPE_PER_M2.archicentreNewAndExtension,
  renovationPerM2: SCOPE_PER_M2.archicentreExisting,
  kitchen: { low: 23_000, high: 49_000 } as Range,
  bathroom: { low: 17_500, high: 35_000 } as Range,
  laundry: { low: 10_000, high: 19_000 } as Range,
};

/**
 * A granny flat's build cost as the Archicentre guide says to add it up: the
 * new construction shell rate times the floor area, plus one kitchen and one
 * bathroom fit-out. Excludes site works, service connections, approvals,
 * design and other professional fees, landscaping and any regional premium.
 * Used by the five state granny flat guides (commercial-intent review, 10 Oct
 * 2026, F1 to F5) so none of them prints a cost range of its own.
 */
export function grannyFlatBuildRange(m2: number): Range {
  const a = ARCHICENTRE_2026;
  return {
    low: a.newConstructionPerM2.low * m2 + a.kitchen.low + a.bathroom.low,
    high: a.newConstructionPerM2.high * m2 + a.kitchen.high + a.bathroom.high,
  };
}

/** Room cross-checks by source; a string cell is a figure the source gives in another form. */
export interface CheckRow {
  source: SourceId;
  basis: string;
  cells: (Range | string | null)[];
  unit?: "" | "/m²";
}
export interface CheckTable {
  id: string;
  caption: string;
  columns: string[];
  rows: CheckRow[];
  note?: string;
}

export const KITCHEN_CHECKS: CheckTable = {
  id: "kitchen-table",
  caption: "Kitchen renovation cost by finish level: this guide against the published sources",
  columns: ["Source", "Budget", "Mid-range", "Premium", "Basis"],
  rows: [
    { source: "guide", basis: "metro Australia, incl. GST", cells: [{ low: 12_000, high: 18_000 }, { low: 25_000, high: 45_000 }, { low: 60_000, high: 60_000, open: true }] },
    { source: "archicentre2026", basis: "fit-out, standard materials, incl. GST, white goods extra", cells: [null, { low: 23_000, high: 49_000 }, null] },
    { source: "cka2026", basis: "Sydney base, excl. GST; standard, quality, luxury", cells: [{ low: 14_360, high: 19_760 }, { low: 22_200, high: 35_600 }, { low: 32_690, high: 50_900 }] },
    { source: "canstar2025", basis: "one range, labour the largest cost", cells: [null, { low: 20_000, high: 50_000, open: true }, null] },
    { source: "houzz2023", basis: "median spend, renovations to March 2023", cells: [null, "median $30,000", null] },
  ],
};

export const BATHROOM_CHECKS: CheckTable = {
  id: "bathroom-table",
  caption: "Bathroom renovation cost by finish level: this guide against the published sources",
  columns: ["Source", "Budget", "Mid-range", "Premium", "Basis"],
  rows: [
    { source: "guide", basis: "metro Australia, incl. GST; standard and premium", cells: [null, { low: 15_000, high: 22_000 }, { low: 25_000, high: 40_000, open: true }] },
    { source: "threebirds2026", basis: "budget, standard, premium; average about $26,000", cells: [{ low: 8_000, high: 15_000 }, { low: 15_000, high: 35_000 }, "$35,000+"] },
    { source: "archicentre2026", basis: "bathroom or ensuite fit-out, standard materials, incl. GST", cells: [null, { low: 17_500, high: 35_000 }, null] },
    { source: "cka2026", basis: "bathroom, Sydney base, excl. GST; standard, quality, luxury", cells: [{ low: 13_360, high: 22_810 }, { low: 20_640, high: 32_150 }, { low: 32_000, high: 50_360 }] },
    { source: "cka2026", basis: "ensuite, Sydney base, excl. GST; standard, quality, luxury", cells: [{ low: 8_490, high: 13_090 }, { low: 15_020, high: 21_200 }, { low: 22_540, high: 34_090 }] },
    { source: "canstar2025", basis: "one range, tiles the largest cost", cells: [null, { low: 15_000, high: 30_000, open: true }, null] },
    { source: "houzz2023", basis: "main bathroom median spend, renovations to March 2023", cells: [null, "median $19,000", null] },
  ],
};

export const SECONDARY_ROOM_CHECKS: CheckTable = {
  id: "laundry-living-table",
  caption: "Laundry, living areas, flooring and bedrooms: the published ranges",
  columns: ["Item", "Published range", "Source and basis"],
  rows: [
    { source: "archicentre2026", basis: "Laundry fit-out, standard materials, incl. GST, white goods extra", cells: [{ low: 10_000, high: 19_000 }] },
    { source: "cka2026", basis: "Laundry, standard to luxury, Sydney base, excl. GST", cells: [{ low: 6_000, high: 22_680 }] },
    { source: "canstar2025", basis: "Living room refresh: paint, flooring, lighting, furniture", cells: [{ low: 7_000, high: 15_000, open: true }] },
    { source: "cka2026", basis: "Internal repainting, per room, excl. GST", cells: [{ low: 1_320, high: 1_810 }] },
    { source: "archicentre2026", basis: "Interior painting, one undercoat and two coats, per m²", cells: [{ low: 20, high: 40 }], unit: "/m²" },
    { source: "archicentre2026", basis: "Carpet, per m², plus underlay", cells: [{ low: 45, high: 165 }], unit: "/m²" },
    { source: "archicentre2026", basis: "Vinyl flooring, per m²", cells: [{ low: 70, high: 120 }], unit: "/m²" },
    { source: "archicentre2026", basis: "Timber floor polishing, per m²", cells: [{ low: 75, high: 120 }], unit: "/m²" },
    { source: "archicentre2026", basis: "Floor tiling, per m², for tiles costing up to $30 per m²", cells: ["$135 /m²"] },
    { source: "canstar2025", basis: "Bedroom, basic refresh (paint, carpet, lighting), per room", cells: [{ low: 1_000, high: 2_000 }] },
    { source: "canstar2025", basis: "Bedroom with a new ensuite", cells: ["up to $35,000+"] },
    { source: "archicentre2026", basis: "Rewire a house, incl. GST", cells: [{ low: 9_500, high: 24_000 }] },
    { source: "cka2026", basis: "Rewiring, 150 to 240 m² house, excl. GST", cells: [{ low: 8_770, high: 13_200 }] },
    { source: "archicentre2026", basis: "Complete re-plumbing, 150 m² house, incl. GST", cells: [{ low: 14_000, high: 24_000 }] },
    { source: "cka2026", basis: "Re-plumbing, 150 to 240 m² house, excl. GST", cells: [{ low: 11_400, high: 22_600 }] },
  ],
};

export const EXTENSION_CHECKS: CheckTable = {
  id: "extension-table",
  caption: "Extensions and second storeys, cost per square metre: this guide against the published sources",
  columns: ["Source", "Ground-floor extension", "Second-storey addition", "Basis"],
  rows: [
    { source: "guide", basis: "metro Australia, shell and services tie-in, incl. GST", cells: [{ low: 3_500, high: 5_500 }, { low: 4_500, high: 7_000 }], unit: "/m²" },
    { source: "archicentre2026", basis: "new construction and extensions, basic shell and roofline, incl. GST; first-floor additions (stair, structure, roof alteration) are an extra with no published rate", cells: [{ low: 2_700, high: 5_100 }, null], unit: "/m²" },
    { source: "cka2026", basis: "shell under 300 m², Sydney base, excl. GST: standard, quality, luxury", cells: ["$2,510 to $3,760; $3,340 to $4,630; $5,000 to $5,990 /m²", null], unit: "/m²" },
  ],
  note: "Every source prices the shell only. Kitchens, bathrooms and laundries in the new space are priced from the room tables.",
};

export const KDR_CHECKS: CheckTable = {
  id: "kdr-table",
  caption: "Knock-down rebuild: demolition and new build costs against the published sources",
  columns: ["Source", "Demolition", "New house", "Basis"],
  rows: [
    { source: "guide", basis: "typical detached house; volume builder and custom per m², incl. GST", cells: [{ low: 20_000, high: 45_000 }, "$1,800 to $2,800 /m² volume builder; $3,500 to $6,000 /m² custom"] },
    { source: "rlb2026", basis: "Sydney: demolition per m² of house (timber-framed $170 to $245, brick $175 to $280, incl. footings, services and removal); custom-built house per m² GFA", cells: ["$170 to $280 /m²", "$2,500 to $7,600 /m²"] },
    { source: "absBuildCost2025", basis: "ABS average of every new house built in 2024-25, 241.5 m² average", cells: [null, "$1,967 /m² national; NSW $2,396, VIC $1,914, QLD $1,987, SA $1,788, WA $1,585"] },
    { source: "canstarDemolition2024", basis: "per m² and a three-bedroom average, attributed to Oneflare", cells: ["$40 to $65 /m²; about $17,000, up to $40,000", null] },
    { source: "canstarKdr2025", basis: "G.J. Gardner Homes demolition range; ABS average new home cost 2023-24", cells: [{ low: 12_000, high: 40_000 }, "$443,828 average new home"] },
    { source: "mba2026", basis: "cost of building a home against pre-pandemic", cells: [null, "more than 50% higher than before the pandemic; up 5.7% over the year"] },
  ],
};

export const CHECK_TABLES: CheckTable[] = [KITCHEN_CHECKS, BATHROOM_CHECKS, SECONDARY_ROOM_CHECKS, EXTENSION_CHECKS, KDR_CHECKS];

/** The sources the page lists, in the order the tables use them. */
export const RENOVATION_SOURCE_ORDER: SourceId[] = [
  "archicentre2026",
  "cka2026",
  "rlb2026",
  "absPpi2026",
  "absBuildCost2025",
  "mba2026",
  "mbaGdp2026",
  "hia2025",
  "canstar2025",
  "threebirds2026",
  "houzz2023",
  "canstarDemolition2024",
  "canstarKdr2025",
  "ncc",
];

// ---------------------------------------------------------------------------
// The one-sentence dated answer at the top of each room section (the shape an
// AI Overview quotes), built from the figures above so it cannot drift.
// ---------------------------------------------------------------------------

const k = COST_ITEM_BY_KEY.kitchen.byFinish;
const b = COST_ITEM_BY_KEY.bathroom.byFinish;
const ext = COST_ITEM_BY_KEY.extension.byFinish.mid.range as Range;
const ss = COST_ITEM_BY_KEY.secondStorey.byFinish.mid.range as Range;
const laundry = COST_ITEM_BY_KEY.laundry.byFinish.mid.range as Range;
const living = COST_ITEM_BY_KEY.living.byFinish.basic.range as Range;
const bedroom = COST_ITEM_BY_KEY.bedroom.byFinish.basic.range as Range;
const demo = KDR_ROWS[0].all?.range as Range;

export const ROOM_ANSWERS = {
  kitchen: `As at ${RENOVATION_COSTS_AS_AT_SHORT}, a kitchen renovation in metro Australia costs ${rangeText(k.basic.range as Range)} for a budget refresh, ${rangeText(k.mid.range as Range)} mid-range and ${rangeText(k.high.range as Range)} premium; Archicentre Australia's Cost Guide 2026 puts a standard kitchen fit-out at $23,000 to $49,000 including GST and excluding white goods.`,
  bathroom: `As at ${RENOVATION_COSTS_AS_AT_SHORT}, a bathroom renovation costs ${rangeText(b.mid.range as Range)} for a standard in-place refresh and ${rangeText(b.high.range as Range)} premium in metro Australia, with Three Birds Renovations (January 2026) putting a budget cosmetic refresh at $8,000 to $15,000 and Archicentre Australia's Cost Guide 2026 a bathroom or ensuite fit-out at $17,500 to $35,000.`,
  secondary: `As at ${RENOVATION_COSTS_AS_AT_SHORT}, a laundry fit-out costs ${rangeText(laundry)} (Archicentre Australia Cost Guide 2026, standard materials), a living-area refresh ${rangeText(living)} (Canstar, January 2025) and a basic bedroom refresh ${rangeText(bedroom)} per room (Canstar, January 2025).`,
  fullHouse: `As at ${RENOVATION_COSTS_AS_AT_SHORT}, a full renovation of a three-bedroom house in metro Australia costs ${rangeText(SCOPE_PER_M2.guide.cosmetic, "/m²")} for cosmetic work, ${rangeText(SCOPE_PER_M2.guide.mid, "/m²")} mid-range and ${rangeText(SCOPE_PER_M2.guide.premium, "/m²")} premium, or $200,000 to $500,000 for a mid-range project; Archicentre Australia's Cost Guide 2026 puts renovation inside an existing building at ${rangeText(SCOPE_PER_M2.archicentreExisting, "/m²")}.`,
  extensions: `As at ${RENOVATION_COSTS_AS_AT_SHORT}, a ground-floor extension costs ${rangeText(ext, "/m²")} and a second-storey addition ${rangeText(ss, "/m²")} for the shell in metro Australia; Archicentre Australia's Cost Guide 2026 prices new construction and extensions at ${rangeText(SCOPE_PER_M2.archicentreNewAndExtension, "/m²")} with first-floor additions extra.`,
  knockDownRebuild: `As at ${RENOVATION_COSTS_AS_AT_SHORT}, demolishing a typical detached house costs ${rangeText(demo)} and a new house $1,800 to $2,800/m² from a volume builder or $3,500 to $6,000/m² custom; the ABS-derived average for every new house built in 2024-25 is ${money(ABS_NEW_HOUSE_NATIONAL_PER_M2)}/m² (Landmark Valuations, July 2026) and Rider Levett Bucknall's Riders Digest 2026 prices a Sydney custom-built house at $2,500 to $7,600/m².`,
};

// ---------------------------------------------------------------------------
// FAQs: the eight the page has carried since May 2026 (the first reworded to
// the People-also-ask question it answers) plus the three PAA questions from
// the 30 Sep 2026 review. Every PAA answer is 40+ words with a figure and a
// dated source (rule 9).
// ---------------------------------------------------------------------------

export interface RenovationFaq {
  question: string;
  answer: string;
}

export const RENOVATION_PAA_QUESTIONS = [
  "How much does it cost to fully renovate a house in Australia?",
  "Is $100,000 a good budget for renovating my house?",
  "Can I renovate a bathroom for $10,000?",
  "Is it cheaper to renovate or rebuild?",
] as const;

export const RENOVATION_FAQS: RenovationFaq[] = [
  {
    question: RENOVATION_PAA_QUESTIONS[0],
    answer:
      `For a standard three-bedroom house in a metro area, a mid-range full renovation in ${RENOVATION_COSTS_AS_AT_SHORT} costs $200,000 to $500,000, or roughly ${rangeText(SCOPE_PER_M2.guide.mid, "/m²")} of the area being renovated. Cosmetic-only projects land at ${rangeText(SCOPE_PER_M2.guide.cosmetic, "/m²")}; premium projects (architect-designed, high-end finishes, structural work) can exceed $6,000/m². Archicentre Australia's Cost Guide 2026 puts renovation inside an existing building at ${rangeText(SCOPE_PER_M2.archicentreExisting, "/m²")} with standard materials, and the ABS reports house construction output prices up ${ABS_PPI_HOUSE_ANNUAL_PCT}% in the year to June 2026. Regional work generally costs more, not less: the CKA cost indicator (June 2026) adds ${REGIONAL_ADJUSTMENT_PCT.low} to ${REGIONAL_ADJUSTMENT_PCT.high}% outside the capital cities.`,
  },
  {
    question: RENOVATION_PAA_QUESTIONS[1],
    answer:
      `Yes for two rooms and a refresh, no for a whole house. At ${RENOVATION_COSTS_AS_AT_SHORT} metro prices, $100,000 covers a mid-range kitchen (${rangeText(k.mid.range as Range)}) and a standard bathroom (${rangeText(b.mid.range as Range)}) with $33,000 to $60,000 left for paint, flooring and lighting (Canstar, January 2025: a living-area refresh is ${rangeText(living)}), or about 40 to 50 m² of cosmetic work at ${rangeText(SCOPE_PER_M2.guide.cosmetic, "/m²")}. A mid-range whole-house renovation starts at $200,000. This guide's contingency is ${ON_COSTS.contingencyPct.low} to ${ON_COSTS.contingencyPct.high}%, so hold back $10,000 to $15,000 and plan the work at $85,000 to $90,000.`,
  },
  {
    question: RENOVATION_PAA_QUESTIONS[2],
    answer:
      `Only as a cosmetic refresh. Three Birds Renovations (January 2026) puts a budget bathroom, a small cosmetic refresh with budget materials, at $8,000 to $15,000; in practice that means keeping the existing tiles and layout. A full strip-out with new waterproofing and tiling is ${rangeText(b.mid.range as Range)} in this guide's metro range, $17,500 to $35,000 in Archicentre Australia's Cost Guide 2026 and $13,360 to $22,810 before GST in the CKA cost indicator (June 2026). Waterproofing alone is $1,500 to $3,000 and is required by AS 3740, so a $10,000 budget cannot stretch to moving fixtures or retiling a whole room.`,
  },
  {
    question: RENOVATION_PAA_QUESTIONS[3],
    answer:
      `This guide's rule of thumb: once a renovation quote passes 70 to 80% of the cost of a new build, price a knock-down rebuild. The ABS-derived average for every new house built in 2024-25 is ${money(ABS_NEW_HOUSE_NATIONAL_PER_M2)}/m² (about $475,000 for the ${ABS_NEW_HOUSE_AVG_FLOOR_M2} m² average, Landmark Valuations, July 2026), plus demolition at $170 to $280/m² in Sydney (Rider Levett Bucknall, Riders Digest 2026), which is $25,500 to $42,000 for a 150 m² house. Renovation inside an existing building runs ${rangeText(SCOPE_PER_M2.archicentreExisting, "/m²")} (Archicentre Australia, 2026) but only touches the area you renovate, and rebuilding adds 8 to 14 months of rent elsewhere. Structural renovation of an older home, with asbestos, wiring and plumbing unknowns, is where rebuilding wins.`,
  },
  {
    question: "What's the cheapest way to renovate a house?",
    answer:
      "Cosmetic work delivers the biggest perceived change for the smallest spend. Paint, new flooring, new lighting, new tapware, deep cleaning, and tidying up the garden can transform a tired home for $20,000–$40,000 and is realistic DIY-plus-tradies territory. Structural work (moving walls, new wet areas, new windows) multiplies cost quickly because it triggers waterproofing, electrical, plumbing, certification, and structural engineering. If you don't need to move a wall, don't move a wall.",
  },
  {
    question: "Do I need council approval to renovate?",
    answer:
      "Depends on what you're doing and where. Cosmetic work (paint, flooring, tapware swap, kitchen cabinet replacement in the same footprint) generally doesn't need approval. Structural changes (moving walls, new windows, extensions, second storeys), new wet areas, and most external changes typically need either a Complying Development Certificate (NSW) / building permit (VIC) / building work approval (QLD) at minimum, and a full DA / planning permit if you're changing footprint, height, or use. Every council has different exempt-development rules, so confirm before you start. Doing work without required approval can mean stop-work orders, fines, and forced rectification at sale.",
  },
  {
    question: "How much does a kitchen renovation cost in Australia?",
    answer:
      "Budget kitchen ($12,000–$18,000): flat-pack cabinetry, laminate benchtop, basic appliances, kept in the same layout. Mid-range ($25,000–$45,000): custom or premium flat-pack cabinetry, stone benchtop, quality appliances, possible minor layout change. Premium ($60,000+): designer cabinetry, premium stone or porcelain benchtop, integrated high-end appliances, full layout reconfiguration with new plumbing and electrical. Cabinetry typically represents 40–55% of the kitchen budget; benchtops 10–20%; appliances 15–25%; labour for installation, plumbing, electrical and tiling 15–25%. Cross-checks: Archicentre Australia's Cost Guide 2026 puts a standard kitchen fit-out at $23,000 to $49,000; Houzz's 2023 Australian study found a median kitchen spend of $30,000.",
  },
  {
    question: "How much does a bathroom renovation cost?",
    answer:
      "Standard bathroom ($15,000–$22,000): in-place refresh, new tiles, vanity, toilet, shower screen, tapware. Premium bathroom ($25,000–$40,000+): premium tiles and stone, frameless screen, freestanding bath, designer tapware, possible layout change, underfloor heating. Waterproofing alone is $1,500–$3,000 and is legally required to AS 3740. Never skip or shortcut this; it's the single biggest cause of insurance claims years later. Tiling labour is usually $60–$120/m² for the labour alone, materials separate. Cross-checks: Archicentre Australia's Cost Guide 2026 puts a bathroom or ensuite fit-out at $17,500 to $35,000; Three Birds Renovations (January 2026) quotes an industry average of about $26,000.",
  },
  {
    question: "How much should I budget for contingency?",
    answer:
      "Add 10–15% on top of every quoted price for unexpected issues, and another 5% for scope creep (you'll change your mind about something, almost everyone does). On structural work or older homes (pre-1990 in metro areas, anything pre-1970), increase to 15–20% contingency because you can't see what's behind the walls until you open them up. Asbestos, rotten timbers, outdated wiring, lead paint, and undocumented previous work all cost money to remediate when discovered.",
  },
  {
    question: "Should I get a fixed-price or cost-plus contract?",
    answer:
      "Fixed-price gives you cost certainty but at the price of a larger contingency baked into the builder's quote (typically 8–15% of the contract value). Best for straightforward jobs where the scope is clear. Cost-plus (where you pay actual costs plus a fixed builder's margin, typically 15–20%) gives you transparency on actual costs and is often cheaper if the scope is well-managed, but you carry the risk of overruns. Best for complex jobs, heritage properties, or when you trust the builder. Our guide to finding a builder sets out what to check in a building contract before you sign either kind.",
  },
  {
    question: "Will renovating add value at sale?",
    answer:
      "Sometimes, but we know of no published, dated Australian study that measures how much of a renovation's cost comes back at sale, so treat any ratio you see with care. What decides it: whether the work lifts the home into a wider buyer pool (a bedroom or bathroom that comparable homes in the suburb already have), whether it over-capitalises for the street, and whether it fixes defects or unapproved work that put buyers off. Compare what similar sold homes nearby offer before you spend, and read our guide to what to fix before selling a house.",
  },
];
