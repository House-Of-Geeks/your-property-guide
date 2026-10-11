// Section 3.2 of the 10 Oct 2026 review: /find-an-expert answers "find a
// real estate agent" in its title and H1, carries Service and FAQPage
// schema, prints the state fee table from STATE_RATES, and every FAQ
// figure has a dated source.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { STATE_RATES } from "@/lib/data/commission-rates";

const src = fs.readFileSync("src/app/(marketing)/find-an-expert/page.tsx", "utf8");
const constant = (name: string) => src.match(new RegExp(`const ${name} =\\s*"([^"]+)"`))?.[1] ?? "";

describe("/find-an-expert", () => {
  it("titles for 'find a real estate agent' inside the budgets", () => {
    const title = constant("TITLE");
    const description = constant("DESCRIPTION");
    expect(title).toMatch(/^Find a Real Estate Agent/);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(src).toMatch(/title: TITLE,/);
  });
  it("has the phrase in the H1 and no 'right person' promise", () => {
    const h1 = (src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(/<[^>]+>|\{" "\}/g, " ").replace(/\s+/g, " ");
    expect(h1).toMatch(/Find a real estate agent/);
    expect(h1).not.toMatch(/right person/);
  });
  it("carries Service and FAQPage schema", () => {
    expect(src).toMatch(/"@type": "Service"/);
    expect(src).toMatch(/serviceType: "Real estate agent introduction"/);
    expect(src).toContain("<FAQPageJsonLd faqs={FIND_AGENT_FAQS} />");
  });
  it("prints the fee table from STATE_RATES, not typed figures", () => {
    expect(src).toMatch(/STATE_RATES\[st\]\.low/);
    for (const r of Object.values(STATE_RATES)) expect(src).not.toContain(`${r.low}% to ${r.high}%`);
  });
  it("dates the REB ranking and names no 'best' agent of its own", () => {
    expect(src).toContain("12,154 properties worth $28.4 billion in 2025");
    expect(src).toContain('published: "5 June 2026"');
    expect(src).not.toMatch(/\bbest agents?\b|top-rated/i);
  });
});
