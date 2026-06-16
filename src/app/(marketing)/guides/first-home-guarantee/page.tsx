import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  EditorNote,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Guarantee 2026: Buy With a 5% Deposit, No LMI",
  description:
    "How the Australian Government 5% Deposit Scheme (the expanded First Home Guarantee) lets eligible first home buyers purchase with a 5% deposit and no Lenders Mortgage Insurance. The 2025 expansion, price caps, the Family Home Guarantee, and how it stacks with the FHOG.",
  slug: "first-home-guarantee",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-16",
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

const TLDR = [
  "The First Home Guarantee lets eligible first home buyers purchase with a 5% deposit, while the government guarantees the gap so you skip Lenders Mortgage Insurance.",
  "In late 2025 the scheme was expanded and renamed the Australian Government 5% Deposit Scheme. The expansion removed the income caps and the annual limit on places, and lifted the property price caps.",
  "There is no longer an income test, and places are now uncapped, so eligibility no longer depends on how much you earn or how early in the year you apply.",
  "Property price caps still apply and were increased. In NSW capital cities and regional centres the cap rose to $1.5 million. Caps differ by state and region, so check Housing Australia for the exact cap in your location.",
  "The Family Home Guarantee is a related scheme that lets eligible single parents and guardians buy with a 2% deposit, even if they have owned a home before. Confirm the current detail with Housing Australia.",
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
      "The First Home Guarantee is a federal scheme run through Housing Australia. In late 2025 it was expanded and renamed the Australian Government 5% Deposit Scheme, and it is now open to all eligible first home buyers. It lets eligible first home buyers purchase a home with as little as a 5% deposit. The government guarantees the rest of the deposit a lender would normally want, so you avoid paying Lenders Mortgage Insurance. It does not give you cash and it does not lend you money. It sits behind your loan as a guarantee, which is what removes the LMI cost.",
  },
  {
    question: "Are there income limits for the First Home Guarantee?",
    answer:
      "No. The late-2025 expansion removed the income caps, so there is no longer an income test. The scheme used to limit applicants to set income thresholds, but those were scrapped when it was opened to all eligible first home buyers and renamed the Australian Government 5% Deposit Scheme. Eligibility now turns on being a first home buyer who meets the core rules and buys under the property price cap, not on how much you earn. Confirm the current rules with Housing Australia before you rely on them.",
  },
  {
    question: "Can you use the First Home Guarantee with the First Home Owner Grant?",
    answer:
      "Yes, in most cases, if you meet the rules for both. The First Home Guarantee handles the deposit and LMI side and can be used on new or established homes. The First Home Owner Grant is a separate state cash grant that generally applies to new homes only. Where you qualify for both, they stack, and you can usually add a first home buyer stamp duty concession on top. Check the price cap for each, because they are not always the same number.",
  },
  {
    question: "What is the Family Home Guarantee?",
    answer:
      "The Family Home Guarantee is a related federal scheme for eligible single parents and single legal guardians with at least one dependent child. It allows a purchase with a 2% deposit and no LMI. Unlike the First Home Guarantee, you do not have to be a first home buyer. You can use it even if you have owned property before, as long as you do not currently own a home. Eligibility and price cap detail can change, so verify the current rules with Housing Australia.",
  },
  {
    question: "How do you apply for the First Home Guarantee?",
    answer:
      "You apply through a participating lender, not directly with the government. Most major banks and many smaller lenders take part. You can go direct to a lender or use a mortgage broker, who can compare lenders and structure the loan to use the guarantee. The guarantee is assessed as part of your normal home loan application. There is no separate government form for the guarantee itself.",
  },
  {
    question: "How many First Home Guarantee places are there each year?",
    answer:
      "Places are now uncapped. The late-2025 expansion removed the annual limit on the number of places, so there is no longer a fixed allocation that can run out partway through the year. You no longer need to rush in early to secure a place. As long as you are an eligible first home buyer and buy under the property price cap, you can apply through a participating lender at any time. Confirm the current rules on the Housing Australia website.",
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
      <Callout variant="warning" title="Verify current figures before you rely on them">
        <p>
          In late 2025 the scheme was expanded and renamed the Australian Government 5%
          Deposit Scheme. The income caps and the limit on the number of places were
          removed, and the property price caps were lifted. Property price caps still
          apply and can change, so always confirm the current rules with{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">
            Housing Australia
          </a>{" "}
          or a participating lender before you make an offer or sign a contract.
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
        It lets eligible first home buyers purchase with as little as a 5% deposit,
        with the government guaranteeing the rest so you avoid Lenders Mortgage
        Insurance.
      </p>
      <p>
        In late 2025 the scheme was expanded and renamed the Australian Government
        5% Deposit Scheme. The expansion removed the income caps and the annual
        limit on places, and lifted the property price caps, so it is now open to
        all eligible first home buyers rather than a set number each year.
      </p>
      <p>
        The scheme does not hand you cash and it does not lend you anything. It
        stands behind your home loan as a guarantee for the portion of the deposit
        you don&rsquo;t have. That guarantee is what lets a lender approve you at a
        5% deposit without charging LMI. It can be used on new and established
        homes, which sets it apart from most state grants.
      </p>

      <KeyFigure
        value="5% deposit"
        label="What an eligible first home buyer needs under the FHBG, with the government guaranteeing the gap so there's no LMI."
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
        Under the First Home Guarantee, the government guarantees the difference
        between your 5% deposit and the 20% the lender would otherwise want. The
        lender treats you as if you had the larger deposit, so the LMI premium is
        waived. You still take out a normal home loan, still pass the lender&rsquo;s
        serviceability checks, and still repay the full amount you borrow. The
        guarantee simply removes the insurance cost.
      </p>
      <p>
        Because you only need a 5% deposit, you can buy years sooner than if you
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
        Since the late-2025 expansion there is no income test, so the main things
        that decide whether you can use the scheme are who you are and how much the
        property costs.
      </p>
      <ul>
        <li>
          <strong>No income test:</strong> The income caps were removed when the
          scheme was expanded, so eligibility no longer depends on how much you earn.
        </li>
        <li>
          <strong>Who qualifies:</strong> Australian citizens or permanent residents
          aged 18 or over who have not previously owned, or held an interest in, real
          property in Australia.
        </li>
        <li>
          <strong>Owner-occupier only:</strong> You must move in and live in the
          property. The scheme is not for investment purchases.
        </li>
        <li>
          <strong>At least a 5% deposit:</strong> You bring a deposit of 5% or more
          and the government guarantees the shortfall, which is what removes the LMI.
        </li>
        <li>
          <strong>Property price caps:</strong> These still apply and were increased
          in the expansion. In NSW capital cities and regional centres the cap rose to
          $1.5 million. Caps differ by state and region, so check the cap for your
          exact location on the Housing Australia website before you make an offer.
        </li>
      </ul>

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
        Two related schemes sit alongside the First Home Guarantee, though the
        regional pathway changed in the 2025 expansion.
      </p>

      <h3>Regional First Home Buyer Guarantee</h3>
      <p>
        The separate regional guarantee was effectively absorbed into the expanded,
        uncapped scheme. Because the First Home Guarantee is now open to all eligible
        first home buyers with no income test and no limit on places, there is no
        longer a separate regional allocation to compete for. Regional buyers use the
        same scheme, with the property price cap that applies to their location.
      </p>

      <h3>Family Home Guarantee</h3>
      <p>
        Built for eligible single parents and single legal guardians with at least
        one dependent child. It allows a purchase with a{" "}
        <strong>2% deposit</strong> and no LMI. The key difference is that you do not
        have to be a first home buyer. You can use it even if you have owned property
        before, as long as you do not currently own a home. Eligibility and price cap
        detail can change, so verify the current rules with Housing Australia.
      </p>

      <KeyFigure
        value="2% deposit"
        label="What an eligible single parent or guardian needs under the Family Home Guarantee, even if they have owned a home before."
        context="Verify current eligibility with Housing Australia"
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
          stacks on top of the FHBG. Amounts and price caps vary by state, so check
          your state revenue office.
        </li>
        <li>
          <strong>Stamp duty concessions:</strong> Most states offer first home
          buyers a full exemption or reduced rate on stamp duty up to a threshold.
          This often saves more than the grant itself.
        </li>
        <li>
          <strong>The guarantee:</strong> On top of those, the FHBG removes the LMI
          premium and lets you buy with a 5% deposit.
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
          <strong>Check your eligibility</strong> against the first home buyer rules
          and the price cap for your location on the Housing Australia website. There
          is no income test since the 2025 expansion.
        </li>
        <li>
          <strong>Choose a participating lender,</strong> or use a mortgage broker
          who can compare lenders and structure the loan to use the guarantee.
        </li>
        <li>
          <strong>Get pre-approval</strong> that specifies you&rsquo;re using the
          First Home Guarantee, so the lender structures the loan correctly from the
          start.
        </li>
        <li>
          <strong>Buy under the price cap</strong> and confirm any state grant and
          stamp duty concession with your conveyancer before settlement.
        </li>
        <li>
          <strong>Settle as normal.</strong> The guarantee sits behind the loan; you
          repay your lender the way any borrower does.
        </li>
      </ol>
      <p>
        Places are now uncapped, so you no longer need to race to secure one early in
        the financial year. Worth knowing too: because the scheme is now demand-side
        and open to all eligible first home buyers, it has been linked to upward
        pressure on first home buyer prices, so buy on the fundamentals rather than
        stretching to the cap. For the full picture across every scheme, grant and
        concession, read the{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>.
      </p>

      <MatchCTA kind="buyers-agent" />
    </GuideArticleLayout>
  );
}
