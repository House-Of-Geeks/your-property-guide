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
                  src="/images/guide/buying-guide-cover.png"
                  alt="The Complete Guide to Buying Property in Australia, 2026 edition"
                  width={190}
                  height={269}
                  priority
                  className="shrink-0 w-[64px] sm:w-[84px] h-auto rounded shadow-[0_6px_16px_rgb(22_25_29/0.22)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink leading-snug">Your buying guide (PDF)</p>
                  <p className="text-sm text-ink-muted mb-3">2026 edition, 10 chapters</p>
                  <a
                    href={GUIDE_PDF_PATH}
                    download
                    className="press w-full inline-flex items-center justify-center gap-2 rounded-md border border-cta bg-cta hover:bg-cta-hover text-white font-semibold px-4 py-3 text-base sm:text-sm transition-colors group-has-[[data-call-card]]/thanks:bg-white group-has-[[data-call-card]]/thanks:border-ink group-has-[[data-call-card]]/thanks:text-ink group-has-[[data-call-card]]/thanks:hover:bg-ink group-has-[[data-call-card]]/thanks:hover:text-white"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Download the guide
                  </a>
                  <GuideEmailNote guide="buying" />
                </div>
              </div>
            </div>

            <GuideCallCard guide="buying" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h2 className="font-display text-ink tracking-[-0.02em] text-xl sm:text-2xl font-bold mb-5">
            While you&rsquo;re here
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 border-t border-line">
            {[
              {
                href: "/borrowing-power-calculator",
                label: "Borrowing power",
                sub: "An estimate of what a lender may lend you, buffer included",
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
