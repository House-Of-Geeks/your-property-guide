// Item 20 of the September 2026 fix review: the eight /guides/stamp-duty-{state}
// pages are calculator-first and print only figures the engine computes. These
// tests pin the page content (built in src/lib/data/stamp-duty-state.ts) to
// src/lib/utils/stamp-duty.ts, check the FAQ answers meet the PAA rule (40+
// words, a figure, a source), and guard the Queensland article fold.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  AUSTRALIAN_STATES,
  EXAMPLE_PRICES,
  STAMP_DUTY_GUIDES,
  money,
  otherStates,
  stampDutySlug,
  standardRateRows,
  workedExamples,
  type AustralianState,
} from "../../src/lib/data/stamp-duty-state";
import { calculateStampDuty, STATE_DUTY_SCHEDULES } from "../../src/lib/utils/stamp-duty";
import { blogPosts } from "../../src/lib/data/blog-posts";

const ROOT = path.resolve(__dirname, "../..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("the state pages' worked examples equal the engine's output", () => {
  for (const s of AUSTRALIAN_STATES) {
    it(`${s}: $500,000, $750,000 and $1,000,000 for an investor, an owner-occupier, a first home buyer and the foreign surcharge`, () => {
      const rows = workedExamples(s);
      expect(rows.map((r) => r.price)).toEqual([...EXAMPLE_PRICES]);
      for (const r of rows) {
        expect(r.investor).toBe(calculateStampDuty(r.price, s, false, false, true).total);
        expect(r.owner).toBe(calculateStampDuty(r.price, s, false, false, false).total);
        expect(r.first).toBe(calculateStampDuty(r.price, s, true, false, false).total);
        expect(r.foreignSurcharge).toBe(calculateStampDuty(r.price, s, false, true, true).foreignSurcharge);
        expect(r.owner).toBeGreaterThan(0);
      }
    });
  }
});

describe("the rates table is generated from the engine's schedule", () => {
  for (const s of AUSTRALIAN_STATES.filter((x) => x !== "NT")) {
    it(`${s}: one row per bracket, each base printed as the engine holds it`, () => {
      const sch = STATE_DUTY_SCHEDULES[s];
      const rows = standardRateRows(s);
      expect(rows.length).toBe(sch.standard.rows.length + (s === "TAS" ? 1 : 0));
      for (const b of sch.standard.rows.filter((b) => b.base > 0 && !b.flat)) {
        expect(rows.some((r) => r.duty.startsWith(money(b.base)))).toBe(true);
      }
    });
  }
});

describe("the FAQ answers", () => {
  const REQUIRED: Array<[AustralianState, string]> = [
    ["NSW", "How much is stamp duty on a $800,000 house in NSW?"],
    ["NSW", "How do I avoid paying stamp duty in NSW?"],
    ["QLD", "How much stamp duty would I pay on a $1,000,000 house in Queensland?"],
    ["QLD", "What is the stamp duty on $820,000 in Queensland?"],
    ["WA", "What is stamp duty on $820,000 in WA?"],
    ["WA", "Who is eligible for stamp duty exemption WA?"],
  ];
  it("answer the People Also Ask questions the review found", () => {
    for (const [s, q] of REQUIRED) {
      expect(STAMP_DUTY_GUIDES[s].faqs.map((f) => f.question), `${s}: ${q}`).toContain(q);
    }
  });

  it("print the engine's figure for the price in the question", () => {
    const checks: Array<[AustralianState, string, number]> = [
      ["NSW", "How much is stamp duty on a $800,000 house in NSW?", calculateStampDuty(800_000, "NSW", false, false, false).total],
      ["QLD", "How much stamp duty would I pay on a $1,000,000 house in Queensland?", calculateStampDuty(1_000_000, "QLD", false, false, false).total],
      ["QLD", "How much stamp duty would I pay on a $1,000,000 house in Queensland?", calculateStampDuty(1_000_000, "QLD", false, false, true).total],
      ["QLD", "What is the stamp duty on $820,000 in Queensland?", calculateStampDuty(820_000, "QLD", false, false, false).total],
      ["WA", "What is stamp duty on $820,000 in WA?", calculateStampDuty(820_000, "WA", false, false, false).total],
    ];
    for (const s of AUSTRALIAN_STATES) {
      const q800 = STAMP_DUTY_GUIDES[s].faqs.find((f) => /\$800,000/.test(f.question));
      if (q800) checks.push([s, q800.question, calculateStampDuty(800_000, s, false, false, false).total]);
    }
    for (const [s, q, figure] of checks) {
      const f = STAMP_DUTY_GUIDES[s].faqs.find((x) => x.question === q);
      expect(f, `${s}: ${q}`).toBeDefined();
      expect(f!.answer, `${s}: ${q}`).toContain(money(figure));
    }
  });

  it("are 40+ words with a figure and a named source, on every state page", () => {
    const SOURCE = /Revenue NSW|SRO Victoria|Queensland Revenue Office|RevenueWA|RevenueSA|State Revenue Office|ACT Revenue Office|Territory Revenue Office|revenue office/;
    for (const s of AUSTRALIAN_STATES) {
      for (const f of STAMP_DUTY_GUIDES[s].faqs) {
        expect(words(f.answer), `${s}: ${f.question}`).toBeGreaterThanOrEqual(40);
        expect(f.answer, `${s}: ${f.question}`).toMatch(/\$[0-9][0-9,]*|[0-9.]+%/);
        expect(f.answer, `${s}: ${f.question}`).toMatch(SOURCE);
      }
    }
  });

  it("never print a zero as a duty figure except where the engine says the buyer pays nothing", () => {
    for (const s of AUSTRALIAN_STATES) {
      for (const f of STAMP_DUTY_GUIDES[s].faqs) {
        expect(f.answer).not.toMatch(/\$0\.\d/);
        expect(f.answer).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
  });
});

describe("copy rules", () => {
  it("no em-dashes and no unfilled figures anywhere in the state content", () => {
    const text = JSON.stringify(STAMP_DUTY_GUIDES);
    expect(text).not.toMatch(/—/);
    expect(text).not.toMatch(/NaN|undefined|Infinity/);
  });
});

describe("page wiring", () => {
  for (const s of AUSTRALIAN_STATES) {
    const slug = stampDutySlug(s);
    it(`/guides/${slug} renders the calculator-first template for ${s}`, () => {
      const src = read(`src/app/(marketing)/guides/${slug}/page.tsx`);
      expect(src).toContain(`stampDutyMetadata("${s}")`);
      expect(src).toContain(`<StampDutyStateGuide state="${s}" />`);
    });
    it(`/guides/${slug} links every other state, neighbours first`, () => {
      const others = otherStates(s);
      expect(new Set(others).size).toBe(7);
      expect(others).not.toContain(s);
    });
  }

  it("the calculator is locked to the state and preset, above the article body", () => {
    const tpl = read("src/components/guide/StampDutyStateGuide.tsx");
    expect(tpl).toContain("<StampDutyCalculator state={state} initialPrice={750_000} />");
    expect(tpl).toContain("beforeBody={calculator}");
  });

  it("/stamp-duty-calculator links the eight state pages under a Calculate by state heading", () => {
    const src = read("src/app/(marketing)/stamp-duty-calculator/page.tsx");
    expect(src).toContain('id="by-state"');
    expect(src).toContain("Calculate by state");
    expect(src).toContain("<StampDutyStateLinks />");
  });
});

describe("the Queensland article fold", () => {
  const OLD = "stamp-duty-queensland-what-you-need-to-know";
  it("redirects permanently to the QLD guide, from /guides and /blog", () => {
    const cfg = read("next.config.ts");
    expect(cfg).toMatch(new RegExp(`source: "/guides/${OLD}",\\s*destination: "/guides/stamp-duty-qld",\\s*permanent: true`));
    expect(cfg).toMatch(new RegExp(`source: "/blog/${OLD}",\\s*destination: "/guides/stamp-duty-qld",\\s*permanent: true`));
    // The specific /blog rule must come before the /blog wildcard or it never fires.
    expect(cfg.indexOf(`/blog/${OLD}`)).toBeLessThan(cfg.indexOf('source: "/blog/:path*"'));
  });
  it("is gone from the blog posts (so from the blog sitemap, feeds and lists) and from the guide rail", () => {
    expect(blogPosts.map((p) => p.slug)).not.toContain(OLD);
    expect(fs.existsSync(path.join(ROOT, `src/lib/data/blog-posts/${OLD}.ts`))).toBe(false);
    expect(read("src/components/blog/BlogGuideRail.tsx")).not.toContain(OLD);
    expect(read("src/app/(marketing)/guides/sitemap.ts")).not.toContain(OLD);
  });
  // The guides sitemap reads the guide registry (PR #90), which takes the
  // eight state guides from src/lib/guides/stamp-duty-frontmatter.ts.
  it("the eight state guides stay in the guides sitemap", async () => {
    const { default: sitemap } = await import("../../src/app/(marketing)/guides/sitemap");
    const urls = sitemap().map((e) => e.url);
    for (const s of AUSTRALIAN_STATES) expect(urls.some((u) => u.endsWith(`/guides/${stampDutySlug(s)}`)), stampDutySlug(s)).toBe(true);
    expect(urls.some((u) => u.endsWith(`/guides/${OLD}`))).toBe(false);
  });
});
