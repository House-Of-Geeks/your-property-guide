import type { Property, PropertySearchParams, ListingType } from "@/types";
import { db } from "@/lib/db";
import type { Property as DbProperty, Property_Image } from "@/generated/prisma/client";

type DbPropertyWithImages = DbProperty & { images: Property_Image[] };

function toProperty(p: DbPropertyWithImages): Property {
  return {
    id: p.id,
    slug: p.slug,
    listingType: p.listingType as ListingType,
    propertyType: p.propertyType as Property["propertyType"],
    status: p.status as Property["status"],
    title: p.title,
    address: {
      street: p.addressStreet,
      suburb: p.addressSuburb,
      state: p.addressState,
      postcode: p.addressPostcode,
      full: p.addressFull,
    },
    price: {
      display: p.priceDisplay,
      value: p.priceValue,
      isRange: p.priceIsRange,
      min: p.priceMin ?? undefined,
      max: p.priceMax ?? undefined,
      rentPerWeek: p.priceRentPerWeek ?? undefined,
    },
    features: {
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      carSpaces: p.carSpaces,
      landSize: p.landSize ?? undefined,
      buildingSize: p.buildingSize ?? undefined,
    },
    description: p.description,
    images: p.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({ url: img.url, alt: img.alt, width: img.width, height: img.height })),
    agentId: p.agentId,
    coAgentId: p.coAgentId ?? undefined,
    agencyId: p.agencyId,
    suburbSlug: p.suburbSlug,
    inspectionTimes: p.inspectionTimes,
    auctionDate: p.auctionDate?.toISOString(),
    dateAdded: p.dateAdded.toISOString(),
    dateSold: p.dateSold?.toISOString(),
    soldPrice: p.soldPrice ?? undefined,
    isOffMarket: p.isOffMarket,
    isFeatured: p.isFeatured,
  };
}

const includeImages = { images: { orderBy: { sortOrder: "asc" as const } } };

export async function getProperties(params?: PropertySearchParams): Promise<Property[]> {
  const where: Record<string, unknown> = {};

  if (params?.listingType) where.listingType = params.listingType;
  if (params?.suburb) {
    const slugs = params.suburb.split(",").map((s) => s.trim()).filter(Boolean);
    where.suburbSlug = slugs.length === 1 ? slugs[0] : { in: slugs };
  }
  if (params?.propertyType) {
    const types = params.propertyType.split(",").map((t) => t.trim()).filter(Boolean);
    where.propertyType = types.length === 1 ? types[0] : { in: types };
  }
  if (params?.minBeds) where.bedrooms = { gte: params.minBeds };
  if (params?.minBaths) where.bathrooms = { gte: params.minBaths };
  if (params?.minCars) where.carSpaces = { gte: params.minCars };
  if (params?.minPrice || params?.maxPrice) {
    const isRent = params.listingType === "rent";
    const field = isRent ? "priceRentPerWeek" : "priceValue";
    where[field] = {
      ...(params.minPrice ? { gte: params.minPrice } : {}),
      ...(params.maxPrice ? { lte: params.maxPrice } : {}),
    };
  }

  const orderBy = (() => {
    switch (params?.sort) {
      case "price-asc":  return { priceValue: "asc" as const };
      case "price-desc": return { priceValue: "desc" as const };
      case "beds-desc":  return { bedrooms: "desc" as const };
      default:           return { dateAdded: "desc" as const };
    }
  })();

  const rows = await db.property.findMany({ where, orderBy, include: includeImages });
  return rows.map(toProperty);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const row = await db.property.findUnique({ where: { slug }, include: includeImages });
  return row ? toProperty(row) : null;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const rows = await db.property.findMany({
    where: { isFeatured: true, listingType: "buy" },
    orderBy: { dateAdded: "desc" },
    take: limit,
    include: includeImages,
  });
  return rows.map(toProperty);
}

export async function getPropertiesBySuburb(suburbSlug: string, limit?: number): Promise<Property[]> {
  const rows = await db.property.findMany({
    where: { suburbSlug, status: "active" },
    orderBy: { dateAdded: "desc" },
    ...(limit ? { take: limit } : {}),
    include: includeImages,
  });
  return rows.map(toProperty);
}

export async function getPropertiesByAgency(agencyId: string, limit = 6): Promise<Property[]> {
  const rows = await db.property.findMany({
    where: { agencyId, status: "active" },
    orderBy: { dateAdded: "desc" },
    take: limit,
    include: includeImages,
  });
  return rows.map(toProperty);
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  const rows = await db.property.findMany({
    where: { agentId },
    orderBy: { dateAdded: "desc" },
    include: includeImages,
  });
  return rows.map(toProperty);
}

export async function getOffMarketProperties(): Promise<Property[]> {
  const rows = await db.property.findMany({
    where: { OR: [{ isOffMarket: true }, { listingType: "off-market" }] },
    orderBy: { dateAdded: "desc" },
    include: includeImages,
  });
  return rows.map(toProperty);
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const rows = await db.property.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
