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
import { SA_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the Consumer and Business Services and SA.GOV.AU
// pages in SA_RENTERS_SOURCES, read 11 October 2026. Until this rewrite the
// guide said SA still allowed no-grounds evictions (commercial-intent
// review, 10 Oct 2026, renting 0.4).
const FRONTMATTER: GuideFrontmatter = {
  title: "Renters' Rights in South Australia (2026): Current Rules",
  h1: "Renters' rights in South Australia (2026)",
  description:
    "SA renting rules as at October 2026: the prescribed reasons a landlord needs to end a lease, notice periods, rent increases, bond, entry, pets and SACAT.",
  slug: "renters-rights-sa",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
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
  "Since 1 July 2024 a South Australian landlord can end a periodic lease, or not renew a fixed-term lease, only for a prescribed reason, such as a breach or wanting to sell, renovate or live in the property.",
  "A landlord ending a fixed term at its end must give at least 60 days' notice (it was 28 days before July 2024); on a periodic lease it is 60 days where they need possession and 90 days for other specific reasons.",
  "Rent can rise only 12 months after the lease started or the last increase, with at least 60 days' written notice. There is no cap, but you can ask SACAT to declare an increase excessive within 90 days of the notice.",
  "The maximum bond is 4 weeks' rent where the rent is $800 a week or less, and 6 weeks' above that. Consumer and Business Services (CBS) holds it, and there is no separate pet bond.",
  "Routine inspections: up to 4 a year, with 7 to 28 days' written notice, for up to 2 hours. Entry is mostly limited to 8am to 8pm, not on Sundays or public holidays.",
  "A landlord must answer a pet application within 14 days and can refuse only on a ground the Act lists.",
];

const TOC: GuideTOCEntry[] = [
  { id: "act",            label: "The Residential Tenancies Act 1995" },
  { id: "what-changed",   label: "What changed on 1 July 2024" },
  { id: "ending-tenancy", label: "Ending a tenancy: reasons and notice" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "bond",           label: "Bond" },
  { id: "entry-rights",   label: "Landlord entry and inspections" },
  { id: "repairs",        label: "Repairs" },
  { id: "pets",           label: "Pets" },
  { id: "breaking-lease", label: "Breaking a fixed-term lease" },
  { id: "domestic-abuse", label: "Domestic abuse protections" },
  { id: "disputes",       label: "CBS and SACAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord still evict me without a reason in SA?",
    answer:
      "No. Since 1 July 2024 a South Australian landlord needs a prescribed reason to end a periodic tenancy or not renew a fixed-term lease, such as a breach by the tenant or wanting to sell, renovate or live in the property (Consumer and Business Services, 23 June 2024). The notice must use the prescribed form and come with the required evidence.",
  },
  {
    question: "How much notice must an SA landlord give to end a lease?",
    answer:
      "At least 60 days to end a fixed-term lease at the end of its term on a prescribed ground (28 days before July 2024). On a periodic lease, at least 60 days where the landlord needs possession and 90 days for other specific reasons. For a breach, such as rent unpaid for at least 14 days, the notice is 7 days (SA.GOV.AU, Lease agreements, updated 15 January 2026).",
  },
  {
    question: "How much notice do I have to give to move out in SA?",
    answer:
      "At least 21 days' written notice to end a periodic lease, or one month's if you pay rent monthly, and 28 days' notice to end a fixed-term lease at its end date; no reason is needed in either case. If the landlord gives you a termination notice, you can leave earlier by giving 7 days' written notice (SA.GOV.AU, Lease agreements, updated 15 January 2026).",
  },
  {
    question: "How much bond can my landlord ask for in SA?",
    answer:
      "Up to 4 weeks' rent if the weekly rent is $800 or less, and up to 6 weeks' rent above $800 a week (SA.GOV.AU, Maximum amount of bond). The bond is lodged with Consumer and Business Services, which holds it in trust, and the landlord must give you a receipt within 48 hours. A landlord cannot charge a separate pet bond.",
  },
  {
    question: "How often can rent go up in SA, and can I challenge an increase?",
    answer:
      "Only once 12 months have passed since the lease started or the rent last rose, and only with at least 60 days' written notice; during a fixed term only if the lease says how the increase is worked out. There is no limit on the amount, but you can apply to SACAT within 90 days of the notice to have it declared excessive (SA.GOV.AU, Increasing the rent, updated 8 May 2026).",
  },
  {
    question: "How often can my landlord inspect the property in SA?",
    answer:
      "Up to 4 times a year unless SACAT orders otherwise, with 7 to 28 days' written notice each time, for up to 2 hours. Most entry is limited to 8am to 8pm on days other than Sundays and public holidays, and you must get 7 days' written notice if photos or video that may show your belongings are to be taken for publishing (SA.GOV.AU, updated 25 May 2026).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["NSW", "VIC", "QLD", "WA"]),
  { title: "First Home Buyer Guide SA", href: "/guides/first-home-buyer-sa", description: "When you're ready to stop renting and buy your first home." },
];

const S = SA_RENTERS_SOURCES;

export default function RentersRightsSAPage() {
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
          Earlier versions of this guide (reviewed April 2026) said South
          Australia still allowed no-grounds evictions on periodic leases with
          90 days&apos; notice, and gave the pre-2024 notice to end a fixed
          term, inspection and bond rules. Since 1 July 2024 a landlord needs a
          prescribed reason to end or not renew a lease. We have rewritten the
          guide from the Consumer and Business Services and SA.GOV.AU pages
          listed at the end.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Check the
          current rules with{" "}
          <a href="https://www.sa.gov.au/topics/housing/renting-and-letting" target="_blank" rel="noopener noreferrer">
            Consumer and Business Services
          </a>{" "}
          or a tenant advice service before you act.
        </p>
      </Callout>

      <h2 id="act">The Residential Tenancies Act 1995</h2>
      <p className="lead">
        Renting in South Australia is governed by the Residential Tenancies Act
        1995. Consumer and Business Services (CBS) administers it and holds
        bonds, and the South Australian Civil and Administrative Tribunal
        (SACAT) decides disputes. Since 1 July 2024 a landlord needs a
        prescribed reason to end a lease.
      </p>
      <p>Recent changes, by start date (CBS):</p>
      <ul>
        <li><strong>1 April 2023:</strong> the rent above which a landlord can ask for more than 4 weeks&apos; bond rose to $800 a week.</li>
        <li><strong>1 September 2023:</strong> soliciting rent bidding banned. A property must be advertised at a fixed rent, not a range, and a landlord or agent must not invite offers above it.</li>
        <li><strong>1 July 2024:</strong> the main reforms (below).</li>
        <li><strong>1 September 2025:</strong> a new reason to end a tenancy once the landlord signs a sales agency agreement with a registered agent to sell with vacant possession.</li>
        <li><strong>1 January 2026:</strong> landlords and agents must use the standard rental application (Form A1), one for each prospective tenant.</li>
      </ul>

      <h2 id="what-changed">What changed on 1 July 2024</h2>
      <ul>
        <li>Landlords need a prescribed ground to end or not renew a tenancy (CBS media release, 23 June 2024).</li>
        <li>The notice to end a fixed tenancy at its end rose from 28 days to 60 days.</li>
        <li>Tenants can keep pets with the landlord&apos;s approval, which can be refused only on grounds the Act lists.</li>
        <li>Rental properties must meet minimum housing standards when the tenant moves in.</li>
        <li>Tenants&apos; personal information is better protected, and there are more options for people experiencing domestic abuse.</li>
      </ul>

      <h2 id="ending-tenancy">Ending a tenancy: reasons and notice</h2>
      <p>
        A landlord can no longer end a periodic tenancy, or decline to renew a
        fixed-term lease, without giving a reason. The prescribed reasons
        include a breach by the tenant and the landlord intending to renovate
        or live in the property, or having signed a sales agency agreement to
        sell it with vacant possession. The notice must use the prescribed form
        and come with the evidence the regulations require.
      </p>
      <table>
        <thead>
          <tr><th>Situation</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Landlord ends a fixed term at its end, on a prescribed ground</td><td>60 days</td></tr>
          <tr><td>Landlord ends a periodic lease because they need possession</td><td>60 days</td></tr>
          <tr><td>Landlord ends a periodic lease for another specific reason</td><td>90 days</td></tr>
          <tr><td>Landlord ends a lease for a breach, such as rent unpaid for at least 14 days or damage</td><td>7 days</td></tr>
          <tr><td>Tenant ends a periodic lease, for any reason</td><td>21 days (one month if rent is paid monthly)</td></tr>
          <tr><td>Tenant ends a fixed term at its end, for any reason</td><td>28 days</td></tr>
          <tr><td>Tenant leaves after getting a landlord&apos;s termination notice</td><td>7 days</td></tr>
        </tbody>
      </table>
      <p>
        If nobody gives notice at the end of a fixed term, the lease continues
        as a periodic one. A landlord who ends a tenancy on a prescribed
        ground, such as to renovate or live in the property, must not let it
        to a new tenant within 6 months of giving notice unless SACAT agrees.
        SACAT can declare a termination notice ineffective
        if it was retaliatory: given wholly or partly because you applied to
        SACAT or acted to enforce your rights. A landlord can&apos;t take
        possession without a SACAT order if you don&apos;t leave.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li>Rent can rise only once <strong>12 months</strong> have passed since the agreement began or the rent last rose. This also applies when a fixed term becomes periodic, and to increases agreed by both sides.</li>
        <li>The landlord must give at least <strong>60 days&apos; written notice</strong>.</li>
        <li>During a fixed term, rent can rise only if the lease includes a condition saying how the increase is worked out, such as by CPI.</li>
        <li>The landlord must offer at least one electronic way to pay rent that doesn&apos;t involve a third party charging you a fee.</li>
      </ul>
      <KeyFigure
        value="12 months / 60 days"
        label="Minimum gap between rent increases, and minimum written notice of one, in South Australia."
        context="No cap on the amount; SACAT can declare an increase excessive (SA.GOV.AU, updated 8 May 2026)"
      />
      <p>
        There is no limit on how much rent can rise, but you can apply to
        SACAT <strong>within 90 days</strong> of the notice to have the
        increase declared excessive. SACAT looks at rents for comparable
        properties, the state and condition of the property, and whether the
        increase is disproportionate to the old rent.
      </p>

      <h2 id="bond">Bond</h2>
      <ul>
        <li><strong>Maximum:</strong> 4 weeks&apos; rent if the weekly rent is $800 or less; 6 weeks&apos; rent if it is more than $800.</li>
        <li><strong>Who holds it:</strong> CBS, in a trust account. The landlord can&apos;t use it during the tenancy and must give you a receipt within 48 hours of receiving it. Agents must lodge through Residential Bonds Online.</li>
        <li><strong>No pet bond:</strong> a landlord can set reasonable conditions for a pet but can&apos;t charge a separate pet bond.</li>
        <li><strong>Refunds:</strong> the bond comes back to you at the end unless some is claimed for cleaning, unpaid rent or other legitimate costs. Bonds are returned to co-tenants equally unless they agree otherwise or it is disputed, and disputes go to SACAT.</li>
      </ul>

      <h2 id="entry-rights">Landlord entry and inspections</h2>
      <table>
        <thead>
          <tr><th>Reason for entry</th><th>Notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Routine inspection, up to 4 a year, for up to 2 hours</td><td>7 to 28 days&apos; written notice</td></tr>
          <tr><td>Necessary repairs or maintenance</td><td>At least 48 hours</td></tr>
          <tr><td>Showing the property to buyers</td><td>No more than twice in 7 days, at a time agreed with you</td></tr>
          <tr><td>Showing the property to prospective tenants</td><td>Reasonable notice, in the last 28 days of the tenancy</td></tr>
          <tr><td>Another genuine purpose</td><td>7 to 14 days&apos; written notice, or your consent</td></tr>
          <tr><td>Emergency or urgent repairs</td><td>None</td></tr>
        </tbody>
      </table>
      <p>
        Most of the time a landlord can enter only from 8am to 8pm on a day
        that isn&apos;t a Sunday or public holiday. You must get 7 days&apos;
        written notice if photos or video that may show your belongings are to
        be taken for publishing, and your written agreement before they are
        published. You can be present, and the landlord must make a reasonable
        effort to reschedule to suit you.
      </p>

      <h2 id="repairs">Repairs</h2>
      <p>
        The landlord must carry out repairs within a reasonable time, even if
        you knew about the problem when you moved in. Report urgent problems,
        such as a gas leak, as soon as possible, and ask for other repairs in
        writing. The landlord can enter with at least 48 hours&apos; notice to
        repair, and needs no notice for urgent repairs.
      </p>
      <p>
        If the landlord refuses, you can apply to SACAT for the repairs to be
        done, for compensation or to end the tenancy, or have an urgent
        problem fixed by a licensed professional and give the landlord the
        invoice with a report of the cause and the work done.
      </p>

      <h2 id="pets">Pets</h2>
      <ul>
        <li>Apply on the prescribed pet application form. The landlord must respond in writing within <strong>14 days</strong>, or approval is presumed.</li>
        <li>A refusal must rest on a ground listed in the Act. A landlord can&apos;t state &ldquo;no pets allowed&rdquo; unless strata, community title, rooming house or park rules prohibit them.</li>
        <li>The landlord can set reasonable conditions, but can&apos;t charge a separate pet bond. If you think a refusal or a condition is unreasonable, you can apply to SACAT.</li>
      </ul>

      <h2 id="breaking-lease">Breaking a fixed-term lease</h2>
      <p>
        If you leave before a fixed term ends, the landlord can claim lost
        rent and a share of advertising and re-letting costs, but must try to
        re-let the property as soon as possible. Lost rent is capped: at most
        one month&apos;s rent where less than 24 months remain, and otherwise
        one month for each remaining year, up to 6 months in total. SACAT sets
        the formulas for the advertising and re-letting share.
      </p>

      <h2 id="domestic-abuse">Domestic abuse protections</h2>
      <p>
        A tenant experiencing domestic abuse can end the tenancy by giving the
        landlord a notice of termination with the prescribed evidence, without
        applying to SACAT, or can apply to SACAT to end it. A protected person
        with prescribed evidence can change locks without the landlord&apos;s
        permission if they give the landlord a key, and SACAT can refund a
        victim&apos;s share of the bond and hold a co-tenant responsible for
        damage they caused.
      </p>
      <p>
        If you are in immediate danger, call 000.
      </p>

      <h2 id="disputes">CBS and SACAT</h2>
      <p>
        Raise the problem with the landlord or agent in writing first. CBS
        tenancy advice is on 131 882 (option 2) or CBStenancyadvice@sa.gov.au.
        RentRight SA is the government-appointed tenant advice and advocacy
        service (CBS, June 2024). SACAT decides disputes, including bond
        claims, repair orders, excessive rent, pet refusals and terminations.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>SA.GOV.AU renting pages</strong> (Consumer and Business Services):{" "}
          <a href="https://www.sa.gov.au/topics/housing/renting-and-letting" target="_blank" rel="noopener noreferrer">sa.gov.au/renting</a>
        </li>
        <li>
          <strong>Residential Bonds Online</strong> (CBS):{" "}
          <a href="https://www.sa.gov.au/topics/housing/renting-and-letting/renting-privately/start-of-tenancy/lodging-a-bond" target="_blank" rel="noopener noreferrer">Lodging a bond</a>
        </li>
        <li>
          <strong>SACAT</strong>:{" "}
          <a href="https://www.sacat.sa.gov.au" target="_blank" rel="noopener noreferrer">sacat.sa.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the Consumer and Business Services and SA.GOV.AU pages above, which cite the Residential Tenancies Act 1995 as amended. Where a page shows no last-updated date, the date we read it is given.",
        ]}
      />
    </GuideArticleLayout>
  );
}
