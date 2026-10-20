import Image from "next/image";
import type { CSSProperties } from "react";
import { LogoMark } from "./Logo";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";

// The free guides' covers (v7, "Clear decisions", 20 Oct 2026): a matched
// collection. Buying a home is the forest-green edition (01), Selling a home
// the terracotta one (02). Each has the house-bubble mark and wordmark, a
// two-line serif title, a two-line subtitle, a photographic panel and a
// footer with the edition number, on a spine.
//
// This is the ONE cover source. The homepage, the guide landing pages, the
// 3D book, the article and suburb calls to action, the printable guide
// (src/app/(print)/print/guides) and, through scripts/guides/render-pdfs.mjs,
// the PDF covers, the cover PNG and the email JPEG all render it. Every size
// inside is in container units (globals.css, .ypg-cover), so it's the same
// design from a 90px thumbnail to an A4 page.
//
// The photographs are illustrative brand imagery, never a real property.

export type CoverShape = "book" | "a4";

interface BookCoverProps {
  guide: GuideBookId;
  /** "book" (1 : 1.62, the approved design's proportion) for displays; "a4" for print, the cover images and email. */
  shape?: CoverShape;
  /** Tilt in degrees for a display (the approved design uses -4 for buying and 4 for selling). 0 sits flat. */
  tilt?: number;
  /** Draw the spine and edge (on by default). Off for a full-bleed print cover. */
  spine?: boolean;
  /** Width classes, e.g. "w-[246px]". The cover scales everything inside to its width. */
  className?: string;
  /** The photo's rendered width, for next/image. */
  sizes?: string;
  /** Load the photo eagerly (an above-the-fold cover, or a print). */
  eager?: boolean;
  /**
   * Serve the original JPEG (the printable guide): Chrome passes a JPEG
   * straight into the PDF, but re-encodes an optimised WebP or AVIF
   * losslessly, which tripled the PDFs.
   */
  unoptimized?: boolean;
  /** A label for the cover as an image. Leave out where a nearby link already names the guide. */
  label?: string;
  style?: CSSProperties;
}

export function BookCover({ guide, shape = "book", tilt = 0, spine = true, className = "", sizes = "260px", eager = false, unoptimized = false, label, style }: BookCoverProps) {
  const book = GUIDE_BOOKS[guide];
  const [first, ...rest] = book.name.split(" ");
  const transform = tilt ? `perspective(900px) rotateY(${tilt * 2}deg) rotate(${tilt}deg)` : undefined;
  return (
    <div
      className={`ypg-cover ${className}`}
      data-shape={shape}
      data-spine={spine ? "" : undefined}
      data-tilted={tilt ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ "--cover": book.colour, "--cover-ink": book.ink, "--cover-spine": book.spine, transform, ...style } as CSSProperties}
    >
      <div className="ypg-cover__face">
        <div className="ypg-cover__top">
          <span className="ypg-cover__brand">
            <LogoMark className={`ypg-cover__mark ${guide === "selling" ? "text-copper-light" : "text-copper"}`} />
            Your Property Guide
          </span>
          <span className="ypg-cover__title">
            {first}
            <br />
            {`${rest.join(" ")}.`}
          </span>
          <span className="ypg-cover__subtitle">
            {book.subtitle[0]}
            <br />
            {book.subtitle[1]}
          </span>
        </div>
        <div className="ypg-cover__photo">
          <Image
            src={book.photo.src}
            alt=""
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            unoptimized={unoptimized}
            className="object-cover"
            style={{ objectPosition: book.photo.position }}
          />
        </div>
        <div className="ypg-cover__foot">
          <span>A clearer way forward.</span>
          <span>{book.edition}</span>
        </div>
      </div>
    </div>
  );
}
