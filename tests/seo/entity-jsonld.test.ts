// Weekly crawl 5 Nov 2026: the Organization node had no telephone, and the
// guide Article.author repeated the whole Organization. Every @id reference on
// a guide page must resolve to a node on that page, with one Organization.
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("server-only", () => ({}));

import { GuideArticleJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";

const SITE = "https://www.yourpropertyguide.com.au";

function nodes(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap((m) => {
    const d = JSON.parse(m[1]);
    return Array.isArray(d["@graph"]) ? d["@graph"] : [d];
  });
}

function ids(v: unknown, refs: string[] = [], defs: string[] = []) {
  if (Array.isArray(v)) v.forEach((x) => ids(x, refs, defs));
  else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o["@id"] === "string") (Object.keys(o).length === 1 ? refs : defs).push(o["@id"]);
    Object.values(o).forEach((x) => ids(x, refs, defs));
  }
  return { refs, defs };
}

const html =
  renderToStaticMarkup(createElement(OrganizationJsonLd)) +
  renderToStaticMarkup(
    createElement(GuideArticleJsonLd, {
      title: "T",
      description: "D",
      url: "/guides/real-estate-agent-fees-australia",
      datePublished: "2026-01-01",
      author: { name: "Your Property Guide editorial" },
    }),
  );
const all = nodes(html);
const org = all.find((n) => n["@id"] === `${SITE}/#organization`)!;
const article = all.find((n) => n["@type"] === "Article")!;

describe("site entity JSON-LD", () => {
  it("gives the Organization the footer telephone", () => {
    expect(org.telephone).toBe("+61455221921");
  });

  it("makes a non-person guide author a bare Organization reference", () => {
    expect(article.author).toEqual({ "@id": `${SITE}/#organization` });
  });

  it("leaves no dangling @id and holds one Organization node", () => {
    const { refs, defs } = ids(all);
    const pageUrl = `${SITE}/guides/real-estate-agent-fees-australia`;
    expect(refs.filter((r) => !defs.includes(r) && r !== pageUrl)).toEqual([]);
    expect(defs.filter((d) => d === `${SITE}/#organization`)).toHaveLength(1);
  });

  it("gives the founder his own non-empty sameAs and no third-party lead sites", () => {
    const founder = org.founder as { sameAs: string[] };
    expect(founder.sameAs).toEqual([
      "https://www.linkedin.com/in/theandymcmaster",
      "https://www.facebook.com/theandymcm",
    ]);
    expect(html).not.toMatch(/localagentfinder|whichrealestateagent/i);
  });
});
