import { FAQPageJsonLd } from "@/components/seo";
import type { Suburb } from "@/types";
import { buildSuburbFaqs } from "@/lib/suburb-faq";

interface SuburbFAQProps {
  suburb: Suburb;
}

/**
 * Long-tail SEO block for suburb pages. The questions come from
 * buildSuburbFaqs (src/lib/suburb-faq.ts), which only includes a question
 * when the answer is known. Emits FAQPage JSON-LD so Google can surface
 * answers directly in SERP (and answer voice queries).
 */
export function SuburbFAQ({ suburb }: SuburbFAQProps) {
  const faqs = buildSuburbFaqs(suburb);
  const sn = suburb.name;

  if (faqs.length === 0) return null;

  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <section id="faq" className="scroll-mt-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <p className="font-display italic text-primary text-base mb-3 leading-none">
              Frequently asked
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight font-medium">
              About <span className="italic font-light text-primary">{sn}</span>.
            </h2>
          </div>
          <div className="lg:col-span-8">
            {/* Mark each Q+A as data-speakable-summary so voice search
                assistants pick up the suburb's most-asked questions as
                spoken answers. Pairs with the FAQPage JSON-LD above. */}
            <dl className="divide-y divide-line border-y border-line" data-speakable-summary>
              {faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <dt className="font-display text-lg text-ink leading-snug mb-2">{faq.question}</dt>
                  <dd className="font-sans text-base text-ink-muted leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
