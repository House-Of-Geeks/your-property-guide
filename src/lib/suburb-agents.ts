import type { Suburb } from "@/types";
import type { Agent, Agency } from "@/types/agent";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { formatPriceFull } from "@/lib/utils/format";

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

export interface SuburbAgentsModel {
  title: string;
  description: string;
  /** Indexable only where the median clears the reliable-price gate. */
  indexable: boolean;
  medianHousePrice: number | null;
  commission: CommissionOnMedian | null;
  agents: Agent[];
  agencies: Agency[];
  faqs: { question: string; answer: string }[];
  matchSource: string;
  appraisalSource: string;
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
  const shownAgents = listingsEnabled ? agents : [];
  const shownAgencies = listingsEnabled ? agencies : [];

  const faqs: { question: string; answer: string }[] = [];
  if (commission && median) {
    faqs.push({
      question: `What do real estate agents charge in ${sn}?`,
      answer: `Agents in ${suburb.state} typically charge ${commission.lowPct}% to ${commission.highPct}% of the sale price, with around ${commission.typicalPct}% common. On ${sn}'s median house price of ${formatPriceFull(median)} that is roughly ${formatPriceFull(commission.lowAmount)} to ${formatPriceFull(commission.highAmount)} before GST and marketing. Commission is negotiable in every state.`,
    });
  }
  faqs.push({
    question: `How do I find a good real estate agent in ${sn}?`,
    answer: `Look for agents with recent sales in ${sn} itself, not just the wider area, and ask each for the comparable sales behind their price opinion. Compare two or three on their answers, their fee and marketing costs, and how they will report to you during the campaign. Your Property Guide can match you with one agent who sells in ${sn}; request a match on this page.`,
  });
  faqs.push({
    question: `Do I have to pay to be matched with an agent in ${sn}?`,
    answer: `No. Requesting a match or an appraisal through Your Property Guide is free and carries no obligation to list. Your details go to one agent only, and that agent pays us a fee for the introduction, whether or not you list with them. The agent pays it from their own pocket. We never charge you, and you negotiate commission directly with the agent.`,
  });

  const title = `Real Estate Agents in ${sn} ${suburb.state} ${suburb.postcode}`;
  const description = commission && median
    ? `Real estate agents in ${sn}: what they charge on the ${formatPriceFull(median)} median (${commission.lowPct}% to ${commission.highPct}%), how to choose, and a free match with one local agent.`
    : `Real estate agents in ${sn} ${suburb.postcode}: what they charge, how to choose, and a free match with one local agent.`;

  return {
    title,
    description,
    indexable: reliable,
    medianHousePrice: median,
    commission,
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
