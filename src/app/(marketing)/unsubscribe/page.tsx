import type { Metadata } from "next";
import Link from "next/link";
import { BUTTON_PRIMARY } from "@/components/premium/buttons";

// /unsubscribe?t= (21 Oct 2026): the page an email's unsubscribe link opens.
// It asks before it acts, so a link scanner opening the link changes
// nothing; the button POSTs to /api/unsubscribe. Mail clients' one-click
// unsubscribe goes straight to the API.

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const token = typeof t === "string" && t.length >= 10 && t.length <= 64 ? t : null;
  return (
    <section className="border-b border-line bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-primary">Email preferences</p>
        <h1 className="mt-5 max-w-3xl text-[40px] leading-[1.06] tracking-[-0.045em] text-ink sm:text-[54px]">Stop our updates and tips?</h1>
        {token ? (
          <>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.7] text-ink-muted">
              We’ll stop the tips series and the newsletter for this email address. A guide, a plan or a confirmation you ask for in future will still arrive.
            </p>
            <form method="post" action={`/api/unsubscribe?t=${encodeURIComponent(token)}`} className="mt-8">
              <input type="hidden" name="confirm" value="1" />
              <button type="submit" className={BUTTON_PRIMARY}>
                Unsubscribe me
              </button>
            </form>
          </>
        ) : (
          <p className="mt-6 max-w-2xl text-[18px] leading-[1.7] text-ink-muted">
            This link is incomplete. Use the unsubscribe link at the foot of the email, or reply to it and we’ll take you off the list.
          </p>
        )}
        <p className="mt-8 text-[15px] text-ink-muted">
          Changed your mind? <Link href="/" className="text-ink underline underline-offset-4">Back to Your Property Guide</Link>
        </p>
      </div>
    </section>
  );
}
