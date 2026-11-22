"use client";

import { LearnCourseEntry } from "@/components/learn/LearnCourseEntry";
import { LearningLessonView } from "@/components/learn/LearningLessonView";
import { useCourseCatalog } from "@/hooks/useInstructorStore";
import { getAllLessons } from "@/lib/data/courses";
import type { Course } from "@/lib/types";
import Link from "next/link";
import { useMemo } from "react";

export function LearnCourseIndexGate({
  courseSlug,
  seedCourse,
}: {
  courseSlug: string;
  seedCourse?: Course | null;
}) {
  const { ready, catalog } = useCourseCatalog();
  const course = useMemo(() => {
    if (!ready) return seedCourse ?? null;
    return catalog.find((item) => item.slug === courseSlug) ?? null;
  }, [ready, catalog, courseSlug, seedCourse]);

  if (!ready && !course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading course…
      </div>
    );
  }

  if (!course || course.status !== "published") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-medium text-foreground">Course unavailable</p>
        <p className="text-sm text-muted">
          Publish the course before opening the learning interface.
        </p>
        <Link href="/courses" className="text-sm text-primary">
          Back to courses
        </Link>
      </div>
    );
  }

  return <LearnCourseEntry course={course} />;
}

export function LearnLessonGate({
  courseSlug,
  lessonId,
  seedCourse,
}: {
  courseSlug: string;
  lessonId: string;
  seedCourse?: Course | null;
}) {
  const { ready, catalog } = useCourseCatalog();
  const course = useMemo(() => {
    if (!ready) return seedCourse ?? null;
    return catalog.find((item) => item.slug === courseSlug) ?? null;
  }, [ready, catalog, courseSlug, seedCourse]);

  if (!ready && !course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading lesson…
      </div>
    );
  }

  if (!course || course.status !== "published") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-medium text-foreground">Lesson unavailable</p>
        <Link href="/courses" className="text-sm text-primary">
          Back to courses
        </Link>
      </div>
    );
  }

  const lessons = getAllLessons(course);
  const lessonIndex = lessons.findIndex((item) => item.id === lessonId);
  const lesson = lessons[lessonIndex];

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-medium text-foreground">Lesson not found</p>
        <Link href={`/learn/${course.slug}`} className="text-sm text-primary">
          Open course
        </Link>
      </div>
    );
  }

  return (
    <LearningLessonView
      course={course}
      lesson={lesson}
      lessons={lessons}
      prevLesson={lessonIndex > 0 ? lessons[lessonIndex - 1] : null}
      nextLesson={
        lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null
      }
    />
  );
}
