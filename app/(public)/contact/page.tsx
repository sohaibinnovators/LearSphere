import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LearnSphere team.",
};

export default function ContactPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-ls grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <SectionHeader
            title="Contact us"
            description="Questions about courses, partnerships, or the platform? Send a message."
          />
          <ContactForm />
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="font-semibold text-foreground">LearnSphere HQ (demo)</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                500 Innovation Drive, San Francisco, CA
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                hello@learnsphere.demo
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                +1 (555) 010-2400
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-surface/60 p-6 text-sm text-muted">
            Support hours (demo): Mon–Fri, 9am–6pm PT. Responses are simulated locally.
          </div>
        </aside>
      </div>
    </section>
  );
}