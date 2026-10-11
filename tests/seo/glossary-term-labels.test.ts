// Commercial intent review, 10 Oct 2026 (finance-tax F12): the glossary term
// pages printed "Buyer&apos;s Agent" raw under Nearby terms (and in that
// term's own H1, breadcrumb, title and schema), because two stored term
// names carry an HTML entity and React escapes text. The glossary routes now
// render every term name through termLabel.
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import GlossaryTermPage, { generateMetadata } from "@/app/(marketing)/glossary/[term]/page";
import { decodeEntities, termLabel } from "@/app/(marketing)/glossary/term-label";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";

const render = async (term: string) =>
  renderToStaticMarkup(await GlossaryTermPage({ params: Promise.resolve({ term }) }));

// An entity escaped a second time: what a reader sees as "&apos;".
const RAW_ENTITY = /&amp;(?:[a-z]+|#[0-9]+|#x[0-9a-f]+);/i;
const jsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");

describe("termLabel", () => {
  it("decodes entities once and leaves plain names alone", () => {
    expect(decodeEntities("Buyer&apos;s Agent")).toBe("Buyer's Agent");
    expect(decodeEntities("&quot;exit fee&quot; &amp; more")).toBe('"exit fee" & more');
    expect(decodeEntities("&amp;apos;")).toBe("&apos;");
    expect(decodeEntities("it&#39;s &#x2019;")).toBe("it's ’");
    expect(decodeEntities("&unknown; stays")).toBe("&unknown; stays");
    expect(termLabel({ term: "Capital Gains Tax (CGT)" })).toBe("Capital Gains Tax (CGT)");
  });
  it("every stored name decodes to plain text", () => {
    for (const t of GLOSSARY_TERMS) expect(termLabel(t)).not.toMatch(/&[#a-z0-9]+;/i);
  });
});

describe("/glossary/[term]", () => {
  it("lists Buyer's Agent under Nearby terms on the CGT page, not the raw entity", async () => {
    const html = await render("capital-gains-tax-cgt");
    expect(html).toContain("Nearby terms");
    expect(html).toMatch(/href="\/glossary\/buyer-apos-s-agent"[^>]*>Buyer&#x27;s Agent<\/a>/);
    expect(html).not.toMatch(RAW_ENTITY);
  });

  for (const slug of ["buyer-apos-s-agent", "vendor-apos-s-statement"]) {
    it(`${slug}: H1, breadcrumb, title and schema read the plain name`, async () => {
      const entry = GLOSSARY_TERMS.find((t) => t.slug === slug)!;
      const name = termLabel(entry);
      expect(name).toMatch(/'s /);
      const html = await render(slug);
      expect(html).not.toMatch(RAW_ENTITY);
      expect(html).toContain(`>${name.replace("'", "&#x27;")}</span>?`);
      const ld = jsonLd(html);
      expect(ld).toContain(JSON.stringify(name));
      expect(ld).not.toMatch(/&apos;|&quot;/);
      const meta = await generateMetadata({ params: Promise.resolve({ term: slug }) });
      expect(meta.title).toBe(`${name}, Australian Property Glossary`);
      expect(meta.openGraph?.title).toBe(`${name}, Australian property definition`);
      expect(String(meta.description)).not.toMatch(/&[a-z]+;/);
    });
  }

  it("no term page prints a raw entity", async () => {
    for (const t of GLOSSARY_TERMS) {
      const html = await render(t.slug);
      expect(html, t.slug).not.toMatch(RAW_ENTITY);
    }
  });
});
