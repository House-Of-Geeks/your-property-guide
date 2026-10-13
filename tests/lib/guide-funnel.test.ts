import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { guideAudienceForBlogCategory, guideAudienceForPersona, guideFunnelHref } from "@/lib/guide-funnel";
import { splitHtmlAfterFirstSection } from "@/lib/utils/blog-toc";
import { splitAfterFirstSection } from "@/components/guide/split-first-section";
import { STAMP_DUTY_GUIDES } from "@/lib/data/stamp-duty-state";
import { stampDutyFrontmatter } from "@/lib/guides/stamp-duty-frontmatter";
import { costOfSellingFrontmatter } from "@/lib/guides/cost-of-selling-frontmatter";
import manifest from "@/lib/data/static-guides.json";
import fs from "node:fs";

describe("guideAudienceForPersona", () => {
  it("sends buyer personas to the buying guide, sellers to the selling guide, and leaves the rest on the default", () => {
    expect(guideAudienceForPersona("first-home")).toBe("buying");
    expect(guideAudienceForPersona("upgrading")).toBe("buying");
    expect(guideAudienceForPersona("selling")).toBe("selling");
    expect(guideAudienceForPersona("investing")).toBeUndefined();
    expect(guideAudienceForPersona("renovating")).toBeUndefined();
    expect(guideAudienceForPersona(undefined)).toBeUndefined();
  });

  it("routes blog posts by category", () => {
    expect(guideAudienceForBlogCategory("Selling")).toBe("selling");
    expect(guideAudienceForBlogCategory("Buying Guide")).toBe("buying");
    expect(guideAudienceForBlogCategory("News")).toBeUndefined();
  });
});

describe("guideFunnelHref", () => {
  it("pre-answers the suburb the way the funnel reads it (?suburb=) and adds the sending page", () => {
    expect(guideFunnelHref("selling")).toBe("/selling-guide");
    expect(guideFunnelHref("selling", { suburb: "paddington-qld-4064", from: "real-estate-commission-qld", toForm: true })).toBe(
      "/selling-guide?suburb=paddington-qld-4064&from=real-estate-commission-qld#guide-funnel",
    );
    expect(guideFunnelHref("buying", { from: "lenders-mortgage-insurance-guide" })).toBe("/buying-guide?from=lenders-mortgage-insurance-guide");
  });

  it("lands on an anchor both funnel pages carry", () => {
    for (const page of ["selling-guide", "buying-guide"]) {
      expect(fs.readFileSync(`src/app/(marketing)/${page}/page.tsx`, "utf8")).toContain('id="guide-funnel"');
    }
  });
});

describe("seller-topic guides start the selling guide in place", () => {
  const persona = (slug: string) => {
    const src = fs.readFileSync(`src/app/(marketing)/guides/${slug}/page.tsx`, "utf8");
    return /persona:\s*"([a-z-]+)"/.exec(src)?.[1];
  };

  it("includes the commission, fees and cost-of-selling guides every traceable seller lead came through", () => {
    for (const slug of [
      ...["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"].map((s) => `real-estate-commission-${s}`),
      "real-estate-agent-fees-australia",
      "cost-of-selling-a-house-australia",
      "questions-to-ask-a-real-estate-agent",
    ]) {
      expect(guideAudienceForPersona(persona(slug) as never), slug).toBe("selling");
    }
    expect(guideAudienceForPersona(costOfSellingFrontmatter("QLD").persona)).toBe("selling");
  });

  it("no seller guide body still carries an outline selling-guide MatchCTA", () => {
    for (const { slug } of manifest.guides as { slug: string }[]) {
      const file = `src/app/(marketing)/guides/${slug}/page.tsx`;
      if (!fs.existsSync(file) || persona(slug) !== "selling") continue;
      const src = fs.readFileSync(file, "utf8");
      for (const m of src.matchAll(/<MatchCTA\b[\s\S]*?\/>/g)) expect(m[0], slug).toContain("href=");
    }
  });

  it("stamp duty guides are buyer pages, and none of their CTAs forces the selling guide", () => {
    expect(guideAudienceForPersona(stampDutyFrontmatter("NSW").persona)).toBe("buying");
    for (const g of Object.values(STAMP_DUTY_GUIDES)) expect(g.cta.href ?? "").not.toContain("selling-guide");
  });
});

describe("splitting a guide after its first section", () => {
  const h2 = (t: string) => createElement("h2", { key: t }, t);
  const p = (t: string) => createElement("p", { key: t }, t);

  it("cuts a JSX body before the second top-level h2", () => {
    const { head, tail } = splitAfterFirstSection([p("intro"), h2("one"), p("a"), h2("two"), p("b")]);
    expect(head).toHaveLength(3);
    expect(tail).toHaveLength(2);
  });

  it("puts everything in the tail when there is no second section", () => {
    const { head, tail } = splitAfterFirstSection([p("intro"), h2("one"), p("a")]);
    expect(head).toHaveLength(0);
    expect(tail).toHaveLength(3);
  });

  it("cuts article HTML before the second h2, and refuses a cut inside an open block", () => {
    const html = "<p>Intro</p><h2 id=\"a\">A</h2><ul><li>x</li></ul><h2 id=\"b\">B</h2><p>More</p>";
    expect(splitHtmlAfterFirstSection(html)).toEqual(['<p>Intro</p><h2 id="a">A</h2><ul><li>x</li></ul>', '<h2 id="b">B</h2><p>More</p>']);
    expect(splitHtmlAfterFirstSection("<h2>A</h2><p>x</p>")).toBeNull();
    expect(splitHtmlAfterFirstSection("<div><h2>A</h2><p>x</p><h2>B</h2></div>")).toBeNull();
  });
});
