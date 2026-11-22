import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description:
    "Student learning dashboard for the LearnSphere portfolio demo. Local browser data only — not a production account system.",
  robots: { index: false, follow: false },
};

function SidebarFallback() {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:block">
        <div className="h-screen animate-pulse bg-white" />
      </aside>
      <div className="sticky top-0 z-30 h-14 border-b border-border bg-white lg:hidden" />
    </>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <DashboardSidebar variant="student" title="Student dashboard" />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
