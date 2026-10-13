import type { FaqItem } from "@/components/guide/Faq";

// Articles write their FAQ as plain HTML: an <h2>Frequently asked questions</h2>
// followed by <h3> questions, each answered by the paragraphs (or a list)
// under it, up to the next <h2>. The article template reads that section
// back out so the FAQPage JSON-LD carries exactly the visible questions and
// answers (selling review P7, 10 Oct 2026: six blog guides rendered an FAQ
// with no schema). No FAQ section, no schema.

const FAQ_HEADING = /<h2\b[^>]*>\s*(?:frequently asked questions|common questions|faqs?)\s*<\/h2>/i;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&ndash;": "–",
  "&mdash;": "—",
};

/** Visible text of an HTML fragment: tags dropped, entities decoded, spaces collapsed. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;|&#\d+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? e)
    .replace(/\s+/g, " ")
    .trim();
}

/** The question-and-answer pairs of an article's FAQ section, in order. */
export function extractArticleFaqs(html: string): FaqItem[] {
  const start = FAQ_HEADING.exec(html);
  if (!start) return [];
  const rest = html.slice(start.index + start[0].length);
  const next = rest.search(/<h2[\s>]/i);
  const section = next === -1 ? rest : rest.slice(0, next);

  const items: FaqItem[] = [];
  const re = /<h3\b[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[\s>]|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    const question = htmlToText(m[1]);
    // One answer paragraph per block, kept apart the way Faq renders them.
    const blocks = m[2].match(/<(p|li)\b[^>]*>[\s\S]*?<\/\1>/gi) ?? [m[2]];
    const answer = blocks.map(htmlToText).filter(Boolean).join("\n\n");
    if (question && answer) items.push({ question, answer });
  }
  return items;
}
