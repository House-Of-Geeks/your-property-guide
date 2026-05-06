"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Layers, Wrench, Search } from "lucide-react";

const ITEMS = [
  { href: "/find-your-suburb", label: "Quiz",     icon: Sparkles, matchPrefix: "/find-your-suburb" },
  { href: "/compare",          label: "Compare",  icon: Layers,   matchPrefix: "/compare" },
  { href: "/tools",            label: "Tools",    icon: Wrench,   matchPrefix: "/tools" },
  { href: "/search",           label: "Search",   icon: Search,   matchPrefix: "/search" },
] as const;

/**
 * Mobile-only sticky bottom navigation. Shows the four highest-leverage
 * destinations (Quiz, Compare, Tools, Search) so first-time visitors always
 * have a way into a tool from any page.
 *
 * Hidden on:
 * - Tablet+ (sm: breakpoint and above) — desktop has the header
 * - Inside the bottom nav's own destination pages, since the same option is
 *   already prominent on the page (avoids redundancy).
 *
 * Renders a `pb-16` spacer at the bottom of the page wrapper so content
 * doesn't get covered. The spacer is added at the layout level rather than
 * here so each page's footer renders correctly above the sticky nav.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide entirely on the destination pages themselves
  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-surface-warm/95 backdrop-blur-md sm:hidden"
      aria-label="Primary mobile navigation"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.matchPrefix);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 text-[11px] font-sans uppercase tracking-[0.15em] transition-colors ${
                  active
                    ? "text-primary"
                    : "text-ink-muted hover:text-primary"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
