// The first home policy data (src/lib/policy/first-home.ts), pinned to the
// revenue offices' rules as checked on 14 October 2026. A change in a state's
// rules is a deliberate edit to the data and to these expectations together.
import { describe, expect, it } from "vitest";
import { AUSTRALIAN_STATES } from "@/lib/utils/stamp-duty";
import {
  FIRST_HOME_DUTY_RELIEF,
  FIRST_HOME_GRANTS,
  FIRST_HOME_REVIEWED_ON,
  PROPERTY_KINDS,
  currentDutyRelief,
  currentGrant,
  dutyReliefFor,
  dutyReliefSummary,
  formatPolicyDate,
  grantFor,
  grantSummary,
  toIsoDate,
} from "@/lib/policy/first-home";

describe("first home owner grants", () => {
  it("pays these amounts on a new home today", () => {
    const amounts = Object.fromEntries(AUSTRALIAN_STATES.map((s) => [s, currentGrant(s).amount]));
    expect(amounts).toEqual({ NSW: 10_000, VIC: 10_000, QLD: 30_000, WA: 10_000, SA: 15_000, TAS: 20_000, ACT: 0, NT: 50_000 });
  });

  it("has these value caps today", () => {
    expect(currentGrant("NSW").caps.map((c) => c.cap)).toEqual([600_000, 750_000]);
    expect(currentGrant("VIC").caps.map((c) => c.cap)).toEqual([750_000]);
    expect(currentGrant("QLD").caps).toEqual([expect.objectContaining({ cap: 750_000, below: true })]);
    expect(currentGrant("WA").caps.map((c) => c.cap)).toEqual([800_000, 1_000_000]);
    expect(currentGrant("SA").caps.map((c) => c.cap)).toEqual([null]);
    expect(currentGrant("TAS").caps.map((c) => c.cap)).toEqual([null]);
    expect(currentGrant("NT").caps.map((c) => c.cap)).toEqual([null]);
  });

  it("follows the date", () => {
    // Queensland: $15,000 before 20 November 2023 and $30,000 from it, with no end date.
    expect(grantFor("QLD", "2023-11-19").version?.amount).toBe(15_000);
    expect(grantFor("QLD", "2023-11-20").version?.amount).toBe(30_000);
    expect(grantFor("QLD", "2030-01-01").version?.amount).toBe(30_000);
    // Tasmania: $30,000 to 30 June 2024, $10,000 in 2024-25, $30,000 in 2025-26, $20,000 in 2026-27, $10,000 after.
    expect(["2024-06-30", "2025-06-30", "2026-06-30", "2027-06-30", "2027-07-01"].map((d) => grantFor("TAS", d).version?.amount)).toEqual([30_000, 10_000, 30_000, 20_000, 10_000]);
    // WA: the southern cap rose from $750,000 to $800,000 on 7 May 2026.
    expect(grantFor("WA", "2026-05-06").version?.caps[0].cap).toBe(750_000);
    expect(grantFor("WA", "2026-05-07").version?.caps[0].cap).toBe(800_000);
    // SA: $575,000 cap, then $650,000, then none from 6 June 2024.
    expect(["2023-06-14", "2024-06-05", "2024-06-06"].map((d) => grantFor("SA", d).version?.caps[0].cap)).toEqual([575_000, 650_000, null]);
    // NT: $50,000 to 30 September 2027, then the $10,000 FHOG.
    expect(grantFor("NT", "2027-09-30").version?.amount).toBe(50_000);
    expect(grantFor("NT", "2027-10-01").version?.amount).toBe(10_000);
  });

  it("pays nothing on an established home or land alone, except the NT's closed established-home grant", () => {
    for (const s of AUSTRALIAN_STATES.filter((x) => x !== "ACT")) {
      expect(grantFor(s, FIRST_HOME_REVIEWED_ON, "established").version, s).toBeNull();
      expect(grantFor(s, FIRST_HOME_REVIEWED_ON, "vacant-land").version, s).toBeNull();
    }
    expect(grantFor("NT", "2025-01-01", "established").version?.amount).toBe(10_000);
    expect(grantFor("NT", "2025-10-01", "established").version).toBeNull();
    expect(grantFor("ACT", FIRST_HOME_REVIEWED_ON).version?.amount).toBe(0);
  });

  it("words each grant in one sentence that carries its own figures", () => {
    for (const s of AUSTRALIAN_STATES) {
      const v = currentGrant(s);
      const summary = grantSummary(s);
      if (v.amount > 0) expect(summary).toContain(`$${v.amount.toLocaleString("en-AU")}`);
      for (const c of v.caps) if (c.cap) expect(summary, s).toContain(`$${c.cap.toLocaleString("en-AU")}`);
    }
    expect(grantSummary("SA")).toMatch(/no value cap/);
  });
});

describe("first home duty relief", () => {
  it("has a current rule for every state and kind of property", () => {
    for (const s of AUSTRALIAN_STATES) for (const k of PROPERTY_KINDS) expect(() => currentDutyRelief(s, k)).not.toThrow();
  });

  it("words today's rules", () => {
    expect(dutyReliefSummary("NSW")).toBe("No duty up to $800,000, reduced duty below $1,000,000");
    expect(dutyReliefSummary("NSW", "vacant-land")).toBe("No duty up to $350,000, reduced duty below $450,000");
    expect(dutyReliefSummary("VIC")).toBe("No duty up to $600,000, reduced duty to $750,000");
    expect(dutyReliefSummary("QLD")).toBe("No duty up to $700,000, reduced duty below $800,000");
    expect(dutyReliefSummary("QLD", "new")).toBe("No duty, with no price cap");
    expect(dutyReliefSummary("WA")).toBe("No duty up to $600,000, then $16.15 per $100 above that, to $800,000");
    expect(dutyReliefSummary("WA", "vacant-land")).toBe("No duty up to $450,000, then $20.14 per $100 above that, to $550,000");
    expect(dutyReliefSummary("SA", "new")).toBe("No duty, with no price cap");
    expect(dutyReliefSummary("SA")).toMatch(/^No first home duty relief/);
    expect(dutyReliefSummary("TAS")).toMatch(/settling after 30 June 2026/);
    expect(dutyReliefSummary("ACT")).toMatch(/at any price, with no income test/);
    expect(dutyReliefSummary("NT")).toMatch(/^No first home buyer duty concession/);
  });

  it("keeps the earlier versions the calculator needs", () => {
    expect(dutyReliefFor("NSW", "established", "2023-06-30").version?.method).toMatchObject({ exemptTo: 650_000, concessionTo: 800_000 });
    expect(dutyReliefFor("WA", "established", "2026-05-06").version?.method).toMatchObject({ exemptTo: 500_000 });
    expect(dutyReliefFor("WA", "established", "2024-05-09").version?.method).toMatchObject({ exemptTo: 450_000 });
    expect(dutyReliefFor("WA", "established", "2024-05-08").version?.method).toMatchObject({ exemptTo: 430_000 });
    expect(dutyReliefFor("QLD", "new", "2025-04-30").version?.method.type).toBe("deduction-table");
    expect(dutyReliefFor("QLD", "vacant-land", "2025-04-30").version?.method).toMatchObject({ exemptTo: 350_000, concessionTo: 500_000 });
    expect(dutyReliefFor("SA", "new", "2024-06-05").version?.method).toMatchObject({ exemptTo: 650_000, concessionTo: 700_000 });
    expect(dutyReliefFor("TAS", "established", "2026-06-30").version?.method).toMatchObject({ type: "percent", percent: 100, capTo: 750_000 });
    expect(dutyReliefFor("TAS", "established", "2024-02-17").version?.method).toMatchObject({ type: "percent", percent: 50, capTo: 600_000 });
    expect(dutyReliefFor("ACT", "established", "2026-06-30").version?.method).toMatchObject({ exemptTo: 1_020_000, maxConcession: 35_238 });
    expect(dutyReliefFor("ACT", "established", "2025-06-30").version).toBeNull();
  });

  it("dates Tasmania's relief by settlement and everyone else's by contract or transaction", () => {
    for (const s of AUSTRALIAN_STATES) {
      for (const k of PROPERTY_KINDS) {
        const basis = FIRST_HOME_DUTY_RELIEF[s][k].versions.map((v) => v.dateBasis);
        expect(new Set(basis).size, `${s} ${k}`).toBe(1);
        expect(basis[0]).toBe(s === "TAS" ? "settlement" : s === "ACT" ? "transaction" : "contract");
      }
    }
  });

  it("has no gaps or overlaps between versions", () => {
    for (const s of AUSTRALIAN_STATES) {
      for (const k of PROPERTY_KINDS) {
        const vs = FIRST_HOME_DUTY_RELIEF[s][k].versions;
        for (let i = 0; i + 1 < vs.length; i++) {
          const newer = vs[i];
          const older = vs[i + 1];
          expect(older.effectiveTo, `${s} ${k} #${i}`).not.toBeNull();
          const dayAfter = new Date(`${older.effectiveTo}T00:00:00Z`);
          dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);
          expect(newer.effectiveFrom, `${s} ${k} #${i}`).toBe(dayAfter.toISOString().slice(0, 10));
        }
      }
    }
  });
});

describe("sources and dates", () => {
  it("every grant and relief record names an official source and was reviewed on 14 October 2026", () => {
    expect(FIRST_HOME_REVIEWED_ON).toBe("2026-10-14");
    const records = [...Object.values(FIRST_HOME_GRANTS), ...AUSTRALIAN_STATES.flatMap((s) => Object.values(FIRST_HOME_DUTY_RELIEF[s]))];
    for (const r of records) {
      expect(r.source.href).toMatch(/^https:\/\/([a-z0-9-]+\.)*gov\.au\//);
      expect(r.source.label.length).toBeGreaterThan(10);
      expect(r.reviewedOn).toBe(FIRST_HOME_REVIEWED_ON);
      if (r.source.updated) expect(r.source.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("formats and parses dates", () => {
    expect(formatPolicyDate("2026-05-07")).toBe("7 May 2026");
    expect(toIsoDate("2026-07-01T10:00:00+10:00")).toBe("2026-07-01");
    expect(toIsoDate(new Date(2026, 6, 1))).toBe("2026-07-01");
    expect(toIsoDate("")).toBeNull();
    expect(toIsoDate("not a date")).toBeNull();
  });
});
