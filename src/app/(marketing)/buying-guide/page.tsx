import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { FaqAccordion } from "@/components/guide";
import { RelatedGuidesSection } from "@/components/guide/GuideLinkList";
import { BuyingGuideFunnel } from "@/components/journey";
import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { GuideEntryCapture } from "@/components/analytics/GuideEntryCapture";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { HG_DATES, HG_PRICE_CAPS, fmtCap } from "@/lib/data/home-guarantee";
import { HUB_GUIDE_LISTS, hubGuideGroups } from "@/lib/guides/hub-guides";
import { StickyGuideBar } from "../selling-guide/StickyGuideBar";
import { Book3D } from "@/components/interactive/Book3D";
import { GuideContents } from "@/components/interactive/GuideContents";
import { GuideIntroNote } from "@/components/guide-book/GuideIntroNote";
import { GUIDE_BOOKS } from "@/lib/guide-books";

const META_TITLE = "Free guide to buying property in Australia: beat the campaign (2026)";
const META_DESCRIPTION =
  "Every listing comes with a seller’s campaign. Beat it: what you can really spend, 2026 schemes state by state, and how not to overpay. Free, personalised to your situation.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/buying-guide` },
  openGraph: { ...DEFAULT_OG,
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
    <>
      <div className="flex items-start gap-5 sm:gap-6">
        <div className="shrink-0 pl-1 pt-1">
          <Book3D guide="buying" turn={18} className="[--bw:84px] sm:[--bw:120px] lg:[--bw:136px]" />
        </div>
        <ul className="space-y-3">
          {[
            "2026 schemes, grants and concessions, state by state",
            "What a lender may lend you, buffer included",
            "Underquoting and auction psychology, decoded",
            "A printable 12-week buying timeline",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm sm:text-base text-ink leading-snug">{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        10 chapters · 60-second form · Never shared with selling agents
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Want the steps now?{" "}
        <Link href="/guides/buying-property-australia" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          How to buy a house in Australia, step by step
        </Link>
      </p>
    </>
  );
}

export default function BuyingGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Free Buying Guide", url: "/buying-guide" }]} />
      <FAQPageJsonLd faqs={FAQS} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DigitalDocument",
          name: `${GUIDE_BOOKS.buying.title} (2026 edition)`,
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
          <p className="text-sm font-semibold text-ink-muted mb-3 sm:mb-5">
            Free PDF, 2026 edition
          </p>
          <HeroTitle>
            {GUIDE_BOOKS.buying.name}
            <span className="mt-3 block font-sans text-[0.42em] font-semibold leading-snug tracking-[-0.01em] text-ink-muted">
              {GUIDE_BOOKS.buying.subtitle}
            </span>
          </HeroTitle>
          {/* Phone-sized lede, as before: the funnel stays on the first screen. */}
          <HeroLead className="max-sm:mt-4 max-sm:text-base">
            Every seller&rsquo;s agent is running a campaign aimed at you.
            Ten chapters show you how it works, so you can run your own,
            whether it&rsquo;s your first home, your next one, an investment
            or a downsize: what you can really spend, the schemes in your
            state, inspecting, the seller&rsquo;s playbook and making the
            offer.
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
              The selling guide
            </Link>{" "}
            is the other half of the move, also free.
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
                There&rsquo;s a selling guide too
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
