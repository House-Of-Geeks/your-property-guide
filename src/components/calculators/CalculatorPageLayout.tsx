import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { BUYING_GUIDE_CTA, ExpertCTA } from "@/components/journey";
import { NextStepCard } from "@/components/journeys/NextStepCard";
import { nextStepFor } from "@/lib/next-steps";
import { Faq, type FaqItem, GuideStartInline, RelatedGuides, type RelatedGuide } from "@/components/guide";
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/seo";
import { PERSONA_BY_ID, type PersonaId } from "@/lib/constants/journey";
import { guideAudienceForPersona, guideFunnelHref } from "@/lib/guide-funnel";

export interface CalculatorPageFrontmatter {
  // Page-level metadata
  title: string;            // Short name: breadcrumbs, schema, and the H1 unless `h1` is set
  h1?: string;              // The H1 when it should carry the query (e.g. "How much can I borrow? ..."); defaults to `title`
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
  // Which guide funnel the lead CTAs push. Buyer-finance calculators
  // (mortgage, borrowing power, etc.) serve people buying or refinancing,
  // so the seller-framed default would be an intent mismatch for them.
  intent?: "selling" | "buying";
}

export function CalculatorPageLayout({
  frontmatter,
  calculator,
  explainer,
  faqs = [],
  related = [],
  intent = "selling",
}: CalculatorPageLayoutProps) {
  const persona = frontmatter.persona ? PERSONA_BY_ID[frontmatter.persona] : null;
  const pageUrl = `/${frontmatter.slug}`;
  const funnelHref = guideFunnelHref(intent, { from: frontmatter.slug });
  // Seller calculators (commission, selling costs) start the selling-guide
  // funnel right under the result, where the reader has just seen what
  // selling will cost them.
  const sellerCalculator = guideAudienceForPersona(frontmatter.persona) === "selling";
  // The priority calculators' own next step (src/lib/next-steps.ts).
  const contextual = nextStepFor(frontmatter.slug);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: frontmatter.title, url: pageUrl }]} />
      <WebApplicationJsonLd
        name={frontmatter.schemaName}
        description={frontmatter.schemaDescription}
        url={pageUrl}
      />

      {/* Compact hero so the calculator is on the first screen: the H1 that
          names the tool, one line on what it does, the date. A plain
          charcoal band (BRAND.md section 11: tools and reference pages may
          drop the photo), so nothing heavier than type sits above the
          widget. The persona hub link stays as a plain text link. */}
      <PhotoHero breadcrumbs={[{ label: frontmatter.title }]}>
        <HeroTitle>{frontmatter.h1 ?? frontmatter.title}</HeroTitle>
        <HeroLead>{frontmatter.description}</HeroLead>
        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
          <span>
            Updated <FormattedDate iso={frontmatter.updatedAt} />
          </span>
          <span aria-hidden="true">·</span>
          <span>Free, no sign-up</span>
          {persona && (
            <>
              <span aria-hidden="true">·</span>
              <Link href={persona.hubPath} className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                {persona.hubHeading}
              </Link>
            </>
          )}
        </p>
      </PhotoHero>

      {/* The calculator, then the one action that fits the result: seller
          calculators start the selling guide in place (with the appraisal
          as the alternative), buyer calculators offer the buying guide. A
          light band straight under the hero, with less room on top than a
          Band so the widget starts as high as it can; widgets are white
          cards, so they stay on white. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-20">
          {calculator}
          {contextual ? (
            <NextStepCard className="mt-8" {...contextual} />
          ) : sellerCalculator ? (
            <>
              <GuideStartInline from={frontmatter.slug} className="mt-8" />
              <p className="mt-3 text-sm text-ink-muted">
                Rather talk to someone who sells in your suburb?{" "}
                <Link href={`/get-help?service=selling-agent&from=${frontmatter.slug}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                  Ask for an appraisal introduction
                </Link>
              </p>
            </>
          ) : intent === "buying" ? (
            <aside className="mt-8 rounded-xl border border-line bg-surface-warm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="font-display text-lg sm:text-xl font-bold text-ink leading-snug tracking-[-0.01em]">
                  Buying? Get the free buying guide
                </p>
                <p className="mt-1 text-sm text-ink-muted leading-relaxed max-w-2xl">
                  What you can really spend, the 2026 schemes state by state and how not to overpay.
                  Free PDF, personalised to your situation, in 60 seconds.
                </p>
              </div>
              <Link href={funnelHref} className={`shrink-0 justify-center ${BUTTON_PRIMARY}`}>
                Get the free buying guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </aside>
          ) : null}
        </div>
      </section>

      {/* Explainer + FAQ + related, two-column with a short sidebar note.
          Light: explainers carry tables and quiet cards. */}
      <Band spacing="compact">
        <div className="grid lg:grid-cols-12 gap-12">
          <aside className="hidden lg:block lg:col-span-3 lg:order-2">
            <div className="sticky top-28 space-y-6 border-t border-line pt-4">
              <div>
                <p className="text-sm font-semibold text-ink mb-1">
                  An estimate, not a quote
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  These figures use simplified assumptions.{" "}
                  {intent === "buying"
                    ? "Real lender policies vary, especially around income shading, living-expense benchmarks and existing debts."
                    : "Check them with a professional before you act on them."}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink mb-1">
                  Spotted an error?
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Tell us and we&rsquo;ll fix it.{" "}
                  <Link href="/about#corrections" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    How corrections work
                  </Link>
                </p>
              </div>
            </div>
          </aside>

          {/* min-w-0: a wide table in the explainer scrolls inside its
              wrapper instead of stretching the grid column past the phone's width. */}
          <div className="min-w-0 lg:col-span-9 lg:order-1">
            <div className="prose-ypg [&>*:first-child]:mt-0">
              {explainer}
            </div>

            {/* Funnel exit at the end of the read. Seller-economics
                calculators push the selling guide; buyer-finance
                calculators the buying guide. */}
            <ExpertCTA
              variant="inline"
              {...(intent === "buying" ? BUYING_GUIDE_CTA : {})}
              href={funnelHref}
            />

            <Faq items={faqs} title="Common questions" />
            <RelatedGuides items={related} title="Keep reading" />
          </div>
        </div>
      </Band>

      {/* Next-step rail: the natural next calculator or guide, after the
          read, so the calculator is never a dead end. */}
      <NextStepRail currentSlug={frontmatter.slug} persona={frontmatter.persona} />
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
}

const ALL_NEXT_STEPS: Record<string, NextStepLink> = {
  "mortgage-calculator":           { label: "Mortgage repayments",          description: "Monthly repayments and total interest over the loan term.", href: "/mortgage-calculator" },
  "stamp-duty-calculator":         { label: "Stamp duty",                   description: "What stamp duty actually costs in your state.",              href: "/stamp-duty-calculator" },
  "borrowing-power-calculator":    { label: "Borrowing power",              description: "What lenders will let you borrow on your income.",           href: "/borrowing-power-calculator" },
  "affordability-calculator":      { label: "Affordability",                description: "What price you can actually afford.",                        href: "/affordability-calculator" },
  "rental-yield-calculator":       { label: "Rental yield",                 description: "Gross and net yield on a shortlisted investment property.",  href: "/rental-yield-calculator" },
  "cgt-calculator":                { label: "Capital gains tax",            description: "Estimate CGT on a property sale, including the discount.",  href: "/cgt-calculator" },
  "refinancing-calculator":        { label: "Refinancing break-even",       description: "How long until refinancing actually saves you money.",       href: "/refinancing-calculator" },
  "lmi-calculator":                { label: "LMI",                          description: "What lenders mortgage insurance costs on a deposit under 20%.", href: "/lmi-calculator" },
  "negative-gearing-calculator":   { label: "Negative gearing",             description: "Your weekly cost after tax on an investment property.",     href: "/negative-gearing-calculator" },
  "bridging-loan-calculator":      { label: "Bridging loan",                description: "Peak debt, end debt and what buying before you sell costs.", href: "/bridging-loan-calculator" },
  "selling-costs-calculator":      { label: "Selling costs",                description: "Commission, marketing and legal costs on your sale.",       href: "/selling-costs-calculator" },
  "help-to-buy-calculator":         { label: "Help to Buy",                  description: "Eligibility, the government's share and your repayments.",   href: "/help-to-buy-calculator" },
  "fhss-calculator":               { label: "FHSS",                         description: "What the First Home Super Saver scheme adds to your deposit.", href: "/fhss-calculator" },
  "guide-fhss":                    { label: "First Home Super Saver scheme", description: "The limits, the tax, and the timing rules since 2024.",       href: "/guides/first-home-super-saver-scheme" },
  "guide-help-to-buy":             { label: "Help to Buy scheme",           description: "How shared equity works, the rules and what happens at sale.", href: "/guides/help-to-buy-scheme-australia" },
  "guide-sell-first":              { label: "Sell first or buy first?",     description: "The decision before you commit to a bridging loan.",        href: "/guides/sell-first-or-buy-first" },
  "guide-deposit":                 { label: "How much deposit do I need?",  description: "5%, 10%, 20%, plus government schemes and FHSS.",            href: "/guides/how-much-deposit-to-buy-a-house" },
  "guide-buying":                  { label: "How to buy property in Australia", description: "Step-by-step from deposit to settlement.",               href: "/guides/buying-property-australia" },
  "guide-bridging":                { label: "Bridging loans",               description: "Peak debt, end debt, and when bridging is the right call.", href: "/guides/bridging-loans-guide" },
  "guide-house-vs-apartment":      { label: "House vs apartment",           description: "Capital growth vs cash flow, a 20-year worked example.",    href: "/guides/house-vs-apartment-investment-australia" },
  "guide-negative-gearing":        { label: "Negative gearing",             description: "How it works and whether it fits your strategy.",            href: "/guides/negative-gearing-australia" },
  "guide-negative-gearing-2027":   { label: "Negative gearing from 2027",   description: "Who is grandfathered and what counts as a new build.",       href: "/guides/negative-gearing-changes-2026-budget" },
  "guide-first-home-guarantee":    { label: "First Home Guarantee",         description: "Buy with a 5% deposit and no LMI.",                          href: "/guides/first-home-guarantee" },
  "best-suburbs":                  { label: "Best suburbs by category",     description: "Schools, growth, affordability, walkability, yield.",        href: "/best-suburbs" },
};

const NEXT_STEPS_FOR_SLUG: Record<string, string[]> = {
  "mortgage-calculator":        ["stamp-duty-calculator", "borrowing-power-calculator", "guide-deposit"],
  "stamp-duty-calculator":      ["borrowing-power-calculator", "mortgage-calculator", "guide-buying"],
  "borrowing-power-calculator": ["affordability-calculator", "mortgage-calculator", "guide-deposit"],
  "affordability-calculator":   ["borrowing-power-calculator", "stamp-duty-calculator", "best-suburbs"],
  "rental-yield-calculator":    ["negative-gearing-calculator", "cgt-calculator", "guide-house-vs-apartment"],
  "cgt-calculator":             ["negative-gearing-calculator", "rental-yield-calculator", "guide-negative-gearing"],
  "lmi-calculator":             ["help-to-buy-calculator", "borrowing-power-calculator", "guide-first-home-guarantee"],
  "negative-gearing-calculator": ["rental-yield-calculator", "cgt-calculator", "guide-negative-gearing-2027"],
  "refinancing-calculator":     ["mortgage-calculator", "borrowing-power-calculator", "guide-buying"],
  "bridging-loan-calculator":   ["guide-bridging", "selling-costs-calculator", "guide-sell-first"],
  "help-to-buy-calculator":     ["guide-help-to-buy", "guide-first-home-guarantee", "stamp-duty-calculator"],
  "fhss-calculator":            ["guide-fhss", "guide-deposit", "borrowing-power-calculator"],
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
    <Band tone="quiet" spacing="compact">
      <SectionHeading size="md" title={persona ? "Pair this with" : "Keep going"} />
      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-x-8 border-t border-line">
        {steps.map((s) => (
          <li key={s.href} className="border-b border-line">
            <Link href={s.href} className="group flex items-start justify-between gap-3 py-4">
              <span className="min-w-0">
                <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{s.label}</span>
                <span className="block mt-0.5 text-sm text-ink-muted leading-snug">{s.description}</span>
              </span>
              <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </Band>
  );
}
