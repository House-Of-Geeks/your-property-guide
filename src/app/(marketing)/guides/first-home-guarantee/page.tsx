import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  EditorNote,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HomeGuaranteeCapsTable } from "@/components/guide/HomeGuaranteeNote";
import { formatDate } from "@/lib/utils/format";
import {
  HG_CHECKED_ON,
  HG_DATES,
  HG_GUARANTEE_FROM_LVR,
  HG_MAX_TERM_YEARS,
  HG_MIN_AGE,
  HG_MIN_DEPOSIT_PCT,
  HG_MOVE_IN_MONTHS,
  HG_NO_OWNERSHIP_YEARS,
  HG_PREAPPROVAL_DAYS,
  HG_PRICE_CAPS,
  HG_SINGLE_PARENT_SELL_WEEKS,
  HG_SOURCES,
  fmtCap,
} from "@/lib/data/home-guarantee";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Guarantee 2026: Buy With a 5% Deposit, No LMI",
  description:
    "How the Australian Government 5% Deposit Scheme (the expanded First Home Guarantee) lets eligible first home buyers purchase with a 5% deposit and no Lenders Mortgage Insurance. The 2025 expansion, price caps, the Family Home Guarantee, and how it stacks with the FHOG.",
  slug: "first-home-guarantee",
  publishedAt: "2026-06-14",
  updatedAt: "2026-10-07",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
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

const FHB = HG_MIN_DEPOSIT_PCT.firstHome;
const SP = HG_MIN_DEPOSIT_PCT.singleParent;
const CHECKED = formatDate(HG_CHECKED_ON);

const TLDR = [
  `The First Home Guarantee lets eligible first home buyers purchase with a ${FHB}% deposit, while the government guarantees the gap so you skip Lenders Mortgage Insurance.`,
  `On ${HG_DATES.expanded} the scheme was expanded and renamed the Australian Government 5% Deposit Scheme. The expansion removed the income test and the annual limit on places, lifted the property price caps, and closed the Regional First Home Buyer Guarantee to new applicants.`,
  `You can still use it if you've owned a home before, as long as you haven't owned property in Australia in the last ${HG_NO_OWNERSHIP_YEARS} years.`,
  `Price caps still apply, such as ${fmtCap(HG_PRICE_CAPS.NSW.capital)} in Greater Sydney, ${fmtCap(HG_PRICE_CAPS.VIC.capital)} in Greater Melbourne and ${fmtCap(HG_PRICE_CAPS.TAS.capital)} in Greater Hobart. The table below has every state and territory.`,
  `Single parents and legal guardians can buy with a ${SP}% deposit under the Family Home Guarantee, with no income test, even if they have owned a home before.`,
  "The scheme can stack with a state First Home Owner Grant and a first home buyer stamp duty concession, which is where the big savings add up.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",      label: "What the First Home Guarantee is" },
  { id: "how-it-works",    label: "How the 5% deposit and no LMI works" },
  { id: "eligibility",     label: "Eligibility and price caps" },
  { id: "related",         label: "Regional and Family Home Guarantees" },
  { id: "stacking",        label: "Stacking with the FHOG and stamp duty" },
  { id: "applying",        label: "How to apply" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the First Home Guarantee?",
    answer:
      `The First Home Guarantee is a federal scheme run through Housing Australia. On ${HG_DATES.expanded} it was expanded and renamed the Australian Government 5% Deposit Scheme, and it is now open to all eligible first home buyers. It lets eligible first home buyers purchase a home with as little as a ${FHB}% deposit. The government guarantees the part of the loan above ${HG_GUARANTEE_FROM_LVR}% of the property's value, so you avoid paying Lenders Mortgage Insurance. It does not give you cash and it does not lend you money. It sits behind your loan as a guarantee, which is what removes the LMI cost.`,
  },
  {
    question: "Are there income limits for the First Home Guarantee?",
    answer:
      `No. The income test was removed on ${HG_DATES.expanded}, when the scheme was opened to all eligible first home buyers and renamed the Australian Government 5% Deposit Scheme. Eligibility now turns on being a first home buyer who meets the core rules and buys under the property price cap, not on how much you earn. Single parents and legal guardians using the Family Home Guarantee have no income test either.`,
  },
  {
    question: "Can I use the 5% Deposit Scheme if I've owned a home before?",
    answer:
      `Yes, if you haven't owned property in Australia in the last ${HG_NO_OWNERSHIP_YEARS} years. That includes a lease of land and company title. Housing Australia measures the ${HG_NO_OWNERSHIP_YEARS} years from the date your previous property sold to the date you sign the new loan. Single parents and legal guardians can use the Family Home Guarantee even if they own a home now, as long as they sell it within ${HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling the new one.`,
  },
  {
    question: "Can you use the First Home Guarantee with the First Home Owner Grant?",
    answer:
      "Yes, in most cases, if you meet the rules for both. The First Home Guarantee handles the deposit and LMI side and can be used on new or established homes. The First Home Owner Grant is a separate state cash grant that generally applies to new homes only. Where you qualify for both, they stack, and you can usually add a first home buyer stamp duty concession on top. Check the price cap for each, because they are not always the same number.",
  },
  {
    question: "What is the Family Home Guarantee?",
    answer:
      `The Family Home Guarantee is the part of the scheme for single parents and single legal guardians with at least one dependent child, now marketed as the 5% Deposit Scheme for single parents. It allows a purchase with a ${SP}% deposit and no LMI, with no income test and no limit on places. You do not have to be a first home buyer, but any other home you own must be sold within ${HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling, and you apply on your own. The price caps are the same as for first home buyers.`,
  },
  {
    question: "How do you apply for the First Home Guarantee?",
    answer:
      "You apply through a participating lender, not directly with the government. You can go direct to a lender or use a mortgage broker, who can compare lenders and structure the loan to use the guarantee. The lender assesses the guarantee as part of your normal home loan application and lodges it with Housing Australia. There is no separate government form for the guarantee itself.",
  },
  {
    question: "How many First Home Guarantee places are there each year?",
    answer:
      `There is no limit. Since ${HG_DATES.expanded} Housing Australia says places are unlimited and there is no waiting list, so there is no fixed allocation that can run out partway through the year. As long as you are an eligible first home buyer and buy under the property price cap, you can apply through a participating lender at any time.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)",  href: "/guides/first-home-buyer-guide",            description: "Every federal scheme, the FHOG by state, stamp duty concessions and the buying process." },
  { title: "Help to Buy Scheme",                 href: "/guides/help-to-buy-scheme-australia",       description: "The shared equity scheme where the government co-invests to shrink your mortgage." },
  { title: "Lenders Mortgage Insurance",         href: "/guides/lenders-mortgage-insurance-guide",   description: "What LMI costs and exactly how the guarantee schemes waive it." },
  { title: "How Much Deposit to Buy a House",    href: "/guides/how-much-deposit-to-buy-a-house",    description: "What you really need to save, with and without a government scheme." },
  { title: "First Home Buyer Guide, NSW",        href: "/guides/first-home-buyer-nsw",               description: "State-specific grants, stamp duty and price caps for New South Wales." },
  { title: "Borrowing Power Calculator",         href: "/borrowing-power-calculator",                description: "Estimate how much a lender might let you borrow in under a minute." },
];

export default function FirstHomeGuaranteePage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title={`Checked against Housing Australia on ${CHECKED}`}>
        <p>
          On {HG_DATES.expanded} the scheme was expanded and renamed the Australian
          Government 5% Deposit Scheme. The income test and the limit on places were
          removed, and the property price caps were lifted. Every figure on this page
          comes from{" "}
          <a href={HG_SOURCES.scheme.href} target="_blank" rel="noopener noreferrer">
            Housing Australia
          </a>{" "}
          and the legislation behind the scheme, read on {CHECKED}. Caps change only when
          the government amends that legislation, so confirm the cap for your address
          with a participating lender before you sign a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The part most buyers miss is that the First Home Guarantee isn&rsquo;t
          money in your pocket. It&rsquo;s a guarantee sitting behind your loan
          that removes the LMI bill. The real saving is the LMI you don&rsquo;t
          pay, plus the years you don&rsquo;t spend saving the extra 15% of
          deposit. Since the late-2025 expansion there&rsquo;s no income test and
          no limit on places, so the focus shifts to buying under the price cap
          and making sure the larger loan suits your budget.
        </p>
      </EditorNote>

      <h2 id="what-it-is">What the First Home Guarantee is</h2>
      <p className="lead">
        The First Home Guarantee is a federal scheme run through Housing Australia.
        It lets eligible first home buyers purchase with as little as a {FHB}% deposit,
        with the government guaranteeing the rest so you avoid Lenders Mortgage
        Insurance.
      </p>
      <p>
        On {HG_DATES.expanded} the scheme was expanded and renamed the Australian Government
        5% Deposit Scheme. The expansion removed the income test and the annual
        limit on places, and lifted the property price caps, so it is now open to
        all eligible first home buyers rather than a set number each year.
      </p>
      <p>
        The scheme does not hand you cash and it does not lend you anything. It
        stands behind your home loan as a guarantee for the portion of the deposit
        you don&rsquo;t have. That guarantee is what lets a lender approve you at a
        {" "}{FHB}% deposit without charging LMI. It can be used on new and established
        homes, which sets it apart from most state grants.
      </p>

      <KeyFigure
        value={`${FHB}% deposit`}
        label="What an eligible first home buyer needs under the 5% Deposit Scheme, with the government guaranteeing the gap so there's no LMI."
        context="New and established homes, subject to price caps"
      />

      <h2 id="how-it-works">How the 5% deposit and no LMI works</h2>
      <p>
        Normally a lender wants a 20% deposit. Put down less and they charge
        Lenders Mortgage Insurance, a one-off premium that protects the lender (not
        you) if the loan goes bad. On a typical purchase that premium runs into the
        thousands or tens of thousands of dollars, and it&rsquo;s usually added to
        the loan. Our{" "}
        <Link href="/guides/lenders-mortgage-insurance-guide">guide to how LMI works</Link>{" "}
        breaks down what it costs and why.
      </p>
      <p>
        Under the First Home Guarantee, the government guarantees the part of the loan
        above {HG_GUARANTEE_FROM_LVR}% of the property&rsquo;s value: up to{" "}
        {100 - HG_GUARANTEE_FROM_LVR - FHB}% with a {FHB}% deposit. The lender treats you as
        if you had the larger deposit, so the LMI premium is waived. You still take out
        a normal principal and interest home loan of up to {HG_MAX_TERM_YEARS}{" "}
        years, still pass the lender&rsquo;s serviceability checks, and still repay the full
        amount you borrow. The guarantee ends once the loan falls to{" "}
        {HG_GUARANTEE_FROM_LVR}% of the property&rsquo;s value.
      </p>
      <p>
        Because you only need a {FHB}% deposit, you can buy years sooner than if you
        waited to save 20%. The trade-off is a larger loan and larger repayments,
        so make sure the numbers work for your budget, not just for getting in the
        door. Our{" "}
        <Link href="/guides/how-much-deposit-to-buy-a-house">deposit guide</Link>{" "}
        and the{" "}
        <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
        help you sense-check both sides.
      </p>

      <h2 id="eligibility">Eligibility and price caps</h2>
      <p>
        There is no income test, so the main things that decide whether you can use
        the scheme are who you are and how much the property costs.
      </p>
      <ul>
        <li>
          <strong>No income test:</strong> The income caps were removed on{" "}
          {HG_DATES.expanded}, so eligibility no longer depends on how much you earn.
        </li>
        <li>
          <strong>Who qualifies:</strong> Australian citizens or permanent residents
          aged {HG_MIN_AGE}{" "}
          or over who haven&rsquo;t owned property in Australia in the
          last {HG_NO_OWNERSHIP_YEARS} years. That includes a freehold home or land, a
          lease of land and company title. You can apply alone or with one other
          person: a partner, friend or family member, who must also qualify.
        </li>
        <li>
          <strong>Owner-occupier only:</strong> You must move in within{" "}
          {HG_MOVE_IN_MONTHS} months of settlement and keep living there while the
          guarantee is in place. The scheme is not for investment purchases.
        </li>
        <li>
          <strong>At least a {FHB}% deposit:</strong> You bring a deposit of {FHB}% or more
          and the government guarantees the shortfall, which is what removes the LMI.
        </li>
        <li>
          <strong>Property price caps:</strong>{" "}
          These still apply and depend on where
          the home is. Both the price and the lender&rsquo;s valuation must be at or
          under the cap. For a house and land package or a build on vacant land, the
          land and the build together count.
        </li>
      </ul>

      <HomeGuaranteeCapsTable />

      <Callout variant="info" title="One dollar over the cap and you're out">
        <p>
          The price caps are firm. A purchase even slightly above the cap for your
          location is disqualified from the guarantee entirely. Plan to buy
          comfortably under the cap so there&rsquo;s room to negotiate without losing
          access to the scheme.
        </p>
      </Callout>

      <h2 id="related">Regional and Family Home Guarantees</h2>
      <p>
        Two related schemes sat alongside the First Home Guarantee. One closed in the
        2025 expansion; the other is now part of the 5% Deposit Scheme.
      </p>

      <h3>Regional First Home Buyer Guarantee</h3>
      <p>
        Closed. Housing Australia hasn&rsquo;t issued a new regional guarantee since{" "}
        {HG_DATES.expanded}. Because the First Home Guarantee is now open to all eligible
        first home buyers with no income test and no limit on places, there is no
        separate regional allocation to compete for. Regional buyers use the same
        scheme, at the price cap for their area.
      </p>

      <h3>Family Home Guarantee</h3>
      <p>
        Built for single parents and single legal guardians with at least one
        dependent child, and now marketed as the 5% Deposit Scheme for single parents.
        It allows a purchase with a <strong>{SP}% deposit</strong>{" "}
        and no LMI, with no
        income test, no limit on places, and the same price caps. You don&rsquo;t have
        to be a first home buyer: if you own a home now, you can still use it as long
        as you sell that home within {HG_SINGLE_PARENT_SELL_WEEKS}{" "}
        weeks of settling, or
        you&rsquo;re buying out a co-owner of the home you&rsquo;re in. You apply on your
        own, with no joint applications.
      </p>

      <KeyFigure
        value={`${SP}% deposit`}
        label="What an eligible single parent or guardian needs under the Family Home Guarantee, even if they have owned a home before."
        context={`No income test since ${HG_DATES.expanded}`}
      />

      <p>
        There is also the{" "}
        <Link href="/guides/help-to-buy-scheme-australia">Help to Buy shared equity scheme</Link>,
        where the government co-invests in the property to shrink the mortgage you
        need. It is a different mechanism to the guarantees and worth comparing if a
        smaller loan matters more to you than full ownership from day one.
      </p>

      <h2 id="stacking">Stacking with the FHOG and stamp duty</h2>
      <p>
        The First Home Guarantee is most powerful when combined with other first home
        buyer support, because each one tackles a different cost.
      </p>
      <ul>
        <li>
          <strong>First Home Owner Grant (FHOG):</strong> A state cash grant that
          generally applies to new homes only. Where you qualify for both, the FHOG
          stacks on top of the guarantee. Amounts and price caps vary by state, so check
          your state revenue office.
        </li>
        <li>
          <strong>Stamp duty concessions:</strong> Most states offer first home
          buyers a full exemption or reduced rate on stamp duty up to a threshold.
          This often saves more than the grant itself.
        </li>
        <li>
          <strong>The guarantee:</strong> On top of those, the guarantee removes the LMI
          premium and lets you buy with a {FHB}% deposit.
        </li>
      </ul>
      <p>
        Stacked together, an eligible buyer can save a substantial sum on a typical
        purchase. The exact figure depends on your state, the property and your
        eligibility. Our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
        sets out the FHOG by state, the stamp duty thresholds, and how the schemes
        interact, with the figures kept current.
      </p>

      <MatchCTA
        kind="mortgage-broker"
        lead="Planning a first purchase with the guarantee? The free guide covers the deposit, the schemes you can stack, and the order to do things in."
      />

      <h2 id="applying">How to apply for the First Home Guarantee</h2>
      <p>
        You apply through a participating lender, not directly with the government.
        The guarantee is assessed as part of your normal home loan application, so
        there is no separate government form for it.
      </p>
      <ol>
        <li>
          <strong>Check your eligibility</strong>{" "}
          against the first home buyer rules
          and the price cap for your location with Housing Australia&rsquo;s{" "}
          <a href={HG_SOURCES.priceCaps.href} target="_blank" rel="noopener noreferrer">postcode tool</a>.
          There is no income test.
        </li>
        <li>
          <strong>Choose a participating lender,</strong> or use a mortgage broker
          who can compare lenders and structure the loan to use the guarantee.
        </li>
        <li>
          <strong>Get pre-approval</strong>{" "}
          that specifies you&rsquo;re using the
          5% Deposit Scheme. Once you&rsquo;re pre-approved, you have{" "}
          {HG_PREAPPROVAL_DAYS} days to find a home and sign a contract.
        </li>
        <li>
          <strong>Buy under the price cap</strong> and confirm any state grant and
          stamp duty concession with your conveyancer before settlement.
        </li>
        <li>
          <strong>Settle and move in</strong> within {HG_MOVE_IN_MONTHS} months. The
          guarantee sits behind the loan; you repay your lender the way any borrower does.
        </li>
      </ol>
      <p>
        Places are unlimited, so you don&rsquo;t need to race to secure one early in
        the financial year. Worth knowing too: because the scheme is now demand-side
        and open to all eligible first home buyers, it has been linked to upward
        pressure on first home buyer prices, so buy on the fundamentals rather than
        stretching to the cap. For the full picture across every scheme, grant and
        concession, read the{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>.
      </p>

      <MatchCTA kind="buyers-agent" />

      <Sources
        items={[
          { ...HG_SOURCES.scheme, note: `read ${CHECKED}` },
          { ...HG_SOURCES.priceCaps, note: `read ${CHECKED}` },
          { ...HG_SOURCES.faqs, note: "the 10-year rule, the six-month move-in rule, unlimited places" },
          { ...HG_SOURCES.singleParents, note: "Family Home Guarantee eligibility" },
          { ...HG_SOURCES.factSheet, note: "loan terms and the vacant land rule" },
          { ...HG_SOURCES.mandate, note: "eligibility (s29D), price caps (s29F), the guarantee (s29H), regional closure (s29IBA)" },
          { ...HG_SOURCES.expansion, note: `the ${HG_DATES.expanded} expansion` },
          { ...HG_SOURCES.ntCaps, note: `Darwin's higher cap from ${HG_DATES.ntCapSplit}` },
        ]}
      />
    </GuideArticleLayout>
  );
}
