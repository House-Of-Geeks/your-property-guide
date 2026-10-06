import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import {
  DEPOSIT_BOND_FEE_SOURCE,
  FEE_TABLE_AMOUNTS,
  FEE_TABLE_MONTHS,
  LONG_TERM,
  SHORT_TERM,
  depositBondFee,
} from "@/lib/deposit-bond";

const FRONTMATTER: GuideFrontmatter = {
  title: "Deposit Bonds Australia: How They Work, What They Cost & the Risks (2026)",
  description:
    "What a deposit bond is, what it costs, who issues them, when a seller can refuse one, how they work at auction, and how a bond fits when you buy your next home before selling the current one.",
  slug: "deposit-bonds",
  publishedAt: "2026-10-06",
  updatedAt: "2026-10-06",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "upgrading",
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

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
// Fees are computed from the issuer's published calculator settings
// (src/lib/deposit-bond.ts, pinned by tests/lib/deposit-bond.test.ts).
const FEE_100K_6 = depositBondFee(100_000, 6);
const FEE_60K_24 = depositBondFee(60_000, 24);

const TLDR = [
  "A deposit bond is a guarantee you give the seller instead of a cash deposit when you exchange contracts. It promises the deposit will be paid. At settlement you pay the full price, deposit included, and the bond lapses.",
  "It suits buyers whose cash is tied up: in the home they're selling, in an investment, or in an off-the-plan purchase that settles years away.",
  `Deposit Power's calculator charges ${SHORT_TERM.ratePct}% of the deposit for a bond of up to ${SHORT_TERM.maxMonths} months, so a $100,000 deposit costs about ${fmt(FEE_100K_6)}. Longer bonds cost ${LONG_TERM.ratePctPerYear}% a year.`,
  "The seller has to accept it. Under the NSW standard contract the seller approves the issuer, the amount and the expiry date, and a bond that runs out before settlement can let the seller end the contract.",
  "It isn't insurance for you. If you don't settle, the issuer pays the seller and then recovers the money from you.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is",       label: "What is a deposit bond?" },
  { id: "how-it-works",  label: "How a deposit bond works" },
  { id: "cost",          label: "What a deposit bond costs" },
  { id: "who-issues",    label: "Who issues deposit bonds" },
  { id: "eligibility",   label: "Who can get one" },
  { id: "acceptance",    label: "Will the seller accept one?" },
  { id: "auctions",      label: "Deposit bonds at auction" },
  { id: "risks",         label: "The risks" },
  { id: "vs-bridging",   label: "Deposit bond vs bridging loan vs bank guarantee" },
  { id: "moving-home",   label: "Using a bond when you buy before you sell" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is a deposit bond?",
    answer:
      "A guarantee used instead of a cash deposit when you exchange contracts on a property. The issuer promises the seller that the deposit will be paid. " +
      "You still pay the full price, deposit included, at settlement, and the bond then lapses.",
  },
  {
    question: "How much does a deposit bond cost?",
    answer:
      `Deposit Power's online calculator charges ${SHORT_TERM.ratePct}% of the deposit for a bond of up to ${SHORT_TERM.maxMonths} months (minimum ${fmt(SHORT_TERM.minimum)}) and ${LONG_TERM.ratePctPerYear}% a year, by the month, for longer bonds (minimum ${fmt(LONG_TERM.minimum)}). ` +
      `That makes a $100,000 bond about ${fmt(FEE_100K_6)} for six months, and a $60,000 off-the-plan bond about ${fmt(FEE_60K_24)} for two years. The calculator says its figures are indicative, and other issuers price differently.`,
  },
  {
    question: "What are the risks of a deposit bond?",
    answer:
      "You stay liable for the deposit: if you don't settle, the issuer pays the seller and recovers the money from you. A bond that expires before settlement can give the seller grounds to end the contract. " +
      "The fee is mostly non-refundable, and you still need the full purchase price at settlement.",
  },
  {
    question: "Can you use a deposit bond at auction?",
    answer:
      "Only if the seller agrees before you bid. The deposit is due when you sign on the day, so check with the agent first. REINSW says any other way of paying the deposit needs everyone's agreement, with contract changes drafted by the seller's solicitor.",
  },
  {
    question: "How long does a deposit bond last?",
    answer:
      "Short-term bonds for established homes run up to 6 months. Long-term bonds for off-the-plan, land or homes under construction run much longer: up to 66 months at Deposit Power and Deposit Bond Australia.",
  },
  {
    question: "Do banks offer deposit bonds?",
    answer:
      "We found none that do for home buyers. ANZ says it doesn't offer deposit bonds, and CBA and NAB publish only bank guarantees for business. Deposit bonds come from specialist issuers backed by an insurer.",
  },
  {
    question: "Deposit bond or bridging loan: which do I need?",
    answer:
      "A deposit bond covers only the deposit at exchange. A bridging loan funds the whole purchase until your current home sells. " +
      "If your sale will settle before your purchase does, a bond can be enough. If you need to settle the new home first, you need finance for the full price, which may be a bridging loan.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Alternatives to a Bridging Loan", href: "/guides/bridging-loan-alternatives", description: "Selling first, subject-to-sale, longer settlements and deposit bonds compared." },
  { title: "Bridging Loans Guide", href: "/guides/bridging-loans-guide", description: "How bridging works, what it costs and which banks offer it." },
  { title: "Bridging Loan Calculator", href: "/bridging-loan-calculator", description: "Peak debt, end debt and the cost of buying before you sell." },
  { title: "Property Auction Guide", href: "/guides/property-auction-guide", description: "What to have ready before you bid, including the deposit." },
  { title: "Sell First or Buy First?", href: "/guides/sell-first-or-buy-first", description: "The decision before you commit to either route." },
];

const SOURCES: SourceItem[] = [
  { label: "Moneysmart: Deposit bond", href: "https://moneysmart.gov.au/glossary/deposit-bond", note: "read 6 October 2026" },
  { label: "Deposit Power: How deposit bonds work", href: "https://depositpower.com.au/how-deposit-bonds-work/", note: "read 6 October 2026" },
  { label: "Deposit Power: FAQs", href: "https://depositpower.com.au/faqs/", note: "read 6 October 2026" },
  { label: "Deposit Power: How do I qualify for a deposit bond?", href: "https://depositpower.com.au/how-do-i-qualify-for-a-deposit-bond/", note: "read 6 October 2026" },
  { label: DEPOSIT_BOND_FEE_SOURCE.name, href: DEPOSIT_BOND_FEE_SOURCE.url, note: `read ${DEPOSIT_BOND_FEE_SOURCE.readOn}` },
  { label: "Deposit Power: Acquisition of Deposit Assure", href: "https://depositpower.com.au/knowledge-hub/deposit-power-acquires-deposit-assure/", note: "announced 9 April 2026" },
  { label: "Deposit Bond Australia: Product information", href: "https://depositbondaustralia.com.au/product-information/", note: "read 6 October 2026" },
  { label: "Deposit Bond Australia: FAQs", href: "https://depositbondaustralia.com.au/product-information/faqs/", note: "read 6 October 2026" },
  { label: "Home Deposit Bonds", href: "https://www.homedepositbonds.com.au/", note: "read 6 October 2026" },
  { label: "Law Society of NSW: Contract for the sale and purchase of land, 2022 edition (sample)", href: "https://www.lawsociety.com.au/sites/default/files/2022-09/Sample%20with%20watermark_2022%20Land%20Contract_0.pdf" },
  { label: "Legal Practitioners' Liability Committee (Vic): Timing issues with deposit bonds", href: "https://lplc.com.au/resources/lplc-article/timing-issues-with-deposit-bonds-and-contracts-of-sale-of-land" },
  { label: "Consumer Protection WA: Buying land or property off the plan (PDF)", href: "https://www.consumerprotection.wa.gov.au/system/files/migrated/sites/default/files/atoms/files/buyinglandorpropertyofftheplan.pdf" },
  { label: "REINSW: Advice on deposit funds at auction", href: "https://www.reinsw.com.au/Web/Web/Posts/Latest_News/201711/Advice_on_deposit_funds_at_auction.aspx" },
  { label: "ANZ: Home loan FAQs", href: "https://www.anz.com.au/personal/home-loans/tips-and-guides/faqs/", note: "read 6 October 2026" },
  { label: "CommBank: Bank guarantee", href: "https://www.commbank.com.au/business/loans-and-finance/bank-guarantee.html", note: "read 6 October 2026" },
  { label: "NAB: Bank guarantee", href: "https://www.nab.com.au/business/loans-and-finance/guarantee", note: "read 6 October 2026" },
];

export default function DepositBondsGuidePage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={TLDR} toc={TOC} faqs={FAQS} related={RELATED}>
      <h2 id="what-is">What is a deposit bond?</h2>
      <p className="lead">
        A deposit bond is a guarantee you give the seller instead of a cash
        deposit when you exchange contracts. The issuer promises that the
        deposit will be paid. You pay the full price, deposit included, at
        settlement.
      </p>
      <p>
        Moneysmart defines it the same way: used in place of a cash deposit at
        exchange, guaranteeing the buyer will pay the full deposit by an agreed
        date. It solves a timing problem. Your money exists, but it&rsquo;s
        tied up in the home you&rsquo;re selling, an investment, or savings
        you&rsquo;ll have by the time an off-the-plan purchase settles.
      </p>

      <h2 id="how-it-works">How a deposit bond works</h2>
      <ol>
        <li><strong>You apply</strong> to an issuer for a bond for the deposit amount and the time until settlement, and sign an indemnity promising to repay the issuer if it ever has to pay out.</li>
        <li><strong>The seller gets a bond certificate</strong> at exchange instead of cash. Under the NSW standard contract the seller approves the issuer, the amount and the expiry date.</li>
        <li><strong>At settlement</strong> you pay the full purchase price, including the deposit, and the bond lapses.</li>
        <li><strong>If you don&rsquo;t settle</strong>, the seller claims on the bond, the issuer pays the deposit, and then recovers it from you. Deposit Bond Australia says the insurer can sue for full recovery.</li>
      </ol>

      <h2 id="cost">What a deposit bond costs</h2>
      <p>
        Issuers charge a one-off fee based on the deposit and how long the bond
        must last. Deposit Power&rsquo;s online calculator charges{" "}
        {SHORT_TERM.ratePct}% of the deposit for up to {SHORT_TERM.maxMonths}{" "}
        months (minimum {fmt(SHORT_TERM.minimum)}), and {LONG_TERM.ratePctPerYear}%
        a year, by the month, beyond that (minimum {fmt(LONG_TERM.minimum)}):
      </p>
      <ScrollTable label="Indicative deposit bond fees by deposit and term">
        <table>
          <thead>
            <tr>
              <th>Deposit</th>
              {FEE_TABLE_MONTHS.map((m) => <th key={m}>{m} months</th>)}
            </tr>
          </thead>
          <tbody>
            {FEE_TABLE_AMOUNTS.map((a) => (
              <tr key={a}>
                <td>{fmt(a)}</td>
                {FEE_TABLE_MONTHS.map((m) => <td key={m}>{fmt(depositBondFee(a, m))}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        From the{" "}
        <a href={DEPOSIT_BOND_FEE_SOURCE.url} rel="nofollow noopener" target="_blank">{DEPOSIT_BOND_FEE_SOURCE.name}</a>,
        read {DEPOSIT_BOND_FEE_SOURCE.readOn}. The calculator calls its figures
        indicative. Deposit Bond Australia doesn&rsquo;t publish its rates,
        charges no application fee, and says premiums may attract GST.
      </p>
      <p>
        An unused bond can be refunded within 30 days at Deposit Power, less an
        admin fee of $290 for a short-term bond or $700 for a long-term one.
      </p>

      <h2 id="who-issues">Who issues deposit bonds</h2>
      <ScrollTable label="Deposit bond issuers">
        <table>
          <thead>
            <tr><th>Issuer</th><th>What its own site says</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Deposit Power</strong></td><td>Bonds underwritten by HDI Global Specialty SE, rated AA- by S&amp;P. Short-term bonds up to 6 months, long-term 7 to 66 months.</td></tr>
            <tr><td><strong>Deposit Assure</strong></td><td>Being acquired by Deposit Power (announced 9 April 2026); its site now redirects to Deposit Power.</td></tr>
            <tr><td><strong>Deposit Bond Australia</strong></td><td>Agent and issuer for QBE Insurance (Australia). Terms of 3 to 66 months, bonds from $20,000 to $2 million, unsecured.</td></tr>
            <tr><td><strong>Home Deposit Bonds</strong></td><td>Terms up to 60 months, 66 in Queensland and up to 84 on selected projects. No underwriter named.</td></tr>
            <tr><td><strong>Banks</strong></td><td>ANZ says it doesn&rsquo;t offer deposit bonds. CBA and NAB publish only bank guarantees for business.</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="eligibility">Who can get one</h2>
      <p>Issuers want to see that you can pay the full price at settlement. Deposit Power, for example, asks for one of:</p>
      <ul>
        <li><strong>Evidence of the funds to settle</strong>, such as a loan approval, a savings statement or a gift, for a short-term bond</li>
        <li><strong>Equity in a home</strong> of at least the deposit amount for a bond up to $150,000, or twice the deposit above that</li>
        <li><strong>More equity for long-term bonds:</strong> 3 times a 10% deposit for 7 to 24 months, 4 times for 25 to 36, and 5 times for 37 to 66</li>
      </ul>
      <p>
        Deposit Bond Australia asks that you own Australian property or have an
        accepted guarantor, and that you are an Australian citizen or permanent
        resident.
      </p>

      <h2 id="acceptance">Will the seller accept one?</h2>
      <p>The seller doesn&rsquo;t have to, so ask the agent before you make an offer. What the standard contracts say:</p>
      <ul>
        <li>
          <strong>New South Wales:</strong> the deposit bond clause in the Law
          Society&rsquo;s standard contract applies only if the seller accepts a
          bond. You hand it over at or before exchange. If settlement
          hasn&rsquo;t happened 14 days before the bond expires, you must give a
          replacement at least 7 days before expiry, or the seller can end the
          contract.
        </li>
        <li>
          <strong>Victoria:</strong> the standard contract requires the bond to
          expire at least 45 days after the due settlement date, according to
          the Legal Practitioners&rsquo; Liability Committee.
        </li>
        <li>
          <strong>Western Australia:</strong> off-the-plan developers don&rsquo;t
          have to accept deposit bonds or bank guarantees, says Consumer
          Protection WA.
        </li>
      </ul>

      <h2 id="auctions">Deposit bonds at auction</h2>
      <p>
        At auction the deposit is due when you sign on the day, so the seller
        has to have agreed to a bond before you bid. ANZ and Deposit Power both
        say to confirm acceptance first, and REINSW says any other way of paying
        the deposit needs everyone&rsquo;s agreement, with contract changes
        drafted by the seller&rsquo;s solicitor. Deposit Power offers a bond
        you arrange before auction day that is valid for 6 months while you
        look.
      </p>

      <h2 id="risks">The risks</h2>
      <ul>
        <li><strong>You still owe the deposit.</strong> If you don&rsquo;t settle, the issuer pays the seller and recovers the money from you.</li>
        <li><strong>Expiry matters.</strong> A bond that runs out before settlement can give the seller grounds to end the contract. Match the term to the settlement date with room to spare.</li>
        <li><strong>The fee is mostly non-refundable</strong> once the bond is used.</li>
        <li><strong>You need the full price at settlement.</strong> The bond only bridges the deposit, not the purchase.</li>
      </ul>

      <h2 id="vs-bridging">Deposit bond vs bridging loan vs bank guarantee</h2>
      <ScrollTable label="Deposit bond, bridging loan and bank guarantee compared">
        <table>
          <thead>
            <tr><th></th><th>What it covers</th><th>What it costs</th><th>Who it&rsquo;s for</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Deposit bond</strong></td><td>The deposit at exchange only</td><td>A one-off fee, about {fmt(FEE_100K_6)} on $100,000 for 6 months at Deposit Power</td><td>Home buyers with funds or equity to settle</td></tr>
            <tr><td><strong>Bridging loan</strong></td><td>The whole purchase until your current home sells</td><td>Interest on the amount the sale repays, plus loan fees</td><td>Buyers who settle on the new home before the old one sells</td></tr>
            <tr><td><strong>Bank guarantee</strong></td><td>A set amount the bank will pay</td><td>CBA: 2.50% a year plus an establishment fee. NAB: 1% to issue plus 2.3% a year</td><td>Businesses: CBA&rsquo;s can&rsquo;t be used to buy an asset</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="moving-home">Using a bond when you buy before you sell</h2>
      <p>
        The common case: you&rsquo;ve found your next home, and your deposit is
        tied up in the one you&rsquo;re selling. A bond covers the deposit at
        exchange. What matters is settlement, when you need the full price:
      </p>
      <ul>
        <li>
          <strong>If your sale settles first</strong>, the proceeds pay for the
          new home. Negotiate a settlement date on the purchase that falls after
          your sale&rsquo;s, and the bond may be all you need.
        </li>
        <li>
          <strong>If the purchase settles first</strong>, you need finance for
          the full price until your sale settles. That is a bridging loan, and
          the{" "}
          <Link href="/bridging-loan-calculator">bridging loan calculator</Link>{" "}
          shows what it would cost.
        </li>
      </ul>
      <p>
        The <Link href="/guides/bridging-loan-alternatives">alternatives to a bridging loan</Link>{" "}
        guide sets a deposit bond next to selling first, subject-to-sale offers
        and longer settlements.
      </p>

      <Callout variant="warning" title="General information, not advice">
        <p>
          Deposit bond terms, fees and acceptance rules vary by issuer, contract
          and state. Read the bond&rsquo;s terms and check the contract with
          your conveyancer or solicitor before you exchange.
        </p>
      </Callout>

      <Sources items={SOURCES} />
    </GuideArticleLayout>
  );
}
