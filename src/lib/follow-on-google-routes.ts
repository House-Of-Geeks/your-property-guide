// Allow-list for the footer "Make us a preferred source" button. Default off:
// only the guides, the about page and the legal pages show it, so lead and
// tool pages stay clear of it.
const EXACT_ROUTES = ["/about", "/privacy", "/terms"];
const PREFIX_ROUTES = ["/guides"];

export function showFooterFollowOnGoogle(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (EXACT_ROUTES.includes(path)) return true;
  return PREFIX_ROUTES.some((p) => path === p || path.startsWith(p + "/"));
}
