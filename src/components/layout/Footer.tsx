import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { UserCircle, Phone } from "lucide-react";

type SvgProps = { className?: string };

function IconFacebook({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconInstagram({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function IconLinkedIn({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconYouTube({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconX({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "#", Icon: IconFacebook },
  { label: "Instagram", href: "#", Icon: IconInstagram },
  { label: "LinkedIn",  href: "#", Icon: IconLinkedIn },
  { label: "YouTube",   href: "#", Icon: IconYouTube },
  { label: "X (Twitter)", href: "#", Icon: IconX },
];

const FOOTER_COLUMNS = [
  {
    heading: "States",
    links: [
      { label: "NSW",                href: "/buy?state=nsw" },
      { label: "Victoria",           href: "/buy?state=vic" },
      { label: "Queensland",         href: "/buy?state=qld" },
      { label: "Western Australia",  href: "/buy?state=wa" },
      { label: "South Australia",    href: "/buy?state=sa" },
      { label: "Tasmania",           href: "/buy?state=tas" },
      { label: "ACT",                href: "/buy?state=act" },
      { label: "Northern Territory", href: "/buy?state=nt" },
    ],
  },
  {
    heading: "Capital Cities",
    links: [
      { label: "Sydney real estate",    href: "/buy?suburb=sydney-nsw-2000" },
      { label: "Melbourne real estate", href: "/buy?suburb=melbourne-vic-3000" },
      { label: "Brisbane real estate",  href: "/buy?suburb=brisbane-city-qld-4000" },
      { label: "Perth real estate",     href: "/buy?suburb=perth-wa-6000" },
      { label: "Adelaide real estate",  href: "/buy?suburb=adelaide-sa-5000" },
      { label: "Hobart real estate",    href: "/buy?suburb=hobart-tas-7000" },
      { label: "Canberra real estate",  href: "/buy?suburb=canberra-act-2601" },
      { label: "Darwin real estate",    href: "/buy?suburb=darwin-nt-800" },
    ],
  },
  {
    heading: "Capital Cities – Rentals",
    links: [
      { label: "Sydney rental properties",    href: "/rent?suburb=sydney-nsw-2000" },
      { label: "Melbourne rental properties", href: "/rent?suburb=melbourne-vic-3000" },
      { label: "Brisbane rental properties",  href: "/rent?suburb=brisbane-city-qld-4000" },
      { label: "Perth rental properties",     href: "/rent?suburb=perth-wa-6000" },
      { label: "Adelaide rental properties",  href: "/rent?suburb=adelaide-sa-5000" },
      { label: "Hobart rental properties",    href: "/rent?suburb=hobart-tas-7000" },
      { label: "Canberra rental properties",  href: "/rent?suburb=canberra-act-2601" },
      { label: "Darwin rental properties",    href: "/rent?suburb=darwin-nt-800" },
    ],
  },
  {
    heading: "Popular Areas",
    links: [
      { label: "Gold Coast",      href: "/buy?suburb=surfers-paradise-qld-4217" },
      { label: "Sunshine Coast",  href: "/buy?suburb=maroochydore-qld-4558" },
      { label: "Geelong",         href: "/buy?suburb=geelong-vic-3220" },
      { label: "Newcastle",       href: "/buy?suburb=newcastle-nsw-2300" },
      { label: "Wollongong",      href: "/buy?suburb=wollongong-nsw-2500" },
      { label: "Cairns",          href: "/buy?suburb=cairns-city-qld-4870" },
      { label: "Toowoomba",       href: "/buy?suburb=toowoomba-city-qld-4350" },
      { label: "Ballarat",        href: "/buy?suburb=ballarat-central-vic-3350" },
    ],
  },
  {
    heading: "Your Property Guide",
    links: [
      { label: "Research Hub",              href: "/research" },
      { label: "Suburb Profiles",           href: "/suburbs" },
      { label: "Price Guide",               href: "/price-guide" },
      { label: "Search by School",          href: "/schools" },
      { label: "Best Suburbs",              href: "/best-suburbs" },
      { label: "Market Reports",            href: "/market-reports" },
      { label: "Browse by State",           href: "/states" },
      { label: "Browse by Postcode",        href: "/postcodes" },
      { label: "Guides",                    href: "/guides" },
      { label: "Property Glossary",         href: "/glossary" },
      { label: "Mortgage Calculator",       href: "/mortgage-calculator" },
      { label: "Affordability Calculator",  href: "/affordability-calculator" },
      { label: "RBA Cash Rate",             href: "/rba-cash-rate" },
      { label: "Free Appraisal",            href: "/appraisal" },
      { label: "Find an Agent",             href: "/agents" },
      { label: "Blog",                      href: "/blog" },
      { label: "About",                     href: "/about" },
      { label: "Contact",                   href: "/contact" },
      { label: "Privacy Policy",            href: "/privacy" },
    ],
  },
  {
    heading: "Our Network",
    links: [
      { label: "Your Caravan Guide",        href: "https://www.yourcaravanguide.com.au" },
      { label: "Your Crypto Guide",         href: "https://www.yourcryptoguide.com.au" },
      { label: "Your Finance Guide",        href: "https://www.yourfinanceguide.com.au" },
      { label: "Your Lifestyle Guide",      href: "https://www.yourlifestyleguide.com.au" },
      { label: "Your Motorbike Guide",      href: "https://www.yourmotorbikeguide.com.au" },
      { label: "Need a Tradie",             href: "https://www.needatradie.com" },
      { label: "Better Rate Mate",          href: "https://www.betterratemate.com" },
      { label: "Why Solar",                 href: "https://www.whysolar.com.au" },
    ],
  },
];

async function getSuburbForFooter(slug: string) {
  return db.suburb.findUnique({
    where: { slug },
    select: { name: true, slug: true, nearbySuburbs: true },
  });
}

async function getSuburbFromPropertySlug(propertySlug: string) {
  const property = await db.property.findUnique({
    where: { slug: propertySlug },
    select: { suburb: { select: { name: true, slug: true, nearbySuburbs: true } } },
  });
  return property?.suburb ?? null;
}

function nearbyName(slug: string): string {
  return slug
    .replace(/-[a-z]{2,3}-\d{4}$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function AgentLoginPill() {
  return (
    <div className="border-b border-white/10 bg-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex justify-end">
        <Link
          href="/dashboard/login"
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/50 border border-white/20 rounded-full hover:border-white hover:text-white transition-colors"
        >
          <UserCircle className="w-3.5 h-3.5" />
          Agent Login
        </Link>
      </div>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center sm:items-start gap-3">
          <Link href="/" className="flex items-center">
            <Image src="/images/Your-Property-Guide.png" alt="Your Property Guide" width={400} height={64} className="h-16 w-auto invert" />
          </Link>
          <p className="text-sm text-white/50">Australia&apos;s trusted property research platform</p>
          <a
            href="tel:+61433405530"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">+61 433 405 530</span>
          </a>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-white/40 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Your Property Guide. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link>
          <Link href="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link>
          <Link href="/sitemap.xml" className="text-sm text-white/40 hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>
    </div>
  );
}

function LinkCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">{heading}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http") ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors leading-snug block">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors leading-snug block">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SuburbFooter({ name, slug, nearbySuburbs }: { name: string; slug: string; nearbySuburbs: string[] }) {
  const nearby = nearbySuburbs.slice(0, 8);

  const forSale = [
    { label: `Houses for sale in ${name}`,         href: `/buy?suburb=${slug}&propertyType=house` },
    { label: `Units for sale in ${name}`,          href: `/buy?suburb=${slug}&propertyType=unit` },
    { label: `Townhouses for sale in ${name}`,     href: `/buy?suburb=${slug}&propertyType=townhouse` },
    { label: `All properties for sale in ${name}`, href: `/suburbs/${slug}/buy` },
  ];
  const forRent = [
    { label: `Houses for rent in ${name}`,  href: `/rent?suburb=${slug}&propertyType=house` },
    { label: `Units for rent in ${name}`,   href: `/rent?suburb=${slug}&propertyType=unit` },
    { label: `Townhouses for rent in ${name}`, href: `/rent?suburb=${slug}&propertyType=townhouse` },
    { label: `All rentals in ${name}`,      href: `/suburbs/${slug}/rent` },
  ];
  const suburbLinks = [
    { label: `${name} suburb profile`,          href: `/suburbs/${slug}` },
    { label: `${name} real estate agents`,      href: `/agents?suburb=${slug}` },
    { label: `${name} real estate agencies`,    href: `/real-estate-agencies?suburb=${slug}` },
    { label: `House and Land in ${name}`,       href: `/house-and-land?suburb=${slug}` },
    { label: `Schools in ${name}`,              href: `/suburbs/${slug}#schools` },
    { label: "Home Price Guide",                href: "/price-guide" },
    { label: "Privacy Policy",                  href: "/privacy" },
    { label: "Get a free appraisal",            href: "/appraisal" },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white border-t-4 border-t-white">
      <AgentLoginPill />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <LinkCol heading="For Sale"           links={forSale} />
          <LinkCol heading="For Rent"           links={forRent} />
          <LinkCol heading={name}               links={suburbLinks} />
          <LinkCol
            heading="Surrounding Suburbs"
            links={
              nearby.length > 0
                ? nearby.map((s) => ({ label: nearbyName(s), href: `/suburbs/${s}` }))
                : [
                    { label: "Explore all suburbs", href: "/suburbs" },
                    { label: "Buy property",        href: "/buy" },
                    { label: "Rent property",       href: "/rent" },
                    { label: "Find an agent",       href: "/agents" },
                  ]
            }
          />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}

export async function Footer() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";

  // Suburb profile page: /suburbs/{slug} (exact, not sub-routes)
  const suburbMatch = pathname.match(/^\/suburbs\/([^/]+)$/);
  if (suburbMatch) {
    const suburb = await getSuburbForFooter(suburbMatch[1]);
    if (suburb) {
      return <SuburbFooter name={suburb.name} slug={suburb.slug} nearbySuburbs={suburb.nearbySuburbs} />;
    }
  }

  // Property listing pages: /buy/{slug}, /rent/{slug}, /sold/{slug}
  const propertyMatch = pathname.match(/^\/(buy|rent|sold)\/([^/]+)$/);
  if (propertyMatch) {
    const suburb = await getSuburbFromPropertySlug(propertyMatch[2]);
    if (suburb) {
      return <SuburbFooter name={suburb.name} slug={suburb.slug} nearbySuburbs={suburb.nearbySuburbs} />;
    }
  }

  // Default footer for all other pages
  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/10">
      <AgentLoginPill />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {FOOTER_COLUMNS.map((col) => (
            <LinkCol key={col.heading} heading={col.heading} links={col.links} />
          ))}
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
