import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export const metadata: Metadata = {
  title: "Full Gospel Churches of Kenya | Kabarnet",
  description:
    "Full Gospel Churches of Kenya, Kabarnet — under the leadership of Bishop Cheptarus. Join us for worship, fellowship, and the transforming power of the Gospel.",
  keywords: [
    "FGCK Kabarnet",
    "Full Gospel Churches of Kenya",
    "Bishop Cheptarus",
    "church Kabarnet",
    "Baringo church",
  ],
  openGraph: {
    title: "Full Gospel Churches of Kenya | Kabarnet",
    description:
      "Join us for worship, fellowship, and the transforming power of the Gospel — under the leadership of Bishop Cheptarus.",
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-royal-900 font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AnnouncementBanner />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
