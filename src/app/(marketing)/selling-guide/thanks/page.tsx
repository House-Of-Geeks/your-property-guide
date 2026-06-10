import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";

export const metadata: Metadata = {
  title: "Your selling guide is ready",
  description: "Download your free guide to selling property in Australia.",
  robots: { index: false, follow: false },
};

// Must match GUIDE_PDF_PATH in /api/leads/route.ts.
const GUIDE_PDF_PATH = "/downloads/your-property-guide-selling-a-home-australia.pdf";

interface PageProps {
  searchParams: Promise<{ score?: string; suburb?: string }>;
}

// Next-step copy keyed to the lead temperature the funnel computed.
// HOT sellers get told an agent callback is coming (matching the
// admin-side speed-to-lead handling); everyone else gets a soft path.
const SCORE_COPY: Record<string, { headline: string; body: string }> = {
  hot: {
    headline: "Your guide is ready. One more thing.",
    body: "Since you're planning to sell soon, we'll be in touch shortly about a free appraisal from a top local agent. No obligation, and nothing goes to any agent until you say so.",
  },
  warm: {
    headline: "Your guide is ready.",
    body: "You've got a few months up your sleeve, which is the best position to be in. Start with chapter 3 (the real cost of selling) and chapter 5 (choosing your agent). When you're closer, we can line up a free appraisal.",
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
  const { score, suburb } = await searchParams;
  const copy = SCORE_COPY[score ?? ""] ?? SCORE_COPY.cold;
  const suburbLabel = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="selling-guide" />
      </Suspense>

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-cta text-white grid place-items-center mx-auto mb-6">
            <CheckCircle className="w-7 h-7" aria-hidden="true" />
          </div>

          <h1 className="font-display text-ink tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.05] font-medium mb-4">
            {copy.headline}
          </h1>
          <p className="font-sans text-base text-ink-muted leading-relaxed max-w-xl mx-auto mb-10">
            {copy.body}
          </p>

          {/* Download card: cover art + button, mirrors the email so the
              whole journey looks like one product. */}
          <div className="mx-auto max-w-lg rounded-2xl bg-surface-inverse px-8 pt-8 pb-7 shadow-2xl">
            <Image
              src="/images/guide/selling-guide-cover.png"
              alt="The Complete Guide to Selling Your Property in Australia, 2026 edition"
              width={190}
              height={269}
              priority
              className="mx-auto w-[160px] sm:w-[190px] h-auto rounded-md shadow-[0_22px_48px_rgba(0,0,0,0.5)]"
            />
            <a
              href={GUIDE_PDF_PATH}
              download
              className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-8 py-4 text-base transition-colors"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              Download your guide (PDF)
            </a>
            <p className="mt-3 text-xs text-white/55">
              We&rsquo;ve also emailed you the link, so it&rsquo;s there
              whenever you need it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="font-display text-ink tracking-tight text-2xl sm:text-3xl font-medium mb-8 text-center">
            While you&rsquo;re here
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
