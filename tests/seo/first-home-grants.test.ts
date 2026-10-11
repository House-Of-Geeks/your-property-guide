// Commercial-intent review 10 Oct 2026, buying 0.1 and 0.2: first home grants
// and duty thresholds were typed by hand into eleven pages and drifted from
// the revenue offices (NSW First Home Buyer Choice "remains available", WA
// exempt to $450,000, Tasmania a $30,000 grant and a 50% concession, an NT
// "First Home Owner Discount", an ACT "income-tested" scheme, an SA $650,000
// cap). The figures now live in src/lib/data/first-home-grants.ts and the
// stamp duty engine. These tests render each page (or read its data) and fail
// on a first home grant or threshold that is not in those files, and on a
// closed scheme named as current.
import { describe, expect, it, vi } from "vitest";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("server-only", () => ({}));

import {
  FIRST_HOME_DUTY,
  FIRST_HOME_GRANTS,
  NOT_CURRENT_NAMES,
  allDutyThresholds,
  allGrantFigures,
  fmt,
  grantSentence,
} from "@/lib/data/first-home-grants";
import { AUSTRALIAN_STATES, calculateStampDuty, QLD_FIRST_HOME_DEDUCTION, STATE_DUTY_SCHEDULES, type AustralianState } from "@/lib/utils/stamp-duty";
import { FIRST_HOME_SUMMARY, STAMP_DUTY_GUIDES } from "@/lib/data/stamp-duty-state";
import { HG_NT_CAP_BEFORE_SPLIT, HG_PRICE_CAPS } from "@/lib/data/home-guarantee";
import { HTB_INCOME_LIMITS, HTB_INCOME_LIMITS_PREVIOUS, HTB_PRICE_CAPS } from "@/lib/data/help-to-buy";
import { FHSS_ANNUAL_LIMIT, FHSS_TOTAL_LIMIT, FHSS_TOTAL_LIMIT_BEFORE_2022 } from "@/lib/data/fhss";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";
import { blogPosts } from "@/lib/data/blogs";

// ─── The data file ──────────────────────────────────────────────────────────

describe("first-home-grants.ts", () => {
  it("has a grant row and a duty row for every state, each sourced to a government page and dated", () => {
    for (const s of AUSTRALIAN_STATES) {
      for (const row of [FIRST_HOME_GRANTS[s], FIRST_HOME_DUTY[s]]) {
        expect(row.state).toBe(s);
        expect(row.source.href, s).toMatch(/^https:\/\/([a-z.]+\.)?(gov\.au|nt\.gov\.au|qro\.qld\.gov\.au|sro\.vic\.gov\.au|revenuesa\.sa\.gov\.au|sro\.tas\.gov\.au)\//);
        expect(row.checkedOn, s).toMatch(/^2026-\d\d-\d\d$/);
        expect(row.checkedOn >= "2026-10-10", s).toBe(true);
      }
    }
  });

  it("holds the figures the revenue offices published on 10 and 11 October 2026", () => {
    const amounts = Object.fromEntries(AUSTRALIAN_STATES.map((s) => [s, FIRST_HOME_GRANTS[s].amount]));
    expect(amounts).toEqual({ NSW: 10_000, VIC: 10_000, QLD: 30_000, WA: 10_000, SA: 15_000, TAS: 20_000, ACT: null, NT: 50_000 });
    expect(FIRST_HOME_GRANTS.NSW.caps.map((c) => c.value)).toEqual([600_000, 750_000]);
    expect(FIRST_HOME_GRANTS.VIC.caps.map((c) => c.value)).toEqual([750_000]);
    expect(FIRST_HOME_GRANTS.QLD.caps).toEqual([expect.objectContaining({ value: 750_000, rule: "below" })]);
    expect(FIRST_HOME_GRANTS.WA.caps.map((c) => c.value)).toEqual([800_000, 1_000_000]);
    for (const s of ["SA", "TAS", "NT"] as const) expect(FIRST_HOME_GRANTS[s].caps, s).toEqual([]);
    expect(FIRST_HOME_GRANTS.TAS.endsOn).toBe("30 June 2027");
    expect(FIRST_HOME_GRANTS.NT.endsOn).toBe("30 September 2027");
  });

  it("takes every duty threshold from the stamp duty engine's schedules", () => {
    for (const s of AUSTRALIAN_STATES) {
      const sch = STATE_DUTY_SCHEDULES[s].firstHome;
      const d = FIRST_HOME_DUTY[s];
      if (d.covers === "any" && d.exemptTo !== Infinity) {
        expect(d.exemptTo, s).toBe(sch.exemptTo);
        expect(d.concessionTo, s).toBe(sch.concessionTo);
        expect(d.from, s).toBe(sch.from);
      }
    }
    expect(FIRST_HOME_DUTY.TAS.covers).toBe("none");
    expect(FIRST_HOME_DUTY.NT.covers).toBe("none");
    expect(FIRST_HOME_DUTY.SA.covers).toBe("newOnly");
    expect(FIRST_HOME_DUTY.ACT.exemptTo).toBe(Infinity);
  });

  it("agrees with the engine's own notes and the stamp duty guides' one-line summaries", () => {
    const note = (s: AustralianState) => calculateStampDuty(500_000, s, true, false, false).notes.join(" ");
    expect(note("TAS")).toContain(`${fmt(FIRST_HOME_GRANTS.TAS.amount!)} First Home Owner Grant`);
    expect(note("TAS")).toContain(FIRST_HOME_GRANTS.TAS.endsOn!);
    expect(note("NT")).toContain(`${fmt(FIRST_HOME_GRANTS.NT.amount!)} HomeGrown Territory grant`);
    expect(note("NT")).toContain(FIRST_HOME_GRANTS.NT.endsOn!);
    expect(FIRST_HOME_SUMMARY.NSW).toContain(fmt(FIRST_HOME_DUTY.NSW.exemptTo!));
    expect(FIRST_HOME_SUMMARY.VIC).toContain(fmt(FIRST_HOME_DUTY.VIC.exemptTo!));
    expect(FIRST_HOME_SUMMARY.QLD).toContain(fmt(FIRST_HOME_DUTY.QLD.exemptTo!));
    expect(FIRST_HOME_SUMMARY.WA).toContain(fmt(FIRST_HOME_DUTY.WA.exemptTo!));
    expect(FIRST_HOME_SUMMARY.NT).toContain(fmt(FIRST_HOME_GRANTS.NT.amount!));
  });

  it("writes one dated, sourced sentence per state", () => {
    for (const s of AUSTRALIAN_STATES) {
      const line = grantSentence(s);
      expect(line, s).toMatch(/read \d{1,2} October 2026\)\.$/);
      expect(line, s).not.toContain("\u2014");
    }
    expect(grantSentence("SA")).toContain("with no price cap");
    expect(grantSentence("QLD")).toContain("under $750,000");
  });
});

// ─── The scanner ────────────────────────────────────────────────────────────

const STATE_PATTERNS: Record<AustralianState, RegExp> = {
  NSW: /\bNSW\b|New South Wales|Sydney/,
  VIC: /\bVIC\b|Victoria|Melbourne/,
  QLD: /\bQLD\b|Queensland|Brisbane/,
  WA: /\bWA\b|Western Australia|Perth/,
  SA: /\bSA\b|South Australia|Adelaide/,
  TAS: /\bTAS\b|Tasmania|Hobart/,
  ACT: /\bACT\b|Canberra|Australian Capital Territory/,
  NT: /\bNT\b|Northern Territory|Darwin|\bTerritory\b/,
};

const FIRST_HOME_CONTEXT = /grant|FHOG|HomeGrown|first home|first-home|duty relief|exemption|exempt|concession|stamp duty|transfer duty|conveyance duty|land transfer duty/i;
/** A sentence that dates a figure to the past may quote a superseded one. */
const PAST = /\bbefore\b|\breplaced\b|\buntil\b|\bapplied\b|\bwas\b|\bwere\b|\bprevious|\bended\b|\bceased\b|\bclosed\b|\bcommenced\b|\bused to\b|\bup until\b|\bto \d{1,2} \w+ 20\d\d|between \d{1,2} \w+ 20\d\d and|last settlement date/i;

/** Text a reader (or a crawler reading the JSON-LD) sees, one segment per sentence, list item or table row. */
export function segments(html: string): string[] {
  const text = html
    .replace(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g, (_, json: string) => {
      const parts: string[] = [];
      JSON.stringify(JSON.parse(json), (k, v) => {
        if (typeof v === "string" && (k === "text" || k === "name" || k === "description" || k === "headline")) parts.push(v);
        return v;
      });
      return ` ${parts.join(" ¶ ")} ¶ `;
    })
    .replace(/<\/(td|th)>/g, " | ")
    .replace(/<\/(p|li|tr|h\d|caption|dd|dt)>|<br\s*\/?>/g, " ¶ ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;|&rsquo;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;|\s+/g, " ");
  return text
    .split(" ¶ ")
    .flatMap((s) => s.split(/(?<=[.!?])\s+(?=[A-Z])/))
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "$30,000", "$30K", "$1.5M", "$1m" to a number. */
function money(raw: string, suffix?: string): number {
  const n = Number(raw.replace(/,/g, ""));
  if (!suffix) return n;
  return /k/i.test(suffix) ? n * 1_000 : n * 1_000_000;
}

const AMOUNT = String.raw`\$(\d[\d,]*(?:\.\d+)?)\s?(k|K|m|M|million)?\b`;
/** Amounts written as a threshold or a cap. */
const THRESHOLD = new RegExp(String.raw`(?:up to|under|below|less than|capped at|caps? of|cap is|not exceed(?:ing)?|exceeds?|over|above|between|at or under|or less than)\s+` + AMOUNT, "g");
/** "$600,001 to $750,000", "between $700,000 and $800,000": both ends of a band. */
const RANGE = new RegExp(String.raw`(?:between\s+` + AMOUNT + String.raw`\s+and\s+` + AMOUNT + String.raw`)|(?:` + AMOUNT + String.raw`\s+to\s+` + AMOUNT + ")", "g");
const CAP_AFTER = new RegExp(AMOUNT + String.raw`\s+(?:price |property value |value )?cap`, "g");
/** Amounts written as a grant. */
const GRANT_AFTER = new RegExp(AMOUNT + String.raw`\s+(?:\w+\s+){0,2}(?:First Home Owner (?:\(New Homes\) )?Grant|first home owner grant|FHOG|grant|HomeGrown|cash grant)`, "g");
const GRANT_BEFORE = new RegExp(String.raw`(?:grant|FHOG)\s+(?:of|is|was|pays|worth|amount of)\s+(?:up to\s+)?` + AMOUNT, "g");

function claimedFigures(seg: string): number[] {
  const out: number[] = [];
  for (const re of [THRESHOLD, CAP_AFTER, GRANT_AFTER, GRANT_BEFORE]) {
    for (const m of seg.matchAll(re)) out.push(money(m[1], m[2]));
  }
  for (const m of seg.matchAll(RANGE)) {
    if (m[1] !== undefined) out.push(money(m[1], m[2]), money(m[3], m[4]));
    else out.push(money(m[5], m[6]), money(m[7], m[8]));
  }
  // "$600,001" is the first dollar of a band that starts at $600,000, and
  // "$709,999" the last dollar of one that ends at $710,000.
  return out.filter((n) => n >= 5_000).map((n) => (n % 100 === 1 ? n - 1 : n % 100 === 99 ? n + 1 : n));
}

function figuresIn(text: string): number[] {
  return [...text.matchAll(new RegExp(AMOUNT, "g"))].map((m) => money(m[1], m[2]));
}

/** Figures a segment about this state may print as current. */
function currentFor(state: AustralianState, seg: string): Set<number> {
  const g = FIRST_HOME_GRANTS[state];
  const d = FIRST_HOME_DUTY[state];
  const out = new Set<number>([FHSS_ANNUAL_LIMIT, FHSS_TOTAL_LIMIT, ...Object.values(HTB_INCOME_LIMITS)]);
  if (g.amount !== null) out.add(g.amount);
  for (const c of g.caps) out.add(c.value);
  if (d.exemptTo !== null && d.exemptTo !== Infinity) out.add(d.exemptTo);
  if (d.concessionTo !== null) out.add(d.concessionTo);
  if (d.land && /land/i.test(seg)) {
    out.add(d.land.exemptTo);
    if (d.land.concessionTo !== null) out.add(d.land.concessionTo);
  }
  // The engine's bracket edges and the owner-occupier rate's ceiling (Victoria's
  // $550,000 PPR rate) are duty thresholds too, and Queensland's first home
  // concession steps down at the engine's band edges.
  const sch = STATE_DUTY_SCHEDULES[state];
  for (const b of [...sch.standard.rows, ...(sch.ownerOccupier?.rows ?? [])]) {
    out.add(b.min);
    if (b.max !== Infinity) out.add(b.max);
  }
  if (sch.ownerOccupier?.upTo) out.add(sch.ownerOccupier.upTo);
  if (state === "QLD") for (const r of QLD_FIRST_HOME_DEDUCTION) out.add(r.below);
  const hg = HG_PRICE_CAPS[state];
  out.add(hg.capital);
  if (hg.rest !== null) out.add(hg.rest);
  const htb = HTB_PRICE_CAPS[state];
  out.add(htb.capital);
  if (htb.rest !== null) out.add(htb.rest);
  return out;
}

/** Superseded figures, allowed only in a sentence that dates them to the past. */
function previousFor(state: AustralianState): Set<number> {
  const g = FIRST_HOME_GRANTS[state];
  const d = FIRST_HOME_DUTY[state];
  return new Set<number>([
    ...figuresIn([g.previously ?? "", g.window, d.rule, d.note ?? ""].join(" ")),
    FHSS_TOTAL_LIMIT_BEFORE_2022,
    HTB_INCOME_LIMITS_PREVIOUS.single,
    HTB_INCOME_LIMITS_PREVIOUS.joint,
    ...(state === "NT" ? [HG_NT_CAP_BEFORE_SPLIT] : []),
  ]);
}

export interface Finding { segment: string; figure?: number; reason: string }

/**
 * Every first home figure on a page must be one the data files hold for the
 * state the sentence is about (the page's own state where it names none, every
 * state on a national page). Closed schemes may be named only as closed.
 */
export function scan(html: string, pageState: AustralianState | null): Finding[] {
  const findings: Finding[] = [];
  for (const seg of segments(html)) {
    for (const name of NOT_CURRENT_NAMES) {
      if (seg.includes(name) && !/closed|ended|ceased|previous|not a |no longer|is not|isn.t|wasn.t|replaced/i.test(seg)) {
        findings.push({ segment: seg, reason: `names ${name} as current` });
      }
    }
    if (/income[- ]tested/i.test(seg) && STATE_PATTERNS.ACT.test(seg) && !PAST.test(seg)) {
      findings.push({ segment: seg, reason: "calls the ACT scheme income-tested" });
    }
    if (/50% (stamp )?duty concession|50 per cent/i.test(seg) && !PAST.test(seg)) {
      findings.push({ segment: seg, reason: "a 50% duty concession as current" });
    }
    if (!FIRST_HOME_CONTEXT.test(seg)) continue;
    const named = AUSTRALIAN_STATES.filter((s) => STATE_PATTERNS[s].test(seg));
    const states = named.length > 0 ? named : pageState ? [pageState] : [...AUSTRALIAN_STATES];
    const current = new Set<number>(states.flatMap((s) => [...currentFor(s, seg)]));
    const previous = new Set<number>(states.flatMap((s) => [...previousFor(s)]));
    for (const n of claimedFigures(seg)) {
      if (current.has(n)) continue;
      if (previous.has(n) && PAST.test(seg)) continue;
      findings.push({ segment: seg, figure: n, reason: `${fmt(n)} is not a ${states.join("/")} first home figure in the data files` });
    }
  }
  return findings;
}

describe("the scanner", () => {
  it("catches the errors the review found", () => {
    const bad = [
      ["<p>First Home Buyer Choice remains available for properties up to $1.5M.</p>", "NSW"],
      ["<li>Full stamp duty exemption applies up to $450,000 with a scaled concession to $600,000.</li>", "WA"],
      ["<p>Tasmania's $30,000 FHOG is one of the most generous in Australia.</p>", "TAS"],
      ["<p>Established homes get a 50% stamp duty concession up to $600,000.</p>", "TAS"],
      ["<p>SA's FHOG is $15,000 on new homes only, capped at $650,000 contract price.</p>", "SA"],
      ["<p>The First Home Owner Discount delivers stamp duty relief.</p>", "NT"],
      ["<p>HomeSeeker SA is a state shared-equity scheme.</p>", "SA"],
      ["<p>Full exemption (income-tested) in the ACT.</p>", null],
      ["<p>WA exempts up to $450,000.</p>", null],
    ] as const;
    for (const [html, st] of bad) expect(scan(html, st), html).not.toEqual([]);
  });

  it("passes the revenue offices' figures and dated history", () => {
    const good = [
      ["<p>No transfer duty on a home up to $600,000, then a concession to $800,000.</p>", "WA"],
      ["<p>Vacant land: no duty up to $450,000.</p>", "WA"],
      ["<p>Tasmania pays $20,000 under its First Home Owner Grant. It was $30,000 for transactions that commenced between 1 July 2025 and 30 June 2026.</p>", "TAS"],
      ["<p>First Home Buyer Choice closed to new applications on 1 July 2023.</p>", "NSW"],
      ["<p>SA's $15,000 grant has no cap; a $650,000 cap applied before 6 June 2024.</p>", "SA"],
    ] as const;
    for (const [html, st] of good) expect(scan(html, st), html).toEqual([]);
  });
});

// ─── The pages ──────────────────────────────────────────────────────────────

type PageModule = { default: ComponentType; metadata?: { title?: unknown; description?: unknown } };
/** The page body, plus its <title> and meta description, which a search result shows. */
const render = async (load: () => Promise<PageModule>) => {
  const mod = await load();
  const meta = [mod.metadata?.title, mod.metadata?.description].filter((x) => typeof x === "string");
  return `${meta.map((m) => `<p>${m}</p>`).join("")}${renderToStaticMarkup(createElement(mod.default))}`;
};

/** The pages that render the data file, with the state they are about (null for national pages). */
const PAGES: Array<{ path: string; state: AustralianState | null; load: () => Promise<PageModule> }> = [
  { path: "/guides/first-home-buyer-nsw", state: "NSW", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-nsw/page") },
  { path: "/guides/first-home-buyer-wa", state: "WA", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-wa/page") },
  { path: "/guides/first-home-buyer-tas", state: "TAS", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-tas/page") },
  { path: "/guides/first-home-buyer-nt", state: "NT", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-nt/page") },
  { path: "/guides/first-home-buyer-sa", state: "SA", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-sa/page") },
  { path: "/guides/first-home-buyer-act", state: "ACT", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-act/page") },
  { path: "/guides/first-home-buyer-qld", state: "QLD", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-qld/page") },
  { path: "/guides/first-home-buyer-vic", state: "VIC", load: () => import("../../src/app/(marketing)/guides/first-home-buyer-vic/page") },
  { path: "/guides/first-home-buyer-guide", state: null, load: () => import("../../src/app/(marketing)/guides/first-home-buyer-guide/page") },
  { path: "/stamp-duty-calculator", state: null, load: () => import("../../src/app/(marketing)/stamp-duty-calculator/page") },
  { path: "/guides/first-home-owner-grant-australia", state: null, load: () => import("../../src/app/(marketing)/guides/first-home-owner-grant-australia/page") },
];

describe("pages rendered from the data file", () => {
  it("covers at least one page", () => {
    expect(allGrantFigures().length).toBeGreaterThan(0);
    expect(allDutyThresholds().length).toBeGreaterThan(0);
  });
  for (const page of PAGES) {
    it(`${page.path}: every first home figure is in the data files, and no closed scheme is current`, async () => {
      const html = await render(page.load);
      expect(scan(html, page.state)).toEqual([]);
      if (page.state) {
        const g = FIRST_HOME_GRANTS[page.state];
        if (g.amount !== null) expect(html).toContain(fmt(g.amount));
        expect(html).toContain(g.source.href);
        expect(html).toContain(FIRST_HOME_DUTY[page.state].source.href);
      }
    }, 30_000);
  }
});

describe("/first-home-buyers hub copy (its FAQ answers render as FAQPage JSON-LD)", () => {
  const hub = PERSONA_HUB_CONTENT["first-home"];
  const html = [hub.metaTitle, hub.metaDescription, ...hub.deepDive.paragraphs, ...hub.faqs.flatMap((f) => [f.question, f.answer])]
    .map((t) => `<p>${t}</p>`)
    .join("");

  it("prints only first home figures in the data files, and no closed scheme as current", () => {
    expect(scan(html, null)).toEqual([]);
  });

  it("names every state's grant from the data file", () => {
    const answer = hub.faqs.find((f) => f.question === "What is the First Home Owner Grant in 2026?")!.answer;
    for (const s of AUSTRALIAN_STATES) {
      const g = FIRST_HOME_GRANTS[s];
      if (g.amount !== null) expect(answer, s).toContain(fmt(g.amount));
    }
    expect(answer).toContain("ACT: none");
  });

  it("keeps the title within 60 characters and the description within 160", () => {
    expect(hub.metaTitle.length).toBeLessThanOrEqual(60);
    expect(hub.metaDescription.length).toBeLessThanOrEqual(160);
  });
});

describe("blog posts that quote first home grants or duty relief (they need npm run publish:blogs)", () => {
  const POSTS: Array<[string, AustralianState | null]> = [
    ["first-home-buyer-schemes-by-state-australia-2026", null],
    ["how-to-buy-property-interstate-australia-2026", null],
    ["darwin-nt-property-market-2026", "NT"],
    ["hobart-tasmania-property-market-2026", "TAS"],
    ["adelaide-property-market-2026", "SA"],
  ];
  for (const [slug, st] of POSTS) {
    it(`${slug}: every first home figure is in the data files, and no closed scheme is current`, () => {
      const p = blogPosts.find((b) => b.slug === slug)!;
      expect(p, slug).toBeDefined();
      expect(scan(`<p>${p.title}</p><p>${p.excerpt}</p>${p.content}`, st)).toEqual([]);
      expect(p.updatedAt).toBe("2026-10-11");
    });
  }

  it("the schemes post dates its correction and prints every state's grant and duty source", () => {
    const p = blogPosts.find((b) => b.slug === "first-home-buyer-schemes-by-state-australia-2026")!;
    expect(p.content.indexOf("Correction, 11 October 2026")).toBeGreaterThanOrEqual(0);
    expect(p.content.indexOf("Correction, 11 October 2026")).toBeLessThan(40);
    for (const s of AUSTRALIAN_STATES) {
      expect(p.content, s).toContain(FIRST_HOME_GRANTS[s].source.href);
      expect(p.content, s).toContain(FIRST_HOME_DUTY[s].source.href);
    }
    expect(p.content).not.toContain("\u2014");
  });
});

describe("the eight stamp duty state guides' grant and first home lines", () => {
  for (const st of AUSTRALIAN_STATES) {
    it(`${st}: every first home figure is in the data files`, () => {
      const strings: string[] = [];
      JSON.stringify(STAMP_DUTY_GUIDES[st], (_k, v) => {
        if (typeof v === "string") strings.push(v);
        return v;
      });
      const html = strings.map((t) => `<p>${t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}</p>`).join("");
      expect(scan(html, st)).toEqual([]);
    });
  }
});
