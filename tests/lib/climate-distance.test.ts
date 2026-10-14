import { describe, expect, it } from "vitest";
import { MAX_REPRESENTATIVE_KM, climateWithheldNote, stationDistanceFor } from "@/lib/climate";

describe("station distance is checked against the suburb's coordinates", () => {
  it("corrects the stored distance older syncs copied across every suburb on a station (Buderim)", () => {
    // Buderim's centroid; the stored row says Brisbane is 11.4 km away.
    const km = stationDistanceFor("040913", 11.4, { lat: -26.685, lng: 153.053 });
    expect(km).toBeGreaterThan(85);
    expect(km).toBeLessThan(95);
    expect(km).toBeGreaterThan(MAX_REPRESENTATIVE_KM);
  });

  it("keeps the stored figure when the station or the coordinates are unknown", () => {
    expect(stationDistanceFor("999999", 7.2, { lat: -26.685, lng: 153.053 })).toBe(7.2);
    expect(stationDistanceFor("040913", 7.2, { lat: null, lng: null })).toBe(7.2);
  });

  it("says plainly why a far station's figures are left out", () => {
    expect(climateWithheldNote("Buderim", "Brisbane", 89.4)).toBe(
      "The nearest weather station in our data is Brisbane, about 89 km away. That's too far to describe Buderim's climate, so we've left the figures out rather than show another place's weather.",
    );
  });
});
