import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  EditorNote,
  PullQuote,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { BUYING_GUIDE_CTA } from "@/components/journey";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HG_MOVE_IN_MONTHS, HG_NO_OWNERSHIP_YEARS, HG_SOURCES } from "@/lib/data/home-guarantee";
import { NEGATIVE_GEARING_CUTOFF, REFORM_START, TAX_REFORM_SOURCES } from "@/lib/data/tax-reform-2027";
import { TAX_RATES_SOURCE, computeNegativeGearing, type NegativeGearingInput } from "@/lib/negative-gearing-calc";
import { PM_FEE_SOURCES, PM_NATIONAL, PM_STATE_FEES } from "@/lib/data/property-management-fees";

// Tax position rewritten to the Treasury Laws Amendment (Tax Reform No. 1)
// Act 2026 on 11 October 2026: the guide, updated 7 October, still gave the
// pre-reform negative gearing and CGT rules to exactly the buyer the change
// hits (commercial-intent review, 10 Oct 2026, renting 0.5).
const FRONTMATTER: GuideFrontmatter = {
  title: "Rentvesting in Australia 2026: What It Is and the Tax Change",
  h1: "What is rentvesting? A practical Australian guide (2026)",
  description:
    "Rentvesting: rent where you live, own an investment elsewhere. How it works, the maths, the scheme trade-off and what the 1 July 2027 tax changes mean for you.",
  slug: "rentvesting-australia",
  publishedAt: "2026-05-13",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 13,
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

// Sam's worked example, run through the negative gearing calculator's own
// engine so the figures cannot drift from /negative-gearing-calculator. Every
// input is an assumption for illustration, not a market figure.
const EXAMPLE: Omit<NegativeGearingInput, "timing"> = {
  price: 500_000,
  loan: 400_000,
  interestRate: 6.2,
  weeklyRent: 500,
  vacancyWeeks: 0,
  councilRates: 1_800,
  insurance: 1_200,
  managementPct: 7,
  maintenance: 500,
  strata: 0,
  depreciation: 8_000,
  marginalRate: 30,
};
const established = computeNegativeGearing({ ...EXAMPLE, timing: "established-after-cutoff" });
const newBuild = computeNegativeGearing({ ...EXAMPLE, timing: "new-build" });
const money = (n: number) => `$${Math.abs(n).toLocaleString("en-AU")}`;

const pmLow = Math.min(...Object.values(PM_STATE_FEES).map((s) => s.management.average));
const pmHigh = Math.max(...Object.values(PM_STATE_FEES).map((s) => s.management.average));

const TAX_CHANGE =
  `From ${REFORM_START}, losses on an established home bought after ${NEGATIVE_GEARING_CUTOFF} no longer reduce tax on other income such as salary: they only offset income from residential property and carry forward. New builds keep negative gearing.`;

const TLDR = [
  "Rentvesting means renting where you want to live and owning an investment property where the numbers work, often a cheaper outer-ring, regional or growth-corridor suburb.",
  `The tax maths changed in 2026. ${TAX_CHANGE} Homes held at that time are exempt (ATO, updated 29 June 2026).`,
  `Capital gains that accrue from ${REFORM_START} lose the 50% CGT discount: they are indexed for inflation instead, with a 30% minimum tax. Gains up to that date keep the discount.`,
  "Buying an investment as your first property can rule you out of first home buyer schemes later: the 5% Deposit Scheme, for example, requires you to live in the home you buy with it. Run those numbers carefully.",
  "The maths only stack up on an investment-grade property with a manageable holding cost and a defensible growth thesis. Random outer-suburb purchases often underperform.",
  "Rentvesting suits people whose dream suburb is years away on their current trajectory, who want property exposure now, and who are comfortable being a landlord.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",           label: "What rentvesting is" },
  { id: "vs-buying",             label: "Rentvesting vs buying your own home" },
  { id: "who-it-suits",          label: "Who rentvesting suits" },
  { id: "the-maths",             label: "The maths: does it actually work?" },
  { id: "tax-2027",              label: "What the 1 July 2027 tax changes mean" },
  { id: "fhog-trap",             label: "The first home buyer scheme trade-off" },
  { id: "finding-property",      label: "Finding an investment-grade property" },
  { id: "finance",               label: "Finance for an investment loan" },
  { id: "landlord-realities",    label: "Landlord realities" },
  { id: "exit",                  label: "When you exit: selling or transitioning" },
  { id: "common-mistakes",       label: "Common rentvesting mistakes" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is rentvesting?",
    answer:
      `Rentvesting is renting the home you live in while owning an investment property somewhere more affordable. The tax maths changed in 2026: from ${REFORM_START}, losses on an established home bought after ${NEGATIVE_GEARING_CUTOFF} no longer reduce tax on other income such as salary (ATO, updated 29 June 2026). New builds keep negative gearing.`,
  },
  {
    question: "Is rentvesting a good idea in 2026?",
    answer:
      `It can be, if the gap between where you want to live and what you can afford to buy is large and the investment property stands up on its own numbers. The 2026 tax law makes the choice of property matter more: an established home bought now loses negative gearing against your salary from ${REFORM_START}, while a new build keeps it, and gains from that date are indexed with a 30% minimum tax instead of the 50% discount (ATO, updated 29 June 2026).`,
  },
  {
    question: "Does negative gearing still work for rentvesters?",
    answer:
      `Until 30 June 2027, yes, for everyone. From ${REFORM_START} it depends on the property: one you held at ${NEGATIVE_GEARING_CUTOFF} and a new build keep it, but a loss on an established home bought after that time only offsets income from residential property and the rest carries forward. On our worked example that moves the after-tax cost from about ${money(established.weeklyCostAfterTax)} to ${money(established.weeklyCostFrom2027)} a week (ATO, updated 29 June 2026).`,
  },
  {
    question: "Is rentvesting better than buying a home to live in?",
    answer:
      "It depends on your numbers and your goals. Rentvesting builds equity sooner if your lifestyle suburb is much more expensive than the suburb you can buy in. It is worse if you are close to buying the home you want to live in, because first home buyer schemes, stamp duty concessions and the main residence CGT exemption can outweigh the rentvesting upside.",
  },
  {
    question: "Can I use the 5% Deposit Scheme on a rentvesting purchase?",
    answer:
      `No. The 5% Deposit Scheme (formerly the First Home Guarantee) requires you to be a first home buyer, or not to have owned property in Australia in the last ${HG_NO_OWNERSHIP_YEARS} years, and to move in within ${HG_MOVE_IN_MONTHS} months of settlement and keep living there while the guarantee is in place. Buying as an investment from day one rules you out.`,
  },
  {
    question: "Should I use a buyer's agent for a rentvesting purchase?",
    answer:
      "It is worth considering. Most rentvesters buy somewhere they don't live, so local knowledge is thin and familiarity bias creeps in. A buyer's agent who knows the target market can check comparable sales and negotiate without emotional attachment. Compare their fee, set out in our buyer's agent cost guide, with what a poor purchase would cost you.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Negative Gearing in Australia",       href: "/guides/negative-gearing-australia",       description: "How negative gearing works, and the 1 July 2027 change in full." },
  { title: "Negative Gearing Calculator",          href: "/negative-gearing-calculator",              description: "Your after-tax holding cost now and from 1 July 2027." },
  { title: "Property Management Fees by State",    href: "/guides/property-management-fees-australia", description: "Published fee ranges and dated state averages, with a calculator." },
  { title: "How to Choose a Mortgage Broker",      href: "/guides/how-to-choose-a-mortgage-broker",  description: "Investment loans have different credit criteria, so a broker matters more." },
  { title: "Buyer's Agent Cost Guide",             href: "/guides/buyers-agent-cost-australia",      description: "What buyer's agents charge and when their fee pays for itself." },
  { title: "Rental Yield Calculator",              href: "/rental-yield-calculator",                  description: "Run the gross and net yield on any property in two minutes." },
];

export default function RentvestingAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Correction, 11 October 2026">
        <p>
          Earlier versions of this guide (including the update of 7 October
          2026) said negative gearing applies and that capital gains get the
          50% discount after 12 months, without the law Parliament passed on
          25 June 2026. From {REFORM_START} negative gearing is limited to new
          builds for homes bought after {NEGATIVE_GEARING_CUTOFF}, and the 50%
          discount is replaced by indexation with a 30% minimum tax for gains
          from that date. We have rewritten the tax sections and the worked
          example from the ATO and the Act; the sources are listed at the end.
        </p>
      </Callout>

      <Callout variant="info" title="What this guide is and isn't">
        <p>
          It&rsquo;s a practical breakdown of rentvesting maths, scheme
          trade-offs, and the day-to-day reality. It&rsquo;s not personal
          financial advice. Talk to an accountant and a broker before
          committing. The right structure depends on your income, your
          existing assets, and your goals.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Rentvesting is the strategy most often pitched as a hack and
          executed as a mistake. Done well, it builds equity faster than
          waiting for a deposit on a dream owner-occupier home. Done
          badly, it forfeits first-home-buyer concessions and saddles
          you with a cash-flow drain. The difference is the maths,
          worked properly, before you sign anything.
        </p>
      </EditorNote>

      <h2 id="what-it-is">What rentvesting is</h2>
      <p className="lead">
        Rentvesting is renting the home you live in while owning an
        investment property somewhere more affordable. The tax maths changed
        in 2026: from {REFORM_START}, losses on an established home bought
        after {NEGATIVE_GEARING_CUTOFF} no longer reduce tax on other income
        such as salary (ATO, updated 29 June 2026). New builds keep negative
        gearing.
      </p>
      <p>
        You pay rent in the suburb you want to live in, and the property you
        own is rented to a tenant who covers part of the mortgage. It works
        best in two situations: your lifestyle suburb is materially more
        expensive than what you can afford to buy, and you want property
        exposure now rather than waiting years to save a deposit for the
        suburb you actually want to live in. A typical rentvester lives in an
        inner-city suburb they can&rsquo;t yet buy in and buys a cheaper
        property in a growth corridor or regional centre as the first step on
        the ladder.
      </p>

      <h2 id="vs-buying">Rentvesting vs buying your own home</h2>
      <table>
        <thead>
          <tr><th></th><th>Rentvesting</th><th>Buying the home you live in</th></tr>
        </thead>
        <tbody>
          <tr><td>Where you live</td><td>The suburb you want, as a renter</td><td>Where you can afford to buy</td></tr>
          <tr><td>First home buyer schemes</td><td>Usually forfeited: the 5% Deposit Scheme needs you to live in the home</td><td>Available if you qualify</td></tr>
          <tr><td>Losses against your salary</td><td>Until 30 June 2027; from {REFORM_START} only for a new build or a home held at {NEGATIVE_GEARING_CUTOFF}</td><td>None: a home&rsquo;s costs aren&rsquo;t deductible</td></tr>
          <tr><td>CGT when you sell</td><td>Yes; gains from {REFORM_START} indexed, with a 30% minimum tax</td><td>Main residence exemption</td></tr>
          <tr><td>Who pays the mortgage</td><td>You and your tenant&rsquo;s rent</td><td>You</td></tr>
          <tr><td>Day-to-day obligations</td><td>Landlord duties under your state&rsquo;s tenancy law</td><td>Owner&rsquo;s upkeep only</td></tr>
        </tbody>
      </table>

      <h2 id="who-it-suits">Who rentvesting suits</h2>
      <p>
        Rentvesting genuinely works for some profiles and is a trap for
        others.
      </p>
      <p><strong>Good fit:</strong></p>
      <ul>
        <li>Your target lifestyle suburb is materially more expensive than what you can afford to buy now.</li>
        <li>You&rsquo;re locked into a specific city for work but happy to invest interstate.</li>
        <li>You have stable income to ride out vacancies and interest-rate increases.</li>
        <li>You&rsquo;re comfortable being a landlord: managing a property manager, dealing with maintenance calls, accepting tenant turnover risk.</li>
        <li>You can afford to hold the property at its full cost before tax: from {REFORM_START} an established home bought now can&rsquo;t lean on your salary for a tax refund.</li>
      </ul>
      <p><strong>Poor fit:</strong></p>
      <ul>
        <li>You&rsquo;re close to being able to buy in your target suburb. First home buyer schemes, stamp duty concessions and the main residence CGT exemption tip the maths back the other way.</li>
        <li>Your income is variable enough that a tenant vacancy plus an interest rate rise would create cash flow stress.</li>
        <li>You hate the idea of being a landlord, or you&rsquo;re not interested in monitoring the property market.</li>
        <li>You plan to start a family and buy soon. Selling the investment to free up the deposit can be expensive.</li>
      </ul>

      <h2 id="the-maths">The maths: does it actually work?</h2>
      <p>
        It depends on the spread between your lifestyle suburb&rsquo;s price
        and your investment suburb&rsquo;s price, the rent the investment
        earns, your time horizon, your marginal tax rate and, from{" "}
        {REFORM_START}, whether the property is new or established. Here is a
        worked example. Every figure is an assumption for illustration, not a
        market figure, and it runs through the same engine as our{" "}
        <Link href="/negative-gearing-calculator">negative gearing calculator</Link>.
      </p>
      <p>
        <strong>Sam, 32, earns $130,000 and rents in inner Sydney.</strong>{" "}
        Buying a home there is years of saving away, so Sam buys a{" "}
        {money(EXAMPLE.price)} investment house with a {money(EXAMPLE.loan)}{" "}
        interest-only loan at an assumed {EXAMPLE.interestRate}%, let at{" "}
        {money(EXAMPLE.weeklyRent)} a week ({established.grossYieldPct}%
        gross).
      </p>
      <ul>
        <li>Rent received: {money(established.rentalIncome)}</li>
        <li>Mortgage interest: {money(established.interest)}</li>
        <li>Property management at {EXAMPLE.managementPct}% of rent: {money(established.managementFee)}</li>
        <li>Council rates, insurance and repairs: {money(EXAMPLE.councilRates + EXAMPLE.insurance + EXAMPLE.maintenance)}</li>
        <li>Depreciation (a paper deduction, assumed): {money(established.depreciation)}</li>
        <li><strong>Cash flow before tax</strong>: <strong>&minus;{money(established.cashFlowBeforeTax)}</strong> a year out of Sam&rsquo;s pocket</li>
        <li>Taxable result after depreciation: <strong>&minus;{money(established.netRentalResult)}</strong></li>
        <li>Tax saved at a 30% marginal rate (ATO 2026&ndash;27 resident rates, $45,001 to $135,000, before the Medicare levy): {money(established.taxEffect)}</li>
      </ul>

      <Callout variant="warning" title="The same property from 1 July 2027">
        <p>
          <strong>If it is an established home bought after{" "}
          {NEGATIVE_GEARING_CUTOFF}:</strong> until 30 June 2027 the loss
          saves Sam {money(established.taxEffect)}, so the property costs
          about {money(established.weeklyCostAfterTax)} a week after tax. From{" "}
          {REFORM_START} the {money(established.netRentalResult)} loss can only
          offset income from residential property, so with no other rental
          income Sam pays the full {money(established.cashFlowBeforeTax)}, about{" "}
          {money(established.weeklyCostFrom2027)} a week, and carries the loss
          forward.
        </p>
        <p>
          <strong>If it is a new build:</strong> negative gearing continues,
          and the after-tax cost stays about{" "}
          {money(newBuild.weeklyCostFrom2027)} a week. That is the trade-off
          the 2026 law creates for rentvesters: new builds keep the tax
          treatment, established homes in better locations often have the
          stronger growth case. Weigh both.
        </p>
      </Callout>

      <p>
        Either way the bet is on capital growth. If the property grows 4% a
        year for 7 years it is worth about {money(Math.round(EXAMPLE.price * 1.04 ** 7 / 1000) * 1000)},
        a gain of about {money(Math.round(EXAMPLE.price * (1.04 ** 7 - 1) / 1000) * 1000)}{" "}
        before costs. How that gain is taxed depends on when it accrues; see
        the next section.
      </p>

      <KeyFigure
        value={`${money(established.weeklyCostAfterTax)} vs ${money(established.weeklyCostFrom2027)}`}
        label="After-tax weekly cost of the worked example, before and from 1 July 2027, if it is an established home bought after the cut-off"
        context="Assumed inputs; 30% marginal rate; no other rental income"
      />

      <Callout variant="warning" title="Where the maths breaks">
        <p>
          The 4%-a-year growth assumption is not guaranteed. At 1.5% a year
          the gain over 7 years is about{" "}
          {money(Math.round(EXAMPLE.price * (1.015 ** 7 - 1) / 1000) * 1000)},
          which can be less than the rent you paid plus the holding costs.
          Rentvesting is a leveraged bet on growth; if the growth doesn&rsquo;t
          come, you&rsquo;d have been better off saving for the owner-occupier
          purchase. Pick your investment suburb deliberately.
        </p>
      </Callout>

      <PullQuote attribution="Andy McMaster, Editor">
        Rentvesting forfeits first-home-buyer status going forward.
        That trade-off only makes sense if your dream suburb is
        years away on your current trajectory.
      </PullQuote>

      <h2 id="tax-2027">What the 1 July 2027 tax changes mean for rentvesters</h2>
      <p>
        The Treasury Laws Amendment (Tax Reform No. 1) Act 2026 passed both
        Houses on 25 June 2026 and received Royal Assent on 26 June 2026. From{" "}
        {REFORM_START} it limits negative gearing for residential property to
        new builds and replaces the 50% CGT discount for individuals, trusts
        and partnerships with cost base indexation and a 30% minimum tax on
        capital gains (ATO, last updated 29 June 2026). For a rentvester the
        question is which side of the line the property sits on.
      </p>
      <table>
        <thead>
          <tr><th>The property</th><th>Negative gearing from 1 July 2027</th><th>CGT on a sale</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Held at {NEGATIVE_GEARING_CUTOFF}, including under a signed contract</td>
            <td>Unchanged for as long as you own it</td>
            <td>Gain to 1 July 2027 keeps the 50% discount; gain after it is indexed, with a 30% minimum tax</td>
          </tr>
          <tr>
            <td>Established home contracted after that time</td>
            <td>Losses offset only income from residential property, including residential capital gains; the rest carries forward</td>
            <td>Gains from 1 July 2027 indexed, with a 30% minimum tax</td>
          </tr>
          <tr>
            <td>New build (first buyer only)</td>
            <td>Unchanged</td>
            <td>You can choose the 50% discount or indexation when you sell</td>
          </tr>
        </tbody>
      </table>
      <p>
        The 12 May 2026 cut-off is a negative gearing rule only; it does not
        keep the CGT discount. What counts as a new build is set by ministerial
        instrument: the Budget explainer&rsquo;s examples include an
        off-the-plan apartment and a home built on vacant land. Our{" "}
        <Link href="/guides/negative-gearing-australia">negative gearing guide</Link>{" "}
        and{" "}
        <Link href="/guides/cgt-changes-2026-budget">CGT changes explainer</Link>{" "}
        have the detail, and the{" "}
        <Link href="/negative-gearing-calculator">negative gearing calculator</Link>{" "}
        shows your own property both ways.
      </p>
      <p>
        Deductions themselves haven&rsquo;t changed; what changed is whether a
        loss can reduce tax on your salary. Deductible expenses typically
        include:
      </p>
      <ul>
        <li><strong>Mortgage interest</strong> on the investment loan (the biggest line item).</li>
        <li>
          <strong>Property management fees</strong>: state averages run from{" "}
          {pmLow}% to {pmHigh}% of rent collected, {PM_NATIONAL.managementAverage}%
          nationally ({PM_FEE_SOURCES.laf.label.split(",")[0]}, {PM_FEE_SOURCES.laf.date}); see our{" "}
          <Link href="/guides/property-management-fees-australia">property management fees guide</Link>.
        </li>
        <li><strong>Council rates, water rates, body corporate fees.</strong></li>
        <li><strong>Landlord insurance</strong>.</li>
        <li><strong>Repairs and maintenance</strong> (immediate deduction; improvements are depreciated).</li>
        <li><strong>Depreciation</strong> on the building and eligible plant and equipment.</li>
        <li><strong>Accountant fees</strong>, legal fees and advertising for tenants.</li>
      </ul>
      <p>
        At the 2026&ndash;27 resident rates of 30%, 37% or 45% plus the 2%
        Medicare levy, a deductible loss is worth a lot, but it never makes a
        loss-making property profitable on its own, and from {REFORM_START} an
        established home bought now gets no such refund against your wages.
        Our <Link href="/guides/property-depreciation-guide">depreciation guide</Link>{" "}
        covers the deduction most investors miss.
      </p>

      <h2 id="fhog-trap">The first home buyer scheme trade-off</h2>
      <p>
        Australian <Link href="/guides/first-home-buyer-guide">first home buyer</Link> schemes are valuable:
        state grants for new homes, <Link href="/stamp-duty-calculator">stamp duty</Link>{" "}
        concessions up to a price threshold, and the federal 5% Deposit
        Scheme (a 5% deposit with no lenders mortgage insurance). Our first
        home buyer guide has the current figures for each state.
      </p>
      <p>
        <strong>Buying an investment property as your first property can
        forfeit much of this</strong>. The 5% Deposit Scheme requires you to
        move in within {HG_MOVE_IN_MONTHS} months and keep living there, and
        most state grants and concessions are for a home you will live in and
        for buyers who haven&rsquo;t owned property before. Check each
        scheme&rsquo;s own eligibility rules before you buy.
      </p>
      <p>
        The trade-off: if the gap between the investment suburb and the
        lifestyle suburb is small, the forfeited scheme value can exceed the
        rentvesting upside, and buying the home you want to live in is
        usually the better move. If the gap is large, the rentvesting upside
        can dominate.
      </p>

      <h2 id="finding-property">Finding an investment-grade property</h2>
      <p>
        This is where most rentvesters lose. The investment property has to
        be genuinely good. Bad investments lose money slowly, then quickly,
        and reset your entire wealth trajectory.
      </p>
      <p>
        Questions to ask of any purchase:
      </p>
      <ul>
        <li><strong>Does the rent cover enough of the cost?</strong> A low yield means you are paying for growth, which had better materialise, and from {REFORM_START} an established home&rsquo;s loss no longer comes back as a tax refund on your salary.</li>
        <li><strong>Is the population growing?</strong> Check the local government area&rsquo;s growth over recent years.</li>
        <li><strong>Is the employer base diverse?</strong> Single-industry towns (mining, tourism) can ride high then crash.</li>
        <li><strong>What infrastructure is coming?</strong> Train station extensions, new hospitals and freeway upgrades signal future demand.</li>
        <li><strong>Who owns the suburb?</strong> The share of owner-occupiers against renters shapes how prices behave.</li>
        <li><strong>Is the property type in short supply for the demand?</strong> 3-bedroom houses in a young-family suburb; 2-bedroom apartments near a hospital or university. Match the local buyer pool.</li>
      </ul>
      <p>
        Use our <Link href="/best-suburbs">best suburbs for investors</Link> ranking as a
        starting point and the <Link href="/rental-yield-calculator">rental yield calculator</Link> to model any specific property.
      </p>

      <MatchCTA
        lead="Rentvesting starts with a purchase. The free buying guide covers what you can really spend, the 2026 schemes state by state and how not to overpay."
        ctaLabel={BUYING_GUIDE_CTA.ctaLabel}
        href={BUYING_GUIDE_CTA.href}
      />

      <h2 id="finance">Finance for an investment loan</h2>
      <p>
        Investment loans differ from owner-occupier loans in several
        material ways:
      </p>
      <ul>
        <li><strong>Higher interest rate.</strong> Many lenders price investment loans above the equivalent owner-occupier loan; compare the two rates from the same lender.</li>
        <li><strong>Lenders mortgage insurance.</strong> Below a 20% deposit most lenders charge it, and investment premiums can be higher than owner-occupier ones for the same loan-to-value ratio.</li>
        <li><strong>Stricter serviceability.</strong> Lenders assess the loan at a buffer above the actual rate and count only part of the rent towards your income.</li>
        <li><strong>Interest-only is harder to get</strong> than it used to be; you&rsquo;ll typically need a clear repayment strategy.</li>
        <li><strong>Cross-collateralisation risk.</strong> Some lenders try to cross-collateralise the investment loan with your existing assets. Push back and keep loans uncrossed where possible.</li>
      </ul>
      <p>
        A <Link href="/guides/how-to-choose-a-mortgage-broker">broker</Link> who specialises in investment lending earns their fee on a
        rentvesting purchase. The lender choice, the loan structure
        (offset, interest-only, fixed-vs-variable split), and the LMI
        decision all materially affect your numbers.
      </p>

      <h2 id="landlord-realities">Landlord realities</h2>
      <p>
        Owning an investment property is a job, even when you have a
        property manager. Things to budget for:
      </p>
      <ul>
        <li><strong>Vacancy.</strong> Allow for some weeks empty each time a tenant leaves; how many depends on the local market.</li>
        <li><strong>Maintenance.</strong> Hot water systems, dishwashers, fences and garage doors all fail eventually; keep a buffer.</li>
        <li><strong>Interest rate changes.</strong> Each 0.25 percentage point rise on a $400,000 loan adds $1,000 a year in interest. Several rises can push a marginal property into serious cash-flow stress.</li>
        <li><strong>Tenant disputes.</strong> Most are minor (late rent, garden maintenance); occasionally serious (damage, illegal use, abandonment). Property managers handle the day-to-day but you make the calls on the big stuff.</li>
        <li><strong>Tenancy law.</strong> Several states now require a reason to end a lease and limit rent increases to once a year; see our renters&rsquo; rights guides for{" "}
          <Link href="/guides/renters-rights-nsw">NSW</Link>,{" "}
          <Link href="/guides/renters-rights-vic">Victoria</Link> and{" "}
          <Link href="/guides/renters-rights-sa">South Australia</Link>.</li>
      </ul>

      <h2 id="exit">When you exit: selling or transitioning</h2>
      <p>
        Most rentvesters exit one of three ways:
      </p>
      <ul>
        <li><strong>Sell the investment and use the proceeds for a home.</strong> The most common path. <Link href="/cgt-calculator">CGT</Link> applies on the gain: the part that accrues before {REFORM_START} keeps the 50% discount if you have held the property for 12 months, and the part from that date is indexed for inflation with a 30% minimum tax (a new build can choose the discount). The minimum tax limits the old benefit of selling in a low-income year.</li>
        <li><strong>Move into the investment property and make it your home.</strong> Useful if you&rsquo;re relocating to that area anyway; the main residence exemption covers the period you live there, and the CGT on the years it was rented stays until you sell.</li>
        <li><strong>Keep both, and buy a home later.</strong> Requires meaningful income growth or a partner&rsquo;s borrowing capacity, and the investment has to carry itself, which from {REFORM_START} is harder for an established home bought now.</li>
      </ul>

      <h2 id="common-mistakes">Common rentvesting mistakes</h2>
      <ul>
        <li><strong>Buying without doing the maths.</strong> The strategy only works if the price gap is big enough to outweigh the scheme value you give up.</li>
        <li><strong>Counting on a tax refund that ends.</strong> An established home bought after {NEGATIVE_GEARING_CUTOFF} stops reducing tax on your salary from {REFORM_START}. Budget for the cash cost.</li>
        <li><strong>Buying in a familiar holiday suburb.</strong> Familiar isn&rsquo;t the same as investment-grade. Ask the questions above.</li>
        <li><strong>Underestimating holding costs.</strong> Vacancy, maintenance, and interest rate rises all chew through cash flow.</li>
        <li><strong>Choosing new or established on tax alone.</strong> A new build keeps negative gearing, but developer margins and slower early growth can still make it the weaker investment. Compare both on the numbers.</li>
        <li><strong>Cross-collateralising loans.</strong> If your investment loan is cross-collateralised with another asset, selling becomes complicated and refinancing limited.</li>
        <li><strong>Forgetting the lifestyle suburb&rsquo;s growth.</strong> If the suburb you want to live in grows faster than the one you bought in, you&rsquo;re further from buying your home, not closer.</li>
      </ul>

      <MatchCTA kind="accountant" />

      <Sources items={RENTVESTING_SOURCES} />
    </GuideArticleLayout>
  );
}

const RENTVESTING_SOURCES: readonly SourceItem[] = [
  ...TAX_REFORM_SOURCES,
  { label: TAX_RATES_SOURCE.name, href: TAX_RATES_SOURCE.url, note: `${TAX_RATES_SOURCE.dated}, read ${TAX_RATES_SOURCE.readOn}. The 30% rate in the worked example.` },
  { label: PM_FEE_SOURCES.laf.label, href: PM_FEE_SOURCES.laf.href, note: `${PM_FEE_SOURCES.laf.date}. State and national management fee averages.` },
  { label: PM_FEE_SOURCES.ato.label, href: PM_FEE_SOURCES.ato.href, note: `${PM_FEE_SOURCES.ato.date}. The deductible expenses.` },
  { ...HG_SOURCES.faqs, note: "Owner-occupier requirement that rules out a rentvesting purchase" },
  "The worked example's price, loan, rate, rent and costs are assumptions for illustration, not market figures. Its arithmetic is the negative gearing calculator's engine.",
];
