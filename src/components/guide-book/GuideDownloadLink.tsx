"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { BUYING_GUIDE_PDF_PATH, GUIDE_PDF_PATH } from "@/lib/guide-pdfs";
import type { GuideBookId } from "@/lib/guide-books";

// The guide's PDF, straight from public/downloads (20 Oct 2026): no form, no
// questions. The same URLs the funnels, thanks pages and emails use, so they
// never drift. Counted as guide_downloaded_direct (guide and placement only).

export function guidePdfHref(guide: GuideBookId): string {
  return guide === "buying" ? BUYING_GUIDE_PDF_PATH : GUIDE_PDF_PATH;
}

export function GuideDownloadLink({
  guide,
  placement,
  className,
  tabIndex,
  children,
}: {
  guide: GuideBookId;
  placement: string;
  className?: string;
  tabIndex?: number;
  children: ReactNode;
}) {
  return (
    <a
      href={guidePdfHref(guide)}
      download
      tabIndex={tabIndex}
      type="application/pdf"
      onClick={() => track("guide_downloaded_direct", { guide, placement })}
      className={className}
    >
      {children}
    </a>
  );
}
