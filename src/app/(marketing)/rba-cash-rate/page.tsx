import type { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, TrendingUp, Minus, ArrowRight, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `RBA Cash Rate History & Property Market Impact | ${SITE_NAME}`,
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

interface RateEntry {
  date: string;
  rate: number;
  change: number;
  note: string;
}

const rateHistory: RateEntry[] = [
  { date: "2025-04-01", rate: 4.10, change: 0,     note: "Hold" },
  { date: "2025-02-18", rate: 4.10, change: -0.25, note: "Cut" },
  { date: "2024-12-10", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2024-11-05", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2024-09-24", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2024-08-06", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2024-06-18", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2024-05-07", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2024-03-19", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2024-02-06", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2023-11-07", rate: 4.35, change: 0.25,  note: "Hike" },
  { date: "2023-09-05", rate: 4.10, change: 0,     note: "Hold" },
  { date: "2023-07-04", rate: 4.10, change: 0,     note: "Hold" },
  { date: "2023-06-06", rate: 4.10, change: 0.25,  note: "Hike" },
  { date: "2023-05-02", rate: 3.85, change: 0.25,  note: "Hike" },
  { date: "2023-04-04", rate: 3.60, change: 0,     note: "Hold" },
  { date: "2023-03-07", rate: 3.60, change: 0.25,  note: "Hike" },
  { date: "2023-02-07", rate: 3.35, change: 0.25,  note: "Hike" },
  { date: "2022-12-06", rate: 3.10, change: 0.25,  note: "Hike" },
  { date: "2022-11-01", rate: 2.85, change: 0.25,  note: "Hike" },
  { date: "2022-10-04", rate: 2.60, change: 0.25,  note: "Hike" },
  { date: "2022-09-06", rate: 2.35, change: 0.50,  note: "Hike" },
  { date: "2022-08-02", rate: 1.85, change: 0.50,  note: "Hike" },
  { date: "2022-07-05", rate: 1.35, change: 0.50,  note: "Hike" },
  { date: "2022-06-07", rate: 0.85, change: 0.50,  note: "Hike" },
  { date: "2022-05-03", rate: 0.35, change: 0.25,  note: "Hike" },
  { date: "2020-11-03", rate: 0.10, change: -0.15, note: "Cut" },
  { date: "2020-03-19", rate: 0.25, change: -0.25, note: "Emergency Cut" },
  { date: "2020-03-03", rate: 0.50, change: -0.25, note: "Emergency Cut" },
];

const upcomingMeetings2026 = [
  { dates: "17–18 February", decision: "Feb 18" },
  { dates: "1 April",        decision: "Apr 1" },
  { dates: "19–20 May",      decision: "May 20" },
  { dates: "7–8 July",       decision: "Jul 8" },
  { dates: "18–19 August",   decision: "Aug 19" },
  { dates: "29–30 September",decision: "Sep 30" },
  { dates: "3–4 November",   decision: "Nov 4" },
  { dates: "9 December",     decision: "Dec 9" },
];

function formatRateDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function NoteChip({ note }: { note: string }) {
  if (note.includes("Cut") || note.includes("Emergency")) {
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
  return <span className="text-gray-400">—</span>;
}

export default function RBACashRatePage() {
  const currentRate = rateHistory[0];
  const recentHistory = rateHistory.slice(0, 20);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "RBA Cash Rate", url: "/rba-cash-rate" }]} />
      <GuideArticleJsonLd
        title={`RBA Cash Rate History & Property Market Impact | ${SITE_NAME}`}
        description="Track the RBA cash rate history and understand how interest rate changes affect Australian property prices. Updated with each RBA decision."
        url="/rba-cash-rate"
        datePublished="2026-01-01"
      />
      <Breadcrumbs items={[{ label: "RBA Cash Rate" }]} />

      {/* Hero — Current Rate */}
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
          <p className="text-sm opacity-80 mb-1">Current RBA Cash Rate</p>
          <p className="text-7xl font-bold tracking-tight mb-2">
            {currentRate.rate.toFixed(2)}%
          </p>
          <p className="text-base opacity-90">
            As of {formatRateDate(currentRate.date)} — {currentRate.note}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm">
            <TrendingDown className="w-4 h-4" />
            Cut by 0.25% in February 2025 — first cut since November 2020
          </div>
        </div>
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
                    key={i}
                    className={`hover:bg-gray-50 transition-colors ${
                      i === 0 ? "bg-primary/5 font-medium" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-900">
                      {formatRateDate(entry.date)}
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
                      <NoteChip note={entry.note} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            Showing {recentHistory.length} most recent decisions. Data sourced from the Reserve Bank of Australia.
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
                Borrowing capacity falls — buyers qualify for smaller loans
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
                Borrowing capacity increases — buyers qualify for larger loans
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
            <strong>$90/month</strong> — or around $1,080 per year. Over a full hiking cycle of
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

      {/* 2026 Meeting dates */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          2026 RBA Meeting Dates
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Meeting Dates</th>
                  <th className="px-4 py-3 text-left">Decision Announced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingMeetings2026.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900">{m.dates} 2026</td>
                    <td className="px-4 py-3 text-gray-600">{m.decision} 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 flex items-start gap-2 text-xs text-amber-800">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              Dates are approximate and subject to change. Always check{" "}
              <a
                href="https://www.rba.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-900"
              >
                rba.gov.au
              </a>{" "}
              for confirmed meeting dates.
            </span>
          </div>
        </div>
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
