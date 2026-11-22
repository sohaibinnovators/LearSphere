import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LearnSphere — Learn Today. Lead Tomorrow.",
    template: "%s · LearnSphere",
  },
  description:
    "LearnSphere is a frontend LMS portfolio demo for discovering courses, tracking learning progress, and exploring instructor tools — all with local browser persistence.",
  applicationName: "LearnSphere",
  keywords: [
    "LearnSphere",
    "LMS",
    "online learning",
    "Next.js portfolio",
    "course marketplace demo",
  ],
  authors: [{ name: "LearnSphere" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LearnSphere",
    title: "LearnSphere — Learn Today. Lead Tomorrow.",
    description:
      "A premium Learning Management System portfolio demo built with Next.js. Browse courses, learn locally, and explore instructor workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnSphere — Learn Today. Lead Tomorrow.",
    description:
      "Frontend LMS portfolio demo with course discovery, student learning, and instructor tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
