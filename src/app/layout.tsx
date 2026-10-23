import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdNova — AI-Powered Ad Copy Variation Generator",
  description: "Turn ideas into ad-ready copy. Generate compliant, framework-aligned ad copy variations for Google Ads and Meta Ads using AIDA and PAS frameworks.",
};

import { CampaignProvider } from "@/context/CampaignContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <CampaignProvider>{children}</CampaignProvider>
      </body>
    </html>
  );
}
