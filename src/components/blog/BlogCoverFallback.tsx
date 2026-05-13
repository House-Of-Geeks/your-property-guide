interface Props {
  slug: string;
  title: string;
  category: string;
  className?: string;
}

// Universal (server/client-safe) fallback cover. No filesystem access, just
// deterministic CSS-rendered cover art derived from slug + title + category.
//
// Used by BlogCover (server) when no real image file is present, and by
// client components like BlogGrid when the parent has already resolved
// coverImage to null.
const PALETTE = [
  { base: "oklch(0.42 0.13 40)",  accent: "oklch(0.58 0.14 42)" },
  { base: "oklch(0.36 0.13 38)",  accent: "oklch(0.46 0.14 40)" },
  { base: "oklch(0.46 0.14 40)",  accent: "oklch(0.74 0.10 45)" },
  { base: "oklch(0.38 0.10 35)",  accent: "oklch(0.58 0.14 42)" },
] as const;

function pickPalette(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function BlogCoverFallback({ slug, title, category, className }: Props) {
  const { base, accent } = pickPalette(slug);
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex flex-col justify-between p-5 sm:p-7 overflow-hidden ${className ?? ""}`}
      style={{ background: `linear-gradient(135deg, ${base} 0%, ${accent} 100%)` }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -bottom-16 w-[140%] h-[140%] opacity-[0.10] pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.8) 0%, transparent 55%)" }}
      />
      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-white">
          {category}
        </span>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/15 text-white font-display font-semibold text-sm">
          Y
        </span>
      </div>
      <div className="relative">
        <h4
          className="font-display text-white leading-[1.1] tracking-tight line-clamp-4"
          style={{ fontSize: "clamp(1.05rem, 2.4vw, 1.75rem)" }}
        >
          {title}
        </h4>
        <p className="font-sans text-white/70 text-[11px] sm:text-xs tracking-[0.18em] uppercase mt-3">
          yourpropertyguide.com.au
        </p>
      </div>
    </div>
  );
}
