import type { Metadata } from "next";
import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { DEFAULT_OG_IMAGES } from "@/lib/og/defaults";
import { Providers } from "@/components/analytics/Providers";

// Two faces (v6, 15 Oct 2026): Schibsted Grotesk for body text, labels and
// h3 down, and Source Serif 4 for h1, h2, the wordmark and big figures
// (--font-display points at it in globals.css). The serif's italic is its
// own font, not preloaded, so only pages that set serif italic (an accent
// phrase, a pull quote, a signature) download it; globals.css points serif
// italic text at it. No optical-size axis: it more than doubled the files
// and cost mobile LCP (Lighthouse, 16 Oct 2026).
const brandFont = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
});

const displayItalic = Source_Serif_4({
  variable: "--font-serif-italic",
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
  preload: false,
});


export const metadata: Metadata = {
  title: {
    // Default title for any page that doesn't set its own. Aligned
    // with the education-led positioning (2026-05 reposition).
    default: `${SITE_NAME}: free guides to selling and buying property in Australia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AU",
    url: SITE_URL,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourpropertyguide",
  },
  verification: {
    other: {
      "msvalidate.01": "91FC5FBF642A9F3DDC20E517CFAE11E9",
    },
  },
  alternates: {
    // hreflang signals regional targeting. We publish for Australian
    // English readers and the x-default fallback points back to the AU site
    // so any non-AU traffic still resolves to the canonical edition.
    languages: {
      "en-AU": SITE_URL,
      "x-default": SITE_URL,
    },
    types: {
      "application/rss+xml": [
        { url: `${SITE_URL}/guides/feed.xml`, title: `${SITE_NAME} guides RSS` },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${brandFont.variable} ${displayFont.variable} ${displayItalic.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to high-priority third-party origins. dns-prefetch is a
            cheaper fallback for older browsers / bots that don't support
            preconnect. Order matters, preconnect is tried first. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Vercel image CDN, used for property listing images. */}
        <link rel="dns-prefetch" href="https://vbsxnixtsgnnyozjrsp1.public.blob.vercel-storage.com" />

        {/* Image hosts referenced in blog cover photos. */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Analytics, async loaded after paint, but DNS warmup helps. */}
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://secure.quantserve.com" />

        {/* Theme colour for the address bar on mobile browsers: the cream page. */}
        <meta name="theme-color" content="#fbf8f3" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Pre-paint motion gate: reveal styles only apply under
            html[data-motion], so no-JS, bots and reduced-motion users
            always see a fully visible page. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-motion','')}catch(e){}",
          }}
        />
        <Providers>{children}</Providers>
      </body>
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w5r5pytsib");`,
        }}
      />
      <Script
        id="quantcast"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window._qevents=window._qevents||[];(function(){var e=document.createElement('script');e.src=(document.location.protocol=='https:'?'https://secure':'http://edge')+'.quantserve.com/quant.js';e.async=true;e.type='text/javascript';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(e,s);})();window._qevents.push({qacct:"p-0nXpAVdp8GeS5"});`,
        }}
      />
    </html>
  );
}
