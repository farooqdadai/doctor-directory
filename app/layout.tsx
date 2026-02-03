import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import NavigationLoader from "@/components/ui/NavigationLoader";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://doctordirectory.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09637E",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Doctor Directory - Find the Right Doctor for Your Health Needs",
    template: "%s | Doctor Directory",
  },
  description:
    "Search our directory of healthcare professionals by specialty and location. Find verified doctors, view profiles, and connect with the right healthcare provider for your needs.",
  keywords: [
    "doctor directory",
    "find a doctor",
    "healthcare",
    "medical professionals",
    "physicians",
    "specialists",
    "hospital directory",
    "find a hospital",
    "healthcare providers",
    "medical directory",
  ],
  authors: [{ name: "Doctor Directory" }],
  creator: "Doctor Directory",
  publisher: "Doctor Directory",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Doctor Directory",
    title: "Doctor Directory - Find the Right Doctor for Your Health Needs",
    description:
      "Search our directory of healthcare professionals by specialty and location. Find verified doctors and hospitals across the United States.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Doctor Directory - Find Healthcare Providers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doctor Directory - Find the Right Doctor",
    description:
      "Search our directory of healthcare professionals by specialty and location.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your verification codes here when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
