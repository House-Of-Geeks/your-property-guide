import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { ChapterContent } from "@/components/guide-book/ChapterContent";
import { GuideIntroNote } from "@/components/guide-book/GuideIntroNote";
import { chapterEntries } from "@/content/guides";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";

// The whole guide on one printable page (15 Oct 2026): cover, contents,
// Andy's note, the ten chapters and the back page, from the same content as
// the chapter pages. scripts/guides/render-pdfs.mjs prints it to
// public/downloads (the PDFs) and screenshots the cover for
// public/images/guide. ?cover=1 shows the cover alone, for that screenshot.

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ guide: "selling" }, { guide: "buying" }];
}

export const metadata: Metadata = {
  title: "Printable guide",
  robots: { index: false, follow: false },
};

const PRINT_CSS = `
/* No side margins on any page: Chrome lays the whole document out at one
   width, and the edge-to-edge cover sets it. The content pads itself. */
@page { size: A4; margin: 16mm 0 18mm; }
@page :first { margin: 0; }
html, body { background: #ffffff !important; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.print-page { break-before: page; }
.print-chapter h2 { break-after: avoid; }
.print-chapter tr, .print-chapter li { break-inside: avoid; }
.print-chapter .prose-ypg { max-width: none; }
nextjs-portal { display: none !important; }
`;

export default async function PrintGuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ guide: string }>;
  searchParams: Promise<{ cover?: string }>;
}) {
  const { guide: g } = await params;
  const { cover } = await searchParams;
  if (g !== "selling" && g !== "buying") notFound();
  const guide = g as GuideBookId;
  const book = GUIDE_BOOKS[guide];
  const chapters = chapterEntries(guide);
  // Light copper reads on eucalyptus, not on the copper buying cover.
  const accent = guide === "selling" ? "text-copper-light" : "text-white";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Cover: A4, edge to edge. */}
      <section
        id="cover"
        className="relative flex h-[297mm] w-[210mm] flex-col overflow-hidden px-[18mm] pb-[18mm] pt-[20mm] text-white"
        style={{ backgroundColor: book.colour }}
      >
        <div className="flex items-center gap-2.5">
          <LogoMark className={`h-7 w-7 ${accent}`} />
          <span className="font-display text-[20px]">Your Property Guide</span>
        </div>
        <div className={`mt-[52mm] h-[2px] w-20 ${guide === "selling" ? "bg-copper-light" : "bg-white"}`} />
        <div className={`mt-8 text-[13px] font-semibold uppercase tracking-[0.22em] ${accent}`}>
          {guide === "selling" ? "The $20 million playbook, for every home" : "The seller’s playbook, from your side of the table"}
        </div>
        <h1 className="mt-6 font-display text-[64px] font-normal leading-[1.02] tracking-[-0.02em]">{book.name}</h1>
        <p className="mt-6 max-w-[140mm] text-[22px] leading-snug text-white/85">{book.subtitle}</p>
        <div className="mt-auto flex items-end justify-between text-[13px] font-semibold text-white/80">
          <span>2026 edition · 10 chapters · Free</span>
          <span>yourpropertyguide.com.au</span>
        </div>
      </section>

      {cover !== "1" && (
        // Web type sizes are roomy for paper: the content prints at 82%,
        // widened to match so it still fills the A4 width.
        <div className="px-[20mm] text-ink" style={{ zoom: 0.82, width: "calc(210mm / 0.82)" }}>
          {/* Contents */}
          <section className="print-page pt-2">
            <h2 className="text-[40px] leading-tight text-ink">Contents</h2>
            <ol className="mt-8 border-t border-line">
              {chapters.map((c) => (
                <li key={c.slug} className="flex gap-6 border-b border-line py-4">
                  <span className="w-10 shrink-0 font-display text-[26px] leading-none text-accent-dark">{String(c.number).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[17px] font-semibold text-ink">{c.title}</span>
                    <span className="mt-1 block text-[14px] text-ink-muted">{c.sub}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Andy's note */}
          <section className="print-page pt-2">
            <GuideIntroNote guide={guide} />
          </section>

          {/* The chapters */}
          {chapters.map((c) => (
            <section key={c.slug} className="print-page print-chapter pt-2">
              <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
                {`Chapter ${c.number} · ${c.step}`}
              </div>
              <h1 className="mt-3 text-[40px] leading-[1.06] tracking-[-0.02em] text-ink">{c.title}</h1>
              <p className="mb-8 mt-4 text-[18px] leading-relaxed text-ink-muted">{c.standfirst}</p>
              <ChapterContent chapter={c} print />
              <div className="mt-6 text-[12px] text-ink-subtle">
                {`Read it online: yourpropertyguide.com.au${book.href}/${c.slug}`}
              </div>
            </section>
          ))}

          {/* Back page */}
          <section className="print-page pt-2">
            <h2 className="text-[34px] leading-tight text-ink">About Your Property Guide</h2>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink">
              <div>
                Your Property Guide gives every Australian the campaign that gets top dollar for a $20 million home, free: guides,
                calculators and plans for selling, buying or both. When you ask, we introduce you to one agent for each job you ask us to
                help with, checked by us. The agent pays us a flat fee for the introduction. We take no share of their commission, you pay
                us nothing, and the fee doesn’t change what you pay the agent.
              </div>
              <div>
                You’ll find this guide online chapter by chapter, its companion guide to {guide === "selling" ? "buying" : "selling"}, and
                every calculator at <strong>yourpropertyguide.com.au</strong>.
              </div>
            </div>
            <div className="mt-12 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Disclaimer</div>
            <div className="mt-2 text-[12px] leading-relaxed text-ink-muted">
              This guide is general information only. It is not financial, legal or tax advice, and it doesn’t take your personal
              circumstances into account.{" "}
              {guide === "selling"
                ? "Costs, commission rates, legal requirements and timeframes are typical ranges as at mid-2026; they vary by state, suburb and situation, and they change."
                : "Costs, scheme settings, grant amounts, price caps, legal requirements and timeframes are typical figures as at mid-2026 (first home grants, stamp duty relief and federal scheme settings checked 14 October 2026); they vary by state, suburb and situation, and they change with budgets and legislation."}{" "}
              Before acting on anything in this guide, verify the current rules for your state and get advice from a licensed conveyancer
              or solicitor, a registered tax agent, {guide === "buying" ? "a licensed mortgage broker or adviser, " : ""}and other
              qualified professionals as your situation requires. While care has been taken in preparing this guide, no warranty is given
              as to its accuracy or completeness, and no liability is accepted for any loss arising from reliance on it.
            </div>
            <div className="mt-8 text-[12px] text-ink-muted">
              © Profit Geeks 2026. All rights reserved. yourpropertyguide.com.au · {book.title} · 2026 edition
            </div>
          </section>
        </div>
      )}
    </>
  );
}
