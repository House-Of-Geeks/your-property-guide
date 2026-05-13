import { getBlogPosts } from "@/lib/services/blog-service";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

// Replace XML-special chars + bracket characters in CDATA boundaries.
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Wrap content in CDATA so HTML markup inside excerpt or content doesn't blow
// up the parser. Closing brackets in the content are escaped to keep the CDATA
// section valid.
function cdata(s: string): string {
  const safe = (s ?? "").replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}

function rfc822(date: string): string {
  return new Date(date).toUTCString();
}

export async function GET() {
  const posts = await getBlogPosts(40);
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const latestPubDate = sorted.length > 0 ? rfc822(sorted[0].publishedAt) : rfc822(new Date().toISOString());

  const items = sorted
    .map((p) => {
      const url = `${SITE_URL}/guides/${p.slug}`;
      const cover = p.coverImage
        ? p.coverImage.startsWith("http")
          ? p.coverImage
          : `${SITE_URL}${p.coverImage}`
        : null;

      return `
    <item>
      <title>${cdata(p.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${rfc822(p.publishedAt)}</pubDate>
      ${p.author?.name ? `<dc:creator>${cdata(p.author.name)}</dc:creator>` : ""}
      ${p.category ? `<category>${cdata(p.category)}</category>` : ""}
      ${cover ? `<enclosure url="${xmlEscape(cover)}" type="image/jpeg" />` : ""}
      <description>${cdata(p.excerpt ?? "")}</description>
      <content:encoded>${cdata(p.content ?? p.excerpt ?? "")}</content:encoded>
    </item>`;
    })
    .join("");

  const feedUrl = `${SITE_URL}/guides/feed.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cdata(`${SITE_NAME}, Insights`)}</title>
    <link>${xmlEscape(SITE_URL)}/guides</link>
    <description>${cdata("Australian property market analysis, capital city outlooks, RBA decisions, and data refreshes.")}</description>
    <language>en-au</language>
    <lastBuildDate>${latestPubDate}</lastBuildDate>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
