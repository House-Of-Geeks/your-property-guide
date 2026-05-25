import Image from "next/image";
import Link from "next/link";
import { Calendar, Calculator as CalculatorIcon, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { ExpertCTA } from "@/components/journey";
import { Faq, type FaqItem, RelatedGuides, type RelatedGuide } from "@/components/guide";
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/seo";
import { PERSONA_BY_ID, type PersonaId } from "@/lib/constants/journey";

export interface CalculatorPageFrontmatter {
  // Page-level metadata
  title: string;            // H1
  description: string;      // Subhead under H1 (also used for meta description)
  slug: string;             // URL slug at /<slug>
  // SEO
  schemaName: string;       // For WebApplication JSON-LD
  schemaDescription: string;
  // EEAT
  updatedAt: string;        // ISO date
  // Persona this calculator primarily serves; powers the soft sidebar CTA.
  persona?: PersonaId;
}

interface CalculatorPageLayoutProps {
  frontmatter: CalculatorPageFrontmatter;
  // The interactive calculator component, rendered above the explainer.
  calculator: React.ReactNode;
  // Explainer body. Pass JSX styled with the .prose-ypg class.
  explainer: React.ReactNode;
  // FAQ items. Renders the FAQPage schema and visible Q&A.
  faqs?: readonly FaqItem[];
  // Related calculators / guides for internal linking.
  related?: readonly RelatedGuide[];
}

export function CalculatorPageLayout({
  frontmatter,
  calculator,
  explainer,
  faqs = [],
  related = [],
}: CalculatorPageLayoutProps) {
  const persona = frontmatter.persona ? PERSONA_BY_ID[frontmatter.persona] : null;
  const pageUrl = `/${frontmatter.slug}`;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: frontmatter.title, url: pageUrl }]} />
      <WebApplicationJsonLd
        name={frontmatter.schemaName}
        description={frontmatter.schemaDescription}
        url={pageUrl}
      />

      {/* Editorial hero. Magazine masthead with persona department slug
          and "Free calculator" date marker, display-scale H1, serif
          standfirst. Illustration column dropped: calculators read as
          authoritative tools when the title owns the page. */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-14 sm:pb-20">
          <div className="mb-10">
            <Breadcrumbs items={[{ label: frontmatter.title }]} />
          </div>

          {/* Magazine masthead: persona department + hairline + tool slug */}
          <div className="flex items-center gap-4 mb-10">
            {persona ? (
              <Link
                href={persona.hubPath}
                className="font-display italic text-primary hover:text-cta-hover text-base sm:text-lg leading-none transition-colors"
              >
                For {persona.cardLabel.toLowerCase()}
              </Link>
            ) : (
              <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                Free tool
              </span>
            )}
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium inline-flex items-center gap-1.5">
              <CalculatorIcon className="w-3 h-3" aria-hidden="true" />
              Free calculator
            </span>
          </div>

          {/* Display-scale H1 */}
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-8 max-w-[22ch] font-medium">
            {frontmatter.title}
          </h1>

          {/* Standfirst */}
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.3] max-w-3xl mb-8">
            {frontmatter.description}
          </p>

          {/* Updated dateline */}
          <div className="pt-5 border-t border-line flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
              Updated <FormattedDate iso={frontmatter.updatedAt} />
            </span>
            <span className="text-ink-subtle">·</span>
            <span>Free, no sign-up</span>
          </div>
        </div>
      </section>

      {/* Calculator widget */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {calculator}
        </div>
      </section>

      {/* Next-step rail: keeps users moving to the next logical calculator
          or guide based on persona, so the calculator is never a dead-end. */}
      <NextStepRail currentSlug={frontmatter.slug} persona={frontmatter.persona} />

      {/* Explainer + FAQ + related, two-column with sticky meta sidebar */}
      <section className="bg-surface-raised border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            <aside className="hidden lg:block lg:col-span-3 lg:order-2">
              <div className="sticky top-28 space-y-8">
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                    Estimate, not a quote
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    These numbers use simplified assumptions. Real lender policies vary widely, especially around income shading, HEM tables, and existing debts.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                    Editorial integrity
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    Every figure on this page is sourced and dated. If anything looks off, tell us and we&rsquo;ll fix it within a week.
                  </p>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9 lg:order-1">
              <div className="prose-ypg">
                {explainer}
              </div>

              {/* Funnel exit. Every calculator gets one. When the calculator
                  has a persona (finance-related), use the broker-specific
                  framing; otherwise fall back to the generic "right
                  specialist for your situation" copy which covers brokers,
                  accountants and conveyancers. */}
              {persona ? (
                <ExpertCTA
                  variant="inline"
                  headline="Want a real broker to run the numbers properly?"
                  body="Calculator estimates are a starting point. A mortgage broker can compare 30+ lender policies and tell you what you&rsquo;ll actually be approved for. Free for buyers, no commitment."
                />
              ) : (
                <ExpertCTA variant="inline" />
              )}

              <Faq items={faqs} title="Common questions" />
              <RelatedGuides items={related} title="Keep reading" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FormattedDate({ iso }: { iso: string }) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return <>{iso}</>;
  const month = d.toLocaleString("en-AU", { month: "long", timeZone: "Australia/Brisbane" });
  return <>{month} {d.getUTCFullYear()}</>;
}

// ─── Next-step rail ────────────────────────────────────────────────────────
// Persona-aware suggestions for what to look at after this calculator.
// Each link is one calculator or one guide that's the natural next step.

interface NextStepLink {
  label: string;
  description: string;
  href: string;
  icon: string;
}

const ALL_NEXT_STEPS: Record<string, NextStepLink> = {
  "mortgage-calculator":           { label: "Mortgage repayments",          description: "Monthly repayments and total interest over the loan term.", href: "/mortgage-calculator",           icon: "/images/icons/calculator.svg" },
  "stamp-duty-calculator":         { label: "Stamp duty",                   description: "What stamp duty actually costs in your state.",              href: "/stamp-duty-calculator",         icon: "/images/icons/calculator.svg" },
  "borrowing-power-calculator":    { label: "Borrowing power",              description: "What lenders will let you borrow on your income.",           href: "/borrowing-power-calculator",    icon: "/images/icons/calculator.svg" },
  "affordability-calculator":      { label: "Affordability",                description: "What price you can actually afford.",                        href: "/affordability-calculator",      icon: "/images/icons/median.svg" },
  "rental-yield-calculator":       { label: "Rental yield",                 description: "Gross and net yield on a shortlisted investment property.",  href: "/rental-yield-calculator",       icon: "/images/icons/yield.svg" },
  "cgt-calculator":                { label: "Capital gains tax",            description: "Estimate CGT on a property sale, including the discount.",  href: "/cgt-calculator",                icon: "/images/icons/calculator.svg" },
  "refinancing-calculator":        { label: "Refinancing break-even",       description: "How long until refinancing actually saves you money.",       href: "/refinancing-calculator",        icon: "/images/icons/calculator.svg" },
  "guide-deposit":                 { label: "How much deposit do I need?",  description: "5%, 10%, 20%, plus government schemes and FHSS.",            href: "/guides/how-much-deposit-to-buy-a-house", icon: "/images/icons/guide.svg" },
  "guide-buying":                  { label: "How to buy property in Australia", description: "Step-by-step from deposit to settlement.",               href: "/guides/buying-property-australia", icon: "/images/icons/guide.svg" },
  "guide-bridging":                { label: "Bridging loans",               description: "Peak debt, end debt, and when bridging is the right call.", href: "/guides/bridging-loans-guide",   icon: "/images/icons/guide.svg" },
  "guide-house-vs-apartment":      { label: "House vs apartment",           description: "Capital growth vs cash flow, a 20-year worked example.",    href: "/guides/house-vs-apartment-investment-australia", icon: "/images/icons/guide.svg" },
  "guide-negative-gearing":        { label: "Negative gearing",             description: "How it works and whether it fits your strategy.",            href: "/guides/negative-gearing-australia", icon: "/images/icons/guide.svg" },
  "best-suburbs":                  { label: "Best suburbs by category",     description: "Schools, growth, affordability, walkability, yield.",        href: "/best-suburbs",                  icon: "/images/icons/map.svg" },
};

const NEXT_STEPS_FOR_SLUG: Record<string, string[]> = {
  "mortgage-calculator":        ["stamp-duty-calculator", "borrowing-power-calculator", "guide-deposit"],
  "stamp-duty-calculator":      ["borrowing-power-calculator", "mortgage-calculator", "guide-buying"],
  "borrowing-power-calculator": ["affordability-calculator", "mortgage-calculator", "guide-deposit"],
  "affordability-calculator":   ["borrowing-power-calculator", "stamp-duty-calculator", "best-suburbs"],
  "rental-yield-calculator":    ["cgt-calculator", "guide-house-vs-apartment", "guide-negative-gearing"],
  "cgt-calculator":             ["rental-yield-calculator", "guide-negative-gearing", "guide-bridging"],
  "refinancing-calculator":     ["mortgage-calculator", "borrowing-power-calculator", "guide-buying"],
};

function NextStepRail({
  currentSlug,
  persona,
}: {
  currentSlug: string;
  persona?: PersonaId;
}) {
  const stepKeys = NEXT_STEPS_FOR_SLUG[currentSlug];
  if (!stepKeys || stepKeys.length === 0) return null;

  const steps = stepKeys
    .map((k) => ALL_NEXT_STEPS[k])
    .filter((s): s is NextStepLink => Boolean(s));

  if (steps.length === 0) return null;

  return (
    <section className="border-t border-line bg-surface-warm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
              What to do next
            </p>
            <h2 className="font-display text-2xl text-ink leading-tight">
              {persona ? "Pair this with…" : "Keep going"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-start gap-4 rounded-2xl border border-line bg-surface-raised p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <Image
                src={s.icon}
                alt=""
                width={32}
                height={32}
                aria-hidden="true"
                className="shrink-0 mt-0.5 opacity-90"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base text-ink group-hover:text-primary transition-colors leading-tight">
                  {s.label}
                </p>
                <p className="font-sans text-sm text-ink-muted mt-1 leading-relaxed">
                  {s.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
