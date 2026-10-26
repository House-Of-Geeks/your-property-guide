import { describe, expect, it } from "vitest";
import { showFooterFollowOnGoogle } from "@/lib/follow-on-google-routes";

describe("showFooterFollowOnGoogle", () => {
  it.each([
    "/guides",
    "/guides/",
    "/guides/category/news",
    "/about",
    "/privacy",
    "/terms",
  ])("is on for %s", (path) => {
    expect(showFooterFollowOnGoogle(path)).toBe(true);
  });

  it.each([
    "/",
    "/index",
    "/appraisal",
    "/agreement-check",
    "/get-help",
    "/get-help/thanks",
    "/find-an-expert",
    "/property-valuation",
    "/contact",
    "/feedback",
    "/plan",
    "/buying-guide",
    "/selling-guide",
    "/find-your-suburb",
    "/unsubscribed",
    "/mortgage-calculator",
    "/tools",
    "/tools/agent-proposal-worksheet",
    "/real-estate-leads",
    "/real-estate-leads/thanks",
    "/guidesx",
    "/guides/stamp-duty-nsw",
    "/guides/adelaide-property-market-2026",
    "/guides/stamp-duty-nsw/",
    "/about-us",
    "/privacy-policy",
  ])("is off for %s", (path) => {
    expect(showFooterFollowOnGoogle(path)).toBe(false);
  });

  it("is off without a pathname", () => {
    expect(showFooterFollowOnGoogle(null)).toBe(false);
    expect(showFooterFollowOnGoogle(undefined)).toBe(false);
  });
});
