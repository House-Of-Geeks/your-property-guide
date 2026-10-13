import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { extractArticleFaqs, htmlToText } from "@/lib/utils/blog-faq";
import { blogPosts } from "@/lib/data/blogs";

describe("article FAQ extraction (FAQPage JSON-LD on the article template)", () => {
  it("reads the h3 questions and their answers up to the next h2", () => {
    const html =
      "<p>Intro</p><h2>Frequently asked questions</h2>" +
      "<h3>Is commission negotiable?</h3><p>In every state.</p><p>Ask for it in <a href=\"/x\">dollars</a>.</p>" +
      "<h3>Do I pay if it doesn&apos;t sell?</h3><ul><li>Usually not.</li></ul>" +
      "<h2>Sources</h2><h3>Not a question</h3><p>Nope</p>";
    expect(extractArticleFaqs(html)).toEqual([
      { question: "Is commission negotiable?", answer: "In every state.\n\nAsk for it in dollars." },
      { question: "Do I pay if it doesn't sell?", answer: "Usually not." },
    ]);
  });

  it("returns nothing for an article without an FAQ section", () => {
    expect(extractArticleFaqs("<h2>What it costs</h2><h3>Agent</h3><p>2%</p>")).toEqual([]);
  });

  it("finds every article FAQ the site publishes, each with an answer", () => {
    const withFaq = blogPosts.filter((p) => /<h2>\s*Frequently asked questions\s*<\/h2>/i.test(p.content));
    expect(withFaq.length).toBeGreaterThan(0);
    for (const p of withFaq) {
      const faqs = extractArticleFaqs(p.content);
      expect(faqs.length, p.slug).toBeGreaterThan(0);
      for (const f of faqs) {
        expect(f.question, p.slug).toMatch(/\?$/);
        expect(f.answer.length, p.slug).toBeGreaterThan(20);
        expect(f.answer, p.slug).not.toMatch(/<[a-z]/i);
      }
    }
  });

  it("decodes entities and drops tags", () => {
    expect(htmlToText("Buyer&apos;s <em>agent</em> &amp; vendor")).toBe("Buyer's agent & vendor");
  });

  it("the article template renders the schema from the article's own FAQ", () => {
    const src = fs.readFileSync("src/app/(marketing)/guides/[slug]/page.tsx", "utf8");
    expect(src).toContain("extractArticleFaqs(post.content)");
    expect(src).toContain("<FAQPageJsonLd faqs={faqs} />");
  });
});

describe("guide layout trust signals", () => {
  const layout = fs.readFileSync("src/components/guide/GuideArticleLayout.tsx", "utf8");

  it("no longer claims every figure is sourced on pages that render no sources (review 0.2)", () => {
    expect(layout).not.toContain("Every figure on this page is sourced and dated");
    // The byline links to the sources block only when the page has one.
    expect(layout).toContain('sourcesHref={sources.length > 0 ? "#sources" : undefined}');
  });

  it("names the reviewer in the byline and links the methodology", () => {
    const byline = fs.readFileSync("src/components/guide/GuideByline.tsx", "utf8");
    expect(byline).toContain("Reviewed by");
    expect(byline).toContain("How we keep this accurate");
    expect(fs.readFileSync("src/components/guide/people.ts", "utf8")).toContain('"/about#methodology"');
  });
});
