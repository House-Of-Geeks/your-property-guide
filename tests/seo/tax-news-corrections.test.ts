// The two budget-night news posts and the now-law report still told readers
// the old law on 10 Oct 2026 (commercial-intent review, finance-tax F2, F3):
// that property held on 12 May 2026 keeps the 50% CGT discount, that SMSFs
// and companies sit outside or inside the wrong rules, and that the policy
// was "law from budget night". These checks hold them to the Treasury Laws
// Amendment (Tax Reform No. 1) Act 2026 and the ATO page (29 June 2026), the
// same as /guides/cgt-changes-2026-budget (tests/seo/tax-reform-2027-pages).
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { blogPosts } from "@/lib/data/blogs";
import { ATO_REFORM_SOURCE } from "@/lib/data/tax-reform-2027";

const MARKETING = join(__dirname, "../../src/app/(marketing)");
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const post = (slug: string) => {
  const p = blogPosts.find((b) => b.slug === slug);
  if (!p) throw new Error(`no post ${slug}`);
  return p;
};

function expectLinksResolve(content: string) {
  const hrefs = [...content.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (const href of hrefs) {
    const slug = href.replace(/^\/guides\//, "");
    const ok =
      existsSync(join(MARKETING, href, "page.tsx")) ||
      (href.startsWith("/guides/") && blogPosts.some((b) => b.slug === slug));
    expect(ok, href).toBe(true);
  }
}

describe("/guides/federal-budget-2026-property", () => {
  const p = post("federal-budget-2026-property");
  const body = text(p.content);

  it("dates the correction at the top and moves updatedAt", () => {
    expect(p.publishedAt).toBe("2026-05-13");
    expect(p.updatedAt).toBe("2026-10-11");
    expect(p.content.indexOf("Correction, 11 October 2026")).toBeGreaterThanOrEqual(0);
    expect(p.content.indexOf("Correction, 11 October 2026")).toBeLessThan(200);
  });

  it("states the CGT law: split at 1 July 2027, on assets already owned, every asset", () => {
    expect(body).toContain("1 July 2027");
    expect(body).toContain("the gain is split at 1 July 2027");
    expect(body).toContain("including on assets you already own");
    expect(body).toContain("individuals, trusts and partnerships");
    expect(body).toContain("The 12 May 2026 cut-off belongs to the negative gearing change only");
    expect(p.excerpt).toContain("reaches property you already own");
  });

  it("no longer carries the withdrawn statements outside the correction note", () => {
    const afterNote = text(p.content.slice(p.content.indexOf("</em></p>")));
    for (const wrong of [
      "keeps the 50% CGT discount on sale",
      "fully grandfathered",
      "now law from budget night",
      "for residential investment property. Even if",
      "keeps the old 50% discount treatment",
      "revised down to 3%",
      "279 projects",
      "Existing investors grandfathered",
    ]) {
      expect(afterNote, wrong).not.toContain(wrong);
      expect(p.excerpt, wrong).not.toContain(wrong);
    }
  });

  it("links to the CGT article with the agreed anchor and to the calculators", () => {
    expect(p.content).toContain('<a href="/guides/cgt-changes-2026-budget">how the CGT change works from 1 July 2027</a>');
    expect(p.content).toContain('href="/cgt-calculator"');
    expect(p.content).toContain('href="/negative-gearing-calculator"');
    expectLinksResolve(p.content);
  });

  it("names and dates its primary sources and uses no em dash", () => {
    for (const s of ["last updated 29 June 2026", "Royal Assent 26 June 2026", "Act No. 49 of 2026", "section 26-155", "$2 billion Local Infrastructure Fund", "65,000 homes"]) {
      expect(body, s).toContain(s);
    }
    expect(p.content).toContain(ATO_REFORM_SOURCE.href);
    expect(p.content).toContain("budget-overview-2026-27.pdf");
    expect(p.content).not.toContain("\u2014");
  });
});
