import type { Property, Agent, Agency, BlogPost, Suburb } from "@/types";
import { SITE_URL } from "@/lib/constants";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { publishedGrowthFor } from "@/lib/published-medians";
import { publishesRent, salesProvenanceFor } from "@/lib/suburb-snapshot";
import { formatPriceFull } from "@/lib/utils/format";
import { capitalCityFor } from "@/lib/utils/metro";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function propertyTitle(property: Property): string {
  const { bedrooms, bathrooms, carSpaces } = property.features;
  return `${property.address.street}, ${property.address.suburb} - ${bedrooms} Bed ${bathrooms} Bath ${carSpaces} Car`;
}

export function propertyDescription(property: Property): string {
  const { bedrooms, bathrooms } = property.features;
  return `${property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} for ${property.listingType === "rent" ? "rent" : "sale"} at ${property.address.full}. ${bedrooms} bedrooms, ${bathrooms} bathrooms. ${property.price.display}. View details and enquire today.`;
}

/** R6 of the September 2026 fix review: what a title builder may return before the " | Your Property Guide" suffix. */
export const TITLE_BUDGET = 60;
/** The item 2 guardrail in the fix review: the profile description stays under 155 characters. */
export const SUBURB_DESCRIPTION_BUDGET = 155;

// ── Item 2 rollout: by state cohort (R4) ────────────────────────────────────
// R4 of the September 2026 fix review is "stage by cohort, not by switch",
// and item 2's own guardrails name the cohort: SA and TAS suburbs only
// (about 10% of suburbs, low traffic) for three weeks, judged on Search
// Console page-filtered CTR and on postcode-query impressions against the
// rest of the country as the control. Ship to the rest when the cohort's CTR
// is higher than the control's and its postcode impressions have not fallen
// more than the control's. To widen, add states here; at full rollout delete
// this list and the two legacy builders at the end of this block, and do not
// touch the title again for 90 days. The FAQ and the price card on the same
// page are not staged: they change on every profile, so cohort and control
// differ only in the title and description.
export const TITLE_COHORT_STATES: readonly string[] = ["SA", "TAS"];

export function inTitleCohort(suburb: Pick<Suburb, "state">): boolean {
  return TITLE_COHORT_STATES.includes(suburb.state.toUpperCase());
}

/** The profile page's title: the item 2 title inside the cohort, today's title for the control. */
export function suburbTitle(suburb: Suburb): string {
  return inTitleCohort(suburb) ? suburbTitleHousePrices(suburb) : legacySuburbTitle(suburb);
}

/** The profile page's meta description: the item 2 description inside the cohort, today's for the control. */
export function suburbDescription(suburb: Suburb): string {
  return inTitleCohort(suburb) ? suburbDescriptionHousePrices(suburb) : legacySuburbDescription(suburb);
}

// Fix item 2 (commercial intent review 3.8, 30 Sep 2026): the profile title
// leads with the suburb and "House Prices", not the postcode. With
// "{Suburb} Postcode {XXXX}" in front, 79% of the suburb pages' Google
// impressions in the 90 days to 30 Sep 2026 were postcode lookups (191,679 of
// 241,107) that produced 25 clicks, and "hawthorn median house price" ranked
// Hawthorn East (3123) over Hawthorn (3122): both pages carried the same
// pattern. The postcode stays in the lead for the lookups that still convert.
//
// The tail is the tracker's wording, "House Prices, Rent, Schools & Suburb
// Profile", with each topic named only where the page publishes it (R6 and
// rule 3: a title never promises what the page withholds; the region
// template varies its title the same way, change log 20 Sep 2026):
//   - House Prices: a published median (hasReliablePrice, the gate the price
//     card, the band and the description read);
//   - Rent: a weekly rent whose source is known (publishesRent, the band's rule);
//   - Schools: schools listed on the page.
// When a feed later publishes the figure, the title follows by itself. Too
// long for the budget, topics drop from the end, then "Suburb" goes, so a
// long name stays inside R6 (Google rewrites a title it has to truncate).
export function suburbTitleHousePrices(suburb: Suburb): string {
  const lead = `${suburb.name} ${suburb.state} ${suburb.postcode}: `;
  const priced = hasReliablePrice(suburb);
  const extras = [publishesRent(suburb) ? "Rent" : null, suburb.schools.length > 0 ? "Schools" : null].filter(
    (t): t is string => t !== null,
  );
  const tails: string[] = [];
  for (let n = extras.length; n >= 0; n--) {
    const topics = [...(priced ? ["House Prices"] : []), ...extras.slice(0, n)];
    tails.push(topics.length ? `${topics.join(", ")} & Suburb Profile` : "Suburb Profile");
  }
  if (priced) tails.push("House Prices & Profile", "House Prices");
  for (const tail of tails) {
    if (lead.length + tail.length <= TITLE_BUDGET) return `${lead}${tail}`;
  }
  return `${lead}${tails[tails.length - 1]}`;
}

export function suburbBuyTitle(suburb: Suburb): string {
  // "Property", not "Houses": /buy lists every property type, and "Houses
  // for Sale in {name}" is the /houses sub-page's title — sharing it made
  // the two pages compete for the same query.
  return `Property for Sale in ${suburb.name}, ${suburb.state} ${suburb.postcode}`;
}

export function suburbRentTitle(suburb: Suburb): string {
  return `Houses for Rent in ${suburb.name} ${suburb.state} ${suburb.postcode}`;
}

export function suburbBuyDescription(suburb: Suburb): string {
  // Same gate as suburbDescription: suburb-service zeroes the median for
  // unreliable sources, and "$0K" in a SERP snippet is worse than no price.
  const price = hasReliablePrice(suburb)
    ? ` Median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}.`
    : "";
  return `Browse all property for sale in ${suburb.name} ${suburb.postcode} — houses, units, townhouses and land.${price} View listings and enquire today.`;
}

export function suburbRentDescription(suburb: Suburb): string {
  // Rent comes from the rental feeds, independent of the sales gate; 0 is
  // the codebase's "unknown" and must not print as "0/wk".
  const rent = suburb.stats.medianRentHouse > 0 ? ` Median rent $${suburb.stats.medianRentHouse}/wk.` : "";
  return `Find rental properties in ${suburb.name} ${suburb.postcode}.${rent} Browse available homes and enquire today.`;
}

// Directional suburbs ("Brighton East", "North Melbourne") are searched at
// volume in the reversed colloquial form ("east brighton postcode") which
// otherwise never appears anywhere on the page — the meta description is
// the one crawlable spot to state the alias once.
const DIRECTIONAL_WORDS = new Set(["North", "South", "East", "West"]);

function directionalAlias(name: string): string | null {
  // Only TRAILING directionals have a real colloquial reversed form
  // ("Brighton East" → "East Brighton"). Leading directionals are the
  // name itself — "South Yarra" is never called "Yarra South", so
  // reversing those would publish a fabricated alias in the SERP snippet.
  const words = name.split(" ");
  if (words.length < 2) return null;
  const last = words[words.length - 1];
  if (DIRECTIONAL_WORDS.has(last)) return [last, ...words.slice(0, -1)].join(" ");
  return null;
}

function joinAnd(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * The opening of the description for a suburb with a published median: the
 * figure, its source and period, and the 12-month change where the feed
 * measures one. The same rule as the page's lead sentence
 * (buildLeadSentence, src/lib/suburb-snapshot.ts): hasReliablePrice over
 * the gated stats, provenance from the sales source, growth through
 * publishedGrowthFor. Null when no median is published, so the description
 * never carries a dollar figure the page withholds.
 */
function publishedMedianLead(suburb: Suburb): string | null {
  if (!hasReliablePrice(suburb)) return null;
  const p = salesProvenanceFor(suburb);
  if (!p) return null;
  const price = formatPriceFull(suburb.stats.medianHousePrice);
  if (p.geography === "area") {
    return `${suburb.name} sits in an ABS statistical area (SA2) where the median house price is ${price} (${p.sourceShort}, ${p.periodShort}).`;
  }
  const g = publishedGrowthFor(suburb);
  const change = g ? `, ${g > 0 ? "up" : "down"} ${Math.abs(g).toFixed(1)}% in 12 months` : "";
  return `${suburb.name}'s median house price is ${price} (${p.sourceShort}, ${p.periodShort}${change}).`;
}

/**
 * What the page publishes besides a median, in the order the description
 * lists them, without a dollar figure: rents print only where the rent's
 * source is known, and never in a snippet that could read as a price. A 0
 * is "unknown" throughout the codebase and is never printed as a figure.
 */
function publishedFacts(suburb: Suburb): string[] {
  const s = suburb.stats;
  const out: string[] = [];
  if (publishesRent(suburb)) out.push("weekly rent");
  if (s.population > 0) out.push(`population ${s.population.toLocaleString("en-AU")} (2021 Census)`);
  if (suburb.schools.length > 0) out.push(`${suburb.schools.length} schools`);
  if ((s.walkScore ?? 0) > 0) out.push(`walk score ${s.walkScore}`);
  return out;
}

export function suburbDescriptionHousePrices(suburb: Suburb): string {
  // Fix item 2: leads with the published median house price, its source
  // and period, and the 12-month change where measured (NSW and SA today),
  // so the snippet answers "{suburb} house prices" and "{suburb} median
  // house price" outright. Where no median is published it leads with what
  // the page does publish. The facts go in in order, and one that would
  // take the description past the 155-character guardrail is skipped. The
  // alias for a directional name ("Brighton East", searched as "east
  // brighton") always stays: the description is the one crawlable place
  // that states it.
  const sn = suburb.name;
  const alias = directionalAlias(sn);
  const facts = publishedFacts(suburb);
  const lead = publishedMedianLead(suburb);
  if (lead) {
    const head = `${lead}${alias ? ` Also known as ${alias}.` : ""}`;
    const kept = fitFacts(facts, (f) => `${head} Plus ${joinAnd(f)}.`);
    return kept.length ? `${head} Plus ${joinAnd(kept)}.` : head;
  }
  // "{suburb} {city}" navigational queries ("sunnybank brisbane") dwarf the
  // postcode cluster in volume; the city name otherwise never appears in
  // the snippet, so metro suburbs carry it.
  const capital = capitalCityFor(suburb.state, suburb.postcode);
  const where = `${sn}${alias ? ` (also known as ${alias})` : ""}, ${suburb.state} ${suburb.postcode}${capital ? `, in Greater ${capital.name}` : ""}`;
  const kept = fitFacts(facts, (f) => `${where}: suburb profile with ${joinAnd(f)}.`);
  return kept.length ? `${where}: suburb profile with ${joinAnd(kept)}.` : `${where}: suburb profile, postcode and location.`;
}

/** The facts, in order, that fit the budget together: one that would overrun it is skipped and the next is tried. */
function fitFacts(facts: string[], render: (kept: string[]) => string): string[] {
  const kept: string[] = [];
  for (const f of facts) {
    if (render([...kept, f]).length <= SUBURB_DESCRIPTION_BUDGET) kept.push(f);
  }
  return kept;
}

// ── The control: today's profile title and description, unchanged ─────────
// Kept verbatim for the suburbs outside TITLE_COHORT_STATES while the cohort
// runs. Known faults, left alone so the control stays the control, and gone at
// full rollout: the title runs past R6's 60 characters and says "Median Price"
// on pages that withhold the median; the description says "growth" beside
// Land Victoria and ABS medians, which carry no 12-month change.
export function legacySuburbTitle(suburb: Suburb): string {
  // Front-loads "{Suburb} Postcode {XXXX}" because Search Console shows the
  // single biggest unclicked cluster is "{suburb} postcode" lookups (these
  // pages rank ~pos 10 but the old title never said the word "postcode", so
  // searchers scanned past it). This title now serves three intents at once:
  // "{suburb} postcode", "{suburb} suburb profile" and "{suburb} median
  // price". The ` | Your Property Guide` brand suffix is appended by the
  // root title template, so this stays short enough to survive truncation.
  return `${suburb.name} Postcode ${suburb.postcode} (${suburb.state}) — Suburb Profile & Median Price`;
}

export function legacySuburbDescription(suburb: Suburb): string {
  // Leads with the direct postcode answer ("…'s postcode is XXXX") so the
  // SERP snippet resolves the "{suburb} postcode" query without a click and
  // is eligible for the featured snippet, then carries the profile/price
  // intent. Only publishes the median when we trust it — for low-confidence
  // suburbs (QLD/WA fallback) we skip the dollar figure rather than print
  // fiction in the SERP snippet.
  const alias = directionalAlias(suburb.name);
  const aka = alias ? ` (also known as ${alias})` : "";
  // "{suburb} {city}" navigational queries ("sunnybank brisbane") dwarf the
  // postcode cluster in volume; the city name otherwise never appears in
  // the snippet, so metro suburbs carry it right after the postcode answer.
  const capital = capitalCityFor(suburb.state, suburb.postcode);
  const cityPhrase = capital ? `, in Greater ${capital.name}` : "";
  const lead = `${suburb.name}${aka}, ${suburb.state}'s postcode is ${suburb.postcode}${cityPhrase}.`;
  const reliable = hasReliablePrice(suburb);
  const tail = reliable
    ? `Free suburb profile with the median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}, growth, schools, walkability, crime and current listings. No sign-up.`
    : `Free suburb profile: schools, walkability, climate, crime, demographics and current listings. No sign-up.`;
  const full = `${lead} ${tail}`;
  // ~160 chars is the SERP truncation budget. The alias and city phrase earn
  // their keep more than the trailing feature list does, so when they push
  // the description over budget we shorten the tail rather than drop them.
  if ((!alias && !capital) || full.length <= 160) return full;
  const shortTail = reliable
    ? `Median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}, growth, schools and crime. No sign-up.`
    : `Suburb profile: schools, walkability, crime and demographics. No sign-up.`;
  return `${lead} ${shortTail}`;
}

export function agentTitle(agent: Agent): string {
  return `${agent.fullName} - Real Estate Agent`;
}

export function agentDescription(agent: Agent): string {
  return `${agent.fullName} is a real estate agent specialising in ${agent.suburbs.join(", ")}. ${agent.propertiesSold} properties sold. Contact ${agent.firstName} today.`;
}

export function agencyTitle(agency: Agency): string {
  return `${agency.name} - Real Estate Agency`;
}

export function blogTitle(post: BlogPost): string {
  return post.title;
}

function formatMetaPrice(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${(value / 1_000).toFixed(0)}K`;
}
