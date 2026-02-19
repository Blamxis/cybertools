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
  metadataBase: new URL("https://cybertools.vercel.app"),

  title: {
    default: "CyberTools Suite — Passive Cybersecurity Tools",
    template: "%s | CyberTools Suite",
  },

  description:
    "A modern, client-side suite of passive cybersecurity tools including CyberScan, hashing, encoding, IP validation, and password generation.",

  keywords: [
    "cybersecurity",
    "security tools",
    "passive analysis",
    "cyber scan",
    "url scanner",
    "hash generator",
    "base64 encoder",
    "password generator",
    "ip validator",
    "developer tools",
    "web security",
    "security utilities",
  ],

  authors: [{ name: "Maxime Gavinet" }],
  creator: "Maxime Gavinet",
  publisher: "CyberTools Suite",

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },

  openGraph: {
    title: "CyberTools Suite",
    description:
      "A modern suite of passive cybersecurity tools with a refined UI and full client-side execution.",
    url: "https://cybertools.vercel.app",
    siteName: "CyberTools Suite",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CyberTools Suite Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CyberTools Suite",
    description:
      "A modern suite of passive cybersecurity tools with a refined UI.",
    images: ["/og-image.png"],
    creator: "@cybertools",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-neutral-950
          text-neutral-200
        `}
      >
        {children}
      </body>
    </html>
  );
}
