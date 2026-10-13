import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, SectionHeading, StepTimeline } from "@/components/premium";

export const metadata: Metadata = {
  title: "Your request is in",
  description: "Your request is in. Our team will be in touch within one business day.",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    title: "Your enquiry lands with our team.",
    body: "Every request is read by a person, never auto-routed. Check your inbox for a confirmation email in the next few minutes.",
  },
  {
    title: "Selling? One local agent, not five.",
    body: "No comparison spam, no bidding war for your enquiry. If we don’t have an agent in your area yet, we’ll tell you.",
  },
  {
    title: "We’re in touch within one business day.",
    body: "By phone or email. No commitment until you decide to take the next step.",
  },
] as const;

interface PageProps {
  searchParams: Promise<{ intent?: string; suburb?: string }>;
}

// Promise only what exists: sellers get one local agent; every other intent
// gets pointed to the right next step by our team. No broker, accountant or
// specialist matches, and no agent profile emails (the directory is paused).
const INTENT_COPY: Record<string, { headline: string; what: string }> = {
  buying: {
    headline: "We'll point you to the right next step.",
    what: "Our team will look at where and when you're buying and point you to the guide, scheme or calculator that fits your situation.",
  },
  selling: {
    headline: "We're finding your local agent.",
    what: "One local agent who sells in your area. If we don't have one yet, we'll tell you.",
  },
  investing: {
    headline: "We'll point you to the right next step.",
    what: "Our team will look at what you're weighing up and point you to the guide or calculator that fits, and to one local agent if you're selling.",
  },
  refinancing: {
    headline: "We'll point you to the right next step.",
    what: "Our team will look at what you're trying to do with your loan and point you to the tools and guides that answer it.",
  },
  "something-else": {
    headline: "We'll point you to the right next step.",
    what: "A person reads every situation like this one. If a sale is part of it, that next step can be one local agent who sells in your area.",
  },
  researching: {
    headline: "We've got your context.",
    what: "We'll point you at the right resource. No pressure, no spam.",
  },
};

export default async function GetConnectedThanksPage({ searchParams }: PageProps) {
  const { intent, suburb } = await searchParams;
  const copy = (intent && INTENT_COPY[intent]) || {
    headline: "We've got your request.",
    what: "Our team will be in touch within one business day.",
  };
  // The suburb param is a full slug ("bondi-nsw-2026") — strip the
  // state-postcode suffix before titlecasing so copy reads "Bondi".
  const suburbLabel = suburb
    ? suburb.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  // Cross-sell cards for the wait: the suburb they told us about, the
  // commission calculator (most match requests are sale-adjacent), and
  // the guides library.
  const crossSells = [
    ...(suburb
      ? [
          {
            href: `/suburbs/${suburb}`,
            label: `${suburbLabel} profile`,
            sub: "Median prices, growth and days on market",
          },
        ]
      : []),
    {
      href: "/real-estate-commission-calculator",
      label: "Commission calculator",
      sub: "See what an agent would cost on your sale price",
    },
    {
      href: "/guides",
      label: "Browse the guides",
      sub: "Plain-English guides to buying, selling and investing",
    },
  ];

  return (
    <>
      <Suspense fallback={null}>
        <ConversionTracker flow="get-connected" />
      </Suspense>

      <PhotoHero photo="verandah">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted mb-3">
          <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
          Request received
        </p>
        <HeroTitle>{copy.headline}</HeroTitle>
        <HeroLead>
          {copy.what}
          {suburbLabel ? ` Based in ${suburbLabel}.` : ""}
        </HeroLead>
      </PhotoHero>

      <Band>
        <div className="max-w-3xl">
          <SectionHeading size="md" title="What happens next" />
          <StepTimeline steps={STEPS} />
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <SectionHeading size="md" title="While you wait" />
        <RuleGrid columns={crossSells.length === 3 ? 3 : 2} className="mt-10">
          {crossSells.map((card) => (
            <li key={card.href} className="border-t-2 border-ink">
              <Link href={card.href} className="group block pt-6">
                <span className="block text-xl font-semibold text-ink group-hover:text-primary transition-colors">
                  {card.label}
                </span>
                <span className="block mt-2 text-base text-ink-muted leading-relaxed">{card.sub}</span>
                <ArrowRight className="mt-4 w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </RuleGrid>
      </Band>
    </>
  );
}
