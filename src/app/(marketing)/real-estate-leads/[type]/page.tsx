import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { BreadcrumbJsonLd, FAQPageJsonLd, JsonLd } from "@/components/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqAccordion } from "@/components/guide/FaqAccordion";
import { AgentEnquiryForm } from "@/components/forms/AgentEnquiryForm";
import { SITE_URL } from "@/lib/constants/seo";
import { guideOgImages } from "@/lib/og/helpers";
import { leadTypePages, getLeadTypePage } from "@/lib/data/real-estate-leads";
import { CTA_CLASS, Chapter, Clauses, Docket, FinePrint, WhatHappensNext } from "../_parts";
import s from "../real-estate-leads.module.css";

// One page per lead type sold on /real-estate-leads. Shares the hub's CSS
// module and "Docket" layout (ported from yourfinanceguide.com.au/
// finance-leads) but every page carries its own docket, source pages,
// profiles, working advice, optional long-form chapter and FAQ from
// src/lib/data/real-estate-leads.ts. Slugs match the search query.

export const dynamicParams = false;

export function generateStaticParams() {
  return leadTypePages.map((p) => ({ type: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await props.params;
  const page = getLeadTypePage(type);
  if (!page) return {};
  const url = `${SITE_URL}/real-estate-leads/${page.slug}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      images: guideOgImages({ slug: `real-estate-leads-${page.slug}`, title: page.name, description: page.cardText }),
    },
  };
}

const ROMAN = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "VIII.", "IX."];

export default async function LeadTypePage(props: { params: Promise<{ type: string }> }) {
  const { type } = await props.params;
  const page = getLeadTypePage(type);
  if (!page) notFound();

  const siblings = leadTypePages.filter((p) => p.slug !== page.slug);
  const url = `${SITE_URL}/real-estate-leads/${page.slug}`;
  let ch = 0;
  const next = () => ROMAN[ch++];

  return (
    <div className={s.page}>
      <BreadcrumbJsonLd
        items={[
          { name: "Real Estate Leads", url: "/real-estate-leads" },
          { name: page.name, url: `/real-estate-leads/${page.slug}` },
        ]}
      />
      <FAQPageJsonLd faqs={page.faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${url}#service`,
          name: page.name,
          serviceType: `${page.name} for ${page.audience.toLowerCase()} in Australia`,
          description: page.description,
          url,
          provider: { "@type": "Organization", name: "Your Property Guide", url: SITE_URL },
          isRelatedTo: { "@id": `${SITE_URL}/real-estate-leads#service` },
          areaServed: { "@type": "Country", name: "Australia" },
          audience: { "@type": "BusinessAudience", audienceType: page.audience },
          offers: {
            "@type": "Offer",
            priceCurrency: "AUD",
            description: "Pay per lead. No platform fee, no minimum spend, no lock-in contract. Priced by area and volume.",
            availability: "https://schema.org/InStock",
            url: `${url}#register`,
          },
        }}
      />

      <div className="bg-surface border-b border-line">
        <div className={s.container}>
          <Breadcrumbs items={[{ label: "Real Estate Leads", href: "/real-estate-leads" }, { label: page.name }]} />
        </div>
      </div>

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.container}>
          <div className={s.heroGrid}>
            <div>
              <div className={`${s.eyebrow} rise`}>
                Real estate leads · Lead type {page.n} of {String(leadTypePages.length).padStart(2, "0")}
              </div>
              <h1 className={`${s.heroTitle} rise rise-d1`}>
                {page.h1} <em>{page.h1Em}</em>
              </h1>
              <p className={`${s.lede} ${s.heroLede} rise rise-d2`}>{page.lede}</p>
              <div className={`${s.heroCtas} rise rise-d3`}>
                <a href="#register" className={CTA_CLASS}>
                  Register for {page.shortName}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </a>
                <Link href="/real-estate-leads" className={s.ghostLink}>
                  All lead types and terms <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className={`${s.heroFoot} rise rise-d4`}>
                <span>Opt-in only</span>
                <span>100% exclusive</span>
                <span>Matched to you</span>
                <span>7-day replacement</span>
              </div>
            </div>
            <Docket title={page.docketTitle} rows={page.docket} consents={page.docketConsents} recipient={page.recipient} />
          </div>

          <div className={s.rail}>
            {page.stats.map((st) => (
              <div key={st.label} className={s.railItem}>
                <div className={s.railValue}>{st.value}</div>
                <div className={s.railLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where they come from */}
      <section className={s.section}>
        <div className={s.container}>
          <div data-reveal>
            <Chapter num={next()} title={`Where ${page.shortName} come from.`} kicker="The pages that produce them, and why that matters on the call" />
          </div>
          <div className={s.contentsGrid}>
            <div className={s.prose} style={{ maxWidth: "54ch" }} data-reveal>
              <p>{page.sourcesIntro}</p>
              <p>
                Every one of these pages is written the same way: real numbers,
                named sources, the trade-off said out loud. Someone who arrives
                from one of them has already been treated like an adult, and
                expects the agent on the phone to do the same.
              </p>
            </div>
            <ul className={s.vetList} style={{ marginTop: 0 }} data-reveal-group>
              {page.sources.map((src, i) => (
                <li key={src.href}>
                  <span className={s.vetNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <Link href={src.href} className={s.sourceLink}>{src.label}</Link>
                    <span className={s.sourceWhy}>{src.why}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What arrives */}
      <section className={`${s.section} ${s.sectionPaper}`} id="lead-contents">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num={next()} title={`What ${/^[aeiou]/i.test(page.docketTitle) ? "an" : "a"} ${page.docketTitle.toLowerCase()} contains.`} kicker="Enough to prepare the call, not just make it" />
          </div>
          <div className={s.contentsGrid}>
            <ul className={s.checkList} style={{ marginTop: 0 }} data-reveal-group>
              {page.contents.map((c) => (
                <li key={c}><i>✓</i>{c}</li>
              ))}
            </ul>
            <div className={s.prose} style={{ maxWidth: "54ch" }} data-reveal>
              <p>
                It arrives by email as a single record, contact details at the
                top and the form they used in its own line, so you know
                how they came to us before you dial. At the point they gave
                their details, the form told them in plain words that a local
                agent or specialist would contact them.
              </p>
              <p>
                <strong>They are expecting you.</strong> See the full breakdown
                of what every lead includes on the{" "}
                <Link href="/real-estate-leads#lead-contents" className={s.inlineLink}>
                  main real estate leads page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is on the other end */}
      <section className={s.section}>
        <div className={s.container}>
          <div data-reveal>
            <Chapter num={next()} title="Who is on the other end of the line." kicker={page.profilesIntro} />
          </div>
          <div className={s.indexGrid} data-reveal-group>
            {page.profiles.map((p, i) => (
              <article key={p.title} className={s.indexCard}>
                <div className={s.indexNum}>{String(i + 1).padStart(2, "0")}</div>
                <h3 className={s.indexTitle}>{p.title}</h3>
                <p className={s.indexText} style={{ marginBottom: 0 }}>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Page-specific long-form chapter */}
      {page.chapter && (
        <section className={`${s.section} ${s.sectionPaper}`}>
          <div className={s.container}>
            <div data-reveal>
              <Chapter num={next()} title={page.chapter.title} kicker={page.chapter.kicker} />
            </div>
            <div className={s.prose} style={{ maxWidth: "68ch" }} data-reveal>
              {page.chapter.paragraphs.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
            {page.chapter.table && (
              <div className={s.dataTableWrap} data-reveal>
                <table className={s.dataTable}>
                  <thead>
                    <tr>{page.chapter.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {page.chapter.table.rows.map((r) => (
                      <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>
                    ))}
                  </tbody>
                </table>
                {page.chapter.table.caption && <p className={s.fine} style={{ marginTop: 12 }}>{page.chapter.table.caption}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How to work them */}
      <section className={`${s.section} ${page.chapter ? "" : s.sectionPaper}`}>
        <div className={s.container}>
          <div className={s.vetGrid}>
            <div data-reveal>
              <Chapter num={next()} title={`How to work ${page.shortName}.`} kicker="What converts them" />
              <div className={s.prose} style={{ maxWidth: "48ch" }}>
                <p>
                  None of this is proprietary. It is what the people who convert
                  these enquiries actually do, written down so a new partner can
                  do it from the first lead.
                </p>
              </div>
            </div>
            <ul className={`${s.darkList} ${s.lightList}`} data-reveal-group>
              {page.working.map((w, i) => (
                <li key={w.head}>
                  <span className={s.darkNo}>{i + 1}.</span>
                  <div>
                    <h3 className={s.darkHead}>{w.head}</h3>
                    <p className={s.darkText}>{w.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className={`${s.section} ${page.chapter ? s.sectionPaper : ""}`} id="pricing">
        <div className={s.container}>
          <div data-reveal>
            <Chapter num={next()} title="Pay per lead. Nothing else." kicker="Same terms as every lead type on the site" />
          </div>
          <Clauses />
          <p className={s.fine} style={{ marginTop: 20 }}>
            The vetting standard, the cost-per-listing maths and the things we
            will not promise you are on the{" "}
            <Link href="/real-estate-leads#pricing">main real estate leads page</Link>.
          </p>
        </div>
      </section>

      {/* Register */}
      <section className={`${s.section} ${page.chapter ? "" : s.sectionPaper}`}>
        <div className={s.container}>
          <div data-reveal>
            <Chapter num={next()} title={`Start receiving ${page.shortName}.`} kicker="One business day to a written quote" />
          </div>
          <div className={s.registerGrid}>
            <div>
              <AgentEnquiryForm defaultLeadTypes={[page.formValue]} />
            </div>
            <aside className={s.aside}>
              <WhatHappensNext />
              <div className={s.next}>
                <h3 className={s.nextTitle}>Other lead types</h3>
                <ul className={s.checkList} style={{ marginTop: 0 }}>
                  {siblings.map((sib) => (
                    <li key={sib.slug} className={s.checkListCompact}>
                      <i>{sib.n}</i>
                      <Link href={`/real-estate-leads/${sib.slug}`} className={s.sourceLink}>
                        {sib.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <FinePrint />
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ. Mirrors the FAQPageJsonLd above. */}
      <section className={s.section}>
        <div className={s.container} style={{ maxWidth: 860 }}>
          <div data-reveal>
            <Chapter num={next()} title={`${page.name}: questions ${page.askers} ask.`} kicker="Straight answers on what these leads contain, exclusivity, pricing and who can register" />
          </div>
          <FaqAccordion items={page.faqs} />
        </div>
      </section>

      {/* Closing */}
      <section className={s.close}>
        <div className={s.container} style={{ position: "relative" }}>
          <div className={`${s.eyebrow} ${s.eyebrowOnDark}`} style={{ justifyContent: "center", marginBottom: 26 }}>
            Exclusive · Pay per lead · No lock-in
          </div>
          <h2 className={s.closeTitle}>
            {page.name}, delivered to <em>one</em> {page.recipient}.
          </h2>
          <p className={s.closeText}>
            Tell us your suburbs. Within one business day you will have
            availability and a written per-lead price, and you commit to
            nothing until you say so.
          </p>
          <div className={s.closeCtas}>
            <a href="#register" className={CTA_CLASS}>
              Register for {page.shortName}
            </a>
            <Link href="/real-estate-leads" className={s.closeLink}>
              All real estate lead types <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
