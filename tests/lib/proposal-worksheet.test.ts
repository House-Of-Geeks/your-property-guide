// The agent proposal worksheet's maths (/tools/agent-proposal-worksheet).
import { describe, expect, it } from "vitest";
import { STATE_RATES } from "@/lib/data/commission-rates";
import {
  ESTIMATE_GAP_PCT,
  LONG_TERM_DAYS,
  STORAGE_KEY,
  aud,
  compareProposals,
  defaultExpectedPrice,
  emptyProposal,
  emptyWorksheet,
  estimateMidpoint,
  effectiveExpectedPrice,
  parseAmount,
  parseDays,
  parsePercent,
  pctText,
  proposalCost,
  proposalFlags,
  restoreWorksheet,
  toFigures,
  validateExpectedPrice,
  validateProposal,
  type ProposalDraft,
  type WorksheetDraft,
} from "@/lib/proposal-worksheet";

const agent = (p: Partial<ProposalDraft>): ProposalDraft => ({ ...emptyProposal(), ...p });
const sheet = (agents: ProposalDraft[], extra: Partial<WorksheetDraft> = {}): WorksheetDraft => ({ ...emptyWorksheet(), agents, ...extra });

describe("parsing what people type", () => {
  it("reads dollar amounts with symbols, commas, k and m", () => {
    expect(parseAmount("$850,000")).toBe(850_000);
    expect(parseAmount(" 850000 ")).toBe(850_000);
    expect(parseAmount("850k")).toBe(850_000);
    expect(parseAmount("1.2m")).toBe(1_200_000);
    expect(parseAmount("4,500.50")).toBe(4_500.5);
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("abc")).toBeNull();
    expect(parseAmount("-5")).toBeNull();
  });

  it("reads percentages and days", () => {
    expect(parsePercent("2.2")).toBe(2.2);
    expect(parsePercent("2.2%")).toBe(2.2);
    expect(parsePercent(".5")).toBe(0.5);
    expect(parsePercent("two")).toBeNull();
    expect(parseDays("90")).toBe(90);
    expect(parseDays("90 days")).toBe(90);
    expect(parseDays("9.5")).toBeNull();
  });
});

describe("proposalCost", () => {
  it("adds 10% GST to a rate quoted plus GST, and works at the given price", () => {
    const c = proposalCost(toFigures(agent({ commission: "2", commissionGst: "plus", marketing: "4,000" })), 800_000)!;
    expect(c.commissionExGst).toBe(16_000);
    expect(c.commissionGst).toBe(1_600);
    expect(c.commissionInclGst).toBe(17_600);
    expect(c.marketingInclGst).toBe(4_000); // marketing quoted including GST by default
    expect(c.auctioneerInclGst).toBe(0);
    expect(c.totalCost).toBe(21_600);
    expect(c.keep).toBe(800_000 - 21_600);
    expect(c.rateExGst).toBe(2);
    expect(c.totalCostPct).toBe(2.7);
  });

  it("doesn't add GST twice when the rate already includes it", () => {
    const c = proposalCost(toFigures(agent({ commission: "2.2", commissionGst: "included" })), 800_000)!;
    expect(c.commissionInclGst).toBe(17_600);
    expect(c.commissionExGst).toBe(16_000);
    expect(c.commissionGst).toBe(1_600);
    expect(c.rateExGst).toBe(2);
  });

  it("handles a fixed fee, and GST on marketing and the auctioneer when they're quoted plus GST", () => {
    const c = proposalCost(
      toFigures(agent({ commissionBasis: "fixed", commission: "15,000", commissionGst: "plus", marketing: "3000", auctioneer: "800", otherFeesGst: "plus" })),
      750_000,
    )!;
    expect(c.commissionInclGst).toBe(16_500);
    expect(c.marketingInclGst).toBe(3_300);
    expect(c.auctioneerInclGst).toBe(880);
    expect(c.totalCost).toBe(16_500 + 3_300 + 880);
    expect(c.rateExGst).toBe(2); // $15,000 of $750,000
  });

  it("returns null until there's a commission and a price", () => {
    expect(proposalCost(toFigures(agent({ marketing: "4000" })), 800_000)).toBeNull();
    expect(proposalCost(toFigures(agent({ commission: "2" })), null)).toBeNull();
  });
});

describe("the expected price", () => {
  it("defaults to the average of the agents' midpoints, to the nearest $1,000", () => {
    const a = toFigures(agent({ estimateLow: "800,000", estimateHigh: "850,000" })); // 825,000
    const b = toFigures(agent({ estimateLow: "780k", estimateHigh: "820k" }));         // 800,000
    expect(estimateMidpoint(800_000, 850_000)).toBe(825_000);
    expect(estimateMidpoint(null, 850_000)).toBe(850_000);
    expect(defaultExpectedPrice([a, b])).toBe(813_000); // 812,500 rounds up
    expect(defaultExpectedPrice([toFigures(emptyProposal())])).toBeNull();
  });

  it("uses the person's own price once they've set one, and falls back when it's blank or unreadable", () => {
    const agents = [toFigures(agent({ estimateLow: "800000", estimateHigh: "900000" }))];
    expect(effectiveExpectedPrice({ expectedPrice: "870,000", expectedPriceSet: true }, agents)).toEqual({ price: 870_000, fromEstimates: false });
    expect(effectiveExpectedPrice({ expectedPrice: "", expectedPriceSet: true }, agents)).toEqual({ price: 850_000, fromEstimates: true });
    expect(effectiveExpectedPrice({ expectedPrice: "870", expectedPriceSet: true }, agents)).toEqual({ price: 850_000, fromEstimates: true });
    expect(effectiveExpectedPrice({ expectedPrice: "999,000", expectedPriceSet: false }, agents)).toEqual({ price: 850_000, fromEstimates: true });
  });
});

describe("compareProposals", () => {
  it("costs every proposal at the same price, with the difference from the lowest", () => {
    const r = compareProposals(
      sheet(
        [
          agent({ estimateLow: "900000", estimateHigh: "950000", commission: "2.5", marketing: "5000", comparables: "yes" }),
          agent({ estimateLow: "800000", estimateHigh: "850000", commission: "2", marketing: "3500" }),
        ],
        { expectedPrice: "850,000", expectedPriceSet: true, state: "NSW" },
      ),
    );
    expect(r.price).toBe(850_000);
    expect(r.priceFromEstimates).toBe(false);
    const [a, b] = r.results;
    expect(a.cost!.totalCost).toBe(Math.round(850_000 * 0.025 * 1.1) + 5_000); // 23,375 + 5,000
    expect(b.cost!.totalCost).toBe(Math.round(850_000 * 0.02 * 1.1) + 3_500);  // 18,700 + 3,500
    expect(b.isLowest).toBe(true);
    expect(a.isLowest).toBe(false);
    expect(b.aboveLowest).toBe(0);
    expect(a.aboveLowest).toBe(a.cost!.totalCost - b.cost!.totalCost);
  });

  it("doesn't call a lone costed proposal the lowest", () => {
    const r = compareProposals(sheet([agent({ estimateLow: "800000", commission: "2" }), agent({})]));
    expect(r.results[0].cost).not.toBeNull();
    expect(r.results[0].isLowest).toBe(false);
    expect(r.results[1].cost).toBeNull();
    expect(r.results[1].aboveLowest).toBeNull();
  });
});

describe("flags", () => {
  const keys = (draft: WorksheetDraft, i: number) => compareProposals(draft).results[i].flags.map((f) => f.key);

  it("flags an estimate well above the others only when no comparable sales back it", () => {
    const high = agent({ estimateLow: "950000", estimateHigh: "1000000", comparables: "no" }); // mid 975k
    const other = agent({ estimateLow: "800000", estimateHigh: "850000" });                     // mid 825k
    expect(keys(sheet([high, other]), 0)).toContain("estimate-above-others");
    expect(keys(sheet([high, other]), 1)).not.toContain("estimate-above-others");
    expect(keys(sheet([{ ...high, comparables: "yes" }, other]), 0)).not.toContain("estimate-above-others");
    // Unanswered still prompts the question, worded without saying none were shown.
    const unanswered = compareProposals(sheet([{ ...high, comparables: "" }, other])).results[0].flags[0];
    expect(unanswered.key).toBe("estimate-above-others");
    expect(unanswered.text).not.toMatch(/didn’t show/);
    // Within the threshold: no flag.
    const close = agent({ estimateLow: "840000", estimateHigh: "860000", comparables: "no" }); // mid 850k, ~3% above
    expect(((850_000 - 825_000) / 825_000) * 100).toBeLessThan(ESTIMATE_GAP_PCT);
    expect(keys(sheet([close, other]), 0)).not.toContain("estimate-above-others");
  });

  it("flags marketing payable if unsold with no cap", () => {
    expect(keys(sheet([agent({ marketingIfUnsold: "yes", marketingCapped: "no" }), agent({})]), 0)).toEqual(["marketing-unsold-uncapped"]);
    expect(keys(sheet([agent({ marketingIfUnsold: "yes", marketingCapped: "yes" }), agent({})]), 0)).toEqual([]);
    expect(keys(sheet([agent({ marketingIfUnsold: "no", marketingCapped: "no" }), agent({})]), 0)).toEqual([]);
  });

  it(`flags a term longer than ${LONG_TERM_DAYS} days`, () => {
    expect(keys(sheet([agent({ termDays: "120" }), agent({})]), 0)).toEqual(["long-term"]);
    expect(keys(sheet([agent({ termDays: String(LONG_TERM_DAYS) }), agent({})]), 0)).toEqual([]);
  });

  it("flags commission outside the state's typical range, compared before GST", () => {
    const nsw = STATE_RATES.NSW; // 1.8% to 2.5%
    const at = (p: Partial<ProposalDraft>) =>
      compareProposals(sheet([agent(p), agent({})], { expectedPrice: "800000", expectedPriceSet: true, state: "NSW" })).results[0].flags;
    expect(at({ commission: String(nsw.high + 0.5) }).map((f) => f.key)).toEqual(["commission-outside-range"]);
    expect(at({ commission: String(nsw.high + 0.5) })[0].text).toMatch(/above the typical 1.8% to 2.5% in New South Wales/);
    expect(at({ commission: "1.5" })[0].text).toMatch(/below the typical/);
    // 2.75% including GST is 2.5% before GST: inside the range.
    expect(at({ commission: "2.75", commissionGst: "included" })).toEqual([]);
    // A fixed fee is judged by what it works out to at the expected price: $12,000 of $800,000 is 1.5%.
    expect(at({ commissionBasis: "fixed", commission: "12000" })[0].text).toMatch(/fixed fee works out to about 1.5% plus GST/);
    // No state chosen, no range to compare against.
    expect(compareProposals(sheet([agent({ commission: "4", estimateLow: "800000" }), agent({})])).results[0].flags).toEqual([]);
  });

  it("uses neutral wording", () => {
    const all = proposalFlags(
      0,
      [
        toFigures(agent({ estimateLow: "1000000", comparables: "no", marketingIfUnsold: "yes", marketingCapped: "no", termDays: "180", commission: "3.5" })),
        toFigures(agent({ estimateLow: "800000" })),
      ],
      proposalCost(toFigures(agent({ commission: "3.5" })), 900_000),
      "VIC",
    );
    expect(all).toHaveLength(4);
    for (const f of all) expect(f.text).not.toMatch(/scam|beware|warning|danger|avoid|rip|dodgy|!/i);
  });
});

describe("validation", () => {
  it("ties a clear message to the field that can't be right", () => {
    expect(validateProposal(agent({ estimateLow: "900000", estimateHigh: "800000" }))).toEqual({ estimateHigh: "The high estimate is below the low one" });
    expect(validateProposal(agent({ estimateLow: "850" })).estimateLow).toMatch(/full price/);
    expect(validateProposal(agent({ commission: "22" })).commission).toMatch(/more than 10%/);
    expect(validateProposal(agent({ commissionBasis: "fixed", commission: "2.2" })).commission).toMatch(/looks like a percentage/);
    expect(validateProposal(agent({ termDays: "three months" })).termDays).toMatch(/whole number of days/);
    expect(validateProposal(agent({ marketing: "lots" })).marketing).toMatch(/Enter a number/);
    expect(validateProposal(agent({ estimateLow: "800k", estimateHigh: "850k", commission: "2.2", termDays: "90" }))).toEqual({});
    expect(validateExpectedPrice("850")).toMatch(/full price/);
    expect(validateExpectedPrice("")).toBeNull();
    expect(validateExpectedPrice("$850,000")).toBeNull();
  });
});

describe("saved state", () => {
  it("round-trips through JSON and repairs anything odd", () => {
    const draft = sheet([agent({ name: "Agency A", commission: "2.1", method: "auction" }), agent({}), agent({ termDays: "60" })], { state: "QLD" });
    expect(restoreWorksheet(JSON.stringify(draft))).toEqual(draft);
    expect(restoreWorksheet("not json")).toBeNull();
    expect(restoreWorksheet({ version: 2, agents: [] })).toBeNull();
    const repaired = restoreWorksheet({ version: 1, state: "XX", agents: [{ method: "raffle", commissionGst: "maybe", commission: 5 }] })!;
    expect(repaired.state).toBe("");
    expect(repaired.agents).toHaveLength(2);
    expect(repaired.agents[0].method).toBe("");
    expect(repaired.agents[0].commissionGst).toBe("plus");
    expect(repaired.agents[0].commission).toBe("");
    const four = restoreWorksheet({ version: 1, agents: [{}, {}, {}, {}] })!;
    expect(four.agents).toHaveLength(3);
    expect(STORAGE_KEY).toMatch(/proposal-worksheet/);
  });
});

describe("formatting", () => {
  it("prints dollars and percentages without stray zeros", () => {
    expect(aud(850_000)).toBe("$850,000");
    expect(aud(-1_200)).toBe("−$1,200");
    expect(pctText(2.2)).toBe("2.2%");
    expect(pctText(2.25)).toBe("2.25%");
    expect(pctText(2)).toBe("2%");
  });
});
