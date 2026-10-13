import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { SellingGuideFunnel } from "./SellingGuideFunnel";
import { BuyingGuideFunnel } from "./BuyingGuideFunnel";
import { EditorNote, Faq } from "@/components/guide";
import { RelatedGuidesSection } from "@/components/guide/GuideLinkList";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { PERSONAS, getPersonaById, type PersonaId } from "@/lib/constants/journey";
import { PERSONA_HUB_CONTENT } from "@/lib/persona-hub-content";
import { hubGuideGroups, hubGuideList } from "@/lib/guides/hub-guides";
import { guideFunnelHref } from "@/lib/guide-funnel";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  Band,
  HeroLead,
  HeroTitle,
  PhotoHero,
  SectionHeading,
  type PhotoKey,
} from "@/components/premium";

interface PersonaHubLayoutProps {
  personaId: PersonaId;
}

// Per-persona editor's notes, Andy's first-person voice on what this hub is
// really about, closing the briefing.
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

// Shared layout for the persona hubs (/first-home-buyers, /selling,
// /upgrading, /investing, /renovating). Brand v4.1, answer first: the H1, the
// direct answer (the briefing's first paragraph), one action (sellers: the
// selling guide, with the appraisal as the alternative; buyers: the buying
// guide), and the three first reads beside it, all in a photo hero. Then the
// rest of the briefing, every guide for the persona, the calculators, the
// FAQ, and the guide funnel itself on a charcoal band near the end, where
// intent peaks.

// One documentary photo per hub, behind the hero (BRAND.md §6 and §11:
// generated to the brief, generic people, never a named place or person;
// decorative, so no alt text).
const PERSONA_PHOTO: Record<PersonaId, PhotoKey> = {
  "first-home": "firstHome",
  "selling": "selling",
  "upgrading": "verandah",
  "investing": "flats",
  "renovating": "renovating",
};

// Hub content headings mark an emphasis token with asterisks (v3 italics);
// v4 sets no italics, so the markers are dropped.
const plainHeading = (heading: string) => heading.replace(/\*([^*]+)\*/g, "$1").replace(/\.$/, "");

// The calculator cards repeat the hero's own actions on some hubs; the hero
// already carries those.
const HERO_ACTION_HREFS = new Set(["/selling-guide", "/buying-guide", "/appraisal"]);

export function PersonaHubLayout({ personaId }: PersonaHubLayoutProps) {
  const persona = getPersonaById(personaId);
  if (!persona) return null;

  const otherPersonas = PERSONAS.filter((p) => p.id !== personaId);
  const content = PERSONA_HUB_CONTENT[personaId];
  const isBuyingHub = personaId === "first-home" || personaId === "upgrading" || personaId === "investing";
  // The hub's full guide list (titles from the guide registry), where one is defined.
  const guideList = hubGuideList(persona.hubPath);

  const [answer, ...briefing] = content?.deepDive.paragraphs ?? [persona.hubLede];
  const guideHref = guideFunnelHref(isBuyingHub ? "buying" : "selling", { from: persona.hubPath.slice(1) });
  const calculators = (content?.calculators ?? []).filter((c) => !HERO_ACTION_HREFS.has(c.href));

  // The bands between the hero and the charcoal funnel band alternate white
  // and grey over whichever of them this hub has, so two of a kind never
  // meet (upgrading has no guide list).
  const bands = [
    content && "briefing",
    guideList && "guides",
    content && calculators.length > 0 && "calculators",
    content && content.faqs.length > 0 && "faq",
  ].filter((b): b is string => typeof b === "string");
  const tone = (band: string): "light" | "quiet" => (bands.indexOf(band) % 2 === 0 ? "light" : "quiet");

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: persona.hubHeading, url: persona.hubPath }]} />
      {/* Persona hubs are curated guide collections; the starting-points
          list is the collection's mainEntity so the hub is classified as
          a CollectionPage rather than a generic landing page. */}
      <CollectionPageJsonLd
        name={persona.hubHeading}
        description={persona.hubLede}
        url={persona.hubPath}
        items={persona.startingPoints.map((sp) => ({
          name: sp.label,
          url: sp.href,
          description: sp.description,
        }))}
      />

      {/* Hero: the answer and the one action on the left, the three first
          reads on the right, over the hub's photo. */}
      <PhotoHero
        photo={PERSONA_PHOTO[personaId]}
        aside={
          <nav aria-label="Start here">
            <h2 className="text-sm font-semibold text-ink mb-2">Start here</h2>
            <ul className="border-t border-line">
              {persona.startingPoints.map((sp) => (
                <li key={sp.href} className="border-b border-line">
                  <Link href={sp.href} className="group flex items-start justify-between gap-3 py-4">
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold text-ink group-hover:underline underline-offset-4">{sp.label}</span>
                      <span className="block mt-1 text-sm text-ink-muted leading-snug">{sp.description}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 mt-1.5 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        }
      >
        <HeroTitle>{persona.hubHeading}</HeroTitle>
        <HeroLead>{answer}</HeroLead>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
          <Link href={guideHref} className={`${BUTTON_PRIMARY} justify-center`}>
            {isBuyingHub ? "Get the free buying guide" : "Get the free selling guide"}
          </Link>
          {personaId === "selling" && (
            <Link href="/appraisal" className={`${BUTTON_SECONDARY} justify-center`}>
              Free appraisal
            </Link>
          )}
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          {isBuyingHub
            ? "Free PDF in 60 seconds. Never passed to selling agents."
            : "Free PDF in 60 seconds. Agents pay us for introductions; it costs you nothing."}
        </p>
      </PhotoHero>

      {/* The rest of the briefing: plain-English depth on what the persona
          needs to understand (the ranking body of the hub). */}
      {content && (
        <Band tone={tone("briefing")}>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-ink-muted mb-4">{content.deepDive.eyebrow}</p>
            <SectionHeading title={plainHeading(content.deepDive.heading)} />
            <div className="mt-10 space-y-5">
              {briefing.map((para, i) => (
                <p key={i} className="text-base sm:text-lg text-ink leading-[1.7]">
                  {para}
                </p>
              ))}
            </div>
            <EditorNote>{PERSONA_EDITOR_NOTE[personaId]}</EditorNote>
          </div>
        </Band>
      )}

      {/* Every guide for this persona (titles from the guide registry). */}
      {guideList && (
        <RelatedGuidesSection
          heading={guideList.heading}
          intro={guideList.intro}
          groups={hubGuideGroups(guideList)}
          tone={tone("guides") === "quiet" ? "warm" : "raised"}
          id="guides"
        />
      )}

      {/* The calculators that fit the situation, as a plain list. */}
      {content && calculators.length > 0 && (
        <Band tone={tone("calculators")}>
          <SectionHeading title={content.calculatorsHeading} intro={content.calculatorsBlurb} />
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-line">
            {calculators.map((c) => (
              <li key={c.href} className="border-b border-line">
                <Link href={c.href} className="group flex items-start justify-between gap-3 py-5">
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold text-ink group-hover:underline underline-offset-4">{c.label}</span>
                    <span className="block mt-1 text-sm text-ink-muted leading-snug">{c.blurb}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 mt-1.5 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Band>
      )}

      {/* FAQ. Renders both visible Q&A and FAQPage schema. */}
      {content && content.faqs.length > 0 && (
        <Band tone={tone("faq")}>
          <div className="max-w-3xl [&>section]:my-0">
            <Faq items={content.faqs} />
          </div>
        </Band>
      )}

      {/* The guide funnel, at the end of the read, on charcoal. Buying-side
          personas (first home, upgrading, investing) get the buying guide;
          selling and renovating get the selling guide. The funnel card
          carries .tone-light itself. */}
      <Band tone="dark" id="guide" className="scroll-mt-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              title={isBuyingHub ? "The complete guide to buying property" : "The complete guide to selling your property"}
            />
            <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-md">
              {isBuyingHub
                ? "Ten chapters written for the buyer you actually are. Schemes, finance, inspections, the offer. Free, personalised, 60 seconds."
                : "Selling costs 3 to 5 percent of your price. The right moves claw thousands of it back. Ten chapters, personalised to your suburb, free."}
            </p>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={null}>
              {isBuyingHub ? (
                <BuyingGuideFunnel source={`hub-${personaId}`} />
              ) : (
                <SellingGuideFunnel source={`hub-${personaId}`} />
              )}
            </Suspense>
          </div>
        </div>
      </Band>

      {/* Other personas */}
      <Band spacing="compact">
        <h2 className="text-lg font-semibold text-ink mb-5">Not what you came for?</h2>
        <div className="flex flex-wrap gap-3">
          {otherPersonas.map((p) => (
            <Link
              key={p.id}
              href={p.hubPath}
              className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 text-sm font-medium text-ink hover:border-ink transition-colors"
            >
              {p.cardLabel}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </Band>
    </>
  );
}
