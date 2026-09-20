// The eight "cost of selling a house in {State}" guides (content gap 10).
// The numbers come from selling-costs.ts and commission-rates.ts so the
// pages cannot drift from the commission guides; this file holds what is
// different about selling in each state, written from the statutes and the
// regulator pages cited in `sources`. Paragraph strings may contain
// [text](/path) links, rendered by the template.
import type { FaqItem, SourceItem } from "@/components/guide";
import type { StateCode } from "./commission-rates";

export interface StateDifference {
  heading: string;
  body: string[];
}

export interface StateCostGuide {
  state: StateCode;
  slug: string;
  /** Capital city and its Cotality dwelling median, for context on the example price. */
  capital: string;
  capitalMedian: number;
  /** Two or three sentences on what sets this state's selling costs apart. */
  intro: string[];
  differences: StateDifference[];
  faqs: FaqItem[];
  sources: SourceItem[];
}

export const COST_OF_SELLING_AS_OF = "2026-09-20";

/** Cotality Home Value Index, August 2026 (released 1 September 2026): capital dwelling medians. */
const COTALITY: SourceItem = {
  label: "Cotality Home Value Index, August 2026 results (capital city median dwelling values)",
  href: "https://www.cotality.com/au/insights/articles/high-end-homes-lead-market-downturn-as-affordable-properties-prove-resilient",
  note: "released 1 September 2026",
};
const ATO_FRCGW: SourceItem = {
  label: "ATO, Foreign resident capital gains withholding: clearance certificates (15% withholding on every sale without one, from 1 January 2025)",
  href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/foreign-residents-and-capital-gains-tax/foreign-resident-capital-gains-withholding",
};
const ATO_CGT: SourceItem = {
  label: "ATO, Capital gains tax: your main residence, and selling a rental property",
  href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax",
};
const YPG_NOTE: SourceItem =
  "Commission ranges are Your Property Guide's compiled market figures (September 2026). Marketing, conveyancing, document, auctioneer and discharge figures are indicative ranges quoted individually by suppliers; no state publishes a survey, so treat them as a budget.";

const FRCGW_PARA =
  "Since 1 January 2025 every seller of Australian property needs an ATO clearance certificate before settlement, whatever the price. Without one the buyer must withhold 15% of the price and pay it to the ATO, and you wait for your tax return to get it back. The certificate is free, applied for online, and usually issued within days; ask your conveyancer to lodge it the week you list.";

export const COST_OF_SELLING_STATE: Record<StateCode, StateCostGuide> = {
  NSW: {
    state: "NSW",
    slug: "cost-of-selling-a-house-nsw",
    capital: "Sydney",
    capitalMedian: 1_222_718,
    intro: [
      "New South Wales is the most expensive state to sell in by dollars, because Sydney prices are the highest in the country and commission is a percentage. It is also the only state where the contract of sale has to exist, with its prescribed documents attached, before the property can be advertised, so the legal costs land at the start of the campaign rather than the end.",
      "Commission in NSW typically runs 1.8% to 2.5%, with Sydney metro agents often under 2% because competition for listings is intense. On the Cotality Sydney median of $1,222,718 in August 2026, the difference between 1.8% and 2.5% is more than $8,500 before GST.",
    ],
    differences: [
      {
        heading: "The contract must be ready before the first ad",
        body: [
          "Under the Conveyancing Act 1919 and the Conveyancing (Sale of Land) Regulation 2022, a residential property cannot be offered for sale in NSW until the contract is prepared with the prescribed documents attached: a current title search, the deposited plan, a section 10.7 planning certificate from the council, and the sewer service diagram, plus the strata documents for a unit. Your solicitor or conveyancer orders these; expect $300 to $600 in search fees on top of their professional fee, and allow a week or two for the council certificate.",
          "Because the contract exists from day one, buyers in NSW exchange quickly and the 5-business-day cooling-off period runs from exchange. That is the buyer's cost, not yours, but it shapes the timetable your conveyancer will quote for.",
        ],
      },
      {
        heading: "Your agency agreement has a cooling-off period and a 48-hour rule",
        body: [
          "NSW is the only state that gives the seller a cooling-off period on the agency agreement: until 5 pm on the next business day or Saturday after signing (Property and Stock Agents Act 2002, section 59). The agent must also serve you a copy of the signed agreement within 48 hours or lose the right to commission (section 55). Marketing is payable whether or not the property sells, so the budget you sign is the budget you owe; our guide to [agency agreements by state](/guides/real-estate-agency-agreements-by-state) covers the clauses to change first.",
        ],
      },
      {
        heading: "Auctions are the Sydney norm, and the auctioneer is an extra line",
        body: [
          "Sydney sells a larger share of houses at auction than anywhere except Melbourne. The auctioneer is typically $400 to $1,200 and is sometimes included in the agency agreement, so ask. From late 2026 the NSW underquoting reforms will also require a price or range in every advertisement and a statement of information; that is the agent's job, not a cost to you, but see our [underquoting guide](/guides/underquoting-laws-by-state) for what changes.",
        ],
      },
      {
        heading: "Tax: no stamp duty for the seller, but a clearance certificate for everyone",
        body: [
          "Stamp duty (transfer duty) is the buyer's cost in NSW. If the house is your main residence there is normally no capital gains tax; if it is an investment, CGT applies to the gain after selling costs and the [CGT calculator](/cgt-calculator) gives an estimate.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in NSW?", answer: "On an $800,000 sale, budget roughly $19,000 to $32,000 all-in: commission of $14,400 to $20,000 (1.8% to 2.5%, plus GST), marketing of $2,000 to $8,000, conveyancing of $800 to $2,500, contract documents of $300 to $600, and an auctioneer and mortgage discharge fee if they apply. On a Sydney-median sale above $1.2 million the commission alone is $22,000 to $30,500." },
      { question: "Who pays stamp duty when selling a house in NSW?", answer: "The buyer. Transfer duty in NSW is paid by the purchaser within three months of exchange. The seller pays no duty on the sale." },
      { question: "Do I need a solicitor or conveyancer to sell in NSW?", answer: "In practice yes, because the contract with its prescribed documents must be prepared before the property is advertised, and only a solicitor or licensed conveyancer can prepare it properly. Fees typically run $800 to $2,500 plus $300 to $600 in searches." },
      { question: "What is the average real estate commission in NSW?", answer: "Typically 1.8% to 2.5% of the sale price, with around 2% the most common rate and Sydney metro agents often below it. Commission is not regulated and is always negotiable; GST of 10% usually applies on top." },
      { question: "Can I cancel an agency agreement in NSW?", answer: "Within the cooling-off period, yes: until 5 pm on the next business day or Saturday after you sign. After that you are bound for the term, but any fixed term over 90 days must let you terminate on 30 days' notice after the first 90 days, and most agents will release a seller who asks in writing." },
    ],
    sources: [
      { label: "Conveyancing (Sale of Land) Regulation 2022 (NSW), Schedule 1 (prescribed documents)", href: "https://legislation.nsw.gov.au/view/html/inforce/current/sl-2022-0475" },
      { label: "Property and Stock Agents Act 2002 (NSW), sections 55 and 59", href: "https://legislation.nsw.gov.au/view/html/inforce/current/act-2002-066" },
      { label: "NSW Government, Selling a property in NSW", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },

  VIC: {
    state: "VIC",
    slug: "cost-of-selling-a-house-vic",
    capital: "Melbourne",
    capitalMedian: 786_718,
    intro: [
      "Victoria has the cheapest agent commission in Australia and one of the more expensive sets of legal documents. Melbourne metro rates of 1.6% to 2.2% are common, and the Section 32 vendor statement, which must be given to the buyer before they sign, costs $300 to $800 in certificates before the conveyancer's fee.",
      "Two Victorian rules also move money in the seller's favour. An agent must pass on any rebate they receive on advertising or other expenses, and since 1 January 2024 a seller cannot pass their land tax on to the buyer at settlement for a sale under $10 million, which matters if the property is an investment.",
    ],
    differences: [
      {
        heading: "The Section 32 vendor statement",
        body: [
          "Section 32 of the Sale of Land Act 1962 requires you to give the buyer a signed vendor statement before they sign the contract, covering title, mortgages and covenants, planning and zoning, rates and outgoings, building permits in the last seven years, owners corporation details for a unit, and more. Your conveyancer or solicitor prepares it from certificates ordered from the council, water authority, Land Use Victoria and the owners corporation, typically $300 to $800 in fees plus their professional charge. A defective statement lets the buyer rescind any time before settlement, so this is not the place to economise. Our [Section 32 guide](/guides/section-32-vendor-statement-victoria) goes through every item.",
        ],
      },
      {
        heading: "Rebates must come back to you",
        body: [
          "Under section 48A of the Estate Agents Act 1980, an agent may not keep any rebate, discount or commission they receive on advertising, photography or other expenses charged to you, even if you agree to it. The authority you sign must contain a rebate statement saying whether they expect one. Ask for the invoices behind the marketing schedule and check the rebate line; the penalty for keeping one is up to 60 penalty units ($12,546 in 2026-27) and the money is recoverable by you.",
        ],
      },
      {
        heading: "Land tax cannot be passed to the buyer",
        body: [
          "Since 1 January 2024, section 10G of the Sale of Land Act 1962 makes any clause in a contract under $10 million that requires the buyer to pay an amount towards the vendor's land tax of no effect, and it is an offence to enter such a contract. For an owner-occupier this changes nothing, because a principal place of residence is exempt from land tax. For an investor selling a Melbourne property it means the whole year's land tax stays with you rather than being apportioned at settlement, which can be several thousand dollars on a higher-value holding.",
        ],
      },
      {
        heading: "Auctions, and the October 2026 reserve rule",
        body: [
          "Melbourne has the highest auction share in the country, and the auctioneer is often the listing agent or a colleague included in the fee; where charged separately expect $400 to $1,200. From 1 October 2026, for auctions held on or after 16 October, the seller's reserve must be a single figure published in advertising at least seven days before the auction, so the reserve conversation now happens earlier in the campaign. Our [reserve price guide](/guides/reserve-price-auction) explains what changes for sellers.",
        ],
      },
      {
        heading: "Tax",
        body: [
          "Land transfer duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not, and the [CGT calculator](/cgt-calculator) gives an estimate after selling costs.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in Victoria?", answer: "On an $800,000 sale, budget roughly $17,000 to $32,000 all-in: commission of $12,800 to $20,000 (1.6% to 2.5%, plus GST), marketing of $2,000 to $8,000, conveyancing of $800 to $2,500, Section 32 certificates of $300 to $800, and an auctioneer and mortgage discharge fee if they apply. Melbourne metro commission often sits under 2%." },
      { question: "Who pays for the Section 32 in Victoria?", answer: "The seller. The vendor statement is your obligation under section 32 of the Sale of Land Act 1962, and the certificates it needs typically cost $300 to $800 plus your conveyancer's fee. The buyer pays for their own contract review and any building inspection." },
      { question: "Can a Victorian seller pass land tax on to the buyer?", answer: "Not for a sale under $10 million. Since 1 January 2024, section 10G of the Sale of Land Act makes such a clause of no effect. It only matters for investment properties; a principal place of residence is exempt from land tax anyway." },
      { question: "What is the average real estate commission in Victoria?", answer: "Typically 1.6% to 2.5%, with around 2% most common and Melbourne metro agents often lower. Commission is deregulated and negotiable, and the agent must tell you it is negotiable before you sign the authority. GST of 10% usually applies on top." },
      { question: "Do I have a cooling-off period on the sales authority in Victoria?", answer: "No. Victoria's three-business-day cooling-off period belongs to the buyer on the contract of sale, not to the seller on the agency authority. Once you sign a sole authority you are bound for its stated period, which by default ends 60 days after signing for a private sale or 30 days after an auction unless a longer period was agreed." },
    ],
    sources: [
      { label: "Sale of Land Act 1962 (Vic), sections 10G and 32 to 32P", href: "https://www.legislation.vic.gov.au/in-force/acts/sale-land-act-1962" },
      { label: "Estate Agents Act 1980 (Vic), sections 47A, 48A and 49A", href: "https://www.legislation.vic.gov.au/in-force/acts/estate-agents-act-1980" },
      { label: "Consumer Affairs Victoria, Selling property", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },

  QLD: {
    state: "QLD",
    slug: "cost-of-selling-a-house-qld",
    capital: "Brisbane",
    capitalMedian: 1_080_142,
    intro: [
      "Queensland commission is higher than in the southern capitals, typically 2.3% to 2.9%, a legacy of the 5% statutory cap that applied until commission was deregulated on 1 December 2014 and that many agencies still price against. On the Cotality Brisbane median of $1,080,142 in August 2026, that range is $24,800 to $31,300 before GST.",
      "Queensland also added a seller disclosure regime on 1 August 2025, and it has two safety certificates most other states do not require at sale: a pool safety certificate and compliant interconnected smoke alarms.",
    ],
    differences: [
      {
        heading: "The seller disclosure statement (Form 2) since 1 August 2025",
        body: [
          "Under the Property Law Act 2023, a seller must give the buyer a signed disclosure statement in the approved Form 2, with the prescribed certificates attached, before the buyer signs the contract: a current title search and registered plan, any statutory encumbrances, zoning, rates and water notices, a body corporate certificate for a unit, and pool and tree-order documents where relevant. A missing or inaccurate statement about a material matter lets the buyer terminate before settlement. Your solicitor or the agent prepares it; expect $200 to $700 in searches plus the professional fee, more for a unit because of the body corporate certificate. Our [Queensland contract of sale guide](/guides/contract-of-sale-qld) covers the form in detail.",
        ],
      },
      {
        heading: "Pool safety and smoke alarm certificates",
        body: [
          "If the property has a pool or spa, you must give the buyer a current pool safety certificate before settlement or a Form 36 notice that there is none, in which case the buyer must obtain one within 90 days at their cost and can factor that into the price. An inspection typically costs $150 to $300, and repairs to bring a fence into compliance can run to thousands. Since 1 January 2022, every home sold in Queensland must also have interconnected photoelectric smoke alarms in each bedroom, hallway and level; an electrician's installation is commonly $150 to $600 depending on the number of alarms and whether they are hard-wired. Neither cost appears in the standard table because they do not apply to every sale.",
        ],
      },
      {
        heading: "The Form 6 appointment and the 90-day cap",
        body: [
          "Your agent must be appointed on the approved Form 6 before they act, and a sole or exclusive appointment for a residential sale cannot exceed 90 days (Property Occupations Act 2014, sections 102 to 112). Commission must be stated as worked out on the actual sale price, and any rebates the agent may receive on expenses must be disclosed. See our guide to [agency agreements by state](/guides/real-estate-agency-agreements-by-state).",
        ],
      },
      {
        heading: "Auctions without a price guide",
        body: [
          "Queensland forbids agents from giving buyers a price guide for a property being sold by auction, so auction campaigns are marketed without a price. Auctions are a smaller share of sales than in Sydney or Melbourne; where you use one, the auctioneer is typically $400 to $1,200.",
        ],
      },
      {
        heading: "Tax",
        body: [
          "Transfer duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not, and the [CGT calculator](/cgt-calculator) gives an estimate after selling costs.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in Queensland?", answer: "On an $800,000 sale, budget roughly $22,000 to $36,000 all-in: commission of $18,400 to $23,200 (2.3% to 2.9%, plus GST), marketing of $2,000 to $8,000, conveyancing of $800 to $2,500, the Form 2 disclosure searches of $200 to $700, plus a pool safety certificate, smoke alarm work, an auctioneer or a mortgage discharge fee where they apply." },
      { question: "Is real estate commission capped in Queensland?", answer: "Not since 1 December 2014, when the Property Occupations Act 2014 removed the former 5% cap. Commission is now negotiated, and typical rates are 2.3% to 2.9% of the sale price plus GST, with around 2.5% most common." },
      { question: "Who pays for the seller disclosure statement in Queensland?", answer: "The seller. The Form 2 and its certificates are your obligation under the Property Law Act 2023 from 1 August 2025. Search fees are typically $200 to $700; a body corporate certificate for a unit adds to that." },
      { question: "Do I need a pool safety certificate to sell in Queensland?", answer: "You must either give the buyer a current certificate before settlement or give a Form 36 notice that there is none, after which the buyer must obtain one within 90 days. Most sellers get the certificate, typically $150 to $300 for the inspection plus any fence repairs." },
      { question: "How long can a Queensland agency agreement run?", answer: "A sole or exclusive appointment for a residential sale is capped at 90 days and can be renewed for further terms of up to 90 days, but not earlier than 14 days before the current term ends. An open listing can be ended at any time." },
    ],
    sources: [
      { label: "Property Law Act 2023 (Qld), Part 6 (seller disclosure), in force 1 August 2025", href: "https://www.legislation.qld.gov.au/view/html/inforce/current/act-2023-032" },
      { label: "Property Occupations Act 2014 (Qld), sections 102 to 114 and 214 to 216", href: "https://www.legislation.qld.gov.au/view/html/inforce/current/act-2014-022" },
      { label: "Queensland Government, Selling a home with a pool and Smoke alarms when selling", href: "https://www.qld.gov.au/housing/buying-owning-home/selling-a-home" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },

  SA: {
    state: "SA",
    slug: "cost-of-selling-a-house-sa",
    capital: "Adelaide",
    capitalMedian: 937_207,
    intro: [
      "South Australia sits in the middle on commission, typically 1.8% to 2.75% with about 2% most common, and it is one of the few states where the agent, rather than your conveyancer, usually prepares the statutory vendor's statement. Adelaide's median dwelling value reached $937,207 in August 2026 after several years of strong growth, so the dollar figures are higher than many sellers expect.",
      "SA's sales agency agreement is the most tightly regulated in the country on price and term, which protects sellers from two of the costs that hurt most: an over-long agreement and a guide set below what you have said you will accept.",
    ],
    differences: [
      {
        heading: "The Form 1 vendor's statement",
        body: [
          "Section 7 of the Land and Business (Sale and Conveyancing) Act 1994 requires the buyer to be served a Form 1 vendor's statement at least 10 clear days before settlement; in practice it is served when the contract is signed, and the buyer's cooling-off period of two clear business days runs from service. Where an agent is appointed, the agent is responsible for preparing it, using searches from Land Services SA, the council, SA Water and the emergency services levy office that typically cost $300 to $600. If you sell without an agent, your conveyancer prepares it. Our [SA contract of sale guide](/guides/contract-of-sale-sa) walks through the form.",
        ],
      },
      {
        heading: "A 90-day agreement with your price written in",
        body: [
          "Under section 20 of the same Act, the sales agency agreement must state the agent's genuine estimate and the price you will accept, each as a single figure, and cannot run longer than 90 days. The agent must give you the comparable sales behind the estimate and the Commissioner's guide before you sign, and a copy of the agreement within 48 hours. An agent who breaches the section forfeits the commission, and commission already paid is recoverable as a debt. Marketing is payable as agreed; rebates the agent expects must be disclosed in the agreement.",
        ],
      },
      {
        heading: "Conveyancers rather than solicitors",
        body: [
          "South Australia has a long-established licensed conveyancer profession, and most residential sales are handled by a conveyancer rather than a lawyer, which keeps the professional fee towards the lower end of the $800 to $2,500 range. Settlement is electronic through PEXA; the conveyancer's fee normally includes the lodgement fees.",
        ],
      },
      {
        heading: "Auctions and vendor bids",
        body: [
          "Adelaide's auction share is moderate and rising. SA allows up to three vendor bids, and the guide cannot be below the price you have recorded in the agency agreement. Auctioneers typically charge $400 to $1,200 where not included in the agent's fee.",
        ],
      },
      {
        heading: "Tax",
        body: [
          "Stamp duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not, and the [CGT calculator](/cgt-calculator) gives an estimate after selling costs. Land tax on an investment property is adjusted between seller and buyer at settlement in SA in the usual way.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in South Australia?", answer: "On an $800,000 sale, budget roughly $19,000 to $34,000 all-in: commission of $14,400 to $22,000 (1.8% to 2.75%, plus GST), marketing of $2,000 to $8,000, conveyancing of $800 to $2,500, Form 1 searches of $300 to $600, and an auctioneer and mortgage discharge fee if they apply." },
      { question: "Who prepares and pays for the Form 1 in SA?", answer: "Where an agent is appointed, the agent prepares it; the searches, typically $300 to $600, are a cost to the seller. Without an agent, your conveyancer prepares it. The buyer's two-business-day cooling-off period runs from when the Form 1 is served." },
      { question: "How long can an agency agreement run in South Australia?", answer: "No more than 90 days. It can be extended once, either by written agreement for up to 90 days signed no earlier than 14 days before expiry, or automatically for 180 days if the agent serves a notice of expiry and you do not object. You can terminate at any time during an extension by written notice." },
      { question: "What is the average real estate commission in South Australia?", answer: "Typically 1.8% to 2.75% of the sale price, with around 2% most common in Adelaide and higher rates in regional SA. Commission is negotiable, and GST of 10% usually applies on top." },
      { question: "Does a South Australian seller pay stamp duty?", answer: "No. Stamp duty on a property transfer is paid by the buyer. The seller's costs are commission, marketing, conveyancing, the Form 1 searches and, for an investment property, capital gains tax." },
    ],
    sources: [
      { label: "Land and Business (Sale and Conveyancing) Act 1994 (SA), sections 7, 20 and 24A", href: "https://www.legislation.sa.gov.au/lz?path=%2Fc%2Fa%2Fland+and+business+%28sale+and+conveyancing%29+act+1994" },
      { label: "Land and Business (Sale and Conveyancing) Regulations 2025 (SA), regulation 18", href: "https://www.legislation.sa.gov.au/lz?path=%2Fc%2Fr%2Fland+and+business+%28sale+and+conveyancing%29+regulations+2025" },
      { label: "Consumer and Business Services SA, Selling a home", href: "https://www.cbs.sa.gov.au/" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },

  WA: {
    state: "WA",
    slug: "cost-of-selling-a-house-wa",
    capital: "Perth",
    capitalMedian: 999_987,
    intro: [
      "Western Australia has the lightest paperwork of any state: no vendor statement, no compulsory contract before marketing, and no price-guide rules. What it does have is two compliance items that must be right before settlement, hard-wired smoke alarms and residual current devices, and a settlement agent profession that keeps conveyancing costs down.",
      "Commission in WA typically runs 2% to 2.8%, with around 2.4% common. After the strongest three-year run of any capital, Perth's median dwelling value was $999,987 in August 2026, so the dollar commission on a typical Perth sale is now close to Sydney levels a decade ago.",
    ],
    differences: [
      {
        heading: "No vendor statement, but the strata and title searches are yours",
        body: [
          "WA does not require a Section 32-style disclosure. The buyer does their own due diligence, and the standard REIWA contract with the Joint Form of General Conditions carries the warranties. Your costs before listing are small: a title search, and for a strata lot the strata information certificate the buyer is entitled to, typically $100 to $400 in total. Our [WA contract of sale guide](/guides/contract-of-sale-wa) explains what the contract does require.",
        ],
      },
      {
        heading: "Smoke alarms and RCDs before settlement",
        body: [
          "The Building Regulations 2012 require mains-powered smoke alarms, no more than ten years old, to be fitted before a dwelling is transferred, and the Electricity Regulations 1947 require at least two residual current devices protecting the power and lighting circuits. The seller is responsible for both. If they are already in place the cost is nil; if not, an electrician typically charges $150 to $700 depending on the work. The settlement agent will ask you to confirm compliance and the buyer can delay settlement if it is missing.",
        ],
      },
      {
        heading: "Settlement agents",
        body: [
          "Most WA sales settle through a licensed settlement agent rather than a lawyer. Fees are no longer set by a statutory scale and are quoted individually; $800 to $1,500 plus disbursements is typical for a straightforward house, towards the top of the range for a strata lot or a sale with a discharge and a mortgage on the other side.",
        ],
      },
      {
        heading: "A simple agency appointment, so the term is up to you",
        body: [
          "Section 60 of the Real Estate and Business Agents Act 1978 requires a written, signed appointment that sets out the property, the services and the commission, and section 63 requires the agent to give you a copy. There is no statutory maximum term and no cooling-off period, so the length of the exclusive authority and any exit clause are negotiated before you sign. Auctions are uncommon in Perth; most sales are private treaty, so the auctioneer line rarely applies.",
        ],
      },
      {
        heading: "Tax",
        body: [
          "Transfer duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not, and the [CGT calculator](/cgt-calculator) gives an estimate after selling costs.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in WA?", answer: "On a $600,000 sale, budget roughly $16,000 to $29,000 all-in: commission of $12,000 to $16,800 (2% to 2.8%, plus GST), marketing of $2,000 to $8,000, settlement agent fees of $800 to $2,500, title and strata searches of $100 to $400, and smoke alarm or RCD work and a mortgage discharge fee where they apply. On the Perth median near $1 million, commission alone is $20,000 to $28,000." },
      { question: "Do I need smoke alarms and RCDs to sell a house in WA?", answer: "Yes. Mains-powered smoke alarms less than ten years old and at least two RCDs must be in place before the property is transferred, at the seller's cost. If the house already complies there is nothing to pay; otherwise an electrician's work is typically $150 to $700." },
      { question: "Is there a vendor statement in Western Australia?", answer: "No. WA has no Section 32 or Form 1 equivalent. The buyer does their own searches, and the seller's disclosure obligations are the warranties in the contract and the general duty not to mislead." },
      { question: "What is the average real estate commission in WA?", answer: "Typically 2% to 2.8% of the sale price, with around 2.4% common in Perth and higher rates in regional WA. Commission is negotiable and GST of 10% usually applies on top." },
      { question: "Do I use a settlement agent or a lawyer to sell in WA?", answer: "Either. Most WA sellers use a licensed settlement agent, whose fees for a straightforward sale are typically $800 to $1,500 plus disbursements. A lawyer is worth the extra where the title or the contract is unusual." },
    ],
    sources: [
      { label: "Real Estate and Business Agents Act 1978 (WA), sections 60 and 63", href: "https://www.legislation.wa.gov.au/legislation/statutes.nsf/law_a681.html" },
      { label: "Building Regulations 2012 (WA), Part 8 Division 4 (smoke alarms on transfer)", href: "https://www.legislation.wa.gov.au/legislation/statutes.nsf/law_s43733.html" },
      { label: "Consumer Protection WA, Selling property, and Building and Energy, RCDs and smoke alarms", href: "https://www.consumerprotection.wa.gov.au/selling-property" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },

  TAS: {
    state: "TAS",
    slug: "cost-of-selling-a-house-tas",
    capital: "Hobart",
    capitalMedian: 752_397,
    intro: [
      "Tasmania has the highest typical commission in Australia, 2.5% to 3.25%, because sale prices are lower and the market is thinner, and agents price to a dollar figure per sale rather than a percentage. On a $600,000 Hobart house that is $15,000 to $19,500 before GST; on the Cotality Hobart median of $752,397 in August 2026, $18,800 to $24,500.",
      "Against that, Tasmania's legal costs are among the lowest: there is no vendor statement, no compulsory pre-marketing contract, and no buyer cooling-off period to build a timetable around.",
    ],
    differences: [
      {
        heading: "No vendor statement and no cooling-off",
        body: [
          "Tasmania requires no Section 32-style disclosure and gives the buyer no statutory cooling-off period; a signed contract is binding, subject to its conditions. Your pre-sale legal costs are the contract preparation and the council and TasWater certificates the buyer's conveyancer will expect, typically $200 to $500. Most sales are handled by conveyancers or small firms and the professional fee sits in the lower half of the national $800 to $2,500 range.",
        ],
      },
      {
        heading: "The Property Agents Board and your agreement",
        body: [
          "Agents are licensed by the Property Agents Board of Tasmania under the Property Agents and Land Transactions Act 2016, and the appointment must be in writing, stating the commission and expenses, before the agent acts. There is no statutory maximum term or seller cooling-off period, so negotiate the length of the exclusive authority and the marketing budget before you sign. Complaints about conduct go to the Board.",
        ],
      },
      {
        heading: "Mostly private treaty",
        body: [
          "Auctions are a small share of Tasmanian sales; most homes sell by private treaty or, in a competitive market, by set-date sale or tender. The auctioneer line in the table rarely applies, and marketing budgets are typically at the lower end of the $2,000 to $8,000 range outside Hobart's inner suburbs.",
        ],
      },
      {
        heading: "Tax",
        body: [
          "Property transfer duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not, and the [CGT calculator](/cgt-calculator) gives an estimate after selling costs. Land tax on an investment property is adjusted at settlement.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in Tasmania?", answer: "On a $600,000 sale, budget roughly $18,000 to $31,000 all-in: commission of $15,000 to $19,500 (2.5% to 3.25%, plus GST), marketing of $2,000 to $8,000, conveyancing of $800 to $2,500, contract and council certificates of $200 to $500, and a mortgage discharge fee if there is a loan." },
      { question: "Why is real estate commission higher in Tasmania?", answer: "Lower sale prices and a thinner market. Agents cover the same fixed cost of a campaign from a smaller price, so percentages run 2.5% to 3.25% against about 2% in the big capitals. The dollar figure per sale is often similar. Commission is negotiable, and the percentage is worth negotiating hardest on higher-value Hobart homes." },
      { question: "Is there a cooling-off period when selling in Tasmania?", answer: "No, for either side. The buyer has no statutory cooling-off period on the contract, and the seller has none on the agency agreement. A signed contract is binding subject to its finance and inspection conditions." },
      { question: "Do I need a vendor statement to sell in Tasmania?", answer: "No. Tasmania has no Section 32 or Form 1 equivalent. Your conveyancer prepares the contract and obtains the council and water certificates the buyer expects, typically $200 to $500." },
      { question: "Who pays stamp duty in Tasmania?", answer: "The buyer pays property transfer duty. The seller pays no duty on the sale." },
    ],
    sources: [
      { label: "Property Agents and Land Transactions Act 2016 (Tas)", href: "https://www.legislation.tas.gov.au/view/html/inforce/current/act-2016-011" },
      { label: "CBOS Tasmania, Buying and selling property", href: "https://www.cbos.tas.gov.au/topics/housing/buying-selling-property" },
      { label: "Property Agents Board of Tasmania", href: "https://www.propertyagentsboard.com.au/" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },

  ACT: {
    state: "ACT",
    slug: "cost-of-selling-a-house-act",
    capital: "Canberra",
    capitalMedian: 864_998,
    intro: [
      "Canberra is the one market where the seller pays for the building and pest inspections. Under the Civil Law (Sale of Residential Property) Act 2003 you must have a building and compliance report, a pest report and an energy efficiency rating before the property is advertised, typically $800 to $1,500 together, though the buyer reimburses the cost of the building and pest reports at settlement.",
      "Commission in the ACT is among the lowest in the country, typically 1.8% to 2.25%, on a Cotality Canberra median of $864,998 in August 2026.",
    ],
    differences: [
      {
        heading: "Reports before advertising, reimbursed at settlement",
        body: [
          "Section 9 of the Act lists the required documents the seller must have available from the first day of marketing: the Crown lease and title, a building and compliance inspection report from an inspection within the previous three months, a pest inspection report if the home has been occupied, the energy efficiency rating statement, and the lease conveyancing enquiry documents. Failing to have them is an offence, and the buyer may rescind. Section 18 then requires the buyer to reimburse you for the cost of the building and pest reports, so your net cost is the EER and the conveyancing enquiries. Section 22 requires the EER to appear in every advertisement.",
        ],
      },
      {
        heading: "Crown leasehold and the lease conveyancing enquiries",
        body: [
          "All Canberra land is held on a Crown lease, and the required documents include the lease conveyancing enquiry documents from the ACT Government about the lease, rates and any building approvals. Your solicitor orders these; the Act requires a solicitor or the seller themselves to prepare the contract, and most sellers use a lawyer rather than a conveyancer. Professional fees sit in the $800 to $2,500 range, with the enquiries and reports on top.",
        ],
      },
      {
        heading: "Auctions are common",
        body: [
          "Canberra sells a high share of houses at auction. The auctioneer is typically $400 to $1,200 where not included in the agent's fee, and the buyer's five-business-day cooling-off period does not apply to a sale at auction. The exchange typically happens on the day and the reports you already hold are what allow buyers to bid unconditionally.",
        ],
      },
      {
        heading: "Agency agreements",
        body: [
          "Under the Agents Act 2003 an agent is entitled to commission only under a written agency agreement that states the commission and expenses. There is no statutory maximum term or seller cooling-off period. Access Canberra takes complaints.",
        ],
      },
      {
        heading: "Tax",
        body: [
          "Conveyance duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not, and the [CGT calculator](/cgt-calculator) gives an estimate after selling costs.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in Canberra?", answer: "On an $800,000 sale, budget roughly $19,000 to $31,000 all-in: commission of $14,400 to $18,000 (1.8% to 2.25%, plus GST), marketing of $2,000 to $8,000, a solicitor at $800 to $2,500, the pre-sale reports and enquiries at $800 to $1,500 (the building and pest reports are reimbursed by the buyer at settlement), and an auctioneer and mortgage discharge fee if they apply." },
      { question: "Who pays for the building and pest report in the ACT?", answer: "The seller commissions and pays for them before advertising, as the Civil Law (Sale of Residential Property) Act 2003 requires, and section 18 requires the buyer to reimburse the cost of the building and pest reports at settlement. The energy efficiency rating is a cost the seller keeps." },
      { question: "Do I need an energy efficiency rating to sell in Canberra?", answer: "Yes. The EER statement is one of the required documents, and section 22 of the Act requires the rating to be shown in every advertisement for the property. An assessment typically costs $200 to $400." },
      { question: "What is the average real estate commission in the ACT?", answer: "Typically 1.8% to 2.25% of the sale price, with around 2.1% common. Commission is negotiable and GST of 10% usually applies on top." },
      { question: "Can I use a conveyancer instead of a solicitor in the ACT?", answer: "The ACT has no licensed conveyancer profession separate from the legal profession, so contracts are prepared by solicitors. Fees for a straightforward sale are typically $800 to $2,500 plus the lease conveyancing enquiry documents." },
    ],
    sources: [
      { label: "Civil Law (Sale of Residential Property) Act 2003 (ACT), sections 9, 18 and 22", href: "https://www.legislation.act.gov.au/a/2003-40/" },
      { label: "Agents Act 2003 (ACT)", href: "https://www.legislation.act.gov.au/a/2003-20/" },
      { label: "Access Canberra, Real estate and property", href: "https://www.accesscanberra.act.gov.au/business-and-work/real-estate-and-property" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },

  NT: {
    state: "NT",
    slug: "cost-of-selling-a-house-nt",
    capital: "Darwin",
    capitalMedian: 647_259,
    intro: [
      "The Northern Territory has the lowest capital-city prices in the country and commission in the upper-middle of the national range, typically 2.4% to 2.7%. On the Cotality Darwin median of $647,259 in August 2026, that is $15,500 to $17,500 before GST. Darwin was also the only capital where values were still rising in August 2026.",
      "Like WA and Tasmania, the Territory has no vendor statement, so the legal costs before listing are small; the buyer's four-business-day cooling-off period on a private treaty sale is the main timing rule your conveyancer will plan around.",
    ],
    differences: [
      {
        heading: "No vendor statement; the contract and title search",
        body: [
          "The NT requires no Section 32-style disclosure. Your conveyancer or lawyer prepares the contract and obtains a title search, typically $100 to $300, and for a unit the body corporate disclosure the Unit Title Schemes Act requires. The buyer arranges their own building and pest inspections and has four business days to cool off on a private treaty contract, forfeiting 0.25% of the price if they do.",
        ],
      },
      {
        heading: "Agency agreements under the Agents Licensing Act",
        body: [
          "Agents are licensed under the Agents Licensing Act 1979 and must be appointed in writing, with the commission and expenses stated, before they act; the NT Government's guidance is that the agreement should also record the agent's estimated selling price. There is no statutory maximum term or seller cooling-off period, so negotiate the length of the exclusive agreement and the marketing budget before signing. NT Consumer Affairs and the Agents Licensing Board take complaints.",
        ],
      },
      {
        heading: "Mostly private treaty, small marketing budgets",
        body: [
          "Auctions are rare in Darwin and regional NT, so the auctioneer line seldom applies, and marketing budgets typically sit at the lower end of the $2,000 to $8,000 range. Conveyancing is handled by lawyers and conveyancers at fees in the national $800 to $2,500 range.",
        ],
      },
      {
        heading: "Tax",
        body: [
          "Stamp duty is the buyer's cost. Your main residence is normally exempt from capital gains tax; an investment is not, and the [CGT calculator](/cgt-calculator) gives an estimate after selling costs. The Territory has no land tax.",
          FRCGW_PARA,
        ],
      },
    ],
    faqs: [
      { question: "How much does it cost to sell a house in the Northern Territory?", answer: "On an $800,000 sale, budget roughly $22,000 to $33,000 all-in: commission of $19,200 to $21,600 (2.4% to 2.7%, plus GST), marketing of $2,000 to $8,000, conveyancing of $800 to $2,500, contract and title search of $100 to $300, and a mortgage discharge fee if there is a loan. On the Darwin median of about $650,000, commission alone is $15,500 to $17,500." },
      { question: "Is there a vendor statement in the NT?", answer: "No. The Territory has no Section 32 or Form 1 equivalent. Your conveyancer prepares the contract and a title search, and the buyer does their own due diligence within the four-business-day cooling-off period." },
      { question: "What is the average real estate commission in the NT?", answer: "Typically 2.4% to 2.7% of the sale price, with around 2.5% common. Commission is negotiable and GST of 10% usually applies on top." },
      { question: "Does the NT have land tax?", answer: "No. The Northern Territory is the only jurisdiction without land tax, so there is no land tax adjustment at settlement for an investment property. Capital gains tax is federal and still applies to an investment." },
      { question: "Who pays stamp duty in the Northern Territory?", answer: "The buyer. The seller pays no duty on the sale." },
    ],
    sources: [
      { label: "Agents Licensing Act 1979 (NT)", href: "https://legislation.nt.gov.au/en/Legislation/AGENTS-LICENSING-ACT-1979" },
      { label: "NT Government, Dealing with a real estate agent, and Buying and selling a home", href: "https://nt.gov.au/property/buying-and-selling-a-home/ways-to-buy-or-sell-a-home/dealing-with-a-real-estate-agent" },
      COTALITY, ATO_FRCGW, ATO_CGT, YPG_NOTE,
    ],
  },
};

export const COST_OF_SELLING_STATES: StateCode[] = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
