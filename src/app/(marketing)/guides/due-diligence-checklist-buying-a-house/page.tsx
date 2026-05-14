import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Due Diligence Checklist for Buying a House in Australia (2026)",
  description:
    "Every check, document, and red flag to investigate before you sign a contract on an Australian residential property. Use as a pre-offer and pre-settlement playbook.",
  slug: "due-diligence-checklist-buying-a-house",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
  readingTimeMinutes: 13,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "first-home",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
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
  "Due diligence is everything you check before signing a contract (or, for auctions, before bidding). Skipping it can cost tens or hundreds of thousands of dollars and there's no path back once the contract is unconditional.",
  "Three layers: the property itself (building, pest, structural), the legal stack (title, contract, zoning), and the price (comparable sales, market conditions).",
  "Building and pest inspection: $400–$800. Strata report (units): $250–$400. Conveyancer review: $800–$2,000. Total due diligence cost: typically $1,500–$3,500. Money well spent.",
  "Pre-auction: you have to do due diligence before bidding because auction contracts are unconditional. Private treaty: most due diligence happens during the cooling-off period.",
  "Red flags to walk away from: unapproved structural work, illegal building modifications, body corporate funding problems, contaminated land, asbestos in poor condition, easements that affect what you can build.",
  "Don't rely solely on the seller's disclosure or the agent's representations. Both are subject to bias and can be incomplete. Get independent professional reports.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-it-is",        label: "What due diligence is" },
  { id: "timing",             label: "When to do it" },
  { id: "property-physical",  label: "Physical property checks" },
  { id: "legal-stack",        label: "Legal and contract checks" },
  { id: "price-checks",       label: "Price and market checks" },
  { id: "for-units",          label: "Extra checks for units and townhouses" },
  { id: "for-acreage",        label: "Extra checks for acreage and rural" },
  { id: "for-new-builds",     label: "Extra checks for new builds and off-the-plan" },
  { id: "red-flags",          label: "Red flags worth walking away from" },
  { id: "checklist",          label: "The complete pre-purchase checklist" },
];

const FAQS: FaqItem[] = [
  {
    question: "What does due diligence mean when buying a house?",
    answer:
      "Due diligence is the investigation a buyer does before signing a contract: checking the physical condition of the property (building and pest), reviewing the legal documents (contract, title, planning), and verifying the price against comparable sales. The goal is to surface anything that would change your decision or your price, before you're contractually committed. Skipping due diligence is one of the most expensive mistakes in property. Defects you discover post-settlement are yours to fix.",
  },
  {
    question: "How much does due diligence cost?",
    answer:
      "Typical residential due diligence for a single property: building and pest inspection $400–$800, strata report (units) $250–$400, conveyancer review of the contract $800–$2,000, optional surveyor for boundary disputes $1,000–$3,000. Total commonly $1,500–$3,500. Add a few hundred for a second opinion on big structural concerns. The cost is meaningful but small relative to the purchase, and you'd pay multiples of it to fix a problem you missed.",
  },
  {
    question: "When should I do due diligence?",
    answer:
      "Before signing a contract. For private treaty purchases, you can typically negotiate the contract subject to building and pest inspection and finance, then do the checks during the cooling-off period (varies by state, 3 to 14 days). For auctions, you must do everything before auction day because the contract is unconditional from the fall of the hammer. This means paying for inspections on properties you might not win. Frustrating but unavoidable in active auction markets.",
  },
  {
    question: "Do I really need a building and pest inspection?",
    answer:
      "Yes, on virtually every house purchase. The cost is $400–$800; the alternative is buying a property with hidden termite damage, structural problems, leaking roof, or asbestos issues that can cost $20,000–$100,000+ to remediate. The exception: brand-new builds with current builder warranties and clear engineer sign-off. Even then, an independent inspection is cheap insurance. For units and apartments, a building inspection is less important (most issues are common-property concerns covered by the strata report) but pest inspection still has value on ground-floor units.",
  },
  {
    question: "What's a strata report and do I need one?",
    answer:
      "A strata report (also called a body corporate report or owners corporation search) is a professional review of the body corporate's records: meeting minutes, financial statements, sinking fund balance, recent special levies, current legal disputes, planned major works, insurance coverage, and bylaws. Cost: $250–$400. Required reading for any unit, townhouse, or apartment purchase. The single biggest hidden cost in unit purchases is a poorly-funded body corporate that levies special charges of $10,000–$50,000+ for unexpected major works. The strata report would flag this risk before you commit.",
  },
  {
    question: "Should I trust the contract / Section 32 / disclosure statement?",
    answer:
      "Read it carefully but don't rely on it as your only check. State-mandated disclosure documents (Section 32 in VIC, seller disclosure in QLD from August 2025, contract with annexures in NSW) require certain disclosures but each state's regime has gaps. Sellers must disclose specific matters but aren't required to flag every defect, and \"buyer beware\" still applies to most physical condition issues. Your conveyancer reads the disclosure for what's wrong with it as much as what's in it.",
  },
  {
    question: "What if the property is sold 'as is', can I still do due diligence?",
    answer:
      "Yes. \"As is\" means the seller isn't fixing anything before settlement. It doesn't prevent your due diligence. Auctions are effectively \"as is\" because there's no contract negotiation; you do all your due diligence pre-auction, then bid (or don't) with full knowledge. Deceased estates are often sold as is to clear estate quickly. The price typically reflects this, but you still want the inspections, because the discount you get may or may not cover the actual cost of work needed.",
  },
  {
    question: "Can I get out of a contract if due diligence reveals problems?",
    answer:
      "Depends on the contract structure. Auction contracts are unconditional from the hammer; you can't withdraw, period. Private treaty contracts can be made subject to building and pest, finance, and other conditions; if those conditions aren't met, you can walk with deposit refunded (or partial refund depending on state and contract wording). The cooling-off period (3–5 days in NSW, 3 days in VIC, 5 days in QLD private treaty) lets you withdraw for any reason with a small penalty (typically 0.25% of price in NSW, 0.2% in VIC). Read your specific contract carefully.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Building and Pest Inspection Guide",     href: "/guides/building-pest-inspection",          description: "What's actually checked, what the report means, and what to do when red flags appear." },
  { title: "Conveyancing Guide",                      href: "/guides/conveyancing-guide",                description: "What your conveyancer or solicitor does at every stage of the buy." },
  { title: "Property Auction Guide",                  href: "/guides/property-auction-guide",            description: "Including how to do due diligence before auction day." },
  { title: "Cooling-off Period by State",             href: "/guides/cooling-off-period-by-state-australia", description: "The state-by-state breakdown of when you can withdraw from a contract." },
  { title: "How Long Does It Take to Buy a House",   href: "/guides/how-long-does-it-take-to-buy-a-house-australia", description: "The full timeline from offer to settlement." },
  { title: "Buyer's Agent Cost Guide",                href: "/guides/buyers-agent-cost-australia",       description: "When a buyer's agent's fee earns itself back in due-diligence rigour." },
];

export default function DueDiligenceChecklistPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="How to use this checklist">
        <p>
          Work through it section by section before you make any offer or
          bid. Don&rsquo;t skip steps even on a property you&rsquo;re
          excited about. Emotional bias is the single biggest enemy of
          good property decisions, and a checklist is the cheapest way to
          fight it.
        </p>
      </Callout>

      <h2 id="what-it-is">What due diligence is</h2>
      <p className="lead">
        Due diligence is everything you investigate before committing to
        buy a property. The investigation falls into three layers:
        <strong> the physical property</strong> (is it structurally sound,
        free of pests, well-maintained?), <strong>the legal stack</strong>{" "}
        (clear title, no nasty encumbrances, contract terms acceptable),
        and <strong>the price</strong> (does this reflect the suburb, the
        property condition, and the market right now?). Each layer
        independently can kill a deal; you check all three before signing.
      </p>
      <p>
        The blunt rule: it&rsquo;s much cheaper to walk away from a bad
        property than to fix it after settlement. The total cost of full
        residential due diligence (~$1,500–$3,500) is small relative to
        any one defect you might find.
      </p>

      <KeyFigure
        value="$1.5k–$3.5k"
        label="Typical total cost of full residential due diligence"
        context="Building/pest, strata, conveyancing, plus optional surveyor"
      />

      <h2 id="timing">When to do it</h2>
      <p>
        Timing depends on the sale method.
      </p>
      <h3>Private treaty</h3>
      <p>
        You can typically include the property contract as subject to
        building and pest inspection and subject to finance. Once your
        offer is accepted, you have the{" "}
        <Link href="/guides/cooling-off-period-by-state-australia">cooling-off period</Link> (3–14 days
        depending on state and contract) plus any subject-to deadlines to
        complete due diligence. If the inspections reveal serious issues or
        finance falls through, you can withdraw with deposit refunded (or
        partial penalty depending on state).
      </p>
      <h3>Auction</h3>
      <p>
        Auction contracts are unconditional from the fall of the hammer.
        You can&rsquo;t make the bid subject to inspections, finance, or
        anything else. This means all due diligence must happen{" "}
        <em>before</em> you bid. In active auction markets you&rsquo;ll
        often pay for inspections on multiple properties you don&rsquo;t
        win. Frustrating, but the alternative (skipping due diligence to
        save money on losing bids) is much worse.
      </p>
      <h3>Off-market</h3>
      <p>
        Off-market sales typically run as private treaty with conditional
        contracts. The benefit is no auction pressure; the cost is less
        competitive tension on price. Standard due diligence timeline.
      </p>

      <h2 id="property-physical">Physical property checks</h2>
      <p>
        Independent inspections of the physical property:
      </p>
      <ul>
        <li><strong>Building inspection</strong>: licensed inspector reviews structure, roof, foundations, walls, electrical, plumbing, drainage, weatherproofing. Cost $300–$600 for a typical 3-bed house, more for larger or older properties.</li>
        <li><strong>Pest inspection</strong>: licensed pest controller checks for termite activity, termite damage, borers, rodents. Often bundled with building inspection ($400–$800 combined). Critical for any timber-frame Australian home, particularly QLD, NSW north coast, parts of VIC.</li>
        <li><strong>Asbestos assessment</strong> for properties built before 1990. Asbestos in good condition isn&rsquo;t necessarily a deal-breaker, but you need to know what&rsquo;s there.</li>
        <li><strong>Pool inspection</strong> (where applicable): cost $250–$500. Pool issues are expensive: leaking liners, structural damage, non-compliant fences all cost five figures to fix.</li>
        <li><strong>Septic system check</strong> for rural properties: $300–$600. Failing septic systems require replacement at $10,000–$30,000+.</li>
        <li><strong>Independent valuation</strong> (optional but useful): a registered valuer gives an independent opinion of market value, particularly useful if you&rsquo;re negotiating against a real-estate-agent appraisal. Cost: $400–$800.</li>
      </ul>
      <p>
        Read the inspection report yourself. Don&rsquo;t just rely on the
        inspector&rsquo;s verbal summary. Cross-reference any flagged
        issues against repair cost estimates from a licensed builder before
        deciding to proceed, renegotiate, or walk.
      </p>

      <Callout variant="warning" title="Building inspectors are not all equal">
        <p>
          The industry has variable quality. Some &quot;inspectors&quot;
          spend 45 minutes producing a 20-page report. Look for: full
          licence, experience with your property type/age/state, sample
          reports available on request, and clear independence from
          selling agents (some agents recommend tame inspectors who
          downplay issues). For complex or older properties, paying $200
          more for a top-tier inspector is the cheapest insurance you can
          buy.
        </p>
      </Callout>

      <h2 id="legal-stack">Legal and contract checks</h2>
      <p>
        Your <Link href="/guides/conveyancing-guide">conveyancer</Link> or solicitor runs the legal due diligence. You
        engage them <strong>before</strong> the offer or bid, not after.
        Their job:
      </p>
      <ul>
        <li><strong>Title search</strong>: confirms the seller actually owns the property and there are no undisclosed parties on the title.</li>
        <li><strong>Encumbrance check</strong>: any caveats, easements, restrictive covenants, mortgages, or unpaid rates registered against the title. Easements (right-of-way over your land for utilities or neighbour access) can materially affect what you can build on the property.</li>
        <li><strong>Zoning verification</strong>: confirms the property is zoned for residential use and that any future plans (extending, building a granny flat, converting to dual occupancy) are at least possible.</li>
        <li><strong>Planning history</strong>: was the existing structure built with council approval? Unapproved structural work creates a financial liability for the buyer that the seller often doesn&rsquo;t disclose.</li>
        <li><strong>Contract terms review</strong>: special conditions, settlement period, deposit, inclusions list, vendor warranties. Many contracts have boilerplate that disadvantages buyers; your conveyancer flags any clauses you should negotiate.</li>
        <li><strong>Property certificates</strong>: rates certificate (outstanding rates), water certificate, land tax certificate. Outstanding rates at settlement are typically apportioned between seller and buyer.</li>
        <li><strong>Section 32 (VIC) / Seller Disclosure (QLD from August 2025) / Contract annexures (NSW) review</strong>: state-mandated seller disclosure documents. Your conveyancer reads them for both what&rsquo;s in them and what&rsquo;s suspiciously absent.</li>
        <li><strong>Special characteristics check</strong>: heritage listing, bushfire-prone-land mapping, flood mapping, contamination notations, mine subsidence districts.</li>
      </ul>

      <MatchCTA kind="conveyancer" />

      <h2 id="price-checks">Price and market checks</h2>
      <p>
        Independent of the inspections and legal work, you need to know
        whether the price is reasonable:
      </p>
      <ul>
        <li><strong>Comparable sales (last 90 days)</strong>: pull every sale in the suburb from realestate.com.au, domain.com.au, or a paid comparable-sales database. Filter to similar property type, similar bedrooms/bathrooms, similar land size. Adjust each comparable up or down for differences. The resulting range is your honest price expectation.</li>
        <li><strong>Suburb price trend</strong>: is the suburb&rsquo;s median price rising or falling? Days on market trending up or down? Both should inform your offer.</li>
        <li><strong>Per-square-metre check</strong> (units especially): comparing $/m² across recent sales in the same building or comparable buildings normalises across different unit sizes.</li>
        <li><strong>Cost of repairs or upgrades</strong>: if the inspection flags work, get a builder estimate of the cost. Subtract from your offer price if you&rsquo;re proceeding.</li>
        <li><strong>Independent valuation</strong> (optional): a registered valuer&rsquo;s opinion as a sanity check.</li>
      </ul>
      <p>
        Use our <Link href="/best-suburbs">best suburbs</Link> and{" "}
        <Link href="/price-guide">median price lookup</Link> as starting
        points; cross-reference against the agent&rsquo;s claims.
      </p>

      <h2 id="for-units">Extra checks for units and townhouses</h2>
      <p>
        Strata-titled properties have a whole second layer of due
        diligence:
      </p>
      <ul>
        <li><strong>Strata report</strong> (as discussed in FAQ above): non-negotiable.</li>
        <li><strong>Recent body corporate financials</strong>: sinking fund balance, current administration fund, special levies in the last 3 years, planned major works.</li>
        <li><strong>Insurance coverage</strong>: building, public liability, voluntary insurance. Underinsured buildings expose owners to top-up levies after major incidents.</li>
        <li><strong>Owners corporation / strata bylaws</strong>: pet rules, short-term rental restrictions (Airbnb), renovation approval rules, balcony rules, smoking rules.</li>
        <li><strong>Litigation history and disputes</strong>: ongoing or recent legal disputes can mean special levies. Defects claims against builders for newer buildings are common and material.</li>
        <li><strong>Capital works plan</strong> for the next 10 years: what major works are planned, when, and how funded.</li>
        <li><strong>Unit utilisation</strong>: percentage owner-occupied vs investor-tenanted. High investor ratios (60%+) often correlate with poorer building maintenance and more transient tenant issues.</li>
      </ul>

      <h2 id="for-acreage">Extra checks for acreage and rural</h2>
      <ul>
        <li><strong>Water source</strong>: town water, bore, tank, or river. Reliability and quality testing.</li>
        <li><strong>Septic system</strong> (no town sewer): age, condition, recent maintenance records.</li>
        <li><strong>Power supply</strong>: connected, solar with battery, off-grid. Upgrade costs if any.</li>
        <li><strong>Bushfire zone</strong>: BAL rating (Bushfire Attack Level). Properties in BAL-FZ and BAL-40 zones have stringent and expensive building requirements.</li>
        <li><strong>Flood zone</strong>: check council flood maps. Even partial flood exposure significantly affects insurance cost and resale.</li>
        <li><strong>Access</strong>: confirm legal access road (some rural properties have informal track access that isn&rsquo;t legally guaranteed).</li>
        <li><strong>Mining and resource leases</strong>: in some states, mining leases override surface rights. Affects QLD coal regions especially.</li>
        <li><strong>Easements</strong>: powerlines, water pipes, drainage easements crossing rural properties are common and can constrain future building.</li>
      </ul>

      <h2 id="for-new-builds">Extra checks for new builds and off-the-plan</h2>
      <ul>
        <li><strong>Builder solvency check</strong>: search the licensee, look for recent insolvencies in the corporate group, check the home warranty insurer&rsquo;s site for any project issues.</li>
        <li><strong>Builder licence + insurance</strong>: confirm current and adequate home warranty insurance.</li>
        <li><strong>Defects liability period</strong>: the post-handover window where the builder must fix defects. Typically 12 months in most states, longer in some.</li>
        <li><strong>Sample units/recent completed projects</strong>: walk through completed projects from the same builder before committing.</li>
        <li><strong>Off-the-plan: sunset clauses</strong>: the date by which the project must complete or you can withdraw with deposit refunded. Critical for buyer protection.</li>
        <li><strong>Off-the-plan: substitution / variation clauses</strong>: how much the developer can change from the marketed plan without your consent. Watch for clauses allowing significant size or feature changes.</li>
        <li><strong>Off-the-plan: deposit security</strong>: confirm the deposit is held in trust by a third party, not at-risk in the developer&rsquo;s operating accounts.</li>
      </ul>

      <h2 id="red-flags">Red flags worth walking away from</h2>
      <p>
        Some findings should end your interest immediately:
      </p>
      <ul>
        <li><strong>Unapproved structural work.</strong> A second storey, granny flat, deck, or major renovation done without council approval is your problem post-settlement. Cost to legalise (often involving demolition plus reapproval) can be $30,000–$200,000+.</li>
        <li><strong>Significant active termite damage</strong> not yet remediated. Remediation cost depends on extent.</li>
        <li><strong>Structural movement / cracking</strong> requiring engineering remediation.</li>
        <li><strong>Asbestos in poor condition</strong> in occupied areas. Friable asbestos remediation is $20,000–$80,000+ and Class A licensed work.</li>
        <li><strong>Body corporate funding crisis</strong>: empty sinking fund plus planned major works ahead means a special levy ahead.</li>
        <li><strong>Contamination on the title</strong>: former industrial site, fuel station, dry cleaner, or noted in EPA records. Affects insurability, financability, future remediation cost.</li>
        <li><strong>Easements affecting buildability</strong>: a sewer easement crossing the part of the block where you wanted to extend.</li>
        <li><strong>Heritage listing</strong> you didn&rsquo;t know about: limits what you can change. Not necessarily a deal-breaker but should be priced in.</li>
        <li><strong>Underquoting</strong> by the agent so significant that the property is well out of your range: walk early.</li>
        <li><strong>Seller&rsquo;s urgent settlement insistence</strong> without a reasonable explanation: occasionally indicates hidden issues.</li>
      </ul>

      <h2 id="checklist">The complete pre-purchase checklist</h2>
      <p>Print this. Work through each item.</p>
      <h3>Pre-offer / pre-auction</h3>
      <ul>
        <li>☐ Pre-approval letter in hand (see <Link href="/guides/home-loan-pre-approval-australia">home loan pre-approval guide</Link>)</li>
        <li>☐ Conveyancer engaged</li>
        <li>☐ Reviewed Section 32 / disclosure / contract with conveyancer</li>
        <li>☐ Building + pest inspection booked and report received</li>
        <li>☐ Strata report received (if unit/townhouse)</li>
        <li>☐ Pool / septic / asbestos / specialty inspections as needed</li>
        <li>☐ Comparable sales pulled and price range agreed</li>
        <li>☐ Visited the property at different times of day</li>
        <li>☐ Drove the suburb at night and on weekends</li>
        <li>☐ Checked council planning maps (zoning, future development, flood, bushfire)</li>
        <li>☐ Checked the agent&rsquo;s recent sold listings for over/underquoting patterns</li>
        <li>☐ Walked the boundaries, confirmed with fence lines and title plan</li>
        <li>☐ Checked NBN, mobile coverage, public transport practicalities</li>
        <li>☐ Checked schools, hospitals, supermarkets (if relevant)</li>
        <li>☐ Insurance quote obtained (factor into ongoing cost)</li>
      </ul>
      <h3>Post-offer / cooling-off period (private treaty only)</h3>
      <ul>
        <li>☐ Final conveyancer contract review</li>
        <li>☐ Any inspection-flagged work re-checked with a licensed builder/specialist</li>
        <li>☐ Lender valuation (typically lender-driven, but track it)</li>
        <li>☐ Insurance arranged for settlement date</li>
      </ul>
      <h3>Pre-settlement</h3>
      <ul>
        <li>☐ Pre-settlement inspection, confirms property in contracted condition, all inclusions present</li>
        <li>☐ Final settlement figures from conveyancer (rates apportionment, etc.)</li>
        <li>☐ Funds ready to clear</li>
        <li>☐ Utilities arranged from settlement date (electricity, gas, water, internet)</li>
        <li>☐ Change of address paperwork started (banks, employer, electoral roll, etc.)</li>
      </ul>

      <MatchCTA
        kind="buyers-agent"
        lead="If due diligence feels overwhelming or you don't trust your own bias on a particular property, a buyer's agent handles all of this professionally and gets you a stronger price."
      />

      <Sources items={[
        "Australian Securities and Investments Commission, MoneySmart guide to buying a home (current 2025).",
        "Australian Standard 4349.1, Inspection of buildings, Pre-purchase inspections (most recent revision).",
        "Australian Standard 3660.2, Termite management in and around existing buildings (current).",
        "State-by-state cooling-off period legislation (Property Stock and Business Agents Act 2002 NSW; Sale of Land Act 1962 VIC; Property Occupations Act 2014 QLD; equivalents in other states).",
        "Queensland Government, seller-disclosure regime (Property Law Act 2023, effective 1 August 2025).",
      ]} />
    </GuideArticleLayout>
  );
}
