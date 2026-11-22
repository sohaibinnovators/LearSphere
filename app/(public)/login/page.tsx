import { LoginForm } from "@/components/auth/LoginForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Demo sign-in page for LearnSphere. No real authentication is performed.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-ls max-w-md">
        <SectionHeader
          align="center"
          title="Welcome back"
          description="Sign in to continue learning on LearnSphere."
        />
        <div className="rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)]">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}