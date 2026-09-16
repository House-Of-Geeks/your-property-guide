import type { Suburb } from "@/types";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { describeSalesProvenance } from "@/lib/sales-provenance";

/**
 * The suburb figures shown next to the appraisal form on the house-worth
 * guide once a visitor picks a suburb. Deliberately the suburb's numbers,
 * never an "estimate" for the visitor's home: a median dressed up as a
 * valuation would undercut the appraisal it sits beside. The same reliable-
 * price gate as the suburb page applies; unreliable medians are withheld.
 */
export interface HomeValueSummary {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  reliable: boolean;
  medianHousePrice: number | null;
  medianUnitPrice: number | null;
  annualGrowthHouse: number | null;
  salesCount: number | null;
  /** Source-and-period sentence, e.g. "Median of 35 house sales recorded by the NSW Valuer General in calendar 2025." */
  provenance: string | null;
}

export function buildHomeValueSummary(suburb: Suburb): HomeValueSummary {
  const reliable = hasReliablePrice(suburb);
  const prov = reliable
    ? describeSalesProvenance({
        source: suburb.dataFreshness?.salesSource,
        periodEnd: suburb.dataFreshness?.salesPeriodEnd,
        updatedAt: suburb.dataFreshness?.salesAsOf,
        salesCount: suburb.dataFreshness?.salesCount,
        suburbName: suburb.name,
      })
    : null;
  return {
    slug: suburb.slug,
    name: suburb.name,
    state: suburb.state,
    postcode: suburb.postcode,
    reliable,
    medianHousePrice: reliable ? suburb.stats.medianHousePrice : null,
    medianUnitPrice: reliable && suburb.stats.medianUnitPrice > 0 ? suburb.stats.medianUnitPrice : null,
    // 0 is the service layer's "unknown / implausible" sentinel for growth.
    annualGrowthHouse: reliable && suburb.stats.annualGrowthHouse ? suburb.stats.annualGrowthHouse : null,
    salesCount: reliable ? (suburb.dataFreshness?.salesCount ?? null) : null,
    provenance: prov?.sentence ?? null,
  };
}

/** Lead source for appraisal requests started on the house-worth guide. */
export function homeValueSource(slug: string): string {
  return `home-value-guide-${slug}`;
}
