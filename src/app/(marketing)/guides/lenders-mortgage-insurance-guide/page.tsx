import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HG_CHECKED_ON, HG_MIN_DEPOSIT_PCT, HG_SOURCES } from "@/lib/data/home-guarantee";
import { LMI_RATE_SOURCE, LMI_RATES, LOAN_BANDS, computeLmi, premiumAt } from "@/lib/lmi-calc";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";
import { dutyFor } from "@/lib/data/stamp-duty-state";
import { longDate } from "@/lib/data/first-home-grants";

// Every LMI dollar figure on this page comes from the /lmi-calculator table in
// src/lib/lmi-calc.ts (commercial-intent review 10 Oct 2026, buying 0.1 row 16:
// the hand-typed ranges ran $8,000 to $14,000 below that table at 95% LVR).
const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const prem = (price: number, depositPct: number) => fmt(premiumAt(price, depositPct)!);
/** Premium on a given loan at a given LVR (price backed out from the LVR). */
const onLoan = (loan: number, lvr: number) =>
  fmt(computeLmi({ price: Math.round(loan / (lvr / 100)), mode: "loan", loan, deposit: 0, state: "NSW", firstHomeBuyer: false }).premium);
const LMI_SRC = `${LMI_RATE_SOURCE.name.split(",")[0]}'s published lender table, ${LMI_RATE_SOURCE.dated}`;
const TABLE_PRICES = [400_000, 500_000, 700_000, 1_000_000] as const;
const TABLE_DEPOSITS = [15, 10, 5] as const;
// The 90% step for a loan of $500,001 to $600,000: the rate at 89.01% to 90% LVR, then at 90.01% to 91%.
const BAND_600K = LOAN_BANDS.findIndex((b) => b.max === 600_000);
const RATE_AT_90 = LMI_RATES.find((r) => r.lvrMax === 90)!.rates[BAND_600K];
const RATE_OVER_90 = LMI_RATES.find((r) => r.lvrMin === 90)!.rates[BAND_600K];
const DUTY_700K = AUSTRALIAN_STATES.map((st) => dutyFor(st, 700_000, "owner").total);

const FRONTMATTER: GuideFrontmatter = {
  title: "Lenders Mortgage Insurance 2026: What It Costs, How to Avoid",
  description:
    "What lenders mortgage insurance costs in 2026 by price and deposit, from a published lender table; when it applies, who provides it and four ways to avoid it.",
  slug: "lenders-mortgage-insurance-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 7,
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
  "LMI protects the lender, not the borrower. You pay the premium, the bank is the beneficiary, and you remain liable for any shortfall if you default.",
  "LMI applies whenever your loan-to-value ratio (LVR) exceeds 80%, meaning you're borrowing more than 80% of the property's value.",
  `On a $700,000 home with a 5% deposit, one lender's published table puts LMI at ${prem(700_000, 5)} before state duty (${LMI_SRC}). The premium rises steeply with the LVR.`,
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
      `It depends on the loan and the LVR. On one lender's published table, a $500,000 loan costs ${onLoan(500_000, 90)} at 90% LVR and ${onLoan(500_000, 95)} at 95%; a $700,000 loan at 95% costs ${onLoan(700_000, 95)}, before state duty (${LMI_SRC}). Premiums vary by lender and insurer, so ask your lender for its figure.`,
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
  { title: "LMI Calculator",               href: "/lmi-calculator",                description: "Your premium by LVR and loan size, with your state's stamp duty on it." },
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
          { name: "Check eligibility for federal schemes", text: `The 5% Deposit Scheme (First Home Guarantee) and the Family Home Guarantee for single parents waive LMI for eligible buyers with a ${HG_MIN_DEPOSIT_PCT.firstHome}% (or ${HG_MIN_DEPOSIT_PCT.singleParent}%) deposit.` },
          { name: "Estimate the LMI premium", text: `LMI scales with both LVR and loan amount. On one lender's published table a $600,000 loan costs ${onLoan(600_000, 95)} at 95% LVR and ${onLoan(600_000, 90)} at 90% (${LMI_SRC}).`, url: "/lmi-calculator" },
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
        For a $700,000 property, that means at least $140,000 in deposit, plus
        stamp duty of {fmt(Math.min(...DUTY_700K))} to {fmt(Math.max(...DUTY_700K))} for an
        owner-occupier depending on the state (less for an eligible first home buyer), plus
        conveyancing and inspections.
      </p>
      <p>Most lenders set 80% as the standard LMI threshold, but:</p>
      <ul>
        <li>Some lenders charge LMI above a different threshold (e.g. 85%)</li>
        <li>Some professions can access 90%+ lending without LMI (see professional packages below)</li>
        <li>The government&rsquo;s First Home Guarantee scheme provides an alternative to LMI for eligible buyers</li>
      </ul>

      <KeyFigure
        value="$140k+"
        label="Deposit required to avoid LMI on a $700,000 property at 80% LVR. Stamp duty, conveyancing and inspections come on top."
        context="20% of the price, before scheme alternatives"
      />

      <h2 id="cost">How much does LMI cost?</h2>
      <p>
        LMI is charged as a percentage of the whole loan, and the percentage rises with both
        the LVR and the size of the loan. These are the premiums before state duty for a 15%,
        10% or 5% deposit, from the same published lender table our{" "}
        <Link href="/lmi-calculator">LMI calculator</Link> uses:
      </p>

      <ScrollTable label="LMI premium by price and deposit">
        <table>
          <thead>
            <tr>
              <th>Price</th>
              {TABLE_DEPOSITS.map((d) => <th key={d}>{d}% deposit</th>)}
            </tr>
          </thead>
          <tbody>
            {TABLE_PRICES.map((p) => (
              <tr key={p}>
                <td>{fmt(p)}</td>
                {TABLE_DEPOSITS.map((d) => {
                  const v = premiumAt(p, d);
                  return <td key={d}>{v === null ? "Not in the table" : fmt(v)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        Source: <a href={LMI_RATE_SOURCE.url} target="_blank" rel="noopener noreferrer">{LMI_RATE_SOURCE.name}</a>,{" "}
        {LMI_RATE_SOURCE.dated}, read {LMI_RATE_SOURCE.readOn}. One lender&rsquo;s table: insurers and
        lenders price differently, and most states add duty on the premium.
      </p>

      <Callout variant="info" title="A few observations">
        <p>
          LMI costs rise much faster than the LVR: at $700,000, going from a 15% to a 5% deposit
          takes the premium from {prem(700_000, 15)} to {prem(700_000, 5)}. Lenders price in
          bands, not continuously: for a loan of $500,001 to $600,000 the rate goes from{" "}
          {RATE_AT_90}% of the loan at 90% LVR to {RATE_OVER_90}% just over it.
        </p>
      </Callout>

      <p>
        For your own price and deposit, our{" "}
        <Link href="/lmi-calculator">LMI calculator</Link> works out the LVR, the
        premium from a published lender table and the stamp duty your state adds
        to it.
      </p>

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
          same $800,000 property could now cost $882,000, so a 20% deposit grows
          from $160,000 to $176,400, and the stamp duty grows with the price.
        </li>
        <li>
          <strong>Buy now with a 10% deposit and pay {prem(800_000, 10)} LMI</strong> (on the same lender table).{" "}
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

      <Sources
        items={[
          { label: LMI_RATE_SOURCE.name, href: LMI_RATE_SOURCE.url, note: `${LMI_RATE_SOURCE.dated}, read ${LMI_RATE_SOURCE.readOn}` },
          { label: HG_SOURCES.scheme.label, href: HG_SOURCES.scheme.href, note: `read ${longDate(HG_CHECKED_ON)}` },
          "Stamp duty figures are our stamp duty calculator's, on each revenue office's rates checked 30 September 2026.",
        ]}
      />
    </GuideArticleLayout>
    </>
  );
}
