// Fix item 8, NT pilot: the calculator embed and the retitle, on the NT guide only.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { CommissionCalculatorEmbed } from "../../src/components/guide/CommissionCalculatorEmbed";
import { STATE_RATES } from "../../src/lib/data/commission-rates";

const STATES = ["nsw", "vic", "qld", "sa", "wa", "tas", "act", "nt"];
const guide = (st: string) => readFileSync(`src/app/(marketing)/guides/real-estate-commission-${st}/page.tsx`, "utf8");
const title = (src: string) => /title: "([^"]+)"/.exec(src)![1];

describe("calculator embed", () => {
  const html = renderToStaticMarkup(createElement(CommissionCalculatorEmbed, { state: "NT" }));
  it("is the imported calculator preset to the state's typical rate and the guide's example price", () => {
    expect(html).toContain('id="calculator"');
    expect(html).toContain(`value="${STATE_RATES.NT.typical}"`);
    expect(html).toContain('value="800000"');
    expect(html).toMatch(/<option[^>]*selected[^>]*value="NT"|<option[^>]*value="NT"[^>]*selected/);
    expect(html).toContain("Typical in NT");
  });
  it("carries no schema of its own and no competing lead CTA; links to the full calculator", () => {
    expect(html).not.toContain("WebApplication");
    expect(html).not.toContain("application/ld+json");
    expect(html).not.toContain("Get the free selling guide");
    expect(html).toContain('href="/real-estate-commission-calculator"');
  });
  it("keeps the calculator's own headings below the guide's h2", () => {
    expect(html).toContain("<h3");
    expect((html.match(/<h2/g) ?? []).length).toBe(1);
  });
});

describe("pilot cohort", () => {
  it("only the NT guide carries the new title, keeping its core phrase, under 60 characters", () => {
    const retitled = STATES.filter((st) => /: Rates, Fees & Calculator"/.test(guide(st)));
    expect(retitled).toEqual(["nt"]);
    const t = title(guide("nt"));
    expect(t).toBe("Real Estate Commission NT 2026: Rates, Fees & Calculator");
    expect(t.startsWith("Real Estate Commission NT")).toBe(true);
    expect(t.length).toBeLessThanOrEqual(60);
  });
  it("only the NT guide embeds the calculator during the pilot", () => {
    const embedded = STATES.filter((st) => guide(st).includes("<CommissionCalculatorEmbed"));
    expect(embedded).toEqual(["nt"]);
  });
  it("the other seven titles are unchanged", () => {
    for (const st of STATES.filter((s) => s !== "nt")) expect(title(guide(st))).toMatch(/^Real Estate Commission [A-Z]+: Average Rates & Agent Fees \(2026\)$/);
  });
});
