import { db } from "@/lib/db";
import { GLOSSARY_TERMS, type GlossaryTerm } from "@/lib/data/glossary";
import { makeSchoolSlug } from "@/lib/utils/school";

export interface SearchResultSuburb {
  type: "suburb";
  slug: string;
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
}

export interface SearchResultSchool {
  type: "school";
  slug: string;
  name: string;
  suburbName: string;
  state: string;
}

export interface SearchResultGlossary {
  type: "glossary";
  slug: string;
  term: string;
  preview: string;
}

export interface SearchResultGuide {
  type: "guide";
  slug: string;
  title: string;
  description: string;
}

export type SearchResult =
  | SearchResultSuburb
  | SearchResultSchool
  | SearchResultGlossary
  | SearchResultGuide;

export interface SearchResults {
  suburbs: SearchResultSuburb[];
  schools: SearchResultSchool[];
  glossary: SearchResultGlossary[];
  guides: SearchResultGuide[];
  totalCount: number;
}

// Hand-curated guide index. Keep in sync with the /guides hub.
// Future: extract guide frontmatter into a single data module so this can be
// generated from one source of truth.
const GUIDE_INDEX: { slug: string; title: string; description: string }[] = [
  { slug: "buying-property-australia",                title: "How to buy property in Australia",                  description: "Step-by-step from deposit to settlement." },
  { slug: "first-home-buyer-guide",                   title: "First Home Buyer Guide (National)",                 description: "Federal schemes, FHOG by state, stamp duty concessions." },
  { slug: "how-much-deposit-to-buy-a-house",          title: "How much deposit do you need to buy a house?",      description: "5%, 10%, 20%, what each tier unlocks, plus FHSS." },
  { slug: "first-home-buyer-mistakes-to-avoid",       title: "10 first home buyer mistakes to avoid",             description: "The expensive errors, ranked, with the fix for each." },
  { slug: "best-time-to-buy-property-australia",      title: "Best time to buy property in Australia",            description: "Seasonal patterns, the rate cycle, why timing rarely wins." },
  { slug: "how-long-does-it-take-to-buy-a-house-australia", title: "How long does it take to buy a house?",       description: "Realistic 12-20 week timeline with state settlement times." },
  { slug: "cooling-off-period-by-state-australia",    title: "Cooling-off period by state",                       description: "How long you have to pull out of a private treaty contract." },
  { slug: "building-pest-inspection",                 title: "Building & pest inspection",                        description: "When to inspect and what the report should cover." },
  { slug: "conveyancing-guide",                       title: "Conveyancing in Australia",                         description: "What conveyancers do, what they cost, when to use a solicitor." },
  { slug: "property-auction-guide",                   title: "Property auction guide",                            description: "How auctions actually run, bidding strategy." },
  { slug: "lenders-mortgage-insurance-guide",         title: "Lenders Mortgage Insurance (LMI)",                  description: "What LMI costs and the schemes that waive it." },
  { slug: "fixed-vs-variable-rate-guide",             title: "Fixed vs variable rate mortgages",                  description: "Which loan structure fits your situation." },
  { slug: "foreign-buyer-firb-guide",                 title: "Foreign Buyer (FIRB) Guide",                        description: "FIRB rules, foreign buyer surcharges, and tax." },
  { slug: "best-brisbane-suburbs-for-families-2026",  title: "Best Brisbane suburbs for families 2026",           description: "Inner / middle / outer ring family picks." },
  { slug: "how-to-choose-a-selling-agent",            title: "How to choose a selling agent",                     description: "Interview process, the appraisal-price trap." },
  { slug: "real-estate-agent-fees-australia",         title: "Real estate agent fees in Australia",               description: "Commission rates by state, marketing costs." },
  { slug: "sell-first-or-buy-first",                  title: "Sell first or buy first?",                          description: "Decision tree across the three options." },
  { slug: "bridging-loans-guide",                     title: "Bridging loans Australia",                          description: "Peak debt, end debt, capitalised interest." },
  { slug: "downsizers-guide",                         title: "Downsizers guide",                                  description: "When to downsize, super contribution rules." },
  { slug: "house-vs-apartment-investment-australia",  title: "House vs apartment investment",                     description: "Capital growth vs cash flow with a 20-year worked example." },
  { slug: "sydney-vs-melbourne-property-market",      title: "Sydney vs Melbourne property market",               description: "Side-by-side strategy comparison." },
  { slug: "buyers-agent-cost-australia",              title: "Buyer's agent cost in Australia",                   description: "Fees by service tier and city." },
  { slug: "property-management-fees-australia",       title: "Property management fees Australia",                description: "All 8 fee types and the all-in cost." },
  { slug: "negative-gearing-australia",               title: "Negative gearing in Australia",                     description: "How it works and when it fits your strategy." },
  { slug: "property-depreciation-guide",              title: "Property depreciation guide",                       description: "Capital works vs plant & equipment deductions." },
  { slug: "smsf-property-guide",                      title: "SMSF property investment",                          description: "Buying property inside super, LRBA rules." },
  { slug: "granny-flat-guide-nsw",                    title: "Granny flat guide, NSW",                            description: "NSW's CDC fast-track pathway, costs and yields." },
  { slug: "granny-flat-guide-vic",                    title: "Granny flat guide, VIC",                            description: "Victorian planning permits, ResCode." },
  { slug: "granny-flat-guide-qld",                    title: "Granny flat guide, QLD",                            description: "Brisbane City Council rules, QLD's tight rental market." },
  { slug: "granny-flat-guide-sa",                     title: "Granny flat guide, SA",                             description: "SA Planning and Design Code." },
  { slug: "granny-flat-guide-wa",                     title: "Granny flat guide, WA",                             description: "R-Codes, owner-occupier rule." },
];

// Strip HTML tags for short previews
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function previewFromGlossary(t: GlossaryTerm): string {
  const plain = stripHtml(t.html);
  return plain.length > 110 ? `${plain.slice(0, 107)}…` : plain;
}

/**
 * Unified site search, takes a query string and returns categorised
 * results across suburbs, schools, glossary terms, and guides. Used by the
 * /search page.
 *
 * Each category capped to keep the result page fast. Empty query returns
 * empty results.
 */
export async function unifiedSearch(query: string): Promise<SearchResults> {
  const q = query.trim();

  if (q.length < 2) {
    return { suburbs: [], schools: [], glossary: [], guides: [], totalCount: 0 };
  }

  const isNumeric = /^\d+$/.test(q);
  const lower = q.toLowerCase();

  // Suburbs (and postcodes)
  const suburbsPromise = db.suburb.findMany({
    where: isNumeric
      ? { postcode: { startsWith: q } }
      : {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { postcode: { startsWith: q } },
          ],
        },
    select: {
      slug: true,
      name: true,
      state: true,
      postcode: true,
      medianHousePrice: true,
    },
    orderBy: { name: "asc" },
    take: 12,
  });

  // Schools, only fire if not pure numeric (postcode-only doesn't search schools usefully)
  type RawSchool = {
    name: string;
    acaraId: string | null;
    suburb: { name: string; state: string; postcode: string; slug: string } | null;
  };
  const schoolsPromise: Promise<RawSchool[]> = isNumeric
    ? Promise.resolve([])
    : db.school.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: {
          name: true,
          acaraId: true,
          suburb: { select: { name: true, state: true, postcode: true, slug: true } },
        },
        orderBy: { name: "asc" },
        take: 8,
      });

  const [suburbsRaw, schoolsRaw] = await Promise.all([suburbsPromise, schoolsPromise]);

  const suburbs: SearchResultSuburb[] = suburbsRaw.map((s) => ({
    type: "suburb",
    slug: s.slug,
    name: s.name,
    state: s.state,
    postcode: s.postcode,
    medianHousePrice: s.medianHousePrice,
  }));

  const schools: SearchResultSchool[] = schoolsRaw
    .filter((s): s is RawSchool & { suburb: NonNullable<RawSchool["suburb"]>; acaraId: string } =>
      s.suburb != null && s.acaraId != null,
    )
    .map((s) => ({
      type: "school",
      slug: makeSchoolSlug(s.name, s.acaraId),
      name: s.name,
      suburbName: s.suburb.name,
      state: s.suburb.state,
    }));

  // Glossary, synchronous, in-memory
  const glossary: SearchResultGlossary[] = GLOSSARY_TERMS
    .filter((t) => t.term.toLowerCase().includes(lower) || t.html.toLowerCase().includes(lower))
    .slice(0, 8)
    .map((t) => ({
      type: "glossary",
      slug: t.slug,
      term: t.term,
      preview: previewFromGlossary(t),
    }));

  // Guides, synchronous, in-memory
  const guides: SearchResultGuide[] = GUIDE_INDEX
    .filter((g) =>
      g.title.toLowerCase().includes(lower) ||
      g.description.toLowerCase().includes(lower) ||
      g.slug.toLowerCase().includes(lower),
    )
    .slice(0, 8)
    .map((g) => ({
      type: "guide",
      slug: g.slug,
      title: g.title,
      description: g.description,
    }));

  const totalCount = suburbs.length + schools.length + glossary.length + guides.length;

  return { suburbs, schools, glossary, guides, totalCount };
}
