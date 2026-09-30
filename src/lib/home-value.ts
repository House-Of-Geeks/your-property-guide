import type { Suburb } from "@/types";
import { isReliableSalesSource } from "@/lib/suburb-data-quality";
import { UNIT_MEDIAN_SOURCES } from "@/lib/published-medians";
import { describeSalesProvenance } from "@/lib/sales-provenance";

/**
 * The suburb figures shown beside the appraisal form once a visitor picks a
 * suburb: the house-worth guide, /appraisal and /property-valuation. They are
 * deliberately the suburb's numbers, never an "estimate" for the visitor's
 * home: a median dressed up as a valuation would undercut the appraisal it
 * sits beside. The suburb service has already applied the published-medians
 * rule (a withheld median arrives as 0); this adds the unit-median source
 * rule and the provenance the range block prints.
 */
export interface HomeValueSummary {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  /** At least one median, house or unit, is published for the suburb. */
  reliable: boolean;
  medianHousePrice: number | null;
  /**
   * Only from a feed that produces one (UNIT_MEDIAN_SOURCES). The NSW and SA
   * feeds write no unit median, so a figure beside them predates the feeds
   * and is withheld here.
   */
  medianUnitPrice: number | null;
  annualGrowthHouse: number | null;
  /**
   * House sales behind the median when the feed reports a count. Kept even
   * where the median is withheld for too few sales, so the block can say why.
   */
  salesCount: number | null;
  /** "NSW Valuer General", "Land Victoria quarterly medians", ... */
  sourceLabel: string | null;
  /** "calendar 2025", "the latest published quarter (updated June 2026)", "2024". */
  period: string | null;
  /** "area" for an ABS statistical-area median, "suburb" otherwise. */
  basis: "suburb" | "area" | null;
  /** Source-and-period sentence for the house median, e.g. "Median of 35 house sales recorded by the NSW Valuer General in calendar 2025." */
  provenance: string | null;
  /** The same for the unit median; null where no unit median is published. */
  unitProvenance: string | null;
}

/**
 * The unit series is a separate table in each feed that has one: Land
 * Victoria's quarterly median unit price by suburb, and the ABS median price
 * of attached dwelling transfers (HOUSES_5) for the statistical area.
 */
function describeUnitProvenance(source: string | null, period: string, areaNote: string | null, suburbName: string): string | null {
  if (source === "sales-vic") return `Land Victoria's quarterly suburb median unit price, ${period}.`;
  if (source === "sales-abs") {
    return `Median price of attached dwelling transfers (units, apartments and townhouses) for the ABS statistical area (SA2) that takes in ${suburbName}, ${period}.${areaNote ? ` ${areaNote}` : ""}`;
  }
  return null;
}

export function buildHomeValueSummary(suburb: Suburb): HomeValueSummary {
  const freshness = suburb.dataFreshness;
  const source = freshness?.salesSource ?? null;
  const sourceOk = isReliableSalesSource(source);
  const house = sourceOk && suburb.stats.medianHousePrice > 0 ? suburb.stats.medianHousePrice : null;
  const unit =
    sourceOk && UNIT_MEDIAN_SOURCES.includes(source ?? "") && suburb.stats.medianUnitPrice > 0
      ? suburb.stats.medianUnitPrice
      : null;
  const reliable = house !== null || unit !== null;
  const prov = sourceOk
    ? describeSalesProvenance({
        source,
        periodEnd: freshness?.salesPeriodEnd,
        updatedAt: freshness?.salesAsOf,
        salesCount: freshness?.salesCount,
        suburbName: suburb.name,
      })
    : null;
  return {
    slug: suburb.slug,
    name: suburb.name,
    state: suburb.state,
    postcode: suburb.postcode,
    reliable,
    medianHousePrice: house,
    medianUnitPrice: unit,
    // 0 is the service layer's "unknown / implausible" sentinel for growth.
    annualGrowthHouse: house !== null && suburb.stats.annualGrowthHouse ? suburb.stats.annualGrowthHouse : null,
    salesCount: sourceOk ? (freshness?.salesCount ?? null) : null,
    sourceLabel: prov?.sourceLabel ?? null,
    period: prov?.period ?? null,
    basis: prov?.geography ?? null,
    provenance: house !== null ? (prov?.sentence ?? null) : null,
    unitProvenance: unit !== null && prov ? describeUnitProvenance(source, prov.period, prov.areaNote, suburb.name) : null,
  };
}

/** Lead source for appraisal requests started on the house-worth guide. */
export function homeValueSource(slug: string): string {
  return `home-value-guide-${slug}`;
}
