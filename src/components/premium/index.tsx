import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BookCover } from "@/components/brand/BookCover";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";

// The shared page parts (v7, "Clear decisions", 20 Oct 2026). Every page
// opens on cream with a serif heading and a crisp photograph (never under an
// overlay), then bands separated by fine rules, alternating cream, sand and
// the occasional forest band. Contained panels are used selectively; most
// structure comes from spacing, hierarchy and hairline rules. BRAND.md §5
// and §9 have the rules. Dark surfaces use the .tone-dark scope
// (globals.css), so text-ink and border-line flip to light values inside
// them; wrap a paper card that sits on one in .tone-light.

const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10";

interface LibraryPhoto {
  src: string;
  /** The crop (object-position), per breakpoint where the wide hero needs it. */
  position: string;
  /** Alt text, where the photo carries meaning; without it the photo is decorative. */
  alt?: string;
  /** The corner the guide covers stand on in a wide hero, when the default (right) would hide the subject. */
  bookSide?: "left" | "right";
}

/** The photo library (public/images), with the crop each one needs as a hero. */
export const PHOTOS = {
  // The "Clear decisions" brand photographs (illustrative; never a real property or sale).
  apartment: { src: "/images/brand/apartment-light.jpg",  position: "object-[50%_52%]" },
  door:      { src: "/images/brand/terracotta-door.jpg",  position: "object-[50%_40%]" },
  // The next-pass brand photographs (20 Oct 2026; originals in docs/brand/clear-decisions/).
  // Illustrative, never captioned as a real property. Crops checked at 390,
  // 768 and 1280 wide in the wide hero (220/320/380px tall): the kitchen keeps
  // the table and the open balcony door, the cottage its door and veranda.
  // The covers stand on the left, over the kitchen bench and the garden bed,
  // so neither subject is hidden. x only matters in a narrower panel (the
  // square beside a hub's briefing): the kitchen keeps door and table at
  // 50%, the cottage its door and veranda at 62%.
  kitchenLight: {
    src: "/images/brand/buying-kitchen-light.jpg",
    position: "object-[50%_60%] lg:object-[50%_58%]",
    alt: "Illustrative sunlit Australian apartment kitchen and dining area opening onto a leafy balcony.",
    bookSide: "left",
  },
  cottage: {
    src: "/images/brand/selling-cottage-garden.jpg",
    position: "object-[62%_40%] sm:object-[62%_38%] lg:object-[62%_36%]",
    alt: "Illustrative Australian weatherboard cottage with a terracotta door and an established native garden.",
    bookSide: "left",
  },
  // A quiet detail for supporting sections, not a hero.
  windowDetail: {
    src: "/images/brand/window-detail.jpg",
    position: "object-[42%_50%]",
    alt: "Illustrative sunlit window with sage timber frames, linen and a terracotta vase holding eucalyptus.",
  },
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
} as const satisfies Record<string, LibraryPhoto>;

export type PhotoKey = keyof typeof PHOTOS;

interface Crumb {
  label: string;
  href?: string;
}

interface PhotoHeroProps {
  /** A library photo. Without one (or `image`) the hero is a plain cream band. */
  photo?: PhotoKey;
  /**
   * A page's own photo instead of a library one, e.g. a post's cover. Blog
   * covers pass `unoptimized`: they skip the image optimiser to keep Vercel
   * transformation costs down (fe8c602).
   */
  image?: { src: string; position?: string; unoptimized?: boolean };
  breadcrumbs?: Crumb[];
  /** The main column: an Eyebrow, HeroTitle, HeroLead, actions, a byline. */
  children: ReactNode;
  /** An optional right column, e.g. a form. Wrap a paper card in .tone-light. */
  aside?: ReactNode;
  /**
   * "lg" (the homepage's composition, for hubs and conversion pages): the
   * text, then a wide photograph across the page. "md" (guides, tools,
   * reference pages): the text beside a portrait photograph.
   */
  size?: "lg" | "md";
  /** Stand the free guide (or both), as covers, on the photograph's corner. Each links to its guide. */
  book?: GuideBookId | readonly GuideBookId[];
  /** Where a single book links; defaults to the guide's page. */
  bookHref?: string;
  /** A short line under a wide photograph (left), and an optional note (right). */
  caption?: ReactNode;
  captionNote?: ReactNode;
  className?: string;
}

/**
 * The page-opening band (v7). Cream, the serif heading and actions first,
 * and a crisp photograph that's never under an overlay. On phones a guide or
 * tool ("md") drops the photo so the content starts on the first screen;
 * hubs and conversion pages ("lg") keep a shorter crop below the text.
 */
export function PhotoHero({ photo, image: ownImage, breadcrumbs, children, aside, size = "md", book, bookHref, caption, captionNote, className = "" }: PhotoHeroProps) {
  const library: LibraryPhoto | null = photo ? PHOTOS[photo] : null;
  const image = ownImage
    ? { src: ownImage.src, position: ownImage.position ?? "object-center", unoptimized: ownImage.unoptimized ?? false, alt: "", bookSide: "right" as const }
    : library
      ? { ...library, unoptimized: false, alt: library.alt ?? "", bookSide: library.bookSide ?? "right" }
      : null;
  const top = breadcrumbs
    ? size === "lg" ? "pt-6 sm:pt-9 lg:pt-11" : "pt-5 sm:pt-7 lg:pt-9"
    : size === "lg" ? "pt-9 sm:pt-12 lg:pt-14" : "pt-8 sm:pt-10 lg:pt-12";
  const bottom = size === "lg" ? "pb-10 sm:pb-12 lg:pb-14" : "pb-10 sm:pb-12 lg:pb-14";
  const books = book ? (typeof book === "string" ? [book] : book) : [];
  const bookStand = books.length > 0 && (
    <div className={`pointer-events-none absolute bottom-0 flex translate-y-[18%] items-end ${image?.bookSide === "left" ? "left-4 sm:left-8 lg:left-10" : "right-4 sm:right-8 lg:right-10"}`}>
      {books.map((b, i) => (
        <Link
          key={b}
          href={(typeof book === "string" && bookHref) || GUIDE_BOOKS[b].href}
          aria-label={`Free guide: ${GUIDE_BOOKS[b].title}`}
          className={`pointer-events-auto block ${i > 0 ? "-ml-6 translate-y-3" : ""}`}
        >
          <BookCover guide={b} tilt={i === 0 ? -4 : 4} className="w-[104px] sm:w-[132px] lg:w-[158px]" />
        </Link>
      ))}
    </div>
  );

  let body: ReactNode;
  if (aside) {
    body = (
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">{children}</div>
        <div className="lg:col-span-5">{aside}</div>
      </div>
    );
  } else if (image && size === "lg") {
    body = (
      <>
        <div className="max-w-4xl">{children}</div>
        <figure className={`mt-9 sm:mt-11 ${books.length ? "mb-10 sm:mb-12" : ""}`}>
          <div className="relative h-[220px] overflow-visible sm:h-[320px] lg:h-[380px]">
            <div className="absolute inset-0 overflow-hidden bg-surface-warm">
              {/* The page's one above-the-fold image, so the only preload. sizes
                  follows the shell: full width less its padding, 1200px at most. */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                unoptimized={image.unoptimized}
                sizes="(min-width: 1280px) 1200px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                className={`object-cover ${image.position}`}
              />
            </div>
            {bookStand}
          </div>
          {(caption || captionNote) && (
            <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-[12px] text-ink-muted">
              <span className="text-primary">{caption}</span>
              {captionNote && <span>{captionNote}</span>}
            </figcaption>
          )}
        </figure>
      </>
    );
  } else if (image) {
    body = (
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">{children}</div>
        <div className="hidden sm:block lg:col-span-5">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface-warm lg:aspect-[5/6]">
            <Image src={image.src} alt={image.alt} fill preload unoptimized={image.unoptimized} sizes="(min-width: 1024px) 40vw, 100vw" className={`object-cover ${image.position}`} />
          </div>
        </div>
      </div>
    );
  } else {
    body = <div className="max-w-3xl">{children}</div>;
  }

  return (
    // Clipped sideways only: a suburb autocomplete in a form near the hero's
    // foot must still drop below it, while nothing may widen the page on phones.
    <section className={`relative isolate overflow-x-clip border-b border-line bg-background ${className}`}>
      <div className={SHELL}>
        {breadcrumbs && (
          <div className="pt-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className={`${top} ${bottom}`}>{body}</div>
      </div>
    </section>
  );
}

/** The small copper label above a heading ("Australian property, explained."). */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[12px] font-medium uppercase tracking-[0.1em] text-primary ${className}`}>{children}</p>;
}

/** The hero's H1 in the serif. "lg" is the homepage size (64px at desktop); "md" suits guides, hubs and tools. */
export function HeroTitle({ children, size = "md" }: { children: ReactNode; size?: "lg" | "md" }) {
  const cls =
    size === "lg"
      ? "text-[44px] leading-[1.04] sm:text-[56px] lg:text-[64px] tracking-[-0.045em]"
      : "text-[38px] leading-[1.06] sm:text-[46px] lg:text-[54px] tracking-[-0.04em]";
  return <h1 className={`${cls} text-ink max-w-3xl`}>{children}</h1>;
}

/** The standfirst under the hero's H1. Other attributes (data-speakable-summary) pass through; a max-w- class replaces the default width. */
export function HeroLead({ children, className = "", ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const width = /(^|\s)max-w-/.test(className) ? "" : "max-w-2xl";
  return (
    <p {...rest} className={`mt-5 text-[16px] sm:text-[18px] text-ink-muted leading-[1.7] ${width} ${className}`}>
      {children}
    </p>
  );
}

interface BandProps {
  /** light: the cream page; quiet: the sand band; dark: forest, with the tone flipped. */
  tone?: "light" | "quiet" | "dark";
  /** compact for dense reference pages; default is the homepage's spacing. */
  spacing?: "default" | "compact";
  id?: string;
  className?: string;
  children: ReactNode;
}

/** A full-width section, separated from the next by a fine rule. */
export function Band({ tone = "light", spacing = "default", id, className = "", children }: BandProps) {
  const bg =
    tone === "dark" ? "tone-dark bg-surface-inverse" : tone === "quiet" ? "bg-surface-warm border-b border-line" : "border-b border-line";
  const pad = spacing === "compact" ? "py-12 sm:py-16" : "py-14 sm:py-20";
  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className={`${SHELL} ${pad}`}>{children}</div>
    </section>
  );
}

/**
 * An editorial section heading (the approved homepage's section head): an
 * optional kicker in the left margin, the serif H2, and an intro to the
 * right. Stacked on phones.
 */
export function SectionHeading({ title, intro, kicker, size = "lg" }: { title: ReactNode; intro?: ReactNode; kicker?: ReactNode; size?: "lg" | "md" }) {
  const h2 =
    size === "lg"
      ? "text-[34px] sm:text-[40px] lg:text-[42px] leading-[1.08] tracking-[-0.04em]"
      : "text-[30px] sm:text-[34px] leading-[1.1] tracking-[-0.035em]";
  if (!intro && !kicker) return <h2 className={`${h2} text-ink max-w-3xl`}>{title}</h2>;
  if (kicker) {
    return (
      <div className="grid gap-x-8 gap-y-4 lg:grid-cols-[0.38fr_1fr_0.82fr]">
        <Kicker className="lg:pt-3">{kicker}</Kicker>
        <h2 className={`${h2} max-w-[30rem] text-ink`}>{title}</h2>
        {intro ? <p className="text-[15px] leading-[1.7] text-ink-muted lg:pt-2">{intro}</p> : <span aria-hidden="true" />}
      </div>
    );
  }
  return (
    <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-14">
      <h2 className={`lg:col-span-7 ${h2} text-ink`}>{title}</h2>
      <p className="lg:col-span-5 text-[16px] leading-[1.7] text-ink-muted lg:pt-2">{intro}</p>
    </div>
  );
}

/** Columns, each under a fine rule. */
export function RuleGrid({ columns = 4, className = "mt-12 sm:mt-14", children }: { columns?: 2 | 3 | 4; className?: string; children: ReactNode }) {
  const cols = columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return <ul className={`grid gap-x-10 gap-y-10 ${cols} ${className}`}>{children}</ul>;
}

/**
 * One column of a RuleGrid. `icon` is accepted for older call sites but no
 * longer drawn: v7 avoids decorative icons.
 */
export function RuleItem({
  title,
  children,
}: {
  icon?: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean | "true" }>;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="border-t border-line-strong pt-5">
      <h3 className="text-[18px] font-medium leading-snug text-ink">{title}</h3>
      {children && <div className="mt-2 text-[15px] text-ink-muted leading-[1.7]">{children}</div>}
    </li>
  );
}

/** Numbered steps joined by a fine rule: a real sequence, not decoration. */
export function StepTimeline({ steps, className = "mt-10" }: { steps: readonly { title: ReactNode; body: ReactNode }[]; className?: string }) {
  return (
    <ol className={`border-t border-line ${className}`}>
      {steps.map((s, i) => (
        <li key={i} className="grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-line py-6 sm:grid-cols-[3rem_1fr]">
          <span className="font-display text-[26px] leading-none text-primary" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3 className="text-[18px] font-medium leading-snug text-ink">
              <span className="sr-only">{`Step ${i + 1}: `}</span>
              {s.title}
            </h3>
            <div className="mt-2 text-[15px] text-ink-muted leading-[1.7] max-w-xl">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A library photo in a crisp panel, for split sections. */
export function PhotoPanel({ photo, alt, className = "aspect-[4/3] lg:aspect-[4/5]", sizes = "(min-width: 1024px) 40vw, 100vw" }: { photo: PhotoKey; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden bg-surface-warm ${className}`}>
      <Image src={PHOTOS[photo].src} alt={alt} fill sizes={sizes} className={`object-cover ${PHOTOS[photo].position}`} />
    </div>
  );
}

/**
 * A short list of first reads under fine rules (v7: the approved design
 * avoids repeated card grids). Each row: a serif title, a line on what it
 * covers, and an arrow.
 */
export function LinkRows({ items, columns = 3, className = "mt-6" }: { items: readonly { label: ReactNode; href: string; note?: ReactNode }[]; columns?: 2 | 3; className?: string }) {
  return (
    <ul className={`grid border-t border-line md:gap-x-10 ${columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} ${className}`}>
      {items.map((it) => (
        <li key={it.href} className="border-b border-line">
          <Link href={it.href} className="group flex h-full items-start justify-between gap-4 py-5">
            <span className="min-w-0">
              <span className="block font-display text-[22px] leading-snug tracking-[-0.025em] text-ink group-hover:text-primary">{it.label}</span>
              {it.note && <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-muted">{it.note}</span>}
            </span>
            <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Plain class strings, in their own module so client components can import them alone.
export { BUTTON_PRIMARY, BUTTON_SECONDARY, TEXT_LINK } from "./buttons";
