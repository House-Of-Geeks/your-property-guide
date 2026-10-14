// First home buyer accuracy (14 October 2026). The first home guides, the
// persona hub, the state commentary, the blog posts and the buying guide PDF
// quoted grants and duty rules that had changed: WA's $450,000 exemption,
// Tasmania's $30,000 grant and 50% concession, the NT's First Home Owner
// Discount, the ACT's income test, SA's $650,000 grant cap, Queensland's
// $550,000 threshold, NSW's First Home Buyer Choice. The figures now come from
// src/lib/policy/first-home.ts. These tests render the pages, keep the stale
// phrases out, and pin each page's key figures to the shared data.
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { blogPosts } from "@/lib/data/blogs";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";
import { STATE_COMMENTARY } from "@/lib/data/state-commentary";
import { HG_PRICE_CAPS } from "@/lib/data/home-guarantee";
import { SHARED_EQUITY_SCHEMES } from "@/lib/data/help-to-buy";
import { STATE_DUTY_SCHEDULES, calculateStampDuty, type AustralianState } from "@/lib/utils/stamp-duty";
import {
  FIRST_HOME_REVIEWED_ON,
  currentConcessionTo,
  currentDutyRelief,
  currentExemptTo,
  currentGrant,
  formatPolicyDate,
  money,
} from "@/lib/policy/first-home";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push() {}, replace() {}, prefetch() {}, back() {}, refresh() {} }),
  usePathname: () => "/guides",
  useSearchParams: () => new URLSearchParams(),
}));

const ROOT = path.resolve(__dirname, "../..");
const GUIDES = path.join(ROOT, "src/app/(marketing)/guides");

const STATE_GUIDE: Record<AustralianState, string> = {
  NSW: "first-home-buyer-nsw", VIC: "first-home-buyer-vic", QLD: "first-home-buyer-qld", WA: "first-home-buyer-wa",
  SA: "first-home-buyer-sa", TAS: "first-home-buyer-tas", ACT: "first-home-buyer-act", NT: "first-home-buyer-nt",
};
const NATIONAL = ["first-home-buyer-guide", "first-home-owner-grant-australia", "foreign-buyer-firb-guide"];
const PAGES = [...Object.values(STATE_GUIDE), ...NATIONAL];

const decode = (s: string) =>
  s
    .replace(/&#x27;|&#39;|&rsquo;|&lsquo;|’|‘/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;|“|”/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;|&#160;/g, " ");
/** Visible text, without the JSON-LD. */
const visible = (html: string) =>
  decode(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");

async function renderGuide(slug: string): Promise<{ html: string; text: string; description: string }> {
  const mod = await import(`../../src/app/(marketing)/guides/${slug}/page.tsx`);
  const html = renderToStaticMarkup(mod.default());
  return { html, text: visible(html), description: decode(String(mod.metadata?.description ?? "")) };
}

const rendered = new Map<string, Awaited<ReturnType<typeof renderGuide>>>();
const page = async (slug: string) => {
  if (!rendered.has(slug)) rendered.set(slug, await renderGuide(slug));
  return rendered.get(slug)!;
};

// Each pattern is wrong today wherever it appears in a current-tense claim.
// Historical mentions are worded so they don't match (e.g. "had a $650,000
// cap", "no longer applies").
const STALE: RegExp[] = [
  // NT: the First Home Owner Discount is gone; the $10,000 FHOG isn't the current grant.
  /\$23,928|\$18,601|\$33,928/,
  /First Home Owner Discount(?![^.]{0,40}(no longer|gone|ended|closed))/,
  /NT'?s FHOG is \$10,000|\$10,000 NT FHOG|NT: \$10,000/,
  // WA: the $450,000 home exemption and $600,000 concession cap ended on 7 May 2026; Perth's 5% cap is $850,000.
  /(?<!land )exempt(ion|s)?( applies)? (up to|under|to) \$450(,000|K|k)/i,
  /(generous|exemption) under \$450(,000|K|k)/i,
  /\$450,00[01] to \$600,000/,
  /\$600,000 Perth cap/,
  /WA[^.]{0,40}\$750,000 (contract|cap)|WA'?s FHOG is \$10,000 on new homes only, capped at \$750,000/,
  // Tasmania: $20,000 grant in 2026-27; the 50% concession ended in 2024 and the exemption on 30 June 2026.
  /(Tasmania|TAS|Hobart)('s)?:? \$30(,000|K|k) (FHOG|First Home Owner Grant|grant|for new homes)/,
  /50% (stamp duty )?concession (on|for) established/i,
  /\$30,000 FHOG is one of the most generous/,
  // ACT: no income test or value limit from 1 July 2026.
  /(HBCS|Home Buyer Concession Scheme)[^.]{0,80}income (and property value )?thresholds? (apply|are met)/i,
  /Full exemption \(income-tested\)|income-tested Home Buyer Concession/i,
  // SA: no grant cap since 6 June 2024; HomeSeeker SA isn't a shared equity scheme.
  /(FHOG|grant)[^.]{0,40}(capped at|up to|under|not exceeding) \$650(,000|K|k)/i,
  /\$650K FHOG cap|\$650,000 contract price/,
  /HomeSeeker SA[^.]{0,40}shared[- ]equity|shared[- ]equity scheme[^.]{0,20}HomeSeeker/i,
  /SA has no first home buyer concession/,
  // Queensland: $700,000 and $800,000 since 9 June 2024.
  /(First Home Concession|first home concession)[^.]{0,60}\$550(,000|K|k)/,
  /full exemption typically under \$550/i,
  /QLD and WA offer concessions but no full exemptions/,
  // NSW: First Home Buyer Choice and the Shared Equity Home Buyer Helper have closed.
  /First Home Buyer Choice(?![^.]{0,60}closed)[^.]{0,60}(remains available|lets eligible buyers|Optional annual property tax)/,
  /Shared Equity Home Buyer Helper[^.]{0,20}(:|,)? (Up to 40%|The NSW Government's own)/,
  /Since September 2023/,
  // Victoria: the $20,000 regional grant ended on 30 June 2021.
  /\$10,000 metro Melbourne|VIC metro/,
  // Surcharges and withholding.
  /NSW:? 8%|QLD:? 7%|7-8%|7% to 8%/,
  /(withholding|FRCGW)[^.]{0,80}(above|over) \$750,000|property sold above \$750,000/i,
];

const hits = (label: string, text: string) => STALE.filter((re) => re.test(text)).map((re) => `${label}: ${re}`);

describe("no stale first home figures", () => {
  it("in the first home guides, the FHOG guide and the FIRB guide (rendered)", async () => {
    const found: string[] = [];
    for (const slug of PAGES) {
      const p = await page(slug);
      found.push(...hits(slug, p.text), ...hits(`${slug} (description)`, p.description));
    }
    expect(found).toEqual([]);
  }, 60_000);

  it("in every guide page's source", () => {
    const found = fs
      .readdirSync(GUIDES, { withFileTypes: true })
      .filter((d) => d.isDirectory() && fs.existsSync(path.join(GUIDES, d.name, "page.tsx")))
      .flatMap((d) => hits(d.name, decode(fs.readFileSync(path.join(GUIDES, d.name, "page.tsx"), "utf8"))));
    expect(found).toEqual([]);
  });

  it("in the persona hubs and the state commentary", () => {
    const found = [
      ...Object.entries(PERSONA_HUB_CONTENT).flatMap(([id, c]) => hits(`hub ${id}`, JSON.stringify(c))),
      ...Object.entries(STATE_COMMENTARY).flatMap(([s, c]) => hits(`commentary ${s}`, JSON.stringify(c))),
    ];
    expect(found).toEqual([]);
  });

  it("in the blog posts", () => {
    // The June news item about Queensland's grant keeps its original text under an update note.
    const found = blogPosts
      .filter((p) => p.slug !== "queensland-30000-first-home-grant-closing-june-2026")
      .flatMap((p) => hits(p.slug, decode(`${p.title} ${p.excerpt} ${p.content}`)));
    expect(found).toEqual([]);
  });

  it("in the buying guide PDF source", () => {
    const html = decode(fs.readFileSync(path.join(ROOT, "scripts/guide-pdf/buying-guide.html"), "utf8"));
    expect(hits("buying-guide.html", html)).toEqual([]);
    expect(html).toContain("$103,000 for singles, $165,000 for couples");
    expect(html).toContain(`$${calculateStampDuty(750_000, "NSW", false, false, false).total.toLocaleString("en-AU")}`);
    expect(html).toContain("contracts to 30 September 2027");
  });
});

describe("each state guide quotes the shared data", () => {
  const grantLabel = (s: AustralianState) => money(currentGrant(s).amount);

  it("names the current grant", async () => {
    for (const s of ["NSW", "VIC", "QLD", "WA", "TAS", "NT"] as const) {
      expect((await page(STATE_GUIDE[s])).text, s).toContain(grantLabel(s));
    }
    expect((await page(STATE_GUIDE.SA)).text).toContain(`up to ${grantLabel("SA")}`);
    expect((await page(STATE_GUIDE.ACT)).text).toMatch(/no first home owner grant/i);
  }, 60_000);

  it("prints the duty thresholds in force today", async () => {
    for (const s of ["NSW", "VIC", "QLD", "WA"] as const) {
      const { text } = await page(STATE_GUIDE[s]);
      expect(text, s).toContain(money(currentExemptTo(s) ?? 0));
      expect(text, s).toContain(money(currentConcessionTo(s) ?? 0));
    }
    expect((await page(STATE_GUIDE.NSW)).text).toContain(money(currentExemptTo("NSW", "vacant-land") ?? 0));
    expect((await page(STATE_GUIDE.WA)).text).toContain(money(currentExemptTo("WA", "vacant-land") ?? 0));
    expect(currentDutyRelief("SA", "new").method.type).toBe("full");
    expect((await page(STATE_GUIDE.SA)).text).toMatch(/no stamp duty on a new home, an off-the-plan apartment or vacant land to build/i);
    expect(currentDutyRelief("TAS").method.type).toBe("none");
    expect((await page(STATE_GUIDE.TAS)).text).toContain("isn't available for transfers settling after 30 June 2026");
    expect(currentDutyRelief("ACT").method.type).toBe("full");
    expect((await page(STATE_GUIDE.ACT)).text).toContain("no duty at any price, with no income test");
    expect((await page(STATE_GUIDE.NT)).text).toContain("no first home stamp duty concession");
  }, 60_000);

  it("prints worked duty figures the engine agrees with", async () => {
    const owner = (s: AustralianState, p: number) => money(calculateStampDuty(p, s, false, false, false).total);
    expect((await page(STATE_GUIDE.WA)).text).toContain(`saving ${owner("WA", 550_000)}`);
    expect((await page(STATE_GUIDE.NSW)).text).toContain(`saving ${owner("NSW", 750_000)}`);
    expect((await page(STATE_GUIDE.VIC)).text).toContain(owner("VIC", 550_000));
    expect((await page(STATE_GUIDE.QLD)).text).toContain(`${owner("QLD", 800_000)} at $800,000`);
    expect((await page(STATE_GUIDE.ACT)).text).toContain(owner("ACT", 700_000));
    expect((await page(STATE_GUIDE.TAS)).text).toContain(`${owner("TAS", 500_000)} on a $500,000 home`);
    expect((await page(STATE_GUIDE.SA)).text).toContain(`${owner("SA", 600_000)} in stamp duty`);
  }, 60_000);

  it("gets the federal and state scheme figures right", async () => {
    expect((await page(STATE_GUIDE.WA)).text).toContain(`${money(HG_PRICE_CAPS.WA.capital)} in Greater Perth`);
    const homestart = SHARED_EQUITY_SCHEMES.find((x) => x.state === "SA")!;
    expect(homestart.terms).toBe("A 5% to 25% share; net household income up to $120,000; $750,000 price cap");
    const sa = (await page(STATE_GUIDE.SA)).text;
    for (const f of ["5% to 25%", "$120,000", "$750,000"]) expect(sa).toContain(f);
  }, 60_000);

  it("keeps the literal descriptions in step with the data", async () => {
    const k = (n: number) => `$${n / 1000}K`;
    expect((await page(STATE_GUIDE.WA)).description).toContain(`${grantLabel("WA")} FHOG`);
    expect((await page(STATE_GUIDE.WA)).description).toContain(`cap ${k(currentGrant("WA").caps[0].cap!)} in Perth`);
    expect((await page(STATE_GUIDE.WA)).description).toContain(`no stamp duty to ${k(currentExemptTo("WA")!)}`);
    expect((await page(STATE_GUIDE.WA)).description).toContain(`rate to ${k(currentConcessionTo("WA")!)}`);
    expect((await page(STATE_GUIDE.SA)).description).toContain(`up to ${grantLabel("SA")}`);
    expect((await page(STATE_GUIDE.TAS)).description).toContain(`${grantLabel("TAS")} First Home Owner Grant`);
    expect((await page(STATE_GUIDE.NT)).description).toContain(`${grantLabel("NT")} HomeGrown Territory Grant`);
    expect((await page(STATE_GUIDE.NSW)).description).toContain(`${grantLabel("NSW")} FHOG`);
    expect((await page(STATE_GUIDE.NSW)).description).toContain(`up to ${k(currentExemptTo("NSW")!)}`);
    expect((await page(STATE_GUIDE.VIC)).description).toContain(`up to ${k(currentExemptTo("VIC")!)}`);
    expect((await page(STATE_GUIDE.QLD)).description).toContain(`${grantLabel("QLD")} FHOG`);
  }, 60_000);

  it("the FIRB guide prints every state's surcharge from the engine", async () => {
    const { text } = await page("foreign-buyer-firb-guide");
    for (const s of Object.keys(STATE_DUTY_SCHEDULES) as AustralianState[]) {
      const f = STATE_DUTY_SCHEDULES[s].foreign;
      if (f) expect(text, s).toContain(`${s} ${Math.round(f.rate * 100)}%`);
    }
    expect(text).toContain("For contracts signed from 1 January 2025, the buyer must withhold 15%");
  }, 60_000);

  it("pages show when the rules were checked", async () => {
    const date = formatPolicyDate(FIRST_HOME_REVIEWED_ON);
    for (const slug of [STATE_GUIDE.WA, STATE_GUIDE.SA, STATE_GUIDE.TAS, STATE_GUIDE.NT, STATE_GUIDE.ACT, STATE_GUIDE.QLD, STATE_GUIDE.NSW, STATE_GUIDE.VIC]) {
      expect((await page(slug)).text, slug).toContain(date);
    }
  }, 60_000);
});

describe("FAQ structured data matches the visible text", () => {
  it("every FAQPage answer is printed on the page", async () => {
    for (const slug of PAGES) {
      const { html, text } = await page(slug);
      const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
      const faq = blocks.flatMap((b) => (Array.isArray(b) ? b : [b])).find((b) => b["@type"] === "FAQPage");
      expect(faq, slug).toBeTruthy();
      for (const q of faq.mainEntity) {
        expect(text, `${slug}: ${q.name}`).toContain(decode(q.name));
        expect(text, `${slug}: ${q.name}`).toContain(decode(q.acceptedAnswer.text).replace(/\s+/g, " "));
      }
    }
  }, 60_000);
});
