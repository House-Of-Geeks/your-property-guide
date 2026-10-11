// Commercial-intent review 10 Oct 2026, buying 0.1 row 16: the LMI guide and
// the deposit guide printed hand-typed LMI ranges ($22,000 to $28,000 at 95%
// on $700,000) that our own /lmi-calculator table contradicts ($30,676). Both
// pages now compute every LMI figure from src/lib/lmi-calc.ts and cite it.
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("server-only", () => ({}));

import { LMI_RATE_SOURCE, computeLmi, premiumAt } from "@/lib/lmi-calc";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const render = async (path: string) => {
  const mod = await import(`../../src/app/(marketing)/guides/${path}/page`);
  return renderToStaticMarkup(createElement(mod.default)).replace(/&#x27;|&rsquo;/g, "'");
};

describe("/guides/lenders-mortgage-insurance-guide", () => {
  it("prints the calculator table's premiums, its source and date, and none of the old ranges", async () => {
    const html = await render("lenders-mortgage-insurance-guide");
    expect(premiumAt(700_000, 5)).toBe(30_676);
    for (const p of [400_000, 500_000, 700_000, 1_000_000]) for (const d of [5, 10, 15]) expect(html).toContain(fmt(premiumAt(p, d)!));
    const onLoan = (loan: number, lvr: number) =>
      computeLmi({ price: Math.round(loan / (lvr / 100)), mode: "loan", loan, deposit: 0, state: "NSW", firstHomeBuyer: false }).premium;
    expect(html).toContain(fmt(onLoan(500_000, 90)));
    expect(html).toContain(fmt(onLoan(700_000, 95)));
    expect(html).toContain(LMI_RATE_SOURCE.url);
    expect(html).toContain(LMI_RATE_SOURCE.dated);
    for (const old of ["$22,000 to $28,000", "$32,000 to $40,000", "~$22K", "roughly doubles", "around $18,000"]) expect(html, old).not.toContain(old);
  }, 30_000);
});

describe("/guides/how-much-deposit-to-buy-a-house", () => {
  it("prints the calculator table's premiums, its source, and none of the old ranges", async () => {
    const html = await render("how-much-deposit-to-buy-a-house");
    for (const p of [400_000, 500_000, 600_000, 700_000, 800_000, 1_000_000]) for (const d of [5, 10]) expect(html).toContain(fmt(premiumAt(p, d)!));
    expect(html).toContain(LMI_RATE_SOURCE.url);
    expect(html).toContain("What is a 5% deposit on a $600,000 house?");
    expect(html).toContain("How much deposit do I need for a $700,000 house?");
    for (const old of ["$15,000 to $25,000", "$20,000 to $25,000", "about $18,000 in NSW", "23% to 25%"]) expect(html, old).not.toContain(old);
  }, 30_000);
});
