import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading, StepTimeline } from "@/components/premium";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { AGREEMENT_CHECK } from "@/lib/service-model";

// After an agreement check request (15 Oct 2026). Counted once as a
// lead_conversion (ConversionTracker), with lead_type "agreement-check".

export const metadata: Metadata = {
  title: "Agreement check request received",
  description: "Your free agreement check request is in. Someone from our team will call you to go through the agreement.",
  robots: { index: false, follow: false },
};

const STEPS = [
  { title: "Find the agreement", body: "Have it in front of you, or the email it came in, so we can go through it clause by clause." },
  { title: "We call you", body: "Someone from our team calls to go through the commission, the marketing spend, the term and the exit clause." },
  { title: "You decide", body: "What to sign, what to ask the agent to change, or whether to keep looking. It’s your call." },
] as const;

export default function AgreementCheckThanksPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="agreement-check" />
      </Suspense>

      <PhotoHero photo="paperwork">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted">
          <CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />
          Request received
        </p>
        <HeroTitle>We’ll call you about your agreement</HeroTitle>
        <HeroLead>
          {`Look for a confirmation in your inbox in the next few minutes. If you’re signing soon and haven’t heard from us, call ${CONTACT_PHONE_DISPLAY}.`}
        </HeroLead>
        <a href={`tel:${CONTACT_PHONE_E164}`} className={`${BUTTON_SECONDARY} mt-8`}>
          Call {CONTACT_PHONE_DISPLAY}
        </a>
      </PhotoHero>

      <Band>
        <div className="max-w-3xl">
          <SectionHeading size="md" title="What happens next" />
          <StepTimeline steps={STEPS} />
          <p className="mt-10 text-base leading-relaxed text-ink-muted">{AGREEMENT_CHECK.notAdvice}</p>
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <p className="text-lg text-ink">While you wait, see what selling will really cost you.</p>
          <Link href="/selling-costs-calculator?from=agreement-check" className={`${BUTTON_SECONDARY} shrink-0`}>
            Selling costs calculator <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Band>
    </>
  );
}
