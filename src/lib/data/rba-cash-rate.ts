// The Reserve Bank's cash rate target decisions and the Monetary Policy
// Board's meeting schedule, for /rba-cash-rate. One dated file instead of an
// array typed into the page: the page said 4.35% "as of 16 June 2026" until
// 10 Oct 2026, two decisions after the RBA had moved to 4.60%.
//
// On each meeting day (the decision is announced at 2.30pm Sydney time):
//   1. add the decision at the top of CASH_RATE_DECISIONS from the RBA's
//      Cash Rate Target table (effective date, change, new target) and its
//      media release;
//   2. bump CASH_RATE_SOURCE.readOn.
// tests/lib/rba-cash-rate.test.ts fails from the day after a scheduled
// meeting until its decision is here, and fails when the schedule below has
// no meeting left (add the next year's dates from the RBA's Board Meeting
// Schedules page).

export const CASH_RATE_SOURCE = {
  name: "Reserve Bank of Australia, Cash Rate Target",
  url: "https://www.rba.gov.au/statistics/cash-rate/",
  readOn: "10 October 2026",
} as const;

export const MEETING_SCHEDULE_SOURCE = {
  name: "Reserve Bank of Australia, Board Meeting Schedules (2026 and 2027)",
  url: "https://www.rba.gov.au/schedules-events/board-meeting-schedules.html",
  readOn: "10 October 2026",
} as const;

export interface CashRateDecision {
  /** The day the decision was announced, at 2.30pm Sydney time (ISO date). */
  announced: string;
  /** The day the target took effect: the RBA table's "Effective Date", the day after the announcement. */
  effective: string;
  /** The cash rate target after the decision, % a year. */
  rate: number;
  /** Change in percentage points; 0 is a hold. */
  change: number;
  /** The Monetary Policy Board's statement (media release), where linked. */
  statement?: { number: string; url: string };
}

/**
 * Every decision since March 2020, newest first, from the RBA's Cash Rate
 * Target table (read 10 Oct 2026). The announcement date is the day before the
 * effective date: since December 2007 a change takes effect the day after the
 * 2.30pm release.
 */
export const CASH_RATE_DECISIONS: readonly CashRateDecision[] = [
  { announced: "2026-09-29", effective: "2026-09-30", rate: 4.60, change: 0.25, statement: { number: "2026-27", url: "https://www.rba.gov.au/media-releases/2026/mr-26-27.html" } },
  { announced: "2026-08-11", effective: "2026-08-12", rate: 4.35, change: 0.00, statement: { number: "2026-19", url: "https://www.rba.gov.au/media-releases/2026/mr-26-19.html" } },
  { announced: "2026-06-16", effective: "2026-06-17", rate: 4.35, change: 0.00, statement: { number: "2026-15", url: "https://www.rba.gov.au/media-releases/2026/mr-26-15.html" } },
  { announced: "2026-05-05", effective: "2026-05-06", rate: 4.35, change: 0.25, statement: { number: "2026-12", url: "https://www.rba.gov.au/media-releases/2026/mr-26-12.html" } },
  { announced: "2026-03-17", effective: "2026-03-18", rate: 4.10, change: 0.25, statement: { number: "2026-08", url: "https://www.rba.gov.au/media-releases/2026/mr-26-08.html" } },
  { announced: "2026-02-03", effective: "2026-02-04", rate: 3.85, change: 0.25, statement: { number: "2026-03", url: "https://www.rba.gov.au/media-releases/2026/mr-26-03.html" } },
  { announced: "2025-12-09", effective: "2025-12-10", rate: 3.60, change: 0.00 },
  { announced: "2025-11-04", effective: "2025-11-05", rate: 3.60, change: 0.00 },
  { announced: "2025-09-30", effective: "2025-10-01", rate: 3.60, change: 0.00 },
  { announced: "2025-08-12", effective: "2025-08-13", rate: 3.60, change: -0.25 },
  { announced: "2025-07-08", effective: "2025-07-09", rate: 3.85, change: 0.00 },
  { announced: "2025-05-20", effective: "2025-05-21", rate: 3.85, change: -0.25 },
  { announced: "2025-04-01", effective: "2025-04-02", rate: 4.10, change: 0.00 },
  { announced: "2025-02-18", effective: "2025-02-19", rate: 4.10, change: -0.25 },
  { announced: "2024-12-10", effective: "2024-12-11", rate: 4.35, change: 0.00 },
  { announced: "2024-11-05", effective: "2024-11-06", rate: 4.35, change: 0.00 },
  { announced: "2024-09-24", effective: "2024-09-25", rate: 4.35, change: 0.00 },
  { announced: "2024-08-06", effective: "2024-08-07", rate: 4.35, change: 0.00 },
  { announced: "2024-06-18", effective: "2024-06-19", rate: 4.35, change: 0.00 },
  { announced: "2024-05-07", effective: "2024-05-08", rate: 4.35, change: 0.00 },
  { announced: "2024-03-19", effective: "2024-03-20", rate: 4.35, change: 0.00 },
  { announced: "2024-02-06", effective: "2024-02-07", rate: 4.35, change: 0.00 },
  { announced: "2023-12-05", effective: "2023-12-06", rate: 4.35, change: 0.00 },
  { announced: "2023-11-07", effective: "2023-11-08", rate: 4.35, change: 0.25 },
  { announced: "2023-10-03", effective: "2023-10-04", rate: 4.10, change: 0.00 },
  { announced: "2023-09-05", effective: "2023-09-06", rate: 4.10, change: 0.00 },
  { announced: "2023-08-01", effective: "2023-08-02", rate: 4.10, change: 0.00 },
  { announced: "2023-07-04", effective: "2023-07-05", rate: 4.10, change: 0.00 },
  { announced: "2023-06-06", effective: "2023-06-07", rate: 4.10, change: 0.25 },
  { announced: "2023-05-02", effective: "2023-05-03", rate: 3.85, change: 0.25 },
  { announced: "2023-04-04", effective: "2023-04-05", rate: 3.60, change: 0.00 },
  { announced: "2023-03-07", effective: "2023-03-08", rate: 3.60, change: 0.25 },
  { announced: "2023-02-07", effective: "2023-02-08", rate: 3.35, change: 0.25 },
  { announced: "2022-12-06", effective: "2022-12-07", rate: 3.10, change: 0.25 },
  { announced: "2022-11-01", effective: "2022-11-02", rate: 2.85, change: 0.25 },
  { announced: "2022-10-04", effective: "2022-10-05", rate: 2.60, change: 0.25 },
  { announced: "2022-09-06", effective: "2022-09-07", rate: 2.35, change: 0.50 },
  { announced: "2022-08-02", effective: "2022-08-03", rate: 1.85, change: 0.50 },
  { announced: "2022-07-05", effective: "2022-07-06", rate: 1.35, change: 0.50 },
  { announced: "2022-06-07", effective: "2022-06-08", rate: 0.85, change: 0.50 },
  { announced: "2022-05-03", effective: "2022-05-04", rate: 0.35, change: 0.25 },
  { announced: "2022-04-05", effective: "2022-04-06", rate: 0.10, change: 0.00 },
  { announced: "2022-03-01", effective: "2022-03-02", rate: 0.10, change: 0.00 },
  { announced: "2022-02-01", effective: "2022-02-02", rate: 0.10, change: 0.00 },
  { announced: "2021-12-07", effective: "2021-12-08", rate: 0.10, change: 0.00 },
  { announced: "2021-11-02", effective: "2021-11-03", rate: 0.10, change: 0.00 },
  { announced: "2021-10-05", effective: "2021-10-06", rate: 0.10, change: 0.00 },
  { announced: "2021-09-07", effective: "2021-09-08", rate: 0.10, change: 0.00 },
  { announced: "2021-08-03", effective: "2021-08-04", rate: 0.10, change: 0.00 },
  { announced: "2021-07-06", effective: "2021-07-07", rate: 0.10, change: 0.00 },
  { announced: "2021-06-01", effective: "2021-06-02", rate: 0.10, change: 0.00 },
  { announced: "2021-05-04", effective: "2021-05-05", rate: 0.10, change: 0.00 },
  { announced: "2021-04-06", effective: "2021-04-07", rate: 0.10, change: 0.00 },
  { announced: "2021-03-02", effective: "2021-03-03", rate: 0.10, change: 0.00 },
  { announced: "2021-02-02", effective: "2021-02-03", rate: 0.10, change: 0.00 },
  { announced: "2020-12-01", effective: "2020-12-02", rate: 0.10, change: 0.00 },
  { announced: "2020-11-03", effective: "2020-11-04", rate: 0.10, change: -0.15 },
  { announced: "2020-10-06", effective: "2020-10-07", rate: 0.25, change: 0.00 },
  { announced: "2020-09-01", effective: "2020-09-02", rate: 0.25, change: 0.00 },
  { announced: "2020-08-04", effective: "2020-08-05", rate: 0.25, change: 0.00 },
  { announced: "2020-07-07", effective: "2020-07-08", rate: 0.25, change: 0.00 },
  { announced: "2020-06-02", effective: "2020-06-03", rate: 0.25, change: 0.00 },
  { announced: "2020-05-05", effective: "2020-05-06", rate: 0.25, change: 0.00 },
  { announced: "2020-04-07", effective: "2020-04-08", rate: 0.25, change: 0.00 },
  { announced: "2020-03-19", effective: "2020-03-20", rate: 0.25, change: -0.25 },
  { announced: "2020-03-03", effective: "2020-03-04", rate: 0.50, change: -0.25 },
];

export interface PolicyMeeting {
  /** First day of the two-day meeting (ISO date). */
  start: string;
  /** Second day: the decision is announced at 2.30pm Sydney time (ISO date). */
  decision: string;
}

/** The Monetary Policy Board's meetings for 2026 and 2027 (RBA, read 10 Oct 2026). */
export const MONETARY_POLICY_MEETINGS: readonly PolicyMeeting[] = [
  { start: "2026-02-02", decision: "2026-02-03" },
  { start: "2026-03-16", decision: "2026-03-17" },
  { start: "2026-05-04", decision: "2026-05-05" },
  { start: "2026-06-15", decision: "2026-06-16" },
  { start: "2026-08-10", decision: "2026-08-11" },
  { start: "2026-09-28", decision: "2026-09-29" },
  { start: "2026-11-02", decision: "2026-11-03" },
  { start: "2026-12-07", decision: "2026-12-08" },
  { start: "2027-02-08", decision: "2027-02-09" },
  { start: "2027-03-22", decision: "2027-03-23" },
  { start: "2027-05-03", decision: "2027-05-04" },
  { start: "2027-06-21", decision: "2027-06-22" },
  { start: "2027-08-09", decision: "2027-08-10" },
  { start: "2027-09-27", decision: "2027-09-28" },
  { start: "2027-11-01", decision: "2027-11-02" },
  { start: "2027-12-13", decision: "2027-12-14" },
];

/** The time of day the decision is released, Sydney time. */
export const DECISION_TIME = "2.30pm";

/** Today's date in Sydney as YYYY-MM-DD (the RBA's own calendar). */
export function sydneyToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function latestDecision(): CashRateDecision {
  return CASH_RATE_DECISIONS[0];
}

/**
 * Meetings whose decision has not been announced yet. A meeting stays here
 * on its decision day until a decision for that day is recorded, so the page
 * never lists a meeting as past before the result is on it.
 */
export function upcomingMeetings(now: Date = new Date()): PolicyMeeting[] {
  const today = sydneyToday(now);
  const recorded = new Set(CASH_RATE_DECISIONS.map((d) => d.announced));
  return MONETARY_POLICY_MEETINGS.filter((m) => m.decision >= today && !recorded.has(m.decision));
}

export function nextMeeting(now: Date = new Date()): PolicyMeeting | undefined {
  return upcomingMeetings(now)[0];
}

/** The latest scheduled meeting whose decision day has passed (Sydney time). */
export function lastPastMeeting(now: Date = new Date()): PolicyMeeting | undefined {
  const today = sydneyToday(now);
  return [...MONETARY_POLICY_MEETINGS].reverse().find((m) => m.decision < today);
}

/** Rises, holds and cuts in a calendar year, for the page's summary line. */
export function decisionsInYear(year: number) {
  const inYear = CASH_RATE_DECISIONS.filter((d) => d.announced.startsWith(`${year}-`));
  return {
    rises: inYear.filter((d) => d.change > 0).length,
    cuts: inYear.filter((d) => d.change < 0).length,
    holds: inYear.filter((d) => d.change === 0).length,
  };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "30 September 2026" from an ISO date, with no time zone drift. */
export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "30 Sep 2026" from an ISO date. */
export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
}
