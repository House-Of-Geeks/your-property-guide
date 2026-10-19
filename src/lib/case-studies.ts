// Real examples from our own work (19 Oct 2026).
//
// The Hamilton facts were supplied by Andy on 19 Oct 2026 and are the ONLY
// facts the site may state about this project. Don't add an address, the
// renovation's details, dates, buyer feedback, a testimonial or a final sale
// result: none were supplied. Both prices are EXPECTED sale prices, before
// and after the work. The $820,000 is not an achieved sale, a settled result
// or an independent valuation, and the difference is an increase in the
// expected sale price, not profit.
//
// TODO(andy): add the real photographs of the apartment, if you have them.
// Until then the case study runs without imagery: no generated or library
// photo may stand in for a before-and-after.

export interface CaseStudy {
  place: string;
  property: string;
  before: string;
  work: string;
  expectedBefore: number;
  spend: number;
  expectedAfter: number;
}

export const HAMILTON: CaseStudy = {
  place: "Hamilton, Queensland",
  property: "An older two-bedroom apartment",
  before: "Outdated, with a boxy layout",
  work: "We redesigned the apartment and completed a cost-conscious renovation.",
  expectedBefore: 490_000,
  spend: 38_000,
  expectedAfter: 820_000,
};

/** The increase in the expected sale price (not profit). */
export const expectedIncrease = (c: CaseStudy) => c.expectedAfter - c.expectedBefore;

/** Whole dollars, Australian style: $490,000. */
export const dollars = (n: number) => `$${n.toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;
