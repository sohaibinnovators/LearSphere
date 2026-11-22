import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning",
  description:
    "Course learning interface for the LearnSphere portfolio demo. Progress is stored in this browser only.",
  robots: { index: false, follow: false },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}