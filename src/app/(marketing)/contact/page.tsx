import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL, CONTACT_PHONE_E164, CONTACT_PHONE_DISPLAY } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact ${SITE_NAME}`,
  description: "Get in touch with Your Property Guide. We read every message ourselves and reply within one business day.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { url: `${SITE_URL}/contact`, title: `Contact ${SITE_NAME}`, description: "Get in touch with Your Property Guide.", type: "website" },
};

const CONTACTS = [
  {
    icon: Phone,
    label: "Call",
    primary: CONTACT_PHONE_DISPLAY,
    body: "Australian business hours, Monday to Friday.",
    href: `tel:${CONTACT_PHONE_E164}`,
  },
  {
    icon: Mail,
    label: "Email",
    primary: "andy@theandylife.com",
    body: "Goes straight to the founder. Reply within one business day.",
    href: "mailto:andy@theandylife.com",
  },
  {
    icon: Clock,
    label: "Response time",
    primary: "One business day",
    body: "No bots, no auto-routing. We read every message ourselves.",
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Contact", url: "/contact" }]} />

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
            <Breadcrumbs items={[{ label: "Contact" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                Get in touch
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
                We read every message <span className="italic text-primary">ourselves</span>.
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-xl">
                Question about a suburb? Spotted something off in our data?
                Want to partner? Drop us a line, we&rsquo;ll respond within one
                business day.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/expert-match.svg"
                  alt=""
                  aria-hidden="true"
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact methods */}
      <section className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {CONTACTS.map((c) => {
              const Icon = c.icon;
              const inner = (
                <div className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-7 h-full hover:border-ink hover:shadow-card transition-all">
                  <div className="w-10 h-10 rounded-lg bg-surface-warm border border-line-warm flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cta" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">{c.label}</p>
                  <p className="font-display text-lg text-ink leading-tight mb-2">{c.primary}</p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{c.body}</p>
                </div>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="block">
                  {inner}
                </a>
              ) : (
                <div key={c.label}>{inner}</div>
              );
            })}
          </div>

          {/* Form */}
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Or send a message
              </p>
              <h2 className="font-display text-ink leading-tight tracking-tight text-2xl sm:text-3xl">
                We&rsquo;ll get back to you.
              </h2>
            </div>

            {/* Cross-link for specialist enquiries, keep the general
                contact form for everything else, but offer the match flow
                up-front so the right enquiries land in the right bucket. */}
            <div className="mb-8 rounded-2xl border border-line-warm bg-surface-warm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-cta mb-1.5">
                  Looking for a specialist?
                </p>
                <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
                  If you want to be connected with an agent, broker, accountant or
                  conveyancer for your situation, our match flow will get you there in
                  three quick questions, faster than a free-form message.
                </p>
              </div>
              <Link
                href="/find-an-expert"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white font-medium px-5 py-2.5 text-sm transition-colors whitespace-nowrap"
              >
                Get connected <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-line bg-surface-raised shadow-card p-6 sm:p-8">
              <EnquiryForm type="general-contact" />
            </div>
          </div>
        </div>
      </section>

      {/* Honest note */}
      <section className="bg-surface-warm border-t border-line-warm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">
            Honest note
          </p>
          <p className="font-sans text-base text-ink-muted leading-relaxed">
            We&rsquo;re a small team. Messages from buyers, sellers and renters
            get the same priority as messages from agents and partners. If you
            don&rsquo;t hear back within one business day, the email got lost,
            try again or call.
          </p>
        </div>
      </section>
    </>
  );
}
