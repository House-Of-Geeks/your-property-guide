import { LogoMark } from "./Logo";
import { GUIDE_BOOKS } from "@/lib/guide-books";

// The guide as an object: a flat, typeset book cover in brand colours (v6,
// 15 Oct 2026): selling is eucalyptus, buying is copper, titles in the serif.
// Pure markup, so it stays sharp at any size and needs no artwork. The PDF
// covers and the cover PNGs are printed from the same design
// (src/app/(print)/print/guides).
export function GuideCover({
  guide = "selling",
  className = "",
}: {
  guide?: "selling" | "buying";
  className?: string;
}) {
  const book = GUIDE_BOOKS[guide];
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-md text-white shadow-[0_18px_40px_-12px_rgb(20_32_27/0.35)] ${className}`}
      style={{ backgroundColor: book.colour }}
      role="img"
      aria-label={`Cover of ${book.title}, 2026 edition`}
    >
      {/* Spine shadow */}
      <div className="absolute inset-y-0 left-0 w-3 bg-black/15" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col p-[9%] pl-[13%]">
        <div className="flex items-center gap-1.5">
          <LogoMark className={`h-[1.1em] w-[1.1em] ${guide === "selling" ? "text-copper-light" : "text-white"}`} />
          <span className="font-display text-[0.62em] tracking-[-0.01em]">Your Property Guide</span>
        </div>
        <p className="mt-auto font-display text-[1.5em] leading-[1.04] tracking-[-0.02em]">{book.name}</p>
        <p className="mt-2 text-[0.6em] font-medium leading-snug text-white/80">{book.subtitle}</p>
        <div className="mt-[14%] flex items-center justify-between text-[0.5em] font-semibold text-white/80">
          <span>2026 edition</span>
          <span>Free</span>
        </div>
      </div>
    </div>
  );
}
