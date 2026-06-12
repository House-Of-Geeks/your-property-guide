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

export function suburbDescription(suburb: Suburb): string {
  // Leads with the direct postcode answer ("…'s postcode is XXXX") so the
  // SERP snippet resolves the "{suburb} postcode" query without a click and
  // is eligible for the featured snippet, then carries the profile/price
  // intent. Only publishes the median when we trust it — for low-confidence
  // suburbs (QLD/WA fallback) we skip the dollar figure rather than print
  // fiction in the SERP snippet.
  const lead = `${suburb.name}, ${suburb.state}'s postcode is ${suburb.postcode}.`;
  if (hasReliablePrice(suburb)) {
    return `${lead} Free suburb profile with the median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}, growth, schools, walkability, crime and current listings. No sign-up.`;
  }
  return `${lead} Free suburb profile: schools, walkability, climate, crime, demographics and current listings. No sign-up.`;
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
