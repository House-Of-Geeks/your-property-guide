import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Lenders Mortgage Insurance: What it costs and how to avoid it (2026)",
  description:
    "Complete guide to LMI in Australia. What it is (and isn't), when it applies, what it costs, who provides it (Helia, Arch), how to capitalise it into your loan, and four ways to avoid it.",
  slug: "lenders-mortgage-insurance-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 7,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
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
  "LMI protects the lender, not the borrower. You pay the premium, the bank is the beneficiary, and you remain liable for any shortfall if you default.",
  "LMI applies whenever your loan-to-value ratio (LVR) exceeds 80%, meaning you're borrowing more than 80% of the property's value.",
  "On a $700,000 property at 95% LVR, LMI typically costs $22,000 to $28,000. Costs rise disproportionately as LVR rises.",
  "Australia's LMI market is dominated by Helia (formerly Genworth) and Arch (formerly QBE). Some lenders self-insure.",
  "LMI premiums are not portable: refinance before your LVR falls below 80% and you'll typically pay LMI again with the new lender.",
  "Four ways to avoid LMI: save a 20% deposit, use the First Home Guarantee, use a family guarantor, or qualify for a professional-package waiver.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-lmi",     label: "What LMI is (and what it isn't)" },
  { id: "when-applies",    label: "When does LMI apply?" },
  { id: "cost",            label: "How much does LMI cost?" },
  { id: "who-provides",    label: "Who provides LMI in Australia?" },
  { id: "capitalise",      label: "Capitalising LMI into your loan" },
  { id: "avoid",           label: "How to avoid LMI" },
  { id: "is-it-worth-it",  label: "Is paying LMI ever worth it?" },
];

const FAQS: FaqItem[] = [
  {
    question: "Does LMI protect me as the borrower?",
    answer:
      "No. LMI is taken out by the lender to protect itself if you default and the sale of the property doesn't cover the outstanding loan. You pay the premium, the lender is the beneficiary, and you remain liable for any shortfall after a default sale. It does not protect your equity, your credit record, or your home.",
  },
  {
    question: "What LVR triggers LMI?",
    answer:
      "Most lenders apply LMI when LVR exceeds 80%. A few lenders set the threshold at 85%, and some professions can borrow up to 90% to 95% LVR without LMI through professional packages. The First Home Guarantee scheme replaces LMI with a government guarantee for eligible first home buyers.",
  },
  {
    question: "How much does LMI typically cost?",
    answer:
      "It depends on the loan amount and LVR. As a rough guide: on a $500,000 loan at 90% LVR, expect $9,500 to $12,500. At 95% LVR, expect $15,000 to $20,000. On a $700,000 loan at 95% LVR, $22,000 to $28,000 is typical. Always get a personalised quote because premiums vary by lender and LMI provider.",
  },
  {
    question: "Should I capitalise LMI into my loan or pay it upfront?",
    answer:
      "If you can pay LMI upfront from savings without compromising your deposit, that's almost always cheaper over the life of the loan. Capitalising the premium means paying interest on it for 25 to 30 years, which can double or triple the effective cost.",
  },
  {
    question: "Can I get my LMI premium refunded if I refinance?",
    answer:
      "Generally no. LMI premiums are not portable between lenders, and most aren't refundable. If you paid LMI on your original loan and refinance before your LVR has fallen below 80%, you'll usually need to pay LMI again with the new lender. This is a major hidden cost of refinancing high-LVR loans.",
  },
  {
    question: "Is LMI ever worth paying?",
    answer:
      "In a rising property market, paying LMI to enter the market two years earlier can outweigh the premium cost if property prices grow faster than you can save. In a flat or falling market, waiting to save a 20% deposit is almost always better. The right call depends on your suburb's expected growth, your saving rate, and your current rental costs.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide",       href: "/guides/first-home-buyer-guide", description: "Schemes that replace LMI with a government guarantee for eligible buyers." },
  { title: "Borrowing Power Calculator",   href: "/borrowing-power-calculator",    description: "Run the deposit-vs-LMI math for your situation." },
  { title: "Affordability Calculator",     href: "/affordability-calculator",      description: "Model the LVR sweet-spot for your savings level." },
  { title: "Fixed vs Variable Rate Guide", href: "/guides/fixed-vs-variable-rate-guide", description: "Once LMI's settled, the next big decision." },
  { title: "First Home Buyer NSW",         href: "/guides/first-home-buyer-nsw",   description: "State-specific schemes and price caps." },
  { title: "Buying Property in Australia", href: "/guides/buying-property-australia", description: "The full step-by-step buying process." },
];

export default function LMIGuidePage() {
  return (
    <>
      <HowToJsonLd
        name="How to handle Lenders Mortgage Insurance (LMI) when buying property in Australia"
        description="The five-step decision and process for LMI: when it applies, how to estimate it, and how to legitimately avoid it."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Check your loan-to-value ratio (LVR)", text: "If your deposit is below 20%, LMI is likely required. Calculate LVR as loan amount divided by property price." },
          { name: "Check eligibility for federal schemes", text: "First Home Guarantee, Family Home Guarantee, and Regional First Home Buyer Guarantee all waive LMI for eligible buyers with 5% (or 2%) deposit." },
          { name: "Estimate the LMI premium", text: "LMI scales with both LVR and loan amount. On a 95% LVR loan of $600K, expect ~$22K. On a 90% LVR loan of $600K, expect ~$13K." },
          { name: "Decide upfront vs capitalised", text: "Pay LMI as a one-off cost or add it to your loan principal (capitalising). Capitalising costs more long-term in interest." },
          { name: "Consider professional or industry exemptions", text: "Some lenders waive LMI for eligible doctors, lawyers, accountants and other low-risk professions, even at 90% LVR.", url: "/borrowing-power-calculator" },
          { name: "Get a written quote and re-check at settlement", text: "LMI is calculated at the point your loan is approved. If your deposit grows or property valuation comes in higher, ask the lender to re-quote." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="LMI quotes vary widely">
        <p>
          LMI costs vary by lender and LMI provider. The figures in this guide are
          indicative only. Always obtain a personalised LMI quote from your lender
          or mortgage broker before making decisions.
        </p>
      </Callout>

      <h2 id="what-is-lmi">What LMI is (and what it isn&rsquo;t)</h2>
      <p className="lead">
        Lenders Mortgage Insurance is one of the most misunderstood costs in
        Australian property. Let&rsquo;s be absolutely clear about who it
        actually protects.
      </p>

      <Callout variant="warning" title="LMI protects the lender, not you">
        <p>
          LMI is insurance taken out by the lender (the bank) to protect <em>itself</em>{" "}
          if you default on your mortgage and the sale of the property does not cover
          the outstanding loan balance. You pay the premium, but the bank is the
          beneficiary. If you default, the bank claims on the LMI policy, you remain
          liable for any shortfall.
        </p>
      </Callout>

      <p>
        This distinction matters enormously. Many borrowers pay LMI assuming it
        provides them with some protection, it does not. LMI provides no direct
        benefit to the borrower; it simply enables the lender to offer higher-LVR
        loans with reduced risk to itself.
      </p>
      <p>
        The practical outcome is that LMI lets you <em>access</em> a home loan with
        a deposit of less than 20%, which would otherwise be unavailable from most
        lenders. That access has value, but you are paying for it.
      </p>

      <h2 id="when-applies">When does LMI apply?</h2>
      <p>
        LMI applies when the <strong>Loan to Value Ratio (LVR)</strong> of your
        loan exceeds 80%. LVR is calculated as:
      </p>
      <p>
        <code>LVR = Loan Amount ÷ Property Value × 100</code>
      </p>
      <p>
        Example: if you are buying a $700,000 property and borrowing $595,000,
        your LVR is 85%. Above the 80% threshold, so LMI applies.
      </p>
      <p>
        To avoid LMI entirely, you need a deposit of at least 20% of the purchase
        price plus enough to cover stamp duty, legal fees, and other upfront costs.
        For a $700,000 property, that means at least $140,000 in deposit plus
        approximately $30,000 to $40,000 in transaction costs, a total of
        $170,000 to $180,000+ before you can buy without LMI.
      </p>
      <p>Most lenders set 80% as the standard LMI threshold, but:</p>
      <ul>
        <li>Some lenders charge LMI above a different threshold (e.g. 85%)</li>
        <li>Some professions can access 90%+ lending without LMI (see professional packages below)</li>
        <li>The government&rsquo;s First Home Guarantee scheme provides an alternative to LMI for eligible buyers</li>
      </ul>

      <KeyFigure
        value="$140k+"
        label="Deposit required to avoid LMI on a $700,000 property at 20% LVR. On top of that you'll need 4 to 6% of purchase price in transaction costs."
        context="Estimate, before scheme alternatives"
      />

      <h2 id="cost">How much does LMI cost?</h2>
      <p>
        LMI is calculated as a percentage of the loan amount, and increases
        significantly as the LVR increases. Indicative figures across loan size
        and LVR:
      </p>

      <table>
        <thead>
          <tr>
            <th>Loan amount</th>
            <th>LVR 85%</th>
            <th>LVR 90%</th>
            <th>LVR 95%</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$400,000</td><td>~$5,000 to $7,000</td><td>~$7,500 to $10,000</td><td>~$12,000 to $16,000</td></tr>
          <tr><td>$500,000</td><td>~$6,500 to $9,000</td><td>~$9,500 to $12,500</td><td>~$15,000 to $20,000</td></tr>
          <tr><td>$700,000</td><td>~$9,000 to $13,000</td><td>~$14,000 to $18,000</td><td>~$22,000 to $28,000</td></tr>
          <tr><td>$1,000,000</td><td>~$13,000 to $18,000</td><td>~$20,000 to $26,000</td><td>~$32,000 to $40,000</td></tr>
        </tbody>
      </table>

      <Callout variant="info" title="A few observations">
        <p>
          LMI costs increase disproportionately at higher LVRs: going from 85% to
          95% roughly doubles the premium. On larger loans, LMI can be a very
          significant upfront cost. The jump from 89.9% to 90% LVR can dramatically
          increase the premium, lenders price in tiers, not continuously.
        </p>
      </Callout>

      <h2 id="who-provides">Who provides LMI in Australia?</h2>
      <p>
        Australia&rsquo;s LMI market is dominated by two providers:
      </p>
      <ul>
        <li>
          <strong>Helia</strong> (formerly Genworth Australia), one of Australia&rsquo;s
          largest LMI providers, used by many major banks and lenders.
        </li>
        <li>
          <strong>Arch Mortgage Insurance</strong> (formerly QBE LMI), the other
          major provider, used by a range of lenders.
        </li>
      </ul>
      <p>
        Some lenders self-insure (retain the LMI risk internally) rather than
        using an external provider. The borrower&rsquo;s experience is broadly the
        same, LMI is paid at settlement and the premium is set by the lender.
      </p>

      <Callout variant="warning" title="LMI is not portable">
        <p>
          If you refinance your loan before the LVR falls below 80%, you will
          generally need to pay a new LMI premium with the new lender, even if
          you paid LMI on your original loan. This is an often-overlooked cost
          of refinancing high-LVR loans.
        </p>
      </Callout>

      <h2 id="capitalise">Capitalising LMI into your loan</h2>
      <p>
        Many lenders allow you to add the LMI premium to your home loan balance
        rather than paying it upfront in cash. This is called &ldquo;capitalising&rdquo;
        the LMI.
      </p>
      <p>
        <strong>The advantage:</strong> you don&rsquo;t need to find the LMI premium
        in cash at settlement.
      </p>
      <p>
        <strong>The disadvantage:</strong> you pay interest on the LMI amount for
        the life of the loan. A $15,000 LMI premium capitalised into a 6% loan
        over 30 years will cost you significantly more in total interest, often
        2 to 3 times the original premium.
      </p>
      <p>
        If you can pay the LMI premium from savings rather than capitalising it,
        you will save money in the long run.
      </p>

      <h2 id="avoid">How to avoid LMI</h2>
      <p>Four practical strategies to skip LMI entirely.</p>

      <h3>1. Save a 20% deposit</h3>
      <p>
        The most straightforward approach. With a genuine 20% deposit (plus costs),
        no LMI applies. The challenge is that saving a 20% deposit in a rising
        property market can feel like running on a treadmill, the goalposts keep
        moving.
      </p>

      <h3>2. First Home Guarantee (government scheme)</h3>
      <p>
        The federal <strong>First Home Guarantee</strong> allows eligible first
        home buyers to purchase with as little as a 5% deposit, with the government
        guaranteeing up to 15%, eliminating the need for LMI entirely. See our{" "}
        <Link href="/guides/first-home-buyer-guide">First Home Buyer Guide</Link> for
        details and state-specific price caps.
      </p>

      <h3>3. Guarantor loan (family guarantee)</h3>
      <p>
        A family member (typically a parent) can act as guarantor, using their
        own property as additional security for part of your loan. This can allow
        you to borrow up to 100% of the purchase price without LMI, the
        lender&rsquo;s security is effectively supplemented by the
        guarantor&rsquo;s property.
      </p>
      <p>
        Guarantor arrangements carry risk for the guarantor, they are liable for
        the guaranteed portion of the loan if you default. All parties should
        obtain independent legal and financial advice before entering a guarantor
        arrangement.
      </p>

      <h3>4. Professional package (LMI waiver)</h3>
      <p>
        Many lenders offer LMI waivers for borrowers in certain professions,
        recognising their lower risk of default (stable employment, high income).
        Eligible professions typically include:
      </p>
      <ul>
        <li>Medical doctors, specialists, and dentists</li>
        <li>Lawyers and barristers</li>
        <li>Accountants (CPA or CA qualified)</li>
        <li>Optometrists and veterinarians</li>
        <li>Some engineers and other professionals (lender-dependent)</li>
      </ul>
      <p>
        Waivers typically allow borrowing up to 90 to 95% LVR without LMI.
        Eligibility requirements vary by lender, check with your mortgage broker
        for current options.
      </p>

      <MatchCTA kind="mortgage-broker" />

      <h2 id="is-it-worth-it">Is paying LMI ever worth it?</h2>
      <p>
        The conventional wisdom is that LMI is a cost to be avoided. There is
        a genuine argument that paying LMI can sometimes be worth it.
      </p>
      <p>
        Consider a buyer with a 10% deposit ($80,000) looking at an $800,000
        property. They could either:
      </p>
      <ul>
        <li>
          <strong>Wait two more years to save the full 20% deposit.</strong>{" "}
          During that time, the property market might rise, say 5% per year. The
          same $800,000 property could now cost $882,000, requiring a higher
          deposit. The cost of waiting is potentially the additional $82,000 plus
          $82,000 more in stamp duty and ongoing costs.
        </li>
        <li>
          <strong>Buy now with 10% deposit and pay around $18,000 LMI.</strong>{" "}
          Enter the market two years earlier, benefit from any capital growth,
          and pay off LMI over time.
        </li>
      </ul>
      <p>
        In a rising market, getting in two years earlier can easily outweigh the
        cost of LMI. In a flat or falling market, waiting to save a larger
        deposit is almost always better. The calculation depends on:
      </p>
      <ul>
        <li>Expected property price growth in your target area</li>
        <li>Your ability to save, how quickly could you reach a 20% deposit?</li>
        <li>Your current rental costs (which are dead money vs building equity in a purchased property)</li>
        <li>The specific LMI premium for your LVR and loan amount</li>
      </ul>
      <p>
        Use our{" "}
        <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
        to model different scenarios and see what makes sense for your situation.
      </p>
    </GuideArticleLayout>
    </>
  );
}
