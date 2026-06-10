import { ImageResponse } from "next/og";

// Brand tokens duplicated here as raw hex so OG rendering doesn't depend on
// the Tailwind/CSS pipeline. These are the sRGB renderings of the warm
// oklch tokens in src/app/globals.css (same set as src/lib/email-theme.ts).
// Keep in sync if the palette changes.
export const OG_BRAND = {
  primary: "#953407",
  primaryDark: "#842c02",
  accent: "#bd592f",
  ink: "#17100b",
  inkMuted: "#564b42",
  inkSubtle: "#9b9086",
  surfaceWarm: "#f6ede2",
  surfaceCard: "#fefbf7",
  line: "#d9cfc5",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

interface RenderOgOptions {
  /** Top eyebrow line, e.g. "GUIDE" or "SUBURB" */
  eyebrow: string;
  /** Headline (max 2 lines visually) */
  title: string;
  /** Subhead (1 line max) */
  subtitle?: string;
  /** Bottom-right detail row, key/value pairs (rendered as small cards) */
  stats?: { label: string; value: string }[];
  /** Optional accent stripe colour override */
  accentColor?: string;
}

// Shared editorial OG renderer. Renders the brand-consistent card with:
// - warm-cream background
// - top-left brand mark
// - eyebrow + title + optional subtitle
// - optional stat cards along the bottom
// - accent stripe down the right edge
export function renderOgImage(opts: RenderOgOptions): ImageResponse {
  const accent = opts.accentColor ?? OG_BRAND.accent;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: OG_BRAND.surfaceWarm,
          fontFamily: "system-ui, sans-serif",
          color: OG_BRAND.ink,
          position: "relative",
          padding: "60px 80px",
        }}
      >
        {/* Accent stripe along the right edge */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 12,
            background: accent,
          }}
        />

        {/* Top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: OG_BRAND.inkMuted,
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: OG_BRAND.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Y
          </div>
          Your Property Guide
        </div>

        {/* Eyebrow */}
        <div
          style={{
            marginTop: 60,
            color: accent,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {opts.eyebrow}
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 18,
            fontSize: opts.title.length > 60 ? 60 : 76,
            lineHeight: 1.05,
            fontWeight: 700,
            color: OG_BRAND.ink,
            letterSpacing: -1.5,
            display: "flex",
            maxWidth: 980,
          }}
        >
          {opts.title}
        </div>

        {/* Subtitle */}
        {opts.subtitle && (
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.4,
              color: OG_BRAND.inkMuted,
              maxWidth: 940,
              display: "flex",
            }}
          >
            {opts.subtitle}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Stats footer */}
        {opts.stats && opts.stats.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: 14,
              borderTop: `1px solid ${OG_BRAND.line}`,
              paddingTop: 28,
            }}
          >
            {opts.stats.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: 28,
                  borderRight:
                    i < opts.stats!.length - 1 ? `1px solid ${OG_BRAND.line}` : "none",
                  marginRight: i < opts.stats!.length - 1 ? 14 : 0,
                }}
              >
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 700,
                    color: OG_BRAND.ink,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 16,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: OG_BRAND.inkSubtle,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              borderTop: `1px solid ${OG_BRAND.line}`,
              paddingTop: 24,
              fontSize: 22,
              color: OG_BRAND.inkSubtle,
              display: "flex",
            }}
          >
            yourpropertyguide.com.au
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE },
  );
}
