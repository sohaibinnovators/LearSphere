import { CourseExplorer } from "@/components/courses/CourseExplorer";
import { parseCourseFilters } from "@/lib/url/course-params";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse and filter expert-led courses on LearnSphere.",
};

async function CoursesContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCourseFilters(params);
  return <CourseExplorer initialFilters={filters} />;
}

function CoursesFallback() {
  return (
    <div className="container-ls py-12 md:py-16">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-surface" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-xl border border-border bg-white"
          />
        ))}
      </div>
    </div>
  );
}

export default function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<CoursesFallback />}>
      <CoursesContent searchParams={searchParams} />
    </Suspense>
  );
}
