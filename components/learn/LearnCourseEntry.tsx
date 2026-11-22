"use client";

import { useLearningStore } from "@/hooks/useLearningStore";
import { getAllLessons } from "@/lib/data/courses";
import { getContinueLearningHref } from "@/lib/learning/storage";
import type { Course } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LearnCourseEntry({ course }: { course: Course }) {
  const router = useRouter();
  const { ready, getEnrollment } = useLearningStore();

  useEffect(() => {
    if (!ready) return;
    const enrollment = getEnrollment(course.id);
    if (enrollment) {
      router.replace(getContinueLearningHref(course, enrollment));
      return;
    }
    const first = getAllLessons(course)[0];
    if (first) {
      router.replace(`/learn/${course.slug}/${first.id}`);
      return;
    }
    router.replace(`/courses/${course.slug}`);
  }, [ready, course, getEnrollment, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted">
      Opening your lesson…
    </div>
  );
}
