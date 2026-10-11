import type { Suburb } from "@/types";
import type { Agent, Agency } from "@/types/agent";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { STATE_NAMES, STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { AUSSIE_GUIDE, CAV_PROPERTY_PRICES, NSW_AGENCY_AGREEMENTS, QLD_COMMISSION, cite, valuationCostCited } from "@/lib/data/appraisal-sources";
import { formatPriceFull } from "@/lib/utils/format";
import { describeSalesProvenance, type SalesProvenance } from "@/lib/sales-provenance";
import { medianCaption, withheldNote } from "@/lib/value-range";
import { buildHomeValueSummary } from "@/lib/home-value";

/**
 * "Real estate agents in {Suburb}" pages (valuation plan item 4).
 *
 * Lead-gen first: the page answers the search with what agents here charge,
 * how to choose one, the suburb's prices, and a match request. The agent
 * listing is built but switched off until the directory holds real, consenting
 * agents: the Agent table currently carries placeholder profiles only (agent
 * directory paused 3 Jul 2026). Flip AGENT_LISTINGS_ENABLED when it does.
 */
export const AGENT_LISTINGS_ENABLED = false;

export interface CommissionOnMedian {
  lowPct: number;
  highPct: number;
  typicalPct: number;
  lowAmount: number;
  highAmount: number;
  typicalAmount: number;
}

/** The state's typical range, read straight from STATE_RATES. */
export interface StateCommissionRange {
  lowPct: number;
  highPct: number;
  typicalPct: number;
}

/** A commission worked on an example sale price (labelled as an example, never as the suburb's figure). */
export interface CommissionOnExample extends CommissionOnMedian {
  price: number;
}

/**
 * Sale prices the fees section works the state range on when the suburb has
 * no published median. Round figures, printed as examples, so they cannot be
 * read as a local price.
 */
export const EXAMPLE_SALE_PRICES: readonly number[] = [750_000, 1_000_000, 1_500_000];

/**
 * Where the rule that commission is agreed, not set, is stated by the state
 * itself. Only states whose own page was read are listed; the others print
 * the rule without a citation. The ranges are Your Property Guide's typical
 * figures (STATE_RATES), explained in each state's commission guide.
 */
export const COMMISSION_RULE_SOURCES: Partial<Record<StateCode, { label: string; href: string; says: string; asAt: string }>> = {
  NSW: {
    label: "NSW Government, Agency agreements for the sale of property in NSW",
    href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/agency-agreements",
    says: "you can negotiate the commission, fees and expenses with the agent",
    asAt: "updated 8 July 2026, read 11 October 2026",
  },
  VIC: {
    label: "Consumer Affairs Victoria, Authorities, rebates and commission",
    href: "https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents/running-your-business/authorities-commissions-and-contracts/authorities-rebates-and-commission",
    says: "the agent must tell you that commission and expenses are negotiable before you sign",
    asAt: "updated 12 October 2023, read 11 October 2026",
  },
  QLD: {
    label: "Queensland Government, Charging commission for selling and letting",
    href: "https://www.qld.gov.au/community/fair-trading/regulated-industries-licensing-and-legislation/property-industry-regulation/legal-requirements-for-the-property-industry/charging-commission-for-selling-and-letting-in-the-property-industry",
    says: "the government sets no limit on commission, and it is set in writing, including GST, when you appoint the agent",
    asAt: "updated 20 October 2020, read 11 October 2026",
  },
};

/** The median's source and period, as the suburb profile prints it, plus the phrases the agents page needs. */
export interface AgentsMedianProvenance {
  /** "Median house price in Williamstown" or "Median house price, ABS statistical area (SA2) for East Devonport". */
  caption: string;
  /** The provenance sentence the instant range prints (describeSalesProvenance). */
  sentence: string;
  /** "Land Victoria", "NSW Valuer General", "ABS". */
  sourceShort: string;
  /** "the latest published quarter, updated May 2026", "calendar 2025", "2024". */
  period: string;
  basis: "suburb" | "area";
}

export interface SuburbAgentsModel {
  title: string;
  description: string;
  /** The first sentence under the H1: the fee range worked on the median, or on an example price. */
  intro: string;
  /** Indexable only where the median clears the reliable-price gate. */
  indexable: boolean;
  medianHousePrice: number | null;
  /**
   * The state's own range, printed on every page whether or not the median
   * is published (until 10 Oct 2026 a page without a median printed a
   * national "1.6% to 3.25%" string: Victoria's low and Tasmania's high).
   */
  stateRange: StateCommissionRange | null;
  commission: CommissionOnMedian | null;
  /** Source, period and geography of the published median; null when none is published. */
  provenance: AgentsMedianProvenance | null;
  /** The median in words for a sentence: "Williamstown's median house price of $1,600,000" or "the ABS statistical-area (SA2) median house price for East Devonport, $473,000". */
  medianPhrase: string | null;
  /**
   * Why no house median is printed, in the words the instant range uses
   * (withheldNote): the recorded sales count and period where the feed has
   * too few, otherwise that no trusted feed covers the suburb. Null when the
   * median is published.
   */
  withheldNote: string | null;
  /** A published unit median shown where the house median is withheld, with its own source line. */
  unitMedian: { price: number; provenance: string } | null;
  /** The state range worked on EXAMPLE_SALE_PRICES; empty when the median is published. */
  examples: CommissionOnExample[];
  agents: Agent[];
  agencies: Agency[];
  faqs: { question: string; answer: string }[];
  matchSource: string;
  appraisalSource: string;
}

export function stateCommissionRange(state: string): StateCommissionRange | null {
  const rates = STATE_RATES[state as StateCode];
  if (!rates) return null;
  return { lowPct: rates.low, highPct: rates.high, typicalPct: rates.typical };
}

export function commissionOnMedian(state: string, median: number): CommissionOnMedian | null {
  const rates = STATE_RATES[state as StateCode];
  if (!rates || median <= 0) return null;
  const amt = (pct: number) => Math.round((median * pct) / 100);
  return {
    lowPct: rates.low,
    highPct: rates.high,
    typicalPct: rates.typical,
    lowAmount: amt(rates.low),
    highAmount: amt(rates.high),
    typicalAmount: amt(rates.typical),
  };
}

/** Title budget before the " | Your Property Guide" suffix (tests/seo/titles.test.ts). */
export const AGENTS_TITLE_BUDGET = 60;

/**
 * "Real Estate Agents in Lane Cove, NSW: Fees & Free Appraisal". Suburb
 * appraisal searches ("{suburb} property appraisal", "home appraisals
 * {suburb}") land on these pages at 13.9 on average (1 to 7 Oct 2026), so
 * the title carries "Appraisal". The postcode stays only where another
 * locality in the state shares the name (Lilli Pilli NSW 2229 and 2536).
 * Long names drop the state, then "Fees", so the title stays inside 60.
 */
export function agentsPageTitle(name: string, state: string, postcode: string, keepPostcode = false): string {
  const place = keepPostcode ? `${name} ${postcode}` : `${name}, ${state}`;
  const short = keepPostcode ? `${name} ${postcode}` : name;
  const candidates = [
    `Real Estate Agents in ${place}: Fees & Free Appraisal`,
    `${short} Real Estate Agents: Fees & Free Appraisal`,
    `${short} Real Estate Agents & Free Appraisal`,
    `${short} Real Estate Agents & Appraisal`,
    `${short} Real Estate Agents`,
  ];
  return candidates.find((t) => t.length <= AGENTS_TITLE_BUDGET) ?? candidates[candidates.length - 1];
}

const DIRECTIONS = ["North", "South", "East", "West", "Central", "Upper", "Lower"] as const;

/** "Kew East" -> "Kew", "North Batemans Bay" -> "Batemans Bay"; null for a name with no direction. */
export function parentLocalityName(name: string): string | null {
  for (const d of DIRECTIONS) {
    if (name.startsWith(`${d} `) && name.length > d.length + 1) return name.slice(d.length + 1);
    if (name.endsWith(` ${d}`) && name.length > d.length + 1) return name.slice(0, -(d.length + 1));
  }
  return null;
}

/** "Kew" -> ["North Kew", "Kew North", ...]: the names a directional neighbour would carry. */
export function directionalVariants(name: string): string[] {
  return DIRECTIONS.flatMap((d) => [`${d} ${name}`, `${name} ${d}`]);
}

/** A neighbour row as the page reads it, already through the agents sitemap gate or not. */
export interface NearbyAgentsRow {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  /** The neighbour's agents page is indexable (a published house median: hasPublishedHouseMedian). */
  indexable: boolean;
}

export interface NearbyAgentsLink {
  href: string;
  label: string;
}

/** How many neighbour links an agents page carries. */
export const MAX_NEARBY_AGENT_LINKS = 8;

/**
 * Links to neighbouring agents pages: only pages that are indexable (the
 * same rule as the agents sitemap), never the suburb itself or another row
 * of the same name (duplicate postcode rows), the parent locality first on a
 * directional name (Kew East links Kew first), then the directional
 * variants of this name (Kew links Kew East), then the stored neighbours in
 * their own order. Each agents page had one in-content inlink on 10 Oct 2026.
 */
export function pickNearbyAgentLinks(
  self: { slug: string; name: string; state: string },
  nearbySlugs: readonly string[],
  rows: readonly NearbyAgentsRow[],
  max = MAX_NEARBY_AGENT_LINKS,
): NearbyAgentsLink[] {
  const usable = rows.filter((r) => r.indexable && r.slug !== self.slug && r.name !== self.name && r.state === self.state);
  const bySlug = new Map(usable.map((r) => [r.slug, r]));
  const parent = parentLocalityName(self.name);
  const variants = new Set(directionalVariants(self.name));
  const ordered: NearbyAgentsRow[] = [
    ...usable.filter((r) => parent !== null && r.name === parent),
    ...usable.filter((r) => variants.has(r.name)),
    ...nearbySlugs.flatMap((sl) => (bySlug.has(sl) ? [bySlug.get(sl)!] : [])),
  ];
  const seen = new Set<string>();
  const picked = ordered.filter((r) => (seen.has(r.slug) ? false : (seen.add(r.slug), true))).slice(0, max);
  const nameCount = new Map<string, number>();
  for (const r of picked) nameCount.set(r.name, (nameCount.get(r.name) ?? 0) + 1);
  return picked.map((r) => ({
    href: `/suburbs/${r.slug}/agents`,
    label: `Real estate agents in ${r.name}${(nameCount.get(r.name) ?? 0) > 1 ? ` ${r.postcode}` : ""}`,
  }));
}

/** Options the page passes in from its database reads. */
export interface SuburbAgentsOptions {
  /** Another locality in the same state carries this name: keep the postcode in the title. */
  nameShared?: boolean;
}

export function buildSuburbAgentsModel(
  suburb: Suburb,
  agents: Agent[],
  agencies: Agency[],
  listingsEnabled = AGENT_LISTINGS_ENABLED,
  opts: SuburbAgentsOptions = {},
): SuburbAgentsModel {
  const sn = suburb.name;
  const reliable = hasReliablePrice(suburb);
  const median = reliable ? suburb.stats.medianHousePrice : null;
  const commission = median ? commissionOnMedian(suburb.state, median) : null;
  const prov: SalesProvenance | null = median
    ? describeSalesProvenance({
        source: suburb.dataFreshness?.salesSource,
        periodEnd: suburb.dataFreshness?.salesPeriodEnd,
        updatedAt: suburb.dataFreshness?.salesAsOf,
        salesCount: suburb.dataFreshness?.salesCount,
        suburbName: sn,
      })
    : null;
  const provenance: AgentsMedianProvenance | null = prov
    ? {
        caption: medianCaption({ name: sn, basis: prov.geography }, "house"),
        sentence: prov.sentence,
        sourceShort: prov.sourceShort,
        period: prov.periodShort,
        basis: prov.geography,
      }
    : null;
  const medianPhrase = median
    ? provenance?.basis === "area"
      ? `the ABS statistical-area (SA2) median house price for ${sn}, ${formatPriceFull(median)}`
      : `${sn}'s median house price of ${formatPriceFull(median)}`
    : null;
  const summary = buildHomeValueSummary(suburb);
  const withheld = median ? null : withheldNote(summary, "house");
  const unitMedian = !median && summary.medianUnitPrice && summary.unitProvenance
    ? { price: summary.medianUnitPrice, provenance: summary.unitProvenance }
    : null;
  const stateRange = stateCommissionRange(suburb.state);
  const examples: CommissionOnExample[] = commission
    ? []
    : EXAMPLE_SALE_PRICES.flatMap((price) => {
        const c = commissionOnMedian(suburb.state, price);
        return c ? [{ ...c, price }] : [];
      });
  const shownAgents = listingsEnabled ? agents : [];
  const shownAgencies = listingsEnabled ? agencies : [];

  const faqs: { question: string; answer: string }[] = [];
  if (commission && median && medianPhrase) {
    const cite = provenance ? ` (${provenance.sourceShort}, ${provenance.period})` : "";
    faqs.push({
      question: `What do real estate agents charge in ${sn}?`,
      answer: `Agents in ${suburb.state} typically charge ${commission.lowPct}% to ${commission.highPct}% of the sale price, with around ${commission.typicalPct}% common. On ${medianPhrase}${cite}, that is roughly ${formatPriceFull(commission.lowAmount)} to ${formatPriceFull(commission.highAmount)} before GST and marketing. Commission is agreed with the agent and can be negotiated.`,
    });
  } else if (stateRange) {
    const example = examples.find((e) => e.price === 1_000_000);
    faqs.push({
      question: `What do real estate agents charge in ${sn}?`,
      answer: `Agents in ${suburb.state} typically charge ${stateRange.lowPct}% to ${stateRange.highPct}% of the sale price, with around ${stateRange.typicalPct}% common.${example ? ` On a ${formatPriceFull(example.price)} sale, an example price rather than ${sn}'s own, that is roughly ${formatPriceFull(example.lowAmount)} to ${formatPriceFull(example.highAmount)} before GST and marketing.` : ""} Commission is agreed with the agent and can be negotiated.`,
    });
  }
  const estimateRule =
    suburb.state === "NSW"
      ? ` In NSW the agency agreement must state the agent's estimated selling price, and if it is a range the top cannot be more than 10% above the bottom (${cite(NSW_AGENCY_AGREEMENTS, "NSW Government, Agency agreements")}).`
      : suburb.state === "VIC"
        ? ` In Victoria the agent's estimated selling price must be reasonable and based on comparable sales, and the Property Price Statement buyers see shows a price or a range of up to 10% (${cite(CAV_PROPERTY_PRICES, "Consumer Affairs Victoria")}).`
        : "";
  faqs.push({
    question: `How do I find a good real estate agent in ${sn}?`,
    answer: `Look for agents with recent sales in ${sn} itself, not just the wider area, and ask each for the comparable sales behind their price opinion. Compare two or three on their answers, their fee and marketing costs, and how they will report to you during the campaign.${estimateRule} Where we have an agent who covers ${sn}, Your Property Guide can introduce you to one; where we don't, we tell you rather than pass your details on.`,
  });
  faqs.push({
    question: `Is a property appraisal in ${sn} free?`,
    answer: `Yes. Agents commonly appraise a home at no cost when you are thinking of selling (${cite(AUSSIE_GUIDE, "Aussie")}), and an appraisal does not commit you to list with them. A formal valuation from a licensed valuer is different: a paid report, typically ${valuationCostCited()}, that a lender or a court can rely on.`,
  });
  const notSoldRule =
    suburb.state === "NSW"
      ? ` In NSW the agreement must carry a warning if commission is payable even when a sale is not completed (${cite(NSW_AGENCY_AGREEMENTS, "NSW Government, Agency agreements")}).`
      : suburb.state === "QLD"
        ? ` In Queensland the appointment must set the commission in writing, including GST, and say whether commission may still apply if the sale does not go through (${cite(QLD_COMMISSION, "Queensland Government")}).`
        : "";
  faqs.push({
    question: `Do real estate agents in ${sn} get paid if the house doesn't sell?`,
    answer: `It depends on the agency agreement, so read its commission and expenses clauses before you sign: they say when commission is earned and which costs, such as marketing, you pay either way.${notSoldRule}`,
  });
  faqs.push({
    question: `Do I have to pay to be matched with an agent in ${sn}?`,
    answer: `No. Requesting a match or an appraisal through Your Property Guide is free and carries no obligation to list. Your details go to one agent only, and that agent pays us a fee for the introduction, whether or not you list with them. The agent pays it from their own pocket. We never charge you, and you negotiate commission directly with the agent.`,
  });

  const title = agentsPageTitle(sn, suburb.state, suburb.postcode, opts.nameShared ?? false);
  const stateName = STATE_NAMES[suburb.state as StateCode] ?? suburb.state;
  const descriptionCandidates = commission && median
    ? [
        `Real estate agents in ${sn}: ${commission.lowPct}% to ${commission.highPct}% commission on the ${formatPriceFull(median)} ${provenance?.basis === "area" ? "ABS area " : ""}median (${provenance?.sourceShort ?? "published"}), how to choose one, and a free appraisal.`,
        `Agents in ${sn}: ${commission.lowPct}% to ${commission.highPct}% commission on the ${formatPriceFull(median)} ${provenance?.basis === "area" ? "ABS area " : ""}median (${provenance?.sourceShort ?? "published"}), and a free appraisal.`,
      ]
    : stateRange
      ? [
          `Real estate agents in ${sn} ${suburb.postcode}: ${stateRange.lowPct}% to ${stateRange.highPct}% commission in ${suburb.state}, how to choose one, and how to ask for a free appraisal.`,
          `Agents in ${sn} ${suburb.postcode}: ${stateRange.lowPct}% to ${stateRange.highPct}% commission in ${suburb.state}, and a free appraisal.`,
        ]
      : [`Real estate agents in ${sn} ${suburb.postcode}: what they charge, how to choose one, and how to ask for a free appraisal.`];
  const description = descriptionCandidates.find((d) => d.length <= 160) ?? descriptionCandidates[descriptionCandidates.length - 1];
  const example = examples.find((e) => e.price === 1_000_000);
  const intro = commission && medianPhrase
    ? `Agents in ${sn} typically charge ${commission.lowPct}% to ${commission.highPct}% of the sale price, about ${formatPriceFull(commission.lowAmount)} to ${formatPriceFull(commission.highAmount)} on ${medianPhrase}${provenance ? ` (${provenance.sourceShort}, ${provenance.period})` : ""}. Here is how to choose one and how to get a free appraisal.`
    : stateRange && example
      ? `Agents in ${stateName} typically charge ${stateRange.lowPct}% to ${stateRange.highPct}% of the sale price, ${formatPriceFull(example.lowAmount)} to ${formatPriceFull(example.highAmount)} on a ${formatPriceFull(example.price)} sale. Here is how to choose one in ${sn} and how to get a free appraisal.`
      : `How to choose an agent in ${sn}, what they charge, and how to get a free appraisal.`;

  return {
    title,
    description,
    intro,
    indexable: reliable,
    medianHousePrice: median,
    stateRange,
    commission,
    provenance,
    medianPhrase,
    withheldNote: withheld,
    unitMedian,
    examples,
    agents: shownAgents,
    agencies: shownAgencies,
    faqs,
    matchSource: `suburb-agents-${suburb.slug}`,
    appraisalSource: `suburb-agents-${suburb.slug}-appraisal`,
  };
}

/** Five points a seller can act on, drawn from the questions-to-ask and how-to-choose guides. */
export const CHOOSING_POINTS: readonly { point: string; detail: string }[] = [
  { point: "Recent sales in this suburb, not the region", detail: "Ask for the last five sales they handled here and how each compared with its first price guide." },
  { point: "The comparable sales behind their number", detail: "A price opinion without three or four comparable sales beside it is a guess. Ask to see them." },
  { point: "Fee, marketing and GST, all-in", detail: "A rate quoted excluding GST is 10% higher than it sounds. Get the marketing budget itemised and ask what happens if it does not sell." },
  { point: "Method of sale and why", detail: "Auction, private treaty or expressions of interest. The right answer depends on the suburb and the property, and a good agent will explain the trade-off." },
  { point: "How they report to you", detail: "Weekly written updates, buyer feedback after every inspection, and one point of contact. Agree it before you sign." },
];
