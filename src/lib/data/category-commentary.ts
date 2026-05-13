// Category-level explainer shown above the data table on the
// /best-suburbs/[category] and /best-suburbs/[category]/[state] pages.
// Each entry frames what the ranking represents and how to use it.

import type { RankingCategory } from "@/lib/services/suburb-rankings-service";

export interface CategoryCommentary {
  intro: string;
  methodology: string;
  bestFor: string;
  /** State-specific FAQ entries, keyed by state code, fall back to default */
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_COMMENTARY: Record<RankingCategory, CategoryCommentary> = {
  "for-families": {
    intro:
      "Family-friendly suburbs balance four things: schools you'd actually send your kids to, parks and bike paths that get used, walkable neighbourhood retail, and a price point that doesn't lock you out of upgrading rooms when the family grows. We rank by the strongest measurable proxy (school ICSEA) and weight by the share of households that are families with dependents.",
    methodology:
      "Suburbs are scored on average ICSEA across primary and secondary schools (sourced from ACARA), filtered to suburbs where families with dependents make up at least 40% of households (ABS Census 2021). Population-weighted to avoid outliers from very small localities.",
    bestFor:
      "First home buyers planning to start a family in the next 5 years; existing families upsizing into a longer-term home; relocating families researching new areas.",
    faqs: [
      {
        question: "What is ICSEA and why does it matter?",
        answer:
          "ICSEA (Index of Community Socio-Educational Advantage) is ACARA's measure of the educational backgrounds of students at a school, used as a proxy for school resourcing and outcomes. Higher ICSEA generally correlates with stronger NAPLAN performance and higher senior-year retention. We use it because it's published consistently across all Australian schools, but it's not a direct quality measure, so always verify with site visits and NAPLAN data.",
      },
      {
        question: "Why don't you rank by NAPLAN scores directly?",
        answer:
          "NAPLAN scores are published by My School (ACARA) but reproducing them in rankings is restricted. ICSEA is the next-best public proxy and correlates strongly with NAPLAN outcomes for like-for-like school cohorts.",
      },
      {
        question: "How do school catchments affect this ranking?",
        answer:
          "We rank suburbs by the average ICSEA of schools located in or directly serving the suburb. Catchment boundaries cut through suburbs, so two houses on the same street can fall into different catchments. Always verify the in-catchment school for the specific address before making an offer.",
      },
    ],
  },
  "highest-growth": {
    intro:
      "Capital growth is the long-term wealth driver in property, and the gap between top-quartile and bottom-quartile suburbs is enormous. A suburb growing at 8% annually doubles in 9 years; one at 3% takes 24. We rank by 12-month annual house-price growth, with the caveat that recent growth doesn't perfectly predict the next decade.",
    methodology:
      "Annual growth is sourced from state Valuer-General data and cross-checked against ABS quarterly indicators. We require a non-zero medianHousePrice and exclude suburbs with too few sales for a meaningful median (typically under 12 sales over the period).",
    bestFor:
      "Investors focused on capital appreciation; buyers willing to enter outer suburbs with strong fundamentals; buyers researching where the next wave of growth corridors might be.",
    faqs: [
      {
        question: "Does last year's growth predict next year's?",
        answer:
          "Weakly. Top-performing suburbs over rolling 12-month windows tend to revert toward state averages over 5-10 year horizons. The more durable predictors are population growth, infrastructure investment, supply constraint, and yield, not headline growth in the previous year. Use this ranking as a starting point, not a verdict.",
      },
      {
        question: "Why are some growth numbers so high?",
        answer:
          "Outer-suburb and growth-corridor markets can show 15%+ annual growth when an under-supplied catchment meets a wave of buyer demand (e.g. Olympic infrastructure, a new train line, or a school catchment opening). These periods can persist for 2-3 years before normalising.",
      },
      {
        question: "How do I tell sustainable growth from a bubble?",
        answer:
          "Look at supporting fundamentals: rising population, declining vacancy rates, infrastructure investment, and yields that aren't compressing too aggressively. If growth is happening but yield is staying constant or rising, supply is genuinely constrained. If yield is collapsing as prices rise, you're often looking at speculative inflows.",
      },
    ],
  },
  "most-affordable": {
    intro:
      "'Most affordable' here means lowest median house price, the entry-level suburbs in each state. Affordability isn't the same as good value: a $400K outer-fringe suburb with stagnant population growth and weak infrastructure can be a worse buy than a $700K middle-ring suburb with structural demand. Use this list as a starting point for further research, not a final shortlist.",
    methodology:
      "Sorted by median house price ascending, with a $100K minimum to exclude very small localities and data anomalies. State Valuer-General data, refreshed quarterly.",
    bestFor:
      "First home buyers prioritising entry into the property market; rentvestors looking for high-yield, lower-entry investments; buyers willing to commute further for a freestanding house.",
    faqs: [
      {
        question: "Are the cheapest suburbs always the worst suburbs?",
        answer:
          "No. Affordability often reflects distance from CBD, sparse public transport, or limited amenity rather than 'bad' attributes. Plenty of affordable suburbs are growing strongly because the local economy and demographics are improving. Always look at population trend, infrastructure pipeline, and rental vacancy alongside price.",
      },
      {
        question: "Should I buy the cheapest house I can or save for longer?",
        answer:
          "Depends on your timeline. If you'll hold for 10+ years, time-in-market usually beats waiting for a bigger deposit on a 'better' suburb. If you'll move within 3-5 years, transaction costs (stamp duty + agent fees) on the entry purchase can wipe out modest growth.",
      },
      {
        question: "What about regional vs outer-metro for affordability?",
        answer:
          "Outer-metro typically holds value better because it's still tied to the capital city economy. Regional towns can offer better entry pricing but add commute risk if you need to fall back on metro employment. Strong regional centres (Newcastle, Geelong, Toowoomba) split the difference well.",
      },
    ],
  },
  "most-walkable": {
    intro:
      "Walkability isn't just about cafes, well-connected suburbs with high walk scores tend to retain value better in downturns and attract a wider buyer pool when sold. The walk-score-driven ranking favours inner-ring suburbs with mixed-use streets, transport, and dense neighbourhood retail.",
    methodology:
      "Walk score is computed from OpenStreetMap data, counts of nearby amenities, transit stops, and pedestrian-friendly infrastructure within typical walking distance of the suburb centroid. Refreshed quarterly. Higher is better; 90+ is exceptional.",
    bestFor:
      "Apartment buyers; downsizers who want to walk to local shops; renters of investment properties (walkability is a tenant-demand multiplier); car-free or one-car households.",
    faqs: [
      {
        question: "Are walkable suburbs always more expensive?",
        answer:
          "Generally yes, walkability is priced into median values, particularly for apartments and townhouses. The exception is some emerging inner-ring suburbs whose walkability has improved through new transit infrastructure but where prices haven't caught up yet.",
      },
      {
        question: "Does walkability drive rental yield?",
        answer:
          "It drives rental demand and vacancy rates more than absolute yield. Highly walkable suburbs typically have lower vacancy and shorter days-on-market when re-letting, both reduce the effective vacancy cost on a rental investment.",
      },
      {
        question: "How does walkability differ from transit score?",
        answer:
          "Walk score measures access to amenities on foot. Transit score measures public transport access. The two correlate but aren't identical, some apartment-heavy suburbs have moderate walk scores but exceptional transit, and vice versa.",
      },
    ],
  },
  "lowest-flood-risk": {
    intro:
      "Flood risk affects insurance premiums, resale value, and (increasingly) lending policy. Some big-four lenders now decline mortgages on properties in declared floodways. We rank by formal flood hazard classification from Geoscience Australia and state hazard mapping authorities.",
    methodology:
      "Suburbs are tagged 'low risk' when their dominant Geoscience Australia flood hazard classification is 'low', or when no flood hazard record exists for the suburb polygon. Suburbs in 'medium', 'high', or 'floodway' classifications are excluded from this ranking.",
    bestFor:
      "Risk-averse buyers; buyers planning to insure with one of the bigger insurers; investors concerned about lender policy on flood-affected stock; long-term owner-occupiers wanting peace of mind.",
    faqs: [
      {
        question: "Does 'low flood risk' mean a property won't flood?",
        answer:
          "No, 'low risk' is a probabilistic classification, not a guarantee. Properties in low-risk zones can still flood in extreme events (1-in-500 year, freak storms). What 'low risk' does mean is that mainstream lenders and insurers will treat the property as standard rather than carrying a special premium or exclusion.",
      },
      {
        question: "What's a 'floodway' versus a flood-prone zone?",
        answer:
          "A floodway is land that channels water during a flood event, building in a floodway is highly restricted because the water flow itself is dangerous, not just the standing water. A flood-prone zone is land that's expected to be inundated but not part of the active flow. Floodways are the highest-risk classification and many lenders will decline mortgages on stock in them.",
      },
      {
        question: "How localised is flood risk?",
        answer:
          "Extremely localised. Two adjacent streets can be in completely different risk categories depending on elevation and creek proximity. Always pull the address-specific flood report from the council before bidding, even on suburbs that appear in this ranking.",
      },
    ],
  },
  "best-rental-yield": {
    intro:
      "Gross rental yield is rent income as a percentage of property value, the headline cashflow metric for an investment property. Higher yield generally means stronger near-term cashflow but often correlates with lower capital growth, so this ranking is a starting point for cashflow-focused investors rather than long-term wealth-building.",
    methodology:
      "Gross yield = (median weekly rent × 52) ÷ median house price × 100. Sourced from REIA quarterly indicators and state Valuer-General data. Excluded suburbs with insufficient rental data or median prices below the credible threshold.",
    bestFor:
      "Cashflow-focused investors; rentvestors seeking properties that fund their own holding costs; SMSF investors where positive cashflow matters more than capital appreciation.",
    faqs: [
      {
        question: "What's a 'good' rental yield in Australia in 2026?",
        answer:
          "Capital city houses typically yield 2.5% to 4%, units 4% to 5.5%. Regional houses can yield 5% to 7%+. The 'good' threshold depends on holding costs (council rates, body corporate, insurance, management fees). Net yield after these costs is usually 1% to 1.5% lower than gross.",
      },
      {
        question: "Does high yield always mean weak growth?",
        answer:
          "Not always but often. High-yield markets typically have lower price-to-rent ratios because growth expectations are lower. The exceptions are markets in early growth cycles (yield is high because prices haven't run yet) and structurally constrained regional centres (yield is high because supply is tight even with modest population).",
      },
      {
        question: "How do I calculate net yield?",
        answer:
          "Take gross rent, subtract council rates, body corporate, insurance, property management fees (8-12%), maintenance allowance (1-1.5% of property value), and assumed vacancy (2-4 weeks per year). The remainder divided by property value is net yield. Most properties show net yield 1-1.5 percentage points below gross.",
      },
    ],
  },
};
