// Human labels for the rental feeds, shared by the suburb snapshot band and
// the rental-market sub-page. NSW bond data is published by postcode, so
// its label carries the postcode when one is given.
export const RENTAL_SOURCE_LABELS: Record<string, string> = {
  "rental-nsw": "NSW rental bond data",
  "rental-vic": "Victorian rental report",
  "rental-sa": "SA rental bond data",
  "rental-qld": "Queensland RTA bond data",
  "abs-census": "2021 Census rent (proxy)",
  "abs-census-2021": "2021 Census rent (proxy)",
};

export function rentalSourceLabel(source: string | null | undefined, postcode?: string | null): string | null {
  const label = source ? RENTAL_SOURCE_LABELS[source] ?? null : null;
  if (!label) return null;
  return source === "rental-nsw" && postcode ? `${label} (postcode ${postcode})` : label;
}

export const monthYear = (d: Date) => d.toLocaleDateString("en-AU", { month: "long", year: "numeric", timeZone: "UTC" });
