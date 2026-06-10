import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  EditorNote,
  KeyFigure,
  MatchCTA,
  PullQuote,
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
  title: "How to Choose a Mortgage Broker in Australia (2026)",
  description:
    "How to pick a mortgage broker who works for you, not their lender panel. The questions to ask, what 'best interests duty' actually means, how brokers are paid, and the red flags worth walking away from.",
  slug: "how-to-choose-a-mortgage-broker",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
  readingTimeMinutes: 11,
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
  "Mortgage brokers are paid by lenders (upfront commission ~0.65% of loan amount plus trail of ~0.15% per year) and have a legal Best Interests Duty (BID) to act in the borrower's interest. Their service is free to you.",
  "Around 74% of new home loans in Australia are now written through brokers (MFAA 2025 data). The market has shifted hard against direct-to-bank applications.",
  "Interview at least two brokers. Compare their lender panel size, how they explain BID, the quality of their borrowing-capacity assessment, and whether they push you toward any particular lender.",
  "Red flags: tiny lender panel (under 20), pushes one specific lender every time, can't explain BID clearly, vague on their commission structure, pressures you to sign before you've compared options.",
  "Bring three documents to your first meeting: payslips (last two), bank statements (last three months), and ID. A good broker will give you a real borrowing-capacity range within an hour.",
  "A great broker shaves 0.10–0.40% off your rate vs. walking into your own bank. Over a 30-year loan, that's $30,000–$120,000 in saved interest on a $600,000 mortgage.",
];

const TOC: GuideTOCEntry[] = [
  { id: "what-broker-does",   label: "What a mortgage broker actually does" },
  { id: "how-paid",            label: "How brokers are paid" },
  { id: "bid",                 label: "Best Interests Duty explained" },
  { id: "broker-vs-bank",      label: "Broker vs going direct to the bank" },
  { id: "shortlist",           label: "How to shortlist brokers" },
  { id: "interview",           label: "What to ask in the meeting" },
  { id: "red-flags",           label: "Red flags worth walking away from" },
  { id: "documents",           label: "What documents to bring" },
  { id: "specialist-brokers",  label: "When to use a specialist broker" },
  { id: "after-settlement",    label: "After settlement: staying in touch" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is using a mortgage broker free?",
    answer:
      "Yes, to you. Brokers are paid by the lender once your loan settles, typically an upfront commission of around 0.65% of the loan amount and an ongoing trail commission of around 0.15% per year while the loan is active. You pay nothing directly to the broker. Some brokers charge a fee for service in specialist situations (very small loans, SMSF lending, commercial), but standard residential broking is free to the borrower.",
  },
  {
    question: "What is Best Interests Duty (BID)?",
    answer:
      "Best Interests Duty is a legal obligation that took effect on 1 January 2021 requiring mortgage brokers to act in the best interests of the borrower (not the lender, and not themselves). In practice it means brokers must consider multiple loan options, recommend the loan that best suits your circumstances, document why they recommended what they did, and avoid conflicts of interest. ASIC enforces BID and has issued fines for breaches. Ask your broker how they apply BID in their process; they should be able to walk you through it clearly.",
  },
  {
    question: "What's the difference between a broker and going direct to a bank?",
    answer:
      "Going direct: you talk to one lender, they only show you their own products. You're locked into whatever rates and policies they have right now. Going via a broker: they show you 30+ lenders simultaneously, compare rates and features, and identify lenders whose credit policies actually suit your situation (this matters more than headline rate, because different lenders treat self-employed income, casual employment, bonuses, and existing debt very differently). For most borrowers, the broker route delivers a better rate, better fit, and less wasted time.",
  },
  {
    question: "Will a broker get me a better rate than my bank?",
    answer:
      "Usually yes, by 0.10 to 0.40 percentage points on average, sometimes more. Banks routinely offer brokers wholesale-channel pricing that's better than their public advertised rate, particularly for new business. Banks also typically reserve their best discretionary discounts for new customers, so even your existing bank often offers a better rate to a broker-introduced application than to you walking into the branch. The bigger win is loan fit: a broker matches your profile to a lender whose policy says yes, instead of multiple rejections at lenders whose policy says no.",
  },
  {
    question: "How many lenders should a broker have on their panel?",
    answer:
      "30 to 60 is typical for an established broker. Anything below 20 is a yellow flag; it suggests either an inexperienced broker or one tied to a small aggregator that hasn't built breadth. Anything over 80 is uncommon and not necessarily better; the marginal lenders are usually niche products you don't need. Quality of the panel matters more than raw count: does it include the big four, mid-tier banks (Macquarie, ING, Bendigo, BOQ, Suncorp, AMP), credit unions, and non-bank lenders (Pepper Money, Liberty, Resimac, Bluestone) for non-standard income?",
  },
  {
    question: "Are all mortgage brokers regulated the same way?",
    answer:
      "Yes. Every mortgage broker in Australia must hold an Australian Credit Licence (ACL) or operate under one as a Credit Representative, be a member of either MFAA (Mortgage and Finance Association of Australia) or FBAA (Finance Brokers Association), have an external dispute resolution scheme (AFCA), and comply with the National Consumer Credit Protection Act and Best Interests Duty. ASIC has investigated and prosecuted brokers who breach these obligations. You can verify any broker's licence on ASIC's public register.",
  },
  {
    question: "Can a mortgage broker help if I'm self-employed?",
    answer:
      "Yes, and this is one of the strongest cases for using a broker. Self-employed lending policies vary enormously between lenders. The major banks typically require two years of tax returns and complete BAS statements, while specialist lenders (alt-doc lenders like Pepper, Liberty, Resimac) accept self-certified income, BAS-only verification, or accountant declarations. A good broker knows which lenders will say yes to your situation without wasting your time at the wrong lenders. Same logic applies for casual employees, contractors, recent migrants, retirees, and anyone with non-standard income.",
  },
  {
    question: "Should I use the broker my real estate agent recommends?",
    answer:
      "Be cautious. Real estate agent referrals are a legitimate source of brokers, and many quality brokers build their business this way. But the referral relationship can introduce conflicts. The agent wants the deal to close fast and may favour brokers who push borrowers through aggressive lenders rather than the right-fit one. Treat the agent's recommendation as one option and always interview at least one other broker for comparison. The same applies to broker referrals from any non-finance source: useful starting point, never the only option you consider.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Lenders Mortgage Insurance Guide",    href: "/guides/lenders-mortgage-insurance-guide", description: "When LMI applies, what it costs, and how to avoid it." },
  { title: "Fixed vs Variable Rate Loans",         href: "/guides/fixed-vs-variable-rate-guide",     description: "How to decide between fixed, variable, and split-rate home loans." },
  { title: "First Home Buyer Guide",               href: "/guides/first-home-buyer-guide",            description: "The full first-home-buyer playbook, including grants and schemes by state." },
  { title: "How Much Deposit to Buy a House",      href: "/guides/how-much-deposit-to-buy-a-house",   description: "Real-world deposit numbers and the LMI threshold." },
  { title: "Borrowing Power Calculator",            href: "/borrowing-power-calculator",               description: "Run the numbers on what you can borrow before talking to a broker." },
];

export default function HowToChooseMortgageBrokerPage() {
  return (
    <>
      <HowToJsonLd
        name="How to choose a mortgage broker in Australia"
        description="The seven-step process for selecting and engaging a mortgage broker for a home loan in Australia."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Get clear on what you need", text: "First home, refinance, investment property, construction, complex income. Different brokers have different specialisations." },
          { name: "Shortlist 3 to 4 brokers", text: "Referrals from people whose financial judgement you trust, MFAA/FBAA find-a-broker tools, or vetted-broker matching services. Verify each broker's ACL on the ASIC register." },
          { name: "Run an initial 30-minute call with each", text: "Talk through your situation, ask their typical lender mix, ask them to explain Best Interests Duty in their own words." },
          { name: "Compare lender panels and process", text: "How many lenders, big four exposure, mid-tier and non-bank coverage, how they document their BID compliance." },
          { name: "Provide documents and get a borrowing-capacity range", text: "Two payslips, three months of bank statements, ID, list of existing debts. A good broker gives you a realistic range within an hour of having the documents." },
          { name: "Compare two or three loan recommendations", text: "Ask each broker to recommend their top two lenders for your situation and explain why. The reasoning matters more than the rate." },
          { name: "Engage and start the application", text: "Sign the credit guide and credit proposal disclosure, then the broker submits the application. Stay engaged: respond to lender queries within 24 hours to keep momentum." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="info" title="Why this matters">
        <p>
          The right broker saves you tens of thousands of dollars over the
          life of your loan. The wrong broker costs you the same, or wastes
          months pushing your application through lenders who were never
          going to say yes. The decision is worth two or three hours of
          interviews.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The broker market is mostly fine. The licensing is solid, Best
          Interests Duty has teeth, and the standards body has cleaned up
          the obvious incentive problems. What still varies wildly is
          whose credit policy each broker actually knows. The small print
          that makes a broker worth using over a banker is the broker who
          can tell you, off the top of their head, which lender will
          accept your bonus income at 80% and which one won&rsquo;t. That
          is not a Google search. That is sitting on a panel and writing
          loans every week.
        </p>
      </EditorNote>

      <h2 id="what-broker-does">What a mortgage broker actually does</h2>
      <p className="lead">
        A mortgage broker is a licensed credit professional who shops your
        home-loan application across multiple lenders and recommends the loan
        that best suits your situation. Done well, this saves you time
        (one application, many lenders), money (better rates and fit), and
        rejected applications (the broker filters out lenders whose policies
        don&rsquo;t match your situation before you apply).
      </p>
      <p>
        A typical broker engagement includes:
      </p>
      <ul>
        <li><strong>Discovery</strong>: discussing your goals, income, existing debts, deposit, credit history, and timeline.</li>
        <li><strong>Borrowing capacity assessment</strong>: a realistic range of what each lender on their panel would lend you.</li>
        <li><strong>Loan recommendation</strong>: top two or three lenders, with reasoning, rate quotes, and feature comparison.</li>
        <li><strong>Application preparation and submission</strong>: collecting documents, packaging the application, addressing lender-specific quirks.</li>
        <li><strong>Lender liaison</strong>: chasing the lender during assessment, handling any conditions, organising valuation, getting to formal approval.</li>
        <li><strong>Settlement coordination</strong>: working with your conveyancer and the lender to settle on the contract date.</li>
        <li><strong>Post-settlement</strong>: an annual loan review, rate-check, and refinance recommendation if a better option emerges.</li>
      </ul>

      <KeyFigure
        value="~74%"
        label="Share of new Australian home loans written through brokers, 2025"
        context="MFAA market-share data"
      />

      <h2 id="how-paid">How brokers are paid</h2>
      <p>
        Brokers are paid by the lender, not by you. Two payment streams:
      </p>
      <ul>
        <li><strong>Upfront commission</strong>: typically around 0.65% of the loan amount (with GST), paid once the loan settles. On a $600,000 loan, that&rsquo;s ~$3,900.</li>
        <li><strong>Trail commission</strong>: typically around 0.15% per year of the outstanding loan balance, paid monthly while the loan is active. On a $600,000 loan that&rsquo;s ~$900 in the first year, declining over time as the loan amortises.</li>
      </ul>
      <p>
        These rates vary by lender and by aggregator but the structure is
        consistent across the industry. Importantly, brokers do <em>not</em>{" "}
        receive volume bonuses based on writing more loans to a specific
        lender (that practice was banned in 2019). Best Interests Duty also
        requires brokers to disclose their commission structure to you in
        the credit proposal document.
      </p>
      <p>
        Some specialist brokers (commercial property, SMSF lending, very
        small residential loans) charge a fee for service on top of, or
        instead of, lender commission. This must be disclosed upfront.
      </p>

      <h2 id="bid">Best Interests Duty explained</h2>
      <p>
        Best Interests Duty (BID) is the legal obligation, in force since
        1 January 2021, that mortgage brokers must act in your best interest
        when recommending a loan. It came out of the 2018 Royal Commission
        into Misconduct in the Banking, Superannuation and Financial
        Services Industry, which found that broker commissions had been
        skewing recommendations toward lenders who paid more rather than
        lenders who fit the borrower.
      </p>
      <p>
        In practice, BID means a broker must:
      </p>
      <ul>
        <li>Consider multiple loan options before recommending one.</li>
        <li>Compare those options on the criteria that matter to <em>you</em> (rate, features, fees, settlement speed, etc.).</li>
        <li>Recommend the option that best meets your needs, not the one paying highest commission.</li>
        <li>Document the reasoning in a credit proposal document you receive in writing.</li>
        <li>Avoid conflicts of interest and disclose any that exist.</li>
      </ul>
      <p>
        Ask any broker you interview to explain BID in their own words and
        walk you through how they apply it. A confident, specific answer is
        a strong signal. A vague answer or one that conflates BID with
        general &quot;customer service&quot; is a yellow flag.
      </p>

      <Callout variant="warning" title="The credit proposal document">
        <p>
          Before submitting your application, your broker must give you a
          written credit proposal disclosure. This includes: which lenders
          they considered, why they recommended the chosen one, what
          commission they&rsquo;ll be paid, and any conflicts of interest. Read
          it. If anything is unclear, ask.
        </p>
      </Callout>

      <h2 id="broker-vs-bank">Broker vs going direct to the bank</h2>
      <p>
        The choice matters more than people think. Going direct to one
        lender locks you into that lender&rsquo;s rate, that lender&rsquo;s
        credit policy, and that lender&rsquo;s appetite for your specific
        circumstances. Going via a broker, you compare 30+ lenders
        simultaneously and find the one whose policy says yes <em>and</em>{" "}
        whose rate is competitive.
      </p>
      <p>
        Where the broker advantage is biggest:
      </p>
      <ul>
        <li><strong>Self-employed</strong>: lenders treat business income very differently. The right broker knows which lender will accept your tax returns vs which will need two years vs which will accept BAS-only.</li>
        <li><strong>First home buyer</strong>: schemes (FHBG, FHOG state grants, Help to Buy) interact with specific lenders. A broker who specialises in first-home buyers will know which lenders process scheme applications smoothly and which delay them.</li>
        <li><strong>Refinance</strong>: every lender has different cashback offers, different waivers on application fees, different switch incentives. A broker compares them simultaneously.</li>
        <li><strong>Investment / SMSF / construction</strong>: niche credit policies vary widely. Going direct to your existing bank for an SMSF loan is almost always more expensive than going via a broker who specialises in SMSF.</li>
        <li><strong>Complex situations</strong>: divorce, recent bankruptcy, blended employment, casual income, non-resident income, large deposits from gifts. Broker territory.</li>
      </ul>
      <p>
        Going direct to a bank still works for: someone with vanilla income,
        a long-standing relationship with their bank, and an existing
        relationship discount they&rsquo;re happy with. Even then, the
        broker route is usually at least neutral and often slightly better.
      </p>

      <h2 id="shortlist">How to shortlist brokers</h2>
      <p>
        Three good sources for finding brokers:
      </p>
      <ul>
        <li><strong>Referrals from people whose financial judgement you trust.</strong> Friends, family, your accountant, your conveyancer. The single best source.</li>
        <li><strong>MFAA and FBAA &quot;find a broker&quot; directories.</strong> Both industry associations list accredited members. Filter by suburb and specialisation.</li>
        <li><strong>Vetted-broker matching services.</strong> Services that screen brokers on track record, lender panel, and complaints history before referring you. Faster than DIY-sourcing if you don&rsquo;t have a personal referral. (We run one: see <Link href="/find-an-expert">Find an expert</Link>.)</li>
      </ul>
      <p>
        Avoid: brokers who cold-call you, brokers from comparison-site
        forms that promise &quot;the best home loan rate&quot; without first
        understanding your circumstances, and brokers whose only credential is
        the lender they work for.
      </p>
      <p>
        Whatever source you use, verify each broker&rsquo;s licence on the{" "}
        <a href="https://moneysmart.gov.au/financial-advice/financial-advisers-register" target="_blank" rel="nofollow noopener">
          ASIC public register
        </a>{" "}
        or via MFAA&rsquo;s find-a-broker tool before your first meeting.
        Confirm: current ACL or Credit Representative status, MFAA or FBAA
        membership, no current disciplinary action.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        The right broker has placed your exact loan five times this year.
        Anything else is theory, and theory is what gets your application
        declined.
      </PullQuote>

      <h2 id="interview">What to ask in the meeting</h2>
      <p>
        First meeting with any broker is typically 30–60 minutes, free, and
        no obligation. Specific questions to ask:
      </p>
      <h3>Their business</h3>
      <ul>
        <li>How long have you been a broker, and how many loans do you typically settle per year?</li>
        <li>How many lenders are on your panel? Can I see the list?</li>
        <li>Which aggregator group are you part of?</li>
        <li>What&rsquo;s your typical settlement timeframe from application to settlement?</li>
      </ul>
      <h3>Best Interests Duty</h3>
      <ul>
        <li>Walk me through how you apply BID when recommending a loan.</li>
        <li>What does your credit proposal document look like? Can I see a sample?</li>
        <li>How do you document the reasoning for your recommendation?</li>
      </ul>
      <h3>Specialisation</h3>
      <ul>
        <li>What kinds of borrowers do you most commonly work with?</li>
        <li>Do you handle [my situation: first-home / self-employed / investment / construction / SMSF / etc.] regularly?</li>
        <li>Roughly what proportion of your settlements end up with the big four banks vs. mid-tier vs. non-bank lenders?</li>
      </ul>
      <h3>Process and communication</h3>
      <ul>
        <li>What documents will you need from me to give a real borrowing-capacity range?</li>
        <li>How will we communicate during the application: email, phone, app?</li>
        <li>If a lender comes back with conditions or queries, how quickly will I hear?</li>
        <li>Do you handle the lender follow-up or do I?</li>
      </ul>
      <h3>Costs</h3>
      <ul>
        <li>What commission will you receive on my loan?</li>
        <li>Are there any fees I&rsquo;ll be charged?</li>
        <li>What happens if the loan doesn&rsquo;t settle: does anything come back to me?</li>
      </ul>
      <p>
        A confident, specific broker gives you clean answers to all of these
        in 30–45 minutes. If they&rsquo;re evasive or push back on the
        questions, walk away.
      </p>

      <MatchCTA kind="mortgage-broker" />

      <h2 id="red-flags">Red flags worth walking away from</h2>
      <ul>
        <li><strong>Tiny lender panel (under 20)</strong>: suggests either inexperience or limited aggregator support.</li>
        <li><strong>Pushes one specific lender every time</strong>: BID violation. They&rsquo;re working for the lender, not for you.</li>
        <li><strong>Can&rsquo;t explain BID clearly</strong>: either ignorant or hoping you don&rsquo;t know what it is.</li>
        <li><strong>Pressures you to sign before you&rsquo;ve compared options</strong>: classic sales tactic, never urgent in legitimate broking.</li>
        <li><strong>Vague on commission structure</strong>: by law they must tell you in writing. Verbal vagueness up front is a tell.</li>
        <li><strong>Negative reviews or AFCA complaints history</strong>: search AFCA&rsquo;s decisions database for the broker&rsquo;s name and the licensee&rsquo;s name.</li>
        <li><strong>Promises a specific rate before seeing your situation</strong>: not possible to do honestly. The rate depends on your situation, the lender&rsquo;s current pricing, and the application strength.</li>
        <li><strong>Doesn&rsquo;t ask about your existing debts, expenses, or future plans</strong>: skipping discovery means they can&rsquo;t meet BID, and the recommendation will be generic.</li>
      </ul>

      <h2 id="documents">What documents to bring</h2>
      <p>
        A productive first meeting needs three things from you:
      </p>
      <ul>
        <li><strong>Two recent payslips</strong> (or two years of tax returns plus last BAS for self-employed).</li>
        <li><strong>Three months of bank statements</strong> from your everyday account and any savings.</li>
        <li><strong>Photo ID</strong> (driver&rsquo;s licence or passport).</li>
      </ul>
      <p>
        Plus a one-page summary of your situation: existing debts (credit
        cards, personal loans, HELP debt), monthly expenses estimate,
        deposit available, target property price range, timeline. A good
        broker gives you a realistic borrowing-capacity range within an hour
        of having these documents.
      </p>

      <h2 id="specialist-brokers">When to use a specialist broker</h2>
      <p>
        Most residential property borrowers are well-served by an experienced
        generalist broker. Specialist brokers earn their place in specific
        situations:
      </p>
      <ul>
        <li><strong>Construction and renovation lending</strong>: drawdown loans, progress payments, builder solvency checks. Different application process and different lender appetite.</li>
        <li><strong>SMSF property lending</strong>: limited recourse borrowing arrangements (LRBAs) have a narrow lender panel and very specific compliance requirements.</li>
        <li><strong>Commercial property and business lending</strong>: completely different lender set, different criteria, much wider rate range.</li>
        <li><strong>Non-resident lending</strong>: foreign income, FIRB requirements, foreign buyer stamp duty, narrow lender panel.</li>
        <li><strong>Adverse credit</strong>: bankruptcy, defaults, late payments. Non-bank specialists exist and can place loans where mainstream lenders won&rsquo;t.</li>
        <li><strong>Bridging finance</strong>: short-term loans to buy a new property before selling the existing one. Specialised products, specialised pricing.</li>
      </ul>

      <h2 id="after-settlement">After settlement: staying in touch</h2>
      <p>
        A good broker doesn&rsquo;t disappear after the loan settles. The
        trail commission they receive is partly compensation for ongoing
        service:
      </p>
      <ul>
        <li><strong>Annual loan review</strong>: confirm your rate is still competitive against current market offers.</li>
        <li><strong>Rate-cut tracking</strong>: when the RBA cuts the cash rate, did your lender pass it on?</li>
        <li><strong>Fixed-rate roll-off</strong>: 30 to 60 days before any fixed-rate period ends, they should be in touch about reviewing options.</li>
        <li><strong>Refinance recommendation</strong>: if a materially better deal exists elsewhere, they should tell you, even though that means losing the trail.</li>
        <li><strong>Top-up and equity-release</strong>: for renovations, an investment property, or a second home.</li>
      </ul>
      <p>
        If your broker goes silent after settlement, switch. There are too
        many good brokers in Australia to keep one who treats you like a
        single transaction.
      </p>

      <MatchCTA kind="mortgage-broker" />

      <Sources items={[
        "Mortgage and Finance Association of Australia (MFAA), \"Industry Intelligence Service\", latest 2024–2025 quarterly reports.",
        "ASIC Regulatory Guide 273, Mortgage brokers: Best interests duty (December 2020).",
        "National Consumer Credit Protection Act 2009 (Cth), Schedule 1, National Credit Code.",
        "Royal Commission into Misconduct in the Banking, Superannuation and Financial Services Industry, Final Report (Hayne 2019), and the subsequent implementation roadmap.",
        "Australian Financial Complaints Authority (AFCA), public determinations database for broker-related disputes.",
      ]} />
    </GuideArticleLayout>
    </>
  );
}
