import Image from "next/image";

interface Props {
  name: string;
  image?: string;
  size?: number;
  className?: string;
}

// A stable per-name colour pulled from the brand palette. Different team
// members get visually distinct circles while staying on-palette.
function paletteFor(name: string): { bg: string; fg: string } {
  const palette = [
    { bg: "var(--primary)",       fg: "var(--surface-warm)" },
    { bg: "var(--primary-dark)",  fg: "var(--surface-warm)" },
    { bg: "var(--accent-light)",  fg: "var(--ink)" },
    { bg: "var(--primary-light)", fg: "var(--surface-warm)" },
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Show the headshot if it exists, otherwise fall back to a branded initials
// disc. We treat the "/images/agents/<name>.jpg" placeholders as not-yet-real
//, image presence is signalled by an explicit non-default path. Since all
// current bylines point at agent JPGs that may not exist, the simplest rule
// is to always render initials until a deliberate image override is added.
const USE_IMAGE_BYDEFAULT = false;

export function AuthorAvatar({ name, image, size = 40, className = "" }: Props) {
  const { bg, fg } = paletteFor(name);
  const initials = initialsFor(name);
  const fontSize = Math.round(size * 0.4);

  if (USE_IMAGE_BYDEFAULT && image) {
    return (
      <div
        className={`relative rounded-full overflow-hidden flex-shrink-0 border border-line-warm ${className}`}
        style={{ width: size, height: size }}
      >
        <Image src={image} alt={name} fill className="object-cover" sizes={`${size}px`} />
      </div>
    );
  }

  return (
    <div
      aria-label={name}
      className={`rounded-full flex-shrink-0 border border-line-warm flex items-center justify-center font-display font-semibold tracking-wide select-none ${className}`}
      style={{ width: size, height: size, background: bg, color: fg, fontSize }}
    >
      {initials}
    </div>
  );
}
