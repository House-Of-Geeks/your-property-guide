import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

// The page only redirects; noindex covers a crawler that has not followed yet.
export const metadata: Metadata = { robots: { index: false } };

interface SchoolVsPageProps {
  params: Promise<{ slug: string; compareSlug: string }>;
}

// School-vs-school pages were an unbounded combinatorial surface (every
// school linked to its nearby schools, none of them in a sitemap) that cost
// ISR writes and database time per pair. They are no longer published; an old
// link lands on the first school's own profile, which carries the same ICSEA
// and enrolment figures. No database work happens here.
export default async function SchoolVsPage({ params }: SchoolVsPageProps) {
  const { slug } = await params;
  permanentRedirect(`/schools/${slug}`);
}
