import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { platformStats, whyChoose } from "@/lib/data";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about LearnSphere's mission and platform vision.",
};

export default function AboutPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-border bg-white py-14">
        <div className="container-ls grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="About LearnSphere"
              title="Learning that respects your time"
              description="LearnSphere combines expert instruction, structured curricula, and a premium interface so you can focus on growth—not noise."
            />
            <p className="text-muted leading-relaxed">
              This portfolio demo delivers the full public experience with mock
              catalog data, local enrollment, lesson progress, instructor course
              tools, and engagement features stored in your browser—without a
              live backend or payments.
            </p>
            <div className="mt-8 flex gap-3">
              <Button href="/courses">Explore courses</Button>
              <Button href="/contact" variant="outline">
                Contact us
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=900&fit=crop"
              alt="Team learning session"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-ls">
          <SectionHeader
            align="center"
            title="Our principles"
            description="What guides every screen and interaction."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-white p-6">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/40 py-14">
        <div className="container-ls">
          <SectionHeader
            align="center"
            title="Platform at a glance"
            description="Demonstration metrics for this portfolio demo."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-white p-6 text-center"
              >
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
                <p className="mt-1 text-xs text-muted">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}