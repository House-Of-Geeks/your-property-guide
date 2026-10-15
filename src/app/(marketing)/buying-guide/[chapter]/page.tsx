import type { Metadata } from "next";
import { ChapterPage, chapterMetadata, chapterParams } from "@/components/guide-book/ChapterPage";

// A chapter of the buying guide as its own page (15 Oct 2026). Content: src/content/guides/buying.

export const dynamicParams = false;

export function generateStaticParams() {
  return chapterParams("buying");
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  return chapterMetadata("buying", chapter);
}

export default async function BuyingGuideChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  return <ChapterPage guide="buying" slug={chapter} />;
}
