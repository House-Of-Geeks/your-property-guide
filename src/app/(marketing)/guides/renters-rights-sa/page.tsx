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
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Renter's Rights in South Australia: Complete Guide (2026)",
  description:
    "SA tenant rights: bond, rent increases, repairs, entry rights, and ending a tenancy under the Residential Tenancies Act 1995, plus SACAT dispute resolution.",
  slug: "renters-rights-sa",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 8,
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
  "Maximum bond is 4 weeks rent (higher allowable for furnished or higher-rent properties). Lodged with Consumer and Business Services SA (CBS) within prescribed timeframes.",
  "Rent can only be increased once every 12 months on periodic tenancies, with at least 60 days written notice.",
  "SA still permits no-grounds evictions on periodic tenancies, with 90 days notice required.",
  "Urgent repairs must be addressed immediately; if landlord can't be reached, tenants can arrange repairs and seek reimbursement.",
  "SACAT (South Australian Civil and Administrative Tribunal) handles tenancy disputes; CBS offers free mediation as a first step.",
  "Always complete and sign property condition reports at start and end of tenancy. Take dated photos.",
];

const TOC: GuideTOCEntry[] = [
  { id: "act",            label: "SA Residential Tenancies Act 1995" },
  { id: "bond",           label: "Bond rules" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "entry-rights",   label: "Landlord entry rights" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "disputes",       label: "Resolving disputes via SACAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord still evict me without a reason in SA?",
    answer:
      "Yes, on periodic tenancies. The landlord must give 90 days notice for a no-grounds termination. SA tenant advocates have campaigned for the abolition of no-grounds evictions (as Victoria did in 2021), but as of April 2026 the provisions remain. Check Consumer and Business Services SA for any updates.",
  },
  {
    question: "How much bond can my landlord ask for?",
    answer:
      "Generally 4 weeks rent. Higher bonds may be permitted for furnished properties or where the weekly rent exceeds a set threshold, verify with CBS for the current limits in your situation.",
  },
  {
    question: "What's the notice period for the landlord to end a fixed-term lease?",
    answer:
      "28 days at the end of the fixed term, with both tenant and landlord giving 28 days. During the fixed term, the landlord generally can't end the tenancy without grounds (e.g. serious breach by the tenant).",
  },
  {
    question: "How fast must urgent repairs be done in SA?",
    answer:
      "Effectively immediately. Urgent repairs include burst pipes, gas leaks, structural damage, electrical faults, loss of essential services (water, gas, electricity), and breakdown of heating/cooling in extreme weather. If the landlord can't be reached, you can arrange repairs and seek reimbursement, check CBS for current limits.",
  },
  {
    question: "How does dispute resolution work in SA?",
    answer:
      "Consumer and Business Services (CBS) offers free mediation as a first step, contact 131 882. If mediation fails or isn't appropriate, you apply to the South Australian Civil and Administrative Tribunal (SACAT) for a formal decision. Most applications can be lodged online at sacat.sa.gov.au.",
  },
  {
    question: "Can I challenge an excessive rent increase?",
    answer:
      "Yes, apply to SACAT. They'll review the proposed increase against comparable properties in the area. SA doesn't cap the amount of an increase, only the frequency (once per 12 months) and the notice (60 days written).",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",      href: "/guides/renters-rights-nsw", description: "Compare to NSW which also still permits no-grounds evictions." },
  { title: "Renter's Rights in Victoria", href: "/guides/renters-rights-vic", description: "VIC's 2021 reforms abolished no-grounds evictions." },
  { title: "Renter's Rights in Queensland", href: "/guides/renters-rights-qld", description: "QLD's 2024 reforms toward grounds-based evictions." },
  { title: "Renter's Rights in WA",       href: "/guides/renters-rights-wa",  description: "WA's Residential Tenancies Act and entry rules." },
  { title: "First Home Buyer Guide SA",   href: "/guides/first-home-buyer-sa", description: "When you're ready to stop renting and buy your first home." },
];

export default function RentersRightsSAPage() {
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
          <a href="https://www.cbs.sa.gov.au/renting" target="_blank" rel="noopener noreferrer">
            Consumer and Business Services SA
          </a>{" "}
          or a tenancy advocate before taking action.
        </p>
      </Callout>

      <h2 id="act">The SA Residential Tenancies Act 1995</h2>
      <p className="lead">
        The Residential Tenancies Act 1995 (SA) governs all residential
        tenancies in South Australia. It sets out the rights and
        responsibilities of landlords and tenants, covering bond, repairs,
        entry, and ending a tenancy.
      </p>
      <p>
        The Act is administered by Consumer and Business Services SA (CBS).
        Disputes that can't be resolved through CBS are referred to the South
        Australian Civil and Administrative Tribunal (SACAT).
      </p>
      <p>
        SA has progressively updated its tenancy laws in recent years. As of
        April 2026, SA still permits no-grounds evictions on periodic
        tenancies with 90 days notice. Check CBS for current or proposed
        amendments.
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> Generally 4 weeks rent. For furnished properties or where weekly rent exceeds a set threshold, a higher bond may apply, verify with CBS.</li>
        <li><strong>Lodgement:</strong> The bond must be lodged with CBS within prescribed timeframes (typically within 7 days of receipt). Receipt should be provided.</li>
        <li><strong>Refund:</strong> If both parties agree, the bond is refunded at the end of tenancy. Disputes go to SACAT.</li>
      </ul>
      <p>
        Complete and sign the property condition report at the start and end of
        your tenancy. Take timestamped photos. This documentation protects you
        in any bond dispute.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li><strong>Frequency:</strong> Once every 12 months for periodic tenancies</li>
        <li><strong>Notice:</strong> At least 60 days written notice</li>
        <li><strong>Fixed-term:</strong> Rent can't be increased during a fixed term unless the increase amount is specified in the agreement</li>
      </ul>
      <p>
        If you believe a rent increase is excessive, apply to SACAT for review.
        They consider what similar properties in the area are renting for.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>
        Landlords are legally required to maintain the property in a good state
        of repair and in compliance with health and safety standards.
      </p>

      <h3>Urgent repairs</h3>
      <p>
        Must be fixed as soon as possible. Examples: burst pipes, gas leaks,
        major structural damage, electrical faults, loss of essential services
        (water, gas, electricity), breakdown of heating/cooling in extreme
        weather. If the landlord can't be reached, tenants may arrange urgent
        repairs and seek reimbursement, check CBS for current limits.
      </p>

      <h3>Non-urgent repairs</h3>
      <p>
        Must be addressed within a reasonable time after written notice.
        Always put requests in writing (email is acceptable) and keep records.
        If the landlord doesn't act, apply to SACAT for a repair order.
      </p>

      <h2 id="entry-rights">Landlord entry rights</h2>
      <ul>
        <li><strong>Routine inspections:</strong> Reasonable notice (typically 7 to 14 days), generally limited to 4 per year</li>
        <li><strong>Entry for repairs or showing the property:</strong> At least 24 hours notice</li>
        <li><strong>Emergency:</strong> No notice required (flood, gas leak, fire)</li>
      </ul>
      <p>
        Entry must occur at a reasonable time, generally between 8am and 8pm.
        Entry without proper notice or more frequently than permitted is a
        breach. Document and report it to CBS.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Fixed term, end of term</td><td>28 days</td><td>28 days</td></tr>
          <tr><td>Periodic, no grounds</td><td>21 days</td><td>90 days</td></tr>
          <tr><td>Periodic, significant breach</td><td>-</td><td>14 to 30 days (depending on breach)</td></tr>
        </tbody>
      </table>
      <p>
        SA still permits no-grounds evictions on periodic tenancies, but the
        90-day notice provides some security. If you believe an eviction is
        retaliatory or not made in good faith, seek advice from a tenancy
        advocate or CBS.
      </p>
      <p>
        Breaking a fixed-term lease early may make you liable for the
        landlord's reasonable reletting costs. Check your agreement and seek
        advice before acting.
      </p>

      <h2 id="disputes">Resolving disputes, SACAT</h2>
      <p>
        SACAT handles residential tenancy disputes in SA. Applications can be
        lodged online at sacat.sa.gov.au.
      </p>
      <p>SACAT handles:</p>
      <ul>
        <li>Bond disputes</li>
        <li>Repair orders</li>
        <li>Challenging rent increases</li>
        <li>Termination disputes</li>
        <li>Compensation claims</li>
      </ul>
      <p>
        CBS also offers free mediation as a first step. Contact CBS on 131 882
        before applying to SACAT.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Consumer and Business Services SA (CBS)</strong>:{" "}
          <a href="https://www.cbs.sa.gov.au/renting" target="_blank" rel="noopener noreferrer">cbs.sa.gov.au/renting</a>
        </li>
        <li>
          <strong>Tenants' Information &amp; Advocacy Service (TIAS)</strong>:{" "}
          <a href="https://www.syc.net.au/tias" target="_blank" rel="noopener noreferrer">syc.net.au/tias</a>
        </li>
        <li>
          <strong>SACAT</strong>:{" "}
          <a href="https://www.sacat.sa.gov.au" target="_blank" rel="noopener noreferrer">sacat.sa.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
