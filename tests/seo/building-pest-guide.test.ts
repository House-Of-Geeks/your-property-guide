// Commercial-intent review 10 Oct 2026, buying 3.5: every inspection cost
// page that ranks is one city, so the guide answers each big capital under
// its own H3 from the sourced price data, and answers the PAA "What is the
// biggest red flag in a home inspection?".
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("server-only", () => ({}));

import { cityCosts, formatCostRange } from "@/lib/data/inspection-costs";

describe("/guides/building-pest-inspection", () => {
  it("has a sourced H3 per big capital and the red-flag answer", async () => {
    const mod = await import("../../src/app/(marketing)/guides/building-pest-inspection/page");
    const html = renderToStaticMarkup(createElement(mod.default)).replace(/&#x27;|&rsquo;/g, "'");
    for (const city of ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]) {
      expect(html).toContain(`<h3>Building and pest inspection cost in ${city}</h3>`);
      expect(html).toContain(formatCostRange(cityCosts(city).combined.house, "prose"));
    }
    expect(html).toContain("What is the biggest red flag in a home inspection?");
  }, 30_000);
});
