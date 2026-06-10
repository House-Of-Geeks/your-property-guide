import { describe, it, expect } from "vitest";
import { buildAcTags, buildAcFieldValues } from "@/lib/activecampaign";
import type { LeadEmailData } from "@/lib/lead-emails";

const lead = (overrides: Partial<LeadEmailData> = {}): LeadEmailData => ({
  type: "guide-download",
  firstName: "Sarah",
  email: "sarah@example.com",
  suburb: "burpengary-qld-4505",
  propertyType: "house",
  bedrooms: "4",
  sellingTimeframe: "0-3-months",
  agentStatus: "comparing",
  motivation: "Downsizing",
  priceExpectation: "$750k to $1m",
  marketingConsent: true,
  source: "selling-guide-page",
  ...overrides,
});

describe("buildAcTags", () => {
  it("tags a consented HOT lead for automations", () => {
    expect(buildAcTags(lead(), "HOT")).toEqual([
      "ypg-seller",
      "ypg-score-hot",
      "ypg-timeframe-0-3-months",
      "ypg-agent-comparing",
      "ypg-consented",
    ]);
  });

  it("tags non-consented leads so automations can suppress marketing", () => {
    const tags = buildAcTags(lead({ marketingConsent: false }), "HOT");
    expect(tags).toContain("ypg-no-consent");
    expect(tags).not.toContain("ypg-consented");
  });

  it("DO-NOT-CONTACT score flows through as a tag", () => {
    expect(buildAcTags(lead({ agentStatus: "already-listed" }), "DO-NOT-CONTACT")).toContain(
      "ypg-score-do-not-contact",
    );
  });
});

describe("buildAcFieldValues", () => {
  it("maps qualification answers to human-readable field values", () => {
    const v = buildAcFieldValues(lead(), "HOT");
    expect(v.sellingTimeframe).toBe("Within 3 months");
    expect(v.agentStatus).toBe("Comparing agents now");
    expect(v.suburb).toBe("burpengary-qld-4505");
    expect(v.leadScore).toBe("HOT");
    expect(v.leadSource).toBe("selling-guide-page");
  });

  it("empty answers come through as empty strings (filtered before send)", () => {
    const v = buildAcFieldValues(lead({ motivation: undefined, priceExpectation: undefined }), "COLD");
    expect(v.motivation).toBe("");
    expect(v.priceExpectation).toBe("");
  });
});
