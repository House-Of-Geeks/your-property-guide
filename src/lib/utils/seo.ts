import type { Property, Agent, Agency, BlogPost, Suburb } from "@/types";
import { SITE_URL } from "@/lib/constants";
import { hasReliablePrice } from "@/lib/suburb-data-quality";

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

export function suburbTitle(suburb: Suburb): string {
  // Front-loads "{Suburb} Postcode {XXXX}" because Search Console shows the
  // single biggest unclicked cluster is "{suburb} postcode" lookups (these
  // pages rank ~pos 10 but the old title never said the word "postcode", so
  // searchers scanned past it). This title now serves three intents at once:
  // "{suburb} postcode", "{suburb} suburb profile" and "{suburb} median
  // price". The ` | Your Property Guide` brand suffix is appended by the
  // root title template, so this stays short enough to survive truncation.
  return `${suburb.name} Postcode ${suburb.postcode} (${suburb.state}) — Suburb Profile & Median Price`;
}

export function suburbBuyTitle(suburb: Suburb): string {
  return `Houses for Sale in ${suburb.name} ${suburb.state} ${suburb.postcode}`;
}

export function suburbRentTitle(suburb: Suburb): string {
  return `Houses for Rent in ${suburb.name} ${suburb.state} ${suburb.postcode}`;
}

export function suburbBuyDescription(suburb: Suburb): string {
  return `Browse properties for sale in ${suburb.name} ${suburb.postcode}. Median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}. View listings and enquire today.`;
}

export function suburbRentDescription(suburb: Suburb): string {
  return `Find rental properties in ${suburb.name} ${suburb.postcode}. Median rent ${suburb.stats.medianRentHouse}/wk. Browse available homes and enquire today.`;
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

export function suburbDescription(suburb: Suburb): string {
  // Leads with the direct postcode answer ("…'s postcode is XXXX") so the
  // SERP snippet resolves the "{suburb} postcode" query without a click and
  // is eligible for the featured snippet, then carries the profile/price
  // intent. Only publishes the median when we trust it — for low-confidence
  // suburbs (QLD/WA fallback) we skip the dollar figure rather than print
  // fiction in the SERP snippet.
  const alias = directionalAlias(suburb.name);
  const aka = alias ? ` (also known as ${alias})` : "";
  const lead = `${suburb.name}${aka}, ${suburb.state}'s postcode is ${suburb.postcode}.`;
  const reliable = hasReliablePrice(suburb);
  const tail = reliable
    ? `Free suburb profile with the median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}, growth, schools, walkability, crime and current listings. No sign-up.`
    : `Free suburb profile: schools, walkability, climate, crime, demographics and current listings. No sign-up.`;
  const full = `${lead} ${tail}`;
  // ~160 chars is the SERP truncation budget. The alias earns its keep more
  // than the trailing feature list does, so when it pushes the description
  // over budget we shorten the tail rather than drop the alias.
  if (!alias || full.length <= 160) return full;
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
