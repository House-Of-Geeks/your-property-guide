// Per-address GNAF profile pages were removed deliberately, the traffic
// they attracted didn't convert and we aren't pursuing that market. We
// return HTTP 410 Gone (not 404) so Google deindexes them faster than the
// soft-deindex it does for 404s.
//
// Partner-listed properties still live at /buy/[slug], /rent/[slug] and
// /sold/[slug], those routes are unaffected.

export async function GET() {
  return new Response("Gone", {
    status: 410,
    headers: { "Content-Type": "text/plain" },
  });
}
