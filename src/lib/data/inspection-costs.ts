// Building and pest inspection prices by capital city (commercial intent
// review 30 Sep 2026, section 3.7). Every figure is a price an inspector or
// an industry price guide publishes, read on 30 September 2026; the source
// list under each city names the page and its date. Where a page quotes
// ex GST the figure here has 10% added and is rounded to the dollar, and
// the source note says so. Nothing here is a site estimate: where the
// sources do not split a figure by property type, the row says so.
import type { StateCode } from "@/lib/data/commission-rates";

export interface CostRange {
  low: number;
  high: number;
  /** The top figure is a "from" price: the source publishes no ceiling. */
  open?: boolean;
  /** Only one named source publishes this figure. */
  single?: boolean;
}

export interface CostSource {
  label: string;
  href: string;
  /** Date read or published, and the GST basis of the page's figures. */
  note: string;
}

export interface CityInspectionCosts {
  city: string;
  state: StateCode;
  /** Combined building and pest inspection, GST included. */
  combined: {
    /** Apartment or unit. */
    unit: CostRange;
    /** Townhouse or one to two bedroom house. */
    small: CostRange;
    /** Three to four bedroom house. */
    house: CostRange;
    /** Five or more bedrooms, multi-storey, older or rural. */
    large: CostRange;
  };
  buildingOnly: CostRange | null;
  pestOnly: CostRange | null;
  /** What the sources split, and what they do not. */
  note: string;
  sources: CostSource[];
}

/** A page that quotes ex GST: add 10% and round to the dollar. */
const exGst = (n: number) => Math.round(n * 1.1);

export const INSPECTION_COSTS: readonly CityInspectionCosts[] = [
  {
    city: "Sydney",
    state: "NSW",
    combined: {
      unit: { low: 395, high: 520 },              // P&BI from $395; Rapid $419–$520; iSPECT $468
      small: { low: 450, high: 550 },             // Rapid 2-bed unit or townhouse $450–$550; iSPECT 1–2 bed $512
      house: { low: 495, high: 730 },             // P&BI from $495; Rapid 3-bed $500–$650, 4-bed $525–$730; iSPECT $534
      large: { low: exGst(515), high: 695, open: true }, // iSPECT 5+ bed $567; Rapid 5+ bed $650+; P&BI 250–450 m² from $695
    },
    buildingOnly: { low: exGst(395), high: exGst(485), single: true }, // iSPECT apartment $435 to 5+ bed $534
    pestOnly: { low: exGst(425), high: exGst(485), single: true },     // iSPECT 1–2 bed $468 to 5+ bed $534
    note: "Only iSPECT publishes building-only and pest-only prices for Sydney; Rapid and Pest & Building Inspections price the combined inspection only.",
    sources: [
      { label: "iSPECT Sydney, building inspection cost table", href: "https://sydney.ispect.com.au/building-inspection-cost", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
      { label: "Rapid Building Inspections, Building and pest inspection Sydney cost guide 2026", href: "https://www.rapidbuildinginspections.com.au/news/building-and-pest-inspection-sydney-cost.html", note: "published 12 Aug 2026; GST basis not stated" },
      { label: "Pest & Building Inspections Sydney, 2026 pricing", href: "https://www.pestandbuildinginspections.com.au/pricing", note: "read 30 Sep 2026; GST basis not stated" },
    ],
  },
  {
    city: "Melbourne",
    state: "VIC",
    combined: {
      unit: { low: 350, high: 500 },              // BuyWise $350–$500; Point from $440; iSPECT $468
      small: { low: 440, high: exGst(465) },      // Point combined from $440; iSPECT 1–2 bed $512
      house: { low: 500, high: 700 },             // BuyWise $500–$700; Point $440–$700; iSPECT $534
      large: { low: exGst(515), high: 950, open: true }, // iSPECT 5+ bed $567; BuyWise $700–$950+
    },
    buildingOnly: { low: 250, high: 830, open: true }, // Inscope apartment $250–$290, house $500–$550, large or older $830+; Point apartment $280–$420, house $400–$600; iSPECT from $435
    pestOnly: null,
    note: "No Melbourne source read publishes a pest-only price; Inscope says adding the pest inspection to a building inspection costs $100 to $200.",
    sources: [
      { label: "BuyWise Inspections, Building and pest inspection cost Melbourne", href: "https://www.buywiseinspections.com.au/building-and-pest-inspection-cost-melbourne/", note: "published 14 Oct 2025, updated 28 Aug 2026; GST basis not stated" },
      { label: "iSPECT Melbourne, building and pest inspection prices", href: "https://melbourne.ispect.com.au/vic/melbourne/building-and-pest-inspection", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
      { label: "Point Building Inspections, Building inspection cost Melbourne 2026", href: "https://www.pointbuildinginspections.com.au/how-much-does-a-building-inspection-in-melbourne-cost-in-2026/", note: "2026; prices include GST" },
      { label: "Inscope Inspections, How much does a building inspector cost in Melbourne (2026)", href: "https://inscopeinspections.com.au/how-much-does-a-building-inspector-cost-in-melbourne/", note: "2026; GST basis not stated" },
    ],
  },
  {
    city: "Brisbane",
    state: "QLD",
    combined: {
      unit: { low: 475, high: 600 },              // Rapid 1–2 bed apartment $475–$600; Inspect My Home $480; QLD Build Check from $480; iSPECT $495
      small: { low: 535, high: exGst(490) },      // Inspect My Home up to 2 bed $535; iSPECT 1–2 bed $539
      house: { low: 550, high: 750 },             // Rapid 3-bed house $550–$750; Inspect My Home $550–$560; iSPECT 3–4 bed $605
      large: { low: exGst(590), high: 900, open: true }, // iSPECT 5+ bed $649; Rapid 5-bed $650–$850, older character home $750–$900+
    },
    buildingOnly: { low: 330, high: exGst(550) }, // Inspect My Home from $330; QLD Build Check units $420; iSPECT $462–$605
    pestOnly: { low: exGst(450), high: exGst(550), single: true }, // iSPECT only
    note: "Only iSPECT publishes a pest-only price for Brisbane. Rapid prices an older character home at $750 to $900 or more.",
    sources: [
      { label: "iSPECT Brisbane, building inspection cost table", href: "https://brisbane.ispect.com.au/building-inspection-cost", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
      { label: "Rapid Building Inspections, Building and pest inspection Brisbane cost guide 2026", href: "https://www.rapidbuildinginspections.com.au/news/building-and-pest-inspection-brisbane-cost.html", note: "published 12 Aug 2026; GST basis not stated" },
      { label: "Inspect My Home, How much does a building and pest inspection cost in Brisbane", href: "https://www.inspectmyhome.com.au/how-much-does-a-building-and-pest-inspection-cost-in-brisbane.html", note: "read 30 Sep 2026; prices include GST" },
      { label: "QLD Build Check, property inspection fees", href: "https://www.qldbuildcheck.com.au/property-inspection-fees", note: "read 30 Sep 2026; prices include GST" },
    ],
  },
  {
    city: "Perth",
    state: "WA",
    combined: {
      unit: { low: 420, high: exGst(499) },       // Inspect My Home apartment $420; WA Building Inspections fixed $549
      small: { low: 440, high: exGst(499) },      // Inspect My Home 2 bed 1 bath $440; WA Building Inspections $549
      house: { low: 480, high: 1_090 },           // Inspect My Home 3x1 $480 to 4x2 $530; WA Building Inspections $549; Bestwest $790–$1,090
      large: { low: exGst(499), high: 1_090, open: true }, // WA Building Inspections $549 plus $98 per shed or granny flat; Bestwest top of range for large two-storey homes
    },
    buildingOnly: { low: exGst(249), high: 895 },  // WA Building Inspections basic $274, comprehensive $384; Inspect My Home from $395; Bestwest $595–$895
    pestOnly: { low: exGst(249), high: 295, open: true }, // WA Building Inspections $274; Inspect My Home from $295
    note: "Perth has the widest published spread: a fixed-price operator at $549 and a premium firm at $790 to $1,090 for the same combined inspection.",
    sources: [
      { label: "WA Building Inspections, building inspections Perth costs and services", href: "https://wabuildinginspections.com.au/building-inspections-perth-costs-services/", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
      { label: "Inspect My Home, building and pest inspections Perth", href: "https://www.inspectmyhome.com.au/building-pest-inspections-perth.html", note: "read 30 Sep 2026; prices include GST" },
      { label: "Bestwest Building, How much does a building inspection cost in Perth (2026)", href: "https://www.bestwestbuilding.com.au/blog/building-inspection-cost-perth/", note: "published 22 Mar 2026; GST basis not stated" },
    ],
  },
  {
    city: "Adelaide",
    state: "SA",
    combined: {
      // No Adelaide source splits the combined price by property type: Pest
      // Inspections Adelaide gives $330–$550 for every property, A E & J
      // charges $638 for a house or a unit, and Rapid's $450–$1,000 runs to
      // $1,000 for large, heritage or multi-storey homes.
      unit: { low: 330, high: 638 },
      small: { low: 330, high: 638 },
      house: { low: 330, high: 638 },
      large: { low: 638, high: 1_000 },
    },
    buildingOnly: { low: 300, high: 700 },        // Pest Inspections Adelaide $300–$500; A E & J $440; Rapid $400–$700
    pestOnly: { low: 200, high: 550 },            // Pest Inspections Adelaide $200–$350; A E & J $330; Rapid $300–$550
    note: "No Adelaide source splits the combined price by bedrooms: A E & J charges $638 for a house or a unit, and the guides give one range each. Pre-1990 homes add $50 to $150 (Pest Inspections Adelaide).",
    sources: [
      { label: "Rapid Building Inspections, Building and pest inspection Adelaide cost guide 2026", href: "https://www.rapidbuildinginspections.com.au/news/building-and-pest-inspection-adelaide-cost.html", note: "published 7 Aug 2026; GST basis not stated" },
      { label: "Pest Inspections Adelaide, Building and pest inspection cost in Adelaide (2026 guide)", href: "https://pestinspectionsadelaide.com.au/blog/building-and-pest-inspection-cost-adelaide", note: "2026; GST basis not stated" },
      { label: "A E & J Building Inspections Adelaide, prices", href: "https://aejbuildinginspections.com.au/prices/", note: "read 30 Sep 2026; GST basis not stated" },
    ],
  },
  {
    city: "Hobart",
    state: "TAS",
    combined: {
      unit: { low: exGst(425), high: exGst(425), single: true },   // iSPECT apartment
      small: { low: exGst(465), high: exGst(465), single: true },  // iSPECT 1–2 bed
      house: { low: exGst(485), high: exGst(485), single: true },  // iSPECT 3–4 bed
      large: { low: exGst(515), high: exGst(515), single: true },  // iSPECT 5+ bed
    },
    buildingOnly: { low: exGst(395), high: 968 }, // iSPECT $435–$534; Swell 1-bed unit $550 to 5-bed $968; Hobart Building Inspection unit $750, house from $825
    pestOnly: null,
    note: "Only iSPECT publishes a combined price for Hobart. The two local firms price building inspections only: Swell includes a visual pest check in its building inspection and Hobart Building Inspection publishes no pest price.",
    sources: [
      { label: "iSPECT Hobart, building inspection prices", href: "https://hobart.ispect.com.au/tas/hobart/building-inspection", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
      { label: "Swell Building Inspections, Building inspection costs in Hobart: 2026 pricing guide", href: "https://swellbuildinginspections.com.au/building-inspection-costs-in-hobart-tasmania-your-2026-pricing-guide/", note: "published 18 May 2026; prices include GST" },
      { label: "Hobart Building Inspection, How much does a building inspection cost in Hobart", href: "https://hobartbuildinginspection.com.au/how-much-does-a-building-inspection-cost-in-hobart-2025-guide/", note: "published 25 Oct 2025, updated 25 Aug 2026; prices include GST" },
    ],
  },
  {
    city: "Canberra",
    state: "ACT",
    combined: {
      unit: { low: exGst(425), high: exGst(425), single: true }, // iSPECT apartment $468
      small: { low: exGst(465), high: exGst(465), single: true }, // iSPECT 1–2 bed $512
      house: { low: exGst(485), high: exGst(897) },  // iSPECT 3–4 bed $534; ACTBIS building, pest and compliance $950; My Canberra building and timber pest package $987 for an average house
      large: { low: exGst(515), high: exGst(997) },  // iSPECT 5+ bed $567; My Canberra adds $100 ex GST for 4+ bedrooms or multiple storeys
    },
    buildingOnly: { low: exGst(395), high: exGst(547) }, // iSPECT $435–$534; ACTBIS $550; My Canberra $602
    pestOnly: { low: 400, high: exGst(485) },            // ACTBIS $400; iSPECT $468–$534
    note: "Only iSPECT prices a Canberra unit or small home. The seller commissions the building, compliance and pest reports before listing and the buyer reimburses them at completion, so most Canberra price lists are vendor packages: ACTBIS $1,790 and My Canberra $1,697 plus GST for building, pest, compliance and energy rating.",
    sources: [
      { label: "iSPECT Canberra, building and pest inspection cost", href: "https://canberra.ispect.com.au/act/canberra/building-inspection-cost", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
      { label: "ACTBIS Building Inspections Canberra, prices", href: "https://www.actbis.com.au/index.php/prices", note: "read 30 Sep 2026; GST basis not stated" },
      { label: "My Canberra Building Inspections, inspection prices", href: "https://canberrabuildinginspectionsact.com.au/prices/", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
    ],
  },
  {
    city: "Darwin",
    state: "NT",
    combined: {
      unit: { low: exGst(400), high: exGst(425) },   // APBI NT from $440; iSPECT apartment $468
      small: { low: exGst(400), high: exGst(465) },  // APBI from $440; iSPECT 1–2 bed $512
      house: { low: exGst(400), high: 775 },         // APBI from $440; iSPECT 3–4 bed $534; Independent Property Inspectors $775
      large: { low: exGst(515), high: 775 },         // iSPECT 5+ bed $567; Independent Property Inspectors $775 flat
    },
    buildingOnly: { low: exGst(370), high: exGst(485) }, // APBI from $407; iSPECT $435–$534
    pestOnly: { low: 300, high: exGst(485) },            // Independent Property Inspectors $300; iSPECT $468–$534
    note: "Darwin's local firm prices a plan, not a property type: $775 for building and pest, $2,175 with plumbing and electrical. The national operators price by bedrooms.",
    sources: [
      { label: "iSPECT Darwin, building and pest inspection cost", href: "https://darwin.ispect.com.au/nt/darwin/building-inspection-cost", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
      { label: "Independent Property Inspectors Darwin, price list", href: "https://www.ipidarwin.com.au/price-list", note: "read 30 Sep 2026; prices include GST" },
      { label: "APBI, Northern Territory inspection prices", href: "https://apbi.com.au/locations/nt", note: "read 30 Sep 2026; prices ex GST, 10% added here" },
    ],
  },
];

const dollars = (n: number) => `$${n.toLocaleString("en-AU")}`;

/**
 * Table cells: "$395–$520", "$567–$695+", "$468*" (one source). Prose:
 * "$395 to $520", "$567 to $695 or more", no asterisk.
 */
export function formatCostRange(r: CostRange, style: "cell" | "prose" = "cell"): string {
  if (style === "prose") {
    const more = r.open ? " or more" : "";
    return r.low === r.high ? `${dollars(r.low)}${more}` : `${dollars(r.low)} to ${dollars(r.high)}${more}`;
  }
  const star = r.single ? "*" : "";
  if (r.low === r.high) return `${dollars(r.low)}${r.open ? "+" : ""}${star}`;
  return `${dollars(r.low)}–${dollars(r.high)}${r.open ? "+" : ""}${star}`;
}

/** The city whose cell holds the lowest low and the one with the highest high. */
export function extremes(pick: (c: CityInspectionCosts) => CostRange | null): { cheapest: string; dearest: string } {
  let cheapest = "";
  let dearest = "";
  let low = Number.POSITIVE_INFINITY;
  let high = 0;
  for (const c of INSPECTION_COSTS) {
    const r = pick(c);
    if (!r) continue;
    if (r.low < low) { low = r.low; cheapest = c.city; }
    if (r.high > high) { high = r.high; dearest = c.city; }
  }
  return { cheapest, dearest };
}

/** The lowest low and highest high of one cell across the named cities. */
export function spanAcross(cities: readonly string[], pick: (c: CityInspectionCosts) => CostRange | null): CostRange {
  let low = Number.POSITIVE_INFINITY;
  let high = 0;
  let open = false;
  for (const c of INSPECTION_COSTS) {
    if (!cities.includes(c.city)) continue;
    const r = pick(c);
    if (!r) continue;
    low = Math.min(low, r.low);
    // "or more" only when the range that sets the top is itself open-ended.
    if (r.high > high) { high = r.high; open = Boolean(r.open); }
    else if (r.high === high) open = open || Boolean(r.open);
  }
  return { low, high, open };
}

export const ALL_CITIES = INSPECTION_COSTS.map((c) => c.city);
export const BIG_THREE = ["Sydney", "Melbourne", "Brisbane"] as const;

export function cityCosts(city: string): CityInspectionCosts {
  const c = INSPECTION_COSTS.find((x) => x.city === city);
  if (!c) throw new Error(`No inspection costs for ${city}`);
  return c;
}

export interface InspectionFaq {
  question: string;
  answer: string;
}

const melb = cityCosts("Melbourne");
const bris = cityCosts("Brisbane");
export const HOUSE_ALL = spanAcross(ALL_CITIES, (c) => c.combined.house);
export const HOUSE_BIG_THREE = spanAcross(BIG_THREE, (c) => c.combined.house);
export const UNIT_ALL = spanAcross(ALL_CITIES, (c) => c.combined.unit);
export const LARGE_ALL = spanAcross(ALL_CITIES, (c) => c.combined.large);
export const BUILDING_ALL = spanAcross(ALL_CITIES, (c) => c.buildingOnly);
export const PEST_ALL = spanAcross(ALL_CITIES, (c) => c.pestOnly);
const houseEnds = extremes((c) => c.combined.house);
const prose = (r: CostRange) => formatCostRange(r, "prose");

/**
 * The FAQ block, built from the same figures as the table so the two cannot
 * drift. The first four answer the People Also Ask questions on the
 * "building and pest inspection cost" SERP (serp-summary.csv, 30 Sep 2026).
 */
export const INSPECTION_FAQS: readonly InspectionFaq[] = [
  {
    question: "How much does a building and pest inspection cost in Australia?",
    answer:
      `Across the eight capital cities, the prices inspectors publish put a combined building and pest inspection on a standard three or four bedroom house at ${prose(HOUSE_ALL)} including GST, from the cheapest published figure in ${houseEnds.cheapest} to the dearest in ${houseEnds.dearest}. A unit or apartment runs ${prose(UNIT_ALL)}, and a large, multi-storey, older or rural home ${prose(LARGE_ALL)}. Building-only inspections are published at ${prose(BUILDING_ALL)} and pest-only at ${prose(PEST_ALL)}. The city table on this page gives every figure with the inspector or price guide it comes from and its date (read 30 September 2026).`,
  },
  {
    question: "How much does a building and pest inspection cost in Victoria?",
    answer:
      `In Melbourne a combined building and pest inspection costs about ${prose(melb.combined.unit)} for a unit, ${prose(melb.combined.house)} for a three or four bedroom house and ${prose(melb.combined.large)} for a large, older or complex home (BuyWise Inspections price guide, updated 28 August 2026; iSPECT Melbourne charges $485 plus GST for a three to four bedroom house). Building-only inspections run ${prose(melb.buildingOnly!)} (Point Building Inspections and Inscope Inspections, 2026), and outside the metro area a travel fee can apply. The buyer pays today: the Victorian Government's 12 March 2026 announcement that sellers would commission the reports is a proposal for legislation in 2027, and nothing has changed yet.`,
  },
  {
    question: "Who pays for building and pest inspection in QLD?",
    answer:
      `The buyer. Under the REIQ standard contract it is the buyer's obligation to organise the building and pest inspection with a licensed inspector and bear the cost (Statewide Legal, 10 September 2018), and the buyer must tell the seller by the date written in the contract whether the reports are satisfactory. If they are not, the buyer's contractual right is to terminate, acting reasonably; a price reduction or repairs is a negotiation, not a right (Preston Law, 13 November 2024). The inspector must hold a QBCC licence (Queensland Government, Inspections, 22 August 2024). In Brisbane expect ${prose(bris.combined.unit)} for a unit and ${prose(bris.combined.house)} for a house (Rapid Building Inspections, 12 August 2026).\n\nThe ACT is the exception: the seller must obtain the building and compliance report and the pest report before the property is listed, and the buyer reimburses their cost at completion (Civil Law (Sale of Residential Property) Act 2003 (ACT), sections 9 and 18).`,
  },
  {
    question: "Can you claim building and pest inspection cost?",
    answer:
      "Not as a deduction. The ATO's rental expenses guide (last updated 29 May 2025) lists acquisition and disposal costs of the property among the expenses you cannot claim, and a pre-purchase inspection is an acquisition cost. It goes into the cost base instead: the ATO's cost base page (last updated 29 June 2026) makes incidental costs of acquiring an asset, including payments for the services of a surveyor, valuer or consultant, the second of the cost base's five elements, and tax advisers treat a building and pest inspection on a property you then buy as one of them (Duotax, 21 May 2026). On an investment property the fee therefore reduces the capital gain when you sell. On your own home the main residence exemption usually means there is no gain to reduce, and an inspection on a property you did not buy attaches to no asset, so it cannot be claimed at all. A $600 inspection on an investment purchase is a $600 smaller gain at sale, not a $600 refund.",
  },
  {
    question: "Do I need an inspection if I'm buying a new home?",
    answer:
      "Yes. New homes commonly have incomplete waterproofing, missing insulation, drainage issues, settling cracks, or rectification items missed at handover. Engage a pre-handover inspector to attend the builder's final inspection with you, defects on their list become the builder's obligation to fix before you take possession. New builds also have statutory warranties (6 years structural, 2 years non-structural in most states). Inspectors price handover inspections separately: iSPECT charges $465 to $525 plus GST by bedroom count, WA Building Inspections $499 plus GST.",
  },
  {
    question: "Can I get an inspection before making an offer?",
    answer:
      "Yes, and many experienced buyers do. You pay for the inspection upfront on a property you may not buy, but you negotiate from a position of full knowledge and can avoid lengthy conditional periods. For auction purchases this is mandatory, the inspection must happen before auction day. Inscope Inspections (2026) reports Melbourne buyers spending up to $4,200 across several inspections during a search, which is the cost of losing at auction more than once.",
  },
  {
    question: "What's the difference between major and minor defects?",
    answer:
      "Major defects require significant remediation and often cost thousands of dollars to fix (active termite damage, rising damp, foundation cracks, roof failure). Minor defects are normal wear and tear or small maintenance items (sticking doors, hairline plaster cracks, worn carpet). Reports must disclose major defects clearly; minor items are listed for completeness.",
  },
  {
    question: "Can I use the inspection to negotiate a lower price?",
    answer:
      "Yes, and you should. If defects are found, get repair quotes from licensed tradespeople (not verbal estimates), then negotiate a price reduction equal to the cost of repairs. The vendor may agree to a price reduction, fix the defects before settlement, or refuse to negotiate (in which case, depending on your contract conditions, you may be able to walk away). In Queensland the REIQ contract gives the buyer a right to terminate, not a right to a discount, so any reduction is a negotiation on top of that right.",
  },
  {
    question: "Should I trust an inspector recommended by the real estate agent?",
    answer:
      "No. The agent works for the vendor and has an interest in the sale completing quickly with minimal complications. An inspector with an ongoing referral relationship may be unwilling to flag issues that could derail a sale. Always engage your own independent inspector with professional indemnity insurance.",
  },
];
