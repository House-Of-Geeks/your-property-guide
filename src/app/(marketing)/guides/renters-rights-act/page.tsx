import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { ACT_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the ACT Government pages in ACT_RENTERS_SOURCES,
// read 11 October 2026 (commercial-intent review, 10 Oct 2026, renting 0.4
// and page 9).
const FRONTMATTER: GuideFrontmatter = {
  title: "Renters' Rights in the ACT (2026): Current Rules",
  h1: "Renters' rights in the ACT (2026)",
  description:
    "ACT renting rules as at October 2026: the grounds a landlord needs to end a lease, notice periods, rent increases, bond, inspections, repairs, pets and ACAT.",
  slug: "renters-rights-act",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 10,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
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
  "An ACT landlord can't end a tenancy for no reason: they need a legal ground. The end of a fixed term isn't one; the tenancy simply becomes periodic.",
  "On a periodic tenancy a landlord can give notice to sell (8 weeks), to move in themselves or for someone close to them (8 weeks), for major repairs or renovation (12 weeks) or for another lawful use (26 weeks), with proof.",
  "Rent can rise only once every 12 months, even across a new consecutive agreement, and the size of an increase is tied to the Consumer Price Index.",
  "The bond can't be more than 4 weeks' rent, and no extra bond can be asked for, including for a pet. It is lodged with the ACT Revenue Office.",
  "Inspections: in the first and last month of the tenancy and twice in each 12 months, with at least one week's written notice. No entry on Sundays, public holidays or outside 8am to 6pm without your agreement.",
  "A landlord who wants to refuse a pet, or one of the 'special modifications' such as picture hooks or safety devices, needs approval from the ACT Civil and Administrative Tribunal (ACAT).",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "The Residential Tenancies Act 1997" },
  { id: "ending-tenancy", label: "Ending a tenancy: grounds and notice" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "bond",           label: "Bond" },
  { id: "inspections",    label: "Inspections and entry" },
  { id: "repairs",        label: "Repairs" },
  { id: "modifications",  label: "Modifications" },
  { id: "pets",           label: "Pets" },
  { id: "family-violence",label: "Domestic and family violence" },
  { id: "disputes",       label: "Resolving disputes via ACAT" },
  { id: "landlords",      label: "Renting out in the ACT?" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord end my tenancy without a reason in the ACT?",
    answer:
      "No. An ACT landlord needs a legal ground to end a tenancy, and the end of a fixed term isn't one: the tenancy continues as a periodic one, and the landlord can't force you to sign a new fixed-term lease. Grounds include a breach you don't remedy and, on a periodic tenancy, a sale, the landlord or someone close to them moving in, major renovations or another lawful use (ACT Government, updated 8 October 2025).",
  },
  {
    question: "How much notice must an ACT landlord give to end a periodic tenancy?",
    answer:
      "8 weeks to sell the property or for the landlord or someone close to them to move in, 12 weeks for major repairs or renovations the tenant can't stay through, and 26 weeks to use the property for another lawful purpose such as a business, each with proof. For unpaid rent the landlord gives a notice to remedy and, if it isn't paid in 7 days, at least 2 weeks' notice to vacate (ACT Government, 2025 and 2026).",
  },
  {
    question: "How often can rent go up in the ACT?",
    answer:
      "Only once every 12 months, and that applies even if you sign a new, consecutive tenancy agreement. How much the rent can rise is worked out from the Consumer Price Index; the ACT Government's Renting Book sets out the calculation while its online rent increase calculator is being updated (ACT Government, During a tenancy, updated 30 January 2026).",
  },
  {
    question: "How often can a landlord inspect in the ACT?",
    answer:
      "During the first month and the final month of the tenancy, and twice in each 12 months from the start, with at least one week's written notice for a standard inspection. A landlord can't enter on Sundays, public holidays, before 8am or after 6pm unless you agree or the entry is for urgent repairs (ACT Government, updated 30 January 2026).",
  },
  {
    question: "Can my landlord refuse a pet in the ACT?",
    answer:
      "Only with approval from the ACT Civil and Administrative Tribunal. A tenancy agreement can't ban pets outright, and a landlord can't ask for extra bond or more inspections because you have a pet, though they can set reasonable conditions. In a unit plan you may also need the owners corporation's approval (ACT Government, Before renting, updated 8 September 2026).",
  },
  {
    question: "How does the bond work in the ACT?",
    answer:
      "The bond can't be more than 4 weeks' rent, and a landlord can't ask for extra bond money for any reason. It must be lodged with the ACT Revenue Office. At the end, if the landlord claims part of it, they must give written reasons and a cost estimate; if you disagree, the dispute is referred to ACAT (ACT Government, 2026).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["NSW", "VIC", "QLD", "WA"]),
  { title: "First Home Buyer Guide ACT", href: "/guides/first-home-buyer-act", description: "When you're ready to stop renting and buy your first home." },
];

const S = ACT_RENTERS_SOURCES;

export default function RentersRightsACTPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
      sourced
    >
      <Callout variant="info" title="Correction, 11 October 2026">
        <p>
          Earlier versions of this guide (reviewed April 2026) said no-grounds
          evictions were &ldquo;largely&rdquo; abolished, that rent increases
          need 8 weeks&apos; notice, that inspections need 2 weeks&apos; notice
          up to four a year, that bonds are lodged within 14 days, and listed
          minimum standards the ACT Government&apos;s pages don&apos;t. We have
          rewritten the guide from the ACT Government pages listed at the end
          and left out what they don&apos;t state.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Check the
          current rules in the ACT Government&apos;s{" "}
          <a href="https://www.act.gov.au/housing-planning-and-property/renting/rental-laws-in-the-act" target="_blank" rel="noopener noreferrer">
            rental laws pages and Renting Book
          </a>{" "}
          or with the Legal Aid ACT Tenancy Advice Service before you act.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancies Act 1997</h2>
      <p className="lead">
        Renting in the ACT is governed by the Residential Tenancies Act 1997.
        An ACT landlord can&apos;t end a tenancy for no reason, and when a
        fixed term ends the tenancy simply becomes periodic. Landlords must
        give tenants the Renting Book (or tell them where to find it) before a
        tenancy starts, the ACT Revenue Office holds bonds, and the ACT Civil
        and Administrative Tribunal (ACAT) decides disputes.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy: grounds and notice</h2>
      <p>
        A landlord needs a legal ground, and can&apos;t end a tenancy because
        you won&apos;t agree to a rent increase. A fixed term can be ended
        early only for a breach, an ACAT order (for example for the
        landlord&apos;s hardship) or a posting clause in the agreement. These
        grounds are only for periodic tenancies, each with proof:
      </p>
      <table>
        <thead>
          <tr><th>Landlord&apos;s ground (periodic tenancy)</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Selling the property</td><td>8 weeks</td></tr>
          <tr><td>The landlord, or someone close to them such as immediate family, moving in</td><td>8 weeks</td></tr>
          <tr><td>Major repairs, renovation or rebuilding that you can&apos;t stay through</td><td>12 weeks</td></tr>
          <tr><td>Another lawful use, such as a business</td><td>26 weeks</td></tr>
        </tbody>
      </table>
      <p>
        For unpaid rent outstanding at least a week, the landlord gives a
        notice to remedy; if you don&apos;t pay within 7 days they can give at
        least 2 weeks&apos; notice to vacate. Damage gets 2 weeks to repair,
        then 2 weeks&apos; notice. A tenancy doesn&apos;t end on the date in a
        notice to vacate unless you leave: otherwise the landlord must apply to
        ACAT. If a fixed-term property is sold, the lease continues until the
        fixed term ends.
      </p>
      <p>
        <strong>Your notice:</strong> at least 3 weeks&apos; written notice of
        your intention to vacate, at the end of a fixed term or on a periodic
        tenancy. You can end a fixed term early without compensation in some
        cases, including the landlord&apos;s breach, significant hardship,
        moving into aged care or social housing, and domestic or family
        violence.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <p>
        A landlord can increase the rent only once every <strong>12
        months</strong>, even if you sign a new, consecutive agreement. How
        much it can rise is worked out from the Consumer Price Index: the
        ACT Government&apos;s Renting Book sets out the calculation while its
        online rent increase calculator is being updated.
      </p>
      <KeyFigure
        value="12 months"
        label="Minimum gap between rent increases in the ACT, including across consecutive agreements."
        context="ACT Government, During a tenancy, updated 30 January 2026"
      />
      <p>
        Rent in advance is capped at 2 weeks, and landlords and agents must not
        ask for or invite offers above the advertised rent.
      </p>

      <h2 id="bond">Bond</h2>
      <ul>
        <li><strong>Maximum:</strong> 4 weeks&apos; rent. A landlord can&apos;t ask for extra bond money for any reason, including a pet.</li>
        <li><strong>Lodging:</strong> with the ACT Revenue Office; it is an offence for a landlord or agent to keep the bond and not lodge it.</li>
        <li><strong>Getting it back:</strong> either side can apply for the refund at the end. A landlord claiming part of it must give written reasons and a cost estimate; if you disagree, the dispute goes to ACAT.</li>
      </ul>
      <p>
        The condition report matters: the landlord must give you 2 copies
        within a day of moving in, and you have 2 weeks to comment and return
        a signed copy, or you are taken to agree with it.
      </p>

      <h2 id="inspections">Inspections and entry</h2>
      <ul>
        <li><strong>Standard inspections:</strong> in the first month, in the final month, and twice in each 12 months from the start, with at least one week&apos;s written notice.</li>
        <li><strong>Non-urgent repairs:</strong> one week&apos;s written notice; urgent repairs need reasonable notice.</li>
        <li><strong>Showing new tenants:</strong> in the last 3 weeks, with 24 hours&apos; notice.</li>
        <li><strong>Showing buyers:</strong> after telling you in writing of the sale, with 48 hours&apos; notice, and you don&apos;t have to agree to more than 2 inspections a week.</li>
        <li><strong>Times:</strong> not on Sundays, public holidays, before 8am or after 6pm, unless you agree or it is for urgent repairs.</li>
      </ul>

      <h2 id="repairs">Repairs</h2>
      <p>
        The landlord must complete <strong>urgent repairs</strong> as soon as
        practicable and <strong>non-urgent repairs within 4 weeks</strong>.
        Urgent repairs include a burst water service, a blocked or broken
        toilet, a serious roof leak, a gas leak, a dangerous electrical fault,
        flooding or serious storm or fire damage, a failure of the gas,
        electricity or water supply or of a supplied fridge or laundry
        appliance, a failure of hot water, cooking, heating or cooling, and
        any fault that makes the home unsafe or insecure. Rentals must also
        meet the minimum housing standard for ceiling insulation.
      </p>

      <h2 id="modifications">Modifications</h2>
      <p>
        Ask the landlord in writing. For &ldquo;special modifications&rdquo;
        (minor changes that can be undone, such as picture hooks or a
        vegetable garden, and safety, security, disability, energy efficiency
        and telecommunications changes) the landlord must apply to ACAT within
        14 days to refuse; if they don&apos;t respond or apply in that time,
        they are taken to consent. You usually pay for the change and undo it
        when you leave.
      </p>

      <h2 id="pets">Pets</h2>
      <p>
        You can generally have a pet. A landlord can require you to ask first
        and can set reasonable conditions, but needs ACAT&apos;s approval to
        refuse. A lease can&apos;t ban pets outright, and a landlord can&apos;t
        ask for extra bond or more inspections because of a pet. In a unit
        plan the owners corporation may need to approve too.
      </p>

      <h2 id="family-violence">Domestic and family violence</h2>
      <p>
        You can end your tenancy with a family violence termination notice
        giving your vacating date, which can be the same day, and one
        supporting document: a declaration by a competent person, a family
        violence order or a family law order. The landlord can&apos;t ask for
        more evidence, and must not tell co-tenants until after you have left.
        A protected person can change the locks without the landlord&apos;s
        consent. Call 000 if you are in danger.
      </p>

      <h2 id="disputes">Resolving disputes via ACAT</h2>
      <p>
        The ACT Civil and Administrative Tribunal resolves disputes between
        tenants and landlords and between co-tenants, including bond claims,
        terminations, pet refusals and modifications. Complaints about a real
        estate agent or strata manager go to Access Canberra. Legal Aid
        ACT&apos;s Tenancy Advice Service gives tenants free legal advice, and
        Canberra Community Law advises public and community housing tenants.
      </p>

      <h2 id="landlords">Renting out in the ACT?</h2>
      <p>
        If you own a Canberra rental, our guide to{" "}
        <Link href="/guides/property-management-fees-australia#fees-act">property management fees in the ACT</Link>{" "}
        sets out what managing agents charge, with dated sources.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>ACT Government, renting</strong> and the Renting Book:{" "}
          <a href="https://www.act.gov.au/housing-planning-and-property/renting" target="_blank" rel="noopener noreferrer">act.gov.au/renting</a>
        </li>
        <li>
          <strong>ACAT</strong>:{" "}
          <a href="https://www.acat.act.gov.au" target="_blank" rel="noopener noreferrer">acat.act.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the ACT Government pages above, which apply the Residential Tenancies Act 1997 as amended. Each page's own last-updated date is given.",
        ]}
      />
    </GuideArticleLayout>
  );
}
