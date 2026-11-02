/** Editorial internal links, keyed by source page path. Anchor text is exact. */
export interface EditorialLink { href: string; anchor: string }

const FV: EditorialLink = { href: "/suburbs/flinders-view-qld-4305", anchor: "Flinders View" };
const MH: EditorialLink = { href: "/suburbs/mount-hutton-nsw-2290", anchor: "Mount Hutton" };

export const EDITORIAL_LINKS_IN: Record<string, EditorialLink[]> = {
  "/regions/ipswich": [FV],
  "/suburbs/ipswich-qld-4305": [FV],
  "/suburbs/eastern-heights-qld-4305": [FV],
  "/suburbs/yamanto-qld-4305": [FV],
  "/regions/newcastle": [MH],
  "/suburbs/eleebana-nsw-2282": [MH],
};

export function editorialLinksFor(path: string): EditorialLink[] {
  return EDITORIAL_LINKS_IN[path] ?? [];
}
