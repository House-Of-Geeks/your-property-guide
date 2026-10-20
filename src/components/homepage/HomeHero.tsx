import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { PROMISE } from "@/lib/service-model";
import { PLAN_CTA_SHORT } from "@/lib/plans/name";
import { BUTTON_PRIMARY, TEXT_LINK } from "@/components/premium/buttons";
import { SHELL } from "./shell";

// The homepage's opening (20 Oct 2026, "Clear decisions", Andy's approved
// design): the kicker and the serif headline on the left, the supporting
// line and two actions on the right, then a large photograph across the
// page. The photograph is illustrative brand imagery, never a real property.

export function HomeHero() {
  return (
    <section id="opening" aria-labelledby="home-title" className={`${SHELL} pt-8 pb-8 sm:pt-11 sm:pb-9`}>
      <div className="grid items-end gap-5 sm:gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
        <div>
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.075em] text-primary sm:mb-5 sm:tracking-[0.1em]">{PROMISE.eyebrow}</p>
          <h1 id="home-title" className="max-w-[600px] text-[44px] leading-[1.04] tracking-[-0.045em] text-ink min-[400px]:text-[48px] sm:text-[56px] lg:text-[64px]">
            {PROMISE.lead} <em className="font-normal italic text-primary">{PROMISE.accent}</em> {PROMISE.tail}
          </h1>
        </div>
        <div className="lg:pb-1">
          <p className="max-w-[440px] text-[16px] leading-[1.7] text-ink-muted sm:text-[17px]">{PROMISE.support}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-6">
            <a href="#start" className={BUTTON_PRIMARY}>
              {PLAN_CTA_SHORT} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="#guides" className={TEXT_LINK}>
              Explore the guides <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <figure className="mt-6 sm:mt-9">
        <div className="relative h-[235px] overflow-hidden bg-surface-warm min-[560px]:h-[295px] min-[720px]:h-[330px] lg:h-[390px]">
          <Image
            src="/images/brand/apartment-light.jpg"
            alt="Illustrative sunlit apartment opening onto a leafy balcony, with warm timber, sage joinery and a terracotta armchair."
            fill
            preload
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover object-[48%_50%] sm:object-[50%_52%]"
          />
        </div>
        <figcaption className="mt-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[12px] text-ink-muted">
          <span className="text-primary">A clearer view of your next move.</span>
          <span>Buying. Selling. Finding your feet.</span>
        </figcaption>
      </figure>
    </section>
  );
}
