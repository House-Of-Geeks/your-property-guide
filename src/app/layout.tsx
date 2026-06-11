import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { Providers } from "@/components/analytics/Providers";

// Display / heading font, Fraunces, the YFG editorial serif. Light weights only,
// matching the YFG hero treatment (weight 400 + light italic 300).
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// UI / body font, Manrope, paired with Fraunces on YFG. Clean modern sans.
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    // Default title for any page that doesn't set its own. Aligned
    // with the education-led positioning (2026-05 reposition).
    default: `${SITE_NAME}: Plain-English Australian property`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AU",
    url: SITE_URL,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${SITE_NAME}: Plain-English Australian property` }],
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
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
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

        {/* Theme colour for the address bar on mobile browsers, matches our
            warm-cream surface (oklch 0.975 0.012 80 ≈ #f9f6f1). */}
        <meta name="theme-color" content="#f9f6f1" />
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
