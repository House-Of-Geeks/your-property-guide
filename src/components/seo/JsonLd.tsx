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
            "Australia's property search, made simple. Browse houses, units, and land for sale and rent across thousands of suburbs nationwide.",
          areaServed: {
            "@type": "Country",
            name: "Australia",
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
  const imageUrl = agent.image.startsWith("http") ? agent.image : `${SITE_URL}${agent.image}`;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": ["Person", "RealEstateAgent"],
        name: agent.fullName,
        givenName: agent.firstName,
        familyName: agent.lastName,
        jobTitle: agent.title,
        url: `${SITE_URL}/agents/${agent.slug}`,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          contentUrl: imageUrl,
          name: agent.imageAlt ?? `${agent.fullName} - ${agent.title}`,
        },
        telephone: agent.phone,
        email: agent.email,
        description: agent.bio,
        ...(agent.agencyName && {
          worksFor: {
            "@type": "RealEstateAgent",
            name: agent.agencyName,
            url: agent.agencySlug ? `${SITE_URL}/real-estate-agencies/${agent.agencySlug}` : undefined,
          },
        }),
        ...(agent.reviewCount > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: agent.averageRating,
            reviewCount: agent.reviewCount,
          },
        }),
      }}
    />
  );
}

export function AgencyJsonLd({ agency }: { agency: Agency }) {
  // Convert slugs like "north-lakes-qld-4509" → "North Lakes"
  const areaServed = agency.suburbs.map((slug) => {
    const parts = slug.split("-");
    const nameParts = parts.slice(0, -2);
    return nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  });

  const logoUrl = agency.logo.startsWith("http") ? agency.logo : `${SITE_URL}${agency.logo}`;
  const heroUrl = agency.heroBg
    ? agency.heroBg.startsWith("http") ? agency.heroBg : `${SITE_URL}${agency.heroBg}`
    : logoUrl;

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: agency.name,
        url: `${SITE_URL}/real-estate-agencies/${agency.slug}`,
        logo: logoUrl,
        image: heroUrl,
        telephone: agency.phone,
        email: agency.email,
        description: agency.description,
        address: `${agency.address.street}, ${agency.address.suburb} ${agency.address.state} ${agency.address.postcode}`,
        ...(areaServed.length > 0 && { areaServed }),
        ...(agency.website && { sameAs: [agency.website, agency.facebookUrl, agency.linkedinUrl, agency.instagramUrl, agency.youtubeUrl].filter(Boolean) }),
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

export function PlaceJsonLd({
  name,
  description,
  url,
  addressLocality,
  addressRegion,
  postalCode,
  latitude,
  longitude,
}: {
  name: string;
  description?: string;
  url: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Place",
        name,
        ...(description && { description }),
        url: `${SITE_URL}${url}`,
        address: {
          "@type": "PostalAddress",
          ...(addressLocality && { addressLocality }),
          ...(addressRegion && { addressRegion }),
          ...(postalCode && { postalCode }),
          addressCountry: "AU",
        },
        ...(latitude && longitude && {
          geo: {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          },
        }),
      }}
    />
  );
}

export function EducationalOrganizationJsonLd({
  name,
  description,
  url,
  address,
  educationalLevel,
  telephone,
  website,
}: {
  name: string;
  description?: string;
  url: string;
  address: { street?: string; suburb: string; state: string; postcode: string };
  educationalLevel?: string;
  telephone?: string;
  website?: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name,
        ...(description && { description }),
        url: `${SITE_URL}${url}`,
        address: {
          "@type": "PostalAddress",
          ...(address.street && { streetAddress: address.street }),
          addressLocality: address.suburb,
          addressRegion: address.state,
          postalCode: address.postcode,
          addressCountry: "AU",
        },
        ...(educationalLevel && { educationalLevel }),
        ...(telephone && { telephone }),
        ...(website && { sameAs: [website] }),
      }}
    />
  );
}

export function WebApplicationJsonLd({
  name,
  description,
  url,
  applicationCategory,
}: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url: `${SITE_URL}${url}`,
        applicationCategory: applicationCategory ?? "FinanceApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "AUD",
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

export function ItemListJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description?: string;
  url: string;
  items: { name: string; url: string; description?: string }[];
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        ...(description && { description }),
        url: `${SITE_URL}${url}`,
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
          ...(item.description && { description: item.description }),
        })),
      }}
    />
  );
}

export function CollectionPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        ...(description && { description }),
        url: `${SITE_URL}${url}`,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      }}
    />
  );
}

export function GuideArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${SITE_URL}${url}`,
        datePublished,
        dateModified: dateModified ?? datePublished,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
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
