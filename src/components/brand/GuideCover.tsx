import { LogoMark } from "./Logo";

// The guide as an object: a flat, typeset book cover in brand colours.
// Selling is roof tile, buying is charcoal. Pure markup, so it stays sharp
// at any size and needs no artwork.
export function GuideCover({
  guide = "selling",
  className = "",
}: {
  guide?: "selling" | "buying";
  className?: string;
}) {
  const selling = guide === "selling";
  return (
    <div
      className={`relative aspect-[3/4] w-full rounded-md overflow-hidden shadow-[0_18px_40px_-12px_rgb(22_25_29/0.35)] ${
        selling ? "bg-cta" : "bg-surface-inverse"
      } text-white ${className}`}
      role="img"
      aria-label={`Cover of The complete guide to ${selling ? "selling your home" : "buying property"} in Australia, 2026 edition`}
    >
      {/* Spine shadow */}
      <div className="absolute inset-y-0 left-0 w-3 bg-black/15" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col p-[9%] pl-[13%]">
        <div className="flex items-center gap-1.5">
          <LogoMark className="w-[1.1em] h-[1.1em] text-white" />
          <span className="text-[0.62em] font-semibold tracking-[-0.01em]">Your Property Guide</span>
        </div>
        <p className="mt-auto text-[0.62em] font-medium text-white/80">The complete guide to</p>
        <p className="mt-1 text-[1.55em] font-bold leading-[1.02] tracking-[-0.03em]">
          {selling ? "Selling your home" : "Buying property"}
        </p>
        <p className="mt-1 text-[0.62em] font-medium text-white/80">in Australia</p>
        <div className="mt-[14%] flex items-center justify-between text-[0.5em] font-semibold text-white/80">
          <span>2026 edition</span>
          <span>Free</span>
        </div>
      </div>
    </div>
  );
}
