// The rental-market sub-page model (fix item 13). Pure: every section is
// built only from data that exists, the title names only the sections that
// will render, and the FAQ answers carry the same figures. Tested in
// tests/seo/rental-market.test.ts.
import type { Suburb } from "@/types/suburb";
import type { SuburbRentalHistory } from "@/lib/services/rental-service";
import type { FaqItem } from "@/components/guide/Faq";
import { grossYieldPercent, salesProvenanceFor } from "@/lib/suburb-snapshot";
import { monthYear, rentalSourceLabel } from "@/lib/rental-labels";

export const RENTAL_MARKET_YEAR = 2026;
const TITLE_BUDGET = 60;
const DESCRIPTION_BUDGET = 160;

export type RentalSection = "current" | "yield" | "history" | "listings" | "faq";

export interface CurrentRent {
  house: number | null;
  unit: number | null;
  bed3: number | null;
  bed2: number | null;
  bed1: number | null;
  period: string;
  periodDate: Date;
  source: string;
  /** New house bonds behind the median where the feed records them (NSW). */
  bonds: number | null;
  label: string;
}

export interface RentalChange {
  house: number | null;
  unit: number | null;
  fromPeriod: string;
  toPeriod: string;
  fromDate: Date;
  toDate: Date;
}

export interface RentalMarketModel {
  current: CurrentRent | null;
  change: RentalChange | null;
  yieldHouse: number | null;
  yieldUnit: number | null;
  history: SuburbRentalHistory[];
  columns: { bed3: boolean; bed2: boolean; bed1: boolean; bonds: boolean };
  listings: number;
  sections: RentalSection[];
  title: string;
  description: string;
  provenance: string | null;
  faqs: FaqItem[];
}

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
const round1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);
const val = (n: number | null | undefined): number | null => (typeof n === "number" && n > 0 ? n : null);

/** "2025-Q3" → "2024-Q3"; null for anything that is not a quarter label. */
export function previousYearPeriod(period: string): string | null {
  const m = /^(\d{4})-Q([1-4])$/.exec(period);
  return m ? `${parseInt(m[1], 10) - 1}-Q${m[2]}` : null;
}

/** Percentage change to one decimal; null without both figures. */
export function pctChange(from: number | null, to: number | null): number | null {
  if (!from || !to) return null;
  return Math.round(((to - from) / from) * 1000) / 10;
}

export function rentalMarketTitle(name: string, withYield: boolean): string {
  const tail = withYield ? " & Yield" : "";
  for (const t of [
    `${name} Rental Market ${RENTAL_MARKET_YEAR}: Median Rent${tail}`,
    `${name} Rental Market ${RENTAL_MARKET_YEAR}: Rent${tail}`,
    `${name} Rental Market ${RENTAL_MARKET_YEAR}`,
  ]) {
    if (t.length <= TITLE_BUDGET) return t;
  }
  return `${name} Rental Market`;
}

function fit(parts: string[]): string {
  // Drop trailing sentences until the description fits the snippet budget.
  for (let n = parts.length; n > 0; n--) {
    const d = parts.slice(0, n).join(" ");
    if (d.length <= DESCRIPTION_BUDGET) return d;
  }
  return parts[0].slice(0, DESCRIPTION_BUDGET);
}

/** What a bedroom median covers, per feed: the sources define them differently. */
export function bedroomDefinition(source: string): string {
  if (source === "rental-nsw") return "These pool every dwelling type of that size, so a three-bedroom house usually sits above the three-bedroom figure and a three-bedroom unit below it.";
  if (source === "rental-vic") return "The three-bedroom figure is the median for houses and the one and two-bedroom figures are for flats, following the Victorian report's tables.";
  return "Bedroom figures follow the source's own definition of the dwelling types they cover.";
}

const signed = (n: number) => `${n > 0 ? "up" : n < 0 ? "down" : "flat at"}${n === 0 ? "" : ` ${Math.abs(n)}%`}`;

export function buildRentalMarket(suburb: Suburb, history: SuburbRentalHistory[], listings: number): RentalMarketModel {
  const rows = [...history].sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
  const latest = rows.find((r) => val(r.medianRentHouse) || val(r.medianRentUnit)) ?? null;
  const label = latest ? rentalSourceLabel(latest.source, suburb.postcode) ?? latest.source : null;

  const current: CurrentRent | null = latest
    ? { house: val(latest.medianRentHouse), unit: val(latest.medianRentUnit), bed3: val(latest.medianRent3Bed), bed2: val(latest.medianRent2Bed), bed1: val(latest.medianRent1Bed), period: latest.period, periodDate: latest.periodDate, source: latest.source, bonds: val(latest.bondLodgements), label: label as string }
    : null;

  let change: RentalChange | null = null;
  if (current) {
    const prevPeriod = previousYearPeriod(current.period);
    const prev = prevPeriod ? rows.find((r) => r.period === prevPeriod) : null;
    if (prev) {
      const house = pctChange(val(prev.medianRentHouse), current.house);
      const unit = pctChange(val(prev.medianRentUnit), current.unit);
      if (house !== null || unit !== null) change = { house, unit, fromPeriod: prev.period, toPeriod: current.period, fromDate: prev.periodDate, toDate: current.periodDate };
    }
  }

  const yieldHouse = current?.house ? round1(grossYieldPercent(current.house, suburb.stats.medianHousePrice)) : null;
  const yieldUnit = current?.unit ? round1(grossYieldPercent(current.unit, suburb.stats.medianUnitPrice)) : null;

  const periods = new Set(rows.map((r) => r.period));
  const historyRows = periods.size >= 2 ? rows : [];
  const columns = {
    bed3: historyRows.some((r) => val(r.medianRent3Bed)),
    bed2: historyRows.some((r) => val(r.medianRent2Bed)),
    bed1: historyRows.some((r) => val(r.medianRent1Bed)),
    bonds: historyRows.some((r) => val(r.bondLodgements)),
  };

  const name = suburb.name;
  const when = current ? monthYear(current.periodDate) : "";
  const faqs: FaqItem[] = [];
  if (current) {
    const bits: string[] = [];
    if (current.house) bits.push(`houses rent for a median ${money(current.house)} a week`);
    if (current.unit) bits.push(`units for ${money(current.unit)}`);
    faqs.push({
      question: `What is the median rent in ${name}?`,
      answer: `In ${name}, ${bits.join(" and ")} (${current.label}, ${when}). A median is the middle of the new rentals recorded in the period: half cost more and half cost less, so a specific property can sit well away from it.`,
    });
  }
  if (current && yieldHouse) {
    const sales = salesProvenanceFor(suburb);
    const unitBit = yieldUnit ? ` Units come out at about ${yieldUnit}% on a ${money(suburb.stats.medianUnitPrice)} median.` : "";
    faqs.push({
      question: `What is the gross rental yield in ${name}?`,
      answer: `About ${yieldHouse}% for houses: ${money(current.house as number)} a week is ${money((current.house as number) * 52)} a year against a median house price of ${money(suburb.stats.medianHousePrice)}${sales ? ` (${sales.short})` : ""}.${unitBit} Gross yield is before rates, insurance, management fees, maintenance and vacancy, so the net figure is lower.`,
    });
  }
  if (current && change) {
    const parts: string[] = [];
    if (change.house !== null && current.house) parts.push(`House rents are ${signed(change.house)} on a year earlier, at ${money(current.house)} a week`);
    if (change.unit !== null && current.unit) parts.push(`${parts.length ? "unit rents are" : "Unit rents are"} ${signed(change.unit)}, at ${money(current.unit)}`);
    faqs.push({
      question: `How have rents in ${name} changed over the past year?`,
      answer: `${parts.join("; ")} (${monthYear(change.fromDate)} to ${monthYear(change.toDate)}, ${current.label}).`,
    });
  }
  if (current && (current.bed3 || current.bed2 || current.bed1)) {
    const beds: string[] = [];
    if (current.bed1) beds.push(`one-bedroom ${money(current.bed1)}`);
    if (current.bed2) beds.push(`two-bedroom ${money(current.bed2)}`);
    if (current.bed3) beds.push(`three-bedroom ${money(current.bed3)}`);
    faqs.push({
      question: `What does a one, two or three-bedroom rental cost in ${name}?`,
      answer: `Median weekly rent by bedroom count in ${name}: ${beds.join(", ")} (${current.label}, ${when}). ${bedroomDefinition(current.source)}`,
    });
  }
  if (listings > 0) {
    faqs.push({
      question: `Are there properties for rent in ${name} right now?`,
      answer: `Yes: ${listings} ${listings === 1 ? "property is" : "properties are"} listed for rent in ${name} on this site at the moment. Listings change daily; the rentals tab shows the current set with prices, bedrooms and inspection times.`,
    });
  }

  // No rental row: nothing renders and the page shows its empty state.
  const sections: RentalSection[] = [];
  if (current) {
    sections.push("current");
    if (yieldHouse || yieldUnit) sections.push("yield");
    if (historyRows.length) sections.push("history");
    if (listings > 0) sections.push("listings");
    if (faqs.length >= 2) sections.push("faq");
  }

  const title = current ? rentalMarketTitle(name, sections.includes("yield")) : `${name} Rental Market | Rent Prices & Trends`;
  const description = current
    ? fit([
        `Median weekly rent in ${name} ${suburb.postcode}: ${[current.house ? `${money(current.house)} houses` : null, current.unit ? `${money(current.unit)} units` : null].filter(Boolean).join(", ")} (${current.label}, ${when}).`,
        yieldHouse ? `Gross yield ${yieldHouse}%.` : "",
        "Rent by bedroom, history and current listings.",
      ].filter(Boolean))
    : `View rental price trends and history for ${name}, ${suburb.state}. Compare weekly rent for houses, units, and bedrooms.`;
  const provenance = current ? `${current.label}${current.bonds ? `, median of ${current.bonds.toLocaleString("en-AU")} new house bonds` : ""}, ${when}` : null;

  return { current, change, yieldHouse, yieldUnit, history: historyRows, columns, listings, sections, title, description, provenance, faqs: faqs.length >= 2 ? faqs : [] };
}
