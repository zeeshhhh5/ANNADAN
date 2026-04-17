import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnnaDaan - Food Waste Redistribution Platform",
  description: "Connect food donors, NGOs, waste collectors, farmers, and beneficiaries to reduce food waste and feed the hungry",
  keywords: ["food waste", "redistribution", "NGO", "carbon credits", "sustainability"],
  authors: [{ name: "AnnaDaan" }],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
