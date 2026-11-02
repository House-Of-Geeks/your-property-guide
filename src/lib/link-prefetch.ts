// Links to these routes never prefetch: each prefetch is a function call on a
// route the CDN does not cache (or, for /get-help and /find-an-expert, a
// request for a form most readers never open). For next/link's `prefetch`
// where the href comes from data; a fixed href just sets prefetch={false}.
const NO_PREFETCH = /^\/(?:(?:search|get-help|find-an-expert|suburbs)(?=$|[?#])|(?:sitemap|dashboard)(?=$|[/?#]))/;

/** false for a route that must not prefetch; undefined keeps next/link's default. */
export function linkPrefetch(href: string): false | undefined {
  return NO_PREFETCH.test(href) ? false : undefined;
}
