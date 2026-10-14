import { describe, expect, it } from "vitest";
import { availabilityNote, coverageFor, decideIntroduction, outcomeCopy } from "@/lib/introductions/rules";

describe("decideIntroduction: who we introduce, and when the team reviews first", () => {
  const seller = { service: "selling-agent" as const, state: "QLD" as const, suburb: "burpengary-qld-4505", timeframe: "0-3-months" as const, proStatus: "not-started" as const, introConsent: true };

  it("delivers a near-term seller in coverage who gave permission", () => {
    expect(decideIntroduction(seller)).toEqual({ action: "deliver" });
    expect(decideIntroduction({ ...seller, timeframe: "3-6-months", proStatus: "comparing" })).toEqual({ action: "deliver" });
  });

  it("never introduces without the permission tick", () => {
    expect(decideIntroduction({ ...seller, introConsent: false })).toMatchObject({ action: "not-introduced" });
  });

  it("never introduces a second agent to someone already signed", () => {
    expect(decideIntroduction({ ...seller, proStatus: "already-listed" })).toMatchObject({ action: "not-introduced", reason: expect.stringContaining("already") });
    expect(decideIntroduction({ service: "buyers-agent", introConsent: true, proStatus: "already-engaged", suburb: "bondi-nsw-2026", state: "NSW" })).toMatchObject({ action: "not-introduced" });
  });

  it("holds sellers more than six months out for the team (cold vendors are not passed on)", () => {
    for (const timeframe of ["6-12-months", "12-plus-months", "researching"] as const) {
      expect(decideIntroduction({ ...seller, timeframe })).toMatchObject({ action: "hold", reason: expect.stringContaining("six months") });
    }
  });

  it("holds a request with no suburb: there is no local agent to choose", () => {
    expect(decideIntroduction({ ...seller, suburb: null })).toMatchObject({ action: "hold", reason: expect.stringContaining("no suburb") });
  });

  it("reviews every buyer's agent request by hand while that network is being built", () => {
    expect(coverageFor("buyers-agent", "NSW")).toBe("reviewed");
    expect(decideIntroduction({ service: "buyers-agent", introConsent: true, suburb: "bondi-nsw-2026", state: "NSW", timeframe: "0-3-months", proStatus: "not-started" })).toMatchObject({ action: "hold" });
  });
});

describe("what people are told", () => {
  it("says 'sent' only for a delivered request, and names who contacts them and how", () => {
    const sent = outcomeCopy({ service: "selling-agent", status: "sent", areaLabel: "Burpengary, QLD 4505", contact: "sms" });
    expect(sent.headline).toContain("one selling agent");
    expect(sent.body).toContain("Burpengary, QLD 4505");
    expect(sent.body).toContain("by text message");
    expect(sent.body).toContain("within one business day");
    const held = outcomeCopy({ service: "selling-agent", status: "held", areaLabel: "Bondi, NSW 2026" });
    expect(held.headline).toBe("Our team has your request");
    expect(held.body).not.toMatch(/has your request\. They’ll contact/);
    expect(held.who).toContain("Our team first");
  });

  it("tells an already-signed seller we won't introduce anyone", () => {
    const c = outcomeCopy({ service: "selling-agent", status: "not-introduced", reason: "already signed with a selling agent" });
    expect(c.headline).toContain("won’t introduce");
    expect(c.who).toContain("Nobody");
  });

  it("describes buyer's agent availability honestly, without promising an introduction", () => {
    const note = availabilityNote("buyers-agent", "VIC");
    expect(note.level).toBe("reviewed");
    expect(note.text).toContain("can’t promise an introduction");
  });
});
