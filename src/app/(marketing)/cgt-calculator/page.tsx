import type { Metadata } from "next";
import Link from "next/link";
import { CGTCalculator } from "@/components/calculators/CGTCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Capital Gains Tax Calculator",
  description:
    "Estimate the CGT on your Australian investment property sale. Includes the 50% discount, main residence exemption and partial exemption for properties rented while being your home.",
  slug: "cgt-calculator",
  schemaName: "Capital Gains Tax Calculator",
  schemaDescription: "Calculate Australian capital gains tax including the 50% CGT discount and main residence exemption.",
  updatedAt: "2026-04-15",
  persona: "investing",
};

const META_TITLE = "CGT Calculator for Australian Property: 50% Discount Included";
const META_DESCRIPTION = "Free capital gains tax calculator for Australian investment property. Includes the 50% CGT discount, main residence exemption and partial exemption. No sign-up.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "What is the 50% CGT discount?",
    answer:
      "If you hold an investment property for more than 12 months, you are eligible for a 50% CGT discount as an individual or trust. This means only half of your capital gain is added to your taxable income. Companies are not eligible for this discount.",
  },
  {
    question: "What is the main residence exemption?",
    answer:
      "If you sell your primary place of residence and have never rented it out, you generally pay no CGT on the sale. This is known as the main residence (or principal place of residence) exemption.",
  },
  {
    question: "What happens if I rented out my home for part of the time?",
    answer:
      "A partial main residence exemption applies. Only the proportion of time the property was rented is taxable. For example, if you owned the property for 5 years and rented it for 2 years, 40% of the gain would be assessable, and if held more than 12 months, the 50% discount would then also apply to that assessable portion.",
  },
  {
    question: "How does joint ownership affect CGT?",
    answer:
      "In a 50/50 joint ownership arrangement, each owner is liable for CGT on their own share of the gain. Each party applies their own marginal tax rate and any applicable discounts to their half of the taxable gain.",
  },
  {
    question: "What costs can I include in my cost base?",
    answer:
      "Your cost base includes the original purchase price, stamp duty, legal fees, building and pest inspection costs, and capital improvements made during ownership. Agent commissions and legal fees paid on sale reduce your capital proceeds.",
  },
  {
    question: "When is CGT actually paid?",
    answer:
      "CGT is paid as part of your income tax return for the year in which the contract of sale is signed (not settlement). If you exchange contracts in June 2026 with settlement in August 2026, the CGT obligation falls into the 2025/26 financial year. Most investors put aside funds at exchange to cover the eventual tax bill.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Property Depreciation Guide", href: "/guides/property-depreciation-guide", description: "Depreciation reduces tax during ownership but reduces cost base on sale." },
  { title: "Rental Yield Calculator",     href: "/rental-yield-calculator",          description: "What the property earns while you hold it." },
  { title: "Negative Gearing Australia",  href: "/guides/negative-gearing-australia", description: "How holding-period tax mechanics interact with CGT on exit." },
  { title: "SMSF Property Guide",         href: "/guides/smsf-property-guide",       description: "CGT works very differently inside super." },
  { title: "Best suburbs for investors",  href: "/best-suburbs",                     description: "High-growth suburbs are also high-CGT suburbs at exit." },
  { title: "Conveyancing Guide",          href: "/guides/conveyancing-guide",        description: "When CGT crystallises (contract date, not settlement)." },
];

export default function CGTCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<CGTCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>How CGT works on Australian property</h2>
          <p>
            When you sell an investment property in Australia, the profit (capital
            gain) is added to your assessable income in the year of sale and taxed
            at your marginal rate. There are several mechanics that determine how
            much of the gain is taxable.
          </p>

          <h3>Cost base</h3>
          <p>
            What you paid for the property, plus most costs associated with
            buying it (stamp duty, conveyancing, building inspection) and any
            capital improvements you made during ownership.
          </p>

          <h3>Capital proceeds</h3>
          <p>
            The amount you receive on sale, less costs of sale such as real
            estate agent commissions and legal fees.
          </p>

          <h3>50% CGT discount</h3>
          <p>
            If you&rsquo;ve owned the property for more than 12 months as an
            individual or via a trust, only 50% of the net capital gain is
            taxable. Companies do not qualify.
          </p>

          <h3>Main residence exemption</h3>
          <p>
            If the property is your principal place of residence and you never
            rented it out, no CGT applies. If you rented it for part of the time,
            a partial exemption applies based on the proportion of days it was
            your main residence.
          </p>

          <KeyFigure
            value="50%"
            label="Of your net capital gain that's taxable when an individual or trust holds an investment property for more than 12 months. Companies don't get the discount."
            context="ATO, individual marginal-rate basis"
          />

          <h2>The biggest decisions that affect your CGT</h2>
          <h3>Hold for at least 12 months and one day</h3>
          <p>
            The cliff is hard. Selling at 11 months and 30 days means 100% of the
            gain is taxable; 12 months and one day means 50%. If you&rsquo;re close
            to the threshold, the maths almost always favours waiting.
          </p>
          <h3>Sell in a low-income year</h3>
          <p>
            CGT is taxed at your marginal rate. If you can time the sale into a
            year of lower other income (parental leave, sabbatical, retirement
            year), the CGT rate applied to the gain falls accordingly.
          </p>
          <h3>Joint ownership splits the gain</h3>
          <p>
            A 50/50 joint ownership splits the gain across two marginal-rate
            assessments, often pulling at least one party into a lower bracket.
          </p>
          <h3>Watch the &ldquo;six-year rule&rdquo;</h3>
          <p>
            If you live in a property as your main residence then move out and
            rent it, you can continue to treat it as your main residence for CGT
            purposes for up to six years, provided you don&rsquo;t claim another
            property as your main residence in that time. Useful for accidental
            landlords or moves driven by work.
          </p>

          <Callout variant="warning" title="This is general information, not tax advice">
            <p>
              CGT mechanics interact with depreciation, capital improvements, and
              your specific income picture in ways that materially change the
              outcome. The calculator is a starting point. Always confirm with a
              tax accountant before relying on a specific figure.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t apply specific marginal-rate brackets, you input the rate.</li>
            <li>It doesn&rsquo;t handle complex partial-exemption scenarios with multiple rental periods.</li>
            <li>It doesn&rsquo;t adjust the cost base for depreciation that you claimed during ownership (which reduces your cost base on sale).</li>
            <li>It doesn&rsquo;t handle SMSF, company or trust structures (which have different CGT treatments), see our <Link href="/guides/smsf-property-guide">SMSF Property Guide</Link>.</li>
            <li>It doesn&rsquo;t model temporary residents, foreign residents, or non-residents (different rules apply).</li>
          </ul>
        </>
      }
    />
  );
}
