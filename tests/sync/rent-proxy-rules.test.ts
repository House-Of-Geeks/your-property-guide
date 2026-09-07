// Census rent proxies belong only where no rental feed exists.
import { describe, expect, it } from "vitest";
import { RENTAL_FEED_STATES, censusMayWriteRent, hasRentalFeed } from "../../scripts/sync/sources/rent-proxy-rules";

describe("rent proxy rules", () => {
  it("knows which states have a bond-data feed", () => {
    expect([...RENTAL_FEED_STATES]).toEqual(["NSW", "VIC", "QLD", "SA"]);
    expect(hasRentalFeed("nsw")).toBe(true);
    expect(hasRentalFeed(" WA ")).toBe(false);
  });
  it("never lets the census write a rent in a feed state, covered or not", () => {
    expect(censusMayWriteRent("NSW", false)).toBe(false);
    expect(censusMayWriteRent("NSW", true)).toBe(false);
  });
  it("lets the census fill rents elsewhere unless a feed row exists", () => {
    expect(censusMayWriteRent("WA", false)).toBe(true);
    expect(censusMayWriteRent("TAS", true)).toBe(false);
  });
});
