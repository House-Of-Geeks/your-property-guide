import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { FaqAccordion } from "@/components/guide";
import { RelatedGuidesSection } from "@/components/guide/GuideLinkList";
import { BuyingGuideFunnel } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { GuideEntryCapture } from "@/components/analytics/GuideEntryCapture";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { SITE_URL } from "@/lib/constants";
import { HG_DATES, HG_PRICE_CAPS, fmtCap } from "@/lib/data/home-guarantee";
import { HUB_GUIDE_LISTS, hubGuideGroups } from "@/lib/guides/hub-guides";
import { StickyGuideBar } from "../selling-guide/StickyGuideBar";
import { GuideContents } from "@/components/interactive/GuideContents";
import { GuideIntroNote } from "@/components/guide-book/GuideIntroNote";
import { GuidePitch as Pitch } from "@/components/guide-book/GuidePitch";
import { GUIDE_BOOKS, subtitleLine } from "@/lib/guide-books";

const META_TITLE = "Buying a home: a free guide to buying property in Australia (2026)";
const META_DESCRIPTION =
  "A free 10-chapter guide to buying a home in Australia: your budget, 2026 schemes by state, inspections, how homes are sold, offers and settlement. Read online or download the PDF.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/buying-guide` },
  openGraph: { ...DEFAULT_OG,
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    // The guide's own social card (scripts/brand/render-brand-assets.mjs, from /print/og?card=buying).
    images: [{ url: `${SITE_URL}/images/guide/buying-guide-og.jpg`, width: 1200, height: 630, alt: GUIDE_BOOKS.buying.title }],
  },
};


const FAQS = [
  {
    question: "Is the buying guide really free?",
    answer:
      "Yes. The guide is a free PDF and there's no charge for anything on Your Property Guide. Requesting it never passes your details to any agent, and we never sell them. If you later want a buyer's agent, that's a separate request with its own permission box; we're still building that network, so we'll tell you honestly whether we can introduce one. We don't introduce mortgage brokers.",
  },
  {
    question: "Which first home buyer schemes apply in 2026?",
    answer:
      `The big ones: the Australian Government 5% Deposit Scheme (no place caps and no income test since ${HG_DATES.expanded}, with city price caps like ${fmtCap(HG_PRICE_CAPS.NSW.capital)} in Greater Sydney and ${fmtCap(HG_PRICE_CAPS.QLD.capital)} in Greater Brisbane), Help to Buy shared equity from 2% deposit, the First Home Super Saver scheme, plus state grants and stamp duty concessions that differ in every state. Chapter 3 has the full 2026 table.`,
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

// The cover and the pitch under the hero's lede: under the funnel on
// phones, beside it (left column) on desktop.
function GuidePitch() {
  return (
    <Pitch
      guide="buying"
      lines={[
        "2026 schemes, grants and concessions, state by state",
        "What a lender may lend you, buffer included",
        "How price guides, auctions and off-market sales work",
        "A printable 12-week buying timeline",
      ]}
    >
      <p className="mt-6 text-[14px] text-ink-muted">
        10 chapters · 60-second form · Never shared with selling agents
      </p>
      <p className="mt-1 text-[14px] text-ink-muted">
        Want the steps now?{" "}
        <Link href="/guides/buying-property-australia" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          How to buy a house in Australia, step by step
        </Link>
      </p>
    </Pitch>
  );
}

export default function BuyingGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: GUIDE_BOOKS.buying.name, url: "/buying-guide" }]} />
      <FAQPageJsonLd faqs={FAQS} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DigitalDocument",
          name: `${GUIDE_BOOKS.buying.title} (2026 edition)`,
          description: META_DESCRIPTION,
          url: `${SITE_URL}/buying-guide`,
          image: `${SITE_URL}${GUIDE_BOOKS.buying.cover}`,
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

      {/* Hero, same layout as the selling guide, over the buying photo.
          Phones: headline, lede, then the funnel on the first screen, the
          pitch after it. Desktop: headline, lede and pitch left, the funnel
          right. The pitch is set once and placed twice (one per breakpoint)
          so each layout keeps its order. */}
      <div id="get-the-guide" className="scroll-mt-16">
        <PhotoHero
          photo="buying"
          size="lg"
          aside={
            <>
              {/* relative z-10: the suburb autocomplete's dropdown must
                  paint over whatever follows the card. data-funnel-card
                  drives the #get-the-guide:target ping (the buying funnel
                  card doesn't carry it on the anchor itself). */}
              <div id="guide-funnel" data-funnel-card className="relative z-10 rounded-xl scroll-mt-24">
                <Suspense fallback={<div className="tone-light h-64 rounded-xl border border-line bg-white" aria-busy="true" />}>
                  <BuyingGuideFunnel source="buying-guide-page" />
                </Suspense>
              </div>

              <div className="mt-6 px-1">
                <p className="text-sm font-semibold text-ink mb-2">What happens next</p>
                <ol className="space-y-1.5 text-sm text-ink-muted leading-snug list-decimal pl-5 marker:text-ink-subtle">
                  <li>Answer three quick questions</li>
                  <li>Download it straight away, or have it emailed</li>
                  <li>We point you at the chapters for your situation</li>
                </ol>
                <p className="mt-3 text-xs text-ink-subtle leading-relaxed">
                  Free. Requesting the guide never passes your details to any agent.
                </p>
              </div>

              <div className="lg:hidden mt-10">
                <GuidePitch />
              </div>
            </>
          }
        >
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-primary sm:mb-5">
            Free guide · 2026 edition
          </p>
          <HeroTitle>
            {`${GUIDE_BOOKS.buying.name}.`}
            <span className="mt-3 block font-display text-[0.5em] leading-snug tracking-[-0.025em] text-ink-muted">
              {subtitleLine(GUIDE_BOOKS.buying)}
            </span>
          </HeroTitle>
          {/* Phone-sized lede, as before: the funnel stays on the first screen. */}
          <HeroLead className="max-sm:mt-4 max-sm:text-base">
            A practical guide for your first home, your next one, an
            investment or a downsize. Ten chapters, in order: your budget,
            the schemes in your state, choosing an area, inspecting, how
            homes are marketed and sold, making an offer, finance and
            settlement.
          </HeroLead>
          <div className="hidden lg:block mt-12">
            <GuidePitch />
          </div>
        </PhotoHero>
      </div>

      {/* Chapter contents */}
      <Band>
        <div className="max-w-5xl">
          <GuideIntroNote guide="buying" className="max-w-3xl" />

          <div className="mt-16">
            <SectionHeading title="Read it online, chapter by chapter" />
          </div>

          <div className="mt-10 sm:mt-12" id="contents">
            <GuideContents guide="buying" />
          </div>

          <p className="mt-10 text-base text-ink-muted">
            Selling as well?{" "}
            <Link href="/selling-guide" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Selling a home
            </Link>{" "}
            covers the other half of the move, also free.
          </p>
        </div>
      </Band>

      {/* FAQ. Mirrors the FAQPageJsonLd above. */}
      <Band tone="quiet">
        <div className="max-w-3xl">
          <SectionHeading title="Questions buyers ask us" />
          <div className="mt-10 border-b border-line">
            <FaqAccordion items={FAQS} />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <a href="#get-the-guide" className={`${BUTTON_PRIMARY} justify-center`}>
              Get the free guide
            </a>
            <p className="text-sm text-ink-muted">
              Selling, not buying?{" "}
              <Link href="/selling-guide" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                Read Selling a home
              </Link>
            </p>
          </div>
        </div>
      </Band>

      {/* The process guides, below the sales flow: the page linked none of
          them until 30 Sep 2026. Titles come from the guide registry. */}
      <RelatedGuidesSection
        heading={HUB_GUIDE_LISTS["/buying-guide"].heading}
        intro={HUB_GUIDE_LISTS["/buying-guide"].intro}
        groups={hubGuideGroups(HUB_GUIDE_LISTS["/buying-guide"])}
      />

      <StickyGuideBar />
      {/* Records the ?from=<page slug> a guide CTA adds to this link in the
          attribution cookie, so the lead says which page sent it. */}
      <GuideEntryCapture />
    </>
  );
}
