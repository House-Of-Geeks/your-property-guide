import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { pickSpotlightSlug } from "@/lib/suburb-spotlight";
import { formatPriceFull } from "@/lib/utils/format";
import { hasReliablePrice } from "@/lib/suburb-data-quality";

// Hero spotlight: a real suburb's data rendered as a magazine
// "fact box" on the right side of the homepage hero. The point is
// SHOW not TELL — a visitor sees the actual depth of data they'll
// get for any suburb on the site, before they've typed anything.
//
// Async server component. Picks today's slug, fetches once,
// degrades gracefully if data is missing.

export async function SpotlightSuburbCard() {
  const slug = pickSpotlightSlug();
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return null;

  const s = suburb.stats;
  const growthSign = (s.annualGrowthHouse ?? 0) >= 0 ? "+" : "";
  const growthClass = (s.annualGrowthHouse ?? 0) >= 0 ? "text-emerald-700" : "text-red-700";

  // Defensive: even though SPOTLIGHT_SLUGS is curated to NSW/VIC, guard
  // against any future addition that turns out to have unreliable
  // price data. If price isn't trustworthy, render the spotlight
  // without the price+growth rows rather than publishing fiction.
  const showPrice = hasReliablePrice(suburb);

  const profileHref = `/suburbs/${slug}`;

  return (
    <Link
      href={profileHref}
      aria-label={`Today's spotlight: ${suburb.name}, ${suburb.state} ${suburb.postcode}. Open full suburb profile.`}
      className="group card-lift block rounded-2xl border border-line bg-surface-raised shadow-card overflow-hidden hover:border-line-strong"
    >
      {/* Editorial decorative band. Subtle contour SVG instead of a
          hero image so the card works for any suburb in the rotation
          without depending on per-suburb photography. */}
      <div className="relative bg-ink overflow-hidden h-32 sm:h-36">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.22] invert"
        />
        <Image
          src="/images/illustrations/street-grid.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden="true"
          className="absolute -right-4 -bottom-4 w-44 opacity-[0.18] invert pointer-events-none select-none"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/70 font-sans font-medium mb-1">
              This week&rsquo;s read
            </p>
            <p className="font-display italic text-cta text-sm leading-none">
              Spotlight
            </p>
          </div>
          <span className="font-display italic text-white/75 text-sm tabular-nums">
            {suburb.state} {suburb.postcode}
          </span>
        </div>
      </div>

      {/* Body. Suburb identifier + 4 data points in a magazine fact-
          box layout. Tabular numbers, clean rows, hairline dividers. */}
      <div className="p-5 sm:p-6">
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-1 group-hover:text-primary transition-colors">
          {suburb.name}
        </h2>
        <p className="font-sans text-sm text-ink-muted leading-snug mb-5">
          {suburb.region ? `${suburb.region}, ${suburb.state}` : suburb.state}
        </p>

        <dl data-reveal-group className="border-t border-line">
          {showPrice && s.medianHousePrice > 0 && (
            <div className="flex items-baseline justify-between py-3 border-b border-line">
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle font-sans font-medium">
                Median house
              </dt>
              <dd className="font-display text-base sm:text-lg text-ink tabular-nums">
                {formatPriceFull(s.medianHousePrice)}
              </dd>
            </div>
          )}
          {showPrice && s.annualGrowthHouse !== null && s.annualGrowthHouse !== 0 && (
            <div className="flex items-baseline justify-between py-3 border-b border-line">
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle font-sans font-medium">
                12-month growth
              </dt>
              <dd className={`font-display text-base sm:text-lg tabular-nums ${growthClass}`}>
                {growthSign}{(s.annualGrowthHouse ?? 0).toFixed(1)}%
              </dd>
            </div>
          )}
          {s.medianRentHouse > 0 && (
            <div className="flex items-baseline justify-between py-3 border-b border-line">
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle font-sans font-medium">
                Median rent (house)
              </dt>
              <dd className="font-display text-base sm:text-lg text-ink tabular-nums">
                ${s.medianRentHouse}/wk
              </dd>
            </div>
          )}
          {s.walkScore !== null && s.walkScore !== undefined && (
            <div className="flex items-baseline justify-between py-3 border-b border-line">
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle font-sans font-medium">
                Walk score
              </dt>
              <dd className="font-display text-base sm:text-lg text-ink tabular-nums">
                {s.walkScore}/100
              </dd>
            </div>
          )}
          {s.population > 0 && (
            <div className="flex items-baseline justify-between py-3">
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-subtle font-sans font-medium">
                Population
              </dt>
              <dd className="font-display text-base sm:text-lg text-ink tabular-nums">
                {s.population.toLocaleString("en-AU")}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-sans text-xs text-ink-subtle">
            One of 9,600+ profiles, free.
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover:text-primary transition-colors">
            Open profile
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
