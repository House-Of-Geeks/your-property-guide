import type { Metadata } from "next";
import Link from "next/link";
import { RentalYieldCalculator } from "@/components/calculators/RentalYieldCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, KeyFigure, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Rental Yield Calculator",
  description:
    "Calculate gross and net rental yield for any Australian investment property. Includes purchase costs and ongoing expenses for the full picture.",
  slug: "rental-yield-calculator",
  schemaName: "Rental Yield Calculator",
  schemaDescription: "Calculate gross and net rental yield and weekly cash flow for investment properties.",
  updatedAt: "2026-04-15",
  persona: "investing",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: `${FRONTMATTER.title} | ${SITE_NAME}`,
    description: FRONTMATTER.description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "What is rental yield?",
    answer:
      "Rental yield is the annual return on a property investment expressed as a percentage of its value. A higher yield means greater income relative to the property's cost. It is one of the key metrics investors use to compare investment properties.",
  },
  {
    question: "What is the difference between gross and net rental yield?",
    answer:
      "Gross rental yield is simply the annual rental income divided by the purchase price, expressed as a percentage. Net rental yield factors in all ongoing costs (council rates, insurance, property management, maintenance, etc.) and is calculated against the full cost base (purchase price plus buying costs). Net yield gives a more realistic picture of your actual return.",
  },
  {
    question: "What is a good rental yield in Australia?",
    answer:
      "Gross rental yields in Australian capital cities typically range from 3 to 6%. Sydney and Melbourne often yield 2.5 to 4% gross, while regional areas and higher-density markets like Brisbane, Adelaide, and Perth can yield 4 to 6%+. 'Good' depends on your strategy: higher yields often come with lower capital growth prospects, and vice versa.",
  },
  {
    question: "What is cash flow and why does it matter?",
    answer:
      "Cash flow is the money left over after all expenses (including loan repayments) are paid from rental income. A positively geared property generates cash flow surplus each week. A negatively geared property costs more to hold than it earns in rent, the shortfall is often offset against other income for tax purposes.",
  },
  {
    question: "What costs should I include in my yield calculation?",
    answer:
      "Key ongoing costs include council rates, water rates, landlord insurance, property management fees (typically 7 to 10% of rent in most states), maintenance and repairs allowance (commonly 0.5 to 1% of property value per year), strata levies if applicable, and land tax if applicable. Purchase costs include stamp duty, legal/conveyancing fees, and building inspection fees.",
  },
  {
    question: "Should I prioritise yield or capital growth?",
    answer:
      "It depends on your strategy and life stage. Younger investors with stable salary income often prioritise capital growth (lower-yielding capital-city properties) and lean on negative gearing. Income-focused investors approaching retirement often prioritise yield over growth (regional or high-yield-suburb properties) for cash flow predictability. The right answer depends on your tax position, time horizon, and risk tolerance.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Best suburbs for investors",   href: "/best-suburbs",                description: "Ranked by yield, growth and demand." },
  { title: "CGT Calculator",               href: "/cgt-calculator",              description: "What you'll pay if and when you sell." },
  { title: "Property Depreciation Guide",  href: "/guides/property-depreciation-guide", description: "Tax write-offs that lift your effective yield." },
  { title: "Browse suburbs",               href: "/suburbs",                     description: "Median rents and yields for any Australian suburb." },
  { title: "Negative Gearing Australia",   href: "/guides/negative-gearing-australia", description: "How the tax mechanics actually work." },
  { title: "Mortgage Repayments",          href: "/mortgage-calculator",         description: "Your repayment is the biggest line in the cash-flow calculation." },
];

export default function RentalYieldCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<RentalYieldCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>Gross vs net yield, in plain English</h2>
          <p>
            Yield is shorthand for &ldquo;how much income does this property
            actually produce relative to what it cost?&rdquo;. There are two
            versions, and most listing pages show only the kinder of the two.
          </p>

          <h3>Gross yield</h3>
          <p>
            <code>(Weekly rent × 52 ÷ purchase price) × 100</code>. A quick
            comparison number. Doesn&rsquo;t account for any cost. Most listings
            and market reports quote gross yield because it always looks better
            than the real number.
          </p>

          <h3>Net yield</h3>
          <p>
            <code>((Annual rent − annual costs) ÷ (purchase price + buying costs)) × 100</code>.
            What you actually earn after rates, insurance, management fees,
            maintenance and strata. Net yield is typically 1 to 2% lower than
            gross, sometimes more on older buildings or strata-heavy units.
          </p>

          <KeyFigure
            value="1–2%"
            label="Typical gap between gross and net rental yield once council rates, insurance, management fees, maintenance and (where applicable) strata levies are deducted."
            context="Higher on older buildings and high-strata units"
          />

          <h2>Cash flow vs yield, the difference</h2>
          <p>
            A positively-yielding property can still be cash-flow negative once
            you factor in mortgage repayments. Yield ignores debt; cash flow
            doesn&rsquo;t. Many investor properties run cash-flow negative on
            paper but produce a tax benefit (negative gearing) that makes the
            after-tax cash flow neutral or slightly positive.
          </p>
          <p>
            For a complete picture, compare both: yield tells you how the
            <em> property </em> performs as an asset; cash flow tells you how
            the <em>investment</em> performs in your personal financial life.
          </p>

          <Callout variant="tip" title="Always compare on net yield">
            <p>
              When comparing two investment properties, gross yield can mislead
              dramatically. A property with a $1,200/year strata levy and 10%
              management fees can have the same gross yield as a free-standing
              house with no strata and self-management, but a much lower net
              yield. Always level the comparison.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t model loan interest or principal repayments, see <Link href="/mortgage-calculator">Mortgage Calculator</Link>.</li>
            <li>It doesn&rsquo;t apply tax effects (depreciation, negative gearing).</li>
            <li>It doesn&rsquo;t model vacancy rates, build a buffer of 2 to 4 weeks vacancy a year into your real-world numbers.</li>
            <li>It doesn&rsquo;t cover commercial property (which has very different yield dynamics).</li>
          </ul>
          <p>
            For a complete investment analysis, browse{" "}
            <Link href="/suburbs">suburb data</Link> with median rent and growth
            history, then run the calculator on shortlisted properties.
          </p>
        </>
      }
    />
  );
}
