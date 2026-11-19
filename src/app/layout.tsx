import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Zen Steps – Foot Reflexology & Franchise From ₹2.5 Lakh",
  description:
    "Premium foot reflexology by trained therapists with visual impairments, in Chennai. Book a session from ₹450, or open your own Zen Steps franchise from ₹2.5 lakh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="bg-paper text-ink font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#02241d",
              color: "#fafaf7",
              fontSize: "14px",
              borderRadius: "2px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
