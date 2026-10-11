// Indicative Household Expenditure Measure (HEM) figures: the living-expense
// floor the borrowing power and affordability calculators apply, and the
// "indicative HEM by household" table on /borrowing-power-calculator.
//
// The Melbourne Institute's HEM tables are licensed to lenders and are not
// published. These figures are Your Property Guide's estimate of the
// modest-lifestyle HEM for each household, built from the published method
// (the median spend on absolute basics plus the 25th percentile of spend on
// discretionary basics, varying by household composition, income band and
// location; APRA APG 223 expects lenders to scale the index by income) and
// the indicative monthly ranges JMD Mortgages published on 27 March 2026 for
// mid-income households (single $1,800 to $2,200, couple $2,400 to $3,000,
// couple with one child $2,900 to $3,400, with two children $3,100 to $3,800,
// with three $3,500 to $4,200; read 11 Oct 2026). The base figures sit inside
// those ranges; the income-band factors (0.85, 1, 1.15, 1.3), the regional
// factor (0.92) and $350 a dependant are our own assumptions. They are a
// budget, not a bank's number; every page that prints one prints HEM_AS_AT,
// the method note and HEM_SOURCES beside it.
// Research: docs/seo-baselines/2026-10-08/hem/official-facts.md.
export const HEM_AS_AT = "October 2026";

export type Household = "single" | "couple";
export type Region = "capital" | "regional";

export interface HemIncomeBand {
  /** Gross household income strictly below this is in the band. */
  max: number;
  label: string;
  factor: number;
}

/** Gross household income bands and the scaling applied to the base figures. */
export const HEM_INCOME_BANDS: readonly HemIncomeBand[] = [
  { max: 80_000, label: "under $80,000", factor: 0.85 },
  { max: 150_000, label: "$80,000 to $150,000", factor: 1 },
  { max: 250_000, label: "$150,000 to $250,000", factor: 1.15 },
  { max: Infinity, label: "over $250,000", factor: 1.3 },
];

/** Monthly base figures at the $80,000 to $150,000 band, capital city. */
export const HEM_BASE_MONTHLY: Record<Household, number> = { single: 2_000, couple: 2_800 };
export const HEM_PER_DEPENDANT = 350;
/** Dependants beyond this count do not add to the figure. */
export const HEM_MAX_DEPENDANTS = 5;
export const HEM_REGION_FACTOR: Record<Region, number> = { capital: 1, regional: 0.92 };

export const HEM_METHOD_NOTE =
  "Indicative figures, Your Property Guide estimate, " + HEM_AS_AT + ". The Melbourne Institute's HEM tables are licensed to lenders and not published. The mid-income figures sit inside the ranges JMD Mortgages published on 27 March 2026; the scaling by income band (85% under $80,000, 115% from $150,000, 130% over $250,000), the regional figure (92% of the capital city) and $350 a month for each dependant are our assumptions. A lender's own figure will differ.";

/** Where the HEM figures and the rule for using them come from, for a Sources block. */
export const HEM_SOURCES = [
  {
    label: "JMD Mortgages: How banks calculate your living expenses (indicative HEM benchmarks, mid-income band)",
    href: "https://www.jmdmortgages.com.au/blog/how-banks-calculate-living-expenses-hem-2026",
    note: "Published 27 March 2026, read 11 October 2026. An industry estimate: the HEM tables are proprietary.",
  },
  {
    label: "APRA: Prudential Practice Guide APG 223 Residential Mortgage Lending",
    href: "https://www.apra.gov.au/sites/default/files/apg-223-residential-mortgage-lending_0.pdf",
    note: "July 2019. Lenders use the greater of declared expenses and a scaled HEM, with a margin linked to income.",
  },
] as const;

export interface HemInput {
  household: Household;
  dependants: number;
  /** Gross annual household income, both applicants. */
  grossIncome: number;
  region?: Region;
}

export function hemIncomeBand(grossIncome: number): HemIncomeBand {
  return HEM_INCOME_BANDS.find((b) => grossIncome < b.max) ?? HEM_INCOME_BANDS[HEM_INCOME_BANDS.length - 1];
}

/** The indicative monthly HEM for a household, rounded to the nearest $10. */
export function indicativeHem({ household, dependants, grossIncome, region = "capital" }: HemInput): number {
  const deps = Math.min(Math.max(0, Math.floor(dependants)), HEM_MAX_DEPENDANTS);
  const base = HEM_BASE_MONTHLY[household] + deps * HEM_PER_DEPENDANT;
  const scaled = base * hemIncomeBand(Math.max(0, grossIncome)).factor * HEM_REGION_FACTOR[region];
  return Math.round(scaled / 10) * 10;
}

export interface HemTableRow {
  label: string;
  household: Household;
  dependants: number;
  /** Monthly figure per income band, in HEM_INCOME_BANDS order, capital city. */
  monthly: number[];
}

/** The rows of the indicative HEM table: common households across the four income bands. */
export function hemTableRows(): HemTableRow[] {
  const shapes: Array<[string, Household, number]> = [
    ["Single, no dependants", "single", 0],
    ["Single, one child", "single", 1],
    ["Single, two children", "single", 2],
    ["Couple, no dependants", "couple", 0],
    ["Couple, one child", "couple", 1],
    ["Couple, two children", "couple", 2],
    ["Couple, three children", "couple", 3],
  ];
  return shapes.map(([label, household, dependants]) => ({
    label,
    household,
    dependants,
    monthly: HEM_INCOME_BANDS.map((b) => indicativeHem({ household, dependants, grossIncome: Number.isFinite(b.max) ? b.max - 1 : 300_000 })),
  }));
}
