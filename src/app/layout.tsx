import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { Providers } from "@/components/analytics/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Property Search, Made Simple`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AU",
    url: SITE_URL,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${SITE_NAME} - Property Search, Made Simple` }],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
