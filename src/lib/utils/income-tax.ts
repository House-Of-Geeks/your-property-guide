// Resident income tax and the Medicare levy for 2026–27, for calculators that
// need tax on a slice of income (the FHSS calculator). Rates from the ATO,
// read 7 Oct 2026. Leaves out the low income tax offset, the Medicare levy's
// low-income reduction and the Medicare levy surcharge, so it overstates tax a
// little on low incomes.

export const INCOME_TAX_YEAR = "2026–27";

export const INCOME_TAX_SOURCE = {
  name: "ATO, tax rates for Australian residents, 2026–27",
  url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents",
  dated: "last updated 13 August 2026",
  readOn: "7 October 2026",
} as const;

export const MEDICARE_LEVY_SOURCE = {
  name: "ATO, What is the Medicare levy?",
  url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/what-is-the-medicare-levy",
  dated: "last updated 30 April 2026",
  readOn: "7 October 2026",
} as const;

/** Medicare levy, % of taxable income. */
export const MEDICARE_LEVY_PCT = 2;

/** Each bracket's lower threshold (the first dollar taxed is the one above it) and its rate in %. */
export const RESIDENT_BRACKETS_2026_27 = [
  { over: 0, rate: 0 },
  { over: 18_200, rate: 15 },
  { over: 45_000, rate: 30 },
  { over: 135_000, rate: 37 },
  { over: 190_000, rate: 45 },
] as const;

/** Income tax on a taxable income, before offsets and the Medicare levy. */
export function incomeTax(taxable: number): number {
  let tax = 0;
  RESIDENT_BRACKETS_2026_27.forEach((b, i) => {
    const top = RESIDENT_BRACKETS_2026_27[i + 1]?.over ?? Infinity;
    if (taxable > b.over) tax += ((Math.min(taxable, top) - b.over) * b.rate) / 100;
  });
  return tax;
}

/** The rate in % on the next dollar of income, before the Medicare levy. */
export function marginalRate(taxable: number): number {
  let rate = 0;
  for (const b of RESIDENT_BRACKETS_2026_27) if (taxable > b.over) rate = b.rate;
  return rate;
}
