import { LearnCourseIndexGate } from "@/components/learn/LearnCourseGate";
import {
  getCourseBySlug,
  getPublishedCourses,
} from "@/lib/data/courses";
import { Suspense } from "react";

export function generateStaticParams() {
  return getPublishedCourses().map((course) => ({ courseSlug: course.slug }));
}

async function LearnCourseContent({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const seed = getCourseBySlug(courseSlug);
  const seedCourse = seed?.status === "published" ? seed : null;
  return (
    <LearnCourseIndexGate courseSlug={courseSlug} seedCourse={seedCourse} />
  );
}

export default function LearnCourseIndexPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted">
          Loading course…
        </div>
      }
    >
      <LearnCourseContent params={params} />
    </Suspense>
  );
}
