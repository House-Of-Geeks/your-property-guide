// The two budget-night news posts and the now-law report still told readers
// the old law on 10 Oct 2026 (commercial-intent review, finance-tax F2, F3):
// that property held on 12 May 2026 keeps the 50% CGT discount, that SMSFs
// and companies sit outside or inside the wrong rules, and that the policy
// was "law from budget night". These checks hold them to the Treasury Laws
// Amendment (Tax Reform No. 1) Act 2026 and the ATO page (29 June 2026), the
// same as /guides/cgt-changes-2026-budget (tests/seo/tax-reform-2027-pages).
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { blogPosts } from "@/lib/data/blogs";
import { ATO_REFORM_SOURCE } from "@/lib/data/tax-reform-2027";
import { computeNegativeGearing, defaultNegativeGearingInput } from "@/lib/negative-gearing-calc";

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

describe("/guides/negative-gearing-changes-2026-budget", () => {
  const p = post("negative-gearing-changes-2026-budget");
  const body = text(p.content);
  const afterNote = text(p.content.slice(p.content.indexOf("</em></p>")));

  it("dates the correction at the top, drops the false banner and trims the title", () => {
    expect(p.updatedAt).toBe("2026-10-11");
    expect(p.content.indexOf("Correction, 11 October 2026")).toBeLessThan(200);
    expect(p.title.length).toBeLessThanOrEqual(60);
    expect(p.title).toContain("Negative Gearing Changes 2026");
    expect(afterNote).not.toContain("reflects the rules as legislated");
  });

  it("states who the change covers, from section 26-155", () => {
    expect(body).toContain("Companies and most trusts : covered");
    expect(body).toContain("Complying super funds, including SMSFs : excluded");
    expect(body).toContain("section 26-155(3)");
    expect(body).toContain("7:30pm AEST on 12 May 2026");
    expect(body).toContain("2027-28 income year");
  });

  it("no longer carries the withdrawn statements after the correction note", () => {
    for (const wrong of [
      "SMSF investors purchasing new residential property within their fund, same rules apply",
      "were never subject to",
      "new homes are exempt from those changes too",
      "the policy is now law from budget night",
      "essentially the same one the ATO already uses for GST",
      "1.1 million Australians",
    ]) {
      expect(afterNote, wrong).not.toContain(wrong);
    }
  });

  it("links to the calculator that exists, and to the CGT article", () => {
    expect(p.content).not.toContain("/tools/negative-gearing-calculator");
    expect(p.content).toContain('<a href="/negative-gearing-calculator">negative gearing calculator</a>');
    expect(p.content).toContain('href="/guides/cgt-changes-2026-budget"');
    expectLinksResolve(p.content);
  });

  it("prints the calculator's own figures in the worked example", () => {
    const i = defaultNegativeGearingInput();
    const at37 = computeNegativeGearing(i);
    const at45 = computeNegativeGearing({ ...i, marginalRate: 45 });
    expect(i.timing).toBe("established-after-cutoff");
    const usd = (n: number) => `$${Math.abs(n).toLocaleString("en-AU")}`;
    expect(body).toContain(`loss of ${usd(at37.netRentalResult)} a year`);
    expect(body).toContain(`saves ${usd(at37.taxEffect)} of tax`);
    expect(body).toContain(`costs ${usd(at37.weeklyCostAfterTax)} a week after tax`);
    expect(body).toContain(`costs ${usd(at37.weeklyCostFrom2027)} a week`);
    expect(body).toContain(`${usd(at45.weeklyCostAfterTax)} a week before 1 July 2027 against ${usd(at45.weeklyCostFrom2027)} after`);
  });

  it("answers its FAQs in the body and cites dated primary sources", () => {
    expect(body).toContain("What are the changes in Australia's negative gearing policy for 2026?");
    expect(body).toContain("Does the change apply to SMSFs?");
    for (const s of ["last updated 29 June 2026", "Royal Assent 26 June 2026", "Act No. 49 of 2026", "10 August 2026"]) {
      expect(body, s).toContain(s);
    }
    expect(p.content).toContain(ATO_REFORM_SOURCE.href);
    expect(p.content).not.toContain("\u2014");
  });
});

describe("/guides/negative-gearing-cgt-changes-now-law-2026", () => {
  const p = post("negative-gearing-cgt-changes-now-law-2026");
  const body = text(p.content);

  it("has a title of 60 characters or fewer and a dated update", () => {
    expect(p.title.length).toBeLessThanOrEqual(60);
    expect(p.updatedAt).toBe("2026-10-11");
    expect(p.content.indexOf("Update, 11 October 2026")).toBeLessThan(200);
  });

  it("sends readers to the corrected explainer with the agreed anchor", () => {
    expect(p.content).toContain('<a href="/guides/negative-gearing-changes-2026-budget">what the negative gearing change does</a>');
    expectLinksResolve(p.content);
  });

  it("dates the SMSF borrowing ban and states its scope", () => {
    expect(body).toContain("from 10 August 2026, the 45th day after Royal Assent");
    expect(body).toContain("other than business real property");
    expect(body).not.toContain("98 votes to 39");
  });
});

describe("/guides/smsf-property-guide", () => {
  const src = readFileSync(join(MARKETING, "guides/smsf-property-guide/page.tsx"), "utf8");

  it("is dated after the change and states the LRBA ban from the Act", () => {
    expect(src).toContain('updatedAt: "2026-10-11"');
    expect(src).toContain('const LRBA_BAN_START = "10 August 2026"');
    expect(src).toContain("business real property");
    expect(src).toContain("section 67A");
    expect(src).toContain('question: "Can an SMSF still borrow to buy property?"');
  });

  it("no longer offers a new LRBA for residential property or unsourced loan pricing", () => {
    for (const stale of [
      "SMSFs can borrow money to purchase property through",
      "Borrowing requires a Limited Recourse Borrowing Arrangement",
      "1.5% to 2.5%",
      "Latrobe",
      "($150,000 personally (45% tax rate)",
      "at least every 3 years",
      "Half marginal rate</td>",
    ]) {
      expect(src, stale).not.toContain(stale);
    }
  });

  it("keeps CGT in super consistent with the CGT article and cites dated sources", () => {
    expect(src).toContain("super funds keep their one-third discount");
    expect(src).toContain("section 26-155(4)");
    expect(src).toContain('href="/guides/cgt-changes-2026-budget"');
    expect(src).toContain("<Sources");
    expect(src).toContain("Last updated 15 May 2026, read 11 October 2026");
  });
});
