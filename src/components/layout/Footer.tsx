import Link from "next/link";
import { SUBURBS } from "@/lib/constants";

const FOOTER_LINKS = {
  "Property Search": [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Sold Results", href: "/sold" },
    { label: "Off-Market", href: "/off-market" },
    { label: "House & Land", href: "/house-and-land" },
  ],
  Tools: [
    { label: "Stamp Duty Calculator", href: "/stamp-duty-calculator" },
    { label: "Free Appraisal", href: "/appraisal" },
    { label: "Find an Agent", href: "/agents" },
    { label: "Agencies", href: "/agencies" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="font-bold text-white">Your Property Guide</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your local Moreton Bay property experts. Find homes for sale, rent, and off-market opportunities.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white mb-3">{heading}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Suburbs */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Suburbs</h3>
            <ul className="space-y-2">
              {SUBURBS.map((suburb) => (
                <li key={suburb.slug}>
                  <Link
                    href={`/suburbs/${suburb.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {suburb.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Property Guide. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
