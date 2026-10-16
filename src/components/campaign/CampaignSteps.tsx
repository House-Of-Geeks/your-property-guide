import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAMPAIGN_STEPS } from "@/lib/campaign";
import { GUIDE_BOOKS } from "@/lib/guide-books";
import { BandLead, BandTitle, Eyebrow } from "./parts";
import { CAMPAIGN_PHOTOS } from "./photos";
import { SHELL } from "./shell";

// The five campaign steps (v6), each linked to the selling-guide chapter
// that teaches it. Numbered because they are a real sequence.

export function CampaignSteps() {
  const photo = CAMPAIGN_PHOTOS.styled;
  const chapters = GUIDE_BOOKS.selling.chapters;
  return (
    <section aria-labelledby="campaign-steps-title" className="bg-sand py-20 sm:py-28">
      <div className={`${SHELL} grid items-start gap-12 lg:grid-cols-12 lg:gap-16`}>
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-3xl bg-surface-warm-sunken lg:col-span-5 lg:block">
          <Image src={photo.src} alt="" fill sizes="(min-width: 1280px) 500px, 40vw" className={`object-cover ${photo.position}`} />
        </div>

        <div className="lg:col-span-7">
          <Eyebrow>What a real campaign looks like</Eyebrow>
          <BandTitle className="mt-5">
            <span id="campaign-steps-title">Five steps. Every one of them free to learn.</span>
          </BandTitle>
          <BandLead className="mt-6 max-w-2xl">
            A good market won’t save a weak campaign, and a slack agent can’t hide behind a slow one. Here’s how to make sure yours is done right.
          </BandLead>

          <ol className="mt-10 border-t border-line-strong">
            {CAMPAIGN_STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line-strong py-6 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center sm:gap-x-6">
                <span className="font-display text-[30px] leading-none text-accent-dark sm:text-[36px]" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg text-ink">
                    <span className="sr-only">{`Step ${i + 1}: `}</span>
                    {s.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-muted">{s.body}</p>
                </div>
                <Link
                  href={s.href}
                  aria-label={`Chapter ${s.chapter} of the selling guide: ${chapters[s.chapter - 1].title}`}
                  className="col-start-2 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline sm:col-start-3 sm:mt-0 sm:whitespace-nowrap"
                >
                  Chapter {s.chapter} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
