import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({ src: "../public/font/GmarketSansLight.otf" });

const gmarketBold = localFont({
  src: "../public/font/GmarketSansBold.otf",
  display: "swap",
  variable: "--font-gmarket-bold",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Limboard",
  description: "management your project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body
        className={`${sans.className} ${gmarketBold.variable} ${geistSans.variable} ${geistMono.variable} h-screen antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
