import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CursorGlow } from "@/components/CursorGlow";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Route 9 Web — Websites for Businesses on Route 9",
  description:
    "Custom websites and ongoing maintenance for independent businesses along Route 9 in central Massachusetts. Serving Shrewsbury, Westborough, Northborough, Worcester, and Framingham.",
  keywords: [
    "web design Shrewsbury MA",
    "website design Route 9",
    "local web design central Massachusetts",
    "small business website",
    "Shrewsbury web developer",
  ],
  authors: [{ name: "Route 9 Web" }],
  creator: "Route 9 Web",
  metadataBase: new URL("https://route9web.com"),
  openGraph: {
    title: "Route 9 Web — Websites for Businesses on Route 9",
    description:
      "Custom websites and maintenance for independent shops along Route 9. Mobile-first, fast, and local.",
    url: "https://route9web.com",
    siteName: "Route 9 Web",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Route 9 Web — Websites for Businesses on Route 9",
    description: "Custom websites and maintenance for independent shops along Route 9.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Route 9 Web",
  description:
    "Custom websites and ongoing maintenance for independent businesses along Route 9 in central Massachusetts.",
  url: "https://route9web.com",
  email: "hello@route9web.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Shrewsbury",
    addressRegion: "MA",
    addressCountry: "US",
  },
  areaServed: [
    "Shrewsbury, MA",
    "Westborough, MA",
    "Northborough, MA",
    "Worcester, MA",
    "Framingham, MA",
  ],
  serviceType: "Web Design and Development",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg grain">
        <CursorGlow />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
