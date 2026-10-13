import Link from "next/link";
import { Phone } from "lucide-react";
import { NewsletterForm as NewsletterFormFooter } from "@/components/newsletter/NewsletterForm";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";

// Brand v4 (Oct 2026). Columns follow the two jobs (selling, buying), then
// guides and tools, then the company. Agent-facing links sit in their own
// group. Social icons were removed until the accounts exist (they linked
// to "#").
const FOOTER_COLUMNS = [
  {
    heading: "Selling",
    links: [
      { label: "Free selling guide",        href: "/selling-guide" },
      { label: "Free property appraisal",   href: "/appraisal" },
      { label: "Selling your home",         href: "/selling" },
      { label: "Choosing a selling agent",  href: "/guides/how-to-choose-a-selling-agent" },
      { label: "Agent fees and commission", href: "/guides/real-estate-agent-fees-australia" },
      { label: "Cost of selling",           href: "/guides/cost-of-selling-a-house-australia" },
      { label: "Commission calculator",     href: "/real-estate-commission-calculator" },
      { label: "Selling costs calculator",  href: "/selling-costs-calculator" },
    ],
  },
  {
    heading: "Buying",
    links: [
      { label: "Free buying guide",       href: "/buying-guide" },
      { label: "First home buyers",       href: "/first-home-buyers" },
      { label: "Upgrading or downsizing", href: "/upgrading" },
      { label: "Investing",               href: "/investing" },
      { label: "Renovating",              href: "/renovating" },
      { label: "Stamp duty calculator",   href: "/stamp-duty-calculator" },
      { label: "Borrowing power",         href: "/borrowing-power-calculator" },
      { label: "Mortgage calculator",     href: "/mortgage-calculator" },
    ],
  },
  {
    heading: "Guides and tools",
    links: [
      { label: "All guides",          href: "/guides" },
      { label: "Latest news",         href: "/guides/category/news" },
      { label: "All calculators",     href: "/tools" },
      { label: "LMI calculator",      href: "/lmi-calculator" },
      { label: "Negative gearing",    href: "/negative-gearing-calculator" },
      { label: "Property glossary",   href: "/glossary" },
      { label: "Suburb profiles",     href: "/suburbs" },
      { label: "Browse by postcode",  href: "/postcodes" },
      { label: "Market reports",      href: "/market-reports" },
      { label: "RBA cash rate",       href: "/rba-cash-rate" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us",            href: "/about" },
      { label: "How we're paid",      href: "/about#ownership-funding" },
      { label: "Editorial standards", href: "/about#methodology" },
      { label: "Our team",            href: "/about#people" },
      { label: "Corrections",         href: "/about#corrections" },
      { label: "Contact",             href: "/contact" },
      { label: "Privacy policy",      href: "/privacy" },
      { label: "Site map",            href: "/site-map" },
    ],
  },
  {
    heading: "For agents",
    links: [
      { label: "Seller leads for agents", href: "/real-estate-leads" },
      { label: "Agent login",             href: "/dashboard/login" },
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
      <h3 className="text-sm font-semibold text-white mb-3 tracking-normal">{heading}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors leading-snug block">
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
    <div className="mt-12 pt-8 border-t border-white/10 grid gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm text-white/60">
          &copy; {new Date().getFullYear()} Your Property Guide. Published from Brisbane, Australia.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy</Link>
          <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact</Link>
          <Link href="/sitemap.xml" className="text-sm text-white/60 hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-white/45">
        Part of the Profit Geeks network:{" "}
        {NETWORK_LINKS.map((l, i) => (
          <span key={l.href}>
            {i > 0 && <span aria-hidden="true">, </span>}
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">
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
    { label: "Free property appraisal",  href: "/appraisal" },
    { label: "Commission calculator",    href: "/real-estate-commission-calculator" },
  ];
  const suburbLinks = [
    { label: `${name} suburb profile`, href: `/suburbs/${slug}` },
    { label: `Schools in ${name}`,     href: `/suburbs/${slug}#schools` },
    { label: "Privacy policy",         href: "/privacy" },
  ];

  return (
    <footer className="bg-surface-inverse text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
    <footer className="bg-surface-inverse text-white">
      <NewsletterBand />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3 grid gap-4 content-start">
            <Link href="/" aria-label="Your Property Guide, home">
              <Logo tone="light" size="md" />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Free guides to selling and buying property in Australia. When
              you&rsquo;re ready, one trusted local agent. Agents pay us for
              introductions; it costs you nothing.
            </p>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent-light transition-colors w-fit"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
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

// Newsletter capture band above the link grid.
function NewsletterBand() {
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-6 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-3xl text-white leading-tight">
              One useful email a quarter
            </h2>
            <p className="mt-2 text-base text-white/70 leading-relaxed max-w-lg">
              Rule changes, new guides and what they mean if you&rsquo;re
              selling or buying. Nothing else.
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
