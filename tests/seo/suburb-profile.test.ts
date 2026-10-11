// The suburb profile template (commercial intent review 10 Oct 2026,
// suburbs-market 3.1): what the page renders around the median.
import fs from "node:fs";
import { describe, expect, it } from "vitest";

const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/page.tsx", "utf8");
const hero = fs.readFileSync("src/components/suburb/SuburbHero.tsx", "utf8");

describe("the suburb profile", () => {
  it("H1 reads '{Suburb}, {STATE} {pc}'", () => {
    expect(hero).toContain('<span className="sr-only">{`, ${suburb.state} ${suburb.postcode}`}</span>');
  });
  it("leads with the median, or with why it is withheld, then the rent with its source", () => {
    expect(page).toContain("const firstSentence = leadSentence ?? (withheld ? withheldLeadSentence(suburb.name, withheld) : null);");
    expect(page).toContain("The median weekly house rent is $");
  });
  it("names the other suburbs in the postcode and links the postcode page", () => {
    expect(page).toContain("{`Postcode ${suburb.postcode} also covers `}");
    expect(page).toContain("`/postcodes/${suburb.postcode}`");
  });
  it("compares nearby suburbs on what their own profiles publish", () => {
    expect(page).toContain("How {suburb.name} compares with nearby suburbs.");
    expect(page).toContain("withPublishedSales(r)");
    expect(page).toContain("median: priceTrusted ? suburb.stats.medianHousePrice : 0,");
  });
  it("asks 'Is {Suburb} a good investment?' only where an investor view is written", () => {
    expect(page).toContain("{investorView ? `Is ${suburb.name} a good investment?` : \"Investment overview.\"}");
  });
  it("carries a WebPage node dated by the sales or rent as-at date, with no price", () => {
    expect(page).toContain('"@type": "WebPage"');
    expect(page).toContain("dateModified: asAt.toISOString().slice(0, 10)");
    const node = page.slice(page.indexOf('"@type": "WebPage"'), page.indexOf("/>", page.indexOf('"@type": "WebPage"')));
    expect(node).not.toMatch(/median|price/i);
  });
});
