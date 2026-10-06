// The arithmetic behind /bridging-loan-calculator and the worked figures on
// /guides/bridging-loans-guide (bridging loans plan, 6 Oct 2026). Pure, so it
// can be tested and so the guide and the tool print the same numbers.
//
// The model, in the order a lender works it out:
//   starting debt  = mortgage owing + purchase price + stamp duty + buying costs
//                    + loan fees − savings put in
//   bridging loan  = the part the sale is expected to repay (net sale proceeds,
//                    capped at the starting debt)
//   interest       = on the bridging loan for the bridging period, either
//                    capitalised monthly (Westpac, the St.George group, Bendigo)
//                    or paid monthly as interest only (CBA, ANZ)
//   peak debt      = starting debt + any capitalised interest
//   end debt       = peak debt − net sale proceeds (never below zero)
// Repayments on the end debt run as an ordinary principal-and-interest loan.
// Westpac's broker guide capitalises interest on the bridging loan only
// (peak debt less end debt), which is the base used here; lenders that
// publish their method are in src/lib/data/bridging-lenders.ts.
import { calculateStampDuty, type AustralianState } from "@/lib/utils/stamp-duty";
import { computeSellingCosts, defaultSellingCostsInput } from "@/lib/selling-costs-calc";
import { estimateConveyancingCost } from "@/lib/conveyancing-costs";

/** Westpac, NAB and Bendigo Bank cap total lending at 80% of both properties' combined value. */
export const PEAK_LVR_CAP = 80;

/**
 * Example rates for the calculator's starting state and the guide's tables.
 * The bridging rate sits inside the published rates of the loans that
 * capitalise interest (9.28% to 10.29% on 6 Oct 2026); the ongoing rate is a
 * placeholder for the visitor's own home loan rate. Both are labelled as
 * examples wherever they print, and the visitor replaces them.
 */
export const EXAMPLE_BRIDGING_RATE = 9.3;
export const EXAMPLE_ONGOING_RATE = 6.5;

export type InterestMode = "capitalised" | "monthly";

/** Weeks in an average month, for turning weekly rent into a monthly figure. */
const WEEKS_PER_MONTH = 52 / 12;

export interface BridgingInput {
  /** What the current home is expected to sell for. */
  salePrice: number;
  mortgageOwing: number;
  /** Agent commission, marketing, legal and discharge costs on the sale. */
  sellingCosts: number;
  purchasePrice: number;
  /** The state the new home is in: stamp duty is charged at its rates. */
  state: AustralianState;
  /** Conveyancing, searches and registration on the purchase. */
  buyingCosts: number;
  /** Application, valuation and discharge fees on the bridging loan. */
  loanFees: number;
  /** Cash put towards the purchase, which reduces what is borrowed. */
  savings: number;
  /** Bridging interest rate, % a year. */
  bridgingRate: number;
  /** Added to the loan each month, or paid monthly as interest only. */
  interestMode: InterestMode;
  /** Months until the current home sells and settles. */
  months: number;
  /** Rate on the loan that remains after the sale, % a year. */
  ongoingRate: number;
  termYears: number;
  /** For the sell-first comparison: rent between homes and the second move. */
  weeklyRent: number;
  extraMoveCost: number;
}

export interface BridgingResult {
  status: "ok" | "invalid";
  stampDuty: number;
  netSaleProceeds: number;
  startingDebt: number;
  bridgingLoan: number;
  capitalisedInterest: number;
  /** Interest-only payment on the bridging loan each month, when interest is paid rather than capitalised. */
  monthlyBridgingInterest: number;
  /** Total bridging interest over the period, capitalised or paid. */
  bridgingInterest: number;
  peakDebt: number;
  combinedValue: number;
  /** Peak debt as a % of the two properties' combined value, one decimal. */
  peakLvr: number;
  withinCap: boolean;
  endDebt: number;
  /** Sale proceeds left over once all the debt is repaid. */
  surplus: number;
  monthlyRepayment: number;
  /** Bridging interest plus loan fees: what bridging adds over selling first. */
  bridgingCost: number;
  /** Rent for the same months plus the second move. */
  sellFirstCost: number;
}

const r = (n: number) => Math.round(n);

/** Interest added to a balance each month at an annual rate, compounded monthly. */
export function capitalisedInterest(amount: number, ratePct: number, months: number): number {
  if (amount <= 0 || ratePct <= 0 || months <= 0) return 0;
  return r(amount * (Math.pow(1 + ratePct / 100 / 12, months) - 1));
}

/** Monthly principal-and-interest repayment. */
export function monthlyRepayment(principal: number, ratePct: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const n = termYears * 12;
  const i = ratePct / 100 / 12;
  if (i === 0) return r(principal / n);
  return r((principal * i) / (1 - Math.pow(1 + i, -n)));
}

/** Owner-occupier stamp duty on the new home, not a first home, not a foreign buyer. */
export function purchaseStampDuty(price: number, state: AustralianState): number {
  return r(calculateStampDuty(Math.max(0, price), state, false, false, false).total);
}

/** Commission (state typical rate plus GST), marketing, legal documents, conveyancing and the mortgage discharge. */
export function defaultSellingCosts(salePrice: number, state: AustralianState, mortgageOwing: number): number {
  const base = defaultSellingCostsInput(state, Math.max(0, salePrice));
  return computeSellingCosts({ ...base, loanBalance: Math.max(0, mortgageOwing) }).totalCosts;
}

/** Midpoint of the buyer's conveyancing estimate for the state, with the new mortgage's registration. */
export function defaultBuyingCosts(purchasePrice: number, state: AustralianState): number {
  const e = estimateConveyancingCost({ state, side: "buy", price: Math.max(0, purchasePrice) });
  const mortgage = e.mortgageLines.reduce((s, l) => s + (l.low + l.high) / 2, 0);
  return r((e.total.low + e.total.high) / 2 + mortgage);
}

export function computeBridging(i: BridgingInput): BridgingResult {
  const salePrice = Math.max(0, i.salePrice);
  const purchasePrice = Math.max(0, i.purchasePrice);
  const months = Math.max(0, Math.min(24, Math.round(i.months)));
  const stampDuty = purchaseStampDuty(purchasePrice, i.state);
  const netSaleProceeds = Math.max(0, salePrice - Math.max(0, i.sellingCosts));
  const startingDebt = Math.max(
    0,
    Math.max(0, i.mortgageOwing) + purchasePrice + stampDuty + Math.max(0, i.buyingCosts) + Math.max(0, i.loanFees) - Math.max(0, i.savings),
  );
  const bridgingLoan = Math.min(netSaleProceeds, startingDebt);
  const capitalised = i.interestMode === "capitalised";
  const monthlyBridgingInterest = capitalised ? 0 : r((bridgingLoan * Math.max(0, i.bridgingRate)) / 100 / 12);
  const interest = capitalised ? capitalisedInterest(bridgingLoan, i.bridgingRate, months) : monthlyBridgingInterest * months;
  const peakDebt = startingDebt + (capitalised ? interest : 0);
  const combinedValue = salePrice + purchasePrice;
  const peakLvr = combinedValue > 0 ? Math.round((peakDebt / combinedValue) * 1000) / 10 : 0;
  const afterSale = peakDebt - netSaleProceeds;
  const endDebt = Math.max(0, afterSale);
  return {
    status: salePrice > 0 && purchasePrice > 0 ? "ok" : "invalid",
    stampDuty,
    netSaleProceeds,
    startingDebt,
    bridgingLoan,
    capitalisedInterest: capitalised ? interest : 0,
    monthlyBridgingInterest,
    bridgingInterest: interest,
    peakDebt,
    combinedValue,
    peakLvr,
    withinCap: peakLvr <= PEAK_LVR_CAP,
    endDebt,
    surplus: Math.max(0, -afterSale),
    monthlyRepayment: monthlyRepayment(endDebt, i.ongoingRate, i.termYears),
    bridgingCost: interest + Math.max(0, i.loanFees),
    sellFirstCost: r(Math.max(0, i.weeklyRent) * WEEKS_PER_MONTH * months + Math.max(0, i.extraMoveCost)),
  };
}

/**
 * The calculator's opening state, which is also the guide's worked example:
 * a $1.1m home with $400,000 owing, a $1.5m purchase in NSW, six months to sell.
 */
export function defaultBridgingInput(state: AustralianState = "NSW"): BridgingInput {
  const salePrice = 1_100_000;
  const mortgageOwing = 400_000;
  const purchasePrice = 1_500_000;
  return {
    salePrice,
    mortgageOwing,
    sellingCosts: defaultSellingCosts(salePrice, state, mortgageOwing),
    purchasePrice,
    state,
    buyingCosts: defaultBuyingCosts(purchasePrice, state),
    // Westpac's and St.George's published fees for six months: $600
    // establishment, $100 documents, 6 × $8 a month and $350 discharge.
    loanFees: 1_100,
    savings: 0,
    bridgingRate: EXAMPLE_BRIDGING_RATE,
    interestMode: "capitalised",
    months: 6,
    ongoingRate: EXAMPLE_ONGOING_RATE,
    termYears: 30,
    weeklyRent: 700,
    extraMoveCost: 3_000,
  };
}

/** Rows for the "what bridging costs" table on the guide and the calculator page. */
export const COST_TABLE_AMOUNTS = [100_000, 350_000, 500_000, 1_000_000] as const;
export const COST_TABLE_MONTHS = [3, 6, 12] as const;
