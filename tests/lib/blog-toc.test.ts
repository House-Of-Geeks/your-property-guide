import { describe, expect, it } from "vitest";
import { processContent, splitHtmlAfterFirstSection } from "@/lib/utils/blog-toc";

describe("processContent tables", () => {
  const table = "<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>";

  it("wraps each table in a scroll container", () => {
    const { html } = processContent(`<p>Intro</p>${table}<p>Between</p>${table}`);
    expect(html.match(/<div class="table-scroll"/g)).toHaveLength(2);
    expect(html.match(/<\/table><\/div>/g)).toHaveLength(2);
    expect(html).toContain("<p>Between</p>");
  });

  it("leaves content without a table alone", () => {
    expect(processContent("<p>No table</p>").html).toBe("<p>No table</p>");
  });

  it("keeps a wrapped table balanced for the first-section split", () => {
    const { html } = processContent(`<h2>One</h2>${table}<h2>Two</h2><p>x</p>`);
    const parts = splitHtmlAfterFirstSection(html);
    expect(parts).not.toBeNull();
    expect(parts![0]).toContain("</table></div>");
    expect(parts![1].startsWith("<h2")).toBe(true);
  });
});
