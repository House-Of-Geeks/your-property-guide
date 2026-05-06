// State-level market context shown above the ranking tables on
// /best-suburbs/[category]/[state] pages. Written as ~250-word paragraphs
// covering each state's broader property market in 2026.
//
// One source per state — keep facts referenced and dated so the editorial
// reviewer can sanity-check them.

export interface StateCommentary {
  marketContext: string;
  buyerTip: string;
  watchOut: string;
}

export const STATE_COMMENTARY: Record<string, StateCommentary> = {
  NSW: {
    marketContext:
      "New South Wales is Australia's most expensive housing market by a wide margin. Sydney's median house price sits around $1.6M to $1.7M in 2026, with a structural undersupply of well-located stock keeping the harbour-city market firm even as borrowing capacity catches up to elevated rates. Regional NSW (Newcastle, Central Coast, Wollongong) has compressed the discount to Sydney over the last five years, and the Hunter and Illawarra now trade at premiums older buyers wouldn't have predicted. Lifestyle suburbs along the coast — Byron, Kiama, Port Macquarie — have held the COVID-era gains. Investor demand is back at scale; rental vacancies in metro Sydney remain below 1.5%.",
    buyerTip:
      "If you're buying in Sydney, the gap between asking prices and clearing prices has narrowed meaningfully. A 2024-style 'discount the asking price by 10%' approach now leaves you out of contention. Pre-approval at the top of your range plus 1-2 weekends of pre-auction reconnaissance is the modern playbook.",
    watchOut:
      "Sydney's middle-ring suburbs (Kingsford, Marrickville, Concord) have seen significant apartment supply. Body corporate fees on newer towers can swallow yield, so always pull the strata report and the sinking fund balance before committing.",
  },
  VIC: {
    marketContext:
      "Victoria spent 2024-2025 in a softer cycle than the rest of the country, but 2026 sees the Melbourne market firming again as population growth and the steady drip of overseas migration meet a constrained pipeline of new family-suitable stock. Melbourne's median house price sits around $1.0M to $1.1M, roughly 35-40% below Sydney for an equivalent property — meaningful for first home buyers and rentvestors. Regional Victoria has been mixed: Geelong has held its COVID gains, Ballarat and Bendigo are flat-to-down. The state's planning reforms ('Plan for Victoria') are starting to push approvals up in middle-ring suburbs, which will eventually moderate growth in those pockets.",
    buyerTip:
      "Victoria's stamp duty exemption for first home buyers up to $600K (with concessions to $750K) is one of the most generous in the country. If you're a first home buyer at this price point, the saving versus NSW or Queensland can be $20K to $35K — money that goes straight to your deposit.",
    watchOut:
      "Victoria's land tax regime hits investors harder than most states once portfolios cross the $300K-ish threshold. Run the numbers including land tax before assuming an investment property cashflows the way the gross rental yield suggests.",
  },
  QLD: {
    marketContext:
      "Queensland has been Australia's standout performer over the last five years, driven by interstate migration from Sydney and Melbourne plus infrastructure investment leading up to the 2032 Olympics. Brisbane's median house price has compounded around 8-10% annually since 2020. The Gold Coast and Sunshine Coast have followed the same trajectory but with more cyclicality, and the Moreton Bay corridor (Caboolture, North Lakes, Burpengary) now offers genuine value for buyers priced out of inner Brisbane. Regional Queensland (Townsville, Cairns, Toowoomba) has lifted off years of stagnation and is now solidly positive.",
    buyerTip:
      "Queensland's first home buyer stamp duty concession was upgraded to $700K full exemption in mid-2024 — among the most generous in the country. Combine that with the federal Home Guarantee Scheme and you can be in a $700K Brisbane house with $35K of saved deposit and effectively zero stamp duty.",
    watchOut:
      "Flood overlays are highly localised in Brisbane and SEQ. The 2011 and 2022 floods affected specific creek systems, and properties on adjacent streets can have wildly different insurance premiums and resale values. Always check the Brisbane City Council Flood Awareness Map for the exact address before bidding.",
  },
  WA: {
    marketContext:
      "Western Australia has been the most explosive market of the last four years, with Perth median house prices roughly doubling between 2020 and 2025. The combination of mining-sector wages, internal migration, and historically tight supply created a genuine boom. As 2026 unfolds, the pace is moderating but not reversing — rental vacancies remain near 1%, and supply additions are well below population-driven demand. Regional WA (Geraldton, Bunbury, Kalgoorlie) has tracked Perth with a lag.",
    buyerTip:
      "WA has the Keystart shared-equity loan scheme, which is uniquely generous: lower deposit thresholds, no LMI, and access for buyers earning up to $135K (couples). Worth checking eligibility before defaulting to a standard lender pre-approval.",
    watchOut:
      "Perth's commodity-cycle exposure means downturns can be sharper than east-coast markets. Build a buffer for the next mining-sector slowdown — don't borrow at maximum capacity assuming current Perth prices represent a permanent floor.",
  },
  SA: {
    marketContext:
      "South Australia has been Australia's quiet achiever — without the boom-bust drama of Perth or the headline volatility of Sydney, Adelaide has compounded steady gains through five consecutive strong years. Median house prices sit around $720K to $800K in 2026 with rental vacancies under 1%, the tightest in the country. The fundamentals (controlled supply, defence-sector wage growth, rising interstate migration) are arguably the strongest in the country for a 5-10 year hold.",
    buyerTip:
      "SA's HomeSeeker shared-equity scheme can let eligible first home buyers acquire a home with as little as 2% deposit. Combined with the $15K FHOG, it's the most accessible scheme stack for buyers under the income caps.",
    watchOut:
      "Adelaide's outer-northern suburbs (Elizabeth, Salisbury) have run faster than the broader market in the last two years and are now at price points where yield has compressed meaningfully. Stress-test the rental income before assuming the cashflow story holds.",
  },
  TAS: {
    marketContext:
      "Tasmania's market had a dramatic 2018-2022 run with Hobart prices nearly doubling. The 2023-2025 period was a flat-to-down breather; 2026 sees the market steady again with modest positive growth and strong rental demand. Hobart median house prices sit around $730K, and the gap to Launceston has narrowed meaningfully. The lifestyle premium that drove the 2018-2022 boom has cooled but hasn't reversed.",
    buyerTip:
      "Tasmania's $30K FHOG (one of the most generous in the country) plus the 50% stamp duty concession on established homes makes TAS the cheapest jurisdiction to enter for eligible first home buyers in dollar terms.",
    watchOut:
      "Tasmania's tighter rental market has driven some hostile commentary toward investors locally. Track council planning changes and any tenancy-law reforms before committing to a buy-and-hold strategy on the island.",
  },
  ACT: {
    marketContext:
      "Canberra is unique among Australian capitals — driven by public service employment, the highest-income demographic of any capital city, and the unusual leasehold land tenure system. After a soft 2024-2025 weighed by interest rates and federal hiring slowdowns, 2026 sees the market firm again. The ACT median house price sits around $980K, and rental yields are typically lower than other capitals because owner-occupier demand dominates.",
    buyerTip:
      "ACT's Home Buyer Concession Scheme (HBCS) offers a full stamp duty waiver for eligible first home buyers and downsizers regardless of property price — uniquely generous compared to threshold-based schemes elsewhere.",
    watchOut:
      "Land tenure in the ACT is leasehold, not freehold. The Crown Lease structure has practical implications for renovations and long-term ownership that are different to mainland states. Read the lease conditions before assuming standard freehold rules apply.",
  },
  NT: {
    marketContext:
      "The Northern Territory market is small, illiquid, and unusually exposed to public-sector wages and defence-sector activity. Darwin median house prices sit around $580K — the lowest of any capital — and rental yields are correspondingly higher (often 5%+). The market has been firming through 2024-2025 after a long flat period; 2026 sees solid demand but limited stock.",
    buyerTip:
      "The NT's HomeGrown and HomeBuild Access loan schemes are designed for the local market and can be more flexible than mainstream lender policy. Check both before defaulting to a big-four bank.",
    watchOut:
      "Cyclone exposure and tropical-climate maintenance costs mean Darwin properties carry higher insurance premiums and ongoing capex than southern equivalents. Factor an additional $3K to $5K per year into your holding-cost assumptions.",
  },
};
