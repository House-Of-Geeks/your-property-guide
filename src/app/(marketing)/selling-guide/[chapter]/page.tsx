import type { Metadata } from "next";
import { ChapterPage, chapterMetadata, chapterParams } from "@/components/guide-book/ChapterPage";

// A chapter of the selling guide as its own page (15 Oct 2026). Content: src/content/guides/selling.

export const dynamicParams = false;

export function generateStaticParams() {
  return chapterParams("selling");
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  return chapterMetadata("selling", chapter);
}

export default async function SellingGuideChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  return <ChapterPage guide="selling" slug={chapter} />;
}
