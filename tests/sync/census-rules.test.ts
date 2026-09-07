// Fix item 1, step 3: undo postcode-level census copies without touching real small localities.
import { describe, expect, it } from "vitest";
import { correctedRegion, isPostcodeLevelCensusRow } from "../../scripts/seed/census-rules";

describe("postcode-level census copy detection", () => {
  it("flags a value shared by other suburbs in the postcode (30 Mackay localities at 85,500)", () => {
    expect(isPostcodeLevelCensusRow({ population: 85500, ownerOccupied: 0, householdsFamily: 0, sharedInPostcode: 30 })).toBe(true);
    expect(isPostcodeLevelCensusRow({ population: 48267, ownerOccupied: 0, householdsFamily: 0, sharedInPostcode: 67 })).toBe(true);
  });
  it("flags a lone suburb with thousands of residents and no household data (Minto DC 27,796)", () => {
    expect(isPostcodeLevelCensusRow({ population: 27796, ownerOccupied: 0, householdsFamily: 0, sharedInPostcode: 1 })).toBe(true);
  });
  it("keeps tiny real localities whose household cells the ABS suppresses (Yoganup, 15 people)", () => {
    expect(isPostcodeLevelCensusRow({ population: 15, ownerOccupied: 0, householdsFamily: 0, sharedInPostcode: 1 })).toBe(false);
    expect(isPostcodeLevelCensusRow({ population: 14, ownerOccupied: 0, householdsFamily: 0, sharedInPostcode: 2 })).toBe(false);
  });
  it("never flags a suburb the suburb-level sync wrote households for", () => {
    expect(isPostcodeLevelCensusRow({ population: 85500, ownerOccupied: 52, householdsFamily: 70, sharedInPostcode: 30 })).toBe(false);
    expect(isPostcodeLevelCensusRow({ population: 4026, ownerOccupied: 0, householdsFamily: 61, sharedInPostcode: 1 })).toBe(false);
  });
  it("ignores unknown population", () => {
    expect(isPostcodeLevelCensusRow({ population: 0, ownerOccupied: 0, householdsFamily: 0, sharedInPostcode: 5 })).toBe(false);
  });
});

describe("Jervis Bay postcode collision", () => {
  it("moves NSW 2540 localities to Shoalhaven and leaves the Territory and Norfolk Island alone", () => {
    expect(correctedRegion({ state: "NSW", postcode: "2540", region: "Unincorp. Other Territories" })).toBe("Shoalhaven");
    expect(correctedRegion({ state: "ACT", postcode: "2540", region: "Unincorp. Other Territories" })).toBeNull();
    expect(correctedRegion({ state: "NSW", postcode: "2899", region: "Unincorp. Other Territories" })).toBeNull();
    expect(correctedRegion({ state: "NSW", postcode: "2540", region: "Shoalhaven" })).toBeNull();
  });
});
