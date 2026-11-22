import { EditCourseClient } from "@/app/instructor/courses/[slug]/edit/EditCourseClient";
import { courses } from "@/lib/data/courses";
import { DEMO_INSTRUCTOR_ID } from "@/lib/instructor/types";
import { Suspense } from "react";

export function generateStaticParams() {
  return courses
    .filter((course) => course.instructorId === DEMO_INSTRUCTOR_ID)
    .map((course) => ({ slug: course.slug }));
}

async function EditCourseContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EditCourseClient slug={slug} />;
}

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted">Loading course editor…</div>
      }
    >
      <EditCourseContent params={params} />
    </Suspense>
  );
}
