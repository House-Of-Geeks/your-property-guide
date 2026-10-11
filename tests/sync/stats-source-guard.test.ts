// A sync that takes the trusted sales label off NSW or VIC suburbs fails, loudly, before it revalidates anything.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GUARDED_STATES, MAX_TRUSTED_DROP, breachLine, describeCounts, guardBreaches } from "../../scripts/sync/stats-source-guard-rules";

describe("guardBreaches", () => {
  it("guards NSW and VIC at a 10% loss", () => {
    expect([...GUARDED_STATES]).toEqual(["NSW", "VIC"]);
    expect(MAX_TRUSTED_DROP).toBe(0.1);
  });
  it("fails the 1 Oct 2026 run: every NSW row relabelled", () => {
    const b = guardBreaches({ NSW: 3_034, VIC: 748, QLD: 180 }, { NSW: 0, VIC: 748, QLD: 61 });
    expect(b).toEqual([{ state: "NSW", before: 3_034, after: 0, drop: 1 }]);
    expect(breachLine("rental-nsw", b[0])).toMatch(/^!!! STATS-SOURCE GUARD FAILED \(rental-nsw\): NSW rows with a trusted sales label 3,034 -> 0 \(-100\.0%, limit 10%\)/);
  });
  it("allows a loss of 10% or less, any gain, and states it does not guard", () => {
    expect(guardBreaches({ NSW: 1_000, VIC: 1_000 }, { NSW: 900, VIC: 1_200 })).toEqual([]);
    expect(guardBreaches({ NSW: 1_000 }, { NSW: 899 })).toHaveLength(1);
    expect(guardBreaches({ QLD: 500 }, { QLD: 0 })).toEqual([]);
    expect(guardBreaches({ QLD: 500 }, { QLD: 0 }, ["QLD"])).toHaveLength(1);
  });
  it("has nothing to lose from zero, and counts a missing state as zero", () => {
    expect(guardBreaches({ NSW: 0 }, { NSW: 0 })).toEqual([]);
    expect(guardBreaches({ VIC: 748 }, {})).toEqual([{ state: "VIC", before: 748, after: 0, drop: 1 }]);
  });
  it("prints every state, guarded ones marked", () => {
    expect(describeCounts({ NSW: 3_034, SA: 373 }, { NSW: 0, SA: 373 })).toEqual([
      "  NSW    3,034 ->       0 (-100.0%)  [guarded]",
      "  SA       373 ->     373 (0.0%)",
    ]);
  });
});

describe("where the guard runs", () => {
  const sh = readFileSync("scripts/cron/quarterly.sh", "utf8");
  const at = (s: string) => sh.indexOf(s);
  it("quarterly.sh snapshots before the first source and checks after the last, before revalidating", () => {
    expect(at("stats-source-guard.ts snapshot --out")).toBeGreaterThan(0);
    expect(at("stats-source-guard.ts snapshot --out")).toBeLessThan(at("run rental-vic"));
    expect(at("stats-source-guard.ts check --before")).toBeGreaterThan(at("run nearby-suburbs"));
    expect(at("stats-source-guard.ts check --before")).toBeLessThan(at("revalidate-paths.ts"));
    expect(at("stats-source-guard.ts check --before")).toBeLessThan(at("indexnow-ping.ts"));
    expect(sh).toMatch(/if ! npx tsx scripts\/sync\/stats-source-guard\.ts check --before "\$GUARD_SNAPSHOT"; then[\s\S]*?exit 1\s*fi/);
    expect(sh).toContain("RAILWAY_GIT_COMMIT_SHA");
  });
  it("run.ts checks around every source and fails the source that did it", () => {
    const run = readFileSync("scripts/sync/run.ts", "utf8");
    const loop = run.slice(run.indexOf("for (const id of toRun)"));
    expect(loop.indexOf("const before = await guardCounts();")).toBeLessThan(loop.indexOf("await SOURCES[id].run();"));
    expect(loop.indexOf("const breach = await guardAfter(id, before);")).toBeGreaterThan(loop.indexOf("await SOURCES[id].run();"));
    expect(loop).toContain('r.status = "error";');
  });
  it("the guard only reads", () => {
    const guard = readFileSync("scripts/sync/stats-source-guard.ts", "utf8");
    expect(guard).not.toMatch(/\$executeRaw|\.update(Many)?\(|\.upsert\(|\.create(Many)?\(|\.delete(Many)?\(/);
  });
});
