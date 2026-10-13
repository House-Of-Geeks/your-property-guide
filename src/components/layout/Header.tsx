"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, Phone } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";

// Brand v4 (Oct 2026): the site is a guide and an introduction service, so
// the nav leads with the two jobs people come with, selling and buying.
// Guides and suburbs follow; About carries how we're paid. The guide button
// shows at every width, because phones carry most visits.

interface NavChild {
  label: string;
  href: string;
  group?: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
  layout?: "list" | "grouped";
}

const NAV_LINKS: NavLink[] = [
  {
    label: "Selling",
    href: "/selling",
    layout: "grouped",
    children: [
      { label: "Free selling guide",        href: "/selling-guide",                               group: "Start here" },
      { label: "Free property appraisal",   href: "/appraisal",                                   group: "Start here" },
      { label: "Selling your home",         href: "/selling",                                     group: "Start here" },
      { label: "Commission calculator",     href: "/real-estate-commission-calculator",           group: "Start here" },
      { label: "Selling costs calculator",  href: "/selling-costs-calculator",                    group: "Start here" },
      { label: "How to sell a house",       href: "/guides/how-to-sell-a-house-australia",        group: "Guides" },
      { label: "Choosing a selling agent",  href: "/guides/how-to-choose-a-selling-agent",        group: "Guides" },
      { label: "Agent fees and commission", href: "/guides/real-estate-agent-fees-australia",     group: "Guides" },
      { label: "Cost of selling",           href: "/guides/cost-of-selling-a-house-australia",    group: "Guides" },
      { label: "Auction or private sale",   href: "/guides/auction-vs-private-treaty",            group: "Guides" },
      { label: "What's my home worth?",     href: "/guides/how-much-is-my-house-worth-australia", group: "Guides" },
    ],
  },
  {
    label: "Buying",
    href: "/buying-guide",
    layout: "grouped",
    children: [
      { label: "Free buying guide",       href: "/buying-guide",               group: "Start here" },
      { label: "First home buyers",       href: "/first-home-buyers",          group: "Start here" },
      { label: "Upgrading or downsizing", href: "/upgrading",                  group: "Start here" },
      { label: "Investing",               href: "/investing",                  group: "Start here" },
      { label: "Stamp duty calculator",   href: "/stamp-duty-calculator",      group: "Calculators" },
      { label: "Borrowing power",         href: "/borrowing-power-calculator", group: "Calculators" },
      { label: "Mortgage repayments",     href: "/mortgage-calculator",        group: "Calculators" },
      { label: "Rental yield",            href: "/rental-yield-calculator",    group: "Calculators" },
      { label: "All calculators",       href: "/tools",                      group: "Calculators" },
    ],
  },
  {
    label: "Guides",
    href: "/guides",
  },
  {
    label: "Suburbs",
    href: "/suburbs",
  },
  {
    label: "About",
    href: "/about",
    layout: "list",
    children: [
      { label: "About us",           href: "/about" },
      { label: "How we're paid",     href: "/about#ownership-funding" },
      { label: "Editorial standards", href: "/about#methodology" },
      { label: "Corrections",        href: "/about#corrections" },
      { label: "Contact",            href: "/contact" },
    ],
  },
];

// Buyer-context routes show the buying-guide button; everywhere else the
// selling guide leads (it's the revenue side).
const BUYER_PATHS = [
  "/buying-guide", "/first-home-buyers", "/investing", "/upgrading", "/buy",
  "/stamp-duty-calculator", "/borrowing-power-calculator", "/mortgage-calculator",
  "/affordability-calculator", "/lmi-calculator", "/help-to-buy-calculator", "/fhss-calculator",
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const buyerContext = BUYER_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const guideHref = buyerContext ? "/buying-guide" : "/selling-guide";
  const guideLabel = buyerContext ? "Free buying guide" : "Free selling guide";

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-[72px] items-center justify-between gap-3">
          <Link href="/" className="shrink-0" aria-label="Your Property Guide, home">
            <Logo size="md" />
          </Link>

          {/* Full navigation from 67.5rem (1080px); the menu button below
              that. Re-measure before adding a top-level item. */}
          <nav ref={navRef} className="hidden min-[67.5rem]:flex items-center gap-0.5" aria-label="Main">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => toggle(link.label)}
                    aria-expanded={openMenu === link.label}
                    aria-haspopup="menu"
                    className="flex items-center gap-1 px-3 py-2 text-[15px] font-medium whitespace-nowrap text-ink-muted hover:text-ink rounded-md transition-colors cursor-pointer"
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === link.label ? "rotate-180" : ""}`} />
                  </button>

                  {/* Panels stay in the HTML (hidden until opened) so
                      crawlers find every hub and calculator from the header. */}
                  {link.layout === "grouped" ? (
                    <GroupedMenu link={link} open={openMenu === link.label} onClose={() => setOpenMenu(null)} />
                  ) : (
                    <ListMenu link={link} open={openMenu === link.label} onClose={() => setOpenMenu(null)} />
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-[15px] font-medium whitespace-nowrap text-ink-muted hover:text-ink rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/search"
              aria-label="Search the site"
              className="hidden md:flex p-2 text-ink-muted hover:text-ink rounded-md transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="hidden xl:inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-semibold text-ink hover:text-primary transition-colors"
              aria-label={`Call us on ${CONTACT_PHONE_DISPLAY}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {CONTACT_PHONE_DISPLAY}
            </a>
            <Link
              href="/appraisal"
              className="hidden lg:inline-flex px-3 py-2 text-sm font-semibold text-ink hover:text-primary whitespace-nowrap transition-colors"
            >
              Free appraisal
            </Link>
            <Link
              href={guideHref}
              className="inline-flex items-center rounded-md bg-cta hover:bg-cta-hover text-white px-3 sm:px-4 py-2 text-[13px] sm:text-sm font-semibold whitespace-nowrap transition-colors"
            >
              <span className="sm:hidden">Free guide</span>
              <span className="hidden sm:inline">{guideLabel}</span>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="min-[67.5rem]:hidden -mr-1 p-2 text-ink hover:bg-surface-sunken rounded-md cursor-pointer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: the two actions first, then short groups. */}
      {mobileOpen && (
        <div className="min-[67.5rem]:hidden border-t border-line bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="mx-auto max-w-7xl px-4 pt-4 pb-6" aria-label="Main">
            <div className="grid grid-cols-2 gap-2 mb-5">
              <Link
                href={guideHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-md bg-cta hover:bg-cta-hover text-white px-3 py-3 text-sm font-semibold transition-colors"
              >
                {guideLabel}
              </Link>
              <Link
                href="/appraisal"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-md border border-ink text-ink px-3 py-3 text-sm font-semibold hover:bg-ink hover:text-white transition-colors"
              >
                Free appraisal
              </Link>
            </div>
            <div className="space-y-5">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="px-1 pb-1 text-sm font-semibold text-ink">{link.label}</p>
                    <div className="grid grid-cols-1">
                      {link.children
                        .filter((c, i, all) => all.findIndex((x) => x.href === c.href) === i)
                        .map((child) => (
                          <Link
                            key={`${child.href}-${child.label}`}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-1 py-2 text-[15px] text-ink-muted hover:text-ink border-b border-line/70"
                          >
                            {child.label}
                          </Link>
                        ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-1 py-2 text-[15px] font-semibold text-ink border-b border-line/70"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="mt-6 flex items-center justify-center gap-2 w-full rounded-md border border-line px-4 py-3 text-sm font-semibold text-ink hover:border-ink transition-colors"
              aria-label={`Call us on ${CONTACT_PHONE_DISPLAY}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              Call us on {CONTACT_PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

interface MenuProps {
  link: NavLink;
  /** Closed panels stay in the DOM (display: none) so their links are in the server HTML. */
  open: boolean;
  onClose: () => void;
}

function GroupedMenu({ link, open, onClose }: MenuProps) {
  const groups = Array.from(new Set(link.children!.map((c) => c.group ?? "")));
  return (
    <div
      className={`${open ? "" : "hidden "}absolute top-full left-0 mt-2 bg-white rounded-lg shadow-[0_8px_30px_rgb(22_25_29/0.10)] border border-line p-3 z-50 w-[480px]`}
    >
      <div className="grid grid-cols-2 gap-x-3">
        {groups.map((group) => {
          const items = link.children!.filter((c) => (c.group ?? "") === group);
          return (
            <div key={group}>
              {group && <p className="px-3 pt-1 pb-1.5 text-[13px] font-semibold text-ink-subtle">{group}</p>}
              {items.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className="block px-3 py-1.5 text-sm text-ink hover:bg-surface-sunken rounded-md"
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

function ListMenu({ link, open, onClose }: MenuProps) {
  return (
    <div
      className={`${open ? "" : "hidden "}absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-[0_8px_30px_rgb(22_25_29/0.10)] border border-line p-2 z-50`}
    >
      {link.children!.map((child) => (
        <Link
          key={`${child.href}-${child.label}`}
          href={child.href}
          onClick={onClose}
          className="block px-3 py-2 text-sm text-ink hover:bg-surface-sunken rounded-md"
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}
