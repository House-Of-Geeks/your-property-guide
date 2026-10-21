import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getHtmlSitemapPage, htmlSitemapSectionTitle, isHtmlSitemapSection } from "@/lib/html-sitemap";
import { htmlSitemapMetadata, SitemapSectionView } from "../../view";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function pageNumber(raw: string): number | null {
  if (!/^[1-9][0-9]*$/.test(raw)) return null;
  return Number(raw);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; page: string }>;
}): Promise<Metadata> {
  const { section, page } = await params;
  const title = htmlSitemapSectionTitle(section);
  const n = pageNumber(page);
  if (!title || section.includes(".") || n === null || n < 2) return { title: "Sitemap" };
  return htmlSitemapMetadata({
    title: `Sitemap: ${title}, page ${n}`,
    canonicalPath: `/sitemap/${section}/${n}`,
    description: `${title} pages on Your Property Guide, page ${n} of the section list.`,
  });
}

export default async function SitemapSectionPageN({
  params,
}: {
  params: Promise<{ section: string; page: string }>;
}) {
  const { section, page } = await params;
  if (!isHtmlSitemapSection(section) || section.includes(".")) notFound();
  const n = pageNumber(page);
  if (n === null) notFound();
  if (n === 1) permanentRedirect(`/sitemap/${section}`);
  const result = await getHtmlSitemapPage(section, n);
  if (!result) notFound();
  return <SitemapSectionView section={result} />;
}
