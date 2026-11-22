import { SignupForm } from "@/components/auth/SignupForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Demo account creation for LearnSphere. No real user accounts are created.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-ls max-w-md">
        <SectionHeader
          align="center"
          title="Create your account"
          description="Choose your role and start exploring the platform."
        />
        <div className="rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)]">
          <SignupForm />
        </div>
      </div>
    </section>
  );
}