import type { Metadata } from "next";
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Fraunces — variable display serif with optical sizing. Warm, tactile, editorial.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// DM Sans — refined geometric humanist sans. Pairs well with Fraunces.
const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// JetBrains Mono — editorial metadata (labels, section numbers, fine-print).
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WindowViz — AI Window & Door Visualization for Sales Teams",
    template: "%s | WindowViz",
  },
  description:
    "Walk into the appointment with the after. Upload a home photo, pick a window or door, and hand back a photorealistic rendering in seconds.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://windowviz.com"),
  openGraph: {
    title: "WindowViz — AI Window & Door Visualization for Sales Teams",
    description:
      "Walk into the appointment with the after. AI-powered photorealistic visualization for window and door sales.",
    siteName: "WindowViz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WindowViz — AI Window & Door Visualization for Sales Teams",
    description:
      "Walk into the appointment with the after. AI-powered photorealistic visualization for window and door sales.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
