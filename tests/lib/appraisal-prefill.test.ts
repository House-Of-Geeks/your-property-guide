// The instant price range on /appraisal and /property-valuation hands the
// chosen suburb and dwelling to the appraisal form through the page's query
// string (?suburb=&type=). The form reads only known property types.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { appraisalPrefillHref, appraisalTypeParam } from "@/lib/appraisal-prefill";

describe("appraisalTypeParam", () => {
  it("passes the range's two dwellings and every form type, and drops anything else", () => {
    expect(appraisalTypeParam("house")).toBe("house");
    expect(appraisalTypeParam("unit")).toBe("unit");
    expect(appraisalTypeParam("townhouse")).toBe("townhouse");
    expect(appraisalTypeParam("castle")).toBe("");
    expect(appraisalTypeParam(null)).toBe("");
    expect(appraisalTypeParam(undefined)).toBe("");
  });
});

describe("appraisalPrefillHref", () => {
  it("sets suburb and type, keeping other params and the hash", () => {
    expect(appraisalPrefillHref("https://x.test/appraisal?from=agents#appraisal-form", "paddington-qld-4064", "unit")).toBe(
      "https://x.test/appraisal?from=agents&suburb=paddington-qld-4064&type=unit#appraisal-form",
    );
    expect(appraisalPrefillHref("https://x.test/appraisal?suburb=a&type=house", "b", "unit")).toBe(
      "https://x.test/appraisal?suburb=b&type=unit",
    );
  });
});

describe("the form and the range use it", () => {
  const read = (f: string) => fs.readFileSync(f, "utf8");
  it("AppraisalForm reads ?type= through the helper and has no 'Any' type default", () => {
    const form = read("src/components/forms/AppraisalForm.tsx");
    expect(form).toContain('appraisalTypeParam(searchParams.get("type"))');
    expect(form).not.toMatch(/placeholder="Any"/);
  });
  it("SuburbValueRange writes the query only beside a form on the page (after=\"link\")", () => {
    const range = read("src/components/journey/SuburbValueRange.tsx");
    expect(range).toContain("appraisalPrefillHref(");
    expect(range).toMatch(/if \(after !== "link"\) return;/);
  });
});
