// The nearby-suburb links on the suburb sub-pages (rental market, schools,
// agents). A sub-page links a neighbour's sub-page only when that page has
// something on it and indexes itself: a rental-market page with a rental
// row, an agents page with a published house median, a schools page with
// schools. Two small queries for up to twelve slugs, one after the other
// (the runtime pool holds a single connection, src/lib/db.ts).
import { db } from "@/lib/db";
import { LOCALITIES_ONLY, isNonLocalitySlug } from "@/lib/non-localities";
import { publishesMedians } from "@/lib/published-medians";
import { withRentAllColumn } from "@/lib/services/rental-service";
import { allDwellingsRent, isAllDwellingsOnly, rentalSourceLabel } from "@/lib/rental-labels";

export interface NearbyRent {
  /** Median weekly house rent; null when the feed has no house split or none was published. */
  house: number | null;
  unit: number | null;
  /** All dwellings together (WA bond data); never a house rent. */
  all: number | null;
  periodDate: Date;
  /** "Victorian rental report". */
  label: string;
}

export interface NearbySubpage {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  /** Its agents page indexes: a published house median (the agents sitemap rule). */
  agentsIndexable: boolean;
  schoolCount: number;
  /** The newest rental row from a named feed; null when there is none (its rental-market page noindexes). */
  rent: NearbyRent | null;
}

const MAX = 12;
const positive = (n: number | null | undefined) => (typeof n === "number" && n > 0 ? n : null);

export async function getNearbySubpages(slugs: readonly string[]): Promise<NearbySubpage[]> {
  const wanted = [...new Set(slugs)].filter((s) => !isNonLocalitySlug(s)).slice(0, MAX);
  if (wanted.length === 0) return [];

  const rows = await db.suburb.findMany({
    where: { AND: [{ slug: { in: wanted } }, LOCALITIES_ONLY] },
    select: {
      slug: true,
      name: true,
      state: true,
      postcode: true,
      medianHousePrice: true,
      statsSource: true,
      salesCountHouse: true,
      _count: { select: { schools: true } },
    },
  });
  const rental = await withRentAllColumn((withAll) =>
    db.suburbRentalStat.findMany({
      where: { suburbSlug: { in: wanted } },
      orderBy: [{ periodDate: "desc" }, { updatedAt: "desc" }],
      select: { suburbSlug: true, periodDate: true, medianRentHouse: true, medianRentUnit: true, medianRentAll: withAll, source: true },
    }),
  );

  const newest = new Map<string, NearbyRent>();
  for (const r of rental) {
    if (!r.suburbSlug || newest.has(r.suburbSlug)) continue;
    const label = rentalSourceLabel(r.source);
    // A census proxy is not a published rent.
    if (!label || /proxy/i.test(label)) continue;
    const allOnly = isAllDwellingsOnly(r);
    const rent: NearbyRent = {
      house: allOnly ? null : positive(r.medianRentHouse),
      unit: allOnly ? null : positive(r.medianRentUnit),
      all: allOnly ? allDwellingsRent(r) : null,
      periodDate: r.periodDate,
      label,
    };
    if (rent.house || rent.unit || rent.all) newest.set(r.suburbSlug, rent);
  }

  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return wanted.flatMap((slug) => {
    const r = bySlug.get(slug);
    if (!r) return [];
    return [{
      slug,
      name: r.name,
      state: r.state,
      postcode: r.postcode,
      // The agents sitemap rule (hasPublishedHouseMedian): a published house median.
      agentsIndexable: publishesMedians(r) && r.medianHousePrice > 0,
      schoolCount: r._count.schools,
      rent: newest.get(slug) ?? null,
    }];
  });
}
