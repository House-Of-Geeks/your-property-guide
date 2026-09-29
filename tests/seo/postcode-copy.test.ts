// Postcode pages name suburbs as suburbs and delivery names as delivery names.
import { describe, expect, it } from "vitest";
import { postcodeDescription, postcodeFaqs, postcodeLead, postcodeTitle } from "@/lib/postcode-copy";

const base = { postcode: "4506", state: "QLD", suburbNames: ["Morayfield", "Moorina"], postalNames: [] as string[], avgMedianHousePrice: "$760,000" };

describe("a postcode with suburbs only reads as it did", () => {
  it("title, description, lead and answers", () => {
    expect(postcodeTitle(base)).toBe("4506 Postcode — Morayfield, Moorina (QLD)");
    expect(postcodeDescription(base)).toBe("Postcode 4506 is Morayfield, Moorina in QLD. Average median house price $760,000. Browse suburb profiles, schools and property data.");
    expect(postcodeLead(base)).toBe("Postcode 4506 is in QLD and covers 2 suburbs: Morayfield, Moorina. Browse profiles, median prices, schools and property data for each below.");
    expect(postcodeFaqs(base)[0].answer).toBe("Postcode 4506 covers 2 suburbs in QLD: Morayfield, Moorina.");
    expect(postcodeFaqs(base)[1].answer).toBe("Postcode 4506 is in QLD, Australia.");
  });
  it("one suburb, and the 60-character title budget", () => {
    const one = { ...base, postcode: "4655", suburbNames: ["Hervey Bay"] };
    expect(postcodeLead(one)).toContain("covers the suburb of Hervey Bay.");
    expect(postcodeFaqs(one)[0].answer).toBe("Postcode 4655 is Hervey Bay, QLD.");
    const many = { ...base, postcode: "2850", state: "NSW", suburbNames: ["Mudgee", "Aarons Pass", "Apple Tree Flat", "Bara", "Barigan", "Botobolar"] };
    expect(postcodeTitle(many).length).toBeLessThanOrEqual(60);
    // three names would run to 64 characters, so the title falls back to two
    expect(postcodeTitle(many)).toBe("2850 Postcode — Mudgee, Aarons Pass & more (NSW)");
  });
});

describe("a postcode with delivery names", () => {
  const mixed = { ...base, postcode: "4211", suburbNames: ["Nerang", "Gaven"], postalNames: ["Nerang BC", "Nerang DC"] };
  it("keeps them out of the title and the suburb count, and names them in the answer", () => {
    expect(postcodeTitle(mixed)).toBe("4211 Postcode — Nerang, Gaven (QLD)");
    expect(postcodeLead(mixed)).toContain("covers 2 suburbs: Nerang, Gaven.");
    expect(postcodeDescription(mixed)).not.toContain("BC");
    expect(postcodeFaqs(mixed)[0].answer).toBe("Postcode 4211 covers 2 suburbs in QLD: Nerang, Gaven. Australia Post also uses 4211 for Nerang BC and Nerang DC, delivery names rather than suburbs.");
  });
  it("says so when the postcode has no suburb of its own", () => {
    const only = { postcode: "6849", state: "WA", suburbNames: [], postalNames: ["Perth BC"], avgMedianHousePrice: null };
    expect(postcodeTitle(only)).toBe("6849 Postcode — Perth BC (WA)");
    expect(postcodeDescription(only)).toBe("Postcode 6849 is an Australia Post delivery postcode in WA, used for Perth BC. It has no residential suburbs of its own.");
    expect(postcodeLead(only)).toBe("Postcode 6849 is in WA. Australia Post uses it for Perth BC; it has no residential suburbs of its own.");
    expect(postcodeFaqs(only)[0].answer).toBe("Postcode 6849 is not a residential suburb. Australia Post uses it for Perth BC in WA.");
  });
});
