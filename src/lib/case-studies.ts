// Real examples from our own work (19 Oct 2026).
//
// The Hamilton facts were supplied by Andy on 19 Oct 2026 and are the ONLY
// facts the site may state about this project. (Later the same day he added:
// a very boxed-in 1980s apartment, turned into a bright, open, modern one
// that takes advantage of its city views.) Don't add an address, the
// renovation's details, dates, buyer feedback, a testimonial or a final sale
// result: none were supplied. Both prices are EXPECTED sale prices, before
// and after the work. The $820,000 is not an achieved sale, a settled result
// or an independent valuation, and the difference is an increase in the
// expected sale price, not profit.
//
// Pictures: Andy, 19 Oct 2026: the buyer doesn't want photos of her
// apartment online, so the page shows two generated ILLUSTRATIONS instead
// (ImagineArt, Nano Banana Pro 2K; ink and watercolour on purpose so they
// can't pass for photographs; the second was made from the first so both
// show the same room). Every one is labelled "Illustration" on the page,
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
  before: "a boxed-in, outdated 1980s layout",
  work: "We redesigned it as a bright, open, modern apartment that makes the most of its city views, with a cost-conscious renovation.",
  expectedBefore: 490_000,
  spend: 38_000,
  expectedAfter: 820_000,
  illustrations: [
    {
      src: "/images/case-studies/hamilton-boxed-in-illustration.jpg",
      alt: "Illustration of a boxed-in 1980s apartment: small walled-off rooms, a closed galley kitchen, dark trims, brown tiles and blinds drawn over a small window",
      caption: "A boxed-in 1980s apartment like this one, before",
    },
    {
      src: "/images/case-studies/hamilton-open-plan-illustration.jpg",
      alt: "Illustration of the same kind of apartment opened up: an open-plan kitchen and living room, light timber floors and glass doors to a balcony with a city and river view",
      caption: "The kind of bright, open space it became, facing the city views",
    },
  ],
};

/** The increase in the expected sale price (not profit). */
export const expectedIncrease = (c: CaseStudy) => c.expectedAfter - c.expectedBefore;

/** Whole dollars, Australian style: $490,000. */
export const dollars = (n: number) => `$${n.toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;
