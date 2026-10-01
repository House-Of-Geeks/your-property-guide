import { unstable_cache } from "next/cache";
import type { HouseAndLandPackage } from "@/types";
import { db } from "@/lib/db";
import { STOCK_CACHE_SECONDS, STOCK_CACHE_TAG } from "@/lib/house-and-land-indexability";
import type { HouseAndLandPackage as DbPackage, HouseAndLand_Image } from "@/generated/prisma/client";

type DbPackageWithImages = DbPackage & { images: HouseAndLand_Image[] };

function toPackage(p: DbPackageWithImages): HouseAndLandPackage {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    builder: p.builder,
    estate: p.estate,
    suburb: p.suburb,
    suburbSlug: p.suburbSlug,
    price: { display: p.priceDisplay, value: p.priceValue },
    features: {
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      carSpaces: p.carSpaces,
      landSize: p.landSize,
      buildingSize: p.buildingSize,
    },
    description: p.description,
    images: p.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({ url: img.url, alt: img.alt })),
    floorPlanImage: p.floorPlanImage ?? undefined,
    agentId: p.agentId,
    agencyId: p.agencyId,
    inclusions: p.inclusions,
    isNew: p.isNew,
    dateAdded: p.dateAdded.toISOString(),
  };
}

const includeImages = { images: { orderBy: { sortOrder: "asc" as const } } };

export async function getHouseAndLandPackages(
  suburbSlug?: string,
  limit = 60,
): Promise<HouseAndLandPackage[]> {
  const rows = await db.houseAndLandPackage.findMany({
    where: suburbSlug ? { suburbSlug } : undefined,
    orderBy: { dateAdded: "desc" },
    take: limit,
    include: includeImages,
  });
  return rows.map(toPackage);
}

export async function getHouseAndLandBySlug(slug: string): Promise<HouseAndLandPackage | null> {
  const row = await db.houseAndLandPackage.findUnique({ where: { slug }, include: includeImages });
  return row ? toPackage(row) : null;
}

export async function getAllHouseAndLandSlugs(): Promise<string[]> {
  const rows = await db.houseAndLandPackage.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

/**
 * Live packages: every row in HouseAndLandPackage (the table has no status
 * column, and a package page renders any row that exists). One COUNT
 * query, read through the cache below.
 */
export async function countLiveHouseAndLandPackages(): Promise<number> {
  return db.houseAndLandPackage.count();
}

/**
 * The count every house-and-land indexing decision reads
 * (src/lib/house-and-land-indexability.ts): the hub's and the package
 * pages' robots, /house-and-land/sitemap.xml and the sitemap index. One
 * cache entry, so they all change together. Cached for STOCK_CACHE_SECONDS
 * under STOCK_CACHE_TAG; an error is not cached, the next call retries.
 */
export const getLiveHouseAndLandPackageCount = unstable_cache(
  countLiveHouseAndLandPackages,
  ["house-and-land-live-count:v1"],
  { revalidate: STOCK_CACHE_SECONDS, tags: [STOCK_CACHE_TAG] },
);
