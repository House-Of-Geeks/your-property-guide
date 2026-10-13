import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { GuideCover } from "@/components/brand/GuideCover";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PERSONA_BY_ID, type PersonaId } from "@/lib/constants/journey";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { ALL_GUIDES, guidesBySection, type GuideEntry, type GuideSectionWithGuides } from "@/lib/guides/registry";

export const metadata: Metadata = {
  // Brand suffix is appended once by the root title template (%s | SITE_NAME);
  // the page title must not repeat it (was double-branded in the SERP).
  title: "Property Guides for Buyers and Sellers",
  description:
    "Free Australian property guides covering buying, investing, renting, selling, and moving. Plain-English, ungated, updated for 2026.",
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    url: `${SITE_URL}/guides`,
    title: `Property Guides | ${SITE_NAME}`,
    description:
      "Free Australian property guides covering buying, investing, renting, selling, and moving. Plain-English, ungated, updated for 2026.",
    type: "website",
  },
};

// Every published guide, grouped by section, from the guide registry: the
// static guides' titles and descriptions come from their own FRONTMATTER and
// the articles from blog-posts, so nothing on this page is typed twice and
// nothing published is missing (tests/seo/guide-registry.test.ts). The page
// stays static: the registry is bundled data, read at build time.
//
// Layout (Oct 2026): the two free guides first, then the selling section
// (every traced seller lead started on a selling guide), then the rest by
// topic. Guides are list rows, not cards; a guide published once per state
// collapses into one "by state" row of links.
const SECTIONS = orderSections(guidesBySection());
const TOTAL_GUIDES = ALL_GUIDES.length;

// The premium bands' measure (src/components/premium), for the strips
// between them.
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

const STATE_SUFFIX = /-(nsw|vic|qld|wa|sa|tas|act|nt|victoria)$/;
const STATE_LABEL: Record<string, string> = {
  nsw: "NSW", vic: "VIC", victoria: "VIC", qld: "QLD", wa: "WA", sa: "SA", tas: "TAS", act: "ACT", nt: "NT",
};
const STATE_ORDER = ["nsw", "vic", "victoria", "qld", "wa", "sa", "tas", "act", "nt"];

// A guide series published once per state: how its row is labelled, and the
// words read with each state link (screen readers and search engines get
// "NSW real estate commission"; the eye gets "NSW").
const SERIES: Record<string, { label: string; noun: string }> = {
  "real-estate-commission": { label: "Agent commission by state", noun: "real estate commission" },
  "cost-of-selling-a-house": { label: "Cost of selling by state", noun: "cost of selling a house" },
  "stamp-duty": { label: "Stamp duty by state", noun: "stamp duty" },
  "first-home-buyer": { label: "First home buyer guide by state", noun: "first home buyer guide" },
  "help-to-buy-scheme": { label: "Help to Buy by state", noun: "Help to Buy" },
  "granny-flat-guide": { label: "Granny flats by state", noun: "granny flat guide" },
  "renters-rights": { label: "Renters' rights by state", noun: "renters' rights" },
};

// Section → the persona hub that covers the same reader.
const SECTION_HUB: Partial<Record<string, PersonaId>> = {
  "first-home": "first-home",
  selling: "selling",
  upgrading: "upgrading",
  investing: "investing",
  renovating: "renovating",
};

// The selling guides that bring sellers in (Bing ranks the fees, commission
// and cost guides 3 to 5) lead the selling section.
const SELLING_FIRST = [
  "real-estate-agent-fees-australia",
  "cost-of-selling-a-house-australia",
  "how-to-sell-a-house-australia",
  "how-much-is-my-house-worth-australia",
  "how-to-choose-a-selling-agent",
  "how-to-negotiate-real-estate-agent-commission",
];

const TOOLS = [
  { title: "Real estate commission calculator", href: "/real-estate-commission-calculator", description: "What an agent's commission costs on your sale price, state by state." },
  { title: "Selling costs calculator", href: "/selling-costs-calculator", description: "Every cost of selling, with what you walk away with." },
  { title: "Stamp duty calculator", href: "/stamp-duty-calculator", description: "Duty and first home buyer concessions in every state." },
  { title: "Borrowing power calculator", href: "/borrowing-power-calculator", description: "An estimate of what a lender may lend on your income and expenses." },
];

export default function GuidesHubPage() {
  return (
    <>
      <CollectionPageJsonLd
        name="Property Guides"
        description="Free Australian property guides covering buying, renting, investing, selling, and moving."
        url="/guides"
      />
      <BreadcrumbJsonLd items={[{ name: "Guides", url: "/guides" }]} />

      {/* Hero: what the page holds, over the street photo (the guides
          serve buyers and sellers alike). */}
      <PhotoHero photo="street" breadcrumbs={[{ label: "Guides" }]}>
        <HeroTitle>Property guides for buyers and sellers</HeroTitle>
        <HeroLead>
          Plain-English guides to selling and buying property in Australia, checked by a named editor and dated.
          {` ${TOTAL_GUIDES} guides and articles, free to read without signing up.`}
        </HeroLead>
      </PhotoHero>

      {/* The two free guides: the one next step every guide page offers. */}
      <Band spacing="compact">
        <section aria-labelledby="free-guides">
          <h2 id="free-guides" className="sr-only">The two free guides</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FreeGuideCard
              guide="selling"
              title="The complete guide to selling your home"
              body="Pricing your home, what agents really charge, choosing an agent and getting to settlement, personalised to your suburb."
              href={guideFunnelHref("selling", { from: "guides" })}
              label="Get the free selling guide"
              primary
            />
            <FreeGuideCard
              guide="buying"
              title="The complete guide to buying property"
              body="What you can really spend, the 2026 schemes state by state, how not to overpay, and the contract through to settlement."
              href={guideFunnelHref("buying", { from: "guides" })}
              label="Get the free buying guide"
            />
          </div>
        </section>
      </Band>

      {/* Topic jump links */}
      <nav aria-label="Guide topics" className="border-b border-line bg-surface-warm">
        <div className={`${SHELL} py-3.5`}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {SECTIONS.map(({ section, guides }) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="font-medium text-ink hover:underline underline-offset-4">
                  {section.label}
                </a>{" "}
                <span className="text-ink-muted">{guides.length}</span>
              </li>
            ))}
            <li>
              <a href="#tools" className="font-medium text-ink hover:underline underline-offset-4">Calculators</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Every guide, by section: selling first, in bands that alternate
          white and grey. */}
      {SECTIONS.map((s, i) => (
        <GuideSection key={s.section.id} {...s} lead={i === 0} tone={i % 2 === 0 ? "light" : "quiet"} />
      ))}

      <Band id="tools" tone="dark" spacing="compact" className="scroll-mt-24">
        <GuideSectionHeading title="Calculators" blurb="Run the numbers before you talk to an agent, a lender or a conveyancer." />
        <ul className="grid md:grid-cols-2 md:gap-x-12 border-t border-line md:border-t-0">
          {TOOLS.map((t) => (
            <li key={t.href} className="border-b border-line md:first:border-t md:[&:nth-child(2)]:border-t">
              <RowLink href={t.href} title={t.title} description={t.description} />
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm">
          <Link href="/tools" className="font-medium text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
            Every calculator
          </Link>
        </p>
      </Band>

      <div className={SHELL}>
        <p className="py-10 text-sm text-ink-muted leading-relaxed max-w-3xl">
          Our guides are general information, not financial, legal or tax advice. Check current grants, thresholds and
          rules with the state agency or a licensed professional before you rely on them.
        </p>
      </div>
    </>
  );
}

function orderSections(sections: GuideSectionWithGuides[]): GuideSectionWithGuides[] {
  const selling = sections.filter((s) => s.section.id === "selling");
  return [...selling, ...sections.filter((s) => s.section.id !== "selling")];
}

function FreeGuideCard({
  guide,
  title,
  body,
  href,
  label,
  primary = false,
}: {
  guide: "selling" | "buying";
  title: string;
  body: string;
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line p-5 sm:p-6 flex flex-col">
      <div className="flex gap-4 sm:gap-5">
        <div className="w-[60px] sm:w-[88px] shrink-0 text-[5.7px] sm:text-[8.3px]" aria-hidden="true">
          <GuideCover guide={guide} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-muted">Free guide, 2026 edition</p>
          <h3 className="mt-1 text-lg sm:text-xl font-bold text-ink leading-snug tracking-[-0.01em]">{title}</h3>
          <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{body}</p>
        </div>
      </div>
      <div className="mt-5 sm:pl-[108px]">
        <Link href={href} className={`${primary ? BUTTON_PRIMARY : BUTTON_SECONDARY} w-full sm:w-auto justify-center`}>
          {label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/** A section's H2 with its blurb beside it (the premium SectionHeading), then the persona hub link. */
function GuideSectionHeading({ title, blurb, hub }: { title: string; blurb?: string; hub?: { href: string; label: string } }) {
  return (
    <div className="mb-8 sm:mb-10">
      <SectionHeading title={title} intro={blurb} size="md" />
      {hub && (
        <Link
          href={hub.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
        >
          {hub.label} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function RowLink({ href, title, description }: { href: string; title: string; description?: string }) {
  return (
    <Link href={href} className="group flex items-start gap-4 py-3.5">
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-ink leading-snug group-hover:underline underline-offset-4 decoration-line-strong">
          {title}
        </span>
        {description && <span className="mt-1 text-sm text-ink-muted leading-relaxed line-clamp-2">{description}</span>}
      </span>
      <ArrowRight className="w-4 h-4 shrink-0 mt-1 text-ink-muted group-hover:text-ink" aria-hidden="true" />
    </Link>
  );
}

interface Series {
  key: string;
  label: string;
  noun: string;
  guides: GuideEntry[];
}

/** Split a section's static guides into single guides and per-state series (3+ editions). */
function splitSeries(guides: GuideEntry[]): { singles: GuideEntry[]; series: Series[] } {
  const groups = new Map<string, GuideEntry[]>();
  for (const g of guides) {
    if (!STATE_SUFFIX.test(g.slug)) continue;
    const key = g.slug.replace(STATE_SUFFIX, "");
    if (!SERIES[key]) continue;
    groups.set(key, [...(groups.get(key) ?? []), g]);
  }
  const series: Series[] = [];
  const inSeries = new Set<string>();
  for (const [key, list] of groups) {
    if (list.length < 3) continue;
    list.forEach((g) => inSeries.add(g.slug));
    const order = (g: GuideEntry) => STATE_ORDER.indexOf(STATE_SUFFIX.exec(g.slug)![1]);
    series.push({ key, ...SERIES[key], guides: [...list].sort((a, b) => order(a) - order(b)) });
  }
  return { singles: guides.filter((g) => !inSeries.has(g.slug)), series };
}

function GuideSection({ section, guides, lead, tone }: GuideSectionWithGuides & { lead: boolean; tone: "light" | "quiet" }) {
  const statics = guides.filter((g) => g.kind === "guide");
  const articles = guides.filter((g) => g.kind === "article");
  const split = splitSeries(statics);
  const series = split.series;
  const rank = (g: GuideEntry) => {
    const i = SELLING_FIRST.indexOf(g.slug);
    return i === -1 ? SELLING_FIRST.length : i;
  };
  const singles = section.id === "selling" ? [...split.singles].sort((a, b) => rank(a) - rank(b)) : split.singles;
  const hubId = SECTION_HUB[section.id];
  const hub = hubId ? { href: PERSONA_BY_ID[hubId].hubPath, label: `${PERSONA_BY_ID[hubId].hubHeading} hub` } : undefined;
  // The lead (selling) section shows each guide's one-line summary; the rest
  // list titles only, so the page stays scannable.
  const showDescriptions = lead;
  const seriesRows = series.length > 0 && (
    <div className={`space-y-3 ${lead ? "mb-8" : "mt-6"}`}>
      {series.map((s) => (
        <div key={s.key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-sm font-semibold text-ink sm:w-56 shrink-0">{s.label}</p>
          <ul className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
            {s.guides.map((g) => {
              const st = STATE_SUFFIX.exec(g.slug)![1];
              return (
                <li key={g.slug}>
                  <Link
                    href={g.href}
                    title={g.title}
                    className="flex sm:inline-flex items-center justify-center sm:min-w-[3.25rem] rounded-md border border-line px-2.5 py-2 sm:py-1.5 text-sm font-semibold text-ink hover:border-ink"
                  >
                    {STATE_LABEL[st]}
                    <span className="sr-only"> {s.noun}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <Band id={section.id} tone={tone} spacing="compact" className="scroll-mt-24">
      <GuideSectionHeading title={section.label} blurb={section.blurb} hub={hub} />

      {lead && seriesRows}
      {singles.length > 0 && (
        <ul className="grid md:grid-cols-2 md:gap-x-12 border-t border-line md:border-t-0">
          {singles.map((g, i) => (
            <li key={g.slug} className={`border-b border-line ${i < 2 ? "md:border-t" : ""}`}>
              <RowLink href={g.href} title={g.title} description={showDescriptions ? g.description : undefined} />
            </li>
          ))}
        </ul>
      )}

      {!lead && seriesRows}

      {articles.length > 0 && (
        <div className={singles.length > 0 || series.length > 0 ? "mt-8" : ""}>
          {(singles.length > 0 || series.length > 0) && (
            <h3 className="mb-2 text-sm font-semibold text-ink-muted">Articles</h3>
          )}
          <ul className="grid md:grid-cols-2 md:gap-x-12 border-t border-line md:border-t-0">
            {articles.map((g, i) => (
              <li key={g.slug} className={`border-b border-line ${i < 2 ? "md:border-t" : ""}`}>
                <RowLink href={g.href} title={g.title} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Band>
  );
}
