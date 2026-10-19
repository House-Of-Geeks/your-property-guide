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
import { HelpBand } from "@/components/journeys/ServiceSections";
import { NumbersPanel, type NumbersTool } from "@/components/interactive/NumbersPanel";
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
      The seller&rsquo;s mistake I see most often is treating the
      campaign as the brochure. The campaign is the whole plan: a price
      you can prove, a home presented for the top buyer, a launch that
      reaches every one of them, and the negotiation after the open
      homes. The same campaign wins at every price, and the agent you
      hire is the person who runs it. Hire the campaign, not the quote.
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

// The live number tools each hub opens with (v5, 14 Oct 2026).
const HUB_TOOLS: Record<PersonaId, readonly NumbersTool[]> = {
  "first-home": ["duty", "borrow"],
  selling: ["sell"],
  upgrading: ["sell", "duty", "borrow"],
  investing: ["duty", "borrow"],
  renovating: ["sell"],
};

// One line under each hub's heading (14 Oct 2026): the long answer
// paragraph now opens the briefing band instead.
const HUB_LEDE: Record<PersonaId, string> = {
  "first-home": "Your budget, the grants and schemes in your state, and every step to the keys.",
  selling: "Know your costs and your price, choose the right agent, and sell with a plan.",
  upgrading: "Selling one home and buying the next: the order, the money in between, and the timing.",
  investing: "Yield, growth, tax and holding costs, worked out before you buy.",
  renovating: "What renovations cost, what adds value, and what to leave alone before you sell.",
};

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
      <PhotoHero photo={PERSONA_PHOTO[personaId]} size="lg" book={isBuyingHub ? "buying" : "selling"} bookHref={guideHref}>
        <HeroTitle>{persona.hubHeading}</HeroTitle>
        <HeroLead>{HUB_LEDE[personaId]}</HeroLead>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
          <Link href={`/plan?j=${isBuyingHub ? "buying" : "selling"}`} className={`${BUTTON_PRIMARY} justify-center`}>
            Build my next-step plan
          </Link>
          <Link href={guideHref} className={`${BUTTON_SECONDARY} justify-center`}>
            {isBuyingHub ? "Free buying guide (PDF)" : "Free selling guide (PDF)"}
          </Link>
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          {"Free to read and use, no sign-up. We only introduce an agent if you ask. "}
          <Link href="/about#ownership-funding" className="underline underline-offset-4">How we’re paid</Link>
        </p>
      </PhotoHero>

      {/* Run your numbers: the live tools for this move, straight under the hero. */}
      <Band tone="quiet" spacing="compact">
        <SectionHeading size="md" title="Run your numbers" intro="Drag the sliders and the answer updates as you go. Nothing you enter leaves this page." />
        <div className="mt-8 sm:mt-10">
          <NumbersPanel tools={HUB_TOOLS[personaId]} from={`hub-${personaId}`} />
        </div>
      </Band>

      {/* Start here: the three first reads, as cards. */}
      <Band spacing="compact">
        <h2 className="text-2xl sm:text-3xl text-ink">Start here</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {persona.startingPoints.map((sp) => (
            <li key={sp.href}>
              <Link href={sp.href} className="group flex h-full flex-col rounded-2xl bg-surface-warm p-6 transition-colors hover:bg-surface-warm-sunken">
                <span className="text-xl font-bold text-ink">{sp.label}</span>
                <span className="mt-2 text-base text-ink-muted leading-relaxed">{sp.description}</span>
                <span className="mt-auto pt-5 inline-flex items-center gap-1.5 font-semibold text-ink">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {/* The rest of the briefing: depth on what the persona needs to
          understand (the ranking body of the hub), opening with the answer. */}
      {content && (
        <Band tone={tone("briefing")}>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-ink-muted mb-4">{content.deepDive.eyebrow}</p>
            <SectionHeading title={plainHeading(content.deepDive.heading)} />
            <div className="mt-10 space-y-5">
              {[answer, ...briefing].map((para, i) => (
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
                ? "Ten chapters for buyers: schemes, finance, inspections and the offer, in order. Free. Tell us where to send it; nothing else is sent unless you ask."
                : "Ten chapters on selling well, in order: costs, preparation, choosing an agent, the campaign and the contract. Free. Tell us where to send it; nothing else is sent unless you ask."}
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

      {/* Personal help, honestly: who, what they charge, where we can help. */}
      <HelpBand service={isBuyingHub ? "buyers-agent" : "selling-agent"} from={`hub-${personaId}`} />

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
