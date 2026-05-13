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
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Renter's Rights in Queensland: Complete Guide (2026)",
  description:
    "QLD tenant rights: bond, rent increases, repairs, entry, pet ownership reforms, and the 2024 grounds-based eviction laws. Includes RTA and QCAT dispute info.",
  slug: "renters-rights-qld",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 10,
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
  "QLD's 2024 reforms moved toward grounds-based evictions (similar to VIC 2021), and made it harder to unreasonably refuse pets.",
  "Maximum bond is 4 weeks rent. Lodged with the Residential Tenancies Authority (RTA) within 10 days.",
  "Rent increases capped at one per 12 months with at least 2 months (60 days) written notice.",
  "Three repair tiers: emergency (immediate), urgent (24 to 48 hours), non-urgent (reasonable time, often 7 days for minor issues).",
  "Routine inspections require 7 days notice and the first inspection can't occur until 3 months after the tenancy starts. Max 4 per year.",
  "Two-step dispute resolution: free RTA conciliation first, then QCAT if it fails.",
];

const TOC: GuideTOCEntry[] = [
  { id: "act",            label: "QLD Residential Tenancies Act" },
  { id: "bond",           label: "Bond rules" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "entry-rights",   label: "Landlord entry rights" },
  { id: "pets",           label: "Pet ownership (2024 reforms)" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "grounds-reform", label: "Grounds for ending tenancy (2024)" },
  { id: "disputes",       label: "Resolving disputes (RTA & QCAT)" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my QLD landlord still issue a no-grounds eviction?",
    answer:
      "Increasingly no. The 2024 reforms moved Queensland toward grounds-based evictions (similar to VIC's 2021 model). Implementation has been phased in, so transitional rules may still apply in some scenarios. Always verify current rules with the RTA before relying on a notice.",
  },
  {
    question: "How fast must emergency repairs be done in QLD?",
    answer:
      "Immediately. Emergencies include burst water pipes, gas leaks, serious roof damage, breakdown of essential services. If the landlord can't be reached, you can arrange emergency repairs up to $300 yourself and reclaim the cost. Urgent (non-emergency) repairs must be addressed within 24 to 48 hours.",
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
      "It's a free, phone-based conciliation service. Either party can request it. Most disputes are resolved here without going to QCAT. If conciliation fails, you can apply to QCAT for a formal decision. Contact the RTA on 1800 512 888.",
  },
  {
    question: "Can rent be increased during a fixed-term lease in QLD?",
    answer:
      "Only if the amount or method of calculation is specified in the lease. Without that, the landlord can't unilaterally increase rent during a fixed term. They can give notice for an increase that takes effect after the fixed term ends, with at least 2 months notice.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",      href: "/guides/renters-rights-nsw", description: "Compare QLD reforms to NSW where no-grounds evictions remain." },
  { title: "Renter's Rights in Victoria", href: "/guides/renters-rights-vic", description: "VIC's 2021 reforms that QLD is moving toward." },
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

      <Callout variant="info" title="2024 QLD reforms">
        <p>
          QLD introduced new laws in 2024 requiring landlords to have valid
          grounds for ending a tenancy (similar to Victoria's 2021 reforms) and
          making it harder to unreasonably refuse pets. Implementation has been
          phased, so check the RTA for the current position on each provision.
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
        Queensland updated its tenancy laws in 2024, introducing grounds-based
        eviction rules and enhanced pet rights.
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks rent (higher allowable thresholds for very high rent, check RTA for current limits)</li>
        <li><strong>Lodgement:</strong> Lodged with the RTA within 10 days of the tenancy starting; you should receive a receipt</li>
        <li><strong>Refund:</strong> At end of tenancy, both parties can agree to a refund via the RTA's online system; disputes go to the RTA dispute resolution service or QCAT</li>
      </ul>
      <p>
        Complete a detailed property condition report on move-in and request a
        signed copy. Take dated photographs, this is critical for bond refunds.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li><strong>Frequency:</strong> No more than once every 12 months (fixed-term and periodic)</li>
        <li><strong>Notice:</strong> At least 2 months (60 days) written notice</li>
        <li>For fixed-term agreements, the increase amount must be specified in the agreement</li>
      </ul>
      <p>
        QLD doesn't cap the amount of an increase, only the frequency and
        notice. If you believe an increase is excessive, seek advice from the
        RTA.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>QLD categorises repairs into three levels:</p>

      <h3>Emergency repairs</h3>
      <p>
        Must be addressed <strong>immediately</strong>. Examples: burst water
        pipe, gas leak, serious roof damage after storm, breakdown of essential
        services. If the landlord can't be reached, tenants can arrange
        emergency repairs themselves up to $300 and reclaim the cost.
      </p>

      <h3>Urgent repairs</h3>
      <p>
        Must be attended to within <strong>24 to 48 hours</strong>. Examples:
        broken water heater, fridge failure (if included in lease), broken pool
        gate.
      </p>

      <h3>Non-urgent repairs</h3>
      <p>
        Should be addressed within a <strong>reasonable time</strong>, typically
        7 days after written notice for minor repairs, longer for complex works.
        Always request repairs in writing and keep copies.
      </p>

      <h2 id="entry-rights">Landlord entry rights</h2>
      <ul>
        <li><strong>Routine inspections:</strong> Maximum 4 per year. The first inspection can't occur until at least 3 months after tenancy starts. <strong>7 days written notice</strong> required.</li>
        <li><strong>General entry for repairs:</strong> 24 hours notice required</li>
        <li><strong>Emergency:</strong> No notice required</li>
      </ul>
      <p>
        Entry between 8am and 6pm, not Sundays or public holidays unless the
        tenant agrees. Landlords must not enter more than is reasonably
        necessary.
      </p>

      <h2 id="pets">Pet ownership, 2024 reforms</h2>
      <p>
        Following the 2024 reforms, Queensland landlords <strong>cannot
        unreasonably refuse</strong> a tenant's request to keep a pet.
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
          <tr><td>End of fixed term</td><td>2 weeks (14 days)</td><td>Must have valid reason (post-2024)</td></tr>
          <tr><td>Periodic, no grounds (pre-2024 rules)</td><td>2 weeks</td><td>2 months (transitional)</td></tr>
          <tr><td>With grounds (e.g. serious breach)</td><td>-</td><td>1 month (or as specified)</td></tr>
        </tbody>
      </table>
      <p>
        Check with the RTA for current notice periods, transitional provisions
        from the 2024 reforms may still apply.
      </p>

      <h2 id="grounds-reform">Grounds for ending tenancy, 2024 reforms</h2>
      <p>
        QLD introduced legislation in 2024 requiring landlords to have valid
        grounds to end a tenancy, moving toward the model adopted by Victoria
        in 2021. Valid grounds include:
      </p>
      <ul>
        <li>Property sold requiring vacant possession</li>
        <li>Owner or family member moving into the property</li>
        <li>Major renovations or demolition</li>
        <li>Serious or repeated breach of the agreement by the tenant</li>
      </ul>
      <p>
        Implementation has been phased. Visit{" "}
        <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer">rta.qld.gov.au</a>{" "}
        for the current status of all 2024 reform provisions.
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
        value="1800 512 888"
        label="The RTA Dispute Resolution Service number, free to use."
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
