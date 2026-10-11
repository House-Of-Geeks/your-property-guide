import type { Metadata } from "next";
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
import { VIC_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the Consumer Affairs Victoria pages in
// VIC_RENTERS_SOURCES, read 11 October 2026. Until this rewrite the guide
// missed the 2025 laws and gave an inspection rule that contradicted CAV
// (commercial-intent review, 10 Oct 2026, renting 0.3).
const FRONTMATTER: GuideFrontmatter = {
  title: "Tenant Rights in Victoria (2026): Renters' Rules Explained",
  h1: "Tenant and renter rights in Victoria (2026)",
  description:
    "Victorian renting rules as at October 2026: the 2025 ban on no-fault evictions, 90 days' notice, rent increases, bond, repairs, inspections, pets and RDRV.",
  slug: "renters-rights-vic",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 12,
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
  "Since 25 November 2025 a Victorian rental provider (landlord) can't give a notice to vacate without a valid reason, even at the end of a fixed term. A fixed term that ends without a new agreement becomes month-by-month.",
  "Most notices to vacate for a valid reason, such as a sale, renovation or the owner moving in, now need 90 days' notice (60 days before 25 November 2025).",
  "Rent can rise only once every 12 months, with 90 days' notice on the prescribed form. You can ask Consumer Affairs Victoria (CAV) for a free rent assessment within 30 days of the notice.",
  "A bond can't be more than one month's rent unless the rent is over $900 a week or VCAT sets a higher bond. There is no pet bond.",
  "General inspections: not in the first 3 months, at most once every 6 months, with 7 days' written notice, between 8am and 6pm and not on public holidays.",
  "Urgent repairs must be done immediately; if the rental provider doesn't respond, you can arrange one costing up to $2,500 and be repaid within 7 days. Non-urgent repairs are due within 14 days of a written request.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "The Residential Tenancies Act 1997" },
  { id: "what-changed",   label: "What changed in 2025 and 2026" },
  { id: "notice-to-vacate", label: "Notices to vacate: reasons and notice" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "bond",           label: "Bond" },
  { id: "entry-rights",   label: "Inspections and entry" },
  { id: "repairs",        label: "Repairs" },
  { id: "modifications",  label: "Changes to the property" },
  { id: "pets",           label: "Pets" },
  { id: "disputes",       label: "RDRV and VCAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "What are the recent changes to Victorian rental law?",
    answer:
      "From 25 November 2025 a rental provider can't give a notice to vacate without a valid reason, even at the end of a fixed term; the notice for a rent increase and for most notices to vacate rose from 60 to 90 days; all forms of rental bidding are banned; and properties must meet the minimum standards when advertised. A standard rental application form followed on 31 March 2026 (Consumer Affairs Victoria, updated 27 September 2026).",
  },
  {
    question: "Can my landlord end my tenancy without a reason in Victoria?",
    answer:
      "No. Since 25 November 2025 a rental provider must give a valid reason for any notice to vacate, including at the end of a fixed-term agreement, and some reasons need evidence such as a building permit or a statutory declaration; without it the notice is invalid. A fixed term that ends with no new agreement and no valid notice becomes month-by-month (Consumer Affairs Victoria).",
  },
  {
    question: "How much notice does a rental provider need to give in Victoria?",
    answer:
      "90 days for most valid reasons, including selling, renovating, demolishing, a change of use and the rental provider or their family moving in (60 days before 25 November 2025). Shorter notice applies where the renter is at fault: 14 days for rent at least 14 days overdue, and immediate notice for serious damage or danger to others (Consumer Affairs Victoria, updated 26 February 2026).",
  },
  {
    question: "How often can the rent go up in Victoria?",
    answer:
      "No more than once every 12 months in most agreements, and only with at least 90 days' notice on the prescribed Notice of proposed rent increase form; a notice on the wrong form is not valid. If you think the increase is too high, you can ask Consumer Affairs Victoria for a free rent assessment within 30 days of the notice, and then go to Rental Dispute Resolution Victoria (Consumer Affairs Victoria, 2026).",
  },
  {
    question: "How often can a landlord inspect a rental in Victoria?",
    answer:
      "A general inspection can happen only after the first 3 months of the agreement and at most once every 6 months, with at least 7 days' written notice stating the reason. Entry is allowed only between 8am and 6pm and not on public holidays unless you agree (Consumer Affairs Victoria, When a rental provider can enter a property, updated 23 April 2025).",
  },
  {
    question: "Can my landlord refuse a pet in Victoria?",
    answer:
      "Only through VCAT. The rental provider has 14 days from receiving your request to agree in writing or apply to VCAT to refuse it; if they don't respond within 14 days you can keep the pet. You can't keep the pet while VCAT decides, and a rental provider can't ask for a pet bond (Consumer Affairs Victoria, Pets).",
  },
  {
    question: "How big a bond can a landlord ask for in Victoria?",
    answer:
      "In most cases no more than one month's rent. A higher bond is allowed only when the weekly rent is more than $900 or VCAT has set a higher bond for the property. If you pay the rental provider, they must lodge the bond with the Residential Tenancies Bond Authority within 14 days, not counting public holidays (Consumer Affairs Victoria, updated 27 September 2026).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["NSW", "QLD", "WA", "SA"]),
  { title: "First Home Buyer Guide VIC", href: "/guides/first-home-buyer-vic", description: "When you're ready to stop renting and buy your first home." },
];

const S = VIC_RENTERS_SOURCES;

export default function RentersRightsVICPage() {
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
          Earlier versions of this guide (reviewed April 2026) said
          no-grounds evictions had been abolished in March 2021, gave 60
          days&apos; notice for rent increases and notices to vacate, said
          inspections were limited to four a year, and gave a bond rule of two
          months&apos; rent above $900 a week. Consumer Affairs Victoria dates
          the ban on notices to vacate without a valid reason, including at
          the end of a fixed term, and the move to 90 days&apos; notice, to 25
          November 2025. We have rewritten the guide from the CAV pages listed
          at the end.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Check the
          current rules with{" "}
          <a href="https://www.consumer.vic.gov.au/housing/renting" target="_blank" rel="noopener noreferrer">
            Consumer Affairs Victoria
          </a>{" "}
          before you act.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancies Act 1997</h2>
      <p className="lead">
        Since 25 November 2025 a Victorian rental provider needs a valid
        reason for any notice to vacate, even at the end of a fixed term, and
        must give 90 days&apos; notice of a rent increase (Consumer Affairs
        Victoria). Renting in Victoria is governed by the Residential
        Tenancies Act 1997, which calls tenants &ldquo;renters&rdquo; and
        landlords &ldquo;rental providers&rdquo;.
      </p>
      <p>
        Consumer Affairs Victoria (CAV) explains and enforces the rules,
        the Residential Tenancies Bond Authority (RTBA) holds bonds, Rental
        Dispute Resolution Victoria (RDRV) is the free first stop for most
        disputes, and the Victorian Civil and Administrative Tribunal (VCAT)
        decides those RDRV can&apos;t resolve.
      </p>

      <h2 id="what-changed">What changed in 2025 and 2026</h2>
      <p>By start date (Consumer Affairs Victoria, updated 27 September 2026):</p>
      <ul>
        <li><strong>25 November 2025:</strong> ban on no-fault evictions: no notice to vacate without a valid reason, even at the end of a fixed term. Notice for a rent increase and for certain notices to vacate rose to 90 days. All forms of rental bidding banned, including accepting an offer above the advertised rent or more than one month&apos;s rent in advance. Properties must meet the minimum standards when advertised. Annual smoke alarm checks for all rental agreements, and new rules protecting renters&apos; personal information.</li>
        <li><strong>1 December 2025:</strong> internal window coverings must have secured cords.</li>
        <li><strong>31 March 2026:</strong> a prescribed rental application form; limits on what applicants can be asked; third-party businesses barred from charging renters fees for applications or rent payments; more factors considered when deciding whether a rent increase is excessive.</li>
        <li><strong>1 July 2026:</strong> eligible renters can move their bond to a new rental under the Portable Rental Bond Scheme.</li>
        <li><strong>9 September 2026:</strong> renters can pay the bond directly to the RTBA.</li>
      </ul>
      <p>Coming next:</p>
      <ul>
        <li><strong>From 13 October 2026:</strong> rental providers must tell you in advance, with evidence, if they will claim on the bond; gas and electrical safety checks every 2 years; records showing the property met the minimum standards; no fees for making a rental application.</li>
        <li><strong>Phased in from 1 March 2027:</strong> minimum energy efficiency standards for heating, cooling, hot water, showerheads, ceiling insulation and draughtproofing.</li>
      </ul>

      <h2 id="notice-to-vacate">Notices to vacate: reasons and notice</h2>
      <p>
        A rental provider can give a notice to vacate only for a reason the
        law lists, and some reasons need evidence with the notice. On a fixed
        term, the termination date must be on or after the end date of the
        agreement; on a month-by-month agreement the notice can be given at
        any time, for a valid reason. A notice can&apos;t be given because you
        asked for repairs or a pet, or challenged a rent increase.
      </p>
      <table>
        <thead>
          <tr><th>Reason</th><th>Evidence needed</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Sale, or putting the property up for sale with vacant possession</td><td>Contract of sale, agent&apos;s authority to sell, or a contract prepared by a conveyancer or lawyer</td><td>90 days</td></tr>
          <tr><td>The rental provider, their immediate family or a dependant moving in</td><td>Statutory declaration</td><td>90 days</td></tr>
          <tr><td>Repairs, renovation or reconstruction that need the property empty</td><td>Building permit</td><td>90 days</td></tr>
          <tr><td>Demolition</td><td>Building permit for demolition and a builder-demolisher&apos;s contract</td><td>90 days</td></tr>
          <tr><td>Use for another purpose, such as a business</td><td>Statutory declaration and business details</td><td>90 days</td></tr>
          <tr><td>Rent at least 14 days overdue, and other renter breaches on CAV&apos;s list</td><td>n/a</td><td>14 days</td></tr>
          <tr><td>Serious damage, or putting others in danger</td><td>n/a</td><td>Immediate</td></tr>
        </tbody>
      </table>
      <p>
        After a notice to vacate for a sale, demolition or the rental provider
        or family moving in, the property can&apos;t be re-let as a home for 6
        months from the notice unless VCAT approves. If you don&apos;t leave,
        the rental provider can apply to VCAT for a possession order; you can
        challenge a notice that wasn&apos;t given properly or whose reason you
        dispute.
      </p>
      <p>
        <strong>Your notice:</strong> to leave at the end of an agreement you
        must give 28 days&apos; notice. Some reasons let you leave early
        without breaking the agreement, on 14 days&apos; notice: for example
        if you are given a notice of intention to sell and the sale
        wasn&apos;t disclosed before you signed. People experiencing family
        violence can apply to VCAT to change or end the agreement.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li>In most agreements the rent can&apos;t go up more than once every <strong>12 months</strong>, even if the agreement says otherwise. On a long-term agreement it can rise only if the agreement allows it.</li>
        <li>The rental provider must give at least <strong>90 days&apos; notice</strong> (60 days before 25 November 2025), on the prescribed Notice of proposed rent increase form. A notice on the wrong form is not valid.</li>
      </ul>
      <KeyFigure
        value="12 months / 90 days"
        label="Minimum gap between rent increases, and minimum notice of one, in Victoria."
        context="Consumer Affairs Victoria, Rent increases, updated 26 February 2026"
      />
      <p>
        If you think an increase is too high, ask CAV for a free rent
        assessment <strong>within 30 days</strong> of the notice; you
        can&apos;t be forced to leave for asking. CAV looks at comparable
        rents, the size of the increase against the current rent and Melbourne
        CPI, increases in the past 24 months and the condition of the
        property. If the report finds the increase too high and the rental
        provider won&apos;t lower it, apply to RDRV within 30 days of the
        report; VCAT can set a maximum rent, usually for 12 months.
      </p>

      <h2 id="bond">Bond</h2>
      <ul>
        <li><strong>Maximum:</strong> in most cases one month&apos;s rent. A higher bond is allowed only if the weekly rent is more than $900 or VCAT has set a higher bond for the property.</li>
        <li><strong>No pet bond:</strong> a rental provider can&apos;t ask for an extra bond for a pet.</li>
        <li><strong>Lodging:</strong> the RTBA holds every bond. If you pay the rental provider, they must lodge it within 14 days, not counting public holidays; since 9 September 2026 you can pay the RTBA directly if you tell the rental provider in writing first. The RTBA sends a receipt within 7 days.</li>
        <li><strong>Moving:</strong> since 1 July 2026 eligible renters can transfer their bond to a new rental under the Portable Rental Bond Scheme.</li>
      </ul>

      <h2 id="entry-rights">Inspections and entry</h2>
      <table>
        <thead>
          <tr><th>Reason for entry</th><th>Minimum written notice</th></tr>
        </thead>
        <tbody>
          <tr><td>General (routine) inspection: not in the first 3 months, at most once every 6 months</td><td>7 days</td></tr>
          <tr><td>Repairs or other legal duties</td><td>24 hours</td></tr>
          <tr><td>Showing the property to renters, buyers or lenders</td><td>48 hours</td></tr>
          <tr><td>A valuation, or photos or video for advertising</td><td>7 days</td></tr>
        </tbody>
      </table>
      <p>
        Entry is allowed only between 8am and 6pm and not on a public holiday,
        unless you agree no more than 7 days before. Prospective renters can be
        shown through only in the last 21 days of the agreement. For each sales
        inspection the rental provider must compensate you half a day&apos;s
        rent or $30, whichever is more.
      </p>

      <h2 id="repairs">Repairs</h2>
      <p>
        Urgent repairs, the list the law defines (such as a burst water
        service, a gas leak or a dangerous electrical fault), must be done
        immediately. Ask the rental provider or agent straight away. If they
        don&apos;t respond, you can arrange and pay for an urgent repair
        costing <strong>$2,500 or less</strong>; give them written notice with
        the receipts within 7 days and they have 7 days to repay you. For
        repairs over $2,500, or if you aren&apos;t repaid, apply to RDRV.
      </p>
      <p>
        Non-urgent repairs must be done within <strong>14 days</strong> of your
        written request. If they aren&apos;t, you can ask CAV for a repairs
        inspection or apply to VCAT.
      </p>

      <h2 id="modifications">Changes to the property</h2>
      <p>
        You can make some changes without permission, including curtains,
        removable window film, a wireless doorbell, adhesive child safety
        locks and, unless the property is heritage-listed, picture hooks and
        furniture anchors on surfaces other than exposed brick or concrete.
        For other changes you need the rental provider&apos;s permission, and
        for some, such as flyscreens, a vegetable garden or painting, they
        can refuse only with a good reason (CAV, updated 7 December 2025).
      </p>

      <h2 id="pets">Pets</h2>
      <ul>
        <li>Ask the rental provider in writing. They have <strong>14 days</strong> from the day after they receive the request to agree in writing or apply to VCAT to refuse.</li>
        <li>If they don&apos;t respond within 14 days, you can keep the pet. You can&apos;t keep it while VCAT is deciding.</li>
        <li>There is no pet bond. If VCAT orders the pet excluded and you don&apos;t comply within 14 days, the rental provider can give 28 days&apos; notice to vacate.</li>
      </ul>

      <h2 id="disputes">RDRV and VCAT</h2>
      <p>
        Rental Dispute Resolution Victoria is a free service for renters,
        rental providers and agents that helps resolve most renting disputes,
        including rent increases, repairs and bonds. If RDRV can&apos;t resolve
        it, it helps you apply to VCAT. Keep letters, emails, photos and
        receipts as evidence.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Consumer Affairs Victoria</strong>, renting:{" "}
          <a href="https://www.consumer.vic.gov.au/housing/renting" target="_blank" rel="noopener noreferrer">consumer.vic.gov.au/housing/renting</a>
        </li>
        <li>
          <strong>Residential Tenancies Bond Authority</strong>:{" "}
          <a href="https://rtba.vic.gov.au" target="_blank" rel="noopener noreferrer">rtba.vic.gov.au</a>
        </li>
        <li>
          <strong>VCAT</strong>:{" "}
          <a href="https://www.vcat.vic.gov.au" target="_blank" rel="noopener noreferrer">vcat.vic.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the Consumer Affairs Victoria pages above, which cite the Residential Tenancies Act 1997 as amended. Each page's own last-updated date is given.",
        ]}
      />
    </GuideArticleLayout>
  );
}
