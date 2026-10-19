import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, TrendingUp, Minus, ArrowRight, Info } from "lucide-react";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  BUTTON_PRIMARY,
  Band,
  HeroLead,
  HeroTitle,
  PhotoHero,
  RuleGrid,
  RuleItem,
  SectionHeading,
} from "@/components/premium";

export const metadata: Metadata = {
  title: "RBA Cash Rate History & Property Market Impact",
  description:
    "Track the RBA cash rate history and understand how interest rate changes affect Australian property prices. Updated with each RBA decision.",
  alternates: { canonical: `${SITE_URL}/rba-cash-rate` },
  openGraph: { ...DEFAULT_OG,
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
  { date: "2026-09-29", rate: 4.60, change: 0.25,  note: "Hike" },
  { date: "2026-08-11", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2026-06-16", rate: 4.35, change: 0,     note: "Hold" },
  { date: "2026-05-05", rate: 4.35, change: 0.25,  note: "Hike" },
  { date: "2026-03-17", rate: 4.10, change: 0.25,  note: "Hike" },
  { date: "2026-02-03", rate: 3.85, change: 0.25,  note: "Hike" },
  { date: "2025-12-09", rate: 3.60, change: 0,     note: "Hold" },
  { date: "2025-11-04", rate: 3.60, change: 0,     note: "Hold" },
  { date: "2025-09-30", rate: 3.60, change: 0,     note: "Hold" },
  { date: "2025-08-12", rate: 3.60, change: -0.25, note: "Cut" },
  { date: "2025-07-08", rate: 3.85, change: 0,     note: "Hold" },
  { date: "2025-05-20", rate: 3.85, change: -0.25, note: "Cut" },
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
  { dates: "2–3 November",    decision: "Nov 3" },
  { dates: "7–8 December",    decision: "Dec 8" },
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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
        <TrendingDown className="w-3 h-3" />
        {note}
      </span>
    );
  }
  if (note === "Hike") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700">
        <TrendingUp className="w-3 h-3" />
        Hike
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-surface-warm text-ink-muted">
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
  return <span className="text-ink-subtle">-</span>;
}

export default function RBACashRatePage() {
  const currentRate = rateHistory[0];
  const recentHistory = rateHistory.slice(0, 20);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "RBA Cash Rate", url: "/rba-cash-rate" }]} />
      <GuideArticleJsonLd
        title={`RBA Cash Rate History & Property Market Impact | ${SITE_NAME}`}
        description="Track the RBA cash rate history and understand how interest rate changes affect Australian property prices. Updated with each RBA decision."
        url="/rba-cash-rate"
        datePublished="2026-01-01"
        dateModified="2026-06-16"
      />

      {/* Hero: the current rate sits beside the H1 on the first screen. */}
      <PhotoHero
        photo="paperwork"
        breadcrumbs={[{ label: "RBA Cash Rate" }]}
        aside={
          <div className="border-t-2 border-ink pt-6">
            <p className="text-sm text-ink-muted mb-1">Current RBA Cash Rate</p>
            <p className="text-7xl sm:text-8xl font-bold text-ink leading-none tracking-[-0.04em] mb-3">
              {currentRate.rate.toFixed(2)}%
            </p>
            <p className="text-base text-ink-muted">
              As of {formatRateDate(currentRate.date)}, {currentRate.note}
            </p>
            <p className="mt-5 flex items-start gap-2 border-t border-line pt-5 text-sm text-ink-muted">
              <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              Raised to 4.60% on 29 September 2026, the fourth rise this year, after holds in June and August
            </p>
            {/* Link to latest decision analysis */}
            <Link
              href="/guides/rba-cash-rate-june-2026-what-it-means-for-buyers"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
            >
              Read our full analysis of the June 2026 decision
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        }
      >
        <HeroTitle>
          RBA Cash Rate History &amp; Property Market Impact
        </HeroTitle>
        <HeroLead>
          Track every Reserve Bank of Australia cash rate decision and understand how interest
          rate changes flow through to Australian property prices.
        </HeroLead>
      </PhotoHero>

      {/* Rate history table */}
      <Band spacing="compact">
        <div className="max-w-4xl">
          <SectionHeading size="md" title="Rate Decision History" />
          <div className="mt-8 bg-white rounded-xl border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm text-ink-muted text-sm font-medium border-b border-line">
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-right">Cash Rate</th>
                    <th className="px-4 py-3 text-right">Change</th>
                    <th className="px-4 py-3 text-center">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentHistory.map((entry, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-surface-warm transition-colors ${
                        i === 0 ? "bg-surface-warm font-medium" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-ink">
                        {formatRateDate(entry.date)}
                        {i === 0 && (
                          <span className="ml-2 text-xs bg-ink text-ink-inverse px-1.5 py-0.5 rounded">
                            Latest
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-ink">
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
            <div className="px-4 py-3 bg-surface-warm border-t border-line text-xs text-ink-muted">
              Showing {recentHistory.length} most recent decisions. Data sourced from the Reserve Bank of Australia.
            </div>
          </div>
        </div>
      </Band>

      {/* Context section */}
      <Band tone="quiet" spacing="compact">
        <SectionHeading size="md" title="How the Cash Rate Affects Property Prices" />
        <RuleGrid columns={2} className="mt-10 max-w-5xl">
          <RuleItem icon={TrendingUp} title="When rates rise">
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-ink-subtle">
              <li>
                Mortgage rates increase, making loans more expensive
              </li>
              <li>
                Borrowing capacity falls, buyers qualify for smaller loans
              </li>
              <li>
                Demand weakens as fewer buyers can afford to purchase
              </li>
              <li>
                Property prices face downward pressure
              </li>
            </ul>
          </RuleItem>
          <RuleItem icon={TrendingDown} title="When rates fall">
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-ink-subtle">
              <li>
                Mortgage rates fall, reducing the cost of borrowing
              </li>
              <li>
                Borrowing capacity increases, buyers qualify for larger loans
              </li>
              <li>
                More buyers enter the market, increasing competition
              </li>
              <li>
                Property prices typically rise in response
              </li>
            </ul>
          </RuleItem>
        </RuleGrid>
        <p className="mt-12 max-w-3xl border-t border-line pt-6 text-base text-ink-muted leading-relaxed">
          The transmission from the cash rate to mortgage rates is not instantaneous. Banks set
          their own variable and fixed rates, and some lenders pass on cuts faster than others.
          The full impact on property markets typically takes 6–18 months to flow through, as
          buyer sentiment, credit availability, and broader economic conditions all play a role.
        </p>
      </Band>

      {/* Impact on borrowing CTA */}
      <Band tone="dark" spacing="compact">
        <div className="max-w-3xl">
          <SectionHeading size="md" title="Impact on Your Borrowing Power" />
          <p className="mt-6 text-lg text-ink-muted leading-relaxed">
            A 0.25% rate change on a $600,000 loan changes monthly repayments by approximately{" "}
            <strong className="text-ink">$90/month</strong>: or around $1,080 per year. Over a full hiking cycle of
            4.25% (May 2022 to November 2023), monthly repayments on a $600,000 loan increased
            by around $1,500/month.
          </p>
          <Link
            href="/borrowing-power-calculator"
            className={`mt-8 ${BUTTON_PRIMARY}`}
          >
            Calculate your borrowing power
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Band>

      {/* 2026 Meeting dates */}
      <Band spacing="compact">
        <div className="max-w-4xl">
          <SectionHeading size="md" title="Remaining 2026 RBA Meeting Dates" />
          <div className="mt-8 bg-white rounded-xl border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-warm text-ink-muted text-sm font-medium border-b border-line">
                    <th className="px-4 py-3 text-left">Meeting Dates</th>
                    <th className="px-4 py-3 text-left">Decision Announced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {upcomingMeetings2026.map((m, i) => (
                    <tr key={i} className="hover:bg-surface-warm transition-colors">
                      <td className="px-4 py-3 text-ink">{m.dates} 2026</td>
                      <td className="px-4 py-3 text-ink-muted">{m.decision} 2026</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-surface-warm border-t border-line flex items-start gap-2 text-xs text-ink-muted">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Dates are approximate and subject to change. Always check{" "}
                <a
                  href="https://www.rba.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  rba.gov.au
                </a>{" "}
                for confirmed meeting dates.
              </span>
            </div>
          </div>
        </div>
      </Band>

      {/* Refinance funnel exit. Rate-watchers checking this page after each
          decision are the site's highest-intent refinance audience. */}
      <Band tone="quiet" spacing="compact">
        <div className="max-w-3xl">
          <SectionHeading size="md" title="Is Your Rate Still Competitive?" />
          <p className="mt-6 text-lg text-ink-muted leading-relaxed">
            Every hold or hike widens the gap between the sharpest new-customer rates and
            what existing borrowers pay. A broker can compare your current loan against
            30+ lenders for free.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/find-an-expert?intent=refinancing"
              className={BUTTON_PRIMARY}
            >
              Talk to a mortgage broker about your rate
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/refinancing-calculator"
              className="text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
            >
              Or estimate your savings first
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 flex items-start gap-2 border-t border-line pt-6 text-sm text-ink-subtle">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Cash rate data sourced from the Reserve Bank of Australia. This page is for
              informational purposes only and does not constitute financial advice. Interest rate
              movements affect borrowers differently depending on their loan type, lender, and
              financial circumstances.
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
