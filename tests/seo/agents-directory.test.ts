// /agents and /agents/[slug] (owner decision, 10 Oct 2026): the listed agents
// are real and stay; the pages make no vetting, featuring or rating claim
// the site cannot back, and the profile meta agrees with the page.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import type { Agent } from "@/types/agent";
import { agentMetaDescription, showsRating, showsSalesTotal, suburbNameFromSlug } from "@/app/(marketing)/agents/agent-meta";

const thomson = {
  id: "a1", slug: "matthew-thomson", firstName: "Matthew", lastName: "Thomson", fullName: "Matthew Thomson",
  title: "Director", phone: "0400 000 000", email: "m@example.com", bio: "", image: "", agencyId: "ag1",
  agencyName: "Thomson Property Group",
  suburbs: ["burpengary-qld-4505", "caboolture-qld-4510", "narangba-qld-4504", "morayfield-qld-4506", "north-lakes-qld-4509"],
  specialties: [], yearsExperience: 20, propertiesSold: 0, reviewCount: 0, averageRating: 0, isFeatured: true,
} as Agent;

describe("agent profile meta description", () => {
  it("names the suburbs, prints no sales count and stays inside 160 characters", () => {
    const d = agentMetaDescription(thomson);
    expect(d).toContain("Burpengary");
    expect(d).toContain("North Lakes");
    expect(d).not.toMatch(/qld-\d{4}/);
    expect(d).not.toMatch(/sold|sales|\bbest\b|top|vetted|trusted|featured|rating/i);
    expect(d.length).toBeLessThanOrEqual(160);
  });
  it("shortens a long suburb list rather than running over", () => {
    const many = { ...thomson, suburbs: Array.from({ length: 30 }, (_, i) => `suburb-number-${i}-qld-4500`) };
    const d = agentMetaDescription(many);
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d).toContain("and nearby suburbs");
  });
  it("turns slugs into names", () => {
    expect(suburbNameFromSlug("north-lakes-qld-4509")).toBe("North Lakes");
  });
});

describe("rating and sales total", () => {
  it("hides a rating with no reviews and a sales total of 0", () => {
    expect(showsRating(thomson)).toBe(false);
    expect(showsSalesTotal(thomson)).toBe(false);
    expect(showsRating({ reviewCount: 3, averageRating: 4.7 })).toBe(true);
    expect(showsSalesTotal({ propertiesSold: 12 })).toBe(true);
  });
});

describe("the directory pages make no vetting, featuring or rating claim", () => {
  const dir = "src/app/(marketing)/agents";
  const files = ["page.tsx", "Results.tsx", "AgentListCard.tsx", "[slug]/page.tsx"].map((f) => `${dir}/${f}`);
  it("no 'vetted', 'trusted' or 'Featured Agent' wording, and not the shared card", () => {
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8").replace(/^\s*\/\/.*$/gm, "");
      expect(src, f).not.toMatch(/vetted|trusted|Featured Agent/i);
      expect(src, f).not.toMatch(/components\/agent\/AgentCard/);
      expect(src, f).not.toMatch(/agentDescription\(/);
    }
  });
  it("the card prints a rating only through showsRating", () => {
    const card = fs.readFileSync(`${dir}/AgentListCard.tsx`, "utf8");
    expect(card).toMatch(/showsRating\(agent\) &&/);
    expect(card).not.toMatch(/isFeatured/);
  });
});
