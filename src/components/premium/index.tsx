import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";

// The premium building blocks (Oct 2026), taken from the homepage so every
// page shares one look: a full-bleed photo hero under a flat charcoal
// overlay, generous bands that alternate light, quiet and charcoal, editorial
// headings, grids with a heavy top rule, and a connected step timeline.
// BRAND.md section 11 has the rules. Dark surfaces use the .tone-dark scope
// (globals.css), so text-ink and border-line flip to light values inside them;
// wrap a white card that sits on one in .tone-light.

const SHELL = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/** The photo library (public/images/photos), with the crop each one needs as a hero. */
export const PHOTOS = {
  selling:   { src: "/images/photos/selling-house.jpg",     position: "object-[50%_45%]" },
  street:    { src: "/images/photos/home-street.jpg",       position: "object-[50%_60%]" },
  buying:    { src: "/images/photos/open-home.jpg",         position: "object-center" },
  firstHome: { src: "/images/photos/first-home.jpg",        position: "object-center" },
  investing: { src: "/images/photos/townhouses.jpg",        position: "object-center" },
  flats:     { src: "/images/photos/flats.jpg",             position: "object-center" },
  renovating:{ src: "/images/photos/renovation.jpg",        position: "object-center" },
  market:    { src: "/images/photos/brisbane-view.jpg",     position: "object-[50%_55%]" },
  auction:   { src: "/images/photos/auction.jpg",           position: "object-[50%_40%]" },
  paperwork: { src: "/images/photos/paperwork.jpg",         position: "object-center" },
  verandah:  { src: "/images/photos/verandah-couple.jpg",   position: "object-center" },
  kitchen:   { src: "/images/photos/appraisal-kitchen.jpg", position: "object-center" },
} as const;

export type PhotoKey = keyof typeof PHOTOS;

interface Crumb {
  label: string;
  href?: string;
}

interface PhotoHeroProps {
  /** A library photo behind the hero. Without one (or `image`) the hero is a plain charcoal band. */
  photo?: PhotoKey;
  /**
   * A page's own photo instead of a library one, e.g. a post's cover. Blog
   * covers pass `unoptimized`: they skip the image optimiser to keep Vercel
   * transformation costs down (fe8c602).
   */
  image?: { src: string; position?: string; unoptimized?: boolean };
  breadcrumbs?: Crumb[];
  /** The main column: HeroTitle, HeroLead, points, a byline. */
  children: ReactNode;
  /** An optional right column, e.g. a form. Wrap a white card in .tone-light. */
  aside?: ReactNode;
  /** "lg" for the homepage and conversion pages, "md" for guides, hubs and tools. */
  size?: "lg" | "md";
  className?: string;
}

/**
 * The page-opening band. The overlay is flat (no gradient) and is only there
 * so white type reads on the photo; the photo is decorative, so its alt is
 * empty and it is preloaded as the page's largest image.
 */
export function PhotoHero({ photo, image: ownImage, breadcrumbs, children, aside, size = "md", className = "" }: PhotoHeroProps) {
  const image = ownImage
    ? { src: ownImage.src, position: ownImage.position ?? "object-center", unoptimized: ownImage.unoptimized ?? false }
    : photo
      ? { ...PHOTOS[photo], unoptimized: false }
      : null;
  // Less room on top when breadcrumbs already sit above the heading.
  const top = breadcrumbs
    ? size === "lg" ? "pt-6 sm:pt-10 lg:pt-16" : "pt-4 sm:pt-6 lg:pt-8"
    : size === "lg" ? "pt-12 sm:pt-16 lg:pt-24" : "pt-8 sm:pt-10 lg:pt-14";
  const bottom = size === "lg" ? "pb-16 sm:pb-24 lg:pb-32" : "pb-12 sm:pb-16 lg:pb-20";
  return (
    // Clipped sideways only: a suburb autocomplete in a form near the hero's
    // foot must still drop below it (overflow-hidden clipped it), while a
    // decorative card leaning past the edge must not widen the page on phones.
    <section className={`tone-dark relative isolate overflow-x-clip bg-surface-inverse ${className}`}>
      {image && (
        <>
          <Image src={image.src} alt="" fill preload unoptimized={image.unoptimized} sizes="100vw" className={`-z-20 object-cover ${image.position}`} />
          <div className="absolute inset-0 -z-10 bg-surface-inverse/70" aria-hidden="true" />
        </>
      )}
      <div className={SHELL}>
        {breadcrumbs && (
          <div className="pt-3">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className={`${top} ${bottom}`}>
          {aside ? (
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7">{children}</div>
              <div className="lg:col-span-5">{aside}</div>
            </div>
          ) : (
            <div className="max-w-3xl">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}

/** The hero's H1. "lg" is the homepage size (76px at desktop); "md" suits guides, hubs and tools. */
export function HeroTitle({ children, size = "md" }: { children: ReactNode; size?: "lg" | "md" }) {
  const cls =
    size === "lg"
      ? "text-[42px] leading-[1.02] sm:text-6xl lg:text-[76px] tracking-[-0.04em]"
      : "text-[34px] leading-[1.06] sm:text-5xl lg:text-[60px] tracking-[-0.035em]";
  return <h1 className={`${cls} font-bold text-ink max-w-3xl`}>{children}</h1>;
}

/** The standfirst under the hero's H1. Other attributes (data-speakable-summary) pass through; a max-w- class replaces the default width. */
export function HeroLead({ children, className = "", ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const width = /(^|\s)max-w-/.test(className) ? "" : "max-w-2xl";
  return (
    <p {...rest} className={`mt-6 text-lg sm:text-xl text-ink-muted leading-relaxed ${width} ${className}`}>
      {children}
    </p>
  );
}

interface BandProps {
  /** light: white page; quiet: the grey band; dark: charcoal, with the tone flipped. */
  tone?: "light" | "quiet" | "dark";
  /** compact for dense reference pages; default is the homepage's spacing. */
  spacing?: "default" | "compact";
  id?: string;
  className?: string;
  children: ReactNode;
}

/** A full-width section with the premium spacing. */
export function Band({ tone = "light", spacing = "default", id, className = "", children }: BandProps) {
  const bg =
    tone === "dark" ? "tone-dark bg-surface-inverse" : tone === "quiet" ? "bg-surface-warm border-b border-line" : "border-b border-line";
  const pad = spacing === "compact" ? "py-14 sm:py-20" : "py-20 sm:py-28";
  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className={`${SHELL} ${pad}`}>{children}</div>
    </section>
  );
}

/** An editorial section heading: the H2 left, an optional intro right (stacked on phones). */
export function SectionHeading({ title, intro, size = "lg" }: { title: ReactNode; intro?: ReactNode; size?: "lg" | "md" }) {
  const h2 =
    size === "lg"
      ? "text-4xl sm:text-5xl leading-[1.05] tracking-[-0.03em]"
      : "text-3xl sm:text-4xl leading-[1.1] tracking-[-0.025em]";
  if (!intro) return <h2 className={`${h2} text-ink max-w-3xl`}>{title}</h2>;
  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-end">
      <h2 className={`lg:col-span-7 ${h2} text-ink`}>{title}</h2>
      <p className="lg:col-span-5 text-lg text-ink-muted leading-relaxed">{intro}</p>
    </div>
  );
}

/** Columns under a heavy top rule: the homepage's "four checks". */
export function RuleGrid({ columns = 4, className = "mt-14 sm:mt-16", children }: { columns?: 2 | 3 | 4; className?: string; children: ReactNode }) {
  const cols = columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return <ul className={`grid gap-x-10 gap-y-12 ${cols} ${className}`}>{children}</ul>;
}

export function RuleItem({
  icon: Icon,
  title,
  children,
}: {
  icon?: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean | "true" }>;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="border-t-2 border-ink pt-6">
      {Icon && <Icon className="w-7 h-7 text-primary mb-5" strokeWidth={1.75} aria-hidden="true" />}
      <h3 className="text-xl text-ink">{title}</h3>
      {children && <div className="mt-2 text-base text-ink-muted leading-relaxed">{children}</div>}
    </li>
  );
}

/** Numbered steps joined by a line: a real sequence, not decoration. */
export function StepTimeline({ steps, className = "mt-12" }: { steps: readonly { title: ReactNode; body: ReactNode }[]; className?: string }) {
  return (
    <ol className={className}>
      {steps.map((s, i) => (
        <li key={i} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-10 last:pb-0">
          {i < steps.length - 1 && <span className="absolute left-5 top-10 bottom-0 w-px bg-line-strong" aria-hidden="true" />}
          <span className="relative inline-flex w-10 h-10 items-center justify-center rounded-full bg-ink text-ink-inverse text-base font-bold">
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="text-xl text-ink">{s.title}</h3>
            <div className="mt-2 text-base text-ink-muted leading-relaxed max-w-lg">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A library photo in a rounded panel, for split sections. */
export function PhotoPanel({ photo, alt, className = "aspect-[4/3] lg:aspect-[4/5]", sizes = "(min-width: 1024px) 40vw, 100vw" }: { photo: PhotoKey; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <Image src={PHOTOS[photo].src} alt={alt} fill sizes={sizes} className={`object-cover ${PHOTOS[photo].position}`} />
    </div>
  );
}

// Plain class strings, in their own module so client components can import them alone.
export { BUTTON_PRIMARY, BUTTON_SECONDARY } from "./buttons";
