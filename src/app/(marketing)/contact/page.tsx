import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL, CONTACT_PHONE_E164, CONTACT_PHONE_DISPLAY } from "@/lib/constants";
import { BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero, RuleGrid, SectionHeading } from "@/components/premium";

export const metadata: Metadata = {
  title: `Contact ${SITE_NAME}`,
  description: "Get in touch with Your Property Guide. We read every message ourselves and reply within one business day.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/contact`, title: `Contact ${SITE_NAME}`, description: "Get in touch with Your Property Guide.", type: "website" },
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

      {/* Hero, over a street photo. */}
      <PhotoHero photo="street" breadcrumbs={[{ label: "Contact" }]}>
        <p className="text-sm font-semibold text-ink-muted mb-4">
          Get in touch
        </p>
        <HeroTitle>
          We read every message <span>ourselves</span>
        </HeroTitle>
        <HeroLead>
          Question about a suburb? Spotted something off in our data?
          Want to partner? Drop us a line, we&rsquo;ll respond within one
          business day.
        </HeroLead>
      </PhotoHero>

      {/* Contact methods */}
      <Band spacing="compact">
        <RuleGrid columns={3} className="">
          {CONTACTS.map((c) => {
            const Icon = c.icon;
            const inner = (
              <>
                <Icon className="w-7 h-7 text-primary mb-5" strokeWidth={1.75} aria-hidden="true" />
                <p className="text-sm text-ink-subtle mb-2">{c.label}</p>
                <p className="text-xl font-semibold text-ink group-hover:text-primary transition-colors leading-tight mb-2">{c.primary}</p>
                <p className="text-base text-ink-muted leading-relaxed">{c.body}</p>
              </>
            );
            return (
              <li key={c.label} className="border-t-2 border-ink pt-6">
                {c.href ? (
                  <a href={c.href} className="group block">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </RuleGrid>
      </Band>

      {/* Form */}
      <Band tone="quiet">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-sm text-ink-subtle mb-3">
              Or send a message
            </p>
            <SectionHeading size="md" title={<>We&rsquo;ll get back to you</>} />
          </div>

          {/* Cross-link for specialist enquiries, keep the general
              contact form for everything else, but offer the match flow
              up-front so the right enquiries land in the right bucket. */}
          <div className="mb-8 rounded-xl border border-line bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary mb-1.5">
                Looking for an agent?
              </p>
              <p className="text-sm sm:text-base text-ink leading-relaxed">
                If you want to be connected with a local agent for your sale, our
                match flow will get you there in three quick questions, faster than a
                free-form message.
              </p>
            </div>
            <Link href="/find-an-expert" className={`${BUTTON_SECONDARY} shrink-0 justify-center whitespace-nowrap`}>
              Get connected <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
            <EnquiryForm type="general-contact" />
          </div>
        </div>
      </Band>

      {/* Honest note */}
      <Band spacing="compact">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-ink mb-3">
            Honest note
          </p>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed">
            We&rsquo;re a small team. Messages from buyers, sellers and renters
            get the same priority as messages from agents and partners. If you
            don&rsquo;t hear back within one business day, the email got lost,
            try again or call.
          </p>
        </div>
      </Band>
    </>
  );
}
