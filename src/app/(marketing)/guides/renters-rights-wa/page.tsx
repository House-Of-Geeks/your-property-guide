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
import { WA_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the Consumer Protection WA pages in
// WA_RENTERS_SOURCES, read 11 October 2026. Until this rewrite the guide
// said WA had no 12-month limit on rent increases (commercial-intent review,
// 10 Oct 2026, renting 0.4).
const FRONTMATTER: GuideFrontmatter = {
  title: "Renters' Rights in Western Australia (2026): Current Rules",
  h1: "Renters' rights in Western Australia (2026)",
  description:
    "WA renting rules as at October 2026: notice to end a lease, rent increases once in 12 months, bond and pet bond, inspections, repairs, pets and disputes.",
  slug: "renters-rights-wa",
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
  "WA still allows a landlord to end a tenancy without grounds: 60 days' notice on a periodic agreement, and 30 days' notice to end a fixed term at its end date.",
  "Rent can rise no more than once every 12 months, on periodic and fixed-term agreements, with at least 60 days' written notice on Form 10.",
  "The bond is up to 4 weeks' rent (more is allowed only where rent is over $1,200 a week), plus a pet bond of up to $350. It must be lodged with Bonds Administration within 14 days.",
  "Routine inspections: no more than four a year, with 7 to 14 days' written notice. Entry is 8am to 6pm on weekdays and 9am to 5pm on Saturdays unless you agree otherwise.",
  "Urgent repairs to essential services such as water, gas, hot water, sewerage and electricity must be organised within 24 hours; other urgent repairs within 48 hours.",
  "Consumer Protection helps resolve disputes and the Commissioner decides some pet, modification and bond disputes; the Magistrates Court decides the rest.",
];

const TOC: GuideTOCEntry[] = [
  { id: "act",            label: "The Residential Tenancies Act 1987" },
  { id: "ending-tenancy", label: "Ending a tenancy and notice periods" },
  { id: "rent-increases", label: "Rent increases" },
  { id: "bond",           label: "Bond and pet bond" },
  { id: "entry-rights",   label: "Entry and inspections" },
  { id: "repairs",        label: "Repairs" },
  { id: "pets",           label: "Pets" },
  { id: "family-violence",label: "Family and domestic violence" },
  { id: "disputes",       label: "Resolving disputes" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord still evict me without grounds in WA?",
    answer:
      "Yes. A WA landlord can end a periodic agreement with no grounds by giving 60 days' notice on a Notice of termination (Form 1C), and can end a fixed-term agreement at its end date with 30 days' notice. A landlord can't end a tenancy because you asked for repairs or a pet, or challenged a rent increase, and only a bailiff with a court order can remove you (Consumer Protection WA, updated 28 August 2025).",
  },
  {
    question: "How often can rent go up in WA?",
    answer:
      "No more than once every 12 months, on periodic and fixed-term agreements, and only with at least 60 days' written notice on Form 10 stating the new rent and the day it starts. A fixed-term agreement must also say how much the increase will be or how it is calculated. If you think an increase is too high you can apply to the Magistrates Court (Consumer Protection WA, updated 20 October 2025).",
  },
  {
    question: "What's the maximum bond in WA?",
    answer:
      "Up to 4 weeks' rent, unless the rent is over $1,200 a week, plus up to 2 weeks' rent in advance. If a pet is allowed, a pet bond of up to $350 can be charged for fumigation and pet damage. The bond must be lodged with Bonds Administration within 14 days of being paid (Consumer Protection WA, Rental bonds, updated 28 March 2026).",
  },
  {
    question: "How often can a landlord inspect in WA?",
    answer:
      "No more than four times a year, with 7 to 14 days' written notice. Entry is allowed from 8am to 6pm on weekdays and 9am to 5pm on Saturdays, or at another time you agree to, and you can refuse entry on a public holiday. Non-urgent repairs need 72 hours' written notice (Consumer Protection WA, updated 13 August 2025).",
  },
  {
    question: "How quickly must urgent repairs be done in WA?",
    answer:
      "The landlord has 24 hours to organise repairs to essential services such as water, gas, hot water, sewerage and electricity, and 48 hours for other urgent repairs such as a roof leak or broken locks. If the landlord doesn't respond, you can have a suitable repairer do the basic repair and claim the reasonable cost; if you aren't repaid, apply to the Magistrates Court (Consumer Protection WA).",
  },
  {
    question: "Can my landlord refuse a pet in WA?",
    answer:
      "Only with the Commissioner for Consumer Protection's approval, unless keeping the pet would break a law or a strata rule. The landlord has 14 days from the day after receiving your pet request (Form 25) to decide and, if refusing, to apply for the Commissioner's approval. If the landlord doesn't respond at all, you can keep the pet (Consumer Protection WA, updated 11 August 2026).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["NSW", "VIC", "QLD", "SA"]),
  { title: "First Home Buyer Guide WA", href: "/guides/first-home-buyer-wa", description: "When you're ready to stop renting and buy your first home." },
];

const S = WA_RENTERS_SOURCES;

export default function RentersRightsWAPage() {
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
          Earlier versions of this guide (reviewed April 2026) said WA had no
          12-month minimum between rent increases, allowed up to 6 weeks&apos;
          bond for furnished properties, and capped tenant-arranged urgent
          repairs at $1,000. Consumer Protection WA says rent can rise no more
          than once every 12 months, the bond is up to 4 weeks&apos; rent
          unless the rent is over $1,200 a week, and publishes no such repair
          cap. We have rewritten the guide from the Consumer Protection pages
          listed at the end.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Check the
          current rules with{" "}
          <a href="https://www.consumerprotection.wa.gov.au/renting-home" target="_blank" rel="noopener noreferrer">
            Consumer Protection WA
          </a>{" "}
          or the Tenancy Advice and Education Service before you act.
        </p>
      </Callout>

      <h2 id="act">The Residential Tenancies Act 1987</h2>
      <p className="lead">
        Renting in Western Australia is governed by the Residential Tenancies
        Act 1987. Unlike most states, WA still allows a landlord to end a
        tenancy without grounds, but rent can rise no more than once every 12
        months and rent bidding is banned. Consumer Protection administers the
        Act, Bonds Administration holds bonds, and the Magistrates Court
        decides most disputes.
      </p>

      <h2 id="ending-tenancy">Ending a tenancy and notice periods</h2>
      <table>
        <thead>
          <tr><th>Situation</th><th>Minimum notice</th></tr>
        </thead>
        <tbody>
          <tr><td>Landlord ends a periodic agreement, no grounds (Form 1C)</td><td>60 days</td></tr>
          <tr><td>Landlord ends a fixed term at its end date, no grounds (Form 1C)</td><td>30 days</td></tr>
          <tr><td>Landlord ends a periodic agreement after selling with vacant possession</td><td>30 days</td></tr>
          <tr><td>Unpaid rent: breach notice (Form 21), then notice of termination (Form 1A)</td><td>14 days to pay, then 7 days to leave</td></tr>
          <tr><td>Other breach: breach notice (Form 20), then notice of termination (Form 1C)</td><td>14 days to fix, then 7 days to leave</td></tr>
          <tr><td>Tenant ends a periodic agreement (Form 22)</td><td>21 days</td></tr>
          <tr><td>Tenant ends a fixed term at its end date (Form 22)</td><td>30 days</td></tr>
        </tbody>
      </table>
      <p>
        A fixed-term agreement becomes periodic if the end date passes with no
        new agreement and no notice. A sale doesn&apos;t end a fixed term early:
        the new owner takes over unless you agree to leave. A landlord
        can&apos;t end a tenancy because you asked for repairs, a pet or
        changes to the home, or challenged a rent increase, and must never
        change the locks or force you out: only a bailiff with a court order
        can.
      </p>

      <h2 id="rent-increases">Rent increases</h2>
      <ul>
        <li>No more than once every <strong>12 months</strong>, on periodic and fixed-term agreements. Renewing with the same tenant counts as one continuous agreement.</li>
        <li>At least <strong>60 days&apos; written notice</strong> on Form 10, stating the new rent and the day it starts.</li>
        <li>On a fixed term, only if the agreement says how much the increase will be or how it is calculated. Long-term agreements signed before 29 July 2024 keep the increases written into them until they end.</li>
      </ul>
      <KeyFigure
        value="12 months / 60 days"
        label="Minimum gap between rent increases, and minimum written notice of one, in Western Australia."
        context="Consumer Protection WA, Rent increases, updated 20 October 2025"
      />
      <p>
        If the rules aren&apos;t followed you don&apos;t have to pay the
        increase. If you think an increase is too high, you can apply to the
        Magistrates Court, which looks at comparable rents, the property&apos;s
        value and condition, the landlord&apos;s costs and whether the
        increase is retaliatory.
      </p>

      <h2 id="bond">Bond and pet bond</h2>
      <ul>
        <li><strong>Bond:</strong> up to 4 weeks&apos; rent, unless the rent is over $1,200 a week.</li>
        <li><strong>Rent in advance:</strong> up to 2 weeks at the start of a tenancy.</li>
        <li><strong>Pet bond:</strong> up to $350 for fumigation and pet damage, where a pet is allowed. None for an assistance animal.</li>
        <li><strong>Lodging:</strong> with Bonds Administration within 14 days of being paid. Bonds Administration holds it until the tenancy ends.</li>
        <li><strong>Release:</strong> on a release form signed by all tenants and landlords, a Commissioner&apos;s decision or a court order. The property condition report is the key evidence.</li>
      </ul>

      <h2 id="entry-rights">Entry and inspections</h2>
      <ul>
        <li><strong>Routine inspections:</strong> no more than four a year, with 7 to 14 days&apos; written notice (Form 19).</li>
        <li><strong>Non-urgent repairs or maintenance:</strong> 72 hours&apos; written notice; emergency and urgent work can need immediate access.</li>
        <li><strong>Showing new tenants:</strong> at an agreed time, within 21 days of the current tenant moving out.</li>
        <li><strong>Times:</strong> 8am to 6pm on weekdays and 9am to 5pm on Saturdays, or another time you agree to. You can refuse entry outside those times, on a public holiday, or without proper written notice.</li>
      </ul>

      <h2 id="repairs">Repairs</h2>
      <p>
        The landlord must keep the home in a reasonable state of repair. Keep
        paying rent while you wait for a repair, and keep records.
      </p>
      <ul>
        <li><strong>Essential services</strong> (water, gas, hot water, sewerage, electricity): the landlord has <strong>24 hours</strong> to organise the repair.</li>
        <li><strong>Other urgent repairs</strong> (such as a roof leak, broken windows or locks, or storm damage): <strong>48 hours</strong> to organise a suitable repairer.</li>
        <li><strong>Non-urgent repairs:</strong> ask in writing; if they aren&apos;t done in a reasonable time, contact Consumer Protection.</li>
      </ul>
      <p>
        If the landlord doesn&apos;t respond to an urgent repair, you can have
        a suitable repairer do the basic repair and send the landlord the
        invoice and receipt; the landlord must reimburse any reasonable
        expense. If they don&apos;t, apply to the Magistrates Court.
      </p>

      <h2 id="pets">Pets</h2>
      <ul>
        <li>Ask on a Pet Request Form (Form 25). The landlord has 14 days, from the day after receiving it, to decide.</li>
        <li>A landlord can refuse without approval only if the pet would break a law or a strata rule. Any other refusal, or special conditions, needs the Commissioner for Consumer Protection&apos;s approval.</li>
        <li>If the landlord doesn&apos;t respond at all, you can keep the pet. A pet bond of up to $350 can apply.</li>
      </ul>

      <h2 id="family-violence">Family and domestic violence</h2>
      <p>
        A tenant affected by family and domestic violence can leave straight
        away without going to court. You give 7 days&apos; notice, which
        means paying a week&apos;s rent even if you leave at once, and you
        can&apos;t be charged other fees for leaving early. Call 000 if you are
        in danger, or 1800RESPECT on 1800 737 732, 24 hours a day.
      </p>

      <h2 id="disputes">Resolving disputes</h2>
      <p>
        Talk to the landlord or agent first. Consumer Protection (1300 30 40
        54) can help both sides reach agreement and aims to resolve issues
        within 30 days, but can&apos;t order a result. The Commissioner can
        make determinations on pets, changes to the home and bond disputes.
        Other disputes, including excessive rent and evictions, go to the
        Magistrates Court. The Tenancy Advice and Education Service gives
        tenants legal advice.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>Consumer Protection WA</strong>, renting a home, 1300 30 40 54:{" "}
          <a href="https://www.consumerprotection.wa.gov.au/renting-home" target="_blank" rel="noopener noreferrer">consumerprotection.wa.gov.au/renting-home</a>
        </li>
        <li>
          <strong>Bonds Administration</strong>:{" "}
          <a href="https://www.consumerprotection.wa.gov.au/bonds" target="_blank" rel="noopener noreferrer">consumerprotection.wa.gov.au/bonds</a>
        </li>
        <li>
          <strong>Magistrates Court of WA</strong>:{" "}
          <a href="https://www.magistratescourt.wa.gov.au" target="_blank" rel="noopener noreferrer">magistratescourt.wa.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the Consumer Protection WA pages above, which apply the Residential Tenancies Act 1987 as amended. Each page's own last-updated date is given.",
        ]}
      />
    </GuideArticleLayout>
  );
}
