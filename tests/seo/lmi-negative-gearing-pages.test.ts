// Commercial intent review 3.3 (30 Sep 2026): the LMI and negative gearing
// calculators, and the rule that every calculator route is submitted in the
// pages sitemap. Source-text checks, so no Next runtime is needed.
import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const APP = join(__dirname, "../../src/app");
const MARKETING = join(APP, "(marketing)");
const read = (...p: string[]) => readFileSync(join(...p), "utf8");
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");

describe("pages sitemap", () => {
  it("submits every calculator route", () => {
    const sitemap = read(APP, "pages/sitemap.ts");
    const calculators = readdirSync(MARKETING).filter(
      (d) => d.endsWith("-calculator") && existsSync(join(MARKETING, d, "page.tsx")),
    );
    expect(calculators).toEqual(expect.arrayContaining(["lmi-calculator", "negative-gearing-calculator"]));
    const missing = calculators.filter((d) => !sitemap.includes("`${SITE_URL}/" + d + "`"));
    expect(missing).toEqual([]);
  });
});

const NEW_PAGES = [
  {
    slug: "lmi-calculator",
    h1: "LMI calculator: what lenders mortgage insurance costs in 2026",
    questions: ["How much LMI on a 10% deposit?", "How is the LMI rate calculated?", "How to avoid LMI without a 20% deposit?"],
    linkedFrom: [
      "guides/lenders-mortgage-insurance-guide/page.tsx",
      "guides/how-much-deposit-to-buy-a-house/page.tsx",
    ],
  },
  {
    slug: "negative-gearing-calculator",
    h1: "Negative gearing calculator: your weekly cost after tax (2026)",
    questions: [
      "How do I calculate negative gearing?",
      "Is negative gearing actually worth it?",
      "Can I still claim negative gearing on my investment property?",
    ],
    linkedFrom: ["guides/negative-gearing-australia/page.tsx"],
  },
];

describe.each(NEW_PAGES)("/$slug", ({ slug, h1, questions, linkedFrom }) => {
  const src = strip(read(MARKETING, slug, "page.tsx"));

  it("sets its own canonical and is not noindexed", () => {
    expect(src).toContain("alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` }");
    expect(src).toContain(`slug: "${slug}"`);
    expect(src).not.toMatch(/robots:\s*\{\s*index:\s*false/);
  });

  it("uses the calculator layout (WebApplication and FAQPage JSON-LD) with the required H1", () => {
    expect(src).toContain("<CalculatorPageLayout");
    expect(src).toContain(`title: "${h1}"`);
    expect(src).toContain("faqs={FAQS}");
  });

  it("answers the People Also Ask questions and says what it doesn't do", () => {
    for (const q of questions) expect(src).toContain(`question: "${q}"`);
    expect(src).toContain("What this calculator doesn&rsquo;t do");
  });

  it("is linked from /tools, the footer, the site map and its guides", () => {
    const href = `href: "/${slug}"`;
    expect(read(MARKETING, "tools/page.tsx")).toContain(href);
    expect(read(MARKETING, "site-map/page.tsx")).toContain(href);
    expect(read(__dirname, "../../src/components/layout/Footer.tsx")).toContain(href);
    for (const f of linkedFrom) expect(read(MARKETING, f)).toContain(`/${slug}`);
  });
});

describe("pair this with", () => {
  const layout = read(__dirname, "../../src/components/calculators/CalculatorPageLayout.tsx");
  const rail = (slug: string) => {
    const m = layout.match(new RegExp(`"${slug}":\\s*\\[([^\\]]*)\\]`));
    return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
  };
  it("the CGT and rental yield calculators point to the negative gearing calculator", () => {
    expect(rail("cgt-calculator")).toContain("negative-gearing-calculator");
    expect(rail("rental-yield-calculator")).toContain("negative-gearing-calculator");
  });
  it("both new calculators have a rail whose entries all exist", () => {
    for (const slug of ["lmi-calculator", "negative-gearing-calculator"]) {
      const steps = rail(slug);
      expect(steps).toHaveLength(3);
      for (const s of steps) expect(layout).toMatch(new RegExp(`^\\s*"${s}":\\s*\\{`, "m"));
    }
  });
});
