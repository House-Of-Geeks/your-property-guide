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
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Building and pest inspection: what to expect (2026)",
  description:
    "Why a building and pest inspection matters, what's actually inspected, common defects found, how to read the report, and how to negotiate after one.",
  slug: "building-pest-inspection",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
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
  "A building and pest inspection costs $400 to $800 and is one of the highest-leverage spends in a property purchase, it can uncover tens of thousands in undisclosed issues.",
  "Australia operates on caveat emptor (buyer beware), so you must investigate the property's condition before signing an unconditional contract.",
  "Auction buyers must commission inspections BEFORE auction day, there's no cooling-off period and no subject-to-inspection clause at auction.",
  "Inspectors check what's accessible and visible. They aren't structural engineers and don't test individual electrical or plumbing fixtures.",
  "Major defects (active termites, rising damp, structural cracks, failed roofing) can warrant price reduction or walking away. Minor wear-and-tear is normal.",
  "Don't use an inspector recommended by the selling agent. Get your own independent, insured inspector and attend the inspection in person if possible.",
];

const TOC: GuideTOCEntry[] = [
  { id: "why-need",         label: "Why you need one" },
  { id: "whats-inspected",  label: "What's inspected" },
  { id: "common-issues",    label: "Common issues found" },
  { id: "cost",             label: "Cost of inspections" },
  { id: "who-to-hire",      label: "Who to hire" },
  { id: "timing",           label: "When to get the inspection" },
  { id: "reading-report",   label: "How to read the report" },
  { id: "negotiating",      label: "Negotiating after an inspection" },
  { id: "new-homes",        label: "Inspections for new homes" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much does a building and pest inspection cost in Australia?",
    answer:
      "A combined building and pest inspection on a typical residential home costs $400 to $800. Building-only is $250 to $500; pest-only is $150 to $300. Larger or rural properties can run $600 to $1,200+. Strata apartment inspections are usually $250 to $500. Always pick combined unless cost is a real constraint, defects that attract pests overlap with structural ones.",
  },
  {
    question: "Do I need an inspection if I'm buying a new home?",
    answer:
      "Yes. New homes commonly have incomplete waterproofing, missing insulation, drainage issues, settling cracks, or rectification items missed at handover. Engage a pre-handover inspector to attend the builder's final inspection with you, defects on their list become the builder's obligation to fix before you take possession. New builds also have statutory warranties (6 years structural, 2 years non-structural in most states).",
  },
  {
    question: "Can I get an inspection before making an offer?",
    answer:
      "Yes, and many experienced buyers do. You pay for the inspection upfront on a property you may not buy, but you negotiate from a position of full knowledge and can avoid lengthy conditional periods. For auction purchases, this is mandatory, the inspection must happen before auction day.",
  },
  {
    question: "What's the difference between major and minor defects?",
    answer:
      "Major defects require significant remediation and often cost thousands of dollars to fix (active termite damage, rising damp, foundation cracks, roof failure). Minor defects are normal wear and tear or small maintenance items (sticking doors, hairline plaster cracks, worn carpet). Reports must disclose major defects clearly; minor items are listed for completeness.",
  },
  {
    question: "Can I use the inspection to negotiate a lower price?",
    answer:
      "Yes, and you should. If defects are found, get repair quotes from licensed tradespeople (not verbal estimates), then negotiate a price reduction equal to the cost of repairs. The vendor may agree to a price reduction, fix the defects before settlement, or refuse to negotiate (in which case, depending on your contract conditions, you may be able to walk away).",
  },
  {
    question: "Should I trust an inspector recommended by the real estate agent?",
    answer:
      "No. The agent works for the vendor and has an interest in the sale completing quickly with minimal complications. An inspector with an ongoing referral relationship may be unwilling to flag issues that could derail a sale. Always engage your own independent inspector with professional indemnity insurance.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Buying Property in Australia",  href: "/guides/buying-property-australia",  description: "Where the inspection sits in the broader buying process." },
  { title: "Property Auction Guide",        href: "/guides/property-auction-guide",     description: "Why auction buyers must inspect before auction day." },
  { title: "Conveyancing Guide",            href: "/guides/conveyancing-guide",         description: "The other professional you'll engage before settlement." },
  { title: "First Home Buyer Guide",        href: "/guides/first-home-buyer-guide",     description: "Inspections in the broader first-home process." },
  { title: "Stamp Duty Calculator",         href: "/stamp-duty-calculator",             description: "Inspection cost is small relative to settlement-day stamp duty." },
  { title: "Browse suburbs",                href: "/suburbs",                           description: "Pick the suburb first, then commission inspections on shortlisted properties." },
];

export default function BuildingPestInspectionPage() {
  return (
    <>
      <HowToJsonLd
        name="How to commission a building and pest inspection"
        description="The six-step process for booking and acting on a building and pest inspection in Australia."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Pick licensed inspectors", text: "Building inspector + pest inspector. Some firms bundle both. Always check the licence number on your state register." },
          { name: "Book before exchange", text: "Or before auction day if buying at auction (no cooling-off applies)." },
          { name: "Attend the inspection if possible", text: "An inspector who knows you'll join will explain findings live and let you ask questions." },
          { name: "Read the full report carefully", text: "Major structural issues vs cosmetic. Major: structural cracks, termite damage, drainage. Cosmetic: paint, kitchens, gardens." },
          { name: "Negotiate or rescind based on findings", text: "Use significant findings to renegotiate price or repairs, or rescind during cooling-off." },
          { name: "Get specialist follow-ups if flagged", text: "Structural engineer, plumber, or roofer if the inspector recommends specialist review." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="tip" title="The single best $500 you'll spend">
        <p>
          A building and pest inspection at $400 to $800 can uncover tens of
          thousands of dollars in potential issues, or give you confidence to
          proceed at full price. Either way, it&rsquo;s the highest-leverage
          spend in the buying process.
        </p>
      </Callout>

      <h2 id="why-need">Why you need a building and pest inspection</h2>
      <p className="lead">
        When purchasing property in Australia, you have limited rights to seek
        remedies after settlement for defects you could have discovered
        beforehand. The principle of <em>caveat emptor</em> (buyer beware)
        means the burden is on you to investigate the property&rsquo;s
        condition before signing an unconditional contract.
      </p>
      <p>A professional building and pest inspection commissioned before exchange gives you:</p>
      <ul>
        <li><strong>Full disclosure of the property&rsquo;s condition</strong> from a qualified professional, not just what&rsquo;s visible to the naked eye.</li>
        <li><strong>Negotiating power.</strong> If significant defects are found, you can ask for a price reduction or require the vendor to fix them before settlement.</li>
        <li><strong>Walk-away rights.</strong> In a private sale with a building inspection condition, you can withdraw from the purchase if major defects are found.</li>
        <li><strong>Future maintenance planning.</strong> Even if all issues are minor, the report helps you understand what maintenance to budget for.</li>
      </ul>

      <Callout variant="warning" title="Auction buyers: inspect BEFORE auction day">
        <p>
          There is no cooling-off period at auction and no subject-to-inspection
          clause. Once the hammer falls, you&rsquo;re committed. Always have
          your inspection report in hand before raising your bidder number.
        </p>
      </Callout>

      <h2 id="whats-inspected">What&rsquo;s inspected</h2>
      <p>A standard combined building and pest inspection in Australia covers:</p>

      <h3>Building inspection</h3>
      <ul>
        <li>Roof (tiles, gutters, flashings, penetrations)</li>
        <li>Roof space (structure, insulation, ventilation)</li>
        <li>Subfloor area (drainage, moisture, structure)</li>
        <li>External walls (cladding, rendering, cracks)</li>
        <li>Internal walls and ceilings (cracks, water damage, stains)</li>
        <li>Floors (bounce, squeaks, levelness)</li>
        <li>Windows and doors (operation, sealing, frames)</li>
        <li>Wet areas (bathrooms, laundry, kitchen) for waterproofing and drainage</li>
        <li>Garage and outbuildings</li>
        <li>Visible drainage and stormwater</li>
        <li>Retaining walls and fencing</li>
      </ul>

      <h3>Pest inspection</h3>
      <ul>
        <li>Termite activity (live termites, past activity, damage)</li>
        <li>Termite conducive conditions (timber-to-soil contact, excessive moisture)</li>
        <li>Timber borers</li>
        <li>Evidence of other pests (rodents, wood decay fungus)</li>
      </ul>
      <p>
        Note: inspectors can only assess what is accessible and visible. A
        building inspection is not a structural engineering report or a
        compliance inspection, it identifies visible defects and issues, not
        hidden structural faults (unless there are visual indicators).
      </p>
      <p>
        Inspectors generally do not test individual electrical outlets, gas
        appliances, or plumbing fixtures (beyond a visual check). A separate
        electrical or plumbing inspection may be warranted for older properties.
      </p>

      <h2 id="common-issues">Common issues found</h2>
      <p>
        Experienced inspectors find something in almost every property they
        inspect, the question is severity.
      </p>

      <h3>High severity (deal-breakers or major price negotiation)</h3>
      <ul>
        <li><strong>Active termite infestation.</strong> Termites can cause extensive structural damage, particularly to timber-framed homes. Active infestations require immediate professional treatment and can require significant structural repairs.</li>
        <li><strong>Rising damp.</strong> Moisture wicking up through walls from the ground, often caused by failed damp-proof courses. Can cause structural damage, mould, and health issues. Repairs can cost $5,000 to $30,000+.</li>
        <li><strong>Major structural cracks.</strong> Diagonal or step cracking through external masonry walls, particularly around windows and door frames, can indicate foundation movement. May require a structural engineer&rsquo;s assessment.</li>
        <li><strong>Significant roof damage.</strong> Failed flashings, cracked tiles, or deteriorated roofing membranes that require full replacement. Roof replacements can cost $10,000 to $30,000+.</li>
        <li><strong>Subfloor drainage issues.</strong> Poor drainage allowing water pooling under the house, which promotes termite activity and timber decay.</li>
      </ul>

      <h3>Moderate (maintenance items to budget for)</h3>
      <ul>
        <li>Cracked or missing roof tiles</li>
        <li>Blocked or poorly graded gutters and downpipes</li>
        <li>Failed bathroom waterproofing (common in older properties)</li>
        <li>Termite conducive conditions (but no active infestation)</li>
        <li>Deteriorated external paint and caulking</li>
        <li>Substandard electrical (older switchboards, surface-mounted wiring)</li>
        <li>Retaining walls showing signs of movement</li>
      </ul>

      <h3>Minor (normal wear and tear)</h3>
      <ul>
        <li>Sticking doors and windows</li>
        <li>Hairline cracks in plasterboard walls</li>
        <li>Worn or damaged floor coverings</li>
        <li>Minor external paint deterioration</li>
      </ul>

      <h2 id="cost">Cost of inspections</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Typical cost</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Building inspection only</td><td>$250 to $500</td></tr>
          <tr><td>Pest inspection only</td><td>$150 to $300</td></tr>
          <tr><td>Combined building and pest (recommended)</td><td>$400 to $800</td></tr>
          <tr><td>Large home (5+ bed) or rural property</td><td>$600 to $1,200+</td></tr>
          <tr><td>Strata / apartment</td><td>$250 to $500</td></tr>
        </tbody>
      </table>

      <KeyFigure
        value="$400–$800"
        label="Combined building and pest inspection on a typical Australian residential home. The cheapest leverage point in the entire buying process."
        context="Larger / rural properties run higher"
      />

      <p>
        Always get a combined building and pest inspection from the same
        inspector (or at least coordinate the two). Many defects that attract
        pests (e.g. moisture, timber decay) are identified in both inspections,
        a combined report gives the full picture.
      </p>

      <h2 id="who-to-hire">Who to hire</h2>
      <p>Look for an inspector with the following qualifications:</p>
      <ul>
        <li><strong>Building inspector.</strong> Should be a licensed builder, architect, or engineer with inspection qualifications. Check for membership in the Australian Institute of Building Surveyors (AIBS) or similar.</li>
        <li><strong>Pest inspector.</strong> Should be a licensed pest controller or timber pest inspector, qualified under Australian Standard AS 4349.3.</li>
        <li><strong>Professional indemnity insurance.</strong> Essential. If the inspector misses a significant issue, you need recourse.</li>
      </ul>

      <Callout variant="warning" title="Don't use the agent's recommended inspector">
        <p>
          The agent works for the vendor. An inspector with an ongoing referral
          relationship may be unwilling to flag issues that could derail a
          sale. Always engage your own independent inspector.
        </p>
      </Callout>

      <p>
        Try to attend the inspection in person. A good inspector will walk you
        through the property and explain findings in plain English, far more
        valuable than reading a report alone.
      </p>

      <h2 id="timing">When to get the inspection</h2>
      <ul>
        <li><strong>Private sale with conditions.</strong> The inspection clause in your contract gives you a set timeframe (typically 7 to 14 days after exchange) to commission the inspection and, if issues are found, to either withdraw or renegotiate.</li>
        <li><strong>Before auction.</strong> Must be done <em>before</em> auction day. Contact the agent to arrange access. Allow at least 48 to 72 hours turnaround to receive the report.</li>
        <li><strong>Before making an offer (preferred).</strong> Some buyers commission inspections before making an offer to negotiate with full knowledge. This means paying for an inspection on properties you may not buy, but avoids conditional delays.</li>
      </ul>

      <h2 id="reading-report">How to read the report</h2>
      <p>
        Building and pest reports follow a standard format (typically AS 4349.1
        for building and AS 4349.3 for pests). Key sections to focus on:
      </p>
      <ol>
        <li><strong>Summary / overview.</strong> This section gives the inspector&rsquo;s overall assessment. Read this first, does the inspector flag any &ldquo;major defects&rdquo; or &ldquo;safety hazards&rdquo;?</li>
        <li><strong>Major defects.</strong> These are defects that require significant remediation. A major defect in the report is different from minor maintenance items.</li>
        <li><strong>Pest activity.</strong> Any active termite evidence, past termite damage, or conducive conditions. Note: past termite activity (treated and resolved) is less concerning than active infestation.</li>
        <li><strong>Photographs.</strong> Good reports include photos of all significant findings. Review these carefully, a crack in a photo often communicates more than a paragraph of text.</li>
        <li><strong>Items not inspected.</strong> Reports must disclose what could not be accessed. Unexplored areas (e.g. concealed roof void, locked rooms) are risk areas.</li>
      </ol>
      <p>
        Not all defects are created equal. A report listing 15 minor items is
        very different from one listing 3 major defects. If in doubt, call the
        inspector directly and ask them to explain the severity and estimated
        cost of remediation.
      </p>

      <h2 id="negotiating">Negotiating after an inspection</h2>
      <p>If the inspection reveals significant issues, you have several options:</p>
      <ol>
        <li><strong>Withdraw from the purchase</strong> (if within your inspection condition timeframe). You are entitled to a refund of the deposit.</li>
        <li><strong>Negotiate a price reduction.</strong> Get quotes for the identified repairs and ask the vendor to reduce the price by that amount. Be specific, quote the estimated cost and attach the relevant section of the report.</li>
        <li><strong>Ask the vendor to fix it.</strong> For some issues (particularly safety hazards), you can request the vendor rectify the defect before settlement. Less common, most vendors prefer to reduce the price than arrange repairs.</li>
        <li><strong>Accept and proceed.</strong> If defects are minor and the price already reflects the condition, you may choose to proceed without negotiation.</li>
      </ol>
      <p>When negotiating based on inspection findings:</p>
      <ul>
        <li>Get repair quotes from licensed tradespeople (not verbal estimates)</li>
        <li>Be reasonable, all properties have some defects</li>
        <li>Focus on major defects, not minor wear and tear</li>
        <li>Negotiate through your conveyancer or agent, in writing</li>
      </ul>

      <h2 id="new-homes">Inspections for new homes</h2>
      <p>
        Many buyers assume new homes don&rsquo;t need an inspection. This is
        a mistake. Common issues found in new construction include:
      </p>
      <ul>
        <li>Incomplete waterproofing or substandard bathroom tiling</li>
        <li>Drainage issues not visible at ground level</li>
        <li>Structural cracks in brickwork from settling</li>
        <li>Substandard insulation or missing insulation</li>
        <li>Defects in electrical or plumbing that didn&rsquo;t pass handover inspection</li>
      </ul>
      <p>
        For new homes, consider engaging a <strong>pre-handover inspector</strong>{" "}
        who attends the builder&rsquo;s handover inspection with you. Any
        defects identified can be included in a defects list that the builder
        must rectify before you take possession.
      </p>
      <p>
        New homes typically come with a statutory warranty period (usually 6
        years for structural defects, 2 years for non-structural defects in
        most states). Document any issues with photos and written notices to
        the builder. See our{" "}
        <Link href="/guides/buying-property-australia">complete buying guide</Link>{" "}
        for the broader process.
      </p>
    </GuideArticleLayout>
    </>
  );
}
