import type { Property, Agent, Agency, BlogPost, Suburb } from "@/types";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION_LONG, SITE_KNOWS_ABOUT } from "@/lib/constants";
import { resolveBlogCoverPath } from "@/lib/utils/blog-cover";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Generic JSON-LD renderer for one-off schema types that don't yet have
// a dedicated wrapper. Prefer the typed wrappers below when one fits.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <JsonLdScript data={data} />;
}

export function OrganizationJsonLd() {
  return (
    <>
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          // Combined types: NewsMediaOrganization (signals we publish original
          // editorial) + Organization. AI search engines (Bing Copilot,
          // Perplexity, ChatGPT search) bias toward citing organisations they
          // can classify as authoritative publishers rather than commerce
          // sites. `knowsAbout` enumerates the property topics we cover so
          // retrieval-grade systems can match queries to our expertise.
          "@type": ["Organization", "NewsMediaOrganization"],
          "@id": `${SITE_URL}#organization`,
          name: SITE_NAME,
          alternateName: "YPG",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.jpg`,
            width: 1200,
            height: 630,
          },
          image: `${SITE_URL}/og-image.jpg`,
          description: SITE_DESCRIPTION_LONG,
          knowsAbout: SITE_KNOWS_ABOUT,
          knowsLanguage: ["en-AU", "en"],
          areaServed: {
            "@type": "Country",
            name: "Australia",
          },
          // Founder Person entity for E-E-A-T. Google's quality raters and
          // AI search engines weight named-author publishers higher than
          // anonymous ones; explicitly linking the org to a real person via
          // founder + employee strengthens the editorial-publisher signal.
          founder: {
            "@type": "Person",
            "@id": `${SITE_URL}/about#andy-mcmaster`,
            name: "Andy McMaster",
            jobTitle: "Editor",
            worksFor: { "@id": `${SITE_URL}#organization` },
            url: `${SITE_URL}/about`,
            sameAs: [
              "https://www.linkedin.com/in/andymcmaster",
            ],
          },
          employee: [
            {
              "@type": "Person",
              "@id": `${SITE_URL}/about#andy-mcmaster`,
              name: "Andy McMaster",
              jobTitle: "Editor",
            },
          ],
          // Editorial policy signals. These are the trust hooks Google's
          // Helpful Content System and AI rankers look for. Each links to a
          // live page on the site (about / methodology / privacy).
          publishingPrinciples: `${SITE_URL}/about`,
          ethicsPolicy: `${SITE_URL}/about`,
          actionableFeedbackPolicy: `${SITE_URL}/contact`,
          masthead: `${SITE_URL}/about`,
          diversityPolicy: `${SITE_URL}/about`,
          ownershipFundingInfo: `${SITE_URL}/about`,
          missionCoveragePrioritiesPolicy: `${SITE_URL}/about`,
          foundingDate: "2024",
          foundingLocation: {
            "@type": "Place",
            name: "Brisbane, Australia",
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
          "@id": `${SITE_URL}#website`,
          name: SITE_NAME,
          alternateName: "YPG",
          url: SITE_URL,
          description: SITE_DESCRIPTION_LONG,
          inLanguage: "en-AU",
          publisher: { "@id": `${SITE_URL}#organization` },
          // Internal site search is suburb-led on YPG, not listing-led —
          // points retrieval engines at the suburb directory rather than a
          // listings search box.
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/suburbs?q={search_term_string}`,
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
            // If we have the slug, reference the canonical agency entity by @id
            // so Google can join the agent to the existing agency record.
            ...(agent.agencySlug
              ? { "@id": `${SITE_URL}/real-estate-agencies/${agent.agencySlug}` }
              : {}),
            name: agent.agencyName,
            ...(agent.agencySlug && {
              url: `${SITE_URL}/real-estate-agencies/${agent.agencySlug}`,
            }),
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
    return {
      "@type": "Place" as const,
      name: nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" "),
    };
  });

  const logoUrl = agency.logo.startsWith("http") ? agency.logo : `${SITE_URL}${agency.logo}`;
  const heroUrl = agency.heroBg
    ? agency.heroBg.startsWith("http") ? agency.heroBg : `${SITE_URL}${agency.heroBg}`
    : logoUrl;

  // Build sameAs from social URLs, filtering out empty values
  const sameAs = [
    agency.website,
    agency.facebookUrl,
    agency.linkedinUrl,
    agency.instagramUrl,
    agency.youtubeUrl,
  ].filter((u): u is string => Boolean(u));

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "@id": `${SITE_URL}/real-estate-agencies/${agency.slug}`,
        name: agency.name,
        url: `${SITE_URL}/real-estate-agencies/${agency.slug}`,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        image: heroUrl,
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
        ...(areaServed.length > 0 && { areaServed }),
        ...(sameAs.length > 0 && { sameAs }),
      }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: BlogPost }) {
  const realCover = resolveBlogCoverPath(post.coverImage);
  const image = realCover
    ? `${SITE_URL}${realCover}`
    : `${SITE_URL}/api/og/guide/${post.slug}?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(post.excerpt)}&persona=${encodeURIComponent(post.category)}`;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
          url: `${SITE_URL}/about`,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.jpg`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/guides/${post.slug}`,
        },
        // Voice-search hook. Same speakable pattern as GuideArticle so AI
        // assistants pick the canonical spoken summary for news articles
        // too.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable-summary]"],
        },
        inLanguage: "en-AU",
        isAccessibleForFree: true,
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
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  latitude,
  longitude,
}: {
  name: string;
  description?: string;
  url: string;
  streetAddress?: string;
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
        // Combined Place + AdministrativeArea types so AI search engines
        // can classify the entity as a real suburb-level administrative
        // boundary rather than a generic Place node. Maps better to query
        // intent for "what is X suburb like" or "is X a good suburb".
        "@type": ["Place", "AdministrativeArea"],
        name,
        ...(description && { description }),
        url: `${SITE_URL}${url}`,
        address: {
          "@type": "PostalAddress",
          ...(streetAddress && { streetAddress }),
          ...(addressLocality && { addressLocality }),
          ...(addressRegion && { addressRegion }),
          ...(postalCode && { postalCode }),
          addressCountry: "AU",
        },
        ...(addressRegion && {
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: addressRegion,
            containedInPlace: {
              "@type": "Country",
              name: "Australia",
            },
          },
        }),
        ...(latitude && longitude && {
          geo: {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          },
        }),
        // Voice-search hook. The suburb FAQ block on the page is marked
        // data-speakable-summary; assistants can pick the most-asked
        // questions for spoken answers.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable-summary]"],
        },
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
  author,
  reviewedBy,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: { name: string; role?: string };
  reviewedBy?: { name: string; role?: string };
}) {
  // Use a Person entity when an author name is provided so Google can attribute
  // the article correctly for E-E-A-T. Fall back to the org for older callers.
  const authorEntity = author
    ? {
        "@type": "Person" as const,
        name: author.name,
        ...(author.role && { jobTitle: author.role }),
        url: `${SITE_URL}/about`,
      }
    : {
        "@type": "Organization" as const,
        name: SITE_NAME,
        url: SITE_URL,
      };

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
        author: authorEntity,
        ...(reviewedBy && {
          reviewedBy: {
            "@type": "Person",
            name: reviewedBy.name,
            ...(reviewedBy.role && { jobTitle: reviewedBy.role }),
            url: `${SITE_URL}/about`,
          },
        }),
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.jpg`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}${url}`,
        },
        // Speakable schema points AI voice assistants (Google Assistant,
        // Alexa, Siri Reading Mode) at the H1 + standfirst as the canonical
        // spoken summary of the article. The conventional shape uses CSS
        // selectors matching the guide layout's hero block.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable-summary]"],
        },
        inLanguage: "en-AU",
        isAccessibleForFree: true,
      }}
    />
  );
}

// Person schema for an editor or contributor profile. Emitted on /about so
// the @id pointed at by Organization.founder + Article.author resolves to a
// concrete entity Google can attribute. Boosts E-E-A-T because it links
// every author byline back to a real Person record with a job title and
// known affiliation.
export function PersonJsonLd({
  id,
  name,
  jobTitle,
  bio,
  image,
  sameAs,
}: {
  id: string;                 // fragment used in @id, e.g. "andy-mcmaster"
  name: string;
  jobTitle?: string;
  bio?: string;
  image?: string;             // absolute or site-relative
  sameAs?: string[];
}) {
  const imageUrl = image && (image.startsWith("http") ? image : `${SITE_URL}${image}`);
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/about#${id}`,
        name,
        ...(jobTitle && { jobTitle }),
        ...(bio && { description: bio }),
        ...(imageUrl && { image: imageUrl }),
        url: `${SITE_URL}/about#${id}`,
        worksFor: { "@id": `${SITE_URL}#organization` },
        ...(sameAs && sameAs.length > 0 && { sameAs }),
      }}
    />
  );
}

// DefinedTerm schema, one per glossary entry. Helps Google surface a
// definition rich-result for "what is X" queries.
export function DefinedTermJsonLd({
  term,
  description,
  url,
  inDefinedTermSet,
}: {
  term: string;
  description: string;
  url: string;
  inDefinedTermSet?: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: term,
        description,
        url: `${SITE_URL}${url}`,
        inDefinedTermSet: inDefinedTermSet ?? `${SITE_URL}/glossary`,
      }}
    />
  );
}

// HowTo schema for procedural guides. Pass an array of step labels and
// optional descriptions to surface step rich-results in Google.
export function HowToJsonLd({
  name,
  description,
  url,
  steps,
  totalTime,
  estimatedCost,
}: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text?: string; url?: string }[];
  totalTime?: string; // ISO-8601 duration, e.g. "PT30M" or "P3M"
  estimatedCost?: { currency: string; value: string };
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name,
        description,
        url: `${SITE_URL}${url}`,
        ...(totalTime && { totalTime }),
        ...(estimatedCost && {
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: estimatedCost.currency,
            value: estimatedCost.value,
          },
        }),
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          ...(s.text && { text: s.text }),
          ...(s.url && { url: `${SITE_URL}${s.url}` }),
        })),
      }}
    />
  );
}
