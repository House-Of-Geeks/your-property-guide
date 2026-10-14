import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { FaqAccordion } from "@/components/guide";
import { SellingGuideFunnel } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { GuideEntryCapture } from "@/components/analytics/GuideEntryCapture";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
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
      "By helping you make the big decisions with evidence. Chapter 3 lists every cost of selling in your state, so you can see what's negotiable. Chapter 5 gives you the questions to ask every agent, so you can compare them on their sales evidence, their fee and their plan rather than on the highest price estimate. Chapter 4 covers which repairs and presentation jobs tend to be worth doing, and which usually aren't. What it saves you depends on your sale.",
  },
  {
    question: "Is the selling guide really free?",
    answer:
      "Yes. The guide is a free PDF, and there's no charge for anything on Your Property Guide. Requesting the guide never passes your details to an agent. If you later want an appraisal, that's a separate request with its own permission box; the agent we introduce pays us for the introduction, and you never do.",
  },
  {
    question: "Will I get spammed by agents if I download it?",
    answer:
      "No. Downloading the guide doesn't pass your details to any agent. We email you the guide and nothing else, unless you tick the box for a short series of tips. An introduction only happens if you ask for one separately and tick the permission box, and then it goes to one agent only. If you're already listed with an agent, we won't introduce another.",
  },
  {
    question: "What does it cost to sell a house in Australia?",
    answer:
      "Plan for 3 to 5 percent of your sale price all-in. Agent commission runs roughly 1.6 to 3 percent depending on your state and suburb, marketing $2,000 to $10,000, conveyancing $800 to $2,500, plus any styling, repairs and lender fees. Chapter 3 of the guide breaks every cost down by state.",
  },
  {
    question: "Do I need an agent to sell my house?",
    answer:
      "No, private sales are legal in every state. Most Australian sellers use an agent, mostly for pricing evidence, buyer reach and negotiation. The guide covers both routes, including when selling it yourself makes sense.",
  },
];

// The cover and the pitch under the hero's lede: under the funnel on
// phones, beside it (left column) on desktop. Figures are the guide's own.
function GuidePitch() {
  return (
    <>
      <div className="flex items-start gap-5 sm:gap-6">
        <Image
          src="/images/guide/selling-guide-cover.png"
          alt="The Complete Guide to Selling Your Property in Australia, 2026 edition"
          width={168}
          height={238}
          className="block shrink-0 w-[88px] sm:w-[132px] lg:w-[150px] h-auto rounded-md shadow-[0_12px_28px_rgb(22_25_29/0.28)]"
        />
        <ul className="space-y-3">
          {[
            "The questions to ask every agent before you sign",
            "Commission by state, and how to negotiate it",
            "Which repairs and presentation jobs are worth paying for",
            "A 12-week timeline you can print",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm sm:text-base text-ink leading-snug">{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        10 chapters · Three quick questions · Download straight away or by email
      </p>
      <p className="mt-1 text-xs text-ink-subtle">
        General information, not advice. Costs and rules are by state, with sources.
      </p>
    </>
  );
}

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

      {/* Hero, over the selling photo. Phones: headline, the lede, then the
          funnel, so the form is on the first screen; the cover and the
          pitch follow it. Desktop: headline, lede and pitch on the left, the
          funnel beside them on the right. The funnel card is the point of
          the page. The pitch is set once and placed twice (one per
          breakpoint) so each layout keeps its order. #get-the-guide wraps
          the hero for the sticky bar and the anchor-arrival pulse. */}
      <div id="get-the-guide" className="scroll-mt-16">
        <PhotoHero
          photo="selling"
          size="lg"
          aside={
            <>
              {/* relative z-10: the suburb autocomplete's dropdown must
                  paint over whatever follows the card. */}
              <div id="guide-funnel" className="relative z-10 scroll-mt-24">
                <Suspense fallback={<div className="tone-light h-64 rounded-xl border border-line bg-white" aria-busy="true" />}>
                  <SellingGuideFunnel source="selling-guide-page" />
                </Suspense>
              </div>

              <div className="mt-6 px-1">
                <p className="text-sm font-semibold text-ink mb-2">What happens next</p>
                <ol className="space-y-1.5 text-sm text-ink-muted leading-snug list-decimal pl-5 marker:text-ink-subtle">
                  <li>Answer three quick questions about where and when</li>
                  <li>Download it straight away, or have it emailed</li>
                  <li>Want an appraisal later? That&rsquo;s a separate request, only if you ask</li>
                </ol>
                <p className="mt-3 text-xs text-ink-subtle leading-relaxed">
                  The guide is free. If you later ask for an agent, they pay us
                  for the introduction; it doesn&rsquo;t change what you pay them.
                </p>
              </div>

              <div className="lg:hidden mt-10">
                <GuidePitch />
              </div>
            </>
          }
        >
          <p className="text-sm font-semibold text-ink-muted mb-3 sm:mb-5">
            Free PDF, 2026 edition
          </p>
          <HeroTitle>The free guide to selling your property</HeroTitle>
          {/* Phone-sized lede, as before: the funnel stays on the first screen. */}
          <HeroLead className="max-sm:mt-4 max-sm:text-base">
            Ten chapters, in order: whether and when to sell, what your
            property is worth, the real costs in your state, preparing it,
            choosing an agent, and the campaign through to settlement.
            Answer three questions and we&rsquo;ll point you to the
            chapters for your stage.
          </HeroLead>
          <div className="hidden lg:block mt-12">
            <GuidePitch />
          </div>
        </PhotoHero>
      </div>

      {/* Chapter contents. Doubles as the SEO body for "selling property
          guide" queries and as proof the guide is a real document. */}
      <Band>
        <div className="max-w-5xl">
          <SectionHeading title="Ten chapters, no filler" />

          {/* CSS columns so chapters 1 to 5 read down the left column. */}
          <ol className="mt-10 sm:mt-12 sm:columns-2 sm:gap-x-10 border-b border-line">
            {CHAPTERS.map((c, i) => (
              <li key={c.title} className="flex items-start gap-4 border-t border-line py-4 break-inside-avoid">
                <span className="w-6 shrink-0 text-base font-semibold text-ink-subtle leading-6">{i + 1}</span>
                <div>
                  <p className="text-base font-semibold text-ink leading-6">{c.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted leading-snug">{c.sub}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <p className="text-base text-ink-muted mb-3">
              Prefer to read on the site first? The guide pulls these together:
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base">
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
      </Band>

      {/* FAQ. Mirrors the FAQPageJsonLd above. */}
      <Band tone="quiet">
        <div className="max-w-3xl">
          <SectionHeading title="Questions sellers ask us" />
          <div className="mt-10 border-b border-line">
            <FaqAccordion items={FAQS} />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <a href="#get-the-guide" className={`${BUTTON_PRIMARY} justify-center`}>
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
      </Band>

      <StickyGuideBar />
      {/* Records the ?from=<page slug> a guide CTA adds to this link in the
          attribution cookie, so the lead says which page sent it. */}
      <GuideEntryCapture />
    </>
  );
}
