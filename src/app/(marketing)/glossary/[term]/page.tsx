import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, DefinedTermJsonLd } from "@/components/seo";
import { GuideStartInline } from "@/components/guide/GuideStartInline";
import { GuideNextStep } from "@/components/guide/GuideNextStep";
import { GLOSSARY_GUIDE_LINKS, GLOSSARY_TERMS, getGlossaryTerm } from "@/lib/data/glossary";
import { GuideLinkList } from "@/components/guide/GuideLinkList";
import { GUIDE_SECTIONS, resolveGuides } from "@/lib/guides/registry";
import { getCalculator, toGuideLinks, type GuideLink } from "@/lib/guides/hub-guides";
import { SITE_URL } from "@/lib/constants";

export const dynamicParams = false;

interface TermPageProps {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ term: t.slug }));
}

// Persona → guide hub map for cross-linking the relevant context guide on
// every term page (turns each definition into a stepping stone to deeper
// content rather than a dead-end snippet).
const PERSONA_GUIDE: Record<
  string,
  { label: string; href: string; description: string }
> = {
  "first-home": {
    label: "First home buyer guide",
    href: "/guides/first-home-buyer-guide",
    description: "Federal schemes, state grants, deposit, LMI and pre-approval.",
  },
  "selling": {
    label: "How to choose a selling agent",
    href: "/guides/how-to-choose-a-selling-agent",
    description: "Interview process, the appraisal-price trap, and the listing agreement.",
  },
  "upgrading": {
    label: "Sell first or buy first?",
    href: "/guides/sell-first-or-buy-first",
    description: "Decision tree across the three options, with worked examples.",
  },
  "investing": {
    label: "Negative gearing in Australia",
    href: "/guides/negative-gearing-australia",
    description: "How it works, what you can deduct, and whether it fits your strategy.",
  },
  "renters": {
    label: "Renter's rights guide (by state)",
    href: "/guides",
    description: "Bond, rent increases, repairs, entry, and ending a tenancy.",
  },
};

// Category labels for the kicker above the H1.
const CATEGORY_LABEL: Record<string, string> = {
  "first-home": "Buying",
  selling: "Selling",
  upgrading: "Upgrading",
  investing: "Investing",
  renters: "Renting",
};

// Term names were extracted from HTML and two carried an entity (fixed in
// src/lib/data/glossary.ts, 13 Oct 2026); decode defensively anyway.
function decodeTerm(term: string): string {
  return term.replace(/&apos;|&#39;/g, "’").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}

// Strip HTML tags for meta-description and the DefinedTerm schema description.
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { term } = await params;
  const entry = getGlossaryTerm(term);
  if (!entry) return { title: "Not Found" };

  const plain = stripHtml(entry.html);
  const meta = plain.length > 160 ? `${plain.slice(0, 157)}…` : plain;

  return {
    title: `${entry.term}, Australian Property Glossary`,
    description: meta,
    alternates: { canonical: `${SITE_URL}/glossary/${entry.slug}` },
    openGraph: {
      url: `${SITE_URL}/glossary/${entry.slug}`,
      title: `${entry.term}, Australian property definition`,
      description: meta,
      type: "article",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function GlossaryTermPage({ params }: TermPageProps) {
  const { term } = await params;
  const entry = getGlossaryTerm(term);
  if (!entry) notFound();

  // Pick 8 alphabetically-adjacent terms as a "browse nearby" rail
  const allSorted = [...GLOSSARY_TERMS].sort((a, b) =>
    a.term.localeCompare(b.term),
  );
  const idx = allSorted.findIndex((t) => t.slug === entry.slug);
  const nearby = allSorted
    .slice(Math.max(0, idx - 4), idx)
    .concat(allSorted.slice(idx + 1, idx + 5));

  // Pick prev/next for chronological browsing
  const prev = idx > 0 ? allSorted[idx - 1] : null;
  const next = idx < allSorted.length - 1 ? allSorted[idx + 1] : null;

  // The guides and calculators on this term's topic (GLOSSARY_GUIDE_LINKS);
  // a term without an entry falls back to its persona's general guide.
  const mapped = GLOSSARY_GUIDE_LINKS[entry.slug];
  const topicLinks: GuideLink[] = mapped
    ? [
        ...(mapped.tools ?? []).flatMap((href) => {
          const calc = getCalculator(href);
          return calc ? [{ href: calc.href, title: calc.label }] : [];
        }),
        ...toGuideLinks(resolveGuides(mapped.guides ?? [])),
      ]
    : [];
  const relatedGuide = PERSONA_GUIDE[entry.category];

  const plain = stripHtml(entry.html);
  const name = decodeTerm(entry.term);
  // The next step follows the term's reader: a selling term (by its
  // category, or because its "Go deeper" guides are selling guides, as for
  // "appraisal") starts the selling guide in place; every other term keeps
  // the buying guide.
  const sellingSlugs = GUIDE_SECTIONS.find((s) => s.id === "selling")?.guides ?? [];
  const sellingTerm =
    entry.category === "selling" || (mapped?.guides ?? []).some((g) => sellingSlugs.includes(g));
  const kicker = sellingTerm ? "Selling" : CATEGORY_LABEL[entry.category];
  const from = `glossary-${entry.slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Property Glossary", url: "/glossary" },
          { name: entry.term, url: `/glossary/${entry.slug}` },
        ]}
      />
      <DefinedTermJsonLd
        term={entry.term}
        description={plain}
        url={`/glossary/${entry.slug}`}
      />

      <div className="mx-auto w-full max-w-[64rem] px-4 sm:px-6">
        <div className="pt-2 sm:pt-4">
          <Breadcrumbs
            items={[
              { label: "Glossary", href: "/glossary" },
              { label: name },
            ]}
          />
        </div>
        <header className="max-w-3xl pt-4 sm:pt-8 pb-2">
          <p className="mb-3 text-sm font-semibold text-ink-muted">
            <Link href="/glossary" className="hover:text-ink hover:underline underline-offset-4">Property glossary</Link>
            {kicker && (
              <>
                <span aria-hidden="true" className="px-1.5 text-line-strong">·</span>
                {kicker}
              </>
            )}
          </p>
          <h1 className="font-display font-bold text-ink text-[2rem] leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            What is {name}?
          </h1>
        </header>
      </div>

      {/* Definition body + sidebar */}
      <article>
        <div className="mx-auto w-full max-w-[64rem] px-4 sm:px-6 pt-6 pb-16">
          <div className="lg:grid lg:grid-cols-[minmax(0,40rem)_16rem] lg:justify-between lg:gap-x-16">
            {/* Main body */}
            <div className="min-w-0">
              <div
                className="prose-ypg prose-ypg-tight"
                dangerouslySetInnerHTML={{ __html: `<p class="lead">${entry.html}</p>` }}
              />

              {/* Cross-link to the guide on this topic, else the persona guide */}
              {topicLinks.length > 0 ? (
                <section className="mt-10">
                  <h2 className="text-lg font-bold text-ink mb-3">Go deeper</h2>
                  <GuideLinkList groups={[{ links: topicLinks }]} columns={2} />
                </section>
              ) : relatedGuide && (
                <section className="mt-10">
                  <h2 className="text-lg font-bold text-ink mb-3">Go deeper</h2>
                  <Link
                    href={relatedGuide.href}
                    className="text-lg font-semibold text-ink hover:underline underline-offset-4 inline-flex items-center gap-2 group"
                  >
                    {relatedGuide.label}
                    <ArrowRight className="w-4 h-4 text-ink-muted" aria-hidden="true" />
                  </Link>
                  <p className="mt-1 text-[15px] text-ink-muted leading-relaxed">
                    {relatedGuide.description}
                  </p>
                </section>
              )}

              {/* The one next step, by the term's reader. */}
              {sellingTerm ? (
                <GuideStartInline from={from} />
              ) : (
                <GuideNextStep audience="buying" from={from} />
              )}

              {/* Prev / Next */}
              <nav
                aria-label="Glossary navigation"
                className="mt-10 grid grid-cols-2 gap-4"
              >
                {prev ? (
                  <Link
                    href={`/glossary/${prev.slug}`}
                    className="group rounded-xl border border-line p-4 hover:border-ink"
                  >
                    <p className="text-sm text-ink-muted mb-1 inline-flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </p>
                    <p className="text-base font-semibold text-ink leading-tight">
                      {decodeTerm(prev.term)}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/glossary/${next.slug}`}
                    className="group rounded-xl border border-line p-4 hover:border-ink text-right"
                  >
                    <p className="text-sm text-ink-muted mb-1 inline-flex items-center gap-1 justify-end w-full">
                      Next <ArrowRight className="w-3 h-3" />
                    </p>
                    <p className="text-base font-semibold text-ink leading-tight">
                      {decodeTerm(next.term)}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            </div>

            {/* Sidebar, nearby terms + back to A-Z */}
            <aside className="mt-12 lg:mt-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                <Link
                  href="/glossary"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to A–Z glossary
                </Link>

                {nearby.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-ink mb-3">
                      Nearby terms
                    </p>
                    <ul className="space-y-1.5">
                      {nearby.map((n) => (
                        <li key={n.slug}>
                          <Link
                            href={`/glossary/${n.slug}`}
                            className="text-sm text-ink-muted hover:text-ink hover:underline underline-offset-4"
                          >
                            {decodeTerm(n.term)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-line pt-5">
                  <p className="text-sm font-semibold text-ink mb-1">
                    Editorial note
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Plain-English definitions written for Australian buyers,
                    sellers, investors and renters. Anything looks off?{" "}
                    <a
                      href="mailto:andy@theandylife.com"
                      className="text-ink underline decoration-line-strong hover:decoration-primary"
                    >
                      Tell us
                    </a>{" "}
                    and we&rsquo;ll fix it.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
