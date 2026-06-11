import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, MapPin, Calculator } from "lucide-react";
import { SellingGuideFunnel } from "./SellingGuideFunnel";
import { BuyingGuideFunnel } from "./BuyingGuideFunnel";
import { StickyMatchCTA } from "./StickyMatchCTA";
import { EditorNote, Faq } from "@/components/guide";
import { BreadcrumbJsonLd } from "@/components/seo";
import { PERSONAS, getPersonaById, type PersonaId } from "@/lib/constants/journey";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";

interface PersonaHubLayoutProps {
  personaId: PersonaId;
}

// Per-persona editor's notes shown under the hero standfirst. Andy's
// first-person voice on what this hub is really about. Sets the editorial
// tone before the three-starting-points grid loads.
const PERSONA_EDITOR_NOTE: Record<PersonaId, React.ReactNode> = {
  "first-home": (
    <p>
      First home buying in Australia is mostly fear of paperwork. Schemes
      change every state border; LMI sounds expensive (and usually is);
      the cooling-off window has different teeth in NSW than in WA. This
      hub is built to take each of those off your list, in the order they
      come up in a real purchase.
    </p>
  ),
  "selling": (
    <p>
      The seller&rsquo;s mistake I see most often is overpaying on
      marketing and underpaying on agent choice. The campaign is what
      you can see, so it feels controllable. The negotiation that
      actually sets your sale price happens after the open homes,
      privately, and the right agent is worth more than every
      glossy brochure combined.
    </p>
  ),
  "upgrading": (
    <p>
      Upgrading or downsizing means two transactions need to talk to
      each other. Sell first, buy first, or use bridging finance: each
      has a different shape of risk, and the right call depends on
      your equity position, your timing, and how patient your next
      mortgage will be. The maths matters more than the marketing
      story you hear at open homes.
    </p>
  ),
  "investing": (
    <p>
      Investor-grade property is decided on three numbers: yield,
      growth thesis, and holding cost. Most &ldquo;hot suburb&rdquo;
      tips fail at least one of them. The guides and tools in this
      hub are the same numbers a buyer&rsquo;s agent would run for a
      $20,000 fee, free.
    </p>
  ),
  "renovating": (
    <p>
      Renovation costs in Australia have moved hard since 2023.
      Quoting a kitchen at 2019 prices is how owners blow budgets
      before the first wall comes down. This hub puts current-market
      cost ranges, finance options, builder selection and
      return-on-renovation guidance in one place.
    </p>
  ),
};

// Shared layout for all four persona hubs (/first-home-buyers, /selling,
// /upgrading, /investing). Editorial, education-first. Each hub leads with
// the persona's bespoke illustration over a warm hero, then surfaces three
// real existing pages as starting points, then a universal suburb-data CTA,
// then a soft expert CTA, then chips to the other personas.

// Renders an H2 with an italic emphasis token. Pass the heading with the
// emphasised phrase wrapped in asterisks, e.g. "Pick your *starting point*".
function HeadingWithEmphasis({ heading, className }: { heading: string; className: string }) {
  const parts = heading.split(/\*([^*]+)\*/g);
  return (
    <h2 className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="italic font-light text-primary">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </h2>
  );
}

export function PersonaHubLayout({ personaId }: PersonaHubLayoutProps) {
  const persona = getPersonaById(personaId);
  if (!persona) return null;

  const otherPersonas = PERSONAS.filter((p) => p.id !== personaId);
  const content = PERSONA_HUB_CONTENT[personaId];
  const isBuyingHub = personaId === "first-home" || personaId === "upgrading" || personaId === "investing";

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: persona.hubHeading, url: persona.hubPath }]} />

      {/* Editorial hero. Magazine masthead with numbered persona slug,
          display-scale H1 with italic emphasis on the persona noun, serif
          standfirst. Illustration column dropped: hub pages read as
          authoritative editorial when the headline owns the page. */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        {/* The golden-hour suburb runs quietly behind every persona hub
            so the five hubs and the homepage read as one publication. */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/hero/suburb-dusk.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right-bottom opacity-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-warm from-30% via-surface-warm/85 via-60% to-surface-warm/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-warm from-12% via-surface-warm/55 via-45% to-surface-warm/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
          {/* Magazine masthead: italic persona ordinal + hairline + label */}
          <div className="flex items-center gap-4 mb-12">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              No. {String(persona.order).padStart(2, "0")}
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Your Property Guide for
            </span>
          </div>

          {/* Display-scale H1. Persona heading owns the page */}
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            {persona.hubHeading}
          </h1>

          {/* Standfirst */}
          <p className="font-display font-light text-xl sm:text-2xl lg:text-3xl text-ink leading-[1.25] max-w-3xl">
            {persona.hubLede}
          </p>

          {/* Editor's note: per-persona first-person framing. Sets the
              editorial voice before the three-starting-points grid. */}
          <div className="max-w-3xl mt-10">
            <EditorNote>
              {PERSONA_EDITOR_NOTE[personaId]}
            </EditorNote>
          </div>
        </div>
      </section>

      {/* Deep-dive editorial content. This is the section that turns
          the hub from a navigation page into a ranking page: 4-5
          paragraphs of plain-English depth on what the persona actually
          needs to understand. Schemes, fees, math, common pitfalls. */}
      {content && (
        <section className="bg-surface border-b border-line">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                Briefing
              </span>
              <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                {content.deepDive.eyebrow}
              </span>
            </div>
            <HeadingWithEmphasis
              heading={content.deepDive.heading}
              className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-5xl font-medium mb-10"
            />
            <div className="space-y-6">
              {content.deepDive.paragraphs.map((para, i) => (
                <p key={i} className="font-sans text-base sm:text-lg text-ink leading-[1.75]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Persona-fit calculator grid. These are tappable cards rather
          than links in a paragraph — visitors who came to "run the
          numbers" get a one-tap path to the relevant tool. */}
      {content && content.calculators.length > 0 && (
        <section className="bg-surface-warm border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-center gap-4 mb-6">
              <Calculator className="w-5 h-5 text-cta" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                Run the numbers
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-8 mb-10">
              <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl font-medium max-w-2xl">
                {content.calculatorsHeading}
              </h2>
              <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed max-w-md">
                {content.calculatorsBlurb}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.calculators.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex flex-col rounded-2xl border border-line bg-surface-raised p-6 hover:border-ink hover:shadow-card transition-all"
                >
                  <h3 className="font-display text-lg text-ink group-hover:text-primary transition-colors leading-tight mb-2">
                    {c.label}
                  </h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1 mb-4">
                    {c.blurb}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                    Open
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Three starting points */}
      <section className="py-20 sm:py-24 bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Magazine-style section masthead */}
          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              Start here
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Three first reads
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 mb-14">
            <div className="lg:col-span-7">
              <h2 className="font-display text-ink leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl font-medium">
                Three places worth your{" "}
                <span className="italic font-light text-primary">first ten minutes</span>.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="font-display font-light text-lg sm:text-xl text-ink leading-snug max-w-md">
                Real pages on the site, not lead-capture forms. If they answer
                your question, great. If not, the rest of the hub is below.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {persona.startingPoints.map((sp, i) => (
              <Link
                key={sp.href}
                href={sp.href}
                className="group rounded-2xl border border-line bg-surface-raised hover:border-ink hover:shadow-card-hover p-7 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  {sp.icon ? (
                    <div className="w-10 h-10 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center">
                      <Image
                        src={sp.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        aria-hidden="true"
                      />
                    </div>
                  ) : <span />}
                  <p className="font-display italic text-cta text-xl">
                    0{i + 1}
                  </p>
                </div>
                <h3 className="font-display text-xl text-ink leading-tight mb-3">
                  {sp.label}
                </h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1 mb-5">
                  {sp.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
                  Open
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suburb data CTA, universal */}
      <section className="relative py-16 sm:py-20 bg-surface-warm border-y border-line-warm overflow-hidden">
        <Image
          src="/images/illustrations/street-grid.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden="true"
          className="absolute -right-12 -bottom-12 w-[400px] opacity-[0.12] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <MapPin className="w-7 h-7 text-cta mb-4" />
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-4">
                Suburb data, free for everyone.
              </h2>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-7 max-w-xl">
                Median, twelve-month growth, days on market, rental yield, schools, walkability,
                climate and crime. The numbers we&rsquo;d want for our own move, ungated.
              </p>
              <Link
                href="/suburbs"
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong text-ink hover:bg-surface-raised hover:border-ink font-medium px-5 py-2.5 transition-colors"
              >
                Browse suburbs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="lg:col-span-5 space-y-4 font-sans text-sm text-ink-muted border-l border-line-strong pl-6">
              <li>
                <p className="text-ink font-medium mb-1">Sources cited</p>
                <p className="leading-relaxed">Every figure tagged with where it came from and when it was last refreshed.</p>
              </li>
              <li>
                <p className="text-ink font-medium mb-1">Comparison-ready</p>
                <p className="leading-relaxed">Side-by-side any two suburbs in Australia.</p>
              </li>
              <li>
                <p className="text-ink font-medium mb-1">No login</p>
                <p className="leading-relaxed">No paywall, no sign-up, no download form.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ section. Renders both visible Q&A and FAQPage schema, so
          the hub becomes eligible for rich-result snippets in SERPs. */}
      {content && content.faqs.length > 0 && (
        <section className="bg-surface border-y border-line">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                Common questions
              </span>
              <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                FAQ
              </span>
            </div>
            <Faq items={content.faqs} />
          </div>
        </section>
      )}

      {/* Guide funnel band — the lead-capture surface. Buying-side
          personas (first home, upgrading, investing) get the buying
          guide; selling and renovating get the selling guide. Same dark
          night-suburb band as the homepage finale. */}
      <section id="guide" className="band-glow bg-surface-inverse text-white scroll-mt-24">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <Image
            src="/images/hero/suburb-night.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-inverse from-30% via-surface-inverse/85 via-68% to-surface-inverse/15" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4 mb-10">
                <span className="font-display italic text-cta text-base sm:text-lg leading-none">
                  Free PDF
                </span>
                <span className="w-12 h-px bg-white/20" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-white/60 font-sans font-medium">
                  2026 edition
                </span>
              </div>
              <h2 className="font-display text-white leading-[0.98] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-8 font-medium">
                {isBuyingHub ? (
                  <>The complete guide to <span className="italic font-light text-cta">buying</span> property.</>
                ) : (
                  <>The complete guide to <span className="italic font-light text-cta">selling</span> your property.</>
                )}
              </h2>
              <p className="font-display font-light text-xl sm:text-2xl text-white/80 leading-snug max-w-md">
                {isBuyingHub
                  ? "Ten chapters written for the buyer you actually are. Schemes, finance, inspections, the offer. Free, personalised, 60 seconds."
                  : "Selling costs 3 to 5 percent of your price. The right moves claw thousands of it back. Ten chapters, personalised to your suburb, free."}
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Suspense fallback={null}>
                {isBuyingHub ? (
                  <BuyingGuideFunnel source={`hub-${personaId}`} />
                ) : (
                  <SellingGuideFunnel source={`hub-${personaId}`} />
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Persistent sticky CTA — slides up once visitor has scrolled
          past the hero. Deep-links the right guide funnel. */}
      <StickyMatchCTA
        intent={content?.matchIntent}
        label={isBuyingHub ? "Get the free buying guide" : "Get the free selling guide"}
        href={isBuyingHub ? "/buying-guide" : "/selling-guide"}
        dismissKey={`hub:${personaId}`}
      />

      {/* Other personas */}
      <section className="py-12 border-t border-line bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Not what you came for?
          </p>
          <div className="flex flex-wrap gap-3">
            {otherPersonas.map((p) => (
              <Link
                key={p.id}
                href={p.hubPath}
                className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-5 py-3 text-sm font-medium text-ink hover:bg-surface-warm hover:border-ink transition-colors"
              >
                <Image
                  src={p.illustration}
                  alt=""
                  aria-hidden="true"
                  width={48}
                  height={32}
                  className="w-12 h-8 object-contain"
                />
                {p.cardLabel}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
