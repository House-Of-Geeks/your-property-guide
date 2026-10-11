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
import { NT_RENTERS_SOURCES, renterGuideLinks, sourceItems } from "@/lib/data/renters-rights";

// Every rule below is from the NT Consumer Affairs and NT.GOV.AU pages in
// NT_RENTERS_SOURCES, read 11 October 2026. Until this rewrite the guide
// said bonds are lodged with NT Consumer Affairs and that rent can rise at
// any time (commercial-intent review, 10 Oct 2026, renting 0.4).
const FRONTMATTER: GuideFrontmatter = {
  title: "Renters' Rights in the NT (2026): Current Rules",
  h1: "Renters' rights in the Northern Territory (2026)",
  description:
    "NT renting rules as at October 2026: 60 days' notice to end a lease, rent increases once in six months, bonds held in trust, entry, repairs, pets and NTCAT.",
  slug: "renters-rights-nt",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
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
  "The NT still allows a landlord to end a tenancy without a reason. Since 2 January 2024 the notice is 60 days for both periodic and fixed-term tenancies.",
  "Rent can rise during a tenancy only if the agreement allows it and states the amount or how it is worked out, with at least 30 days' written notice, and no sooner than six months after the tenancy started or the last increase.",
  "The security deposit (bond) can be up to 4 weeks' rent. There is no central bond authority: an agent holds it in a trust account and a private landlord must hold it in trust.",
  "Routine inspections: at least seven days' notice, no more than once every three months. Entry is allowed only between 7am and 9pm.",
  "Rent bidding is banned: a property must be offered at a fixed rent.",
  "Disputes that can't be settled go to the Northern Territory Civil and Administrative Tribunal (NTCAT). NT Consumer Affairs gives free advice.",
];

const TOC: GuideTOCEntry[] = [
  { id: "rta",            label: "The Residential Tenancies Act 1999" },
  { id: "ending-tenancy", label: "Ending a tenancy" },
  { id: "rent-increases", label: "Rent increases and rent bidding" },
  { id: "bond",           label: "Security deposit (bond)" },
  { id: "inspections",    label: "Entry and inspections" },
  { id: "repairs",        label: "Repairs" },
  { id: "pets",           label: "Pets" },
  { id: "family-violence",label: "Domestic and family violence" },
  { id: "disputes",       label: "NT Consumer Affairs and NTCAT" },
  { id: "resources",      label: "Resources and contacts" },
];

const FAQS: FaqItem[] = [
  {
    question: "Can my landlord end my tenancy without a reason in the NT?",
    answer:
      "Yes. The Northern Territory still has no-cause termination, but since 2 January 2024 the landlord must give 60 days' notice for both periodic and fixed-term tenancies (NT Consumer Affairs, updated 16 February 2026). A fixed-term tenancy that ends with no new agreement and no notice to leave becomes periodic.",
  },
  {
    question: "How often can my rent go up in the NT?",
    answer:
      "Rent can be increased during a tenancy only if the agreement gives the right to do so and states the amount or how it is calculated. The landlord must give at least 30 days' written notice, and the new rent can start no sooner than six months after the tenancy began or the rent last rose. Without such a term, rent can rise only if you agree (NT.GOV.AU, Paying rent and other costs).",
  },
  {
    question: "How much bond can be charged in the NT, and who holds it?",
    answer:
      "Up to 4 weeks' rent. The NT has no bond authority: if you pay an agent, the deposit goes into the agent's tenancy trust account, and a private landlord must hold it in trust. You must get a receipt immediately for cash, cheque or card, or within 2 business days for a bank transfer, and you can ask in writing for the name of the account that holds it (NT.GOV.AU, updated 2 December 2025).",
  },
  {
    question: "How much notice for an inspection in the NT?",
    answer:
      "At least seven days, and no more than once every three months unless the tenancy agreement sets a longer period. Repairs or a condition report need 24 hours' notice, and entry is only allowed between 7am and 9pm unless you agree to another time (NT.GOV.AU, Common tenancy disputes).",
  },
  {
    question: "What happens to my bond when I move out in the NT?",
    answer:
      "The landlord has seven business days after you move out to return the security deposit. They can keep part or all of it for damage you are responsible for (not fair wear and tear), unpaid rent or bills, cleaning if the home is left unreasonably dirty, or locks you changed without permission, but they can claim for damage only if you received a signed condition report within three business days of moving in (NT.GOV.AU).",
  },
  {
    question: "Can I break my lease early in the NT?",
    answer:
      "Yes, but you may have to pay the landlord compensation for lost rent, within limits set by the Act depending on when the agreement was signed and how much of it has run. You can end it without penalty in some cases, including domestic violence, an unsafe or uninhabitable home, and being offered public housing, and you can apply to NTCAT on the ground of undue hardship (NT.GOV.AU, updated 9 August 2024).",
  },
];

const RELATED: RelatedGuide[] = [
  ...renterGuideLinks(["NSW", "VIC", "QLD", "WA"]),
  { title: "First Home Buyer Guide NT", href: "/guides/first-home-buyer-nt", description: "When you're ready to stop renting and buy your first home." },
];

const S = NT_RENTERS_SOURCES;

export default function RentersRightsNTPage() {
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
          Earlier versions of this guide (reviewed April 2026) said bonds are
          lodged with NT Consumer Affairs, that the NT has no minimum period
          between rent increases, and that a landlord&apos;s no-grounds notice
          is 42 days. The NT has no bond authority (the landlord or agent
          holds the deposit in trust), rent can rise no sooner than six months
          after the last increase, and the no-cause notice has been 60 days
          since 2 January 2024. We have rewritten the guide from the NT
          Consumer Affairs and NT.GOV.AU pages listed at the end and removed
          statements those pages don&apos;t support.
        </p>
      </Callout>

      <Callout variant="warning" title="Not legal advice">
        <p>
          This guide is general information only, not legal advice. Check the
          current rules with{" "}
          <a href="https://consumeraffairs.nt.gov.au/for-consumers/residential-tenancies" target="_blank" rel="noopener noreferrer">
            NT Consumer Affairs
          </a>{" "}
          before you act.
        </p>
      </Callout>

      <h2 id="rta">The Residential Tenancies Act 1999</h2>
      <p className="lead">
        Renting in the Northern Territory is governed by the Residential
        Tenancies Act 1999. Unlike most states, the NT still lets a landlord
        end a tenancy without a reason, on 60 days&apos; notice since 2
        January 2024. NT Consumer Affairs administers the Act and gives
        advice, and the Northern Territory Civil and Administrative Tribunal
        (NTCAT) decides disputes.
      </p>
      <p>The second round of reforms started on 2 January 2024 (NT Consumer Affairs):</p>
      <ul>
        <li>no-cause notice periods increased and aligned at 60 days for periodic and fixed-term tenancies;</li>
        <li>rent bidding, rent auctions and increases between the offer and the agreement prohibited;</li>
        <li>a tenant can&apos;t be asked for payments or guarantees beyond rent, the security deposit and what the Act allows;</li>
        <li>limits on the personal information a landlord can collect from applicants;</li>
        <li>a landlord needs your permission to use images that might identify you when advertising;</li>
        <li>a quicker way for a tenant experiencing domestic and family violence to end their interest in a tenancy.</li>
      </ul>

      <h2 id="ending-tenancy">Ending a tenancy</h2>
      <p>
        A landlord can end a periodic or fixed-term tenancy without giving a
        reason, with at least <strong>60 days&apos; notice</strong> (Notice of
        intention to terminate, RT05). A fixed-term tenancy becomes periodic if
        you stay after it expires, no new agreement is signed and you
        aren&apos;t asked to leave. For a breach such as unpaid rent the
        landlord first gives a notice to remedy (RT03 or RT04b).
      </p>
      <KeyFigure
        value="60 days"
        label="A landlord's notice to end an NT tenancy without a reason, periodic or fixed-term, since 2 January 2024."
        context="NT Consumer Affairs, Renting in the NT, updated 16 February 2026"
      />
      <p>
        To leave a fixed term early you may have to compensate the landlord
        for lost rent, within limits the Act sets, and the landlord must take
        all reasonable steps to find a new tenant. You can end it without
        penalty in some cases, including domestic violence, an unsafe or
        uninhabitable home, and an offer of public housing, and you can apply
        to NTCAT to end it for undue hardship.
      </p>

      <h2 id="rent-increases">Rent increases and rent bidding</h2>
      <ul>
        <li>Rent can rise during a tenancy only if the agreement gives the right to and states the amount or how it is calculated; otherwise only if you agree.</li>
        <li>The landlord must give at least <strong>30 days&apos; written notice</strong> (RT010).</li>
        <li>The increase can start no sooner than <strong>six months</strong> after the tenancy started or the rent last rose.</li>
        <li>Rent bidding is illegal: a property must be offered at a fixed rent, and a landlord can&apos;t accept more than that rent unless extra benefits or services are added. A property withdrawn from the market can&apos;t be re-advertised at a higher rent within a month.</li>
      </ul>

      <h2 id="bond">Security deposit (bond)</h2>
      <ul>
        <li><strong>Maximum:</strong> 4 weeks&apos; rent. It can be topped up after a rent increase, but only two years after it was paid or last increased, and never above 4 weeks&apos; rent.</li>
        <li><strong>Who holds it:</strong> there is no bond authority in the NT. An agent puts it in a tenancy trust account; a private landlord must hold it in trust, and you can ask in writing which account holds it.</li>
        <li><strong>Receipt:</strong> immediately for cash, cheque or card; within 2 business days for a bank transfer.</li>
        <li><strong>Return:</strong> within seven business days after you move out, less any amount properly kept for damage (not fair wear and tear), unpaid rent or bills, cleaning or changed locks. Damage claims depend on you having received a signed condition report within three business days of moving in.</li>
      </ul>

      <h2 id="inspections">Entry and inspections</h2>
      <ul>
        <li><strong>Routine inspection:</strong> at least seven days&apos; notice, no more than once every three months unless the agreement sets a longer period.</li>
        <li><strong>Repairs or maintenance, or a condition report:</strong> 24 hours&apos; notice.</li>
        <li><strong>Showing prospective tenants:</strong> in the last 28 days of the tenancy, with 24 hours&apos; notice.</li>
        <li><strong>Showing buyers:</strong> 24 hours&apos; notice, a reasonable number of times.</li>
        <li><strong>Times:</strong> only between 7am and 9pm, unless you agree otherwise. No notice is needed in an emergency.</li>
      </ul>

      <h2 id="repairs">Repairs</h2>
      <p>
        The landlord must keep the home in a reasonable state of repair. Tell
        them in writing. Emergency repairs include a burst water pipe, a
        blocked or broken toilet, a serious roof leak, a gas leak, a dangerous
        electrical fault, flooding or serious storm, fire or impact damage, a
        failure of the gas, electricity or water supply or of an essential
        appliance for water or cooking, and any fault that makes the home
        unsafe or insecure. NT.GOV.AU&apos;s repairs page (last updated
        November 2016) says the landlord then has five days to repair or to
        arrange repairs within 14 days; if they don&apos;t, you can apply to
        NTCAT for a repair order. Other repairs must be dealt with in a timely
        way.
      </p>

      <h2 id="pets">Pets</h2>
      <p>
        For tenancy agreements signed after 1 January 2021, you can keep a
        pet if the type of pet is reasonable for the type and size of the
        property, and you must tell the landlord before bringing it in (NT
        Consumer Affairs).
      </p>

      <h2 id="family-violence">Domestic and family violence</h2>
      <p>
        Since 2 January 2024 a tenant who has experienced domestic or family
        violence, or whose dependant has, can end their interest in the
        tenancy immediately by giving written notice in the approved form to
        the landlord and any co-tenants (RT06a and RT06b). A victim tenant
        isn&apos;t liable for violence-related acts of a perpetrator who
        isn&apos;t a tenant. Call 000 if you are in danger.
      </p>

      <h2 id="disputes">NT Consumer Affairs and NTCAT</h2>
      <p>
        Talk to the landlord or agent first and put problems in writing. NT
        Consumer Affairs gives free advice on 08 8999 1999 or 1800 019 319, or
        consumer@nt.gov.au. If you can&apos;t resolve it, the Northern
        Territory Civil and Administrative Tribunal (NTCAT) decides disputes,
        including repair orders, compensation and ending a tenancy for
        hardship.
      </p>

      <h2 id="resources">Resources and contacts</h2>
      <ul>
        <li>
          <strong>NT Consumer Affairs</strong>, renting in the NT and its guide to renting:{" "}
          <a href="https://consumeraffairs.nt.gov.au/for-consumers/residential-tenancies" target="_blank" rel="noopener noreferrer">consumeraffairs.nt.gov.au</a>
        </li>
        <li>
          <strong>NT.GOV.AU</strong>, private renters:{" "}
          <a href="https://nt.gov.au/property/private-renters" target="_blank" rel="noopener noreferrer">nt.gov.au/property/private-renters</a>
        </li>
        <li>
          <strong>NTCAT</strong>:{" "}
          <a href="https://ntcat.nt.gov.au" target="_blank" rel="noopener noreferrer">ntcat.nt.gov.au</a>
        </li>
      </ul>

      <Sources
        items={[
          ...sourceItems(S),
          "Every rule on this page is from the NT Consumer Affairs and NT.GOV.AU pages above, which apply the Residential Tenancies Act 1999 as amended. Several NT.GOV.AU pages were last updated before 2024; check NT Consumer Affairs for later changes before you act.",
        ]}
      />
    </GuideArticleLayout>
  );
}
