import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Property depreciation: how investors maximise tax deductions (2026)",
  description:
    "Division 40 vs Division 43 explained, who can claim, the 2017 second-hand plant and equipment rule change, quantity surveyor reports, worked examples, and how to claim in your return.",
  slug: "property-depreciation-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 7,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

const TLDR = [
  "Property depreciation is a non-cash tax deduction for investment properties. You don't physically spend money to claim it, the deduction reflects the gradual decline in value of the building and its fittings.",
  "Division 43 (capital works) covers the building structure: 2.5% per year for 40 years from construction date, on properties built after 16 September 1987.",
  "Division 40 (plant and equipment) covers removable fittings: carpet, blinds, hot water systems, appliances. Each has its own ATO-set effective life.",
  "The 2017 rule change blocks Division 40 claims on existing plant and equipment in established properties bought after 9 May 2017. Division 43 is unaffected.",
  "A Quantity Surveyor (QS) tax depreciation schedule costs $500 to $800 and is the ATO-accepted way to maximise and substantiate claims. The fee is itself tax deductible.",
  "On a typical new $650,000 investment property, year-one deductions of $15,000+ can save $5,500 in tax at a 37% marginal rate. Over 40 years, depreciation alone can save $130,000+.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",            label: "What property depreciation is" },
  { id: "div-43",             label: "Division 43: capital works" },
  { id: "div-40",             label: "Division 40: plant and equipment" },
  { id: "who-can-claim",      label: "Who can claim depreciation?" },
  { id: "2017-change",        label: "The 2017 second-hand rule change" },
  { id: "qs-report",          label: "Quantity surveyor report" },
  { id: "worked-example",     label: "Worked example" },
  { id: "new-vs-established", label: "New vs established properties" },
  { id: "how-to-claim",       label: "How to claim in your tax return" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can I claim depreciation on my own home?",
    answer:
      "No. Depreciation is only available on investment properties (rental properties or properties available for rent). If a property is your principal place of residence, you cannot claim depreciation on it. If it switches between personal and investment use, the deduction is apportioned accordingly.",
  },
  {
    question: "Do I need a quantity surveyor report to claim depreciation?",
    answer:
      "Strictly no, but practically yes. The ATO requires the construction cost of capital works to be substantiated. Without a QS report, you'd need original construction invoices (rare on existing properties). For Division 40, the QS values each plant and equipment item using ATO-accepted methods. Without a QS, most accountants will refuse to claim depreciation aggressively.",
  },
  {
    question: "What's the difference between Division 40 and Division 43?",
    answer:
      "Division 43 (capital works) is the building structure: walls, floors, roof, plumbing, wiring within the structure. Claimed at 2.5% per year for 40 years from construction. Division 40 (plant and equipment) is removable fittings: carpet, blinds, hot water systems, appliances. Each item has its own ATO-set effective life and depreciates faster.",
  },
  {
    question: "Can I claim depreciation on an old established property?",
    answer:
      "Partially. Division 43 still applies if construction commenced after 16 September 1987, regardless of when you bought it. You inherit the remaining years of the 40-year schedule. Division 40 (plant and equipment) cannot be claimed on existing fittings if you bought the property after 9 May 2017, but you can claim Division 40 on any new fittings you install yourself.",
  },
  {
    question: "Should I buy new or established for depreciation?",
    answer:
      "New properties give significantly higher depreciation: full 40-year Division 43 ahead of you, plus full Division 40 on all original fittings. An established 20-year-old property has roughly half the Division 43 life remaining and (post-2017) no Division 40 on existing fittings. New properties typically generate $15,000+ in year-one deductions vs $5,000 to $8,000 on established.",
  },
  {
    question: "Is depreciation worth claiming if my property is positively geared?",
    answer:
      "Yes. Depreciation reduces taxable income whether or not the property is positively or negatively geared. On a positively geared property, depreciation can convert it to neutral or negative on paper, creating a tax loss that offsets other income. On a negatively geared property, depreciation makes the loss bigger, which means a larger tax refund.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Negative Gearing Australia",   href: "/guides/negative-gearing-australia",     description: "How depreciation interacts with the rest of the negative-gearing equation." },
  { title: "Rental Yield Calculator",      href: "/rental-yield-calculator",               description: "Where depreciation effectively lifts your after-tax yield." },
  { title: "CGT Calculator",               href: "/cgt-calculator",                        description: "Depreciation reduces your cost base, increasing CGT on sale." },
  { title: "SMSF Property Guide",          href: "/guides/smsf-property-guide",            description: "Depreciation works differently inside super." },
  { title: "Best Suburbs for Investors",   href: "/best-suburbs",                          description: "Where to apply this strategy on the ground." },
  { title: "Buying Property in Australia", href: "/guides/buying-property-australia",      description: "The full investor buying process." },
];

export default function PropertyDepreciationGuidePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="General information, not tax advice">
        <p>
          Depreciation rules are complex and have changed over time. Always
          consult a registered tax agent or accountant before claiming
          depreciation deductions. Quantity surveyor reports should be
          prepared by a qualified ATO-recognised QS.
        </p>
      </Callout>

      <h2 id="what-is">What property depreciation is</h2>
      <p className="lead">
        In Australia, investment property owners can claim a tax deduction for
        the gradual wear and tear of a property&rsquo;s structure and its
        internal fittings. This is called <strong>depreciation</strong>, and it
        is one of the most valuable (and commonly overlooked) tax deductions
        available to property investors.
      </p>
      <p>
        Depreciation is a <em>non-cash deduction</em>, you do not physically
        spend money to claim it. The ATO allows you to deduct the theoretical
        decline in value of the property&rsquo;s components over time, reducing
        your taxable income and therefore your annual tax bill.
      </p>
      <p>There are two categories of property depreciation:</p>
      <ul>
        <li><strong>Division 43</strong>, Capital Works Deduction (building structure)</li>
        <li><strong>Division 40</strong>, Plant and Equipment (removable fixtures and fittings)</li>
      </ul>

      <h2 id="div-43">Division 43: capital works deduction</h2>
      <p>
        <strong>Division 43</strong> covers the structural components of the
        building itself, walls, floors, roof, windows, built-in wardrobes,
        plumbing, wiring within the structure, and other permanent components.
      </p>
      <Callout variant="info" title="Key Division 43 rules">
        <p>
          <strong>Rate.</strong> 2.5% per year for 40 years from the date of construction.<br />
          <strong>Eligibility cutoff.</strong> Only properties with construction commenced after 16 September 1987 qualify.<br />
          <strong>Based on.</strong> Original construction cost (not purchase price).<br />
          <strong>Claimed by.</strong> Any investor owning a rental property, regardless of whether it was new or established when purchased.
        </p>
      </Callout>
      <p>
        Example: a residential property built in 2010 with construction costs
        of $400,000:
      </p>
      <ul>
        <li>Annual Division 43 deduction: $400,000 × 2.5% = <strong>$10,000/year</strong></li>
        <li>Available for 40 years from construction commencement</li>
        <li>Remaining years available depends on construction date and when you purchased</li>
      </ul>
      <p>
        If you buy an established property, you inherit the remaining
        depreciation life. For example, if the building is 15 years old when
        you buy it, you have approximately 25 years of Division 43 deductions
        remaining. A quantity surveyor can calculate the precise deductible
        amount.
      </p>
      <p>
        <strong>Properties built before 16 September 1987</strong> are not
        eligible for Division 43 deductions, regardless of when you purchased
        them. This excludes many older inner-city terrace houses, period homes,
        and pre-war properties.
      </p>

      <h2 id="div-40">Division 40: plant and equipment</h2>
      <p>
        <strong>Division 40</strong> covers assets that can be physically
        removed from the property, items that are not structurally part of the
        building. Common examples:
      </p>
      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Effective life</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Carpet</td><td>10 years</td><td>Division 40</td></tr>
          <tr><td>Blinds and curtains</td><td>6 years</td><td>Division 40</td></tr>
          <tr><td>Hot water system</td><td>12 years</td><td>Division 40</td></tr>
          <tr><td>Air conditioning unit</td><td>10 years</td><td>Division 40</td></tr>
          <tr><td>Oven and cooktop</td><td>12 years</td><td>Division 40</td></tr>
          <tr><td>Dishwasher</td><td>10 years</td><td>Division 40</td></tr>
          <tr><td>Ceiling fans</td><td>15 years</td><td>Division 40</td></tr>
          <tr><td>Solar panels</td><td>20 years</td><td>Division 40</td></tr>
        </tbody>
      </table>
      <p>
        The ATO sets the effective life for each asset type. Depreciation can
        be claimed using either the <em>diminishing value method</em>{" "}
        (front-loaded, higher deductions in early years) or the{" "}
        <em>prime cost method</em> (straight-line, equal deductions each year).
        The diminishing value method generally provides higher early-year
        deductions and is used by most investors.
      </p>

      <h2 id="who-can-claim">Who can claim depreciation?</h2>
      <p>Any investor who:</p>
      <ul>
        <li>Owns a rental property (or property available for rent)</li>
        <li>Derives rental income from the property</li>
        <li>Has an eligible property (construction commenced after 16 September 1987 for Division 43)</li>
      </ul>
      <p>
        Importantly, depreciation is only available on investment properties,
        not your own home (principal place of residence). If a property
        switches between personal use and investment use, the depreciation
        entitlement is adjusted proportionally.
      </p>

      <h2 id="2017-change">The 2017 rule change: second-hand plant and equipment</h2>
      <p>
        A significant rule change took effect on <strong>9 May 2017</strong>{" "}
        (Budget night) that affects Division 40 claims on <em>existing</em>{" "}
        (second-hand) properties.
      </p>
      <p>Under the new rules:</p>
      <ul>
        <li><strong>If you purchased an established residential property after 9 May 2017,</strong> you cannot claim Division 40 depreciation on the <em>existing</em> plant and equipment in the property (carpet, blinds, appliances, etc.) unless you installed them yourself as new assets.</li>
        <li><strong>New plant and equipment you purchase and install yourself</strong> (after buying the property) can still be depreciated under Division 40.</li>
        <li><strong>Division 43 (capital works) is unaffected</strong> by this rule change, you can still claim 2.5% on the original construction cost regardless of when you purchased the property.</li>
        <li><strong>New properties are unaffected,</strong> if you buy a brand new property (from the developer, never previously occupied as a residence), you can claim Division 40 on all plant and equipment.</li>
      </ul>

      <table>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Div 40 on existing fittings?</th>
            <th>Div 40 on new fittings you install?</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>New property (never occupied)</td><td><strong className="text-success">Yes</strong></td><td><strong className="text-success">Yes</strong></td></tr>
          <tr><td>Established property, purchased before 9 May 2017</td><td><strong className="text-success">Yes (grandfathered)</strong></td><td><strong className="text-success">Yes</strong></td></tr>
          <tr><td>Established property, purchased after 9 May 2017</td><td><strong className="text-danger">No</strong></td><td><strong className="text-success">Yes</strong></td></tr>
        </tbody>
      </table>

      <h2 id="qs-report">Quantity surveyor report</h2>
      <p>
        A <strong>tax depreciation schedule</strong> prepared by a qualified
        Quantity Surveyor (QS) is the standard way to maximise and substantiate
        your depreciation claims. The ATO accepts QS reports as evidence of
        the cost of capital works and the value of plant and equipment.
      </p>
      <p>What a depreciation schedule includes:</p>
      <ul>
        <li>Estimated original construction cost (for Division 43)</li>
        <li>Itemised list of plant and equipment with values and effective lives (for Division 40)</li>
        <li>Year-by-year depreciation schedule for the next 40 years</li>
        <li>Both diminishing value and prime cost methods shown</li>
      </ul>
      <p>Cost of a QS depreciation schedule:</p>
      <ul>
        <li><strong>Residential properties.</strong> $500 to $800 for an initial schedule</li>
        <li><strong>Commercial properties.</strong> $700 to $1,500+</li>
      </ul>
      <p>
        The QS fee itself is tax deductible as an expense of managing your
        investment property. Given that the schedule can generate tens of
        thousands of dollars in deductions over its lifetime, the cost is
        almost always worth it.
      </p>
      <p>
        Well-known ATO-recognised QS firms include BMT Tax Depreciation,
        Washington Brown, and MCG Quantity Surveyors, but there are many
        others. Your accountant or property manager can usually recommend a
        local firm.
      </p>

      <h2 id="worked-example">Worked example</h2>
      <p>
        <strong>Scenario.</strong> An investor purchases a new 3-bedroom house
        in 2026 for $650,000. The land is valued at $280,000 and the
        construction cost is $370,000. The property is rented at $650 a week
        and generates $33,800 a year in rental income. The investor earns
        $150,000 from their job and is in the 37% tax bracket.
      </p>

      <table>
        <thead>
          <tr>
            <th>Year 1 deduction</th>
            <th>Calculation</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Division 43 (capital works)</td><td>$370,000 × 2.5%</td><td><strong>$9,250</strong></td></tr>
          <tr><td>Division 40, carpet ($15,000 at DV 20%)</td><td>$15,000 × 20%</td><td><strong>$3,000</strong></td></tr>
          <tr><td>Division 40, hot water + appliances ($12,000 at DV 18%)</td><td>$12,000 × 18%</td><td><strong>$2,160</strong></td></tr>
          <tr><td>Division 40, blinds ($3,000 at DV 25%)</td><td>$3,000 × 25%</td><td><strong>$750</strong></td></tr>
          <tr><td><strong>Total deductions, Year 1</strong></td><td></td><td><strong>$15,160</strong></td></tr>
        </tbody>
      </table>

      <KeyFigure
        value="$5,609"
        label="Year-one tax saving from depreciation alone, on a new $650,000 investment property at a 37% marginal tax rate. Over 40 years, depreciation can save $130,000+ in tax."
        context="Worked example, diminishing value method"
      />

      <p>
        Over the 40-year life of the property, the cumulative Division 43
        deductions alone would total $370,000 (i.e. the full construction
        cost). At a 37% marginal rate, that represents $136,900 in total tax
        savings, from a single non-cash deduction.
      </p>

      <h2 id="new-vs-established">New vs established properties</h2>
      <p>
        New properties offer significantly higher depreciation deductions than
        established properties, for several reasons:
      </p>
      <ul>
        <li><strong>Full Division 43 remaining.</strong> A new property has the full 40-year capital works schedule ahead of it. An established 20-year-old property has only 20 years remaining (and therefore half the deductible life).</li>
        <li><strong>Full Division 40 available.</strong> New properties allow Division 40 claims on all plant and equipment. Established properties purchased after 9 May 2017 cannot claim Division 40 on existing assets.</li>
        <li><strong>Higher construction costs.</strong> Recently built properties generally have higher construction costs (due to inflation and higher building standards), resulting in higher Division 43 deductions.</li>
      </ul>

      <h2 id="how-to-claim">How to claim in your tax return</h2>
      <p>
        Depreciation deductions are claimed in your annual income tax return
        under the &ldquo;rental income and expenses&rdquo; section:
      </p>
      <ul>
        <li><strong>Division 43</strong> is typically claimed as &ldquo;Capital works deductions&rdquo; in the rental schedule.</li>
        <li><strong>Division 40</strong> is claimed as &ldquo;Decline in value of depreciating assets&rdquo;.</li>
        <li>Your QS depreciation schedule shows the exact amounts to claim for each year.</li>
        <li>Your tax agent will use these figures when preparing your return.</li>
      </ul>
      <p>
        Depreciation can also convert a positively geared property into a
        negatively geared one on paper, creating a tax loss that can be offset
        against your other income. This is one of the core mechanisms behind
        negative gearing tax benefits. See our{" "}
        <Link href="/guides/negative-gearing-australia">Negative Gearing Guide</Link> for
        more detail.
      </p>
    </GuideArticleLayout>
  );
}
