// Commercial-intent review, 10 Oct 2026, selling 0.1 and 0.3: the commission
// ranges had no source and no as-at date, and pages gave five different
// national ranges. Every figure now comes from one sourced table.
import { describe, expect, it } from "vitest";
import {
  COMMISSION_AS_AT,
  COMMISSION_SOURCES,
  COMMISSION_SOURCE_LIST,
  NO_PUBLISHED_RANGE,
  STATE_COMMISSION,
  STATE_ORDER,
  STATE_RATES,
  capitalCell,
  medianCell,
  nationalRange,
  nationalRangeText,
  pct,
  publishedFigures,
  regionalCell,
  regionalRange,
  ruleCell,
  stateAverageCell,
  stateSources,
  type CommissionSourceKey,
} from "@/lib/data/commission-rates";
import { MARKETING, nationalSellingCost, sellingCostTable } from "@/lib/data/selling-costs";

describe("commission sources", () => {
  it("number every source once, in order, each with a named publisher, a deep link and a date", () => {
    const ns = COMMISSION_SOURCE_LIST.map((s) => s.n);
    expect(ns).toEqual(ns.map((_, i) => i + 1));
    for (const s of COMMISSION_SOURCE_LIST) {
      expect(s.href).toMatch(/^https:\/\/[^/]+\/./);
      expect(s.label.length).toBeGreaterThan(20);
      expect(s.date).toMatch(/20\d\d/);
    }
    expect(COMMISSION_AS_AT).toMatch(/^\d{1,2} [A-Z][a-z]+ 20\d\d$/);
  });

  it("cite the regulator or the legislation for every state's rule, not a home page", () => {
    for (const st of STATE_ORDER) {
      const keys = STATE_COMMISSION[st].ruleSources;
      expect(keys.length).toBeGreaterThan(0);
      for (const k of keys) expect(new URL(COMMISSION_SOURCES[k].href).pathname.length).toBeGreaterThan(1);
    }
  });
});

describe("state commission table", () => {
  it("has a capital average, a state average and a median for all eight states, each from its OpenAgent page", () => {
    expect(STATE_ORDER).toHaveLength(8);
    for (const st of STATE_ORDER) {
      const s = STATE_COMMISSION[st];
      expect(s.state).toBe(st);
      expect(s.capital.href).toContain(`openagent.com.au/real-estate-agents/${st.toLowerCase()}/`);
      expect(COMMISSION_SOURCES[s.openAgent].href).toBe(`https://www.openagent.com.au/real-estate-agents/${st.toLowerCase()}`);
      for (const r of s.regions) expect(r.href).toContain(`/real-estate-agents/${st.toLowerCase()}/`);
      for (const v of publishedFigures(st)) {
        expect(v).toBeGreaterThan(1);
        expect(v).toBeLessThan(4);
      }
    }
  });

  it("derives STATE_RATES from the published figures: lowest to highest, typical is the state average", () => {
    for (const st of STATE_ORDER) {
      const figures = publishedFigures(st);
      expect(STATE_RATES[st]).toEqual({ low: Math.min(...figures), high: Math.max(...figures), typical: STATE_COMMISSION[st].stateAverage });
      expect(STATE_RATES[st].typical).toBeGreaterThanOrEqual(STATE_RATES[st].low);
      expect(STATE_RATES[st].typical).toBeLessThanOrEqual(STATE_RATES[st].high);
    }
  });

  it("footnotes every cell, and says so where no regional figure is published", () => {
    const valid = new Set(COMMISSION_SOURCE_LIST.map((s) => s.n));
    for (const st of STATE_ORDER) {
      for (const cell of [capitalCell(st), stateAverageCell(st), medianCell(st), ruleCell(st)]) {
        expect(cell.refs.length).toBeGreaterThan(0);
        for (const n of cell.refs) expect(valid.has(n)).toBe(true);
      }
      const reg = regionalCell(st);
      if (regionalRange(st)) expect(reg.refs.length).toBeGreaterThan(0);
      else expect(reg).toEqual({ text: NO_PUBLISHED_RANGE, refs: [] });
      expect(stateSources(st).map((s) => s.n)).toContain(COMMISSION_SOURCES.bright.n);
    }
    expect(regionalCell("ACT").text).toBe(NO_PUBLISHED_RANGE);
    expect(regionalCell("NT").text).toBe(NO_PUBLISHED_RANGE);
  });

  it("prints figures as published", () => {
    expect(pct(1.64)).toBe("1.64%");
    expect(pct(2.1)).toBe("2.1%");
    expect(pct(3)).toBe("3%");
  });
});

describe("national figures", () => {
  it("come from the state table, so no page can give a different national range", () => {
    const n = nationalRange();
    const all = STATE_ORDER.flatMap(publishedFigures);
    expect(n.low).toBe(Math.min(...all));
    expect(n.high).toBe(Math.max(...all));
    expect(nationalRangeText()).toBe(`${pct(n.low)} to ${pct(n.high)}`);
    const averages = STATE_ORDER.map((s) => STATE_COMMISSION[s].stateAverage);
    expect(n.averageLow).toBe(Math.min(...averages));
    expect(n.averageHigh).toBe(Math.max(...averages));
    expect(n.lowWhere.length).toBeGreaterThan(0);
    expect(n.highWhere.length).toBeGreaterThan(0);
  });

  it("works the national cost of selling at $800,000 from every state's table", () => {
    const c = nationalSellingCost(800_000);
    const tables = STATE_ORDER.map((s) => sellingCostTable(s, 800_000));
    expect(c.low).toBe(Math.min(...tables.map((t) => t.totalLow)));
    expect(c.high).toBe(Math.max(...tables.map((t) => t.totalHigh)));
    expect(c.highWithGst).toBeGreaterThan(c.high);
    expect(MARKETING.low).toBeLessThan(MARKETING.high);
  });
});

// A key the type system would accept but the table never uses would be a dead source.
it("uses every commission source somewhere", () => {
  const used = new Set<CommissionSourceKey>(["bright", "ato-gst"]);
  for (const st of STATE_ORDER) {
    used.add(STATE_COMMISSION[st].openAgent);
    for (const k of STATE_COMMISSION[st].ruleSources) used.add(k);
  }
  expect([...used].sort()).toEqual((Object.keys(COMMISSION_SOURCES) as CommissionSourceKey[]).sort());
});
