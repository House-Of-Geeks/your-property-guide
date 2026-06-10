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
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Rentvesting in Australia: A Practical Guide (2026)",
  description:
    "Rent where you want to live, buy where it makes financial sense. How rentvesting actually works in Australia, the maths, the tax position, the first home buyer scheme trade-off, and when it's the right call.",
  slug: "rentvesting-australia",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
  readingTimeMinutes: 12,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "investing",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
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
  "Rentvesting means renting where you want to live (often inner-city, premium suburbs) and buying an investment property where the numbers work (often outer-ring, regional, or growth corridors).",
  "It's a financial play, not a lifestyle compromise. Done right, you build property equity sooner than waiting for a deposit on your dream owner-occupier home.",
  "Key trade-off: buying an investment property as your first property generally disqualifies you from the First Home Owner Grant in most states (it's reinstated in some if you owner-occupy later), and you may lose access to the First Home Guarantee Scheme. Run those numbers carefully.",
  "Negative gearing applies. Rental losses (after depreciation and interest) reduce your taxable income. Capital gains tax applies on sale, with the 50% discount after 12 months.",
  "The maths only stack up if you can find an investment-grade property: yield ≥ 4.5% gross, manageable holding cost, and a defensible growth thesis. Random outer-suburb purchases often underperform.",
  "Rentvesting suits people whose dream-suburb price tag is years away on their current trajectory, who want property exposure now, and who are comfortable being a landlord.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",           label: "What rentvesting is" },
  { id: "who-it-suits",          label: "Who rentvesting suits" },
  { id: "the-maths",             label: "The maths: does it actually work?" },
  { id: "fhog-trap",             label: "The first home buyer scheme trade-off" },
  { id: "negative-gearing",      label: "Negative gearing and tax position" },
  { id: "finding-property",      label: "Finding an investment-grade property" },
  { id: "finance",               label: "Finance for an investment loan" },
  { id: "landlord-realities",    label: "Landlord realities" },
  { id: "exit",                  label: "When you exit: selling or transitioning" },
  { id: "common-mistakes",       label: "Common rentvesting mistakes" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is rentvesting in Australia?",
    answer:
      "Rentvesting is renting where you want to live (typically a suburb you couldn't afford to buy in) while owning an investment property somewhere the numbers make sense (typically a more affordable suburb, regional area, or growth corridor). It's a strategy used by younger buyers, professionals locked into specific cities for work, and anyone whose lifestyle suburb is years away on a save-for-a-deposit timeline.",
  },
  {
    question: "Is rentvesting better than buying a home to live in?",
    answer:
      "It depends entirely on your numbers and your goals. Rentvesting builds equity faster if your target lifestyle suburb is significantly more expensive than your investment-grade purchase suburb (e.g. renting in inner Sydney, buying in regional QLD). It's worse if your target owner-occupier home is achievable within 12–24 months. The first home owner schemes, stamp duty concessions, and main residence CGT exemption are valuable enough to outweigh the rentvesting upside.",
  },
  {
    question: "Can I use the First Home Guarantee on a rentvesting purchase?",
    answer:
      "No. The First Home Guarantee (FHBG) requires you to be a first home buyer AND occupy the property as your principal place of residence within a defined period (typically 12 months) and live there continuously for a minimum period. Buying as an investment from day one disqualifies you. The same applies to most state first home owner grants and stamp duty concessions. Investment-from-day-one is the trade-off rentvesters make.",
  },
  {
    question: "Will I still get the first home owner grant later if I rentvest first?",
    answer:
      "In most states, no. Most state first home owner grants require you to have never owned residential property in Australia. Once you've bought any property, even an investment, you're no longer a 'first home buyer' for grant purposes. Some specific schemes (e.g. parts of the First Home Super Saver scheme) may still be accessible, so check the specific eligibility rules for each scheme. The general rule: rentvesting forfeits first-home-buyer status going forward.",
  },
  {
    question: "How much deposit do I need for a rentvesting purchase?",
    answer:
      "Investment loans typically require a 20% deposit to avoid Lenders Mortgage Insurance (LMI). Some lenders accept 10% deposits with LMI on investment loans, but rates are usually 0.05–0.20% higher than the owner-occupier equivalent and policy is tighter on income types. Allow another 5–8% for stamp duty (no concession on investment purchases), conveyancing, building and pest, and loan establishment fees. On a $500,000 investment, plan for $130,000–$150,000 cash, depending on state stamp duty.",
  },
  {
    question: "Is negative gearing worth it?",
    answer:
      "Negative gearing isn't a strategy. It's a consequence of buying a property whose total deductible expenses (interest, depreciation, council rates, agent fees, insurance, repairs) exceed the rent received. The tax benefit is that the loss reduces your taxable income, which at the top marginal rate saves you 47c per dollar of loss. But you're still spending real money out of pocket each year. Negative gearing makes sense when expected capital growth more than covers the holding cost; it's destructive if growth doesn't materialise. Run the worst-case numbers.",
  },
  {
    question: "What's the typical yield I should target for an investment property?",
    answer:
      "Gross rental yield of 4.5–5.5% is workable in most metro and regional markets. Below 4% gross yield typically means you're paying for capital growth at the expense of current cash flow. Fine if the growth thesis is solid, painful if it isn't. Above 6% gross is increasingly common in regional Australia and some outer-metro corridors but check the population growth, infrastructure pipeline, and major-employer concentration before assuming it'll sustain. Net yield (after expenses) is usually 60–75% of gross yield depending on body corporate fees and management costs.",
  },
  {
    question: "Should I use a buyer's agent for a rentvesting purchase?",
    answer:
      "Strongly worth considering. The single biggest rentvesting mistake is buying the wrong property in the wrong suburb. Most rentvesters live somewhere different from where they're buying, so local knowledge is limited and emotional bias (buying somewhere that feels familiar from holidays, for example) creeps in. A buyer's agent who specialises in investment property in your target market does the legwork, knows the comparable sales, can spot a dud, and can negotiate hard because they're not emotionally invested. Fee is typically 1.5–2.5% of purchase price; on a $500,000 property that's $7,500–$12,500.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Negative Gearing in Australia",       href: "/guides/negative-gearing-australia",       description: "How negative gearing works mechanically, what you can claim, and when it makes sense." },
  { title: "Property Depreciation Guide",          href: "/guides/property-depreciation-guide",      description: "The often-overlooked deduction that turns paper losses into real cash flow." },
  { title: "How to Choose a Mortgage Broker",      href: "/guides/how-to-choose-a-mortgage-broker",  description: "Investment loans have different credit criteria, so a broker matters more." },
  { title: "Buyer's Agent Cost Guide",             href: "/guides/buyers-agent-cost-australia",      description: "What buyer's agents charge and when their fee pays for itself." },
  { title: "Best Suburbs for Investors",           href: "/best-suburbs",                            description: "Ranked by yield, growth, and demand across Australia." },
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
        Rentvesting is a strategy where you rent your home and buy a
        separate property as an investment. You pay rent in the suburb you
        want to live in, and the property you own (somewhere more
        affordable, with better yield, in a market with growth potential)
        is rented to a tenant who covers a chunk of your mortgage. The
        Australian property market makes this strategy work well in two
        situations: (a) your lifestyle suburb is materially more expensive
        than what you can afford to buy in, and (b) you want property
        exposure now rather than waiting 5+ years to save a deposit for the
        suburb you actually want to live in.
      </p>
      <p>
        A typical rentvester profile in Australia: late 20s to mid 30s,
        professional income, living in inner-Sydney or inner-Melbourne where
        owner-occupier purchase prices are $1.5M+, and buying a $450,000 to
        $650,000 property in a growth-corridor suburb (e.g. outer Brisbane,
        Geelong, regional NSW) as the first step on the property ladder.
      </p>

      <h2 id="who-it-suits">Who rentvesting suits</h2>
      <p>
        Rentvesting genuinely works for some profiles and is a trap for
        others.
      </p>
      <p><strong>Good fit:</strong></p>
      <ul>
        <li>Your target lifestyle suburb is materially more expensive than what you can afford to buy now (1.5×+).</li>
        <li>You&rsquo;re locked into a specific city for work but happy to invest interstate.</li>
        <li>You have stable income to ride out vacancies and interest-rate increases.</li>
        <li>You&rsquo;re comfortable being a landlord: managing a property manager, dealing with maintenance calls, accepting tenant turnover risk.</li>
        <li>You can wait 7+ years before transitioning to owner-occupier (because of forfeited scheme access).</li>
      </ul>
      <p><strong>Poor fit:</strong></p>
      <ul>
        <li>You&rsquo;re within 12–24 months of being able to buy in your target suburb. The First Home Owner Grant, stamp duty concession, and main residence CGT exemption tip the maths back the other way.</li>
        <li>Your income is variable enough that a tenant vacancy plus interest rate increase would create cash flow stress.</li>
        <li>You hate the idea of being a landlord, or you&rsquo;re not interested in monitoring the property market.</li>
        <li>You have a clear plan to start a family and buy in the next 3 years. The disruption of selling the investment to free up the deposit can be expensive.</li>
      </ul>

      <h2 id="the-maths">The maths: does it actually work?</h2>
      <p>
        The honest answer is: it depends on the spread between your
        lifestyle suburb&rsquo;s price and your investment suburb&rsquo;s
        price, your rental yield differential, your time horizon, and your
        marginal tax rate. Let&rsquo;s work an example.
      </p>
      <p>
        <strong>Sam, 32, earning $130,000, living in inner Sydney.</strong>{" "}
        Pays $850/week rent in a 1-bedroom apartment in Surry Hills. Wants to
        buy eventually but the comparable owner-occupier purchase price for
        that apartment is $950,000. To buy as owner-occupier, Sam needs
        ~$200,000 cash (deposit plus costs plus buffer). On current trajectory,
        that&rsquo;s about 5 years of saving aggressively.
      </p>
      <p>
        <strong>Rentvesting path:</strong> Sam buys a $500,000 investment
        property in Beenleigh, Queensland, a 3-bedroom house yielding 5.2%
        gross ($26,000 annual rent). Deposit required: 20% = $100,000. Plus
        ~$25,000 for stamp duty (no concession), conveyancing, building and
        pest, loan setup. Total cash needed: ~$125,000. Sam can do this in
        about 3 years on current trajectory, 2 years sooner than the
        owner-occupier path.
      </p>
      <p>
        <strong>Ongoing numbers</strong> (annual, post-purchase):
      </p>
      <ul>
        <li>Rent received: $26,000</li>
        <li>Mortgage interest (4-bedroom, $400,000 loan, 6.2% interest-only): $24,800</li>
        <li>Property management fees (7%): $1,820</li>
        <li>Council rates, insurance, repairs: ~$3,500</li>
        <li>Depreciation (paper deduction, modern build): ~$8,000</li>
        <li><strong>Cash flow before tax</strong>: 26,000 − 24,800 − 1,820 − 3,500 = <strong>−$4,120</strong> (Sam puts in $4,120/year out of pocket)</li>
        <li>Taxable position after depreciation: −$4,120 − $8,000 = <strong>−$12,120 paper loss</strong></li>
        <li>Tax benefit at 39c marginal rate: $4,727</li>
        <li><strong>True after-tax cost</strong>: $4,120 − $4,727 = <strong>+$607</strong> (essentially neutral)</li>
      </ul>
      <p>
        So the property is roughly cash-flow neutral after tax. Sam still
        pays $44,200/year in rent on the Surry Hills apartment, but the
        investment is paying for itself. The bet is on capital growth. If
        Beenleigh grows 4% annually for the next 7 years, the property is
        worth $658,000 vs $500,000 purchase, a $158,000 paper gain (less
        50% CGT discount if held over 12 months).
      </p>

      <KeyFigure
        value="2 yrs faster"
        label="Typical time-to-deposit advantage for rentvesting vs waiting for inner-city owner-occupier"
        context="At a $500K vs $950K spread"
      />

      <Callout variant="warning" title="Where the maths breaks">
        <p>
          The 4%-annual-growth assumption above is generous and not
          guaranteed. If Beenleigh grows 1.5% annually instead, Sam&rsquo;s
          gain over 7 years is $55,000, less than the cash spent on
          renting plus the holding costs. Rentvesting is a leveraged bet on
          growth; if the growth doesn&rsquo;t come, you&rsquo;d have been
          better off saving for the owner-occupier purchase. Pick your
          investment suburb deliberately.
        </p>
      </Callout>

      <PullQuote attribution="Andy McMaster, Editor">
        Rentvesting forfeits first-home-buyer status going forward.
        That trade-off only makes sense if your dream suburb is
        years away on your current trajectory.
      </PullQuote>

      <h2 id="fhog-trap">The first home buyer scheme trade-off</h2>
      <p>
        Australian <Link href="/guides/first-home-buyer-guide">first home buyer</Link> schemes are valuable. In NSW, VIC, QLD,
        WA, SA, ACT, NT and TAS, schemes for first-time owner-occupiers
        include grants ($10,000–$30,000 for new builds),{" "}
        <Link href="/stamp-duty-calculator">stamp duty</Link>{" "}
        concessions (full or partial waiver up to a threshold), and access
        to the First Home Guarantee (5% deposit, no LMI). Across these,
        first home owner-occupiers typically save $20,000–$60,000+ in cash
        on a purchase.
      </p>
      <p>
        <strong>Buying an investment property as your first property
        forfeits most of this</strong>. The eligibility criteria for all
        these schemes require that the property be your principal place of
        residence, and (in most states) that you&rsquo;ve never previously
        owned property in Australia. Once you&rsquo;ve bought an investment
        property, you&rsquo;re out of the scheme system for life in most
        states.
      </p>
      <p>
        The trade-off maths: if your spread between investment-suburb and
        lifestyle-suburb prices is small enough that the lifetime forfeited
        scheme value ($30,000–$60,000) exceeds the rentvesting growth
        upside, just buy the owner-occupier. If the spread is large
        ($500,000+ between affordable purchase and target lifestyle
        suburb), the rentvesting upside dominates.
      </p>

      <h2 id="negative-gearing">Negative gearing and tax position</h2>
      <p>
        Australian tax law allows you to deduct rental property expenses
        against your overall taxable income. When the deductions exceed the
        rent (a paper loss), the property is &quot;negatively geared&quot;
        and the loss reduces your tax bill at your marginal rate.
      </p>
      <p>
        Deductible expenses typically include:
      </p>
      <ul>
        <li><strong>Mortgage interest</strong> on the investment loan (single biggest line item).</li>
        <li><strong>Property management fees</strong> (typically 6–9% of rent collected).</li>
        <li><strong>Council rates, water rates, body corporate fees.</strong></li>
        <li><strong>Landlord insurance</strong>.</li>
        <li><strong>Repairs and maintenance</strong> (immediate deduction; improvements are depreciated).</li>
        <li><strong>Depreciation</strong>: capital works (2.5%/year for 40 years on the building) and plant & equipment (specific schedule by item).</li>
        <li><strong>Accountant fees</strong>, legal fees, advertising for tenants, travel costs (limited).</li>
      </ul>
      <p>
        At a 39c or 47c marginal rate, the tax saving on negative gearing is
        material, but never large enough that it makes a loss-making
        property profitable on its own. Read our <Link href="/guides/negative-gearing-australia">negative gearing guide</Link> for the
        mechanics, and our <Link href="/guides/property-depreciation-guide">depreciation guide</Link> for the often-missed
        deduction that can turn a cash-flow loss into a paper loss while you
        still pocket the cash.
      </p>

      <h2 id="finding-property">Finding an investment-grade property</h2>
      <p>
        This is where most rentvesters lose. The investment property has to
        be genuinely good. Bad investments lose money slowly, then quickly,
        and reset your entire wealth trajectory.
      </p>
      <p>
        Criteria for a defensible investment-grade purchase:
      </p>
      <ul>
        <li><strong>Yield 4.5%+ gross</strong>. Below that, you&rsquo;re paying for growth, which had better materialise.</li>
        <li><strong>Population growth</strong> in the LGA averaging 1.5%+ annually over the last 5 years.</li>
        <li><strong>Diverse employer base.</strong> Single-industry towns (mining, tourism) can ride high then crash; diverse local economies hold value better.</li>
        <li><strong>Infrastructure pipeline.</strong> Train station extensions, new hospitals, freeway upgrades signal future demand.</li>
        <li><strong>Owner-occupier majority</strong> in the suburb (60%+). Renter-majority suburbs have more volatility and worse capital growth historically.</li>
        <li><strong>Property type that&rsquo;s in short supply for the demand.</strong> 3-bedroom houses in a young-family suburb. 2-bedroom apartments near a hospital or university. Match the local buyer pool.</li>
      </ul>
      <p>
        Use our <Link href="/best-suburbs">best suburbs for investors</Link> ranking as a
        starting point and the <Link href="/rental-yield-calculator">rental yield calculator</Link> to model any specific property.
      </p>

      <MatchCTA kind="buyers-agent" />

      <h2 id="finance">Finance for an investment loan</h2>
      <p>
        Investment loans differ from owner-occupier loans in several
        material ways:
      </p>
      <ul>
        <li><strong>Higher interest rate.</strong> Typically 0.05–0.20% above the equivalent owner-occupier loan with the same lender.</li>
        <li><strong>Higher LMI cost.</strong> Investment LMI premiums are typically 10–20% higher than owner-occupier LMI for the same LVR.</li>
        <li><strong>Stricter serviceability.</strong> Lenders apply a higher assessment rate buffer to investment loans, partially because rental income is haircut by 70–80% for serviceability purposes.</li>
        <li><strong>Interest-only is harder to get</strong> than it used to be. APRA tightening over 2017–2024 limited interest-only investment lending; you&rsquo;ll typically need a clear repayment strategy. Many investors still use 3–5 year interest-only periods to maximise tax efficiency.</li>
        <li><strong>Cross-collateralisation risk.</strong> Some lenders try to cross-collateralise the investment loan with your existing assets. Push back and keep loans uncrossed where possible.</li>
      </ul>
      <p>
        A <Link href="/guides/how-to-choose-a-mortgage-broker">broker</Link> who specialises in investment lending earns their fee on a
        rentvesting purchase. The lender choice, the loan structure
        (offset, interest-only, fixed-vs-variable split), and the LMI
        decision all materially affect your numbers. Generic bank
        applications often get the wrong lender for the structure.
      </p>

      <h2 id="landlord-realities">Landlord realities</h2>
      <p>
        Owning an investment property is a job, even when you have a
        property manager. Things to budget for:
      </p>
      <ul>
        <li><strong>Vacancy.</strong> Plan for 2–4 weeks vacancy every 12–18 months as tenants turn over. Premium properties in tight markets see less; cheaper properties in oversupplied markets see more.</li>
        <li><strong>Maintenance.</strong> Budget 1% of property value annually on average. Hot water systems, dishwashers, fences, garage doors all fail eventually.</li>
        <li><strong>Interest rate changes.</strong> Each 0.25% rate rise on a $400K loan is $1,000/year. Multiple rate hikes can push a marginal property into serious cash-flow stress.</li>
        <li><strong>Tenant disputes.</strong> Most are minor (late rent, garden maintenance). Occasionally serious (damage, illegal use, abandonment). Property managers handle the day-to-day but you make the calls on the big stuff.</li>
        <li><strong>Legislation changes.</strong> Tenancy laws across all states have been tightening in favour of tenants (minimum standards, end-of-lease protections, rent rise limits in some states). Stay informed.</li>
      </ul>

      <h2 id="exit">When you exit: selling or transitioning</h2>
      <p>
        Most rentvesters exit one of three ways:
      </p>
      <ul>
        <li><strong>Sell the investment, use the proceeds for an owner-occupier.</strong> Most common path. <Link href="/cgt-calculator">CGT</Link> applies on the gain (50% discount after 12 months), and you forfeit grant eligibility on the next purchase. Time the sale carefully for tax: selling in a low-income year reduces the CGT bill.</li>
        <li><strong>Move into the investment property and convert to PPOR (principal place of residence).</strong> This restarts the main-residence exemption from the move-in date. Useful if you&rsquo;re relocating to that area anyway. Note: any pre-move-in CGT liability stays on the books until eventual sale.</li>
        <li><strong>Keep both, buy a second property as owner-occupier later.</strong> Requires meaningful income growth or a partner&rsquo;s borrowing capacity. Best long-term outcome if it&rsquo;s achievable: rental income from the first property partly funds the second mortgage.</li>
      </ul>

      <h2 id="common-mistakes">Common rentvesting mistakes</h2>
      <ul>
        <li><strong>Buying without doing the maths.</strong> The strategy only works if the spread is big enough. A 1.3× spread isn&rsquo;t enough; a 2× spread probably is.</li>
        <li><strong>Buying in a familiar holiday suburb.</strong> Familiar isn&rsquo;t the same as investment-grade. Run the criteria.</li>
        <li><strong>Underestimating holding costs.</strong> Vacancy, maintenance, and interest rate rises all chew through cash flow.</li>
        <li><strong>Buying a brand-new unit/townhouse off-the-plan.</strong> Developer margins, slow capital growth, and depreciation that ends in year 4–6 often combine to make off-the-plan a poor investment vs an established property.</li>
        <li><strong>Cross-collateralising loans.</strong> If your investment loan is cross-collateralised with another asset, selling becomes complicated and refinancing limited.</li>
        <li><strong>Forgetting tax planning.</strong> Negative gearing matters less than depreciation, capital growth, and exit timing. Talk to an accountant up front, not at sale time.</li>
        <li><strong>Forgetting the lifestyle suburb&rsquo;s growth.</strong> If the suburb you actually want to live in grows faster than the suburb you bought, you&rsquo;re further from your owner-occupier purchase, not closer.</li>
      </ul>

      <MatchCTA kind="accountant" />

      <Sources items={RENTVESTING_SOURCES} />
    </GuideArticleLayout>
  );
}

const RENTVESTING_SOURCES: readonly SourceItem[] = [
  { label: "ATO: Rental properties, claiming expenses", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/residential-rental-properties", note: "Deductible expense list and depreciation rules" },
  { label: "APRA: Investment lending macroprudential guidance", href: "https://www.apra.gov.au/", note: "Serviceability buffer and investor-loan policy referenced in finance section" },
  { label: "ABS: Lending Indicators", href: "https://www.abs.gov.au/statistics/economy/finance/lending-indicators", note: "Investor share of housing finance commitments" },
  { label: "NHFIC (Housing Australia): First Home Guarantee eligibility", href: "https://www.housingaustralia.gov.au/", note: "Owner-occupier requirement that disqualifies rentvesting purchases" },
  { label: "State First Home Owner Grant schedules (NSW, VIC, QLD, WA, SA, ACT, NT, TAS)", note: "Used for first-home-buyer scheme trade-off analysis" },
  { label: "CoreLogic Australia: Home Value Index methodology", href: "https://www.corelogic.com.au/our-data/methodology", note: "Capital-growth and yield benchmarks" },
];
