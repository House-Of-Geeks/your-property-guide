import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { GuideCallCard, GuideEmailNote } from "@/components/journey/GuideThanksExtras";

export const metadata: Metadata = {
  title: "Your buying guide is ready",
  description: "Download your free guide to buying property in Australia.",
  robots: { index: false, follow: false },
};

// Must match BUYING_GUIDE_PDF_PATH in src/lib/lead-emails.ts.
const GUIDE_PDF_PATH = "/downloads/your-property-guide-buying-property-australia.pdf";

interface PageProps {
  // Next 16 can deliver repeated params as arrays — normalise before use.
  searchParams: Promise<{ score?: string | string[]; suburb?: string | string[]; }>;
}

const SCORE_COPY: Record<string, { headline: string; body: string }> = {
  hot: {
    headline: "Your guide is ready. You're in the strong seat.",
    body: "Finance sorted and buying soon is the strongest position a buyer can hold. Read chapter 6 tonight, it decodes every script the selling side will run on you, then chapter 7 for the offer itself.",
  },
  warm: {
    headline: "Your guide is ready.",
    body: "You're close enough that finance is the next move. Start with chapter 2 (what you can actually spend, buffer included) and chapter 8 (pre-approval without the traps). Everything after that gets easier.",
  },
  cold: {
    headline: "Your guide is ready.",
    body: "Buying well starts long before the inspections. Chapter 1 works out which buyer you are and the playbook that follows. The numbers will still be true when you're ready.",
  },
};

export default async function BuyingGuideThanksPage({ searchParams }: PageProps) {
  const { score: scoreParam, suburb: suburbParam } = await searchParams;
  const score = typeof scoreParam === "string" ? scoreParam : undefined;
  const suburb = typeof suburbParam === "string" ? suburbParam : undefined;
  const copy = SCORE_COPY[score ?? ""] ?? SCORE_COPY.cold;
  const suburbLabel = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="buying-guide" />
      </Suspense>

      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/art/queenslander.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom opacity-[0.32]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-warm from-30% via-surface-warm/80 to-surface-warm/35" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 text-center flex flex-col">
          {/* Phones: the download as a slim banner up top, so the call card
              and its mobile field come straight after the headline and the
              full download card follows them (Oct 2026). */}
          <a
            href={GUIDE_PDF_PATH}
            download
            className="rise lg:hidden group press mb-6 flex items-center gap-3 rounded-xl bg-surface-inverse px-4 py-3 text-left shadow-card"
          >
            <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-cta text-white">
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-white">Your buying guide (PDF)</span>
              <span className="block text-xs text-white/64">2026 edition</span>
            </span>
            <span className="shrink-0 text-sm font-medium text-accent-lighter">Download</span>
          </a>

          <div className="relative w-12 h-12 mx-auto mb-4">
            {/* Confetti burst: ypg-rise played in reverse (fade out while
                travelling) inside rotated, scaled anchors so each dot flies
                outward from the badge rim as it pops. Base opacity-0 keeps
                the dots gone whenever the animation is off (reduced motion
                sets .rise to animation: none). */}
            {[
              { pos: "left-1/2 top-0", dir: "rotate-180 scale-[2]", tone: "bg-cta" },
              { pos: "left-[86%] top-[14%]", dir: "rotate-[225deg] scale-[1.8]", tone: "bg-accent-lighter" },
              { pos: "left-[14%] top-[14%]", dir: "rotate-[135deg] scale-[2.3]", tone: "bg-accent-lighter" },
              { pos: "left-full top-1/2", dir: "rotate-[270deg] scale-[1.7]", tone: "bg-cta" },
              { pos: "left-[14%] top-[86%]", dir: "rotate-45 scale-[2]", tone: "bg-cta" },
            ].map((dot) => (
              <span key={dot.pos} aria-hidden="true" className={`absolute ${dot.pos} ${dot.dir}`}>
                <span
                  className={`rise block w-0.5 h-0.5 rounded-full opacity-0 ${dot.tone}`}
                  style={{
                    animationDirection: "reverse",
                    animationFillMode: "forwards",
                    animationDuration: "650ms",
                    animationDelay: "250ms",
                  }}
                />
              </span>
            ))}
            <div className="pop-in w-12 h-12 rounded-full bg-cta text-white grid place-items-center">
              <CheckCircle className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>

          <h1 className="rise rise-d1 font-display text-ink tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.05] font-medium mb-3">
            {copy.headline}
          </h1>
          <p className="rise rise-d2 font-sans text-base text-ink-muted leading-relaxed max-w-xl mx-auto mb-8 max-lg:order-last max-lg:mt-8 max-lg:mb-0">
            {copy.body}
          </p>

          {/* Download and the optional call side by side from lg, so both
              sit on the first screen (Oct 2026: the full-size cover pushed
              the call card below the fold). Below lg the call card comes
              first and the download card follows it. */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-center gap-5 lg:gap-6 text-left">
            {/* Download card: a cover thumbnail beside the button, so the
                button sits high on the page. */}
            <div className="rise rise-d3 max-lg:order-last w-full max-w-lg mx-auto lg:mx-0 rounded-2xl bg-surface-inverse p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-5">
                <Image
                  src="/images/guide/buying-guide-cover.png"
                  alt="The Complete Guide to Buying Property in Australia, 2026 edition"
                  width={190}
                  height={269}
                  priority
                  className="cover-settle shrink-0 w-[72px] sm:w-[96px] h-auto rounded-md shadow-[0_14px_32px_rgba(0,0,0,0.5)]"
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={GUIDE_PDF_PATH}
                    download
                    className="group press w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-4 py-3.5 text-sm sm:text-base transition-[transform,translate,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(189,89,47,0.35)] active:translate-y-0"
                  >
                    <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                    Download your guide (PDF)
                  </a>
                  <GuideEmailNote guide="buying" />
                </div>
              </div>
            </div>

            <GuideCallCard guide="buying" />
          </div>
        </div>
      </section>

      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-14 pb-14 sm:pt-16 sm:pb-16">
          <h2 className="font-display text-ink tracking-tight text-2xl sm:text-3xl font-medium mb-8 text-center">
            While you&rsquo;re here
          </h2>
          <div data-reveal-group className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "/borrowing-power-calculator",
                label: "Borrowing power",
                sub: "An estimate of what a lender may lend on your income and expenses, at the APRA buffer",
              },
              {
                href: suburb ? `/suburbs/${suburb}` : "/find-your-suburb",
                label: suburbLabel ? `${suburbLabel} profile` : "Find your suburb",
                sub: suburbLabel ? "Median prices, growth and days on market" : "The 4-question quiz that scores six suburbs for you",
              },
              {
                href: "/stamp-duty-calculator",
                label: "Stamp duty",
                sub: "What the government takes, state by state, concessions included",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="card-lift group flex flex-col rounded-2xl border border-line bg-surface-warm p-5 hover:border-primary/50"
              >
                <p className="font-sans text-sm font-semibold text-ink group-hover:text-primary transition-colors mb-1.5">
                  {card.label}
                </p>
                <p className="font-sans text-xs text-ink-subtle leading-relaxed mb-3 flex-1">{card.sub}</p>
                <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary group-hover:translate-x-1 transition-[transform,translate,color] duration-200" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
