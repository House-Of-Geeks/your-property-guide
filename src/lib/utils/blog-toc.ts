export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Adds `id` attributes to h2/h3 tags in an HTML string and returns the modified
 * HTML alongside a list of TOC items for the sticky sidebar.
 */
export function processContent(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();

  const processed = html.replace(
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
