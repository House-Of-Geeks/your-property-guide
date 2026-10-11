// The 2026–27 Budget's negative gearing and CGT changes, as passed on 25 June
// 2026 (Treasury Laws Amendment (Tax Reform No. 1) Act 2026; ATO page last
// updated 29 June 2026). Three of our pages contradicted the law and each
// other: /guides/cgt-changes-2026-budget said property held on budget night
// keeps the 50% discount, /guides/negative-gearing-australia said negative
// gearing was unchanged "as of April 2026" on 2023–24 tax rates, and
// /cgt-calculator did not mention 1 July 2027. These checks keep them in line
// with the law and with /guides/negative-gearing-cgt-changes-now-law-2026.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { blogPosts } from "@/lib/data/blogs";
import { TAX_REFORM_SOURCES, ATO_REFORM_SOURCE } from "@/lib/data/tax-reform-2027";

const MARKETING = join(__dirname, "../../src/app/(marketing)");
const read = (...p: string[]) => readFileSync(join(MARKETING, ...p), "utf8");
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const post = (slug: string) => {
  const p = blogPosts.find((b) => b.slug === slug);
  if (!p) throw new Error(`no post ${slug}`);
  return p;
};

describe("/guides/cgt-changes-2026-budget", () => {
  const p = post("cgt-changes-2026-budget");
  const body = text(p.content);

  it("keeps its URL and news form, and dates the correction", () => {
    expect(p.category).toBe("News");
    expect(p.publishedAt).toBe("2026-05-13");
    expect(p.updatedAt).toBe("2026-10-01");
    expect(p.content.indexOf("Correction, 1 October 2026")).toBeGreaterThanOrEqual(0);
    expect(p.content.indexOf("Correction, 1 October 2026")).toBeLessThan(200);
  });

  it("says what the law says: gains from 1 July 2027, on assets already owned too", () => {
    expect(body).toContain("1 July 2027");
    expect(body).toContain("the gain is split at 1 July 2027");
    expect(body).toContain("The 12 May 2026 cut-off belongs to the negative gearing change");
    expect(body).toContain("30% minimum tax");
    expect(p.excerpt).toContain("including on property you already own");
  });

  it("no longer carries the statements the correction withdraws", () => {
    for (const wrong of [
      "existing properties owned on 12 May 2026 are exempt",
      "keeps the 50% CGT discount when you sell",
      "Properties contracted after that time are under the new rules",
      "apply to sales (CGT events) from 1 July 2026",
      "continue under the existing 50% CGT discount system",
      "remains CGT-free",
      "only residential is affected",
    ]) {
      expect(body, wrong).not.toContain(wrong);
      expect(p.excerpt, wrong).not.toContain(wrong);
    }
  });

  it("links only to pages that exist", () => {
    const hrefs = [...p.content.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]);
    expect(hrefs).toContain("/cgt-calculator");
    for (const href of hrefs) {
      const slug = href.replace(/^\/guides\//, "");
      const ok =
        existsSync(join(MARKETING, href, "page.tsx")) ||
        (href.startsWith("/guides/") && blogPosts.some((b) => b.slug === slug));
      expect(ok, href).toBe(true);
    }
  });

  it("names and dates its primary sources, and uses no em-dash", () => {
    for (const s of ["last updated 29 June 2026", "Royal Assent 26 June 2026", "Act No. 49 of 2026", "12 May 2026", "28 May 2026"]) {
      expect(body, s).toContain(s);
    }
    expect(p.content).toContain(ATO_REFORM_SOURCE.href);
    expect(p.content).not.toContain("—");
  });

  it("agrees with the now-law article on the CGT start date", () => {
    const law = text(post("negative-gearing-cgt-changes-now-law-2026").content);
    expect(law).toContain("For gains accruing after 1 July 2027");
    expect(body).toContain("gains that accrue after 1 July 2027");
  });
});

describe("/guides/negative-gearing-australia", () => {
  const src = read("guides/negative-gearing-australia/page.tsx");

  it("is dated after the law passed", () => {
    expect(src).toContain('updatedAt: "2026-10-01"');
    expect(src).toContain("Updated 1 October 2026");
  });

  it("drops the pre-law status and the 2023–24 rates", () => {
    for (const stale of ["as of April 2026", "remains fully available", "No major party currently has a policy", "<td>19%</td>", "<td>32.5%</td>", "Not as of April 2026"]) {
      expect(src, stale).not.toContain(stale);
    }
  });

  it("builds the tax table from the calculator engine on the 2026–27 rates", () => {
    expect(src).toContain("computeNegativeGearing");
    expect(src).toMatch(/\[15, 30, 37, 45\]\.map/);
    expect(src).toContain("TAX_RATES_SOURCE");
  });

  it("answers the 2026 FAQ with the law, a figure and a source", () => {
    const m = src.match(/question: "Will negative gearing be removed in 2026\?",\s*answer:\s*([\s\S]*?)\n  \},/);
    expect(m).not.toBeNull();
    const answer = m![1];
    expect(answer).toContain("25 June 2026");
    expect(answer).toContain("1 July 2027");
    expect(answer).toContain("7:30pm AEST on 12 May 2026");
    expect(answer).toContain("ATO, last updated 29 June 2026");
    expect(answer.replace(/[`"+$]|\{[^}]*\}/g, " ").split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(40);
  });

  it("explains the CGT split and cites the reform sources", () => {
    expect(src).toContain("the gain up to 1 July 2027 keeps the 50%");
    expect(src).toContain("<Sources items={[...TAX_REFORM_SOURCES");
  });
});

describe("/cgt-calculator", () => {
  const src = read("cgt-calculator/page.tsx");

  it("carries a sourced note on gains after 1 July 2027", () => {
    expect(src).toContain('title="Gains after 1 July 2027"');
    expect(src).toContain("This calculator applies the rules for");
    expect(src).toContain("ATO, last updated 29 June 2026");
    expect(src).toMatch(/<Sources\s+items=\{\[[\s\S]*ATO_REFORM_SOURCE/);
    expect(src).toContain('updatedAt: "2026-10-11"');
  });

  it("keeps the FAQ (and so its FAQPage JSON-LD) in step with the note", () => {
    const m = src.match(/question: "What is the 50% CGT discount\?",\s*answer:\s*([\s\S]*?)\n  \},/);
    expect(m).not.toBeNull();
    expect(m![1]).toContain("1 July 2027");
    expect(src).toContain("faqs={FAQS}");
  });
});

describe("reform sources", () => {
  it("are primary, linked and dated", () => {
    expect(TAX_REFORM_SOURCES.length).toBe(4);
    for (const s of TAX_REFORM_SOURCES) {
      if (typeof s === "string") throw new Error("expected a linked source");
      expect(s.href).toMatch(/^https:\/\/(www\.ato\.gov\.au|www\.aph\.gov\.au|parlinfo\.aph\.gov\.au|budget\.gov\.au)\//);
      expect(s.note).toMatch(/2026/);
    }
  });
});
