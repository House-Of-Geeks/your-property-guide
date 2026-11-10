// Deep editorial content per persona hub.
//
// Each persona hub used to render ~150 words of body text — fine as a
// page exists signal, useless as a ranking signal.  This module gives
// each hub:
//
//   - 3-5 paragraphs of plain-English depth (the "really, here is how
//     this thing works" section that buyers, sellers, investors etc.
//     actually search for)
//   - A short list of calculators that fit the situation, with one-line
//     framing so they're tappable as cards rather than naked links
//   - A FAQ block (5-8 Q&As) that doubles as FAQPage schema, giving us
//     a real shot at rich snippets in SERPs
//
// Content is intentionally factual, dated, and free of marketing
// language.  The brand voice is "magazine that took the time to read
// the legislation", not "growth-hacked AI slop".

import type { PersonaId } from "@/lib/constants/journey";
import { HG_DATES, HG_PRICE_CAPS, fmtCap } from "@/lib/data/home-guarantee";
import { STATE_RATES } from "@/lib/data/commission-rates";
import { REFORM_START } from "@/lib/data/tax-reform-2027";
import { LMI_RATE_SOURCE, premiumAt } from "@/lib/lmi-calc";
import { currentExemptTo, currentConcessionTo, currentGrant, money } from "@/lib/policy/first-home";
import { calculateStampDuty } from "@/lib/utils/stamp-duty";

// First home figures for the FAQ answers, from src/lib/policy/first-home.ts.
const fhGrant = (s: Parameters<typeof currentGrant>[0]) => money(currentGrant(s).amount);
const fhExempt = (s: Parameters<typeof currentExemptTo>[0]) => money(currentExemptTo(s) ?? 0);
const fhTo = (s: Parameters<typeof currentConcessionTo>[0]) => money(currentConcessionTo(s) ?? 0);

// LMI on a $700,000 home, from the same premium table as /lmi-calculator
// (src/lib/lmi-calc.ts), so the hub can't drift from the calculator.
const LMI_PRICE = 700_000;
const lmiAt = (depositPct: number) => money(premiumAt(LMI_PRICE, depositPct) ?? 0);
const LMI_READ_ON = LMI_RATE_SOURCE.readOn;

// The typical commission range across the states, from the one table the
// calculators and state guides read (src/lib/data/commission-rates.ts, our
// compiled market figures, September 2026). Derived, not typed, so the hub
// can't print a sixth national range.
const COMMISSION_LOW = Math.min(...Object.values(STATE_RATES).map((r) => r.low));
const COMMISSION_HIGH = Math.max(...Object.values(STATE_RATES).map((r) => r.high));

// Selling claims checked 20 Oct 2026 (CONTENT_FLAGS.md, "Selling hub claims").
// Auction premium: Cortés, Singh, Solomon and Strahan, "How perception affects
// house prices: evidence from failed auctions", Review of Finance 30(5),
// 2026 (doi:10.1093/rof/rfag003), and the University of Sydney summary of
// 2 July 2026 (0.3% premium; 1.3% discount after a pass-in). Clearance and
// days on market: Cotality, final clearance rates week ending 4 Oct 2026
// (released 8 Oct) and the September 2026 Home Value Index (1 Oct 2026).
// TODO(andy): confirm realestate.com.au's 60-day "new listing" rule on
// help.realestate.com.au; the page blocked automated checks on 20 Oct 2026
// and the wording was read from Zenu's copy of it (August 2023).

export interface HubCalculatorCard {
  label: string;
  href: string;
  blurb: string;
}

export interface HubFaqItem {
  question: string;
  answer: string;
}

export interface HubDeepDive {
  // Section eyebrow rendered above the H2 in the magazine masthead style.
  eyebrow: string;
  // Section heading.  Display-scale.  Italic emphasis token rendered via
  // splitting on `*token*`.
  heading: string;
  // Multi-paragraph body.  Each entry is one paragraph.  Plain text.
  paragraphs: string[];
}

export interface PersonaHubContent {
  // Metadata title.  Should lead with the dominant search intent for
  // this persona, not the brand.  Brand is appended by the root title
  // template.
  metaTitle: string;
  metaDescription: string;
  // The long-form depth section, rendered just under the hero.
  deepDive: HubDeepDive;
  // Calculator picks rendered as a card grid.
  calculators: HubCalculatorCard[];
  // Short framing line above the calculator grid.
  calculatorsHeading: string;
  calculatorsBlurb: string;
  // FAQ items.  Render with FAQPage schema for rich-result eligibility.
  faqs: HubFaqItem[];
  // Intent the MatchAgent should prefill when a visitor scrolls to it
  // from this hub.  Matches the option ids in MatchAgent.
  matchIntent: "buying" | "selling" | "investing" | "refinancing" | "something-else";
}

// ─── First home buyers ────────────────────────────────────────────────
// Target queries: "first home buyer grant" (18,100/mo), "first home
// buyer" (12,100/mo), "first home buyer scheme" (9,900/mo).

const FIRST_HOME: PersonaHubContent = {
  metaTitle: "First Home Buyer Australia 2026: Grants, Schemes, Deposit & Stamp Duty",
  metaDescription:
    "Plain-English guide for first home buyers in Australia. Federal grants and schemes, stamp duty concessions by state, deposit math, LMI, and how lenders work out what you can borrow. Free, no sign-up.",
  deepDive: {
    eyebrow: "First home buying in Australia, in 2026",
    heading: "The schemes, the deposit, the *stamp duty*.",
    paragraphs: [
      "Buying a first home in Australia is mostly three problems running in parallel: how much deposit you actually need, which federal or state schemes you qualify for, and how much stamp duty you can avoid paying. Get those three right and the rest is paperwork.",
      `On deposit: most lenders will accept a 5% deposit if you can qualify for the First Home Guarantee (FHBG), which waives Lenders Mortgage Insurance on a 5% deposit. Without the FHBG, expect to need 20% to avoid LMI, or pay LMI to get in with less: on a $700,000 home that's about ${lmiAt(10)} with a 10% deposit and ${lmiAt(5)} with 5%, before state duty on the premium (one lender's published premium table, read ${LMI_READ_ON}). Since ${HG_DATES.expanded} the FHBG, now the 5% Deposit Scheme, has no income test and no limit on places; what still applies is the price cap for the area you buy in.`,
      `On schemes: the First Home Owner Grant (FHOG) is state-administered and varies by state: ${fhGrant("QLD")} in QLD and ${fhGrant("NSW")} in NSW and VIC, all for new homes only, under each state's price cap (Victoria's $20k regional grant ended in June 2021). The First Home Super Saver Scheme (FHSSS) lets you withdraw up to $50k of voluntary super contributions, plus deemed earnings, for a deposit, a useful top-up that most first home buyers don't know about.`,
      `On stamp duty: this is where the biggest dollar saving usually sits. On an established home, NSW first home buyers pay no stamp duty up to ${fhExempt("NSW")}, with a partial concession below ${fhTo("NSW")}. VIC: no duty up to ${fhExempt("VIC")}, sliding scale to ${fhTo("VIC")}. QLD: none up to ${fhExempt("QLD")}, phasing out to ${fhTo("QLD")}, and nothing on a new home at any price. WA: none up to ${fhExempt("WA")}, a concessional rate to ${fhTo("WA")}. Calculate before you make an offer, not after — the gap between qualifying and not qualifying can be tens of thousands of dollars.`,
      "Pre-approval before you bid. Conditional approval (sometimes called 'pre-approval') tells you what a lender will lend you on your current income and expenses, subject to property valuation. It's not a guarantee, but going to an auction without one is gambling with your deposit.",
    ],
  },
  calculatorsHeading: "Calculators built for your situation",
  calculatorsBlurb:
    "The five numbers a first home buyer needs to know before they bid. Free, no sign-up, results in seconds.",
  calculators: [
    { label: "How much can I borrow?",       href: "/borrowing-power-calculator", blurb: "An estimate of what a lender may lend on your income and expenses." },
    { label: "Stamp duty calculator",        href: "/stamp-duty-calculator",      blurb: "First home buyer concessions included for every state and territory." },
    { label: "What can I afford?",           href: "/affordability-calculator",   blurb: "Combines deposit, borrowing power, stamp duty and buying costs into a price you can spend." },
    { label: "Mortgage repayment calculator",href: "/mortgage-calculator",        blurb: "Weekly, fortnightly or monthly repayments and total interest over the loan." },
  ],
  faqs: [
    {
      question: "How much deposit do I need to buy a first home in Australia?",
      answer:
        `Most lenders accept a 5% deposit if you qualify for the First Home Guarantee (FHBG), which waives Lenders Mortgage Insurance. Without the FHBG, plan for 20% to avoid LMI, or 5-10% plus LMI: on a $700,000 home about ${lmiAt(10)} at 10% and ${lmiAt(5)} at 5%, before state duty on the premium (one lender's published premium table, read ${LMI_READ_ON}). You'll also need money on top for stamp duty (often nothing, or much less, for an eligible first home buyer), conveyancing and inspections.`,
    },
    {
      question: "What is the First Home Owner Grant in 2026?",
      answer:
        `The FHOG is administered by each state and territory, for new homes only. NSW: ${currentGrant("NSW").summary}. VIC: ${currentGrant("VIC").summary}. QLD: ${currentGrant("QLD").summary}. WA: ${currentGrant("WA").summary}. SA: ${currentGrant("SA").summary.replace(/^Up/, "up")}. TAS: ${currentGrant("TAS").summary}. NT: the HomeGrown Territory Grant, ${currentGrant("NT").summary}. The ACT has no grant.`,
    },
    {
      question: "Do first home buyers pay stamp duty?",
      answer:
        `Often no, or much less than other buyers. On an established home, NSW charges first home buyers nothing up to ${fhExempt("NSW")}, with a sliding concession below ${fhTo("NSW")}. VIC waives it up to ${fhExempt("VIC")}, sliding to ${fhTo("VIC")}. QLD charges nothing up to ${fhExempt("QLD")}, phasing out to ${fhTo("QLD")}, and nothing on a new home at any price. WA exempts up to ${fhExempt("WA")}. SA charges nothing on a new home or land to build but full duty on an established home, and the ACT nothing at any price from 1 July 2026. Tasmania's exemption ended for settlements after 30 June 2026. Always check current thresholds with the state revenue office before you make an offer.`,
    },
    {
      question: "What is Lenders Mortgage Insurance (LMI) and when does it apply?",
      answer:
        "LMI protects the lender — not you — if you default on the loan. It typically applies when your deposit is less than 20% of the purchase price. The cost ranges from roughly 1% of the loan for a 15% deposit up to 4-5% for a 5% deposit. LMI is waived under the First Home Guarantee, the Family Home Guarantee and the Regional First Home Buyer Guarantee.",
    },
    {
      question: "How does the First Home Guarantee work?",
      answer:
        `The First Home Guarantee (FHBG) lets eligible first home buyers buy with a 5% deposit and no LMI. The federal government guarantees up to 15% of the loan, so the lender treats it as if you had a 20% deposit. There's been no income test and no limit on places since ${HG_DATES.expanded}. Property price caps vary by area (for example ${fmtCap(HG_PRICE_CAPS.NSW.capital)} in Greater Sydney), and you apply through a participating lender.`,
    },
    {
      question: "What is the First Home Super Saver Scheme (FHSSS)?",
      answer:
        "The FHSSS lets you make voluntary contributions to your super (up to $15,000 per year, $50,000 total) and withdraw them, plus deemed earnings, for a first home deposit. Salary sacrificed contributions are taxed at 15% in super instead of your marginal rate, which is where the saving comes from. Since 15 September 2024 you need the ATO's determination before the home becomes yours (generally settlement), and you can request the release up to 90 days after signing a contract.",
    },
    {
      question: "Should I get pre-approval before house-hunting?",
      answer:
        "Yes. Conditional approval (often called pre-approval) tells you what a lender will lend you based on your income and expenses, subject to property valuation. It's not legally binding, but it shapes what you can credibly bid on, and it matters most at auction, where there's no cooling-off period and no finance condition. Most pre-approvals are valid for 3-6 months.",
    },
  ],
  matchIntent: "buying",
};

// ─── Selling ───────────────────────────────────────────────────────────
// Target queries: "selling my house" (720/mo at $28 CPC),
// "selling a house" (170/mo at $25 CPC), "how to sell a house" (260/mo
// at $10 CPC).  Low volume, very high commercial intent.

const SELLING: PersonaHubContent = {
  metaTitle: "Selling Your House in Australia 2026: Appraisal, Fees, Auction or Private Sale",
  metaDescription:
    "What goes into a real appraisal, how agent fees actually work, auction versus private treaty, and what to ask before you sign a listing agreement. Free, no sign-up.",
  deepDive: {
    eyebrow: "Selling property in Australia, in 2026",
    heading: "The appraisal, the agent, the *negotiation*.",
    paragraphs: [
      "Selling a home in Australia is usually framed as a marketing decision (which agency to list with, how big the campaign should be). That's the wrong framing. The number that ends up on the contract is set in the negotiation between buyer and agent, not in the brochure. The right agent is worth more than every glossy flyer combined.",
      "An appraisal isn't a valuation. An appraisal is an agent's market opinion of what your home should sell for, usually given as a range. A valuation is a formal document prepared by a registered valuer for a bank or court, and typically costs $300 to $600 (Aussie, January 2025; ANZ, read 30 September 2026). For most sellers, two or three independent appraisals from agents who actually work your suburb give a more honest range than a single bank valuation.",
      `No state sets agent commission: it's whatever you agree in the agency agreement. Our compiled state figures (September 2026) put typical rates between ${COMMISSION_LOW}% and ${COMMISSION_HIGH}% of the sale price depending on the state, plus a marketing budget you pay separately. Some agents offer a sliding scale (a lower base fee, a higher rate above a target price), which can align their incentive with yours. Always negotiate the fee in writing, not the handshake.`,
      "Auction or private treaty is mostly a question of how much competition your home will draw, and the measured auction premium is smaller than its reputation. A study of NSW and Victorian sales from 2007 to 2019 found auctions earned an average of 0.3% more than a private sale once the risk of the auction failing is counted, and homes that passed in later sold for 1.3% less, an effect that faded over about ten months (Cortés, Singh, Solomon and Strahan, Review of Finance, 2026). Clearance rates show how often auctions are failing right now: Cotality's combined capital-city rate was 45.4% in the week ending 4 October 2026, against 67.4% a year earlier. Look at recent results for homes like yours, not last year's headlines.",
      "Days on market matters. Capital-city homes took a median of 39 days to sell in September 2026, up from 23 days a year earlier (Cotality, 1 October 2026), so compare your campaign with recent sales like yours in your area. If yours has sat well past them, review the price first. Withdrawing and relisting a few weeks later doesn't make it a new listing: realestate.com.au treats a property as new only if it hasn't been active or under offer on the site in the past 60 days, and that includes a new agency agreement with the same agency.",
    ],
  },
  calculatorsHeading: "Tools sellers actually use",
  calculatorsBlurb:
    "Run the seller-side numbers before you sign anything.",
  calculators: [
    { label: "Free selling guide (PDF)",     href: "/selling-guide",              blurb: "Selling a home, the free 10-chapter guide: costs, agent selection, and a 12-week plan. Personalised to your suburb." },
    { label: "Selling costs calculator",     href: "/selling-costs-calculator",   blurb: "Every line of the bill by state, from commission and GST to the mortgage payout, and the cash you walk away with." },
    { label: "Commission calculator",        href: "/real-estate-commission-calculator", blurb: "What an agent costs on your sale price, with typical rates by state." },
    { label: "Agent proposal worksheet",     href: "/tools/agent-proposal-worksheet", blurb: "Compare up to three agents’ proposals side by side, at the same expected sale price." },
    { label: "Property valuation range",     href: "/property-valuation",         blurb: "Appraisal, valuation and online estimate compared, with what homes sell for in your suburb from published medians." },
    { label: "Free property appraisal",      href: "/appraisal",                  blurb: "An appraisal from one participating local agent, only if you ask. No commitment." },
    { label: "Capital gains tax calculator", href: "/cgt-calculator",             blurb: "Estimate CGT on an investment property sale, including the 50% discount and main residence exemption." },
    { label: "Stamp duty (for your next home)", href: "/stamp-duty-calculator",   blurb: "What you'll pay on the upgrade or downsize, by state." },
    { label: "Borrowing power for the next move", href: "/borrowing-power-calculator", blurb: "An estimate of what a lender may lend for your next home." },
  ],
  faqs: [
    {
      question: "How are real estate agent fees structured in Australia?",
      answer:
        `Commission is a percentage of the sale price, agreed in the agency agreement; no state sets it. Our compiled state figures (September 2026) put typical rates between ${COMMISSION_LOW}% and ${COMMISSION_HIGH}% depending on the state, and you pay a marketing budget on top. Some agents offer tiered or bonus-tied structures, for example a lower base fee with a higher rate if the final price beats an agreed target. Always have the fee, and whether it includes GST, in writing in the agreement.`,
    },
    {
      question: "How is an appraisal different from a valuation?",
      answer:
        "An appraisal is an agent's market opinion of what your home should sell for, usually given as a range. It's free and there's no legal weight to it. A valuation is a formal document prepared by a registered property valuer, typically costs $300 to $600 (Aussie, January 2025; ANZ, read 30 September 2026), and is what banks and courts rely on. For most sellers, two or three independent appraisals from local agents give a more useful range than a single bank valuation.",
    },
    {
      question: "Should I sell at auction or by private treaty?",
      answer:
        "It depends on how much competition your home will draw. Auction can pay off when several buyers want the same home, but the measured premium is small: a study of NSW and Victorian sales found auctions averaged 0.3% more than a private sale once failed auctions are counted, and homes that passed in later sold for 1.3% less (Review of Finance, 2026). Clearance rates show the risk: Cotality's combined capital-city rate was 45.4% in the week ending 4 October 2026, down from 67.4% a year earlier. Ask each agent which method has worked for homes like yours in the last three months, and to show you the sales.",
    },
    {
      question: "Do I pay capital gains tax on my own home?",
      answer:
        `Usually no. The main residence exemption means CGT does not apply when you sell the home you've actually lived in. Partial CGT applies if you've rented the property out for part of the time you owned it, or if the property is on more than two hectares. The full CGT applies if it was an investment property held in your name, currently with a 50% discount if held over 12 months. From ${REFORM_START} that discount gives way to cost base indexation and a 30% minimum tax for individuals, on gains that accrue from that date (passed by Parliament on 25 June 2026; ATO).`,
    },
    {
      question: "How long does it take to sell a house in Australia?",
      answer:
        "In September 2026 capital-city homes took a median of 39 days to sell, up from 23 days a year earlier as the market slowed (Cotality, 1 October 2026). Your suburb and price point can differ a lot, so ask agents for the days on market of recent sales like yours. After contracts are exchanged, settlement usually takes another 30 to 90 days, depending on what's negotiated and the buyer's finance.",
    },
    {
      question: "Can I sell my house without an agent?",
      answer:
        "Yes. For-sale-by-owner (FSBO) is legal in every state and saves you the agent commission. The trade-off is that you handle the marketing, the inspections, the negotiation and the contract management yourself, and you still pay for the legal documents your state requires and a conveyancer. Whether the commission saved outweighs any difference in price depends on your market and your negotiating experience. It's worth considering if you've negotiated a sale before or have a buyer already lined up.",
    },
  ],
  matchIntent: "selling",
};

// ─── Investing ────────────────────────────────────────────────────────
// Target queries: "property investing" (5,400/mo, $8.72 CPC),
// "investment property" (5,400/mo), "property investment australia"
// (1,900/mo, $6 CPC).  High CPC = high lead value.

const INVESTING: PersonaHubContent = {
  metaTitle: "Property Investment Australia 2026: Yield, Growth, Tax, Negative Gearing",
  metaDescription:
    "Investor-grade suburb data, rental yield and CGT calculators, depreciation explainers and negative gearing math. The numbers a buyer's agent would charge $5,000 to run, free.",
  deepDive: {
    eyebrow: "Investing in Australian property, in 2026",
    heading: "Yield, growth, and the *holding cost* most investors miss.",
    paragraphs: [
      "Investment-grade property is decided on three numbers: gross rental yield, the capital growth thesis, and the after-tax holding cost. Most 'hot suburb' tips you'll read fail at least one of them. The point of this hub is to give you the same numbers and frameworks a buyer's agent uses, free.",
      "Gross rental yield is annual rent divided by purchase price, expressed as a percentage. As a rule of thumb: under 3% is growth-led (Sydney inner ring, Melbourne inner ring); 3-5% is balanced (most metro Brisbane, Perth and Adelaide); over 5% is yield-led (regional, mining-exposed, low-growth metros). Net yield subtracts strata, rates, insurance, agent fees and maintenance — typically 1.5-2% lower than gross.",
      "Capital growth depends on three things: population growth in the catchment, infrastructure spend that hasn't yet been priced in, and the proportion of the suburb that's land (not strata). A 5% gross yield in a suburb with falling population and no infrastructure is a cash-flow trap, not an investment.",
      "Holding cost is what you pay each year to keep the property after rent has covered some of the mortgage. For a $700k property on an 80% loan at 6.5%, the mortgage runs around $36,000/year, plus $4-6k in council rates, $2k insurance, $3k property management, $5-10k maintenance, and (if a unit) $4-8k strata. Even with $30,000/year rent, you're out of pocket $20-30,000 before tax. Negative gearing returns some of that at your marginal rate, but you're funding the rest from salary.",
      "Depreciation is the under-used lever. New or recently-built investment properties qualify for capital works depreciation (2.5% per year of the construction cost over 40 years) plus depreciation on plant and equipment. A proper quantity surveyor schedule for a $500k construction-cost property is worth $8-12k in deductions in year one. That's a real boost to after-tax yield for any property less than ~30 years old.",
    ],
  },
  calculatorsHeading: "Investor calculators",
  calculatorsBlurb:
    "Run the numbers like a buyer's agent would.",
  calculators: [
    { label: "Rental yield calculator",       href: "/rental-yield-calculator",    blurb: "Gross and net yield, weekly cash flow, full cost picture." },
    { label: "Capital gains tax calculator",  href: "/cgt-calculator",             blurb: "Estimate CGT on a sale, including the 50% discount and main residence partial exemption." },
    { label: "Borrowing power calculator",    href: "/borrowing-power-calculator", blurb: "An estimate of what a lender may lend for an investment loan, after the APRA buffer." },
    { label: "Best suburbs for investors",    href: "/best-suburbs",               blurb: "Suburbs ranked by yield, growth, demographic demand." },
  ],
  faqs: [
    {
      question: "What is gross rental yield and how do I calculate it?",
      answer:
        "Gross rental yield is annual rent divided by the property's purchase price, expressed as a percentage. Example: $500/week rent equals $26,000 per year. On a $650,000 property, that's a gross yield of 4.0%. Net yield subtracts running costs (strata, rates, insurance, agent fees, maintenance) and is typically 1.5-2% lower.",
    },
    {
      question: "How does negative gearing work in Australia?",
      answer:
        "Negative gearing lets you deduct the loss on an investment property (rent minus expenses including interest) against your other income, reducing your tax bill. Example: a property loses $15,000 per year on a cash basis. At a 37% marginal rate, you save $5,550 in tax, so the after-tax loss drops to $9,450. The strategy is only worth it if you expect capital growth to outweigh the holding cost over your hold period.",
    },
    {
      question: "What is the 50% capital gains tax discount?",
      answer:
        "Individual investors (and most trusts) who hold an investment property for more than 12 months only pay CGT on 50% of the gain. Example: a $200,000 capital gain becomes $100,000 of assessable income. At a 37% marginal rate, the tax is $37,000 — effectively 18.5% on the original gain. The discount doesn't apply to companies or property held less than 12 months.",
    },
    {
      question: "What is property depreciation and who can claim it?",
      answer:
        "Depreciation lets investment property owners deduct the wear-and-tear on the building and its fixtures against rental income. The building itself (capital works) depreciates at 2.5% per year for 40 years if constructed after 16 September 1987. Plant and equipment (carpets, blinds, appliances, hot water systems) depreciates faster on individual schedules. A quantity surveyor report (around $700-$900) is required to claim the full schedule.",
    },
    {
      question: "Yield or capital growth — which matters more?",
      answer:
        "Both matter, but they're usually in tension. High-yield suburbs (over 5%) tend to be regional or low-growth metro areas; low-yield suburbs (under 3%) tend to be capital city inner rings with stronger long-term growth. The right balance depends on your cash flow position, your hold period, and your marginal tax rate. Most investors aim for a balanced 3-4% gross yield in a suburb with credible 5%+ annual growth.",
    },
    {
      question: "How much does it cost to hold an investment property each year?",
      answer:
        "Roughly: mortgage interest (currently around 6.5% on investor loans), council rates ($2,000-$5,000), insurance ($1,500-$3,000), property management (7-10% of rent), maintenance (1% of property value as a rule of thumb), and strata if applicable ($3,000-$8,000 a year). For a $700,000 property on an 80% loan, you're looking at $45,000-$55,000 in annual holding costs before rental income offsets it.",
    },
    {
      question: "Is it better to invest through a company, trust, or in my own name?",
      answer:
        "Most individual investors hold in their own name (or jointly with a spouse) because they get the 50% CGT discount and can negative-gear losses against personal income. Discretionary trusts give flexibility on distributing income but lose the ability to distribute losses. Companies don't get the 50% CGT discount and are usually a bad structure for residential property. Always get specific advice from a property accountant before choosing.",
    },
  ],
  matchIntent: "investing",
};

// ─── Upgrading / downsizing ───────────────────────────────────────────
// Target queries: "downsizing home" (140/mo), "upgrading home" (50/mo).
// Low volume but high lead value (two transactions = double commission).

const UPGRADING: PersonaHubContent = {
  metaTitle: "Upgrading or Downsizing Your Home Australia: Sell First, Buy First, or Bridge?",
  metaDescription:
    "Sell first, buy first, or use bridging finance. The three ways to manage two transactions at once, with the cost and risk trade-offs spelled out. Free, no sign-up.",
  deepDive: {
    eyebrow: "Moving from one home to another, in 2026",
    heading: "Sell first, buy first, or *bridge*.",
    paragraphs: [
      "Upgrading or downsizing means two transactions need to talk to each other. The three viable paths are: sell first (cleanest financially, hardest on logistics), buy first (cleanest on logistics, riskiest financially), or use bridging finance (most expensive, sometimes the only option). The right call depends on your equity position, your timing, and how patient your next mortgage will be.",
      "Sell first means you list and sell your current home, then go house-hunting with a known budget. You'll either need short-term rental accommodation between settlements or to negotiate a long settlement on the sale (60-90 days isn't unusual) so you can buy in parallel. Cleanest financially because there's no double mortgage and no bridging fees, but the risk is finding the right next home in the available window.",
      "Buy first means you find the next home, exchange contracts subject to finance, then list your current home. This works in slow markets where you can negotiate a long settlement on the purchase (often 90-120 days). The risk: if your current home doesn't sell quickly, you're carrying two mortgages and possibly paying penalty interest. Have a serviceability buffer in mind before going down this path.",
      "Bridging finance is a short-term loan that covers the gap between buying the new home and selling the old one. Bridging lasts 6-12 months typically, the rate is usually 1-2% above standard variable, and you'll pay interest on the 'peak debt' (combined value of both loans) for the bridging period. Useful when the timing genuinely won't line up, expensive if you treat it as an alternative to selling fast.",
      `Stamp duty on the next home is the line item most upgraders underestimate. A $1.5m purchase in NSW carries ${money(calculateStampDuty(1_500_000, "NSW", false, false, false).total)} in stamp duty for a non-first-home buyer; a $1m purchase in VIC is ${money(calculateStampDuty(1_000_000, "VIC", false, false, false).total)}. Build the duty into your true cost of moving, not the headline price difference.`,
    ],
  },
  calculatorsHeading: "The numbers an upgrader has to run",
  calculatorsBlurb:
    "Two transactions, two sets of math. Get the stamp duty, repayment and borrowing-power numbers before you sign either.",
  calculators: [
    { label: "Stamp duty (your next home)",   href: "/stamp-duty-calculator",      blurb: "The single biggest line item when moving. By state, with current rates." },
    { label: "Mortgage repayment calculator", href: "/mortgage-calculator",        blurb: "What the new loan will actually cost each month, weekly or fortnightly." },
    { label: "Borrowing power calculator",    href: "/borrowing-power-calculator", blurb: "An estimate of what a lender may lend on your income and equity position." },
    { label: "Free property appraisal",       href: "/appraisal",                  blurb: "An appraisal of your current home from one participating local agent, only if you ask." },
  ],
  faqs: [
    {
      question: "Should I sell first or buy first when upgrading?",
      answer:
        "Sell first is the lower-risk option financially: you know your budget and you don't risk carrying two mortgages. Buy first works in slow markets where you can negotiate a long settlement on the purchase (90-120 days) and where you're confident your current home will sell quickly. If timing genuinely won't line up either way, bridging finance is the third option — expensive, but sometimes the right call.",
    },
    {
      question: "How does bridging finance work?",
      answer:
        "Bridging finance is a short-term loan (usually 6-12 months) that covers the gap between buying a new home and selling the old one. You pay interest on the 'peak debt' (the combined value of both loans) for the bridging period. The interest rate is typically 1-2% above the standard variable rate. Once the old home sells, the proceeds pay down the peak debt and you transition to a standard mortgage on the new home.",
    },
    {
      question: "How much stamp duty will I pay when upgrading?",
      answer:
        "Stamp duty on an upgrade is calculated at the full (non-first-home) rate on the new purchase price. As an indicative scale: a $1m purchase in NSW costs around $40,000; in VIC around $55,000; in QLD around $34,000; in WA around $42,000. There is no stamp duty refund or credit for selling your old home. Build the full stamp duty into your true cost of moving.",
    },
    {
      question: "Can I take my mortgage with me when I move?",
      answer:
        "Yes, this is called 'porting' the mortgage. Most lenders allow you to transfer the loan from one property to another without re-paying establishment fees, provided the new property meets their lending criteria and the loan amount stays the same or smaller. If you're borrowing more, you'll be assessed for the top-up. Porting saves break costs on fixed-rate loans and re-application fees, but always compare with what's available on the market — the existing loan may not be the cheapest option.",
    },
    {
      question: "What is the downsizer contribution to super?",
      answer:
        "Australians aged 55 and over who sell a home they've owned for at least 10 years can contribute up to $300,000 each (so $600,000 per couple) of the sale proceeds into super as a downsizer contribution. The contribution doesn't count toward the normal contribution caps and isn't subject to the work test. It's a useful tax-effective way to convert home equity into retirement savings.",
    },
    {
      question: "How long does it take to sell and buy at the same time?",
      answer:
        "Plan on 60-120 days from listing to settlement on the sale, plus 30-60 days from offer to settlement on the purchase. If you sequence them well (long settlement on the sale, fast settlement on the purchase) it can all happen within 90-120 days from listing. If the timing slips, you're either in short-term rental or carrying two mortgages briefly — both are manageable with planning.",
    },
  ],
  matchIntent: "buying",
};

// ─── Renovating ───────────────────────────────────────────────────────
// Target queries: "home renovation cost" (590/mo), "renovating a house"
// (480/mo).  Lower volume but consistent commercial intent.

const RENOVATING: PersonaHubContent = {
  metaTitle: "Renovating a House in Australia 2026: Costs, Finance, Builders, ROI",
  metaDescription:
    "Current 2026 renovation cost ranges, how to finance the work, how to choose a builder, and which jobs actually add resale value. Plain English, no sign-up.",
  deepDive: {
    eyebrow: "Renovating in Australia, in 2026",
    heading: "Cost ranges, finance, and *return on renovation*.",
    paragraphs: [
      "Renovation costs in Australia have moved hard since 2023. Materials are up 15-25% on pre-COVID baselines and trade labour rates are up 20-40% in capital cities. Budgeting a kitchen at 2019 prices is how owners blow budgets before the first wall comes down. This hub gives current-market cost ranges, finance paths, builder selection and return-on-renovation guidance in one place.",
      "Indicative 2026 cost ranges: a budget kitchen renovation (cabinets, benchtop, basic appliances) lands around $15,000-$25,000; mid-range $25,000-$50,000; high-end (custom cabinetry, stone benchtops, premium appliances) $50,000-$120,000. A bathroom renovation is $15,000-$35,000 mid-range, $35,000-$80,000 high-end. A double-storey extension runs $250,000-$500,000+ depending on size, complexity and finishes. A full house renovation is usually $3,000-$5,000 per square metre.",
      "Financing a renovation is usually one of three paths: redraw or refinance against existing equity (cheapest, most flexible), a construction loan (released in stages against builder invoices, used for major work), or a personal loan (fastest, most expensive). The cleanest path for a $50k+ renovation is usually a refinance that pulls cash out of existing equity into an offset account, so interest only accrues on what you actually spend.",
      "Choosing a builder is the variable most owners underestimate. Get three quotes for any job over $20,000, on a like-for-like scope. Ask for builder licence numbers (and verify them with the state authority), public liability insurance, home warranty insurance (for jobs over the state threshold), and references for completed work in the last 12 months that you can call. The cheapest quote is rarely the cheapest job by the time it's done.",
      "Return on renovation varies sharply by job. Kitchens and bathrooms typically return 60-90% of cost at sale. A second bathroom in a 3-bedroom house often returns 100%+. Cosmetic refreshes (paint, flooring, landscaping) return 200-400% on dollars spent. Extensions and pools rarely return their cost — they're lifestyle decisions, not investments. The 'always-skip' for resale: high-end appliances, custom cabinetry, premium finishes that future buyers may not value.",
    ],
  },
  calculatorsHeading: "Numbers for a renovator",
  calculatorsBlurb:
    "Working out whether the job stacks up before you sign with a builder.",
  calculators: [
    { label: "Borrowing power calculator",    href: "/borrowing-power-calculator", blurb: "What you can borrow to fund the work, on top of your current loan." },
    { label: "Mortgage repayment calculator", href: "/mortgage-calculator",        blurb: "What the refinanced loan will cost each month, given the extra borrowing." },
    { label: "Capital gains tax calculator",  href: "/cgt-calculator",             blurb: "If you're renovating an investment property, what CGT looks like at sale." },
    { label: "Free property appraisal",       href: "/appraisal",                  blurb: "Estimate of current value before the work, so you know what extra value the renovation has to create." },
  ],
  faqs: [
    {
      question: "How much does a kitchen renovation cost in Australia?",
      answer:
        "Budget kitchen (flat-pack cabinets, laminate benchtop, basic appliances): $15,000-$25,000. Mid-range (custom cabinets, stone benchtop, mid-tier appliances): $25,000-$50,000. High-end (custom cabinetry, premium stone or engineered surfaces, integrated premium appliances): $50,000-$120,000. Plumbing relocations, electrical upgrades and demolition add to the base cost. Get three written quotes on the same scope before you commit.",
    },
    {
      question: "How much does a bathroom renovation cost in Australia?",
      answer:
        "A standard bathroom renovation lands at $15,000-$35,000 for mid-range fixtures and finishes. High-end (premium tiles, freestanding bath, frameless glass, double vanity) runs $35,000-$80,000. Allow extra for plumbing relocations, structural changes and waterproofing. Bathrooms typically take 3-5 weeks of trades-on-site for a like-for-like swap, longer if walls move.",
    },
    {
      question: "How do I finance a renovation in Australia?",
      answer:
        "Three common paths: refinance and redraw against existing equity (cheapest interest rate, most flexible — best for jobs over $30k); a construction loan (released in stages against builder invoices, used for major structural work); or a personal loan (fast to set up, expensive — only for small cosmetic jobs). For most owners, the cleanest play is refinancing into an offset account so interest only accrues on what's actually spent.",
    },
    {
      question: "Which renovations add the most value to a home?",
      answer:
        "Cosmetic refreshes (paint, flooring, modest landscaping) typically return 200-400% on dollars spent. Kitchens and bathrooms return 60-90% if done to a mid-range standard appropriate to the suburb. Adding a second bathroom to a 3-bedroom house often returns more than 100%. Extensions, pools and high-end finishes rarely return their cost at sale — they're lifestyle decisions. Always benchmark against what comparable sold homes in your suburb actually have.",
    },
    {
      question: "Do I need council approval to renovate?",
      answer:
        "Depends on the scope and your state. Internal cosmetic work (paint, flooring, replacing fixtures like-for-like) typically doesn't need approval. Structural changes (moving walls, plumbing relocations, electrical) often need a Complying Development Certificate (CDC) or a Development Application (DA). Extensions, second-storey additions and major facade changes almost always need a DA, which can take 2-4 months to approve. Check with your local council before any quote becomes a contract.",
    },
    {
      question: "Should I renovate or sell?",
      answer:
        "Rule of thumb: if the renovation cost plus your current home's value exceeds the sale price of a comparable already-renovated home in your suburb, sell. If it sits below, renovate. Add a 'cost of moving' premium of $30,000-$80,000 (stamp duty, agent fees, conveyancing, moving costs) to the renovation side of the equation. The 'renovation rescue' calculation is usually closer than emotional attachment suggests.",
    },
  ],
  matchIntent: "buying",
};

// ─── Export ────────────────────────────────────────────────────────────

export const PERSONA_HUB_CONTENT: Record<PersonaId, PersonaHubContent> = {
  "first-home": FIRST_HOME,
  "selling":    SELLING,
  "investing":  INVESTING,
  "upgrading":  UPGRADING,
  "renovating": RENOVATING,
};
