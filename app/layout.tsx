import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import NavigationLoader from "@/components/ui/NavigationLoader";

export const metadata: Metadata = {
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
