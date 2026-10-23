"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { GUIDE_BOOKS, chapterHref, type GuideBookId } from "@/lib/guide-books";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, TEXT_LINK } from "@/components/premium/buttons";
import { GuideDownloadLink } from "./GuideDownloadLink";
import { GuideEmailForm } from "./GuideEmailForm";

// Guide access without friction (20 Oct 2026). Three plain choices at the
// top of a guide's page, under fine rules, with nothing asked first: read it
// on the site, download the PDF, or have it emailed (a first name and an
// email). The three-question funnel stays below as an optional extra.
//
// Anchors: #get-the-guide (the page wraps the hero in it), #email-a-copy
// (this row; arriving on it opens the form, which is how the phone bar's
// "Email it" works) and #guide-funnel (the funnel, further down).

export const EMAIL_A_COPY_HASH = "#email-a-copy";

export function GuideAccess({ guide, placement }: { guide: GuideBookId; placement: string }) {
  const book = GUIDE_BOOKS[guide];
  const [emailOpen, setEmailOpen] = useState(false);
  const [focusForm, setFocusForm] = useState(false);

  // Arriving on #email-a-copy (the phone bar, a link from another page)
  // opens the form. Deferred a frame so the open isn't set during the
  // effect itself.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === EMAIL_A_COPY_HASH) setEmailOpen(true);
    };
    const frame = window.requestAnimationFrame(check);
    window.addEventListener("hashchange", check);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", check);
    };
  }, []);

  const readOnline = () => track("guide_read_online", { guide, placement });
  const rowClass = "border-b border-line py-5";
  const noteClass = "mt-1 text-[14px] leading-snug text-ink-muted";

  return (
    <section aria-labelledby={`${guide}-access-title`} className="border-t border-ink pt-5">
      <h2 id={`${guide}-access-title`} className="font-display text-[28px] leading-[1.1] tracking-[-0.035em] text-ink sm:text-[30px]">
        Get the free guide
      </h2>

      <ul className="mt-4 border-t border-line">
        <li className={`${rowClass} grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3`}>
          <div className="min-w-0">
            <h3 className="text-[18px] font-medium leading-snug text-ink">Read online</h3>
            <p className={noteClass}>
              {"All ten chapters on the site. "}
              <a href="#contents" onClick={readOnline} className="underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink">
                See the contents
              </a>
            </p>
          </div>
          <Link href={chapterHref(guide, 1)} onClick={readOnline} className={TEXT_LINK}>
            Start reading <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>

        <li className={`${rowClass} grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3`}>
          <div className="min-w-0">
            <h3 className="text-[18px] font-medium leading-snug text-ink">Download the PDF</h3>
            <p className={noteClass}>2026 edition, ten chapters. Straight to your device.</p>
          </div>
          <GuideDownloadLink guide={guide} placement={placement} className={BUTTON_PRIMARY}>
            Download
            <span className="sr-only">{` ${book.name} (PDF)`}</span>
          </GuideDownloadLink>
        </li>

        <li id="email-a-copy" className={`${rowClass} scroll-mt-24`}>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3">
            <div className="min-w-0">
              <h3 className="text-[18px] font-medium leading-snug text-ink">Email me a copy</h3>
              <p className={noteClass}>The PDF in your inbox, to keep. We ask for a first name and an email, nothing more.</p>
            </div>
            {!emailOpen && (
              <button
                type="button"
                aria-expanded={false}
                onClick={() => {
                  setFocusForm(true);
                  setEmailOpen(true);
                }}
                className={BUTTON_SECONDARY}
              >
                Email it
              </button>
            )}
          </div>
          {emailOpen && (
            <div className="mt-5">
              <GuideEmailForm guide={guide} placement={placement} autoFocus={focusForm} />
            </div>
          )}
        </li>
      </ul>

      <p className="mt-5 text-[14px] leading-relaxed text-ink-muted">
        {"Want pointers for where you’re up to? "}
        <a href="#guide-funnel" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          Answer three quick questions
        </a>
      </p>
    </section>
  );
}
