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
import { EXAMPLE_BRIDGING_RATE, computeBridging, defaultBridgingInput } from "@/lib/bridging-calc";
import { SHORT_TERM, depositBondFee } from "@/lib/deposit-bond";

const FRONTMATTER: GuideFrontmatter = {
  title: "Alternatives to a Bridging Loan in Australia: What Costs Less (2026)",
  description:
    "Selling first and renting, subject-to-sale offers, longer settlements, deposit bonds and using your equity, compared on cost and risk against a bridging loan, with what each costs on the same move.",
  slug: "bridging-loan-alternatives",
  publishedAt: "2026-10-06",
  updatedAt: "2026-10-06",
  readingTimeMinutes: 10,
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

// One move, priced every way: the bridging calculator's worked example (a
// $1.1m home, a $1.5m purchase, six months to sell) and a 10% deposit bond.
const EX = defaultBridgingInput("NSW");
const EXR = computeBridging(EX);
const DEPOSIT = EX.purchasePrice * 0.1;
const BOND_FEE = depositBondFee(DEPOSIT, 6);
const WEEKLY_RENT = EX.weeklyRent;

const TLDR = [
  "Selling first and renting is usually the cheapest route if you can live with moving twice. You pay rent and a second move instead of bridging interest.",
  "A subject-to-sale offer lets you buy on condition your home sells. It costs nothing extra, but sellers rarely accept one at auction or when buyers are competing.",
  "A longer settlement on the purchase can let your sale settle first. Consumer Affairs Victoria says settlements are usually 30 to 90 days and negotiable.",
  `A deposit bond covers the deposit at exchange without cash, for about ${SHORT_TERM.ratePct}% of the deposit for up to six months at Deposit Power. You still need the full price at settlement.`,
  "A relocation loan is not an alternative: St.George, Bank of Melbourne and BankSA use the name for their bridging loan. Bridgit and Yard are non-bank bridging lenders.",
];

const TOC: GuideTOCEntry[] = [
  { id: "compared",        label: "The options compared" },
  { id: "one-move",        label: "What each costs on the same move" },
  { id: "sell-first",      label: "Sell first and rent" },
  { id: "subject-to-sale", label: "Subject-to-sale offer" },
  { id: "settlement",      label: "A longer settlement" },
  { id: "deposit-bond",    label: "Deposit bond" },
  { id: "equity",          label: "Using your equity for the deposit" },
  { id: "relocation",      label: "Relocation loans and non-bank bridging" },
  { id: "keep",            label: "Keeping your current home" },
  { id: "choosing",        label: "Choosing a route" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is there a cheaper alternative to a bridging loan?",
    answer:
      `Usually, if your timing allows. Selling first and renting avoids the bridging interest: on our worked example, six months of bridging costs about ${fmt(EXR.bridgingCost)} against ${fmt(EXR.sellFirstCost)} for rent and a second move. ` +
      "A subject-to-sale offer or a longer settlement on the purchase can cost nothing extra, and a deposit bond covers the deposit for a one-off fee.",
  },
  {
    question: "What is a relocation loan?",
    answer:
      "It is St.George's, Bank of Melbourne's and BankSA's name for a bridging loan. Each bank's own page says a relocation loan is also known as a bridging loan. " +
      "It lets you buy before you sell for up to 12 months, with the interest added to the loan.",
  },
  {
    question: "Bridging loan vs relocation loan: what's the difference?",
    answer:
      "None in substance: relocation loan is the St.George group's name for its bridging loan. The terms differ by bank, not by name. Our bridging loans guide sets out each bank's term, interest method and limit.",
  },
  {
    question: "Can I buy a house before selling mine without a bridging loan?",
    answer:
      "Yes, if the seller of the new home will wait or your sale settles first. Make the offer subject to the sale of your home, or agree a settlement date on the purchase that falls after your sale settles. " +
      "A deposit bond can cover the deposit at exchange. If you must settle the new home before your sale settles, you need finance for the full price, which is a bridging loan.",
  },
  {
    question: "What is a subject-to-sale offer?",
    answer:
      "An offer on the new home that only goes ahead if your current home sells, by a set date. In Queensland it is a special condition added to the standard contract, and the law handbook says a solicitor should draft it. " +
      "In Western Australia the seller can usually keep marketing, and if another offer arrives you have two business days to sell or drop the condition.",
  },
  {
    question: "Can I use the equity in my home for a deposit?",
    answer:
      "Yes. CBA describes usable equity as 80% of your home's value less what you owe: on a $750,000 home with a $400,000 loan, that is $200,000 you could draw for the next deposit. " +
      "It adds to your loan and repayments, and lenders mortgage insurance may apply above 80%. It covers the deposit, not the purchase.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Bridging Loans Guide", href: "/guides/bridging-loans-guide", description: "How bridging works, what it costs and which banks offer it." },
  { title: "Bridging Loan Calculator", href: "/bridging-loan-calculator", description: "Bridging against selling first, with your own prices." },
  { title: "Deposit Bonds", href: "/guides/deposit-bonds", description: "How a bond works on a contract, what it costs, and the risks." },
  { title: "Sell First or Buy First?", href: "/guides/sell-first-or-buy-first", description: "The decision tree, with market signals and worked examples." },
  { title: "Free Property Appraisal", href: "/appraisal", description: "Every route starts with what your current home will sell for." },
];

const SOURCES: SourceItem[] = [
  { label: "Westpac: Next Home Buyer's Guide (PDF)", href: "https://www.westpac.com.au/content/dam/public/brokers/documents/other-resources/Next_Home_Buyers_Guide.pdf", note: "read 6 October 2026" },
  { label: "Consumer Affairs Victoria: Buying property by private sale", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/buying-property/buying-property-by-private-sale", note: "read 6 October 2026" },
  { label: "Consumer Affairs Victoria: Property settlement", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property/property-settlement", note: "read 6 October 2026" },
  { label: "Queensland Law Handbook: The REIQ contract for buying a home", href: "https://queenslandlawhandbook.org.au/the-queensland-law-handbook/living-and-working-in-society/buying-selling-and-building-a-home/the-real-estate-institute-of-queensland-contract-for-buying-a-home/", note: "read 6 October 2026" },
  { label: "REIWA: The return of subject-to-sale offers", href: "https://reiwa.com.au/the-wa-market/resources/articles/the-return-of-subject-to-sale-offers/", note: "read 6 October 2026" },
  { label: "Consumer Protection WA: Property settlement fact sheet (PDF)", href: "https://www.consumerprotection.wa.gov.au/system/files/migrated/sites/default/files/atoms/files/propertysettlementfactsheet.pdf", note: "read 6 October 2026" },
  { label: "Law Society of NSW: Contract for the sale and purchase of land, 2022 edition (sample)", href: "https://www.lawsociety.com.au/sites/default/files/2022-09/Sample%20with%20watermark_2022%20Land%20Contract_0.pdf" },
  { label: "CommBank: Using the equity in your home", href: "https://www.commbank.com.au/home-loans/using-the-equity-in-your-home.html", note: "read 6 October 2026" },
  { label: "CommBank: Buying your next home", href: "https://www.commbank.com.au/home-loans/buying-your-next-home.html", note: "read 6 October 2026" },
  { label: "St.George: Relocation loan", href: "https://www.stgeorge.com.au/personal/home-loans/our-home-loans/specialist/relocation-loan", note: "read 6 October 2026" },
  { label: "Bank of Melbourne: Relocation loan", href: "https://www.bankofmelbourne.com.au/personal/home-loans/our-home-loans/specialist/relocation-loan", note: "read 6 October 2026" },
  { label: "BankSA: Relocation loan", href: "https://www.banksa.com.au/personal/home-loans/our-home-loans/specialist/relocation-loan", note: "read 6 October 2026" },
  { label: "Bridgit: Rates and fees", href: "https://www.bridgit.com.au/rates-and-fees", note: "read 6 October 2026" },
  { label: "Yard: Bridging loan", href: "https://www.yard.com.au/loans/bridging-loan", note: "read 6 October 2026" },
  { label: "Deposit Power deposit bond fee calculator", href: "https://depositpower.com.au/deposit-bond-calculator-fee/", note: "read 6 October 2026" },
];

export default function BridgingLoanAlternativesPage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={TLDR} toc={TOC} faqs={FAQS} related={RELATED}>
      <p className="lead">
        A bridging loan lets you buy before you sell, but you pay the full
        bridging rate on everything the sale will repay. When your timing
        allows, there are cheaper ways to move. Most of them work by lining up
        the two settlements so you never hold both homes on borrowed money.
      </p>

      <h2 id="compared">The options compared</h2>
      <ScrollTable label="Alternatives to a bridging loan compared">
        <table>
          <thead>
            <tr><th>Route</th><th>What it costs</th><th>Main risk</th><th>Best when</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Sell first and rent</strong></td><td>Rent between homes and a second move</td><td>Prices rise before you buy</td><td>The market is flat or falling, or you&rsquo;re unsure where to buy</td></tr>
            <tr><td><strong>Subject-to-sale offer</strong></td><td>Nothing extra</td><td>The seller takes a better offer</td><td>Private sales in a slower market</td></tr>
            <tr><td><strong>Longer settlement on the purchase</strong></td><td>Nothing extra, if the seller agrees</td><td>Your sale must settle first</td><td>You can sell quickly and the seller isn&rsquo;t in a hurry</td></tr>
            <tr><td><strong>Deposit bond</strong></td><td>A one-off fee on the deposit</td><td>You still need the full price at settlement</td><td>Your deposit is tied up in the home you&rsquo;re selling</td></tr>
            <tr><td><strong>Equity for the deposit</strong></td><td>Interest on the amount drawn</td><td>More debt, and LMI above 80%</td><td>You have plenty of equity and only the deposit is the problem</td></tr>
            <tr><td><strong>Bridging loan</strong></td><td>Interest on the amount the sale repays, plus fees</td><td>The sale takes longer or brings less</td><td>You must settle the new home before the old one sells</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="one-move">What each costs on the same move</h2>
      <p>
        Take the move from our{" "}
        <Link href="/bridging-loan-calculator">bridging loan calculator</Link>:
        a home expected to sell for {fmt(EX.salePrice)} with{" "}
        {fmt(EX.mortgageOwing)} owing, a {fmt(EX.purchasePrice)} purchase, and
        six months to sell.
      </p>
      <ScrollTable label="One move priced four ways">
        <table>
          <thead>
            <tr><th>Route</th><th>Extra cost over six months</th></tr>
          </thead>
          <tbody>
            <tr><td>Bridging loan at {EXAMPLE_BRIDGING_RATE}%, interest added to the loan, plus fees</td><td>{fmt(EXR.bridgingCost)}</td></tr>
            <tr><td>Sell first: rent at ${WEEKLY_RENT} a week plus a second move</td><td>{fmt(EXR.sellFirstCost)}</td></tr>
            <tr><td>Deposit bond on a 10% deposit ({fmt(DEPOSIT)}), with the sale settling first</td><td>{fmt(BOND_FEE)}</td></tr>
            <tr><td>Subject-to-sale offer or longer settlement</td><td>$0, if the seller agrees</td></tr>
          </tbody>
        </table>
      </ScrollTable>
      <p>
        The cheap routes depend on someone else agreeing: the seller of the new
        home has to accept the condition, the bond or the settlement date. That
        is what you pay for with a bridging loan, the freedom to settle when
        you want. Change the figures in the calculator to see your own gap.
      </p>

      <h2 id="sell-first">Sell first and rent</h2>
      <p>
        Sell, settle, then buy with the proceeds. Westpac&rsquo;s guide for next
        home buyers lists the advantages: you know your budget, and you can rent
        in the new area before you choose. The downsides it lists are prices
        rising before you buy, short-term rent, and moving twice. It says buying first is often the riskier strategy.
      </p>
      <p>
        You can also ask your buyer to let you stay on after settlement and pay
        rent. Consumer Protection WA&rsquo;s settlement fact sheet mentions the
        seller renting the home back as something buyer and seller can agree.
      </p>

      <h2 id="subject-to-sale">Subject-to-sale offer</h2>
      <p>
        An offer on the new home that only goes ahead if your current home sells
        by a set date. It costs nothing, but it&rsquo;s a weaker offer than an
        unconditional one.
      </p>
      <ul>
        <li><strong>Victoria:</strong> you can negotiate the condition in a private sale. At auction, any condition needs the seller&rsquo;s agreement.</li>
        <li><strong>Queensland:</strong> it is a special condition added to the standard REIQ contract, and the law handbook says a solicitor should draft it.</li>
        <li><strong>Western Australia:</strong> the seller can usually keep marketing. Under the common 48-hour clause, if another offer comes in you have two business days to sell or drop the condition.</li>
      </ul>

      <h2 id="settlement">A longer settlement</h2>
      <p>
        Sell with a short settlement and buy with a long one, so your sale
        settles first and its proceeds pay for the new home. Consumer Affairs
        Victoria says settlement is usually 30 to 90 days and negotiable; the
        NSW standard contract&rsquo;s sample sets completion on the 42nd day;
        Consumer Protection WA gives a guide of 28 days after the offer goes
        unconditional.
      </p>
      <p>
        If you need to get in early, the NSW standard contract allows early
        access by agreement, but you can&rsquo;t let or alter the property and
        the risk of damage passes to you. In WA, a seller may ask an early
        occupier to take the home as it is and make the offer unconditional.
      </p>

      <h2 id="deposit-bond">Deposit bond</h2>
      <p>
        A guarantee you give the seller instead of a cash deposit at exchange,
        for a one-off fee: Deposit Power&rsquo;s calculator charges{" "}
        {SHORT_TERM.ratePct}% of the deposit for up to six months, or{" "}
        {fmt(BOND_FEE)} on {fmt(DEPOSIT)}. It covers the deposit only, so it
        pairs with a longer settlement: the bond secures the purchase, and your
        sale settles before you need the rest. Our{" "}
        <Link href="/guides/deposit-bonds">deposit bond guide</Link> covers costs,
        issuers, and when a seller can refuse one.
      </p>

      <h2 id="equity">Using your equity for the deposit</h2>
      <p>
        If your lender will increase your current loan, you can use the equity
        in your home as the deposit on the next. CBA describes usable equity as
        80% of the home&rsquo;s value less what you owe: a $750,000 home with a
        $400,000 loan has $200,000 of usable equity. ANZ says a top-up is subject to credit approval and adds to your debt. Like a bond, it covers
        the deposit, not the purchase, and your repayments rise until the sale
        clears the extra debt.
      </p>

      <h2 id="relocation">Relocation loans and non-bank bridging</h2>
      <p>
        A <strong>relocation loan</strong> is not an alternative to bridging.
        St.George, Bank of Melbourne and BankSA each describe their relocation
        loan as also known as a bridging loan: up to 12 months, with the interest
        added to the loan.
      </p>
      <p>
        <strong>Non-bank bridging lenders</strong> offer the same product on
        different terms. Bridgit publishes owner-occupier rates from 8.99% while
        bridging and 7.79% after the sale, terms up to 24 months, and lending up
        to 85% LVR, with a set-up fee from 0.60% of the loan. Yard publishes
        rates from 6.90% at up to 80% LVR for 6 to 12 months. Our{" "}
        <Link href="/guides/bridging-loans-guide#which-banks">bridging loans guide</Link>{" "}
        sets them beside the banks.
      </p>

      <h2 id="keep">Keeping your current home</h2>
      <p>
        CBA lists keeping your current home as one of the options when you buy
        the next. You would rent it out and borrow against it, and your income
        and the rent would need to cover both loans. The tax rules work on what
        the money was used for, not which property secures it, so read the{" "}
        <Link href="/guides/bridging-loans-guide#situations">situations section of our bridging guide</Link>{" "}
        and talk to an accountant first.
      </p>

      <h2 id="choosing">Choosing a route</h2>
      <ul>
        <li><strong>Market flat or falling, or you&rsquo;re unsure where to buy:</strong> sell first.</li>
        <li><strong>Private sale and the seller is patient:</strong> try subject-to-sale or a longer settlement first, with a deposit bond if your cash is tied up.</li>
        <li><strong>Auction or a competitive market, and you must settle before you sell:</strong> bridging, with a realistic sale plan.</li>
        <li><strong>Whichever route:</strong> start with what your current home will sell for. A <Link href="/appraisal">free appraisal</Link> from an agent who sells in your street gives you that figure.</li>
      </ul>
      <p>
        For the decision itself, read{" "}
        <Link href="/guides/sell-first-or-buy-first">Sell first or buy first?</Link>
      </p>

      <Callout variant="warning" title="General information, not advice">
        <p>
          Lender terms, bond terms and contract rules differ by state and change.
          Check the contract with your conveyancer or solicitor and the loan
          terms with your lender before you commit.
        </p>
      </Callout>

      <Sources items={SOURCES} />
    </GuideArticleLayout>
  );
}
