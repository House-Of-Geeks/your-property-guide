// Fix item 4(b): the warm list drives scripts/seo/warm.mjs after every
// production deploy (the build is deliberately DB-free, so nothing is
// prerendered at build time). A malformed slug would waste the warm-up on
// 404s, so the list is checked here.
import { describe, expect, it } from "vitest";
import prebuild from "@/lib/data/prebuild-suburbs.json";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*-(nsw|vic|qld|wa|sa|tas|nt|act)-\d{4}$/;

describe("warm-up suburb list", () => {
  it("has at least 100 entries, all unique", () => {
    expect(prebuild.slugs.length).toBeGreaterThanOrEqual(100);
    expect(new Set(prebuild.slugs).size).toBe(prebuild.slugs.length);
  });
  it("every entry is a suburb profile slug", () => {
    for (const s of prebuild.slugs) expect(s, s).toMatch(SLUG);
  });
  it("starts with the pages that carry the most impressions", () => {
    expect(prebuild.slugs.slice(0, 4)).toEqual(["surfers-paradise-qld-4217", "morayfield-qld-4506", "buderim-qld-4556", "toorak-vic-3142"]);
  });
});
