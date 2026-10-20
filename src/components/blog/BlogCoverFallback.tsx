import { LogoMark } from "@/components/brand/Logo";

interface Props {
  slug: string;
  title: string;
  category: string;
  className?: string;
}

// Typeset cover (brand v4, Oct 2026). Universal (server/client-safe), no
// filesystem access: flat brand colour, the category, the title and the
// mark. Used wherever a post has no real photograph, which since v4 is
// every post (see src/lib/utils/blog-cover.ts).
const SCHEMES = [
  { bg: "#16191d", fg: "#ffffff", sub: "rgba(255,255,255,0.72)", mark: "#c24a1c" },
  { bg: "#c24a1c", fg: "#ffffff", sub: "rgba(255,255,255,0.82)", mark: "#ffffff" },
  { bg: "#f3f4f5", fg: "#16191d", sub: "#565e68", mark: "#c24a1c" },
] as const;

function pickScheme(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return SCHEMES[Math.abs(h) % SCHEMES.length];
}

export function BlogCoverFallback({ slug, title, category, className }: Props) {
  const c = pickScheme(slug);
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex flex-col justify-between p-5 sm:p-7 overflow-hidden ${className ?? ""}`}
      style={{ background: c.bg, color: c.fg }}
    >
      <div className="relative flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold" style={{ color: c.sub }}>
          {category}
        </span>
        <LogoMark className="w-6 h-6 shrink-0" />
        <style>{`[data-cover="${slug}"] svg { color: ${c.mark}; }`}</style>
      </div>
      <p
        data-cover={slug}
        className="relative font-display font-normal leading-[1.08] tracking-[-0.02em] line-clamp-4"
        style={{ fontSize: "clamp(1.05rem, 2.4vw, 1.75rem)" }}
      >
        {title}
      </p>
    </div>
  );
}
