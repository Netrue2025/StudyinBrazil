import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ApplicationProvider } from "@/components/start-application";

export const metadata: Metadata = {
  title: {
    default: "StudyinBrazil | Brazilian Universities and Postgraduate Programs",
    template: "%s | StudyinBrazil"
  },
  description:
    "Search Brazilian universities, MSc, PhD, professional master's, postgraduate programs, and open applications.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
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
