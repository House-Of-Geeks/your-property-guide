// Which suburb medians the ABS SA2 feed may overwrite. Pure, tested in
// tests/sync/sales-abs-rules.test.ts.
//
// sales-abs writes statistical-area (SA2) medians as a fallback where no
// suburb-level feed exists. Run after sales-nsw on 6 Sep 2026 it overwrote
// 185 NSW suburbs' Valuer General medians with area figures (fixed by
// re-running the NSW feed). A suburb-level government feed is always the
// better source for the suburb it names, so its rows are off limits.

export const SUBURB_LEVEL_SALES_SOURCES = ["sales-nsw", "sales-vic", "sales-sa"] as const;

export function absMayOverwrite(statsSource: string | null | undefined): boolean {
  return !(SUBURB_LEVEL_SALES_SOURCES as readonly string[]).includes((statsSource ?? "").trim());
}
