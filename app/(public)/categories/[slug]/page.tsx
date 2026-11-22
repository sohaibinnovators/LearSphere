import { CategoryCoursesExplorer } from "@/components/categories/CategoryCoursesExplorer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  categories,
  getCategoryBySlug,
  getCategoryCourseCount,
  getCoursesByCategory,
} from "@/lib/data";
import { parseCourseFilters } from "@/lib/url/course-params";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.description,
  };
}

async function CategoryContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryCourses = getCoursesByCategory(category.id);
  const filters = {
    ...parseCourseFilters(await searchParams),
    category: category.id,
  };
  const courseCount = getCategoryCourseCount(category.id);

  return (
    <div className="pb-16">
      <section className="border-b border-border bg-white">
        <div className="container-ls grid gap-8 py-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Categories", href: "/categories" },
                { label: category.name },
              ]}
            />
            <SectionHeader
              eyebrow="Category"
              title={category.name}
              description={category.description}
            />
            <p className="text-sm text-muted">
              {courseCount} published course{courseCount === 1 ? "" : "s"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-muted"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
            <SafeImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container-ls">
          <CategoryCoursesExplorer
            category={category}
            courses={categoryCourses}
            initialFilters={filters}
          />
        </div>
      </section>
    </div>
  );
}

export default function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div className="container-ls py-16 text-sm text-muted">
          Loading category…
        </div>
      }
    >
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
