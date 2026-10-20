import { ImageResponse } from "next/og";

import { LOGO_MARK_PATH } from "@/components/brand/Logo";

// The brand's social cards (v7, "Clear decisions", 20 Oct 2026). Tokens are
// duplicated as raw hex so OG rendering doesn't depend on the Tailwind/CSS
// pipeline. Same set as src/app/globals.css and src/lib/email-theme.ts; keep
// them in sync if the palette changes.
export const OG_BRAND = {
  cream: "#f8f6f0",
  paper: "#fffdf8",
  ink: "#203d30",
  inkMuted: "#566257",
  inkSubtle: "#636c65",
  line: "#cdd2c6",
  forest: "#244a37",
  terracotta: "#89492f",
  copper: "#a9642c",
  copperText: "#93532a",
  /** The rule along the foot of the card (forest by default). */
  accent: "#244a37",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

interface RenderOgOptions {
  /** Top label, e.g. "Guide" or "Suburb profile" */
  eyebrow: string;
  /** Headline (max 2 lines visually) */
  title: string;
  /** Subhead (1 line max) */
  subtitle?: string;
  /** Bottom detail row, key/value pairs */
  stats?: { label: string; value: string }[];
  /** The rule's colour along the foot (forest; terracotta for selling) */
  accentColor?: string;
}

/**
 * A Google font, subset to the characters a card uses, as TTF (Google serves
 * TTF to clients that don't send a browser user agent). The edge bundle can't
 * carry the font files (500KB limit), so they're fetched at render time; if
 * the fetch fails the card falls back to the default sans, never an error.
 */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// Shared OG renderer: a cream card with the logo, a copper label, the title
// in Source Serif 4, an optional subtitle in Schibsted Grotesk, a fine rule
// and the address or a row of figures, and a forest rule along the foot.
export async function renderOgImage(opts: RenderOgOptions): Promise<ImageResponse> {
  const accent = opts.accentColor ?? OG_BRAND.accent;
  const serifText = `Your Property Guide${opts.title}${(opts.stats ?? []).map((s) => s.value).join("")}`;
  const sansText = `${opts.eyebrow.toUpperCase()}${opts.subtitle ?? ""}${(opts.stats ?? []).map((s) => s.label).join("")}yourpropertyguide.com.au`;
  const [serif, sans] = await Promise.all([googleFont("Source Serif 4", 400, serifText), googleFont("Schibsted Grotesk", 400, sansText)]);
  const fonts = [
    ...(serif ? [{ name: "Source Serif 4", data: serif, style: "normal" as const, weight: 400 as const }] : []),
    ...(sans ? [{ name: "Schibsted Grotesk", data: sans, style: "normal" as const, weight: 400 as const }] : []),
  ];
  const SERIF = serif ? "Source Serif 4" : "serif";
  const SANS = sans ? "Schibsted Grotesk" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: OG_BRAND.cream,
          fontFamily: SANS,
          color: OG_BRAND.ink,
          position: "relative",
          padding: "58px 72px 64px",
        }}
      >
        {/* The rule along the foot */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, background: accent }} />

        {/* The logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SERIF, fontSize: 32, letterSpacing: -0.6, color: OG_BRAND.ink }}>
          <svg width="38" height="38" viewBox="0 0 32 32">
            <path d={LOGO_MARK_PATH} fill={OG_BRAND.copper} />
          </svg>
          Your Property Guide
        </div>

        {/* Label */}
        <div style={{ marginTop: 58, color: OG_BRAND.copperText, fontSize: 20, letterSpacing: 2.4, display: "flex" }}>
          {opts.eyebrow.toUpperCase()}
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 16,
            fontFamily: SERIF,
            fontSize: opts.title.length > 60 ? 58 : 70,
            lineHeight: 1.06,
            color: OG_BRAND.ink,
            letterSpacing: opts.title.length > 60 ? -2 : -2.6,
            display: "flex",
            maxWidth: 1000,
          }}
        >
          {opts.title}
        </div>

        {/* Subtitle */}
        {opts.subtitle && (
          <div style={{ marginTop: 22, fontSize: 26, lineHeight: 1.45, color: OG_BRAND.inkMuted, maxWidth: 960, display: "flex" }}>
            {opts.subtitle}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {opts.stats && opts.stats.length > 0 ? (
          <div style={{ display: "flex", gap: 14, borderTop: `1px solid ${OG_BRAND.line}`, paddingTop: 24 }}>
            {opts.stats.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: 28,
                  borderRight: i < opts.stats!.length - 1 ? `1px solid ${OG_BRAND.line}` : "none",
                  marginRight: i < opts.stats!.length - 1 ? 14 : 0,
                }}
              >
                <div style={{ fontFamily: SERIF, fontSize: 40, color: OG_BRAND.ink, lineHeight: 1, letterSpacing: -1 }}>{s.value}</div>
                <div style={{ marginTop: 8, fontSize: 18, color: OG_BRAND.inkSubtle }}>{s.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ borderTop: `1px solid ${OG_BRAND.line}`, paddingTop: 22, fontSize: 21, color: OG_BRAND.inkSubtle, display: "flex" }}>
            yourpropertyguide.com.au
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
