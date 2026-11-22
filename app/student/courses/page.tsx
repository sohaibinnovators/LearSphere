"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyLearningState } from "@/components/student/EmptyLearningState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useLearningStore } from "@/hooks/useLearningStore";
import { getInstructorById } from "@/lib/data/instructors";
import { currentStudent } from "@/lib/data/student";
import { formatDuration } from "@/lib/utils";
import { PlayCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { formatStudentDate } from "../utils";

const statusTone = {
  "in-progress": "primary" as const,
  completed: "success" as const,
};

const statusLabel = {
  "in-progress": "In progress",
  completed: "Completed",
};

export default function StudentCoursesPage() {
  const { ready, enrollments, getContinueHref } = useLearningStore();

  return (
    <>
      <DashboardHeader
        title="Enrolled courses"
        subtitle={
          ready
            ? `${enrollments.length} course${enrollments.length === 1 ? "" : "s"} in your local library`
            : "Loading enrollments…"
        }
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
        actions={
          <Button href="/courses" variant="outline" size="sm">
            Browse catalog
          </Button>
        }
      />

      <div className="p-4 md:p-6">
        {!ready ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-xl border border-border bg-white"
              />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <EmptyLearningState />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {enrollments.map(({ enrollment, course }) => {
              const instructor = getInstructorById(course.instructorId);
              return (
                <article
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-sm)] transition hover:border-primary/25 hover:shadow-[var(--shadow-md)]"
                >
                  <Link
                    href={`/courses/${course.slug}`}
                    className="relative block aspect-[16/10] bg-surface"
                  >
                    <SafeImage
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Badge tone={statusTone[enrollment.status]}>
                        {statusLabel[enrollment.status]}
                      </Badge>
                      <span className="text-xs text-muted">
                        {formatDuration(course.duration)}
                      </span>
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="text-lg font-semibold text-foreground hover:text-primary"
                    >
                      {course.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {instructor?.name ?? "Instructor"}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Enrolled {formatStudentDate(enrollment.enrolledAt)} · Last
                      accessed {formatStudentDate(enrollment.lastAccessed)}
                    </p>
                    <ProgressBar
                      value={enrollment.progress}
                      showLabel
                      className="mt-4"
                    />
                    <div className="mt-4 grid gap-2 border-t border-border pt-4">
                      <Button
                        href={getContinueHref(course, enrollment)}
                        variant={
                          enrollment.status === "completed"
                            ? "outline"
                            : "primary"
                        }
                        size="sm"
                        className="w-full"
                      >
                        <PlayCircle className="h-4 w-4" />
                        {enrollment.status === "completed"
                          ? "Review lessons"
                          : "Continue learning"}
                      </Button>
                      <Button
                        href={`/courses/${course.slug}`}
                        variant="ghost"
                        size="sm"
                        className="w-full"
                      >
                        View course
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
