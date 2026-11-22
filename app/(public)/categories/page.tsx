import { CategoryCard } from "@/components/course/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse course categories on LearnSphere.",
};

export default function CategoriesPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-ls">
        <SectionHeader
          title="All categories"
          description="Find structured learning paths across skills and industries."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}