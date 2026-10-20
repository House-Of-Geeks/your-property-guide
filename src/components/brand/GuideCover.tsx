import { BookCover } from "./BookCover";
import { GUIDE_BOOKS } from "@/lib/guide-books";

// A flat guide cover for cards and calls to action. Since 20 Oct 2026 it's
// the shared BookCover (the matched "Clear decisions" collection), so every
// cover on the site, in the PDFs and in the emails is the same design.
export function GuideCover({
  guide = "selling",
  className = "",
}: {
  guide?: "selling" | "buying";
  className?: string;
}) {
  return <BookCover guide={guide} className={`w-full ${className}`} label={`Cover of ${GUIDE_BOOKS[guide].title}`} sizes="200px" />;
}
