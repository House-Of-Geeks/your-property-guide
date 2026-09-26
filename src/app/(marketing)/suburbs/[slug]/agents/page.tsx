import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { SuburbSubrouteHeader } from "@/components/suburb";
import { SuburbAppraisalCTA } from "@/components/suburb/SuburbAppraisalCTA";
import { MatchAgent } from "@/components/journey/MatchAgent";
import { BreadcrumbJsonLd, FAQPageJsonLd, PlaceJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getAgents, getAgenciesBySuburbSlug } from "@/lib/services/agent-service";
import { buildSuburbAgentsModel, CHOOSING_POINTS } from "@/lib/suburb-agents";
import { STATE_NAMES, type StateCode } from "@/lib/data/commission-rates";
import { formatPriceFull, formatPercentage } from "@/lib/utils/format";
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
    openGraph: { url: canonical, title: `${data.model.title} | ${SITE_NAME}`, description: data.model.description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbAgentsPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { suburb, model } = data;
  const sn = suburb.name;
  const stateName = STATE_NAMES[suburb.state as StateCode] ?? suburb.state;
  const commissionGuide = `/guides/real-estate-commission-${suburb.state.toLowerCase()}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: sn, url: `/suburbs/${slug}` },
          { name: "Real Estate Agents", url: `/suburbs/${slug}/agents` },
        ]}
      />
      <PlaceJsonLd name={sn} url={`/suburbs/${slug}`} addressLocality={sn} addressRegion={suburb.state} postalCode={suburb.postcode} />
      <FAQPageJsonLd faqs={model.faqs} />

      <SuburbSubrouteHeader
        suburb={suburb}
        eyebrow="Real estate agents in"
        breadcrumbLeaf="Real Estate Agents"
        title={<>Real estate agents in <span className="italic text-primary">{sn}</span>.</>}
        subtitle={
          model.commission && model.medianHousePrice
            ? `What agents charge on ${sn}'s ${formatPriceFull(model.medianHousePrice)} median, how to choose an agent, and a free match with one who sells here.`
            : `How to choose an agent in ${sn}, what they charge, and a free match with one agent who sells here.`
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* 1. Get matched. The lead. Same flow and scoring as the homepage,
            with intent and suburb pre-set so the visitor lands on timeframe. */}
        <section id="match" className="scroll-mt-16 grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="font-display italic text-primary text-base mb-3 leading-none">Get matched</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-4">
              One agent who sells in {sn}.
            </h2>
            <p className="font-sans text-base sm:text-lg text-ink-muted leading-[1.7] max-w-md">
              Tell us your timeframe and we connect you with one agent who has recent sales in {sn}, not a call centre and not a panel. Free, and no obligation to list.
            </p>
            <ul className="mt-6 space-y-2 font-sans text-sm text-ink-muted">
              {["Recent sales in this suburb, not the wider region", "One agent, not five, and you decide whether to meet them", "Free for you. The agent pays us for the introduction"].map((t) => (
                <li key={t} className="flex gap-2.5"><CheckCircle className="w-4 h-4 mt-0.5 text-cta flex-shrink-0" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="rounded-2xl border border-line bg-surface-warm p-8 min-h-[280px]" aria-hidden="true" />}>
              <MatchAgent initialSuburbSlug={slug} initialIntent="selling" source={model.matchSource} compact />
            </Suspense>
          </div>
        </section>

        {/* 2. Agents who sell here. Fills in as agents are onboarded; while
            the directory is paused it says so and points back to the match. */}
        <section id="agents" className="scroll-mt-16">
          <p className="font-display italic text-primary text-base mb-3 leading-none">Who sells here</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Agents who sell in {sn}.
          </h2>
          {model.agents.length === 0 && model.agencies.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface-warm p-6 sm:p-8 max-w-2xl">
              <p className="font-sans text-base text-ink leading-relaxed">
                We&rsquo;re adding vetted agents in {sn}. Until they&rsquo;re listed here,{" "}
                <a href="#match" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">request a match</a>{" "}
                and our team will find you one who sells in the suburb.
              </p>
              <p className="mt-3 font-sans text-sm text-ink-muted leading-relaxed">
                Are you an agent who sells in {sn}?{" "}
                <Link href="/real-estate-leads" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">Join the network</Link>.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {model.agents.map((a) => (
                <div key={a.id} className="rounded-2xl border border-line bg-surface-raised p-5">
                  <p className="font-display text-lg text-ink leading-tight">{a.fullName}</p>
                  {a.agencyName && <p className="font-sans text-sm text-ink-muted mt-1">{a.agencyName}</p>}
                  {a.suburbs.length > 1 && (
                    <p className="font-sans text-xs text-ink-subtle mt-2">Also sells in {a.suburbs.length - 1} nearby suburb{a.suburbs.length - 1 === 1 ? "" : "s"}</p>
                  )}
                  <Link href={`/agents/${a.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-primary">
                    Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
              {model.agencies.map((ag) => (
                <div key={ag.id} className="rounded-2xl border border-line bg-surface-raised p-5">
                  <p className="font-display text-lg text-ink leading-tight">{ag.name}</p>
                  <p className="font-sans text-sm text-ink-muted mt-1">Agency</p>
                  <Link href={`/real-estate-agencies/${ag.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-primary">
                    Agency profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. What agents charge, worked on the suburb's own median. */}
        <section id="fees" className="scroll-mt-16 grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="font-display italic text-primary text-base mb-3 leading-none">Fees</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-4">
              What agents charge in {sn}.
            </h2>
            <p className="font-sans text-base text-ink-muted leading-[1.7] max-w-md">
              Commission in {stateName} is set by agreement, not regulation. Agents typically charge{" "}
              {model.commission ? `${model.commission.lowPct}% to ${model.commission.highPct}%` : "between 1.6% and 3.25%"} of the sale price, plus marketing and GST, and every figure is negotiable.
            </p>
            <p className="mt-4 font-sans text-sm">
              <Link href={commissionGuide} className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">
                Commission in {stateName}, explained
              </Link>
              <span className="text-ink-subtle"> · </span>
              <Link href="/real-estate-commission-calculator" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">
                Work out your own sale
              </Link>
            </p>
          </div>
          <div className="lg:col-span-7">
            {model.commission && model.medianHousePrice ? (
              <div className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-4">
                  On {sn}&rsquo;s median house price of {formatPriceFull(model.medianHousePrice)}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: `Low, ${model.commission.lowPct}%`, value: model.commission.lowAmount },
                    { label: `Typical, ${model.commission.typicalPct}%`, value: model.commission.typicalAmount },
                    { label: `High, ${model.commission.highPct}%`, value: model.commission.highAmount },
                  ].map((c) => (
                    <div key={c.label}>
                      <p className="text-xs font-sans text-ink-subtle mb-1">{c.label}</p>
                      <p className="font-display text-2xl sm:text-3xl text-ink leading-none tabular-nums">{formatPriceFull(c.value)}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 font-sans text-xs text-ink-subtle leading-relaxed">
                  Before GST and marketing. Typical {stateName} ranges as at September 2026, from published agent-comparison guides; no state sets an official rate.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
                <p className="font-sans text-base text-ink-muted leading-relaxed">
                  We don&rsquo;t publish a median for {sn} yet, so we can&rsquo;t work the commission on a local figure. The {stateName} range still applies; the calculator works it on your expected price.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Choosing an agent here. */}
        <section id="choosing" className="scroll-mt-16">
          <p className="font-display italic text-primary text-base mb-3 leading-none">Choosing</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
            Five things to ask an agent in {sn}.
          </h2>
          <ol className="grid md:grid-cols-2 gap-4">
            {CHOOSING_POINTS.map((p, i) => (
              <li key={p.point} className="rounded-2xl border border-line bg-surface-raised p-5 flex gap-4">
                <span className="font-display text-2xl text-primary leading-none tabular-nums">{i + 1}</span>
                <div>
                  <p className="font-sans font-medium text-ink">{p.point}</p>
                  <p className="font-sans text-sm text-ink-muted mt-1 leading-relaxed">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 font-sans text-sm">
            <Link href="/guides/questions-to-ask-a-real-estate-agent" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">The full list of questions</Link>
            <span className="text-ink-subtle"> · </span>
            <Link href="/guides/how-to-choose-a-selling-agent" className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">How to choose a selling agent</Link>
          </p>
        </section>

        {/* 5. Selling here right now: the price context and the appraisal. */}
        <section id="selling" className="scroll-mt-16 grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="font-display italic text-primary text-base mb-3 leading-none">Selling in {sn}</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-4">
              Where prices sit right now.
            </h2>
            {model.medianHousePrice ? (
              <p className="font-sans text-base text-ink-muted leading-[1.7] max-w-md">
                The median house price in {sn} is <span className="font-medium text-ink">{formatPriceFull(model.medianHousePrice)}</span>
                {suburb.stats.annualGrowthHouse ? <>, <span className={`font-medium ${suburb.stats.annualGrowthHouse >= 0 ? "text-success" : "text-danger"}`}>{formatPercentage(suburb.stats.annualGrowthHouse)}</span> over the past year</> : null}
                {suburb.dataFreshness?.salesCount ? <>, from {suburb.dataFreshness.salesCount} recorded house sales</> : null}.{" "}
                <Link href={`/suburbs/${slug}#market`} className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors">Full house prices for {sn}</Link>.
              </p>
            ) : (
              <p className="font-sans text-base text-ink-muted leading-[1.7] max-w-md">
                We don&rsquo;t publish a median for {sn} yet. An agent who sells here will still give you a figure from the comparable sales they know.
              </p>
            )}
          </div>
          <div className="lg:col-span-7">
            <SuburbAppraisalCTA suburbName={sn} suburbSlug={slug} source={model.appraisalSource} formName="suburb-agents-appraisal" />
          </div>
        </section>

        {/* Visible FAQ backing the FAQPage schema */}
        <section id="faq" className="scroll-mt-16">
          <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
            Agents in {sn}: common questions.
          </h2>
          <dl className="divide-y divide-line border-y border-line">
            {model.faqs.map((f) => (
              <div key={f.question} className="py-5">
                <dt className="font-display text-lg text-ink leading-snug mb-2">{f.question}</dt>
                <dd className="font-sans text-base text-ink-muted leading-relaxed">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
