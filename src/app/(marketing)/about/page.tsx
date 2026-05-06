import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo";
import { TrustStrip } from "@/components/journey";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: "What we are, what we won't do, and how we make money. Plain English from the people building Your Property Guide.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { url: `${SITE_URL}/about`, title: `About ${SITE_NAME}`, description: "What we are, what we won't do, and how we make money.", type: "website" },
  twitter: { card: "summary_large_image" },
};

const PRINCIPLES = [
  {
    icon: "/images/icons/guide.svg",
    title: "Education first",
    body: "We answer the question, not push you to a form. The whole site is built around helping you make a confident decision.",
  },
  {
    icon: "/images/icons/median.svg",
    title: "Sourced and dated",
    body: "Every figure is tagged with where it came from and when it was last refreshed. If anything looks off, tell us, we'll fix it within a week.",
  },
  {
    icon: "/images/icons/yield.svg",
    title: "Free and ungated",
    body: "No paywall, no sign-up, no email gate to read or use anything. Suburb data, calculators and guides are free, full stop.",
  },
  {
    icon: "/images/icons/broker.svg",
    title: "Honest about money",
    body: "Partner agents and brokers pay us only when matched work goes ahead. Disclosed on every match. We don't sell or trade your details.",
  },
];

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={[{ name: "About", url: "/about" }]} />

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "About" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            About {SITE_NAME}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-4xl">
            We&rsquo;re building the property research tool we&rsquo;d want our <span className="italic text-primary">own family to use</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Free suburb data, plain-English guides, and free calculators.
            Education first. No sign-up gate, no pushy CTAs, no agenda.
          </p>
        </div>
      </section>

      {/* Why we exist */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Why we exist
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
            Australian property research is mostly written for the seller, not the buyer.
          </h2>
          <div className="prose-ypg">
            <p>
              Most of what passes for property research in Australia is funded by
              the people selling you the property. The biggest portals are
              optimised for listings; the best data sits behind a paywall; the
              guides are gated by lead-capture forms.
            </p>
            <p>
              We&rsquo;re not against agents (we work with them, transparently).
              We&rsquo;re against information being weaponised so you don&rsquo;t
              know what you&rsquo;re looking at when you bid, sign, or settle.
            </p>
            <p>
              Your Property Guide is the tool we wish existed when our friends
              and family were buying their first home, or selling their last one,
              or trying to work out whether to upgrade. Free, current, sourced,
              and written so it actually answers the question.
            </p>
          </div>
        </div>
      </section>

      {/* Our four principles */}
      <section className="bg-surface-warm border-y border-line-warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Our charter
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Four principles. <span className="italic text-primary">Non-negotiable.</span>
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                If we ever stop honouring any of these, hold us to them. Email
                andy@theandylife.com and tell us where we&rsquo;ve drifted.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-line bg-surface-raised p-7 flex flex-col"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center mb-5">
                  <Image src={p.icon} alt="" width={28} height={28} className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl text-ink leading-tight mb-3">{p.title}</h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we make money */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            How we make money
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
            Buyers and sellers pay nothing. <span className="italic text-primary">Ever.</span>
          </h2>
          <div className="prose-ypg">
            <p>
              When you&rsquo;re ready to talk to a buyer&rsquo;s agent or
              mortgage broker, we&rsquo;ll match you with someone we&rsquo;d
              use ourselves. They pay us a referral fee only when matched work
              goes ahead.
            </p>
            <p>
              We disclose this on every match. We don&rsquo;t sell your data.
              We don&rsquo;t accept fees from anyone we wouldn&rsquo;t use
              ourselves. And the data, guides, calculators and suburb profiles
              stay free regardless.
            </p>
            <p>
              <Link
                href="/find-an-expert"
                className="inline-flex items-center gap-1.5 text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 font-medium"
              >
                See how the matching works <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* The people behind it */}
      <section id="people" className="bg-surface-warm border-y border-line-warm scroll-mt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-5">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                The people
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
                Real names, <span className="italic text-primary">real bylines</span>.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans text-base text-ink-muted leading-relaxed">
                Every guide carries the byline of the person who wrote it and the
                name of the editor who reviewed it. No anonymous content, no AI
                slop dropped in unchecked.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <article
              className="rounded-2xl border border-line bg-surface-raised p-7"
              itemScope
              itemType="https://schema.org/Person"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                Editor
              </p>
              <h3 className="font-display text-2xl text-ink leading-tight" itemProp="name">
                Andy McMaster
              </h3>
              <p className="text-sm font-sans text-ink-muted mt-1" itemProp="jobTitle">
                Editor &amp; co-founder
              </p>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mt-4" itemProp="description">
                Andy runs editorial. Background in product and brand for finance
                and property businesses, including building yourfinanceguide.com.au.
                He commissions, edits, and signs off every guide before it
                publishes.
              </p>
              <link itemProp="url" href={`${SITE_URL}/about`} />
              <meta itemProp="email" content="andy@theandylife.com" />
            </article>

            <article
              className="rounded-2xl border border-line bg-surface-raised p-7"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
                Editorial team
              </p>
              <h3 className="font-display text-2xl text-ink leading-tight" itemProp="name">
                {SITE_NAME} editorial
              </h3>
              <p className="text-sm font-sans text-ink-muted mt-1">
                Australian property research
              </p>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mt-4" itemProp="description">
                Our editorial team writes the in-depth guides. Backgrounds across
                buyer&rsquo;s advocacy, mortgage broking and consumer finance
                journalism. Every figure cites a source, every guide carries an
                updated date, and the editor reviews before publishing.
              </p>
              <link itemProp="url" href={SITE_URL} />
            </article>
          </div>
        </div>
      </section>

      {/* Editorial methodology */}
      <section id="methodology" className="bg-surface-raised scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Editorial methodology
          </p>
          <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl mb-6">
            How we write, source, and update.
          </h2>
          <div className="prose-ypg">
            <p>
              Every guide goes through the same three steps: a writer drafts
              against a published outline, a domain reviewer (broker, agent, or
              accountant depending on topic) sanity-checks the technical claims,
              and the editor signs off on plain-English clarity.
            </p>
            <p>
              <strong>Sources.</strong> Suburb data is sourced from state
              Valuer-General offices, ABS Census, Geoscience Australia,
              OpenStreetMap, the Bureau of Meteorology, ACARA, and state police
              open data. Every figure on a suburb page carries a tooltip showing
              the source and the as-of date.
            </p>
            <p>
              <strong>Updates.</strong> Guides are reviewed at least annually,
              and immediately after any material law or scheme change (state
              budget changes, Home Guarantee Scheme rounds, RBA rate decisions).
              Each guide shows the published date and the last-updated date.
            </p>
            <p>
              <strong>Corrections.</strong> If you spot anything inaccurate,
              email <a href="mailto:andy@theandylife.com">andy@theandylife.com</a>{" "}
              and we&rsquo;ll fix it within a week. We log corrections in the
              guide footer.
            </p>
          </div>
        </div>
      </section>

      {/* Trust strip closer */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-4">
              The shorthand version
            </p>
            <h2 className="font-display text-ink leading-tight tracking-tight text-3xl sm:text-4xl">
              What you can <span className="italic text-primary">count on</span>.
            </h2>
          </div>
          <TrustStrip
            variant="rich"
            items={[
              { lead: "No paywall.", body: "Every page is free, and stays that way. No login, no email gate." },
              { lead: "No data resale.", body: "We don't sell or trade your details to anyone." },
              { lead: "Disclosed matches.", body: "If a partner pays us, you'll see it on every introduction." },
              { lead: "Vetted only.", body: "We don't take referrals from anyone we wouldn't use ourselves." },
            ]}
          />
        </div>
      </section>
    </>
  );
}
