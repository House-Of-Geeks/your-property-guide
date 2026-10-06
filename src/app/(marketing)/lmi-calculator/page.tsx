import type { Metadata } from "next";
import Link from "next/link";
import { LMICalculator } from "@/components/calculators/LMICalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import {
  HELIA_INVESTOR_READING,
  HELIA_READINGS,
  HELIA_SOURCE,
  LMI_DUTY,
  LMI_RATE_SOURCE,
  computeLmi,
  lookupLmiRate,
  premiumAt,
} from "@/lib/lmi-calc";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "LMI calculator: what lenders mortgage insurance costs in 2026",
  description:
    "Enter the price and your deposit to see your LVR, the LMI premium from a published lender table, the stamp duty your state adds to it, and what the 5% Deposit Scheme would save a first home buyer.",
  slug: "lmi-calculator",
  schemaName: "LMI Calculator",
  schemaDescription:
    "Estimate lenders mortgage insurance in Australia from the price and deposit: LVR, premium by LVR and loan size, and state stamp duty on the premium.",
  updatedAt: "2026-09-30",
  persona: "first-home",
};

const META_TITLE = "LMI Calculator: Lenders Mortgage Insurance Cost (2026)";
const META_DESCRIPTION =
  "Free LMI calculator for Australia. Your LVR, the premium from a published lender table, stamp duty on it by state, and the 5% Deposit Scheme alternative.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

// The FAQ figures are computed by the same engine the calculator runs, so the
// answers cannot drift from the tool (tests/lib/lmi-calc.test.ts pins them).
const at = (price: number, state: StateCode) =>
  computeLmi({ price, mode: "deposit", deposit: price * 0.1, loan: 0, state, firstHomeBuyer: false });
const ex600 = at(600_000, "VIC");
const ex800 = at(800_000, "QLD");
const helia = (price: number, fhb: boolean) =>
  HELIA_READINGS.find((h) => h.price === price && h.firstHomeBuyer === fhb)?.premium ?? 0;
/** How far under the table's premium Helia's reading came, in whole percent. */
const heliaUnder = (price: number, tablePremium: number) => Math.round((1 - helia(price, false) / tablePremium) * 100);
const fhbDiscount = Math.round((1 - helia(600_000, true) / helia(600_000, false)) * 100);
// The table's rates for a $540,000 loan either side of the 90% edge.
const rate = (lvr: number) => lookupLmiRate(540_000, lvr)?.ratePct ?? 0;
const RATE_88_89 = rate(88.5);
const RATE_89_90 = rate(90);
const RATE_90_91 = rate(90.5);

const FAQS: FaqItem[] = [
  {
    question: "How much LMI on a 10% deposit?",
    answer:
      `On a $600,000 home with a 10% deposit you borrow ${fmt(ex600.loan)}, an LVR of ${ex600.lvr}%. The lender table we use charges ${ex600.ratePct}% of the loan, ${fmt(ex600.premium)}, and in Victoria 10% duty takes it to ${fmt(ex600.total)}. ` +
      `On an $800,000 home the loan is ${fmt(ex800.loan)} and the premium ${fmt(ex800.premium)} (${ex800.ratePct}%), or ${fmt(ex800.total)} with Queensland's 9% duty. ` +
      `Insurers differ: Helia's own estimator quoted ${fmt(helia(600_000, false))} and ${fmt(helia(800_000, false))} for the same two loans on 30 September 2026, before duty.`,
  },
  {
    question: "How is the LMI rate calculated?",
    answer:
      "The insurer sets a rate for each band of loan to value ratio (LVR) and loan size, and the premium is that rate times the whole loan, not just the part above 80%. " +
      `In the table we use, a $540,000 loan costs ${RATE_88_89}% between 88.01% and 89% LVR, ${RATE_89_90}% up to 90%, then ${RATE_90_91}% just above 90%. ` +
      "Crossing a band edge by a few dollars of deposit can add thousands, which is why a slightly bigger deposit often pays for itself. Your state then adds stamp duty on the premium (none in NSW or the ACT, 9% to 11% elsewhere).",
  },
  {
    question: "How to avoid LMI without a 20% deposit?",
    answer:
      "Four routes. An eligible first home buyer can use the Australian Government 5% Deposit Scheme, which has no income test and replaces LMI with a government guarantee under a price cap ($1.5 million in NSW capital cities and regional centres). " +
      "Single parents can use the Family Home Guarantee with 2%. A family guarantor can secure part of the loan with their own property. " +
      `Some lenders waive LMI for certain professions, such as doctors and accountants. On the $600,000 example above, any of these saves ${fmt(ex600.total)}.`,
  },
  {
    question: "Do first home buyers pay less LMI?",
    answer:
      `With some insurers, yes. Helia's estimator quoted a first home buyer ${fmt(helia(600_000, true))} on a $540,000 loan at 90% LVR, against ${fmt(helia(600_000, false))} for anyone else, about ${fhbDiscount}% less (30 September 2026). ` +
      "The lender table in this calculator has no first home buyer discount, so treat its figure as the upper end. The bigger saving is the 5% Deposit Scheme, which removes LMI altogether for eligible buyers under the price cap.",
  },
  {
    question: "Is stamp duty charged on LMI?",
    answer:
      "In most states, yes, because LMI is general insurance. Revenue offices charge 9% in Queensland, 10% in Victoria, Western Australia, Tasmania and the Northern Territory, and 11% in South Australia. " +
      "New South Wales has exempted LMI premiums paid since 1 July 2017, and the ACT abolished insurance duty on 1 July 2016. The duty is charged on top of the premium, so the calculator adds it for the state you pick.",
  },
  {
    question: "Can I add LMI to my home loan?",
    answer:
      "Usually, yes. Helia's LMI factsheet says the fee is passed on as a one-off charge and usually added to the home loan. That spares your savings, but you pay interest on the premium for the life of the loan, and it lifts your LVR slightly. " +
      "Paying it from savings is cheaper if it does not eat into the deposit that keeps you under a band edge.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Lenders mortgage insurance guide", href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI is, who it protects, and when paying it makes sense." },
  { title: "First Home Guarantee", href: "/guides/first-home-guarantee", description: "Buy with a 5% deposit and no LMI: eligibility and price caps." },
  { title: "Help to Buy calculator", href: "/help-to-buy-calculator", description: "Buy with a 2% deposit and no LMI while the government funds up to 40%." },
  { title: "How much deposit do I need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "5%, 10% or 20%, and the cash you need on top." },
  { title: "Stamp duty calculator", href: "/stamp-duty-calculator", description: "The other big upfront cost, by state." },
  { title: "Borrowing power calculator", href: "/borrowing-power-calculator", description: "What lenders will let you borrow on your income." },
  { title: "Mortgage calculator", href: "/mortgage-calculator", description: "Repayments on the loan, with LMI added or not." },
];

const TABLE_PRICES = [500_000, 600_000, 700_000, 800_000, 1_000_000];
const TABLE_DEPOSITS = [5, 10, 15];
const STATES = Object.keys(LMI_DUTY) as StateCode[];

export default function LMICalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<LMICalculator />}
      faqs={FAQS}
      related={RELATED}
      intent="buying"
      explainer={
        <>
          <h2>LMI by price and deposit</h2>
          <p>
            The premium before stamp duty for a 5%, 10% or 15% deposit, from the same lender table the calculator uses. A
            20% deposit or more means no LMI.
          </p>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Price</th>
                {TABLE_DEPOSITS.map((d) => <th key={d}>{d}% down</th>)}
              </tr>
            </thead>
            <tbody>
              {TABLE_PRICES.map((p) => (
                <tr key={p}>
                  <td>{fmt(p)}</td>
                  {TABLE_DEPOSITS.map((d) => {
                    const prem = premiumAt(p, d);
                    return <td key={d}>{prem === null ? "Not in table" : fmt(prem)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p>
            Source: {LMI_RATE_SOURCE.name}, {LMI_RATE_SOURCE.dated}, read {LMI_RATE_SOURCE.readOn}. The table stops at loans
            of $1,000,000 and at 95% LVR.
          </p>

          <h2>How LMI is worked out</h2>
          <p>
            Your loan to value ratio (LVR) is the loan divided by the price. At 80% or less there is no LMI. Above 80%, the
            insurer charges a percentage of the whole loan, and the percentage rises with both the LVR band and the size of
            the loan. The rise is steepest at 90%: for a loan between $500,001 and $600,000 the table&rsquo;s rate goes from{" "}
            {RATE_89_90}% to {RATE_90_91}% as the LVR passes 90%.
          </p>
          <p>
            The two big LMI insurers are Helia and Arch, and some lenders insure themselves, so two lenders can quote
            different premiums for the same loan. For the two 10% deposit examples in the questions below, Helia&rsquo;s{" "}
            <a href={HELIA_SOURCE.url} rel="noopener" target="_blank">LMI fee estimator</a> came in{" "}
            {heliaUnder(600_000, ex600.premium)}% and {heliaUnder(800_000, ex800.premium)}% under our table on{" "}
            {HELIA_SOURCE.readOn}. Use this page for the order of magnitude and ask your lender for the real figure.
          </p>

          <h2>Stamp duty on LMI by state</h2>
          <div className="overflow-x-auto">
          <table>
            <thead>
              <tr><th>State</th><th>Duty</th><th>Source</th></tr>
            </thead>
            <tbody>
              {STATES.map((s) => (
                <tr key={s}>
                  <td>{STATE_NAMES[s].replace(/^the /, "")}</td>
                  <td>{LMI_DUTY[s].rate === 0 ? "None" : `${Math.round(LMI_DUTY[s].rate * 100)}%`}</td>
                  <td><a href={LMI_DUTY[s].url} rel="noopener" target="_blank">{LMI_DUTY[s].source}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p>Each revenue office page was read on 30 September 2026. Duty is charged as a share of the premium.</p>

          <Callout variant="info" title="The alternative to paying LMI">
            <p>
              Eligible first home buyers can buy with a 5% deposit and no LMI under the 5% Deposit Scheme. Our{" "}
              <Link href="/guides/first-home-guarantee">First Home Guarantee guide</Link> covers eligibility and price
              caps, and the <Link href="/guides/how-much-deposit-to-buy-a-house">deposit guide</Link> sets out the cash you
              need at 5%, 10% and 20%.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>
              It prices owner-occupier loans only. Investment loans usually cost more: Helia quoted an investor{" "}
              {fmt(HELIA_INVESTOR_READING.premium)} on a $540,000 loan at 90% LVR against {fmt(helia(600_000, false))} for an
              owner-occupier ({HELIA_SOURCE.readOn}).
            </li>
            <li>It uses one lender&rsquo;s published table. Your lender&rsquo;s insurer may charge more or less.</li>
            <li>It doesn&rsquo;t price loans above $1,000,000 or LVRs above 95%, where the table stops.</li>
            <li>It doesn&rsquo;t apply first home buyer discounts, low-doc pricing or loan terms over 30 years.</li>
            <li>It doesn&rsquo;t add the premium to the loan. If you capitalise it, the LVR rises a little; check it stays in the same band.</li>
          </ul>
        </>
      }
    />
  );
}
