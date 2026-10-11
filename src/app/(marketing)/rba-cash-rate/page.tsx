import type { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, TrendingUp, Minus, ArrowRight, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Sources } from "@/components/guide/Sources";
import { AVERAGE_NEW_VARIABLE_RATE, AVERAGE_OUTSTANDING_VARIABLE_RATE, F6_SOURCE } from "@/lib/data/rba-lending-rates";
import {
  CASH_RATE_DECISIONS,
  CASH_RATE_SOURCE,
  DECISION_TIME,
  MEETING_SCHEDULE_SOURCE,
  formatLongDate,
  formatShortDate,
  latestDecision,
  upcomingMeetings,
  type CashRateDecision,
} from "@/lib/data/rba-cash-rate";

export const metadata: Metadata = {
  title: "RBA Cash Rate History & Property Market Impact",
  description:
    "Track the RBA cash rate history and understand how interest rate changes affect Australian property prices. Updated with each RBA decision.",
  alternates: { canonical: `${SITE_URL}/rba-cash-rate` },
  openGraph: {
    url: `${SITE_URL}/rba-cash-rate`,
    title: `RBA Cash Rate History & Property Market Impact | ${SITE_NAME}`,
    description:
      "Track the RBA cash rate history and understand how interest rate changes affect Australian property prices.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

// Every figure on this page comes from src/lib/data/rba-cash-rate.ts, which a
// test keeps up to date with the RBA's meeting schedule. Rebuilt daily so the
// "next decision" line moves on after each meeting.
export const revalidate = 86400;

/** The day this page's data was last checked against the RBA and edited. */
const PAGE_UPDATED = "2026-10-11";

function decisionLabel(change: number): string {
  if (change > 0) return "Hike";
  if (change < 0) return "Cut";
  return "Hold";
}

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];

/** "Raised 0.25 points on 29 September 2026, the fourth rise this year." */
function latestSummary(d: CashRateDecision): string {
  const year = Number(d.announced.slice(0, 4));
  const inYear = CASH_RATE_DECISIONS.filter((x) => x.announced.startsWith(`${year}-`) && x.announced <= d.announced);
  const pts = Math.abs(d.change).toFixed(2);
  if (d.change > 0) {
    const n = inYear.filter((x) => x.change > 0).length;
    return `Raised ${pts} points on ${formatLongDate(d.announced)}, the ${ORDINALS[n - 1] ?? `${n}th`} rise in ${year}`;
  }
  if (d.change < 0) {
    const n = inYear.filter((x) => x.change < 0).length;
    return `Cut ${pts} points on ${formatLongDate(d.announced)}, the ${ORDINALS[n - 1] ?? `${n}th`} cut in ${year}`;
  }
  return `Held at ${d.rate.toFixed(2)}% on ${formatLongDate(d.announced)}`;
}

function NoteChip({ note }: { note: string }) {
  if (note === "Cut") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <TrendingDown className="w-3 h-3" />
        {note}
      </span>
    );
  }
  if (note === "Hike") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <TrendingUp className="w-3 h-3" />
        Hike
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      <Minus className="w-3 h-3" />
      Hold
    </span>
  );
}

function ChangeCell({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="text-red-600 font-medium">+{change.toFixed(2)}%</span>
    );
  }
  if (change < 0) {
    return (
      <span className="text-green-600 font-medium">{change.toFixed(2)}%</span>
    );
  }
  return <span className="text-gray-400">-</span>;
}

export default function RBACashRatePage() {
  const currentRate = latestDecision();
  const recentHistory = CASH_RATE_DECISIONS.slice(0, 20);
  const upcoming = upcomingMeetings();
  const next = upcoming[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "RBA Cash Rate", url: "/rba-cash-rate" }]} />
      <GuideArticleJsonLd
        title={`RBA Cash Rate History & Property Market Impact | ${SITE_NAME}`}
        description="Track the RBA cash rate history and understand how interest rate changes affect Australian property prices. Updated with each RBA decision."
        url="/rba-cash-rate"
        datePublished="2026-01-01"
        dateModified={PAGE_UPDATED}
      />
      <Breadcrumbs items={[{ label: "RBA Cash Rate" }]} />

      {/* Hero, Current Rate */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          RBA Cash Rate History &amp; Property Market Impact
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Track every Reserve Bank of Australia cash rate decision and understand how interest
          rate changes flow through to Australian property prices.
        </p>
      </div>

      {/* Current rate display */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="gradient-brand rounded-2xl p-8 text-white text-center">
          <p className="text-sm opacity-80 mb-1">RBA cash rate target</p>
          <p className="text-7xl font-bold tracking-tight mb-2">
            {currentRate.rate.toFixed(2)}%
          </p>
          <p className="text-base opacity-90">
            Effective {formatLongDate(currentRate.effective)}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm">
            {currentRate.change > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : currentRate.change < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            {latestSummary(currentRate)}
          </div>
          {next && (
            <p className="mt-4 text-sm opacity-90">
              Next decision: {DECISION_TIME} Sydney time, {formatLongDate(next.decision)}
            </p>
          )}
        </div>
      </div>

      {/* Link to latest decision analysis */}
      <div className="max-w-4xl mx-auto -mt-6 mb-10 text-center">
        <Link
          href="/guides/rba-cash-rate-june-2026-what-it-means-for-buyers"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Our analysis of the June 2026 hold
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Rate history table */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Decision History</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Cash Rate</th>
                  <th className="px-4 py-3 text-right">Change</th>
                  <th className="px-4 py-3 text-center">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentHistory.map((entry, i) => (
                  <tr
                    key={entry.announced}
                    className={`hover:bg-gray-50 transition-colors ${
                      i === 0 ? "bg-primary/5 font-medium" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-900">
                      {formatShortDate(entry.announced)}
                      {i === 0 && (
                        <span className="ml-2 text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                          Latest
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {entry.rate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChangeCell change={entry.change} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <NoteChip note={decisionLabel(entry.change)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            The {recentHistory.length} most recent decisions, by the day each was announced; the new
            target takes effect the next day. From the RBA&apos;s{" "}
            <a
              href={CASH_RATE_SOURCE.url}
              target="_blank"
              rel="nofollow noopener"
              className="underline hover:text-gray-700"
            >
              Cash Rate Target table
            </a>
            , read {CASH_RATE_SOURCE.readOn}.
          </div>
        </div>
      </div>

      {/* Context section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          How the Cash Rate Affects Property Prices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-xl p-6 border border-red-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">When rates rise</h3>
            </div>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                Mortgage rates increase, making loans more expensive
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                Borrowing capacity falls, buyers qualify for smaller loans
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                Demand weakens as fewer buyers can afford to purchase
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                Property prices face downward pressure
              </li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">When rates fall</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                Mortgage rates fall, reducing the cost of borrowing
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                Borrowing capacity increases, buyers qualify for larger loans
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                More buyers enter the market, increasing competition
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                Property prices typically rise in response
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            The transmission from the cash rate to mortgage rates is not instantaneous. Banks set
            their own variable and fixed rates, and some lenders pass on cuts faster than others.
            The full impact on property markets typically takes 6–18 months to flow through, as
            buyer sentiment, credit availability, and broader economic conditions all play a role.
          </p>
        </div>
      </div>

      {/* Impact on borrowing CTA */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Impact on Your Borrowing Power
          </h2>
          <p className="text-gray-700 text-sm mb-4">
            A 0.25% rate change on a $600,000 loan changes monthly repayments by approximately{" "}
            <strong>$90/month</strong>: or around $1,080 per year. Over a full hiking cycle of
            4.25% (May 2022 to November 2023), monthly repayments on a $600,000 loan increased
            by around $1,500/month.
          </p>
          <Link
            href="/borrowing-power-calculator"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Calculate your borrowing power
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Upcoming meetings: past meetings drop off once their decision is recorded */}
      {upcoming.length > 0 && (
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upcoming RBA Meeting Dates
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Meeting</th>
                    <th className="px-4 py-3 text-left">Decision announced ({DECISION_TIME} Sydney time)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcoming.map((m) => (
                    <tr key={m.decision} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900">
                        {formatShortDate(m.start)} to {formatShortDate(m.decision)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatLongDate(m.decision)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 flex items-start gap-2 text-xs text-amber-800">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>
                The Monetary Policy Board&apos;s published schedule, read {MEETING_SCHEDULE_SOURCE.readOn}. The RBA can
                change it; check{" "}
                <a
                  href={MEETING_SCHEDULE_SOURCE.url}
                  target="_blank"
                  rel="nofollow noopener"
                  className="underline hover:text-amber-900"
                >
                  rba.gov.au
                </a>{" "}
                before a meeting.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Refinance funnel exit. Rate-watchers checking this page after each
          decision are the site's highest-intent refinance audience. */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Is Your Rate Still Competitive?
          </h2>
          <p className="text-gray-700 text-sm mb-4">
            In {AVERAGE_OUTSTANDING_VARIABLE_RATE.period} the average variable rate on outstanding
            owner-occupier loans was {AVERAGE_OUTSTANDING_VARIABLE_RATE.rate}% and on new ones{" "}
            {AVERAGE_NEW_VARIABLE_RATE.rate}% (RBA table F6), so whether switching saves you money
            depends on your own rate. A broker compares many lenders&rsquo; policies for your situation.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/find-an-expert?intent=refinancing"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Talk to a mortgage broker about your rate
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/refinancing-calculator"
              className="text-sm font-medium text-primary hover:underline"
            >
              Or estimate your savings first
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <Sources
          items={[
            {
              label: CASH_RATE_SOURCE.name,
              href: CASH_RATE_SOURCE.url,
              note: `every decision on this page, read ${CASH_RATE_SOURCE.readOn}`,
            },
            ...(currentRate.statement
              ? [
                  {
                    label: `Statement by the Monetary Policy Board: Monetary Policy Decision (media release ${currentRate.statement.number})`,
                    href: currentRate.statement.url,
                    note: formatLongDate(currentRate.announced),
                  },
                ]
              : []),
            {
              label: MEETING_SCHEDULE_SOURCE.name,
              href: MEETING_SCHEDULE_SOURCE.url,
              note: `read ${MEETING_SCHEDULE_SOURCE.readOn}`,
            },
            {
              label: F6_SOURCE.name,
              href: F6_SOURCE.url,
              note: `series ${AVERAGE_OUTSTANDING_VARIABLE_RATE.series} and ${AVERAGE_NEW_VARIABLE_RATE.series}, ${AVERAGE_NEW_VARIABLE_RATE.period}; published ${F6_SOURCE.published}, read ${F6_SOURCE.readOn}`,
            },
          ]}
        />
      </div>

      {/* Disclaimer */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Cash rate data sourced from the Reserve Bank of Australia. This page is for
            informational purposes only and does not constitute financial advice. Interest rate
            movements affect borrowers differently depending on their loan type, lender, and
            financial circumstances.
          </p>
        </div>
      </div>
    </div>
  );
}
