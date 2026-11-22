import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { faqs } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about LearnSphere.",
};

export default function FaqPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-ls max-w-3xl">
        <SectionHeader
          title="Frequently asked questions"
          description="Quick answers about learning, certificates, and this portfolio demo."
        />
        <FaqAccordion items={faqs} />
        <div className="mt-10 rounded-xl border border-border bg-surface/50 p-6 text-center">
          <p className="text-sm text-muted">Still have questions?</p>
          <Button href="/contact" className="mt-4">
            Contact support
          </Button>
        </div>
      </div>
    </section>
  );
}