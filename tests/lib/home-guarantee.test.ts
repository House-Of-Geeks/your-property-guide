// 5% Deposit Scheme figures (7 Oct 2026): the first home buyer guides quoted
// the scheme as it stood before 1 October 2025 (income caps of $125,000 and
// $200,000, a limited number of places, a $600,000 cap across Tasmania and the
// NT, $750,000 in the ACT, an open regional guarantee). The guides now read
// src/lib/data/home-guarantee.ts; these tests pin that file to the Investment
// Mandate Direction and keep the old figures out of the guides and posts.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/data/blogs";
import {
  HG_CHECKED_ON,
  HG_DATES,
  HG_MIN_DEPOSIT_PCT,
  HG_NT_CAP_BEFORE_SPLIT,
  HG_OTHER_TERRITORY_CAPS,
  HG_PRICE_CAPS,
  HG_SOURCES,
  hgCapSentence,
  hgPriceCap,
} from "@/lib/data/home-guarantee";

const GUIDES = path.resolve(__dirname, "../../src/app/(marketing)/guides");
const PERSONA_HUBS = path.resolve(__dirname, "../../src/lib/persona-hub-content.ts");

describe("5% Deposit Scheme data", () => {
  it("matches the price cap table in Direction s29F(1) (compilation 22, 18 July 2026)", () => {
    const table = Object.fromEntries(Object.entries(HG_PRICE_CAPS).map(([s, c]) => [s, [c.capital, c.rest]]));
    expect(table).toEqual({
      NSW: [1_500_000, 800_000],
      VIC: [950_000, 650_000],
      QLD: [1_000_000, 700_000],
      WA: [850_000, 600_000],
      SA: [900_000, 500_000],
      TAS: [700_000, 550_000],
      ACT: [1_000_000, null],
      NT: [750_000, 600_000],
    });
    expect(HG_OTHER_TERRITORY_CAPS.map((t) => t.cap)).toEqual([550_000, 400_000]);
    expect(HG_NT_CAP_BEFORE_SPLIT).toBe(600_000);
    expect(HG_PRICE_CAPS.NSW.regionalCentres).toHaveLength(6);
    expect(HG_PRICE_CAPS.VIC.regionalCentres).toEqual(["Geelong"]);
    expect(HG_PRICE_CAPS.QLD.regionalCentres).toEqual(["Gold Coast", "Sunshine Coast"]);
  });

  it("has the deposits and dates of the current rules, and dated official sources", () => {
    expect(HG_MIN_DEPOSIT_PCT).toEqual({ firstHome: 5, singleParent: 2 });
    expect(HG_DATES).toEqual({ expanded: "1 October 2025", ntCapSplit: "1 July 2026" });
    expect(HG_CHECKED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const source of Object.values(HG_SOURCES)) {
      expect(source.href).toMatch(/^https:\/\/(firsthomebuyers\.gov\.au|www\.legislation\.gov\.au)\//);
    }
  });

  it("words each state's caps", () => {
    expect(hgCapSentence("TAS")).toBe("$700,000 in Greater Hobart and $550,000 in the rest of Tasmania");
    expect(hgCapSentence("ACT")).toBe("$1,000,000 across the ACT");
    expect(hgCapSentence("NT")).toBe("$750,000 in Greater Darwin and $600,000 in the rest of the Northern Territory");
    expect(hgCapSentence("VIC")).toBe("$950,000 in Greater Melbourne and Geelong and $650,000 in the rest of Victoria");
    expect(hgPriceCap("ACT", "rest")).toBe(1_000_000);
  });
});

// Phrases from the pre-October 2025 scheme. Each is wrong today wherever it appears.
const STALE = [
  /\$125(,000|K|k) single/,
  /income limits? \$125/i,
  /\$200(,000|K|k) couple/,
  /35,000 places/,
  /FHBG places/,
  /places (run out|are limited each)/,
  /allocation round|allocates places|resets on 1 July and 1 January/,
  /uniform \$600(,000|K)/,
  /\$600,000 across (all|the NT)/,
  /\$750,000<\/strong>, joint/,
  /\$900K Sydney|\$900,000 Sydney/,
  /lower than the First Home Guarantee/,
  /FHBG cap|First Home Guarantee cap (of|is) \$/,
];

describe("no pre-October 2025 scheme figures", () => {
  const guideFiles = fs
    .readdirSync(GUIDES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(GUIDES, d.name, "page.tsx")))
    .map((d) => path.join(GUIDES, d.name, "page.tsx"));

  it("in the guides and the persona hubs", () => {
    const hits = [...guideFiles, PERSONA_HUBS].flatMap((file) => {
      const text = fs.readFileSync(file, "utf8");
      return STALE.filter((re) => re.test(text)).map((re) => `${path.basename(path.dirname(file))}: ${re}`);
    });
    expect(hits).toEqual([]);
  });

  it("in the blog posts", () => {
    const hits = blogPosts.flatMap((post) =>
      STALE.filter((re) => re.test(post.content) || re.test(post.excerpt)).map((re) => `${post.slug}: ${re}`),
    );
    expect(hits).toEqual([]);
  });

  it("in the ACT guide's description, which has to be a literal", () => {
    const act = fs.readFileSync(path.join(GUIDES, "first-home-buyer-act/page.tsx"), "utf8");
    expect(HG_PRICE_CAPS.ACT.capital).toBe(1_000_000);
    expect(act).toContain("the $1 million 5% Deposit Scheme cap");
  });
});
