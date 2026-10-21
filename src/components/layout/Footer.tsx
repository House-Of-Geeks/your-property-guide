import Link from "next/link";
import { Phone } from "lucide-react";
import { NewsletterForm as NewsletterFormFooter } from "@/components/newsletter/NewsletterForm";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";

// Oct 2026 ("confident moves"). Columns follow the move (buying, selling,
// both), then guides and tools, then the company and how we're paid. The
// agent-facing pages sit in their own column, last.
//
// 20 Oct 2026 ("Clear decisions"): a cream footer under a fine rule, the
// logo with one line about what we do, and the link columns in small type.
const FOOTER_COLUMNS = [
  {
    heading: "Buying",
    links: [
      { label: "Buying: where to start",  href: "/buying" },
      { label: "First home buyers",       href: "/first-home-buyers" },
      { label: "Buyer’s agents",          href: "/buyers-agents" },
      { label: "Investing",               href: "/investing" },
      { label: "Stamp duty calculator",   href: "/stamp-duty-calculator" },
      { label: "Borrowing power",         href: "/borrowing-power-calculator" },
      { label: "Free guide: Buying a home", href: "/buying-guide" },
    ],
  },
  {
    heading: "Selling",
    links: [
      { label: "Selling: where to start",   href: "/selling" },
      { label: "Choosing a selling agent",  href: "/guides/how-to-choose-a-selling-agent" },
      { label: "Agent fees and commission", href: "/guides/real-estate-agent-fees-australia" },
      { label: "Selling costs calculator",  href: "/selling-costs-calculator" },
      { label: "Agent proposal worksheet",  href: "/tools/agent-proposal-worksheet" },
      { label: "Free guide: Selling a home", href: "/selling-guide" },
      { label: "Buying and selling",        href: "/buying-and-selling" },
    ],
  },
  {
    heading: "Guides and tools",
    links: [
      { label: "Find my next step",   href: "/plan" },
      { label: "All guides",          href: "/guides" },
      { label: "All calculators",     href: "/tools" },
      { label: "LMI calculator",      href: "/lmi-calculator" },
      { label: "Negative gearing",    href: "/negative-gearing-calculator" },
      { label: "Suburb profiles",     href: "/suburbs" },
      { label: "Market reports",      href: "/market-reports" },
      { label: "Property glossary",   href: "/glossary" },
      { label: "Latest news",         href: "/guides/category/news" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Get personal help",    href: "/get-help" },
      { label: "How we’re paid",       href: "/about#ownership-funding" },
      { label: "How we choose agents", href: "/get-help#how-we-choose" },
      { label: "About the guides",     href: "/about" },
      { label: "Editorial standards",  href: "/about#methodology" },
      { label: "Corrections",          href: "/about#corrections" },
      { label: "Contact",              href: "/contact" },
      { label: "Privacy policy",       href: "/privacy" },
    ],
  },
  {
    heading: "For agents",
    links: [
      { label: "Introductions for agents", href: "/real-estate-leads" },
      { label: "Agent login",              href: "/dashboard/login" },
    ],
  },
];

// Sister sites in the same network. Kept as one quiet line.
const NETWORK_LINKS = [
  { label: "Your Finance Guide",   href: "https://www.yourfinanceguide.com.au" },
  { label: "Your Caravan Guide",   href: "https://www.yourcaravanguide.com.au" },
  { label: "Your Crypto Guide",    href: "https://www.yourcryptoguide.com.au" },
  { label: "Your Lifestyle Guide", href: "https://www.yourlifestyleguide.com.au" },
  { label: "Your Motorbike Guide", href: "https://www.yourmotorbikeguide.com.au" },
  { label: "Need a Tradie",        href: "https://www.needatradie.com" },
  { label: "Better Rate Mate",     href: "https://www.betterratemate.com" },
  { label: "Why Solar",            href: "https://www.whysolar.com.au" },
];

function LinkCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-primary">{heading}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block text-[14px] leading-snug text-ink hover:text-primary transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function nearbyName(slug: string): string {
  return slug
    .replace(/-[a-z]{2,3}-\d{4}$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function FooterBottom() {
  return (
    <div className="mt-12 pt-7 border-t border-line grid gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-[13px] text-ink-muted">
          &copy; {new Date().getFullYear()} Your Property Guide. Published from Brisbane, Australia.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy" className="text-[13px] text-ink-muted hover:text-ink transition-colors">Privacy</Link>
          <Link href="/contact" className="text-[13px] text-ink-muted hover:text-ink transition-colors">Contact</Link>
          <Link href="/sitemap" className="text-[13px] text-ink-muted hover:text-ink transition-colors">Sitemap</Link>
        </div>
      </div>
      <p className="text-[12px] leading-relaxed text-ink-muted">
        Part of the Profit Geeks network:{" "}
        {NETWORK_LINKS.map((l, i) => (
          <span key={l.href}>
            {i > 0 && <span aria-hidden="true">, </span>}
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              {l.label}
            </a>
          </span>
        ))}
        .
      </p>
    </div>
  );
}

function SuburbFooter({ name, slug, nearbySuburbs }: { name: string; slug: string; nearbySuburbs: string[] }) {
  const nearby = nearbySuburbs.slice(0, 8);
  const selling = [
    { label: `Selling in ${name}`,       href: `/selling-guide?suburb=${slug}` },
    { label: "Ask for an appraisal",     href: `/get-help?service=selling-agent&suburb=${slug}` },
    { label: "Commission calculator",    href: "/real-estate-commission-calculator" },
  ];
  const suburbLinks = [
    { label: `${name} suburb profile`, href: `/suburbs/${slug}` },
    { label: `Schools in ${name}`,     href: `/suburbs/${slug}#schools` },
    { label: "Privacy policy",         href: "/privacy" },
  ];

  return (
    <footer className="border-t border-line bg-background text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <LinkCol heading="Selling" links={selling} />
          <LinkCol heading={name} links={suburbLinks} />
          <LinkCol
            heading="Nearby suburbs"
            links={
              nearby.length > 0
                ? nearby.map((s) => ({ label: nearbyName(s), href: `/suburbs/${s}` }))
                : [{ label: "All suburbs", href: "/suburbs" }]
            }
          />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
export { SuburbFooter };

// Pure component, no headers() / cookies() / DB calls, so marketing pages
// stay cacheable.
export function Footer() {
  return (
    <footer className="border-t border-line bg-background text-ink">
      <NewsletterBand />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 pb-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3 grid gap-4 content-start">
            <Link href="/" aria-label="Your Property Guide, home" className="w-fit">
              <Logo size="md" />
            </Link>
            <p className="max-w-xs text-[14px] leading-relaxed text-ink-muted">
              Free guides, tools and next-step plans for buying and selling
              property in Australia. When you want personal help, we can
              introduce a participating agent, with your permission. The agent
              pays us a flat fee for the introduction, never a share of their
              commission; you pay us nothing.
            </p>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="inline-flex w-fit items-center gap-2 border-b border-line-strong pb-0.5 text-[14px] font-medium text-ink hover:text-primary hover:border-primary transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
          <div className="lg:col-span-9 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_COLUMNS.map((col) => (
              <LinkCol key={col.heading} heading={col.heading} links={col.links} />
            ))}
          </div>
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}

// The newsletter, above the link grid. It promises no schedule (20 Oct 2026).
function NewsletterBand() {
  return (
    <section className="border-b border-line bg-surface-warm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-6 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.035em] text-ink">
              New guides and rule changes, by email
            </h2>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-muted">
              What changed and what it means if you&rsquo;re buying or selling.
              Separate from any plan or guide emails you ask for.
            </p>
          </div>
          <div className="lg:col-span-5">
            <NewsletterFormFooter />
          </div>
        </div>
      </div>
    </section>
  );
}
