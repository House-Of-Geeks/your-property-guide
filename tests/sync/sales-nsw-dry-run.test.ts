// `sales-nsw --dry-run` (with or without --from-rows) is safe to run against production: it writes nothing.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const feed = readFileSync("scripts/sync/sources/sales-nsw.ts", "utf8");
const run = feed.slice(feed.indexOf("export async function run()"));

describe("sales-nsw dry run", () => {
  it("leaves the DataSource row alone", () => {
    expect(run).toContain("if (!opts.dryRun) await startSync(SOURCE_ID);");
    expect(run).toContain("if (!opts.dryRun) await finishSync(SOURCE_ID,");
    expect(run).toContain("if (!opts.dryRun) await failSync(SOURCE_ID, err);");
    expect(run).not.toMatch(/^\s*await (startSync|finishSync|failSync)\(/m);
  });
  it("skips the row capture and the Suburb update", () => {
    expect(feed).toMatch(/if \(dryRun\) \{\s*log\(SOURCE_ID, `\$\{year\}: \[dry-run\] would insert/);
    expect(feed).toMatch(/if \(dryRun\) \{\s*log\(SOURCE_ID, `aggregate: \[dry-run\] no DB writes`\);\s*return 0;/);
  });
});
