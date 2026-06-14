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
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Help to Buy Scheme Australia: How the Shared Equity Scheme Works (2026)",
  description:
    "How the federal Help to Buy shared equity scheme works: the government takes up to 40% equity on a new home or 30% on an existing one, you buy with a 2% deposit, income and price caps apply, and you can buy the stake out over time.",
  slug: "help-to-buy-scheme-australia",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
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
  "Help to Buy is a federal shared equity scheme. The Commonwealth takes an equity stake of up to 40% on a new home or up to 30% on an existing home, so you take out a smaller loan.",
  "You can buy with as little as a 2% deposit, and because the government owns part of the home you avoid Lenders Mortgage Insurance.",
  "Income caps and property price caps apply. The income caps are lower than the First Home Guarantee, so the scheme is aimed at lower and middle income buyers.",
  "You do not pay rent on the government's share. You repay only your own mortgage. When you can afford to, you can buy out the government's stake in stages.",
  "When you sell, the government takes its share of the sale price, including its share of any capital growth, in proportion to the equity it holds.",
  "Scheme caps, income limits and availability change. Verify current figures with Housing Australia before you rely on them.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",      label: "What Help to Buy is" },
  { id: "how-it-works",    label: "How shared equity works" },
  { id: "eligibility",     label: "Eligibility, income and price caps" },
  { id: "rent-question",   label: "Do you pay rent on the government's share?" },
  { id: "buying-out",      label: "Buying out the government's stake" },
  { id: "when-you-sell",   label: "What happens when you sell" },
  { id: "vs-guarantee",    label: "Help to Buy vs First Home Guarantee" },
  { id: "next-steps",      label: "What to do next" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the Help to Buy scheme?",
    answer:
      "Help to Buy is a federal shared equity scheme that lets eligible buyers purchase a home with the Australian Government taking a part-ownership stake. The Commonwealth contributes an equity co-investment of up to 40% on a new home or up to 30% on an existing home, which means you need a smaller mortgage. You can buy with as little as a 2% deposit and you do not pay Lenders Mortgage Insurance. The scheme is administered by Housing Australia and runs through participating lenders.",
  },
  {
    question: "Who is eligible for Help to Buy?",
    answer:
      "You must be an Australian citizen aged 18 or over, buy the home to live in (not as an investment), and not currently own any other land or property in Australia or overseas. Income caps and property price caps also apply, and the income caps are lower than the First Home Guarantee, so the scheme targets lower and middle income buyers. The exact income thresholds and price caps for your location are set by Housing Australia and change over time, so confirm the current figures before you apply.",
  },
  {
    question: "Do you have to pay rent on the government's share?",
    answer:
      "No. Under Help to Buy you do not pay rent or interest to the government on its equity share. You repay only your own home loan. The government's return comes when you sell or when you buy out its stake, because it takes its proportional share of the home's value at that point rather than charging you along the way.",
  },
  {
    question: "Can you buy out the government's stake?",
    answer:
      "Yes. If your income allows, you can make additional payments to buy back the government's equity in stages, increasing your own ownership over time until you own the home outright. Each buy-out is priced against the home's value at the time, so if the property has risen in value, buying out the stake costs more than the government originally contributed. Check the current minimum buy-out amounts and process with Housing Australia.",
  },
  {
    question: "Help to Buy vs First Home Guarantee, which is better?",
    answer:
      "They solve different problems. The First Home Guarantee lets you keep 100% ownership and buy with a 5% deposit, with the government guaranteeing the gap so you avoid LMI. Help to Buy gives you a smaller mortgage because the government co-owns up to 40% of the home, but you share future capital growth with it. Help to Buy has lower income caps and suits buyers who need to cut the loan size to afford repayments. The First Home Guarantee suits buyers who can service a larger loan and want to keep all the upside. Compare both against your borrowing power before deciding.",
  },
  {
    question: "Is Help to Buy available in every state?",
    answer:
      "Help to Buy is a national scheme legislated by the Commonwealth, but it relies on participating state and territory governments and a limited number of places each year. Availability and start dates have varied by jurisdiction, so check Housing Australia for the current operational status, place numbers and the price caps that apply where you want to buy.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide",        description: "Federal schemes, FHOG by state, stamp duty concessions and the buying process." },
  { title: "First Home Guarantee",              href: "/guides/first-home-guarantee",           description: "Buy with a 5% deposit and no LMI while keeping 100% ownership." },
  { title: "How Much Deposit to Buy a House",   href: "/guides/how-much-deposit-to-buy-a-house", description: "What you really need to save, and the schemes that lower the bar." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
  { title: "First Home Buyer Guide NSW",        href: "/guides/first-home-buyer-nsw",            description: "State grants, stamp duty and price caps for NSW buyers." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",            description: "See how a smaller loan under shared equity changes what you can afford." },
];

export default function HelpToBuySchemeAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify current figures with Housing Australia">
        <p>
          Income caps, property price caps, the number of places, and the
          scheme&rsquo;s operational status in each state all change. Always
          confirm the current rules with{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">
            Housing Australia
          </a>{" "}
          or a participating lender before you rely on any figure here.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The part most buyers miss with Help to Buy is that the government
          isn&rsquo;t lending you money, it&rsquo;s buying part of the house
          alongside you. That keeps your loan and your repayments down, which is
          the whole point if servicing is your problem. The trade is that you
          share the future growth on the slice the government owns. Whether
          that&rsquo;s a good deal depends entirely on your numbers, so work
          through your borrowing power first.
        </p>
      </EditorNote>

      <h2 id="what-it-is">What Help to Buy is</h2>
      <p className="lead">
        Help to Buy is the federal shared equity scheme, legislated in 2024 and
        run through Housing Australia. The Australian Government takes an equity
        stake in the home you buy, which means you borrow less and need a much
        smaller deposit. It is one of several first home buyer schemes covered in
        our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>.
      </p>
      <p>
        The headline figures: the government can co-invest up to{" "}
        <strong>40% of the price of a new home</strong> or up to{" "}
        <strong>30% of the price of an existing home</strong>. You provide a
        deposit of as little as <strong>2%</strong>, and because the government
        co-owns the property you do not pay Lenders Mortgage Insurance. Income
        and property price caps apply, and the income caps are lower than the
        First Home Guarantee.
      </p>

      <KeyFigure
        value="up to 40%"
        label="The equity stake the government can take in a new home (up to 30% on an existing home), so your mortgage is smaller."
        context="You contribute a deposit from 2%"
      />

      <h2 id="how-it-works">How shared equity works</h2>
      <p>
        Shared equity means you and the government own the home together. A
        simple way to picture it on an existing home: if the government takes a
        30% stake, you only need a loan to cover your 68% (the rest of the price
        after your 2% deposit), instead of a loan for the whole purchase minus
        your deposit. A smaller loan means smaller repayments, which is what
        makes an otherwise unaffordable home reachable.
      </p>
      <ul>
        <li>
          <strong>You own the majority.</strong> The government&rsquo;s stake is
          a minority share. You hold the title and live in the home as your own.
        </li>
        <li>
          <strong>Your loan is smaller.</strong> Because the government funds
          part of the purchase, you borrow less and your monthly repayments are
          lower than a standard purchase at the same price.
        </li>
        <li>
          <strong>No LMI.</strong> The small deposit doesn&rsquo;t trigger
          Lenders Mortgage Insurance, the way it normally would below a 20%
          deposit.
        </li>
      </ul>
      <p>
        Use our{" "}
        <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
        to see how a smaller loan changes what you can afford, and our guide to{" "}
        <Link href="/guides/how-much-deposit-to-buy-a-house">how much deposit you need</Link>{" "}
        to plan the 2% you have to bring.
      </p>

      <h2 id="eligibility">Eligibility, income and price caps</h2>
      <p>
        Help to Buy is for owner-occupiers, not investors. The core conditions
        are consistent, but the dollar thresholds are set by Housing Australia
        and change, so treat the points below as the shape of the rules rather
        than fixed numbers.
      </p>
      <ul>
        <li><strong>Citizenship and age:</strong> Australian citizen, aged 18 or over.</li>
        <li><strong>Live in it:</strong> You must occupy the home. It cannot be an investment property.</li>
        <li><strong>Don&rsquo;t own other property:</strong> You cannot currently own any other land or property in Australia or overseas. You do not have to be a first home buyer in the strict sense, but you must not be a current owner.</li>
        <li><strong>Income caps:</strong> Lower than the First Home Guarantee. These caps are the main thing that decides whether Help to Buy fits your situation.</li>
        <li><strong>Price caps:</strong> A maximum property value applies and varies by location, in line with local market conditions.</li>
        <li><strong>Limited places:</strong> The scheme has a capped number of places per year, so timing matters.</li>
      </ul>

      <Callout variant="info" title="The price cap is a hard line">
        <p>
          As with every government property scheme, going even slightly over the
          price cap can disqualify the whole purchase. Plan under the cap so you
          have room to negotiate. The current cap for your location is published
          by Housing Australia.
        </p>
      </Callout>

      <h2 id="rent-question">Do you pay rent on the government&rsquo;s share?</h2>
      <p>
        No. This is the question that worries most people looking at shared
        equity, and the answer is straightforward: you do not pay rent or
        interest to the government on the slice it owns. You repay only your own
        home loan, the same as any other owner. The government&rsquo;s return
        comes later, from its share of the home&rsquo;s value when you buy out
        the stake or sell.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        You don&rsquo;t pay the government rent on its share. The cost of the deal
        is the slice of future growth you hand over, not a monthly bill.
      </PullQuote>

      <h2 id="buying-out">Buying out the government&rsquo;s stake</h2>
      <p>
        You are not locked into the arrangement for the life of the loan. As your
        income grows, you can make additional payments to buy back the
        government&rsquo;s equity in stages, lifting your own ownership until you
        own the home outright.
      </p>
      <ul>
        <li>
          <strong>It&rsquo;s priced at current value.</strong> Each buy-out is
          calculated against what the home is worth at the time, not the original
          purchase price. If the property has grown in value, buying back the
          stake costs more than the government first put in.
        </li>
        <li>
          <strong>It&rsquo;s done in stages.</strong> You don&rsquo;t have to buy
          the whole stake at once. There are minimum increments, set by Housing
          Australia, so you can chip away as your finances allow.
        </li>
        <li>
          <strong>It frees the upside.</strong> Once you own the home outright,
          all future capital growth is yours, with no share owed to the
          government.
        </li>
      </ul>

      <h2 id="when-you-sell">What happens when you sell</h2>
      <p>
        If you still share ownership with the government when you sell, the
        government receives its proportional share of the sale price. Because its
        stake is a percentage of the home, that share includes its portion of any
        capital growth.
      </p>
      <ul>
        <li>
          <strong>Growth is shared in proportion.</strong> If the government owns
          30% and the home has doubled in value, it takes 30% of the higher
          price, not just the dollars it originally contributed.
        </li>
        <li>
          <strong>You keep your share.</strong> The remaining proceeds, after the
          loan and the government&rsquo;s share, are yours.
        </li>
        <li>
          <strong>Selling buys you out.</strong> A sale settles the
          government&rsquo;s interest, the same way a partial buy-out does, just
          for the whole stake at once.
        </li>
      </ul>
      <p>
        This is the genuine trade-off of shared equity: a smaller loan and easier
        entry now, in exchange for a share of the growth later. Whether it works
        for you depends on how much that growth is likely to be worth against the
        repayments you save.
      </p>

      <h2 id="vs-guarantee">Help to Buy vs the First Home Guarantee</h2>
      <p>
        Help to Buy and the{" "}
        <Link href="/guides/first-home-guarantee">First Home Guarantee</Link> are
        easy to confuse because both cut the deposit and both waive LMI. They
        work very differently underneath.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Help to Buy</th>
            <th>First Home Guarantee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>What the government does</strong></td>
            <td>Co-owns up to 40% (new) / 30% (existing) of the home</td>
            <td>Guarantees the deposit gap; owns nothing</td>
          </tr>
          <tr>
            <td><strong>Deposit</strong></td>
            <td>From 2%</td>
            <td>From 5%</td>
          </tr>
          <tr>
            <td><strong>Your ownership</strong></td>
            <td>Majority share, government holds the rest</td>
            <td>100%</td>
          </tr>
          <tr>
            <td><strong>Loan size</strong></td>
            <td>Smaller (government funds part of the price)</td>
            <td>Full price less your deposit</td>
          </tr>
          <tr>
            <td><strong>Future growth</strong></td>
            <td>Shared with the government until you buy it out</td>
            <td>All yours</td>
          </tr>
          <tr>
            <td><strong>Income caps</strong></td>
            <td>Lower</td>
            <td>Higher ($125K single / $200K couple)</td>
          </tr>
        </tbody>
      </table>
      <p>
        In short: Help to Buy suits buyers who need the smaller loan to make
        repayments work and accept sharing the upside. The First Home Guarantee
        suits buyers who can service the bigger loan and want to keep all the
        growth. Run both past your{" "}
        <Link href="/borrowing-power-calculator">borrowing power</Link> before you
        commit to either.
      </p>

      <MatchCTA
        kind="mortgage-broker"
        lead="Weighing Help to Buy against the First Home Guarantee? A broker can model both against the loan you can actually service, and tell you which lenders have scheme places left this year."
        ctaLabel="Compare your options"
      />

      <h2 id="next-steps">What to do next</h2>
      <ol>
        <li>
          <strong>Check the current caps.</strong> Confirm the income and price
          caps for your location with{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">
            Housing Australia
          </a>
          , because they change and they decide your eligibility.
        </li>
        <li>
          <strong>Work out your loan size.</strong> Use the{" "}
          <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
          to see how the smaller mortgage under shared equity changes what you
          can afford.
        </li>
        <li>
          <strong>Plan your deposit.</strong> Our guide to{" "}
          <Link href="/guides/how-much-deposit-to-buy-a-house">how much deposit you need</Link>{" "}
          covers the 2% you have to bring plus the other upfront costs.
        </li>
        <li>
          <strong>Read the full scheme picture.</strong> The{" "}
          <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
          compares Help to Buy against grants, stamp duty concessions and the
          other federal schemes side by side.
        </li>
      </ol>

      <MatchCTA kind="mortgage-broker" />

      <Sources items={HELP_TO_BUY_SOURCES} />
    </GuideArticleLayout>
  );
}

const HELP_TO_BUY_SOURCES: readonly SourceItem[] = [
  { label: "Housing Australia: Help to Buy scheme", href: "https://www.housingaustralia.gov.au", note: "Official income caps, price caps, places and eligibility" },
  { label: "Australian Government: Help to Buy program", href: "https://www.housing.gov.au", note: "Policy background on the shared equity scheme" },
  { label: "ASIC MoneySmart: Buying a home", href: "https://moneysmart.gov.au/buying-a-home", note: "Consumer guidance on deposits, LMI and home buyer schemes" },
];
