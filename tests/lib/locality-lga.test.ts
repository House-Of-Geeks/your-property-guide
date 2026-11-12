import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import data from "../../scripts/seed/data/locality-lga.json";
import {
  appLgaName,
  normaliseLocality,
  planRegions,
  resolveLocality,
  type LocalityLgaData,
  type SuburbRow,
} from "../../scripts/seed/lib/locality-lga";

const lga = data as unknown as LocalityLgaData;

// Manual check of every suburb in QLD postcodes 4305 and 4306 against the
// official QLD locality boundaries (slug, current_region, recommended_region, basis).
function loadReport() {
  const text = fs.readFileSync(path.join(__dirname, "../fixtures/lga-4305-4306-report.csv"), "utf8");
  return text
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [slug, current, recommended, basis] = [...line.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1]);
      const m = slug.match(/^(.*)-qld-(\d{4})$/)!;
      const name = m[1].split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
      return { slug, current, recommended, basis, name, postcode: m[2] };
    });
}

describe("locality-level LGA assignment", () => {
  it("puts Flinders View in Ipswich, not the postcode majority", () => {
    expect(resolveLocality(lga, "Flinders View", "QLD")).toMatchObject({ kind: "matched", lga: "Ipswich" });
  });

  it("agrees with the manual report wherever the basis is a single council", () => {
    const rows = loadReport().filter(
      (r) => r.basis.startsWith("QLD Locality Boundaries:") && r.recommended !== "(no bounded locality)",
    );
    expect(rows.length).toBeGreaterThan(60);
    const disagree = rows.filter((r) => {
      const res = resolveLocality(lga, r.name, "QLD", r.postcode);
      return res.kind !== "matched" || res.lga !== r.recommended;
    });
    expect(disagree.map((r) => r.slug)).toEqual([]);
  });

  it("applies the largest-share rule to split localities and agrees with the report", () => {
    const rows = loadReport().filter((r) => r.basis.startsWith("Split locality"));
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      const res = resolveLocality(lga, r.name, "QLD", r.postcode);
      expect(res.kind).toBe("matched");
      if (res.kind === "matched") {
        expect(res.split?.length).toBeGreaterThan(1);
        expect(res.lga).toBe(res.split![0][0]);
        expect(res.lga).toBe(r.recommended);
      }
    }
  });

  it("keeps the existing region when no locality matches and never uses the postcode", () => {
    const report = loadReport();
    const suburbs: SuburbRow[] = report.map((r) => ({
      slug: r.slug, name: r.name, state: "QLD", postcode: r.postcode, region: "Scenic Rim",
    }));
    const plan = planRegions(lga, suburbs);
    const changed = new Map(plan.changes.map((c) => [c.slug, c.to]));
    const unmatched = new Set(plan.unmatched.map((s) => s.slug));
    const unbounded = report.filter((x) => x.recommended === "(no bounded locality)");
    expect(unbounded.length).toBe(10);
    for (const r of unbounded) {
      expect(unmatched.has(r.slug)).toBe(true);
      expect(changed.has(r.slug)).toBe(false);
    }
    expect(changed.get("flinders-view-qld-4305")).toBe("Ipswich");
    // every suburb is either changed, already right, or left alone - none silently dropped
    expect(plan.changes.length + plan.unchanged + plan.unmatched.length + plan.ambiguous.length).toBe(report.length);
  });

  it("uses the council spellings the app already uses", () => {
    expect(appLgaName("Merri-bek")).toBe("Moreland");
    expect(appLgaName("Central Highlands (Qld)")).toBe("Central Highlands");
    expect(appLgaName("Unincorporated ACT")).toBeNull();
    expect(appLgaName("Ipswich")).toBe("Ipswich");
    expect(normaliseLocality("Newtown (Qld)")).toBe("newtown");
  });
});
