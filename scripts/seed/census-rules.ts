// Pure rules for telling a postcode-level census copy from a real suburb
// record. Unit-tested in tests/sync/census-rules.test.ts.
//
// scripts/seed/sync-suburb-stats-abs.ts (April 2026) wrote ABS Postal Area
// figures to every suburb in a postcode: 30 Mackay localities with 85,500
// residents each, Badagarang with all of postcode 2540's 48,267. The
// suburb-level sync (abs-census, SAL geography) later overwrote the suburbs
// it could match by name and left the rest. A postcode copy carries only
// population and median age: owner-occupied and family-household counts are
// zero. So are they for tiny real localities whose small cells the ABS
// suppresses, so "zero households" alone is not the rule; the value must
// also be one that other suburbs in the postcode share, or too large for a
// locality with no recorded households.

export interface CensusRow {
  population: number;
  ownerOccupied: number;
  householdsFamily: number;
  /** how many suburbs in the same state+postcode carry exactly this population (including this one) */
  sharedInPostcode: number;
}

/** A lone suburb with no household data but this many residents is a postcode figure, not a locality. */
export const LONE_POSTCODE_COPY_MIN_POPULATION = 1000;
/** Two tiny localities can share a suppressed value by chance; a shared value this big cannot. */
export const SHARED_POSTCODE_COPY_MIN_POPULATION = 100;

export function isPostcodeLevelCensusRow(r: CensusRow): boolean {
  if (r.population <= 0) return false;
  if (r.ownerOccupied > 0 || r.householdsFamily > 0) return false; // suburb-level sync wrote households
  if (r.sharedInPostcode >= 2 && r.population >= SHARED_POSTCODE_COPY_MIN_POPULATION) return true;
  if (r.population >= LONE_POSTCODE_COPY_MIN_POPULATION) return true;
  return false;
}

/**
 * Jervis Bay Territory shares postcode 2540 with the Shoalhaven coast, and the
 * postcode → region lookup in the suburb import gave every 2540 locality the
 * Territory's "Unincorp. Other Territories". The three ACT-state rows (the
 * Territory itself) and Norfolk Island (2899) are correct; NSW 2540 is
 * Shoalhaven City Council.
 */
export function correctedRegion(r: { state: string; postcode: string; region: string }): string | null {
  if (r.region === "Unincorp. Other Territories" && r.state === "NSW" && r.postcode === "2540") return "Shoalhaven";
  return null;
}
