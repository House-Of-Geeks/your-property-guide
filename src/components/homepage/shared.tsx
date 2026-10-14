import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/services/blog-service";
import { resolveBlogCoverPath } from "@/lib/utils/blog-cover";
import { SHELL } from "./shell";

// Homepage parts that are plain reading (v5, 14 Oct 2026): who writes the
// guides and the latest posts. The parts people use live in
// src/components/interactive.

export function EditorBand({ guideCount, tone = "warm" }: { guideCount: number; tone?: "warm" | "light" }) {
  return (
    <section className={`${tone === "warm" ? "bg-surface-warm" : "bg-white"} py-16 sm:py-24`}>
      <div className={`${SHELL} grid items-center gap-10 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-4">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-2xl lg:mx-0">
            <Image src="/images/agents/andy-mcmaster.jpg" alt="Andy McMaster" fill sizes="320px" className="object-cover object-top" />
          </div>
        </div>
        <div className="lg:col-span-8">
          <h2 className="text-[34px] sm:text-5xl leading-[1.04] tracking-[-0.035em] text-ink max-w-2xl">
            Written for the person moving, not the agent
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-muted leading-relaxed">
            {`Andy McMaster edits every guide and signs it off before it publishes. Grants, stamp duty and scheme rules are checked against the state revenue offices and dated.`}
          </p>
          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-ink-muted">Free guides and articles</dt>
              <dd className="mt-1 text-3xl font-bold tracking-[-0.03em] text-ink">{guideCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">To read a guide or use a tool</dt>
              <dd className="mt-1 text-3xl font-bold tracking-[-0.03em] text-ink">No sign-up</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">What you pay us</dt>
              <dd className="mt-1 text-3xl font-bold tracking-[-0.03em] text-ink">Nothing</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-ink-muted">
            Agents pay us when we introduce them. It doesn’t change what you pay them.{" "}
            <Link href="/about#ownership-funding" className="font-semibold text-ink underline underline-offset-4">How we’re paid</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export async function LatestGuides() {
  const posts = (await getBlogPosts()).slice(0, 3);
  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className={SHELL}>
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-[34px] sm:text-5xl leading-[1.04] tracking-[-0.035em] text-ink">Latest from the guide</h2>
          <Link href="/guides" className="hidden sm:inline-flex items-center gap-1.5 text-base font-semibold text-ink hover:text-primary">
            All guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {posts.map((p) => {
            const cover = resolveBlogCoverPath(p.coverImage);
            return (
              <Link key={p.slug} href={`/guides/${p.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-warm">
                  {cover && <Image src={cover} alt="" fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
                </div>
                <p className="mt-4 text-sm text-ink-muted">{p.category}</p>
                <h3 className="mt-1 text-xl leading-snug text-ink group-hover:underline underline-offset-4">{p.title}</h3>
              </Link>
            );
          })}
        </div>
        <Link href="/guides" className="mt-8 inline-flex sm:hidden items-center gap-1.5 text-base font-semibold text-ink">
          All guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
