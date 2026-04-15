import { cache } from "react";
import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { streetSlug } from "@/lib/utils/slug";

const PAGE_SIZE = 50_000;

const getTotalStreets = cache(async (): Promise<number> => {
  const result = await db.$queryRaw<{ cnt: bigint }[]>`
    SELECT COUNT(*) AS cnt FROM (
      SELECT DISTINCT "suburbSlug", "streetName", "streetType", "streetSuffix"
      FROM "PropertyAddress"
      WHERE "suburbSlug" IS NOT NULL AND "streetName" IS NOT NULL
    ) t
  `;
  return Number(result[0]?.cnt ?? 0);
});

export async function generateSitemaps() {
  const total = await getTotalStreets();
  const pages = Math.ceil(total / PAGE_SIZE);
  return Array.from({ length: pages }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const streets = await db.$queryRaw<{
    suburbSlug: string;
    streetName: string;
    streetType: string | null;
    streetSuffix: string | null;
  }[]>`
    SELECT DISTINCT "suburbSlug", "streetName", "streetType", "streetSuffix"
    FROM "PropertyAddress"
    WHERE "suburbSlug" IS NOT NULL AND "streetName" IS NOT NULL
    ORDER BY "suburbSlug", "streetName"
    LIMIT ${PAGE_SIZE} OFFSET ${id * PAGE_SIZE}
  `;

  return streets.map((s) => ({
    url: `${SITE_URL}/suburbs/${s.suburbSlug}/${streetSlug(s.streetName, s.streetType, s.streetSuffix)}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));
}
