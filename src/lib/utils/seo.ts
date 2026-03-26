import type { Property, Agent, Agency, BlogPost, Suburb } from "@/types";

const SITE_URL = "https://yourpropertyguide.com.au";
const SITE_NAME = "Your Property Guide";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function propertyTitle(property: Property): string {
  const { bedrooms, bathrooms, carSpaces } = property.features;
  return `${property.address.street}, ${property.address.suburb} - ${bedrooms} Bed ${bathrooms} Bath ${carSpaces} Car | ${SITE_NAME}`;
}

export function propertyDescription(property: Property): string {
  const { bedrooms, bathrooms } = property.features;
  return `${property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} for ${property.listingType === "rent" ? "rent" : "sale"} at ${property.address.full}. ${bedrooms} bedrooms, ${bathrooms} bathrooms. ${property.price.display}. View details and enquire today.`;
}

export function suburbTitle(suburb: Suburb): string {
  return `${suburb.name} Real Estate & Property Market ${suburb.state} ${suburb.postcode} | ${SITE_NAME}`;
}

export function suburbBuyTitle(suburb: Suburb): string {
  return `Houses for Sale in ${suburb.name} ${suburb.state} ${suburb.postcode} | ${SITE_NAME}`;
}

export function suburbRentTitle(suburb: Suburb): string {
  return `Houses for Rent in ${suburb.name} ${suburb.state} ${suburb.postcode} | ${SITE_NAME}`;
}

export function suburbBuyDescription(suburb: Suburb): string {
  return `Browse properties for sale in ${suburb.name} ${suburb.postcode}. Median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}. View listings and enquire today.`;
}

export function suburbRentDescription(suburb: Suburb): string {
  return `Find rental properties in ${suburb.name} ${suburb.postcode}. Median rent ${suburb.stats.medianRentHouse}/wk. Browse available homes and enquire today.`;
}

export function suburbDescription(suburb: Suburb): string {
  return `Explore properties for sale and rent in ${suburb.name} ${suburb.postcode}. Median house price ${formatMetaPrice(suburb.stats.medianHousePrice)}. View market stats, schools, and listings.`;
}

export function agentTitle(agent: Agent): string {
  return `${agent.fullName} - Real Estate Agent | ${SITE_NAME}`;
}

export function agentDescription(agent: Agent): string {
  return `${agent.fullName} is a real estate agent specialising in ${agent.suburbs.join(", ")}. ${agent.propertiesSold} properties sold. Contact ${agent.firstName} today.`;
}

export function agencyTitle(agency: Agency): string {
  return `${agency.name} - Real Estate Agency | ${SITE_NAME}`;
}

export function blogTitle(post: BlogPost): string {
  return `${post.title} | ${SITE_NAME}`;
}

function formatMetaPrice(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${(value / 1_000).toFixed(0)}K`;
}
