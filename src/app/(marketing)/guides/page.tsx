import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PERSONA_BY_ID } from "@/lib/constants/journey";
import { GuideLinkList } from "@/components/guide/GuideLinkList";
import { ALL_GUIDES, guidesBySection } from "@/lib/guides/registry";
import { toGuideLinks } from "@/lib/guides/hub-guides";

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
const SECTIONS = guidesBySection();
const TOTAL_GUIDES = ALL_GUIDES.length;

const PERSONA_LINKS = [
  { id: "first-home", href: PERSONA_BY_ID["first-home"].hubPath, label: PERSONA_BY_ID["first-home"].cardLabel },
  { id: "selling",    href: PERSONA_BY_ID["selling"].hubPath,    label: PERSONA_BY_ID["selling"].cardLabel },
  { id: "upgrading",  href: PERSONA_BY_ID["upgrading"].hubPath,  label: PERSONA_BY_ID["upgrading"].cardLabel },
  { id: "investing",  href: PERSONA_BY_ID["investing"].hubPath,  label: PERSONA_BY_ID["investing"].cardLabel },
];

const TOOLS = [
  { title: "Real Estate Commission Calculator", href: "/real-estate-commission-calculator", description: "Work out what an agent's commission costs you on your sale price, state by state." },
  { title: "Borrowing Power Calculator",        href: "/borrowing-power-calculator",        description: "Estimate how much a lender will let you borrow based on income and expenses." },
  { title: "Stamp Duty Calculator",             href: "/stamp-duty-calculator",             description: "Estimate your stamp duty and first home buyer concessions in under a minute." },
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
            <Breadcrumbs items={[{ label: "Guides" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                {TOTAL_GUIDES} guides and articles, all free
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
                Property guides for <span className="italic text-primary">every stage</span>.
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
                Plain-English guides covering buying, selling, moving, investing,
                and renting in Australia. No paywall, no sign-up, sourced and dated.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/guides-hero.svg"
                  alt=""
                  aria-hidden="true"
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stat anchor row: the headline count by section, each a jump link */}
          <nav aria-label="Guide sections" className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            {SECTIONS.map(({ section, guides }) => (
              <a key={section.id} href={`#${section.id}`} className="group flex items-start gap-3">
                <Image src={section.icon} alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-display text-2xl text-ink leading-none mb-1">{guides.length}</p>
                  <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle group-hover:text-primary transition-colors">
                    {section.label.toLowerCase()}
                  </p>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Persona quick-jump */}
      <section className="border-b border-line bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-sans uppercase tracking-wider text-ink-subtle mr-2">
              Or jump to a hub:
            </span>
            {PERSONA_LINKS.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-1.5 text-sm font-medium text-ink hover:bg-surface-warm hover:border-ink transition-colors"
              >
                {p.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Every guide, by section */}
      <article className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
          {SECTIONS.map(({ section, guides }) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="grid lg:grid-cols-12 gap-8 mb-8">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center shrink-0">
                      <Image src={section.icon} alt="" width={24} height={24} className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle">
                      {guides.length === 1 ? "1 guide" : `${guides.length} guides`}
                    </p>
                  </div>
                  <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                    {section.label}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:col-start-7 flex items-end">
                  <p className="font-sans text-base text-ink-muted leading-relaxed">
                    {section.blurb}
                  </p>
                </div>
              </div>

              <GuideLinkList groups={[{ links: toGuideLinks(guides) }]} showDescriptions />
            </section>
          ))}
        </div>
      </article>

      {/* Calculators & tools */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Run the numbers
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Calculators &amp; tools
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Free calculators to size up the costs before you commit. No sign-up, instant results.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-line bg-surface-raised hover:border-ink hover:shadow-card-hover p-6 transition-all flex flex-col"
              >
                <h3 className="font-display text-lg text-ink leading-tight mb-3">
                  {tool.title}
                </h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1 mb-4">
                  {tool.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-ink self-start">
                  Open tool
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            Our guides are for general information only and do not constitute
            financial, legal, or tax advice. Always verify current grants,
            thresholds, and rules with the relevant state agency or a licensed
            professional before relying on them.
          </p>
        </div>
      </section>
    </>
  );
}
