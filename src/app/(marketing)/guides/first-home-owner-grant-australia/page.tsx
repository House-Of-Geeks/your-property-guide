import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  EditorNote,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Owner Grant (FHOG) by State: 2026 Amounts & Eligibility",
  description:
    "The First Home Owner Grant is a state grant, not federal. See FHOG amounts, price caps and eligibility for every state and territory, plus links to each state's detailed guide.",
  slug: "first-home-owner-grant-australia",
  publishedAt: "2026-06-14",
  updatedAt: "2026-07-03",
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
  "The First Home Owner Grant (FHOG) is a state and territory grant, not a federal scheme. Each state runs its own version with its own amount, price cap and rules.",
  "The grant generally applies to new homes only: newly built, off-the-plan, or substantially renovated properties. Established homes do not qualify in most states.",
  "Amounts range from no flat grant in the ACT, through $10,000 in NSW, WA and NT, to $15,000 in Queensland and SA. Queensland's boosted $30,000 grant ended for contracts signed after 30 June 2026.",
  "Price caps vary by state and apply to the contract price. Even a dollar over the cap can disqualify the whole grant, so plan well under.",
  "The FHOG usually stacks with first home buyer stamp duty concessions and federal schemes like the First Home Guarantee, which can save eligible buyers tens of thousands.",
  "Scheme rules, amounts and caps change. Verify the current figure with your state revenue office before you sign anything.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-is-fhog",     label: "What the First Home Owner Grant is" },
  { id: "by-state",         label: "FHOG amounts by state" },
  { id: "new-vs-established",label: "New homes vs established homes" },
  { id: "stacking",         label: "Combining the FHOG with other help" },
  { id: "how-to-apply",     label: "How to apply for the FHOG" },
  { id: "state-guides",     label: "State and territory guides" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the First Home Owner Grant?",
    answer:
      "The First Home Owner Grant (FHOG) is a one-off cash grant paid by a state or territory government to eligible first home buyers. It is not a federal scheme, so the amount, the price cap and the eligibility rules are set by each state and differ across the country. In most states the grant applies only to new homes: a newly built property, an off-the-plan purchase, or a substantially renovated home that has not been lived in since the work was done.",
  },
  {
    question: "How much is the First Home Owner Grant in NSW, Queensland and Victoria?",
    answer:
      "NSW pays $10,000 on eligible new homes. Queensland pays $15,000 for new builds; its boosted $30,000 grant only applied to contracts signed between 20 November 2023 and 30 June 2026, so contracts from 1 July 2026 receive $15,000. Victoria pays $10,000 for new homes in metropolitan areas and $20,000 for new homes in regional Victoria. All three apply to new homes only and carry their own price caps, so confirm the current amount and cap with the relevant state revenue office before you rely on it.",
  },
  {
    question: "Can you get the FHOG on an established home?",
    answer:
      "In most states, no. The FHOG is designed to encourage new housing supply, so it generally applies only to new builds, off-the-plan purchases, and substantially renovated homes. The Northern Territory is the main exception, where a substantially renovated home can qualify. If you buy an established home you usually miss the grant, but you may still get a first home buyer stamp duty concession and a federal scheme like the First Home Guarantee, which both apply to established homes.",
  },
  {
    question: "Can you combine the FHOG with stamp duty concessions?",
    answer:
      "Usually yes. The FHOG is a cash grant, while a first home buyer stamp duty exemption or concession reduces or removes the duty you pay at settlement. They are separate forms of help with separate eligibility rules, so where you qualify for both they stack. You can often add a federal scheme on top, such as the First Home Guarantee, which lets eligible buyers purchase with a smaller deposit and no Lenders Mortgage Insurance. Stacking all three is where the largest savings come from.",
  },
  {
    question: "How do you apply for the First Home Owner Grant?",
    answer:
      "You apply through your state or territory revenue office, and in most cases your lender or conveyancer lodges the application for you as part of settlement. If you are using a home loan, the simplest path is to apply through your participating lender so the grant can be applied at settlement. Owner-builders and some new-build purchases apply directly with the revenue office instead. You will need proof of identity, the contract, and evidence the home meets the new-home and price-cap rules.",
  },
  {
    question: "Is the First Home Owner Grant the same as the First Home Guarantee?",
    answer:
      "No. The First Home Owner Grant is a state cash grant for new homes. The First Home Guarantee is a federal scheme that lets eligible first home buyers purchase with as little as a 5% deposit without paying Lenders Mortgage Insurance, and it covers both new and established homes. They are run by different levels of government and you can often use both at once if you qualify for each.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide",  description: "Federal schemes, FHOG by state, stamp duty concessions and the full buying process." },
  { title: "First Home Guarantee",              href: "/guides/first-home-guarantee",      description: "The 5% deposit, no-LMI federal scheme: income limits, price caps and how to apply." },
  { title: "First Home Buyer Guide, NSW",       href: "/guides/first-home-buyer-nsw",      description: "NSW grant, stamp duty exemption and price caps in one place." },
  { title: "First Home Buyer Guide, VIC",       href: "/guides/first-home-buyer-vic",      description: "Victoria's metro and regional grants plus stamp duty relief." },
  { title: "First Home Buyer Guide, QLD",       href: "/guides/first-home-buyer-qld",      description: "Queensland's larger new-build grant and first home concession." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",            description: "Estimate your duty and first home buyer saving, state by state." },
];

export default function FirstHomeOwnerGrantAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Verify the current figure with your state revenue office">
        <p>
          Grant amounts, price caps and eligibility rules change, and some are
          time-limited boosts that step down. The figures here are a guide, not a
          quote. Always confirm the current amount and rules with the revenue
          office in your state or territory, or a licensed conveyancer, before you
          sign a contract.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The most common mix-up we see is treating the First Home Owner Grant as
          one national payment. It isn&rsquo;t. It&rsquo;s eight different grants
          run by eight different governments, and the gap between them is large:
          the same buyer might get nothing in the ACT and $15,000 or more over
          the border. The grant also gets confused with the federal First Home
          Guarantee, which is a separate thing entirely. Sort out which state
          you&rsquo;re buying in first, then read that state&rsquo;s rules.
        </p>
      </EditorNote>

      <h2 id="what-is-fhog">What the First Home Owner Grant is</h2>
      <p className="lead">
        The First Home Owner Grant (FHOG) is a one-off cash grant paid by a state
        or territory government to eligible first home buyers. It is not a federal
        scheme, so the amount, the price cap and the rules are set by each state
        and differ across the country.
      </p>
      <p>
        The grant exists to encourage new housing supply, which is why it
        generally applies to <strong>new homes only</strong>: a newly built
        property, an off-the-plan purchase, or a home that has been substantially
        renovated and not lived in since. Established homes usually miss out, even
        though they can still qualify for stamp duty relief and federal schemes.
      </p>

      <KeyFigure
        value="$0–$20k"
        label="The FHOG ranges from no flat grant in the ACT up to $20,000 for new builds in regional Victoria. Queensland's boosted $30,000 grant reverted to $15,000 for contracts signed from 1 July 2026."
        context="State grant, new homes only, amounts and caps change"
      />

      <h2 id="by-state">First Home Owner Grant amounts by state</h2>
      <p>
        Here is the picture across all eight states and territories. Treat every
        figure as a starting point and confirm the current amount and price cap
        with the relevant revenue office, because several of these are subject to
        review or are time-limited boosts.
      </p>

      <table>
        <thead>
          <tr>
            <th>State / Territory</th>
            <th>FHOG amount</th>
            <th>Applies to</th>
            <th>State guide</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>NSW</strong></td>
            <td>$10,000</td>
            <td>New homes up to $750,000</td>
            <td><Link href="/guides/first-home-buyer-nsw">NSW guide</Link></td>
          </tr>
          <tr>
            <td><strong>VIC</strong></td>
            <td>$10,000 metro / $20,000 regional</td>
            <td>New homes</td>
            <td><Link href="/guides/first-home-buyer-vic">VIC guide</Link></td>
          </tr>
          <tr>
            <td><strong>QLD</strong></td>
            <td>$15,000 ($30,000 for contracts signed 20 Nov 2023 – 30 Jun 2026)</td>
            <td>New builds</td>
            <td><Link href="/guides/first-home-buyer-qld">QLD guide</Link></td>
          </tr>
          <tr>
            <td><strong>WA</strong></td>
            <td>$10,000</td>
            <td>New homes</td>
            <td><Link href="/guides/first-home-buyer-wa">WA guide</Link></td>
          </tr>
          <tr>
            <td><strong>SA</strong></td>
            <td>$15,000</td>
            <td>New homes</td>
            <td><Link href="/guides/first-home-buyer-sa">SA guide</Link></td>
          </tr>
          <tr>
            <td><strong>TAS</strong></td>
            <td>Up to $30,000 (check current)</td>
            <td>New homes</td>
            <td><Link href="/guides/first-home-buyer-tas">TAS guide</Link></td>
          </tr>
          <tr>
            <td><strong>NT</strong></td>
            <td>$10,000</td>
            <td>New or substantially renovated homes</td>
            <td><Link href="/guides/first-home-buyer-nt">NT guide</Link></td>
          </tr>
          <tr>
            <td><strong>ACT</strong></td>
            <td>No flat grant</td>
            <td>Uses the income-tested Home Buyer Concession Scheme instead</td>
            <td><Link href="/guides/first-home-buyer-act">ACT guide</Link></td>
          </tr>
        </tbody>
      </table>

      <Callout variant="info" title="Queensland's boost ended on 30 June 2026">
        <p>
          Queensland&rsquo;s boosted $30,000 grant applied to eligible contracts
          signed between 20 November 2023 and 30 June 2026. Contracts signed
          from 1 July 2026 receive $15,000. Tasmania&rsquo;s boosted $30,000
          grant was also tied to a set window, so if you are buying in either
          state, confirm the exact amount that applies to your contract date
          with the state revenue office.
        </p>
      </Callout>

      <p>
        Each grant pairs with a separate first home buyer stamp duty concession in
        that state, which is often the larger saving. Our state guides cover both
        the grant and the duty rules together, and you can model the duty side
        with our{" "}
        <Link href="/stamp-duty-calculator">stamp duty calculator</Link>. For the
        full duty detail by state, see{" "}
        <Link href="/guides/stamp-duty-nsw">NSW</Link>,{" "}
        <Link href="/guides/stamp-duty-vic">VIC</Link>,{" "}
        <Link href="/guides/stamp-duty-qld">QLD</Link>,{" "}
        <Link href="/guides/stamp-duty-wa">WA</Link>,{" "}
        <Link href="/guides/stamp-duty-sa">SA</Link>,{" "}
        <Link href="/guides/stamp-duty-tas">TAS</Link>,{" "}
        <Link href="/guides/stamp-duty-nt">NT</Link> and{" "}
        <Link href="/guides/stamp-duty-act">ACT</Link>.
      </p>

      <h2 id="new-vs-established">New homes vs established homes</h2>
      <p>
        The single rule that catches the most buyers out is the new-home
        condition. In most states the FHOG only pays out on:
      </p>
      <ul>
        <li><strong>Newly built homes</strong> that have never been occupied or sold as a place of residence</li>
        <li><strong>Off-the-plan purchases</strong> and homes bought as a house and land package</li>
        <li><strong>Substantially renovated homes</strong> that have not been lived in since the renovation</li>
        <li><strong>Owner-builder new homes</strong> in states that allow it, paid once an occupancy certificate is issued</li>
      </ul>
      <p>
        An established home that someone has already lived in does not qualify for
        the grant in most states. The Northern Territory is the main exception,
        where a substantially renovated home can be eligible. If you have your
        heart set on an established home, focus on the stamp duty concession and
        federal schemes instead, both of which apply to established properties.
      </p>

      <h2 id="stacking">Combining the FHOG with other help</h2>
      <p>
        The grant is rarely the only support available. Where you qualify for more
        than one, they generally stack:
      </p>
      <ul>
        <li>
          <strong>FHOG plus stamp duty concession.</strong> The grant is cash; the
          duty concession reduces or removes the tax you pay at settlement. These
          are separate and can usually be claimed together.
        </li>
        <li>
          <strong>FHOG plus the First Home Guarantee.</strong> The{" "}
          <Link href="/guides/first-home-guarantee">First Home Guarantee</Link> is
          a federal scheme that lets eligible buyers purchase with as little as a
          5% deposit and no Lenders Mortgage Insurance. It covers new and
          established homes and can sit alongside a state grant.
        </li>
        <li>
          <strong>FHOG plus the First Home Super Saver Scheme.</strong> The FHSS
          lets you save a deposit inside super at a lower tax rate, then withdraw
          it. It runs separately from the grant.
        </li>
      </ul>
      <p>
        Stacking a federal scheme, a state grant and a stamp duty concession on an
        eligible new home is where first home buyers find the biggest combined
        saving. The full national picture, including federal schemes and how they
        interact, is in our{" "}
        <Link href="/guides/first-home-buyer-guide">national first home buyer guide</Link>.
      </p>

      <Callout variant="warning" title="Price caps are firm">
        <p>
          Every grant and concession has a price cap, and they are unforgiving.
          One dollar over the cap can disqualify the entire grant, not just the
          amount above the threshold. Caps differ between the grant, the stamp duty
          concession and the federal scheme, so check each one separately and plan
          well under the lowest of them.
        </p>
      </Callout>

      <h2 id="how-to-apply">How to apply for the First Home Owner Grant</h2>
      <p>
        The process is similar across states, with the revenue office as the final
        authority:
      </p>
      <ol>
        <li>
          <strong>Confirm eligibility before you make an offer.</strong> Check that
          you have never owned residential property in Australia, that the home
          meets the new-home rule, and that the contract price sits under the cap.
        </li>
        <li>
          <strong>Apply through your lender or conveyancer.</strong> For most
          financed purchases, your participating lender lodges the grant
          application so it can be applied at settlement. Owner-builders and some
          new-build buyers apply directly with the revenue office.
        </li>
        <li>
          <strong>Provide your documents.</strong> Expect to supply proof of
          identity, the signed contract, and evidence the home is new or
          substantially renovated.
        </li>
        <li>
          <strong>Receive the grant.</strong> Timing varies. Some states pay at
          settlement through your lender; owner-builder grants are usually paid
          once an occupancy certificate is issued.
        </li>
      </ol>

      <MatchCTA kind="mortgage-broker" />

      <h2 id="state-guides">State and territory guides</h2>
      <p>
        Pick your state for the exact grant amount, the price cap, the stamp duty
        rules and the local buying process:
      </p>
      <ul>
        <li><Link href="/guides/first-home-buyer-nsw">First Home Buyer Guide, New South Wales</Link></li>
        <li><Link href="/guides/first-home-buyer-vic">First Home Buyer Guide, Victoria</Link></li>
        <li><Link href="/guides/first-home-buyer-qld">First Home Buyer Guide, Queensland</Link></li>
        <li><Link href="/guides/first-home-buyer-wa">First Home Buyer Guide, Western Australia</Link></li>
        <li><Link href="/guides/first-home-buyer-sa">First Home Buyer Guide, South Australia</Link></li>
        <li><Link href="/guides/first-home-buyer-tas">First Home Buyer Guide, Tasmania</Link></li>
        <li><Link href="/guides/first-home-buyer-nt">First Home Buyer Guide, Northern Territory</Link></li>
        <li><Link href="/guides/first-home-buyer-act">First Home Buyer Guide, Australian Capital Territory</Link></li>
      </ul>
      <p>
        For the federal schemes that work alongside the grant, read the{" "}
        <Link href="/guides/first-home-buyer-guide">national first home buyer guide</Link>{" "}
        and the{" "}
        <Link href="/guides/first-home-guarantee">First Home Guarantee guide</Link>.
      </p>

      <Sources items={FHOG_SOURCES} />
    </GuideArticleLayout>
  );
}

const FHOG_SOURCES: readonly SourceItem[] = [
  { label: "firsthome.gov.au: First home buyer support and grants", href: "https://www.firsthome.gov.au/", note: "Federal hub linking to each state and territory grant" },
  { label: "Revenue NSW: First Home Owner Grant (New Homes)", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer", note: "NSW grant amount, caps and eligibility" },
  { label: "State Revenue Office Victoria: First Home Owner Grant", href: "https://www.sro.vic.gov.au/fhogapply", note: "Victorian metro and regional grant detail" },
  { label: "Queensland Revenue Office: First Home Owner Grant", href: "https://qro.qld.gov.au/property-concessions-grants/first-home-grant/", note: "Queensland new-build grant and current amount" },
  { label: "Housing Australia: First Home Guarantee", href: "https://www.housingaustralia.gov.au/support-buy-home", note: "Federal scheme that stacks with the state grant" },
];
