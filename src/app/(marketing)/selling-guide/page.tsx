import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { FaqAccordion } from "@/components/guide";
import { SellingGuideFunnel } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { GuideEntryCapture } from "@/components/analytics/GuideEntryCapture";
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
  { title: "Is now the right time to sell?", sub: "Market conditions, seasonality, sell-first vs buy-first" },
  { title: "What your property is really worth", sub: "Appraisals vs valuations, how agents price, underquoting traps" },
  { title: "The real cost of selling", sub: "Commission by state, marketing, conveyancing, the lot" },
  { title: "Preparing your property", sub: "The fixes that pay for themselves, and the ones that don't" },
  { title: "Choosing your agent", sub: "The 10 interview questions, fee negotiation, agreement types" },
  { title: "Auction vs private treaty vs off-market", sub: "Which method fits your property and state" },
  { title: "Marketing that actually sells", sub: "Portals, photography, copy, open homes" },
  { title: "Offers, negotiation and exchange", sub: "Cooling-off, conditions, reading buyer signals" },
  { title: "Legals and settlement", sub: "Contracts, vendor statements, conveyancer vs solicitor" },
  { title: "Your 12-week selling timeline", sub: "A printable week-by-week checklist" },
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
      "Yes. The guide is a free PDF, and there's no charge for anything on Your Property Guide. Unless you tell us you're already listed, we may also pass your details to one local agent when you request it. The agent pays us for that introduction, you never do, and the form tells you this before you submit.",
  },
  {
    question: "Will I get spammed by agents if I download it?",
    answer:
      "No. Your details only go to an agent if you're a genuine seller and you've agreed to it on the form. They go to one local agent only, and we never sell them to anyone else. If you're already listed with an agent, we don't share your details at all.",
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

      {/* Hero. Phones: headline, the lede, then the funnel, so the form is
          on the first screen; the cover and the pitch follow it. Desktop:
          headline and pitch on the left, the funnel beside them on the
          right (it spans both rows and stays in view while the pitch is
          read). The funnel card is the point of the page. */}
      <section id="get-the-guide" className="bg-surface-warm border-b border-line scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-x-12 gap-y-6 sm:gap-y-8 items-start">
            <div className="lg:col-span-6 lg:row-start-1">
              <p className="text-sm font-semibold text-ink-muted mb-3 sm:mb-5">
                Free PDF, 2026 edition
              </p>
              <h1 className="font-display text-ink tracking-[-0.035em] text-[2.125rem] leading-[1.05] sm:text-5xl lg:text-6xl lg:leading-[1.02] font-bold">
                The agent you pick is a $20,000 decision
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-xl text-ink leading-normal sm:leading-[1.4]">
                On a typical sale, the gap between a strong agent and an
                average one runs five figures. This free guide shows you how
                to tell them apart, what selling really costs, and where to
                claw thousands back. Ten chapters, personalised to your
                suburb, in your inbox in 60 seconds.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
              {/* relative z-10: the suburb autocomplete's dropdown must
                  paint over whatever follows the card. */}
              <div id="guide-funnel" className="relative z-10 scroll-mt-24">
                <Suspense fallback={<div className="h-64 rounded-xl border border-line bg-white" aria-busy="true" />}>
                  <SellingGuideFunnel source="selling-guide-page" />
                </Suspense>
              </div>

              <div className="mt-5 px-1">
                <p className="text-sm font-semibold text-ink mb-2">What happens next</p>
                <ol className="space-y-1.5 text-sm text-ink-muted leading-snug list-decimal pl-5 marker:text-ink-subtle">
                  <li>Answer seven quick questions, about 60 seconds</li>
                  <li>Download instantly, plus a copy lands in your inbox</li>
                  <li>Selling soon? A free local appraisal, only if you want one</li>
                </ol>
                <p className="mt-3 text-xs text-ink-subtle leading-relaxed">
                  The guide is free. If you later ask for an agent, they pay us
                  for the introduction; it doesn&rsquo;t change what you pay them.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 lg:row-start-2">
              <div className="flex items-start gap-5 sm:gap-6">
                <Image
                  src="/images/guide/selling-guide-cover.png"
                  alt="The Complete Guide to Selling Your Property in Australia, 2026 edition"
                  width={168}
                  height={238}
                  priority
                  className="block shrink-0 w-[88px] sm:w-[132px] lg:w-[150px] h-auto rounded-md shadow-[0_12px_28px_rgb(22_25_29/0.28)]"
                />
                <ul className="space-y-3">
                  {[
                    "The 10 questions that expose an average agent before you sign",
                    "Fee negotiation that typically saves $1,700 to $3,400",
                    "Presentation moves that return 3 to 10 times their cost",
                    "The 60-day trap that quietly discounts stale listings",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-ink shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm sm:text-base text-ink leading-snug">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 text-sm text-ink-muted">
                10 chapters · 60-second form · One agent, never a list
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                Figures are typical ranges from the guide, chapters 3 to 5. Your sale will vary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter contents. Doubles as the SEO body for "selling property
          guide" queries and as proof the guide is a real document. */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="font-display text-ink tracking-[-0.02em] text-[1.75rem] sm:text-4xl leading-tight font-bold mb-6 sm:mb-8">
            Ten chapters, no filler
          </h2>

          {/* CSS columns so chapters 1 to 5 read down the left column. */}
          <ol className="sm:columns-2 sm:gap-x-10 border-b border-line">
            {CHAPTERS.map((c, i) => (
              <li key={c.title} className="flex items-start gap-3 border-t border-line py-3.5 break-inside-avoid">
                <span className="w-5 shrink-0 text-sm text-ink-subtle leading-6">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-ink leading-6">{c.title}</p>
                  <p className="text-sm text-ink-muted leading-snug">{c.sub}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <p className="text-sm text-ink-muted mb-3">
              Prefer to read on the site first? The guide pulls these together:
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[
                ["/guides/how-to-sell-a-house-australia", "How to sell a house"],
                ["/guides/real-estate-agent-fees-australia", "Agent fees by state"],
                ["/guides/cost-of-selling-a-house-australia", "The cost of selling"],
                ["/real-estate-commission-calculator", "Commission calculator"],
                ["/appraisal", "Free appraisal"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ. Mirrors the FAQPageJsonLd above. */}
      <section className="bg-surface-warm border-t border-line">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="font-display text-ink tracking-[-0.02em] text-[1.75rem] sm:text-4xl leading-tight font-bold mb-6 sm:mb-8">
            Questions sellers ask us
          </h2>
          <div className="border-b border-line">
            <FaqAccordion items={FAQS} />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <a
              href="#get-the-guide"
              className="inline-flex items-center justify-center rounded-md bg-cta hover:bg-cta-hover text-white font-semibold px-6 py-3 transition-colors"
            >
              Get the free guide
            </a>
            <p className="text-sm text-ink-muted">
              Buying, not selling?{" "}
              <Link href="/buying-guide" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                There&rsquo;s a buying guide too
              </Link>
            </p>
          </div>
        </div>
      </section>

      <StickyGuideBar />
      {/* Records the ?from=<page slug> a guide CTA adds to this link in the
          attribution cookie, so the lead says which page sent it. */}
      <GuideEntryCapture />
    </>
  );
}
