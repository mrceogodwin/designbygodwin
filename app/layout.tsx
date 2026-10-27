import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./brand-overrides.css";

const siteUrl = "https://designbygodwin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Godwin Oriabure — Web Developer & Digital Builder",
  description:
    "The portfolio of Godwin Oriabure, a self-taught web developer building thoughtful digital products and web experiences.",
  applicationName: "Godwin Oriabure Portfolio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Godwin Oriabure — Web Developer & Digital Builder",
    description:
      "Thoughtful interfaces. Useful products. Built with curiosity and intent.",
    url: siteUrl,
    siteName: "Godwin Oriabure",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Godwin Oriabure — Web Developer & Digital Builder",
    description:
      "Thoughtful interfaces. Useful products. Built with curiosity and intent.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f5f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
