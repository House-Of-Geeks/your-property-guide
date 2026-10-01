// Which states have a rental feed, and therefore where a census rent proxy
// must never stand in for a rent. Pure, tested in tests/sync/rent-proxy-rules.test.ts.
//
// abs-census writes the 2021 Census "median weekly rent" (all dwellings,
// five years old) into the suburb rent columns as a fallback. In a state
// with a bond-data feed that proxy is the wrong kind of number: it renders
// as a house rent and feeds a gross yield. NSW example, 7 Sep 2026: Bondi
// showed $680 against DCJ's $1,800 for houses. The feed is the authority in
// those states; a suburb the feed does not publish shows no rent.
//
// WA joined on 1 Oct 2026 with rental-wa (bond lodgements, all dwellings
// only). Its census proxies on the suburbs the feed covers are cleared by the
// feed itself; the rest are cleared by clear-rent-proxies --state WA, a
// separate step with its own dry run.

export const RENTAL_FEED_STATES = ["NSW", "VIC", "QLD", "SA", "WA"] as const;

export function hasRentalFeed(state: string): boolean {
  return (RENTAL_FEED_STATES as readonly string[]).includes(state.trim().toUpperCase());
}

/** May the census sync write its rent proxy for this suburb? */
export function censusMayWriteRent(state: string, coveredByRentalFeed: boolean): boolean {
  if (hasRentalFeed(state)) return false;
  return !coveredByRentalFeed;
}
