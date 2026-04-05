import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { db } from "@/lib/db";

const STATIC_LINKS = {
  "Property Search": [
    { label: "Buy",               href: "/buy" },
    { label: "Rent",              href: "/rent" },
    { label: "Sold Results",      href: "/sold" },
    { label: "Off-Market",        href: "/off-market" },
    { label: "House & Land",      href: "/house-and-land" },
  ],
  Tools: [
    { label: "Stamp Duty Calculator", href: "/stamp-duty-calculator" },
    { label: "Free Appraisal",        href: "/appraisal" },
    { label: "Find an Agent",         href: "/agents" },
    { label: "Agencies",              href: "/agencies" },
  ],
  Company: [
    { label: "About Us",      href: "/about" },
    { label: "Blog",          href: "/blog" },
    { label: "Contact",       href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

async function getSuburbForFooter(slug: string) {
  return db.suburb.findUnique({
    where: { slug },
    select: { name: true, slug: true, nearbySuburbs: true },
  });
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
    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Your Property Guide. All rights reserved.
      </p>
      <div className="flex gap-6">
        <Link href="/privacy" className="text-sm text-gray-400 hover:text-primary transition-colors">Privacy</Link>
        <Link href="/contact" className="text-sm text-gray-400 hover:text-primary transition-colors">Contact</Link>
        <Link href="/sitemap.xml" className="text-sm text-gray-400 hover:text-primary transition-colors">Sitemap</Link>
      </div>
    </div>
  );
}

function LinkCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">{heading}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-gray-500 hover:text-primary transition-colors leading-snug block">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Brand() {
  return (
    <div>
      <Link href="/" className="flex items-center mb-4">
        <Image src="/images/YPG Logo.png" alt="Your Property Guide" width={160} height={60} className="h-12 w-auto" />
      </Link>
      <p className="text-sm text-gray-500">
        Your local property experts. Find homes for sale, rent, and off-market opportunities.
      </p>
    </div>
  );
}

export async function Footer() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";

  // Suburb profile page: /suburbs/{slug} (exact, not sub-routes)
  const suburbMatch = pathname.match(/^\/suburbs\/([^/]+)$/);

  if (suburbMatch) {
    const slug = suburbMatch[1];
    const suburb = await getSuburbForFooter(slug);

    if (suburb) {
      const { name, nearbySuburbs } = suburb;
      const nearby = nearbySuburbs.slice(0, 6);

      const forSale = [
        { label: `Houses for sale in ${name}`,         href: `/buy?suburb=${slug}&propertyType=house` },
        { label: `Units for sale in ${name}`,          href: `/buy?suburb=${slug}&propertyType=unit` },
        { label: `All properties for sale in ${name}`, href: `/suburbs/${slug}/buy` },
      ];
      const forRent = [
        { label: `Houses for rent in ${name}`,  href: `/rent?suburb=${slug}&propertyType=house` },
        { label: `Units for rent in ${name}`,   href: `/rent?suburb=${slug}&propertyType=unit` },
        { label: `All rentals in ${name}`,      href: `/suburbs/${slug}/rent` },
      ];
      const suburbLinks = [
        { label: `${name} suburb profile`,          href: `/suburbs/${slug}` },
        { label: `${name} real estate agents`,      href: `/agents?suburb=${slug}` },
        { label: `${name} real estate agencies`,    href: `/agencies?suburb=${slug}` },
        { label: `House and Land in ${name}`,       href: `/house-and-land?suburb=${slug}` },
        { label: `Schools in ${name}`,              href: `/suburbs/${slug}#schools` },
        { label: "Get a free appraisal",            href: "/appraisal" },
      ];

      return (
        <footer className="bg-white text-gray-700 border-t-4 border-t-primary">
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
  }

  // Default footer for all other pages
  return (
    <footer className="bg-white text-gray-700 border-t-4 border-t-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Brand />
          </div>
          {Object.entries(STATIC_LINKS).map(([heading, links]) => (
            <LinkCol key={heading} heading={heading} links={links} />
          ))}
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
