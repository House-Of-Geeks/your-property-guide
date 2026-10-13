import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { ThanksPhoneAsk } from "@/components/forms/ThanksPhoneAsk";
import { BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading, StepTimeline } from "@/components/premium";

export const metadata: Metadata = {
  title: "Appraisal request received",
  description: "Your free property appraisal request is in. A local agent will be in touch within one business day.",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    title: "A local agent reads your details.",
    body: "Someone who actively sells in your area, with current comparable sales evidence.",
  },
  {
    title: "They reach out within one business day.",
    body: "By phone or email, your choice. They’ll talk you through what your home is realistically worth and the comparable sales backing the number.",
  },
  {
    title: "You decide what to do next.",
    body: "No pressure to list with them. The appraisal is yours to keep, whether you sell now, later, or not at all.",
  },
] as const;

interface PageProps {
  searchParams: Promise<{ suburb?: string }>;
}

export default async function AppraisalThanksPage({ searchParams }: PageProps) {
  const { suburb } = await searchParams;
  const suburbLabel = suburb ? suburb.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null;

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="appraisal" />
      </Suspense>

      <PhotoHero photo="kitchen">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted mb-3">
          <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
          Request received
        </p>
        <HeroTitle>Your appraisal is on the way</HeroTitle>
        <HeroLead>
          We&rsquo;ve received your request{suburbLabel ? ` for ${suburbLabel}` : ""}.
          Look for a confirmation in your inbox in the next few minutes, and a call
          or email from a local agent within one business day.
        </HeroLead>
        {/* Renders only when the submitting form left a lead id in
            sessionStorage (phone-less appraisal requests, e.g. the
            suburb-page inline CTA). A white card, so it resets the
            hero's dark tone. */}
        <div className="tone-light [&>div]:mx-0">
          <ThanksPhoneAsk
            source="appraisal-thanks"
            prompt="Appraisals move fastest over the phone — add your mobile and the agent will call you first."
          />
        </div>
      </PhotoHero>

      <Band>
        <div className="max-w-3xl">
          <SectionHeading size="md" title="What happens next" />
          <StepTimeline steps={STEPS} />
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="max-w-3xl flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          <p className="text-lg text-ink">
            While you wait, browse what&rsquo;s on the market in your area.
          </p>
          <Link
            href={suburb ? `/suburbs/${suburb}` : "/suburbs"}
            className={`${BUTTON_SECONDARY} shrink-0 justify-center`}
          >
            {suburbLabel ? `See ${suburbLabel} listings` : "Explore suburbs"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Band>
    </>
  );
}
