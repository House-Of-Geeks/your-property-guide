import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  MatchCTA,
  MiniStampDutyEmbed,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Stamp Duty TAS: Calculator, Rates & First Home Buyer Concessions (2026)",
  description:
    "Stamp duty in Tasmania (TAS): the full rates table, worked examples by price, where first home buyers stand, and a free calculator for your exact figure.",
  slug: "stamp-duty-tas",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
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
  "Stamp duty (transfer duty) is the largest upfront government cost a Tasmanian buyer faces after the deposit, and the buyer pays it, usually at settlement.",
  "Tasmania runs a tiered, marginal rate scale, so duty climbs in steps as the price rises rather than jumping all at once.",
  "Eligible first home buyers in Tasmania get a 50% concession on the duty payable, which roughly halves the bill.",
  "On a $650,000 home a standard buyer pays $24,625, while an eligible first home buyer pays $12,313, a saving of $12,313.",
  "Foreign buyers pay an extra 8% foreign investor duty surcharge on top of the standard duty.",
  "Rates, caps and concessions change. Confirm current settings with the State Revenue Office Tasmania before you commit.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-it",     label: "What is stamp duty in TAS?" },
  { id: "what-you-pay",   label: "What you'll actually pay" },
  { id: "how-calculated", label: "How TAS stamp duty is calculated" },
  { id: "first-home",     label: "First home buyers in TAS" },
  { id: "foreign-buyers", label: "Foreign buyers and surcharges" },
  { id: "when-pay",       label: "When do you pay stamp duty in TAS?" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much is stamp duty in TAS?",
    answer:
      "It depends on the purchase price, because Tasmania uses a tiered rate scale. On a $650,000 home a standard buyer pays $24,625, which works out to an effective rate of about 3.79%. On a $500,000 home it's $18,250, and on an $800,000 home it's $31,188. An eligible first home buyer pays half of those figures. Use the calculator on this page for your exact price.",
  },
  {
    question: "Do first home buyers pay stamp duty in TAS?",
    answer:
      "Most do, but at a reduced rate. Tasmania gives eligible first home buyers a 50% concession on the duty payable, so the bill is roughly halved rather than wiped out. On a $650,000 home that takes the duty from $24,625 down to $12,313. Tasmania has also run a temporary full exemption for first home buyers of established homes up to a value cap at various points, so check the current settings with the State Revenue Office Tasmania before you rely on the 50% figure.",
  },
  {
    question: "When do you pay stamp duty in TAS?",
    answer:
      "Generally within about three months of the transaction, and in practice it's settled at or around settlement day. Your conveyancer or solicitor usually arranges the payment as part of completing the transfer, so you rarely deal with the State Revenue Office directly. Budget for it as cash you need available at settlement, on top of your deposit.",
  },
  {
    question: "Can you avoid or reduce stamp duty in TAS?",
    answer:
      "You can't avoid it on a standard residential purchase, but eligible first home buyers reduce it through the 50% concession on the duty payable. Tasmania has also offered a temporary full exemption for first home buyers of established homes up to a value cap, so it's worth checking the current State Revenue Office Tasmania settings before you assume the 50% figure is the best you can do. Beyond that, the main lever is buying within a price tier that keeps your duty lower.",
  },
  {
    question: "Is stamp duty the same across Tasmania?",
    answer:
      "Yes. Tasmania sets transfer duty at the state level, so the same rate scale applies whether you buy in Hobart, Launceston, Devonport or a rural part of the state. The figure is driven by the purchase price and your eligibility for the first home buyer concession, not by where in Tasmania the property sits.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Stamp Duty Calculator",        href: "/stamp-duty-calculator",                  description: "Estimate your TAS stamp duty in seconds." },
  { title: "First Home Buyer Guide TAS",   href: "/guides/first-home-buyer-tas",            description: "Grants, schemes and the TAS buying process." },
  { title: "Buying Property in Australia",  href: "/guides/buying-property-australia",       description: "The complete step-by-step buying process." },
  { title: "How Much Deposit Do You Need?", href: "/guides/how-much-deposit-to-buy-a-house", description: "Deposit, LMI and the schemes that waive it." },
  { title: "Conveyancing in Australia",     href: "/guides/conveyancing-guide",              description: "What conveyancers do and what they cost." },
];

export default function StampDutyTASPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check the current rules before you commit">
        <p>
          Tasmania&rsquo;s duty rates, first home buyer concessions and any
          temporary exemptions get changed by the state budget from time to
          time. Confirm what applies on your settlement date with the{" "}
          <a href="https://www.sro.tas.gov.au" target="_blank" rel="noopener noreferrer">
            State Revenue Office Tasmania
          </a>{" "}
          or your conveyancer before you sign anything.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Tasmania is the small market where the duty bill still stings. Prices
          are lower than the mainland capitals, but the rate scale tops out at
          4.5%, so a mid-range Hobart home can land you a five figure duty bill
          you have to find in cash at settlement. Buyers here often plan their
          deposit to the dollar and then get caught short by the duty. Treat it
          as a separate line in your budget from day one, not an afterthought.
        </p>
      </EditorNote>

      <h2 id="what-is-it">What is stamp duty in TAS?</h2>
      <p className="lead">
        Stamp duty, formally called transfer duty, is the tax the Tasmanian
        government charges when property changes hands. For most buyers it is
        the biggest single upfront government cost after the deposit itself.
      </p>
      <p>
        The buyer pays it, not the seller, and it is normally settled at or
        around settlement as part of completing the transfer. It is calculated
        on the purchase price (or the property&rsquo;s value, whichever is
        higher), and it sits on top of your deposit, so it is real cash you need
        ready before the keys change hands.
      </p>

      <h2 id="what-you-pay">TAS stamp duty: what you&rsquo;ll actually pay</h2>
      <p>
        Here is what transfer duty works out to across a range of Tasmanian
        purchase prices, alongside what an eligible first home buyer pays once
        the 50% concession is applied.
      </p>

      <table>
        <thead>
          <tr>
            <th>Purchase price</th>
            <th>Standard buyer</th>
            <th>First home buyer</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$400,000</td><td>$14,000 (effective 3.5%)</td><td>$7,000 (saves $7,000 (50%))</td></tr>
          <tr><td>$500,000</td><td>$18,250 (effective 3.65%)</td><td>$9,125 (saves $9,125 (50%))</td></tr>
          <tr><td>$650,000</td><td>$24,625 (effective 3.79%)</td><td>$12,313 (saves $12,313 (50%))</td></tr>
          <tr><td>$800,000</td><td>$31,188 (effective 3.9%)</td><td>$15,594 (saves $15,594 (50%))</td></tr>
          <tr><td>$1,000,000</td><td>$40,188 (effective 4.02%)</td><td>$20,094 (saves $20,094 (50%))</td></tr>
          <tr><td>$1,500,000</td><td>$62,688 (effective 4.18%)</td><td>$31,344 (saves $31,344 (50%))</td></tr>
        </tbody>
      </table>

      <p>
        These are owner-occupier estimates and exclude any foreign buyer
        surcharge. For an exact figure on your own price, run it through the
        full <Link href="/stamp-duty-calculator">stamp duty calculator</Link>.
      </p>

      <MiniStampDutyEmbed defaultState="TAS" />

      <h2 id="how-calculated">How TAS stamp duty is calculated</h2>
      <p>
        Tasmania uses a tiered, marginal scale. Each band has a fixed base
        amount plus a rate that applies only to the portion of the price inside
        that band, so duty climbs gradually as the price rises rather than
        jumping in one hit. There is no duty on the first $3,000.
      </p>

      <table>
        <thead>
          <tr>
            <th>Property value</th>
            <th>Duty payable</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$0 to $3,000</td><td>Nil</td></tr>
          <tr><td>$3,001 to $25,000</td><td>1.75% of the value above $3,000</td></tr>
          <tr><td>$25,001 to $75,000</td><td>$437.50 plus 2.25% of the value above $25,000</td></tr>
          <tr><td>$75,001 to $200,000</td><td>$1,562.50 plus 3.5% of the value above $75,000</td></tr>
          <tr><td>$200,001 to $375,000</td><td>$5,937.50 plus 4% of the value above $200,000</td></tr>
          <tr><td>$375,001 to $725,000</td><td>$12,937.50 plus 4.25% of the value above $375,000</td></tr>
          <tr><td>Over $725,000</td><td>$27,812.50 plus 4.5% of the value above $725,000</td></tr>
        </tbody>
      </table>

      <KeyFigure
        value="4.5%"
        label="The top marginal rate on the value of a TAS home above $725,000."
        context="No duty applies on the first $3,000"
      />

      <p>
        Working through a $650,000 home shows how it stacks up: you start with
        the $12,937.50 base for the $375,001 to $725,000 band, then add 4.25% of
        the $275,000 above $375,000, which is $11,687.50. Together that is
        $24,625, matching the table above.
      </p>

      <h2 id="first-home">First home buyers in TAS</h2>
      <p>
        Tasmania gives eligible first home buyers a 50% concession on the stamp
        duty payable. That is the saving already reflected in the first home
        buyer column above, and it roughly halves the bill rather than removing
        it.
      </p>
      <p>
        Tasmania has also run a temporary full exemption for first home buyers
        of established homes up to a value cap. Whether that is in force, and
        what the cap is, changes with state budgets, so check the current
        settings with the State Revenue Office Tasmania before you rely on the
        50% figure being the best you can get.
      </p>
      <p>
        For the full grant and scheme detail, including eligibility and how to
        apply, read{" "}
        <Link href="/guides/first-home-buyer-tas">our TAS first home buyer guide</Link>.
      </p>

      <h2 id="foreign-buyers">Foreign buyers and surcharges</h2>
      <p>
        Tasmania charges an 8% foreign investor duty surcharge on residential
        property bought by foreign persons. It applies on top of the standard
        transfer duty, so a foreign buyer pays the usual scaled duty plus 8% of
        the property value again. The worked examples above do not include this
        surcharge, since they assume an owner-occupier buyer.
      </p>

      <h2 id="when-pay">When do you pay stamp duty in TAS?</h2>
      <p>
        Transfer duty is generally due within about three months of the
        transaction, and in practice it is paid at or around settlement. Your
        conveyancer or solicitor usually arranges the payment as part of
        completing the transfer, so it comes out of the funds at settlement
        rather than something you lodge yourself.
      </p>
      <p>
        The practical point is cash flow: the duty is money you need available
        on settlement day, separate from your deposit. Factor it into your
        savings target from the start so it does not catch you out late in the
        purchase.
      </p>

      <MatchCTA kind="buyers-agent" />
    </GuideArticleLayout>
  );
}
