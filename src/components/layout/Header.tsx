"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Search, ChevronDown, UserCircle } from "lucide-react";
import { Button } from "@/components/ui";

const NAV_LINKS = [
  {
    label: "Find a Property",
    href: "#",
    children: [
      { label: "Buy",         href: "/buy" },
      { label: "Rent",        href: "/rent" },
      { label: "Sold",        href: "/sold" },
      { label: "Off-Market",  href: "/off-market" },
      { label: "House & Land", href: "/house-and-land" },
    ],
  },
  {
    label: "Research",
    href: "#",
    children: [
      { label: "Research Hub",          href: "/research" },
      { label: "Suburb Profiles",       href: "/suburbs" },
      { label: "Price Guide",           href: "/price-guide" },
      { label: "Search by School",      href: "/schools" },
      { label: "Mortgage Calculator",   href: "/mortgage-calculator" },
      { label: "Stamp Duty Calculator", href: "/stamp-duty-calculator" },
    ],
  },
  {
    label: "Find Agents",
    href: "#",
    children: [
      { label: "Find an Agent",   href: "/agents" },
      { label: "Find an Agency",  href: "/real-estate-agencies" },
      { label: "Free Appraisal",  href: "/appraisal" },
    ],
  },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggle = (label: string) => setOpenMenu((o) => (o === label ? null : label));
  const close  = () => setTimeout(() => setOpenMenu(null), 150);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Your-Property-Guide.png"
              alt="Your Property Guide"
              width={240}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => toggle(link.label)}
                    onBlur={close}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {openMenu === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpenMenu(null)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link href="/buy" className="hidden sm:flex">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </Link>
            <Link
              href="/dashboard/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              <UserCircle className="w-4 h-4" />
              Agent Login
            </Link>
            <Link href="/appraisal" className="hidden md:block">
              <Button variant="gradient" size="sm">
                Free Appraisal
              </Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg pl-6"
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
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/dashboard/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                Agent Login
              </Link>
              <Link href="/appraisal" onClick={() => setMobileOpen(false)}>
                <Button variant="gradient" size="lg" className="w-full">
                  Free Appraisal
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
