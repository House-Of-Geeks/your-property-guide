import { escapeHtml } from "@/lib/email-format";
import { PROMISE } from "@/lib/service-model";

// Shared email palette + layout, "Clear decisions" (20 Oct 2026). Restrained:
// cream page, warm white card, sand panels, fine rules instead of shadows, no
// gradients, serif headings at regular weight, and one button style (forest
// green with cream text, square-ish 4px corners). Copper is only for small
// labels and link accents; the logo mark keeps its own copper. Email clients
// can't read CSS variables, so the hex values live here.
export const EMAIL_COLORS = {
  /** Headings and body text. */
  ink:       "#203d30",
  /** Secondary text, captions and fine print. */
  inkMuted:  "#566257",
  /** Fine print; the same muted ink (kept as its own key for older callers). */
  inkSubtle: "#566257",
  /** Page background, and the text on the forest button. */
  cream:     "#f8f6f0",
  /** The content card. */
  paper:     "#fffdf8",
  /** Panels inside the card: callouts, label cells, the footer. */
  sand:      "#edece2",
  /** Fine rules and borders. */
  line:      "#cdd2c6",
  /** The one button. */
  forest:    "#244a37",
  /** Small labels and link accents only. */
  copper:    "#9b592d",
  /** The logo mark's fill (src/components/brand/Logo.tsx). Never text. */
  mark:      "#a9642c",
  // Functional alert colours (urgency signal, not brand)
  alertBg:     "#7f1d1d",
  alertBorder: "#fecaca",
} as const;

/**
 * The house-bubble mark (LOGO_MARK_PATH) as a hosted PNG: Gmail and Outlook
 * drop inline SVG, so emails can't draw it themselves.
 */
const MARK_URL = "https://www.yourpropertyguide.com.au/images/brand/mark-96.png";

const C = EMAIL_COLORS;

/** System sans for body text; the serif for headings and the wordmark. */
export const EMAIL_FONTS = {
  sans: `-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
  // Source Serif 4 where the reader has it installed; Georgia everywhere else.
  serif: `'Source Serif 4', Georgia, 'Times New Roman', serif`,
} as const;

const FONT_SANS = EMAIL_FONTS.sans;
const FONT_SERIF = EMAIL_FONTS.serif;

/** The line under every card (the site's opening line). */
export const EMAIL_SIGNOFF_LINE = PROMISE.headline;

/** Mark + wordmark, for the top of the card. */
export function emailBrandLockup(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;"><tr>
              <td style="padding-right:9px;vertical-align:middle;"><img src="${MARK_URL}" width="22" height="22" alt="" style="display:block;width:22px;height:22px;border:0;" /></td>
              <td style="vertical-align:middle;font-family:${FONT_SERIF};font-size:19px;line-height:1.2;font-weight:400;letter-spacing:-0.4px;color:${C.ink};">Your Property Guide</td>
            </tr></table>`;
}

/** A small copper label above a heading or a section ("Your next three steps"). */
export function emailLabel(text: string, margin = "0 0 6px"): string {
  return `<p style="margin:${margin};font-size:12px;line-height:1.4;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${C.copper};font-family:${FONT_SANS};">${text}</p>`;
}

/** A serif heading at regular weight. `text` is HTML; escape it first. */
export function emailHeading(text: string, opts: { size?: number; margin?: string; tag?: "h1" | "h2" | "h3" } = {}): string {
  const { size = 22, margin = "0 0 10px", tag = "h2" } = opts;
  return `<${tag} style="margin:${margin};font-size:${size}px;line-height:1.25;font-weight:400;letter-spacing:-0.2px;color:${C.ink};font-family:${FONT_SERIF};">${text}</${tag}>`;
}

interface EmailLayoutOptions {
  /** Short label in the header, under the logo. */
  eyebrow?: string;
  /** Optional heading rendered in the header, below the eyebrow. */
  title?: string;
  /** Inner HTML of the card body. Caller controls padding via blocks. */
  body: string;
  /** Footer line; defaults to the site signature. */
  footer?: string;
  /** "brand" = logo header; "alert" = red header for failures/outages. */
  variant?: "brand" | "alert";
  /**
   * Hidden preview text shown next to the subject in the inbox list.
   * The single cheapest open-rate lever an email has; always set it on
   * customer-facing sends.
   */
  preheader?: string;
}

/**
 * Single shared shell for every transactional email the site sends.
 * Table-based so Outlook desktop doesn't shred it, inline-styled, a warm
 * white card on cream with the logo, matching the site.
 */
export function emailLayout({
  eyebrow = "Your Property Guide",
  title,
  body,
  footer = `Your Property Guide · Published from Brisbane · <a href="https://www.yourpropertyguide.com.au" style="color:${C.copper};">yourpropertyguide.com.au</a>`,
  variant = "brand",
  preheader,
}: EmailLayoutOptions): string {
  const alert = variant === "alert";
  const headerBg = alert ? C.alertBg : C.paper;
  const cardBorder = alert ? C.alertBorder : C.line;
  const showEyebrow = alert || eyebrow !== "Your Property Guide";
  const eyebrowHtml = !showEyebrow
    ? ""
    : alert
      ? `<p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;font-family:${FONT_SANS};">${eyebrow}</p>`
      : emailLabel(eyebrow, "14px 0 0");

  // Preheader: visible to inbox preview parsers, invisible in the body.
  // Padded with hair spaces so trailing body text doesn't leak into the
  // preview in clients that keep reading.
  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}${"&#8199;&#847; ".repeat(30)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${title ?? "Your Property Guide"}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.paper};border:1px solid ${cardBorder};border-radius:4px;overflow:hidden;font-family:${FONT_SANS};color:${C.ink};">
        <tr>
          <td style="background:${headerBg};padding:22px 28px;${alert ? "" : `border-bottom:1px solid ${C.line};`}">
            ${alert ? "" : emailBrandLockup()}
            ${eyebrowHtml}
            ${title ? `<h1 style="margin:${showEyebrow ? "4px" : "16px"} 0 0;color:${alert ? "#ffffff" : C.ink};font-size:24px;line-height:1.2;font-weight:400;font-family:${FONT_SERIF};letter-spacing:-0.2px;">${title}</h1>` : ""}
          </td>
        </tr>
        <tr><td>
          ${body}
        </td></tr>
        <tr>
          <td style="padding:16px 28px;background:${C.sand};border-top:1px solid ${C.line};">
            <p style="margin:0;font-size:12px;line-height:1.6;color:${C.inkMuted};font-family:${FONT_SANS};">${footer}</p>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:13px;color:${C.inkMuted};font-family:${FONT_SERIF};">${EMAIL_SIGNOFF_LINE}</p>
    </td></tr>
  </table>
</body>
</html>`;
}

/** The one button: forest green, cream text, 4px corners. Table-wrapped so it holds shape in Outlook. */
export function emailButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;"><tr>
    <td style="background:${C.forest};border-radius:4px;">
      <a href="${escapeHtml(url)}" style="display:inline-block;color:${C.cream};text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:4px;font-family:${FONT_SANS};">${label}</a>
    </td></tr></table>`;
}

/** Quiet secondary link-button: a fine forest outline on the card. */
export function emailButtonOutline(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;"><tr>
    <td style="border:1px solid ${C.forest};border-radius:4px;background:${C.paper};">
      <a href="${escapeHtml(url)}" style="display:inline-block;color:${C.forest};text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:4px;font-family:${FONT_SANS};">${label}</a>
    </td></tr></table>`;
}

/**
 * The guide cover on a sand panel, used by the guide-delivery email. The
 * cover is a real image (GUIDE_BOOKS[id].coverEmail) so it renders
 * everywhere; a fine rule frames it instead of a shadow. `headline` and
 * `sub` are HTML (escape visitor text first); `alt` and `label` are plain.
 */
export function emailCoverHero(cover: { url: string; alt: string; label?: string }, headline: string, sub: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand};border-bottom:1px solid ${C.line};">
    <tr><td align="center" style="padding:30px 28px 0;">
      <img src="${escapeHtml(cover.url)}" width="200" alt="${escapeHtml(cover.alt)}" style="display:block;width:200px;max-width:60%;height:auto;border:1px solid ${C.line};" />
    </td></tr>
    <tr><td align="center" style="padding:22px 36px 28px;">
      ${cover.label ? emailLabel(escapeHtml(cover.label), "0 0 8px") : ""}
      <h2 style="margin:0;color:${C.ink};font-size:26px;line-height:1.2;font-weight:400;font-family:${FONT_SERIF};letter-spacing:-0.2px;">${headline}</h2>
      <p style="margin:10px 0 0;color:${C.inkMuted};font-size:14px;line-height:1.6;font-family:${FONT_SANS};">${sub}</p>
    </td></tr>
  </table>`;
}
