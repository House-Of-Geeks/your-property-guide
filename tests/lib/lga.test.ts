import { describe, expect, it } from "vitest";
import {
  hasLga,
  isCapitalCouncil,
  lgaCouncilName,
  lgaPlaceName,
  regionPhrase,
  stateSchemaName,
  suburbPlaceProps,
} from "@/lib/utils/lga";

const BRISBANE = { name: "Brisbane", slug: "brisbane" };

describe("lgaCouncilName", () => {
  it("expands the short name", () => {
    expect(lgaCouncilName("Ipswich")).toBe("Ipswich City Council");
    expect(lgaCouncilName("Scenic Rim")).toBe("Scenic Rim Regional Council");
  });
});

describe("lgaPlaceName", () => {
  it("turns the council name into the place name", () => {
    expect(lgaPlaceName("Ipswich")).toBe("City of Ipswich");
    expect(lgaPlaceName("Lake Macquarie")).toBe("City of Lake Macquarie");
    expect(lgaPlaceName("Scenic Rim")).toBe("Scenic Rim Region");
    expect(lgaPlaceName("Sorell")).toBe("Sorell");
  });
  it("leaves a name it does not recognise unchanged", () => {
    expect(lgaPlaceName("Nowhere Land")).toBe("Nowhere Land");
    expect(lgaPlaceName("Launceston")).toBe("City of Launceston");
  });
});

describe("isCapitalCouncil", () => {
  it("matches the capital's own council however it is written", () => {
    expect(isCapitalCouncil("Brisbane", BRISBANE)).toBe(true);
    expect(isCapitalCouncil("Brisbane City", BRISBANE)).toBe(true);
    expect(isCapitalCouncil("brisbane city council", BRISBANE)).toBe(true);
    expect(isCapitalCouncil("City of Brisbane", BRISBANE)).toBe(true);
  });
  it("does not match another council", () => {
    expect(isCapitalCouncil("Ipswich", BRISBANE)).toBe(false);
    expect(isCapitalCouncil("Moreton Bay", BRISBANE)).toBe(false);
    expect(isCapitalCouncil("", BRISBANE)).toBe(false);
  });
});

describe("hasLga", () => {
  it("is false for an empty region, a state code or a state name", () => {
    expect(hasLga({ region: "" })).toBe(false);
    expect(hasLga({ region: null })).toBe(false);
    expect(hasLga({ region: "QLD" })).toBe(false);
    expect(hasLga({ region: "Queensland" })).toBe(false);
    expect(hasLga({ region: "New South Wales" })).toBe(false);
  });
  it("is true for a council name", () => {
    expect(hasLga({ region: "Ipswich" })).toBe(true);
    expect(hasLga({ region: "Lake Macquarie" })).toBe(true);
  });
});

describe("regionPhrase", () => {
  it("says Greater {capital} for the capital's own council or with no LGA", () => {
    expect(regionPhrase({ region: "Brisbane" }, BRISBANE)).toBe("Greater Brisbane");
    expect(regionPhrase({ region: "Brisbane City" }, BRISBANE)).toBe("Greater Brisbane");
    expect(regionPhrase({ region: "" }, BRISBANE)).toBe("Greater Brisbane");
    expect(regionPhrase({ region: "Queensland" }, BRISBANE)).toBe("Greater Brisbane");
  });
  it("names the council area for another council", () => {
    expect(regionPhrase({ region: "Ipswich" }, BRISBANE)).toBe("the Ipswich City Council area");
    expect(regionPhrase({ region: "Lake Macquarie" }, null)).toBe("the Lake Macquarie City Council area");
  });
  it("is null with no capital and no LGA", () => {
    expect(regionPhrase({ region: "" }, null)).toBeNull();
    expect(regionPhrase({ region: "NSW" }, null)).toBeNull();
  });
});

describe("stateSchemaName and suburbPlaceProps", () => {
  it("writes the full state name, never 'the ACT'", () => {
    expect(stateSchemaName("QLD")).toBe("Queensland");
    expect(stateSchemaName("ACT")).toBe("Australian Capital Territory");
    expect(stateSchemaName("NT")).toBe("Northern Territory");
  });
  it("passes the council only when the region names one", () => {
    const ipswich = suburbPlaceProps({ region: "Ipswich", state: "QLD", lat: -27.6, lng: 152.8 });
    expect(ipswich).toEqual({ latitude: -27.6, longitude: 152.8, lgaName: "City of Ipswich", stateName: "Queensland" });
    expect(suburbPlaceProps({ region: "Queensland", state: "QLD" }).lgaName).toBeUndefined();
  });
});
