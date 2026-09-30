// Item 20: the stamp duty engine, pinned to the revenue offices' own figures
// as checked on 30 September 2026. Where an office publishes a worked example
// the test uses it; otherwise it pins the schedule at the prices the state
// guides print ($500,000, $750,000, $1,000,000), so a rate change is a
// deliberate, reviewed edit to these numbers and the source comment together.
import { describe, expect, it } from "vitest";
import {
  AUSTRALIAN_STATES,
  STATE_DUTY_SCHEDULES,
  calculateStampDuty,
  ntDuty,
  qldFirstHomeDeduction,
  type AustralianState,
} from "../../src/lib/utils/stamp-duty";

const owner = (s: AustralianState, p: number) => calculateStampDuty(p, s, false, false, false);
const investor = (s: AustralianState, p: number) => calculateStampDuty(p, s, false, false, true);
const firstHome = (s: AustralianState, p: number) => calculateStampDuty(p, s, true, false, false);
const foreign = (s: AustralianState, p: number) => calculateStampDuty(p, s, false, true, true);

describe("published examples from the revenue offices", () => {
  it("Revenue NSW: first home buyer concession at $850,000 and $900,000 (2026-27 table)", () => {
    // Revenue NSW's calculator: $9,796.75 and $19,593.50.
    expect(firstHome("NSW", 850_000).total).toBe(9_797);
    expect(firstHome("NSW", 900_000).total).toBe(19_594);
  });
  it("SRO Victoria: a first home buyer paying $700,000 pays $24,713, saving $12,357", () => {
    const r = firstHome("VIC", 700_000);
    expect(r.total).toBe(24_713);
    expect(r.concessionAmount).toBe(12_357);
  });
  it("Queensland Revenue Office: the first home concession can save up to $24,525 (at $700,000)", () => {
    expect(investor("QLD", 700_000).total - firstHome("QLD", 700_000).total).toBe(24_525);
    expect(firstHome("QLD", 700_000).total).toBe(0);
  });
  it("Territory Revenue Office formula: $500,000 is $23,929", () => {
    expect(owner("NT", 500_000).total).toBe(23_929);
  });
  it("ACT Revenue Office: the pre-July 2026 scheme's $35,238 cap is the owner-occupier duty at $1,020,000", () => {
    expect(owner("ACT", 1_020_000).total).toBe(35_238);
  });
});

describe("standard schedules at the guide prices", () => {
  const PINNED: Record<AustralianState, [number, number, number]> = {
    NSW: [16_687, 27_937, 39_187],
    VIC: [25_070, 40_070, 55_000],
    QLD: [15_925, 26_775, 38_025],
    WA: [17_765, 29_741, 42_616],
    SA: [21_330, 35_080, 48_830],
    TAS: [18_248, 28_935, 40_185],
    ACT: [11_400, 22_200, 36_950],
    NT: [23_929, 37_125, 49_500],
  };
  for (const s of AUSTRALIAN_STATES) {
    it(`${s}: investor duty at $500,000, $750,000 and $1,000,000`, () => {
      expect([500_000, 750_000, 1_000_000].map((p) => investor(s, p).total)).toEqual(PINNED[s]);
    });
  }
});

describe("owner-occupier schedules", () => {
  it("Victoria's principal place of residence rate applies to $550,000 and not above", () => {
    expect(owner("VIC", 500_000).total).toBe(21_970);
    expect(owner("VIC", 550_000).total).toBe(24_970);
    expect(owner("VIC", 550_001).total).toBe(investor("VIC", 550_001).total);
  });
  it("Queensland's home concession rate: $19,600 at $750,000, $7,175 under the standard rate above $540,000", () => {
    expect(owner("QLD", 750_000).total).toBe(19_600);
    expect(investor("QLD", 1_000_000).total - owner("QLD", 1_000_000).total).toBe(7_175);
  });
  it("the ACT owner-occupier rate: $19,208 at $750,000", () => {
    expect(owner("ACT", 750_000).total).toBe(19_208);
  });
  it("states with one schedule charge owner-occupiers the standard rate", () => {
    for (const s of ["NSW", "WA", "SA", "TAS", "NT"] as const) {
      expect(owner(s, 750_000).total).toBe(investor(s, 750_000).total);
    }
  });
});

describe("first home buyers", () => {
  it("NSW: $0 to $800,000, full duty from $1,000,000", () => {
    expect(firstHome("NSW", 800_000).total).toBe(0);
    expect(firstHome("NSW", 1_000_000).total).toBe(owner("NSW", 1_000_000).total);
  });
  it("Queensland: the deduction steps by $1,735 per $10,000 and is nil from $800,000", () => {
    expect(qldFirstHomeDeduction(709_999)).toBe(17_350);
    expect(qldFirstHomeDeduction(710_000)).toBe(15_615);
    expect(qldFirstHomeDeduction(799_999)).toBe(1_735);
    expect(qldFirstHomeDeduction(800_000)).toBe(0);
    expect(firstHome("QLD", 750_000).total).toBe(10_925);
  });
  it("WA from 7 May 2026: $0 to $600,000, $16.15 per $100 over $600,000 to $800,000", () => {
    expect(firstHome("WA", 600_000).total).toBe(0);
    expect(firstHome("WA", 700_000).total).toBe(16_150);
    expect(firstHome("WA", 800_000).total).toBe(32_300);
    expect(firstHome("WA", 800_100).total).toBe(owner("WA", 800_100).total);
  });
  it("Victoria: $0 to $600,000, full duty at $750,000", () => {
    expect(firstHome("VIC", 600_000).total).toBe(0);
    expect(firstHome("VIC", 750_000).total).toBe(owner("VIC", 750_000).total);
  });
  it("ACT from 1 July 2026: an eligible buyer pays nothing at any price", () => {
    for (const p of [500_000, 1_000_000, 2_000_000]) expect(firstHome("ACT", p).total).toBe(0);
  });
  it("SA, Tasmania (from 1 July 2026) and the NT give no duty relief on an established home", () => {
    for (const s of ["SA", "TAS", "NT"] as const) {
      expect(firstHome(s, 500_000).total).toBe(owner(s, 500_000).total);
      expect(firstHome(s, 500_000).concessionApplied).toBe(false);
    }
  });
  it("an investor never gets the first home concession", () => {
    for (const s of AUSTRALIAN_STATES) {
      expect(calculateStampDuty(500_000, s, true, false, true).concessionAmount).toBe(0);
    }
  });
});

describe("foreign purchaser surcharges", () => {
  const RATES: Record<AustralianState, number> = { NSW: 0.09, VIC: 0.08, QLD: 0.08, WA: 0.07, SA: 0.07, TAS: 0.08, ACT: 0, NT: 0 };
  for (const s of AUSTRALIAN_STATES) {
    it(`${s}: ${RATES[s] * 100}%`, () => {
      expect(foreign(s, 1_000_000).foreignSurcharge).toBe(1_000_000 * RATES[s]);
      expect(STATE_DUTY_SCHEDULES[s].foreign?.rate ?? 0).toBe(RATES[s]);
    });
  }
});

describe("NT bands", () => {
  it("meets the flat rate at $525,000 without a jump, then steps at $3m and $5m", () => {
    expect(Math.abs(ntDuty(525_000) - 525_000 * 0.0495)).toBeLessThan(1);
    expect(ntDuty(2_999_999)).toBeCloseTo(2_999_999 * 0.0495);
    expect(ntDuty(3_000_000)).toBeCloseTo(3_000_000 * 0.0575);
    expect(ntDuty(5_000_000)).toBeCloseTo(5_000_000 * 0.0595);
  });
});

describe("every schedule is sourced and dated", () => {
  for (const s of AUSTRALIAN_STATES) {
    it(`${s} names a government source for its rates, first home rules and surcharge`, () => {
      const sch = STATE_DUTY_SCHEDULES[s];
      const refs = [sch.standard.source, sch.firstHome.source, ...(sch.ownerOccupier ? [sch.ownerOccupier.source] : []), ...(sch.foreign ? [sch.foreign.source] : [])];
      for (const r of refs) {
        expect(r.href).toMatch(/^https:\/\/([a-z0-9-]+\.)*(gov\.au|nsw\.gov\.au|qld\.gov\.au)\//);
        expect(r.note.length).toBeGreaterThan(5);
      }
    });
  }
});
