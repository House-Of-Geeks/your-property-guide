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
import { NSW_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the NSW Government (NSW Fair Trading) pages in
// NSW_RENTERS_SOURCES, read 11 October 2026. The guide said no-grounds
// evictions were still legal until this rewrite (commercial-intent review,
// 10 Oct 2026, renting 0.2).
const FRONTMATTER: GuideFrontmatter = {
  title: "Renters' and Tenants' Rights in NSW (2026): The New Rules",
  h1: "Renters' and tenants' rights in NSW (2026)",
  description:
    "NSW renting rules as at October 2026: the reasons a landlord now needs to end a lease, notice periods, rent increases, bond, repairs, entry, pets and NCAT.",
  slug: "renters-rights-nsw",
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
  "Since 19 May 2025 a NSW landlord needs a reason to end a lease: on a periodic lease and at the end of a fixed term, including leases signed before that date.",
  "Rent can rise only once in 12 months on every type of lease (since 31 October 2024), with at least 60 days' written notice. There is no cap on the amount, but you can ask NCAT to review an excessive increase within 30 days of the notice.",
  "The bond cannot be more than 4 weeks' rent, and it is lodged with NSW Fair Trading through Rental Bonds Online.",
  "If you can't reach the landlord or agent about an urgent repair, a licensed tradesperson can do it and you are repaid up to $1,000 within 14 days.",
  "Routine inspections need at least 7 days' written notice, up to 4 times in 12 months. In most cases there is no entry on Sundays, public holidays or outside 8am to 8pm.",
  "Landlords must offer a free way to pay rent (bank transfer, and Centrepay since 2 March 2026) and cannot charge you for background checks or preparing the lease.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",              label: "The Act and the 2024 to 2026 changes" },
  { id: "what-changed",     label: "What changed on 19 May 2025" },
  { id: "lease-types",      label: "Fixed term and periodic leases" },
  { id: "notice-periods",   label: "Notice periods for ending a lease" },
  { id: "rent-increases",   label: "Rent increases" },
  { id: "paying-rent",      label: "Paying rent, Centrepay and fees" },
  { id: "bond",             label: "Bond and getting it back" },
  { id: "repairs",          label: "Repairs" },
  { id: "entry-rights",     label: "Landlord entry and inspections" },
  { id: "pets",             label: "Pets" },
  { id: "breaking-lease",   label: "Breaking a fixed-term lease" },
  { id: "domestic-violence",label: "Domestic violence protections" },
  { id: "red-flags",        label: "Red flags when renting" },
  { id: "disputes",         label: "Fair Trading and NCAT" },
  { id: "resources",        label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord evict me without a reason in NSW?",
    answer:
      "No. Since 19 May 2025 a NSW landlord must give a valid reason to end any lease, periodic or at the end of a fixed term, and this applies to leases signed before that date (NSW Fair Trading). Valid reasons include a breach by the tenant, a sale with vacant possession, significant renovations, the landlord or their family moving in and a change of use, and some need supporting documents with the notice.",
  },
  {
    question: "How often can my rent be increased in NSW?",
    answer:
      "Once in 12 months, on periodic and fixed-term leases alike, with at least 60 days' written notice. The once-a-year limit has applied to all lease types since 31 October 2024. NSW does not cap the size of an increase, but you can apply to NCAT within 30 days of the notice if you think it is excessive (NSW Government, read 11 October 2026).",
  },
  {
    question: "How much notice does a landlord have to give to end a lease in NSW?",
    answer:
      "For a proposed sale, significant renovations, a change of use or the landlord or their family moving in: 60 days on a fixed term of 6 months or less, and 90 days on a longer fixed term or a periodic lease. After an actual sale with vacant possession it is 30 days, and for a breach or unpaid rent 14 days (NSW Fair Trading, minimum notice periods, updated 19 May 2025).",
  },
  {
    question: "Can tenants refuse an open house in NSW?",
    answer:
      "Not if the rules are followed, but they are limited. To show the property to buyers, the landlord or agent must give 14 days' written notice before the first inspection; after that you are not obliged to agree to more than 2 inspections a week, with 48 hours' notice each time. Showing it to prospective tenants is allowed only in the last 14 days of the tenancy (NSW Fair Trading).",
  },
  {
    question: "What are red flags when renting in NSW?",
    answer:
      "A bond of more than 4 weeks' rent, a fee for a background check or for preparing the lease (prohibited since 31 October 2024), no free way to pay the rent, entry without the required notice, and a termination notice that gives no reason or no supporting documents. You can raise any of them with NSW Fair Trading on 13 32 20 (NSW Government, read 11 October 2026).",
  },
  {
    question: "How quickly do urgent repairs have to be done?",
    answer:
      "Contact the landlord or agent first, in writing if you can. If you can't reach them, or they are unwilling or taking too long, you can have a licensed tradesperson do the urgent repair and claim the cost up to $1,000, which must be repaid within 14 days of your notice. Urgent repairs include a gas leak, a burst water service, a blocked or broken toilet and a failed hot water service (NSW Government).",
  },
  {
    question: "Can I break my fixed-term lease early?",
    answer:
      "Yes, but on a lease of 3 years or less signed after 23 March 2020 a set break fee applies: 4 weeks' rent if less than a quarter of the term has passed, falling to 1 week's rent in the last quarter. You can end a lease immediately and without a break fee if you or your dependent child are in circumstances of domestic abuse (NSW Fair Trading, updated 21 September 2026).",
  },
  {
    question: "Can my landlord refuse a pet in NSW?",
    answer:
      "Only for the reasons the law allows. You apply on the standard pet application form, and the landlord has 21 days to respond; if they don't, the pet is approved without conditions. They can set reasonable conditions, and you don't need consent for an assistance animal (NSW Fair Trading, updated 8 October 2026).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["VIC", "QLD", "WA", "SA"]),
  { title: "First Home Buyer Guide NSW", href: "/guides/first-home-buyer-nsw", description: "When you're ready to stop renting and buy your first home." },
];

const S = NSW_RENTERS_SOURCES;

export default function RentersRightsNSWPage() {
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
          Earlier versions of this guide (reviewed April 2026) said NSW still
          allowed no-grounds evictions on periodic leases with 90 days&apos;
          notice, dated the once-a-year rent increase rule to 2023, and gave
          notice periods from before the changes. NSW ended no-grounds
          terminations on 19 May 2025, and rent increases have been limited to
          once a year on every lease type since 31 October 2024. We have
          rewritten the guide from the NSW Fair Trading pages listed at the end.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Laws change.
          Check the current rules with{" "}
          <a href="https://www.nsw.gov.au/departments-and-agencies/fair-trading" target="_blank" rel="noopener noreferrer">
            NSW Fair Trading
          </a>{" "}
          or a tenants&apos; advice service before you act.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancies Act 2010 and the 2024 to 2026 changes</h2>
      <p className="lead">
        Renting in NSW is governed by the Residential Tenancies Act 2010. NSW
        Fair Trading administers it, and disputes that can&apos;t be settled go
        to the NSW Civil and Administrative Tribunal (NCAT). Since 19 May 2025 a
        NSW landlord needs a reason to end a lease, and since 31 October 2024
        rent can rise only once in 12 months on every type of lease.
      </p>
      <p>The changes started in stages (NSW Fair Trading, updated 8 October 2026):</p>
      <ul>
        <li><strong>31 October 2024:</strong> rent increases limited to once a year for all lease types; fees at the start of a tenancy, such as background checks and preparing the agreement, expressly prohibited.</li>
        <li><strong>19 May 2025:</strong> landlords must give a valid reason to end a tenancy, with supporting documents for some reasons; longer notice where a landlord ends a fixed-term lease; easier to keep pets; tenants must be offered rent payment by bank transfer.</li>
        <li><strong>20 June 2025:</strong> changes to the supporting documents for ending a tenancy for significant renovations or repairs.</li>
        <li><strong>2 March 2026:</strong> tenants must be offered Centrepay as a way to pay rent.</li>
        <li><strong>10 August 2026:</strong> Smart Rental Bonds, an optional scheme to move your bond to your next rental.</li>
        <li><strong>21 September 2026:</strong> stronger protections for victim-survivors of domestic violence.</li>
        <li><strong>2 October 2026:</strong> tenants moving in with a pet can keep it while the landlord considers their request, if they apply within 7 days of starting the tenancy.</li>
      </ul>

      <h2 id="what-changed">What changed on 19 May 2025: reasons to end a lease, and pets</h2>
      <p>
        A landlord must now use a specific ground to end any lease: periodic,
        or at the end of a fixed term. This applies to tenancies that started
        before 19 May 2025 too. The reasons include:
      </p>
      <ul>
        <li>the tenant is at fault: a breach of the lease, damage, or unpaid rent;</li>
        <li>the property is being sold, or offered for sale, with vacant possession;</li>
        <li>the property needs to be empty for significant repairs or renovations, or will be demolished;</li>
        <li>the property will no longer be used as a rental home, for example it will become a business;</li>
        <li>the landlord or their family will move in;</li>
        <li>the tenant lives there as part of a job that has ended; no longer qualifies for an affordable or transitional housing program, or for purpose-built student accommodation; or the home is in a key worker housing program and is needed for a key worker.</li>
      </ul>
      <p>
        For some reasons the landlord must give supporting documents with the
        notice, such as the contract for sale or the agency agreement for a
        proposed sale. The notice must also come with a termination information
        statement. False or misleading documents are an offence, and heavy
        penalties apply to a notice given on a ground that isn&apos;t genuine.
      </p>
      <p>
        After using some grounds, the landlord can&apos;t re-let the property
        for a set time from the termination date: 4 weeks after significant
        renovations or repairs, 6 months after a proposed sale, demolition or
        the landlord or family moving in, and 12 months after a change of use
        (NSW Fair Trading, Landlord ending a tenancy).
      </p>
      <p>
        On pets, a landlord can now refuse consent only for the reasons the law
        allows; see <a href="#pets">Pets</a> below.
      </p>

      <h2 id="lease-types">Fixed term and periodic leases</h2>
      <ul>
        <li>
          <strong>Fixed term:</strong> a lease for a set period with an end
          date, such as 6 or 12 months. A landlord can&apos;t end it early
          except in special cases, such as a breach.
        </li>
        <li>
          <strong>Periodic:</strong> a lease with no end date. If a fixed term
          ends and no new agreement is signed, you move to a periodic agreement
          automatically.
        </li>
      </ul>

      <h2 id="notice-periods">Notice periods for ending a lease</h2>
      <p>
        The notice depends on the reason, the type of lease and its length
        (NSW Fair Trading, minimum notice periods, updated 19 May 2025). Days
        are calendar days, and a notice sent by post needs an extra 7 working
        days for delivery.
      </p>
      <table>
        <thead>
          <tr><th>Landlord&apos;s reason</th><th>Fixed term of 6 months or less</th><th>Fixed term over 6 months</th><th>Periodic</th></tr>
        </thead>
        <tbody>
          <tr><td>Proposed sale, significant renovations, change of use, landlord or family moving in</td><td>60 days</td><td>90 days</td><td>90 days</td></tr>
          <tr><td>Actual sale with vacant possession</td><td>30 days</td><td>30 days</td><td>30 days</td></tr>
          <tr><td>Breach of the agreement, or unpaid rent or charges</td><td>14 days</td><td>14 days</td><td>14 days</td></tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr><th>Tenant&apos;s notice</th><th>Fixed term</th><th>Periodic</th></tr>
        </thead>
        <tbody>
          <tr><td>End of a periodic lease, for any reason</td><td>n/a</td><td>21 days</td></tr>
          <tr><td>End of a fixed term</td><td>14 days</td><td>n/a</td></tr>
          <tr><td>Breach by the landlord</td><td>14 days</td><td>14 days</td></tr>
          <tr><td>Domestic violence termination</td><td>Immediate</td><td>Immediate</td></tr>
        </tbody>
      </table>
      <p>
        If you get a termination notice from the landlord you can leave before
        the date in it: any time on a periodic lease, with no rent after you
        leave, or with a 14-day early exit notice on a fixed term. If a notice
        is given because you tried to enforce your rights, such as asking for
        repairs, you can ask NCAT to find it retaliatory and of no effect.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li>Rent can&apos;t be raised in the first 12 months of a tenancy, and after an increase the landlord must wait at least <strong>12 months</strong> before the next one.</li>
        <li>This applies to periodic and fixed-term leases. The one exception is a fixed term of less than 2 years that began before 13 December 2024: its rent can rise only as the agreement itself sets out, until the fixed term ends.</li>
        <li>The landlord or agent must give <strong>at least 60 days&apos; written notice</strong>, stating the new rent and the date it starts.</li>
        <li>Renewing the lease doesn&apos;t restart the clock if the landlord and at least one tenant are the same and you haven&apos;t moved out.</li>
      </ul>

      <KeyFigure
        value="12 months / 60 days"
        label="Minimum gap between rent increases, and minimum written notice of one, in NSW."
        context="No cap on the amount; NCAT can review an excessive increase (NSW Government, read 11 October 2026)"
      />

      <p>
        If you think an increase is too high, compare it with the median rent
        for your postcode on the NSW Government&apos;s Rent Check tool and
        negotiate. If you can&apos;t agree, you can apply to NCAT{" "}
        <strong>within 30 days</strong> of getting the notice. You have to show
        the increase is excessive; the Tribunal looks at comparable rents, the
        state of the property and the landlord&apos;s costs, and can set the
        rent for the next 12 months.
      </p>

      <h2 id="paying-rent">Paying rent, Centrepay and fees</h2>
      <ul>
        <li>Landlords and agents must offer a way to pay rent with no extra fee: an electronic bank transfer (EFT, direct debit or BPAY), and since 2 March 2026 Centrepay, which takes rent straight from a Centrelink payment.</li>
        <li>You can&apos;t be made to use a particular app or service provider to pay.</li>
        <li>Since 31 October 2024 you can&apos;t be charged for a background check, for preparing the tenancy agreement or for other costs of searching for, applying for or starting a tenancy.</li>
      </ul>

      <h2 id="bond">Bond and getting it back</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks&apos; rent.</li>
        <li><strong>Where it goes:</strong> NSW Fair Trading holds it. Your agent or landlord must be registered with Rental Bonds Online and offer it as the first way to lodge, and Fair Trading sends you a receipt.</li>
        <li><strong>Moving rentals:</strong> since 10 August 2026, Smart Rental Bonds lets you move your existing bond to a new NSW rental instead of paying a second one up front.</li>
        <li><strong>Getting it back:</strong> claim the refund through Rental Bonds Online. If you claim without the landlord&apos;s agreement, they have 14 days to dispute it; if they don&apos;t, Fair Trading pays you after 14 days. A dispute that can&apos;t be settled goes to NCAT.</li>
      </ul>
      <p>
        The ingoing condition report is your best evidence in a bond dispute.
        Fill it in carefully, take dated photos and keep a copy.
      </p>

      <h2 id="repairs">Repairs</h2>
      <h3>Urgent repairs</h3>
      <p>
        Urgent repairs are for anything that threatens the structure, puts
        lives at risk, makes the home unsafe or insecure, or cuts off an
        essential service, for example:
      </p>
      <ul>
        <li>a gas leak or dangerous electrical fault;</li>
        <li>a burst water service or serious leak, or a blocked or broken toilet;</li>
        <li>failure of the gas, electricity or water supply, or of the hot water service;</li>
        <li>flooding, or serious storm, fire or roof damage;</li>
        <li>a broken stove or oven, heater or air conditioner, or smoke alarms that don&apos;t work.</li>
      </ul>
      <p>
        Tell the landlord or agent first, in writing if you can. If you
        can&apos;t reach them, or they are unwilling or taking too long, a
        licensed tradesperson (preferably one named in your lease) can do the
        work. Send the receipts: you are repaid up to <strong>$1,000</strong>,
        within 14 days of your notice. Don&apos;t stop paying rent while you
        wait.
      </p>
      <h3>Non-urgent repairs</h3>
      <p>
        Ask in writing, say what needs fixing and give a clear deadline, then
        follow up and keep copies. If the repair isn&apos;t done, NSW Fair
        Trading can take a complaint and may issue a rectification order, and the dispute can go to NCAT. Arrange a non-urgent repair
        yourself only with the landlord&apos;s written consent and agreement
        to pay.
      </p>

      <h2 id="entry-rights">Landlord entry and inspections</h2>
      <table>
        <thead>
          <tr><th>Reason for entry</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Routine inspection</td><td>7 days&apos; written notice, up to 4 times in 12 months</td></tr>
          <tr><td>Necessary repairs or maintenance, or health and safety checks</td><td>2 days</td></tr>
          <tr><td>Showing the property to buyers</td><td>14 days&apos; written notice before the first inspection; then no more than 2 a week, with 48 hours&apos; notice each, unless you agree</td></tr>
          <tr><td>Showing the property to new tenants</td><td>Reasonable notice, only in the last 14 days of the tenancy</td></tr>
          <tr><td>A valuation</td><td>7 days, once in 12 months</td></tr>
          <tr><td>Emergency or urgent repairs</td><td>None</td></tr>
        </tbody>
      </table>
      <p>
        In most cases entry is not allowed on Sundays, public holidays or
        outside 8am to 8pm, unless you agree. Since 21 September 2026 the
        landlord or agent must give 7 days&apos; notice before taking photos or
        video for advertising, and needs your written consent before
        publishing any that show your belongings. Entry outside these rules
        can be reported to NSW Fair Trading.
      </p>

      <h2 id="pets">Pets</h2>
      <ul>
        <li>You need the landlord&apos;s consent for a pet, but not for an assistance animal.</li>
        <li>Apply on the standard pet application form. The landlord has <strong>21 days</strong> to respond; if they don&apos;t, the pet is approved without conditions.</li>
        <li>The landlord can refuse only for the reasons the law allows, and can set reasonable conditions.</li>
        <li>Since 2 October 2026, if you apply within 7 days of starting a new tenancy, you can keep the pet at the property while the landlord decides.</li>
      </ul>

      <h2 id="breaking-lease">Breaking a fixed-term lease</h2>
      <p>
        On a fixed term of 3 years or less signed after 23 March 2020, a set
        break fee applies if you leave early (NSW Fair Trading, updated 21
        September 2026):
      </p>
      <table>
        <thead>
          <tr><th>Share of the fixed term that has passed</th><th>Break fee</th></tr>
        </thead>
        <tbody>
          <tr><td>Less than 25%</td><td>4 weeks&apos; rent</td></tr>
          <tr><td>25% to less than 50%</td><td>3 weeks&apos; rent</td></tr>
          <tr><td>50% to less than 75%</td><td>2 weeks&apos; rent</td></tr>
          <tr><td>75% or more</td><td>1 week&apos;s rent</td></tr>
        </tbody>
      </table>
      <p>
        On a lease of more than 3 years the landlord can claim reasonable
        compensation instead, and must show what they did to keep their losses
        down. No break fee applies when you end the lease because of domestic
        abuse.
      </p>

      <h2 id="domestic-violence">Domestic violence protections</h2>
      <p>
        If you or your dependent child are in circumstances of domestic abuse,
        you can end a periodic or fixed-term lease <strong>immediately, with no
        break fee</strong>, by giving a Domestic Violence Termination Notice
        with one of these as evidence: a certificate of conviction, a family
        violence injunction, a provisional, interim or final Domestic Violence
        Order, or a declaration by a competent person. You don&apos;t have to
        report to police or go to court to use a competent person&apos;s
        declaration.
      </p>
      <p>
        Since 21 September 2026 you don&apos;t have to tell co-tenants: the
        landlord or agent must notify each of them within 7 days, without
        showing them your notice or evidence. You are not liable for rent after
        the termination date, and NCAT can order co-tenants to repay your share
        of the bond.
      </p>
      <p>
        If you or your children are in immediate danger, call 000. The NSW
        Domestic Violence Line is 1800 656 463.
      </p>

      <h2 id="red-flags">Red flags when renting in NSW</h2>
      <ul>
        <li>A bond above 4 weeks&apos; rent, or a request to pay it anywhere other than through NSW Fair Trading.</li>
        <li>A fee for a background check, for preparing the lease, or for applying.</li>
        <li>No free way to pay the rent, or a requirement to use a particular app.</li>
        <li>A second rent increase within 12 months, or one with less than 60 days&apos; written notice.</li>
        <li>Entry without the notice in the table above.</li>
        <li>A termination notice with no reason, or without the supporting documents its reason needs.</li>
      </ul>

      <h2 id="disputes">NSW Fair Trading and NCAT</h2>
      <p>
        Start with the landlord or agent, in writing. NSW Fair Trading (13 32
        20, Monday to Friday 8:30am to 5pm) answers questions, takes complaints
        and can help settle a dispute. If that doesn&apos;t work, NCAT decides
        tenancy disputes, including bond claims, excessive rent increases,
        repair orders, unlawful entry and terminations. A tenants&apos; advice
        and advocacy service can help you prepare for a hearing.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>NSW Fair Trading</strong>, the tenancy regulator, 13 32 20:{" "}
          <a href="https://www.nsw.gov.au/departments-and-agencies/fair-trading" target="_blank" rel="noopener noreferrer">nsw.gov.au/fair-trading</a>
        </li>
        <li>
          <strong>Rental Bonds Online</strong>, lodge, check and claim your bond:{" "}
          <a href="https://www.nsw.gov.au/housing-and-construction/renting-a-place-to-live/residential-rental-bonds/rental-bonds-online-for-tenants" target="_blank" rel="noopener noreferrer">Rental Bonds Online for tenants</a>
        </li>
        <li>
          <strong>NCAT</strong>, apply to the Tribunal:{" "}
          <a href="https://www.ncat.nsw.gov.au" target="_blank" rel="noopener noreferrer">ncat.nsw.gov.au</a>
        </li>
        <li>
          <strong>Tenants&apos; Union of NSW</strong>, free advice and a search for your local advice service:{" "}
          <a href="https://www.tenants.org.au" target="_blank" rel="noopener noreferrer">tenants.org.au</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the NSW Government pages above, which cite the Residential Tenancies Act 2010 as amended. Where a page shows no last-updated date, the date we read it is given.",
        ]}
      />
    </GuideArticleLayout>
  );
}
