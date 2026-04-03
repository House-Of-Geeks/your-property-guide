/**
 * NSW Rental Data Sync
 *
 * NSW Fair Trading publishes rental bond data at:
 * https://www.fairtrading.nsw.gov.au/about-fair-trading/rental-bond-data
 *
 * However, this data is not available as a direct API/file download from
 * data.nsw.gov.au — the CKAN resource links to the Fair Trading website.
 *
 * Until a direct machine-readable source is available, this sync is a no-op.
 * TODO: When NSW Fair Trading exposes CSV/API, implement here.
 *
 * Schedule: Quarterly (when enabled)
 */
import "dotenv/config";
import { startSync, finishSync, log } from "../logger";

const SOURCE_ID = "rental-nsw";

export async function run(): Promise<void> {
  await startSync(SOURCE_ID);
  log(SOURCE_ID, "NSW rental data not available as direct download — skipping");
  // Mark as finished with 0 records and no date (won't overwrite existing data)
  await finishSync(SOURCE_ID, 0, undefined);
}
