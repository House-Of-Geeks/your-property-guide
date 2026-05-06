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
  title: "Renter's Rights in the Northern Territory: Complete Guide (2026)",
  description:
    "NT tenant rights: bond rules, rent increases (30 days notice), tropical-climate urgent repairs, remote community housing, and NTCAT dispute resolution.",
  slug: "renters-rights-nt",
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
  "Maximum bond is 4 weeks rent. Lodged with NT Consumer Affairs within 7 days of receipt.",
  "Rent increases on periodic tenancies require 30 days written notice. Unlike NSW, VIC, TAS, the NT does NOT have a 12-month minimum between increases.",
  "Air conditioning breakdown is an urgent repair in the NT, particularly during the wet season or extreme heat.",
  "Periodic tenancy notice: 14 days from tenant, 42 days from landlord (no grounds), 14 days from either side with grounds.",
  "Disputes go to the NT Civil and Administrative Tribunal (NTCAT), accessible without legal representation for most matters.",
  "Remote Aboriginal community housing operates under different frameworks. Contact NAAJA or CAALAS for specialist advice.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "Residential Tenancies Act 1999 (NT)" },
  { id: "lease-types",    label: "Lease types" },
  { id: "bond",           label: "Bond rules" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "inspections",    label: "Routine inspections" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "remote-housing", label: "Remote community housing" },
  { id: "disputes",       label: "Resolving disputes via NTCAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord raise my rent every month in the NT?",
    answer:
      "Theoretically yes, in a periodic tenancy. The NT requires 30 days written notice but doesn't impose a statutory 12-month minimum between increases (unlike NSW, VIC, and TAS). If you're facing frequent increases, you can negotiate, accept, or give 14 days notice to vacate. Contact NT Consumer Affairs if you suspect retaliation.",
  },
  {
    question: "Is air conditioning a 'right' in NT rentals?",
    answer:
      "Where AC is installed and provided as part of the property, breakdown is treated as an urgent repair, particularly during the wet season or extreme heat. Tropical conditions make AC essential for habitability in many properties. Always notify the landlord in writing of any AC failure.",
  },
  {
    question: "How does remote community housing differ?",
    answer:
      "Remote Aboriginal communities often have housing managed by the NT Housing Authority or under specific land tenure arrangements (Aboriginal freehold, statutory rights), not standard freehold or Crown Lease. Different rules and rent scales apply. Contact NAAJA (North Australian Aboriginal Justice Agency) or CAALAS for specialist legal advice in remote contexts.",
  },
  {
    question: "How much bond can be charged in the NT?",
    answer:
      "Maximum 4 weeks rent for most circumstances. Special cases like pet bonds may allow more. The bond must be lodged with NT Consumer Affairs within 7 days of the landlord receiving it, and you should get a receipt confirming lodgement.",
  },
  {
    question: "Can I break my fixed-term lease early?",
    answer:
      "Yes, but typically you'll be liable for rent until a new tenant is found, plus reasonable re-letting costs. Exemptions apply for family violence, loss of employment, or the property becoming uninhabitable. Get advice from NT Consumer Affairs before vacating early.",
  },
  {
    question: "What does NTCAT handle?",
    answer:
      "Bond disputes, rent increase challenges, repair orders, unlawful entry complaints, termination disputes, and compensation claims. Applications can be lodged online or in person. Fees are modest and the process is designed for self-representation. Try to resolve the dispute directly first; NTCAT will want to see evidence of attempts at informal resolution.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",      href: "/guides/renters-rights-nsw", description: "Compare NT to NSW where 12-month rent-increase minimum applies." },
  { title: "Renter's Rights in Victoria", href: "/guides/renters-rights-vic", description: "VIC's 2021 reforms abolished no-grounds evictions." },
  { title: "Renter's Rights in Queensland", href: "/guides/renters-rights-qld", description: "QLD's 2024 reforms toward grounds-based evictions." },
  { title: "Renter's Rights in WA",       href: "/guides/renters-rights-wa",  description: "WA's Residential Tenancies Act and no dedicated tribunal." },
  { title: "First Home Buyer Guide NT",   href: "/guides/first-home-buyer-nt", description: "When you're ready to stop renting and buy your first home." },
];

export default function RentersRightsNTPage() {
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
          This guide is general information only, not legal advice. NT tenancy
          law, particularly remote community housing, can be complex. Verify
          current rules with{" "}
          <a href="https://www.consumeraffairs.nt.gov.au" target="_blank" rel="noopener noreferrer">
            NT Consumer Affairs
          </a>{" "}
          or seek legal advice before taking action.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancies Act 1999 (NT)</h2>
      <p className="lead">
        Residential tenancies in the NT are governed by the Residential
        Tenancies Act 1999 (NT). It sets out the rights and obligations of
        tenants and landlords from the signing of a tenancy agreement through
        to bond refunds and termination.
      </p>
      <p>
        The Act is administered by NT Consumer Affairs, a division of the
        Department of the Attorney-General and Justice. NT Consumer Affairs
        provides information, investigates complaints, and assists with dispute
        resolution.
      </p>
      <p>
        Applies to most private residential tenancies in the NT, including
        Darwin urban properties, Alice Springs rentals, and regional centres.
        Government-owned housing and remote community housing may have
        different provisions, see the remote housing section below.
      </p>

      <h2 id="lease-types">Lease types</h2>
      <ul>
        <li>
          <strong>Fixed term:</strong> Agreed start and end dates. Neither
          party can end without grounds during the term (limited exceptions
          such as family violence). Rent can't be increased unless the increase
          is specified in the agreement.
        </li>
        <li>
          <strong>Periodic:</strong> Ongoing tenancy with no fixed end date,
          often created when a fixed term lease expires and isn't renewed.
          Either party can end it with appropriate notice.
        </li>
      </ul>
      <p>
        All NT residential tenancy agreements must be in writing. The landlord
        must provide a copy of the signed agreement to the tenant within 14
        days. Verbal agreements are not sufficient.
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks rent. Special circumstances (e.g. pet bond) may allow more.</li>
        <li><strong>Lodgement:</strong> Must be lodged with NT Consumer Affairs within 7 days of receipt. You should receive a confirmation receipt.</li>
        <li><strong>Condition report:</strong> Complete a thorough ingoing condition report at the start. Critical for protecting against unfair bond deductions.</li>
        <li><strong>Refund:</strong> The full bond must be refunded if the property is in the same condition as on move-in (allowing fair wear and tear). Deductions must be for legitimate repairs or cleaning.</li>
      </ul>
      <p>
        Disputes about bond deductions are handled by NTCAT. Both parties can
        apply for a hearing.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li><strong>Notice required:</strong> At least 30 days written notice before any rent increase</li>
        <li>
          <strong>No minimum period between increases:</strong> Unlike NSW,
          VIC, and TAS, the NT does not specify a minimum period between
          increases for periodic tenancies. Landlords can technically increase
          every 30 days on a periodic tenancy with proper notice.
        </li>
        <li><strong>Fixed term:</strong> Rent can't be increased unless the agreement specifies the amount or method</li>
      </ul>
      <p>
        No rent caps. If you're in a periodic tenancy and facing frequent
        increases, your options are to negotiate, accept, or give 14 days
        notice to vacate. Contact NT Consumer Affairs if you believe the
        increase is retaliatory.
      </p>

      <h2 id="inspections">Routine inspections</h2>
      <ul>
        <li><strong>Notice required:</strong> Reasonable written notice, the standard is at least 24 hours</li>
        <li><strong>Frequency:</strong> Inspections must not be conducted excessively. Quarterly is generally accepted as reasonable; monthly would likely be considered excessive.</li>
        <li><strong>Emergency:</strong> Genuine emergencies (flood, gas leak, structural failure) allow no-notice entry.</li>
      </ul>
      <p>
        If inspections happen too frequently or without proper notice, document
        each occurrence and contact NT Consumer Affairs.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>
        The landlord has a legal duty to maintain the property in a reasonable
        state of repair. Repairs are categorised as urgent or general.
      </p>

      <h3>Urgent repairs</h3>
      <p>
        Urgent repairs make the property uninhabitable, unsafe, or affect an
        essential service. The landlord must arrange these as soon as possible.
        In Darwin's tropical climate, urgent repairs also include:
      </p>
      <ul>
        <li>Air conditioning breakdown (during wet season or extreme heat)</li>
        <li>Water supply failure</li>
        <li>Gas or electrical faults</li>
        <li>Burst water pipe or serious leak</li>
        <li>Cyclone or storm damage</li>
        <li>Broken roof or flooding</li>
      </ul>
      <p>
        Always notify the landlord of urgent repairs in writing. If they fail
        to act, you may be able to arrange repairs and seek reimbursement, but
        get advice from NT Consumer Affairs first.
      </p>

      <h3>General (non-urgent) repairs</h3>
      <p>
        Submit a written request and allow a reasonable time. Keep copies of
        all correspondence. If repairs aren't completed within a reasonable
        period, apply to NTCAT for a repair order.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Periodic, no grounds</td><td>14 days</td><td>42 days</td></tr>
          <tr><td>Periodic, with grounds (breach)</td><td>14 days</td><td>14 days</td></tr>
          <tr><td>Fixed term, end of term</td><td>Per agreement</td><td>Per agreement</td></tr>
        </tbody>
      </table>
      <p>
        <strong>Breaking a fixed-term lease early</strong> can result in
        financial penalties: typically rent until a new tenant is found, plus
        re-letting costs. Exemptions: family violence, loss of employment, or
        the property becoming uninhabitable.
      </p>

      <h2 id="remote-housing">Remote community housing</h2>
      <p>
        The NT has a unique housing challenge: a significant proportion of the
        population lives in remote Aboriginal communities, where housing
        arrangements often differ substantially from standard residential
        tenancies.
      </p>
      <ul>
        <li>
          <strong>Government-managed housing:</strong> Many remote homes are
          managed by the NT Housing Authority (formerly Territory Housing).
          Different rules, rent scales, and obligations apply.
        </li>
        <li>
          <strong>Land tenure:</strong> Often Aboriginal freehold or other
          statutory land rights frameworks, not standard freehold or Crown
          Lease.
        </li>
        <li>
          <strong>SIHIP and successor programs:</strong> Past and current
          remote housing programs have created complex tenancy arrangements
          that may not be fully covered by the standard Act.
        </li>
        <li>
          <strong>Cultural considerations:</strong> Housing officers and
          community legal centres operating in remote NT have specialist
          knowledge of the unique circumstances.
        </li>
      </ul>
      <p>
        If you're renting in a remote NT community, contact the North Australian
        Aboriginal Justice Agency (NAAJA) or Central Australian Aboriginal Legal
        Aid Service (CAALAS) for specialist advice.
      </p>

      <h2 id="disputes">Resolving disputes, NTCAT</h2>
      <p>
        The NT Civil and Administrative Tribunal (NTCAT) is the primary body
        for residential tenancy disputes in the NT. NTCAT handles:
      </p>
      <ul>
        <li>Bond disputes</li>
        <li>Rent increase challenges</li>
        <li>Repair order applications</li>
        <li>Unlawful entry complaints</li>
        <li>Termination disputes</li>
        <li>Compensation claims</li>
      </ul>
      <p>
        Applications can be lodged online or in person. Fees are modest and the
        process is designed for self-representation. For significant disputes,
        seek advice from NT Consumer Affairs or a community legal centre.
      </p>
      <p>
        Before applying to NTCAT, attempt direct resolution with your landlord
        or agent and document all communications, NTCAT will want to see
        evidence of attempts at informal resolution.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>NT Consumer Affairs</strong>, official tenancy regulator:{" "}
          <a href="https://www.consumeraffairs.nt.gov.au" target="_blank" rel="noopener noreferrer">consumeraffairs.nt.gov.au</a>
        </li>
        <li>
          <strong>NT Civil and Administrative Tribunal (NTCAT)</strong>, dispute resolution:{" "}
          <a href="https://www.ntcat.nt.gov.au" target="_blank" rel="noopener noreferrer">ntcat.nt.gov.au</a>
        </li>
        <li>
          <strong>North Australian Aboriginal Justice Agency (NAAJA)</strong>, legal aid for remote and Aboriginal communities:{" "}
          <a href="https://www.naaja.org.au" target="_blank" rel="noopener noreferrer">naaja.org.au</a>
        </li>
        <li>
          <strong>NT Legal Aid Commission</strong>, free legal advice:{" "}
          <a href="https://www.ntlac.nt.gov.au" target="_blank" rel="noopener noreferrer">ntlac.nt.gov.au</a>
        </li>
        <li>
          <strong>NT Housing</strong>, government housing information:{" "}
          <a href="https://www.housing.nt.gov.au" target="_blank" rel="noopener noreferrer">housing.nt.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
