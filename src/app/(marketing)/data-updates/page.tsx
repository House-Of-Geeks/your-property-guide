import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, BookOpen, Wrench, AlertCircle } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo";
import { DATA_UPDATES, type UpdateKind } from "@/lib/data/data-updates";
import { formatDate } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, SectionHeading } from "@/components/premium";

export const metadata: Metadata = {
  title: "Data Updates & Changelog",
  description:
    "Every significant data refresh, guide release, tool launch, and correction logged with date and source. Full transparency on what changed and when.",
  alternates: { canonical: `${SITE_URL}/data-updates` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/data-updates`,
    title: "Data Updates & Changelog",
    description:
      "Every significant data refresh, guide release, and correction logged with date and source.",
    type: "article",
  },
  twitter: { card: "summary_large_image" },
};

// Each kind reads as an icon and a word: no coloured tags (BRAND.md §11).
const KIND_META: Record<UpdateKind, { label: string; icon: React.ReactNode }> = {
  data: {
    label: "Data",
    icon: <Database className="w-4 h-4 text-primary" aria-hidden="true" />,
  },
  guide: {
    label: "Guide",
    icon: <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />,
  },
  tool: {
    label: "Tool",
    icon: <Wrench className="w-4 h-4 text-primary" aria-hidden="true" />,
  },
  correction: {
    label: "Correction",
    icon: <AlertCircle className="w-4 h-4 text-primary" aria-hidden="true" />,
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

      {/* A plain charcoal hero: a reference log needs no photo. */}
      <PhotoHero breadcrumbs={[{ label: "Data updates" }]}>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm font-semibold text-ink-muted leading-none">
            {DATA_UPDATES.length} events
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="text-sm text-ink-subtle font-medium">
            Editorial log
          </span>
        </div>
        <HeroTitle>
          What we changed,{" "}
          <span>and when</span>
        </HeroTitle>
        <HeroLead>
          Every significant data refresh, guide release, tool launch and
          correction since 2026. Dated, sourced, transparent.
        </HeroLead>
      </PhotoHero>

      {/* Counts by kind */}
      <Band tone="quiet" spacing="compact">
        <RuleGrid className="">
          {(Object.keys(counts) as UpdateKind[]).map((k) => (
            <li key={k} className="border-t-2 border-ink pt-6">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                {KIND_META[k].icon}
                {KIND_META[k].label}
              </p>
              <p className="mt-4 text-5xl font-bold text-ink leading-none tracking-[-0.03em]">
                {counts[k]}
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                {k === "data" && "Refreshes logged"}
                {k === "guide" && "Releases & rewrites"}
                {k === "tool" && "New tools shipped"}
                {k === "correction" && "Reader-flagged fixes"}
              </p>
            </li>
          ))}
        </RuleGrid>
      </Band>

      {/* Timeline */}
      <Band>
        <div className="space-y-16">
          {grouped.map(([month, items]) => (
            <section key={month}>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-ink pb-4 border-b-2 border-ink">
                {monthLabel(month)}
              </h2>
              <ol className="divide-y divide-line">
                {items.map((u) => {
                  const meta = KIND_META[u.kind];
                  const inner = (
                    <>
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted">
                          {meta.icon}
                          {meta.label}
                        </span>
                        <p className="text-sm text-ink-subtle">
                          {formatDate(u.date)}
                        </p>
                      </div>
                      <h3 className="text-xl font-bold text-ink leading-tight mb-1 group-hover:text-primary transition-colors">
                        {u.title}
                      </h3>
                      <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
                        {u.description}
                      </p>
                      {u.href && (
                        <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink group-hover:text-primary transition-colors">
                          See more <ArrowRight className="w-3.5 h-3.5" />
                        </p>
                      )}
                    </>
                  );
                  return (
                    <li
                      key={`${u.date}-${u.title}`}
                      className="py-6 group"
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
        </div>
      </Band>

      {/* Closer */}
      <Band tone="quiet" spacing="compact">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-ink-muted mb-3">
              Spotted something off?
            </p>
            <SectionHeading size="md" title={<>Tell us, and we&rsquo;ll log the correction here</>} />
            <p className="mt-4 text-base sm:text-lg text-ink-muted leading-relaxed">
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
          <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end gap-x-6 gap-y-3 flex flex-wrap">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              Read the methodology →
            </Link>
            <Link
              href="/data"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              See live data counts →
            </Link>
          </div>
        </div>
      </Band>
    </>
  );
}
