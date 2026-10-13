import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { SellingGuideFunnel } from "@/components/journey";
import { GuideCover } from "@/components/brand/GuideCover";
import { getBlogPosts } from "@/lib/services/blog-service";
import { SITE_URL } from "@/lib/constants";

// Homepage (Oct 2026). One job above the fold: sell the agent network and the
// help that comes with it, and start sellers in the guide funnel beside a real
// person. Every claim here is the network's actual bar and the team's actual
// help, as Andy set them on 13 Oct 2026: keep them true if either changes.
// Buying, guides and research follow.
export const revalidate = 86400;

const META_TITLE = "Sell with the best real estate agent in your area";
const META_DESCRIPTION =
  "We match Australian sellers with agents who have proven local sales results, strong reviews and a clean record, and who have been interviewed by our team. Then we help you through to settlement. Free, with no obligation to list.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

// What an agent has to show before we introduce them.
const AGENT_CHECKS = [
  {
    title: "Proven local sales results",
    body: "A strong record of recent sales in the suburbs they cover.",
  },
  {
    title: "Strong reviews from past sellers",
    body: "Consistently high ratings from the people they’ve sold for.",
  },
  {
    title: "Licensed, experienced, clean record",
    body: "Fully licensed, with real selling experience and nothing against their name.",
  },
  {
    title: "Interviewed by our team",
    body: "We interview every agent before they join the network.",
  },
] as const;

const HERO_POINTS = [
  "Matched to your suburb and your property, anywhere in Australia",
  "We review the agent’s proposal and help you negotiate the fee",
  "Free to you, with no obligation to list",
] as const;

const STEPS = [
  {
    title: "Tell us about your sale",
    body: "A few quick questions about your property and your timing. Your free selling guide for your state arrives straight away.",
  },
  {
    title: "Talk it through with us",
    body: "Someone from our team calls to understand your property, your timing and what you need from an agent.",
  },
  {
    title: "Meet your matched agent",
    body: "We pick the right agent from our network for your suburb and your property, and set up a free appraisal. Only when you say yes.",
  },
  {
    title: "We stay with you to settlement",
    body: "We go through the agent’s proposal with you, help you negotiate the fee, and check in through the campaign, the offers and settlement.",
  },
] as const;

const CHAPTERS = [
  "Is now the right time to sell?",
  "What your property is really worth",
  "The real cost of selling",
  "Preparing your property",
  "Choosing your agent",
  "Auction, private sale or off-market",
  "Marketing that sells",
  "Offers, negotiation and exchange",
  "Contracts and settlement",
  "Your 12-week selling timeline",
] as const;

const SELLER_GUIDES = [
  { title: "How to sell a house in Australia",            href: "/guides/how-to-sell-a-house-australia",         note: "The whole process, step by step" },
  { title: "How to choose a selling agent",               href: "/guides/how-to-choose-a-selling-agent",         note: "What to compare, and what to ignore" },
  { title: "Real estate agent fees and commission",       href: "/guides/real-estate-agent-fees-australia",      note: "Typical rates by state, and how to negotiate" },
  { title: "The cost of selling a house",                 href: "/guides/cost-of-selling-a-house-australia",     note: "Every cost, from marketing to conveyancing" },
  { title: "Questions to ask a real estate agent",        href: "/guides/questions-to-ask-a-real-estate-agent",  note: "Take this list to every appraisal" },
  { title: "Auction or private sale?",                    href: "/guides/auction-vs-private-treaty",             note: "Which method suits your home" },
] as const;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

async function LatestGuidesList() {
  const posts = (await getBlogPosts()).slice(0, 4);
  if (posts.length === 0) return null;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={`/guides/${p.slug}`} className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4">
            <span className="text-sm text-ink-subtle sm:w-40 shrink-0">{fmtDate(p.updatedAt ?? p.publishedAt)}</span>
            <span className="text-base font-semibold text-ink group-hover:text-primary transition-colors">{p.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero: the offer, a person, and the guide funnel itself. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6 lg:pt-6">
              <h1 className="text-ink text-[40px] leading-[1.04] sm:text-6xl lg:text-[64px] tracking-[-0.035em] font-bold">
                Sell with one of the best agents in your area
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-ink-muted leading-relaxed max-w-xl">
                {"Every agent in our network has proven local sales results, strong reviews from past sellers and a clean record, and has been interviewed by our team. We match you with the right one, then stay with you until settlement."}
              </p>

              <ul className="mt-6 grid gap-2.5 text-base text-ink">
                {HERO_POINTS.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="mt-1 w-4 h-4 shrink-0 text-cta" strokeWidth={3} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-4 border-t border-line pt-6 max-w-xl">
                <Image
                  src="/images/agents/andy-mcmaster.jpg"
                  alt="Andy McMaster"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover object-top shrink-0"
                />
                <p className="text-[15px] text-ink-muted leading-snug">
                  <span className="font-semibold text-ink">Andy McMaster, founder.</span>{" "}
                  Our team reads every request and hand-picks your agent. We only
                  introduce one when you say yes.
                </p>
              </div>
            </div>

            <div id="guide-start" className="lg:col-span-6 scroll-mt-24">
              <p className="mb-3 text-base text-ink">
                {"Start with a few quick questions. Your free selling guide arrives straight away, and our team will be in touch to talk through your sale."}
              </p>
              <Suspense fallback={null}>
                <SellingGuideFunnel source="homepage-hero" />
              </Suspense>
              {/* The one fee disclosure on the page (BRAND.md §8: beside every
                  form). The full explanation is /about#ownership-funding,
                  linked from the header and footer too. */}
              <p className="mt-4 text-sm text-ink-subtle">
                {"Agents in our network pay us for introductions. It costs you nothing and doesn’t change what you pay your agent. "}
                <Link href="/about#ownership-funding" className="underline underline-offset-4 decoration-line-strong hover:text-ink hover:decoration-ink">
                  How we’re paid
                </Link>
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                {"Ready to meet an agent now? "}
                <Link href="/appraisal" className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
                  Book a free appraisal
                </Link>
                {". Buying instead? "}
                <Link href="/buying-guide" className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
                  Get the free buying guide
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo band: a real-looking Australian street, full bleed. */}
      <div className="relative h-[200px] sm:h-[300px] lg:h-[380px] border-b border-line bg-surface-sunken">
        <Image
          src="/images/photos/home-street.jpg"
          alt="A street of timber Queenslander houses with a jacaranda in flower"
          fill
          sizes="100vw"
          className="object-cover object-[50%_60%]"
        />
      </div>

      {/* 2. The bar: what makes an agent "the best" here, check by check. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl text-ink max-w-2xl">
            Every agent we introduce has cleared four checks
          </h2>
          <p className="mt-4 text-lg text-ink-muted leading-relaxed max-w-2xl">
            {"Plenty of agents call themselves the best. We only work with the ones who can show it."}
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AGENT_CHECKS.map((c) => (
              <li key={c.title} className="rounded-xl border border-line bg-white p-6">
                <Check className="w-5 h-5 text-cta" strokeWidth={3} aria-hidden="true" />
                <h3 className="mt-4 text-lg text-ink">{c.title}</h3>
                <p className="mt-2 text-base text-ink-muted leading-relaxed">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. How it works: the help a seller gets, from first call to settlement. */}
      <section className="border-b border-line bg-surface-warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl text-ink max-w-2xl">With you from the first call to settlement</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid gap-3 content-start">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-ink text-white text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="text-xl text-ink">{s.title}</h3>
                <p className="text-base text-ink-muted leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
          <Link
            href="#guide-start"
            className="mt-10 inline-flex items-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-white px-5 py-3 text-base font-semibold transition-colors"
          >
            Tell us about your property <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 4. What's inside the selling guide. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <div className="mx-auto max-w-[260px] text-[22px] sm:text-[26px] rotate-[-2deg]">
                <GuideCover guide="selling" />
              </div>
            </div>
            <div className="lg:col-span-8">
              <h2 className="text-3xl sm:text-4xl text-ink max-w-2xl">
                Ten chapters on selling well, for your state
              </h2>
              <p className="mt-4 text-lg text-ink-muted leading-relaxed max-w-2xl">
                The questions sellers ask us most, answered in order. Read it
                before you talk to agents, and keep it for when the offers come in.
              </p>
              <ol className="mt-8 grid sm:grid-cols-2 gap-x-10 border-t border-line">
                {CHAPTERS.map((c, i) => (
                  <li key={c} className="flex gap-4 py-3 border-b border-line text-base text-ink">
                    <span className="w-6 shrink-0 text-ink-subtle font-semibold">{i + 1}</span>
                    {c}
                  </li>
                ))}
              </ol>
              <Link
                href="#guide-start"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-white px-5 py-3 text-base font-semibold transition-colors"
              >
                Get the free guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Guides sellers read first, and the latest. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl text-ink">Guides sellers read first</h2>
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 border-t border-line">
              {SELLER_GUIDES.map((g) => (
                <li key={g.href} className="border-b border-line">
                  <Link href={g.href} className="group block py-4">
                    <span className="block text-base font-semibold text-ink group-hover:text-primary transition-colors">{g.title}</span>
                    <span className="block mt-1 text-sm text-ink-muted">{g.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/guides" className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-ink hover:text-primary">
              All guides <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl text-ink">Latest</h2>
            <div className="mt-8">
              <Suspense fallback={null}>
                <LatestGuidesList />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Buying band. */}
      <section className="border-b border-line bg-surface-inverse text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <h2 className="text-3xl sm:text-4xl text-white max-w-2xl">Buying? There&rsquo;s a free guide for that too</h2>
              <p className="mt-4 text-lg text-white/75 leading-relaxed max-w-2xl">
                Grants and schemes by state, deposits, pre-approval, inspections
                and making an offer. We never pass buyers&rsquo; details to selling agents.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/buying-guide"
                  className="inline-flex items-center gap-2 rounded-md bg-white text-ink hover:bg-white/90 px-5 py-3 text-base font-semibold transition-colors"
                >
                  Get the free buying guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link href="/first-home-buyers" className="text-base font-semibold text-white/85 hover:text-white underline underline-offset-4 decoration-white/30">
                  First home buyers
                </Link>
                <Link href="/stamp-duty-calculator" className="text-base font-semibold text-white/85 hover:text-white underline underline-offset-4 decoration-white/30">
                  Stamp duty calculator
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 hidden md:block">
              <div className="relative aspect-[3/2] rounded-xl overflow-hidden">
                <Image
                  src="/images/photos/open-home.jpg"
                  alt="A couple walking through a house at an open inspection"
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Research tools, kept low on the page. */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-base text-ink-muted">
            Also here:{" "}
            <Link href="/real-estate-commission-calculator" className="font-semibold text-ink hover:text-primary">commission calculator</Link>,{" "}
            <Link href="/tools" className="font-semibold text-ink hover:text-primary">all calculators</Link>,{" "}
            <Link href="/suburbs" className="font-semibold text-ink hover:text-primary">suburb profiles</Link> and{" "}
            <Link href="/market-reports" className="font-semibold text-ink hover:text-primary">market reports</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
