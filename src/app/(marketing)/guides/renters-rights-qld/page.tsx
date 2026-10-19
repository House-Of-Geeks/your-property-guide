import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
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
  title: "Renter's Rights in Queensland: Complete Guide (2026)",
  description:
    "QLD tenant rights: bond, rent increases, repairs, entry, pet rules, and grounds-based evictions (no-grounds notices ended in October 2022). Includes RTA and QCAT dispute info.",
  slug: "renters-rights-qld",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-16",
  readingTimeMinutes: 10,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: { ...DEFAULT_OG,
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
  "No-grounds evictions ended in QLD on 1 October 2022. Landlords need an approved reason to end a tenancy (the end of a fixed term still counts as one, with 2 months notice), and can only refuse a pet on reasonable grounds.",
  "Maximum bond is 4 weeks rent. Lodged with the Residential Tenancies Authority (RTA) within 10 days.",
  "Rent increases capped at one per 12 months with at least 2 months (60 days) written notice.",
  "Two repair types: emergency (immediate; if the landlord can't be reached, tenants can arrange them up to the value of 4 weeks rent) and routine (within a reasonable time).",
  "Routine inspections require 7 days notice and the first inspection can't occur until 3 months after the tenancy starts. Max 4 per year.",
  "Two-step dispute resolution: free RTA conciliation first, then QCAT if it fails.",
];

const TOC: GuideTOCEntry[] = [
  { id: "act",            label: "QLD Residential Tenancies Act" },
  { id: "bond",           label: "Bond rules" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "entry-rights",   label: "Landlord entry rights" },
  { id: "pets",           label: "Pet ownership (since 2022)" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "grounds-reform", label: "Grounds for ending a tenancy" },
  { id: "disputes",       label: "Resolving disputes (RTA & QCAT)" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my QLD landlord still issue a no-grounds eviction?",
    answer:
      "No. Since 1 October 2022, a landlord must give an approved reason on a Notice to leave (Form 12). The end of a fixed term agreement is still an approved reason, with at least 2 months notice. Other reasons include a sale contract, the owner moving in, and significant renovations, also with 2 months notice. Check the full list with the RTA before relying on a notice.",
  },
  {
    question: "How fast must emergency repairs be done in QLD?",
    answer:
      "Immediately. Emergencies include burst water pipes, gas leaks, serious roof damage, breakdown of essential services. If the landlord can't be reached, you can arrange emergency repairs yourself up to the value of 4 weeks rent, and the landlord must reimburse you within 7 days of getting the receipts. All other repairs are routine repairs, which must be done within a reasonable time.",
  },
  {
    question: "Can my landlord refuse to let me have a pet?",
    answer:
      "Only on reasonable grounds: the type of pet is unsuitable for the property, body corporate by-laws prohibit pets, or the number of pets is unreasonable. Landlords must respond to a pet request within 14 days; if they refuse, they must provide written reasons. Tenants can dispute an unreasonable refusal through the RTA.",
  },
  {
    question: "How much notice for routine inspections?",
    answer:
      "7 days written notice, with a maximum of 4 inspections per year. The first inspection can't occur until at least 3 months after the tenancy starts. Entry must be between 8am and 6pm, not on Sundays or public holidays without consent.",
  },
  {
    question: "How does the RTA dispute resolution service work?",
    answer:
      "It's a free, phone-based conciliation service. Either party can request it. Most disputes are resolved here without going to QCAT. If conciliation fails, you can apply to QCAT for a formal decision. Contact the RTA on 1300 366 311.",
  },
  {
    question: "Can rent be increased during a fixed-term lease in QLD?",
    answer:
      "Only if the amount or method of calculation is specified in the lease. Without that, the landlord can't unilaterally increase rent during a fixed term. They can give notice for an increase that takes effect after the fixed term ends, with at least 2 months notice.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",      href: "/guides/renters-rights-nsw", description: "NSW also ended no-grounds evictions, in May 2025." },
  { title: "Renter's Rights in Victoria", href: "/guides/renters-rights-vic", description: "Compare QLD with VIC's 2021 rental reforms." },
  { title: "Renter's Rights in WA",       href: "/guides/renters-rights-wa",  description: "WA's Residential Tenancies Act and entry rules." },
  { title: "Renter's Rights in SA",       href: "/guides/renters-rights-sa",  description: "SA tenant rules and SACAT dispute resolution." },
  { title: "First Home Buyer Guide QLD",  href: "/guides/first-home-buyer-qld", description: "When you're ready to stop renting and buy your first home." },
];

export default function RentersRightsQLDPage() {
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
          This guide is general information only, not legal advice. Queensland
          tenancy law was significantly updated in 2024. Verify current rules
          with the{" "}
          <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer">
            Residential Tenancies Authority (RTA)
          </a>{" "}
          before taking action.
        </p>
      </Callout>

      <Callout variant="info" title="QLD rental law reforms">
        <p>
          Since 1 October 2022, QLD landlords need an approved reason to end a
          tenancy and can only refuse a pet on reasonable grounds. Changes from
          6 June 2024 banned rent bidding and tied the 12-month limit on rent
          increases to the property, not the tenancy. Further changes started
          in 2025, so check the RTA for the current position on each provision.
        </p>
      </Callout>

      <h2 id="act">The QLD Residential Tenancies and Rooming Accommodation Act 2008</h2>
      <p className="lead">
        The Residential Tenancies and Rooming Accommodation Act 2008 (QLD) is
        the primary legislation covering residential tenancies in Queensland.
        It covers standard tenancies (houses and apartments) as well as rooming
        accommodation (boarding houses, student accommodation).
      </p>
      <p>
        The Act is administered by the Residential Tenancies Authority (RTA),
        which also provides dispute resolution and manages rental bonds.
        Queensland ended no-grounds evictions and introduced pet rules on 1
        October 2022, with further changes in 2024 and 2025.
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks rent (higher allowable thresholds for very high rent, check RTA for current limits)</li>
        <li><strong>Lodgement:</strong> Lodged with the RTA within 10 days of the tenancy starting; you should receive a receipt</li>
        <li><strong>Refund:</strong> At end of tenancy, both parties can agree to a refund via the RTA’s online system; disputes go to the RTA dispute resolution service or QCAT</li>
      </ul>
      <p>
        Complete a detailed property condition report on move-in and request a
        signed copy. Take dated photographs; this is critical for bond refunds.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li><strong>Frequency:</strong> No more than once every 12 months (fixed-term and periodic)</li>
        <li><strong>Notice:</strong> At least 2 months (60 days) written notice</li>
        <li>For fixed-term agreements, the increase amount must be specified in the agreement</li>
      </ul>
      <p>
        QLD doesn’t cap the amount of an increase, only the frequency and
        notice. If you believe an increase is excessive, seek advice from the
        RTA.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>QLD law sorts repairs into two types: emergency and routine.</p>

      <h3>Emergency repairs</h3>
      <p>
        Must be addressed <strong>immediately</strong>. Examples: burst water
        pipe, gas leak, serious roof damage after storm, breakdown of essential
        services, and a broken hot water system, stove or heater. Repairs
        needed to meet the minimum housing standards also count. If the
        landlord can’t be reached, tenants can arrange emergency repairs
        themselves up to the value of <strong>4 weeks rent</strong>. The
        landlord must reimburse you within 7 days of getting the receipts.
      </p>

      <h3>Routine repairs</h3>
      <p>
        Any repair that isn’t an emergency repair is a routine repair. It
        should be done within a <strong>reasonable time</strong> after written
        notice. If it isn’t, you can give a Notice to remedy breach (Form 11)
        allowing at least 7 days, then use RTA dispute resolution or apply to
        QCAT for a repair order. Always request repairs in writing and keep
        copies.
      </p>

      <h2 id="entry-rights">Landlord entry rights</h2>
      <ul>
        <li><strong>Routine inspections:</strong> Maximum 4 per year. The first inspection can’t occur until at least 3 months after tenancy starts. <strong>7 days written notice</strong> required.</li>
        <li><strong>General entry for repairs:</strong> 48 hours notice required (up from 24 hours on 1 May 2025)</li>
        <li><strong>Emergency:</strong> No notice required</li>
      </ul>
      <p>
        Entry between 8am and 6pm, not Sundays or public holidays unless the
        tenant agrees. Landlords must not enter more than is reasonably
        necessary.
      </p>

      <h2 id="pets">Pet ownership rules</h2>
      <p>
        Since 1 October 2022, Queensland landlords <strong>cannot
        unreasonably refuse</strong> a tenant’s request to keep a pet.
        Acceptable grounds for refusal:
      </p>
      <ul>
        <li>The pet is unsuitable for the property (e.g. large dog in a small unit)</li>
        <li>Body corporate by-laws prohibit pets</li>
        <li>The number of pets would be unreasonable</li>
      </ul>
      <p>
        Landlords must respond to a pet request within 14 days. If they refuse,
        they must provide written reasons. Tenants can dispute an unreasonable
        refusal through the RTA.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>End of fixed term</td><td>2 weeks (14 days)</td><td>2 months (the end of the fixed term is itself an approved reason)</td></tr>
          <tr><td>Periodic</td><td>2 weeks</td><td>2 months, with an approved reason (e.g. sale contract, owner moving in, renovations)</td></tr>
          <tr><td>Unremedied breach (after a Notice to remedy breach)</td><td>7 days</td><td>14 days (7 days for rent arrears)</td></tr>
        </tbody>
      </table>
      <p>
        Check with the RTA for current notice periods and the full list of
        approved reasons.
      </p>

      <h2 id="grounds-reform">Grounds for ending a tenancy</h2>
      <p>
        Since 1 October 2022, QLD landlords must have an approved reason to end
        a tenancy. The option to end a tenancy without grounds was removed.
        Approved reasons include:
      </p>
      <ul>
        <li>End of a fixed term agreement (at least 2 months notice)</li>
        <li>Property sold requiring vacant possession</li>
        <li>Owner or family member moving into the property</li>
        <li>Major renovations or demolition</li>
        <li>Serious or repeated breach of the agreement by the tenant</li>
      </ul>
      <p>
        Visit{" "}
        <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer">rta.qld.gov.au</a>{" "}
        for the full list of approved reasons and notice periods.
      </p>

      <h2 id="disputes">Resolving disputes, RTA &amp; QCAT</h2>
      <p>QLD has a two-step dispute resolution process:</p>
      <ol>
        <li>
          <strong>RTA Dispute Resolution Service:</strong> Free, phone-based
          conciliation, available to both landlords and tenants. Most disputes
          resolve here without going to tribunal.
        </li>
        <li>
          <strong>QCAT (Queensland Civil and Administrative Tribunal):</strong>{" "}
          If conciliation fails, either party can apply for a formal decision.
          Applications can be lodged online.
        </li>
      </ol>

      <KeyFigure
        value="1300 366 311"
        label="The RTA’s contact number (cost of a local call). Its dispute resolution service is free."
        context="Most QLD tenancy disputes are resolved without going to QCAT"
      />

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Residential Tenancies Authority (RTA)</strong>:{" "}
          <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer">rta.qld.gov.au</a>
        </li>
        <li>
          <strong>Tenants Queensland</strong>, free advice:{" "}
          <a href="https://www.tenantsqld.org.au" target="_blank" rel="noopener noreferrer">tenantsqld.org.au</a>
        </li>
        <li>
          <strong>QCAT</strong>:{" "}
          <a href="https://www.qcat.qld.gov.au" target="_blank" rel="noopener noreferrer">qcat.qld.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
