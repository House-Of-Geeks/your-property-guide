import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative bg-surface-warm min-h-[80vh] flex items-center overflow-hidden">
      {/* Wrong street, right neighbourhood. */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <Image
          src="/images/art/queenslander.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right-bottom opacity-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-warm from-35% via-surface-warm/85 via-65% to-surface-warm/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-warm from-15% via-surface-warm/60 to-surface-warm/15" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display italic text-primary text-base sm:text-lg leading-none">
            404
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
            Page not found
          </span>
        </div>

        <h1 className="font-display text-ink leading-[0.95] tracking-tight text-6xl sm:text-7xl lg:text-8xl xl:text-9xl mb-10 max-w-[16ch] font-medium">
          A page that{" "}
          <span className="italic font-light text-primary">isn&rsquo;t here</span>.
        </h1>

        <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-2xl mb-12">
          The page you&rsquo;re looking for has moved, been renamed, or never
          existed. The links below should get you back on track.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {[
            { label: "Browse all guides",       href: "/guides",      blurb: "60+ Australian property guides, plain English." },
            { label: "Find your suburb",        href: "/find-your-suburb", blurb: "30-second quiz that scores six suburbs against your priorities." },
            { label: "Look up a suburb",        href: "/suburbs",     blurb: "Median, schools, walk score, crime. Every Australian suburb." },
            { label: "Tools and calculators",   href: "/tools",       blurb: "Mortgage, stamp duty, borrowing power, yield, CGT." },
            { label: "First home buyers",       href: "/first-home-buyers", blurb: "Schemes by state, deposit basics, the questions to ask." },
            { label: "Free selling guide",      href: "/selling-guide", blurb: "Ten chapters that routinely save sellers thousands. Free PDF." },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="card-lift group flex flex-col rounded-2xl border border-line bg-surface-raised/90 backdrop-blur-[2px] hover:border-ink p-5"
            >
              <p className="font-display text-lg text-ink leading-tight group-hover:text-primary transition-colors mb-2">
                {l.label}
              </p>
              <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1 mb-3">
                {l.blurb}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-sans text-ink group-hover:text-primary transition-colors">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
