// User personas. The site branches on identity, not on a buyer-journey stage.
// Selling is a first-class persona alongside the three buyer-side personas.
// Each persona's hub surfaces the data, guides and tools relevant to that
// persona's actual questions. Lead-capture is incidental, not primary; the
// brand promise is education first.

export type PersonaId =
  | "first-home"
  | "selling"
  | "upgrading"
  | "investing"
  | "renovating";

export interface Persona {
  id: PersonaId;
  order: number;
  // When false, the persona is reachable by URL and listed in the "other
  // personas" footer on hub pages, but is excluded from the homepage picker.
  // Use for hubs we're growing into (e.g. a content cluster being seeded
  // before its picker card earns top-billing).
  featuredOnHomepage: boolean;
  cardLabel: string;     // What the homepage card says
  cardBlurb: string;     // One-liner under the card label
  hubPath: string;       // Where the persona card routes
  hubHeading: string;    // Hub-page H1
  hubLede: string;       // Hub-page subhead
  illustration: string;  // Path under /public, served from our own hosting
  // The three things the hub surfaces in order. Each is a label + href to
  // existing routes. We DO NOT promise content that doesn't exist; we point
  // at real pages we already have. Optional icon path under /public/images/icons.
  startingPoints: ReadonlyArray<{ label: string; href: string; description: string; icon?: string }>;
}

export const PERSONAS: readonly Persona[] = [
  {
    id: "first-home",
    order: 1,
    featuredOnHomepage: true,
    cardLabel: "Buying my first home",
    cardBlurb: "Schemes by state, deposit basics, and the questions you weren't sure you were allowed to ask.",
    hubPath: "/first-home-buyers",
    hubHeading: "First home buyers",
    hubLede: "Everything we'd want a first-home buyer in our family to know before they signed anything. Free, ungated, and written so it actually answers the question.",
    illustration: "/images/illustrations/first-home.svg",
    startingPoints: [
      { label: "Borrowing power calculator", href: "/borrowing-power-calculator", description: "Two minutes, no credit check, honest numbers.", icon: "/images/icons/calculator.svg" },
      { label: "Stamp duty by state", href: "/stamp-duty-calculator", description: "What you'll actually pay (concessions included).", icon: "/images/icons/median.svg" },
      { label: "First home buyer guides", href: "/guides", description: "State-by-state schemes, LMI, FHSS and more.", icon: "/images/icons/guide.svg" },
    ],
  },
  {
    id: "selling",
    order: 2,
    featuredOnHomepage: true,
    cardLabel: "Selling my home",
    cardBlurb: "What your home is worth, how to pick an agent, and how the auction process actually works.",
    hubPath: "/selling",
    hubHeading: "Selling your home",
    hubLede: "What goes into a real appraisal, how agent fees work, and what to ask before you sign a listing agreement. Plain-English, no nonsense.",
    illustration: "/images/illustrations/selling.svg",
    startingPoints: [
      { label: "How to choose a selling agent", href: "/guides/how-to-choose-a-selling-agent", description: "The interview process, the appraisal-price trap, and what to negotiate in the listing agreement.", icon: "/images/icons/broker.svg" },
      { label: "Free property appraisal", href: "/appraisal", description: "An honest appraisal from a vetted local agent. No commitment.", icon: "/images/icons/median.svg" },
      { label: "Real estate agent fees explained", href: "/guides/real-estate-agent-fees-australia", description: "What commissions and marketing look like across Australia.", icon: "/images/icons/calculator.svg" },
    ],
  },
  {
    id: "upgrading",
    order: 3,
    featuredOnHomepage: true,
    cardLabel: "Upgrading or downsizing",
    cardBlurb: "Selling and buying at the same time, the suburbs that actually fit, and how the numbers work.",
    hubPath: "/upgrading",
    hubHeading: "Upgrading or downsizing",
    hubLede: "When you're moving from one home to another, two transactions need to talk to each other. Here's the data and the playbooks.",
    illustration: "/images/illustrations/upgrading.svg",
    startingPoints: [
      { label: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first", description: "The decision tree across all three options, with worked examples.", icon: "/images/icons/guide.svg" },
      { label: "Bridging loans guide", href: "/guides/bridging-loans-guide", description: "How peak debt, end debt and capitalised interest actually work.", icon: "/images/icons/calculator.svg" },
      { label: "Free property appraisal", href: "/appraisal", description: "Know what your current home is worth, the foundation of every option.", icon: "/images/icons/median.svg" },
    ],
  },
  {
    id: "investing",
    order: 4,
    featuredOnHomepage: true,
    cardLabel: "Investing in property",
    cardBlurb: "Yield, growth, depreciation, rentvesting, and the suburbs that actually stack up.",
    hubPath: "/investing",
    hubHeading: "Property investors",
    hubLede: "Investor-grade suburb data, yield calculators and tax explainers. The same numbers a buyer's agent would run, free.",
    illustration: "/images/illustrations/investing.svg",
    startingPoints: [
      { label: "Best suburbs for investors", href: "/best-suburbs", description: "Ranked by yield, growth and demand.", icon: "/images/icons/map.svg" },
      { label: "Rental yield calculator", href: "/rental-yield-calculator", description: "Run the numbers on any property.", icon: "/images/icons/yield.svg" },
      { label: "Property depreciation guide", href: "/guides/property-depreciation-guide", description: "What you can claim, when it's worth it.", icon: "/images/icons/guide.svg" },
    ],
  },
  {
    // Renovating is a content cluster we're seeding: the keyword opportunity
    // is huge (kitchen/bathroom/extension costs, ROI, finance, builder
    // selection) and current coverage is essentially zero. Hub is live for
    // SEO + Google discovery; featuredOnHomepage stays false until the
    // cluster has 6+ pieces of supporting content.
    id: "renovating",
    order: 5,
    featuredOnHomepage: false,
    cardLabel: "Renovating my home",
    cardBlurb: "Real-world renovation costs, finance options, builder selection, and what actually adds value.",
    hubPath: "/renovating",
    hubHeading: "Renovating your home",
    hubLede: "Renovation costs in 2026, how to finance the work, how to find a builder you can trust, and which jobs actually return the money at sale. Free, ungated, plain English.",
    illustration: "/images/illustrations/guides-hero.svg",
    startingPoints: [
      { label: "Renovation cost guide 2026", href: "/guides/renovation-cost-australia-2026", description: "Kitchens, bathrooms, second storeys and full renovations. What they actually cost.", icon: "/images/icons/calculator.svg" },
      { label: "Borrowing power calculator", href: "/borrowing-power-calculator", description: "What your numbers look like before you talk to a broker about renovation finance.", icon: "/images/icons/yield.svg" },
      { label: "Browse property guides", href: "/guides", description: "Every guide we publish: buying, selling, investing, financing.", icon: "/images/icons/guide.svg" },
    ],
  },
] as const;

export const PERSONA_BY_ID: Record<PersonaId, Persona> =
  PERSONAS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as Record<PersonaId, Persona>);

export const PERSONA_STORAGE_KEY = "ypg.persona";

export function getPersonaById(id: string | null): Persona | null {
  if (!id) return null;
  return id in PERSONA_BY_ID ? PERSONA_BY_ID[id as PersonaId] : null;
}
