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
// Pictures: Andy, 19 Oct 2026: the buyer doesn't want photos of her
// apartment online, so the page shows two generated ILLUSTRATIONS instead
// (FLUX.2 Pro on Higgsfield, painted gouache style on purpose so they can't
// pass for photographs). Every one is labelled "Illustration" on the page,
// and the captions say they aren't the apartment or the work done. Never
// swap in photo-realistic images, and never caption these as the real thing.

export interface CaseIllustration {
  src: string;
  alt: string;
  caption: string;
}

export interface CaseStudy {
  place: string;
  property: string;
  before: string;
  work: string;
  expectedBefore: number;
  spend: number;
  expectedAfter: number;
  /** Generated illustrations, never photographs of the property. */
  illustrations: readonly CaseIllustration[];
}

export const HAMILTON: CaseStudy = {
  place: "Hamilton, Queensland",
  property: "An older two-bedroom apartment",
  before: "Outdated, with a boxy layout",
  work: "We redesigned the apartment and completed a cost-conscious renovation.",
  expectedBefore: 490_000,
  spend: 38_000,
  expectedAfter: 820_000,
  illustrations: [
    {
      src: "/images/case-studies/hamilton-before-illustration.jpg",
      alt: "Illustration of an older two-bedroom apartment: a closed-in kitchen behind a servery hatch, louvre windows and worn carpet",
      caption: "An older apartment like this one, before",
    },
    {
      src: "/images/case-studies/hamilton-after-illustration.jpg",
      alt: "Illustration of an apartment after a redesign: the kitchen open to the living room, light floors and a balcony door",
      caption: "The kind of change a redesign aims for",
    },
  ],
};

/** The increase in the expected sale price (not profit). */
export const expectedIncrease = (c: CaseStudy) => c.expectedAfter - c.expectedBefore;

/** Whole dollars, Australian style: $490,000. */
export const dollars = (n: number) => `$${n.toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;
