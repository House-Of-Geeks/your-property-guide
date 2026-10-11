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
import { TAS_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the Consumer Affairs Tasmania pages in
// TAS_RENTERS_SOURCES, read 11 October 2026. Until this rewrite the guide
// said Tasmania allows no-grounds notices on periodic leases (commercial-
// intent review, 10 Oct 2026, renting 0.4).
const FRONTMATTER: GuideFrontmatter = {
  title: "Renters' Rights in Tasmania (2026): Current Rules",
  h1: "Renters' rights in Tasmania (2026)",
  description:
    "Tasmanian renting rules as at October 2026: when a landlord can end a lease, notice periods, rent increases, bond, inspections, repairs, pets and disputes.",
  slug: "renters-rights-tas",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 9,
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
  "On a non-fixed term lease a Tasmanian landlord can give notice only for a listed reason: a sale, significant renovation, a family member moving in, the home leaving the rental market (42 days), or a breach (14 days).",
  "On a fixed-term lease the landlord can't end it early unless you breach it; to end it at its end date they must serve a Notice to Vacate 42 to 60 days before that date.",
  "Rent can rise only with at least 60 days' written notice and, in most cases, only once 12 months have passed since the tenancy started or was renewed at a new rent.",
  "The bond can't be more than 4 weeks' rent and can't be increased during the tenancy. Pet bonds are not allowed. The Rental Deposit Authority holds every bond through MyBond.",
  "Routine inspections: no more than once every 3 months (including once in the first month) unless you agree in writing, with at least 24 hours' notice.",
  "A landlord can refuse a pet only on reasonable grounds and in most cases must apply to the Tasmanian Civil and Administrative Tribunal (TASCAT) to do so.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "The Residential Tenancy Act 1997" },
  { id: "ending-tenancy", label: "Ending a lease: reasons and notice" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "bond",           label: "Bond and up-front costs" },
  { id: "inspections",    label: "Routine inspections" },
  { id: "repairs",        label: "Urgent and emergency repairs" },
  { id: "pets",           label: "Pets" },
  { id: "family-violence",label: "Family violence" },
  { id: "disputes",       label: "Resolving disputes" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord evict me without a reason in Tasmania?",
    answer:
      "Not on a non-fixed term lease: the landlord needs a listed reason, such as a sale, significant renovation, a family member moving in or the home no longer being rented (42 days' notice), or a breach (14 days). A fixed-term lease can't be ended early unless you breach it, but the landlord can end it at its end date with a Notice to Vacate served 42 to 60 days before (Consumer Affairs Tasmania, updated 17 July 2026).",
  },
  {
    question: "How often can my rent be increased in Tasmania?",
    answer:
      "The landlord must give at least 60 days' written notice of the new rent and the day it starts, and the rent can rise only if a written lease allows it or the lease isn't in writing. In most cases it can rise only at the start, renewal or extension of a lease, and not until 12 months after the tenancy began. You can ask the Residential Tenancy Commissioner to review an unreasonable increase (Consumer Affairs Tasmania).",
  },
  {
    question: "What's the bond rule in Tasmania?",
    answer:
      "No more than 4 weeks' rent, and it can't be increased during the tenancy. Pet bonds are not allowed. The Rental Deposit Authority holds all bonds through MyBond; a property owner can't take the bond themselves, and an agent who takes it must lodge it within 10 working days (Consumer Affairs Tasmania, Rental bond lodgement).",
  },
  {
    question: "How often can a landlord inspect in Tasmania?",
    answer:
      "No more than once every 3 months, including once in the first month, unless you agree in writing, and with at least 24 hours' notice. A routine inspection checks the property's condition and maintenance needs; it isn't a housework inspection (Consumer Affairs Tasmania, Privacy and access, updated 15 September 2020).",
  },
  {
    question: "What counts as an urgent repair in Tasmania?",
    answer:
      "An essential service that stops working: water, sewerage or waste water removal, electricity, heating, the cooking stove or the hot water service. The owner must fix it as soon as possible; if they can't be contacted within 24 hours you can use the nominated repairer or, failing that, a suitably qualified repairer, and the owner must repay you within 14 days of receiving the invoice, receipt and the repairer's statement (Consumer Affairs Tasmania).",
  },
  {
    question: "Can my landlord refuse a pet in Tasmania?",
    answer:
      "Only on reasonable grounds, and in most cases the owner must apply to the Tasmanian Civil and Administrative Tribunal (TASCAT) to validate a refusal. You ask on the approved Request to Keep a Pet form (Form 36R or 36S), and pet bonds are not allowed (Consumer Affairs Tasmania, Pets in rental properties, updated 20 March 2026).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["NSW", "VIC", "QLD", "WA"]),
  { title: "First Home Buyer Guide TAS", href: "/guides/first-home-buyer-tas", description: "When you're ready to stop renting and buy your first home." },
];

const S = TAS_RENTERS_SOURCES;

export default function RentersRightsTASPage() {
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
          Earlier versions of this guide (reviewed April 2026) said a
          Tasmanian landlord could end a periodic lease without grounds on 42
          days&apos; notice, that rent increases needed 42 days&apos; notice,
          that inspections were capped at four a year, and that Tasmania has
          no tribunal involved in tenancies. Consumer Affairs Tasmania lists
          the reasons a landlord needs for a non-fixed term lease, 60
          days&apos; notice for a rent increase, inspections no more than once
          every 3 months, and TASCAT for pet refusals. We have rewritten the
          guide from the pages listed at the end.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Check the
          current rules with{" "}
          <a href="https://consumeraffairs.tas.gov.au/topics/housing/renting" target="_blank" rel="noopener noreferrer">
            Consumer Affairs Tasmania
          </a>{" "}
          or the Tenants&apos; Union of Tasmania before you act.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancy Act 1997</h2>
      <p className="lead">
        Renting in Tasmania is governed by the Residential Tenancy Act 1997. A
        landlord needs a listed reason to end a non-fixed term lease, and can
        end a fixed-term lease only at its end date or for a breach. Consumer
        Affairs Tasmania (CAT) gives renting information through Rental
        Services, the Residential Tenancy Commissioner decides bond disputes
        and rent reviews, the Rental Deposit Authority holds bonds, and the
        Magistrates Court and the Tasmanian Civil and Administrative Tribunal
        (TASCAT) decide disputes.
      </p>

      <h2 id="ending-tenancy">Ending a lease: reasons and notice</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Landlord ends a fixed-term lease at its end date (Notice to Vacate)</td><td>42 days, served no more than 60 days before the end date</td></tr>
          <tr><td>Landlord ends a non-fixed term lease: sale or transfer, significant renovation, a family member moving in, or no longer renting the home</td><td>42 days</td></tr>
          <tr><td>Landlord ends either kind of lease for a breach or substantial nuisance</td><td>14 days (no effect if you fix the breach within 14 days)</td></tr>
          <tr><td>A lender sells the property to recover a debt</td><td>60 days</td></tr>
          <tr><td>Tenant ends a non-fixed term lease</td><td>14 days</td></tr>
          <tr><td>Tenant ends a lease for the owner&apos;s breach (Notice to terminate)</td><td>14 days</td></tr>
        </tbody>
      </table>
      <p>
        A fixed-term lease can&apos;t be ended early because the property is
        sold. If a fixed term ends with no Notice to Vacate, no renewal and you
        stay on, it becomes a non-fixed term lease. A notice for a sale must
        come with proof of the sale. &ldquo;Family&rdquo; means the
        owner&apos;s partner, child or parent, a parent of their partner, or a
        dependant who lives with them; &ldquo;significantly renovated&rdquo;
        means the home would be unfit or unsafe to live in during the work. If
        the wrong notice is given, you only have to leave the day after the
        correct notice would have ended. You don&apos;t have to give notice
        that you won&apos;t renew a fixed term, but telling the owner early
        helps.
      </p>
      <p>
        If the owner fails to do general repairs within 28 days of being told,
        you can give a 14-day Notice to terminate for that breach.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li>The landlord must give at least <strong>60 days&apos; written notice</strong> stating the new rent and the day it starts.</li>
        <li>Rent can rise only if a written lease allows it, or the lease isn&apos;t in writing.</li>
        <li>In most cases it can rise only at the start, renewal or extension of a lease, and not until <strong>12 months</strong> after the tenancy began, even if a shorter lease is renewed.</li>
      </ul>
      <KeyFigure
        value="60 days"
        label="Minimum written notice of a rent increase in Tasmania."
        context="Consumer Affairs Tasmania, Rent increases, updated 2 July 2020"
      />
      <p>
        If you think an increase is unreasonably high, you can apply to the
        Residential Tenancy Commissioner for a review. The Commissioner checks
        the notice was valid and compares the rent with similar properties,
        and can set a different amount; either side can appeal to the
        Magistrates Court within 60 days.
      </p>

      <h2 id="bond">Bond and up-front costs</h2>
      <ul>
        <li><strong>Maximum bond:</strong> 4 weeks&apos; rent, and it can&apos;t be increased during the tenancy.</li>
        <li><strong>No pet bond:</strong> only one bond is allowed for a tenancy.</li>
        <li><strong>Lodging:</strong> the Rental Deposit Authority holds every bond through MyBond. A property owner can&apos;t take the bond directly; an agent who takes it must lodge it within 10 working days.</li>
        <li><strong>Up-front costs:</strong> the only allowed are the bond, rent in advance for the first payment period, and a holding fee if the owner holds a vacant property for more than 7 days. No application fees.</li>
      </ul>

      <h2 id="inspections">Routine inspections</h2>
      <p>
        Routine inspections can&apos;t happen more than once every 3 months,
        including once in the first month, unless you agree in writing, and
        you must get at least 24 hours&apos; notice. An inspection checks the
        property&apos;s condition and maintenance; it isn&apos;t a housework
        inspection.
      </p>

      <h2 id="repairs">Urgent and emergency repairs</h2>
      <p>
        <strong>Urgent repairs</strong> are an essential service that stops
        working: water, sewerage or waste water removal, electricity, heating,
        the cooking stove or the hot water service.{" "}
        <strong>Emergency repairs</strong> are damage that will get worse if
        it isn&apos;t fixed quickly, such as a window broken in a storm. The
        owner must have both done as soon as possible.
      </p>
      <p>
        If you can&apos;t contact the owner within 24 hours, use the nominated
        repairer named in the lease or, if there isn&apos;t one, a suitably
        qualified repairer. Pay the invoice, then give the owner the
        repairer&apos;s statement of the cause, the invoice and the receipt;
        the owner must repay you within 14 days unless they apply to the court
        to dispute it.
      </p>

      <h2 id="pets">Pets</h2>
      <p>
        Ask for consent on the approved Request to Keep a Pet form (Form 36R or
        36S). A landlord can refuse only on reasonable grounds, and in most
        cases must apply to TASCAT to validate the refusal. Pet bonds are not
        allowed (Consumer Affairs Tasmania, updated 20 March 2026).
      </p>

      <h2 id="family-violence">Family violence</h2>
      <p>
        If a court makes a Family Violence Order against a tenant, it can end
        their lease and make a new lease for the person affected. Call 000 in
        an emergency.
      </p>

      <h2 id="disputes">Resolving disputes</h2>
      <p>
        Raise the problem with the owner or agent first. Consumer Affairs
        Tasmania&apos;s Rental Services give information, and the Residential
        Tenancy Commissioner decides bond disputes and reviews unreasonable
        rent increases. The Magistrates Court hears appeals, repair-cost
        disputes and applications to end a lease for serious damage or
        injury, and TASCAT decides pet refusals. The Tenants&apos; Union of
        Tasmania gives tenants advice.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Consumer Affairs Tasmania</strong>, renting:{" "}
          <a href="https://consumeraffairs.tas.gov.au/topics/housing/renting" target="_blank" rel="noopener noreferrer">consumeraffairs.tas.gov.au</a>
        </li>
        <li>
          <strong>MyBond</strong> (Rental Deposit Authority):{" "}
          <a href="https://consumeraffairs.tas.gov.au/topics/housing/mybond" target="_blank" rel="noopener noreferrer">MyBond</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the Consumer Affairs Tasmania pages above, which apply the Residential Tenancy Act 1997 as amended. Several were last updated in 2018 to 2020; check them for later changes before you act.",
        ]}
      />
    </GuideArticleLayout>
  );
}
