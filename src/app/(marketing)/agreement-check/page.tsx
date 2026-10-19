import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, RuleItem, SectionHeading, StepTimeline } from "@/components/premium";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AgreementCheckForm } from "@/components/journeys/AgreementCheckForm";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, SITE_URL } from "@/lib/constants";
import { FOUNDER } from "@/lib/founder";
import { AGREEMENT_CHECK, COMMISSION_STANCE, HOW_WE_ARE_PAID_HREF } from "@/lib/service-model";

// /agreement-check (15 Oct 2026): before someone signs an agency agreement,
// a free 15-minute call with our team about the commission, the marketing
// spend, the term and the exit clause. General information, not legal
// advice; the request stays with the team and never goes to an agent.

const TITLE = "Free agency agreement check: before you sign with an agent";
const DESCRIPTION =
  "A free 15-minute call to go through the agency agreement you’ve been handed: the commission, the marketing spend, the term and the exit clause. General information, not legal advice.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/agreement-check` },
  openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/agreement-check`, title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

// What the call covers, one line each on what we look at.
const COVERS = [
  { title: "Commission", body: "The rate, whether GST is on top, what it’s charged on, and when it becomes payable." },
  { title: "Marketing spend", body: "What the budget buys, when you pay it, and whether you still pay it if the home doesn’t sell." },
  { title: "Term", body: "How long you’re tied to the agent, and what kind of agency the agreement gives them." },
  { title: "Exit clause", body: "How you end the agreement early, the notice you have to give, and whether commission can still be owed after it ends." },
] as const;

const STEPS = [
  { title: "Send your details", body: "Two minutes. Tell us where the property is and, if you know, who the agreement is with and when you plan to sign." },
  { title: "We call you", body: "Someone from our team calls to go through it with you, before the date you plan to sign where we can." },
  { title: "We go through it together", body: "About 15 minutes on the four things above. You decide what to ask the agent to change, if anything." },
] as const;

export default function AgreementCheckPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Agreement check", url: "/agreement-check" }]} />

      <PhotoHero
        photo="paperwork"
        size="lg"
        breadcrumbs={[{ label: "Agreement check" }]}
        aside={<AgreementCheckForm />}
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-primary">Free agreement check</p>
        <div className="mt-4">
          <HeroTitle size="lg">{AGREEMENT_CHECK.headline}</HeroTitle>
        </div>
        <HeroLead>{AGREEMENT_CHECK.summary}</HeroLead>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {AGREEMENT_CHECK.covers.map((c) => (
            <li key={c} className="rounded-full border border-line-strong px-4 py-2 text-[15px] font-semibold text-ink">
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-ink-muted">
          <Phone className="h-4 w-4 text-ink" aria-hidden="true" />
          Rather talk now? Call
          <a href={`tel:${CONTACT_PHONE_E164}`} className="font-semibold text-ink underline underline-offset-4">
            {CONTACT_PHONE_DISPLAY}
          </a>
        </p>
        {/* Andy's own words, from his story on /about. */}
        <figure className="mt-12 hidden max-w-xl items-start gap-5 border-t border-line pt-8 lg:flex">
          <Image src={FOUNDER.photo} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover object-top" />
          <div>
            <blockquote className="font-display text-[22px] italic leading-snug text-ink">
              <p>“A good market won’t save a weak campaign, and a slack agent can’t hide behind a slow one.”</p>
            </blockquote>
            <figcaption className="mt-3 text-sm text-ink-muted">
              <Link href="/about" className="font-semibold text-ink underline underline-offset-4">{FOUNDER.name}</Link>, founder
            </figcaption>
          </div>
        </figure>
      </PhotoHero>

      <Band>
        <SectionHeading
          title="What we go through with you"
          intro="The four parts of an agency agreement that decide what selling really costs you, and how easily you can walk away."
        />
        <RuleGrid columns={4}>
          {COVERS.map((c) => (
            <RuleItem key={c.title} title={c.title}>
              {c.body}
            </RuleItem>
          ))}
        </RuleGrid>
      </Band>

      <Band tone="quiet">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading size="md" title="Who it’s for" />
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">
              Anyone about to sign an agency agreement to sell their home, whichever agent it’s with. The best time is
              before you sign, while the terms are still easy to change.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{AGREEMENT_CHECK.notAdvice}</p>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading size="md" title="How it works" />
            <StepTimeline steps={STEPS} className="mt-8" />
          </div>
        </div>
      </Band>

      <Band spacing="compact">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading size="md" title="Read up before the call" />
            <ul className="mt-6 space-y-3 text-base">
              {[
                { href: "/guides/real-estate-agency-agreements-by-state", label: "Agency agreements by state: the clauses to change first" },
                { href: "/guides/how-to-negotiate-real-estate-agent-commission", label: "How to negotiate real estate agent commission" },
                { href: "/tools/agent-proposal-worksheet", label: "The agent proposal worksheet" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {l.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-muted lg:col-span-5">
            The check is free and it doesn’t send your details to any agent. {COMMISSION_STANCE.ours}{" "}
            <Link href={HOW_WE_ARE_PAID_HREF} className="font-semibold text-ink underline underline-offset-4">
              How we’re paid
            </Link>
          </p>
        </div>
      </Band>
    </>
  );
}
