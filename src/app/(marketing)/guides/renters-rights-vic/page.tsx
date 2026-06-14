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
  title: "Renter's Rights in Victoria: Complete Guide (2026)",
  description:
    "Victoria's renter rights: no-grounds evictions abolished, pet ownership, modification rights, bond rules, rent increases, and VCAT disputes.",
  slug: "renters-rights-vic",
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
  "Since March 2021, no-grounds evictions are abolished in Victoria. Landlords need a valid reason to end a tenancy.",
  "Renters can keep pets unless the landlord refuses on reasonable grounds and successfully applies to VCAT within 14 days. No pet bond allowed.",
  "Renters can make minor modifications (picture hooks, securing furniture, garden stakes) without landlord permission. Larger modifications need consent that can't be unreasonably refused.",
  "Maximum bond: 1 month's rent for properties up to $900/week, 2 months for properties above. Lodged with the RTBA within 10 business days.",
  "Rent can only go up once every 12 months with at least 60 days written notice. VCAT can review excessive increases.",
  "Urgent repairs must be addressed within 24 hours. Tenants can arrange repairs up to $2,500 and reclaim cost if landlord doesn't respond.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "Victorian Residential Tenancies Act" },
  { id: "bond",           label: "Bond rules" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "repairs",        label: "Repairs and maintenance" },
  { id: "entry-rights",   label: "Landlord entry rights" },
  { id: "modifications",  label: "Modifications to the property" },
  { id: "pets",           label: "Pet ownership" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "no-grounds",     label: "No-grounds evictions abolished" },
  { id: "disputes",       label: "Resolving disputes via VCAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord end my tenancy without a reason in Victoria?",
    answer:
      "No. Since March 2021, no-grounds notices to vacate are illegal in Victoria. Landlords must cite a legally valid reason, e.g. the property is sold and requires vacant possession, the owner is moving in, or major renovations are planned. If you suspect the stated reason isn't genuine (e.g. owner claims to move in then re-lists the property), you can challenge at VCAT.",
  },
  {
    question: "Can my landlord refuse to let me have a pet?",
    answer:
      "Only on reasonable grounds, and they must apply to VCAT within 14 days to formalise the refusal. Reasonable grounds include the property being unsuitable for the pet's size or council rules being breached. Landlords cannot charge a 'pet bond' in Victoria. Tenants remain responsible for any damage caused by their pet.",
  },
  {
    question: "What modifications can I make without asking the landlord?",
    answer:
      "Minor modifications since the 2021 reforms: hanging pictures with nails or hooks, installing curtain rods or blinds, securing furniture for safety, picture hooks, garden stakes, doormats. Larger changes (dishwasher, AC install, structural changes) need consent, which can't be unreasonably refused. You may need to restore the original condition when vacating.",
  },
  {
    question: "How fast must urgent repairs be done in Victoria?",
    answer:
      "Within 24 hours of being reported. Urgent repairs include burst pipes, gas leaks, dangerous electrical faults, serious flooding, failure of cooling/heating in extreme weather, and blocked sewers. If the landlord fails to respond, you can arrange repairs up to $2,500 (raised under the 2021 reforms) and reclaim the cost.",
  },
  {
    question: "How big a bond can the landlord demand?",
    answer:
      "1 month's rent for properties up to $900/week. 2 months' rent for properties above $900/week. Lodged with the Residential Tenancies Bond Authority (RTBA) within 10 business days. You can check your bond at rtba.vic.gov.au.",
  },
  {
    question: "What happens to a fixed-term lease at the end of the term?",
    answer:
      "If you stay without signing a new lease, it automatically becomes periodic on the same terms. Unlike NSW, the landlord can't issue a no-grounds notice on a periodic tenancy in Victoria; they still need a valid reason and the appropriate notice period (typically 60 days).",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in NSW",          href: "/guides/renters-rights-nsw", description: "Compare to NSW where no-grounds evictions are still permitted." },
  { title: "Renter's Rights in Queensland",   href: "/guides/renters-rights-qld", description: "QLD tenant entitlements and the Residential Tenancies Authority." },
  { title: "Renter's Rights in WA",           href: "/guides/renters-rights-wa",  description: "WA's Residential Tenancies Act and entry rules." },
  { title: "Renter's Rights in SA",           href: "/guides/renters-rights-sa",  description: "SA tenant rules and SACAT dispute resolution." },
  { title: "First Home Buyer Guide VIC",      href: "/guides/first-home-buyer-vic", description: "When you're ready to stop renting and buy your first home." },
];

export default function RentersRightsVICPage() {
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
          This guide is general information only, not legal advice. Laws change.
          Verify current rules with{" "}
          <a href="https://www.consumer.vic.gov.au/renting" target="_blank" rel="noopener noreferrer">
            Consumer Affairs Victoria
          </a>{" "}
          or{" "}
          <a href="https://www.tenantsvic.org.au" target="_blank" rel="noopener noreferrer">
            Tenants Victoria
          </a>{" "}
          before taking action.
        </p>
      </Callout>

      <Callout variant="info" title="Victoria leads the way">
        <p>
          Since March 2021, no-grounds evictions have been abolished in
          Victoria. Landlords must have a valid reason to end a tenancy.
          Victoria also has stronger pet rights and modification rights than
          most other states.
        </p>
      </Callout>

      <h2 id="rta">The Victorian Residential Tenancies Act 1997</h2>
      <p className="lead">
        The Residential Tenancies Act 1997 (VIC) governs all residential
        tenancies in Victoria. The Act was significantly reformed in March 2021,
        introducing some of the strongest renter protections in Australia,
        including the abolition of no-grounds evictions, expanded modification
        rights, and new pet ownership rules.
      </p>
      <p>
        The reforms added over 130 new minimum standards for rental properties.
        Properties must meet basic standards of habitability: working locks,
        functional heating, draught sealing, adequate lighting in bathrooms and
        laundries, and a vermin-proof rubbish bin.
      </p>
      <p>
        The Act is administered by Consumer Affairs Victoria, with disputes
        heard by the Victorian Civil and Administrative Tribunal (VCAT).
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 1 month's rent for properties up to $900/week, 2 months' rent for properties above $900/week.</li>
        <li><strong>Lodgement:</strong> The bond must be lodged with the Residential Tenancies Bond Authority (RTBA) within 10 business days. Check yours at rtba.vic.gov.au.</li>
        <li><strong>Claiming the bond:</strong> If both parties agree, the bond is refunded at the end of tenancy. Disputes go to VCAT.</li>
      </ul>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li><strong>Frequency:</strong> Once every 12 months, both fixed-term and periodic.</li>
        <li><strong>Notice:</strong> At least 60 days written notice.</li>
        <li><strong>Challenge:</strong> Apply to VCAT within 30 days of receiving notice if you believe the increase is excessive.</li>
      </ul>
      <p>
        During a fixed-term tenancy, rent can only be increased if the amount or
        method of calculation is specified in the agreement.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>
        Landlords must keep the property in good repair and compliant with
        health and safety laws.
      </p>

      <h3>Urgent repairs</h3>
      <p>
        Must be attended to within <strong>24 hours</strong> of being reported.
        These include burst pipes, gas leaks, dangerous electrical faults,
        serious flooding, failure of cooling/heating in extreme weather, and
        blocked sewers.
      </p>
      <p>
        If the landlord fails to respond, tenants may arrange repairs up to{" "}
        <strong>$2,500</strong> (raised under the 2021 reforms) and reclaim the
        cost.
      </p>

      <h3>Non-urgent repairs</h3>
      <p>
        Must be completed within <strong>14 days</strong> of written notice.
        Always document repair requests in writing and keep records of the
        landlord's response.
      </p>

      <h2 id="entry-rights">Landlord entry rights</h2>
      <ul>
        <li><strong>Routine inspections:</strong> Maximum 4 per year, at least 24 hours notice (no more than 14 days in advance)</li>
        <li><strong>General entry:</strong> At least 24 hours notice for most types of entry</li>
        <li><strong>Emergency:</strong> No notice required in genuine emergencies</li>
      </ul>
      <p>
        Entry must be between 8am and 6pm weekdays, or 9am and 6pm Saturdays.
        Not permitted on Sundays or public holidays without consent.
      </p>

      <h2 id="modifications">Modifications to the property</h2>
      <p>
        One of the most significant areas where VIC differs from other states.
        Since the 2021 reforms, renters can make <strong>minor
        modifications</strong> without landlord permission.
      </p>
      <ul>
        <li>Hanging pictures with nails or hooks</li>
        <li>Installing curtain rods or blinds</li>
        <li>Securing furniture to walls for safety</li>
        <li>Installing picture hooks, garden stakes, or doormats</li>
      </ul>
      <p>
        For larger modifications (installing a dishwasher, air conditioning,
        structural changes), the landlord's consent is required, but consent
        cannot be unreasonably refused. When vacating, the tenant typically
        restores the property to original condition (or the landlord may agree
        to leave modifications in place).
      </p>

      <h2 id="pets">Pet ownership</h2>
      <p>Victoria has some of the most progressive pet rules in Australia:</p>
      <ul>
        <li>Renters <strong>can keep pets</strong>, landlords can't simply refuse without reason</li>
        <li>Landlords may only refuse on <strong>reasonable grounds</strong> as defined in the Act (property unsuitable for the pet, council rules)</li>
        <li>If refused, the landlord must apply to VCAT within 14 days with their reasons; tenants can challenge the refusal</li>
      </ul>
      <p>
        Landlords <strong>cannot charge a "pet bond"</strong> in Victoria. Tenants
        remain responsible for any damage caused by their pet.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <p>
        The major 2021 reform: landlords must now have a <strong>valid
        reason</strong> to end a tenancy, no-grounds notices are no longer
        permitted.
      </p>
      <ul>
        <li>Property sold, buyer requires vacant possession, <strong>60 days notice</strong></li>
        <li>Major renovations or demolition, <strong>60 days notice</strong></li>
        <li>Owner or immediate family moving in, <strong>60 days notice</strong></li>
        <li>Significant breach of duties by the renter, VCAT order required</li>
      </ul>

      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>End of fixed term</td><td>28 days</td><td>Must have valid reason</td></tr>
          <tr><td>Periodic, sold (vacant possession)</td><td>N/A</td><td>60 days</td></tr>
          <tr><td>Periodic, major renovations</td><td>N/A</td><td>60 days</td></tr>
        </tbody>
      </table>

      <h2 id="no-grounds">No-grounds evictions, abolished in VIC</h2>
      <p>
        Since <strong>March 2021</strong>, it's illegal for a Victorian landlord
        to issue a no-grounds notice to vacate. Landlords cannot end your
        tenancy simply because they want to, without a legally valid reason.
      </p>

      <KeyFigure
        value="0"
        label="No-grounds evictions allowed in Victoria since March 2021."
        context="NSW still permits them on periodic tenancies"
      />

      <p>
        If you receive a notice that doesn't cite a valid reason, or you believe
        the stated reason isn't genuine (e.g. owner claims to move in, then
        re-lists the property), you can challenge it at VCAT. This protection
        applies to both fixed-term and periodic tenancies.
      </p>

      <h2 id="disputes">Resolving disputes, VCAT</h2>
      <p>
        VCAT handles tenancy disputes in Victoria. Applications can be made
        online and hearings are generally held within a few weeks for urgent
        matters.
      </p>
      <ul>
        <li>Bond disputes</li>
        <li>Repair orders</li>
        <li>Challenging rent increases</li>
        <li>Challenging notices to vacate</li>
        <li>Pet permission disputes</li>
      </ul>
      <p>
        Consumer Affairs Victoria also provides free dispute resolution services
        before going to VCAT.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Consumer Affairs Victoria</strong>:{" "}
          <a href="https://www.consumer.vic.gov.au/renting" target="_blank" rel="noopener noreferrer">consumer.vic.gov.au/renting</a>
        </li>
        <li>
          <strong>Tenants Victoria</strong>, free advice and advocacy:{" "}
          <a href="https://www.tenantsvic.org.au" target="_blank" rel="noopener noreferrer">tenantsvic.org.au</a>
        </li>
        <li>
          <strong>RTBA</strong>, check your bond:{" "}
          <a href="https://www.rtba.vic.gov.au" target="_blank" rel="noopener noreferrer">rtba.vic.gov.au</a>
        </li>
        <li>
          <strong>VCAT</strong>, lodging a dispute:{" "}
          <a href="https://www.vcat.vic.gov.au" target="_blank" rel="noopener noreferrer">vcat.vic.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
