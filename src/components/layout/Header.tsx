"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, Phone } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { moveForPath } from "@/lib/journey-paths";

// Oct 2026 ("confident moves"): the nav follows the move people are making
// (buying, selling, or both), then guides and tools, then getting help.
// About carries how we're paid and the agent-facing pages, so they're easy
// for professionals to find without leading the consumer site. The one solid
// button is the next-step plan, matched to the page's move; "Get help" is
// the introduction path.

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
    label: "Buying",
    href: "/buying",
    layout: "grouped",
    children: [
      { label: "Buying: where to start",  href: "/buying",                          group: "Start here" },
      { label: "Make a buying plan",      href: "/plan?j=buying",                   group: "Start here" },
      { label: "First home buyers",       href: "/first-home-buyers",               group: "Start here" },
      { label: "Buyer’s agents",          href: "/buyers-agents",                   group: "Start here" },
      { label: "Buying and selling",      href: "/buying-and-selling",              group: "Start here" },
      { label: "Investing",               href: "/investing",                       group: "Start here" },
      { label: "Borrowing power",         href: "/borrowing-power-calculator",      group: "Tools" },
      { label: "Stamp duty",              href: "/stamp-duty-calculator",           group: "Tools" },
      { label: "Mortgage repayments",     href: "/mortgage-calculator",             group: "Tools" },
      { label: "Rental yield",            href: "/rental-yield-calculator",         group: "Tools" },
      { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house", group: "Tools" },
      { label: "Free buying guide (PDF)", href: "/buying-guide",                    group: "Tools" },
    ],
  },
  {
    label: "Selling",
    href: "/selling",
    layout: "grouped",
    children: [
      { label: "Selling: where to start", href: "/selling",                         group: "Start here" },
      { label: "Make a selling plan",     href: "/plan?j=selling",                  group: "Start here" },
      { label: "Choosing a selling agent", href: "/guides/how-to-choose-a-selling-agent", group: "Start here" },
      { label: "Agent fees and commission", href: "/guides/real-estate-agent-fees-australia", group: "Start here" },
      { label: "Free agreement check",  href: "/agreement-check",                 group: "Start here" },
      { label: "Buying and selling",      href: "/buying-and-selling",              group: "Start here" },
      { label: "Selling costs",           href: "/selling-costs-calculator",        group: "Tools" },
      { label: "Commission calculator",   href: "/real-estate-commission-calculator", group: "Tools" },
      { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet", group: "Tools" },
      { label: "Free selling guide (PDF)", href: "/selling-guide",                  group: "Tools" },
    ],
  },
  {
    label: "Guides and tools",
    href: "/guides",
    layout: "list",
    children: [
      { label: "All guides",          href: "/guides" },
      { label: "All calculators",       href: "/tools" },
      { label: "Your next-step plan", href: "/plan" },
      { label: "Suburb profiles",     href: "/suburbs" },
      { label: "Market reports",      href: "/market-reports" },
      { label: "Property glossary",   href: "/glossary" },
      { label: "Latest news",         href: "/guides/category/news" },
    ],
  },
  {
    label: "Find an agent",
    href: "/get-help",
  },
  {
    label: "About",
    href: "/about",
    layout: "list",
    children: [
      { label: "Andy’s story",        href: "/about" },
      { label: "How we’re paid",      href: "/about#ownership-funding" },
      { label: "How we choose agents", href: "/get-help#how-we-choose" },
      { label: "Editorial standards", href: "/about#methodology" },
      { label: "Contact",             href: "/contact" },
      { label: "For agents",          href: "/real-estate-leads" },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const move = moveForPath(pathname);
  // Education first: the solid button is the free guide for the page's move;
  // the agent route sits beside it as a plain link.
  const guideHref = move === "buying" ? "/buying-guide" : move === "selling" ? "/selling-guide" : "/guides";
  const guideLabel = move === "buying" ? "Free buying guide" : move === "selling" ? "Free selling guide" : "Free guides";
  const planHref = move ? `/plan?j=${move}` : "/plan";
  const planLabel = move === "buying" ? "Your buying plan" : move === "selling" ? "Your selling plan" : move === "buying-and-selling" ? "Your moving plan" : "Make a plan";

  const toggle = (label: string) => setOpenMenu((o) => (o === label ? null : label));

  // The homepage (v6) opens on a full-bleed photo, so there the header sits
  // over it, clear with light text, until the page scrolls or a menu opens.
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);
  const clear = overlay && !scrolled && !mobileOpen && !openMenu;

  // Escape closes whichever menu is open; a navigation closes both.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

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
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${overlay ? "-mb-16 sm:-mb-[72px]" : ""} ${
        clear ? "tone-dark border-transparent bg-transparent" : "border-line bg-cream/95 backdrop-blur"
      }`}
    >
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
            {/* Phones get the plan (and help) in the bottom bar and the menu,
                so the header doesn't repeat the same solid button. */}
            <Link
              href={guideHref}
              className="hidden sm:inline-flex items-center rounded-full bg-cta hover:bg-cta-hover text-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors"
            >
              {guideLabel}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="min-[67.5rem]:hidden -mr-1 p-2 text-ink hover:bg-surface-sunken rounded-md cursor-pointer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: the three moves first, then the plan and help, then
          short groups. */}
      {mobileOpen && (
        <div id="mobile-menu" className="min-[67.5rem]:hidden border-t border-line bg-cream max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
          <nav className="mx-auto max-w-7xl px-4 pt-4 pb-6" aria-label="Main">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { href: "/buying", label: "Buying" },
                { href: "/selling", label: "Selling" },
                { href: "/buying-and-selling", label: "Both" },
              ].map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-md border border-ink px-2 py-3 text-sm font-semibold text-ink"
                >
                  {m.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <Link
                href={planHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-md bg-cta hover:bg-cta-hover text-white px-3 py-3 text-sm font-semibold transition-colors"
              >
                {planLabel}
              </Link>
              <Link
                href="/get-help"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-md border border-line-strong text-ink px-3 py-3 text-sm font-semibold hover:border-ink transition-colors"
              >
                Get personal help
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
      className={`${open ? "" : "hidden "}absolute top-full left-0 mt-2 bg-white rounded-lg shadow-[0_8px_30px_rgb(20_32_27/0.12)] border border-line p-3 z-50 w-[480px]`}
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
      className={`${open ? "" : "hidden "}absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-[0_8px_30px_rgb(20_32_27/0.12)] border border-line p-2 z-50`}
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
