import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Band, HeroLead, HeroTitle, PhotoHero, SectionHeading } from "@/components/premium";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { RelatedGuidesSection } from "@/components/guide/GuideLinkList";
import { calculatorGuideGroups } from "@/lib/guides/hub-guides";
import { CALCULATORS, TOOL_GROUPS as GROUPS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Australian Property Tools, Quizzes & Calculators",
  description:
    `All our free property tools in one place: ${CALCULATORS.length} calculators, the agent proposal worksheet, the suburb match quiz and the suburb comparison tool. No sign-up.`,
  alternates: { canonical: `${SITE_URL}/tools` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/tools`,
    title: "Free Australian Property Tools, Quizzes & Calculators",
    description:
      "All our free property tools in one place: calculators, the suburb match quiz, the comparison tool.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Tools", url: "/tools" }]} />

      {/* Premium hero (BRAND.md section 11): the paperwork photo, for costs
          and rules, decorative under the flat charcoal overlay. */}
      <PhotoHero photo="paperwork" breadcrumbs={[{ label: "Tools" }]}>
        <HeroTitle>Property calculators and tools</HeroTitle>
        <HeroLead>
          Every calculator on the site, grouped by what you&rsquo;re doing:
          selling, buying or investing. Free, no sign-up.
        </HeroLead>
        <nav aria-label="Tool groups" className="mt-8 border-t border-line pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PhotoHero>

      {/* One band per group, light and quiet in turn. The group's free guide
          sits under its intro, beside the heading on a wide screen. */}
      {GROUPS.map((g, i) => (
        <Band key={g.id} id={g.id} tone={i % 2 === 1 ? "quiet" : "light"} spacing="compact" className="scroll-mt-20">
          <SectionHeading
            size="md"
            title={g.label}
            intro={
              <>
                {g.blurb}
                {g.guide && (
                  <Link
                    href={g.guide.href}
                    className="mt-3 flex w-fit items-center gap-1.5 text-base font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                  >
                    {g.guide.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </>
            }
          />
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 border-t border-line">
            {g.tools.map((t) => (
              <li key={t.href} className="border-b border-line">
                <Link href={t.href} className="group flex items-start justify-between gap-3 py-4">
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{t.title}</span>
                    <span className="block mt-0.5 text-sm text-ink-muted leading-snug">{t.description}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          {g.id === "suburbs" && (
            <p className="mt-6 text-sm text-ink-muted">
              The suburb figures come from state Valuer-General offices, ABS, ACARA, BoM and Geoscience Australia.{" "}
              <Link href="/methodology" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                Read our methodology
              </Link>
            </p>
          )}
        </Band>
      ))}

      {/* Each calculator with the guides it pairs with (src/lib/guides/hub-guides.ts);
          the page linked no guide at all until 30 Sep 2026. On white, after
          the last (quiet) group band. */}
      <RelatedGuidesSection
        heading="Every calculator, with the guide behind it"
        intro="The calculator runs the numbers; the guides explain the rules, rates and exemptions it applies."
        groups={calculatorGuideGroups()}
        tone="raised"
        id="calculator-guides"
      />
    </>
  );
}
