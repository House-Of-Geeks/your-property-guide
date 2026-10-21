import { describe, expect, it } from "vitest";
import { formatUpdatedDate, suburbDataUpdatedAt } from "@/lib/suburb-dates";

const d = (s: string) => new Date(s);

describe("suburbDataUpdatedAt", () => {
  it("is the latest of the per-type refresh columns", () => {
    expect(
      suburbDataUpdatedAt({
        statsUpdatedAt: d("2026-09-01T00:00:00Z"),
        censusUpdatedAt: d("2026-01-01T00:00:00Z"),
        crimeUpdatedAt: d("2026-10-20T03:00:00Z"),
        hazardUpdatedAt: null,
      }),
    ).toEqual(d("2026-10-20T03:00:00Z"));
  });
  it("reads every column", () => {
    for (const col of [
      "statsUpdatedAt",
      "censusUpdatedAt",
      "salesUpdatedAt",
      "rentalUpdatedAt",
      "raiUpdatedAt",
      "crimeUpdatedAt",
      "walkabilityUpdatedAt",
      "climateUpdatedAt",
      "hazardUpdatedAt",
    ] as const) {
      expect(suburbDataUpdatedAt({ [col]: d("2026-10-21T00:00:00Z") }), col).toEqual(d("2026-10-21T00:00:00Z"));
    }
  });
  it("is null when every column is null or absent, with no fallback to updatedAt or now", () => {
    expect(suburbDataUpdatedAt({})).toBeNull();
    expect(suburbDataUpdatedAt({ statsUpdatedAt: null, salesUpdatedAt: null })).toBeNull();
    expect(suburbDataUpdatedAt({ updatedAt: d("2026-10-21T00:00:00Z"), statsUpdatedAt: null } as never)).toBeNull();
  });
});

describe("formatUpdatedDate", () => {
  it("writes the Sydney calendar day, ISO and en-AU long", () => {
    // 20 Oct 2026 23:30 UTC is 21 Oct 10:30 in Sydney (AEDT).
    expect(formatUpdatedDate(d("2026-10-20T23:30:00Z"))).toEqual({ iso: "2026-10-21", label: "21 October 2026" });
  });
  it("is null for an invalid date", () => {
    expect(formatUpdatedDate("not a date")).toBeNull();
  });
});
