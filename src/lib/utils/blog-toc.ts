import { linkGlossaryTerms } from "./glossary-linker";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Process raw blog HTML into render-ready content.
 *
 * - Adds `id` attributes to h2/h3 tags + extracts the table-of-contents
 * - Auto-links the first occurrence of each glossary term to /glossary/[slug]
 *   (skips already-linked text, headings, code blocks)
 *
 * Returns the modified HTML alongside a list of TOC items for the sticky
 * sidebar.
 */
export function processContent(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();

  // Pass 1: auto-link glossary terms in the body content. Done first so the
  // anchor tags we add are present when we run the heading-id pass below
  // (the heading pass skips text already inside <a> tags via the skip-tag
  // logic in linkGlossaryTerms, but linking after heading-id would leave
  // them un-skipped).
  const linked = linkGlossaryTerms(html);

  // Pass 2: assign deterministic IDs to h2/h3 for the TOC
  const processed = linked.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level, attrs, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const base = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);

      let id = base || `heading-${toc.length + 1}`;
      let counter = 1;
      while (usedIds.has(id)) id = `${base}-${counter++}`;
      usedIds.add(id);

      toc.push({ id, text, level: parseInt(level) as 2 | 3 });
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );

  return { html: processed, toc };
}

// Block elements a cut must not land inside. Article HTML is a flat run of
// headings, paragraphs, lists and tables, so a balanced head means the cut
// sits between two top-level blocks.
const BLOCK_TAGS = ["div", "section", "aside", "article", "details", "blockquote", "table", "ul", "ol", "figure"];

function count(html: string, re: RegExp): number {
  return html.match(re)?.length ?? 0;
}

/**
 * Split article HTML before its second <h2>, so a CTA can render after the
 * intro and first section. Null when there is no second h2, or when the cut
 * would fall inside an open block (an h2 nested in a wrapper), in which case
 * the caller renders the article whole.
 */
export function splitHtmlAfterFirstSection(html: string): [string, string] | null {
  const re = /<h2[\s>]/gi;
  re.exec(html);
  const second = re.exec(html);
  if (!second) return null;
  const head = html.slice(0, second.index);
  for (const tag of BLOCK_TAGS) {
    if (count(head, new RegExp(`<${tag}[\\s>]`, "gi")) !== count(head, new RegExp(`</${tag}>`, "gi"))) return null;
  }
  return [head, html.slice(second.index)];
}
