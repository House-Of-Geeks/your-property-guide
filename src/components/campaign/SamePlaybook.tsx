import Image from "next/image";
import { Check } from "lucide-react";
import { CAMPAIGN_CHECKLIST, PLAYBOOK_EXAMPLES } from "@/lib/campaign";
import { BandLead, BandTitle, Eyebrow } from "./parts";
import { CAMPAIGN_PHOTOS } from "./photos";
import { SHELL } from "./shell";

// "Same playbook, any price" (v6): a top-end home and a suburban one, joined
// by an equals sign, carrying the same six-point checklist. Both homes are
// illustrations and say so; neither is a sale we handled.

const PHOTO = [CAMPAIGN_PHOTOS.topEnd, CAMPAIGN_PHOTOS.suburban] as const;

export function SamePlaybook() {
  return (
    <section aria-labelledby="same-playbook-title" className="bg-cream py-20 sm:py-28">
      <div className={SHELL}>
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>Same playbook, any price</Eyebrow>
          <BandTitle className="mt-5">
            <span id="same-playbook-title">An $18.5 million home and a $640,000 home sell the same way.</span>
          </BandTitle>
          <BandLead className="mx-auto mt-6 max-w-2xl">
            At the top end nobody leaves the price to the market. Here’s what every one of those campaigns has, and what yours should have too.
          </BandLead>
        </div>

        {/* Two cards and the equals sign between them: stacked on phones
            (the sign sits on the second photo's top edge, clear of the first
            card's checklist), side by side from lg on the photos' midline. */}
        <div className="@container mt-14 flex flex-col lg:grid lg:grid-cols-[1fr_0_1fr] lg:gap-x-7">
          {PLAYBOOK_EXAMPLES.map((ex, i) => (
            <PlaybookCard key={ex.price} example={ex} photo={PHOTO[i]} order={i === 0 ? "order-1" : "order-3"} />
          ))}
          <div
            aria-hidden="true"
            className="z-10 order-2 -mb-[60px] -mt-3 flex h-[72px] w-[72px] shrink-0 items-center justify-center self-center rounded-full border-[6px] border-cream bg-eucalyptus font-display text-[34px] leading-none text-copper-light sm:-mb-20 sm:-mt-4 sm:h-24 sm:w-24 sm:text-[42px] lg:my-0 lg:mt-[calc((100cqw-3.5rem)*0.1406)] lg:-translate-y-1/2 lg:self-start lg:justify-self-center"
          >
            =
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-ink-muted">Illustrative examples, not sales we handled. The checklist is the same at every price.</p>
      </div>
    </section>
  );
}

function PlaybookCard({
  example,
  photo,
  order,
}: {
  example: (typeof PLAYBOOK_EXAMPLES)[number];
  photo: { src: string; position: string };
  order: string;
}) {
  return (
    <article className={`overflow-hidden rounded-3xl bg-white shadow-card ${order}`}>
      <div className="relative aspect-[16/9] bg-surface-warm">
        <Image src={photo.src} alt="" fill sizes="(min-width: 1280px) 620px, (min-width: 1024px) 48vw, 100vw" className={`object-cover ${photo.position}`} />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur-sm">Example</span>
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-display text-[30px] leading-none tracking-[-0.01em] text-ink sm:text-[34px]">{example.price}</p>
          <p className="text-sm text-ink-muted">{example.note}</p>
        </div>
        <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {CAMPAIGN_CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2 text-[15px] leading-snug text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-eucalyptus" strokeWidth={2.5} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
