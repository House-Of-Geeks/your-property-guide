import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Renter's Rights in the ACT: Complete Guide for Canberra Tenants (2026)",
  description:
    "ACT tenant rights: bond, rent increases (8 weeks notice, 12 months between), no-grounds eviction protections, pet rights, minimum standards, and ACAT dispute resolution.",
  slug: "renters-rights-act",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
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
  "ACT has some of the strongest tenant protections in Australia. No-grounds evictions are largely abolished even on periodic tenancies; landlords need valid grounds.",
  "Maximum bond is 4 weeks rent. Lodged with the ACT Revenue Office within 14 days. Landlords can't deduct from the bond unilaterally, they must apply to ACAT.",
  "Rent increases require 8 weeks notice (one of the longest in Australia) with at least 12 months between increases.",
  "Routine inspections need 2 weeks written notice (longer than most states), max 4 per year.",
  "Pet refusal must be on reasonable grounds, blanket 'no pets' policies aren't sufficient.",
  "Minimum standards include fixed heating in main living area, window coverings, ventilation, smoke alarms, and weatherproofing.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "Residential Tenancies Act 1997 (ACT)" },
  { id: "lease-types",    label: "Lease types" },
  { id: "bond",           label: "Bond rules" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "inspections",    label: "Routine inspections" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "no-grounds",     label: "No-grounds evictions" },
  { id: "pets",           label: "Pets in rental properties" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "disputes",       label: "Resolving disputes via ACAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord still issue a no-grounds eviction in the ACT?",
    answer:
      "Generally no. Landlords need valid grounds even on periodic tenancies, including the landlord/family genuinely intending to occupy, demolition or substantial renovation, sale requiring vacant possession, or serious breach by the tenant. If you receive a notice you believe lacks valid grounds, contact ACAT or the Tenants' Union ACT immediately.",
  },
  {
    question: "How much notice for a rent increase in the ACT?",
    answer:
      "8 weeks written notice, one of the longest in Australia. Plus a minimum 12 months between any two increases. ACT doesn't cap the amount, but you can apply to ACAT to challenge an excessive increase.",
  },
  {
    question: "What's the minimum-standards requirement in the ACT?",
    answer:
      "ACT rentals must meet minimum standards including: fixed heating in the main living area, window coverings for privacy, adequate ventilation, smoke alarms, and weatherproofing. If your property doesn't meet these, contact ACAT for a compliance order.",
  },
  {
    question: "Can my landlord deduct from my bond directly?",
    answer:
      "No. The ACT Revenue Office holds the bond in trust. If the landlord wants to claim against it, they must apply to ACAT, they can't simply deduct money. This protects tenants from unjustified bond deductions.",
  },
  {
    question: "Can my landlord refuse a pet?",
    answer:
      "Only on reasonable grounds. A blanket 'no pets' policy isn't sufficient. Reasonable grounds include the property having no secure yard, strata bylaws prohibiting pets, or a specific animal that would cause irreparable damage. If refused, you can apply to ACAT to challenge the decision.",
  },
  {
    question: "How does ACAT differ from VCAT or NCAT?",
    answer:
      "Functionally similar, the ACT's tribunal handles tenancy disputes including bond, rent increases, repairs, eviction challenges, pet refusals, and compensation. Applications can be lodged online; legal representation is not required for most matters. Fees are reduced or waived for concession-card holders.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",      href: "/guides/renters-rights-nsw", description: "Compare ACT to NSW where no-grounds evictions remain on periodic tenancies." },
  { title: "Renter's Rights in Victoria", href: "/guides/renters-rights-vic", description: "VIC's 2021 reforms also abolished no-grounds evictions." },
  { title: "Renter's Rights in Queensland", href: "/guides/renters-rights-qld", description: "QLD's 2024 reforms toward grounds-based evictions." },
  { title: "Renter's Rights in WA",       href: "/guides/renters-rights-wa",  description: "WA's Residential Tenancies Act and entry rules." },
  { title: "First Home Buyer Guide ACT",  href: "/guides/first-home-buyer-act", description: "Canberra's HBCS stamp duty waiver and Crown Lease land." },
];

export default function RentersRightsACTPage() {
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
          current rules with the{" "}
          <a href="https://www.acat.act.gov.au" target="_blank" rel="noopener noreferrer">
            ACT Civil and Administrative Tribunal
          </a>{" "}
          or the{" "}
          <a href="https://www.tenantsact.org.au" target="_blank" rel="noopener noreferrer">
            Tenants' Union ACT
          </a>{" "}
          before taking action.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancies Act 1997 (ACT)</h2>
      <p className="lead">
        The ACT's residential tenancy laws are governed by the Residential
        Tenancies Act 1997. The ACT has progressively strengthened tenant
        protections, and as of 2026, it offers some of the strongest renter
        protections of any Australian jurisdiction.
      </p>
      <p>Key improvements in recent ACT reforms:</p>
      <ul>
        <li>Abolition of "no cause" (no-grounds) evictions in most circumstances</li>
        <li>Increased notice periods for rent increases</li>
        <li>Strengthened pet ownership rights</li>
        <li>Enhanced minimum standards for rental properties</li>
      </ul>
      <p>
        Disputes are resolved through the ACT Civil and Administrative Tribunal
        (ACAT), which has a dedicated tenancy division.
      </p>

      <h2 id="lease-types">Lease types</h2>
      <ul>
        <li>
          <strong>Fixed term:</strong> Defined start and end dates. Landlord
          can't end except for specific grounds (e.g. serious breach). Tenant
          may vacate early but may be liable for a break fee.
        </li>
        <li>
          <strong>Periodic:</strong> Ongoing arrangement with no set end date.
          Periodic tenancies continue after a fixed term unless a new agreement
          is signed. Both parties can end with appropriate notice, but only on
          specified grounds.
        </li>
      </ul>
      <p>
        All ACT tenancy agreements must be in writing. The landlord must use
        the standard form tenancy agreement and provide a copy to the tenant
        before or at signing.
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks rent. Landlords can't request more.</li>
        <li><strong>Lodgement:</strong> Lodged with the ACT Revenue Office within 14 days. You should receive a receipt.</li>
        <li><strong>Condition report:</strong> The landlord must provide an ingoing report before the tenancy begins. Both parties sign and retain a copy. Photograph any existing damage.</li>
        <li><strong>Refund:</strong> Refunded if the property is in the same condition as on move-in (allowing fair wear and tear). Disputes go to ACAT.</li>
      </ul>
      <p>
        The ACT Revenue Office holds bonds in trust during the tenancy. The
        landlord <strong>cannot</strong> deduct unilaterally, they must apply
        to ACAT to claim.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li><strong>Minimum period:</strong> At least 12 months between any two rent increases</li>
        <li><strong>Notice required:</strong> At least 8 weeks written notice, one of the longest in Australia</li>
        <li><strong>Fixed term:</strong> Rent can't be increased unless the amount or formula is specified in the agreement</li>
        <li><strong>Excessive increases:</strong> Apply to ACAT for review; ACAT considers comparable rents in the area</li>
      </ul>

      <KeyFigure
        value="8 weeks / 12 months"
        label="ACT requires 8 weeks notice for any rent increase, with a minimum 12 months between increases."
        context="Among the strongest tenant protections in Australia"
      />

      <p>
        ACT doesn't have formal rent caps, but the combination of the 12-month
        minimum, 8-week notice, and ACAT review rights provides meaningful
        protection against rapid or unreasonable increases.
      </p>

      <h2 id="inspections">Routine inspections</h2>
      <ul>
        <li><strong>Notice required:</strong> 2 weeks written notice, significantly longer than most other states</li>
        <li><strong>Maximum frequency:</strong> 4 routine inspections per year</li>
        <li><strong>Reasonable time:</strong> Not excessively early, late, or on public holidays</li>
      </ul>
      <p>
        If your landlord gives less than 2 weeks notice, you don't have to
        allow entry for a routine inspection. Document any breach and contact
        ACAT if the problem persists.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>
        The landlord must maintain the property in a reasonable state of repair
        and comply with health, safety, and building standards.
      </p>

      <h3>Urgent repairs</h3>
      <p>
        Affect essential services or occupant safety; must be addressed
        immediately. Examples:
      </p>
      <ul>
        <li>Gas or electrical fault</li>
        <li>Burst water pipe or serious leak</li>
        <li>Failure of hot water, heating, or cooling</li>
        <li>Broken roof or serious storm damage</li>
        <li>Blocked or failed sewerage</li>
      </ul>
      <p>
        Notify the landlord in writing. If they fail to respond within a
        reasonable time, contact ACAT for an urgent repair order.
      </p>

      <h3>Non-urgent repairs</h3>
      <p>
        Put your request in writing and allow a reasonable time (generally 14
        days). If repairs aren't made, apply to ACAT for a repair order or
        compensation.
      </p>

      <h3>Minimum standards</h3>
      <p>ACT rentals must meet minimum standards:</p>
      <ul>
        <li>Fixed heating in the main living area</li>
        <li>Window coverings for privacy</li>
        <li>Adequate ventilation</li>
        <li>Smoke alarms (compliant with relevant standards)</li>
        <li>Adequate weatherproofing</li>
      </ul>
      <p>
        If your property doesn't meet minimum standards, contact ACAT for a
        compliance order.
      </p>

      <h2 id="no-grounds">No-grounds evictions, ACT's strong protections</h2>
      <p>
        The ACT has significantly stronger eviction protections than most other
        states. <strong>Landlords generally need grounds to end a tenancy</strong>,
        including for periodic tenancies.
      </p>
      <p>Acceptable grounds for a landlord to end a tenancy:</p>
      <ul>
        <li>The landlord (or their family) genuinely intends to occupy the property</li>
        <li>The landlord intends to demolish or substantially renovate</li>
        <li>The property is being sold and vacant possession is required</li>
        <li>Serious or repeated breach of the agreement by the tenant</li>
        <li>The tenant has caused serious damage or injury</li>
      </ul>
      <p>
        If a landlord gives a "no grounds" notice, the tenant can challenge it
        at ACAT, and the landlord must establish that a valid ground exists.
        This is a significant practical protection compared to NSW and WA,
        where no-grounds evictions on periodic tenancies remain available.
      </p>
      <p>
        If you receive an eviction notice that appears to be without valid
        grounds, contact ACAT or the Tenants' Union ACT immediately.
      </p>

      <h2 id="pets">Pets in rental properties</h2>
      <p>
        The ACT has pet-friendly tenancy laws making it harder for landlords to
        refuse pets without good reason.
      </p>
      <ul>
        <li>Tenants can apply to keep a pet; landlords must have <strong>reasonable grounds</strong> to refuse. A blanket "no pets" policy isn't sufficient.</li>
        <li>Reasonable grounds: no secure yard, strata bylaws prohibit pets, the specific animal would cause irreparable damage.</li>
        <li>If refused, apply to ACAT to challenge the decision.</li>
      </ul>
      <p>
        Particularly relevant in Canberra where many residents rent long-term.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Periodic tenancy (with grounds)</td><td>3 weeks</td><td>8 weeks (general grounds)</td></tr>
          <tr><td>Fixed term, end of term</td><td>3 weeks before end</td><td>6 weeks before end</td></tr>
          <tr><td>Serious breach</td><td>N/A</td><td>7 days (after breach notice)</td></tr>
        </tbody>
      </table>
      <p>
        Notice periods under the ACT Act can be technical and may have been
        updated. Always verify current requirements at acat.act.gov.au.
      </p>
      <p>
        <strong>Family violence:</strong> Tenants experiencing family violence
        can end a tenancy without standard notice or break fees. Contact the
        Tenants' Union ACT or 1800RESPECT (1800 737 732) for support.
      </p>

      <h2 id="disputes">Resolving disputes, ACAT</h2>
      <p>
        ACAT is the primary forum for residential tenancy disputes in the ACT.
        ACAT handles:
      </p>
      <ul>
        <li>Bond disputes</li>
        <li>Rent increase challenges</li>
        <li>Repair orders and minimum standards complaints</li>
        <li>Unlawful entry disputes</li>
        <li>Eviction challenges (including no-grounds notices)</li>
        <li>Pet refusal disputes</li>
        <li>Compensation claims</li>
      </ul>
      <p>
        Applications can be lodged online. Designed to be accessible to
        self-represented parties, legal representation is not required for most
        matters. The Tenants' Union ACT can assist in preparing your application.
      </p>
      <p>
        Modest application fee, reduced or waived for concession-card holders.
        ACAT typically lists residential tenancy disputes within a few weeks.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>ACT Civil and Administrative Tribunal (ACAT)</strong>, tenancy disputes:{" "}
          <a href="https://www.acat.act.gov.au" target="_blank" rel="noopener noreferrer">acat.act.gov.au</a>
        </li>
        <li>
          <strong>Tenants' Union ACT</strong>, free advice and advocacy:{" "}
          <a href="https://www.tenantsact.org.au" target="_blank" rel="noopener noreferrer">tenantsact.org.au</a>
        </li>
        <li>
          <strong>ACT Revenue Office</strong>, bond lodgement:{" "}
          <a href="https://www.revenue.act.gov.au" target="_blank" rel="noopener noreferrer">revenue.act.gov.au</a>
        </li>
        <li>
          <strong>Access Canberra</strong>, general ACT government services:{" "}
          <a href="https://www.accesscanberra.act.gov.au" target="_blank" rel="noopener noreferrer">accesscanberra.act.gov.au</a>
        </li>
        <li>
          <strong>Legal Aid ACT</strong>, free legal advice:{" "}
          <a href="https://www.legalaidact.org.au" target="_blank" rel="noopener noreferrer">legalaidact.org.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
