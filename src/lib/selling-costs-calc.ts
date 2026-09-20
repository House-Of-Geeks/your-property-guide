// The arithmetic behind the selling costs calculator (content gap 10). Pure
// so it can be tested and so the state guides and the standalone tool share
// one set of numbers with src/lib/data/selling-costs.ts.
import { STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { STATE_DOCUMENTS } from "@/lib/data/selling-costs";

export interface SellingCostsInput {
  price: number;
  /** Commission rate in percent, e.g. 2.2. */
  commissionRate: number;
  /** True when the quoted rate already includes GST. */
  commissionIncludesGst: boolean;
  marketing: number;
  conveyancing: number;
  /** The state's legal documents: Section 32, Form 1, Form 2, contract searches. */
  documents: number;
  /** Styling, repairs, cleaning, pre-sale inspections. */
  presentation: number;
  auction: boolean;
  auctioneer: number;
  /** Outstanding mortgage paid out at settlement; 0 when there is none. */
  loanBalance: number;
  discharge: number;
  other: number;
}

export interface SellingCostLine {
  key: string;
  label: string;
  amount: number;
}

export interface SellingCostsResult {
  commission: number;
  commissionGst: number;
  lines: SellingCostLine[];
  totalCosts: number;
  /** Total costs as a percentage of the price, one decimal. */
  costPct: number;
  netBeforeLoan: number;
  netAfterLoan: number;
}

const r = (n: number) => Math.round(n);

export function computeSellingCosts(i: SellingCostsInput): SellingCostsResult {
  const price = Math.max(0, i.price);
  const commission = r((price * Math.max(0, i.commissionRate)) / 100);
  const commissionGst = i.commissionIncludesGst ? 0 : r(commission * 0.1);
  const lines: SellingCostLine[] = [
    { key: "commission", label: i.commissionIncludesGst ? "Agent commission (incl. GST)" : "Agent commission", amount: commission },
  ];
  if (commissionGst > 0) lines.push({ key: "gst", label: "GST on commission", amount: commissionGst });
  lines.push({ key: "marketing", label: "Marketing and photography", amount: r(Math.max(0, i.marketing)) });
  lines.push({ key: "conveyancing", label: "Conveyancing or solicitor", amount: r(Math.max(0, i.conveyancing)) });
  lines.push({ key: "documents", label: "Legal documents and searches", amount: r(Math.max(0, i.documents)) });
  if (i.presentation > 0) lines.push({ key: "presentation", label: "Styling, repairs and presentation", amount: r(i.presentation) });
  if (i.auction && i.auctioneer > 0) lines.push({ key: "auctioneer", label: "Auctioneer", amount: r(i.auctioneer) });
  if (i.loanBalance > 0 && i.discharge > 0) lines.push({ key: "discharge", label: "Mortgage discharge fee", amount: r(i.discharge) });
  if (i.other > 0) lines.push({ key: "other", label: "Other costs", amount: r(i.other) });
  const totalCosts = lines.reduce((s, l) => s + l.amount, 0);
  const netBeforeLoan = price - totalCosts;
  return {
    commission,
    commissionGst,
    lines,
    totalCosts,
    costPct: price > 0 ? Math.round((totalCosts / price) * 1000) / 10 : 0,
    netBeforeLoan,
    netAfterLoan: netBeforeLoan - Math.max(0, r(i.loanBalance)),
  };
}

/** The calculator's starting figures for a state: typical rate, mid-range documents. */
export function defaultSellingCostsInput(state: StateCode, price: number): SellingCostsInput {
  const d = STATE_DOCUMENTS[state];
  return {
    price,
    commissionRate: STATE_RATES[state].typical,
    commissionIncludesGst: false,
    marketing: 4_000,
    conveyancing: 1_400,
    documents: r((d.low + d.high) / 2),
    presentation: 0,
    auction: false,
    auctioneer: 800,
    loanBalance: 0,
    discharge: 300,
    other: 0,
  };
}
