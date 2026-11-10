import { SITE_URL } from "@/lib/constants/seo";

// Unsubscribe links for marketing email (21 Oct 2026): the series, the
// newsletter and its welcome. Every one carries
//   - a visible link in the footer, to a page that asks before it acts
//     (/unsubscribe?t=), so a link scanner that opens it changes nothing;
//   - RFC 8058 one-click headers. The List-Unsubscribe URL is POSTed to by
//     the mail client ("List-Unsubscribe=One-Click"); /api/unsubscribe
//     unsubscribes on that POST only.
// The token is the Lead row's opaque token; suppression covers every row
// with the same address (src/lib/mail/suppression.ts). We use our own
// links, not SendGrid's subscription tracking (off on the account), so the
// app stays the record of who unsubscribed.

export function unsubscribePageUrl(token: string): string {
  return `${SITE_URL}/unsubscribe?t=${encodeURIComponent(token)}`;
}

export function oneClickUrl(token: string): string {
  return `${SITE_URL}/api/unsubscribe?t=${encodeURIComponent(token)}`;
}

export function listUnsubscribeHeaders(token: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${oneClickUrl(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
