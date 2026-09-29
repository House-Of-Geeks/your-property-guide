// A South Australian police record is kept only when it names a place in South Australia.
import { describe, expect, it } from "vitest";
import { saIncidentPlace } from "../../scripts/sync/sources/crime-sa-rules";

describe("SA crime feed: where the incident happened", () => {
  it("keeps a South Australian suburb and its postcode", () => {
    expect(saIncidentPlace("ADELAIDE", "5000")).toEqual({ suburb: "ADELAIDE", postcode: "5000" });
    expect(saIncidentPlace("  MOUNT GAMBIER ", " 5290 ")).toEqual({ suburb: "MOUNT GAMBIER", postcode: "5290" });
  });
  it("restores the zero of the APY Lands' postcode", () => {
    expect(saIncidentPlace("PIPALYATJARA", "872")).toEqual({ suburb: "PIPALYATJARA", postcode: "0872" });
    expect(saIncidentPlace("AMATA", "0872")).toEqual({ suburb: "AMATA", postcode: "0872" });
  });
  it("keeps a record with no postcode, to be matched by name", () => {
    expect(saIncidentPlace("ADELAIDE", "")).toEqual({ suburb: "ADELAIDE", postcode: "" });
    expect(saIncidentPlace("ADELAIDE", null)).toEqual({ suburb: "ADELAIDE", postcode: "" });
  });
  it("skips an interstate address", () => {
    expect(saIncidentPlace("SYDNEY", "2000")).toBeNull();
    expect(saIncidentPlace("EAST MELBOURNE", "3002")).toBeNull();
    expect(saIncidentPlace("TOWNSVILLE", "4810")).toBeNull();
    expect(saIncidentPlace("GEORGE TOWN", "7253")).toBeNull();
    expect(saIncidentPlace("ALICE SPRING", "870")).toBeNull();
  });
  it("skips what is not a place", () => {
    expect(saIncidentPlace("NOT DISCLOSED", "NOT DISCLOSED")).toBeNull();
    expect(saIncidentPlace("Not Disclosed", "5000")).toBeNull();
    expect(saIncidentPlace("ADELAIDE", "NOT DISCLOSED")).toBeNull();
    expect(saIncidentPlace("", "5000")).toBeNull();
    expect(saIncidentPlace(undefined, undefined)).toBeNull();
  });
});
