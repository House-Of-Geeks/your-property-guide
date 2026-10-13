import Link from "next/link";
import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from "react";
import { HeroLead, HeroTitle, PhotoHero, type PhotoKey } from "@/components/premium";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { GuideTOC, type GuideTOCEntry } from "./GuideTOC";
import { Tldr } from "./Tldr";
import { Faq, type FaqItem } from "./Faq";
import { RelatedGuides, isCalculatorHref, type RelatedGuide } from "./RelatedGuides";
import { AuthorBylineCard } from "./AuthorBylineCard";
import { GuideByline } from "./GuideByline";
import { GuideNextStep } from "./GuideNextStep";
import { GuideAudienceProvider } from "./GuideAudienceContext";
import { GuideStartInline } from "./GuideStartInline";
import { Sources } from "./Sources";
import { splitAfterFirstSection } from "./split-first-section";
import articleScope from "./article-scope.module.css";
import { PERSONA_BY_ID, type PersonaId } from "@/lib/constants/journey";
import { guideAudienceForPersona } from "@/lib/guide-funnel";
import { GUIDE_SECTIONS, resolveGuides } from "@/lib/guides/registry";
import { CALCULATOR_GUIDES } from "@/lib/guides/hub-guides";

export interface GuideFrontmatter {
  title: string;          // SERP title (metadata); also the H1 unless h1 is set
  h1?: string;            // Page heading when it should carry more than the title budget allows (e.g. the capital city on a state guide)
  description: string;    // Meta description
  slug: string;           // URL slug under /guides/
  publishedAt: string;    // ISO date
  updatedAt?: string;     // ISO date; defaults to publishedAt
  readingTimeMinutes?: number;
  // EEAT signals per SEO ranking advice doc
  author: { name: string; role?: string };
  reviewedBy?: { name: string; role?: string };
  // Persona this guide primarily serves; routes the page's guide CTAs.
  persona?: PersonaId;
}

interface GuideArticleLayoutProps {
  frontmatter: GuideFrontmatter;
  tldr: readonly string[];
  toc: readonly GuideTOCEntry[];
  faqs?: readonly FaqItem[];
  related?: readonly RelatedGuide[];
  /** Full-width block between the hero and the article (a calculator on a calculator-first guide). */
  beforeBody?: React.ReactNode;
  children: React.ReactNode;
}

// One measure for the page: the reading column is 40rem (about 68
// characters of body text) and the rail 16rem beside it. The shell is the
// premium bands' measure, so the column lines up with the hero's heading.
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

// The hero photo follows the guide's reader (BRAND.md §11): the persona, with
// upgraders read as buyers (their guide CTA is the buying guide). Guides with
// no persona (renters' rights) get the paperwork photo.
const HERO_PHOTO: Record<PersonaId, PhotoKey> = {
  selling: "selling",
  "first-home": "firstHome",
  upgrading: "buying",
  investing: "investing",
  renovating: "renovating",
};

// On phones the breadcrumb trail stays on one line and drops the current
// page (the H1 says it); from tablet up the last crumb truncates.
const CRUMB_TRUNCATE =
  "[&_nav_ol]:flex-nowrap [&_nav_li:last-child]:hidden sm:[&_nav_li:last-child]:flex sm:[&_nav_li:last-child]:min-w-0 [&_nav_li:last-child_span]:min-w-0 [&_nav_li:last-child_span]:truncate";

export function GuideArticleLayout({
  frontmatter,
  tldr,
  toc,
  faqs = [],
  related = [],
  beforeBody,
  children,
}: GuideArticleLayoutProps) {
  const persona = frontmatter.persona ? PERSONA_BY_ID[frontmatter.persona] : null;
  const updatedAt = frontmatter.updatedAt ?? frontmatter.publishedAt;

  // Buyer-persona guides must not pitch the selling guide — a first-home
  // buyer reading "how much deposit do I need" has nothing to sell. Route
  // them to the buying-guide funnel; every other persona keeps the
  // selling-guide default (the site's primary conversion point). In-body
  // MatchCTAs read the same audience from GuideAudienceProvider below.
  const audience = guideAudienceForPersona(frontmatter.persona);
  const from = frontmatter.slug;
  // Guides with no persona (renters' rights) carry no guide pitch at all.
  const nextStep = persona ? audience ?? "selling" : null;

  // Seller guides (the commission and fees guides are where the site's
  // sellers come from) start the selling-guide funnel in place: once after
  // the first section and once at the end, instead of outline buttons to
  // the landing page.
  const sellerGuide = audience === "selling";

  // The sources block moves to the foot of the article, after the questions
  // and the reading list, where a reader checking a figure expects it.
  const { body: bodyNodes, sources } = partitionSources(children);
  const body = sellerGuide ? splitAfterFirstSection(bodyNodes) : null;

  const guideUrl = `/guides/${frontmatter.slug}`;
  const heading = frontmatter.h1 ?? frontmatter.title;
  const breadcrumbItems = [
    { label: "Guides", href: "/guides" },
    { label: frontmatter.title },
  ];
  const schemaBreadcrumbItems = [
    { name: "Guides", url: "/guides" },
    { name: frontmatter.title, url: guideUrl },
  ];

  const relatedItems = withCalculatorAndSection(frontmatter.slug, related);
  const contents: GuideTOCEntry[] = [
    ...toc,
    ...(faqs.length > 0 ? [{ id: "faq", label: "Common questions" }] : []),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={schemaBreadcrumbItems} />
      <GuideArticleJsonLd
        title={heading}
        description={frontmatter.description}
        url={guideUrl}
        datePublished={frontmatter.publishedAt}
        dateModified={updatedAt}
        author={frontmatter.author}
        reviewedBy={frontmatter.reviewedBy}
      />
      {/* Tells the phone bar (MobileBottomNav) which guide this reader gets. */}
      {nextStep && <span hidden data-guide-audience={nextStep} />}

      {/* Hero: the query's answer in the first screen, over the photo for
          the guide's reader. H1, the one-paragraph answer, then who checked
          it and when. */}
      <PhotoHero
        photo={frontmatter.persona ? HERO_PHOTO[frontmatter.persona] : "paperwork"}
        breadcrumbs={breadcrumbItems}
        className={CRUMB_TRUNCATE}
      >
        <header>
          {persona && (
            <Link
              href={persona.hubPath}
              className="inline-block text-sm font-semibold text-ink-muted hover:text-ink underline-offset-4 hover:underline mb-4"
            >
              {persona.hubHeading}
            </Link>
          )}
          <HeroTitle>{heading}</HeroTitle>
          {/* Standfirst. Marked data-speakable-summary so voice assistants
              (Google Assistant, Siri Reading Mode) pick up this paragraph as
              the canonical spoken summary alongside the H1. */}
          <div data-speakable-summary>
            <HeroLead>{frontmatter.description}</HeroLead>
          </div>
          <div className="mt-8 max-w-2xl border-t border-line pt-6">
            <GuideByline
              author={frontmatter.author}
              reviewer={frontmatter.reviewedBy}
              updatedAt={updatedAt}
              readingMinutes={frontmatter.readingTimeMinutes}
              sourcesHref={sources.length > 0 ? "#sources" : undefined}
            />
          </div>
        </header>
      </PhotoHero>

      {/* Calculator-first guides put the tool straight under the hero. */}
      {beforeBody && (
        <section className="bg-surface-warm border-b border-line">
          <div className={`${SHELL} py-8 sm:py-10`}>{beforeBody}</div>
        </section>
      )}

      <div className={`${SHELL} pt-10 sm:pt-12 pb-16`}>
        <div className="lg:grid lg:grid-cols-[minmax(0,40rem)_16rem] lg:gap-x-16 xl:gap-x-24">
          {/* Reading column. min-w-0 so a wide table scrolls inside its own
              wrapper instead of stretching the grid track past the phone;
              the scope makes body tables scroll on phones and lets
              .not-prose blocks keep their own styles. */}
          <article className={`min-w-0 ${articleScope.scope}`}>
            <Tldr points={tldr} />

            <div className="lg:hidden mt-4">
              <GuideTOC entries={contents} />
            </div>

            <div className="mt-10 sm:mt-12">
              <GuideAudienceProvider audience={audience} from={from}>
                {body ? (
                  <>
                    {body.head.length > 0 && <div className="prose-ypg">{body.head}</div>}
                    <GuideStartInline from={from} />
                    <div className="prose-ypg">{body.tail}</div>
                  </>
                ) : (
                  <div className="prose-ypg">{bodyNodes}</div>
                )}
              </GuideAudienceProvider>
            </div>

            {/* The one end-of-article action. Sellers (and the investor or
                renovator who sells) start the selling guide in place; buyers
                get the buying guide. */}
            {nextStep === "selling" && <GuideStartInline from={from} className="mt-12 mb-10" />}
            {nextStep === "buying" && <GuideNextStep audience="buying" from={from} />}

            <Faq items={faqs} id="faq" />
            <RelatedGuides items={relatedItems} />

            {sources}

            <AuthorBylineCard
              authorName={frontmatter.author.name}
              authorRole={frontmatter.author.role}
              reviewerName={frontmatter.reviewedBy?.name}
              reviewerRole={frontmatter.reviewedBy?.role}
              lastReviewed={updatedAt}
            />
          </article>

          {/* Desktop rail: the contents, marking the section in view, and
              the page's one next step under them. */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 space-y-8">
              <GuideTOC entries={contents} variant="sidebar" />
              {nextStep && <GuideNextStep audience={nextStep} from={from} variant="rail" />}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/** Pull top-level <Sources> blocks (including ones inside a fragment) out of a guide body. */
function partitionSources(children: ReactNode): { body: ReactNode[]; sources: ReactElement[] } {
  const body: ReactNode[] = [];
  const sources: ReactElement[] = [];
  const walk = (nodes: ReactNode) => {
    for (const node of Children.toArray(nodes)) {
      if (isValidElement(node) && node.type === Sources) sources.push(node);
      else if (isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment) walk(node.props.children);
      else body.push(node);
    }
  };
  walk(children);
  return { body, sources };
}

const STATE_SUFFIX = /-(nsw|vic|qld|wa|sa|tas|act|nt|victoria)$/;

/**
 * The guide's own reading list, plus the calculator that pairs with it
 * (CALCULATOR_GUIDES) when the list has none, topped up from the guide's own
 * section on /guides so every guide ends with at least four next reads.
 * Sibling state editions of the same guide are left out of the top-up.
 */
function withCalculatorAndSection(slug: string, curated: readonly RelatedGuide[]): RelatedGuide[] {
  const self = `/guides/${slug}`;
  const items = curated.filter((r) => r.href !== self);
  const seen = new Set(items.map((r) => r.href));

  const series = STATE_SUFFIX.test(slug) ? slug.replace(STATE_SUFFIX, "") : null;
  const section = GUIDE_SECTIONS.find((s) => s.guides.includes(slug));
  const guideCount = () => items.filter((r) => !isCalculatorHref(r.href)).length;
  if (section && guideCount() < 4) {
    for (const g of resolveGuides(section.guides)) {
      if (guideCount() >= 4) break;
      if (g.slug === slug || seen.has(g.href)) continue;
      if (series && g.slug.replace(STATE_SUFFIX, "") === series) continue;
      items.push({ title: g.title, href: g.href, description: g.description });
      seen.add(g.href);
    }
  }

  if (!items.some((r) => isCalculatorHref(r.href))) {
    const calc = CALCULATOR_GUIDES.find((c) => c.guides.includes(slug));
    if (calc) items.push({ title: calc.label, href: calc.href });
  }
  return items;
}
