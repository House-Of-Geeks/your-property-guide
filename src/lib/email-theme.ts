// Shared email palette + layout. Hex values are the sRGB renderings of
// the oklch design tokens in src/app/globals.css (email clients can't
// read CSS variables or oklch, so they're baked here). If the brand
// palette changes, re-derive these from the live tokens.
export const EMAIL_COLORS = {
  ink:            "#17100b", // --ink / --surface-inverse, warm near-black
  inkMuted:       "#564b42", // --ink-muted
  inkSubtle:      "#9b9086", // --ink-subtle
  paper:          "#fefbf7", // --surface-raised, card background
  cream:          "#f6ede2", // --surface-warm, tinted cells/callouts
  sunken:         "#f5f1ec", // --surface-sunken, page background
  line:           "#d9cfc5", // --line, hairlines
  terracotta:     "#bd592f", // --cta, buttons
  terracottaDark: "#953407", // --primary, links
  apricot:        "#ffddc6", // --accent-lighter, eyebrow on dark
  // Functional alert colours (urgency signal, not brand)
  alertBg:        "#7f1d1d",
  alertBorder:    "#fecaca",
} as const;

const C = EMAIL_COLORS;

const FONT_SANS = `-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
const FONT_SERIF = `Georgia, 'Times New Roman', serif`;

interface EmailLayoutOptions {
  /** Small caps line in the header band. */
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
 * Table-based so Outlook desktop doesn't shred it, inline-styled,
 * renders on warm paper to match the site.
 */
export function emailLayout({
  eyebrow = "Your Property Guide",
  title,
  body,
  footer = `Your Property Guide · A Profit Geeks publication · <a href="https://www.yourpropertyguide.com.au" style="color:${C.terracottaDark};">yourpropertyguide.com.au</a>`,
  variant = "brand",
  preheader,
}: EmailLayoutOptions): string {
  const headerBg = variant === "alert" ? C.alertBg : C.ink;
  const eyebrowColor = variant === "alert" ? "#ffffff" : C.apricot;
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
          <td style="background:${headerBg};padding:22px 28px;">
            <p style="margin:0;color:${eyebrowColor};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.22em;font-family:${FONT_SANS};">${eyebrow}</p>
            ${title ? `<h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:500;font-family:${FONT_SERIF};letter-spacing:-0.2px;">${title}</h1>` : ""}
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
      <p style="margin:14px 0 0;font-size:11px;color:${C.inkSubtle};font-family:${FONT_SANS};">Australian property, in plain English.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Terracotta CTA button. Table-wrapped so it holds shape in Outlook. */
export function emailButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;"><tr>
    <td style="background:${C.terracotta};border-radius:8px;">
      <a href="${url}" style="display:inline-block;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;font-family:${FONT_SANS};">${label}</a>
    </td></tr></table>`;
}

/** Quiet secondary button: outline on paper. */
export function emailButtonOutline(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;"><tr>
    <td style="border:1px solid ${C.line};border-radius:8px;background:${C.paper};">
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
      <h2 style="margin:0;color:#ffffff;font-size:24px;line-height:1.25;font-weight:500;font-family:${FONT_SERIF};">${headline}</h2>
      <p style="margin:10px 0 0;color:rgba(254,251,247,0.75);font-size:14px;line-height:1.6;font-family:${FONT_SANS};">${sub}</p>
    </td></tr>
  </table>`;
}
