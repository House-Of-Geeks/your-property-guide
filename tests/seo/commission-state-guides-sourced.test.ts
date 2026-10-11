// The eight state commission guides take every rate from the sourced table
// (commercial-intent review, 10 Oct 2026, selling 0.1, P1 and P5).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StateCommissionTable, NationalCommissionTable } from "@/components/guide/CommissionRateTable";
import { COMMISSION_AS_AT, COMMISSION_SOURCES, NO_PUBLISHED_RANGE, STATE_COMMISSION, STATE_ORDER, STATE_RATES, pct } from "@/lib/data/commission-rates";

const guide = (st: string) => readFileSync(`src/app/(marketing)/guides/real-estate-commission-${st.toLowerCase()}/page.tsx`, "utf8");

describe("state commission guides", () => {
  for (const st of STATE_ORDER) {
    it(`${st}: renders the sourced table, links up to the national guide, and cites deep links, not home pages`, () => {
      const src = guide(st);
      expect(src).toContain(`<StateCommissionTable state="${st}"`);
      expect(src).toContain(`STATE_RATES.${st}`);
      expect(src).toContain(`commissionSourceItems(stateSources("${st}"))`);
      expect(src).toContain('<Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>');
      expect(src).not.toMatch(/href: "https:\/\/moneysmart\.gov\.au\/"/);
      expect(src).not.toMatch(/typical market figures/);
      // No rate table typed by hand.
      expect(src).not.toMatch(/<tr><td>\$600,000<\/td><td>\$/);
    });
  }

  it("keep the descriptions inside 160 characters and in step with the sourced range", () => {
    // FRONTMATTER stays a plain literal (scripts/guides/static-guide-manifest.ts reads it), so this test catches drift.
    for (const st of STATE_ORDER) {
      const d = /^  description:\n    "([^"]+)",$/m.exec(guide(st))?.[1];
      expect(d, st).toBeDefined();
      expect(d!.length, st).toBeLessThanOrEqual(160);
      expect(d, st).toContain(`${pct(STATE_RATES[st].low)} to ${pct(STATE_RATES[st].high)}`);
    }
  });
});

describe("StateCommissionTable", () => {
  for (const st of STATE_ORDER) {
    it(`${st}: every published figure is footnoted, the as-at date and the rule are printed, and gaps say so`, () => {
      const html = renderToStaticMarkup(createElement(StateCommissionTable, { state: st, price: 800_000 }));
      const s = STATE_COMMISSION[st];
      expect(html).toContain(`As at ${COMMISSION_AS_AT}`);
      expect(html).toContain(pct(s.capital.rate));
      expect(html).toContain(pct(s.median));
      for (const r of s.regions) expect(html).toContain(r.name);
      expect(html).toContain(`[${COMMISSION_SOURCES[s.openAgent].n}]`);
      expect(html).toContain(`[${COMMISSION_SOURCES.bright.n}]`);
      for (const k of s.ruleSources) expect(html).toContain(COMMISSION_SOURCES[k].href.replace(/&/g, "&amp;"));
      if (s.regions.length === 0) expect(html).toContain("No published figure");
    });
  }
});

describe("NationalCommissionTable", () => {
  it("prints all eight states with GST figures and the footnotes it uses", () => {
    const html = renderToStaticMarkup(createElement(NationalCommissionTable, {}));
    for (const st of STATE_ORDER) expect(html).toContain(`/guides/real-estate-commission-${st.toLowerCase()}`);
    expect(html).toContain("with GST");
    expect(html).toContain(NO_PUBLISHED_RANGE);
    expect(html).toContain(COMMISSION_SOURCES["ato-gst"].href);
    expect(html).toContain(`As at ${COMMISSION_AS_AT}`);
  });
});

describe("agency agreement sections (review 10 Oct 2026, selling P5)", () => {
  it("every state guide says what its agreement must state about commission and links the agreements and flat fee guides", () => {
    for (const st of STATE_ORDER) {
      const src = guide(st);
      expect(src).toContain('<h2 id="agreement">What your agency agreement must say about commission</h2>');
      expect(src).toContain('{ id: "agreement",');
      expect(src).toContain('<Link href="/guides/real-estate-agency-agreements-by-state">agency agreements by state</Link>');
      expect(src).toContain('<Link href="/guides/fixed-fee-vs-commission-real-estate-agents">flat fee agents</Link>');
    }
  });
});
