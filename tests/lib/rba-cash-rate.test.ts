// /rba-cash-rate said 4.35% "as of 16 June 2026" until 10 Oct 2026, two
// decisions after the RBA moved to 4.60% (effective 30 Sep 2026), and listed
// past meetings as "remaining". The page now reads src/lib/data/rba-cash-rate.ts;
// these checks keep that file in step with the RBA's meeting schedule.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CASH_RATE_DECISIONS,
  MONETARY_POLICY_MEETINGS,
  lastPastMeeting,
  latestDecision,
  nextMeeting,
  sydneyToday,
  upcomingMeetings,
} from "@/lib/data/rba-cash-rate";
import { DATA_UPDATES } from "@/lib/data/data-updates";

const addDay = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

describe("cash rate decisions", () => {
  it("are newest first, one per day, each taking effect the next day", () => {
    for (let i = 1; i < CASH_RATE_DECISIONS.length; i++) {
      expect(CASH_RATE_DECISIONS[i - 1].announced > CASH_RATE_DECISIONS[i].announced).toBe(true);
    }
    for (const d of CASH_RATE_DECISIONS) expect(d.effective, d.announced).toBe(addDay(d.announced));
  });

  it("chain: each target is the previous one plus the change", () => {
    for (let i = 0; i < CASH_RATE_DECISIONS.length - 1; i++) {
      const d = CASH_RATE_DECISIONS[i];
      const prev = CASH_RATE_DECISIONS[i + 1];
      expect(Math.round((prev.rate + d.change) * 100) / 100, d.announced).toBe(d.rate);
    }
  });

  it("match the RBA's table as read on 10 Oct 2026", () => {
    expect(latestDecision()).toMatchObject({ announced: "2026-09-29", effective: "2026-09-30", rate: 4.6, change: 0.25 });
    const aug = CASH_RATE_DECISIONS.find((d) => d.announced === "2026-08-11");
    expect(aug).toMatchObject({ rate: 4.35, change: 0 });
    const rises2026 = CASH_RATE_DECISIONS.filter((d) => d.announced.startsWith("2026-") && d.change > 0);
    expect(rises2026.map((d) => d.announced)).toEqual(["2026-09-29", "2026-05-05", "2026-03-17", "2026-02-03"]);
  });

  it("fall on scheduled meeting days in the years the schedule covers", () => {
    const days = new Set(MONETARY_POLICY_MEETINGS.map((m) => m.decision));
    for (const d of CASH_RATE_DECISIONS.filter((x) => x.announced >= MONETARY_POLICY_MEETINGS[0].decision)) {
      expect(days.has(d.announced), d.announced).toBe(true);
    }
  });
});

describe("staleness: the build fails when a meeting's decision is missing", () => {
  it("records the decision of every scheduled meeting that has passed", () => {
    const past = lastPastMeeting();
    expect(past, "no past meeting in the schedule").toBeDefined();
    expect(
      latestDecision().announced >= past!.decision,
      `The RBA announced a decision on ${past!.decision}; add it to src/lib/data/rba-cash-rate.ts (latest recorded: ${latestDecision().announced})`,
    ).toBe(true);
  });

  it("has a next meeting in the schedule (add next year's dates when this fails)", () => {
    expect(nextMeeting(), "the schedule has run out").toBeDefined();
  });

  it("works on fixed dates", () => {
    // The day after the August meeting, with only the June decision recorded, is stale.
    expect(lastPastMeeting(new Date("2026-08-12T03:00:00Z"))!.decision).toBe("2026-08-11");
    // On 11 Oct 2026 the next decision is 3 November, and September is past.
    const oct = new Date("2026-10-11T01:00:00Z");
    expect(sydneyToday(oct)).toBe("2026-10-11");
    expect(nextMeeting(oct)!.decision).toBe("2026-11-03");
    expect(upcomingMeetings(oct).map((m) => m.decision)).not.toContain("2026-09-29");
    expect(upcomingMeetings(oct).map((m) => m.decision)).not.toContain("2026-08-11");
    // On a decision day, before it is recorded, the meeting is still upcoming.
    expect(nextMeeting(new Date("2026-11-03T01:00:00Z"))!.decision).toBe("2026-11-03");
  });
});

describe("/rba-cash-rate", () => {
  const src = readFileSync(join(__dirname, "../../src/app/(marketing)/rba-cash-rate/page.tsx"), "utf8");

  it("renders from the data file, not from figures typed into the page", () => {
    expect(src).toContain('from "@/lib/data/rba-cash-rate"');
    expect(src).toContain("latestDecision()");
    expect(src).toContain("upcomingMeetings()");
    expect(src).not.toMatch(/\b4\.35\b|\b4\.60\b/);
    expect(src).not.toContain("Remaining 2026");
    expect(src).toMatch(/export const revalidate = \d+/);
  });

  it("cites the RBA with a date", () => {
    expect(src).toContain("<Sources");
    expect(src).toContain("CASH_RATE_SOURCE.readOn");
  });

  it("is logged on /data-updates", () => {
    expect(DATA_UPDATES.some((u) => u.href === "/rba-cash-rate" && u.title.includes(`${latestDecision().rate.toFixed(2)}%`))).toBe(true);
  });
});

describe("/guides/fixed-vs-variable-rate-guide", () => {
  const src = readFileSync(join(__dirname, "../../src/app/(marketing)/guides/fixed-vs-variable-rate-guide/page.tsx"), "utf8");

  it("takes its rate context from the data file, not April 2026 copy", () => {
    expect(src).not.toContain("begun reducing the cash rate");
    expect(src).not.toContain("As of April 2026");
    expect(src).not.toContain("monthly cash rate decision");
    expect(src).toContain('from "@/lib/data/rba-cash-rate"');
    expect(src).toContain('updatedAt: "2026-10-11"');
  });

  it("would print four rises in 2026, from 3.60% to 4.60%", () => {
    const rises = CASH_RATE_DECISIONS.filter((d) => d.announced.startsWith("2026-") && d.change > 0);
    expect(rises).toHaveLength(4);
    expect(CASH_RATE_DECISIONS.find((d) => d.announced < "2026-01-01")!.rate).toBe(3.6);
    expect(CASH_RATE_DECISIONS.filter((d) => d.announced.startsWith("2025-") && d.change < 0)).toHaveLength(3);
  });
});
