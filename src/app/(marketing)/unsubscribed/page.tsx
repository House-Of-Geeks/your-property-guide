import type { Metadata } from "next";
import Link from "next/link";
import { PhotoHero, HeroTitle, HeroLead } from "@/components/premium";

export const metadata: Metadata = { title: "You’re unsubscribed", robots: { index: false, follow: false } };

export default function UnsubscribedPage() {
  return (
    <PhotoHero>
      <HeroTitle>You’re unsubscribed</HeroTitle>
      <HeroLead>
        {`We won’t send you any more emails in that series. If you also get our newsletter, its emails have their own unsubscribe link. The guides, tools and plans are still free to use.`}
      </HeroLead>
      <p className="mt-6 text-base text-ink-muted">
        <Link href="/" className="font-semibold text-ink underline underline-offset-4">Back to Your Property Guide</Link>
      </p>
    </PhotoHero>
  );
}
