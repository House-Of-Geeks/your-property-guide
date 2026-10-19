import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FOUNDER } from "@/lib/founder";
import { BandTitle, Eyebrow } from "./parts";
import { SHELL } from "./shell";

// Andy's short story (v6): the portrait, his own words from the about page,
// the pull quote, his name, and the site's only headline figures (moved here
// from the hero on 19 Oct 2026, so the first screen can say what you get).
// Only the facts in src/lib/founder.ts appear here.

export interface FounderStat {
  value: string;
  label: string;
}

export function FounderBand({ stats }: { stats: readonly FounderStat[] }) {
  return (
    <section aria-labelledby="founder-title" className="tone-dark bg-eucalyptus py-20 sm:py-28">
      <div className={`${SHELL} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-3xl bg-eucalyptus-deep lg:mx-0">
            {/* TODO(andy): real photo. This is the portrait already used on
                the site; replace it with the new one when it's shot. */}
            <Image src={FOUNDER.photo} alt={`${FOUNDER.name}, founder of Your Property Guide`} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover object-top" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <Eyebrow>From the founder</Eyebrow>
          <BandTitle className="mt-5 max-w-2xl">
            <span id="founder-title">At the top end, nobody leaves the result to the market.</span>
          </BandTitle>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink-muted">
            <p>
              I started my career selling the very top of the Australian market, homes worth $10 million to $20 million, all over the country. After two years I was head-hunted to advise some of the biggest companies in property.
            </p>
            <p>
              In the past five years, my advice has generated over $4 billion in property sales, and it all comes back to one lesson. The price you get comes down to the campaign.
            </p>
          </div>

          <figure className="mt-10 max-w-2xl border-l-2 border-primary pl-6">
            <blockquote className="font-display text-[24px] italic leading-snug text-ink sm:text-[28px]">
              <p>“{FOUNDER.pullQuote}”</p>
            </blockquote>
            <figcaption className="mt-5">
              <span className="block font-display text-[26px] italic leading-none text-ink">{FOUNDER.name}</span>
              <span className="mt-2 block text-sm text-ink-muted">Founder, Your Property Guide</span>
            </figcaption>
          </figure>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end gap-2">
                <dt className="text-sm leading-snug text-ink-muted">{s.label}</dt>
                <dd className="font-display text-[34px] leading-none text-primary sm:text-[40px]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse">
            Read Andy’s story <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
