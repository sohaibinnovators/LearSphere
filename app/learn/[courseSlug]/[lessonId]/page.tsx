import { LearnLessonGate } from "@/components/learn/LearnCourseGate";
import {
  getAllLessons,
  getCourseBySlug,
  getPublishedCourses,
} from "@/lib/data/courses";
import { Suspense } from "react";

export function generateStaticParams() {
  return getPublishedCourses().flatMap((course) =>
    getAllLessons(course).map((lesson) => ({
      courseSlug: course.slug,
      lessonId: lesson.id,
    })),
  );
}

async function LearningLessonContent({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const seed = getCourseBySlug(courseSlug);
  const seedCourse = seed?.status === "published" ? seed : null;

  return (
    <LearnLessonGate
      courseSlug={courseSlug}
      lessonId={lessonId}
      seedCourse={seedCourse}
    />
  );
}

export default function LearningLessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted">
          Loading lesson…
        </div>
      }
    >
      <LearningLessonContent params={params} />
    </Suspense>
  );
}
