// Indicative deposit bond fees for /guides/deposit-bonds (bridging loans
// plan, 6 Oct 2026). The settings are the ones Deposit Power's online fee
// calculator uses, read on 6 Oct 2026; the calculator says its figures are
// indicative, and other issuers price differently (Deposit Bond Australia
// doesn't publish rates). Pure so the guide's table and FAQ share one source.

export const DEPOSIT_BOND_FEE_SOURCE = {
  name: "Deposit Power deposit bond fee calculator",
  url: "https://depositpower.com.au/deposit-bond-calculator-fee/",
  readOn: "6 October 2026",
} as const;

/** Up to 6 months: a flat share of the bond. */
export const SHORT_TERM = { maxMonths: 6, ratePct: 1.75, minimum: 500 } as const;
/** Over 6 months: a yearly rate charged pro rata by month. */
export const LONG_TERM = { ratePctPerYear: 3.2, minimum: 700 } as const;

/** Indicative fee for a bond of `amount` dollars lasting `months`. */
export function depositBondFee(amount: number, months: number): number {
  if (amount <= 0 || months <= 0) return 0;
  if (months <= SHORT_TERM.maxMonths) {
    return Math.max(SHORT_TERM.minimum, Math.round((amount * SHORT_TERM.ratePct) / 100));
  }
  return Math.max(LONG_TERM.minimum, Math.round((amount * LONG_TERM.ratePctPerYear * months) / 100 / 12));
}

export const FEE_TABLE_AMOUNTS = [50_000, 100_000, 150_000, 200_000] as const;
export const FEE_TABLE_MONTHS = [6, 12, 24, 36] as const;
