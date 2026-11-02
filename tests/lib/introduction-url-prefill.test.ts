import { describe, expect, it } from "vitest";
import { findAnExpertService, getHelpPrefill } from "@/lib/introductions/url-prefill";

const prefill = (qs: string) => getHelpPrefill(new URLSearchParams(qs));

describe("getHelpPrefill", () => {
  it("gives the page's plain form with no query string", () => {
    expect(prefill("")).toEqual({
      defaultService: null,
      defaultState: null,
      defaultTimeframe: null,
      defaultSuburb: null,
      source: "get-help",
    });
  });

  it("takes every valid parameter", () => {
    expect(prefill("service=buyers-agent&state=qld&timeframe=3-6-months&suburb=bondi-nsw-2026&from=plan")).toEqual({
      defaultService: "buyers-agent",
      defaultState: "QLD",
      defaultTimeframe: "3-6-months",
      defaultSuburb: "bondi-nsw-2026",
      source: "get-help-plan",
    });
  });

  it("drops values outside the sets", () => {
    expect(prefill("service=broker&state=XX&timeframe=soon&suburb=Bondi")).toEqual(prefill(""));
  });

  it("treats a repeated parameter as absent, as the server page did", () => {
    expect(prefill("service=both&service=buyers-agent").defaultService).toBeNull();
  });

  it("caps the source at 100 characters", () => {
    expect(prefill(`from=${"x".repeat(200)}`).source).toHaveLength(100);
  });
});

describe("findAnExpertService", () => {
  const service = (qs: string) => findAnExpertService(new URLSearchParams(qs));

  it("reads ?service= first, then the older ?intent=", () => {
    expect(service("service=both&intent=selling")).toBe("both");
    expect(service("intent=selling")).toBe("selling-agent");
    expect(service("intent=buying")).toBe("buyers-agent");
  });

  it("ignores anything else", () => {
    expect(service("")).toBeNull();
    expect(service("intent=refinancing")).toBeNull();
    expect(service("intent=constructor")).toBeNull();
  });
});
