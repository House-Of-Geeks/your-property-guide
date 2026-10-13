import { ImageResponse } from "next/og";

import { LOGO_MARK_PATH } from "@/components/brand/Logo";

// Brand v4 tokens duplicated as raw hex so OG rendering doesn't depend on
// the Tailwind/CSS pipeline. Same set as src/app/globals.css and
// src/lib/email-theme.ts; keep in sync if the palette changes.
export const OG_BRAND = {
  primary: "#a8401a",
  primaryDark: "#8f3612",
  accent: "#c24a1c",
  ink: "#16191d",
  inkMuted: "#565e68",
  inkSubtle: "#6b737c",
  surfaceWarm: "#ffffff",
  surfaceCard: "#ffffff",
  line: "#dfe2e6",
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

// Shared OG renderer. Renders the brand card with:
// - white background
// - top-left logo (house bubble mark + wordmark)
// - label + title + optional subtitle
// - optional stat cards along the bottom
// - a roof-tile rule along the bottom edge
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
        {/* Roof-tile rule along the bottom edge */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            background: accent,
          }}
        />

        {/* Top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: OG_BRAND.ink,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 32 32">
            <path d={LOGO_MARK_PATH} fill={OG_BRAND.accent} />
          </svg>
          Your Property Guide
        </div>

        {/* Eyebrow */}
        <div
          style={{
            marginTop: 56,
            color: OG_BRAND.primary,
            fontSize: 26,
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
                    fontSize: 18,
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
