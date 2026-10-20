import type { Metadata } from "next";
import { Suspense } from "react";
import { BookCover } from "@/components/brand/BookCover";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { GuideEmailNote } from "@/components/journey/GuideThanksExtras";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { BUTTON_SECONDARY } from "@/components/premium/buttons";
import { BUYING_GUIDE_PDF_PATH } from "@/lib/guide-pdfs";
import { GUIDE_BOOKS } from "@/lib/guide-books";
import { availabilityNote } from "@/lib/introductions/rules";

export const metadata: Metadata = {
  title: "Your buying guide is ready",
  description: "Download your free guide to buying property in Australia.",
  robots: { index: false, follow: false },
};

interface PageProps {
  // Next 16 can deliver repeated params as arrays — normalise before use.
  searchParams: Promise<{ who?: string | string[]; stage?: string | string[]; suburb?: string | string[] }>;
}

// The buying guide is a learning request (14 Oct 2026): this page gives the
// guide and the next steps for where the buyer is up to. A buyer's agent is
// offered as a separate, honest choice; nothing here contacts anyone.
const STAGE_COPY: Record<string, string> = {
  starting: "Start with chapter 2 (working out your budget) and chapter 8 (finance and approval), then make a plan for the weeks ahead.",
  finance: "Pre-approval is the next step. Chapter 8 covers what it does and doesn’t mean, and chapter 2 the buffer lenders test you against.",
  searching: "With finance sorted, chapter 5 (inspecting a property) and chapter 6 (how homes are marketed and sold) are the ones to read before your next inspection.",
};

const pick = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function BuyingGuideThanksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const who = pick(sp.who);
  const stage = pick(sp.stage) ?? "starting";
  const suburbRaw = pick(sp.suburb);
  const suburb = suburbRaw && /^[a-z0-9-]+-[a-z]{2,3}-\d{4}$/.test(suburbRaw) ? suburbRaw : undefined;
  const state = suburb?.match(/-([a-z]{2,3})-\d{4}$/)?.[1];
  const body = STAGE_COPY[stage] ?? STAGE_COPY.starting;
  const buyerType = who === "first-home" ? "first-home" : who === "investing" ? "investing" : who === "downsizing" ? "downsizing" : "next-home";
  const bs = stage === "searching" ? "searching" : stage === "finance" ? "finance" : "starting";

  const planQs = new URLSearchParams({ j: "buying", bs, bt: buyerType, h: "unsure" });
  if (state) planQs.set("s", state);

  const nextSteps = [
    { href: `/plan/result?${planQs.toString()}`, label: "Your next-step plan", sub: "Your next three steps, a checklist and the questions to settle" },
    who === "first-home"
      ? { href: state ? `/guides/first-home-buyer-${state}` : "/guides/first-home-buyer-guide", label: "First home buyer rules", sub: "Grants, duty concessions and schemes for your state" }
      : { href: "/guides/due-diligence-checklist-buying-a-house", label: "Due diligence checklist", sub: "What to check before you commit" },
    { href: "/borrowing-power-calculator", label: "Borrowing power calculator", sub: "A rough idea of what a lender might lend" },
    { href: "/stamp-duty-calculator", label: "Stamp duty calculator", sub: "Duty on your purchase, with concessions" },
  ];

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="buying-guide" />
      </Suspense>

      <PhotoHero photo="buying">
        <div className="flex flex-col">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted mb-3">
            <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
            Your guide
          </p>
          <HeroTitle>Your guide is ready</HeroTitle>
          <HeroLead className="max-lg:text-base">{body}</HeroLead>

          <div className="tone-light mt-8 lg:mt-10 max-w-xl border-y border-line py-5 sm:py-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <BookCover guide="buying" eager className="w-[64px] sm:w-[84px]" sizes="90px" label={`Cover of ${GUIDE_BOOKS.buying.name}, 2026 edition`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink leading-snug">Your buying guide (PDF)</p>
                <p className="text-sm text-ink-muted mb-3">2026 edition, 10 chapters</p>
                <a
                  href={BUYING_GUIDE_PDF_PATH}
                  download
                  className="press w-full inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-cta-ink font-semibold px-4 py-3 text-base sm:text-sm transition-colors"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download the guide
                </a>
                <GuideEmailNote guide="buying" />
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
            <div className="rounded-xl bg-surface-warm p-6">
              <h2 className="text-xl font-bold text-ink">Thinking about a buyer’s agent?</h2>
              <p className="mt-2 text-base text-ink-muted leading-relaxed">
                Most people buy without one. A buyer’s agent acts only for you and charges you a fee. Downloading this guide doesn’t pass your details to anyone.
              </p>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{availabilityNote("buyers-agent", null).text}</p>
              <Link href="/buyers-agents" className={`mt-5 ${BUTTON_SECONDARY}`}>What a buyer’s agent does</Link>
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
