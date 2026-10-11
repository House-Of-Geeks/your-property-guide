// The suburb template's state-labelled links go to the state guides (buying
// 3.1 and 3.3 of the commercial intent review, 10 Oct 2026).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { buyingLinksForState, sellingLinksForState } from "@/components/suburb/SuburbContextualLinks";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

describe("state-labelled links on the suburb profile", () => {
  it("First home buyer guide, {STATE} goes to /guides/first-home-buyer-{state}", () => {
    for (const state of STATES) {
      const link = buyingLinksForState(state).find((l) => l.label.startsWith("First home buyer guide"));
      expect(link).toEqual({ label: `First home buyer guide, ${state}`, href: `/guides/first-home-buyer-${state.toLowerCase()}` });
    }
  });
  it("{STATE} stamp duty calculator goes to /guides/stamp-duty-{state}", () => {
    for (const state of STATES) {
      const link = buyingLinksForState(state).find((l) => /stamp duty/i.test(l.label));
      expect(link).toEqual({ label: `${state} stamp duty calculator`, href: `/guides/stamp-duty-${state.toLowerCase()}` });
    }
  });
  it("every state-labelled link names its state and lands on a page that exists", () => {
    for (const state of STATES) {
      for (const l of [...buyingLinksForState(state), ...sellingLinksForState(state)]) {
        if (!l.label.includes(state)) continue;
        expect(l.href, l.label).toContain(state.toLowerCase());
        expect(fs.existsSync(`src/app/(marketing)${l.href}/page.tsx`), l.href).toBe(true);
      }
    }
  });
  it("without a known state, the national pages and no state label", () => {
    for (const state of [undefined, "", "XX"]) {
      const links = buyingLinksForState(state);
      expect(links.find((l) => l.label === "First home buyer guide")?.href).toBe("/guides/first-home-buyer-guide");
      expect(links.find((l) => l.label === "Stamp duty calculator")?.href).toBe("/stamp-duty-calculator");
    }
  });
});
