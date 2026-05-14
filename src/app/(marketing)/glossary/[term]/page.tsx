import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, DefinedTermJsonLd } from "@/components/seo";
import { GLOSSARY_TERMS, getGlossaryTerm } from "@/lib/data/glossary";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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
    title: `${entry.term}, Australian Property Glossary | ${SITE_NAME}`,
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

  // Cross-link guide based on category
  const relatedGuide = PERSONA_GUIDE[entry.category];

  const plain = stripHtml(entry.html);

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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pb-20">
          <div className="mb-10">
            <Breadcrumbs
              items={[
                { label: "Glossary", href: "/glossary" },
                { label: entry.term },
              ]}
            />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              Glossary
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              {entry.category.replace(/-/g, " ")}
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-4 max-w-[18ch] font-medium">
            What is{" "}
            <span className="italic font-light text-primary">{entry.term}</span>?
          </h1>
        </div>
      </section>

      {/* Definition body + sidebar */}
      <article className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main body */}
            <div className="lg:col-span-8">
              <div
                className="prose-ypg prose-ypg-tight"
                dangerouslySetInnerHTML={{ __html: `<p class="lead">${entry.html}</p>` }}
              />

              {/* Cross-link to relevant guide */}
              {relatedGuide && (
                <div className="mt-10 rounded-2xl border border-line bg-surface-warm p-6">
                  <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                    Go deeper
                  </p>
                  <Link
                    href={relatedGuide.href}
                    className="font-display text-2xl text-ink hover:text-primary transition-colors leading-tight inline-flex items-center gap-2 group"
                  >
                    {relatedGuide.label}
                    <ArrowRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <p className="mt-2 font-sans text-sm text-ink-muted leading-relaxed">
                    {relatedGuide.description}
                  </p>
                </div>
              )}

              {/* Prev / Next */}
              <nav
                aria-label="Glossary navigation"
                className="mt-10 grid grid-cols-2 gap-4"
              >
                {prev ? (
                  <Link
                    href={`/glossary/${prev.slug}`}
                    className="group rounded-2xl border border-line bg-surface-raised p-4 hover:border-primary/40 transition-colors"
                  >
                    <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1 inline-flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </p>
                    <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                      {prev.term}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/glossary/${next.slug}`}
                    className="group rounded-2xl border border-line bg-surface-raised p-4 hover:border-primary/40 transition-colors text-right"
                  >
                    <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1 inline-flex items-center gap-1 justify-end w-full">
                      Next <ArrowRight className="w-3 h-3" />
                    </p>
                    <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                      {next.term}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            </div>

            {/* Sidebar, nearby terms + back to A-Z */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-8">
                <Link
                  href="/glossary"
                  className="inline-flex items-center gap-2 font-sans text-sm font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to A–Z glossary
                </Link>

                {nearby.length > 0 && (
                  <div>
                    <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
                      Nearby terms
                    </p>
                    <ul className="space-y-1.5">
                      {nearby.map((n) => (
                        <li key={n.slug}>
                          <Link
                            href={`/glossary/${n.slug}`}
                            className="font-sans text-sm text-ink-muted hover:text-primary transition-colors"
                          >
                            {n.term}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-2xl border border-line bg-surface-warm p-5">
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                    Editorial note
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
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
