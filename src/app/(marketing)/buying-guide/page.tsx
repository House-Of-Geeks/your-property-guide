import type { Metadata } from "next";
import { Suspense, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

import { FaqAccordion } from "@/components/guide";
import { BuyingGuideFunnel } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { StickyGuideBar } from "../selling-guide/StickyGuideBar";

const META_TITLE = "Free guide to buying property in Australia (2026)";
const META_DESCRIPTION =
  "The complete buying guide for first home buyers, upgraders, investors and downsizers: what you can really spend, 2026 schemes state by state, and how not to overpay. Free PDF, personalised to your situation.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/buying-guide` },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    images: guideOgImages({
      slug: "buying-guide",
      title: "The Complete Guide to Buying Property in Australia",
      description: "Free 10-chapter PDF for first home buyers, upgraders, investors and downsizers.",
      persona: "first-home",
    }),
  },
};

const CHAPTERS = [
  { n: "01", title: "Which buyer are you?", sub: "First home, upgrader, investor, downsizer: the playbook for each" },
  { n: "02", title: "What you can actually spend", sub: "Borrowing power, the lender buffer, deposits, LMI, true upfront costs" },
  { n: "03", title: "Schemes, state by state", sub: "2026 settings: 5% Deposit Scheme, Help to Buy, FHOG, duty concessions" },
  { n: "04", title: "Finding the right suburb", sub: "The data that matters, school catchments, growth signals" },
  { n: "05", title: "Inspecting like a professional", sub: "The 30-minute method, building and pest, strata, when to walk" },
  { n: "06", title: "How the selling side plays you", sub: "Underquoting, price guides decoded, auction psychology" },
  { n: "07", title: "Making the offer", sub: "Negotiation, protective conditions, auction strategy" },
  { n: "08", title: "Finance to unconditional", sub: "Pre-approval realities, valuation shortfalls, investor lending" },
  { n: "09", title: "Contracts to keys", sub: "Conveyancing, cooling-off by state, settlement day" },
  { n: "10", title: "Your 12-week buying timeline", sub: "A printable week-by-week plan, persona footnotes included" },
];

const FAQS = [
  {
    question: "Is the buying guide really free?",
    answer:
      "Yes. The guide is a free PDF and there's no charge for anything on Your Property Guide. Your details are never sold and never passed to selling agents. If you ask us to, we can introduce you to a vetted mortgage broker or buyer's agent, and they pay us for that introduction, never you.",
  },
  {
    question: "Which first home buyer schemes apply in 2026?",
    answer:
      "The big ones: the Australian Government 5% Deposit Scheme (no place caps and no income test since October 2025, with city price caps like $1.5m in Sydney and $1m in Brisbane), Help to Buy shared equity from 2% deposit, the First Home Super Saver scheme, plus state grants and stamp duty concessions that differ in every state. Chapter 3 has the full 2026 table.",
  },
  {
    question: "How much deposit do I actually need?",
    answer:
      "Twenty percent avoids lenders mortgage insurance, but it isn't the only path. Five percent under the federal scheme skips LMI entirely if you qualify, and ten percent with LMI can beat waiting years while prices move. Chapter 2 runs the numbers on all three paths, including what LMI typically costs on a $750k purchase.",
  },
  {
    question: "What does this guide cover for investors and downsizers?",
    answer:
      "Every chapter carries persona callouts where the advice diverges: investor lending differences (rates, interest-only, rental income shading), yield versus growth suburb selection, strata due diligence for downsizers, and the bridging decision for upgraders buying before they sell.",
  },
];

export default function BuyingGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Free Buying Guide", url: "/buying-guide" }]} />
      <FAQPageJsonLd faqs={FAQS} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DigitalDocument",
          name: "The Complete Guide to Buying Property in Australia (2026 Edition)",
          description: META_DESCRIPTION,
          url: `${SITE_URL}/buying-guide`,
          image: `${SITE_URL}/images/guide/buying-guide-cover.png`,
          encodingFormat: "application/pdf",
          isAccessibleForFree: true,
          inLanguage: "en-AU",
          datePublished: "2026-06-11",
          publisher: {
            "@type": "Organization",
            name: "Your Property Guide",
            url: SITE_URL,
          },
          about: [
            "Buying property in Australia",
            "First home buyer schemes",
            "Property investment",
            "Home loans and pre-approval",
            "Auctions and negotiation",
          ],
        }}
      />

      {/* Hero: pitch left, funnel right, same publication formula as the
          selling guide so the two lead magnets read as a series. */}
      <section id="get-the-guide" className="relative bg-surface-warm overflow-hidden border-b border-line scroll-mt-16">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/hero/suburb-dusk.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-left-bottom opacity-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-warm from-30% via-surface-warm/85 via-60% to-surface-warm/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-warm from-15% via-surface-warm/60 via-50% to-surface-warm/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6">
              <div className="rise flex items-center gap-4 mb-8">
                <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                  Free PDF
                </span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                  2026 edition
                </span>
              </div>

              <h1 className="rise rise-d1 font-display text-ink tracking-tight mb-6 text-4xl sm:text-5xl lg:text-6xl leading-[1.02] font-medium">
                Overpaying is the default.{" "}
                <span className="u-draw relative inline-block italic font-light text-primary">
                  This
                  {/* Hand-drawn underline, draws in after the entrance */}
                  <svg
                    className="absolute left-[-2%] right-0 bottom-[-0.12em] w-[104%] h-[0.22em]"
                    viewBox="0 0 120 12"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5C24 4.5 50 3.5 73 5c18 1.2 32 3 44 4.5"
                      stroke="var(--cta)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      pathLength="1"
                    />
                  </svg>
                </span>{" "}
                is the fix.
              </h1>

              <p className="rise rise-d2 font-display text-lg sm:text-xl text-ink leading-[1.35] mb-8 font-light">
                The complete guide to buying property in Australia, written
                for the buyer you actually are: first home, upgrading,
                investing or downsizing. What you can really spend, the
                schemes worth tens of thousands, and how the selling side
                plays you. Free, in your inbox in 60 seconds.
              </p>

              <div className="flex items-start gap-6 mb-8">
                {/* cover-settle owns the resting -2deg tilt, so no static
                    rotate here (the two would compound to -4deg). */}
                <a
                  href="#get-the-guide"
                  className="cover-settle shrink-0 transition-transform duration-300 ease-[var(--ease-out-quint)] hover:rotate-0 hover:-translate-y-1"
                >
                  <Image
                    src="/images/guide/buying-guide-cover.png"
                    alt="The Complete Guide to Buying Property in Australia, 2026 edition"
                    width={168}
                    height={238}
                    priority
                    className="block w-[96px] sm:w-[150px] lg:w-[168px] h-auto rounded-md shadow-[0_24px_48px_rgba(23,16,11,0.35)]"
                  />
                </a>
                <ul className="space-y-3 pt-1">
                  {[
                    "2026 schemes state by state, worth tens of thousands",
                    "What lenders will actually approve, buffer included",
                    "Underquoting and auction psychology, decoded",
                    "A printable 12-week buying timeline",
                  ].map((line, i) => (
                    <li
                      key={line}
                      className="rise flex items-start gap-3"
                      style={{ animationDelay: `${280 + i * 70}ms` }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-cta shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="font-sans text-sm sm:text-base text-ink leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-ink-subtle font-sans font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> 10 chapters
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" /> 60-second form
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Never shared with selling agents
                </span>
              </p>
            </div>

            <div className="rise rise-d2 lg:col-span-6 lg:sticky lg:top-24">
              {/* data-funnel-card drives the #get-the-guide:target ping
                  (the buying funnel card doesn't carry it internally).
                  rounded-2xl keeps the ping ring on the card's corners. */}
              <div data-funnel-card className="rounded-2xl">
                <Suspense fallback={<div className="text-sm text-ink-muted">Loading…</div>}>
                  <BuyingGuideFunnel source="buying-guide-page" />
                </Suspense>
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-surface-raised/80 backdrop-blur-[2px] px-6 py-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle font-sans font-medium mb-4">
                  What happens next
                </p>
                <ol className="space-y-3">
                  {[
                    ["01", "Answer six quick questions, about 60 seconds"],
                    ["02", "Download instantly, plus a copy lands in your inbox"],
                    ["03", "We point you at the chapters for your situation"],
                  ].map(([n, t], i) => (
                    <li
                      key={n}
                      className="rise flex items-baseline gap-3"
                      style={{ animationDelay: `${280 + i * 70}ms` }}
                    >
                      <span className="font-display italic text-cta text-base tabular-nums shrink-0">{n}</span>
                      <span className="font-sans text-sm text-ink-muted leading-snug">{t}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The money band, buyer numbers, all drawn from the guide. */}
      <section className="bg-accent-lighter border-y border-line-warm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary-dark font-sans font-semibold mb-10 text-center">
            What knowing the game is worth
          </p>
          <div data-reveal-group className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {[
              ["5%", "the deposit that skips lenders mortgage insurance entirely under the 2026 federal scheme, if you know to use it"],
              ["$10k to $50k+", "what first home buyer schemes and duty concessions are worth, state by state, chapter 3"],
              ["5 to 10%", "how far auction price guides routinely run under the final result, decoded in chapter 6"],
            ].map(([n, label]) => (
              <div key={n} className="text-center sm:text-left">
                <span className="block h-px w-10 bg-primary-dark/40 rule-draw mb-4 mx-auto sm:mx-0" aria-hidden="true" />
                <p className="font-display italic text-primary-dark text-4xl sm:text-5xl leading-none mb-3 tracking-tight">{n}</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-ink-subtle font-sans">
            Figures are typical ranges from the guide. Your purchase will vary. That is exactly why chapter 2 exists.
          </p>
        </div>
      </section>

      {/* Chapter contents */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-16 sm:pb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              Inside
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              What you get
            </span>
          </div>

          <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-5xl font-medium mb-10">
            Ten chapters, four buyers, no filler.
          </h2>

          {/* CSS columns so chapters 01-05 read down the left column. */}
          <div data-reveal-group className="sm:columns-2 sm:gap-x-10">
            {CHAPTERS.map((c) => (
              <div key={c.n} className="group flex items-start gap-4 border-t border-line py-4 break-inside-avoid transition-colors duration-200">
                <span className="font-display italic text-primary text-base tabular-nums leading-6 transition-all duration-200 group-hover:translate-x-[3px] group-hover:text-primary-dark">{c.n}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-ink leading-6 transition-colors group-hover:text-primary">{c.title}</p>
                  <p className="font-sans text-xs text-ink-subtle leading-relaxed">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-ink-muted">
            Selling as well?{" "}
            <Link href="/selling-guide" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary hover:decoration-primary transition-colors">
              The selling guide
            </Link>{" "}
            is the other half of the move, also free.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-14 pb-14 sm:pt-16 sm:pb-16">
          <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-5xl font-medium mb-10">
            Questions buyers ask us.
          </h2>
          <FaqAccordion items={FAQS} />

          {/* Page closer: same night-suburb treatment as the selling guide */}
          <div className="band-glow mt-12 relative rounded-2xl overflow-hidden bg-surface-inverse text-center shadow-2xl">
            <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
              <Image
                src="/images/hero/suburb-night-v2.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover object-bottom opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface-inverse from-20% via-surface-inverse/70 via-50% to-surface-inverse/10" />
            </div>
            <div className="relative px-6 sm:px-10 pt-10 pb-24 sm:pb-28">
              <p data-reveal className="font-display text-2xl sm:text-3xl text-white mb-2 tracking-tight">
                Buy it once. Buy it well.
              </p>
              <p
                data-reveal
                style={{ "--reveal-delay": "90ms" } as CSSProperties}
                className="mb-6 text-sm text-white/78"
              >
                60 seconds, matched to your situation, free.
              </p>
              {/* data-reveal lives on the wrapper so the CTA's own hover
                  transition isn't overridden by the reveal transition. */}
              <div data-reveal style={{ "--reveal-delay": "180ms" } as CSSProperties}>
                <a
                  href="#get-the-guide"
                  className="press inline-flex items-center justify-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white font-semibold px-8 py-3.5 text-sm transition-[transform,translate,background-color,box-shadow] duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get the free guide
                </a>
              </div>
              <p className="mt-5 text-xs text-white/72">
                Selling, not buying?{" "}
                <Link href="/selling-guide" className="text-white/92 hover:text-white underline underline-offset-4 transition-colors">
                  There&rsquo;s a selling guide too
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <StickyGuideBar />
    </>
  );
}
