import type { Metadata } from "next";
import Image from "next/image";
import { BookCover } from "@/components/brand/BookCover";
import { LogoMark } from "@/components/brand/Logo";
import { GUIDE_BOOKS } from "@/lib/guide-books";
import { PROMISE } from "@/lib/service-model";

// The static social cards (v7, "Clear decisions", 20 Oct 2026), 1200 x 630,
// typeset from the same sources as the site. scripts/brand/render-brand-assets.mjs
// screenshots #og to:
//   /print/og                  public/og-image.jpg (the site's default card)
//   /print/og?card=buying      public/images/guide/buying-guide-og.jpg
//   /print/og?card=selling     public/images/guide/selling-guide-og.jpg
// The photograph is illustrative brand imagery, never a real property.

export const metadata: Metadata = {
  title: "Social card",
  robots: { index: false, follow: false },
};

function Brand() {
  return (
    <div className="flex items-center gap-3 text-ink">
      <LogoMark className="h-9 w-9 text-copper" />
      <span className="font-display text-[30px] tracking-[-0.02em]">Your Property Guide</span>
    </div>
  );
}

export default async function OgCardPage({ searchParams }: { searchParams: Promise<{ card?: string }> }) {
  const { card } = await searchParams;
  if (card === "buying" || card === "selling") {
    const book = GUIDE_BOOKS[card];
    const [first, ...rest] = book.name.split(" ");
    return (
      <section id="og" className="relative flex h-[630px] w-[1200px] overflow-hidden bg-background text-ink">
        <div className="flex w-[660px] flex-col px-[72px] py-[60px]">
          <Brand />
          <div className="mt-auto">
            <p className="text-[18px] font-medium uppercase tracking-[0.12em] text-primary">Free guide · 2026 edition</p>
            <p className="mt-5 font-display text-[88px] leading-[0.98] tracking-[-0.045em]">
              {first}
              <br />
              {`${rest.join(" ")}.`}
            </p>
            <p className="mt-7 text-[26px] leading-[1.4] text-ink-muted">
              {book.subtitle[0]}
              <br />
              {book.subtitle[1]}
            </p>
          </div>
        </div>
        <div className={`flex flex-1 items-center justify-center ${card === "buying" ? "bg-stage-buy" : "bg-stage-sell"}`}>
          <BookCover guide={card} tilt={card === "buying" ? -4 : 4} eager unoptimized className="w-[300px]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[12px]" style={{ backgroundColor: book.colour }} />
      </section>
    );
  }
  return (
    <section id="og" className="relative flex h-[630px] w-[1200px] overflow-hidden bg-background text-ink">
      <div className="flex w-[700px] flex-col px-[72px] py-[60px]">
        <Brand />
        <div className="mt-auto">
          <p className="text-[18px] font-medium uppercase tracking-[0.12em] text-primary">{PROMISE.eyebrow}</p>
          <p className="mt-5 font-display text-[74px] leading-[1.03] tracking-[-0.045em]">
            {PROMISE.lead} <em className="font-normal italic text-primary">{PROMISE.accent}</em> {PROMISE.tail}
          </p>
        </div>
      </div>
      <div className="relative flex-1">
        <Image src="/images/brand/apartment-light.jpg" alt="" fill preload unoptimized sizes="500px" className="object-cover object-[46%_50%]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[12px] bg-forest" />
    </section>
  );
}
