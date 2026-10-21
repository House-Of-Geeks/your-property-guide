// Suburb template fixes of 21 Oct 2026 (page 2 push): the place line, titles,
// descriptions, FAQ and Place JSON-LD all derive from Suburb.region (the LGA
// short name), the headings render as single text nodes, and no placeholder
// dash reaches the output.
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Suburb } from "@/types";
import { buildSuburbFaqs } from "@/lib/suburb-faq";
import { legacySuburbDescription, legacySuburbTitle, suburbBuyDescription, suburbDescriptionHousePrices } from "@/lib/utils/seo";
import { SuburbHero } from "@/components/suburb/SuburbHero";
import { SuburbSellingGuideCTA } from "@/components/suburb/SuburbSellingGuideCTA";
import { SuburbContextualLinks } from "@/components/suburb/SuburbContextualLinks";
import { SuburbWalkability } from "@/components/suburb/SuburbWalkability";
import { PlaceJsonLd } from "@/components/seo";
import { capitalCityFor } from "@/lib/utils/metro";

// The seo components index reaches a module marked server-only.
vi.mock("server-only", () => ({}));

function makeSuburb(over: Partial<Suburb> = {}): Suburb {
  return {
    id: "t", slug: "flinders-view-qld-4305", name: "Flinders View", postcode: "4305", state: "QLD", region: "Ipswich", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 0, medianUnitPrice: 0, medianRentHouse: 0, medianRentUnit: 0, annualGrowthHouse: 0, annualGrowthUnit: 0, daysOnMarket: 0, population: 0, medianAge: 0, ownerOccupied: 0, renterOccupied: 0, householdsFamily: 0, householdsLonePerson: 0, walkScore: null, transitScore: null, bikeScore: null },
    ...over,
  };
}
const flindersView = () => makeSuburb();
const mountHutton = () => makeSuburb({ slug: "mount-hutton-nsw-2290", name: "Mount Hutton", postcode: "2290", state: "NSW", region: "Lake Macquarie" });
const brisbaneSuburb = () => makeSuburb({ slug: "sunnybank-qld-4109", name: "Sunnybank", postcode: "4109", state: "QLD", region: "Brisbane" });
const answerTo = (s: Suburb, q: string) => buildSuburbFaqs(s).find((f) => f.question === q)?.answer ?? "";
const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("meta text names the LGA, not a capital the suburb is outside", () => {
  it("keeps 'in Greater Brisbane' for a Brisbane City suburb", () => {
    expect(suburbDescriptionHousePrices(brisbaneSuburb())).toContain(", in Greater Brisbane");
    expect(legacySuburbDescription(brisbaneSuburb())).toContain(", in Greater Brisbane.");
  });
  it("says the Ipswich City Council area for an Ipswich suburb in postcode 4305", () => {
    expect(suburbDescriptionHousePrices(flindersView())).toContain(", in the Ipswich City Council area");
    expect(legacySuburbDescription(flindersView())).toContain("postcode is 4305, in the Ipswich City Council area.");
    expect(legacySuburbDescription(flindersView())).not.toContain("Greater Brisbane");
  });
  it("says the Lake Macquarie City Council area for Mount Hutton, which has no capital", () => {
    expect(capitalCityFor("NSW", "2290")).toBeNull();
    expect(suburbDescriptionHousePrices(mountHutton())).toContain(", in the Lake Macquarie City Council area");
    expect(legacySuburbDescription(mountHutton())).toContain("postcode is 2290, in the Lake Macquarie City Council area.");
  });
  it("uses commas and colons, never a dash", () => {
    expect(legacySuburbTitle(mountHutton())).toBe("Mount Hutton Postcode 2290 (NSW): Suburb Profile & Median Price");
    for (const text of [legacySuburbTitle(flindersView()), legacySuburbDescription(flindersView()), suburbBuyDescription(flindersView()), suburbDescriptionHousePrices(flindersView())]) {
      expect(text).not.toMatch(/[\u2013\u2014]/);
    }
    expect(suburbBuyDescription(mountHutton())).toContain("Browse all property for sale in Mount Hutton 2290: houses, units, townhouses and land.");
  });
});

describe("FAQ 'Where is X?'", () => {
  it("keeps the capital answer for the capital's own council", () => {
    const a = answerTo(brisbaneSuburb(), "Where is Sunnybank?");
    expect(a).toContain("Sunnybank is a suburb of Brisbane, in QLD 4109.");
    expect(a).toContain("Greater Brisbane");
  });
  it("places an Ipswich suburb by its council, with no Brisbane claim", () => {
    const a = answerTo(flindersView(), "Where is Flinders View?");
    expect(a).toBe("Flinders View is a suburb in the Ipswich City Council area, QLD 4305.");
  });
  it("uses the same sentence for a non-capital suburb with an LGA", () => {
    expect(answerTo(mountHutton(), "Where is Mount Hutton?")).toBe("Mount Hutton is a suburb in the Lake Macquarie City Council area, NSW 2290.");
  });
  it("keeps the old answers when no LGA is known", () => {
    expect(answerTo(makeSuburb({ region: "" }), "Where is Flinders View?")).toContain("Flinders View is a suburb of Brisbane, in QLD 4305.");
    expect(answerTo(makeSuburb({ region: "NSW", state: "NSW", postcode: "2290" }), "Where is Flinders View?")).toBe("Flinders View is a regional suburb in NSW, postcode 2290.");
  });
});

describe("hero", () => {
  const hero = (s: Suburb, updatedAt?: Date | null) =>
    html(React.createElement(SuburbHero, { suburb: s, capitalCity: capitalCityFor(s.state, s.postcode), updatedAt } as React.ComponentProps<typeof SuburbHero>, "x"));

  it("writes the H1 as one string, with no node split", () => {
    const out = hero(flindersView());
    expect(out).toContain("Flinders View, QLD 4305</h1>");
    expect(out).not.toContain("<!-- -->");
  });
  it("links the LGA to its region page and shows no Greater Brisbane link for Ipswich", () => {
    const out = hero(flindersView());
    expect(out).toContain('href="/regions/ipswich"');
    expect(out).toContain("Ipswich City Council");
    expect(out).toContain("All suburbs in postcode 4305");
    expect(out).not.toContain("Greater Brisbane");
    expect(out).not.toContain("/property-market/brisbane");
  });
  it("keeps the Greater Brisbane link for Brisbane City, and for a suburb with no LGA", () => {
    expect(hero(brisbaneSuburb())).toContain('href="/property-market/brisbane"');
    expect(hero(makeSuburb({ region: "" }))).toContain('href="/property-market/brisbane"');
  });
  it("links Lake Macquarie to /regions/lake-macquarie", () => {
    expect(hero(mountHutton())).toContain('href="/regions/lake-macquarie"');
  });
  it("draws the Updated line only with a real date", () => {
    const out = hero(flindersView(), new Date("2026-10-20T23:30:00Z"));
    expect(out).toContain('Updated <time dateTime="2026-10-21">21 October 2026</time>');
    expect(hero(flindersView(), null)).not.toContain("Updated");
    expect(hero(flindersView())).not.toContain("<time");
  });
});

describe("headings are single text nodes", () => {
  it("selling guide heading", () => {
    const out = html(React.createElement(SuburbSellingGuideCTA, { suburbName: "Flinders View", suburbSlug: "flinders-view-qld-4305" }));
    expect(out).toContain("Selling in Flinders View? Get the free selling guide</h2>");
  });
});

describe("related links", () => {
  const links = (s: Suburb, hasPublishedMedian: boolean) =>
    html(React.createElement(SuburbContextualLinks, {
      suburb: { name: s.name, slug: s.slug, state: s.state, postcode: s.postcode, nearbySuburbs: s.nearbySuburbs },
      availability: {} as never,
      hasPublishedMedian,
    }));

  it("draws the house prices anchor only with a published median", () => {
    expect(links(flindersView(), true)).toContain("Flinders View house prices");
    expect(links(flindersView(), false)).not.toContain("Flinders View house prices");
  });
  it("adds the editorial link after the neighbours, deduped, and keeps the column with no neighbours", () => {
    const yamanto = makeSuburb({ slug: "yamanto-qld-4305", name: "Yamanto", nearbySuburbs: ["ipswich-qld-4305", "flinders-view-qld-4305"] });
    const out = links(yamanto, true);
    expect(out.indexOf('href="/suburbs/ipswich-qld-4305"')).toBeLessThan(out.indexOf('>Flinders View<'));
    expect(out.match(/href="\/suburbs\/flinders-view-qld-4305"/g)).toHaveLength(1);
    const bare = makeSuburb({ slug: "eleebana-nsw-2282", name: "Eleebana", state: "NSW", postcode: "2282", nearbySuburbs: [] });
    const bareOut = links(bare, false);
    expect(bareOut).toContain("Nearby suburbs");
    expect(bareOut).toContain('href="/suburbs/mount-hutton-nsw-2290"');
    expect(bareOut).toContain("lg:grid-cols-4");
  });
  it("draws no Nearby suburbs column for a suburb with neither", () => {
    expect(links(flindersView(), true)).not.toContain("Nearby suburbs");
    expect(links(flindersView(), true)).toContain("lg:grid-cols-3");
  });
});

describe("walkability", () => {
  it("leaves a missing score out instead of printing a dash", () => {
    const out = html(React.createElement(SuburbWalkability, { walkScore: 62, transitScore: null, bikeScore: null }));
    expect(out).toContain("Walk");
    expect(out).not.toContain("Transit");
    expect(out).not.toMatch(/[\u2013\u2014]/);
    expect(out).toContain("grid-cols-1");
  });
});

describe("Place JSON-LD", () => {
  const ld = (props: Partial<React.ComponentProps<typeof PlaceJsonLd>>) => {
    const out = html(React.createElement(PlaceJsonLd, { name: "Flinders View", url: "/suburbs/flinders-view-qld-4305", addressRegion: "QLD", ...props }));
    const m = out.match(/<script type="application\/ld\+json">(.*?)<\/script>/)!;
    return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&"));
  };

  it("carries an @id, the council and the full state name", () => {
    const j = ld({ lgaName: "City of Ipswich", stateName: "Queensland" });
    expect(j["@id"]).toMatch(/\/suburbs\/flinders-view-qld-4305#place$/);
    expect(j.containedInPlace).toEqual({
      "@type": "AdministrativeArea",
      name: "City of Ipswich",
      containedInPlace: { "@type": "State", name: "Queensland", containedInPlace: { "@type": "Country", name: "Australia" } },
    });
  });
  it("without a council keeps the old shape, as a State when the full name is given", () => {
    expect(ld({}).containedInPlace).toEqual({ "@type": "AdministrativeArea", name: "QLD", containedInPlace: { "@type": "Country", name: "Australia" } });
    expect(ld({ stateName: "Queensland" }).containedInPlace["@type"]).toBe("State");
  });
  it("emits geo whenever both coordinates are finite numbers, zero included", () => {
    expect(ld({ latitude: -27.6, longitude: 152.8 }).geo).toEqual({ "@type": "GeoCoordinates", latitude: -27.6, longitude: 152.8 });
    expect(ld({ latitude: 0, longitude: 0 }).geo).toBeDefined();
    expect(ld({ latitude: null, longitude: 152.8 }).geo).toBeUndefined();
    expect(ld({ latitude: Number.NaN, longitude: 152.8 }).geo).toBeUndefined();
  });
});
