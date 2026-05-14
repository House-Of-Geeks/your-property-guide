import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, BookOpen, Wrench, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { DATA_UPDATES, type UpdateKind } from "@/lib/data/data-updates";
import { formatDate } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Data Updates &amp; Changelog | Your Property Guide",
  description:
    "Every significant data refresh, guide release, tool launch, and correction logged with date and source. Full transparency on what changed and when.",
  alternates: { canonical: `${SITE_URL}/data-updates` },
  openGraph: {
    url: `${SITE_URL}/data-updates`,
    title: "Data Updates & Changelog",
    description:
      "Every significant data refresh, guide release, and correction logged with date and source.",
    type: "article",
  },
  twitter: { card: "summary_large_image" },
};

const KIND_META: Record<
  UpdateKind,
  { label: string; icon: React.ReactNode; tone: string }
> = {
  data: {
    label: "Data",
    icon: <Database className="w-3.5 h-3.5" aria-hidden="true" />,
    tone: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  guide: {
    label: "Guide",
    icon: <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />,
    tone: "bg-amber-50 border-amber-200 text-amber-800",
  },
  tool: {
    label: "Tool",
    icon: <Wrench className="w-3.5 h-3.5" aria-hidden="true" />,
    tone: "bg-blue-50 border-blue-200 text-blue-700",
  },
  correction: {
    label: "Correction",
    icon: <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    tone: "bg-red-50 border-red-200 text-red-700",
  },
};

// Group entries by year-month for the timeline rail
function groupByMonth(updates: typeof DATA_UPDATES) {
  const groups = new Map<string, typeof DATA_UPDATES>();
  for (const u of updates) {
    const key = u.date.slice(0, 7); // YYYY-MM
    const list = groups.get(key) ?? [];
    list.push(u);
    groups.set(key, list);
  }
  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]));
}

function monthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString("en-AU", { month: "long", year: "numeric" });
}

export default function DataUpdatesPage() {
  const sorted = [...DATA_UPDATES].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const grouped = groupByMonth(sorted);

  // Counts by kind for the hero stat row
  const counts: Record<UpdateKind, number> = {
    data: 0,
    guide: 0,
    tool: 0,
    correction: 0,
  };
  for (const u of DATA_UPDATES) counts[u.kind]++;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Data updates", url: "/data-updates" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Data updates" }]} />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              {DATA_UPDATES.length} events
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Editorial log
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            What we changed,{" "}
            <span className="italic font-light text-primary">and when</span>.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            Every significant data refresh, guide release, tool launch and
            correction since 2026. Dated, sourced, transparent.
          </p>
        </div>
      </section>

      {/* Counts by kind */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(Object.keys(counts) as UpdateKind[]).map((k) => (
              <div key={k} className="rounded-2xl border border-line bg-surface-warm p-5">
                <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-sans font-medium ${KIND_META[k].tone}`}>
                  {KIND_META[k].icon}
                  {KIND_META[k].label}
                </div>
                <p className="mt-3 font-display text-3xl text-ink leading-none">
                  {counts[k]}
                </p>
                <p className="mt-2 text-xs font-sans uppercase tracking-wider text-ink-subtle">
                  {k === "data" && "Refreshes logged"}
                  {k === "guide" && "Releases & rewrites"}
                  {k === "tool" && "New tools shipped"}
                  {k === "correction" && "Reader-flagged fixes"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {grouped.map(([month, items]) => (
          <section key={month}>
            <h2 className="font-display text-2xl text-ink mb-6 pb-2 border-b border-line">
              {monthLabel(month)}
            </h2>
            <ol className="space-y-4">
              {items.map((u) => {
                const meta = KIND_META[u.kind];
                const inner = (
                  <>
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-sans font-medium ${meta.tone}`}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                      <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle">
                        {formatDate(u.date)}
                      </p>
                    </div>
                    <h3 className="font-display text-lg text-ink leading-tight mb-1">
                      {u.title}
                    </h3>
                    <p className="font-sans text-sm text-ink-muted leading-relaxed">
                      {u.description}
                    </p>
                    {u.href && (
                      <p className="mt-3 inline-flex items-center gap-1 text-xs font-sans uppercase tracking-wider text-ink group-hover:text-primary transition-colors">
                        See more <ArrowRight className="w-3.5 h-3.5" />
                      </p>
                    )}
                  </>
                );
                return (
                  <li
                    key={`${u.date}-${u.title}`}
                    className="rounded-2xl border border-line bg-surface-raised p-6 group"
                  >
                    {u.href ? (
                      <Link
                        href={u.href}
                        className="block hover:cursor-pointer"
                      >
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}

        {/* Closer */}
        <section className="rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Spotted something off?
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-3">
                Tell us, and we&rsquo;ll log the correction here.
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                We log every reader-flagged correction in this changelog with
                the date it was fixed. If a figure looks wrong, email{" "}
                <a
                  href="mailto:andy@theandylife.com"
                  className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                >
                  andy@theandylife.com
                </a>{" "}
                and we&rsquo;ll respond within a week.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end gap-3 flex flex-wrap">
              <Link
                href="/methodology"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
              >
                Read the methodology →
              </Link>
              <Link
                href="/data"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
              >
                See live data counts →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
