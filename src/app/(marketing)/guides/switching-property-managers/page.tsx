import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  ScrollTable,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { FEE_DISCLOSURE } from "@/lib/service-model";

// The copy on this page is the approved text from the 28 October 2026 copy
// files, unedited. No reviewer is named: reviewedBy stays unset until a
// reviewer is confirmed.
const FRONTMATTER: GuideFrontmatter = {
  title: "Switching Property Managers",
  h1: "Switching property managers: what to check and how to do it",
  description:
    "How to switch property managers in Australia: check your agreement, give written notice, sort keys and records, and tell your tenant.",
  slug: "switching-property-managers",
  publishedAt: "2026-10-28",
  updatedAt: "2026-10-28",
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  persona: "investing",
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

const TOC: GuideTOCEntry[] = [
  { id: "can-you-switch-property-managers-and-when", label: "Can you switch property managers, and when?" },
  { id: "check-your-management-agreement-first", label: "Check your management agreement first" },
  { id: "step-by-step-how-to-switch-property-managers", label: "Step by step: how to switch property managers" },
  { id: "what-the-old-agent-hands-over", label: "What the old agent hands over" },
  { id: "what-your-tenant-sees-and-must-be-told", label: "What your tenant sees and must be told" },
  { id: "costs-to-watch", label: "Costs to watch" },
  { id: "managing-it-yourself-instead", label: "Managing it yourself instead" },
  { id: "state-notes-and-regulator-links", label: "State notes and regulator links" },
  { id: "choosing-the-new-manager", label: "Choosing the new manager" },
];

// The visible questions and the FAQPage JSON-LD both read this one list
// (the shared Faq component renders both).
export const FAQS: FaqItem[] = [
  {
    question: "Can I change property manager during a lease?",
    answer:
      "Yes. The tenancy carries on with the new agent. The Residential Tenancies Authority in Queensland describes a change of property manager as a change in an ongoing tenancy, and Consumer Affairs Victoria says the renter must be formally advised of the new arrangements. In New South Wales the bond records also need updating.",
  },
  {
    question: "How much notice do I have to give my property manager?",
    answer:
      "It depends on your agreement and your state. Consumer Affairs Victoria says that in most cases you can end management by written notice, after checking your authority. The Queensland Government says a continuing appointment needs at least 30 days’ written notice, or less if both sides agree.",
  },
  {
    question: "Will I be charged a fee for leaving?",
    answer:
      "Possibly. Some agreements charge for ending early. Consumer Protection WA says most written authorities in Western Australia allow liquidated damages of 50 per cent of the management fee for the unexpired period, which you can negotiate or strike out before signing. Read your termination clause first.",
  },
  {
    question: "What does my old property manager have to hand over?",
    answer:
      "Ask in writing. The NSW Government says your termination notice should ask the property manager to confirm how tenancy records, keys and other items will transfer to the incoming agency. Consumer Affairs Victoria says to collect keys and relevant documents yourself or through your new agent.",
  },
  {
    question: "What happens to the bond when I change property manager?",
    answer:
      "In New South Wales, the NSW Government says the Change of managing agent or owner information form goes to the Rental Bonds Board so bond money is allocated to the incoming agency. In Queensland the RTA uses Form 5. Other states run their own bond authorities, so check your state’s rules.",
  },
  {
    question: "Do I have to tell my tenant I am changing property manager?",
    answer:
      "Yes. Consumer Affairs Victoria says the renter must be formally advised of the new arrangements, whether you choose a new agent or manage the rental yourself. In the Northern Territory a tenant must be told in writing within 14 days of the agent changing. Check your own state’s rule.",
  },
  {
    question: "Can I manage the rental myself after I leave?",
    answer:
      "Yes. You can end the agreement and manage the rental yourself. Consumer Affairs Victoria says the renter must still be formally told of the new arrangements. The NSW Government says landlords who manage it themselves must still follow residential tenancy laws, including reading the Landlord Information Statement before entering any tenancy agreement.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "What does a property manager do?", href: "/guides/what-does-a-property-manager-do", description: "What a property manager does for a landlord in Australia, what stays with you as the owner, and how to check their licence in your state." },
  { title: "How to choose a property manager", href: "/guides/how-to-choose-a-property-manager", description: "How to choose a property manager in Australia: check the licence, read the agreement, ask the right questions and compare written fees." },
];

const SOURCES_INTRO =
  "General information only. This page is not legal advice, and it does not recommend any agency. Last checked: 28 October 2026. Each source shows the regulator’s own last updated date where the page gives one.";

const SOURCES: SourceItem[] = [
  {
    label: "NSW Government, Managing a rental property",
    href: "https://www.nsw.gov.au/housing-and-construction/landlords/managing-a-rental-property",
    note: "No update date shown on the page.",
  },
  {
    label: "Consumer Affairs Victoria, Using a property manager or agent",
    href: "https://www.consumer.vic.gov.au/housing/renting/starting-and-changing-rental-agreements/using-a-property-manager-or-agent",
    note: "Last updated 14 October 2026.",
  },
  {
    label: "Queensland Government, Appointing a property agent",
    href: "https://www.qld.gov.au/law/housing-and-neighbours/renting-and-owning-property/deciding-how-to-manage-your-investment-property/appointing-a-property-agent",
    note: "Last updated 19 July 2024.",
  },
  {
    label: "Residential Tenancies Authority Queensland, Change of tenant or property manager/owner",
    href: "https://www.rta.qld.gov.au/during-a-tenancy/events-that-impact-the-agreement/change-of-tenant-or-property-managerowner",
    note: "No update date shown. The Form 5 is marked version 3, 30 September 2024.",
  },
  {
    label: "Residential Tenancies Authority Queensland, Change of property manager/owner, Form 5",
    href: "https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/change-of-property-managerowner-form-5",
    note: "No update date shown. Marked version 3, 30 September 2024.",
  },
  {
    label: "Consumer Protection WA, You and your property manager",
    href: "https://www.consumerprotection.wa.gov.au/publications/you-and-your-property-manager",
    note: "Last updated 12 February 2025.",
  },
  {
    label: "NT Consumer Affairs, A Guide to Renting in the NT, version 4.3",
    href: "https://consumeraffairs.nt.gov.au/_resources/documents/for-consumers/residential-tenancies/guide-to-renting-in-the-nt.pdf",
    note: "Dated February 2026.",
  },
  {
    label: "ACT Government, Rental laws in the ACT",
    href: "https://www.act.gov.au/housing-planning-and-property/renting/rental-laws-in-the-act",
    note: "Last updated 21 January 2026.",
  },
  {
    label: "Property Agents Board of Tasmania, home page",
    href: "https://propertyagentsboard.com.au/",
    note: "No update date shown on the page.",
  },
];

export default function SwitchingPropertyManagersPage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={[]} toc={TOC} faqs={FAQS} related={RELATED}>
      <p className="lead">Yes, you can switch property managers. How much notice you give, and whether you pay an exit fee, come from your signed agreement and your state. Last checked: 28 October 2026.</p>

      <p>This is general information for all Australian states and territories. Notice rules and exit fees depend on your signed agreement and your state, so we show what each regulator says and link to it. It is not legal advice.</p>

      <p><strong>In short</strong></p>

      <ol>
        <li>Read the termination clause, the notice period and any exit fee in your agreement.</li>
        <li>Give written notice the way the agreement says, and line up your new manager or your own plan.</li>
        <li>Get the keys, records and bond sorted with the old agent.</li>
        <li>Make sure your tenant is formally told who manages the property.</li>
      </ol>

      <h2 id="can-you-switch-property-managers-and-when">Can you switch property managers, and when?</h2>

      <p>Yes. A management agreement is a contract you can end, but how and when depends on its termination clause and your state’s rules. Read the notice period and any exit fee first, then give written notice the way the agreement says. Consumer Affairs Victoria says that in most cases you can end an agent’s management in writing.</p>

      <h3 id="can-you-change-during-a-lease">Can you change during a lease?</h3>

      <p>Yes. The tenancy carries on with the new agent. The Residential Tenancies Authority in Queensland describes a change of property manager as a change in an ongoing tenancy, and Consumer Affairs Victoria says the renter must be formally advised of the new arrangements. In New South Wales the bond records also need updating.</p>

      <h3 id="what-if-you-have-a-fixed-term">What if you have a fixed term?</h3>

      <p>A fixed term is part of the contract, so leaving early can cost you. The Queensland Government warns that if you appoint a new agent before your current appointment ends, you may owe commission under both appointments or damages for breach of contract. Check your term, and ask your current agency in writing what ending early would cost.</p>

      <h2 id="check-your-management-agreement-first">Check your management agreement first</h2>

      <p>The NSW Government says a management agreement usually has a notice period clause. Consumer Protection WA says the written authority is a legally binding contract, so check it before you act.</p>

      <h3 id="find-the-termination-clause-the-notice-period-and-the-exit-fee">Find the termination clause, the notice period and the exit fee</h3>

      <p>Notice depends on your agreement and your state, so there is no single answer. Consumer Affairs Victoria says that in most cases you can end management by written notice, after checking your authority. The Queensland Government says a continuing appointment needs at least 30 days’ written notice, or less if both sides agree.</p>

      <p>Some agreements charge for ending early. Consumer Protection WA says most written authorities in that state allow liquidated damages of 50 per cent of the management fee the agent would have earned for the unexpired period, and that you can negotiate or strike the clause out before signing. Read this clause before you give notice.</p>

      <h3 id="what-the-regulators-say-about-notice">What the regulators say about notice</h3>

      <ScrollTable label="What the regulators say about notice">
        <table>
          <thead>
            <tr><th>State</th><th>What the regulator page says</th><th>Page and date</th></tr>
          </thead>
          <tbody>
            <tr><td>VIC</td><td>End management by written notice in most cases</td><td>CAV, 14 October 2026</td></tr>
            <tr><td>NSW</td><td>Follow the notice period in the agreement, or agree an end together</td><td>NSW Government, no date shown</td></tr>
            <tr><td>QLD</td><td>At least 30 days’ written notice, or less if both agree</td><td>Queensland Government, 19 July 2024</td></tr>
            <tr><td>WA</td><td>Cancel in writing with the notice the authority requires</td><td>Consumer Protection WA, 12 February 2025</td></tr>
            <tr><td>SA, TAS, ACT, NT</td><td>Your agreement and your state decide</td><td>See the regulator links below</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="step-by-step-how-to-switch-property-managers">Step by step: how to switch property managers</h2>

      <ol>
        <li>Read the termination clause, notice period and any exit fee in your agreement.</li>
        <li>If you are unsure, get independent advice.</li>
        <li>Compare new agents and check each licence.</li>
        <li>Agree when the new appointment starts so it does not overlap the old one.</li>
        <li>Give written notice the way your agreement requires, and ask the old agent to confirm how records, keys and other items will transfer.</li>
        <li>Collect the keys and documents yourself, or have the new agent collect them.</li>
        <li>Update the bond records with your state’s bond authority.</li>
        <li>Make sure the tenant is formally told who manages the property.</li>
        <li>Ask the old agent in writing for a final statement and when any remaining rent will be paid to you.</li>
      </ol>

      <h2 id="what-the-old-agent-hands-over">What the old agent hands over</h2>

      <p>Ask for it in writing. The NSW Government says your termination notice should ask the property manager to confirm how tenancy records, keys and other items will be transferred to the incoming agency. Consumer Affairs Victoria says to arrange to collect keys and relevant documents yourself or through your new agent.</p>

      <h3 id="keys-records-and-documents">Keys, records and documents</h3>

      <p>The New South Wales and Victorian pages we checked spell this out. For anything else, ask in your notice and keep the reply.</p>

      <h3 id="the-bond">The bond</h3>

      <p>In New South Wales, bond records must be updated when management changes. The NSW Government says the Change of managing agent or owner information form should go to the Rental Bonds Board so bond money is allocated to the incoming agency. Other states run their own bond authorities, so check your state’s rules.</p>

      <p>In Queensland, the RTA says Form 5 must be signed by the previous and new property manager and lodged with the RTA. In the Northern Territory, the security deposit stays with the former landlord or agent until the tenant gives written permission to transfer it.</p>

      <h3 id="rent-and-the-final-statement">Rent and the final statement</h3>

      <p>Consumer Affairs Victoria says an agent should explain their accounting timelines. Ask for a final statement and the date of any remaining payment.</p>

      <h2 id="what-your-tenant-sees-and-must-be-told">What your tenant sees and must be told</h2>

      <p>Yes. Consumer Affairs Victoria says the renter must be formally advised of the new arrangements, whether you choose a new agent or manage it yourself. In the Northern Territory, a tenant must be told in writing within 14 days after the agent’s name or address changes. Check your own state’s rule.</p>

      <p>In Queensland, the RTA says the new manager should give the tenant their contact details.</p>

      <h2 id="costs-to-watch">Costs to watch</h2>

      <p>Check any exit fee in your agreement, any overlap between the old and new appointments, and the new manager’s own fees. Consumer Protection WA says that if an agency is sold or closes, existing written authorities end automatically.</p>

      <p>Our <Link href="/guides/property-management-fees-australia">property management fees guide</Link> explains each fee type and how to compare the total cost.</p>

      <h2 id="managing-it-yourself-instead">Managing it yourself instead</h2>

      <p>Yes. You can end the agreement and manage the rental yourself. Consumer Affairs Victoria says the renter must still be formally told of the new arrangements. The NSW Government says landlords who manage it themselves must still follow residential tenancy laws, including reading the Landlord Information Statement before entering any tenancy agreement.</p>

      <p>You take on every task the agent did. The NSW Government says managing it yourself gives control and saves agent fees.</p>

      <h2 id="state-notes-and-regulator-links">State notes and regulator links</h2>

      <ScrollTable label="State notes and regulator links">
        <table>
          <thead>
            <tr><th>State or territory</th><th>What to know</th><th>Regulator</th></tr>
          </thead>
          <tbody>
            <tr><td>NSW</td><td>Bond form goes to the Rental Bonds Board</td><td><a href="https://www.nsw.gov.au/housing-and-construction/landlords/managing-a-rental-property" target="_blank" rel="noopener noreferrer">NSW Government, managing a rental property</a></td></tr>
            <tr><td>VIC</td><td>End in writing in most cases. Tell the renter</td><td><a href="https://www.consumer.vic.gov.au/housing/renting/starting-and-changing-rental-agreements/using-a-property-manager-or-agent" target="_blank" rel="noopener noreferrer">Consumer Affairs Victoria</a></td></tr>
            <tr><td>QLD</td><td>30 days’ written notice. Form 5 for the RTA</td><td><a href="https://www.qld.gov.au/law/housing-and-neighbours/renting-and-owning-property/deciding-how-to-manage-your-investment-property/appointing-a-property-agent" target="_blank" rel="noopener noreferrer">Queensland Government</a> and <a href="https://www.rta.qld.gov.au/during-a-tenancy/events-that-impact-the-agreement/change-of-tenant-or-property-managerowner" target="_blank" rel="noopener noreferrer">RTA</a></td></tr>
            <tr><td>WA</td><td>Cancel in writing. Check for liquidated damages</td><td><a href="https://www.consumerprotection.wa.gov.au/publications/you-and-your-property-manager" target="_blank" rel="noopener noreferrer">Consumer Protection WA</a></td></tr>
            <tr><td>SA</td><td>Check your agreement</td><td><a href="https://www.cbs.sa.gov.au/find-a-licence-holder" target="_blank" rel="noopener noreferrer">Consumer and Business Services</a></td></tr>
            <tr><td>TAS</td><td>Check your agreement</td><td><a href="https://propertyagentsboard.com.au/" target="_blank" rel="noopener noreferrer">Property Agents Board of Tasmania</a></td></tr>
            <tr><td>ACT</td><td>Check your agreement</td><td><a href="https://www.act.gov.au/housing-planning-and-property/renting/rental-laws-in-the-act" target="_blank" rel="noopener noreferrer">ACT Government, rental laws</a></td></tr>
            <tr><td>NT</td><td>Check your agreement. Tell the tenant in writing within 14 days</td><td><a href="https://consumeraffairs.nt.gov.au/_resources/documents/for-consumers/residential-tenancies/guide-to-renting-in-the-nt.pdf" target="_blank" rel="noopener noreferrer">NT Consumer Affairs, guide to renting</a></td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="choosing-the-new-manager">Choosing the new manager</h2>

      <p>Do not sign with a new agent until you know when the old appointment ends. The Queensland Government says that if you enter a new agreement before your current appointment ends, you may be liable for commission under both appointments or for damages.</p>

      <p>Our guide to <Link href="/guides/how-to-choose-a-property-manager">choosing a property manager</Link> has the licence checks and questions to ask. You can request a rental appraisal from a local agent through our <Link href="/suburbs/glen-waverley-vic-3150/rental-market">rental market page for Glen Waverley, Victoria</Link>, as an example suburb.</p>

      <p>{FEE_DISCLOSURE}</p>

      <Sources title="Sources and last checked" intro={SOURCES_INTRO} noteSeparator=". " items={SOURCES} />
    </GuideArticleLayout>
  );
}
