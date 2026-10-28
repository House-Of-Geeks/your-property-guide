// Every tool on the site, grouped by what the reader is doing (moved out of
// the /tools page on 15 Oct 2026). The /tools hub renders the groups; the
// homepage counts the tools from here, so the "guides and tools" figure is
// never typed by hand.

export interface Tool {
  href: string;
  title: string;
  description: string;
  /** A reference page (rankings, data, a glossary) rather than a tool that answers your own numbers. */
  kind?: "reference";
}

export interface ToolGroup {
  id: string;
  label: string;
  blurb: string;
  /** The free guide that fits the group, offered beside its heading. */
  guide?: { href: string; label: string };
  tools: Tool[];
}

// Calculators first, grouped by what the reader is doing (we are a guide,
// not a data tool); the suburb tools and the data library follow.
export const TOOL_GROUPS: readonly ToolGroup[] = [
  {
    id: "selling",
    label: "Selling",
    blurb: "What selling will cost, what you'll keep, and what homes like yours sell for.",
    guide: { href: "/selling-guide?from=tools", label: "Get the free selling guide" },
    tools: [
      {
        href: "/real-estate-commission-calculator",
        title: "Real Estate Commission Calculator",
        description: "What an agent will cost on your sale price, with typical rates by state.",
      },
      {
        href: "/selling-costs-calculator",
        title: "Selling Costs Calculator",
        description: "Commission, marketing and legal costs on your sale, and your net proceeds.",
      },
      {
        href: "/tools/agent-proposal-worksheet",
        title: "Agent Proposal Worksheet",
        description:
          "Compare two or three agents' proposals side by side: each one's total cost at the same price, what you'd keep, and what to ask.",
      },
      {
        href: "/property-valuation",
        title: "Property Valuation Range",
        description:
          "Pick a suburb and a dwelling type for the published median and a range either side, then a free agent appraisal.",
      },
      {
        href: "/bridging-loan-calculator",
        title: "Bridging Loan Calculator",
        description:
          "Buying before you sell: peak debt and its LVR, interest added while you sell, end debt and the cost against selling first.",
      },
    ],
  },
  {
    id: "buying",
    label: "Buying and home loans",
    blurb: "What you can borrow, what it costs to buy, and the schemes that cut the cost.",
    guide: { href: "/buying-guide?from=tools", label: "Get the free buying guide" },
    tools: [
      {
        href: "/borrowing-power-calculator",
        title: "Borrowing Power Calculator",
        description:
          "What lenders will let you borrow, based on income, expenses, and existing debts.",
      },
      {
        href: "/stamp-duty-calculator",
        title: "Stamp Duty Calculator",
        description:
          "Estimate stamp duty for your state, including first home buyer and foreign buyer rules.",
      },
      {
        href: "/mortgage-calculator",
        title: "Mortgage Calculator",
        description:
          "Monthly repayments, total interest, and amortisation over the loan term.",
      },
      {
        href: "/affordability-calculator",
        title: "Affordability Calculator",
        description:
          "What property price you can comfortably afford, factoring in deposit and ongoing costs.",
      },
      {
        href: "/lmi-calculator",
        title: "LMI Calculator",
        description:
          "Lenders mortgage insurance on a deposit under 20%, with your state's stamp duty on the premium.",
      },
      {
        href: "/help-to-buy-calculator",
        title: "Help to Buy Calculator",
        description:
          "Check the Help to Buy income limit and your state's price cap, the government's share, your repayments, and the 5% Deposit Scheme alternative.",
      },
      {
        href: "/fhss-calculator",
        title: "FHSS Calculator",
        description:
          "What the First Home Super Saver scheme adds to your deposit: the release, the deemed earnings, the tax, and the same money saved in a bank.",
      },
      {
        href: "/refinancing-calculator",
        title: "Refinancing Calculator",
        description:
          "Break-even point on switching home loans, after exit and entry fees.",
      },
    ],
  },
  {
    id: "investing",
    label: "Investing",
    blurb: "Yield, the after-tax holding cost, and the tax on a sale.",
    tools: [
      {
        href: "/rental-yield-calculator",
        title: "Rental Yield Calculator",
        description:
          "Gross and net yield on a candidate investment property, with management fee inputs.",
      },
      {
        href: "/negative-gearing-calculator",
        title: "Negative Gearing Calculator",
        description:
          "Rental loss, tax saving at the 2026–27 rates, and your weekly cost after tax.",
      },
      {
        href: "/property-management-fees-calculator",
        title: "Property Management Fees Calculator",
        description:
          "The annual cost of managing a rental in your state, from the management percentage to the letting and extra fees.",
      },
      {
        href: "/cgt-calculator",
        title: "Capital Gains Tax Calculator",
        description:
          "Estimate CGT on a property sale, including the 50% discount where it applies.",
      },
    ],
  },
  {
    id: "suburbs",
    label: "Suburbs and research",
    blurb: "Find and compare suburbs, and the data library behind the guides.",
    tools: [
      {
        href: "/find-your-suburb",
        title: "Find Your Suburb",
        description:
          "30-second match quiz that scores six suburbs against your budget, priorities, and stage.",
      },
      {
        href: "/compare",
        title: "Compare Suburbs",
        description:
          "Pick any two Australian suburbs and line them up side by side, median to walkability to risk.",
      },
      {
        href: "/best-suburbs",
        kind: "reference",
        title: "Best Suburbs Rankings",
        description:
          "Six ranked lists across schools, growth, affordability, walkability, hazards, and rental yield.",
      },
      {
        href: "/suburbs",
        kind: "reference",
        title: "Suburb Profiles",
        description:
          "Demographics, growth trends, schools, walkability, hazard data for every Australian suburb.",
      },
      {
        href: "/price-guide",
        kind: "reference",
        title: "Price Guide",
        description:
          "Compare median house and unit prices across every Australian suburb.",
      },
      {
        href: "/market-reports",
        kind: "reference",
        title: "Market Reports",
        description:
          "State-by-state property market reports, updated quarterly.",
      },
      {
        href: "/rba-cash-rate",
        kind: "reference",
        title: "RBA Cash Rate",
        description:
          "History of every RBA decision and how rates affect property prices.",
      },
      {
        href: "/schools",
        kind: "reference",
        title: "Schools",
        description:
          "Search 9,600+ Australian schools with catchments and ICSEA scores.",
      },
      {
        href: "/glossary",
        kind: "reference",
        title: "Property Glossary",
        description:
          "Plain-English definitions for every term you'll meet buying or selling.",
      },
    ],
  },
];

/** The tools that work out an answer from your own numbers or choices (calculators, worksheets, the suburb quiz and comparison). */
export const TOOLS: readonly Tool[] = TOOL_GROUPS.flatMap((g) => g.tools).filter((t) => t.kind !== "reference");

/** The calculators alone. */
export const CALCULATORS: readonly Tool[] = TOOLS.filter((t) => t.href.endsWith("-calculator"));
