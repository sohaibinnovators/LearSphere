import { Logo } from "@/components/layout/Logo";
import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/courses", label: "All courses" },
      { href: "/categories", label: "Categories" },
      { href: "/instructors", label: "Instructors" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Log in" },
    ],
  },
  {
    title: "Dashboards",
    links: [
      { href: "/student", label: "Student dashboard" },
      { href: "/instructor", label: "Instructor dashboard" },
      { href: "/learn/complete-nextjs-mastery/crs-1-s1-l1", label: "Learning UI" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-ls grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            LearnSphere is a premium learning platform designed to help students
            grow skills and instructors share expertise with clarity.
          </p>
          <p className="mt-4 text-xs text-muted">
            Frontend portfolio demo · localStorage only · no live backend
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold text-foreground">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-ls flex flex-col gap-2 py-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 LearnSphere. All rights reserved.</p>
          <p>Learn Today. Lead Tomorrow.</p>
        </div>
      </div>
    </footer>
  );
}
