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
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How to Find a Builder in Australia (2026)",
  description:
    "How to shortlist, vet, and engage a residential builder for renovations and new builds in Australia. Licences, insurance, contracts, references, and the red flags worth walking away from.",
  slug: "how-to-find-a-builder-australia",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
  readingTimeMinutes: 12,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "renovating",
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
  "Picking the wrong builder is the single biggest cost-overrun and project-failure risk in any renovation or new build. Slow down here.",
  "Every Australian state has a licensing register. Confirm your shortlisted builders hold a current licence plus current home warranty insurance (called domestic building insurance in VIC, statutory warranty in QLD) BEFORE you sign anything.",
  "Get three written quotes with itemised line items. A quote that's just a single total figure isn't enough to compare or contract on.",
  "Don't pick on price alone. The cheapest quote almost always becomes the most expensive job, through variations, slow progress, or post-failure remediation.",
  "Builder insolvencies in 2023–24 hit thousands of Australian homeowners. Check the company's solvency, recent project history, and home warranty insurer's site before contracting.",
  "Fixed-price suits straightforward jobs with clear scope. Cost-plus suits complex work where scope evolves and you trust the builder. Get advice on which fits your project.",
];

const TOC: GuideTOCEntry[] = [
  { id: "why-it-matters",   label: "Why builder choice matters" },
  { id: "what-builders-do", label: "What different builders do" },
  { id: "shortlist",         label: "How to build a shortlist" },
  { id: "verify-licence",    label: "Verifying licence and insurance" },
  { id: "interview",         label: "Interviewing builders" },
  { id: "references",        label: "Checking references and recent jobs" },
  { id: "quotes",            label: "Getting comparable quotes" },
  { id: "contract",          label: "The contract: what to look for" },
  { id: "red-flags",         label: "Red flags worth walking away from" },
  { id: "after-engagement",  label: "Once you've engaged" },
];

const FAQS: FaqItem[] = [
  {
    question: "How do I check if a builder is licensed in Australia?",
    answer:
      "Every state has a public licensing register. NSW: Service NSW \"Verify a tradesperson\" or NSW Fair Trading licence search. VIC: Victorian Building Authority (VBA) licence search. QLD: Queensland Building and Construction Commission (QBCC) licence search. WA: Building Commission WA. SA: Consumer and Business Services SA. TAS: Consumer, Building and Occupational Services. ACT and NT: their respective fair trading bodies. Search by company name AND by named individual builder. Confirm: licence is current (not expired/suspended), the licence class covers your work type, and check for any recent disciplinary actions.",
  },
  {
    question: "What is home warranty insurance and do I need it?",
    answer:
      "Home warranty insurance (called domestic building insurance in VIC, statutory warranty in QLD, Home Building Compensation Fund in NSW) is a state-mandated insurance that protects you if the builder dies, disappears, becomes insolvent, or fails to complete the job. It's required for residential building work above a state-defined threshold (typically $20,000–$30,000+). The builder pays for the policy and provides you with a certificate before work starts. NEVER pay a deposit before receiving the home warranty insurance certificate for your specific project. Builders who can't get insurance generally can't be insured, which usually means past disputes or solvency issues.",
  },
  {
    question: "How many builder quotes should I get?",
    answer:
      "Three is the right number. One quote gives you no benchmark. Two quotes, if they're very different, leave you uncertain about which is the outlier. Three gives you a defensible range and lets you see how each builder approaches scope, risk, and pricing. Over four is diminishing returns: it takes the builders' time (which is reflected in pricing) and your time to evaluate.",
  },
  {
    question: "What's the difference between a project home builder and a custom builder?",
    answer:
      "Project home builders (Metricon, Henley, Coral Homes, GJ Gardner, etc.) build from a catalogue of standard designs with limited variations. Pros: lower cost per square metre ($1,800–$2,800/m² typical), faster build times, predictable pricing, established processes. Cons: limited customisation, sometimes corner-cut quality, large-scale operations can mean less personal attention. Custom builders work to architect-designed or owner-led plans, building one-off projects. Pros: full design flexibility, higher build quality, more attention. Cons: significantly higher cost ($3,500–$6,000+ per square metre), longer build times, more decisions to manage.",
  },
  {
    question: "How long does it take to find the right builder?",
    answer:
      "Plan for 6–12 weeks from starting your search to signing a contract. Two weeks to research and shortlist 6–10 candidates, two weeks to interview and narrow to three, four to six weeks for quotes (good builders are usually booked 3+ weeks ahead just to come and quote, then take 2–4 weeks to produce a detailed quote), then 1–2 weeks reviewing quotes and negotiating the contract. Compressing this timeline tends to be the moment people pick the wrong builder.",
  },
  {
    question: "Should I use a project management company instead of going directly to a builder?",
    answer:
      "For larger or more complex projects, yes. A project manager (sometimes called a building consultant or owner's representative) works for you, not the builder. They manage the tender process, contract administration, variations, and quality control. Cost: typically 4 to 8% of total project value, or a fixed fee. Worth it for projects over $400,000 or anything with serious heritage, structural, or planning complexity. For straightforward renovations under $200,000, it's usually overkill.",
  },
  {
    question: "What's a Quantity Surveyor and do I need one?",
    answer:
      "A Quantity Surveyor (QS) is a cost expert who can prepare independent cost plans, review builder quotes line-by-line for accuracy, value-engineer the design to reduce cost without losing function, and prepare tender packages that make builder quotes directly comparable. Cost: $1,500–$5,000+ for a residential project depending on scope. Worth it for any new build, major extension, or detailed renovation. The cost is small relative to what they can save you by catching pricing irregularities or proposing alternative materials.",
  },
  {
    question: "How do I check if a builder is financially stable?",
    answer:
      "Three checks: (1) ASIC company search ($9) for the operating entity (current registration, director history, any recent insolvencies). (2) State-by-state home warranty insurance database. Some states publish builders' insurance status. If your shortlisted builder can't currently get insurance, that's a major red flag. (3) Recent project history. Call past clients from the last 12 months and ask specifically about whether the builder was always paid on time, used the same trade base throughout, and finished within scope. A builder who relies on each new project's deposit to finish the previous one is the canonical insolvency setup.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Renovation Cost in Australia 2026",     href: "/guides/renovation-cost-australia-2026",   description: "Real-world renovation costs by type: kitchens, bathrooms, full renos, extensions." },
  { title: "Fixed vs Variable Rate Loans",           href: "/guides/fixed-vs-variable-rate-guide",     description: "The fixed-vs-variable framing applies to building contracts too." },
  { title: "Granny Flat Guides by State",            href: "/guides/granny-flat-guide-nsw",            description: "Builder considerations specific to granny flat / secondary dwelling work." },
  { title: "How to Choose a Mortgage Broker",        href: "/guides/how-to-choose-a-mortgage-broker",  description: "Renovation/construction finance needs a broker who specialises in it." },
  { title: "Renovating hub",                         href: "/renovating",                              description: "All our renovation guides in one place." },
];

export default function HowToFindABuilderAustraliaPage() {
  return (
    <>
      <HowToJsonLd
        name="How to find a builder in Australia"
        description="The seven-step process for selecting and engaging a residential builder in Australia."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Define your scope and budget", text: "Clarity on what you want built, the rough budget range, and the constraints (timeline, materials, must-have features) before approaching builders." },
          { name: "Build a shortlist of 6 to 10 candidates", text: "Referrals, completed jobs in your area, industry associations (HIA, Master Builders), online directories. Filter for the right work type and licence class." },
          { name: "Verify licences and insurance", text: "State licensing register for each builder, confirm class covers your work, check for current home warranty insurance and recent disciplinary actions." },
          { name: "Interview three to four candidates on site", text: "Walk through your project, ask the questions in this guide, gauge communication and process. Eliminate any who feel wrong." },
          { name: "Check references on recent jobs", text: "Call 2 to 3 clients from completed projects in the last 12 months. Ask the specific questions in this guide." },
          { name: "Get three comparable written quotes", text: "Itemised, with inclusions and exclusions, payment schedule, and total. Quotes are non-binding indications until contracted." },
          { name: "Sign the contract carefully", text: "Use a state-standard contract, read every clause, watch for variation pricing, defects liability period, and payment schedule." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="The decision that cascades">
        <p>
          Almost every renovation horror story traces back to one decision:
          who you picked to build it. Take this slowly, do every check on
          this list, and don&rsquo;t let timeline pressure push you into a
          choice you wouldn&rsquo;t make on reflection.
        </p>
      </Callout>

      <h2 id="why-it-matters">Why builder choice matters</h2>
      <p className="lead">
        Builder selection is the single highest-leverage decision in any{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation</Link> or new build. The right builder delivers on time, on
        budget, communicates clearly, fixes defects without argument, and
        runs a clean site. The wrong builder runs over budget by 30–60%,
        slips schedule by months, leaves a trail of disputes and unfinished
        scope, and in the worst case disappears mid-project, leaving you
        with a half-built house and a home warranty claim.
      </p>
      <p>
        The cost of the right decision is two months of careful
        evaluation. The cost of the wrong one is tens of thousands of
        dollars, months of stress, and sometimes legal proceedings. The
        leverage ratio is enormous.
      </p>

      <KeyFigure
        value="6–12 weeks"
        label="Realistic timeline from starting a builder search to signing a contract"
      />

      <h2 id="what-builders-do">What different builders do</h2>
      <p>
        Match the builder type to the job.
      </p>
      <h3>Project home builders</h3>
      <p>
        Volume operators (Metricon, GJ Gardner, Henley, Plantation,
        Stockland, etc.) who build from a catalogue of standard designs
        with limited variations. Per-square-metre cost is lower
        ($1,800–$2,800/m² typical), processes are mature, and pricing is
        predictable. Suits first-time builders, knock-down rebuilds with
        standard requirements, and house-and-land packages. Trade-offs:
        less customisation, sometimes inconsistent on-site quality,
        anonymity (you&rsquo;ll deal with a different rep at each stage).
      </p>
      <h3>Custom builders</h3>
      <p>
        Build one-off projects to architect-designed or owner-led plans.
        Per-square-metre cost is significantly higher ($3,500–$6,000+/m²).
        Build times are longer. Suits architect-designed homes, complex
        renovations, heritage work, and anyone with strong preferences on
        design and quality. Pick custom when you genuinely care about the
        details. Paying custom-builder prices for project-home detailing
        is a waste.
      </p>
      <h3>Renovation specialists</h3>
      <p>
        Builders who focus exclusively or primarily on extensions,
        renovations, and remodels rather than new builds. They&rsquo;re
        used to working in occupied houses, sequencing trades around
        existing structures, and dealing with the surprises that come out
        of older walls. Cost: typically 10–25% higher per m² than equivalent
        new build work because the work is intrinsically harder.
      </p>
      <h3>Owner-builder</h3>
      <p>
        You become the builder and manage trades directly. Most states
        require an owner-builder permit and limit how often you can do this
        (typically once every 5–7 years). Significant cost savings on
        paper but very high time cost, harder to finance, and the home
        warranty + defects liability framework doesn&rsquo;t apply the same
        way. Suits hands-on people with construction experience or genuine
        passion for the work. Risky for everyone else.
      </p>

      <h2 id="shortlist">How to build a shortlist</h2>
      <p>
        Sources to combine:
      </p>
      <ul>
        <li><strong>Personal referrals</strong> from friends or neighbours who&rsquo;ve recently completed similar work. The single best source.</li>
        <li><strong>Drive your neighbourhood and note recent build/reno signs.</strong> Find homes that look like the standard you want and identify who built them.</li>
        <li><strong>Industry associations</strong>: Housing Industry Association (HIA) and Master Builders Australia (MBA) each publish member directories. Filter for builders specialising in your work type and operating in your suburb.</li>
        <li><strong>State licensing register search</strong>. Most states let you search by suburb or work category.</li>
        <li><strong>Online directories with reviews</strong> (Houzz, Hipages, ServiceSeeking). Useful for initial pool but treat reviews with skepticism (incentivised reviews, builder responses to negative ones).</li>
        <li><strong>Project completion lists from local councils</strong>. Some councils publish completed certificates of occupancy with builder names.</li>
        <li><strong>Architects and designers</strong>. If you&rsquo;re using one, they&rsquo;ll have lists of builders they&rsquo;ve worked well with on similar budgets.</li>
      </ul>
      <p>
        Aim for 6–10 names from multiple sources. Narrow to 3–4 for
        site interviews after the initial verification step.
      </p>

      <h2 id="verify-licence">Verifying licence and insurance</h2>
      <p>
        Before you spend any time on interviews, verify the basics for each
        shortlisted builder:
      </p>
      <ul>
        <li><strong>Current licence</strong> on the state register. Confirm the licence class covers your work value (most states tier licences by maximum value).</li>
        <li><strong>Licensed individual</strong>: the named builder on the licence must hold the qualification, not just be on a corporate licence.</li>
        <li><strong>No active disciplinary proceedings</strong>. Most state registers note these.</li>
        <li><strong>Current home warranty insurance eligibility</strong>. If a builder can&rsquo;t get insurance, their past behaviour usually explains why. Walk.</li>
        <li><strong>ABN and ACN check</strong> via abr.business.gov.au and asic.gov.au. Confirm the company you&rsquo;re contracting with is the same as the one on the licence and the insurance.</li>
        <li><strong>Recent insolvencies in the group</strong>: look for phoenixed companies, builders who&rsquo;ve liquidated and reopened under a new name. Director searches at ASIC show this pattern.</li>
      </ul>

      <h2 id="interview">Interviewing builders</h2>
      <p>
        Site interviews are a 60–90 minute meeting at your property
        (renovation) or at one of their previous completed jobs (new
        build). Specific questions to ask:
      </p>
      <h3>Their business</h3>
      <ul>
        <li>How long have you been operating, and how many residential projects do you complete per year?</li>
        <li>How many staff do you employ directly? How many are subcontractors?</li>
        <li>How many projects are you running concurrently right now? When could you start mine?</li>
        <li>Do you specialise in any particular work type: renovations, extensions, new builds, heritage?</li>
        <li>What&rsquo;s your typical project value range?</li>
      </ul>
      <h3>Process</h3>
      <ul>
        <li>How do you handle quotes: fixed-price, cost-plus, or do you adjust based on project type?</li>
        <li>Walk me through your typical site management: supervisor visits, trade scheduling, weekly client updates.</li>
        <li>How do you handle variations? Specifically: pricing of variations, written approval process, schedule impact.</li>
        <li>Defects liability period: how long, and what&rsquo;s your process for fixing post-handover issues?</li>
        <li>What insurance do you carry beyond home warranty: public liability, worker&rsquo;s comp, project-specific?</li>
        <li>How do you handle disputes if we disagree on something?</li>
      </ul>
      <h3>Specific to my project</h3>
      <ul>
        <li>Have you done a project like mine recently? Can you show me one?</li>
        <li>What would you do differently than the architect&rsquo;s spec, and why?</li>
        <li>What are the most common cost surprises on a job like this?</li>
        <li>What&rsquo;s a realistic completion timeline?</li>
      </ul>
      <p>
        Watch <em>how</em> they answer. Specific, evidence-based, and
        comfortable challenging assumptions = good signal. Vague,
        defensive, or unwilling to discuss past issues = move on.
      </p>

      <MatchCTA kind="builder" />

      <h2 id="references">Checking references and recent jobs</h2>
      <p>
        Ask each shortlisted builder for 2–3 client references from jobs
        completed in the last 12 months. Call all of them. Specifically ask:
      </p>
      <ul>
        <li>Did the builder finish on the agreed completion date? If not, what was the slippage?</li>
        <li>Was the final cost within 10% of the contract price? Where did variations come from?</li>
        <li>How did communication work day-to-day? Who was your main contact?</li>
        <li>Were you ever asked to pay the next progress payment before the previous stage was complete?</li>
        <li>How did the defects liability period go? Did they fix things promptly?</li>
        <li>Would you use them again? Honestly?</li>
        <li>Did you ever have to chase trades or subcontractors directly?</li>
        <li>How did they handle the surprises (what came out of the walls during demolition, etc.)?</li>
      </ul>
      <p>
        Visit at least one completed job per builder if you can. The
        photos are always flattering and the workmanship is harder to
        assess in person.
      </p>

      <h2 id="quotes">Getting comparable quotes</h2>
      <p>
        Three quotes, three weeks. Each builder needs the same brief: the
        same plans, specifications, finishes schedule, and exclusions list.
        Quotes that aren&rsquo;t apples-to-apples can&rsquo;t be compared.
      </p>
      <p>
        A quote should include:
      </p>
      <ul>
        <li><strong>Itemised line items</strong>: slab, frame, roof, lockup, fit-out, etc. Not a single total.</li>
        <li><strong>Inclusions list</strong>: brand-specific allowances for fittings, fixtures, appliances, finishes.</li>
        <li><strong>Exclusions list</strong>: things specifically NOT included (landscaping, fencing, driveway, window furnishings, etc.).</li>
        <li><strong>Provisional sums and PC items</strong>: line items where the exact cost isn&rsquo;t known yet (tiles selection, kitchen joinery design, etc.). These become variations later.</li>
        <li><strong>Payment schedule</strong>: deposit plus 5 to 7 progress payments tied to specific milestones.</li>
        <li><strong>Schedule</strong>: estimated start and end dates.</li>
        <li><strong>Validity period</strong>: typically 30–90 days.</li>
      </ul>

      <Callout variant="warning" title="Pricing red flags">
        <p>
          One quote significantly below the others (15%+ low) is almost
          always going to come back as variations. The builder is either
          inexperienced (will discover costs they didn&rsquo;t price), or
          deliberately under-quoting to win the job and load variations
          later. Treat low outlier quotes with extreme suspicion.
        </p>
      </Callout>

      <h2 id="contract">The contract: what to look for</h2>
      <p>
        Use a state-standard contract. HIA and Master Builders both publish
        standard contracts widely accepted by lenders and recognised by
        consumer protection bodies. Custom contracts proposed by a builder
        deserve solicitor review.
      </p>
      <p>
        Critical clauses to read carefully:
      </p>
      <ul>
        <li><strong>Variation pricing</strong>: how is the cost of variations determined? Look for a published margin (e.g. cost + 15%) rather than &quot;at builder&rsquo;s discretion&quot;.</li>
        <li><strong>Variation approval process</strong>: variations should require written approval BEFORE work is done. Avoid contracts where the builder can do variations and bill later.</li>
        <li><strong>Defects liability period</strong>: typically 12 months in most states. Read what the builder commits to fix during that period and how response times work.</li>
        <li><strong>Liquidated damages</strong>: penalty per day the project runs over the contracted completion date. Standard is $50–$200/day for residential, so ensure it&rsquo;s present.</li>
        <li><strong>Payment schedule</strong>: stages should match real construction milestones (slab, frame, lockup, fit-out, completion). Front-loaded payment schedules (large deposit, then trickle) are a solvency red flag.</li>
        <li><strong>Provisional sums + PC items</strong>: every one of these is a future variation. The more there are, the more uncertain the final price.</li>
        <li><strong>Dispute resolution</strong>: the standard contracts include a dispute-resolution process. Make sure it&rsquo;s there.</li>
        <li><strong>Extension of time provisions</strong>: how delays caused by weather, council, materials shortages, etc. extend the contracted completion date.</li>
      </ul>

      <h2 id="red-flags">Red flags worth walking away from</h2>
      <ul>
        <li><strong>Can&rsquo;t produce current home warranty insurance for similar projects.</strong> Walk.</li>
        <li><strong>Asks for cash payments or unusually large deposit</strong> (more than 5–10% of contract value, depending on state regulations).</li>
        <li><strong>Refuses to provide written quote</strong> or refuses to itemise.</li>
        <li><strong>Pressures you to sign quickly</strong>: &quot;prices going up next week&quot;, &quot;I have a slot this month only&quot;.</li>
        <li><strong>Recent insolvencies in the group</strong>, including a different ABN, different company name, but same directors or address.</li>
        <li><strong>References reluctant to talk</strong> or you can&rsquo;t reach the supplied references.</li>
        <li><strong>No site supervisor named</strong> in the contract. You&rsquo;ll spend the project chasing trades directly.</li>
        <li><strong>Quote significantly low</strong> compared to the other two (15%+ below).</li>
        <li><strong>Refuses HIA or Master Builders standard contract</strong>, insists on custom contract.</li>
        <li><strong>Recent disputes or proceedings</strong> visible on the state licensing register.</li>
      </ul>

      <h2 id="after-engagement">Once you&rsquo;ve engaged</h2>
      <p>
        Picking the builder is the biggest decision but it&rsquo;s not the
        last one. After signing:
      </p>
      <ul>
        <li><strong>Get the home warranty insurance certificate</strong> for your specific project BEFORE paying any deposit.</li>
        <li><strong>Confirm site insurance</strong>: public liability, contractor&rsquo;s all-risk, etc.</li>
        <li><strong>Set up a weekly site walk</strong> with the supervisor. Bring a notebook. Photograph everything.</li>
        <li><strong>Document variations in writing</strong> the moment they&rsquo;re discussed. Never agree to a variation verbally.</li>
        <li><strong>Don&rsquo;t pay the next progress payment</strong> until you (or your project manager) have verified the previous stage is genuinely complete to a deductive standard.</li>
        <li><strong>Final pre-handover inspection</strong>: walk every room with a builder defects list, sign off on what&rsquo;s acceptable and what needs fixing before handover.</li>
        <li><strong>Keep a paper trail</strong> through the defects liability period. Photos, dates, requests, responses.</li>
      </ul>

      <MatchCTA kind="mortgage-broker" />

      <Sources items={[
        "Housing Industry Association, HIA standard residential building contracts (current).",
        "Master Builders Australia, MBA standard contracts and 2024–2025 industry insolvency reports.",
        "State-by-state building licensing bodies: NSW Fair Trading, VBA Victoria, QBCC Queensland, Building Commission WA, CBS South Australia, CBOS Tasmania.",
        "National Construction Code 2025, applicable to all new and substantially renovated residential building work.",
        "Australian Securities and Investments Commission, ASIC company search and director-history register (asic.gov.au).",
      ]} />
    </GuideArticleLayout>
    </>
  );
}
