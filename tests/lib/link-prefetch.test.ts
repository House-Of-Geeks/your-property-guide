import { describe, expect, it } from "vitest";
import { linkPrefetch } from "@/lib/link-prefetch";

describe("linkPrefetch", () => {
  it.each([
    "/search",
    "/get-help",
    "/get-help?service=buyers-agent",
    "/get-help#how-we-choose",
    "/find-an-expert?intent=refinancing",
    "/sitemap",
    "/suburbs",
    "/suburbs?state=NSW",
    "/dashboard",
    "/dashboard/login",
  ])("turns prefetch off for %s", (href) => {
    expect(linkPrefetch(href)).toBe(false);
  });

  it.each(["/suburbs/bondi-nsw-2026", "/searching", "/sitemap.xml", "/get-help-now", "/guides", "/"])(
    "leaves the default for %s",
    (href) => {
      expect(linkPrefetch(href)).toBeUndefined();
    },
  );
});
