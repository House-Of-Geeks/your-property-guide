// The census-mortgage proxies (sales-qld, sales-wa) never stand over a median the site trusts.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROXY_PROTECTED_SOURCES, proxyMayOverwrite } from "../../scripts/sync/sources/census-proxy-rules";
import { RELIABLE_SALES_SOURCES } from "../../src/lib/suburb-data-quality";

describe("census proxy overwrite rule", () => {
  it("protects every source the trust gate publishes", () => {
    expect([...PROXY_PROTECTED_SOURCES]).toEqual([...RELIABLE_SALES_SOURCES]);
    for (const src of ["sales-nsw", "sales-vic", "sales-sa", "sales-abs", " sales-abs "]) expect(proxyMayOverwrite(src), src).toBe(false);
  });
  it("may overwrite distrusted labels, including its own earlier values", () => {
    for (const src of ["sales-qld", "sales-wa", "abs-census-2021", "seed", "stub", "rental-qld", "import-suburbs-all", "", null, undefined]) {
      expect(proxyMayOverwrite(src), String(src)).toBe(true);
    }
  });
  it("is applied by both proxy feeds, in the plan and in the UPDATE", () => {
    for (const feed of ["sales-qld", "sales-wa"]) {
      const text = readFileSync(`scripts/sync/sources/${feed}.ts`, "utf8");
      expect(text, feed).toContain("if (!proxyMayOverwrite(suburb.statsSource)) { protectedRows++; continue; }");
      expect(text, feed).toContain('AND NOT (s."statsSource" = ANY(${[...PROXY_PROTECTED_SOURCES]}::text[]))');
    }
  });
});
