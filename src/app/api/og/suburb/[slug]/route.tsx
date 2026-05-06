import { type NextRequest } from "next/server";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { renderOgImage, OG_BRAND } from "@/lib/og/render";
import { formatPrice } from "@/lib/utils/format";

// Suburb OG image is data-driven — we look up the suburb so the card has real
// median price + growth + state. This means it can't run on the edge (Prisma
// doesn't run there yet) but the static-page layer will revalidate it.
export const dynamic = "force-static";
export const revalidate = 86400; // refresh once per day

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);

  if (!suburb) {
    return renderOgImage({
      eyebrow: "SUBURB",
      title: "Suburb profile",
      subtitle: "yourpropertyguide.com.au",
    });
  }

  const stats: { label: string; value: string }[] = [];
  if (suburb.stats.medianHousePrice > 0) {
    stats.push({
      label: "Median house",
      value: formatPrice(suburb.stats.medianHousePrice),
    });
  }
  if (suburb.stats.annualGrowthHouse !== 0) {
    stats.push({
      label: "Annual growth",
      value: `${suburb.stats.annualGrowthHouse >= 0 ? "+" : ""}${suburb.stats.annualGrowthHouse.toFixed(1)}%`,
    });
  }
  if (suburb.stats.medianRentHouse > 0) {
    stats.push({
      label: "Rent / week",
      value: `$${suburb.stats.medianRentHouse}`,
    });
  }
  if (suburb.stats.walkScore != null && suburb.stats.walkScore > 0) {
    stats.push({
      label: "Walk score",
      value: String(suburb.stats.walkScore),
    });
  }

  return renderOgImage({
    eyebrow: `${suburb.state} · ${suburb.postcode}`,
    title: suburb.name,
    subtitle: `Suburb profile, ${suburb.state}. Median price, schools, walkability and risk on Your Property Guide.`,
    stats: stats.slice(0, 3),
    accentColor: OG_BRAND.accent,
  });
}
