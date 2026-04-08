import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { UserCircle } from "lucide-react";

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
      { label: "Research Hub",          href: "/research" },
      { label: "Suburb Profiles",       href: "/suburbs" },
      { label: "Price Guide",           href: "/price-guide" },
      { label: "Search by School",      href: "/schools" },
      { label: "Mortgage Calculator",   href: "/mortgage-calculator" },
      { label: "Free Appraisal",        href: "/appraisal" },
      { label: "Find an Agent",         href: "/agents" },
      { label: "Blog",                  href: "/blog" },
      { label: "About",                 href: "/about" },
      { label: "Privacy Policy",        href: "/privacy" },
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center">
          <Image src="/images/Your-Property-Guide.png" alt="Your Property Guide" width={200} height={32} className="h-8 w-auto invert" />
        </Link>
        <p className="text-sm text-white/30">
          &copy; {new Date().getFullYear()} Your Property Guide. All rights reserved.
        </p>
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
            <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors leading-snug block">
              {l.label}
            </Link>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {FOOTER_COLUMNS.map((col) => (
            <LinkCol key={col.heading} heading={col.heading} links={col.links} />
          ))}
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
