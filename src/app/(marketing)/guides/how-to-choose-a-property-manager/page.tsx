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
  title: "How to Choose a Property Manager",
  h1: "How to choose a property manager",
  description:
    "How to choose a property manager in Australia: check the licence, read the agreement, ask the right questions and compare written fees.",
  slug: "how-to-choose-a-property-manager",
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
  { id: "what-matters-most-when-you-choose-a-property-manager", label: "What matters most when you choose a property manager?" },
  { id: "questions-to-ask-a-property-manager-before-you-sign", label: "Questions to ask a property manager before you sign" },
  { id: "what-should-the-management-agreement-say", label: "What should the management agreement say?" },
  { id: "compare-the-full-cost-not-only-the-percentage", label: "Compare the full cost, not only the percentage" },
  { id: "check-the-licence-and-how-rent-reaches-you", label: "Check the licence and how rent reaches you" },
  { id: "warning-signs-to-ask-more-about", label: "Warning signs to ask more about" },
  { id: "compare-two-or-three-written-quotes", label: "Compare two or three written quotes" },
  { id: "want-a-local-agent-to-quote", label: "Want a local agent to quote?" },
];

// The visible questions and the FAQPage JSON-LD both read this one list
// (the shared Faq component renders both).
export const FAQS: FaqItem[] = [
  {
    question: "How do I choose a property manager?",
    answer:
      "Check the licence on your state register, read the written agreement, then judge the person who will manage your property. Consumer Affairs Victoria says to speak to at least two or three local agents. Compare what each will do and charge in writing, and meet the manager before you sign.",
  },
  {
    question: "What questions should I ask a property manager?",
    answer:
      "The NSW Government and Consumer Protection WA each publish a list. Ask about the licence, which manager will look after your property, the full fees, repairs, inspections, late rent, the tribunal or court, and insurance. Our checklist above is built from those lists and Queensland Government guidance.",
  },
  {
    question: "How do I check a property manager is licensed?",
    answer:
      "Search your state’s public register and ask the agent for their licence number. In New South Wales, Verify NSW shows licence details. In Western Australia you can use the licence search or call Consumer Protection’s licensing branch. The other states we checked publish their own register, linked in the table above.",
  },
  {
    question: "Should I choose the cheapest property manager?",
    answer:
      "Not necessarily. Consumer Protection WA says fees vary substantially and are fully negotiable, and that the cheapest option is not always the right one. Compare the total yearly cost in writing, including marketing, statements and other fees, and weigh it against the services each manager will provide.",
  },
  {
    question: "How many property managers should I compare?",
    answer:
      "Consumer Affairs Victoria says to speak to at least two or three local agents. Consumer Protection WA suggests visiting several property managers at their place of business. There is no set number. Ask each for the same written fees and agreement so you can compare them fairly.",
  },
  {
    question: "What should a management agreement include?",
    answer:
      "Consumer Affairs Victoria and Consumer Protection WA both say it is a binding contract, so read it before signing. It should state your fees including GST, how often inspections happen, how much the agent can spend on repairs, and how you are paid. The NSW Government says it should be ended in line with the notice period it sets out.",
  },
  {
    question: "What is the difference between a property manager and a real estate agent?",
    answer:
      "Consumer Affairs Victoria says you can pay either to manage your rental. In Western Australia a property manager must be registered and work for a licensed agency. In New South Wales only a licensed real estate agent can sign an agency agreement with you. Check the licence either way.",
  },
  {
    question: "Does Your Property Guide charge me to be introduced to an agent?",
    answer:
      FEE_DISCLOSURE,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "What does a property manager do?", href: "/guides/what-does-a-property-manager-do", description: "What a property manager does for a landlord in Australia, what stays with you as the owner, and how to check their licence in your state." },
  { title: "Switching property managers: what to check and how to do it", href: "/guides/switching-property-managers", description: "How to switch property managers in Australia: check your agreement, give written notice, sort keys and records, and tell your tenant." },
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
    label: "NSW Government, Check a licence with Verify NSW",
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
    label: "NT Government, Public register",
    href: "https://licensingnt.nt.gov.au/PublicRegister/PublicRegister/LicenceSearch.aspx",
    note: "No update date shown on the page.",
  },
];

export default function HowToChooseAPropertyManagerPage() {
  return (
    <GuideArticleLayout frontmatter={FRONTMATTER} tldr={[]} toc={TOC} faqs={FAQS} related={RELATED}>
      <p className="lead">Choose a property manager in this order: check the licence, read the agreement, then judge the person. This guide is for Australian owners who are appointing a manager or thinking of changing. Last checked: 28 October 2026. Author: Your Property Guide editorial.</p>

      <p>This is general information for all Australian states and territories. Rules differ by state, so we link to each regulator. It is not legal advice, and we do not recommend any agency.</p>

      <p><strong>In short</strong></p>

      <ol>
        <li>Check the licence on your state register.</li>
        <li>Read the written agreement before you sign.</li>
        <li>Ask the questions in the checklist below.</li>
        <li>Compare the total cost in writing.</li>
      </ol>

      <h2 id="what-matters-most-when-you-choose-a-property-manager">What matters most when you choose a property manager?</h2>

      <p>Check the licence first, then the agreement, then the person. Meet the manager who will look after your property. Consumer Affairs Victoria says to speak to at least two or three local agents. Compare what each will do and charge in writing before you decide.</p>

      <h3 id="a-good-manager-in-plain-terms">A good manager, in plain terms</h3>

      <p>Consumer Protection WA says to choose on whether the manager will reduce your workload and stress and protect your investment. In practice, ask for a copy of the statement the agency sends owners, and a written list of what the fee covers. Then you can judge what you would actually receive.</p>

      <h3 id="property-manager-or-real-estate-agent">Property manager or real estate agent?</h3>

      <p>Consumer Affairs Victoria says you can pay either a property manager or a real estate agent to manage your rental. In Western Australia the manager must be a registered property manager working under a licensed agency. In New South Wales only a licensed real estate agent can sign an agency agreement with you. Check the licence either way.</p>

      <h2 id="questions-to-ask-a-property-manager-before-you-sign">Questions to ask a property manager before you sign</h2>

      <p>The NSW Government and Consumer Protection WA each publish questions for owners to ask. The checklist below is built from their lists and from Queensland Government guidance. It is not an official regulator checklist, and the questions are prompts to ask, not claims about any agency.</p>

      <h3 id="licence-and-who-looks-after-your-property">Licence and who looks after your property</h3>

      <ScrollTable label="Licence and who looks after your property">
        <table>
          <thead>
            <tr><th>Question to ask</th><th>Why it matters</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr><td>Can I have your licence number, and which property manager will look after my property? Can I meet them?</td><td>You can look up a licence on your state register. Consumer Protection WA suggests meeting the specific manager who will deal with your tenants</td><td>NSW Government, Consumer Protection WA</td></tr>
            <tr><td>How long have you been a property manager, and how long with this agency?</td><td>The NSW Government lists this among questions owners can ask</td><td>NSW Government</td></tr>
            <tr><td>How many properties do you manage now?</td><td>The NSW Government lists this too. We give no benchmark for a good number</td><td>NSW Government</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h3 id="fees-and-the-agreement">Fees and the agreement</h3>

      <ScrollTable label="Fees and the agreement">
        <table>
          <thead>
            <tr><th>Question to ask</th><th>Why it matters</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr><td>Can I see your standard written agreement, with each fee explained and the total you propose to charge?</td><td>Consumer Protection WA suggests asking, and the fees and conditions are negotiable</td><td>Consumer Protection WA, NSW Government</td></tr>
            <tr><td>What is included in the management fee, and what is excluded?</td><td>The NSW Government lists this as a question to ask</td><td>NSW Government</td></tr>
            <tr><td>Do you charge for advertising, postage, inspections or reports, and how is each worked out?</td><td>Consumer Protection WA says the written authority mentions costs like these</td><td>Consumer Protection WA</td></tr>
            <tr><td>What will I be charged if I end the agreement early?</td><td>Consumer Protection WA says these fees can be negotiated before you sign</td><td>Consumer Protection WA</td></tr>
            <tr><td>How long is the period of agency?</td><td>Consumer Protection WA lists this as a decision to make before you sign</td><td>Consumer Protection WA</td></tr>
            <tr><td>What are your vacancy days and arrears like across the properties you manage, and how do you measure them?</td><td>A low fee can cost more if a property sits empty or rent runs late. We give no benchmark</td><td>Our property management fees guide</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h3 id="finding-tenants">Finding tenants</h3>

      <ScrollTable label="Finding tenants">
        <table>
          <thead>
            <tr><th>Question to ask</th><th>Why it matters</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr><td>How will you advertise, what does it cost, and what checks do you make on tenants?</td><td>Consumer Protection WA and the NSW Government both list these</td><td>Consumer Protection WA, NSW Government</td></tr>
            <tr><td>How much do you think the property should be rented for, and why?</td><td>Consumer Protection WA lists this as a question to ask</td><td>Consumer Protection WA</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h3 id="repairs-inspections-and-statements">Repairs, inspections and statements</h3>

      <ScrollTable label="Repairs, inspections and statements">
        <table>
          <thead>
            <tr><th>Question to ask</th><th>Why it matters</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr><td>How do you handle repair requests, quotes and receipts, and do you check repairs afterwards?</td><td>The NSW Government and Queensland Government both list repairs among the things to ask about</td><td>NSW Government, Queensland Government</td></tr>
            <tr><td>What systems check compliance with health and safety requirements?</td><td>The NSW Government lists this as a question to ask</td><td>NSW Government</td></tr>
            <tr><td>What inspection reports will I get, how often, and at what cost?</td><td>Consumer Protection WA lists this as a question to ask</td><td>Consumer Protection WA</td></tr>
            <tr><td>Can I see the statement you send owners, with an explanation, and when is rent paid to me?</td><td>Consumer Protection WA suggests asking for the statement. Consumer Affairs Victoria says agents should explain accounting timelines</td><td>Consumer Protection WA, Consumer Affairs Victoria</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h3 id="late-rent-and-the-tribunal">Late rent and the tribunal</h3>

      <ScrollTable label="Late rent and the tribunal">
        <table>
          <thead>
            <tr><th>Question to ask</th><th>Why it matters</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr><td>What do you do when rent is late, and how long can it go unpaid before action?</td><td>The NSW Government and Queensland Government both list this</td><td>NSW Government, Queensland Government</td></tr>
            <tr><td>What experience do you have at the tribunal or court?</td><td>The NSW Government asks about the tribunal and Consumer Protection WA about the Magistrates Court</td><td>NSW Government, Consumer Protection WA</td></tr>
            <tr><td>What is your complaints procedure?</td><td>The Queensland Government lists this among the procedures to ask about</td><td>Queensland Government</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h3 id="insurance">Insurance</h3>

      <ScrollTable label="Insurance">
        <table>
          <thead>
            <tr><th>Question to ask</th><th>Why it matters</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr><td>What insurance should I have, and what would landlord insurance cover?</td><td>Consumer Protection WA suggests discussing it, and Consumer Affairs Victoria says to shop around</td><td>Consumer Protection WA, Consumer Affairs Victoria</td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <h2 id="what-should-the-management-agreement-say">What should the management agreement say?</h2>

      <p>Consumer Affairs Victoria and Consumer Protection WA both call it a binding contract, so read it first. It should state your fees including GST, how often inspections happen, how much the agent can spend before asking you, and how you are paid. The NSW Government says it should be ended in line with the notice period it sets out.</p>

      <p>Notice periods and exit fees depend on your agreement and your state, so check your agreement. Our guide to <Link href="/guides/switching-property-managers">switching property managers</Link> covers what to look for.</p>

      <h2 id="compare-the-full-cost-not-only-the-percentage">Compare the full cost, not only the percentage</h2>

      <p>Consumer Protection WA says fees vary substantially, are fully negotiable, and the cheapest option is not always the right one. Compare the total yearly cost in writing, including marketing, statement and other fees, not only the management percentage. Consumer Affairs Victoria says a percentage fee should also appear as a dollar amount on the authority.</p>

      <p>Also ask how the manager handles vacancy days and arrears. We give no benchmark for either. Our <Link href="/guides/property-management-fees-australia">property management fees guide</Link> explains each fee type and how to compare them.</p>

      <h2 id="check-the-licence-and-how-rent-reaches-you">Check the licence and how rent reaches you</h2>

      <p>Search your state register before you sign, and ask for the licence number. In New South Wales, Verify NSW shows licence details. In Western Australia you can use the licence search or call Consumer Protection’s licensing branch. Victoria, Queensland, Tasmania, the ACT and the Northern Territory each publish a register, linked below. For South Australia, check with the state regulator.</p>

      <ScrollTable label="Check the licence and how rent reaches you">
        <table>
          <thead>
            <tr><th>State or territory</th><th>Where to check</th></tr>
          </thead>
          <tbody>
            <tr><td>NSW</td><td><a href="https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/buying-property-nsw/preparing-to-purchase/property-agent-or-conveyancer-licence-check" target="_blank" rel="noopener noreferrer">Verify NSW, check a licence</a></td></tr>
            <tr><td>VIC</td><td><a href="https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents/public-register" target="_blank" rel="noopener noreferrer">Consumer Affairs Victoria, public register</a></td></tr>
            <tr><td>QLD</td><td><a href="https://www.qld.gov.au/law/laws-regulated-industries-and-accountability/queensland-laws-and-regulations/regulated-industries-and-licensing/regulated-industries-licensing-and-legislation/property-industry-regulation/check-a-property-licence" target="_blank" rel="noopener noreferrer">Queensland Government, check a property licence</a></td></tr>
            <tr><td>WA</td><td><a href="https://www.consumerprotection.wa.gov.au/consumer-protection/consumer-protection-licence-and-registration-search" target="_blank" rel="noopener noreferrer">Consumer Protection WA, licence search</a></td></tr>
            <tr><td>TAS</td><td><a href="https://propertyagentsboard.com.au/" target="_blank" rel="noopener noreferrer">Property Agents Board of Tasmania</a></td></tr>
            <tr><td>ACT</td><td><a href="https://www.accesscanberra.act.gov.au/business-and-work/public-registers" target="_blank" rel="noopener noreferrer">Access Canberra, public registers</a></td></tr>
            <tr><td>NT</td><td><a href="https://licensingnt.nt.gov.au/PublicRegister/PublicRegister/LicenceSearch.aspx" target="_blank" rel="noopener noreferrer">NT Government, public register</a></td></tr>
          </tbody>
        </table>
      </ScrollTable>

      <p>Rent usually passes through the agent. Consumer Affairs Victoria says the agent distributes payments from their trust account and should explain their accounting timelines. Consumer Protection WA refers to trust account requirements placed on real estate agents. Ask each agent in writing how and when rent reaches you.</p>

      <h2 id="warning-signs-to-ask-more-about">Warning signs to ask more about</h2>

      <p>None of these proves a problem. Each is a reason to ask another question before you sign.</p>

      <ul>
        <li>The licence cannot be found when you search the register. Consumer Protection WA says you can check whether a property manager is registered through its online licence search.</li>
        <li>They will not show a written agreement or fee list before you commit. Consumer Protection WA suggests asking to see the standard written authority and an explanation of the fees and the total fee.</li>
        <li>A percentage fee with no dollar amount on the authority, which Consumer Affairs Victoria says should be included.</li>
        <li>Charges beyond what the written authority says. The WA Code of Conduct says agents must not seek a fee that is unjust in light of the written authority.</li>
        <li>No clear complaints procedure, which the Queensland Government says to ask about.</li>
        <li>Vague answers on repair quotes, receipts or how long rent can go unpaid, which the Queensland Government says to ask about.</li>
        <li>Reluctance to let you meet the person who will manage your property. Consumer Protection WA suggests asking to meet the specific property manager who will deal with your tenants.</li>
      </ul>

      <h2 id="compare-two-or-three-written-quotes">Compare two or three written quotes</h2>

      <p>Consumer Affairs Victoria says to speak to at least two or three local agents, and Consumer Protection WA suggests visiting several property managers. Ask each for their standard agreement and fees in writing, then compare the total yearly cost, services, inspections and exit terms side by side. Nothing sets a number you must compare.</p>

      <h2 id="want-a-local-agent-to-quote">Want a local agent to quote?</h2>

      <p>If you would like a local agent to give you a rental appraisal, you can request one through our <Link href="/suburbs/glen-waverley-vic-3150/rental-market">rental market page for Glen Waverley, Victoria</Link>, as an example suburb. We introduce you to one local property manager.</p>

      <p>{FEE_DISCLOSURE}</p>

      <Sources title="Sources and last checked" intro={SOURCES_INTRO} noteSeparator=". " items={SOURCES} />
    </GuideArticleLayout>
  );
}
