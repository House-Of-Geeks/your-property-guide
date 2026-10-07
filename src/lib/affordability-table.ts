// "How much house can I afford?" by income and household, on
// /affordability-calculator: the serviceability-limited purchase price for a
// single applicant, a couple and a couple with two children, worked by the
// borrowing engine with the indicative HEM for each household and a 20%
// deposit. Server-rendered so a crawler and an AI Overview can read a figure.
// Pure; tested in tests/lib/affordability-table.test.ts.
import type { FaqItem } from "@/components/guide/Faq";
import { HEM_AS_AT, indicativeHem } from "@/lib/data/hem";
import { DEFAULT_ASSESSMENT_RATE, REFERENCE_LOAN_RATE, REFERENCE_LOAN_RATE_PERIOD, computeBorrowingPower } from "@/lib/utils/borrowing-power";

export const AFFORDABILITY_TABLE = {
  asAt: "2026-10-08",
  hemAsAt: HEM_AS_AT,
  assessmentRate: DEFAULT_ASSESSMENT_RATE,
  loanRate: REFERENCE_LOAN_RATE,
  loanRatePeriod: REFERENCE_LOAN_RATE_PERIOD,
  termYears: 30,
  depositPct: 20,
  /** Gross annual household income. */
  incomes: [80_000, 100_000, 120_000, 150_000, 180_000, 200_000, 250_000, 300_000],
} as const;

export interface AffordabilityRow {
  income: number;
  /** Indicative monthly HEM and affordable price for each household shape; null where the engine has no surplus. */
  single: { hem: number; price: number | null };
  couple: { hem: number; price: number | null };
  coupleTwoChildren: { hem: number; price: number | null };
}

const toFive = (n: number) => Math.round(n / 5_000) * 5_000;

function priceFor(income1: number, income2: number, dependants: number): { hem: number; price: number | null } {
  const household = income2 > 0 ? "couple" : "single";
  const hem = indicativeHem({ household, dependants, grossIncome: income1 + income2 });
  const r = computeBorrowingPower(income1, income2, 0, dependants, 0, AFFORDABILITY_TABLE.assessmentRate, AFFORDABILITY_TABLE.termYears, { household });
  if (!r || r.maxLoan <= 0) return { hem, price: null };
  return { hem, price: toFive(r.maxLoan / (1 - AFFORDABILITY_TABLE.depositPct / 100)) };
}

/** One row per household income; the couple columns split the income evenly between two applicants. */
export function affordabilityByIncome(): AffordabilityRow[] {
  return AFFORDABILITY_TABLE.incomes.map((income) => ({
    income,
    single: priceFor(income, 0, 0),
    couple: priceFor(income / 2, income / 2, 0),
    coupleTwoChildren: priceFor(income / 2, income / 2, 2),
  }));
}

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

/** The "$100,000" and "couple with two children" answers, worked from the table so they cannot drift from it. */
export function affordabilityFaqs(): FaqItem[] {
  const rows = affordabilityByIncome();
  const r100 = rows.find((r) => r.income === 100_000);
  const r150 = rows.find((r) => r.income === 150_000);
  const faqs: FaqItem[] = [];
  if (r100?.single.price) {
    faqs.push({
      question: "How much house can I afford on $100,000 a year?",
      answer: `On this calculator's method, a single applicant on $100,000 with no other debts can afford a purchase price of about ${money(r100.single.price)} with a 20% deposit: the bank takes net income as 72% of gross, deducts the indicative HEM living-expense floor of ${money(r100.single.hem)} a month for a single person at that income (${HEM_AS_AT}), caps repayments at 85% of what is left, and tests them at ${AFFORDABILITY_TABLE.assessmentRate}% over ${AFFORDABILITY_TABLE.termYears} years. A couple on $100,000 combined affords about ${money(r100.couple.price ?? 0)} because the couple's HEM is higher. The deposit is the other limit: ${money(r100.single.price)} needs about ${money(r100.single.price * 0.2)} saved plus buying costs.`,
    });
  }
  if (r150?.coupleTwoChildren.price && r150.couple.price) {
    faqs.push({
      question: "How much can a couple with two children afford on $150,000?",
      answer: `About ${money(r150.coupleTwoChildren.price)} with a 20% deposit, against about ${money(r150.couple.price)} for the same couple with no children. The difference is the living-expense floor: the indicative HEM for a couple with two children on $150,000 is ${money(r150.coupleTwoChildren.hem)} a month compared with ${money(r150.couple.hem)} for a couple alone (${HEM_AS_AT}), and every dollar of monthly expenses removes roughly $130 of borrowing capacity at a ${AFFORDABILITY_TABLE.assessmentRate}% assessment rate over ${AFFORDABILITY_TABLE.termYears} years. Childcare, school fees and a car loan come off on top of HEM, so a family's real figure is often lower again.`,
    });
  }
  return faqs;
}
