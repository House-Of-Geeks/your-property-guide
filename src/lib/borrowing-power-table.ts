// The server-rendered "Borrowing power by income" table on
// /borrowing-power-calculator and its "$100,000 salary" answer, worked by the
// same engine as the calculator widget (src/lib/utils/borrowing-power.ts), so
// the table, the FAQ and the widget cannot disagree. A crawler and an AI
// Overview read this table; the widget's result only exists after the page
// runs in a browser. Pure; tested in tests/lib/borrowing-power-table.test.ts.
import type { FaqItem } from "@/components/guide/Faq";
import { HEM_AS_AT, indicativeHem } from "@/lib/data/hem";
import {
  APRA_BUFFER_CONFIRMED,
  APRA_SERVICEABILITY_BUFFER,
  DEFAULT_ASSESSMENT_RATE,
  REFERENCE_LOAN_RATE,
  REFERENCE_LOAN_RATE_PERIOD,
  computeBorrowingPower,
  getHEM,
} from "@/lib/utils/borrowing-power";

/** The assumptions the table states above itself. Dated, so a reader can tell when they were set. */
export const BORROWING_TABLE = {
  asAt: "2026-09-30",
  /** The calculator's default assessment rate: the RBA's average new variable rate plus APRA's buffer. */
  assessmentRate: DEFAULT_ASSESSMENT_RATE,
  loanRate: REFERENCE_LOAN_RATE,
  loanRatePeriod: REFERENCE_LOAN_RATE_PERIOD,
  buffer: APRA_SERVICEABILITY_BUFFER,
  bufferConfirmed: APRA_BUFFER_CONFIRMED,
  termYears: 30,
  dependants: 0,
  /** Living expenses entered for every row: the indicative HEM for a single applicant on $100,000 with no dependants. The engine lifts it to the household's own HEM where that is higher (a couple, a higher income band), so each row carries the floor for its household. */
  monthlyExpenses: getHEM(0),
  asAtHem: HEM_AS_AT,
  existingDebts: 0,
  /** Gross annual income per applicant, $60,000 to $200,000 in $10,000 steps. */
  incomes: [60_000, 70_000, 80_000, 90_000, 100_000, 110_000, 120_000, 130_000, 140_000, 150_000, 160_000, 170_000, 180_000, 190_000, 200_000],
} as const;

export interface BorrowingPowerRow {
  /** Gross annual income of each applicant. */
  income: number;
  /** Maximum loan for one applicant on that income, rounded to the nearest $1,000. */
  single: number;
  /** Combined income of a couple who both earn `income`. */
  coupleIncome: number;
  /** Maximum loan for that couple, rounded to the nearest $1,000. */
  couple: number;
}

const toThousand = (n: number) => Math.round(n / 1_000) * 1_000;

/**
 * Maximum loan under the table's assumptions, rounded to the nearest $1,000.
 * Null where the engine finds no surplus to repay from (it never prints 0).
 */
export function maxLoanFor(income1: number, income2 = 0, assessmentRate = BORROWING_TABLE.assessmentRate): number | null {
  const r = computeBorrowingPower(
    income1,
    income2,
    BORROWING_TABLE.monthlyExpenses,
    BORROWING_TABLE.dependants,
    BORROWING_TABLE.existingDebts,
    assessmentRate,
    BORROWING_TABLE.termYears,
  );
  if (!r || r.maxLoan <= 0) return null;
  return toThousand(r.maxLoan);
}

/** One row per income in BORROWING_TABLE.incomes; a row whose figures the engine cannot produce is left out rather than printed as 0. */
export function borrowingPowerByIncome(assessmentRate = BORROWING_TABLE.assessmentRate): BorrowingPowerRow[] {
  const rows: BorrowingPowerRow[] = [];
  for (const income of BORROWING_TABLE.incomes) {
    const single = maxLoanFor(income, 0, assessmentRate);
    const couple = maxLoanFor(income, income, assessmentRate);
    if (single === null || couple === null) continue;
    rows.push({ income, single, coupleIncome: income * 2, couple });
  }
  return rows;
}

/**
 * How much lower the table's figures are at a higher assessment rate, as a
 * whole percentage. Only the amortisation factor moves with the rate, so the
 * ratio is the same for every row; measured on the $100,000 single row.
 */
export function percentLowerAtRate(assessmentRate: number, base = BORROWING_TABLE.assessmentRate): number {
  const at = computeBorrowingPower(100_000, 0, BORROWING_TABLE.monthlyExpenses, 0, 0, assessmentRate, BORROWING_TABLE.termYears);
  const ref = computeBorrowingPower(100_000, 0, BORROWING_TABLE.monthlyExpenses, 0, 0, base, BORROWING_TABLE.termYears);
  if (!at || !ref || ref.maxLoan <= 0) return 0;
  return Math.round((1 - at.maxLoan / ref.maxLoan) * 100);
}

export const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

/** "30 September 2026", the date the assumptions were set. */
export const asAt = (): string => new Date(BORROWING_TABLE.asAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** The "$100,000 salary" FAQ, from the same rows as the table. Empty if the engine has no figure (it never prints 0). */
export function borrowingPowerFaqs(): FaqItem[] {
  const single = maxLoanFor(100_000);
  const couple = maxLoanFor(100_000, 100_000);
  const single80 = maxLoanFor(80_000);
  if (single === null || couple === null || single80 === null) return [];
  const price = toThousand(single / 0.8);
  const family = computeBorrowingPower(75_000, 75_000, 0, 2, 0, BORROWING_TABLE.assessmentRate, BORROWING_TABLE.termYears, { household: "couple" });
  const coupleNoKids = computeBorrowingPower(75_000, 75_000, 0, 0, 0, BORROWING_TABLE.assessmentRate, BORROWING_TABLE.termYears, { household: "couple" });
  const familyFaq: FaqItem[] = family && coupleNoKids && family.maxLoan > 0
    ? [{
        question: "How much can a couple with two children borrow on $150,000?",
        answer:
          `About ${money(toThousand(family.maxLoan))} on this calculator's method, against about ${money(toThousand(coupleNoKids.maxLoan))} for a couple on the same $150,000 with no children. The gap is the living-expense floor: the indicative HEM for a couple with two children on $150,000 is ${money(indicativeHem({ household: "couple", dependants: 2, grossIncome: 150_000 }))} a month, compared with ${money(indicativeHem({ household: "couple", dependants: 0, grossIncome: 150_000 }))} for a couple alone (${HEM_AS_AT}; the table below lists the floors), and at a ${BORROWING_TABLE.assessmentRate}% assessment rate over ${BORROWING_TABLE.termYears} years each dollar of monthly expenses removes roughly $130 of loan. Childcare, school fees, HECS and a car loan come off on top of HEM, so a family's real figure is often lower again.`,
      }]
    : [];
  return [
    {
      question: "How much can I borrow on a $100,000 salary?",
      answer:
        `About ${money(single)} as a single applicant, on this calculator's assumptions as at ${asAt()}: no other debts, no dependants, living expenses at the indicative HEM floor of ${money(BORROWING_TABLE.monthlyExpenses)} a month for a single person on that income (${HEM_AS_AT}), a ${BORROWING_TABLE.termYears}-year term and a ${BORROWING_TABLE.assessmentRate}% assessment rate, which is the ${BORROWING_TABLE.loanRate}% average rate on new owner-occupier variable loans in ${BORROWING_TABLE.loanRatePeriod} (RBA table F6) plus the ${BORROWING_TABLE.buffer} percentage point buffer APRA confirmed on ${BORROWING_TABLE.bufferConfirmed}. With a 20% deposit that is a purchase price of about ${money(price)}. A couple who both earn $100,000 come out at about ${money(couple)}, and a single applicant on $80,000 at about ${money(single80)}. Each extra percentage point on the assessment rate takes roughly ${percentLowerAtRate(BORROWING_TABLE.assessmentRate + 1)}% off these figures, and a credit card limit or a car loan takes off more, so treat them as a ceiling and run your own numbers in the calculator above.`,
    },
    ...familyFaq,
  ];
}
