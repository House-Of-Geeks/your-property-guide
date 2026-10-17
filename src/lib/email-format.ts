// Shared formatting for every transactional email: HTML escaping, the
// first-name greeting, and subject-line names. Visitor text is untrusted
// (any client can POST a lead), so HTML builders escape at the point of
// interpolation. Subjects and plain-text parts stay unescaped.

/** Escape `& < > " '` for HTML text and attribute values. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function looksLikeEmailOrUrl(token: string): boolean {
  if (token.includes("@")) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(token)) return true;
  if (/^www\./i.test(token)) return true;
  return false;
}

function isLetter(ch: string): boolean {
  return /\p{L}/u.test(ch);
}

/** ALL CAPS or all-lowercase tokens become sentence case. Mixed case stays. */
export function sentenceCaseToken(token: string): string {
  const letters = [...token].filter(isLetter);
  if (letters.length === 0) return token;
  const allUpper = letters.every((ch) => ch === ch.toUpperCase() && ch !== ch.toLowerCase());
  const allLower = letters.every((ch) => ch === ch.toLowerCase() && ch !== ch.toUpperCase());
  if (!allUpper && !allLower) return token;
  let capped = false;
  return [...token]
    .map((ch) => {
      if (!isLetter(ch)) return ch;
      if (!capped) {
        capped = true;
        return ch.toLocaleUpperCase("en-AU");
      }
      return ch.toLocaleLowerCase("en-AU");
    })
    .join("");
}

/**
 * First name for a greeting. One token, sentence-cased when it is all one
 * case. Emails, URLs and anything longer than 40 characters fall back to
 * "there" so the line reads "Hi there,".
 */
export function visitorGreetingName(raw: string | null | undefined): string {
  const token = (raw ?? "").trim().split(/\s+/)[0] ?? "";
  if (!token || token.length > 40 || looksLikeEmailOrUrl(token)) return "there";
  return sentenceCaseToken(token);
}

/** "Hi Jos," or "Hi there,". */
export function visitorGreeting(raw: string | null | undefined): string {
  return `Hi ${visitorGreetingName(raw)},`;
}

/**
 * Full name for a subject line. Collapses whitespace, sentence-cases tokens
 * that are a single case, and drops emails, URLs and over-long tokens.
 */
export function visitorSubjectName(first?: string | null, last?: string | null): string {
  return `${first ?? ""} ${last ?? ""}`
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0 && token.length <= 40 && !looksLikeEmailOrUrl(token))
    .map(sentenceCaseToken)
    .join(" ");
}

/** Join plain-text paragraphs with a blank line. Drops empty blocks. */
export function textBlocks(blocks: Array<string | null | undefined>): string {
  return blocks
    .map((block) => (block ?? "").trim())
    .filter(Boolean)
    .join("\n\n");
}
