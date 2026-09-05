// Pure classification rules for the NSW Valuer General sales feed, kept free
// of I/O so they can be unit-tested (tests/sync/sales-nsw-rules.test.ts).
//
// The suburb "median house price" must be a median of houses. The VG nature
// code R means "residence, non-strata"; it also covers flats and townhouses
// sold under company title or other non-strata schemes, and those carry a
// unit number. Aggregating every R record produced house medians that were
// less than half the market in apartment-heavy suburbs (Bondi 2025: $1.73M
// over all R records, $4.3M over R records with no unit number; Cronulla
// $1.35M vs $3.4M; Mosman $3.0M vs $5.6M — production rows, 5 Sep 2026).
// A land-area floor on top of the unit-number rule changed nothing, so the
// unit number alone is the rule.

export interface AggregateCandidate {
  /** Pre-2001 archive layout: its nature codes do not map to R / V / 3. */
  isOldFormat: boolean;
  /** VG nature of property: "R" residence non-strata, "V" vacant, "3" strata. */
  nature: string;
  /** Unit number as printed in the record; empty or missing for a house. */
  unitNumber: string | null | undefined;
}

export function isHouseSaleForAggregate(c: AggregateCandidate): boolean {
  if (c.isOldFormat) return false;
  if (c.nature.trim().toUpperCase() !== "R") return false;
  if (c.unitNumber && c.unitNumber.trim() !== "") return false;
  return true;
}
