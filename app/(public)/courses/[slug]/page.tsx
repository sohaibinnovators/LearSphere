import { CourseDetailView } from "@/components/courses/CourseDetailView";
import { getCourseBySlug, getPublishedCourses } from "@/lib/data";
import type { Metadata } from "next";
import { Suspense } from "react";

export function generateStaticParams() {
  return getPublishedCourses().map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || course.status !== "published") {
    return { title: "Course" };
  }
  return {
    title: course.title,
    description: course.subtitle,
  };
}

async function CourseDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seed = getCourseBySlug(slug);
  const seedCourse =
    seed && seed.status === "published" ? seed : seed ?? null;

  return <CourseDetailView slug={slug} seedCourse={seedCourse} />;
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="container-ls py-20 text-sm text-muted">
          Loading course…
        </div>
      }
    >
      <CourseDetailContent params={params} />
    </Suspense>
  );
}
