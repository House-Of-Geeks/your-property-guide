// Fix item 8: the commission calculator embed and the retitle on the eight state
// commission guides. NT was the pilot (8 Sep 2026, PR #23); the other seven
// followed on 30 Sep 2026 with the capital city in the heading.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { CommissionCalculatorEmbed } from "../../src/components/guide/CommissionCalculatorEmbed";
import { STATE_RATES, type StateCode } from "../../src/lib/data/commission-rates";
import { EXAMPLE_PRICE } from "../../src/lib/data/selling-costs";

const STATES = Object.keys(STATE_RATES) as StateCode[];
const CAPITALS: Record<StateCode, string> = {
  NSW: "Sydney", VIC: "Melbourne", QLD: "Brisbane", SA: "Adelaide", WA: "Perth", TAS: "Hobart", ACT: "Canberra", NT: "Darwin",
};
// The seven rolled out on 30 Sep carry the capital; NT keeps its pilot title.
const ROLLOUT = STATES.filter((st) => st !== "NT");
// "About 65" characters before the " | Your Property Guide" suffix: the city
// fits in every title at this budget, and the fuller "{City} & {State}" form
// goes in the h1 instead.
const TITLE_BUDGET = 67;

const guide = (st: StateCode) => readFileSync(`src/app/(marketing)/guides/real-estate-commission-${st.toLowerCase()}/page.tsx`, "utf8");
const field = (src: string, key: string) => new RegExp(`^  ${key}: "([^"]+)",$`, "m").exec(src)?.[1];
const description = (src: string) => /^  description:\n    "([^"]+)",$/m.exec(src)?.[1];
const firstTldr = (src: string) => /^const TLDR = \[\n  "([^"]+)",$/m.exec(src)?.[1];

describe("calculator embed", () => {
  for (const st of STATES) {
    describe(st, () => {
      const html = renderToStaticMarkup(createElement(CommissionCalculatorEmbed, { state: st }));
      it("is the imported calculator preset to the state's typical rate and the guide's example price", () => {
        expect(html).toContain('id="calculator"');
        expect(html).toContain(`value="${STATE_RATES[st].typical}"`);
        expect(html).toContain(`value="${EXAMPLE_PRICE[st]}"`);
        expect(html).toMatch(new RegExp(`<option[^>]*selected[^>]*value="${st}"|<option[^>]*value="${st}"[^>]*selected`));
        expect(html).toContain(`Typical in ${st}`);
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
  }
});

describe("rollout cohort", () => {
  it("every state guide embeds the calculator for its own state, first in the TOC", () => {
    for (const st of STATES) {
      const src = guide(st);
      expect(src).toContain(`<CommissionCalculatorEmbed state="${st}" />`);
      expect(src).toMatch(/const TOC: GuideTOCEntry\[\] = \[\n  \{ id: "calculator",/);
    }
  });
  it("every title follows the pilot pattern, keeps its core phrase first and stays inside the budget", () => {
    for (const st of STATES) {
      const t = field(guide(st), "title")!;
      expect(t.startsWith(`Real Estate Commission ${st} 2026: `)).toBe(true);
      expect(t.endsWith("Rates, Fees & Calculator")).toBe(true);
      expect(t.length).toBeLessThanOrEqual(TITLE_BUDGET);
    }
  });
  it("the seven rolled-out guides name the capital in the title, the h1, the description and the first sentence", () => {
    for (const st of ROLLOUT) {
      const src = guide(st);
      const city = CAPITALS[st];
      expect(field(src, "title")).toBe(`Real Estate Commission ${st} 2026: ${city} Rates, Fees & Calculator`);
      expect(field(src, "h1")).toBe(`Real Estate Commission ${st} 2026: ${city} & ${st} Rates, Fees & Calculator`);
      expect(description(src)).toContain(city);
      expect(description(src)).toContain(`a calculator preset to the ${st} rate`);
      expect(firstTldr(src)).toContain(city);
      expect(field(src, "updatedAt")).toBe("2026-09-30");
    }
  });
  it("NT keeps the pilot title with no h1 override", () => {
    const src = guide("NT");
    expect(field(src, "title")).toBe("Real Estate Commission NT 2026: Rates, Fees & Calculator");
    expect(field(src, "h1")).toBeUndefined();
  });
  it("the layout renders h1 when a guide sets it and falls back to the title", () => {
    const layout = readFileSync("src/components/guide/GuideArticleLayout.tsx", "utf8");
    expect(layout).toContain("const heading = frontmatter.h1 ?? frontmatter.title;");
    expect(layout).toMatch(/<h1[^>]*>\s*\{heading\}\s*<\/h1>/);
  });
});

describe("national fees guide", () => {
  it("answers the People-also-ask question in its own words, with a figure and a named source", () => {
    const src = readFileSync("src/app/(marketing)/guides/real-estate-agent-fees-australia/page.tsx", "utf8");
    const m = /question: "Do real estate agents get paid if the house doesn't sell\?",\n    answer:\n      "([^"]+)",/.exec(src);
    expect(m).not.toBeNull();
    const answer = m![1];
    expect(answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    expect(answer).toMatch(/\$[0-9,]+/);
    expect(answer).toContain("Property and Stock Agents Act 2002");
  });
});
