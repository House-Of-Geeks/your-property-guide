import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";

export const metadata: Metadata = {
  title: "Your buying guide is ready",
  description: "Download your free guide to buying property in Australia.",
  robots: { index: false, follow: false },
};

// Must match BUYING_GUIDE_PDF_PATH in src/lib/lead-emails.ts.
const GUIDE_PDF_PATH = "/downloads/your-property-guide-buying-property-australia.pdf";

interface PageProps {
  searchParams: Promise<{ score?: string; suburb?: string }>;
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
  const { score, suburb } = await searchParams;
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
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-cta text-white grid place-items-center mx-auto mb-6">
            <CheckCircle className="w-7 h-7" aria-hidden="true" />
          </div>

          <h1 className="font-display text-ink tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.05] font-medium mb-4">
            {copy.headline}
          </h1>
          <p className="font-sans text-base text-ink-muted leading-relaxed max-w-xl mx-auto mb-10">
            {copy.body}
          </p>

          <div className="mx-auto max-w-lg rounded-2xl bg-surface-inverse px-8 pt-8 pb-7 shadow-2xl">
            <Image
              src="/images/guide/buying-guide-cover.png"
              alt="The Complete Guide to Buying Property in Australia, 2026 edition"
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-14 pb-14 sm:pt-16 sm:pb-16">
          <h2 className="font-display text-ink tracking-tight text-2xl sm:text-3xl font-medium mb-8 text-center">
            While you&rsquo;re here
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "/borrowing-power-calculator",
                label: "Borrowing power",
                sub: "What a lender will actually approve, buffer included",
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
                <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
