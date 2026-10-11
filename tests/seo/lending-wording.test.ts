// Commercial intent review, 10 Oct 2026 (report 0.2 item 11, finance-tax
// F9): the buying guide, its thanks page, the homepage guide card, the
// buying-guide email and the guide registry promised "what lenders will
// actually approve, buffer included". Nothing on the site can say what a
// lender will approve; the borrowing power calculator gives an estimate at
// APRA's serviceability buffer (3 percentage points, held in APRA's May 2026
// macroprudential update, read 10 Oct 2026). The copy now says so.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildConfirmationHtml, confirmationCopy, type LeadEmailData } from "@/lib/lead-emails";

const FILES = [
  "src/app/(marketing)/buying-guide/page.tsx",
  "src/app/(marketing)/buying-guide/thanks/page.tsx",
  "src/components/home/GuidePathCard.tsx",
  "src/lib/guides/registry.ts",
];
const read = (p: string) => readFileSync(p, "utf8");

// An approval promise: a lender (or loan) "will approve", "will actually
// approve", "will say yes".
const PROMISE = /\b(?:lenders?|loan|bank)s?\b[^."\n]{0,40}\bwill\b[^."\n]{0,20}\b(?:approve|say yes)\b/i;

const buyer = (overrides: Partial<LeadEmailData> = {}): LeadEmailData => ({
  type: "guide-download",
  guideType: "buying",
  firstName: "Sam",
  email: "sam@example.com",
  suburb: "burpengary-qld-4505",
  buyerPersona: "first-home",
  financeStatus: "not-started",
  sellingTimeframe: "0-3-months",
  marketingConsent: false,
  ...overrides,
});

describe("no approval promises in the buying-guide funnel", () => {
  for (const f of FILES) {
    it(f, () => {
      const src = read(f);
      expect(src).not.toMatch(PROMISE);
      expect(src).not.toMatch(/actually approve/i);
    });
  }

  it("the guide bullets and the borrowing power card say what a lender may lend, at the APRA buffer", () => {
    const bullet = "What a lender may lend on your income and expenses, at the APRA buffer";
    expect(read(FILES[0])).toContain(bullet);
    expect(read(FILES[2])).toContain(bullet);
    expect(read(FILES[1])).toContain("An estimate of what a lender may lend on your income and expenses, at the APRA buffer");
    expect(read(FILES[3])).toContain("What a lender may lend on your income and expenses, how to structure the loan");
  });

  it("the buying-guide email's borrowing panel offers an estimate, not an approval", () => {
    for (const lead of [buyer(), buyer({ financeStatus: "pre-approved" })]) {
      const html = buildConfirmationHtml(lead);
      expect(html).toContain("/borrowing-power-calculator");
      expect(html).toContain("an estimate of what a lender may lend on your income and expenses, at the APRA buffer");
      expect(html).not.toMatch(PROMISE);
      expect(html).not.toMatch(/actually approve/i);
      const copy = confirmationCopy(lead);
      expect(`${copy.subject} ${copy.intro} ${copy.next} ${copy.preheader ?? ""}`).not.toMatch(PROMISE);
    }
  });
});
