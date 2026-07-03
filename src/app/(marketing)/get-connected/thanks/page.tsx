import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { ConversionTracker } from "@/components/journey/ConversionTracker";

export const metadata: Metadata = {
  title: "We're matching you with a specialist",
  description: "Your match request is in. A vetted specialist will be in touch within one business day.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ intent?: string; suburb?: string }>;
}

const INTENT_COPY: Record<string, { headline: string; what: string }> = {
  buying: {
    headline: "We're finding your buyer's agent.",
    what: "A buyer's agent who actively works in your target suburb and can run inspections, vet properties, and handle the bidding on your behalf.",
  },
  selling: {
    headline: "We're finding your selling agent.",
    what: "A local listing agent with current comparable sales evidence for your suburb and a clear plan for taking your property to market.",
  },
  investing: {
    headline: "We're finding your investment specialist.",
    what: "Someone who can model the numbers, the cash flow and growth outlook for the suburb, and the tax implications for your situation.",
  },
  refinancing: {
    headline: "We're finding your broker.",
    what: "A mortgage broker who can compare 30+ lenders, not just one bank, and tell you honestly which one will say yes to your situation.",
  },
  "something-else": {
    headline: "We're finding the right person.",
    what: "Whether that's a property accountant, conveyancer, family lawyer, or estate planner, we'll match you with the specialist who fits the situation, not the closest one to a sale.",
  },
  researching: {
    headline: "We've got your context.",
    what: "We'll point you at the right resource and a specialist if you want one. No pressure, no spam.",
  },
};

export default async function GetConnectedThanksPage({ searchParams }: PageProps) {
  const { intent, suburb } = await searchParams;
  const copy = (intent && INTENT_COPY[intent]) || {
    headline: "We're finding the right specialist.",
    what: "Someone vetted for your situation, your suburb, and your timing. You'll hear from them within one business day.",
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

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-cta text-white grid place-items-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
            Request received
          </p>
          <h1 className="font-display text-ink leading-[1.02] tracking-tight text-4xl sm:text-5xl mb-6 font-medium">
            {copy.headline}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-ink-muted leading-relaxed max-w-xl mx-auto">
            {copy.what}
            {suburbLabel ? ` Based in ${suburbLabel}.` : ""}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-4">
            What happens next
          </p>
          <ol className="space-y-5 mb-12">
            <li className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-surface-warm text-ink font-medium grid place-items-center text-sm">1</span>
              <div>
                <p className="font-medium text-ink">Your enquiry lands with our team.</p>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                  Every match is read and assigned by a person, never auto-routed. Check your inbox for a confirmation email in the next few minutes.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-surface-warm text-ink font-medium grid place-items-center text-sm">2</span>
              <div>
                <p className="font-medium text-ink">We pick one specialist, not five.</p>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                  No comparison spam, no bidding war for your enquiry. One vetted person with the right experience for your situation.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-surface-warm text-ink font-medium grid place-items-center text-sm">3</span>
              <div>
                <p className="font-medium text-ink">They reach out within one business day.</p>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                  Their profile arrives first, by email, so you know who you&rsquo;re talking to before the conversation starts.
                </p>
              </div>
            </li>
          </ol>

          <p className="text-xs font-sans uppercase tracking-[0.22em] text-ink-subtle mb-4">
            While you wait
          </p>
          <div className={`grid grid-cols-1 gap-4 ${crossSells.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {crossSells.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-line-warm bg-surface-warm p-5 hover:border-primary/50 transition-colors"
              >
                <p className="font-sans text-sm font-semibold text-ink group-hover:text-primary transition-colors mb-1.5">
                  {card.label}
                </p>
                <p className="font-sans text-xs text-ink-subtle leading-relaxed mb-3 flex-1">{card.sub}</p>
                <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary group-hover:translate-x-1 transition-[transform,translate,color] duration-200" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
