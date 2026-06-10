import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Users, ShieldCheck, BadgeCheck } from "lucide-react";

import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { AgentEnquiryForm } from "./AgentEnquiryForm";

const META_TITLE = "Seller leads for real estate agents, without the commission share";
const META_DESCRIPTION =
  "Qualified vendor leads from Australia's plain-English property education site. Timeframe-scored, max three agents per lead, delivered the moment they come in. No 20 to 30 percent commission share.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/for-agents` },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    images: guideOgImages({
      slug: "for-agents",
      title: "Qualified seller leads. Not a third of your commission.",
      description: "Timeframe-scored vendor leads, max three agents per lead, no commission share.",
    }),
  },
};

export default function ForAgentsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "For Agents", url: "/for-agents" }]} />

      {/* Hero */}
      <section className="relative bg-surface-warm overflow-hidden border-b border-line">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                  For agents
                </span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                  Vendor leads, done differently
                </span>
              </div>

              <h1 className="font-display text-ink tracking-tight mb-6 text-4xl sm:text-5xl lg:text-6xl leading-[1.02] font-medium">
                Qualified seller leads.{" "}
                <span className="italic font-light text-primary">Not</span> a
                third of your commission.
              </h1>

              <p className="font-display text-lg sm:text-xl text-ink leading-[1.35] mb-8 font-light max-w-2xl">
                Our readers come to us for the numbers: suburb data, selling
                costs, agent fees. The ones planning to sell tell us their
                suburb, property, timeframe and situation before we ever
                mention an agent. You get the ones who are genuinely going to
                market.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-2xl mb-8">
                {[
                  {
                    icon: BadgeCheck,
                    title: "Qualified before you see them",
                    body: "Every lead is scored on selling timeframe, ownership and agent status. Vendors already under an agency agreement are filtered out, not sold to you anyway.",
                  },
                  {
                    icon: Users,
                    title: "Three agents, maximum",
                    body: "A lead goes to at most three local agents. No blast lists, no race against ten competitors who bought the same name.",
                  },
                  {
                    icon: Zap,
                    title: "Delivered the moment they convert",
                    body: "Appraisal-ready vendors contacted within 24 hours convert at several times the rate of stale ones. Leads land in your inbox in real time, scored hot, warm or cold.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "No commission share",
                    body: "The big platforms take 20 to 30 percent of your commission. We don't. Simple per-introduction pricing, agreed before you take a single lead.",
                  },
                ].map((f) => (
                  <div key={f.title} className="border-t border-line-strong pt-4">
                    <f.icon className="w-5 h-5 text-cta mb-2" aria-hidden="true" />
                    <p className="font-sans text-sm font-semibold text-ink mb-1.5">{f.title}</p>
                    <p className="font-sans text-sm text-ink-muted leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <AgentEnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* How leads are generated. Transparency for agents is the same
          asset as transparency for sellers: nobody else explains their
          supply. */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="font-display text-ink leading-[1.05] tracking-tight text-3xl sm:text-4xl font-medium mb-10 max-w-2xl">
            Where the leads come from.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ["01", "Sellers research with us", "Thousands of suburb profiles, fee guides and calculators bring in owners planning a sale. They download our selling guide and answer seven qualification questions on the way."],
              ["02", "We score and filter", "Timeframe, ownership, motivation and agent status. Already-listed vendors never become leads. Browsers go into nurture until they're ready, not into your inbox."],
              ["03", "You get the genuine sellers", "Hot leads (selling inside three months, no agent signed) reach you in real time with the full qualification picture attached: suburb, property type, bedrooms, price bracket, reason for selling."],
            ].map(([n, t, body]) => (
              <div key={n} className="border-t border-line-strong pt-4">
                <p className="font-display italic text-primary text-base mb-2 tabular-nums">{n}</p>
                <p className="font-sans text-sm font-semibold text-ink mb-1.5">{t}</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-ink-muted max-w-2xl">
            We also run{" "}
            <Link href="/agents" className="text-ink underline decoration-line-strong underline-offset-2 hover:text-primary hover:decoration-primary transition-colors">
              agent profiles
            </Link>{" "}
            across the site. Partner agents appear on the suburb pages their
            patch covers, which is where sellers are already reading.
          </p>
        </div>
      </section>
    </>
  );
}
