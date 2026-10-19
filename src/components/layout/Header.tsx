"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, Phone, ArrowRight } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { moveForPath } from "@/lib/journey-paths";
import { PLAN_CTA_SHORT } from "@/lib/plans/name";
import { planStartHref } from "@/lib/plans/start";
import { DEFAULT_MOVE, journeyForMove, usePublishedMove, usePublishedPlace } from "@/components/interactive/move-context";

// Oct 2026 ("confident moves"): the nav follows the move people are making
// (buying, selling, or both), then guides and tools, then getting help.
// About carries how we're paid and the agent-facing pages, so they're easy
// for professionals to find without leading the consumer site. The one solid
// button is the next-step plan, matched to the page's move; "Get help" is
// the introduction path.
//
// 19 Oct 2026: the solid button is the next-step plan everywhere (it was the
// free guide), so the header, the homepage hero and the phone bar offer the
// same first step; on the homepage it follows the move picked in the hero.
// On phones the menu is four collapsible groups (Buying, Selling, Guides and
// tools, About) under the plan and "Find an agent", with nothing repeated.

interface NavChild {
  label: string;
  href: string;
  group?: string;
  /** One line under the link in the phone menu: what it helps you decide. */
  note?: string;
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
      { label: "First home buyers",       href: "/first-home-buyers",               group: "Start here" },
      { label: "Buyer’s agents",          href: "/buyers-agents",                   group: "Start here" },
      { label: "Buying and selling",      href: "/buying-and-selling",              group: "Start here" },
      { label: "Investing",               href: "/investing",                       group: "Start here" },
      { label: "Free buying guide",       href: "/buying-guide",                    group: "Start here" },
      { label: "Borrowing power",         href: "/borrowing-power-calculator",      group: "Tools", note: "The price range to search in" },
      { label: "Stamp duty",              href: "/stamp-duty-calculator",           group: "Tools", note: "The cash you need upfront" },
      { label: "Mortgage repayments",     href: "/mortgage-calculator",             group: "Tools" },
      { label: "Rental yield",            href: "/rental-yield-calculator",         group: "Tools" },
      { label: "Due diligence checklist", href: "/guides/due-diligence-checklist-buying-a-house", group: "Tools", note: "Whether a property is worth an offer" },
    ],
  },
  {
    label: "Selling",
    href: "/selling",
    layout: "grouped",
    children: [
      { label: "Selling: where to start", href: "/selling",                         group: "Start here" },
      { label: "Selling costs calculator", href: "/selling-costs-calculator",       group: "Decide with evidence", note: "Your walk-away number before any quote" },
      { label: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet", group: "Decide with evidence", note: "Which agent’s proposal is better value" },
      { label: "Free 15-minute agreement check", href: "/agreement-check",          group: "Decide with evidence", note: "Whether to sign the agreement you’ve been handed" },
      { label: "Choosing a selling agent", href: "/guides/how-to-choose-a-selling-agent", group: "Start here" },
      { label: "Agent fees and commission", href: "/guides/real-estate-agent-fees-australia", group: "Start here" },
      { label: "Buying and selling",      href: "/buying-and-selling",              group: "Start here" },
      { label: "Free selling guide",      href: "/selling-guide",                   group: "Start here" },
      { label: "Commission calculator",   href: "/real-estate-commission-calculator", group: "Decide with evidence" },
    ],
  },
  {
    label: "Guides and tools",
    href: "/guides",
    layout: "list",
    children: [
      { label: "All guides",          href: "/guides" },
      { label: "All calculators",       href: "/tools" },
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
  // The page's move; on the homepage, the one picked in the hero.
  // On the homepage, the move and the suburb picked in the hero (20 Oct
  // 2026), through the same planStartHref as the hero's own button.
  const published = usePublishedMove();
  const publishedPlace = usePublishedPlace();
  const move = moveForPath(pathname) ?? (pathname === "/" ? journeyForMove(published ?? DEFAULT_MOVE) : null);
  const planHref = planStartHref({ journey: move, place: pathname === "/" ? publishedPlace : null, from: "header" });
  const onPlan = pathname === "/plan" || pathname.startsWith("/plan/");
  const helpService = move === "buying" ? "buyers-agent" : move === "selling" ? "selling-agent" : move === "buying-and-selling" ? "both" : null;
  const helpPlace = pathname === "/" ? publishedPlace : null;
  const helpQs = new URLSearchParams();
  if (helpService) helpQs.set("service", helpService);
  if (helpPlace) helpQs.set("suburb", helpPlace.slug);
  const helpHref = helpQs.toString() ? `/get-help?${helpQs.toString()}` : "/get-help";
  const helpLabel = move === "buying" ? "Find a buyer’s agent" : "Find an agent";
  const [openGroup, setOpenGroup] = useState<string | null>(null);

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
            {/* Not on the planner itself, where it would only start again. */}
            {!onPlan && (
              <Link
                href={planHref}
                className="hidden sm:inline-flex items-center rounded-full bg-cta hover:bg-cta-hover text-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors"
              >
                {PLAN_CTA_SHORT}
              </Link>
            )}
            <button
              onClick={() => {
                // On a buying or selling page the menu opens on that group; elsewhere all four start closed.
                const own = moveForPath(pathname);
                if (!mobileOpen) setOpenGroup(own === "buying" ? "Buying" : own === "selling" ? "Selling" : null);
                setMobileOpen(!mobileOpen);
              }}
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

      {/* Phone menu: the plan and an agent, then four groups that open one
          at a time, then the phone number. Every link is in the HTML (closed
          groups are hidden, not removed). */}
      {mobileOpen && (
        <div id="mobile-menu" className="min-[67.5rem]:hidden border-t border-line bg-cream max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
          <nav className="mx-auto max-w-7xl px-4 pt-4 pb-6" aria-label="Main">
            <div className="grid gap-2">
              <Link
                href={planHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-cta hover:bg-cta-hover text-white px-4 py-3.5 text-[15px] font-semibold transition-colors"
              >
                {PLAN_CTA_SHORT} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={helpHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full border border-ink text-ink px-4 py-3 text-[15px] font-semibold"
              >
                {helpLabel}
              </Link>
            </div>
            <ul className="mt-5 border-t border-line">
              {NAV_LINKS.filter((l) => l.children).map((link) => {
                const open = openGroup === link.label;
                const panel = `mobile-group-${link.label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
                return (
                  <li key={link.label} className="border-b border-line">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panel}
                      onClick={() => setOpenGroup(open ? null : link.label)}
                      className="flex w-full items-center justify-between gap-3 px-1 py-4 text-left text-[17px] font-semibold text-ink"
                    >
                      {link.label}
                      <ChevronDown className={`h-5 w-5 text-ink-muted transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    <ul id={panel} hidden={!open} className="pb-3">
                      {link.children!.map((child) => (
                        <li key={`${child.href}-${child.label}`}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-3 py-2.5 text-[15px] text-ink hover:bg-surface-sunken"
                          >
                            {child.label}
                            {child.note && <span className="block text-[13px] leading-snug text-ink-muted">{child.note}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md border border-line px-3 py-3 text-sm font-semibold text-ink hover:border-ink"
              >
                <Search className="w-4 h-4" aria-hidden="true" /> Search
              </Link>
              <a
                href={`tel:${CONTACT_PHONE_E164}`}
                className="flex items-center justify-center gap-2 rounded-md border border-line px-3 py-3 text-sm font-semibold text-ink hover:border-ink"
                aria-label={`Call us on ${CONTACT_PHONE_DISPLAY}`}
              >
                <Phone className="w-4 h-4" aria-hidden="true" /> {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
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
