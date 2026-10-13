import Image from "next/image";
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
// /upgrading, /investing, /renovating). Brand v4, answer first: the H1, the
// direct answer (the briefing's first paragraph), one action (sellers: the
// selling guide, with the appraisal as the alternative; buyers: the buying
// guide), and the three first reads beside it. Then the rest of the briefing,
// every guide for the persona, the calculators, the FAQ, and the guide
// funnel itself at the end, where intent peaks.

// One documentary photo per hub, full bleed under the hero (BRAND.md §6:
// generated to the brief, generic people, never a named place or person).
const PERSONA_PHOTO: Record<PersonaId, { src: string; alt: string; position: string }> = {
  "first-home": {
    src: "/images/photos/first-home.jpg",
    alt: "New brick homes with Colorbond roofs on a young estate street",
    position: "object-[50%_55%]",
  },
  "selling": {
    src: "/images/photos/selling-house.jpg",
    alt: "A Federation brick home with a blank sale board out the front",
    position: "object-[50%_55%]",
  },
  "upgrading": {
    src: "/images/photos/verandah-couple.jpg",
    alt: "A couple sitting on the verandah of a weatherboard house among pot plants",
    position: "object-[50%_45%]",
  },
  "investing": {
    src: "/images/photos/flats.jpg",
    alt: "A red-brick block of flats behind a jacaranda in flower",
    position: "object-[50%_50%]",
  },
  "renovating": {
    src: "/images/photos/renovation.jpg",
    alt: "A room mid-renovation with a ladder, paint tins and a floor sander",
    position: "object-[50%_60%]",
  },
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
  const photo = PERSONA_PHOTO[personaId];
  const h2 = "font-display text-ink tracking-[-0.02em] text-[1.75rem] sm:text-4xl leading-tight font-bold";

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
          reads on the right. The hub's photo runs full bleed under it. */}
      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-14 sm:pb-16">
          <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 items-start">
            <div className="lg:col-span-7">
              <h1 className="font-display text-ink tracking-[-0.035em] text-[2.25rem] leading-[1.04] sm:text-5xl lg:text-6xl font-bold">
                {persona.hubHeading}
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-xl text-ink leading-normal sm:leading-[1.45] max-w-2xl">
                {answer}
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={guideHref}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-white font-semibold px-6 py-3 transition-colors"
                >
                  {isBuyingHub ? "Get the free buying guide" : "Get the free selling guide"}
                </Link>
                {personaId === "selling" && (
                  <Link
                    href="/appraisal"
                    className="inline-flex items-center justify-center rounded-md border border-ink text-ink hover:bg-ink hover:text-white font-semibold px-6 py-3 transition-colors"
                  >
                    Free appraisal
                  </Link>
                )}
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                {isBuyingHub
                  ? "Free PDF in 60 seconds. Never passed to selling agents."
                  : "Free PDF in 60 seconds. Agents pay us for introductions; it costs you nothing."}
              </p>
            </div>

            <nav aria-label="Start here" className="lg:col-span-5">
              <h2 className="text-sm font-semibold text-ink mb-2">Start here</h2>
              <ul className="border-t border-line">
                {persona.startingPoints.map((sp) => (
                  <li key={sp.href} className="border-b border-line">
                    <Link href={sp.href} className="group flex items-start justify-between gap-3 py-3.5">
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{sp.label}</span>
                        <span className="block mt-0.5 text-sm text-ink-muted leading-snug">{sp.description}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <div className="relative h-[180px] sm:h-[280px] lg:h-[340px] border-b border-line bg-surface-sunken">
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className={`object-cover ${photo.position}`} />
      </div>

      {/* The rest of the briefing: plain-English depth on what the persona
          needs to understand (the ranking body of the hub). */}
      {content && (
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <p className="text-sm font-semibold text-ink-muted mb-2">{content.deepDive.eyebrow}</p>
            <h2 className={`${h2} mb-6`}>{plainHeading(content.deepDive.heading)}</h2>
            <div className="space-y-5">
              {briefing.map((para, i) => (
                <p key={i} className="text-base sm:text-lg text-ink leading-[1.7]">
                  {para}
                </p>
              ))}
            </div>
            <EditorNote>{PERSONA_EDITOR_NOTE[personaId]}</EditorNote>
          </div>
        </section>
      )}

      {/* Every guide for this persona (titles from the guide registry). */}
      {guideList && (
        <RelatedGuidesSection
          heading={guideList.heading}
          intro={guideList.intro}
          groups={hubGuideGroups(guideList)}
          tone="warm"
          id="guides"
        />
      )}

      {/* The calculators that fit the situation, as a plain list. */}
      {content && calculators.length > 0 && (
        <section className="bg-white border-t border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className={`${h2} mb-2`}>{content.calculatorsHeading}</h2>
            <p className="text-base text-ink-muted leading-relaxed max-w-2xl mb-6">{content.calculatorsBlurb}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 border-t border-line">
              {calculators.map((c) => (
                <li key={c.href} className="border-b border-line">
                  <Link href={c.href} className="group flex items-start justify-between gap-3 py-4">
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink group-hover:underline underline-offset-4">{c.label}</span>
                      <span className="block mt-0.5 text-sm text-ink-muted leading-snug">{c.blurb}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-ink-subtle group-hover:text-ink" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ. Renders both visible Q&A and FAQPage schema. */}
      {content && content.faqs.length > 0 && (
        <section className="bg-white border-t border-line">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <Faq items={content.faqs} />
          </div>
        </section>
      )}

      {/* The guide funnel, at the end of the read. Buying-side personas
          (first home, upgrading, investing) get the buying guide; selling
          and renovating get the selling guide. */}
      <section id="guide" className="bg-surface-warm border-t border-line scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <h2 className={`${h2} mb-4`}>
                {isBuyingHub ? "The complete guide to buying property" : "The complete guide to selling your property"}
              </h2>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-md">
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
        </div>
      </section>

      {/* Other personas */}
      <section className="py-10 border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold text-ink mb-4">Not what you came for?</h2>
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
        </div>
      </section>
    </>
  );
}
