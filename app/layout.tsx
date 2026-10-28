import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./brand-overrides.css";

const siteUrl = "https://designbygodwin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Godwin Oriabure — Web Developer & Digital Builder",
  description:
    "Godwin Oriabure builds digital experiences, web applications, and product interfaces. Explore selected software projects and get in touch.",
  applicationName: "Godwin Oriabure Portfolio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Godwin Oriabure — Web Developer & Digital Builder",
    description:
      "Software projects, product interfaces, and digital experiences built with intent.",
    url: siteUrl,
    siteName: "Godwin Oriabure",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Godwin Oriabure — Web Developer & Digital Builder",
    description:
      "Software projects, product interfaces, and digital experiences built with intent.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0759c7",
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
