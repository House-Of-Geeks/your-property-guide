import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { Book3D } from "@/components/interactive/Book3D";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";

// The premium building blocks (Oct 2026). Since 14 Oct (v5): every page
// opens on a light band with a crisp photo panel (no overlay), then
// generous bands that alternate light, quiet and charcoal, editorial
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
  /** A library photo beside the heading. Without one (or `image`) the hero is a plain white band. */
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
  /** Stand the free guide (or both), as books, on the photo's corner. Each links to its guide. */
  book?: GuideBookId | readonly GuideBookId[];
  /** Where a single book links; defaults to the guide's page. */
  bookHref?: string;
  className?: string;
}

/**
 * The page-opening band (v5, 14 Oct 2026, the light first screen Andy kept):
 * white, the heading and actions on the left, and on the right either the
 * page's form (aside) or a crisp photo in a rounded panel, never under an overlay.
 * On phones a guide or hub ("md") drops the photo so the content starts on
 * the first screen; conversion pages ("lg") keep it below the text.
 */
export function PhotoHero({ photo, image: ownImage, breadcrumbs, children, aside, size = "md", book, bookHref, className = "" }: PhotoHeroProps) {
  const image = ownImage
    ? { src: ownImage.src, position: ownImage.position ?? "object-center", unoptimized: ownImage.unoptimized ?? false }
    : photo
      ? { ...PHOTOS[photo], unoptimized: false }
      : null;
  const top = breadcrumbs
    ? size === "lg" ? "pt-5 sm:pt-8 lg:pt-12" : "pt-4 sm:pt-6 lg:pt-8"
    : size === "lg" ? "pt-10 sm:pt-14 lg:pt-20" : "pt-8 sm:pt-10 lg:pt-14";
  const bottom = size === "lg" ? "pb-12 sm:pb-16 lg:pb-20" : "pb-10 sm:pb-12 lg:pb-16";
  const photoPanel = (cls: string) =>
    image ? (
      <div className={`relative overflow-hidden rounded-2xl bg-surface-warm ${cls}`}>
        <Image src={image.src} alt="" fill preload unoptimized={image.unoptimized} sizes="(min-width: 1024px) 40vw, 100vw" className={`object-cover ${image.position}`} />
      </div>
    ) : null;
  const shape = size === "lg" ? "aspect-[4/3] lg:aspect-[4/5]" : "aspect-[16/10] lg:aspect-[4/3]";
  const panel = !image
    ? null
    : book
      ? (
        <div className={`relative pb-7 sm:pb-9 ${size === "lg" ? "" : "hidden sm:block"}`}>
          {photoPanel(`ml-[12%] ${shape}`)}
          <div className="absolute bottom-0 left-0 flex items-end">
            {(typeof book === "string" ? [book] : book).map((b, i) => (
              <Link key={b} href={(typeof book === "string" && bookHref) || GUIDE_BOOKS[b].href} aria-label={`Free: ${GUIDE_BOOKS[b].title}`} className={`block ${i > 0 ? "-ml-3 translate-y-2" : ""}`}>
                <Book3D guide={b} turn={16} className="[--bw:clamp(96px,24vw,140px)] lg:[--bw:clamp(120px,10.5vw,164px)]" />
              </Link>
            ))}
          </div>
        </div>
      )
      : photoPanel(size === "lg" ? shape : `hidden sm:block ${shape}`);
  const side = aside ?? panel;
  return (
    // Clipped sideways only: a suburb autocomplete in a form near the hero's
    // foot must still drop below it, while nothing may widen the page on phones.
    <section className={`relative isolate overflow-x-clip border-b border-line bg-white ${className}`}>
      <div className={SHELL}>
        {breadcrumbs && (
          <div className="pt-3">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className={`${top} ${bottom}`}>
          {side ? (
            <div className={`grid gap-10 lg:grid-cols-12 lg:gap-14 ${aside ? "items-start" : "items-center"}`}>
              <div className="lg:col-span-7">{children}</div>
              <div className="lg:col-span-5">{side}</div>
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
