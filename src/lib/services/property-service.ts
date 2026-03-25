import type { Property, PropertySearchParams, ListingType, PropertyType } from "@/types";

async function loadProperties(): Promise<Property[]> {
  const { properties } = await import("@/lib/data/properties");
  return properties;
}

export async function getProperties(params?: PropertySearchParams): Promise<Property[]> {
  let results = await loadProperties();

  if (params?.listingType) {
    results = results.filter((p) => p.listingType === params.listingType);
  }
  if (params?.suburb) {
    results = results.filter((p) => p.suburbSlug === params.suburb);
  }
  if (params?.propertyType) {
    results = results.filter((p) => p.propertyType === params.propertyType);
  }
  if (params?.minPrice) {
    results = results.filter((p) => {
      const val = p.listingType === "rent" ? (p.price.rentPerWeek ?? 0) : (p.price.value ?? 0);
      return val >= params.minPrice!;
    });
  }
  if (params?.maxPrice) {
    results = results.filter((p) => {
      const val = p.listingType === "rent" ? (p.price.rentPerWeek ?? 0) : (p.price.value ?? 0);
      return val <= params.maxPrice!;
    });
  }
  if (params?.minBeds) {
    results = results.filter((p) => p.features.bedrooms >= params.minBeds!);
  }

  // Sort
  switch (params?.sort) {
    case "price-asc":
      results.sort((a, b) => (a.price.value ?? 0) - (b.price.value ?? 0));
      break;
    case "price-desc":
      results.sort((a, b) => (b.price.value ?? 0) - (a.price.value ?? 0));
      break;
    case "beds-desc":
      results.sort((a, b) => b.features.bedrooms - a.features.bedrooms);
      break;
    default:
      results.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }

  return results;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const properties = await loadProperties();
  return properties.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const properties = await loadProperties();
  return properties.filter((p) => p.isFeatured && p.listingType === "buy").slice(0, limit);
}

export async function getPropertiesBySuburb(suburbSlug: string, limit?: number): Promise<Property[]> {
  const properties = await loadProperties();
  const filtered = properties.filter((p) => p.suburbSlug === suburbSlug && p.status === "active");
  return limit ? filtered.slice(0, limit) : filtered;
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  const properties = await loadProperties();
  return properties.filter((p) => p.agentId === agentId);
}

export async function getOffMarketProperties(): Promise<Property[]> {
  const properties = await loadProperties();
  return properties.filter((p) => p.isOffMarket || p.listingType === "off-market");
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const properties = await loadProperties();
  return properties.map((p) => p.slug);
}
