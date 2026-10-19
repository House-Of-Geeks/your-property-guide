import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { GuideEmailNote } from "@/components/journey/GuideThanksExtras";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { BUTTON_SECONDARY } from "@/components/premium/buttons";
import { GUIDE_PDF_PATH } from "@/lib/guide-pdfs";
import { FEE_DISCLOSURE, HOW_WE_ARE_PAID_HREF } from "@/lib/service-model";

export const metadata: Metadata = {
  title: "Your selling guide is ready",
  description: "Download your free guide to selling property in Australia.",
  robots: { index: false, follow: false },
};

interface PageProps {
  // Next 16 can deliver repeated params as arrays — normalise before use.
  searchParams: Promise<{ score?: string | string[]; suburb?: string | string[]; }>;
}

// Copy keyed to where the seller is up to. The guide is a learning request
// (14 Oct 2026): this page gives the guide and the next steps, and offers
// personal help as a separate choice. Nothing here contacts an agent.
const SCORE_COPY: Record<string, { headline: string; body: string; timeframe?: string; stage: string }> = {
  hot: {
    headline: "Your guide is ready",
    body: "Selling within three months means pricing, presentation and agent choice are all still open. Start with chapter 3 (the costs) and chapter 5 (choosing your agent), then use the worksheet to compare the agents you meet.",
    timeframe: "0-3-months",
    stage: "preparing",
  },
  warm: {
    headline: "Your guide is ready",
    body: "Three to six months out gives you time to prepare properly. Start with chapter 3 (the costs) and chapter 4 (preparing your property), and make a plan for the weeks ahead.",
    timeframe: "3-6-months",
    stage: "preparing",
  },
  cold: {
    headline: "Your guide is ready",
    body: "No rush at your end, so take your time with it. Chapter 1 covers how to read the market and pick your moment. The rest will be here when you need it.",
    stage: "thinking",
  },
  listed: {
    headline: "Your guide is ready",
    body: "Since you’re already listed, go straight to chapter 7 (marketing) and chapter 8 (offers and negotiation). As promised, your details won’t be passed to any agent.",
    stage: "listed",
  },
};

export default async function SellingGuideThanksPage({ searchParams }: PageProps) {
  const { score: scoreParam, suburb: suburbParam } = await searchParams;
  const score = typeof scoreParam === "string" ? scoreParam : undefined;
  const suburbRaw = typeof suburbParam === "string" ? suburbParam : undefined;
  const suburb = suburbRaw && /^[a-z0-9-]+-[a-z]{2,3}-\d{4}$/.test(suburbRaw) ? suburbRaw : undefined;
  const copy = SCORE_COPY[score ?? ""] ?? SCORE_COPY.cold;
  const state = suburb?.match(/-([a-z]{2,3})-\d{4}$/)?.[1];
  const suburbLabel = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  const listed = score === "listed";

  const planQs = new URLSearchParams({ j: "selling", ss: copy.stage });
  if (state) planQs.set("s", state);
  if (copy.timeframe) planQs.set("t", copy.timeframe);
  const helpQs = new URLSearchParams({ service: "selling-agent", from: "selling-guide-thanks" });
  if (suburb) helpQs.set("suburb", suburb);
  if (copy.timeframe) helpQs.set("timeframe", copy.timeframe);

  const nextSteps = [
    { href: `/plan/result?${planQs.toString()}`, label: "Your next-step plan", sub: "Your next three steps, a checklist and the questions to settle" },
    listed
      ? { href: "/guides/cooling-off-period-by-state-australia", label: "Cooling-off periods by state", sub: "Know the contract rules before the offers arrive" }
      : { href: "/tools/agent-proposal-worksheet", label: "Agent proposal worksheet", sub: "Compare agents’ proposals side by side, in dollars" },
    { href: "/selling-costs-calculator", label: "Selling costs calculator", sub: "What you’d keep after commission, marketing and conveyancing" },
    { href: suburb ? `/suburbs/${suburb}` : "/suburbs", label: suburbLabel ? `${suburbLabel} profile` : "Your suburb profile", sub: "Recent prices and data, with sources" },
  ];

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="selling-guide" />
      </Suspense>

      <PhotoHero photo="kitchen">
        <div className="flex flex-col">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted mb-3">
            <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
            Your guide
          </p>
          <HeroTitle>{copy.headline}</HeroTitle>
          <HeroLead className="max-lg:text-base">{copy.body}</HeroLead>

          <div className="tone-light mt-8 lg:mt-10 max-w-xl rounded-xl border border-line bg-white p-5 sm:p-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <Image
                src="/images/guide/selling-guide-cover.png"
                alt="The Complete Guide to Selling Your Property in Australia, 2026 edition"
                width={190}
                height={269}
                className="shrink-0 w-[64px] sm:w-[84px] h-auto rounded shadow-[0_6px_16px_rgb(22_25_29/0.22)]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink leading-snug">Your selling guide (PDF)</p>
                <p className="text-sm text-ink-muted mb-3">2026 edition, 10 chapters</p>
                <a
                  href={GUIDE_PDF_PATH}
                  download
                  className="press w-full inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-white font-semibold px-4 py-3 text-base sm:text-sm transition-colors"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download the guide
                </a>
                <GuideEmailNote guide="selling" />
              </div>
            </div>
          </div>
        </div>
      </PhotoHero>

      <Band spacing="compact">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading size="md" title="Your next steps" />
            <ul className="mt-8 grid grid-cols-1 gap-x-10 border-t border-line sm:grid-cols-2">
              {nextSteps.map((card) => (
                <li key={card.href} className="border-b border-line">
                  <Link href={card.href} className="group flex items-start justify-between gap-3 py-5">
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-ink group-hover:underline underline-offset-4">{card.label}</span>
                      <span className="block text-sm text-ink-muted leading-snug mt-0.5">{card.sub}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            {listed ? (
              <div className="rounded-xl bg-surface-warm p-6">
                <h2 className="text-xl font-bold text-ink">We won’t introduce another agent</h2>
                <p className="mt-2 text-base text-ink-muted leading-relaxed">
                  You’re signed with an agent, so your details stay with us. If you’re buying your next place too, the buying guides and tools are here.
                </p>
                <Link href="/buying-and-selling" className={`mt-5 ${BUTTON_SECONDARY}`}>Buying and selling</Link>
              </div>
            ) : (
              <div className="rounded-xl bg-surface-warm p-6">
                <h2 className="text-xl font-bold text-ink">When you want an appraisal</h2>
                <p className="mt-2 text-base text-ink-muted leading-relaxed">
                  We can introduce one participating local agent for a free appraisal. It’s a separate request with its own permission box: downloading this guide doesn’t pass your details to anyone.
                </p>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  {FEE_DISCLOSURE}{" "}
                  <Link href={HOW_WE_ARE_PAID_HREF} className="underline underline-offset-4">How we’re paid</Link>
                </p>
                <Link href={`/get-help?${helpQs.toString()}`} className={`mt-5 ${BUTTON_SECONDARY}`}>
                  Ask for an appraisal introduction
                </Link>
              </div>
            )}
          </div>
        </div>
      </Band>
    </>
  );
}
