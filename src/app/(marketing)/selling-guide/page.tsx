import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

import { SellingGuideFunnel } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { StickyGuideBar } from "./StickyGuideBar";

const META_TITLE = "Free guide to selling your property in Australia (2026)";
const META_DESCRIPTION =
  "The agent you pick is a $20,000 decision. This free guide shows you how to pick well: real selling costs by state, fee negotiation, and the 10 questions that expose an average agent. Personalised to your suburb.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/selling-guide` },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    images: guideOgImages({
      slug: "selling-guide",
      title: "The Complete Guide to Selling Your Property in Australia",
      description: "Free 10-chapter PDF: costs, agents, auctions and a 12-week plan.",
      persona: "selling",
    }),
  },
};

const CHAPTERS = [
  { n: "01", title: "Is now the right time to sell?", sub: "Market conditions, seasonality, sell-first vs buy-first" },
  { n: "02", title: "What your property is really worth", sub: "Appraisals vs valuations, how agents price, underquoting traps" },
  { n: "03", title: "The real cost of selling", sub: "Commission by state, marketing, conveyancing, the lot" },
  { n: "04", title: "Preparing your property", sub: "The fixes that pay for themselves, and the ones that don't" },
  { n: "05", title: "Choosing your agent", sub: "The 10 interview questions, fee negotiation, agreement types" },
  { n: "06", title: "Auction vs private treaty vs off-market", sub: "Which method fits your property and state" },
  { n: "07", title: "Marketing that actually sells", sub: "Portals, photography, copy, open homes" },
  { n: "08", title: "Offers, negotiation and exchange", sub: "Cooling-off, conditions, reading buyer signals" },
  { n: "09", title: "Legals and settlement", sub: "Contracts, vendor statements, conveyancer vs solicitor" },
  { n: "10", title: "Your 12-week selling timeline", sub: "A printable week-by-week checklist" },
];

const FAQS = [
  {
    question: "How does a free guide save me money?",
    answer:
      "Three ways, all covered with real numbers. Agent selection: the gap between a strong and average agent on a typical sale runs five figures, and chapter 5 gives you the 10 questions that reveal which one you're talking to. Fee negotiation: commission is negotiable in every state, and 0.2 to 0.4 percent off a typical sale is $1,700 to $3,400. Preparation: the right pre-sale fixes return 3 to 10 times their cost, and chapter 4 tells you which ones they are.",
  },
  {
    question: "Is the selling guide really free?",
    answer:
      "Yes. The guide is a free PDF, and there's no charge for anything on Your Property Guide. If you ask us to, we can also connect you with up to three top local agents. Agents pay us for that introduction, you never do, and we tell you before any agent gets your details.",
  },
  {
    question: "Will I get spammed by agents if I download it?",
    answer:
      "No. Your details only go to agents if you're a genuine seller and you've agreed to it on the form. We cap it at three local agents, and if you're already listed with an agent we don't share your details at all.",
  },
  {
    question: "What does it cost to sell a house in Australia?",
    answer:
      "Plan for 3 to 5 percent of your sale price all-in. Agent commission runs roughly 1.6 to 3 percent depending on your state and suburb, marketing $2,000 to $10,000, conveyancing $800 to $2,500, plus any styling, repairs and lender fees. Chapter 3 of the guide breaks every cost down by state.",
  },
  {
    question: "Do I need an agent to sell my house?",
    answer:
      "No, private sales are legal in every state. About 90 percent of Australian sellers still use an agent, mostly for pricing evidence, buyer reach and negotiation. The guide covers both routes honestly, including when DIY makes sense.",
  },
];

export default function SellingGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Free Selling Guide", url: "/selling-guide" }]}
      />
      <FAQPageJsonLd faqs={FAQS} />
      {/* The guide itself as a structured entity: free, downloadable,
          published by the site. Helps search and AI surfaces cite the
          guide as a real work rather than a landing page. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DigitalDocument",
          name: "The Complete Guide to Selling Your Property in Australia (2026 Edition)",
          description: META_DESCRIPTION,
          url: `${SITE_URL}/selling-guide`,
          image: `${SITE_URL}/images/guide/selling-guide-cover.png`,
          encodingFormat: "application/pdf",
          isAccessibleForFree: true,
          inLanguage: "en-AU",
          datePublished: "2026-06-10",
          publisher: {
            "@type": "Organization",
            name: "Your Property Guide",
            url: SITE_URL,
          },
          about: [
            "Selling property in Australia",
            "Real estate agent fees and commission",
            "Auction vs private treaty",
            "Property settlement and conveyancing",
          ],
        }}
      />

      {/* Hero: pitch left, funnel right. The funnel card is the point of
          the page; everything else exists to earn the first tap. */}
      <section id="get-the-guide" className="relative bg-surface-warm overflow-hidden border-b border-line scroll-mt-16">
        {/* Same commissioned suburb artwork as the homepage, run quieter
            (the cover image and funnel card carry the visual weight
            here). Keeps the two highest-traffic entries feeling like one
            publication. */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/hero/suburb-dusk.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-bottom opacity-[0.55]"
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
                The agent you pick is a{" "}
                <span className="italic font-light text-primary">$20,000</span>{" "}
                decision.
              </h1>

              <p className="rise rise-d2 font-display text-lg sm:text-xl text-ink leading-[1.35] mb-8 font-light">
                On a typical sale, the gap between a strong agent and an
                average one runs five figures. This free guide shows you how
                to tell them apart, what selling really costs, and where to
                claw thousands back. Ten chapters, personalised to your
                suburb, in your inbox in 60 seconds.
              </p>

              <div className="rise rise-d3 flex items-start gap-6 mb-8">
                <Image
                  src="/images/guide/selling-guide-cover.png"
                  alt="The Complete Guide to Selling Your Property in Australia, 2026 edition"
                  width={168}
                  height={238}
                  priority
                  className="hidden sm:block w-[150px] lg:w-[168px] h-auto rounded-md shadow-[0_24px_48px_rgba(23,16,11,0.35)] -rotate-2 shrink-0"
                />
                <ul className="space-y-3 pt-1">
                  {[
                    "The 10 questions that expose an average agent before you sign",
                    "Fee negotiation that typically saves $1,700 to $3,400",
                    "Presentation moves that return 3 to 10 times their cost",
                    "The 60-day trap that quietly discounts stale listings",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
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
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> No agent contact unless you ask
                </span>
              </p>
            </div>

            <div className="rise rise-d2 lg:col-span-6 lg:sticky lg:top-24">
              <Suspense fallback={<div className="text-sm text-ink-muted">Loading…</div>}>
                <SellingGuideFunnel source="selling-guide-page" />
              </Suspense>

              {/* Fills the column under the funnel card (the left pitch
                  runs taller) with the path ahead instead of dead space. */}
              <div className="mt-5 rounded-2xl border border-line bg-surface-raised/80 backdrop-blur-[2px] px-6 py-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle font-sans font-medium mb-4">
                  What happens next
                </p>
                <ol className="space-y-3">
                  {[
                    ["01", "Answer seven quick questions, about 60 seconds"],
                    ["02", "Download instantly, plus a copy lands in your inbox"],
                    ["03", "Selling soon? A free local appraisal, only if you want one"],
                  ].map(([n, t]) => (
                    <li key={n} className="flex items-baseline gap-3">
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

      {/* The money band. Three numbers, all drawn from the guide's own
          content, that answer "why is a free PDF worth my email address"
          in the reader's units: dollars. */}
      <section className="bg-accent-lighter border-y border-line-warm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary-dark font-sans font-semibold mb-10 text-center">
            What the right moves are worth
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {[
              ["$20,000+", "the typical gap between a strong agent and an average one on a mid-market sale"],
              ["3 to 10x", "what smart, cheap presentation returns at sale time, while big renovations rarely break even"],
              ["$1,700 to $3,400", "what negotiating 0.2 to 0.4 percent off commission saves on a typical sale"],
            ].map(([n, label]) => (
              <div key={n} className="text-center sm:text-left">
                <p className="font-display italic text-primary-dark text-4xl sm:text-5xl leading-none mb-3 tracking-tight">{n}</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-ink-subtle font-sans">
            Figures are typical ranges from the guide, chapters 3 to 5. Your sale will vary. That is exactly why chapter 2 exists.
          </p>
        </div>
      </section>

      {/* Chapter contents. Doubles as the SEO body for "selling property
          guide" queries and as proof the guide is a real document, not a
          two-page brochure for handing over your email. */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              Inside
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              What you get
            </span>
          </div>

          <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl font-medium mb-10">
            Ten chapters, no filler.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
            {CHAPTERS.map((c) => (
              <div key={c.n} className="flex items-start gap-4 border-t border-line py-4">
                <span className="font-display italic text-primary text-base tabular-nums leading-6">{c.n}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-ink leading-6">{c.title}</p>
                  <p className="font-sans text-xs text-ink-subtle leading-relaxed">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-ink-muted">
            Prefer to read it on the site first?{" "}
            <Link href="/guides/how-to-sell-a-house-australia" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary hover:decoration-primary transition-colors">
              Start with our selling overview
            </Link>
            , then grab the PDF when you want the full version.
          </p>
        </div>
      </section>

      {/* How the free model works. The honest version of the disclosure,
          stated as a feature. Fee transparency is the gap every incumbent
          leaves open. */}
      <section className="bg-surface-sunken border-b border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl font-medium mb-6 max-w-2xl">
            Why it&rsquo;s free, in plain English.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
            {[
              ["01", "You get the guide", "Every chapter, every checklist, free. No card, no catch, yours to keep."],
              ["02", "If you want agents, we connect you", "Only if you ask. Up to three top local agents, never a blast list. Already listed? We don't share your details at all."],
              ["03", "Agents pay us, you don't", "When an introduction leads to a listing, the agent pays us a fee. That's the whole business model, disclosed up front."],
            ].map(([n, t, body]) => (
              <div key={n} className="border-t border-line-strong pt-4">
                <p className="font-display italic text-primary text-base mb-2 tabular-nums">{n}</p>
                <p className="font-sans text-sm font-semibold text-ink mb-1.5">{t}</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ. Mirrors the FAQPageJsonLd above. */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl font-medium mb-10">
            Questions sellers ask us.
          </h2>
          <div className="space-y-8">
            {FAQS.map((f) => (
              <div key={f.question} className="border-t border-line pt-5">
                <h3 className="font-sans text-base font-semibold text-ink mb-2">{f.question}</h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>

          {/* Page closer: the night suburb, lights on, one last door back
              into the funnel. Ends the page on the brand's strongest
              visual note instead of a beige box. */}
          <div className="mt-12 relative rounded-2xl overflow-hidden bg-surface-inverse text-center shadow-2xl">
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
              <p className="font-display text-2xl sm:text-3xl text-white mb-2 tracking-tight">
                Ready when you are.
              </p>
              <p className="mb-6 text-sm text-white/78">
                60 seconds, personalised to your suburb, free.
              </p>
              <a
                href="#get-the-guide"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-semibold px-8 py-3.5 text-sm transition-colors shadow-lg"
              >
                Get the free guide
              </a>
              <p className="mt-5 text-xs text-white/72">
                Buying, not selling?{" "}
                <Link href="/buying-guide" className="text-white/92 hover:text-white underline underline-offset-4 transition-colors">
                  There&rsquo;s a buying guide too
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
