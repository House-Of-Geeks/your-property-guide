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

// The copy on this page is the approved text from the 28 October 2026 copy
// files, unedited. No reviewer is named: reviewedBy stays unset until a
// reviewer is confirmed.
const FRONTMATTER: GuideFrontmatter = {
  title: "What Does a Property Manager Do?",
  h1: "What does a property manager do?",
  description:
    "What a property manager does for a landlord in Australia, what stays with you as the owner, and how to check their licence in your state.",
  slug: "what-does-a-property-manager-do",
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
  { id: "what-does-a-property-manager-do-for-a-landlord", label: "What does a property manager do for a landlord?" },
  { id: "what-are-a-property-managers-responsibilities-to-you", label: "What are a property manager’s responsibilities to you?" },
  { id: "what-stays-with-you-as-the-owner", label: "What stays with you as the owner?" },
  { id: "what-can-a-property-manager-not-do-for-you", label: "What can a property manager not do for you?" },
  { id: "does-a-property-manager-have-to-be-licensed", label: "Does a property manager have to be licensed?" },
  { id: "how-much-does-a-property-manager-cost", label: "How much does a property manager cost?" },
  { id: "can-i-manage-my-rental-property-myself", label: "Can I manage my rental property myself?" },
  { id: "what-if-something-goes-wrong-with-my-property-manager", label: "What if something goes wrong with my property manager?" },
  { id: "where-to-next", label: "Where to next" },
];

// The visible questions and the FAQPage JSON-LD both read this one list
// (the shared Faq component renders both).
export const FAQS: FaqItem[] = [
  {
    question: "What does a property manager do?",
    answer:
      "A property manager runs your rental day to day. They advertise the property, select a tenant, prepare the tenancy agreement, lodge the bond, collect rent, arrange repairs and inspections, and pass rent to you after agreed costs, according to the NSW Government and Consumer Protection WA. Your signed agreement sets the detail.",
  },
  {
    question: "What are the responsibilities of a property manager?",
    answer:
      "In Western Australia, Consumer Protection WA says the Code of Conduct requires a property manager to act in your best interests, follow reasonable instructions, act fairly and honestly, and use due skill, care and diligence. Other states have their own rules, so check your regulator and your agreement.",
  },
  {
    question: "What am I still responsible for as a landlord?",
    answer:
      "The NSW Government says landlords remain responsible for making sure tenancy laws are followed, even when an agent manages the property. Consumer Protection WA says the same for Western Australia. In the Northern Territory, landlords are also responsible for their appointed agent’s actions. Check your state’s rules.",
  },
  {
    question: "Does a property manager have to be licensed?",
    answer:
      "In New South Wales a managing agent must be a licensed agent or an assistant agent, and in Western Australia they must be a registered sales representative working for a licensed agency. Queensland and the NT also require a licence. Look the agent up on your state register before you sign.",
  },
  {
    question: "What can a property manager not do without my approval?",
    answer:
      "Consumer Protection WA says a property manager cannot pay expenses on your behalf unless your written authority allows it, and advertising costs need your written agreement with a stated maximum. In Victoria, you set the amount the agent can spend on urgent repairs. Later instructions should be in writing.",
  },
  {
    question: "How much does a property manager cost?",
    answer:
      "Most agents charge a letting fee and a management fee, and the NSW Government says the management fee is usually a percentage of gross weekly rent. Fees are negotiable except those set by law, and other charges can apply. Ask for every charge in writing, and see our fees guide.",
  },
  {
    question: "Can I manage my rental property myself?",
    answer:
      "Yes. The NSW Government says landlords can manage a property themselves or use an agent. Doing it yourself gives you control and saves agent fees, but you still have to follow tenancy laws. An agent may suit you better if you live far away, are busy or are not confident with the law.",
  },
  {
    question: "What can I do if my property manager gets it wrong?",
    answer:
      "Start by raising it with the manager, or the supervising agent in Western Australia, and check your agreement. If that does not settle it, you can complain to your state regulator. Consumer Protection WA accepts complaints about agents. Keep your emails and statements as records.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Switching property managers: what to check and how to do it", href: "/guides/switching-property-managers", description: "How to switch property managers in Australia: check your agreement, give written notice, sort keys and records, and tell your tenant." },
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
    label: "NSW Government, Check a licence for a property agent or conveyancer",
    href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/buying-property-nsw/preparing-to-purchase/property-agent-or-conveyancer-licence-check",
    note: "No update date shown on the page.",
  },
  {
    label: "Consumer Affairs Victoria, Using a property manager or agent",
    href: "https://www.consumer.vic.gov.au/housing/renting/starting-and-changing-rental-agreements/using-a-property-manager-or-agent",
    note: "Last updated 14 October 2026.",
  },
  {
    label: "Consumer Affairs Victoria, Estate agents public register",
    href: "https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents/public-register",
    note: "Last updated 14 February 2025.",
  },
  {
    label: "Queensland Government, Appointing a property agent",
    href: "https://www.qld.gov.au/law/housing-and-neighbours/renting-and-owning-property/deciding-how-to-manage-your-investment-property/appointing-a-property-agent",
    note: "Last updated 19 July 2024.",
  },
  {
    label: "Queensland Government, Check a property licence",
    href: "https://www.qld.gov.au/law/laws-regulated-industries-and-accountability/queensland-laws-and-regulations/regulated-industries-and-licensing/regulated-industries-licensing-and-legislation/property-industry-regulation/check-a-property-licence",
    note: "Last updated 2 October 2025.",
  },
  {
    label: "Consumer Protection WA, You and your property manager",
    href: "https://www.consumerprotection.wa.gov.au/publications/you-and-your-property-manager",
    note: "Last updated 12 February 2025.",
  },
  {
    label: "Consumer Protection WA, Licence and registration search",
    href: "https://www.consumerprotection.wa.gov.au/consumer-protection/consumer-protection-licence-and-registration-search",
    note: "Last updated 9 April 2026.",
  },
  {
    label: "Property Agents Board of Tasmania, home page",
    href: "https://propertyagentsboard.com.au/",
    note: "No update date shown on the page.",
  },
  {
    label: "Access Canberra, Public registers",
    href: "https://www.accesscanberra.act.gov.au/business-and-work/public-registers",
    note: "No update date shown on the page.",
  },
  {
    label: "NT Consumer Affairs, A Guide to Renting in the NT, version 4.3",
    href: "https://consumeraffairs.nt.gov.au/_resources/documents/for-consumers/residential-tenancies/guide-to-renting-in-the-nt.pdf",
    note: "Dated February 2026.",
  },
  {
    label: "NT Government, Owning a rental property",
    href: "https://nt.gov.au/property/homeowners-and-landlords/landlords-your-rights-and-responsibilities/owning-a-rental-property",
    note: "No update date shown on the page.",
  },
  {
    label: "NT Government, Property and business agent licensing",
    href: "https://nt.gov.au/industry/licences/property-and-business-agent-licensing",
    note: "No update date shown on the page.",
  },
  {
    label: "NT Government, Public Register",
    href: "https://licensingnt.nt.gov.au/PublicRegister/PublicRegister/LicenceSearch.aspx",
    note: "A search tool with no update date.",
  },
];

export default function WhatDoesAPropertyManagerDoPage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={[]} toc={TOC} faqs={FAQS} related={RELATED}>
      <p className="lead">A property manager looks after a rental property for its owner. They find a tenant, collect the rent, arrange repairs and inspections, and pay the money on to you, as set out in your signed management agreement. This guide is for owners in any Australian state or territory.</p>

      <p>Last checked: 28 October 2026. Author: Your Property Guide editorial.</p>

      <p>This is general information for all Australian states and territories. The law differs by state, so we link to each regulator. It is not legal advice.</p>

      <p><strong>In short</strong></p>

      <ul>
        <li>A property manager handles the day to day of a rental: tenants, rent, repairs and inspections.</li>
        <li>Your written management agreement decides exactly what yours does.</li>
        <li>You keep your own legal duties to the tenant.</li>
        <li>Check the licence or registration on your state register before you sign.</li>
      </ul>

      <h2 id="what-does-a-property-manager-do-for-a-landlord">What does a property manager do for a landlord?</h2>

      <p>A property manager advertises your property, selects a tenant, prepares the tenancy agreement, lodges the bond, collects rent, arranges repairs, inspects the property and passes the rent on after agreed costs. The tasks come from the NSW Government, Consumer Protection WA and the Queensland Government, and your agreement can vary them.</p>

      <h3 id="advertising-and-choosing-a-tenant">Advertising and choosing a tenant</h3>

      <p>Consumer Protection WA lists advertising, selecting a tenant and negotiating a rent that suits the property and the market. The Queensland Government says a property manager accompanies prospective tenants on inspections, unless you tell them otherwise in writing.</p>

      <h3 id="the-tenancy-agreement-and-the-bond">The tenancy agreement and the bond</h3>

      <p>The NSW Government says a managing agent makes sure the tenancy agreement is correctly completed and signed, and lodges the rental bond. Consumer Affairs Victoria uses the terms rental provider and renter for landlord and tenant. It says that at the end of a tenancy the agent and the renter agree how the bond is paid out.</p>

      <h3 id="collecting-rent-and-paying-you">Collecting rent and paying you</h3>

      <p>The manager collects rent, keeps records and pays you the rent less authorised expenses such as agency fees. The NSW Government says this happens at the end of each calendar month unless you instruct otherwise. Consumer Affairs Victoria says the agent should explain their accounting timelines. Ask when you will be paid before you sign.</p>

      <h3 id="inspections-and-condition-reports">Inspections and condition reports</h3>

      <p>The NSW Government lists regular inspections among a managing agent’s tasks. Consumer Affairs Victoria says the authority should set out how often the agent will inspect. How often is a term of your agreement and a rule of your state, so we leave numbers to your regulator.</p>

      <h3 id="repairs-and-maintenance">Repairs and maintenance</h3>

      <p>The Queensland Government says a property manager responds quickly to repair requests and makes sure repairers hold the right licences. Consumer Affairs Victoria says you can authorise urgent repairs up to a specified amount, and that limit belongs in the contract.</p>

      <h3 id="notices-arrears-and-the-tribunal">Notices, arrears and the tribunal</h3>

      <p>Consumer Protection WA lists issuing breach and termination notices, or arranging court proceedings, among a property manager’s tasks. The NSW Government says fees can include representing you at the Tribunal. Ask how long rent can go unpaid before your manager acts.</p>

      <h3 id="statements-and-records">Statements and records</h3>

      <p>Consumer Protection WA lists providing you with relevant notices and financial statements. Ask to see a sample owner statement before you sign.</p>

      <h2 id="what-are-a-property-managers-responsibilities-to-you">What are a property manager’s responsibilities to you?</h2>

      <p>In Western Australia, Consumer Protection WA says the Code of Conduct requires a property manager to act in your best interests, follow your instructions unless they are unreasonable or improper, act fairly and honestly, and use due skill, care and diligence.</p>

      <p>The same code bars an agent from seeking fees above what the written authority says. The Queensland Government lists similar duties, including a complaints procedure. Check what your own regulator publishes.</p>

      <h3 id="what-the-management-agreement-should-set-out">What the management agreement should set out</h3>

      <p>The NSW Government says the agent’s responsibilities should be clearly specified, fees and conditions are negotiable, and you should consider inspection frequency, copies of reports and the repair amount above which you want to be contacted. Consumer Protection WA says the written authority is a legally binding contract. Consumer Affairs Victoria says a percentage fee should also be shown as a dollar amount.</p>

      <h2 id="what-stays-with-you-as-the-owner">What stays with you as the owner?</h2>

      <p>A manager does not take over your legal duties. The NSW Government says landlords remain responsible for making sure tenancy laws are followed, and agents must comply too. Consumer Protection WA says you still have legal obligations to tenants under the Residential Tenancies Act 1987. In the Northern Territory, landlords are responsible for the actions of their appointed agent.</p>

      <h3 id="your-duties-to-the-tenant">Your duties to the tenant</h3>

      <p>The rules on repairs, notices, bonds and entry differ by state. Our renters’ rights guides cover <Link href="/guides/renters-rights-nsw">NSW</Link>, <Link href="/guides/renters-rights-vic">Victoria</Link>, <Link href="/guides/renters-rights-qld">Queensland</Link>, <Link href="/guides/renters-rights-wa">Western Australia</Link>, <Link href="/guides/renters-rights-sa">South Australia</Link>, <Link href="/guides/renters-rights-tas">Tasmania</Link>, the <Link href="/guides/renters-rights-nt">Northern Territory</Link> and the <Link href="/guides/renters-rights-act">ACT</Link>.</p>

      <h3 id="decisions-and-costs-that-are-still-yours">Decisions and costs that are still yours</h3>

      <p>Consumer Protection WA suggests discussing landlord protection insurance with your property manager. Consumer Affairs Victoria says you can arrange in writing for the agent to pay rates and other bills from the rent. Tax is outside this guide.</p>

      <h3 id="who-is-responsible-when-the-agent-gets-it-wrong">Who is responsible when the agent gets it wrong</h3>

      <p>In the Northern Territory, A Guide to Renting in the NT says landlords are responsible for the actions of their appointed agent and must choose their agent carefully. That sentence is specific to the NT. The other regulator pages we cite do not say it, so check your agreement and your regulator.</p>

      <h2 id="what-can-a-property-manager-not-do-for-you">What can a property manager not do for you?</h2>

      <p>A property manager cannot spend your money without permission. Consumer Protection WA says they cannot pay expenses unless your written authority allows it, and advertising costs need a written agreement with a stated maximum. In Victoria, you set the amount the agent can spend on urgent repairs, and the limit belongs in the contract.</p>

      <p>Consumer Protection WA says later instructions should be in writing, and an instruction that conflicts with the authority means the authority has to be changed.</p>

      <h2 id="does-a-property-manager-have-to-be-licensed">Does a property manager have to be licensed?</h2>

      <p>Check the licence before you sign, because each state runs its own register. The NSW Government says a managing agent must be a licensed agent or an assistant agent. Consumer Protection WA says property managers must be registered sales representatives working for a licensed agency. Consumer Affairs Victoria says to always confirm your agent is licensed.</p>

      <p>The Queensland Government says real estate agents must have a licence, and to ask to see it. The NT Government says you need a licence to be a real estate agent or an agent’s representative.</p>

      <h3 id="check-the-licence-not-a-qualification">Check the licence, not a qualification</h3>

      <p>The practical step is to look up the licence or registration. Consumer Protection WA says registration depends on recognised course work and good character, but the register shows who is registered now.</p>

      <h3 id="where-to-check-in-each-state">Where to check in each state</h3>

      <ScrollTable label="Where to check in each state">
        <table>
          <thead>
            <tr><th>State or territory</th><th>Regulator</th><th>Where to check</th><th>What the regulator says</th></tr>
          </thead>
          <tbody>
            <tr><td>NSW</td><td>NSW Fair Trading</td><td><a href="https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/buying-property-nsw/preparing-to-purchase/property-agent-or-conveyancer-licence-check" target="_blank" rel="noopener noreferrer">Verify NSW licence check</a></td><td>Shows licence holder, category, conditions and disciplinary action</td></tr>
            <tr><td>VIC</td><td>Consumer Affairs Victoria</td><td><a href="https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents/public-register" target="_blank" rel="noopener noreferrer">Estate agents public register</a></td><td>Always confirm the estate agent is licensed</td></tr>
            <tr><td>QLD</td><td>Queensland Government</td><td><a href="https://www.qld.gov.au/law/laws-regulated-industries-and-accountability/queensland-laws-and-regulations/regulated-industries-and-licensing/regulated-industries-licensing-and-legislation/property-industry-regulation/check-a-property-licence" target="_blank" rel="noopener noreferrer">Check a property licence</a></td><td>An online register of licensed property agents</td></tr>
            <tr><td>WA</td><td>Consumer Protection WA</td><td><a href="https://www.consumerprotection.wa.gov.au/consumer-protection/consumer-protection-licence-and-registration-search" target="_blank" rel="noopener noreferrer">Licence and registration search</a></td><td>Search for a licensed real estate agent</td></tr>
            <tr><td>SA</td><td>Consumer and Business Services</td><td><a href="https://www.cbs.sa.gov.au/find-a-licence-holder" target="_blank" rel="noopener noreferrer">Find a licence holder</a></td><td>Check your agreement and contact the regulator</td></tr>
            <tr><td>TAS</td><td>Property Agents Board of Tasmania</td><td><a href="https://propertyagentsboard.com.au/" target="_blank" rel="noopener noreferrer">Property Agents Board</a></td><td>Check your agreement and contact the regulator</td></tr>
            <tr><td>ACT</td><td>Access Canberra</td><td><a href="https://www.accesscanberra.act.gov.au/business-and-work/public-registers" target="_blank" rel="noopener noreferrer">Public registers</a></td><td>Check your agreement and contact the regulator</td></tr>
            <tr><td>NT</td><td>NT Government</td><td><a href="https://licensingnt.nt.gov.au/PublicRegister/PublicRegister/LicenceSearch.aspx" target="_blank" rel="noopener noreferrer">Public Register</a></td><td>Search to see if a person or company is licensed</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h3 id="strata-managers-are-different">Strata managers are different</h3>

      <p>Consumer Protection WA says strata managers are not required to be licensed in their own right in Western Australia, and strata issues fall outside the Real Estate and Business Agents Act 1978.</p>

      <h2 id="how-much-does-a-property-manager-cost">How much does a property manager cost?</h2>

      <p>Most agents charge a letting fee and a management fee. The NSW Government says the management fee is usually a percentage of gross weekly rent, and other charges can include advertising. Consumer Affairs Victoria says fees are negotiable except those set by law. Ask for every charge in writing.</p>

      <p>Our <Link href="/guides/property-management-fees-australia">property management fees guide</Link> explains each fee type and how to compare the total cost. We do not quote fee figures here, because they vary by agency and state.</p>

      <h2 id="can-i-manage-my-rental-property-myself">Can I manage my rental property myself?</h2>

      <p>Yes. The NSW Government says landlords can manage a property themselves or use an agent, and that doing it yourself gives control and saves agent fees. You must still follow tenancy laws. An agent may suit landlords who live far away, are busy or are not confident with the law.</p>

      <p>The NT Government also lists managing it yourself as an option. Our <Link href="/guides/property-management-fees-australia">fees guide</Link> has a short section on weighing the cost.</p>

      <h2 id="what-if-something-goes-wrong-with-my-property-manager">What if something goes wrong with my property manager?</h2>

      <p>Raise it with the manager first, or the supervising agent in Western Australia, where Consumer Protection WA says that is a first step. If that fails, complain to the regulator. Consumer Protection WA takes complaints about agents. Keep your emails and statements.</p>

      <h2 id="where-to-next">Where to next</h2>

      <ul>
        <li><Link href="/guides/property-management-fees-australia">Property management fees in Australia</Link>: what each fee covers and how to compare the total cost.</li>
        <li><Link href="/rental-yield-calculator">Rental yield calculator</Link>: see how costs affect your return.</li>
        <li><a href="https://www.consumerprotection.wa.gov.au/publications/you-and-your-property-manager" target="_blank" rel="noopener noreferrer">You and your property manager, Consumer Protection WA</a>: a regulator guide with questions to ask a property manager, written for Western Australian owners.</li>
      </ul>

      <Sources title="Sources and last checked" intro={SOURCES_INTRO} noteSeparator=". " items={SOURCES} />
    </GuideArticleLayout>
  );
}
