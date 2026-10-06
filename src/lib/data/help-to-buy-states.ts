// State-specific content for the four Help to Buy state pages
// (/guides/help-to-buy-scheme-{qld,nsw,victoria,wa}), rendered by
// src/components/guide/HelpToBuyStateGuide.tsx. Grants, new-home duty rules
// and how each state treats the government's share for duty are from the
// state revenue offices, read on 7 October 2026; the scheme's own rules and
// price caps come from src/lib/data/help-to-buy.ts. Recheck each 1 July and
// after state budgets.
import type { FaqItem, SourceItem } from "@/components/guide";
import type { AustralianState } from "@/lib/utils/stamp-duty";

export interface HtbStatePage {
  slugSuffix: string;
  name: string;
  short: string;
  firstHomeGuide: string;
  /** An existing home in the capital, for the worked example. */
  examplePrice: number;
  availableSince: string;
  intro: string;
  capsNote: string;
  exampleNote: string;
  tldrExtras: string[];
  combine: { title: string; body: string }[];
  stateSchemeNote: string;
  lenderNote: string;
  uptakeNote?: string;
  faqs: FaqItem[];
  sources: SourceItem[];
}

const READ = "read 7 October 2026";

export const HTB_STATE_PAGES: Partial<Record<AustralianState, HtbStatePage>> = {
  QLD: {
    slugSuffix: "qld",
    name: "Queensland",
    short: "QLD",
    firstHomeGuide: "/guides/first-home-buyer-qld",
    examplePrice: 750_000,
    availableSince: "It has been open in Queensland since applications opened on 5 December 2025.",
    intro:
      "Help to Buy works the same in Queensland as everywhere else, but Queensland adds more on top than most states: a $30,000 grant on new homes, no transfer duty for first home buyers on new homes, and a published ruling that you get the duty concessions on the full price even though the government owns part of the home.",
    capsNote:
      "The $1,000,000 cap covers Brisbane, the Gold Coast and the Sunshine Coast. Everywhere else in Queensland, including Townsville, Cairns and Toowoomba, the cap is $700,000.",
    exampleNote:
      "Queensland's first home concession on an established home means no duty up to $700,000 and reduced duty below $800,000, worked out on the full price under the Queensland Revenue Office's Help to Buy ruling. On a new home there would be no transfer duty at all.",
    tldrExtras: [
      "You can add Queensland's $30,000 First Home Owner Grant on a new home under $750,000, and first home buyers pay no transfer duty on new homes.",
    ],
    combine: [
      {
        title: "First Home Owner Grant",
        body: "$30,000 for a new home valued under $750,000 including the land, for contracts signed from 20 November 2023. The 2026–27 Queensland Budget kept the $30,000 for contracts from 1 July 2026, and the Queensland Revenue Office lists no end date.",
      },
      {
        title: "No transfer duty on new homes",
        body: "First home buyers pay no transfer duty on a new home, or on vacant residential land, for contracts from 1 May 2025, with no value cap. You can claim the grant and one first home concession together.",
      },
      {
        title: "How Queensland treats the government's share",
        body: "Public Ruling GEN013.1 treats the Commonwealth's interest as no interest for duty, so you get the concessions as if you bought the whole home, duty is assessed on the full value, and buying the share back later attracts no duty. Housing Australia's interest also doesn't stop a grant claim.",
      },
      {
        title: "Citizenship",
        body: "From 1 August 2026 Queensland's home concessions require Australian citizens, permanent residents or specified retirees. Help to Buy already requires citizenship.",
      },
    ],
    stateSchemeNote:
      "Boost to Buy has higher income limits than Help to Buy, but its current round has regional places only. If you're buying in South East Queensland, Help to Buy is the shared equity option. You can't use both.",
    lenderNote: "Queensland Country Bank joined the scheme on 6 October 2026, through its branches and brokers.",
    faqs: [
      {
        question: "Can I get the $30,000 grant with Help to Buy?",
        answer:
          "Yes, on a new home valued under $750,000 including the land. Help to Buy can be combined with a first home owner grant, and the Queensland Revenue Office's ruling says Housing Australia's interest doesn't stop a grant claim. You can also pay no transfer duty on the new home.",
      },
      {
        question: "Do I pay stamp duty on the government's share in Queensland?",
        answer:
          "Duty is worked out on the full value, and the first home concessions apply as if you bought the whole home, under Public Ruling GEN013.1. Buying the government's share back later attracts no duty.",
      },
    ],
    sources: [
      { label: "Queensland Revenue Office: First Home Owner Grant eligibility", href: "https://qro.qld.gov.au/property-concessions-grants/first-home-grant/eligibility/", note: READ },
      { label: "Queensland Revenue Office: 2026–27 State Budget", href: "https://qro.qld.gov.au/2026/06/state-budget-2026/", note: "23 June 2026" },
      { label: "Queensland Revenue Office: First home new home concession", href: "https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/first-home-new-home/", note: READ },
      { label: "Queensland Revenue Office: First home concession", href: "https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/first-home/", note: READ },
      { label: "Queensland Revenue Office: Public Ruling GEN013.1", href: "https://qro.qld.gov.au/resource/gen013/", note: "issued 12 June 2026" },
    ],
  },
  NSW: {
    slugSuffix: "nsw",
    name: "New South Wales",
    short: "NSW",
    firstHomeGuide: "/guides/first-home-buyer-nsw",
    examplePrice: 900_000,
    availableSince: "It has been open in NSW since applications opened on 5 December 2025.",
    intro:
      "NSW has the highest Help to Buy price cap in the country, $1.3 million in Sydney and six regional centres, and its own shared equity scheme has closed, so Help to Buy is now the only shared equity option in the state. You can add the First Home Buyers Assistance Scheme and, on a new home, the First Home Owner Grant.",
    capsNote:
      "The $1,300,000 cap covers Sydney plus Newcastle and Lake Macquarie, the Illawarra, the Central Coast, the Mid-North Coast, Coffs Harbour–Grafton and Richmond–Tweed. Everywhere else in NSW the cap is $800,000.",
    exampleNote:
      "The duty line uses the First Home Buyers Assistance Scheme: no duty up to $800,000, then a reduced rate below $1 million. Revenue NSW hasn't published how duty applies when the government holds a share; we've used the full price, as Victoria, Queensland and Western Australia do.",
    tldrExtras: [
      "You can add the $10,000 First Home Owner Grant on a new home up to $600,000, and pay no stamp duty up to $800,000 under the First Home Buyers Assistance Scheme.",
    ],
    combine: [
      {
        title: "First Home Owner Grant",
        body: "$10,000 for a new home bought for up to $600,000, or land plus a building contract up to $750,000. Revenue NSW says the grant may be paid on top of other exemptions or concessions.",
      },
      {
        title: "First Home Buyers Assistance Scheme",
        body: "No transfer duty up to $800,000 and a reduced rate below $1 million, on new or existing homes, for contracts from 1 July 2023. Off the plan, first home buyers can also defer the duty until settlement or 12 months after the contract, whichever comes first.",
      },
      {
        title: "How NSW treats the government's share",
        body: "Not published. Revenue NSW has no Help to Buy guidance on its grant or duty pages; ask your conveyancer how the duty will be assessed.",
      },
    ],
    stateSchemeNote: "Help to Buy is now the shared equity option in NSW.",
    lenderNote: "",
    faqs: [
      {
        question: "Can I use the First Home Buyers Assistance Scheme with Help to Buy?",
        answer:
          "Help to Buy allows stamp duty concessions, and the scheme gives first home buyers no duty up to $800,000 and a reduced rate below $1 million. Revenue NSW hasn't published Help to Buy-specific guidance, so confirm the assessment with your conveyancer.",
      },
    ],
    sources: [
      { label: "Revenue NSW: First Home Owner (New Homes) Grant", href: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-owner-new-homes-grant", note: READ },
      { label: "Revenue NSW: First Home Buyers Assistance Scheme", href: "https://www.revenue.nsw.gov.au/grants-schemes/assistance-scheme", note: READ },
      { label: "Revenue NSW: Off-the-plan purchase contracts", href: "https://www.revenue.nsw.gov.au/property-professionals-resource-centre/guides-rulings-cpns/topics/first-home-buyers-assistance-scheme-guide/off-the-plan-purchase-contracts", note: READ },
    ],
  },
  VIC: {
    slugSuffix: "victoria",
    name: "Victoria",
    short: "VIC",
    firstHomeGuide: "/guides/first-home-buyer-vic",
    examplePrice: 700_000,
    availableSince: "It has been open in Victoria since applications opened on 5 December 2025, and Housing Australia reports the strongest demand there of any state.",
    intro:
      "The Victorian Homebuyer Fund closed in September 2025, so Help to Buy is now Victoria's shared equity scheme. Victorian law treats the government's share as invisible for stamp duty, so the first home buyer exemption applies on the full price, and you can add the $10,000 grant on a new home.",
    capsNote:
      "The $950,000 cap covers Melbourne and Geelong. Everywhere else in Victoria, including Ballarat and Bendigo, the cap is $650,000.",
    exampleNote:
      "Victoria's first home buyer exemption means no duty up to $600,000 and reduced duty to $750,000. Under the Duties Act, duty is assessed as if you bought the whole home, ignoring the government's share, and buying the share back later attracts no duty.",
    tldrExtras: [
      "You can add the $10,000 First Home Owner Grant on a new home up to $750,000, and first home buyers pay no stamp duty up to $600,000.",
    ],
    combine: [
      {
        title: "First Home Owner Grant",
        body: "$10,000 for a new home up to $750,000, for contracts from 1 July 2013. The $20,000 regional grant ended on 30 June 2021.",
      },
      {
        title: "First home buyer duty exemption",
        body: "No duty up to $600,000 and reduced duty to $750,000, on new or established homes and vacant land, for contracts from 1 July 2017.",
      },
      {
        title: "Off-the-plan concessions",
        body: "Construction costs after the contract are deducted from the value for duty, and first home buyers qualify if the reduced value is $750,000 or less; this can be combined with the exemption and the grant. A temporary concession for strata apartments, units and townhouses, open to all buyers with no cap, runs for contracts to 20 April 2027.",
      },
      {
        title: "How Victoria treats the government's share",
        body: "Section 3IA of the Duties Act assesses duty, and any exemption or concession, ignoring the share held by the Commonwealth or Housing Australia, and section 55B means buying it back attracts no duty.",
      },
    ],
    stateSchemeNote:
      "If you were looking at the Victorian Homebuyer Fund, Help to Buy is the scheme that replaced it as Victoria's shared equity option.",
    lenderNote: "",
    faqs: [
      {
        question: "Do I pay stamp duty on the government's share in Victoria?",
        answer:
          "Duty is assessed as if you bought the whole home, ignoring the government's share, so the first home buyer exemption (no duty up to $600,000) applies to the full price. Buying the share back later attracts no duty.",
      },
    ],
    sources: [
      { label: "State Revenue Office Victoria: Understanding the First Home Owner Grant", href: "https://www.sro.vic.gov.au/buying-property/first-home-owner-grant/understanding-first-home-owner-grant", note: READ },
      { label: "State Revenue Office Victoria: First Home Owner Grant historical rates", href: "https://www.sro.vic.gov.au/about-us/rates-and-statistics/historical-rates/first-home-owner-grant-historical-rates", note: READ },
      { label: "State Revenue Office Victoria: First home buyer duty exemption or concession", href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/first-home-buyers/first-home-buyer-duty-exemption-or-concession", note: READ },
      { label: "State Revenue Office Victoria: Off-the-plan duty concession", href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/plan-duty-concession-0/understanding-plan-duty-concession", note: READ },
      { label: "State Revenue Office Victoria: Strata apartments and townhouses temporary concession", href: "https://www.sro.vic.gov.au/buying-property/land-transfer-stamp-duty/concessions-exemptions-and-waivers/plan-duty-concession-0/strata-apartments-and-townhouses-temporary-concession", note: READ },
      { label: "Help to Buy (Commonwealth Powers) Act 2025 (Vic), ss 12–16", href: "https://content.legislation.vic.gov.au/sites/default/files/2025-04/25-010aa-authorised.pdf" },
    ],
  },
  WA: {
    slugSuffix: "wa",
    name: "Western Australia",
    short: "WA",
    firstHomeGuide: "/guides/first-home-buyer-wa",
    examplePrice: 650_000,
    availableSince: "It has been open in Western Australia since 22 December 2025, after the state passed its own law.",
    intro:
      "Help to Buy reached Western Australia a few weeks after the other states, and RevenueWA has spelt out how it works with WA's own help: the government's share is ignored for duty, the grant and land tax. WA buyers can also choose Keystart's shared ownership loans, but not both.",
    capsNote:
      "The $850,000 cap covers Perth. Everywhere else in Western Australia the cap is $600,000; WA has no regional centres on the higher cap.",
    exampleNote:
      "WA's first home owner rate means no duty up to $600,000 and a concessional rate to $800,000, from 7 May 2026. RevenueWA charges duty on the total value regardless of Housing Australia's share, assesses the concession as if you bought alone, and charges no duty when you buy the share back.",
    tldrExtras: [
      "You can add the $10,000 First Home Owner Grant on a new home (cap $800,000 in Perth and the south of the state), and first home buyers pay no duty up to $600,000.",
    ],
    combine: [
      {
        title: "First Home Owner Grant",
        body: "$10,000 for a new or substantially renovated home. From 7 May 2026 the value cap is $800,000 south of the 26th parallel, which includes Perth, and $1,000,000 north of it.",
      },
      {
        title: "First home owner duty rate",
        body: "From 7 May 2026, no duty up to $600,000 and a concessional rate up to $800,000, on new or established homes. The duty concession no longer depends on the grant cap.",
      },
      {
        title: "Off-the-plan concession",
        body: "For contracts from 12 March 2026 to 30 June 2028, all buyers get up to 100% off the duty on an off-the-plan home up to $800,000 (75% once construction has started), tapering above that and capped at $50,000.",
      },
      {
        title: "How WA treats the government's share",
        body: "RevenueWA ignores Housing Australia's contribution for duty, the grant and land tax: duty is charged on the full value, the concession is assessed as if you bought alone, the grant isn't affected, and buying the share back attracts no duty.",
      },
    ],
    stateSchemeNote:
      "Keystart's Urban Connect is for new apartments and townhouses, while Help to Buy also covers houses. Compare both on your numbers; you can only use one.",
    lenderNote: "",
    faqs: [
      {
        question: "Do I pay stamp duty on the government's share in WA?",
        answer:
          "RevenueWA charges duty on the full value regardless of Housing Australia's share, and assesses the first home owner rate as if you bought the home alone. Buying the share back later attracts no duty, and your First Home Owner Grant isn't affected.",
      },
    ],
    sources: [
      { label: "WA Government: About the First Home Owner Grant", href: "https://www.wa.gov.au/government/publications/about-the-first-home-owner-grant", note: READ },
      { label: "WA Government: Duties fact sheet, first home owner rate", href: "https://www.wa.gov.au/government/publications/duties-fact-sheet-first-home-owner-rate", note: READ },
      { label: "WA Government: Apply for the off-the-plan duty concession", href: "https://www.wa.gov.au/service/financial-management/taxation-and-duty/apply-the-plan-duty-concession", note: READ },
      { label: "RevenueWA: Help to Buy scheme", href: "https://www.wa.gov.au/organisation/department-of-treasury-and-finance/help-buy-scheme-revenuewa", note: "updated 19 December 2025" },
    ],
  },
};
