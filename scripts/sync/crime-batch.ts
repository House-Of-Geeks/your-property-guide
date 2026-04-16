/**
 * Shared batch upsert for SuburbCrimeStat.
 *
 * Uses concurrent individual upserts (10 at a time) rather than transactions —
 * avoids PgAdapter's 5-second transaction timeout while still being much faster
 * than fully sequential upserts.
 */
import { prisma } from "./db";

export interface CrimeRecord {
  suburbName:       string;
  suburbSlug:       string | null;
  postcode?:        string | null;
  lga?:             string | null;
  state:            string;
  period:           string;
  periodDate:       Date;
  totalOffences:    number;
  offenceBreakdown: Record<string, number>;
  source:           string;
}

const CONCURRENCY = 10;

export async function batchUpsertCrime(records: CrimeRecord[]): Promise<number> {
  if (records.length === 0) return 0;
  let count = 0;
  for (let i = 0; i < records.length; i += CONCURRENCY) {
    const chunk = records.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map((r) =>
        prisma.suburbCrimeStat.upsert({
          where: {
            suburbName_state_period_source: {
              suburbName: r.suburbName,
              state:      r.state,
              period:     r.period,
              source:     r.source,
            },
          },
          create: {
            suburbSlug:       r.suburbSlug,
            suburbName:       r.suburbName,
            postcode:         r.postcode ?? null,
            lga:              r.lga ?? null,
            state:            r.state,
            period:           r.period,
            periodDate:       r.periodDate,
            totalOffences:    r.totalOffences,
            offenceBreakdown: r.offenceBreakdown,
            source:           r.source,
          },
          update: {
            suburbSlug:       r.suburbSlug,
            totalOffences:    r.totalOffences,
            offenceBreakdown: r.offenceBreakdown,
          },
        }),
      ),
    );
    count += chunk.length;
  }
  return count;
}
