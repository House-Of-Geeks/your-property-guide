// Provenance for the suburb median house price: which feed, which geography,
// which period, how many sales. Rendered under every median (fix item 1,
// step v) so a reader can tell a suburb-level median of 35 Valuer General
// sales from an ABS statistical-area figure that takes in the neighbours.
// Pure; tested in tests/lib/sales-provenance.test.ts.

/** Fewer recorded house sales than this and no median is published for the suburb. */
export const MIN_SALES_FOR_MEDIAN = 5;

/** Unknown counts (sources that publish medians without counts) do not suppress a median. */
export function hasEnoughSales(count: number | null | undefined): boolean {
  if (count == null || count <= 0) return true;
  return count >= MIN_SALES_FOR_MEDIAN;
}

export interface SalesProvenance {
  /** "suburb": a median of sales inside the suburb. "area": an ABS statistical area (SA2) that contains the suburb. */
  geography: "suburb" | "area";
  sourceLabel: string;
  /** Human period the median describes, e.g. "calendar 2025", "2024", "the latest published quarter". */
  period: string;
  /** "35 house sales" when the source reports counts. */
  sampleNote: string | null;
  /** Caveat for area medians. */
  areaNote: string | null;
  /** One line for captions: "Median of 35 house sales · NSW Valuer General · calendar 2025". */
  short: string;
  /** One sentence for FAQ answers and narrative. */
  sentence: string;
}

interface Input {
  source: string | null | undefined;
  periodEnd: Date | null | undefined;
  updatedAt?: Date | null | undefined;
  salesCount: number | null | undefined;
  suburbName: string;
}

const monthYear = (d: Date) => d.toLocaleDateString("en-AU", { month: "long", year: "numeric", timeZone: "UTC" });

export function describeSalesProvenance(i: Input): SalesProvenance | null {
  const count = i.salesCount && i.salesCount > 0 ? i.salesCount : null;
  const sampleNote = count ? `${count.toLocaleString("en-AU")} house sale${count === 1 ? "" : "s"}` : null;
  const year = i.periodEnd ? i.periodEnd.getUTCFullYear() : null;
  const updated = i.updatedAt ? monthYear(i.updatedAt) : null;

  switch (i.source) {
    case "sales-nsw": {
      const period = year ? `calendar ${year}` : "the latest full calendar year";
      return {
        geography: "suburb", sourceLabel: "NSW Valuer General", period, sampleNote, areaNote: null,
        short: `${sampleNote ? `Median of ${sampleNote}` : "Median"} · NSW Valuer General · ${period}`,
        sentence: `Median of ${sampleNote ?? "house sales"} recorded by the NSW Valuer General in ${period}.`,
      };
    }
    case "sales-vic": {
      const period = `the latest published quarter${updated ? ` (updated ${updated})` : ""}`;
      return {
        geography: "suburb", sourceLabel: "Land Victoria quarterly medians", period, sampleNote, areaNote: null,
        short: `${sampleNote ? `Median of ${sampleNote}` : "Median"} · Land Victoria · ${period}`,
        sentence: `Land Victoria's quarterly suburb median${sampleNote ? ` from ${sampleNote}` : ""}, ${period}.`,
      };
    }
    case "sales-sa": {
      const period = `the latest published quarter${updated ? ` (updated ${updated})` : ""}`;
      return {
        geography: "suburb", sourceLabel: "SA Government quarterly medians", period, sampleNote, areaNote: null,
        short: `${sampleNote ? `Median of ${sampleNote}` : "Median"} · SA Government · ${period}`,
        sentence: `The SA Government's quarterly suburb median${sampleNote ? ` from ${sampleNote}` : ""}, ${period}.`,
      };
    }
    case "sales-abs": {
      const period = year ? String(year) : "the latest ABS year";
      const areaNote = `An SA2 can take in surrounding localities, so this can differ from sales in ${i.suburbName} itself.`;
      return {
        geography: "area", sourceLabel: "ABS statistical area (SA2)", period, sampleNote: null, areaNote,
        short: `ABS statistical area (SA2) median · ${period}`,
        sentence: `Median house transfer price for the ABS statistical area (SA2) that takes in ${i.suburbName}, ${period}. ${areaNote}`,
      };
    }
    default:
      return null;
  }
}

/** Copy for a suburb whose median is withheld because too few sales were recorded. */
export function thinSalesNote(count: number, period: string): string {
  return `Only ${count} house sale${count === 1 ? " was" : "s were"} recorded in ${period}, too few for a reliable median. We publish one from ${MIN_SALES_FOR_MEDIAN} sales or more.`;
}
