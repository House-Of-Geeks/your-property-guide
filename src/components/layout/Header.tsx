"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, UserCircle, Search } from "lucide-react";

// Education-first nav per Andy's 2026-05-05 direction. No aggressive CTA in
// the RHS, no buyer-funnel-shaped headlines. Five top-level items: Suburbs
// (data), Guides (education), Tools (calculators), For you (personas), About
// (trust). Lead-capture pages live as sub-links of About, not at the top.

interface NavChild {
  label: string;
  href: string;
  group?: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
  layout?: "list" | "grouped" | "mega";
}

const NAV_LINKS: NavLink[] = [
  {
    label: "Suburbs",
    href: "/suburbs",
    layout: "mega",
    children: [
      { label: "Suburb profiles",     href: "/suburbs",       group: "Research" },
      { label: "Best suburbs",        href: "/best-suburbs",  group: "Research" },
      { label: "Browse by state",     href: "/states",        group: "Research" },
      { label: "Browse by postcode",  href: "/postcodes",     group: "Research" },
      { label: "Browse by region",    href: "/regions",       group: "Research" },
      { label: "Houses for sale",     href: "/buy",           group: "Listings" },
      { label: "Properties for rent", href: "/rent",          group: "Listings" },
      { label: "Recently sold",       href: "/sold",          group: "Listings" },
      { label: "Off-market",          href: "/off-market",    group: "Listings" },
      { label: "House and land",      href: "/house-and-land", group: "Listings" },
    ],
  },
  {
    label: "Guides",
    href: "/guides",
  },
  {
    label: "Tools",
    href: "#",
    layout: "grouped",
    children: [
      { label: "Borrowing power",       href: "/borrowing-power-calculator", group: "Calculators" },
      { label: "Mortgage repayments",   href: "/mortgage-calculator",        group: "Calculators" },
      { label: "Affordability",         href: "/affordability-calculator",   group: "Calculators" },
      { label: "Stamp duty",            href: "/stamp-duty-calculator",      group: "Calculators" },
      { label: "Rental yield",          href: "/rental-yield-calculator",    group: "Calculators" },
      { label: "CGT",                   href: "/cgt-calculator",             group: "Calculators" },
      { label: "Refinancing",           href: "/refinancing-calculator",     group: "Calculators" },
      { label: "Property glossary",     href: "/glossary",                   group: "Reference" },
      { label: "RBA cash rate",         href: "/rba-cash-rate",              group: "Reference" },
      { label: "Market reports",        href: "/market-reports",             group: "Reference" },
      { label: "Price guide",           href: "/price-guide",                group: "Reference" },
      { label: "Search by school",      href: "/schools",                    group: "Reference" },
    ],
  },
  {
    label: "For you",
    href: "#",
    layout: "list",
    children: [
      { label: "Buying my first home",  href: "/first-home-buyers" },
      { label: "Selling my home",       href: "/selling" },
      { label: "Upgrading or downsizing", href: "/upgrading" },
      { label: "Investing in property", href: "/investing" },
    ],
  },
  {
    label: "About",
    href: "/about",
    layout: "list",
    children: [
      { label: "About Your Property Guide", href: "/about" },
      { label: "Why we're free",            href: "/about" },
      { label: "Find an expert",            href: "/find-an-expert" },
      { label: "Guides",                    href: "/guides" },
      { label: "Contact",                   href: "/contact" },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const toggle = (label: string) => setOpenMenu((o) => (o === label ? null : label));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="font-display text-ink text-xl sm:text-[22px] tracking-tight leading-none">
              Your Property Guide
            </span>
          </Link>

          <nav ref={navRef} className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => toggle(link.label)}
                    aria-expanded={openMenu === link.label}
                    aria-haspopup="menu"
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-surface-warm transition-colors cursor-pointer"
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === link.label ? "rotate-180" : ""}`} />
                  </button>

                  {openMenu === link.label && (
                    link.layout === "mega" ? (
                      <MegaMenu link={link} onClose={() => setOpenMenu(null)} />
                    ) : link.layout === "grouped" ? (
                      <GroupedMenu link={link} onClose={() => setOpenMenu(null)} />
                    ) : (
                      <ListMenu link={link} onClose={() => setOpenMenu(null)} />
                    )
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-surface-warm transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* RHS — search, agent login, primary "Get matched" CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/search"
              aria-label="Search the site"
              title="Search suburbs, schools, guides &amp; glossary"
              className="hidden md:flex p-2 text-ink-muted hover:text-ink hover:bg-surface-warm rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-muted border border-line rounded-full hover:border-ink hover:text-ink transition-colors"
            >
              <UserCircle className="w-3.5 h-3.5" />
              Agent login
            </Link>
            <Link
              href="/#match"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-cta hover:bg-cta-hover text-white px-4 py-2 text-xs font-semibold transition-colors"
            >
              Get matched
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-ink-muted hover:text-ink hover:bg-surface-warm rounded-lg cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-line bg-surface max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-ink-subtle uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={`${child.href}-${child.label}`}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm text-ink-muted hover:text-ink hover:bg-surface-warm rounded-lg pl-6"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-warm rounded-lg"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-4 mt-2 border-t border-line space-y-2">
              <Link
                href="/#match"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-semibold text-white bg-cta hover:bg-cta-hover rounded-full transition-colors"
              >
                Get matched with an agent
              </Link>
              <Link
                href="/dashboard/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-medium text-ink-muted border border-line rounded-full hover:border-ink hover:text-ink transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                Agent login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MegaMenu({ link, onClose }: { link: NavLink; onClose: () => void }) {
  const groups = Array.from(new Set(link.children!.map((c) => c.group ?? "")));
  return (
    <div className="absolute top-full left-0 mt-1 bg-surface-raised rounded-xl shadow-card border border-line py-3 z-50 w-[520px]">
      <div className="grid grid-cols-2 gap-x-2">
        {groups.map((group) => {
          const items = link.children!.filter((c) => (c.group ?? "") === group);
          return (
            <div key={group}>
              {group && (
                <p className="px-4 py-1 text-xs font-semibold text-ink-subtle uppercase tracking-wider">
                  {group}
                </p>
              )}
              {items.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className="block px-4 py-1.5 text-sm text-ink-muted hover:bg-surface-sunken hover:text-ink"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GroupedMenu({ link, onClose }: { link: NavLink; onClose: () => void }) {
  const groups = Array.from(new Set(link.children!.map((c) => c.group ?? "")));
  return (
    <div className="absolute top-full left-0 mt-1 bg-surface-raised rounded-xl shadow-card border border-line py-3 z-50 w-[440px]">
      <div className="grid grid-cols-2 gap-x-2">
        {groups.map((group) => {
          const items = link.children!.filter((c) => (c.group ?? "") === group);
          return (
            <div key={group}>
              {group && (
                <p className="px-4 py-1 text-xs font-semibold text-ink-subtle uppercase tracking-wider">
                  {group}
                </p>
              )}
              {items.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className="block px-4 py-1.5 text-sm text-ink-muted hover:bg-surface-sunken hover:text-ink"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListMenu({ link, onClose }: { link: NavLink; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-surface-raised rounded-xl shadow-card border border-line py-2 z-50">
      {link.children!.map((child) => (
        <Link
          key={`${child.href}-${child.label}`}
          href={child.href}
          onClick={onClose}
          className="block px-4 py-2 text-sm text-ink-muted hover:bg-surface-sunken hover:text-ink"
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}
