import type { Suburb } from "@/types";
import type { Agent, Agency } from "@/types/agent";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
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

export function buildSuburbAgentsModel(
  suburb: Suburb,
  agents: Agent[],
  agencies: Agency[],
  listingsEnabled = AGENT_LISTINGS_ENABLED,
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
  faqs.push({
    question: `How do I find a good real estate agent in ${sn}?`,
    answer: `Look for agents with recent sales in ${sn} itself, not just the wider area, and ask each for the comparable sales behind their price opinion. Compare two or three on their answers, their fee and marketing costs, and how they will report to you during the campaign. Where we have an agent who covers ${sn}, Your Property Guide can introduce you to one; where we don't, we tell you rather than pass your details on.`,
  });
  faqs.push({
    question: `Do I have to pay to be matched with an agent in ${sn}?`,
    answer: `No. Requesting a match or an appraisal through Your Property Guide is free and carries no obligation to list. Your details go to one agent only, and that agent pays us a fee for the introduction, whether or not you list with them. The agent pays it from their own pocket. We never charge you, and you negotiate commission directly with the agent.`,
  });

  const title = `Real Estate Agents in ${sn} ${suburb.state} ${suburb.postcode}`;
  const description = commission && median
    ? `Real estate agents in ${sn}: what they charge on the ${formatPriceFull(median)} ${provenance?.basis === "area" ? "ABS area " : ""}median (${provenance?.sourceShort ?? "published"}, ${commission.lowPct}% to ${commission.highPct}%), how to choose, and a free appraisal.`
    : `Real estate agents in ${sn} ${suburb.postcode}: what they charge, how to choose one, and how to ask a local agent for a free appraisal.`;

  return {
    title,
    description,
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
