import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SuburbSubrouteHeader, SubpageNextSteps, type NextStepGroup } from "@/components/suburb";
import { MatchAgent } from "@/components/journey/MatchAgent";
import { Band } from "@/components/premium";
import { BreadcrumbJsonLd, FAQPageJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getAgents, getAgenciesBySuburbSlug } from "@/lib/services/agent-service";
import { getNearbySubpages } from "@/lib/services/nearby-subpages";
import { buildSuburbAgentsModel, commissionOnMedian, CHOOSING_POINTS } from "@/lib/suburb-agents";
import { salesProvenanceFor } from "@/lib/suburb-snapshot";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import { formatPriceFull } from "@/lib/utils/format";
import { suburbPlaceProps } from "@/lib/utils/lga";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 7-day ISR like the other suburb sub-pages: without these exports the
// route renders from the database on every crawler hit (see rental-market).
export const revalidate = 604800;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

async function load(slug: string) {
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return null;
  const [agents, agencies] = await Promise.all([getAgents(slug), getAgenciesBySuburbSlug(slug)]);
  return { suburb, model: buildSuburbAgentsModel(suburb, agents, agencies) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return { title: "Suburb Not Found" };
  const canonical = `${SITE_URL}/suburbs/${slug}/agents`;
  return {
    title: data.model.title,
    description: data.model.description,
    alternates: { canonical },
    // Without a reliable median the commission section cannot be worked on a
    // local figure; the page still serves a visitor but stays out of the
    // index (and the sitemap, see subpages/sitemap.ts).
    robots: data.model.indexable ? undefined : { index: false, follow: true },
    openGraph: { ...DEFAULT_OG, url: canonical, title: `${data.model.title} | ${SITE_NAME}`, description: data.model.description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

// Where no median is published the state's range is worked on an example
// price, labelled as one (review 10 Oct 2026, agents F2: never the national
// "1.6% to 3.25%" string).
const EXAMPLE_PRICE = 1_000_000;

const linkClass = "text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary";

export default async function SuburbAgentsPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { suburb, model } = data;
  const sn = suburb.name;
  const state = suburb.state as StateCode;
  const stateName = STATE_NAMES[state] ?? suburb.state;
  const stateLower = suburb.state.toLowerCase();
  const commissionGuide = `/guides/real-estate-commission-${stateLower}`;
  const nearby = await getNearbySubpages(suburb.nearbySuburbs);

  // The fee maths: on the suburb's own median where one is published, else
  // the state's range on an example price.
  const onMedian = Boolean(model.commission && model.medianHousePrice);
  const fees = model.commission ?? commissionOnMedian(suburb.state, EXAMPLE_PRICE);
  const basePrice = onMedian ? (model.medianHousePrice as number) : EXAMPLE_PRICE;
  const provenance = onMedian ? salesProvenanceFor(suburb) : null;
  const priceSource = provenance ? `${provenance.sourceShort}, ${provenance.periodShort}` : null;

  const subtitle = fees ? (
    <p>
      {`Agents in ${onMedian ? sn : stateName} typically charge `}
      <strong className="font-semibold">{`${fees.lowPct}% to ${fees.highPct}% of the sale price`}</strong>
      {onMedian
        ? `: about ${formatPriceFull(fees.lowAmount)} to ${formatPriceFull(fees.highAmount)} on ${sn}'s ${formatPriceFull(basePrice)} median house price${priceSource ? ` (${priceSource})` : ""}.`
        : `: ${formatPriceFull(fees.lowAmount)} to ${formatPriceFull(fees.highAmount)} on a ${formatPriceFull(EXAMPLE_PRICE)} sale. Here is how to choose an agent in ${sn}, and how to ask one for a free appraisal.`}
    </p>
  ) : (
    <p>{`How to choose an agent in ${sn}, what they charge, and a free introduction to one local agent.`}</p>
  );

  const nearbyAgents = nearby.filter((n) => n.agentsIndexable).slice(0, 8);
  const nextSteps: NextStepGroup[] = [
    {
      title: `Selling in ${sn}`,
      links: [
        { href: guideFunnelHref("selling", { suburb: slug, from: "suburb-agents" }), label: "The free selling guide" },
        { href: `/suburbs/${slug}`, label: `${sn} suburb profile` },
        ...(onMedian ? [{ href: `/suburbs/${slug}#market`, label: `${sn} house prices` }] : []),
      ],
    },
    {
      title: `Agent fees in ${suburb.state}`,
      links: [
        { href: commissionGuide, label: `Commission in ${stateName}` },
        { href: `/guides/cost-of-selling-a-house-${stateLower}`, label: `Cost of selling in ${suburb.state}` },
        { href: "/real-estate-commission-calculator", label: "Commission calculator" },
        { href: "/guides/how-to-negotiate-real-estate-agent-commission", label: "Negotiating commission" },
      ],
    },
    {
      title: "Choosing an agent",
      links: [
        { href: "/guides/how-to-choose-a-selling-agent", label: "How to choose a selling agent" },
        { href: "/guides/questions-to-ask-a-real-estate-agent", label: "Questions to ask an agent" },
        { href: "/property-valuation", label: "Appraisal, valuation or online estimate?" },
      ],
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: sn, url: `/suburbs/${slug}` },
          { name: "Real Estate Agents", url: `/suburbs/${slug}/agents` },
        ]}
      />
      <PlaceJsonLd name={sn} url={`/suburbs/${slug}`} addressLocality={sn} addressRegion={suburb.state} postalCode={suburb.postcode} {...suburbPlaceProps(suburb)} />
      <FAQPageJsonLd faqs={model.faqs} />

      <SuburbSubrouteHeader
        suburb={suburb}
        breadcrumbLeaf="Real Estate Agents"
        title={`Real estate agents in ${sn}`}
        subtitle={subtitle}
        action={
          // The page's one form: one local agent, free introduction. Intent
          // and suburb are set, so it opens on the timeframe question.
          <div id="agent-match" className="scroll-mt-24 rounded-xl border border-line bg-white p-5 sm:p-6">
            <h2 className="font-display text-lg sm:text-xl font-normal text-ink leading-snug tracking-[-0.03em]">
              One local agent, free introduction
            </h2>
            <p className="mt-1.5 mb-5 font-sans text-sm sm:text-[15px] text-ink-muted leading-relaxed">
              {`Tell us your timeframe and we introduce one agent who sells in ${sn}, for an appraisal or a plan. Where we don't have one yet, we tell you rather than pass your details on.`}
            </p>
            <Suspense fallback={<div className="min-h-[280px]" aria-hidden="true" />}>
              <MatchAgent initialSuburbSlug={slug} initialIntent="selling" source={model.matchSource} compact />
            </Suspense>
            <p className="mt-5 border-t border-line pt-3 font-sans text-xs text-ink-subtle leading-relaxed">
              Free for you, with no obligation to list. The agent pays us a flat fee for the introduction, never a share of their commission; it does not change what you pay them.
            </p>
          </div>
        }
      >
        {fees && (
          <div>
            {/* White figures on the dark hero (.tone-light). */}
            <dl className="tone-light grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {[
                { label: `Low, ${fees.lowPct}%`, value: fees.lowAmount },
                { label: `Typical, ${fees.typicalPct}%`, value: fees.typicalAmount },
                { label: `High, ${fees.highPct}%`, value: fees.highAmount },
              ].map((c) => (
                <div key={c.label} className="bg-white p-3 sm:p-4">
                  <dt className="font-sans text-xs sm:text-[13px] text-ink-muted mb-1.5">{c.label}</dt>
                  <dd className="font-display text-lg sm:text-2xl font-normal text-ink leading-none">{formatPriceFull(c.value)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 font-sans text-xs text-ink-muted leading-relaxed max-w-xl">
              {onMedian ? "" : `We don't publish a median for ${sn}, so the figures are on an example sale. `}
              {`Before GST and marketing. Typical ${stateName} ranges as at September 2026, from published agent-comparison guides; no state sets an official rate, and every figure is negotiable. `}
              <Link href={commissionGuide} className={linkClass}>{`Commission in ${stateName}, explained`}</Link>
              {" · "}
              <Link href="/real-estate-commission-calculator" className={linkClass}>Work out your own sale</Link>
            </p>
          </div>
        )}
      </SuburbSubrouteHeader>

      <Band spacing="compact">
        <div className="space-y-12 sm:space-y-16">
          {/* The "Agents who sell in {suburb}" listing that sat here is gone
              while agent profiles are paused (AGENT_LISTINGS_ENABLED in
              lib/suburb-agents): with no listings it was an empty promise. */}

          {/* Choosing an agent here. */}
          <section id="choosing" className="scroll-mt-20">
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-5">
              Five things to ask an agent in {sn}
            </h2>
            <ol className="grid md:grid-cols-2 gap-x-10 border-t border-line md:border-t-0">
              {CHOOSING_POINTS.map((p, i) => (
                <li key={p.point} className="flex gap-4 border-b border-line py-4 md:first:border-t md:[&:nth-child(2)]:border-t">
                  <span className="font-display text-lg font-normal text-ink leading-snug w-5 shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-sans font-semibold text-ink leading-snug">{p.point}</p>
                    <p className="font-sans text-sm text-ink-muted mt-1 leading-relaxed">{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Appraisal intent ("{suburb} property appraisal") lands on this
              page: answer it, with the price context, and point at the one
              form above rather than a second form. */}
          <section id="appraisal" className="scroll-mt-20 max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-4">
              Free property appraisal in {sn}
            </h2>
            <p className="font-sans text-base text-ink leading-relaxed">
              {`An appraisal is an agent's estimate of what your home would sell for, from the recent comparable sales they know in ${sn}. It is free and you are under no obligation to list. Ask for the three or four sales behind the figure, and compare two or three agents before you choose.`}
              {model.medianHousePrice
                ? " "
                : ` We don't publish a median for ${sn} yet, so an agent's figure from local sales is the best guide you will get. `}
              {model.medianHousePrice && (
                <>
                  {"For the suburb's own figures, see "}
                  <Link href={`/suburbs/${slug}#market`} className={linkClass}>{`${sn} house prices`}</Link>
                  {"."}
                </>
              )}
            </p>
            <p className="mt-4 font-sans text-[15px]">
              <a href="#agent-match" className={`font-medium ${linkClass}`}>Ask for a free appraisal</a>
              <span className="text-ink-subtle">{" · "}</span>
              <Link href="/property-valuation" className={linkClass}>Appraisal, valuation or online estimate?</Link>
            </p>
          </section>

          {nearbyAgents.length > 0 && (
            <section id="nearby-agents" className="scroll-mt-20">
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-5">
                Real estate agents in nearby suburbs
              </h2>
              <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4 border-t border-line sm:border-t-0">
                {nearbyAgents.map((n) => (
                  <li key={n.slug} className="border-b border-line sm:first:border-t sm:[&:nth-child(2)]:border-t lg:[&:nth-child(3)]:border-t lg:[&:nth-child(4)]:border-t">
                    <Link href={`/suburbs/${n.slug}/agents`} className="block py-2.5 font-sans text-[15px] text-ink hover:text-primary transition-colors">
                      {`Real estate agents in ${n.name}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Visible FAQ backing the FAQPage schema */}
          <section id="faq" className="scroll-mt-20 max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink tracking-[-0.03em] mb-4">
              Agents in {sn}: common questions
            </h2>
            <dl className="divide-y divide-line border-y border-line">
              {model.faqs.map((f) => (
                <div key={f.question} className="py-5">
                  <dt className="font-display text-lg font-normal text-ink leading-snug mb-2">{f.question}</dt>
                  <dd className="font-sans text-base text-ink-muted leading-relaxed">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </Band>

      <Band tone="quiet" spacing="compact">
        <div className="space-y-12 sm:space-y-16">
          <SubpageNextSteps id="next" title={`Next steps for ${sn} sellers`} groups={nextSteps} />
        </div>
      </Band>
    </>
  );
}
