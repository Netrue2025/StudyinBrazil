import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ApplicationProvider } from "@/components/start-application";

const siteTitle = "StudyinBrazil | Brazilian Universities and Postgraduate Programs";
const siteDescription =
  "Search Brazilian universities, MSc, PhD, professional master's, postgraduate programs, and open applications.";
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | StudyinBrazil"
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "StudyinBrazil",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "StudyinBrazil preview card"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApplicationProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ApplicationProvider>
      </body>
    </html>
  );
}
