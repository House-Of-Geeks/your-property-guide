// Shared email palette + layout, brand v4 (Oct 2026). Hex values match the
// tokens in src/app/globals.css (email clients can't read CSS variables).
// Key names are kept from v3 so existing builders keep working; the values
// are the v4 palette (white paper, charcoal ink, roof-tile actions).
export const EMAIL_COLORS = {
  ink:            "#16191d", // --ink / --surface-inverse
  inkMuted:       "#565e68", // --ink-muted
  inkSubtle:      "#6b737c", // --ink-subtle
  paper:          "#ffffff", // card background
  cream:          "#f3f4f5", // --surface-warm (Mist), tinted cells/callouts
  sunken:         "#f5f6f7", // --surface-sunken, page background
  line:           "#dfe2e6", // --line, hairlines
  terracotta:     "#c24a1c", // --cta, buttons (roof tile)
  terracottaDark: "#a8401a", // --primary, links
  apricot:        "#fbebe4", // --accent-lighter
  // Functional alert colours (urgency signal, not brand)
  alertBg:        "#7f1d1d",
  alertBorder:    "#fecaca",
} as const;

/** The house-bubble mark as a hosted PNG (emails can't rely on SVG). */
const MARK_URL = "https://www.yourpropertyguide.com.au/images/brand/mark-96.png";

const C = EMAIL_COLORS;

const FONT_SANS = `-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
// v4 has one typeface; email falls back to the system sans for headings too.
const FONT_SERIF = FONT_SANS;

interface EmailLayoutOptions {
  /** Short label in the header band, under the logo. */
  eyebrow?: string;
  /** Optional heading rendered inside the header band, below the eyebrow. */
  title?: string;
  /** Inner HTML of the card body. Caller controls padding via blocks. */
  body: string;
  /** Footer line; defaults to the site signature. */
  footer?: string;
  /** "brand" = warm ink header; "alert" = red header for failures/outages. */
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
 * Table-based so Outlook desktop doesn't shred it, inline-styled, white
 * card with the logo, matching the site.
 */
export function emailLayout({
  eyebrow = "Your Property Guide",
  title,
  body,
  footer = `Your Property Guide · Published from Brisbane · <a href="https://www.yourpropertyguide.com.au" style="color:${C.terracottaDark};">yourpropertyguide.com.au</a>`,
  variant = "brand",
  preheader,
}: EmailLayoutOptions): string {
  const alert = variant === "alert";
  const headerBg = alert ? C.alertBg : C.paper;
  const eyebrowColor = alert ? "#ffffff" : C.inkMuted;
  const titleColor = alert ? "#ffffff" : C.ink;
  const cardBorder = variant === "alert" ? C.alertBorder : C.line;

  // Preheader: visible to inbox preview parsers, invisible in the body.
  // Padded with hair spaces so trailing body text doesn't leak into the
  // preview in clients that keep reading.
  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}${"&#8199;&#847; ".repeat(30)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<title>${title ?? "Your Property Guide"}</title>
</head>
<body style="margin:0;padding:0;background:${C.sunken};">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sunken};">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.paper};border:1px solid ${cardBorder};border-radius:12px;overflow:hidden;font-family:${FONT_SANS};color:${C.ink};">
        <tr>
          <td style="background:${headerBg};padding:22px 28px;${alert ? "" : `border-bottom:1px solid ${C.line};`}">
            ${alert ? "" : `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;"><tr>
              <td style="padding-right:8px;vertical-align:middle;"><img src="${MARK_URL}" width="24" height="24" alt="" style="display:block;width:24px;height:24px;" /></td>
              <td style="vertical-align:middle;font-family:${FONT_SANS};font-size:17px;font-weight:700;letter-spacing:-0.3px;color:${C.ink};">Your Property Guide</td>
            </tr></table>`}
            ${alert || eyebrow !== "Your Property Guide" ? `<p style="margin:0;color:${eyebrowColor};font-size:13px;font-weight:600;font-family:${FONT_SANS};">${eyebrow}</p>` : ""}
            ${title ? `<h1 style="margin:6px 0 0;color:${titleColor};font-size:22px;line-height:1.25;font-weight:700;font-family:${FONT_SERIF};letter-spacing:-0.3px;">${title}</h1>` : ""}
          </td>
        </tr>
        <tr><td>
          ${body}
        </td></tr>
        <tr>
          <td style="padding:16px 28px;background:${C.cream};border-top:1px solid ${C.line};">
            <p style="margin:0;font-size:12px;line-height:1.6;color:${C.inkSubtle};font-family:${FONT_SANS};">${footer}</p>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:11px;color:${C.inkSubtle};font-family:${FONT_SANS};">Property, explained by people.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Terracotta CTA button. Table-wrapped so it holds shape in Outlook. */
export function emailButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;"><tr>
    <td style="background:${C.terracotta};border-radius:6px;">
      <a href="${url}" style="display:inline-block;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;font-family:${FONT_SANS};">${label}</a>
    </td></tr></table>`;
}

/** Quiet secondary button: outline on paper. */
export function emailButtonOutline(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;"><tr>
    <td style="border:1px solid ${C.ink};border-radius:6px;background:${C.paper};">
      <a href="${url}" style="display:inline-block;color:${C.ink};text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;font-family:${FONT_SANS};">${label}</a>
    </td></tr></table>`;
}

/**
 * Dark hero panel with the guide cover art, used by the guide-delivery
 * email. The cover is a real image (public/images/guide/) so it renders
 * everywhere; the panel background matches the cover's ink so the image
 * edge disappears into the band.
 */
export function emailCoverHero(coverUrl: string, headline: string, sub: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};">
    <tr><td align="center" style="padding:30px 28px 0;">
      <img src="${coverUrl}" width="216" alt="The Complete Guide to Selling Your Property in Australia, 2026 edition" style="display:block;width:216px;max-width:60%;height:auto;border-radius:6px;box-shadow:0 18px 40px rgba(0,0,0,0.45);" />
    </td></tr>
    <tr><td align="center" style="padding:24px 36px 30px;">
      <h2 style="margin:0;color:#ffffff;font-size:24px;line-height:1.25;font-weight:700;font-family:${FONT_SERIF};letter-spacing:-0.3px;">${headline}</h2>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.78);font-size:14px;line-height:1.6;font-family:${FONT_SANS};">${sub}</p>
    </td></tr>
  </table>`;
}
