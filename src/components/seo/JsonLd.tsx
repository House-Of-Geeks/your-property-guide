import type { Property, Agent, Agency, BlogPost, Suburb } from "@/types";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <>
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/og-image.jpg`,
          description:
            "Find your next property in the Moreton Bay region. Browse houses, units, and land for sale and rent.",
          areaServed: {
            "@type": "Place",
            name: "Moreton Bay Region, Queensland, Australia",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "hello@yourpropertyguide.com.au",
            areaServed: "AU",
            availableLanguage: "English",
          },
          sameAs: [
            "https://www.facebook.com/yourpropertyguide",
            "https://www.instagram.com/yourpropertyguide",
          ],
        }}
      />
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/buy?suburb={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
    </>
  );
}

export function PropertyJsonLd({ property }: { property: Property }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: property.title,
        description: property.description,
        url: `${SITE_URL}/${property.listingType === "rent" ? "rent" : "buy"}/${property.slug}`,
        datePosted: property.dateAdded,
        image: property.images.map((img) => `${SITE_URL}${img.url}`),
        address: {
          "@type": "PostalAddress",
          streetAddress: property.address.street,
          addressLocality: property.address.suburb,
          addressRegion: property.address.state,
          postalCode: property.address.postcode,
          addressCountry: "AU",
        },
        ...(property.price.value && {
          offers: {
            "@type": "Offer",
            price: property.price.value,
            priceCurrency: "AUD",
          },
        }),
      }}
    />
  );
}

export function AgentJsonLd({ agent }: { agent: Agent }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: agent.fullName,
        url: `${SITE_URL}/agents/${agent.slug}`,
        image: `${SITE_URL}${agent.image}`,
        telephone: agent.phone,
        email: agent.email,
        description: agent.bio,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: agent.averageRating,
          reviewCount: agent.reviewCount,
        },
      }}
    />
  );
}

export function AgencyJsonLd({ agency }: { agency: Agency }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: agency.name,
        url: `${SITE_URL}/agencies/${agency.slug}`,
        image: `${SITE_URL}${agency.logo}`,
        telephone: agency.phone,
        email: agency.email,
        description: agency.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: agency.address.street,
          addressLocality: agency.address.suburb,
          addressRegion: agency.address.state,
          postalCode: agency.address.postcode,
          addressCountry: "AU",
        },
      }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: BlogPost }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: `${SITE_URL}${post.coverImage}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          ...items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: item.name,
            item: `${SITE_URL}${item.url}`,
          })),
        ],
      }}
    />
  );
}

export function FAQPageJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}
