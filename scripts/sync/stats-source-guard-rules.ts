// The post-sync guard's rule. Pure; tested in tests/sync/stats-source-guard.test.ts.
//
// A sync must not take away the label that lets a suburb's median publish.
// On 1 Oct 2026 the quarterly run relabelled every NSW row rental-nsw and
// nothing failed: the trusted NSW count went from about 3,000 to 0 and the
// run reported success. The guard counts, per state, the Suburb rows whose
// statsSource the trust gate accepts (RELIABLE_SALES_SOURCES), before and
// after, and fails when a guarded state loses more than a tenth of them.

/** States whose loss fails the run: the two with suburb-level government sales feeds that ran on 1 Oct. */
export const GUARDED_STATES: readonly string[] = ["NSW", "VIC"];
/** Largest share of a guarded state's trusted rows a run may lose. */
export const MAX_TRUSTED_DROP = 0.1;

export type TrustedCounts = Record<string, number>;

export interface GuardBreach {
  state: string;
  before: number;
  after: number;
  /** Share lost, 0 to 1. */
  drop: number;
}

export function guardBreaches(
  before: TrustedCounts,
  after: TrustedCounts,
  states: readonly string[] = GUARDED_STATES,
  maxDrop: number = MAX_TRUSTED_DROP,
): GuardBreach[] {
  const out: GuardBreach[] = [];
  for (const state of states) {
    const b = before[state] ?? 0;
    const a = after[state] ?? 0;
    if (b <= 0) continue;
    const drop = (b - a) / b;
    if (drop > maxDrop) out.push({ state, before: b, after: a, drop });
  }
  return out;
}

const n = (v: number) => v.toLocaleString("en-AU");

/** One line per state, guarded states marked. */
export function describeCounts(before: TrustedCounts, after: TrustedCounts, states: readonly string[] = GUARDED_STATES): string[] {
  const all = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  return all.map((s) => {
    const b = before[s] ?? 0, a = after[s] ?? 0;
    const pct = b > 0 ? ` (${(((a - b) / b) * 100).toFixed(1)}%)` : "";
    return `  ${s.padEnd(4)} ${n(b).padStart(7)} -> ${n(a).padStart(7)}${pct}${states.includes(s) ? "  [guarded]" : ""}`;
  });
}

/** The line a log search finds. */
export function breachLine(context: string, b: GuardBreach, maxDrop: number = MAX_TRUSTED_DROP): string {
  return `!!! STATS-SOURCE GUARD FAILED (${context}): ${b.state} rows with a trusted sales label ${n(b.before)} -> ${n(b.after)} (-${(b.drop * 100).toFixed(1)}%, limit ${(maxDrop * 100).toFixed(0)}%). A feed overwrote statsSource; see scripts/sync/repair-stats-source.ts.`;
}
