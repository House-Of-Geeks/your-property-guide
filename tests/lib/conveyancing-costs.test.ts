// Commercial intent review 30 Sep 2026, section 3.7: the conveyancing cost
// estimator on /guides/conveyancing-guide and the fee data behind it.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { StateCode } from "@/lib/data/commission-rates";
import {
  CONVEYANCING_FEES,
  CONVEYANCING_SOURCES,
  NSW_LRS_DEALING_FEE,
  PEXA_TRANSFER,
  STATE_DISBURSEMENTS,
} from "@/lib/data/conveyancing-fees";
import {
  estimateConveyancingCost,
  formatFeeRange,
  qldTransferLodgementFee,
  vicTransferLodgementFee,
} from "@/lib/conveyancing-costs";
import { CONVEYANCING_FAQS, NSW_EXAMPLE, NSW_EXAMPLE_PRICE } from "@/lib/data/conveyancing-faqs";

const STATES: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

describe("registry transfer fees, 2026/27", () => {
  it("Victoria: $104.30 plus $2.34 per whole $1,000, capped at $3,614", () => {
    expect(vicTransferLodgementFee(500_000)).toBe(1_274.3);    // Conveyancing Explained quotes $1,275 at $500k
    expect(vicTransferLodgementFee(800_000)).toBe(1_976.3);
    expect(vicTransferLodgementFee(800_999)).toBe(1_976.3);    // whole $1,000s only
    expect(vicTransferLodgementFee(999)).toBe(104.3);
    expect(vicTransferLodgementFee(2_000_000)).toBe(3_614);    // the cap
  });
  it("Queensland: $248.04 to $180,000, then $46.56 per $10,000 or part", () => {
    expect(qldTransferLodgementFee(180_000)).toBe(248.04);
    expect(qldTransferLodgementFee(180_001)).toBe(294.6);      // a part of $10,000 counts
    expect(qldTransferLodgementFee(800_000)).toBe(3_134.76);
    expect(qldTransferLodgementFee(1_000_000)).toBe(4_065.96); // Spire Law's Sunshine Coast figure
  });
});

describe("estimateConveyancingCost", () => {
  it("NSW purchase: flat registration once, PEXA, searches; total is fee plus disbursements", () => {
    const e = estimateConveyancingCost({ state: "NSW", side: "buy", price: 800_000 });
    expect(e.lines.filter((l) => l.key === "registration")).toHaveLength(1);
    expect(e.lines.find((l) => l.key === "registration")!.low).toBe(NSW_LRS_DEALING_FEE);
    expect(e.lines.find((l) => l.key === "pexa")!.low).toBe(PEXA_TRANSFER);
    const sum = e.lines.reduce((s, l) => s + l.low, 0);
    expect(e.disbursements.low).toBe(Math.round(sum));
    expect(e.total.low).toBe(e.professional.low + e.disbursements.low);
    expect(e.total.high).toBe(e.professional.high + e.disbursements.high);
    // NSW's fee is flat: price does not move it.
    expect(estimateConveyancingCost({ state: "NSW", side: "buy", price: 2_000_000 }).disbursements).toEqual(e.disbursements);
  });
  it("Victoria and Queensland purchases add the price-based transfer fee; sales do not", () => {
    for (const state of ["VIC", "QLD"] as const) {
      const buy = estimateConveyancingCost({ state, side: "buy", price: 800_000 });
      const reg = buy.lines.find((l) => l.key === "registration")!;
      expect(reg.low).toBe(state === "VIC" ? vicTransferLodgementFee(800_000) : qldTransferLodgementFee(800_000));
      const dearer = estimateConveyancingCost({ state, side: "buy", price: 1_200_000 });
      expect(dearer.disbursements.low).toBeGreaterThan(buy.disbursements.low);
      const sell = estimateConveyancingCost({ state, side: "sell", price: 800_000 });
      expect(sell.lines.find((l) => l.key === "registration")).toBeUndefined();
    }
  });
  it("keeps mortgage and strata lines out of the total", () => {
    const e = estimateConveyancingCost({ state: "NSW", side: "buy", price: 800_000 });
    expect(e.mortgageLines.length).toBeGreaterThan(0);
    expect(e.strataLines.length).toBeGreaterThan(0);
    const keys = e.lines.map((l) => l.key);
    for (const l of [...e.mortgageLines, ...e.strataLines]) expect(keys).not.toContain(l.key);
  });
  it("clamps a negative price to zero", () => {
    const e = estimateConveyancingCost({ state: "VIC", side: "buy", price: -5 });
    expect(e.price).toBe(0);
    expect(e.lines.find((l) => l.key === "registration")!.low).toBe(104.3);
  });
  it("uses the selling range when selling", () => {
    const e = estimateConveyancingCost({ state: "VIC", side: "sell", price: 800_000 });
    expect(e.professional).toEqual(CONVEYANCING_FEES.VIC.sell);
  });
});

describe("conveyancing fee data", () => {
  it("covers every state and side with sane ranges and a named source on every line", () => {
    for (const s of STATES) {
      const f = CONVEYANCING_FEES[s];
      expect(f.state).toBe(s);
      for (const r of [f.buy, f.sell]) {
        expect(r.low).toBeGreaterThan(0);
        expect(r.low).toBeLessThanOrEqual(r.high);
        expect(r.high).toBeLessThan(5_000);
      }
      expect(f.source.length).toBeGreaterThan(20);
      expect(f.source).toMatch(/20\d\d/);           // dated
      expect(f.average?.amount).toBeGreaterThan(0);
      for (const side of ["buy", "sell"] as const) {
        const lines = STATE_DISBURSEMENTS[s][side];
        expect(lines.some((l) => l.when === "always")).toBe(true);
        for (const l of lines) {
          expect(l.low).toBeLessThanOrEqual(l.high);
          expect(l.source.length).toBeGreaterThan(10);
        }
      }
    }
  });
  it("lists every source with an https link and a date note", () => {
    expect(CONVEYANCING_SOURCES.length).toBeGreaterThanOrEqual(15);
    for (const s of CONVEYANCING_SOURCES) {
      expect(s.href).toMatch(/^https:\/\//);
      expect(s.note).toMatch(/20\d\d|\d\d\/\d\d/);
    }
  });
  it("Queensland has the lowest published average and the NT the highest (the guide's summary says so)", () => {
    const avgs = STATES.map((s) => [s, CONVEYANCING_FEES[s].average!.amount] as const).sort((a, b) => a[1] - b[1]);
    expect(avgs[0][0]).toBe("QLD");
    expect(avgs[avgs.length - 1][0]).toBe("NT");
    const page = readFileSync(join(__dirname, "../../src/app/(marketing)/guides/conveyancing-guide/page.tsx"), "utf8");
    expect(page).toContain(`$${avgs[0][1].toLocaleString("en-AU")} in Queensland to $${avgs[avgs.length - 1][1].toLocaleString("en-AU")} in the Northern Territory`);
  });
});

describe("formatFeeRange", () => {
  it("prints cents only when the fee has them", () => {
    expect(formatFeeRange({ low: 182.73, high: 182.73 })).toBe("$182.73");
    expect(formatFeeRange({ low: 1_000, high: 2_500 })).toBe("$1,000–$2,500");
    expect(formatFeeRange({ low: 1_000, high: 2_500 }, "prose")).toBe("$1,000 to $2,500");
    expect(formatFeeRange({ low: 146.3, high: 146.3 })).toBe("$146.30");
  });
});

describe("conveyancing FAQs", () => {
  const PAA = [
    "What is the average conveyancing fee in NSW?",
    "Is it better to use a conveyancer or solicitor?",
    "Can a conveyancer negotiate price?",
    "How do you calculate conveyancing fees?",
    "What is the average fee for conveyancing in Australia?",
  ];
  it("answers every People Also Ask question in 40+ words with a figure and a named source", () => {
    for (const q of PAA) {
      const f = CONVEYANCING_FAQS.find((x) => x.question === q);
      expect(f, q).toBeDefined();
      expect(f!.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
      expect(f!.answer).toMatch(/\$[0-9,]+/);
      expect(f!.answer).toMatch(/OpenAgent|Our Top 10|NCAT|PEXA|NSW LRS|Keylaw|All Conveyancing Australia|Attwood Marshall/);
    }
  });
  it("keeps the worked example at $800,000, which the copy introduces with \"an\"", () => {
    expect(NSW_EXAMPLE_PRICE).toBe(800_000);
  });
  it("quotes the estimator's own worked example, so the answer and the tool agree", () => {
    const nsw = CONVEYANCING_FAQS.find((x) => x.question === "What is the average conveyancing fee in NSW?")!;
    expect(nsw.answer).toContain(formatFeeRange(NSW_EXAMPLE.total, "prose"));
  });
  it("has no em dash and no duplicate question", () => {
    const qs = CONVEYANCING_FAQS.map((f) => f.question);
    expect(new Set(qs).size).toBe(qs.length);
    for (const f of CONVEYANCING_FAQS) expect(`${f.question} ${f.answer}`).not.toMatch(/—/);
  });
});
