import { describe, expect, it } from "vitest";
import { SUBURB_LOCAL_CONTENT, localContentFor } from "@/lib/data/suburb-local-content";
import { EDITORIAL_LINKS_IN, editorialLinksFor } from "@/lib/data/editorial-links";

describe("localContentFor", () => {
  it("is null for a slug with no content", () => {
    expect(localContentFor("flinders-view-qld-4305")).toBeNull();
    expect(localContentFor("constructor")).toBeNull();
  });
  it("returns the entry for a slug that has one", () => {
    SUBURB_LOCAL_CONTENT["test-suburb-qld-4000"] = { shopsAndAmenities: { paragraphs: ["x"] } };
    try {
      expect(localContentFor("test-suburb-qld-4000")?.shopsAndAmenities?.paragraphs).toEqual(["x"]);
    } finally {
      delete SUBURB_LOCAL_CONTENT["test-suburb-qld-4000"];
    }
  });
});

describe("editorialLinksFor", () => {
  it("returns the exact anchors for a source page", () => {
    expect(editorialLinksFor("/regions/ipswich")).toEqual([
      { href: "/suburbs/flinders-view-qld-4305", anchor: "Flinders View" },
    ]);
    expect(editorialLinksFor("/suburbs/eleebana-nsw-2282")).toEqual([
      { href: "/suburbs/mount-hutton-nsw-2290", anchor: "Mount Hutton" },
    ]);
  });
  it("is empty for any other page", () => {
    expect(editorialLinksFor("/suburbs/bondi-nsw-2026")).toEqual([]);
    expect(Object.keys(EDITORIAL_LINKS_IN)).toHaveLength(6);
  });
});
