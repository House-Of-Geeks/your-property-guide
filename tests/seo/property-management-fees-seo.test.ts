// SEO recheck of PR #158 (28 Oct 2026): the rendered <title> stays at 60
// characters including the " | Your Property Guide" suffix, both meta
// descriptions stay inside 155, the visible FAQ and the FAQPage JSON-LD carry
// the same questions and answers, the tools hub and the guide registry list
// the calculator, and no page claims an "all-in" cost for states whose extras
// are not published.
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SITE_NAME } from "@/lib/constants/seo";
import { PM_FEES_FAQS } from "@/lib/data/property-management-fees";
import { CALCULATOR_GUIDES } from "@/lib/guides/hub-guides";
import { TOOL_GROUPS } from "@/lib/tools";
import { PropertyManagementFeesCalculator, type PropertyManagementFeesCalculatorProps } from "@/components/calculators/PropertyManagementFeesCalculator";
import CalculatorPage, { metadata as calcMeta } from "@/app/(marketing)/property-management-fees-calculator/page";
import Guide, { metadata as guideMeta } from "@/app/(marketing)/guides/property-management-fees-australia/page";

// The shared layouts reach a module marked server-only.
vi.mock("server-only", () => ({}));
// The guide's inline start box reads the router, which is not mounted outside the app.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push() {}, replace() {}, prefetch() {} }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const ROOT = path.resolve(__dirname, "../..");
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf8");
const CALC_FILE = "src/app/(marketing)/property-management-fees-calculator/page.tsx";
const GUIDE_FILE = "src/app/(marketing)/guides/property-management-fees-australia/page.tsx";

// The root layout's template is `%s | ${SITE_NAME}`.
const rendered = (t: unknown) => `${String(t)} | ${SITE_NAME}`;
const squash = (s: string) => s.replace(/\s+/g, " ");
const text = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;|&rsquo;/g, "'").replace(/\s+/g, " ").trim();

function jsonLd(html: string): Array<Record<string, unknown>> {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/\\u003c/g, "<")),
  );
}

describe("rendered titles", () => {
  it("the calculator <title> is 60 characters or fewer including the suffix", () => {
    const t = rendered(calcMeta.title);
    expect(t).toBe("Property Management Fees Calculator | Your Property Guide");
    expect(t.length).toBeLessThanOrEqual(60);
  });
  it("the fees guide <title> is 60 characters or fewer including the suffix and does not use the word calculator", () => {
    const t = rendered(guideMeta.title);
    expect(t).toBe("Property Management Fees by State 2026 | Your Property Guide");
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t.toLowerCase()).not.toContain("calculator");
  });
});

describe("calculator page description", () => {
  const WANT = "Free property management fees calculator. Work out the annual cost of managing your rental, starting from each state's average fee and published ranges.";
  it("meta, OG and WebApplication schema descriptions are the same 152 characters", () => {
    expect(WANT.length).toBe(152);
    expect(calcMeta.description).toBe(WANT);
    expect(calcMeta.openGraph?.description).toBe(WANT);
    const app = jsonLd(renderToStaticMarkup(createElement(CalculatorPage))).find((b) => b["@type"] === "WebApplication");
    expect(app?.description).toBe(WANT);
  });
});

describe("meta descriptions", () => {
  it("both are 155 characters or fewer", () => {
    expect(String(calcMeta.description).length).toBeLessThanOrEqual(155);
    expect(String(guideMeta.description).length).toBeLessThanOrEqual(155);
  });
  it("the guide's description leaves the word calculator to the new page and matches the guide manifest and the search index", () => {
    const d = String(guideMeta.description);
    expect(d.toLowerCase()).not.toContain("calculator");
    const manifest = (JSON.parse(read("src/lib/data/static-guides.json")) as { guides: Array<{ slug: string; description: string }> }).guides;
    expect(manifest.find((g) => g.slug === "property-management-fees-australia")?.description).toBe(d);
    expect(read("src/lib/services/search-service.ts")).toContain(`slug: "property-management-fees-australia",       title: "Property management fees Australia",                description: "${d}"`);
  });
  it("the figures in the guide's description match the state table", async () => {
    const { PM_STATE_FEES } = await import("@/lib/data/property-management-fees");
    const avgs = Object.values(PM_STATE_FEES).map((s) => s.management.average);
    expect(Math.min(...avgs)).toBe(5.8);
    expect(PM_STATE_FEES.NSW.management.average).toBe(5.8);
    expect(PM_STATE_FEES.WA.management.average).toBe(8.7);
    expect(PM_STATE_FEES.TAS.management.average).toBe(8.7);
    expect(Math.max(...avgs)).toBe(8.7);
    expect(String(guideMeta.description)).toContain("5.8% NSW to 8.7% WA and Tasmania");
  });
  it("the guide's description says the extra charges are published only where they are", () => {
    expect(String(guideMeta.description)).toBe(
      "Management fees by state for 2026 (5.8% NSW to 8.7% WA and Tasmania), letting fees, and renewal, inspection and statement charges where published.",
    );
    expect(String(guideMeta.description).length).toBeLessThanOrEqual(155);
  });
  it("the guide's updatedAt is the same in the page and the manifest", () => {
    const manifest = (JSON.parse(read("src/lib/data/static-guides.json")) as { guides: Array<{ slug: string; updatedAt: string }> }).guides;
    expect(read(GUIDE_FILE)).toContain('updatedAt: "2026-10-28"');
    expect(manifest.find((g) => g.slug === "property-management-fees-australia")?.updatedAt).toBe("2026-10-28");
  });
  it("the tax FAQ cites only sources that exist in the source list and prints no date it did not read", async () => {
    const { PM_FEES_FAQS, PM_FEE_SOURCES } = await import("@/lib/data/property-management-fees");
    const q5 = PM_FEES_FAQS.find((f) => f.question.includes("tax deductible"))!;
    expect(q5.answer).toContain("(ATO, Common property expenses)");
    const words = q5.answer.split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(40);
    expect(words).toBeLessThanOrEqual(60);
    expect(q5.answer).not.toMatch(/Rental properties guide|advertising|buyer's agent|selling the property/);
    expect(PM_FEE_SOURCES.ato.label).toContain("Common property expenses");
    expect(PM_FEE_SOURCES.ato.label).not.toContain("Rental properties guide");
    expect(PM_FEE_SOURCES.ato.date).toBeUndefined();
    expect(new URL(PM_FEE_SOURCES.ato.href!).hostname).toBe("www.ato.gov.au");
    const q4 = PM_FEES_FAQS.find((f) => f.question.includes("average property management fee")) ?? PM_FEES_FAQS[2];
    expect(q4.answer).not.toContain("and Queensland");
  });
});

describe("FAQ and FAQPage JSON-LD", () => {
  const html = renderToStaticMarkup(createElement(CalculatorPage));
  const faqLd = jsonLd(html).find((j) => j["@type"] === "FAQPage") as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> };
  it("the visible questions and answers are exactly the FAQPage JSON-LD entries", () => {
    expect(faqLd).toBeTruthy();
    expect(faqLd.mainEntity).toHaveLength(5);
    const body = text(html);
    for (const q of faqLd.mainEntity) {
      expect(body).toContain(text(q.name));
      expect(body).toContain(text(q.acceptedAnswer.text));
    }
    const h3 = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]));
    for (const q of faqLd.mainEntity) expect(h3).toContain(text(q.name));
  });
  it("every entry is one of the data file's sourced answers, word for word", () => {
    for (const q of faqLd.mainEntity) {
      const f = PM_FEES_FAQS.find((x) => x.question === q.name);
      expect(f, q.name).toBeTruthy();
      expect(q.acceptedAnswer.text).toBe(f!.answer);
    }
  });
  it("the guide passes the same data file's FAQ list to the shared Faq component", () => {
    expect(read(GUIDE_FILE)).toContain("faqs={PM_FEES_FAQS}");
  });
});

describe("tools hub and registry", () => {
  it("the tools hub lists the calculator once, in the investing group", () => {
    const all = TOOL_GROUPS.flatMap((g) => g.tools.map((t) => ({ group: g, ...t })));
    const hits = all.filter((t) => t.href === "/property-management-fees-calculator");
    expect(hits).toHaveLength(1);
    expect(hits[0].title).toBe("Property Management Fees Calculator");
  });
  it("the guide registry maps the calculator to the fees guide", () => {
    const row = CALCULATOR_GUIDES.find((r) => r.href === "/property-management-fees-calculator");
    expect(row).toBeTruthy();
    expect(row!.label).toBe("Property Management Fees Calculator");
    expect(row!.guides).toContain("property-management-fees-australia");
  });
});

describe("no all-in claim", () => {
  it("neither page nor the shared data says all-in or all in", () => {
    for (const f of [CALC_FILE, GUIDE_FILE, "src/lib/data/property-management-fees.ts", "src/components/calculators/PropertyManagementFeesCalculator.tsx"]) {
      expect(read(f), f).not.toMatch(/all[- ]in\b/i);
    }
    expect(text(renderToStaticMarkup(createElement(CalculatorPage)))).not.toMatch(/all[- ]in\b/i);
  });
  it("the guide prose, llms.txt, the guide rail and the article hook carry no all-in or stale range", () => {
    for (const f of ["public/llms.txt", "src/components/blog/BlogGuideRail.tsx", "src/content/articles/batches/batch-02.ts"]) {
      const lines = read(f).split("\n").filter((l) => l.includes("property-management-fees-australia") || l.includes("property manager too"));
      for (const l of lines) expect(l, f).not.toMatch(/all[- ]in\b/i);
    }
    const guide = read(GUIDE_FILE);
    expect(guide).not.toMatch(/7% to 12% in Brisbane, Perth and Adelaide/);
    expect(squash(guide)).toContain("5% to 8% in Sydney");
    expect(guide).not.toMatch(/AI Overview/);
    expect(guide).not.toContain("6% to 12%");
    expect(read("public/llms.txt")).not.toMatch(/Property management fees Australia\]\([^)]*\): [^\n]*(all-in|8 fee types and)/);
  });
});

const Calc = PropertyManagementFeesCalculator as (p: PropertyManagementFeesCalculatorProps) => ReturnType<typeof PropertyManagementFeesCalculator>;

describe("South Australia's starting fee", () => {
  const pct = (html: string) => html.match(/id="pm-pct"[^>]*value="([^"]*)"/)?.[1];
  it("renders the SA average (7.5) in the management fee box like every other state, and says it is separate from the Adelaide range", () => {
    const sa = renderToStaticMarkup(createElement(Calc, { initialState: "SA" }));
    expect(pct(sa)).toBe("7.5");
    const t = text(sa);
    expect(t).toContain("9% to 15% (Adelaide agencies mostly 9% to 11%); state average 7.5% (a separate statewide measure from LocalAgentFinder, not part of the Adelaide range)");
    expect(t).toContain("(a separate statewide measure from LocalAgentFinder, not part of the Adelaide range). The statewide average is the starting figure.");
    expect(t).not.toContain("it is a separate measure from the published range");
    expect(t).not.toContain("The low end of the published range is the starting figure.");
    const nsw = renderToStaticMarkup(createElement(Calc, { initialState: "NSW" }));
    expect(pct(nsw)).toBe("5.8");
    expect(text(nsw)).toContain("The average is the starting figure.");
  });
  it("the guide meta description does not contain the word calculator", () => {
    expect(String(guideMeta.description)).not.toMatch(/calculator/i);
  });
});

describe("no links to LocalAgentFinder or WhichRealEstateAgent", () => {
  const BANNED = /local-?agent-?finder|which-?real-?estate-?agent/i;
  const urlsIn = (v: unknown, out: string[] = []): string[] => {
    if (typeof v === "string") { if (/^https?:\/\//i.test(v)) out.push(v); }
    else if (Array.isArray(v)) v.forEach((x) => urlsIn(x, out));
    else if (v && typeof v === "object") Object.values(v).forEach((x) => urlsIn(x, out));
    return out;
  };
  it("neither site has a URL in the reference list, and both are still named in plain text", async () => {
    const { PM_FEE_SOURCES } = await import("@/lib/data/property-management-fees");
    for (const src of Object.values(PM_FEE_SOURCES)) expect(src.href ?? "", src.label).not.toMatch(BANNED);
    expect(Object.values(PM_FEE_SOURCES).some((s) => s.label.startsWith("LocalAgentFinder"))).toBe(true);
    expect(Object.values(PM_FEE_SOURCES).some((s) => s.label.startsWith("WhichRealEstateAgent"))).toBe(true);
  });
  it.each([
    ["the new calculator page", CalculatorPage],
    ["the guide", Guide],
  ])("%s: no href, and no JSON-LD url, sameAs or citation, points at either site", (_name, Page) => {
    const html = renderToStaticMarkup(createElement(Page));
    expect(html.length).toBeGreaterThan(10_000);
    for (const m of html.matchAll(/href="([^"]*)"/g)) expect(m[1]).not.toMatch(BANNED);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<")));
    expect(blocks.length).toBeGreaterThan(0);
    for (const u of urlsIn(blocks)) expect(u).not.toMatch(BANNED);
    // Plain-text naming survives in the page text, and other sources still link.
    expect(html).toMatch(/LocalAgentFinder/);
    expect(html).toMatch(/WhichRealEstateAgent/);
    expect(html).toMatch(/href="https:\/\/[^"]*reiq/i);
  });
  it("the guide's Article JSON-LD names Andy McMaster in reviewedBy", () => {
    const article = jsonLd(renderToStaticMarkup(createElement(Guide))).find((b) => b["@type"] === "Article");
    expect(article).toBeDefined();
    const reviewer = article!.reviewedBy as { name?: string } | undefined;
    expect(reviewer?.name).toBe("Andy McMaster");
    expect(JSON.stringify(article!.reviewedBy)).toContain("Andy McMaster");
  });
  it("the guide says the calculator starts at the state average, with no South Australia exception", () => {
    const t = squash(read(GUIDE_FILE));
    expect(t).toContain("start at the state average from the table, the extra charges");
    expect(t).not.toMatch(/starts at the low end of its published range/);
  });
  it("the guide, the calculator component and llms.txt contain no link to either site", () => {
    for (const f of [GUIDE_FILE, CALC_FILE, "src/components/calculators/PropertyManagementFeesCalculator.tsx", "src/lib/data/property-management-fees.ts"]) {
      expect(read(f), f).not.toMatch(/https?:\/\/[^\s"']*(localagentfinder|whichrealestateagent)/i);
    }
    for (const l of read("public/llms.txt").split("\n").filter((x) => /property-management-fees/.test(x))) expect(l).not.toMatch(BANNED);
  });
});
