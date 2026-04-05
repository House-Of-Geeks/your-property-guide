import type { HouseAndLandPackage } from "@/types";
import { db } from "@/lib/db";
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

export async function getHouseAndLandPackages(suburbSlug?: string): Promise<HouseAndLandPackage[]> {
  const rows = await db.houseAndLandPackage.findMany({
    where: suburbSlug ? { suburbSlug } : undefined,
    orderBy: { dateAdded: "desc" },
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
