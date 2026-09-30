// Conveyancing professional fees and disbursements by state (commercial
// intent review 30 Sep 2026, section 3.7). Every figure names its source and
// date. Professional fees are the ranges published by fee guides and the
// fixed fees law firms and conveyancers publish, read on 30 September 2026;
// statutory fees are the 2026/27 schedules of the land registries and PEXA
// (1 July 2026). The engine in src/lib/conveyancing-costs.ts reads this
// file; the guide's state sections quote it.
import type { StateCode } from "@/lib/data/commission-rates";

export type ConveyancingSide = "buy" | "sell";

export interface FeeRange {
  low: number;
  high: number;
}

export interface FeeSource {
  label: string;
  href: string;
  /** Publication or read date. */
  note: string;
}

export interface StateConveyancingFees {
  state: StateCode;
  /** Professional fee, GST included, for a standard residential purchase. */
  buy: FeeRange;
  /** Professional fee, GST included, for a standard residential sale. */
  sell: FeeRange;
  /** Who does the work there, as the sources describe it. */
  practitioner: string;
  /** A published state average, where one exists. */
  average?: { amount: number; source: string };
  /** One line naming where the range comes from. */
  source: string;
}

/**
 * When a disbursement applies. "always" lines are summed into the estimate;
 * "mortgage" and "strata" lines are shown as additions because the estimator
 * asks only for state, side and price.
 */
export type DisbursementWhen = "always" | "mortgage" | "strata";

export interface DisbursementLine {
  key: string;
  label: string;
  low: number;
  high: number;
  when: DisbursementWhen;
  source: string;
}

// Statutory fees, 2026/27 (from 1 July 2026). Cents kept: these are exact.
/** NSW LRS regulated fee per dealing (transfer, mortgage, discharge), incl. GST, 2026/27. */
export const NSW_LRS_DEALING_FEE = 182.73;
/** NSW LRS title search, over the counter, incl. GST, 2026/27. */
export const NSW_TITLE_SEARCH = 18.7;
/** PEXA transfer with financial settlement, single title, incl. GST, from 1 July 2026 (NSW, VIC, QLD). */
export const PEXA_TRANSFER = 146.3;
export const PEXA_MORTGAGE: Record<"NSW" | "VIC" | "QLD", number> = { NSW: 73.04, VIC: 55.99, QLD: 55.99 };
export const PEXA_DISCHARGE: Record<"NSW" | "VIC" | "QLD", number> = { NSW: 54.01, VIC: 27.39, QLD: 27.39 };
/** Land Use Victoria electronic transfer: base plus per whole $1,000, capped, 2026/27. */
export const VIC_TRANSFER = { base: 104.3, perThousand: 2.34, cap: 3_614 };
/** Land Use Victoria mortgage registration, electronic, 2026/27. */
export const VIC_MORTGAGE_FEE = 129.2;
/** Titles Queensland: transfer lodgement base to $180,000, then per $10,000 or part, FY2026/27. */
export const QLD_TRANSFER = { base: 248.04, threshold: 180_000, perTenThousand: 46.56 };
/** Titles Queensland: any other instrument (a mortgage, a release of mortgage), FY2026/27. */
export const QLD_INSTRUMENT_FEE = 248.04;
/** Titles Queensland title search, FY2026/27. */
export const QLD_TITLE_SEARCH = 25.71;
/** Sydney Water section 66 conveyancing certificate, 2026-27. */
export const SYDNEY_WATER_S66 = 9.81;
/** Sydney Water sewerage service diagram: Property Link broker to Tap in, 2026-27. */
export const SYDNEY_WATER_DIAGRAM = { low: 18.75, high: 33.67 };

export const CONVEYANCING_FEES: Record<StateCode, StateConveyancingFees> = {
  NSW: {
    state: "NSW",
    buy: { low: 1_000, high: 2_500 },
    sell: { low: 1_000, high: 2_500 },
    practitioner: "Licensed conveyancer or solicitor",
    average: { amount: 1_650, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "Our Top 10 conveyancing fees guide, updated 27 Sep 2026 (licensed conveyancer $1,000 to $2,500, solicitor $1,500 to $3,200, one range for buying and selling); Jameson Law, 15 Mar 2026 ($1,200 to $2,500 for a standard purchase)",
  },
  VIC: {
    state: "VIC",
    buy: { low: 900, high: 1_500 },
    sell: { low: 800, high: 1_300 },
    practitioner: "Licensed conveyancer or solicitor",
    average: { amount: 1_280, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "All Conveyancing Australia, 21 Jul 2026 (buyers $900 to $1,500; sellers $800 to $1,300); Conveyancing Explained, 13 Jul 2026 ($880 to $2,200); Keylaw fixed fees $1,290 buying and $990 selling, 17 Sep 2026",
  },
  QLD: {
    state: "QLD",
    buy: { low: 885, high: 2_600 },
    sell: { low: 619, high: 1_600 },
    practitioner: "Solicitors only (Queensland does not license conveyancers)",
    average: { amount: 1_050, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "Keylaw fixed fees $885 buying and $619 selling, outlays extra, 17 Sep 2026; River City Conveyancing $1,400 buying plus searches and $1,100 selling, 2026; Empire Legal $2,600 buying and $1,600 selling with every standard search included, 28 Apr 2026",
  },
  WA: {
    state: "WA",
    buy: { low: 700, high: 1_600 },
    sell: { low: 700, high: 1_600 },
    practitioner: "Licensed settlement agent or solicitor",
    average: { amount: 1_410, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "ConveyancerCompare, settlement agent costs WA 2026 ($700 to $1,500, rates current for 2025-26); Our Top 10, 27 Sep 2026 ($700 to $1,600 for WA and SA)",
  },
  SA: {
    state: "SA",
    buy: { low: 700, high: 1_600 },
    sell: { low: 700, high: 1_600 },
    practitioner: "Licensed conveyancer or solicitor",
    average: { amount: 1_270, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "Our Top 10 conveyancing fees guide, updated 27 Sep 2026 ($700 to $1,600 for WA and SA)",
  },
  TAS: {
    state: "TAS",
    buy: { low: 700, high: 1_600 },
    sell: { low: 700, high: 1_600 },
    practitioner: "Licensed conveyancer or solicitor",
    average: { amount: 1_280, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "Our Top 10 conveyancing fees guide, updated 27 Sep 2026 (Tasmania in line with WA and SA at $700 to $1,600)",
  },
  ACT: {
    state: "ACT",
    buy: { low: 1_800, high: 3_000 },
    sell: { low: 1_800, high: 3_000 },
    practitioner: "Mostly solicitors (Our Top 10 lists ACT conveyancing as solicitor work)",
    average: { amount: 1_570, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "Our Top 10 conveyancing fees guide, updated 27 Sep 2026 ($1,800 to $3,000, solicitors only); Ray Swift Moutrage, $1,700 plus GST for a standard ACT purchase or sale, read 30 Sep 2026",
  },
  NT: {
    state: "NT",
    buy: { low: 1_490, high: 2_680 },
    sell: { low: 1_490, high: 2_580 },
    practitioner: "Licensed conveyancer or solicitor",
    average: { amount: 1_875, source: "OpenAgent conveyancer cost guide, updated 17 Sep 2026" },
    source: "Keylaw fixed fee $1,490 buying or selling, 17 Sep 2026; Voeux Conveyancing from $2,680 buying and $2,580 selling, read 30 Sep 2026",
  },
};

const NSW_PLANNING = "Environmental Planning and Assessment Regulation 2021 maximum for 2026/27 ($74 for a 10.7(2) certificate); City of Sydney charges $73, or $185 with the 10.7(5) advice, 2 Jul 2026";
const OURTOP10_DISB = "Our Top 10, 27 Sep 2026 (disbursements $300 to $800 buying, $100 to $400 selling)";
const ACA_VIC = "All Conveyancing Australia, 21 Jul 2026";
const EMPIRE = "Empire Legal, 28 Apr 2026";
const PEXA_NOTE = "PEXA pricing from 1 July 2026";
const NSWLRS_NOTE = "NSW LRS customer fees from 1 July 2026";
const TITLESQLD_NOTE = "Titles Queensland fees FY2026/27";
const LUV_NOTE = "All Conveyancing Australia, 28 Aug 2026 (Land Use Victoria 2026/27 schedule)";

/**
 * The price-independent disbursements the estimator lists. Price-dependent
 * registration fees (VIC and QLD transfers) are computed by the engine.
 */
export const STATE_DISBURSEMENTS: Record<StateCode, Record<ConveyancingSide, DisbursementLine[]>> = {
  NSW: {
    buy: [
      { key: "title", label: "Title search (NSW LRS)", low: NSW_TITLE_SEARCH, high: NSW_TITLE_SEARCH, when: "always", source: NSWLRS_NOTE },
      { key: "rates", label: "Council rates certificate (section 603)", low: 105, high: 105, when: "always", source: "City of Sydney, $105, page updated 2 Jul 2026 (other councils set their own fee)" },
      { key: "water", label: "Sydney Water conveyancing certificate (section 66)", low: SYDNEY_WATER_S66, high: SYDNEY_WATER_S66, when: "always", source: "Sydney Water other prices, 2026-27" },
      { key: "pexa", label: "PEXA settlement fee (transfer)", low: PEXA_TRANSFER, high: PEXA_TRANSFER, when: "always", source: PEXA_NOTE },
      { key: "registration", label: "Transfer registration (NSW LRS)", low: NSW_LRS_DEALING_FEE, high: NSW_LRS_DEALING_FEE, when: "always", source: NSWLRS_NOTE },
      { key: "mortgage-reg", label: "Mortgage registration (NSW LRS)", low: NSW_LRS_DEALING_FEE, high: NSW_LRS_DEALING_FEE, when: "mortgage", source: NSWLRS_NOTE },
      { key: "mortgage-pexa", label: "PEXA mortgage fee", low: PEXA_MORTGAGE.NSW, high: PEXA_MORTGAGE.NSW, when: "mortgage", source: PEXA_NOTE },
      { key: "strata", label: "Strata inspection report", low: 350, high: 450, when: "strata", source: "Westla, conveyancing costs NSW 2026" },
    ],
    sell: [
      { key: "title", label: "Title search for the contract (NSW LRS)", low: NSW_TITLE_SEARCH, high: NSW_TITLE_SEARCH, when: "always", source: NSWLRS_NOTE },
      { key: "planning", label: "Section 10.7 planning certificate for the contract", low: 73, high: 185, when: "always", source: NSW_PLANNING },
      { key: "diagram", label: "Sewerage service diagram for the contract", low: SYDNEY_WATER_DIAGRAM.low, high: SYDNEY_WATER_DIAGRAM.high, when: "always", source: "Sydney Water other prices, 2026-27 (Property Link broker $18.75, Tap in $33.67)" },
      { key: "discharge-reg", label: "Discharge of mortgage registration (NSW LRS)", low: NSW_LRS_DEALING_FEE, high: NSW_LRS_DEALING_FEE, when: "mortgage", source: NSWLRS_NOTE },
      { key: "discharge-pexa", label: "PEXA discharge fee", low: PEXA_DISCHARGE.NSW, high: PEXA_DISCHARGE.NSW, when: "mortgage", source: PEXA_NOTE },
    ],
  },
  VIC: {
    buy: [
      { key: "title", label: "Title search", low: 30, high: 50, when: "always", source: ACA_VIC },
      { key: "searches", label: "Council, water, land tax, VCAT and bankruptcy searches", low: 120, high: 235, when: "always", source: `${ACA_VIC} (council $40 to $80, water $20 to $40, land tax clearance $30 to $60, VCAT $15 to $30, bankruptcy $15 to $25)` },
      { key: "pexa", label: "PEXA settlement fee (transfer)", low: PEXA_TRANSFER, high: PEXA_TRANSFER, when: "always", source: PEXA_NOTE },
      { key: "mortgage-reg", label: "Mortgage registration (Land Use Victoria)", low: VIC_MORTGAGE_FEE, high: VIC_MORTGAGE_FEE, when: "mortgage", source: LUV_NOTE },
      { key: "mortgage-pexa", label: "PEXA mortgage fee", low: PEXA_MORTGAGE.VIC, high: PEXA_MORTGAGE.VIC, when: "mortgage", source: PEXA_NOTE },
      { key: "strata", label: "Owners corporation certificate", low: 80, high: 400, when: "strata", source: ACA_VIC },
    ],
    sell: [
      { key: "title", label: "Title search", low: 30, high: 50, when: "always", source: ACA_VIC },
      { key: "s32", label: "Section 32 certificates (council, water, land tax)", low: 90, high: 180, when: "always", source: `${ACA_VIC} (council $40 to $80, water $20 to $40, land tax clearance $30 to $60)` },
      { key: "discharge-pexa", label: "PEXA discharge fee (the registry's discharge fee is extra)", low: PEXA_DISCHARGE.VIC, high: PEXA_DISCHARGE.VIC, when: "mortgage", source: PEXA_NOTE },
      { key: "strata", label: "Owners corporation certificate", low: 80, high: 400, when: "strata", source: ACA_VIC },
    ],
  },
  QLD: {
    buy: [
      { key: "title", label: "Title search (Titles Queensland)", low: QLD_TITLE_SEARCH, high: QLD_TITLE_SEARCH, when: "always", source: TITLESQLD_NOTE },
      { key: "rates", label: "Council rates search", low: 100, high: 300, when: "always", source: EMPIRE },
      { key: "water", label: "Water search", low: 40, high: 100, when: "always", source: EMPIRE },
      { key: "landtax", label: "Land tax clearance", low: 50, high: 50, when: "always", source: EMPIRE },
      { key: "pexa", label: "PEXA settlement fee (transfer)", low: PEXA_TRANSFER, high: PEXA_TRANSFER, when: "always", source: PEXA_NOTE },
      { key: "mortgage-reg", label: "Mortgage lodgement (Titles Queensland)", low: QLD_INSTRUMENT_FEE, high: QLD_INSTRUMENT_FEE, when: "mortgage", source: TITLESQLD_NOTE },
      { key: "mortgage-pexa", label: "PEXA mortgage fee", low: PEXA_MORTGAGE.QLD, high: PEXA_MORTGAGE.QLD, when: "mortgage", source: PEXA_NOTE },
    ],
    sell: [
      { key: "title", label: "Title search (Titles Queensland)", low: QLD_TITLE_SEARCH, high: QLD_TITLE_SEARCH, when: "always", source: TITLESQLD_NOTE },
      { key: "searches", label: "Contract searches and certificates", low: 100, high: 400, when: "always", source: OURTOP10_DISB },
      { key: "release-reg", label: "Release of mortgage lodgement (Titles Queensland)", low: QLD_INSTRUMENT_FEE, high: QLD_INSTRUMENT_FEE, when: "mortgage", source: TITLESQLD_NOTE },
      { key: "release-pexa", label: "PEXA discharge fee", low: PEXA_DISCHARGE.QLD, high: PEXA_DISCHARGE.QLD, when: "mortgage", source: PEXA_NOTE },
    ],
  },
  WA: {
    buy: [
      { key: "searches", label: "Searches, certificates and PEXA", low: 200, high: 600, when: "always", source: "ConveyancerCompare, settlement agent costs WA 2026 (disbursements $200 to $600, including Landgate registration of about $180 to $320)" },
    ],
    sell: [
      { key: "searches", label: "Searches and certificates", low: 100, high: 400, when: "always", source: OURTOP10_DISB },
    ],
  },
  SA: {
    buy: [{ key: "searches", label: "Searches, certificates, registration and PEXA", low: 300, high: 800, when: "always", source: OURTOP10_DISB }],
    sell: [{ key: "searches", label: "Searches and certificates (Form 1)", low: 100, high: 400, when: "always", source: OURTOP10_DISB }],
  },
  TAS: {
    buy: [{ key: "searches", label: "Searches, certificates, registration and PEXA", low: 300, high: 800, when: "always", source: OURTOP10_DISB }],
    sell: [{ key: "searches", label: "Searches and certificates", low: 100, high: 400, when: "always", source: OURTOP10_DISB }],
  },
  ACT: {
    buy: [{ key: "searches", label: "Searches, certificates, registration and PEXA", low: 300, high: 800, when: "always", source: OURTOP10_DISB }],
    sell: [{ key: "searches", label: "Searches and certificates", low: 100, high: 400, when: "always", source: OURTOP10_DISB }],
  },
  NT: {
    buy: [{ key: "searches", label: "Searches, certificates, registration and PEXA", low: 300, high: 800, when: "always", source: OURTOP10_DISB }],
    sell: [{ key: "searches", label: "Searches and certificates", low: 100, high: 400, when: "always", source: OURTOP10_DISB }],
  },
};

/** The Sources block on the conveyancing guide. */
export const CONVEYANCING_SOURCES: readonly FeeSource[] = [
  { label: "NSW Land Registry Services, customer fees from 1 July 2026 (transfer, mortgage and discharge $182.73 incl. GST; title search $18.70)", href: "https://nswlrs.com.au/assets/f/1129775276948026/x/5fed3e7cd6/2026-2027_nsw-lrs-fees_final.pdf", note: "2026/27 schedule" },
  { label: "PEXA pricing for NSW, Victoria and Queensland from 1 July 2026 (transfer $146.30; mortgage $73.04 NSW, $55.99 VIC and QLD; discharge $54.01 NSW, $27.39 VIC and QLD)", href: "https://www.pexa.com.au/pricing/nsw/", note: "from 1 Jul 2026 (FY27 schedule, CPI adjusted 4.1%)" },
  { label: "Queensland Titles Registry, fees FY2026/27 (transfer $248.04 plus $46.56 per $10,000 or part over $180,000; other instruments $248.04; title search $25.71)", href: "https://www.titlesqld.com.au/wp-content/uploads/2026/05/Titles-Registry-Fees_FY-2026-to-2027.pdf", note: "from 1 July 2026" },
  { label: "All Conveyancing Australia, Land registration fees Victoria 2026-27 (electronic transfer $104.30 plus $2.34 per whole $1,000, capped at $3,614; mortgage $129.20)", href: "https://allconveyancingaustralia.com.au/land-registration-fees-victoria/", note: "28 Aug 2026; Land Use Victoria's own fee page blocks automated reading, so this secondary source is cited" },
  { label: "Sydney Water, other prices 2026-27 (section 66 conveyancing certificate $9.81; sewerage service diagram $33.67 through Tap in, $18.75 through a Property Link broker)", href: "https://www.sydneywater.com.au/accounts-billing/paying-your-bill/our-prices/other-prices.html", note: "charges from 1 Jul 2026" },
  { label: "City of Sydney, planning and rates certificates (10.7(2) $73; 10.7(2) and (5) $185; section 603 rates certificate $105)", href: "https://www.cityofsydney.nsw.gov.au/development-applications/apply-property-certificate-planning-rates", note: "page updated 2 Jul 2026; the EP&A Regulation 2021 caps the 10.7(2) fee at $74 for 2026/27" },
  { label: "NCAT, conveyancing costs (disputes about a licensed conveyancer's bill, within 60 days)", href: "https://ncat.nsw.gov.au/case-types/consumers-and-businesses/conveyancing-costs.html", note: "read 30 Sep 2026" },
  { label: "Our Top 10, How much does conveyancing cost in 2026? Fees for every state", href: "https://ourtop10.com.au/blog/conveyancing-fees/", note: "April 2026, updated 27 Sep 2026" },
  { label: "OpenAgent, How much does a conveyancer cost (state averages: NSW $1,650, VIC $1,280, QLD $1,050, WA $1,410, SA $1,270, TAS $1,280, ACT $1,570, NT $1,875)", href: "https://www.openagent.com.au/blog/how-much-conveyancer-cost", note: "updated 17 Sep 2026" },
  { label: "Jameson Law, Conveyancing costs NSW", href: "https://jamesonlaw.com.au/legal-resources/conveyancing-costs-nsw-budgeting-for-your-nsw-property-transaction/", note: "15 Mar 2026" },
  { label: "Coutts Legal, Conveyancer cost NSW (no standard fee in NSW)", href: "https://couttslegal.com.au/blog/conveyancer-cost-nsw/", note: "31 Aug 2026" },
  { label: "Westla, Conveyancing costs NSW: what buyers and sellers pay in 2026", href: "https://westla.com.au/conveyancing-costs-nsw/", note: "2026" },
  { label: "All Conveyancing Australia, How much does a conveyancer cost in Victoria", href: "https://allconveyancingaustralia.com.au/conveyancer-cost-in-victoria/", note: "21 Jul 2026" },
  { label: "Conveyancing Explained, Conveyancing cost in Victoria", href: "https://conveyancingexplained.com.au/conveyancing-cost-vic/", note: "updated 13 Jul 2026" },
  { label: "Fogarty Oliver and Rothschild, Conveyancing fees Melbourne", href: "https://www.fogartyoliverandrothschild.com.au/insights/conveyancing-fees-melbourne", note: "reviewed 26 Jun 2026" },
  { label: "Empire Legal, Conveyancing fees QLD", href: "https://empirelegal.com.au/blog/how-much-does-conveyancing-cost-qld/", note: "28 Apr 2026" },
  { label: "River City Conveyancing, fixed conveyancing fees", href: "https://www.rivercityconveyancing.com.au/conveyancing-fees", note: "read 30 Sep 2026" },
  { label: "Spire Law, How much does conveyancing cost on the Sunshine Coast: a 2026 breakdown", href: "https://www.spirelaw.com.au/how-much-does-conveyancing-cost-on-the-sunshine-coast-a-2026-breakdown/", note: "2026" },
  { label: "Keylaw, fixed conveyancing fees (QLD, VIC, NT)", href: "https://keylaw.com.au/prices/", note: "17 Sep 2026" },
  { label: "Attwood Marshall Lawyers, Queensland Government refuses to licence conveyancers in Queensland", href: "https://attwoodmarshall.com.au/queensland-government-refuses-to-licence-conveyancers-in-queensland/", note: "read 30 Sep 2026" },
  { label: "ConveyancerCompare, Settlement agent costs WA 2026", href: "https://conveyancercompare.com.au/settlement-agent-costs-wa", note: "rates current for 2025-26" },
  { label: "Ray Swift Moutrage, conveyancing services in Canberra", href: "https://www.rayswiftmoutrage.com.au/conveyancing", note: "read 30 Sep 2026" },
  { label: "Voeux Conveyancing Darwin, costs and fee structure", href: "https://voeukconveyancing.com/costs-fees-structure/", note: "read 30 Sep 2026" },
];
