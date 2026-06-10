import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

import { SellingGuideFunnel } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { StickyGuideBar } from "./StickyGuideBar";

const META_TITLE = "Free guide to selling your property in Australia (2026)";
const META_DESCRIPTION =
  "The complete guide to selling your home: what it really costs, agent fees by state, auction vs private treaty, and a 12-week selling checklist. Free PDF, personalised to your suburb.";

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

      {/* Hero: pitch left, funnel right. The funnel card is the point of
          the page; everything else exists to earn the first tap. */}
      <section id="get-the-guide" className="relative bg-surface-warm overflow-hidden border-b border-line scroll-mt-16">
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
                Selling your home? Read this{" "}
                <span className="italic font-light text-primary">before</span>{" "}
                you sign anything.
              </h1>

              <p className="rise rise-d2 font-display text-lg sm:text-xl text-ink leading-[1.35] mb-8 font-light">
                The complete guide to selling property in Australia. What it
                really costs, how agents price your home, the questions that
                catch bad agents out, and a week-by-week plan to settlement.
                Personalised to your suburb, free, in your inbox in 60 seconds.
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
                    "Agent commission and selling costs, state by state",
                    "The 10 questions that separate great agents from average ones",
                    "Auction vs private treaty: which suits your property",
                    "A printable 12-week selling timeline checklist",
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
            </div>
          </div>
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

          <div className="mt-12 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8 text-center">
            <p className="font-display text-xl sm:text-2xl text-ink mb-4">
              Ready when you are.
            </p>
            <a
              href="#get-the-guide"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-8 py-3.5 text-sm transition-colors"
            >
              Get the free guide
            </a>
            <p className="mt-3 text-xs text-ink-subtle">
              60 seconds, personalised to your suburb.
            </p>
          </div>
        </div>
      </section>

      <StickyGuideBar />
    </>
  );
}
