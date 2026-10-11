// The renters' rights guides (commercial-intent review, 10 Oct 2026,
// renting 0.2 to 0.4). NSW ended no-grounds terminations on 19 May 2025, but
// the NSW guide, its FAQPage answers and the link cards on six sibling
// guides still said NSW allowed them. These tests keep the sibling cards in
// the data file and stop the old claims coming back in any guide's source.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  NSW_RENTERS_SOURCES,
  RENTERS_GUIDES,
  renterGuideLinks,
  sourceItems,
  type RentersState,
} from "@/lib/data/renters-rights";

const GUIDES = path.resolve(__dirname, "../../src/app/(marketing)/guides");
const STATES = Object.keys(RENTERS_GUIDES) as RentersState[];
const page = (slug: string) => fs.readFileSync(path.join(GUIDES, slug, "page.tsx"), "utf8");

describe("renters' rights link cards", () => {
  it("has a guide page for every state", () => {
    for (const s of STATES) {
      expect(fs.existsSync(path.join(GUIDES, RENTERS_GUIDES[s].slug, "page.tsx")), s).toBe(true);
    }
  });

  it("renders the sibling cards from the data file on every guide", () => {
    for (const s of STATES) {
      const src = page(RENTERS_GUIDES[s].slug);
      expect(src, s).toContain("renterGuideLinks(");
      // No hand-typed card for another renters' guide.
      expect(src.match(/href: "\/guides\/renters-rights-/g), s).toBeNull();
    }
  });

  it("maps a state to its title, URL and blurb", () => {
    expect(renterGuideLinks(["NSW"])).toEqual([
      {
        title: RENTERS_GUIDES.NSW.linkTitle,
        href: "/guides/renters-rights-nsw",
        description: RENTERS_GUIDES.NSW.blurb,
      },
    ]);
  });

  it("says NSW landlords need a reason, never that NSW still allows no-grounds evictions", () => {
    expect(RENTERS_GUIDES.NSW.blurb).toContain("19 May 2025");
    for (const s of STATES) {
      const src = page(RENTERS_GUIDES[s].slug);
      expect(src, s).not.toMatch(/NSW (also )?still permits/i);
      expect(src, s).not.toMatch(/NSW where no-grounds evictions (remain|are still)/i);
      expect(src, s).not.toMatch(/NSW still permits them/i);
    }
  });
});

describe("NSW renters' rights guide", () => {
  const src = page("renters-rights-nsw");

  it("states the law since 19 May 2025 and 31 October 2024", () => {
    expect(src).not.toMatch(/No-grounds evictions are still permitted/);
    expect(src).not.toMatch(/On a periodic tenancy, yes/);
    expect(src).not.toMatch(/introduced stricter rules in 2023/);
    expect(src).toContain("Since 19 May 2025 a NSW landlord needs a reason to end a lease");
    expect(src).toContain("31 October 2024");
  });

  it("answers the eviction FAQ (FAQPage JSON-LD) with no", () => {
    const faq = src.match(/question: "Can my landlord evict me without a reason in NSW\?",\s*answer:\s*"([^"]+)"/);
    expect(faq?.[1].startsWith("No. Since 19 May 2025")).toBe(true);
  });

  it("prints a sourced and dated Sources block", () => {
    expect(src).toContain("<Sources");
    expect(src).toMatch(/\n\s+sourced\n/);
    for (const s of Object.values(NSW_RENTERS_SOURCES)) {
      expect(s.href).toMatch(/^https:\/\/www\.nsw\.gov\.au\//);
      expect(s.date).toMatch(/^(last updated \d{1,2} \w+ 20\d\d|no date shown)$/);
      expect(s.read).toMatch(/^\d{1,2} \w+ 2026$/);
    }
    expect(sourceItems(NSW_RENTERS_SOURCES).length).toBe(Object.keys(NSW_RENTERS_SOURCES).length);
  });
});
