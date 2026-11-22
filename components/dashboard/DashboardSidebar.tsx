"use client";

import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import {
  Activity,
  Award,
  BarChart3,
  Bookmark,
  BookOpen,
  DollarSign,
  GraduationCap,
  Heart,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Bell,
  PlusCircle,
  Settings,
  Star,
  TrendingUp,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const studentNavItems: DashboardNavItem[] = [
  { href: "/student", label: "Overview", icon: LayoutDashboard },
  { href: "/student/learning", label: "My Learning", icon: BookOpen },
  { href: "/student/courses", label: "Enrolled Courses", icon: GraduationCap },
  { href: "/student/progress", label: "Course Progress", icon: TrendingUp },
  { href: "/student/wishlist", label: "Wishlist", icon: Heart },
  { href: "/student/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/student/certificates", label: "Certificates", icon: Award },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
  { href: "/student/activity", label: "Learning Activity", icon: Activity },
  { href: "/student/settings", label: "Profile Settings", icon: Settings },
  { href: "/", label: "Back to home", icon: Home },
];

const instructorNavItems: DashboardNavItem[] = [
  { href: "/instructor", label: "Overview", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
  {
    href: "/instructor/courses/create",
    label: "Create Course",
    icon: PlusCircle,
  },
  { href: "/instructor/students", label: "Students", icon: Users },
  { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/instructor/reviews", label: "Reviews", icon: Star },
  { href: "/instructor/discussions", label: "Discussions", icon: MessageSquare },
  { href: "/instructor/earnings", label: "Earnings", icon: DollarSign },
  { href: "/instructor/profile", label: "Profile", icon: User },
  { href: "/instructor/settings", label: "Settings", icon: Settings },
  { href: "/", label: "Back to home", icon: Home },
];

export function DashboardSidebar({
  variant,
  title,
}: {
  variant: "student" | "instructor";
  title: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items =
    variant === "student" ? studentNavItems : instructorNavItems;
  const rootHref = variant === "student" ? "/student" : "/instructor";

  const nav = (
    <nav className="space-y-1 p-3">
      {items.map((item) => {
        const active =
          item.href === rootHref
            ? pathname === item.href
            : item.href !== "/" && pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="border-b border-border px-4 py-4">
            <Logo />
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
              {title}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">{nav}</div>
          <div className="border-t border-border p-4 text-xs text-muted">
            Portfolio demo · localStorage only
          </div>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <Logo compact />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 hover:bg-surface"
          aria-label="Toggle dashboard menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden">
          <div className="h-full w-72 bg-white shadow-[var(--shadow-md)]">
            <div className="border-b border-border px-4 py-4">
              <Logo />
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
                {title}
              </p>
            </div>
            {nav}
          </div>
          <button
            type="button"
            className="absolute inset-0 -z-10"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </>
  );
}
