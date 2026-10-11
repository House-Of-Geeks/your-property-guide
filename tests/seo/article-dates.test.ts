// Commercial intent review, 10 Oct 2026 (finance-tax F12): the CGT article,
// rewritten on 1 Oct 2026 with a correction note, showed only "13 May 2026"
// (its publication date) at the top, twice, and the update only in the
// footer card. The article template now shows "Updated {date}" beside the
// published date whenever updatedAt is later than publishedAt.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import BlogDetailPage from "@/app/(marketing)/guides/[slug]/page";
import { blogPosts } from "@/lib/data/blogs";
import { formatDate } from "@/lib/utils/format";

async function render(slug: string): Promise<string> {
  const html = renderToStaticMarkup(createElement("div", null, await BlogDetailPage({ params: Promise.resolve({ slug }) })));
  return html;
}

// Everything above the article body: masthead, H1, standfirst, byline row.
const top = (html: string) => html.slice(0, html.indexOf('class="mt-8 prose-ypg"'));
const time = (iso: string) => new RegExp(`<time dateTime="${iso}">${formatDate(iso)}</time>`, "gi");

const later = (p: (typeof blogPosts)[number]) =>
  !!p.updatedAt && new Date(p.updatedAt).getTime() > new Date(p.publishedAt).getTime();

describe("article dates at the top", () => {
  it("the corrected CGT article shows its 1 October 2026 update beside 13 May 2026", async () => {
    const head = top(await render("cgt-changes-2026-budget"));
    expect(formatDate("2026-10-01")).toBe("1 October 2026");
    expect(head.match(time("2026-05-13"))?.length).toBe(2);
    expect(head.match(time("2026-10-01"))?.length).toBe(2);
    expect(head).toMatch(/Updated <time dateTime="2026-10-01">1 October 2026<\/time>/i);
    expect(head).toMatch(/Published <time dateTime="2026-05-13">13 May 2026<\/time>/i);
  });

  it("every post with a later update shows it at the top", async () => {
    const updated = blogPosts.filter(later);
    expect(updated.length).toBeGreaterThan(0);
    for (const p of updated) {
      const head = top(await render(p.slug));
      expect(head.match(time(p.updatedAt!))?.length, p.slug).toBe(2);
    }
  });

  it("a post never updated shows only its publication date", async () => {
    const p = blogPosts.find((x) => !x.updatedAt)!;
    const head = top(await render(p.slug));
    expect(head).not.toMatch(/Updated/);
    expect(head).not.toMatch(/Published /);
    expect(head.match(time(p.publishedAt))?.length).toBe(2);
  });
});
