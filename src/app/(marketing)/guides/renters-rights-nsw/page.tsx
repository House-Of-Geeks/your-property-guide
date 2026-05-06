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
  title: "Renter's Rights in NSW: Complete Guide for Tenants (2026)",
  description:
    "Everything NSW tenants need to know: bond rules, rent increases, repairs, entry rights, ending a tenancy, and how to resolve disputes through NCAT.",
  slug: "renters-rights-nsw",
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
  "Maximum bond is 4 weeks rent. Lodged with NSW Fair Trading via Rental Bonds Online within 10 working days.",
  "Rent can only go up once every 12 months, with at least 60 days written notice. NSW has no cap on the amount of an increase.",
  "Urgent repairs must be addressed immediately; if the landlord can't be reached, tenants can arrange repairs up to $1,000 and reclaim costs.",
  "Landlord entry: 24 hours notice for general entry; 7 days notice for routine inspections (max 4 per year); no notice in genuine emergencies.",
  "No-grounds evictions are still permitted on periodic tenancies in NSW (90 days notice required), unlike VIC where they were abolished in 2021.",
  "Domestic violence victims can end a fixed-term lease immediately and without penalty, with appropriate evidence.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",              label: "NSW Residential Tenancies Act 2010" },
  { id: "lease-types",      label: "Lease types: fixed term vs periodic" },
  { id: "bond",             label: "Bond rules" },
  { id: "rent-increases",   label: "Rent increases" },
  { id: "repairs",          label: "Repairs and maintenance" },
  { id: "entry-rights",     label: "Landlord entry rights" },
  { id: "ending-tenancy",   label: "Ending a tenancy" },
  { id: "no-grounds",       label: "No-grounds evictions in NSW" },
  { id: "domestic-violence",label: "Domestic violence protections" },
  { id: "disputes",         label: "Resolving disputes via NCAT" },
  { id: "resources",        label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "How often can my rent be increased in NSW?",
    answer:
      "Once every 12 months. As of 2023, this applies to both fixed-term and periodic tenancies. The landlord must give at least 60 days written notice before the increase takes effect. NSW doesn't cap the amount of the increase, only the frequency and notice.",
  },
  {
    question: "Can my landlord evict me without a reason in NSW?",
    answer:
      "On a periodic tenancy, yes, but they must give 90 days written notice. This is no-grounds termination. On a fixed-term lease, the landlord generally can't end the tenancy without grounds during the fixed term.",
  },
  {
    question: "How quickly do urgent repairs have to be done?",
    answer:
      "Effectively immediately. Urgent repairs include burst water service, blocked toilet (with no other available), serious roof leak, gas leak, dangerous electrical fault, flooding, and failure of essential services. If the landlord can't be reached, you can arrange repairs up to $1,000 and reclaim the cost. Keep all receipts.",
  },
  {
    question: "Can the landlord turn up unannounced?",
    answer:
      "No. General entry requires 24 hours written notice, routine inspections need 7 days notice (max 4 per year), and entry must be between 8am and 8pm and not on Sundays or public holidays without consent. Emergency entry is the only no-notice exception.",
  },
  {
    question: "Will I get my full bond back?",
    answer:
      "If the property is in the same condition as on move-in (allowing for fair wear and tear), yes. Take dated photos on move-in day and keep your condition report, that's your strongest evidence in any bond dispute. Disputes go to NCAT.",
  },
  {
    question: "Can I break my fixed-term lease early?",
    answer:
      "Yes, but normally a break fee applies, calculated based on how far through the lease you are. Exemptions include domestic violence (lease can be ended immediately, no penalty, with appropriate evidence) and the property becoming uninhabitable.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renter's Rights in Victoria",     href: "/guides/renters-rights-vic", description: "Compare NSW with VIC's no-grounds-eviction ban." },
  { title: "Renter's Rights in Queensland",   href: "/guides/renters-rights-qld", description: "QLD tenant entitlements and the Residential Tenancies Authority." },
  { title: "Renter's Rights in WA",           href: "/guides/renters-rights-wa",  description: "WA's Residential Tenancies Act and entry rules." },
  { title: "Renter's Rights in SA",           href: "/guides/renters-rights-sa",  description: "SA tenant rules and SACAT dispute resolution." },
  { title: "First Home Buyer Guide NSW",      href: "/guides/first-home-buyer-nsw", description: "When you're ready to stop renting and buy your first home." },
];

export default function RentersRightsNSWPage() {
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
          <a href="https://www.fairtrading.nsw.gov.au" target="_blank" rel="noopener noreferrer">
            NSW Fair Trading
          </a>{" "}
          or the{" "}
          <a href="https://www.tenants.org.au" target="_blank" rel="noopener noreferrer">
            Tenants' Union NSW
          </a>{" "}
          before taking action.
        </p>
      </Callout>

      <h2 id="rta">The NSW Residential Tenancies Act 2010</h2>
      <p className="lead">
        The Residential Tenancies Act 2010 (NSW) is the primary legislation
        governing the relationship between landlords and tenants in NSW. It sets
        out the rights and responsibilities of both parties, from signing the
        lease through to bond refunds after vacating.
      </p>
      <p>
        Significant reforms were introduced in 2023, most notably requiring 12
        months between rent increases and strengthening protections for renters
        in periodic agreements. The Act is administered by NSW Fair Trading,
        and disputes are resolved through the NSW Civil and Administrative
        Tribunal (NCAT).
      </p>
      <p>
        The Act applies to most residential tenancies in NSW, including houses,
        apartments, and shared housing. Boarding houses and social housing have
        separate rules.
      </p>

      <h2 id="lease-types">Lease types, fixed term vs periodic</h2>
      <ul>
        <li>
          <strong>Fixed term:</strong> A lease with a defined start and end date
          (commonly 6 or 12 months). The landlord generally can't end the
          tenancy without grounds during this period, and the tenant can't leave
          without penalty unless an exemption applies (e.g. domestic violence,
          uninhabitable property).
        </li>
        <li>
          <strong>Periodic:</strong> A "rolling" agreement with no fixed end
          date, often what a fixed term becomes once it expires. Either party
          can end it with the correct notice.
        </li>
      </ul>
      <p>
        If you stay in the property after a fixed term ends without signing a
        new lease, your tenancy automatically becomes periodic on the same
        terms (including rent) until a new agreement is made.
      </p>

      <h2 id="bond">Bond rules</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks rent. A landlord can't legally ask for more.</li>
        <li><strong>Lodgement:</strong> The landlord or agent must lodge your bond with NSW Fair Trading via Rental Bonds Online within 10 working days. You should receive a receipt.</li>
        <li><strong>Refund:</strong> If the property is in the same condition as on move-in (allowing for fair wear and tear), the full bond must be refunded. Disputes go to NCAT.</li>
      </ul>
      <p>
        Take dated photos on move-in day and keep a copy of the condition
        report, that's your strongest evidence in any bond dispute.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <p>NSW introduced stricter rules in 2023:</p>
      <ul>
        <li>Minimum <strong>12 months</strong> between any two rent increases (both fixed-term and periodic)</li>
        <li>Minimum <strong>60 days written notice</strong> before any increase</li>
        <li>Rent can't be increased during a fixed-term lease unless the increase is specified in the agreement</li>
      </ul>

      <KeyFigure
        value="12 months / 60 days"
        label="Minimum gap between rent increases, and minimum notice required, in NSW."
        context="No cap on the amount of any single increase"
      />

      <p>
        If you believe a rent increase is excessive, you can apply to NCAT for
        review. NCAT considers comparable rents in the area. NSW doesn't cap the
        amount of an increase, only the frequency and notice.
      </p>

      <h2 id="repairs">Repairs and maintenance</h2>
      <p>
        Landlords are legally required to keep the rental in a reasonable state
        of repair.
      </p>

      <h3>Urgent repairs</h3>
      <p>Must be addressed as soon as possible. Under the Act, urgent repairs include:</p>
      <ul>
        <li>Burst water service or serious water leak</li>
        <li>Blocked or broken toilet (where no other is available)</li>
        <li>Serious roof leak</li>
        <li>Gas leak</li>
        <li>Dangerous electrical fault</li>
        <li>Flooding or serious flood damage</li>
        <li>Serious storm or fire damage</li>
        <li>Failure of gas, electricity, or water supply</li>
        <li>Failure of cooling/heating in extreme weather</li>
        <li>Fault in lift or staircase</li>
      </ul>
      <p>
        If the landlord can't be reached or fails to act, tenants may arrange
        urgent repairs themselves up to $1,000 and claim reimbursement. Keep all
        receipts.
      </p>

      <h3>Non-urgent repairs</h3>
      <p>
        For non-urgent repairs (a dripping tap, broken dishwasher), the
        landlord has <strong>14 days</strong> to respond after receiving written
        notice. Always request repairs in writing (email is fine) so you have a
        record. If the landlord doesn't act within 14 days, apply to NCAT for a
        repair order.
      </p>

      <h2 id="entry-rights">Landlord entry rights</h2>
      <ul>
        <li><strong>General entry:</strong> At least <strong>24 hours written notice</strong></li>
        <li><strong>Routine inspections:</strong> At least <strong>7 days written notice</strong>; no more than <strong>4 inspections per year</strong></li>
        <li><strong>Emergency:</strong> No notice required (suspected gas leak, flood, etc.)</li>
      </ul>
      <p>
        Entry must occur between 8am and 8pm, not on a Sunday or public holiday
        unless agreed by both parties. Entry without proper notice is a breach
        of the Act, document it and raise it with NSW Fair Trading or NCAT.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <p>
        Notice periods depend on the lease type and who's giving notice.
      </p>

      <table>
        <thead>
          <tr><th>Situation</th><th>Tenant notice</th><th>Landlord notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Fixed term, end of term</td><td>14 days</td><td>30 days</td></tr>
          <tr><td>Periodic, no grounds</td><td>21 days</td><td>90 days</td></tr>
          <tr><td>Periodic, with grounds (e.g. non-payment)</td><td>21 days</td><td>30 days (some grounds vary)</td></tr>
        </tbody>
      </table>

      <p>
        Breaking a fixed-term lease early generally requires a break fee
        calculated based on how far into the lease you are. Exemptions: domestic
        violence and the property becoming uninhabitable.
      </p>

      <h2 id="no-grounds">No-grounds evictions in NSW</h2>
      <p>
        Unlike Victoria, which abolished no-grounds evictions in 2021,{" "}
        <strong>NSW still permits no-grounds evictions</strong> on periodic
        tenancies. The landlord must give <strong>90 days notice</strong>.
      </p>
      <p>
        For fixed-term tenancies, the landlord can't end the tenancy without
        grounds during the fixed term (they can't evict mid-lease just to raise
        the rent).
      </p>
      <p>
        NSW tenant advocates have long campaigned to end no-grounds evictions.
        As of April 2026, the provisions remain in place but are subject to
        change. Check the Tenants' Union NSW website for updates.
      </p>

      <h2 id="domestic-violence">Domestic violence protections</h2>
      <p>NSW has specific protections for tenants experiencing domestic violence:</p>
      <ul>
        <li>A tenant can <strong>end a fixed-term lease immediately and without penalty</strong> with evidence such as a domestic violence order, police report, or statutory declaration.</li>
        <li>A co-tenant who is the perpetrator can be removed from the lease to protect the victim.</li>
        <li>Victims aren't liable for break fees or compensation related to early termination.</li>
      </ul>
      <p>
        If you're in immediate danger, call 000. For support: 1800RESPECT
        (1800 737 732) or DVConnect on 1800 811 811.
      </p>

      <h2 id="disputes">Resolving disputes, NCAT</h2>
      <p>The NSW Civil and Administrative Tribunal handles tenancy disputes:</p>
      <ul>
        <li>Bond disputes</li>
        <li>Rent increases</li>
        <li>Repair orders</li>
        <li>Unlawful entry</li>
        <li>Termination disputes</li>
      </ul>
      <p>
        NCAT applications are generally low-cost and accessible. Before
        applying, you can also try NSW Fair Trading's free dispute resolution
        service, which mediates between parties without the formality of a
        tribunal hearing. Lodge applications at ncat.nsw.gov.au.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>NSW Fair Trading</strong>, official tenancy regulator:{" "}
          <a href="https://www.fairtrading.nsw.gov.au" target="_blank" rel="noopener noreferrer">fairtrading.nsw.gov.au</a>
        </li>
        <li>
          <strong>Tenants' Union NSW</strong>, free advice and advocacy:{" "}
          <a href="https://www.tenants.org.au" target="_blank" rel="noopener noreferrer">tenants.org.au</a>
        </li>
        <li>
          <strong>Rental Bonds Online</strong>, check and manage your bond:{" "}
          <a href="https://www.fairtrading.nsw.gov.au/bonds" target="_blank" rel="noopener noreferrer">fairtrading.nsw.gov.au/bonds</a>
        </li>
        <li>
          <strong>NCAT</strong>, lodge a dispute:{" "}
          <a href="https://www.ncat.nsw.gov.au" target="_blank" rel="noopener noreferrer">ncat.nsw.gov.au</a>
        </li>
      </ul>
    </GuideArticleLayout>
  );
}
