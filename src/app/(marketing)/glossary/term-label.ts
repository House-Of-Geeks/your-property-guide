// Glossary entries in src/lib/data/glossary.ts are written as HTML-ready
// strings, and two term names carry an entity ("Buyer&apos;s Agent",
// "Vendor&apos;s Statement"). React escapes text, so a term rendered as is
// reaches the reader raw: /glossary/capital-gains-tax-cgt listed
// "Buyer&apos;s Agent" under Nearby terms (commercial intent review, 10 Oct
// 2026, finance-tax F12), and the term's own H1, breadcrumb, title and
// schema did the same. The glossary routes render every term name through
// termLabel, which decodes entities once and leaves plain text unchanged.

const NAMED: Record<string, string> = {
  amp: "&",
  apos: "'",
  quot: '"',
  lt: "<",
  gt: ">",
  nbsp: " ",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  ndash: "–",
};

/** Decode HTML character references (named, decimal and hex) in one pass. */
export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (ref, body: string) => {
    if (body[0] === "#") {
      const hex = body[1] === "x" || body[1] === "X";
      const cp = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(cp) && cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ref;
    }
    return NAMED[body.toLowerCase()] ?? ref;
  });
}

/** A glossary term's name as the reader should see it. */
export function termLabel(entry: { term: string }): string {
  return decodeEntities(entry.term);
}
