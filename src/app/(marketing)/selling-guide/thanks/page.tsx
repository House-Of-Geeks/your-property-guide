import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { GuideCallCard, GuideEmailNote } from "@/components/journey/GuideThanksExtras";

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

// Next-step copy keyed to the lead temperature the funnel computed. An
// agent call is offered, never promised: sellers book one in the call
// card beside the download (GuideCallCard), so nothing goes to an agent
// unless they ask.
const SCORE_COPY: Record<string, { headline: string; body: string }> = {
  hot: {
    headline: "Your guide is ready. One more thing.",
    body: "Selling within three months means pricing, presentation and agent choice are all still open, and all three are worth money. Read chapter 3 tonight, it takes ten minutes. Want a free appraisal, so you walk into every agent conversation already knowing your numbers? Book a call. Nothing goes to anyone unless you ask.",
  },
  warm: {
    headline: "Your guide is ready.",
    body: "Three to six months out is the sweet spot: enough time to prepare properly, and preparation is where the money is. Start with chapter 3 (the real cost of selling) and chapter 5 (the 10 agent questions). When you're ready, book a free appraisal call.",
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
  const suburbLabel = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  // Cross-sell cards. Hot and warm sellers get their appraisal ask in the
  // call card above, so the appraisal card leads only for cold sellers.
  // Listed vendors were promised no agent contact: no appraisal ask.
  const crossSells = [
    ...(score === "cold"
      ? [
          {
            href: suburb ? `/appraisal?suburb=${suburb}` : "/appraisal",
            label: "Book your free appraisal now",
            sub: "One local agent who sells in your area values your home, free, no obligation",
          },
        ]
      : []),
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
  ];

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="selling-guide" />
      </Suspense>

      {/* The download and the optional call card side by side from lg and
          stacked on phones, both on the first screen. The download button is
          the solid action until the call card renders; then the call takes
          the solid button and the download goes to outline (one solid
          action per screen). Nothing decorative. */}
      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-12 sm:pb-16 flex flex-col">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted mb-2">
            <CheckCircle className="w-4 h-4 text-success" aria-hidden="true" />
            Guide sent
          </p>
          <h1 className="font-display text-ink tracking-[-0.03em] text-[1.75rem] sm:text-4xl lg:text-5xl leading-[1.08] font-bold">
            {copy.headline}
          </h1>
          <p className="mt-4 text-base text-ink-muted leading-relaxed max-w-2xl max-lg:order-last max-lg:mt-6">
            {copy.body}
          </p>

          <div className="group/thanks mt-6 lg:mt-8 grid lg:grid-cols-2 gap-4 lg:gap-6 items-start">
            <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
              <div className="flex items-start gap-4 sm:gap-5">
                <Image
                  src="/images/guide/selling-guide-cover.png"
                  alt="The Complete Guide to Selling Your Property in Australia, 2026 edition"
                  width={190}
                  height={269}
                  priority
                  className="shrink-0 w-[64px] sm:w-[84px] h-auto rounded shadow-[0_6px_16px_rgb(22_25_29/0.22)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink leading-snug">Your selling guide (PDF)</p>
                  <p className="text-sm text-ink-muted mb-3">2026 edition, 10 chapters</p>
                  <a
                    href={GUIDE_PDF_PATH}
                    download
                    className="press w-full inline-flex items-center justify-center gap-2 rounded-md border border-cta bg-cta hover:bg-cta-hover text-white font-semibold px-4 py-3 text-base sm:text-sm transition-colors group-has-[[data-call-card]]/thanks:bg-white group-has-[[data-call-card]]/thanks:border-ink group-has-[[data-call-card]]/thanks:text-ink group-has-[[data-call-card]]/thanks:hover:bg-ink group-has-[[data-call-card]]/thanks:hover:text-white"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Download the guide
                  </a>
                  <GuideEmailNote guide="selling" />
                </div>
              </div>
            </div>

            <GuideCallCard guide="selling" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="font-display text-ink tracking-[-0.02em] text-xl sm:text-2xl font-bold mb-5">
            While you&rsquo;re here
          </h2>
          <ul className={`grid grid-cols-1 gap-x-8 border-t border-line ${crossSells.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {crossSells.map((card) => (
              <li key={card.href} className="border-b border-line">
                <Link href={card.href} className="group flex items-start justify-between gap-3 py-4">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink group-hover:underline underline-offset-4">{card.label}</span>
                    <span className="block text-sm text-ink-muted leading-snug mt-0.5">{card.sub}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
