// Commercial-intent review 10 Oct 2026, buying 3.2: the queries Google tests
// the conveyancing guide on are per state ("conveyancing fees wa", "darwin
// conveyancing cost"), so the other states get an H2 each, and the PAA "Who
// is cheaper, solicitor or conveyancer?" is answered from the fee data.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CONVEYANCING_FEES } from "@/lib/data/conveyancing-fees";

const src = fs.readFileSync(path.resolve(__dirname, "../../src/app/(marketing)/guides/conveyancing-guide/page.tsx"), "utf8");

describe("/guides/conveyancing-guide", () => {
  it("has one H2 per smaller state, each in the TOC", () => {
    for (const id of ["cost-wa", "cost-sa", "cost-tas", "cost-act", "cost-nt"]) {
      expect(src).toContain(`<h2 id="${id}">`);
      expect(src).toContain(`{ id: "${id}",`);
    }
  });
  it("answers who is cheaper from the published averages, with source and date", () => {
    expect(src).toContain('question: "Who is cheaper, solicitor or conveyancer?"');
    expect(src).toContain("OpenAgent, updated 17 September 2026");
    expect(Object.values(CONVEYANCING_FEES).filter((f) => f.average).length).toBeGreaterThanOrEqual(2);
  });
});
