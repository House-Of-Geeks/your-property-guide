import { type NextRequest } from "next/server";
import { renderOgImage } from "@/lib/og/render";

export const runtime = "edge";

// Dynamic OG image for guide pages.
//
// Usage from page metadata:
//   openGraph: {
//     images: [{ url: `/api/og/guide/${slug}?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}` }]
//   }
//
// We accept title + desc as query params rather than importing every guide's
// frontmatter here, so the handler stays slug-agnostic and runs on the edge.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Property guide";
  const description = searchParams.get("desc") ?? undefined;
  const persona = searchParams.get("persona") ?? "Guide";

  // Trim insanely long titles for the layout
  const safeTitle = title.length > 110 ? `${title.slice(0, 107)}…` : title;
  const safeDesc =
    description && description.length > 180
      ? `${description.slice(0, 177)}…`
      : description;

  return renderOgImage({
    eyebrow: persona.toUpperCase(),
    title: safeTitle,
    subtitle: safeDesc,
  });
}
