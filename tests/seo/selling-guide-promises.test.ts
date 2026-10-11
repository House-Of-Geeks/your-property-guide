// /selling-guide and its thanks flow (commercial-intent review, 10 Oct 2026, selling 0.10;
// review 0.2 item 11): no saving promise, no "top" agent, no response-time promise,
// ranges from the shared data.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const files = {
  page: "src/app/(marketing)/selling-guide/page.tsx",
  thanks: "src/app/(marketing)/selling-guide/thanks/page.tsx",
  extras: "src/components/journey/GuideThanksExtras.tsx",
  band: "src/components/journey/GuideBandSwitcher.tsx",
};
const read = (f: string) => readFileSync(f, "utf8");

describe("selling guide promises", () => {
  it("makes no saving, result, 'top agent' or response-time promise", () => {
    for (const f of Object.values(files)) {
      const src = read(f);
      expect(src, f).not.toMatch(/typically saves|five figures|\$20,000\+|3 to 10 ?(times|x)|top local agent|within one business day|3 to 5 percent|90 percent/i);
    }
  });
  it("shows the saving as a sum and takes its ranges from the shared data", () => {
    const src = read(files.page);
    expect(src).toContain("const SAVING_EXAMPLE = Math.round((EXAMPLE_SALE * 0.2) / 100);");
    expect(Math.round((850_000 * 0.2) / 100)).toBe(1_700);
    expect(src).toContain("nationalSellingCost(800_000)");
    expect(src).toContain("one local agent who sells in your area");
    // The #57 fee disclosure stays.
    expect(src).toContain("The agent pays us a fee for each introduction, whether or not you list with them.");
    expect(read(files.band)).toContain("nationalSellingCost(800_000)");
  });
});
