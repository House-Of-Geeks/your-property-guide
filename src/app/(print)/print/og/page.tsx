import type { Metadata } from "next";
import Image from "next/image";
import { LogoMark } from "@/components/brand/Logo";
import { CAMPAIGN_PHOTOS } from "@/components/campaign/photos";
import { PROMISE } from "@/lib/service-model";

// The default social card (16 Oct 2026, brand v6): 1200 x 630, typeset from
// the homepage promise over the hero photo. scripts/brand/render-brand-assets.mjs
// screenshots #og to public/og-image.jpg.

export const metadata: Metadata = {
  title: "Social card",
  robots: { index: false, follow: false },
};

export default function OgCardPage() {
  return (
    <section id="og" className="relative flex h-[630px] w-[1200px] overflow-hidden bg-eucalyptus text-white">
      <div className="relative z-10 flex w-[700px] flex-col px-[72px] py-[64px]">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9 text-copper-light" />
          <span className="font-display text-[28px] tracking-[-0.01em]">Your Property Guide</span>
        </div>
        <div className="mt-auto">
          <p className="font-display text-[68px] leading-[1.02] tracking-[-0.02em]">{PROMISE.lead}</p>
          <p className="font-display text-[68px] italic leading-[1.02] tracking-[-0.02em] text-copper-light">{PROMISE.accent}</p>
          <p className="mt-7 text-[24px] font-medium text-white/85">{PROMISE.closing}</p>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 w-[560px]">
        <Image src={CAMPAIGN_PHOTOS.hero.src} alt="" fill sizes="560px" className="object-cover object-[60%_50%]" preload />
        <div className="absolute inset-0 bg-gradient-to-r from-eucalyptus via-eucalyptus/30 to-transparent" />
      </div>
    </section>
  );
}
