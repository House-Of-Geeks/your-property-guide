import { GLOSSARY_TERMS } from "@/lib/data/glossary";

// Build a single regex that matches any glossary term, with longer terms
// preferred (so "auction clearance rate" matches before "auction"). We
// generate it once at module load.
//
// Terms with very common single words (e.g. "appraisal", "settlement",
// "vendor", "auction") are deliberately excluded, they appear too often in
// general writing for sensible auto-linking. Authors who want those linked
// can use <GlossaryLink> manually.
const COMMON_WORDS = new Set([
  "appraisal",
  "appreciation",
  "auction",
  "balloon-payment",
  "completion",
  "easement",
  "equity",
  "settlement",
  "vendor",
  "yield",
  "principal",
  "interest",
  "deposit",
  "default",
  "title",
  "valuation",
  "guarantor",
  "tenant",
  "warranty",
]);

interface CompiledTerm {
  slug: string;
  term: string;
  // Matches the term case-insensitively, not inside a longer word. Global, so
  // every occurrence in a text run can be checked against the ones already
  // taken by a longer term.
  regex: RegExp;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The regex source for a term. Word boundaries are written as lookarounds
 * because `\b` never matches after a closing bracket: with `\b...\b`, a term
 * such as "Capital Gains Tax (CGT)" could never be linked. An apostrophe
 * matches the straight and curly forms and their entities. A term whose
 * bracket holds an acronym ("Lenders Mortgage Insurance (LMI)") also matches
 * its name without the bracket, which is how articles write it.
 */
function termPattern(term: string): string {
  const one = (t: string) =>
    escapeRe(t)
      .split("'")
      .join("(?:'|\u2019|&apos;|&rsquo;|&#39;)");
  const variants = [term];
  const acronym = /^(.*\S)\s+\(([A-Z]{2,4})\)$/.exec(term);
  if (acronym) variants.push(acronym[1]);
  return `(?<![A-Za-z0-9])(?:${variants.map(one).join("|")})(?![A-Za-z0-9])`;
}

const LINKABLE_TERMS: CompiledTerm[] = GLOSSARY_TERMS
  .filter((t) => !COMMON_WORDS.has(t.slug))
  // Prefer longer terms first so "auction clearance rate" wins over "auction"
  .sort((a, b) => b.term.length - a.term.length)
  .map((t) => ({ slug: t.slug, term: t.term, regex: new RegExp(termPattern(t.term), "gi") }));

/**
 * Auto-link the first occurrence of each glossary term in an HTML string.
 *
 * Skips matches inside:
 * - already-linked text (inside <a>...</a>)
 * - heading tags (h1-h6) so headings stay clean
 * - existing tag attributes
 *
 * Each term links to `/glossary/[slug]` with a subtle dotted-underline class
 * so readers can distinguish the auto-link from regular `<a>` tags.
 */
export function linkGlossaryTerms(html: string): string {
  // Track which slugs we've already linked so each only gets one link per page
  const linked = new Set<string>();

  // We work paragraph by paragraph, splitting on tag boundaries so we don't
  // touch tag attributes or already-linked content.
  //
  // Strategy: split the string into "tag" and "text" segments, only process
  // text segments, and skip text inside <a>, <h1>-<h6>, <code>, <pre>.
  const SKIP_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "h5", "h6", "code", "pre"]);

  const parts: string[] = [];
  // State: we step through tokens. A token is either an HTML tag or a text run.
  const tokenRe = /<[^>]+>|[^<]+/g;
  const tagStack: string[] = [];

  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(html)) !== null) {
    const tok = m[0];
    if (tok.startsWith("<")) {
      // Update tag stack
      const tagMatch = /^<\s*\/?\s*([a-zA-Z][a-zA-Z0-9]*)/.exec(tok);
      if (tagMatch) {
        const name = tagMatch[1].toLowerCase();
        if (tok.startsWith("</")) {
          // Closing tag, pop most recent matching open
          const idx = tagStack.lastIndexOf(name);
          if (idx >= 0) tagStack.splice(idx, 1);
        } else if (!tok.endsWith("/>")) {
          // Opening tag (not self-closing)
          tagStack.push(name);
        }
      }
      parts.push(tok);
      continue;
    }

    // Text run, skip if we're inside a skip-tag
    const inSkipTag = tagStack.some((t) => SKIP_TAGS.has(t));
    if (inSkipTag) {
      parts.push(tok);
      continue;
    }

    // Find every term's first free occurrence in the original text run, then
    // insert the links in one pass. Matching against text that already holds
    // inserted links nested them: "mortgage" matched inside the href of the
    // "Mortgage Broker" link, and readers saw raw markup (four posts, found
    // 10 Oct 2026).
    const hits: { start: number; end: number; slug: string }[] = [];
    for (const t of LINKABLE_TERMS) {
      if (linked.has(t.slug)) continue;
      t.regex.lastIndex = 0;
      let hit: RegExpExecArray | null;
      while ((hit = t.regex.exec(tok)) !== null) {
        const start = hit.index;
        const end = start + hit[0].length;
        if (hits.some((h) => start < h.end && end > h.start)) continue;
        hits.push({ start, end, slug: t.slug });
        linked.add(t.slug);
        break;
      }
    }
    hits.sort((x, y) => x.start - y.start);
    let text = "";
    let at = 0;
    for (const h of hits) {
      const matched = tok.slice(h.start, h.end);
      text += tok.slice(at, h.start);
      text += `<a href="/glossary/${h.slug}" class="glossary-link" data-glossary-slug="${h.slug}">${matched}</a>`;
      at = h.end;
    }
    text += tok.slice(at);
    parts.push(text);
  }

  return parts.join("");
}
