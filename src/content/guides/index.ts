import type { GuideBookId } from "@/lib/guide-books";
import { GUIDE_BOOKS } from "@/lib/guide-books";
import type { Chapter } from "./types";
import { chapter as s1 } from "./selling/ch01";
import { chapter as s2 } from "./selling/ch02";
import { chapter as s3 } from "./selling/ch03";
import { chapter as s4 } from "./selling/ch04";
import { chapter as s5 } from "./selling/ch05";
import { chapter as s6 } from "./selling/ch06";
import { chapter as s7 } from "./selling/ch07";
import { chapter as s8 } from "./selling/ch08";
import { chapter as s9 } from "./selling/ch09";
import { chapter as s10 } from "./selling/ch10";
import { chapter as b1 } from "./buying/ch01";
import { chapter as b2 } from "./buying/ch02";
import { chapter as b3 } from "./buying/ch03";
import { chapter as b4 } from "./buying/ch04";
import { chapter as b5 } from "./buying/ch05";
import { chapter as b6 } from "./buying/ch06";
import { chapter as b7 } from "./buying/ch07";
import { chapter as b8 } from "./buying/ch08";
import { chapter as b9 } from "./buying/ch09";
import { chapter as b10 } from "./buying/ch10";

export type { Chapter } from "./types";
export { CALLOUT_TITLE, CHECKLIST_TITLE, CHAPTER_DISCLAIMER } from "./types";
export { GUIDE_INTRO } from "./intro";

/** Both guides' chapters, in order. A test keeps them in step with src/lib/guide-books.ts. */
export const CHAPTERS: Record<GuideBookId, readonly Chapter[]> = {
  selling: [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10],
  buying: [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10],
};

/** A chapter with its title and slug from the guide's contents. */
export interface ChapterEntry extends Chapter {
  slug: string;
  title: string;
  sub: string;
}

export function chapterEntries(guide: GuideBookId): ChapterEntry[] {
  return CHAPTERS[guide].map((c) => {
    const meta = GUIDE_BOOKS[guide].chapters[c.number - 1];
    return { ...c, slug: meta.slug, title: meta.title, sub: meta.sub };
  });
}

export function getChapter(guide: GuideBookId, slug: string): ChapterEntry | undefined {
  return chapterEntries(guide).find((c) => c.slug === slug);
}
