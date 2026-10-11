import type { Metadata } from "next";
import Link from "next/link";
import { HelpToBuyNote } from "@/components/guide/HelpToBuyNote";
import { FhssNote } from "@/components/guide/FhssNote";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HomeGuaranteeNote } from "@/components/guide/HomeGuaranteeNote";
import { HG_CHECKED_ON, HG_PRICE_CAPS, fmtCap } from "@/lib/data/home-guarantee";
import { FirstHomeDutyFacts, FirstHomeGrantFacts } from "@/components/guide/FirstHomeStateFacts";
import { FIRST_HOME_DUTY, FIRST_HOME_GRANTS, fmt, firstHomeSources, longDate } from "@/lib/data/first-home-grants";
import { SHARED_EQUITY_SCHEMES } from "@/lib/data/help-to-buy";
import { dutyFor, money } from "@/lib/data/stamp-duty-state";

// Grant and duty figures come from src/lib/data/first-home-grants.ts and the
// stamp duty engine (commercial-intent review 10 Oct 2026, buying 0.1 row 12
// and 3.3). Budget claims that QRO's own pages do not carry are gone.
const GRANT = FIRST_HOME_GRANTS.QLD;
const DUTY = FIRST_HOME_DUTY.QLD;
const GRANT_AMOUNT = fmt(GRANT.amount!);
const GRANT_CAP = fmt(GRANT.caps[0].value);
const DUTY_700K = dutyFor("QLD", 700_000, "owner").total;
const DUTY_800K = money(dutyFor("QLD", 800_000, "first").total);
const BOOST = SHARED_EQUITY_SCHEMES.find((x) => x.name === "Boost to Buy")!;

const FRONTMATTER: GuideFrontmatter = {
  title: "First Home Buyer Guide QLD: $30K Grant, Stamp Duty & Schemes (2026)",
  description:
    "Queensland first home buyer guide: $30,000 grant on new homes under $750,000, no transfer duty on a new home, and $0 on an established home to $700,000.",
  slug: "first-home-buyer-qld",
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
  `Queensland pays a ${GRANT_AMOUNT} first home owner grant on a new home valued under ${GRANT_CAP}, for contracts signed on or after 20 November 2023; QRO publishes no end date (read ${longDate(GRANT.checkedOn)}).`,
  `Eligible first home buyers pay no transfer duty on a new home or vacant land at any price (from 1 May 2025), and none on an established home up to ${fmt(DUTY.exemptTo!)}, phasing out under ${fmt(DUTY.concessionTo!)}.`,
  `Together, on a $700,000 new home the grant and the duty saved come to ${money(GRANT.amount! + DUTY_700K)} (Queensland Revenue Office rates).`,
  "Federal schemes (the 5% Deposit Scheme, Family Home Guarantee, Help to Buy) all work in QLD, and the 5% Deposit Scheme no longer has income caps or place limits.",
  "QLD uses the REIQ standard contract with conditions built in (building, pest, finance) rather than relying on a cooling-off period.",
  "Cooling-off in QLD is 5 business days from the buyer receiving the contract; no cooling-off at auction.",
];

const TOC: GuideTOCEntry[] = [
  { id: "fhog-qld",       label: "First Home Owner Grant QLD" },
  { id: "stamp-duty-qld", label: "Stamp duty (transfer duty) concession" },
  { id: "federal-schemes",label: "Federal schemes in QLD" },
  { id: "qld-specific",   label: "QLD-specific schemes and resources" },
  { id: "buying-process", label: "The QLD buying process" },
  { id: "contacts",       label: "Key contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is QLD's FHOG still $30,000?",
    answer:
      `Yes. The Queensland Revenue Office lists ${GRANT_AMOUNT} for eligible contracts signed on or after 20 November 2023 (it was $15,000 before that date) and publishes no end date (read ${longDate(GRANT.checkedOn)}). The home must be new and valued under ${GRANT_CAP}, land and contract variations included. Combined with no transfer duty on a new home, it is worth more than the grant alone.`,
  },
  {
    question: "Can I get the QLD FHOG on an established home?",
    answer:
      `No. The grant only applies to new homes, off-the-plan homes and owner-builder new builds. Established properties don't qualify. The first home concession on transfer duty does cover an established home: no duty up to ${fmt(DUTY.exemptTo!)}, a shrinking concession under ${fmt(DUTY.concessionTo!)} (Queensland Revenue Office, read ${longDate(DUTY.checkedOn)}).`,
  },
  {
    question: "Does QLD have a full stamp duty exemption like NSW or VIC?",
    answer:
      `Yes, for most first homes. An eligible first home buyer pays no transfer duty on a new home or vacant land at any price (transactions from 1 May 2025), and none on an established home up to ${fmt(DUTY.exemptTo!)}, with the concession phasing out under ${fmt(DUTY.concessionTo!)} (contracts from ${DUTY.from}). At ${fmt(DUTY.concessionTo!)} you pay the home concession rate: ${DUTY_800K}.`,
  },
  {
    question: "How much deposit do I need for a $700,000 house in Queensland?",
    answer:
      `You need $140,000 (20%) to avoid lenders mortgage insurance without a scheme. At 5% it is $35,000, and through the 5% Deposit Scheme an eligible buyer pays no LMI where the price is within the area's cap, ${fmtCap(HG_PRICE_CAPS.QLD.capital)} in Greater Brisbane (Housing Australia, read ${longDate(HG_CHECKED_ON)}). Buying costs are extra, though a first home buyer pays no transfer duty at that price.`,
  },
  {
    question: "When is the FHOG paid?",
    answer:
      "For purchases (e.g. off-the-plan), it's paid at settlement through your lender. For construction contracts, it's paid when the first progress payment is requested by the builder. Apply through the Queensland Revenue Office or via your lender; most lenders process the FHOG application alongside your loan.",
  },
  {
    question: "What does the REIQ contract include that other states' contracts don't?",
    answer:
      "Queensland's standard REIQ contract typically has conditions for building and pest inspection, finance, and sometimes FIRB built in upfront. You negotiate these conditions before signing, rather than relying on a cooling-off period to back out. This means due diligence often happens before contract signing in QLD.",
  },
  {
    question: "What's the cooling-off period in Queensland?",
    answer:
      "5 business days from the buyer's receipt of the contract (residential, not auction). If you back out during cooling-off, you forfeit 0.25% of the price. Auctions have no cooling-off period.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "First Home Buyer Guide (national)", href: "/guides/first-home-buyer-guide", description: "Federal schemes, FHOG by state, stamp duty concessions and step-by-step process." },
  { title: "Stamp Duty QLD",         href: "/guides/stamp-duty-qld",          description: "Queensland transfer duty, the 2024 first home concession and worked examples." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",          description: "Estimate your QLD transfer duty in seconds." },
  { title: "Building & Pest Inspection",        href: "/guides/building-pest-inspection",description: "What to expect from QLD's contract conditions on inspections." },
  { title: "Conveyancing in Australia",         href: "/guides/conveyancing-guide",      description: "What conveyancers do, what they cost, and what to ask." },
  { title: "Lenders Mortgage Insurance",        href: "/guides/lenders-mortgage-insurance-guide", description: "What LMI costs and the schemes that waive it." },
];

export default function FirstHomeBuyerQLDPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="success" title={`The grant is ${GRANT_AMOUNT}, with no end date published`}>
        <p>
          The{" "}
          <a href={GRANT.source.href} target="_blank" rel="noopener noreferrer">
            Queensland Revenue Office
          </a>{" "}
          lists <strong>{GRANT_AMOUNT}</strong> for eligible contracts signed on or after 20 November
          2023 and publishes no end date (read {longDate(GRANT.checkedOn)}). Verify your own
          eligibility with QRO or a licensed conveyancer before signing.
        </p>
      </Callout>

      <EditorNote>
        <p>
          On a new build in Queensland the {GRANT_AMOUNT} grant stacks with
          zero transfer duty: on a $700,000 new home that is{" "}
          {money(GRANT.amount! + DUTY_700K)} between them, which is why new homes
          deserve a serious look even if you started out shopping established. The trap I see most:
          buyers assume the QLD contract works like NSW with a
          cooling-off they&rsquo;ll lean on. The REIQ contract is built
          around subject-to clauses instead. Negotiate the conditions
          in, don&rsquo;t plan to wriggle out later.
        </p>
      </EditorNote>

      <h2 id="fhog-qld">First Home Owner Grant QLD</h2>
      <p className="lead">
        Queensland pays a {GRANT_AMOUNT} first home owner grant to eligible first home
        buyers buying or building a new home.
      </p>

      <FirstHomeGrantFacts state="QLD" />

      <h3>Eligibility requirements</h3>
      <ul>
        <li>At least one applicant must be an Australian citizen or permanent resident</li>
        <li>All applicants must be 18 years or older</li>
        <li>Neither you nor your spouse can have owned residential property in Australia before 1 July 2000, or one you lived in since</li>
        <li>You must move in within 1 year of the completed transaction and live there continuously for 6 months (Queensland Revenue Office)</li>
      </ul>

      <h3>Eligible properties</h3>
      <ul>
        <li>New homes (not previously occupied or sold as residential property) valued under {GRANT_CAP}, land and any contract variations included</li>
        <li>Owner-built new homes and building contracts under the same {GRANT_CAP} cap</li>
        <li>Established properties do <strong>not</strong> qualify for the FHOG in QLD</li>
      </ul>

      <h3>When is the grant paid?</h3>
      <p>
        For purchases (e.g. off-the-plan), the grant is paid at settlement. For
        construction contracts, it&rsquo;s paid when the first progress payment is
        requested by the builder. Apply through the Queensland Revenue Office or
        via your lender; most lenders process the FHOG alongside your loan.
      </p>

      <h2 id="stamp-duty-qld">Stamp duty (transfer duty) concession in QLD</h2>
      <p>
        Queensland&rsquo;s first home buyer duty relief is now among the most generous
        in the country, and it runs on two tracks depending on what you buy.
      </p>

      <FirstHomeDutyFacts state="QLD" />

      <p>
        See our full <Link href="/guides/stamp-duty-qld">Queensland stamp duty
        guide</Link> for worked examples, and use the{" "}
        <Link href="/stamp-duty-calculator">Stamp Duty Calculator</Link> for
        precise figures on your price.
      </p>

      <h3>Home Concession (not exclusive to first home buyers)</h3>
      <p>
        Queensland also applies a standard Home Concession for all owner-occupiers,
        not just first home buyers, so even buyers over the first-home thresholds
        pay less than the general rate on a home they&rsquo;ll live in.
      </p>

      <h2 id="federal-schemes">Federal schemes available in QLD</h2>
      <ul>
        <HomeGuaranteeNote state="QLD" />
        <HelpToBuyNote state="QLD" />
        <FhssNote />
      </ul>
      <p>
        See our{" "}
        <Link href="/guides/first-home-buyer-guide">national First Home Buyer Guide</Link>{" "}
        for full federal scheme detail and how the schemes stack with Queensland&rsquo;s
        grant and duty relief.
      </p>

      <h2 id="qld-specific">QLD-specific schemes and resources</h2>
      <ul>
        <li>
          <strong>Queensland Housing Finance Loan:</strong> For low-to-moderate
          income earners who can&rsquo;t access a loan from a traditional lender.
          Administered by Homes and Housing QLD. Check eligibility at qld.gov.au/housing.
        </li>
        <li>
          <strong>{BOOST.name} (state shared equity):</strong> {BOOST.terms}. Status:{" "}
          {BOOST.statusNote} (
          <a href={BOOST.source.href} target="_blank" rel="noopener noreferrer">{BOOST.source.label}</a>
          , read 7 October 2026). It cannot be combined with the federal Help to Buy scheme.
        </li>
        <li>
          <strong>First home vacant land concession:</strong> for buyers of vacant land to build
          their first home, no transfer duty at any value for transactions from 1 May 2025
          (Queensland Revenue Office).
        </li>
      </ul>

      <p>
        To compare prices before you set a budget, search any Queensland suburb in our{" "}
        <Link href="/suburbs">suburb profiles</Link>; each one shows its median only where the
        sales data behind it passes our checks.
      </p>

      <h2 id="buying-process">The QLD buying process</h2>
      <p>QLD has some distinct features versus other states:</p>
      <ul>
        <li><strong>REIQ contract:</strong> QLD uses the Real Estate Institute of Queensland standard contract of sale, with standard conditions for building and pest inspection, finance, and sometimes FIRB.</li>
        <li><strong>Conditions are built in:</strong> Unlike NSW, building inspections and finance conditions are typically negotiated into the contract before it&rsquo;s signed, rather than relying on a cooling-off window.</li>
        <li><strong>Cooling-off period:</strong> 5 business days from the buyer&rsquo;s receipt of the contract (residential, not auction).</li>
        <li><strong>Auctions:</strong> Less common than Sydney/Melbourne. Private treaty (conditional contract) dominates in QLD.</li>
        <li><strong>Settlement:</strong> Typically 30 to 60 days; via PEXA.</li>
      </ul>
      <p>
        For the full step-by-step process, see{" "}
        <Link href="/guides/buying-property-australia">Buying Property in Australia</Link>.
      </p>

      <h2 id="contacts">Key QLD contacts</h2>
      <ul>
        <li>
          <strong>Queensland Revenue Office</strong>, FHOG, transfer duty, concessions:{" "}
          <a href={GRANT.source.href} target="_blank" rel="noopener noreferrer">
            qro.qld.gov.au
          </a>
        </li>
        <li>
          <strong>Homes and Housing QLD</strong>, Queensland Housing Finance Loan and housing assistance:{" "}
          <a href="https://www.qld.gov.au/housing" target="_blank" rel="noopener noreferrer">
            qld.gov.au/housing
          </a>
        </li>
        <li>
          <strong>Housing Australia</strong>, First Home Guarantee and federal schemes:{" "}
          <a href="https://www.housingaustralia.gov.au" target="_blank" rel="noopener noreferrer">
            housingaustralia.gov.au
          </a>
        </li>
      </ul>

      <Sources items={[...firstHomeSources(["QLD"]), { label: BOOST.source.label, href: BOOST.source.href, note: "read 7 October 2026" }]} />
    </GuideArticleLayout>
  );
}
