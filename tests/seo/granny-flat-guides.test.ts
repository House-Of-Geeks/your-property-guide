// Commercial-intent review (10 Oct 2026), new homes F1 to F5: every state
// granny flat guide names the planning instrument it relies on, carries no
// claim the instrument contradicts, prints no unsourced cost, rent, yield,
// vacancy or value-uplift figure, renders its cost table from the shared
// Archicentre-derived helper and lists its dated sources. Source-text checks.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const GUIDES = path.resolve(__dirname, "../../src/app/(marketing)/guides");
const read = (slug: string) => fs.readFileSync(path.join(GUIDES, slug, "page.tsx"), "utf8");
const TITLE_BUDGET = 60;
const DESCRIPTION_BUDGET = 160;
const frontmatterString = (src: string, key: string) =>
  new RegExp(`${key}:\\s*\\n?\\s*"([^"]+)"`).exec(src)?.[1] ?? "";

// Claims the review found with no source: yields, value uplift, vacancy, returns.
const UNSOURCED = [
  /gross yield/i,
  /yields? of \d/i,
  /\d+(\.\d+)?% gross/i,
  /more value than/i,
  /vacancy/i,
  /compelling return/i,
  /well above standalone/i,
  /\$\d{3}(,\d{3})? ?(to|-) ?\$\d{3}\/week/i,
];

const STATES = [
  { slug: "granny-flat-guide-vic", instrument: [/Amendment VC253/, /clause 54/] },
  { slug: "granny-flat-guide-nsw", instrument: [/State Environmental Planning Policy \(Housing\) 2021/, /Schedule 1/, /section 54/] },
  { slug: "granny-flat-guide-qld", instrument: [/Planning Regulation 2017/, /Schedule 24/, /Planning Act 2016/, /City Plan 2014/] },
] as const;

describe("state granny flat guides", () => {
  for (const { slug, instrument } of STATES) {
    const src = read(slug);
    describe(slug, () => {
      it("names the instrument the rules come from", () => {
        for (const re of instrument) expect(src, String(re)).toMatch(re);
      });
      it("keeps the title and description inside the SERP budget and is re-dated", () => {
        expect(frontmatterString(src, "title").length).toBeLessThanOrEqual(TITLE_BUDGET);
        const d = frontmatterString(src, "description");
        expect(d.length).toBeGreaterThan(50);
        expect(d.length).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
        expect(src).toMatch(/updatedAt: "2026-10-1\d"/);
      });
      it("prints no unsourced yield, value-uplift, vacancy or rent figure", () => {
        for (const re of UNSOURCED) expect(src, String(re)).not.toMatch(re);
      });
      it("renders its cost table from the shared Archicentre-derived helper and lists dated sources", () => {
        expect(src).toContain("<GrannyFlatCostTable");
        expect(src).toContain("grannyFlatCostSource()");
        expect(src).toContain("<Sources");
        expect(src).toMatch(/read 1[01] October 2026/);
      });
      it("links the other four state guides", () => {
        for (const other of STATES.map((s) => s.slug).filter((s) => s !== slug)) {
          expect(src).toContain(`/guides/${other}`);
        }
      });
    });
  }

  it("VIC: no longer says a granny flat needs a council planning permit, and keeps the permit cases", () => {
    const src = read("granny-flat-guide-vic");
    expect(src).not.toMatch(/no state-wide complying-development pathway/);
    expect(src).not.toMatch(/typically need a council planning permit/);
    expect(src).not.toContain("VIC vs NSW");
    expect(src).not.toContain("2–8 months");
    expect(src).toContain("60 m²");
    expect(src).toContain("A building permit is always required");
    expect(src).toContain("300 m²");
    expect(src).toContain("28 March 2027");
  });

  it("NSW: names the Housing SEPP, not the Low Rise Housing Diversity Code, and drops the uplift and 'unique' claims", () => {
    const src = read("granny-flat-guide-nsw");
    expect(src).not.toContain("Low Rise Housing Diversity Code");
    expect(src).not.toMatch(/most streamlined/i);
    expect(src).not.toMatch(/\bunique\b/i);
    expect(src).not.toMatch(/20 to 30%|20% to 30%/);
    expect(src).not.toMatch(/14\.6%/);
    expect(src).toContain("450 m²");
    expect(src).toContain("12 m");
    expect(src).toContain("section 51");
    expect(src).toContain("version in force from 11 September 2026");
  });

  it("QLD: no unconfirmed council-DA rule, Brisbane limits or vacancy claim; renting since 26 Sep 2022 and the QBCC threshold", () => {
    const src = read("granny-flat-guide-qld");
    expect(src).not.toMatch(/Most projects require a Development Application/);
    expect(src).not.toMatch(/25 to 30 business days/);
    expect(src).not.toMatch(/600m²|600 m²/);
    expect(src).not.toMatch(/80m²|80 m²/);
    expect(src).toContain("26 September 2022");
    expect(src).toContain("$3,300");
    expect(src).toContain("Major amendment package L");
  });
});
