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

// ─── First home relief by date and kind of property (14 October 2026) ───────
// The engine reads src/lib/policy/first-home.ts. Each expected figure below is
// worked by hand from the revenue office's rule, shown in the comment.
describe("first home relief follows the transaction date and the kind of property", () => {
  const fh = (s: AustralianState, p: number, options: Parameters<typeof calculateStampDuty>[5]) =>
    calculateStampDuty(p, s, true, false, false, options);

  it("no options means today's rules for an established home, as before", () => {
    const today = new Date();
    for (const s of AUSTRALIAN_STATES) {
      for (const p of [450_000, 650_000, 750_000, 1_100_000]) {
        expect(calculateStampDuty(p, s, true, false, false).total).toBe(fh(s, p, { contractDate: today, propertyKind: "established" }).total);
      }
    }
  });

  it("WA: the rate follows the agreement date", () => {
    // From 7 May 2026: (650,000 − 600,000) / 100 × $16.15 = $8,075.
    expect(fh("WA", 650_000, { contractDate: "2026-06-01" }).total).toBe(8_075);
    // 21 Mar 2025 to 6 May 2026, Perth and Peel: (550,000 − 500,000) / 100 × $13.63 = $6,815.
    expect(fh("WA", 550_000, { contractDate: "2026-04-01" }).total).toBe(6_815);
    // Same date outside Perth and Peel: 500 × $11.89 = $5,945; at $720,000, 2,200 × $11.89 = $26,158.
    expect(fh("WA", 550_000, { contractDate: "2026-04-01", region: "regional" }).total).toBe(5_945);
    expect(fh("WA", 720_000, { contractDate: "2026-04-01", region: "regional" }).total).toBe(26_158);
    // Perth and Peel stopped at $700,000: full duty at $720,000 = 11,115 + 360,000 × 4.75% = $28,215.
    expect(fh("WA", 720_000, { contractDate: "2026-04-01" }).total).toBe(28_215);
    // 9 May 2024 to 20 Mar 2025: (500,000 − 450,000) / 100 × $15.01 = $7,505.
    expect(fh("WA", 500_000, { contractDate: "2025-01-01" }).total).toBe(7_505);
    // Before 9 May 2024: (500,000 − 430,000) / 100 × $19.19 = $13,433.
    expect(fh("WA", 500_000, { contractDate: "2024-01-01" }).total).toBe(13_433);
    // The same $650,000 home on 1 April 2026, before the change, paid 1,500 × $13.63 = $20,445.
    expect(fh("WA", 650_000, { contractDate: "2026-04-01" }).total).toBe(20_445);
  });

  it("WA vacant land: $20.14 per $100 over $450,000 from 7 May 2026, $15.39 over $350,000 before", () => {
    expect(fh("WA", 450_000, { contractDate: "2026-06-01", propertyKind: "vacant-land" }).total).toBe(0);
    // 500 × $20.14 = $10,070.
    expect(fh("WA", 500_000, { contractDate: "2026-06-01", propertyKind: "vacant-land" }).total).toBe(10_070);
    // 500 × $15.39 = $7,695.
    expect(fh("WA", 400_000, { contractDate: "2026-01-01", propertyKind: "vacant-land" }).total).toBe(7_695);
    // Above $550,000: full duty, 11,115 + 240,000 × 4.75% = $22,515.
    expect(fh("WA", 600_000, { contractDate: "2026-06-01", propertyKind: "vacant-land" }).total).toBe(22_515);
  });

  it("ACT: $0 at any price from 1 July 2026; before that $35,238 off and $0 only to $1,020,000", () => {
    for (const p of [900_000, 1_100_000, 2_500_000]) expect(fh("ACT", p, { contractDate: "2026-08-01" }).total).toBe(0);
    expect(fh("ACT", 900_000, { contractDate: "2026-03-01" }).total).toBe(0);
    expect(fh("ACT", 1_020_000, { contractDate: "2026-03-01" }).total).toBe(0);
    // Owner-occupier duty 33,958 + 100,000 × 6.4% = 40,358, less 35,238 = $5,120 ($6.40 per $100 over $1,020,000).
    expect(fh("ACT", 1_100_000, { contractDate: "2026-03-01" }).total).toBe(5_120);
    // Over $1,455,000: 4.54% × 1,500,000 = 68,100, less 35,238 = $32,862.
    expect(fh("ACT", 1_500_000, { contractDate: "2026-03-01" }).total).toBe(32_862);
    const r = fh("ACT", 1_100_000, { contractDate: "2026-03-01" });
    expect(r.notes.join(" ")).toMatch(/income test/i);
    // Before 1 July 2025 the engine holds no rules: no relief, and it says so.
    const old = fh("ACT", 600_000, { contractDate: "2025-03-01" });
    expect(old.total).toBe(owner("ACT", 600_000).total);
    expect(old.firstHomeRule?.modelled).toBe(false);
  });

  it("Tasmania: the established-home exemption follows the settlement date and ended on 30 June 2026", () => {
    // Duty on $600,000: 12,935 + 225,000 × 4.25% = $22,497.50.
    expect(fh("TAS", 600_000, { settlementDate: "2026-06-15" }).total).toBe(0);
    expect(fh("TAS", 600_000, { settlementDate: "2026-06-15" }).concessionAmount).toBe(22_498);
    expect(fh("TAS", 600_000, { settlementDate: "2026-07-15" }).total).toBe(22_498);
    // Signed before 1 July but settling after: no relief.
    expect(fh("TAS", 600_000, { contractDate: "2026-06-01", settlementDate: "2026-07-15" }).total).toBe(22_498);
    // Over the $750,000 cap: full duty, 27,810 + 75,000 × 4.5% = $31,185.
    expect(fh("TAS", 800_000, { settlementDate: "2026-06-15" }).total).toBe(31_185);
    // 1 Jan 2022 to 17 Feb 2024: 50% off up to $600,000. $500,000: 18,247.50 / 2 = $9,123.75.
    expect(fh("TAS", 500_000, { settlementDate: "2024-01-01" }).total).toBe(9_124);
    // No relief on a new home, whenever it settles.
    expect(fh("TAS", 600_000, { settlementDate: "2026-06-15", propertyKind: "new" }).total).toBe(22_498);
    expect(fh("TAS", 600_000, { settlementDate: "2026-06-15" }).firstHomeRule?.dateBasis).toBe("settlement");
  });

  it("SA: $0 on a new home, off-the-plan or land from 6 June 2024 at any value; full duty on an established home", () => {
    expect(fh("SA", 750_000, { contractDate: "2026-10-01", propertyKind: "new" }).total).toBe(0);
    expect(fh("SA", 2_000_000, { contractDate: "2026-10-01", propertyKind: "new" }).total).toBe(0);
    expect(fh("SA", 300_000, { contractDate: "2026-10-01", propertyKind: "vacant-land" }).total).toBe(0);
    expect(fh("SA", 750_000, { contractDate: "2026-10-01", propertyKind: "established" }).total).toBe(35_080);
    // 15 Jun 2023 to 5 Jun 2024: $0 to $650,000; the partial band to $700,000 isn't modelled.
    expect(fh("SA", 600_000, { contractDate: "2024-01-01", propertyKind: "new" }).total).toBe(0);
    const band = fh("SA", 680_000, { contractDate: "2024-01-01", propertyKind: "new" });
    expect(band.total).toBe(31_230); // 21,330 + 180,000 × 5.5%
    expect(band.firstHomeRule?.modelled).toBe(false);
    // Before 15 June 2023: no relief. 21,330 + 100,000 × 5.5% = $26,830.
    expect(fh("SA", 600_000, { contractDate: "2023-01-01", propertyKind: "new" }).total).toBe(26_830);
  });

  it("Queensland: $0 on a new home or vacant land from 1 May 2025; the established-home table before that", () => {
    expect(fh("QLD", 1_200_000, { contractDate: "2026-10-01", propertyKind: "new" }).total).toBe(0);
    expect(fh("QLD", 600_000, { contractDate: "2026-10-01", propertyKind: "vacant-land" }).total).toBe(0);
    // A new home on 1 Jan 2025 used the established-home concession: $10,925 at $750,000.
    expect(fh("QLD", 750_000, { contractDate: "2025-01-01", propertyKind: "new" }).total).toBe(10_925);
    // Vacant land, 9 Jun 2024 to 30 Apr 2025: $0 to $350,000; partial band to $500,000 not modelled,
    // so general-rate duty: 1,050 + 325,000 × 3.5% = $12,425.
    expect(fh("QLD", 300_000, { contractDate: "2025-01-01", propertyKind: "vacant-land" }).total).toBe(0);
    expect(fh("QLD", 400_000, { contractDate: "2025-01-01", propertyKind: "vacant-land" }).total).toBe(12_425);
    // Vacant land pays the general rate, not the home concession rate: 17,325 + 60,000 × 4.5% = $20,025.
    expect(calculateStampDuty(600_000, "QLD", false, false, false, { propertyKind: "vacant-land" }).total).toBe(20_025);
    // Established home before 9 June 2024: $0 to $500,000.
    expect(fh("QLD", 450_000, { contractDate: "2024-01-01" }).total).toBe(0);
  });

  it("NSW: vacant land $0 to $350,000, full duty from $450,000; homes $650,000 and $800,000 before 1 July 2023", () => {
    const land = (p: number) => fh("NSW", p, { contractDate: "2026-10-01", propertyKind: "vacant-land" });
    expect(land(350_000).total).toBe(0);
    // Duty at $450,000 = 11,602 + 63,000 × 4.5% = 14,437; at $400,000 half of it, $7,218.50.
    expect(land(400_000).total).toBe(7_219);
    expect(land(450_000).total).toBe(14_437);
    // Contract 1 Jan 2023: duty at $800,000 = 30,187; $750,000 pays 30,187 × 100/150 = $20,124.67.
    const old = fh("NSW", 750_000, { contractDate: "2023-01-01" });
    expect(old.total).toBe(20_125);
    expect(old.notes.join(" ")).toMatch(/schedule in force from 1 July 2026/);
  });

  it("Victoria: vacant land gets the same $600,000 and $750,000 thresholds", () => {
    // General duty at $650,000 = 2,870 + 520,000 × 6% = 34,070; payable 34,070 × 50/150 = $11,356.67.
    expect(fh("VIC", 650_000, { propertyKind: "vacant-land" }).total).toBe(11_357);
  });

  it("the NT has no first home duty relief on any kind of property", () => {
    for (const k of ["established", "new", "vacant-land"] as const) {
      expect(fh("NT", 600_000, { propertyKind: k }).total).toBe(owner("NT", 600_000).total);
    }
  });

  it("names the rule it applied, with its official source and dates", () => {
    const r = fh("WA", 650_000, { contractDate: "2026-06-01" });
    expect(r.firstHomeRule).toMatchObject({ effectiveFrom: "2026-05-07", effectiveTo: null, dateBasis: "contract", dateUsed: "2026-06-01", modelled: true, reviewedOn: "2026-10-14" });
    expect(r.firstHomeRule?.source.href).toMatch(/^https:\/\/www\.wa\.gov\.au\//);
    for (const s of AUSTRALIAN_STATES) {
      const rule = calculateStampDuty(500_000, s, true, false, false).firstHomeRule;
      expect(rule?.source.href).toMatch(/^https:\/\/([a-z0-9-]+\.)*gov\.au\//);
    }
    // No rule for an investor or a foreign buyer.
    expect(calculateStampDuty(500_000, "NSW", true, false, true).firstHomeRule).toBeUndefined();
    expect(calculateStampDuty(500_000, "NSW", true, true, false).firstHomeRule).toBeUndefined();
  });
});
