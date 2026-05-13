import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatBestDealPrice } from "@/lib/services/best-deal-service";
import type { BestDeal } from "@/types/best-deal";

// Three variants share the same data, different layouts:
//   "hero"      — large, used for the lead position on rails
//   "compact"   — medium, used inside grids and persona hubs
//   "in-guide"  — single-card slot for in-content guide injection
//
// Every variant renders the partner-disclosure line. Required.

interface BestDealCardProps {
  deal: BestDeal;
  variant?: "hero" | "compact" | "in-guide";
}

export function BestDealCard({ deal, variant = "compact" }: BestDealCardProps) {
  const href = `/best-deals/${deal.id}`;
  const price = formatBestDealPrice(deal);

  if (variant === "in-guide") {
    return (
      <aside className="my-8 rounded-2xl border border-line-warm bg-surface-warm overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
          <Link href={href} className="relative aspect-[4/3] sm:aspect-auto sm:h-full bg-surface-raised">
            <Image
              src={deal.heroImage}
              alt={deal.title}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-cover"
            />
          </Link>
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-cta mb-2">
              Featured opportunity · Partner agent
            </p>
            <Link href={href}>
              <h3 className="font-display text-xl text-ink leading-tight hover:text-primary transition-colors mb-2">
                {deal.title}
              </h3>
            </Link>
            <p className="font-sans text-sm text-ink-muted leading-relaxed mb-3 line-clamp-2">
              {deal.headline}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-sans text-ink-muted mb-3">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                {deal.suburbName}, {deal.state}
              </span>
              <PropertyFeatureRow deal={deal} compact />
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-lg text-ink leading-none">{price}</p>
              <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors">
                View deal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "hero") {
    return (
      <Link href={href} className="group block rounded-2xl border border-line bg-surface-raised overflow-hidden hover:border-ink hover:shadow-card-hover transition-all">
        <div className="relative aspect-[16/9] bg-surface-warm">
          <Image
            src={deal.heroImage}
            alt={deal.title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            priority
          />
          <div className="absolute top-3 left-3">
            <Badge variant="accent">Featured · Partner</Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-display text-2xl text-ink leading-tight mb-2 group-hover:text-primary transition-colors">
            {deal.title}
          </h3>
          <p className="font-sans text-base text-ink-muted leading-relaxed mb-4 line-clamp-2">
            {deal.headline}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-sans text-ink-muted mb-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {deal.suburbName}, {deal.state}
            </span>
            <PropertyFeatureRow deal={deal} />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-display text-2xl text-ink leading-none">{price}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              View deal <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <p className="text-[11px] font-sans text-ink-subtle mt-4 leading-relaxed">
            Partner agent. We&rsquo;re paid only when matched work goes ahead. Buyers never pay.
          </p>
        </div>
      </Link>
    );
  }

  // compact
  return (
    <Link href={href} className="group block rounded-2xl border border-line bg-surface-raised overflow-hidden hover:border-ink hover:shadow-card transition-all">
      <div className="relative aspect-[4/3] bg-surface-warm">
        <Image
          src={deal.heroImage}
          alt={deal.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="accent">Partner</Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-ink leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {deal.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-sans text-ink-muted mb-3">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" aria-hidden="true" />
            {deal.suburbName}, {deal.state}
          </span>
          <PropertyFeatureRow deal={deal} compact />
        </div>
        <p className="font-display text-base text-ink leading-none">{price}</p>
      </div>
    </Link>
  );
}

function PropertyFeatureRow({ deal, compact = false }: { deal: BestDeal; compact?: boolean }) {
  const iconClass = compact ? "w-3 h-3" : "w-4 h-4";
  return (
    <span className="inline-flex items-center gap-3">
      {deal.bedrooms != null && (
        <span className="inline-flex items-center gap-1">
          <Bed className={iconClass} aria-hidden="true" />
          {deal.bedrooms}
        </span>
      )}
      {deal.bathrooms != null && (
        <span className="inline-flex items-center gap-1">
          <Bath className={iconClass} aria-hidden="true" />
          {deal.bathrooms}
        </span>
      )}
      {deal.carSpaces != null && (
        <span className="inline-flex items-center gap-1">
          <Car className={iconClass} aria-hidden="true" />
          {deal.carSpaces}
        </span>
      )}
    </span>
  );
}
