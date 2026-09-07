// What it costs to sell in each state: the summary table on the state
// commission guides (fix item 10). Commission comes from commission-rates.ts;
// the other lines are indicative ranges, labelled as such on the page,
// because agents, conveyancers and lenders quote them individually and no
// state publishes a survey. The state-documents line names what the law
// requires the seller to prepare, with the government source that says so.
import { STATE_NAMES, STATE_RATES, type StateCode } from "./commission-rates";

export const SELLING_COSTS_AS_AT = "September 2026";

export interface CostSource {
  label: string;
  href: string;
}

export type CostApplies = "always" | "auction" | "loan";

export interface CostLine {
  key: string;
  label: string;
  low: number;
  high: number;
  note: string;
  applies: CostApplies;
  source?: CostSource;
}

interface StateDocuments {
  label: string;
  low: number;
  high: number;
  note: string;
  source: CostSource;
}

/** The sale price each guide already works its examples at. */
export const EXAMPLE_PRICE: Record<StateCode, number> = {
  NSW: 800_000, VIC: 800_000, QLD: 800_000, SA: 800_000, WA: 600_000, TAS: 600_000, ACT: 800_000, NT: 800_000,
};

const MARKETING: CostLine = { key: "marketing", label: "Marketing and photography", low: 2_000, high: 8_000, note: "Portal listing, photography, floor plan and signboard. Quoted by the agent and payable whether or not the property sells.", applies: "always" };
const CONVEYANCING: CostLine = { key: "conveyancing", label: "Conveyancing or solicitor", low: 800, high: 2_500, note: "Professional fee plus searches and disbursements.", applies: "always" };
const AUCTIONEER: CostLine = { key: "auctioneer", label: "Auctioneer", low: 400, high: 1_200, note: "Only if you sell at auction; sometimes included in the agency agreement.", applies: "auction" };
const DISCHARGE: CostLine = { key: "discharge", label: "Mortgage discharge", low: 150, high: 400, note: "The lender's fee to release the mortgage at settlement. Break costs on a fixed-rate loan are separate and can be far larger.", applies: "loan" };

export const STATE_DOCUMENTS: Record<StateCode, StateDocuments> = {
  NSW: { label: "Contract of sale documents", low: 300, high: 600, note: "Title search, the Section 10.7 planning certificate and a sewer diagram, attached to the contract before the property can be offered for sale.", source: { label: "NSW Government: Selling property in NSW", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property" } },
  VIC: { label: "Section 32 vendor statement", low: 300, high: 800, note: "Title, planning, water and council certificates, plus an owners corporation certificate for a unit, given to the buyer before they sign.", source: { label: "Consumer Affairs Victoria: Selling property", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property" } },
  QLD: { label: "Seller disclosure statement (Form 2)", low: 200, high: 700, note: "Required since 1 August 2025: title search, plan and the prescribed certificates, plus a body corporate certificate for a unit.", source: { label: "Queensland Government: Seller disclosure scheme", href: "https://www.qld.gov.au/housing/buying-owning-home/seller-disclosure-scheme" } },
  SA: { label: "Form 1 vendor's statement", low: 300, high: 600, note: "The statutory searches the agent or conveyancer gathers before the buyer signs; the agent prepares the form when one is appointed.", source: { label: "Law Handbook SA: Form 1", href: "https://lawhandbook.sa.gov.au/ch23s09s01.php" } },
  WA: { label: "Title search and strata certificate", low: 100, high: 400, note: "No vendor statement is required in WA; a strata lot needs a strata information certificate for the buyer.", source: { label: "Consumer Protection WA: Selling property", href: "https://www.consumerprotection.wa.gov.au/selling-property" } },
  TAS: { label: "Contract and council certificates", low: 200, high: 500, note: "Contract preparation plus the council and water certificates the buyer's conveyancer expects.", source: { label: "CBOS Tasmania: Buying and selling property", href: "https://www.cbos.tas.gov.au/topics/housing/buying-selling-property" } },
  ACT: { label: "Pre-sale reports (building, pest, EER)", low: 800, high: 1_500, note: "A building and compliance inspection report, a pest report and an energy efficiency rating, which the seller must have before the property is advertised.", source: { label: "Civil Law (Sale of Residential Property) Act 2003 (ACT)", href: "https://www.legislation.act.gov.au/a/2003-40/" } },
  NT: { label: "Contract and title search", low: 100, high: 300, note: "No vendor statement is required in the NT; the agency agreement sets out the fees and the estimated selling price.", source: { label: "NT Government: Dealing with a real estate agent", href: "https://nt.gov.au/property/buying-and-selling-a-home/ways-to-buy-or-sell-a-home/dealing-with-a-real-estate-agent" } },
};

export interface SellingCostTableData {
  state: StateCode;
  stateName: string;
  price: number;
  commission: { low: number; high: number; typical: number; lowAmount: number; highAmount: number; typicalAmount: number };
  lines: CostLine[];
  documents: StateDocuments;
  /** Private treaty, no mortgage, everything at the bottom of its range. */
  totalLow: number;
  /** Auction with a mortgage, everything at the top of its range. */
  totalHigh: number;
  totalLowPct: number;
  totalHighPct: number;
}

const round = (n: number) => Math.round(n);
const pct = (n: number, price: number) => Math.round((n / price) * 1000) / 10;

export function sellingCostTable(state: StateCode): SellingCostTableData {
  const price = EXAMPLE_PRICE[state];
  const r = STATE_RATES[state];
  const documents = STATE_DOCUMENTS[state];
  const docLine: CostLine = { key: "documents", label: documents.label, low: documents.low, high: documents.high, note: documents.note, applies: "always", source: documents.source };
  const lines = [MARKETING, CONVEYANCING, docLine, AUCTIONEER, DISCHARGE];
  const commission = {
    ...r,
    lowAmount: round((price * r.low) / 100),
    highAmount: round((price * r.high) / 100),
    typicalAmount: round((price * r.typical) / 100),
  };
  const totalLow = commission.lowAmount + lines.filter((l) => l.applies === "always").reduce((s, l) => s + l.low, 0);
  const totalHigh = commission.highAmount + lines.reduce((s, l) => s + l.high, 0);
  return { state, stateName: STATE_NAMES[state], price, commission, lines, documents, totalLow, totalHigh, totalLowPct: pct(totalLow, price), totalHighPct: pct(totalHigh, price) };
}

export const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
