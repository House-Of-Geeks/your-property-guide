import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Renter's Rights in Tasmania: Complete Guide for Tenants (2026)",
  description:
    "Tasmania tenant rights: bond rules, rent increases (12-month minimum, 42 days notice), inspections, repairs, ending a tenancy, and CBOS / Magistrates Court dispute resolution.",
  slug: "renters-rights-tas",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
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
  "Maximum bond is 4 weeks rent. Lodged with the Rental Deposit Authority (RDA), administered by CBOS.",
  "Rent can only be increased once every 12 months with at least 42 days written notice.",
  "Routine inspections capped at 4 per year, with 24 hours written notice required.",
  "Urgent repairs (burst pipes, gas leaks, dangerous electrical, blocked sole toilet) must be addressed within 24 hours.",
  "Periodic tenancy notice: 14 days from tenant, 42 days from landlord (no grounds). With grounds (breach), 14 days from either side.",
  "No dedicated tenancy tribunal. Disputes go through CBOS first, then the Magistrates Court of Tasmania for unresolved matters.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "Residential Tenancy Act 1997 (Tas)" },
  { id: "lease-types",    label: "Lease types" },
  { id: "bond",           label: "Bond rules and the RDA" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "inspections",    label: "Routine inspections" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "disputes",       label: "Resolving disputes" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "How often can my rent be increased in Tasmania?",
    answer:
      "Once every 12 months. The landlord must give at least 42 days written notice before the increase takes effect. There's no cap on the amount of an increase, only the frequency and notice required.",
  },
  {
    question: "Can my landlord evict me without a reason in Tasmania?",
    answer:
      "On a periodic tenancy, yes, with 42 days written notice. Tasmania still permits no-grounds notices to vacate. If you suspect retaliatory eviction (e.g. after a repair request), seek advice from the Tenants' Union of Tasmania or CBOS.",
  },
  {
    question: "What's the bond rule in Tasmania?",
    answer:
      "Maximum 4 weeks rent. The landlord must lodge it with the Rental Deposit Authority (RDA), administered by CBOS. Always complete and sign the property condition report on day one and take dated photos, that's your strongest evidence in any bond dispute.",
  },
  {
    question: "How fast do urgent repairs have to be done?",
    answer:
      "As soon as possible, effectively within 24 hours. Urgent repairs include burst water pipe, gas leak, dangerous electrical fault, blocked or broken sole toilet, serious roof or structural damage, and failure of essential services (hot water, heating). Notify the landlord in writing and document all attempts to contact them.",
  },
  {
    question: "Does Tasmania have a tenancy tribunal?",
    answer:
      "No dedicated tenancy tribunal. Disputes go through CBOS first (free information and informal dispute resolution), then the Magistrates Court of Tasmania for unresolved matters. The court has a residential tenancy division for these cases.",
  },
  {
    question: "I'm escaping family violence, can I break my lease?",
    answer:
      "Yes. Tasmania has provisions allowing tenants experiencing family violence to end a tenancy with appropriate notice and supporting documentation, without incurring break fees. Contact the Tenants' Union for support, and call 1800RESPECT (1800 737 732) if you need help. In immediate danger, call 000.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",      href: "/guides/renters-rights-nsw", description: "NSW also still permits no-grounds evictions." },
  { title: "Renter's Rights in Victoria", href: "/guides/renters-rights-vic", description: "VIC's 2021 reforms abolished no-grounds evictions." },
  { title: "Renter's Rights in Queensland", href: "/guides/renters-rights-qld", description: "QLD's 2024 reforms toward grounds-based evictions." },
  { title: "Renter's Rights in WA",       href: "/guides/renters-rights-wa",  description: "WA's Residential Tenancies Act and entry rules." },
  { title: "First Home Buyer Guide TAS",  href: "/guides/first-home-buyer-tas", description: "Tasmania's $30K FHOG and 50% stamp duty concession." },
];

export default function RentersRightsTasPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Verify
          current rules with{" "}
          <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer">
            Consumer, Building and Occupational Services
          </a>{" "}
          or the{" "}
          <a href="https://www.tutas.org.au" target="_blank" rel="noopener noreferrer">
            Tenants' Union of Tasmania
          </a>{" "}
          before taking action.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancy Act 1997 (Tasmania)</h2>
      <p className="lead">
        Tasmania's residential tenancy laws are governed by the Residential
        Tenancy Act 1997. It establishes the rights and obligations of
        landlords and tenants, from rental agreement through bond refunds and
        dispute resolution.
      </p>
      <p>
        The Act is administered by Consumer, Building and Occupational Services
        (CBOS), a division of the Department of Justice. CBOS provides
        information, assistance, and dispute resolution support.
      </p>
      <p>
        Applies to most residential tenancies, including houses, units,
        apartments, and rooms in share houses. Social housing and holiday
        lettings have separate rules.
      </p>

      <h2 id="lease-types">Lease types</h2>
      <ul>
        <li>
          <strong>Fixed term:</strong> Defined start and end dates, typically 6
          or 12 months. Landlord can't end without grounds during the term;
          tenant generally can't vacate without a break fee unless an exemption
          applies (e.g. family violence).
        </li>
        <li>
          <strong>Periodic:</strong> Rolling tenancy with no defined end date.
          Fixed-term leases commonly become periodic when they expire if no new
          lease is signed. Either party can end it with the correct notice.
        </li>
      </ul>
      <p>
        Always have a written tenancy agreement. Verbal agreements are
        technically valid but a written agreement provides clarity and is
        essential evidence in any dispute.
      </p>

      <h2 id="bond">Bond rules and the Rental Deposit Authority</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks rent. A landlord can't legally request more.</li>
        <li><strong>Lodgement:</strong> The landlord must lodge the bond with the Rental Deposit Authority (RDA), under CBOS, within a specified timeframe. You should receive confirmation.</li>
        <li><strong>Condition report:</strong> Complete a detailed report at the start. Both parties should sign. This is your primary evidence in any bond dispute.</li>
        <li><strong>Refund:</strong> If the property is in the same condition as on move-in (allowing for fair wear and tear), the full bond must be returned. Disputes go to CBOS or the Magistrates Court.</li>
      </ul>
      <p>
        Take dated photos on move-in day. Photograph every room, all fixtures,
        and any existing damage, this protects you from unjustified bond
        deductions.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li><strong>Minimum period:</strong> At least <strong>12 months</strong> between any two rent increases.</li>
        <li><strong>Notice required:</strong> At least <strong>42 days written notice</strong> before the increase takes effect.</li>
        <li><strong>Fixed term:</strong> Rent can't be increased during the fixed term unless the increase amount or method is specified in the agreement.</li>
      </ul>
      <p>
        No rent caps in Tasmania. Landlords can increase by any amount, subject
        to the notice and frequency rules. If you believe an increase is
        unconscionable, seek assistance from CBOS or apply to the Magistrates
        Court.
      </p>
      <p>
        Always respond to a rent-increase notice in writing, even if you
        accept it, to maintain a clear paper trail.
      </p>

      <h2 id="inspections">Routine inspections</h2>
      <ul>
        <li><strong>Maximum frequency:</strong> 4 routine inspections per year</li>
        <li><strong>Notice required:</strong> 24 hours written notice</li>
        <li><strong>Reasonable time:</strong> Not excessively early or late in the day</li>
      </ul>
      <p>
        Entry without proper notice or more frequent inspections than permitted
        is a breach. Document each occurrence and raise it with CBOS.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>
        Landlords must maintain the rental in a reasonable state of repair.
        Repairs are categorised as urgent or non-urgent.
      </p>

      <h3>Urgent repairs</h3>
      <p>
        Involve essential services or unsafe conditions. Must be addressed as
        soon as possible (effectively within 24 hours). Examples:
      </p>
      <ul>
        <li>Burst water pipe or serious water leak</li>
        <li>Gas leak</li>
        <li>Dangerous electrical fault</li>
        <li>Blocked or broken toilet (sole toilet)</li>
        <li>Serious roof or structural damage</li>
        <li>Failure of essential services (hot water, heating)</li>
      </ul>
      <p>
        Notify the landlord or agent in writing (email or text) for urgent
        repairs, even if you also call. If they can't be reached or fail to
        act, document attempts and contact CBOS.
      </p>

      <h3>Non-urgent repairs</h3>
      <p>
        Put requests in writing. Landlord should respond within a reasonable
        time. If repairs aren't carried out, apply to the Magistrates Court for
        a repair order. Email is ideal because it timestamps your communication.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Periodic, no grounds</td><td>14 days</td><td>42 days</td></tr>
          <tr><td>Periodic, with grounds (breach)</td><td>14 days</td><td>14 days</td></tr>
          <tr><td>Fixed term, end of term</td><td>Check agreement terms</td><td>Check agreement terms</td></tr>
        </tbody>
      </table>
      <p>
        <strong>Breaking a fixed-term lease early</strong> may make you liable
        for rent until a new tenant is found, plus reasonable re-letting costs.
        Exemptions include family violence and the property becoming
        uninhabitable. Get advice from CBOS or the Tenants' Union before
        breaking a fixed-term lease.
      </p>
      <p>
        <strong>Family violence:</strong> Tasmania has provisions allowing
        tenants experiencing family violence to end a tenancy with appropriate
        notice and supporting documentation, without break fees. Contact the
        Tenants' Union for support.
      </p>

      <h2 id="disputes">Resolving disputes</h2>

      <h3>Consumer, Building and Occupational Services (CBOS)</h3>
      <p>First point of contact for most tenancy disputes. CBOS provides:</p>
      <ul>
        <li>Free information and advice about rights and obligations</li>
        <li>Assistance with informal dispute resolution</li>
        <li>Guidance on the formal dispute process</li>
      </ul>

      <h3>Magistrates Court</h3>
      <p>
        Bond disputes, repair orders, and eviction challenges go to the
        Magistrates Court of Tasmania, which has a residential tenancy division.
        Filing fees are modest, and applications can be made without a lawyer
        for straightforward matters. For complex disputes, get advice from the
        Tenants' Union or Legal Aid Tasmania.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Consumer, Building and Occupational Services (CBOS)</strong>, official tenancy regulator:{" "}
          <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer">cbos.tas.gov.au</a>
        </li>
        <li>
          <strong>Tenants' Union of Tasmania</strong>, free advice for tenants:{" "}
          <a href="https://www.tutas.org.au" target="_blank" rel="noopener noreferrer">tutas.org.au</a>
        </li>
        <li>
          <strong>Rental Deposit Authority (RDA)</strong>, bond lodgement and refunds, contact via CBOS:{" "}
          <a href="https://www.cbos.tas.gov.au" target="_blank" rel="noopener noreferrer">cbos.tas.gov.au</a>
        </li>
        <li>
          <strong>Legal Aid Commission of Tasmania</strong>, free legal advice:{" "}
          <a href="https://www.legalaid.tas.gov.au" target="_blank" rel="noopener noreferrer">legalaid.tas.gov.au</a>
        </li>
        <li>
          <strong>Magistrates Court Tasmania</strong>, tenancy disputes:{" "}
          <a href="https://www.magistratescourt.tas.gov.au" target="_blank" rel="noopener noreferrer">magistratescourt.tas.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
