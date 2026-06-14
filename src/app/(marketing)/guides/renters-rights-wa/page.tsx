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
  title: "Renter's Rights in Western Australia: Complete Guide (2026)",
  description:
    "WA tenant rights: bond, rent increases, repairs, entry rights, and ending a tenancy under the Residential Tenancies Act 1987, plus how disputes work in WA without a tribunal.",
  slug: "renters-rights-wa",
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
  "Maximum bond is 4 weeks rent (up to 6 weeks for furnished or higher-rent properties). Lodged with the WA Bond Administrator within 14 days.",
  "Rent increases on periodic tenancies require 60 days written notice. WA does not yet enforce a 12-month statutory minimum between increases (unlike NSW, VIC, QLD).",
  "WA still permits no-grounds evictions on periodic tenancies, with 60 days notice.",
  "Urgent repairs (burst pipe, gas leak, roof damage) must be addressed immediately. Tenants can self-arrange up to $1,000 if landlord can't be reached.",
  "Routine inspections capped at 4 per year, with 7 to 14 days written notice required.",
  "Unlike eastern states, WA has no dedicated tenancy tribunal. Disputes go through Consumer Protection WA conciliation, then the Magistrates Court if unresolved.",
];

const TOC: GuideTOCEntry[] = [
  { id: "act",            label: "WA Residential Tenancies Act 1987" },
  { id: "bond",           label: "Bond rules" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "entry-rights",   label: "Landlord entry rights" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "disputes",       label: "Resolving disputes" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Why doesn't WA have a tenancy tribunal?",
    answer:
      "Historically WA has handled tenancy disputes through Consumer Protection WA conciliation, escalating to the Magistrates Court when unresolved. Eastern states (NCAT, VCAT, QCAT, SACAT) have dedicated tribunals. The WA model is being reviewed periodically; check Consumer Protection WA for any reform updates.",
  },
  {
    question: "Can my landlord raise the rent every few months in WA?",
    answer:
      "Possibly. WA requires 60 days written notice for rent increases on periodic tenancies, but it doesn't (yet) impose a 12-month statutory minimum between increases the way NSW, VIC, and QLD do. Always verify the current rule with Consumer Protection WA before assuming an increase is unlawful.",
  },
  {
    question: "Can my landlord still evict me without grounds?",
    answer:
      "Yes, on periodic tenancies, with 60 days notice. If you suspect the eviction is retaliatory (e.g. after a repair request), seek advice from Consumer Protection WA. WA also imposes 30 days notice from either side at the end of a fixed term.",
  },
  {
    question: "What's the maximum bond in WA?",
    answer:
      "Generally 4 weeks rent. Up to 6 weeks may be requested for furnished properties or where weekly rent exceeds a set threshold, check Consumer Protection WA for the current threshold.",
  },
  {
    question: "What about urgent repairs in WA?",
    answer:
      "Must be addressed immediately. If the landlord or agent can't be contacted, tenants can arrange urgent repairs and seek reimbursement up to $1,000. Examples: burst pipe, gas leak, serious roof damage, electrical fault. Always keep receipts.",
  },
  {
    question: "Is fair wear and tear deductible from my bond in WA?",
    answer:
      "No. WA's rules don't allow fair wear and tear to be claimed from the bond, only damage beyond normal use. Take dated photos on day one and complete the property condition report carefully, that's your evidence in any bond dispute.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",      href: "/guides/renters-rights-nsw", description: "NSW also still permits no-grounds evictions." },
  { title: "Renter's Rights in Victoria", href: "/guides/renters-rights-vic", description: "VIC's 2021 reforms abolished no-grounds evictions." },
  { title: "Renter's Rights in Queensland", href: "/guides/renters-rights-qld", description: "QLD's 2024 reforms toward grounds-based evictions." },
  { title: "Renter's Rights in SA",       href: "/guides/renters-rights-sa",  description: "SA tenant rules and SACAT dispute resolution." },
  { title: "First Home Buyer Guide WA",   href: "/guides/first-home-buyer-wa", description: "When you're ready to stop renting and buy your first home." },
];

export default function RentersRightsWAPage() {
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
          <a href="https://www.commerce.wa.gov.au/consumer-protection/renting" target="_blank" rel="noopener noreferrer">
            Consumer Protection WA
          </a>{" "}
          or a tenancy advocate before taking action.
        </p>
      </Callout>

      <h2 id="act">The WA Residential Tenancies Act 1987</h2>
      <p className="lead">
        The Residential Tenancies Act 1987 (WA) is the primary legislation
        governing residential tenancies in WA. While WA hasn't introduced the
        sweeping reforms seen in Victoria and Queensland, tenants still have
        significant legal protections.
      </p>
      <p>
        The Act is administered by Consumer Protection WA (part of the
        Department of Mines, Industry Regulation and Safety). Unlike eastern
        states, WA does not have a dedicated tenancy tribunal, disputes go to
        the Magistrates Court.
      </p>
      <p>
        The WA government has been reviewing its tenancy laws, check Consumer
        Protection WA for recent amendments.
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> Generally 4 weeks rent. Up to 6 weeks for furnished properties or those with weekly rent above a set threshold, check Consumer Protection WA for the current threshold.</li>
        <li><strong>Lodgement:</strong> Lodged with the WA Bond Administrator within 14 days of receipt.</li>
        <li><strong>Refund:</strong> If both parties agree, the bond is refunded at the end of tenancy. Disputes go to the Magistrates Court.</li>
      </ul>
      <p>
        Always complete the property condition report and take photos on day
        one. In WA, "fair wear and tear" can't be claimed from the bond, only
        damage beyond normal use.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li>
          <strong>Periodic tenancies:</strong> At least 60 days written notice.
          Unlike NSW, QLD, and VIC, WA doesn't yet have a statutory minimum of
          12 months between increases for periodic tenancies. Always verify
          the current rule.
        </li>
        <li>
          <strong>Fixed-term tenancies:</strong> Rent can only be increased if
          the amount or method is specified in the agreement.
        </li>
      </ul>
      <p>
        No cap on the amount of any rent increase. The Perth rental market has
        seen significant growth, research comparable rents in your suburb
        before negotiating.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>
        Landlords must maintain the property in a reasonable state of repair.
      </p>

      <h3>Urgent repairs</h3>
      <p>
        Must be addressed immediately. Examples: burst pipe, gas leak, roof
        damage after storm, electrical fault. If you can't contact the
        landlord or agent, you may arrange urgent repairs and seek
        reimbursement up to $1,000.
      </p>

      <h3>Non-urgent repairs</h3>
      <p>
        Must be carried out within a reasonable time after written notice.
        Always put requests in writing. If the landlord doesn't act, apply to
        the Magistrates Court for a repair order.
      </p>

      <h2 id="entry-rights">Landlord entry rights</h2>
      <ul>
        <li><strong>Routine inspections:</strong> Maximum 4 per year. Landlord must give 7 to 14 days written notice.</li>
        <li><strong>Other entry (repairs):</strong> At least 24 hours notice.</li>
        <li><strong>Emergency:</strong> No notice required.</li>
      </ul>
      <p>
        Entry must not be at unreasonable times, generally between 8am and 6pm.
        Entry without proper notice is a breach, document and raise it with
        Consumer Protection WA.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Fixed term, end of term</td><td>30 days</td><td>30 days</td></tr>
          <tr><td>Periodic, no grounds</td><td>21 days</td><td>60 days</td></tr>
          <tr><td>Periodic, significant breach</td><td>-</td><td>7 to 14 days (varies)</td></tr>
        </tbody>
      </table>
      <p>
        WA still allows no-grounds evictions on periodic tenancies (60 days
        notice). If you suspect a notice to vacate is retaliatory (e.g. after
        making a repair request), seek advice from Consumer Protection WA.
      </p>
      <p>
        Breaking a fixed-term lease early may require you to compensate the
        landlord for re-letting costs and any vacant period. Check your
        agreement and seek tenancy advocate advice.
      </p>

      <h2 id="disputes">Resolving disputes</h2>
      <p>WA doesn't have a dedicated residential tenancy tribunal. Disputes go through:</p>
      <ul>
        <li><strong>Consumer Protection WA:</strong> Free conciliation and mediation. Contact 1300 304 054.</li>
        <li><strong>Magistrates Court:</strong> For disputes that can't be resolved through mediation, including bond claims and repair orders.</li>
      </ul>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Consumer Protection WA</strong>:{" "}
          <a href="https://www.commerce.wa.gov.au/consumer-protection/renting" target="_blank" rel="noopener noreferrer">commerce.wa.gov.au/consumer-protection</a>
        </li>
        <li>
          <strong>Tenancy WA</strong>, free advice and advocacy:{" "}
          <a href="https://www.tenancywa.org.au" target="_blank" rel="noopener noreferrer">tenancywa.org.au</a>
        </li>
        <li>
          <strong>Bond Administrator WA</strong>: 1300 304 054
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
