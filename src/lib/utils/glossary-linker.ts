import { GLOSSARY_TERMS } from "@/lib/data/glossary";

// Build a single regex that matches any glossary term, with longer terms
// preferred (so "auction clearance rate" matches before "auction"). We
// generate it once at module load.
//
// Terms with very common single words (e.g. "appraisal", "settlement",
// "vendor", "auction") are deliberately excluded — they appear too often in
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
  // Pre-built RegExp matching the term with word boundaries, case-insensitive,
  // and avoiding matches inside HTML tag attributes.
  regex: RegExp;
}

const LINKABLE_TERMS: CompiledTerm[] = GLOSSARY_TERMS
  .filter((t) => !COMMON_WORDS.has(t.slug))
  // Prefer longer terms first so "auction clearance rate" wins over "auction"
  .sort((a, b) => b.term.length - a.term.length)
  .map((t) => {
    // Escape regex special chars in the term name. Word boundaries (\b)
    // prevent partial matches like "title-deed" matching inside "subtitle".
    const escaped = t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return {
      slug: t.slug,
      term: t.term,
      regex: new RegExp(`\\b(${escaped})\\b`, "i"),
    };
  });

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
          // Closing tag — pop most recent matching open
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

    // Text run — skip if we're inside a skip-tag
    const inSkipTag = tagStack.some((t) => SKIP_TAGS.has(t));
    if (inSkipTag) {
      parts.push(tok);
      continue;
    }

    let text = tok;
    for (const t of LINKABLE_TERMS) {
      if (linked.has(t.slug)) continue;
      const match = text.match(t.regex);
      if (!match || match.index === undefined) continue;
      // Replace the first match only
      const before = text.slice(0, match.index);
      const matched = match[1];
      const after = text.slice(match.index + matched.length);
      const link = `<a href="/glossary/${t.slug}" class="glossary-link" data-glossary-slug="${t.slug}">${matched}</a>`;
      text = before + link + after;
      linked.add(t.slug);
    }
    parts.push(text);
  }

  return parts.join("");
}
