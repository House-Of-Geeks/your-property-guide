import type { Metadata } from "next";
import { DEFAULT_OG } from "@/lib/og/defaults";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  htmlSitemapPagePath,
  type HtmlSitemapSectionPage,
  type HtmlSitemapSectionSummary,
} from "@/lib/html-sitemap";

export function htmlSitemapMetadata(args: { title: string; canonicalPath: string; description: string }): Metadata {
  const canonical = `${SITE_URL}${args.canonicalPath}`;
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      ...DEFAULT_OG,
      url: canonical,
      title: `${args.title} | ${SITE_NAME}`,
      description: args.description,
      type: "website",
    },
  };
}

function XmlLink() {
  return (
    <p className="mt-12 border-t border-line pt-6 text-[15px]">
      <a href="/sitemap.xml" className="text-ink hover:text-primary">XML sitemap</a>
    </p>
  );
}

function LinkList({ links }: { links: { href: string; title: string }[] }) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} className="text-[15px] leading-snug text-ink hover:text-primary">
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SitemapIndexView({
  sections,
  uniqueCount,
}: {
  sections: HtmlSitemapSectionSummary[];
  uniqueCount: number;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-ink-muted">
        <a href="/" className="hover:text-ink">Home</a>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">Sitemap</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">Sitemap</h1>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
        Every page on Your Property Guide, grouped by section. {uniqueCount.toLocaleString("en-AU")} pages,
        the same URLs as the XML sitemap. Open a section for the full list.
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="border-b border-line pb-2 text-2xl font-semibold tracking-[-0.02em] text-ink">
              {section.title}
            </h2>
            <p className="mt-2 text-[14px] text-ink-muted">
              {section.linkCount.toLocaleString("en-AU")} {section.linkCount === 1 ? "page" : "pages"}
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {section.hubs.map((hub) => (
                <li key={hub.href}>
                  <a href={hub.href} className="text-[15px] leading-snug text-ink hover:text-primary">
                    {hub.title}
                  </a>
                </li>
              ))}
              {Array.from({ length: section.pageCount }, (_, index) => {
                const page = index + 1;
                const href = htmlSitemapPagePath(section.id, page);
                return (
                  <li key={href}>
                    <a href={href} className="text-[15px] leading-snug text-ink hover:text-primary">
                      {section.title}, page {page}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <XmlLink />
    </div>
  );
}

export function SitemapSectionView({ section }: { section: HtmlSitemapSectionPage }) {
  const prev = section.page > 1 ? htmlSitemapPagePath(section.id, section.page - 1) : null;
  const next = section.page < section.pageCount ? htmlSitemapPagePath(section.id, section.page + 1) : null;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-ink-muted">
        <a href="/" className="hover:text-ink">Home</a>
        <span aria-hidden="true"> / </span>
        <a href="/sitemap" className="hover:text-ink">Sitemap</a>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{section.title}</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">Sitemap</h1>
      <section className="mt-8">
        <h2 className="border-b border-line pb-2 text-2xl font-semibold tracking-[-0.02em] text-ink">
          {section.title}
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          Page {section.page} of {section.pageCount}. {section.linkCount.toLocaleString("en-AU")} pages, alphabetical.
        </p>
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <a href="/sitemap" className="text-ink hover:text-primary">All sections</a>
          {prev ? <a href={prev} className="text-ink hover:text-primary">Previous page</a> : null}
          {next ? <a href={next} className="text-ink hover:text-primary">Next page</a> : null}
        </p>
        <LinkList links={section.links} />
      </section>
      <XmlLink />
    </div>
  );
}
