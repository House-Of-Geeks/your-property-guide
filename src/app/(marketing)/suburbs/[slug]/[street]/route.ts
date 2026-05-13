// Per-street SEO pages were removed deliberately, the traffic they
// attracted didn't convert and we aren't pursuing that market. We return
// HTTP 410 Gone (not 404) so Google deindexes them faster than the
// soft-deindex it does for 404s.
//
// Sibling static segments under /suburbs/[slug]/ (buy, rent, sold, houses,
// units, townhouses, land, schools, rental-market, vs/[compareSlug]) take
// precedence over this dynamic segment in App Router, so they are
// unaffected.

export async function GET() {
  return new Response("Gone", {
    status: 410,
    headers: { "Content-Type": "text/plain" },
  });
}
