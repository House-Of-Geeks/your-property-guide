// Allow-list for the footer "Make us a preferred source" button. Default off:
// only the guides listings, the about page and the legal pages show it, so lead and
// tool pages stay clear of it.
// Guide articles render their own button, so the footer button stays off on
// each guide article and each page shows exactly one button. The guides index and
// the category listings keep the footer button.
const EXACT_ROUTES = ["/about", "/privacy", "/terms", "/guides"];
const PREFIX_ROUTES = ["/guides/category"];

export function showFooterFollowOnGoogle(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (EXACT_ROUTES.includes(path)) return true;
  return PREFIX_ROUTES.some((p) => path === p || path.startsWith(p + "/"));
}
