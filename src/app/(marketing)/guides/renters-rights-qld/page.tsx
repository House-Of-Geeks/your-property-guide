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
import { QLD_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the Residential Tenancies Authority pages in
// QLD_RENTERS_SOURCES, read 11 October 2026. Until this rewrite the guide
// dated grounds-based evictions to 2024, kept a "no grounds (transitional)"
// notice row, and gave the wrong inspection, bond and repair rules
// (commercial-intent review, 10 Oct 2026, renting 0.4).
const FRONTMATTER: GuideFrontmatter = {
  title: "Tenant Rights in Queensland (2026): Renters' Rules Explained",
  h1: "Tenant and renter rights in Queensland (2026)",
  description:
    "Queensland renting rules as at October 2026: the approved reasons to end a tenancy, notice periods, rent increases, bond, entry, repairs, pets and disputes.",
  slug: "renters-rights-qld",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 11,
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
  "A Queensland landlord (property manager or owner) needs an approved reason to end a tenancy. The end of a fixed-term agreement is one, with at least 2 months' notice; on a periodic agreement there is no 'without grounds' notice for the landlord.",
  "Rent can rise only when at least 12 months have passed since the rent last rose for the property, even under a different tenant or owner, with at least 2 months' written notice.",
  "The maximum bond is 4 weeks' rent, including anything called a pet bond. It must be lodged with the Residential Tenancies Authority (RTA) within 10 days.",
  "Routine inspections: at most once every 3 months, with at least 7 days' notice on an Entry notice (Form 9). Entry is between 8am and 6pm, Monday to Saturday, unless you agree.",
  "If you can't reach the emergency repair contact, you can arrange emergency repairs up to the value of 4 weeks' rent and claim the cost.",
  "Disputes go to the RTA's free dispute resolution service first, then the Queensland Civil and Administrative Tribunal (QCAT).",
];

const TOC: GuideTOCEntry[] = [
  { id: "act",            label: "The Act and the 2021 to 2025 changes" },
  { id: "ending-tenancy", label: "Ending a tenancy: reasons and notice" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "bond",           label: "Bond" },
  { id: "entry-rights",   label: "Entry and routine inspections" },
  { id: "repairs",        label: "Repairs and minimum housing standards" },
  { id: "pets",           label: "Pets" },
  { id: "domestic-violence", label: "Domestic and family violence" },
  { id: "disputes",       label: "RTA dispute resolution and QCAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my Queensland landlord still end a tenancy without grounds?",
    answer:
      "Not on a periodic agreement: a property manager or owner must use an approved reason, such as a sale, the owner moving in, significant repairs or an unremedied breach. The end of a fixed-term agreement is itself an approved reason, with at least 2 months' notice on a Notice to leave (Form 12). Only a tenant can end a tenancy without grounds (Residential Tenancies Authority, read 11 October 2026).",
  },
  {
    question: "How often can rent go up in Queensland?",
    answer:
      "Only once 12 months have passed since the rent last rose for the property, even if that increase was under another tenant, agent or owner, and only with at least 2 months' written notice. During a fixed term the agreement itself must allow the increase. You can apply to QCAT within 30 days of the notice if you think an increase is excessive (Residential Tenancies Authority).",
  },
  {
    question: "What is the maximum bond in Queensland?",
    answer:
      "4 weeks' rent for a house, unit or rooming accommodation, and that cap covers every bond taken, whatever it is called, including a pet bond. The property manager or owner must give you a receipt and lodge the bond with the Residential Tenancies Authority within 10 days; it is an offence not to (RTA, Rental bond).",
  },
  {
    question: "How much notice for a routine inspection in Queensland?",
    answer:
      "At least 7 days, on an Entry notice (Form 9), and no more than once every 3 months unless you agree in writing. The notice must give a time or a 2-hour window, and entry is only between 8am and 6pm Monday to Saturday unless you agree. Most other entry, such as for repairs or a valuation, needs 48 hours' notice (Residential Tenancies Authority).",
  },
  {
    question: "What counts as an emergency repair in Queensland, and who can arrange it?",
    answer:
      "Emergency repairs are listed in the Act and include a burst water service, a blocked or broken toilet, a gas leak, a dangerous electrical fault, a failed hot water, cooking or heating appliance and anything needed to meet minimum housing standards. If you can't reach the emergency repair contact in the tenancy agreement within a reasonable time, you can arrange repairs up to the value of 4 weeks' rent and ask in writing to be repaid within at least 7 days (RTA).",
  },
  {
    question: "Can my landlord refuse a pet in Queensland?",
    answer:
      "Only with a reason. The property manager or owner must answer a written pet request (Form 21) within 14 days, stating whether they approve or refuse and either their conditions or their reason for refusing. If they don't respond within 14 days, or the response doesn't meet those requirements, the request is approved (Residential Tenancies Authority).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["NSW", "VIC", "WA", "SA"]),
  { title: "First Home Buyer Guide QLD", href: "/guides/first-home-buyer-qld", description: "When you're ready to stop renting and buy your first home." },
];

const S = QLD_RENTERS_SOURCES;

export default function RentersRightsQLDPage() {
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
          Earlier versions of this guide (reviewed April 2026) said Queensland
          moved toward grounds-based evictions in 2024 and showed a
          transitional &ldquo;no grounds&rdquo; notice for landlords. The RTA
          dates the changes to the approved reasons for ending a tenancy to
          2022. Earlier versions also said the first inspection had to wait 3
          months, that emergency repairs were limited to $300, and gave an
          outdated RTA phone number. We have rewritten the guide from the RTA
          pages listed at the end.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Check the
          current rules with the{" "}
          <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer">
            Residential Tenancies Authority (RTA)
          </a>{" "}
          before you act.
        </p>
      </Callout>

      <h2 id="act">The Act and the 2021 to 2025 changes</h2>
      <p className="lead">
        Renting in Queensland is governed by the Residential Tenancies and
        Rooming Accommodation Act 2008. A property manager or owner needs an
        approved reason to end a tenancy, and rent can rise only once in 12
        months for the property. The Residential Tenancies Authority (RTA)
        holds bonds and runs free dispute resolution; the Queensland Civil and
        Administrative Tribunal (QCAT) decides disputes.
      </p>
      <p>The changes by start date (RTA, Rental law changes):</p>
      <ul>
        <li><strong>2021:</strong> stronger protections for renters experiencing domestic and family violence.</li>
        <li><strong>2022:</strong> changes to the approved reasons for ending a tenancy, repair orders, and a framework for pets (pets from 1 October 2022).</li>
        <li><strong>1 July 2023:</strong> rent increases limited to once every 12 months.</li>
        <li><strong>1 September 2023 and 1 September 2024:</strong> minimum housing standards, first for new and renewed tenancies, then for all.</li>
        <li><strong>6 June 2024:</strong> rent bidding banned; the 12-month limit attached to the property, not the tenancy; limits on rent in advance at the start of a tenancy.</li>
        <li><strong>30 September 2024:</strong> maximum bond of 4 weeks&apos; rent; evidence required for bond claims; two ways to pay rent, one without more than usual bank costs.</li>
        <li><strong>1 May 2025:</strong> entry notice for most purposes rose from 24 to 48 hours; limits on entry after a notice to leave; a standard rental application form; a 28-day response to requests for fixtures and structural changes.</li>
      </ul>

      <h2 id="ending-tenancy">Ending a tenancy: reasons and notice</h2>
      <p>
        A property manager or owner can end a tenancy only for a reason the
        Act allows, on a Notice to leave (Form 12). Several reasons can&apos;t
        be used to end a fixed term early: the tenancy then ends on the later
        of the fixed term&apos;s end date and the end of the notice period.
      </p>
      <table>
        <thead>
          <tr><th>Landlord&apos;s reason</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>End of a fixed-term agreement</td><td>2 months</td></tr>
          <tr><td>Sale (the property must be vacant to sell or prepare for sale), owner or relative moving in, significant repairs or renovations, demolition or redevelopment, change of use</td><td>2 months (not to end a fixed term early)</td></tr>
          <tr><td>Unremedied breach: rent arrears</td><td>7 days</td></tr>
          <tr><td>Unremedied breach: other</td><td>14 days</td></tr>
          <tr><td>End of employment that came with the home</td><td>4 weeks</td></tr>
        </tbody>
      </table>
      <p>
        After ending a tenancy for a sale, the owner moving in or a change of
        use, the property can&apos;t be let or offered for rent for 6 months
        after the handover date; penalties apply.
      </p>
      <table>
        <thead>
          <tr><th>Tenant&apos;s notice (Form 13)</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Without grounds, periodic agreement</td><td>14 days</td></tr>
          <tr><td>Without grounds, fixed term</td><td>14 days, ending no earlier than the end date</td></tr>
          <tr><td>Unremedied breach by the landlord</td><td>7 days</td></tr>
          <tr><td>Property advertised for sale in the first 2 months without telling you before you signed</td><td>14 days</td></tr>
          <tr><td>Domestic and family violence (Form 20)</td><td>7 days, but you can leave immediately</td></tr>
        </tbody>
      </table>
      <p>
        If the property doesn&apos;t meet minimum housing standards, or
        isn&apos;t fit to live in or in good repair, you can give 14 days&apos;
        notice within the first 7 days of moving in.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li>Rent can&apos;t rise until at least <strong>12 months</strong> after the current rent became payable, and the 12 months attach to the property: an increase under a previous tenant, agent or owner counts. The tenancy agreement must state the date of the last increase, and you can ask for written proof, due within 14 days.</li>
        <li>The property manager or owner must give at least <strong>2 months&apos; written notice</strong> on a general tenancy.</li>
        <li>During a fixed term, rent can rise only if the agreement says it will and states the new amount or how it is worked out.</li>
      </ul>
      <KeyFigure
        value="12 months / 2 months"
        label="Minimum gap between rent increases for the property, and minimum written notice of one, in Queensland."
        context="RTA, Rent increases, read 11 October 2026"
      />
      <p>
        If you think an increase is excessive, raise it with the property
        manager or owner, then use RTA dispute resolution. You can apply to
        QCAT within 30 days of receiving the notice (and before a fixed term
        ends). QCAT looks at market rents for similar properties, the size of
        the increase, the state of repair and the length of the tenancy.
      </p>

      <h2 id="bond">Bond</h2>
      <ul>
        <li><strong>Maximum:</strong> 4 weeks&apos; rent for general tenancies and rooming accommodation. The cap covers every bond, whatever it is called, including a pet bond.</li>
        <li><strong>Lodging:</strong> the property manager or owner must give you a receipt and lodge the bond with the RTA within 10 days; it is an offence not to.</li>
        <li><strong>Increases:</strong> no more than once in 11 months, with at least one month to pay, and never above the maximum.</li>
        <li><strong>Refund:</strong> the bond comes back when you leave unless money is owed for rent, damage or other costs. Since 30 September 2024 a property manager or owner claiming against it must give you their evidence within 14 days of lodging the claim.</li>
      </ul>

      <h2 id="entry-rights">Entry and routine inspections</h2>
      <table>
        <thead>
          <tr><th>Purpose</th><th>Minimum notice (Entry notice, Form 9)</th></tr>
        </thead>
        <tbody>
          <tr><td>Routine inspection, at most once every 3 months unless you agree in writing</td><td>7 days</td></tr>
          <tr><td>Repairs or maintenance, a valuation, smoke alarms</td><td>48 hours</td></tr>
          <tr><td>Showing the property to a buyer (after a Notice of lessor&apos;s intention to sell, Form 10)</td><td>48 hours</td></tr>
          <tr><td>Showing the property to a prospective tenant, after a notice to leave or of intention to leave</td><td>48 hours</td></tr>
        </tbody>
      </table>
      <p>
        Entry must be between 8am and 6pm, Monday to Saturday, unless you
        agree to another time. For a routine inspection the notice must give a
        time or a 2-hour window. Once a notice to leave or a notice of
        intention to leave has been given, the property manager or owner
        can&apos;t enter more than twice in any 7 days.
      </p>

      <h2 id="repairs">Repairs and minimum housing standards</h2>
      <p>
        <strong>Emergency repairs</strong> are listed in the Act: a burst
        water service or serious leak, a blocked or broken toilet, a serious
        roof leak, a gas leak, a dangerous electrical fault, flooding or
        serious storm, fire or impact damage, failure of the gas, electricity
        or water supply or of an essential appliance for hot water, cooking or
        heating, a fault that makes the home unsafe or insecure, and anything
        needed to meet minimum housing standards.
      </p>
      <p>
        Contact the emergency repair contact named in your tenancy agreement.
        If you can&apos;t reach them within a reasonable time, you can arrange
        the repair up to the value of <strong>4 weeks&apos; rent</strong>, then
        ask in writing to be repaid, with receipts, giving at least 7 days.
        If you aren&apos;t repaid you can apply urgently to QCAT.
      </p>
      <p>
        <strong>Routine repairs</strong> must be done within a reasonable
        time. Report them in writing, don&apos;t arrange them yourself without
        written permission, and keep paying rent. If a repair isn&apos;t done,
        give a Notice to remedy breach (Form 11) with at least 7 days, then
        use RTA dispute resolution or apply to QCAT for a repair order.
      </p>
      <p>
        <strong>Minimum housing standards</strong> apply to every Queensland
        rental from move-in and throughout the tenancy: weatherproof and
        structurally sound, in good repair, working locks on external doors
        and reachable windows, free of vermin, damp and mould not caused by
        the tenant, window coverings for privacy, adequate plumbing and
        drinkable hot and cold water, and a working cook-top where a kitchen
        is provided.
      </p>

      <h2 id="pets">Pets</h2>
      <ul>
        <li>You need written approval to keep a pet; working dogs such as assistance and guide dogs don&apos;t need it.</li>
        <li>During a tenancy, ask on a Request for approval to keep a pet (Form 21). The property manager or owner must respond in writing within <strong>14 days</strong>, giving their conditions or their reason for refusing.</li>
        <li>If they don&apos;t respond within 14 days, or the response doesn&apos;t meet those requirements, the request is approved.</li>
        <li>In a body corporate, the by-laws apply too, and a landlord can refuse a pet the by-laws don&apos;t allow.</li>
      </ul>

      <h2 id="domestic-violence">Domestic and family violence</h2>
      <p>
        If you are experiencing domestic and family violence, you can end your
        interest in the tenancy with a Notice ending tenancy interest (Form
        20) and evidence: the notice period is 7 days, but you can leave
        immediately. You have rights even if you aren&apos;t named on the
        agreement. Call 000 in an emergency, or 1800RESPECT on 1800 737 732,
        24 hours a day. The RTA (1300 366 311) will check that you can talk
        safely before discussing your situation.
      </p>

      <h2 id="disputes">RTA dispute resolution and QCAT</h2>
      <p>
        Try to sort the problem out with the property manager or owner first.
        If that doesn&apos;t work, apply for the RTA&apos;s free dispute
        resolution service. If you still can&apos;t agree, or the matter
        isn&apos;t suitable for conciliation, apply to QCAT, which decides
        tenancy disputes including bonds, repairs, excessive rent and ending
        a tenancy.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Residential Tenancies Authority</strong>, 1300 366 311, Monday to Friday 8:30am to 5pm:{" "}
          <a href="https://www.rta.qld.gov.au" target="_blank" rel="noopener noreferrer">rta.qld.gov.au</a>
        </li>
        <li>
          <strong>QCAT</strong>:{" "}
          <a href="https://www.qcat.qld.gov.au" target="_blank" rel="noopener noreferrer">qcat.qld.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the Residential Tenancies Authority pages above, which apply the Residential Tenancies and Rooming Accommodation Act 2008 as amended. The RTA's pages show no last-updated date; we read them on 11 October 2026.",
        ]}
      />
    </GuideArticleLayout>
  );
}
