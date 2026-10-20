// The Your Property Guide logo (brand v4, Oct 2026; v6 set the wordmark in
// the serif and the mark in copper; v7 "Clear decisions" keeps both, with
// the wordmark in forest ink).
//
// The mark is the "house bubble": a house drawn as a speech bubble. It says
// what the business is, property explained by people, and it stays legible
// down to a 16px favicon. The wordmark is live text in the brand typeface so
// it stays crisp and readable by crawlers. See BRAND.md section 7.

/** Mark outline on a 32 x 32 grid. Shared with the favicon, OG card and email assets. */
export const LOGO_MARK_PATH =
  "M16 2.5 L28.5 12 L28.5 25 L12.5 25 L6.5 30.5 L7.6 25 L3.5 25 L3.5 12 Z";

/** Copper, the mark's colour (--copper in globals.css; v7, 20 Oct 2026). */
export const LOGO_TILE = "#a9642c";

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={LOGO_MARK_PATH} fill="currentColor" />
    </svg>
  );
}

const SIZES = {
  sm: { mark: "w-[22px] h-[22px]", text: "text-[18px]", gap: "gap-[6px]" },
  md: { mark: "w-[24px] h-[24px] sm:w-[29px] sm:h-[29px]", text: "text-[20px] sm:text-[24px]", gap: "gap-[7px] sm:gap-[9px]" },
  lg: { mark: "w-9 h-9", text: "text-[28px]", gap: "gap-[10px]" },
} as const;

/** Mark + wordmark lockup. `tone="light"` is for forest bands. */
export function Logo({
  tone = "dark",
  size = "md",
  className = "",
}: {
  tone?: "dark" | "light";
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <LogoMark className={`${s.mark} shrink-0 ${tone === "light" ? "text-copper-light" : "text-copper"}`} />
      <span
        className={`font-display font-normal tracking-[-0.02em] leading-none whitespace-nowrap ${s.text} ${
          tone === "light" ? "text-cream" : "text-ink"
        }`}
      >
        Your Property Guide
      </span>
    </span>
  );
}
