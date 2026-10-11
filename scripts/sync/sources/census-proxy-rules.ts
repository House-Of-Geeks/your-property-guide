// Which suburbs the census-mortgage proxy feeds (sales-qld, sales-wa) may
// write. Pure; tested in tests/sync/census-proxy-rules.test.ts.
//
// sales-qld and sales-wa back-calculate a "median price" from 2021 Census
// mortgage repayments, which src/lib/suburb-data-quality.ts calls fiction at
// the suburb level. The annual cron runs them straight after sales-abs
// (scripts/cron/annual-schools.sh), so without this rule they replace a real
// ABS median, and the trusted label beside it, on every QLD and WA suburb
// they match. A proxy never stands over a median the site trusts.
import { RELIABLE_SALES_SOURCES } from "../../../src/lib/suburb-data-quality";

/** Labels a census proxy must leave alone: every source the trust gate publishes. */
export const PROXY_PROTECTED_SOURCES: readonly string[] = [...RELIABLE_SALES_SOURCES];

export function proxyMayOverwrite(statsSource: string | null | undefined): boolean {
  return !PROXY_PROTECTED_SOURCES.includes((statsSource ?? "").trim());
}
