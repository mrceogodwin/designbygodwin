import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Godwin Oriabure — Web Developer & Digital Builder",
  description:
    "The portfolio of Godwin Oriabure, a self-taught web developer building thoughtful digital products and web experiences.",
  applicationName: "Godwin Oriabure Portfolio",
  openGraph: {
    title: "Godwin Oriabure — Web Developer & Digital Builder",
    description:
      "Thoughtful interfaces. Useful products. Built with curiosity and intent.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#10100f",
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
