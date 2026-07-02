import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { ThanksPhoneAsk } from "@/components/forms/ThanksPhoneAsk";

export const metadata: Metadata = {
  title: "Your selling guide is ready",
  description: "Download your free guide to selling property in Australia.",
  robots: { index: false, follow: false },
};

// Must match GUIDE_PDF_PATH in /api/leads/route.ts.
const GUIDE_PDF_PATH = "/downloads/your-property-guide-selling-a-home-australia.pdf";

interface PageProps {
  // Next 16 can deliver repeated params as arrays — normalise before use.
  searchParams: Promise<{ score?: string | string[]; suburb?: string | string[]; }>;
}

// Post-download phone ask, keyed to lead temperature. The funnel leaves a
// lead id in sessionStorage only when no mobile was captured, so the ask
// renders exactly for the leads we can still upgrade (ThanksPhoneAsk
// handles that check client-side). "listed" is excluded — those vendors
// were promised no agent contact, so an appraisal-callback ask breaks
// the collection statement they just read.
const PHONE_PROMPT: Record<string, string> = {
  hot: "Want your free appraisal sooner? Add your mobile and a top local agent will call within one business day.",
  warm: "Add your mobile and we’ll give you a quick call when it’s the right time to start comparing agents.",
  cold: "Prefer to talk it through when the time comes? Add your mobile and we’ll check in — no pressure, no spam.",
};

// Next-step copy keyed to the lead temperature the funnel computed.
// HOT sellers get told an agent callback is coming (matching the
// admin-side speed-to-lead handling); everyone else gets a soft path.
const SCORE_COPY: Record<string, { headline: string; body: string }> = {
  hot: {
    headline: "Your guide is ready. One more thing.",
    body: "Selling within three months means pricing, presentation and agent choice are all still open, and all three are worth money. Read chapter 3 tonight, it takes ten minutes. We'll be in touch shortly about a free appraisal so you walk into every agent conversation already knowing your numbers. Nothing goes to anyone until you say so.",
  },
  warm: {
    headline: "Your guide is ready.",
    body: "Three to six months out is the sweet spot: enough time to prepare properly, and preparation is where the money is. Start with chapter 3 (the real cost of selling) and chapter 5 (the 10 agent questions). When you're closer, one click lines up a free appraisal.",
  },
  cold: {
    headline: "Your guide is ready.",
    body: "No rush at your end, so take your time with it. Chapter 1 covers how to read the market and pick your moment. The rest will be here when you need it.",
  },
  listed: {
    headline: "Your guide is ready.",
    body: "Since you're already listed, jump straight to chapter 7 (marketing) and chapter 8 (offers and negotiation). As promised, your details won't be passed to any agent.",
  },
};

export default async function SellingGuideThanksPage({ searchParams }: PageProps) {
  const { score: scoreParam, suburb: suburbParam } = await searchParams;
  const score = typeof scoreParam === "string" ? scoreParam : undefined;
  const suburb = typeof suburbParam === "string" ? suburbParam : undefined;
  const copy = SCORE_COPY[score ?? ""] ?? SCORE_COPY.cold;
  const phonePrompt = score !== "listed" ? (PHONE_PROMPT[score ?? ""] ?? PHONE_PROMPT.cold) : null;
  const suburbLabel = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="selling-guide" />
      </Suspense>

      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        {/* The Queenslander artwork grounds the moment: you did the
            right thing, here's home. Washed back so the download card
            stays the hero. */}
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
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="relative w-14 h-14 mx-auto mb-6">
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
            <div className="pop-in w-14 h-14 rounded-full bg-cta text-white grid place-items-center">
              <CheckCircle className="w-7 h-7" aria-hidden="true" />
            </div>
          </div>

          <h1 className="rise rise-d1 font-display text-ink tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.05] font-medium mb-4">
            {copy.headline}
          </h1>
          <p className="rise rise-d2 font-sans text-base text-ink-muted leading-relaxed max-w-xl mx-auto mb-10">
            {copy.body}
          </p>

          {/* Download card: cover art + button, mirrors the email so the
              whole journey looks like one product. */}
          <div className="rise rise-d3 mx-auto max-w-lg rounded-2xl bg-surface-inverse px-8 pt-8 pb-7 shadow-2xl">
            <Image
              src="/images/guide/selling-guide-cover.png"
              alt="The Complete Guide to Selling Your Property in Australia, 2026 edition"
              width={190}
              height={269}
              priority
              className="cover-settle mx-auto w-[160px] sm:w-[190px] h-auto rounded-md shadow-[0_22px_48px_rgba(0,0,0,0.5)]"
            />
            <a
              href={GUIDE_PDF_PATH}
              download
              className="group press mt-7 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-8 py-4 text-base transition-[transform,translate,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(189,89,47,0.35)] active:translate-y-0"
            >
              <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              Download your guide (PDF)
            </a>
            <p className="mt-3 text-xs text-white/72">
              We&rsquo;ve also emailed you the link, so it&rsquo;s there
              whenever you need it.
            </p>
          </div>

          {phonePrompt && (
            <ThanksPhoneAsk source="selling-guide-thanks" prompt={phonePrompt} />
          )}
        </div>
      </section>

      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="font-display text-ink tracking-tight text-2xl sm:text-3xl font-medium mb-8 text-center">
            While you&rsquo;re here
          </h2>
          <div data-reveal-group className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "/real-estate-commission-calculator",
                label: "Commission calculator",
                sub: "See what an agent would cost on your sale price",
              },
              {
                href: suburb ? `/suburbs/${suburb}` : "/suburbs",
                label: suburbLabel ? `${suburbLabel} profile` : "Your suburb profile",
                sub: "Median prices, growth and days on market",
              },
              {
                href: "/guides/real-estate-agent-fees-australia",
                label: "Agent fees explained",
                sub: "Average commission rates, state by state",
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
