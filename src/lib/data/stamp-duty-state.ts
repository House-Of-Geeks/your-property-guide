// Item 20 of the September 2026 fix review: the eight /guides/stamp-duty-{state}
// pages, calculator first. Every dollar figure on those pages (tables, worked
// examples, TLDR, FAQ answers) is computed here from src/lib/utils/stamp-duty.ts,
// so a rate change in the engine moves every page and tests/seo/stamp-duty-guides
// pins the pages to the engine. Prose facts (thresholds, dates, scheme rules)
// were checked against each revenue office on 30 September 2026 and carry their
// source. Paragraph strings may contain [text](/path) or [text](https://...)
// links, rendered by the template.
import type { FaqItem, MatchCTAKind, RelatedGuide, SourceItem } from "@/components/guide";
import {
  ACT_OWNER_OCCUPIER_BRACKETS,
  AUSTRALIAN_STATES,
  NSW_FIRST_HOME,
  NSW_FIRST_HOME_LAND,
  NT_FORMULA_MAX,
  QLD_FIRST_HOME_DEDUCTION,
  QLD_HOME_BRACKETS,
  STAMP_DUTY_VERIFIED_ON,
  STATE_DUTY_SCHEDULES,
  VIC_PPR_BRACKETS,
  VIC_PPR_MAX,
  WA_FIRST_HOME,
  WA_FIRST_HOME_LAND,
  WA_FIRST_HOME_PREVIOUS,
  calculateStampDuty,
  officeRef,
  type AustralianState,
  type Bracket,
  type StampDutyResult,
} from "@/lib/utils/stamp-duty";

export { AUSTRALIAN_STATES, STAMP_DUTY_VERIFIED_ON };
export type { AustralianState };

// ─── Helpers ────────────────────────────────────────────────────────────────

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const pct = (rate: number) => `${+(rate * 100).toFixed(4)}%`;
const per100 = (rate: number) => `$${(rate * 100).toFixed(2)}`;
const pct1 = (n: number) => `${n.toFixed(2).replace(/\.?0+$/, "")}%`;

export type Buyer = "investor" | "owner" | "first";

/** One engine call per buyer type: an investor (standard rate), an owner-occupier, an eligible first home buyer. */
export function dutyFor(state: AustralianState, price: number, buyer: Buyer): StampDutyResult {
  if (buyer === "investor") return calculateStampDuty(price, state, false, false, true);
  if (buyer === "first") return calculateStampDuty(price, state, true, false, false);
  return calculateStampDuty(price, state, false, false, false);
}
const total = (state: AustralianState, price: number, buyer: Buyer = "owner") => dutyFor(state, price, buyer).total;
const surcharge = (state: AustralianState, price: number) => calculateStampDuty(price, state, false, true, true).foreignSurcharge;

export const ABBR: Record<AustralianState, string> = { NSW: "NSW", VIC: "VIC", QLD: "QLD", WA: "WA", SA: "SA", TAS: "TAS", ACT: "ACT", NT: "NT" };
/** How the state reads in a sentence: "in NSW", "in Victoria", "in the ACT". */
export const IN: Record<AustralianState, string> = {
  NSW: "NSW", VIC: "Victoria", QLD: "Queensland", WA: "WA", SA: "SA", TAS: "Tasmania", ACT: "the ACT", NT: "the NT",
};

export const EXAMPLE_PRICES = [500_000, 750_000, 1_000_000] as const;
/**
 * The "stamp duty at common prices" table on each state guide (commercial-
 * intent review 10 Oct 2026, buying 3.1): it answers the price-point People
 * Also Ask questions ("How much is stamp duty on a $700,000 house in QLD?")
 * without a URL per price.
 */
export const COMMON_PRICES = [300_000, 400_000, 500_000, 600_000, 700_000, 750_000, 800_000, 900_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000] as const;
export const STAMP_DUTY_GUIDE_PUBLISHED = "2026-06-14";
/** The guides' last content change (the common prices table); the rates were last checked on STAMP_DUTY_VERIFIED_ON. */
export const STAMP_DUTY_GUIDE_UPDATED = "2026-10-11";

export const stampDutySlug = (state: AustralianState) => `stamp-duty-${state.toLowerCase()}`;
/** The H1 and Article headline. */
export const stampDutyTitle = (state: AustralianState) =>
  `${ABBR[state]} Stamp Duty Calculator 2026: Rates, Concessions & First Home Buyers`;
/** <title> and og:title: the short form, inside the 60-character budget before the " | Your Property Guide" suffix. */
export const stampDutyMetaTitle = (state: AustralianState) =>
  `${ABBR[state]} Stamp Duty Calculator 2026: Rates & First Home Buyers`;

/** One clause per state on first home buyers, used in the meta description and the state links. */
export const FIRST_HOME_SUMMARY: Record<AustralianState, string> = {
  NSW: "first home buyers pay $0 up to $800,000",
  VIC: "first home buyers pay $0 up to $600,000",
  QLD: "first home buyers pay $0 up to $700,000",
  WA: "first home buyers pay $0 up to $600,000",
  SA: "first home buyers pay $0 on a new home",
  TAS: "the first home exemption ended 30 June 2026",
  ACT: "eligible buyers pay $0 from 1 July 2026",
  NT: "a $50,000 first-home grant, no concession",
};

export function stampDutyDescription(state: AustralianState): string {
  return `Free ${ABBR[state]} stamp duty calculator on rates checked 30 Sep 2026: ${FIRST_HOME_SUMMARY[state]}; a $750,000 home costs ${money(total(state, 750_000))}. Rates, examples, FAQs.`;
}

// ─── Tables generated from the schedules ─────────────────────────────────────

export interface RateRow { band: string; duty: string }
export interface DataTable { caption: string; head: string[]; rows: string[][]; note?: string }

function bandLabel(b: Bracket, first: boolean): string {
  if (b.max === Infinity) return `Over ${money(b.min)}`;
  if (first && b.min === 0) return `Up to ${money(b.max)}`;
  return `${money(b.min + 1)} to ${money(b.max)}`;
}

function dutyText(b: Bracket, perHundred: boolean): string {
  if (b.rate === 0) return "Nil";
  if (b.flat) return perHundred ? `${per100(b.rate)} per $100 of the whole value` : `${pct(b.rate)} of the whole value`;
  if (b.base === 0) return perHundred ? `${per100(b.rate)} per $100` : `${pct(b.rate)} of the value`;
  return perHundred
    ? `${money(b.base)} plus ${per100(b.rate)} per $100 over ${money(b.min)}`
    : `${money(b.base)} plus ${pct(b.rate)} of the value over ${money(b.min)}`;
}

/** The standard (investor) schedule for a state, exactly as the engine applies it. */
export function standardRateRows(state: AustralianState): RateRow[] {
  const s = STATE_DUTY_SCHEDULES[state];
  if (state === "NT") {
    return [
      { band: `Up to ${money(NT_FORMULA_MAX)}`, duty: "(0.06571441 × V²) + 15V, where V is the value divided by 1,000" },
      { band: `${money(NT_FORMULA_MAX + 1)} to under $3,000,000`, duty: "4.95% of the whole value" },
      { band: "$3,000,000 to under $5,000,000", duty: "5.75% of the whole value" },
      { band: "$5,000,000 or more", duty: "5.95% of the whole value" },
    ];
  }
  const rows = s.standard.rows.map((b, i) => ({ band: bandLabel(b, i === 0), duty: dutyText(b, s.per100) }));
  if (state === "NSW") rows[0] = { ...rows[0], duty: `${rows[0].duty} (minimum $20)` };
  if (state === "TAS") rows.unshift({ band: "Up to $3,000", duty: "$50" });
  if (state === "NSW") rows[rows.length - 1] = { ...rows[rows.length - 1], duty: `${rows[rows.length - 1].duty} (premium duty)` };
  return rows;
}

function scheduleRows(rows: Bracket[], perHundred: boolean): string[][] {
  return rows.map((b, i) => [bandLabel(b, i === 0), dutyText(b, perHundred)]);
}

export interface WorkedExampleRow {
  price: number;
  investor: number;
  owner: number;
  first: number;
  foreignSurcharge: number;
}

/** The $500,000 / $750,000 / $1,000,000 examples each page prints. */
export function workedExamples(state: AustralianState): WorkedExampleRow[] {
  return EXAMPLE_PRICES.map((price) => ({
    price,
    investor: total(state, price, "investor"),
    owner: total(state, price, "owner"),
    first: total(state, price, "first"),
    foreignSurcharge: surcharge(state, price),
  }));
}

export const hasOwnerOccupierRate = (state: AustralianState) => Boolean(STATE_DUTY_SCHEDULES[state].ownerOccupier);

/** Duty at COMMON_PRICES for an owner-occupier, an eligible first home buyer (established home) and, where the rate differs, an investor. */
export function commonPricesTable(state: AustralianState): DataTable {
  const oo = hasOwnerOccupierRate(state);
  return {
    caption: `${ABBR[state]} stamp duty at common prices (rates checked 30 September 2026)`,
    head: ["Price", oo ? "Owner-occupier" : "Duty", "Eligible first home buyer", ...(oo ? ["Investor"] : [])],
    rows: COMMON_PRICES.map((p) => {
      const owner = total(state, p, "owner");
      const first = total(state, p, "first");
      return [money(p), money(owner), first < owner ? money(first) : `${money(first)} (no relief)`, ...(oo ? [money(total(state, p, "investor"))] : [])];
    }),
  };
}

/** "A $750,000 purchase falls in the ... band" worked through on the standard schedule. */
export function workedCalculation(state: AustralianState, price = 750_000): string {
  const s = STATE_DUTY_SCHEDULES[state];
  const t = total(state, price, "investor");
  if (state === "NT") {
    return price <= NT_FORMULA_MAX
      ? `A ${money(price)} home is under $525,000, so the formula applies: V is ${price / 1000}, and 0.06571441 × ${price / 1000}² + 15 × ${price / 1000} comes to ${money(t)}.`
      : `A ${money(price)} home is over $525,000, so 4.95% applies to the whole value: ${money(t)}, an effective rate of 4.95%.`;
  }
  const v = s.per100 ? Math.ceil(price / 100) * 100 : price;
  const b = s.standard.rows.find((r) => v > r.min && v <= r.max);
  if (!b) return "";
  const band = b.max === Infinity ? `top band, over ${money(b.min)},` : `${bandLabel(b, false)} band,`;
  if (b.flat) {
    return `A ${money(price)} home falls in the ${band} where ${s.per100 ? `${per100(b.rate)} per $100` : pct(b.rate)} applies to the whole value: ${money(t)}.`;
  }
  const part = t - Math.round(b.base);
  const rateWords = s.per100 ? `${per100(b.rate)} for every $100 over ${money(b.min)}` : `${pct(b.rate)} of the ${money(price - b.min)} over ${money(b.min)}`;
  return `A ${money(price)} home falls in the ${band} so the duty is ${money(b.base)} plus ${rateWords}. That is ${money(b.base)} + ${money(part)} = ${money(t)}, an effective rate of ${pct1((t / price) * 100)}.`;
}

/** What an eligible first home buyer pays at prices across the state's thresholds. */
export function firstHomeRows(state: AustralianState, prices: readonly number[]): string[][] {
  return prices.map((p) => {
    const full = total(state, p, "owner");
    const fhb = total(state, p, "first");
    return [money(p), money(full), money(fhb), fhb < full ? money(full - fhb) : "None"];
  });
}

const FIRST_HOME_PRICES: Record<AustralianState, readonly number[]> = {
  NSW: [750_000, 800_000, 850_000, 900_000, 950_000, 1_000_000],
  VIC: [500_000, 600_000, 650_000, 700_000, 750_000],
  QLD: [500_000, 700_000, 710_000, 750_000, 790_000, 800_000],
  WA: [500_000, 600_000, 650_000, 700_000, 750_000, 800_000],
  SA: [],
  TAS: [],
  ACT: [500_000, 750_000, 1_000_000, 1_500_000],
  NT: [],
};

export function firstHomeTable(state: AustralianState): DataTable | null {
  const prices = FIRST_HOME_PRICES[state];
  if (prices.length === 0) return null;
  return {
    caption: `What an eligible first home buyer pays in ${IN[state]} (established home)`,
    head: ["Price", hasOwnerOccupierRate(state) ? "Owner-occupier duty" : "Full duty", "First home buyer pays", "Saving"],
    rows: firstHomeRows(state, prices),
  };
}

// ─── Content per state ───────────────────────────────────────────────────────

export interface Exemption { title: string; body: string }

export interface StampDutyGuide {
  state: AustralianState;
  slug: string;
  /** H1 and Article headline (long form). */
  title: string;
  /** <title> and og:title (short form, 60-character budget). */
  metaTitle: string;
  description: string;
  tldr: string[];
  editorNote: string;
  whatIs: string[];
  howCalculated: string[];
  firstHome: string[];
  keyFigure: { value: string; label: string; context: string };
  concessionIntro: string[];
  concessionTables: DataTable[];
  foreign: string[];
  exemptions: Exemption[];
  whenPay: string[];
  faqs: FaqItem[];
  sources: SourceItem[];
  related: RelatedGuide[];
  cta: { kind: MatchCTAKind; lead?: string; ctaLabel?: string; href?: string };
}

function sources(state: AustralianState, extra: SourceItem[]): SourceItem[] {
  const s = STATE_DUTY_SCHEDULES[state];
  const list: SourceItem[] = [s.standard.source];
  if (s.ownerOccupier) list.push(s.ownerOccupier.source);
  list.push(s.firstHome.source);
  if (s.foreign) list.push(s.foreign.source);
  list.push(...extra);
  list.push(
    "Worked examples, tables and FAQ figures on this page are calculated by our stamp duty calculator from the schedules above, rounded to the dollar. They exclude the land titles registration and transfer fees.",
  );
  return list;
}

function whenPay(state: AustralianState): string[] {
  const s = STATE_DUTY_SCHEDULES[state];
  return [
    `The buyer pays ${s.dutyName}, not the seller, and it is normally paid at settlement. Your conveyancer or solicitor works out the figure, lodges the transaction with ${officeRef(state)} and pays the duty from the settlement funds, so you rarely deal with the revenue office yourself.`,
    `Budget for it as cash on top of your deposit from the start: on a $750,000 home in ${IN[state]} it is ${money(total(state, 750_000))} for an owner-occupier. Late payment can attract interest, which is one more reason the timing sits with your conveyancer. Our [conveyancing guide](/guides/conveyancing-guide) explains who does what at settlement.`,
  ];
}

function whenPayFaq(state: AustralianState): FaqItem {
  const s = STATE_DUTY_SCHEDULES[state];
  return {
    question: `When do you pay stamp duty in ${IN[state]}?`,
    answer: `Normally at settlement. Your conveyancer or solicitor calculates the ${s.dutyName}, lodges it with ${officeRef(state)} and pays it out of the settlement funds, so the money has to be ready on the day on top of your deposit. On a $750,000 home in ${IN[state]} that is ${money(total(state, 750_000))} for an owner-occupier. Pay late and interest can be charged, which is why the conveyancer handles the timing.`,
  };
}

const OWNER_OCCUPIER_RATE_NAME: Partial<Record<AustralianState, string>> = {
  VIC: "principal place of residence rate",
  QLD: "home concession rate",
  ACT: "owner-occupier rate",
};

function howCalculated(state: AustralianState): string[] {
  const s = STATE_DUTY_SCHEDULES[state];
  if (state === "NT") {
    return [
      "The Territory does not use bands with a base amount. Up to $525,000 the duty comes from a formula, so the effective rate climbs smoothly with the price. Above $525,000 a flat percentage applies to the whole value: 4.95% up to $3 million, then 5.75% and 5.95% (Territory Revenue Office). The formula and the flat rate meet at $525,000, so there is no jump at the line.",
      `${workedCalculation(state, 500_000)} ${workedCalculation(state, 750_000)}`,
    ];
  }
  const paras = [
    `${officeRef(state, true)} charges ${s.dutyName} on a marginal scale: each slice of the price is taxed at its own rate and the slices stack, so the effective rate rises slowly as the price rises rather than jumping.${s.per100 ? ` Rates are per $100 or part of $100, so the value is rounded up to the next $100 first.` : ""}`,
    workedCalculation(state, 750_000),
  ];
  if (state === "VIC") paras.push("One quirk: between $960,001 and $2,000,000 Victoria charges 5.5% of the whole value rather than a marginal rate, so a home just over $960,000 pays slightly more than the marginal scale would give (SRO Victoria).");
  if (state === "ACT") paras.push("Over $1,455,000 the ACT charges a flat $4.54 per $100 on the whole value instead of the marginal scale (ACT Revenue Office).");
  const ooName = OWNER_OCCUPIER_RATE_NAME[state];
  if (ooName) {
    const oo = total(state, 750_000, "owner");
    const inv = total(state, 750_000, "investor");
    paras.push(
      oo < inv
        ? `The table is the standard rate, which an investor pays. An owner-occupier pays the lower ${ooName}: ${money(oo)} on the same $750,000 home. That schedule is under concession rates below.`
        : `The table is the standard rate. Owner-occupiers pay the lower ${ooName} on a home up to ${money(VIC_PPR_MAX)} (under concession rates below); at $750,000 it no longer applies, so everyone pays ${money(inv)}.`,
    );
  }
  return paras;
}

function exampleAt(state: AustralianState, price: number) {
  return { owner: total(state, price, "owner"), investor: total(state, price, "investor"), first: total(state, price, "first"), foreign: surcharge(state, price) };
}

function buildNSW(): StampDutyGuide {
  const st: AustralianState = "NSW";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000), e9 = exampleAt(st, 900_000);
  const perTen = Math.round(total(st, 1_000_000) / 20);
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On Revenue NSW's 2026-27 rates, stamp duty on a $750,000 home is ${money(e75.owner)}, an effective rate of ${pct1((e75.owner / 750_000) * 100)}. Owner-occupiers and investors pay the same rate in NSW.`,
      `First home buyers pay $0 on a home up to $800,000 and a reduced amount up to $1,000,000 (First Home Buyers Assistance Scheme, contracts from 1 July 2023).`,
      `Duty is marginal: ${money(e5.owner)} on $500,000 and ${money(e1m.owner)} on $1,000,000. The thresholds are indexed each 1 July.`,
      `Foreign buyers add 9% surcharge purchaser duty, ${money(e75.foreign)} on a $750,000 home (from 1 January 2025).`,
      "The calculator above and every table below use the same schedule. Confirm your figure with Revenue NSW or your conveyancer before you sign.",
    ],
    editorNote: `The thing nobody tells you about NSW stamp duty is how much it dwarfs every other cost of buying. People agonise over the price of a building inspection and then hand the government ${money(e75.owner)} at settlement on a $750,000 home without blinking. If you are a first home buyer under $800,000, the exemption is the single most valuable thing you can claim, so get the eligibility right before anything else.`,
    whatIs: [
      "Stamp duty, officially called transfer duty in NSW, is the tax you pay the state government when property changes hands. It is the largest upfront cost of buying after your deposit, and on most Sydney purchases it runs into the tens of thousands.",
      "The buyer pays it, not the seller. It is calculated on the purchase price (or the property's market value, whichever is higher) and is normally paid at settlement through your conveyancer or solicitor. Budgeting for it from the start is the difference between a clean settlement and a scramble.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      `Under the First Home Buyers Assistance Scheme an eligible first home buyer pays no transfer duty on a new or established home valued up to ${money(NSW_FIRST_HOME.exemptTo)}, and a reduced amount above ${money(NSW_FIRST_HOME.exemptTo)} and under ${money(NSW_FIRST_HOME.concessionTo)}. These thresholds apply to contracts exchanged on or after ${NSW_FIRST_HOME.from} (Revenue NSW).`,
      `In the concession band the duty rises in a straight line from $0 at $800,000 to the full rate at $1,000,000, so each extra $10,000 of price adds about ${money(perTen)} of duty. At $900,000 an eligible buyer pays ${money(e9.first)} instead of ${money(e9.owner)}.`,
      `To qualify, you and your spouse or partner must never have owned residential property in Australia, you must be over 18, at least one buyer must be an Australian citizen or permanent resident, and one of you must move in within 12 months of settlement and live there for at least 12 continuous months (Revenue NSW). Vacant land for a first home is exempt up to ${money(NSW_FIRST_HOME_LAND.exemptTo)}, with a concession to ${money(NSW_FIRST_HOME_LAND.concessionTo)}.`,
      "Our [NSW first home buyer guide](/guides/first-home-buyer-nsw) covers the First Home Owner Grant and the federal schemes that stack with the duty exemption.",
    ],
    keyFigure: { value: "$0", label: "Transfer duty for an eligible NSW first home buyer on a home up to $800,000.", context: "Concession to $1,000,000 · Revenue NSW, contracts from 1 July 2023" },
    concessionIntro: [
      "NSW has one schedule for everyone, so the concessions that matter to home buyers are the first home buyer exemption and concession. The table shows what an eligible buyer pays across the concession band, worked on the 2026-27 rates.",
    ],
    concessionTables: [],
    foreign: [
      `A foreign person buying residential land in NSW pays surcharge purchaser duty of 9% of the value on top of transfer duty. The rate rose from 8% on 1 January 2025 (Revenue NSW, 2024-25 Budget). On a $750,000 home that is ${money(e75.foreign)} on top of ${money(e75.owner)}, and the first home buyer scheme needs at least one buyer to be an Australian citizen or permanent resident.`,
    ],
    exemptions: [
      { title: "First home buyers", body: "No duty up to $800,000 and a concession to $1,000,000 on a home, $350,000 and $450,000 on vacant land (First Home Buyers Assistance Scheme)." },
      { title: "Spouses and de facto partners", body: "A transfer of an interest in your home to your spouse or de facto partner can be exempt." },
      { title: "Relationship break-ups", body: "Transfers of matrimonial or relationship property under a separation can be exempt." },
      { title: "Deceased estates", body: "Property passing from a deceased estate is charged at concessional rates." },
      { title: "Family farms", body: "Primary production land transferred between family members can be exempt." },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "How much is stamp duty on a $800,000 house in NSW?",
        answer: `On Revenue NSW's 2026-27 rates, transfer duty on an $800,000 home is ${money(e8.owner)}, an effective rate of ${pct1((e8.owner / 800_000) * 100)}. Owner-occupiers and investors pay the same amount. An eligible first home buyer pays $0, because $800,000 is the top of the First Home Buyers Assistance Scheme exemption. A foreign buyer adds 9% surcharge purchaser duty, ${money(e8.foreign)}, on top.`,
      },
      {
        question: "What are the stamp duty rates for NSW in 2026?",
        answer: `Revenue NSW indexes the thresholds each 1 July. For 2026-27, duty is $1.25 per $100 up to $18,000, rising in steps to $11,602 plus $4.50 per $100 over $387,000 for a home between $387,001 and $1,290,000, then $5.50 per $100 above that and $7.00 per $100 over $3,870,000. On a $750,000 home that comes to ${money(e75.owner)}. The full table is on this page.`,
      },
      {
        question: "How do I avoid paying stamp duty in NSW?",
        answer: `You cannot avoid transfer duty on a normal purchase, but you can pay less legally. The biggest saving is the First Home Buyers Assistance Scheme: an eligible first home buyer pays $0 up to $800,000 and a reduced amount up to $1,000,000 (Revenue NSW, contracts from 1 July 2023). On a $750,000 home that saves ${money(e75.owner)}. Revenue NSW also exempts some transfers between spouses and on a relationship breakdown. Schemes sold as ways to dodge duty carry penalties, and the buyer is liable.`,
      },
      {
        question: "Who is exempt from paying stamp duty in NSW?",
        answer: `Revenue NSW lists these exemptions and concessions: eligible first home buyers (no duty up to $800,000, a concession to $1,000,000), transfers of a home between spouses or de facto partners, transfers on a marriage or relationship breakdown, primary production land passing between family members, and charities. Deceased estates pay concessional rates. Everyone else pays the standard rate: ${money(e75.owner)} on a $750,000 home.`,
      },
      whenPayFaq(st),
      {
        question: "Is stamp duty the same for an investment property in NSW?",
        answer: `Yes. NSW has one set of transfer duty rates, so an investor pays the same as an owner-occupier: ${money(e75.investor)} on a $750,000 home and ${money(e1m.investor)} on $1,000,000 (Revenue NSW, 2026-27). The difference is the concessions: the first home buyer exemption is only for owner-occupiers buying their first home, and a foreign investor also pays the 9% surcharge.`,
      },
    ],
    sources: sources(st, [
      { label: "Revenue NSW: Transfer duty exemptions and concessions", href: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty/exemptions-and-concessions", note: "read 30 September 2026" },
    ]),
    related: [
      { title: "First Home Buyer Guide NSW", href: "/guides/first-home-buyer-nsw", description: "Grants, schemes and the NSW buying process." },
      { title: "Cost of Selling a House in NSW", href: "/guides/cost-of-selling-a-house-nsw", description: "The sell side of a move, line by line." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: { kind: "buyers-agent" },
  };
}

function buildVIC(): StampDutyGuide {
  const st: AustralianState = "VIC";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000), e7 = exampleAt(st, 700_000);
  const cheapest = [...AUSTRALIAN_STATES].map((s) => ({ s, t: total(s, 750_000) })).sort((a, b) => b.t - a.t);
  const rank = cheapest.findIndex((x) => x.s === st) + 1;
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On SRO Victoria's rates checked 30 September 2026, land transfer duty on a $750,000 home is ${money(e75.owner)}, an effective rate of ${pct1((e75.owner / 750_000) * 100)}.`,
      `First home buyers pay $0 up to $600,000 and a reduced amount up to $750,000. Owner-occupiers get a lower principal place of residence rate up to $550,000.`,
      `Duty is marginal: ${money(e5.owner)} on a $500,000 home you live in (${money(e5.investor)} for an investor) and ${money(e1m.owner)} on $1,000,000.`,
      `Foreign buyers add 8% foreign purchaser additional duty, ${money(e75.foreign)} on a $750,000 home (contracts from 1 July 2019).`,
      "The calculator above and every table below use the same schedules. Confirm your figure with SRO Victoria or your conveyancer before you sign.",
    ],
    editorNote: `The part that catches Victorian buyers out is how fast the help disappears as the price rises. At $600,000 an eligible first home buyer pays nothing. By $750,000 they pay the full ${money(e75.owner)}, the same as anyone else, and above $550,000 even the owner-occupier discount is gone. A property that drifts a few thousand dollars higher at auction can cost a lot more than the hammer price suggests.`,
    whatIs: [
      "Stamp duty in Victoria is officially called land transfer duty. It is a one-off state tax on the transfer of property, and for most buyers it is the biggest upfront government cost after the deposit itself.",
      "The buyer pays it, not the seller, and it is settled at the same time as the property. It is charged on the dutiable value, normally the purchase price or the market value if that is higher. Because the rate climbs as the price climbs, the duty grows faster than the price does.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      "An eligible first home buyer pays no land transfer duty on a home valued up to $600,000, and a reduced amount between $600,001 and $750,000. Above $750,000 there is no first home buyer duty relief (SRO Victoria, page updated 15 September 2026; thresholds in place since 1 July 2017).",
      `The reduction shrinks in a straight line across the band. SRO Victoria's own example: a first home buyer paying $700,000 pays ${money(e7.first)}, a saving of ${money(e7.owner - e7.first)} on the general rate.`,
      "To qualify, at least one buyer must be an Australian citizen, New Zealand citizen or permanent resident, you must live in the home for 12 continuous months starting within 12 months of settlement, and you cannot have owned and lived in a home in Australia for six months or more since 1 July 2000 (SRO Victoria).",
      "Our [Victorian first home buyer guide](/guides/first-home-buyer-vic) covers the First Home Owner Grant, which SRO Victoria pays on a new home valued up to $750,000.",
    ],
    keyFigure: { value: "$0", label: "Land transfer duty for an eligible Victorian first home buyer on a home up to $600,000.", context: "Concession to $750,000 · SRO Victoria" },
    concessionIntro: [
      `Victoria has two concessions for people buying a home to live in. The principal place of residence (PPR) rate is open to any owner-occupier on a home up to ${money(VIC_PPR_MAX)} who moves in within 12 months and stays 12 months. It saves ${money(e5.investor - e5.owner)} on a $500,000 home. Above ${money(VIC_PPR_MAX)} the general rates apply.`,
    ],
    concessionTables: [
      {
        caption: "Principal place of residence rates (SRO Victoria, contracts from 6 May 2008)",
        head: ["Dutiable value", "Duty"],
        rows: [...scheduleRows(VIC_PPR_BRACKETS, false), [`Over ${money(VIC_PPR_MAX)}`, "General rates apply"]],
      },
    ],
    foreign: [
      `A foreign purchaser of residential property in Victoria pays foreign purchaser additional duty of 8% of the dutiable value, on top of land transfer duty, for contracts from 1 July 2019 (SRO Victoria). On a $750,000 home that adds ${money(e75.foreign)}.`,
    ],
    exemptions: [
      { title: "First home buyers", body: "No duty up to $600,000, reduced duty to $750,000." },
      { title: "Principal place of residence concession", body: "A lower rate for any owner-occupier on a home up to $550,000." },
      { title: "Pensioners and concession card holders", body: "A once-only exemption or concession for eligible card holders (SRO Victoria)." },
      { title: "Off-the-plan concession", body: "Duty on an eligible off-the-plan home can be charged on a reduced dutiable value." },
      { title: "Spouses and partners", body: "A transfer of a home between spouses or domestic partners for no payment can be exempt if one of you lives there." },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "How much is stamp duty on a $800,000 house in Victoria?",
        answer: `On SRO Victoria's general rates, land transfer duty on an $800,000 home is ${money(e8.owner)}, an effective rate of ${pct1((e8.owner / 800_000) * 100)}. That is what an owner-occupier, an investor and a first home buyer all pay, because $800,000 is above both the $550,000 owner-occupier rate and the $750,000 first home buyer limit. A foreign buyer adds 8%, ${money(e8.foreign)}.`,
      },
      {
        question: "Do first home buyers pay stamp duty in Victoria?",
        answer: `Not on a home up to $600,000: an eligible first home buyer pays nothing. Between $600,001 and $750,000 they pay a reduced amount, and above $750,000 the full rate (SRO Victoria). On a $700,000 home the duty is ${money(e7.first)} instead of ${money(e7.owner)}. You must live in the home for 12 months, starting within 12 months of settlement.`,
      },
      {
        question: "How do I avoid paying stamp duty in Victoria?",
        answer: `You cannot avoid land transfer duty on a normal purchase, but SRO Victoria offers several ways to pay less: the first home buyer exemption to $600,000, the principal place of residence rate for any owner-occupier to $550,000 (worth ${money(e5.investor - e5.owner)} on $500,000), the pensioner and concession card holder reduction, the off-the-plan concession and the spouse transfer exemption. Each has its own eligibility test, so check it before you sign.`,
      },
      whenPayFaq(st),
      {
        question: "Is stamp duty in Victoria higher than in other states?",
        answer: `At most prices, yes. On a $750,000 home an owner-occupier in Victoria pays ${money(e75.owner)}, ${rank === 1 ? "the highest of the eight states and territories" : `number ${rank} of the eight states and territories`} on our calculator (NSW ${money(total("NSW", 750_000))}, Queensland ${money(total("QLD", 750_000))}, WA ${money(total("WA", 750_000))}). The 6% marginal rate from $130,000 is why. Figures use each revenue office's rates checked 30 September 2026.`,
      },
    ],
    sources: sources(st, [
      { label: "SRO Victoria: Concessions, exemptions and waivers (PPR, pensioner, off-the-plan, spouse and partner)", href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers", note: "read 30 September 2026" },
    ]),
    related: [
      { title: "First Home Buyer Guide VIC", href: "/guides/first-home-buyer-vic", description: "Grants, schemes and the Victorian buying process." },
      { title: "Section 32 Vendor Statement", href: "/guides/section-32-vendor-statement-victoria", description: "What the vendor must disclose before you buy." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: { kind: "buyers-agent" },
  };
}

function buildQLD(): StampDutyGuide {
  const st: AustralianState = "QLD";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000), e82 = exampleAt(st, 820_000), e7 = exampleAt(st, 700_000);
  const gap = e1m.investor - e1m.owner;
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On Queensland Revenue Office rates checked 30 September 2026, transfer duty on a $750,000 home you live in is ${money(e75.owner)} at the home concession rate, and ${money(e75.investor)} for an investor.`,
      "First home buyers pay $0 on an established home up to $700,000, phasing out to $800,000 (contracts from 9 June 2024), and $0 on a new home or vacant land at any price (from 1 May 2025).",
      `Duty is marginal: an owner-occupier pays ${money(e5.owner)} on $500,000 and ${money(e1m.owner)} on $1,000,000.`,
      `Foreign buyers add 8% additional foreign acquirer duty, ${money(e75.foreign)} on a $750,000 home.`,
      "The calculator above and every table below use the same schedules. Confirm your figure with the Queensland Revenue Office or your conveyancer before you sign.",
    ],
    editorNote: `Queensland's first home concession does not fall off a cliff, it steps down. Every $10,000 of price above $709,999 takes $1,735 off the concession until it reaches nil at $800,000. An eligible buyer pays $0 at $700,000 and ${money(e75.first)} at $750,000. And if you are looking at a new home rather than an established one, check the new home concession first: since 1 May 2025 it has no price cap at all.`,
    whatIs: [
      "Stamp duty, officially called transfer duty in Queensland, is a state tax you pay when ownership of a property changes hands. It is the biggest upfront government cost in a purchase after your deposit, and on a typical home it runs to tens of thousands of dollars.",
      "The buyer pays it, not the seller, and it is settled at or before settlement. It is worked out from the price you pay (or the property's value, if that is higher), so know your number before you set a budget: get the duty wrong and your cash-to-buy figure is wrong too.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      "Queensland's first home concession takes a fixed amount off the home concession duty. For contracts signed on or after 9 June 2024 the amount is $17,350 up to $709,999, which clears the whole bill on a home up to $700,000, then it falls by $1,735 for every $10,000 of price until it is nil at $800,000 (Queensland Revenue Office).",
      `So an eligible buyer pays $0 at $700,000, ${money(e75.first)} at $750,000 and ${money(e8.first)} at $800,000, the same as any owner-occupier on the home concession rate. Against the standard rate, the combined saving at $700,000 is ${money(e7.investor)}.`,
      "Buying new is different. Since 1 May 2025 an eligible first home buyer pays no transfer duty on a new home, or on vacant land to build one, with no cap on the price (Queensland Revenue Office). For every first home concession you must move in within one year, and you can claim only one concession on a transaction.",
      "Our [Queensland first home buyer guide](/guides/first-home-buyer-qld) covers the First Home Owner Grant and how it stacks with the duty concession.",
    ],
    keyFigure: { value: "$0", label: "Transfer duty for an eligible Queensland first home buyer on an established home up to $700,000, and on a new home at any price.", context: "Queensland Revenue Office · new home concession from 1 May 2025" },
    concessionIntro: [
      `Queensland publishes two concession schedules. The home concession rate is for anyone buying a home to live in who moves in within a year; from $540,000 up it saves ${money(gap)} on the standard rate. The first home concession is a fixed deduction from that home concession duty, by price band.`,
    ],
    concessionTables: [
      {
        caption: "Home concession rates (owner-occupiers, Queensland Revenue Office)",
        head: ["Dutiable value", "Duty"],
        rows: scheduleRows(QLD_HOME_BRACKETS, true),
      },
      {
        caption: "First home concession on an established home (contracts from 9 June 2024)",
        head: ["Dutiable value", "Concession off the home concession duty"],
        rows: [
          ...QLD_FIRST_HOME_DEDUCTION.map((row, i, all) => [
            i === 0 ? `Up to ${money(row.below - 1)}` : `${money(all[i - 1].below)} to ${money(row.below - 1)}`,
            money(row.amount),
          ]),
          ["$800,000 or more", "Nil"],
        ],
      },
      {
        caption: "First home concessions on new homes and land (from 1 May 2025)",
        head: ["Purchase", "Duty for an eligible first home buyer"],
        rows: [
          ["New home, never lived in", "$0, no price cap"],
          ["Vacant land to build a first home", "$0, no value cap"],
        ],
      },
    ],
    foreign: [
      `A foreign person buying residential land in Queensland pays additional foreign acquirer duty (AFAD) of 8% of the value on top of transfer duty. The rate rose from 7% on 1 July 2024 (Queensland Revenue Office). On a $750,000 home that adds ${money(e75.foreign)}.`,
    ],
    exemptions: [
      { title: "Home concession", body: "A lower rate for anyone buying a home to live in within a year." },
      { title: "First home concession", body: "No duty on an established home up to $700,000, phasing out to $800,000." },
      { title: "First home (new home) concession", body: "No duty on a new home for an eligible first home buyer, no price cap (from 1 May 2025)." },
      { title: "First home vacant land concession", body: "No duty on vacant land to build a first home, no value cap (from 1 May 2025)." },
      { title: "Family business and superannuation concessions", body: "Listed by the Queensland Revenue Office for particular transfers. You can claim only one concession per transaction." },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "How much stamp duty would I pay on a $1,000,000 house in Queensland?",
        answer: `On Queensland Revenue Office rates, transfer duty on a $1,000,000 home you will live in is ${money(e1m.owner)} at the home concession rate, and ${money(e1m.investor)} if it is an investment. A first home buyer pays the same ${money(e1m.first)} on an established home, because the first home concession stops at $800,000, but $0 on a new home (no price cap since 1 May 2025). A foreign buyer adds 8% AFAD, ${money(e1m.foreign)}.`,
      },
      {
        question: "What is the stamp duty on $820,000 in Queensland?",
        answer: `At $820,000 an owner-occupier pays ${money(e82.owner)} on the Queensland Revenue Office home concession rate: $10,150 plus $4.50 per $100 over $540,000. An investor pays ${money(e82.investor)} on the standard rate. A first home buyer of an established home pays the owner-occupier figure, since the first home concession ends at $800,000; on a new home they pay $0.`,
      },
      {
        question: "How much stamp duty will I pay on $800,000 in Queensland?",
        answer: `${money(e8.owner)} if you will live in the home, on the Queensland Revenue Office home concession rate, or ${money(e8.investor)} as an investor. $800,000 is exactly where the first home concession on an established home reaches nil, so an eligible first home buyer also pays ${money(e8.first)}. Just under the line, at $799,999, the concession is still $1,735.`,
      },
      {
        question: "How do I avoid paying stamp duty in QLD?",
        answer: `You cannot avoid transfer duty on a normal purchase, but Queensland's concessions cut it sharply. An eligible first home buyer pays $0 on an established home up to $700,000 and $0 on a new home or vacant land at any price (Queensland Revenue Office). Any owner-occupier gets the home concession rate, worth ${money(gap)} above $540,000. You must move in within a year, and only one concession applies per transaction.`,
      },
      whenPayFaq(st),
      {
        question: "Is stamp duty different for an investment property in Queensland?",
        answer: `Yes. An investor pays the standard transfer duty rate, and a buyer who moves in within a year pays the lower home concession rate (Queensland Revenue Office). On a $750,000 home that is ${money(e75.investor)} for the investor against ${money(e75.owner)} for the owner-occupier, a gap of ${money(e75.investor - e75.owner)}. First home concessions are for owner-occupiers only.`,
      },
    ],
    sources: sources(st, [
      { label: "Queensland Revenue Office: Transfer duty concessions for homes", href: "https://qro.qld.gov.au/duties/transfer-duty/concessions/", note: "read 30 September 2026" },
      "This page replaces our earlier article \"Stamp Duty in Queensland: What You Need to Know\" (October 2024, updated July 2026), which now redirects here.",
    ]),
    related: [
      { title: "First Home Buyer Guide QLD", href: "/guides/first-home-buyer-qld", description: "Grants, schemes and the Queensland buying process." },
      { title: "Contract of Sale in QLD", href: "/guides/contract-of-sale-qld", description: "What is in the REIQ contract and when it binds you." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: { kind: "buyers-agent" },
  };
}

function buildWA(): StampDutyGuide {
  const st: AustralianState = "WA";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000), e82 = exampleAt(st, 820_000), e7 = exampleAt(st, 700_000);
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On RevenueWA's rates checked 30 September 2026, transfer duty on a $750,000 home is ${money(e75.owner)}, an effective rate of ${pct1((e75.owner / 750_000) * 100)}. Owner-occupiers and investors pay the same general rate.`,
      "First home buyers pay $0 up to $600,000 and a concessional rate up to $800,000, for transactions from 7 May 2026. Before that the line was $500,000.",
      `Duty is marginal: ${money(e5.owner)} on $500,000 and ${money(e1m.owner)} on $1,000,000.`,
      `Foreign buyers add 7% foreign buyers duty, ${money(e75.foreign)} on a $750,000 home.`,
      "The calculator above and every table below use the same schedule. Confirm your figure with RevenueWA or your settlement agent before you sign.",
    ],
    editorNote: "WA moved its first home thresholds on 7 May 2026, and a lot of what is still written about WA stamp duty quotes the old $500,000 line. It is now $0 up to $600,000 for an eligible first home buyer, tapering to $800,000. In Perth, where plenty of homes sit between those two numbers, the change is worth thousands. Check which date your contract falls on, because that decides which thresholds apply.",
    whatIs: [
      "Stamp duty in Western Australia is officially called transfer duty. It is a state tax on the transfer of property, charged on the purchase price or the market value, whichever is higher. For most buyers it is the biggest upfront government cost after the deposit.",
      "The buyer pays it, not the seller. It is assessed on the contract and settled at the same time as the property, so it is part of the money you need on settlement day. RevenueWA administers it, and your conveyancer or settlement agent handles the assessment and payment.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      `WA's first home owner rate of duty changed on ${WA_FIRST_HOME.from}. For transactions on or after that date an eligible first home buyer pays no duty on a new or established home valued up to ${money(WA_FIRST_HOME.exemptTo)}, and $${WA_FIRST_HOME.ratePer100} for every $100 of value over ${money(WA_FIRST_HOME.exemptTo)} up to ${money(WA_FIRST_HOME.concessionTo)} (RevenueWA, 2026-27 Housing Taxation Package).`,
      `That concessional rate meets the general rate at about $800,000, so the saving tapers smoothly: an eligible buyer pays $0 at $600,000, ${money(e7.first)} at $700,000 and ${money(e8.first)} at $800,000, where the general rate is ${money(e8.owner)}.`,
      `Before 7 May 2026 (from ${WA_FIRST_HOME_PREVIOUS.from}) the exemption stopped at ${money(WA_FIRST_HOME_PREVIOUS.exemptTo)}, with the concession running to ${money(WA_FIRST_HOME_PREVIOUS.metroTo)} in Perth and Peel and ${money(WA_FIRST_HOME_PREVIOUS.regionalTo)} elsewhere, so a contract signed earlier is assessed on those figures. Vacant land for a first home is duty free to ${money(WA_FIRST_HOME_LAND.exemptTo)}, with the concessional rate to ${money(WA_FIRST_HOME_LAND.concessionTo)}.`,
      "To qualify you must meet the First Home Owner Grant eligibility rules, even when no grant is paid because the home is established (RevenueWA fact sheet, 28 July 2026). Our [WA first home buyer guide](/guides/first-home-buyer-wa) covers the grant.",
    ],
    keyFigure: { value: "$0", label: "Transfer duty for an eligible WA first home buyer on a home up to $600,000.", context: "Concessional rate to $800,000 · RevenueWA, from 7 May 2026" },
    concessionIntro: [
      "WA has one general schedule for homes, so the concession that matters is the first home owner rate. RevenueWA charges it as a flat rate per $100 over the exemption threshold, for homes and for vacant land.",
    ],
    concessionTables: [
      {
        caption: "First home owner rate of duty (RevenueWA, transactions on or after 7 May 2026)",
        head: ["Purchase", "Dutiable value", "Duty"],
        rows: [
          ["Home (new or established)", `Up to ${money(WA_FIRST_HOME.exemptTo)}`, "Nil"],
          ["Home (new or established)", `${money(WA_FIRST_HOME.exemptTo + 1)} to ${money(WA_FIRST_HOME.concessionTo)}`, `$${WA_FIRST_HOME.ratePer100} per $100 over ${money(WA_FIRST_HOME.exemptTo)}`],
          ["Vacant land", `Up to ${money(WA_FIRST_HOME_LAND.exemptTo)}`, "Nil"],
          ["Vacant land", `${money(WA_FIRST_HOME_LAND.exemptTo + 1)} to ${money(WA_FIRST_HOME_LAND.concessionTo)}`, `$${WA_FIRST_HOME_LAND.ratePer100} per $100 over ${money(WA_FIRST_HOME_LAND.exemptTo)}`],
        ],
      },
    ],
    foreign: [
      `A foreign person buying residential property in WA pays foreign buyers duty, an additional 7% of the dutiable value on top of transfer duty (RevenueWA). On a $750,000 home that adds ${money(e75.foreign)}, and the first home owner rate needs at least one buyer to be an Australian citizen or permanent resident.`,
    ],
    exemptions: [
      { title: "First home owner rate", body: "No duty to $600,000 on a home and $450,000 on vacant land, a concessional rate above that (from 7 May 2026)." },
      { title: "Off-the-plan concession", body: "Extended to 30 June 2028 with higher thresholds, for transactions from 12 March 2026 (RevenueWA, 2026-27 Housing Taxation Package)." },
      { title: "Everyone else", body: `There is no general owner-occupier rate in WA: a home buyer who is not a first home buyer pays the general rate, ${money(e75.owner)} on $750,000.` },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "Who is eligible for stamp duty exemption WA?",
        answer: `An eligible first home buyer pays no duty on a home up to $600,000 and a reduced rate to $800,000 (from 7 May 2026). RevenueWA's fact sheet (28 July 2026) sets the tests: each buyer is a person aged 18 or over, at least one is an Australian citizen or permanent resident, neither you nor your spouse owned residential property in Australia before 1 July 2000 or has owned and lived in a home since, and you live in it for six continuous months starting within 12 months. On a $500,000 home that saves ${money(e5.owner)}.`,
      },
      {
        question: "What is stamp duty on $820,000 in WA?",
        answer: `On RevenueWA's general rate, transfer duty on an $820,000 home is ${money(e82.owner)}: $28,453 plus $5.15 per $100 over $725,000. Owner-occupiers, investors and first home buyers all pay that figure, because $820,000 is above the $800,000 top of the first home owner rate. A foreign buyer adds 7%, ${money(e82.foreign)}.`,
      },
      {
        question: "How much stamp duty will I pay on $800,000 in WA?",
        answer: `${money(e8.owner)} on RevenueWA's general rate, an effective ${pct1((e8.owner / 800_000) * 100)}. An eligible first home buyer pays ${money(e8.first)} on the first home owner rate ($16.15 per $100 over $600,000), only ${money(e8.owner - e8.first)} less, because $800,000 is where the concession runs out. A foreign buyer adds ${money(e8.foreign)}.`,
      },
      {
        question: "How to avoid paying stamp duty in WA?",
        answer: `You cannot avoid transfer duty on a normal purchase, but you can pay less. The first home owner rate removes it on a home up to $600,000 and cuts it to $800,000 (RevenueWA, from 7 May 2026), saving ${money(e5.owner)} on a $500,000 home. Vacant land for a first home is duty free to $450,000, and the off-the-plan concession runs to 30 June 2028. Everyone else pays the general rate.`,
      },
      {
        question: "How much stamp duty do you pay in WA?",
        answer: `It depends on the price, because WA's general rate is marginal. On RevenueWA's schedule a $500,000 home costs ${money(e5.owner)}, a $750,000 home ${money(e75.owner)} and a $1,000,000 home ${money(e1m.owner)} in duty. An eligible first home buyer pays nothing to $600,000 and a reduced amount to $800,000. Use the calculator at the top of this page for your price.`,
      },
      whenPayFaq(st),
      {
        question: "Is the WA First Home Owner Grant the same as the stamp duty concession?",
        answer: "No. The First Home Owner Grant is a one-off payment of up to $10,000 toward buying or building a new home. The first home owner rate of duty is a concession on the duty, and it also applies to established homes. You must meet the grant's eligibility rules for either, and you can receive both on a new home (RevenueWA fact sheet, 28 July 2026).",
      },
    ],
    sources: sources(st, [
      { label: "RevenueWA: First Home Owner Grant fact sheet (eligibility and residence requirement)", href: "https://www.wa.gov.au/system/files/2026-07/first-home-owner-grant.pdf", note: "as at 28 July 2026" },
      { label: "WA Government: 2026-27 Housing Taxation Package (first home owner rate and off-the-plan concession changes)", href: "https://www.wa.gov.au/government/announcements/2026-27-housing-taxation-package", note: "transactions from 7 May 2026" },
    ]),
    related: [
      { title: "First Home Buyer Guide WA", href: "/guides/first-home-buyer-wa", description: "Grants, schemes and the WA buying process." },
      { title: "Contract of Sale in WA", href: "/guides/contract-of-sale-wa", description: "The offer and acceptance form and what it binds you to." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: {
      kind: "buyers-agent",
      lead: "Buying your first home in WA? The free buying guide walks through deposit, duty, the schemes and a step-by-step plan for the purchase.",
      ctaLabel: "Get the free buying guide",
      href: "/buying-guide",
    },
  };
}

function buildSA(): StampDutyGuide {
  const st: AustralianState = "SA";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000);
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On RevenueSA's rates checked 30 September 2026, stamp duty on a $750,000 home is ${money(e75.owner)}, an effective rate of ${pct1((e75.owner / 750_000) * 100)}. Owner-occupiers, investors and first home buyers of an established home pay the same.`,
      "First home buyers pay $0 on a new home, an off-the-plan apartment or vacant land, with no value cap for contracts from 6 June 2024. There is no relief on an established home.",
      `Duty is marginal: ${money(e5.owner)} on $500,000 and ${money(e1m.owner)} on $1,000,000.`,
      `Foreign buyers add a 7% foreign ownership surcharge, ${money(e75.foreign)} on a $750,000 home.`,
      "The calculator above and every table below use the same schedule. Confirm your figure with RevenueSA or your conveyancer before you sign.",
    ],
    editorNote: "South Australia is the odd one out. Most states hand first home buyers a duty break on any home under a threshold. SA does not. If you buy an established home in Adelaide you pay the same duty as an investor, full stop. The break SA does give sits entirely on the new-build side, so the question that decides your bill here is not your income or your price, it is whether the home is new or established.",
    whatIs: [
      "Stamp duty in South Australia is the state tax charged on the conveyance, or transfer, of land. It is the biggest upfront government cost you face after the deposit itself.",
      "The buyer pays it, not the seller, and it falls due around settlement. It is charged on the purchase price and rises on a scale, so a dearer home carries a higher bill and a higher effective rate. RevenueSA collects it, and your conveyancer handles the lodgement and payment.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      `South Australia gives no stamp duty relief on an established home, so a first home buyer pays the full rate on an existing house or unit: ${money(e75.first)} on $750,000.`,
      "Buying new is different. An eligible first home buyer pays no stamp duty on a new home, an off-the-plan apartment or vacant land to build a first home, with no cap on the value for contracts entered into on or after 6 June 2024 (RevenueSA). Before that date, full relief applied to a new home only up to $650,000, phasing out to $700,000.",
      "Our [SA first home buyer guide](/guides/first-home-buyer-sa) covers the First Home Owner Grant and the eligibility rules in full.",
    ],
    keyFigure: { value: "$0", label: "Stamp duty for an eligible SA first home buyer on a new home, off-the-plan apartment or vacant land, at any value.", context: "RevenueSA · contracts from 6 June 2024 · established homes excluded" },
    concessionIntro: [
      "SA has one schedule for every buyer. The only home-buyer relief is for first home buyers, and it turns on the kind of property, not the price.",
    ],
    concessionTables: [
      {
        caption: "Stamp duty relief for eligible first home buyers (RevenueSA, contracts from 6 June 2024)",
        head: ["Purchase", "Duty for an eligible first home buyer"],
        rows: [
          ["Established home", `Full duty (${money(e75.first)} on $750,000)`],
          ["New home", "$0, no value cap"],
          ["Off-the-plan apartment", "$0, no value cap"],
          ["Vacant land to build a first home", "$0, no value cap"],
        ],
      },
    ],
    foreign: [
      `A foreign person or foreign trust buying residential land in South Australia pays a foreign ownership surcharge of 7% of the value on top of stamp duty, for instruments from 1 January 2018 (RevenueSA). On a $750,000 home that adds ${money(e75.foreign)}.`,
    ],
    exemptions: [
      { title: "First home buyers of a new home", body: "No duty on a new home, off-the-plan apartment or vacant land for a first home, no value cap." },
      { title: "Established homes", body: `No relief for anyone: ${money(e75.owner)} on a $750,000 home.` },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "How much is stamp duty on a $800,000 house in SA?",
        answer: `On RevenueSA's rates, stamp duty on an $800,000 established home is ${money(e8.owner)}: $21,330 plus $5.50 per $100 over $500,000, an effective ${pct1((e8.owner / 800_000) * 100)}. Owner-occupiers, investors and first home buyers pay the same. An eligible first home buyer of a new home pays $0. A foreign buyer adds the 7% surcharge, ${money(e8.foreign)}.`,
      },
      {
        question: "Do first home buyers pay stamp duty in SA?",
        answer: `On an established home, yes, at the full rate: ${money(e5.first)} on a $500,000 home. On a new home, an off-the-plan apartment or vacant land to build a first home, an eligible first home buyer pays nothing, with no value cap for contracts from 6 June 2024 (RevenueSA). So whether the home is new decides the bill, not the price.`,
      },
      {
        question: "How do I avoid paying stamp duty in SA?",
        answer: `For a first home buyer, buy new: RevenueSA gives full relief on a new home, off-the-plan apartment or vacant land with no value cap (contracts from 6 June 2024), which saves ${money(e75.owner)} at $750,000. There is no relief on an established home, and no lower owner-occupier rate, so everyone else pays the schedule on this page.`,
      },
      whenPayFaq(st),
      {
        question: "Is SA stamp duty the same for an investment property?",
        answer: `Yes. South Australia charges one set of rates whoever the buyer is, so an investor pays the same as an owner-occupier: ${money(e75.investor)} on a $750,000 home and ${money(e1m.investor)} on $1,000,000 (RevenueSA). A foreign investor also pays the 7% foreign ownership surcharge.`,
      },
    ],
    sources: sources(st, []),
    related: [
      { title: "First Home Buyer Guide SA", href: "/guides/first-home-buyer-sa", description: "Grants, schemes and the SA buying process." },
      { title: "Contract of Sale in SA", href: "/guides/contract-of-sale-sa", description: "The Form 1 and what the contract binds you to." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: {
      kind: "conveyancer",
      lead: "Buying in SA and want the costs and the process in one place? The free buying guide covers stamp duty, deposit, conveyancing and a clear step-by-step plan.",
      ctaLabel: "Get the free buying guide",
      href: "/buying-guide",
    },
  };
}

function buildTAS(): StampDutyGuide {
  const st: AustralianState = "TAS";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000);
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On the State Revenue Office Tasmania rates checked 30 September 2026, transfer duty on a $750,000 home is ${money(e75.owner)}, an effective rate of ${pct1((e75.owner / 750_000) * 100)}.`,
      "The first home buyer exemption on established homes up to $750,000 ended for transfers settling after 30 June 2026. First home buyers now pay the full rate.",
      `Duty is marginal: ${money(e5.owner)} on $500,000 and ${money(e1m.owner)} on $1,000,000.`,
      `Foreign buyers add an 8% foreign investor duty surcharge, ${money(e75.foreign)} on a $750,000 home.`,
      "The calculator above and every table below use the same schedule. Confirm your figure with the State Revenue Office or your conveyancer before you sign.",
    ],
    editorNote: `Tasmania is where first home buyers lost the most on 1 July 2026. Until 30 June an eligible buyer of an established home up to $750,000 paid nothing. Now they pay the full rate, ${money(e75.owner)} on a $750,000 home, and the only help is a grant on new homes. If you were counting on the exemption, rework your cash-to-buy figure before you make an offer.`,
    whatIs: [
      "Stamp duty, formally called property transfer duty, is the tax the Tasmanian government charges when property changes hands. For most buyers it is the biggest single upfront government cost after the deposit itself.",
      "The buyer pays it, not the seller, and it is settled at or around settlement. It is calculated on the purchase price or the property's value, whichever is higher, and it sits on top of your deposit, so it is real cash you need before the keys change hands.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      "Tasmania's full duty exemption for first home buyers of an established home valued up to $750,000 applied to transfers that settled between 18 February 2024 and 30 June 2026. It is not available for transactions settling after 30 June 2026, and no duty concession replaced it (State Revenue Office Tasmania).",
      `So from 1 July 2026 a first home buyer pays the same duty as anyone else: ${money(e75.first)} on a $750,000 home. The 2026-27 Budget (20 May 2026) put the help into the First Home Owner Grant instead: $20,000 for an eligible new home, for transactions from 1 July 2026 to 30 June 2027.`,
      "Our [Tasmanian first home buyer guide](/guides/first-home-buyer-tas) covers the grant and its eligibility.",
    ],
    keyFigure: { value: "30 June 2026", label: "The last settlement date for Tasmania's first home buyer duty exemption on established homes up to $750,000.", context: "State Revenue Office Tasmania · no replacement concession" },
    concessionIntro: [
      "Tasmania has one schedule for every buyer, and since 1 July 2026 no first home buyer duty relief. The State Revenue Office's history of that relief shows how it grew and then ended:",
    ],
    concessionTables: [
      {
        caption: "First home buyer duty relief on established homes (State Revenue Office Tasmania)",
        head: ["Settled", "Relief", "Value cap"],
        rows: [
          ["7 February 2018 to 15 March 2021", "50% of duty", "$400,000"],
          ["16 March 2021 to 31 December 2021", "50% of duty", "$500,000"],
          ["1 January 2022 to 17 February 2024", "50% of duty", "$600,000"],
          ["18 February 2024 to 30 June 2026", "100% exemption", "$750,000"],
          ["From 1 July 2026", "None", "Not applicable"],
        ],
      },
    ],
    foreign: [
      `A foreign person buying residential property in Tasmania pays a foreign investor duty surcharge of 8% of the dutiable value on top of transfer duty, on or after 1 April 2020 (State Revenue Office Tasmania). On a $750,000 home that adds ${money(e75.foreign)}.`,
    ],
    exemptions: [
      { title: "First home buyers", body: "No duty relief on established homes since 1 July 2026. A $20,000 First Home Owner Grant applies to new homes from 1 July 2026 to 30 June 2027." },
      { title: "Everyone else", body: `The one schedule applies to owner-occupiers and investors alike: ${money(e75.owner)} on $750,000.` },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "How much is stamp duty on a $800,000 house in Tasmania?",
        answer: `On the State Revenue Office Tasmania rates, transfer duty on an $800,000 home is ${money(e8.owner)}: $27,810 plus $4.50 per $100 over $725,000, an effective ${pct1((e8.owner / 800_000) * 100)}. Owner-occupiers, investors and, since 1 July 2026, first home buyers all pay that figure. A foreign buyer adds the 8% surcharge, ${money(e8.foreign)}.`,
      },
      {
        question: "Do first home buyers pay stamp duty in Tasmania?",
        answer: `Yes, since 1 July 2026. The exemption on established homes up to $750,000 covered settlements from 18 February 2024 to 30 June 2026 and was not extended (State Revenue Office Tasmania). A first home buyer now pays ${money(e5.first)} on a $500,000 home. The 2026-27 Budget raised the First Home Owner Grant on new homes to $20,000 until 30 June 2027 instead.`,
      },
      {
        question: "How do I avoid paying stamp duty in Tasmania?",
        answer: `For a normal purchase you cannot: since the first home buyer exemption ended for settlements after 30 June 2026, every home buyer pays the State Revenue Office schedule, ${money(e75.owner)} on a $750,000 home. A first home buyer building or buying new can offset part of it with the $20,000 First Home Owner Grant (transactions 1 July 2026 to 30 June 2027).`,
      },
      whenPayFaq(st),
      {
        question: "Is stamp duty different for an investment property in Tasmania?",
        answer: `No. Tasmania charges one schedule whoever the buyer is, so an investor pays the same as an owner-occupier: ${money(e75.investor)} on a $750,000 home and ${money(e1m.investor)} on $1,000,000 (State Revenue Office Tasmania). A foreign investor also pays the 8% foreign investor duty surcharge.`,
      },
    ],
    sources: sources(st, [
      { label: "State Revenue Office Tasmania: First Home Owner Grant guideline ($20,000 for eligible new homes, transactions 1 July 2026 to 30 June 2027)", href: "https://www.sro.tas.gov.au/Documents/first-home-owner-grant-guideline.pdf", note: "2026-27 Budget, 20 May 2026" },
    ]),
    related: [
      { title: "First Home Buyer Guide TAS", href: "/guides/first-home-buyer-tas", description: "Grants, schemes and the Tasmanian buying process." },
      { title: "Cost of Selling a House in TAS", href: "/guides/cost-of-selling-a-house-tas", description: "The sell side of a move, line by line." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: { kind: "buyers-agent" },
  };
}

function buildACT(): StampDutyGuide {
  const st: AustralianState = "ACT";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000);
  const cap = total(st, 1_020_000);
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On the ACT Revenue Office rates checked 30 September 2026, conveyance duty on a $750,000 home is ${money(e75.owner)} for an owner-occupier and ${money(e75.investor)} for an investor.`,
      "From 1 July 2026 an eligible home buyer who has not owned property in the last five years pays no duty at any price: the Home Buyer Concession Scheme lost its income test and price cap.",
      `Duty is marginal up to $1,455,000: an owner-occupier pays ${money(e5.owner)} on $500,000 and ${money(e1m.owner)} on $1,000,000.`,
      "The ACT does not charge a foreign purchaser surcharge on duty.",
      "The calculator above and every table below use the same schedules. Confirm your figure with the ACT Revenue Office or your conveyancer before you sign.",
    ],
    editorNote: "The ACT has gone further than any state. Since 1 July 2026 an eligible buyer who has not owned property for five years pays no conveyance duty at all, whatever the price and whatever they earn. Plenty of buyers still assume the old income test applies and budget for duty they will not pay. Check your eligibility before you set your budget.",
    whatIs: [
      "Stamp duty, called conveyance duty in the ACT, is the tax the ACT Government charges when a property changes hands. After your deposit it is usually the biggest upfront cost of buying, and the buyer pays it, not the seller.",
      "You pay it once, on the purchase, normally at settlement. The ACT is part-way through a 20-year plan to replace stamp duty with general rates, so its duty rates and concessions change more often than in the states.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      "From 1 July 2026 the ACT removed both the income threshold and the property value limit from the Home Buyer Concession Scheme. An eligible buyer now pays no conveyance duty at any price (ACT Revenue Office, 2026-27 Budget).",
      "You are eligible if no buyer has owned or held an interest in property in the last five years, and at least one buyer lives in the home as their principal residence for at least 12 months from settlement. It is not limited to first home buyers: anyone who has not owned property for five years can qualify.",
      `Until 30 June 2026 the scheme was income-tested ($250,000 a year for a household with no dependent children, plus $4,600 for each child) and gave no duty only up to $1,020,000, with ${money(cap)} off above that. On a $750,000 home it now saves ${money(e75.owner)}, the full owner-occupier duty.`,
      "Our [ACT first home buyer guide](/guides/first-home-buyer-act) covers the rest of the Canberra buying process.",
    ],
    keyFigure: { value: "$0", label: "Conveyance duty for an eligible ACT home buyer who has not owned property in five years, at any price.", context: "Home Buyer Concession Scheme · ACT Revenue Office, from 1 July 2026" },
    concessionIntro: [
      `The ACT charges eligible owner-occupiers a lower rate than other buyers up to $1,455,000. The gap is ${money(e75.investor - e75.owner)} at most prices, and from $1,455,000 both pay the same flat $4.54 per $100.`,
    ],
    concessionTables: [
      {
        caption: "Eligible owner-occupier rates (ACT Revenue Office)",
        head: ["Dutiable value", "Duty"],
        rows: scheduleRows(ACT_OWNER_OCCUPIER_BRACKETS, true),
      },
      {
        caption: "Home Buyer Concession Scheme before and after 1 July 2026",
        head: ["Settled", "Income test", "Duty for an eligible buyer"],
        rows: [
          ["1 July 2024 to 30 June 2026", "$250,000, plus $4,600 per dependent child", `$0 up to $1,020,000, then ${money(cap)} off`],
          ["From 1 July 2026", "None", "$0 at any price"],
        ],
      },
    ],
    foreign: [
      "The ACT does not charge a foreign purchaser surcharge on conveyance duty: a foreign buyer pays the same duty as anyone else on the same schedule. A foreign owner of residential land does pay a land tax surcharge of 0.75% of the average unimproved value each year, from 1 July 2018 (ACT Revenue Office).",
    ],
    exemptions: [
      { title: "Home Buyer Concession Scheme", body: "No duty for an eligible buyer who has not owned property in five years, no income test or price cap from 1 July 2026." },
      { title: "Pensioner Duty Concession Scheme", body: "Price cap removed from 1 July 2026; DVA Gold Card holders no longer wait 12 months, and DVA Service Pension recipients now qualify." },
      { title: "Disability Duty Concession Scheme", body: "Price cap removed from 1 July 2026." },
      { title: "Off-the-plan unit duty exemption", body: "Price cap removed from 1 July 2026. A new exemption covers owner-occupiers buying a newly built unit-titled home not sold off the plan." },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "How much is stamp duty on a $800,000 house in the ACT?",
        answer: `On the ACT Revenue Office rates, conveyance duty on an $800,000 home is ${money(e8.owner)} for an eligible owner-occupier ($19,208 plus $5.90 per $100 over $750,000) and ${money(e8.investor)} for an investor. A buyer who qualifies for the Home Buyer Concession Scheme pays $0, since the price cap was removed on 1 July 2026. There is no foreign purchaser duty surcharge.`,
      },
      {
        question: "Do first home buyers pay stamp duty in the ACT?",
        answer: `Not if they qualify for the Home Buyer Concession Scheme. From 1 July 2026 an eligible buyer who has not owned property in the last five years, and lives in the home for 12 months, pays no conveyance duty at any price or income (ACT Revenue Office). On a $750,000 home that saves ${money(e75.owner)}.`,
      },
      {
        question: "How do I avoid paying stamp duty in the ACT?",
        answer: `The Home Buyer Concession Scheme removes it entirely for an eligible buyer who has not owned property in five years, with no income test or price cap from 1 July 2026 (ACT Revenue Office). Pensioners, people eligible for the disability concession and buyers of off-the-plan or newly unit-titled homes have their own exemptions. Otherwise an owner-occupier pays ${money(e75.owner)} on $750,000.`,
      },
      whenPayFaq(st),
      {
        question: "Does the ACT charge a foreign buyer surcharge?",
        answer: `Not on duty. A foreign buyer in the ACT pays the same conveyance duty as anyone else, ${money(e75.investor)} on a $750,000 investment, with no surcharge on top. The ACT instead charges foreign owners of residential land a land tax surcharge of 0.75% of the average unimproved value a year, from 1 July 2018 (ACT Revenue Office).`,
      },
    ],
    sources: sources(st, [
      { label: "ACT Revenue Office: About the Home Buyer Concession Scheme (eligibility, and the income thresholds that applied to 30 June 2026)", href: "https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme/about-the-home-buyer-concession-scheme", note: "read 30 September 2026" },
      { label: "ACT Revenue Office: Foreign ownership surcharge for land tax (0.75% from 1 July 2018)", href: "https://www.revenue.act.gov.au/rates-and-property-charges/land-tax/foreign-ownership-surcharge-for-land-tax", note: "read 30 September 2026" },
    ]),
    related: [
      { title: "First Home Buyer Guide ACT", href: "/guides/first-home-buyer-act", description: "Grants, schemes and the Canberra buying process." },
      { title: "Cost of Selling a House in the ACT", href: "/guides/cost-of-selling-a-house-act", description: "The sell side of a move, line by line." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: {
      kind: "conveyancer",
      href: "/selling-guide",
      lead: "Buying in Canberra and selling elsewhere first? The free guide covers the sell side: your real costs, settlement timing, and buying and selling at the same time.",
      ctaLabel: "Get the free guide",
    },
  };
}

function buildNT(): StampDutyGuide {
  const st: AustralianState = "NT";
  const e5 = exampleAt(st, 500_000), e75 = exampleAt(st, 750_000), e1m = exampleAt(st, 1_000_000), e8 = exampleAt(st, 800_000);
  return {
    state: st,
    slug: stampDutySlug(st),
    title: stampDutyTitle(st),
    metaTitle: stampDutyMetaTitle(st),
    description: stampDutyDescription(st),
    tldr: [
      `On the Territory Revenue Office rates checked 30 September 2026, stamp duty on a $750,000 home is ${money(e75.owner)}, a flat 4.95% of the value.`,
      "There is no first home buyer duty concession in the NT. The $50,000 HomeGrown Territory grant for a first new home runs to contracts signed by 30 September 2027.",
      `Below $525,000 a formula applies: ${money(e5.owner)} on a $500,000 home, an effective ${pct1((e5.owner / 500_000) * 100)}. From $525,000 it is 4.95% of the whole price, ${money(e1m.owner)} on $1,000,000.`,
      "The NT does not charge a foreign purchaser surcharge.",
      "The calculator above and every table below use the same schedule. Confirm your figure with the Territory Revenue Office or your conveyancer before you sign.",
    ],
    editorNote: `The Northern Territory is the odd one out. There is no first home concession on the duty at all, so a first home buyer pays the same ${money(e75.owner)} on a $750,000 home as everyone else. The $50,000 HomeGrown Territory grant gets the attention, but it lands as cash toward a new home. It does nothing to the duty bill.`,
    whatIs: [
      "Stamp duty, called conveyance duty in the legislation, is the tax the Northern Territory charges when property changes hands. For most buyers it is the largest upfront government cost after the deposit itself.",
      "The buyer pays it, not the seller. It is calculated on the dutiable value, usually the purchase price, and it falls due at settlement. Because there is no first home concession and no owner-occupier rate, every buyer at a given price pays the same duty, so the rate table below is the whole story.",
    ],
    howCalculated: howCalculated(st),
    firstHome: [
      `The Northern Territory has no first home buyer stamp duty concession: a first home buyer pays ${money(e75.first)} on a $750,000 home, the same as anyone else (Territory Revenue Office).`,
      "The help comes as a grant. The HomeGrown Territory grant pays $50,000 to an eligible first home buyer who buys or builds a new home, for contracts signed between 1 October 2024 and 30 September 2027. The $10,000 grant for an established home applied to contracts signed from 1 October 2024 to 30 September 2025 and has closed.",
      "A grant does not reduce the duty; it arrives as cash toward the purchase. Our [NT first home buyer guide](/guides/first-home-buyer-nt) covers the eligibility rules.",
    ],
    keyFigure: { value: "$50,000", label: "The HomeGrown Territory grant for an eligible first home buyer buying or building a new home. It is a grant, not a duty concession.", context: "Territory Revenue Office · contracts 1 October 2024 to 30 September 2027" },
    concessionIntro: [
      "The Territory has no duty concessions for home buyers. Its first home help is paid as grants:",
    ],
    concessionTables: [
      {
        caption: "HomeGrown Territory grants for first home buyers (Territory Revenue Office)",
        head: ["Grant", "Amount", "Contracts signed"],
        rows: [
          ["New home, bought or built", "$50,000", "1 October 2024 to 30 September 2027"],
          ["Established home", "$10,000", "1 October 2024 to 30 September 2025 (closed)"],
        ],
      },
    ],
    foreign: [
      "The Northern Territory does not charge a foreign purchaser stamp duty surcharge. A foreign buyer pays the same duty as a local buyer at the same price, which sets the Territory apart from every state (Territory Revenue Office).",
    ],
    exemptions: [
      { title: "First home buyers", body: "No duty concession. The HomeGrown Territory grant pays $50,000 toward a first new home instead." },
      { title: "Everyone else", body: `One schedule for all buyers: ${money(e75.owner)} on a $750,000 home.` },
    ],
    whenPay: whenPay(st),
    faqs: [
      {
        question: "How much is stamp duty on a $800,000 house in the NT?",
        answer: `${money(e8.owner)}. Above $525,000 the Territory Revenue Office charges a flat 4.95% of the whole value, so an $800,000 home costs 4.95% of $800,000. First home buyers, owner-occupiers, investors and foreign buyers all pay that figure, because the NT has no concession and no foreign surcharge. A first home buyer building new may get the $50,000 HomeGrown Territory grant.`,
      },
      {
        question: "Do first home buyers pay stamp duty in the NT?",
        answer: `Yes, at the full rate: ${money(e5.first)} on a $500,000 home and ${money(e75.first)} on $750,000 (Territory Revenue Office). The NT helps first home buyers with grants instead: $50,000 toward a new home for contracts signed from 1 October 2024 to 30 September 2027. The $10,000 established-home grant closed to contracts after 30 September 2025.`,
      },
      {
        question: "How do I avoid paying stamp duty in the NT?",
        answer: `On a normal purchase you cannot: the Territory has no first home, owner-occupier or foreign-buyer variations, so everyone pays the same schedule, ${money(e75.owner)} on $750,000 (Territory Revenue Office). A first home buyer choosing a new home can offset most of it with the $50,000 HomeGrown Territory grant, for contracts signed by 30 September 2027.`,
      },
      whenPayFaq(st),
      {
        question: "Does the NT charge a foreign buyer stamp duty surcharge?",
        answer: `No. The Northern Territory is one of only two places in Australia, with the ACT, that does not add a foreign purchaser surcharge to duty. A foreign buyer pays the same ${money(e75.owner)} on a $750,000 home as a local buyer, where NSW would add 9% and Victoria and Queensland 8% (Territory Revenue Office; state revenue offices, checked 30 September 2026).`,
      },
    ],
    sources: sources(st, [
      { label: "Territory Revenue Office: HomeGrown Territory grants (extended scheme dates)", href: "https://treasury.nt.gov.au/dtf/territory-revenue-office/whats-new/extended-scheme-dates-for-homegrown-territory-grants", note: "read 30 September 2026" },
    ]),
    related: [
      { title: "First Home Buyer Guide NT", href: "/guides/first-home-buyer-nt", description: "Grants, schemes and the Territory buying process." },
      { title: "Cost of Selling a House in the NT", href: "/guides/cost-of-selling-a-house-nt", description: "The sell side of a move, line by line." },
      { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
      { title: "Conveyancing in Australia", href: "/guides/conveyancing-guide", description: "What conveyancers do and what they cost." },
    ],
    cta: {
      kind: "buyers-agent",
      href: "/selling-guide",
      lead: "Buying your first place in the Territory and a sale is part of the move? The free selling guide covers costs, timing and selling and buying at once.",
      ctaLabel: "Get the free guide",
    },
  };
}

export const STAMP_DUTY_GUIDES: Record<AustralianState, StampDutyGuide> = {
  NSW: buildNSW(),
  VIC: buildVIC(),
  QLD: buildQLD(),
  WA: buildWA(),
  SA: buildSA(),
  TAS: buildTAS(),
  ACT: buildACT(),
  NT: buildNT(),
};

/** Geographic neighbours first, then the rest, for the "other states" links. */
export const NEIGHBOURS: Record<AustralianState, AustralianState[]> = {
  NSW: ["QLD", "VIC", "ACT", "SA"],
  VIC: ["NSW", "SA", "TAS"],
  QLD: ["NSW", "NT", "SA"],
  WA: ["SA", "NT"],
  SA: ["VIC", "NSW", "WA", "NT", "QLD"],
  TAS: ["VIC"],
  ACT: ["NSW"],
  NT: ["WA", "QLD", "SA"],
};

export function otherStates(state: AustralianState): AustralianState[] {
  const first = NEIGHBOURS[state];
  return [...first, ...AUSTRALIAN_STATES.filter((s) => s !== state && !first.includes(s))];
}
