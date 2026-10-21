import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getHtmlSitemapPage, htmlSitemapSectionTitle, isHtmlSitemapSection } from "@/lib/html-sitemap";
import { htmlSitemapMetadata, SitemapSectionView } from "../view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const title = htmlSitemapSectionTitle(section);
  if (!title || section.includes(".")) return { title: "Sitemap" };
  return htmlSitemapMetadata({
    title: `Sitemap: ${title}`,
    canonicalPath: `/sitemap/${section}`,
    description: `Every ${title} page on Your Property Guide. Page 1 of the section list.`,
  });
}

export default async function SitemapSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  // ".xml" is never a section. Numeric ids are reserved for Next sitemap
  // urlsets (/sitemap/0.xml on sites that use generateSitemaps at the root).
  if (!isHtmlSitemapSection(section) || section.includes(".")) notFound();
  const page = await getHtmlSitemapPage(section, 1);
  if (!page) notFound();
  return <SitemapSectionView section={page} />;
}
