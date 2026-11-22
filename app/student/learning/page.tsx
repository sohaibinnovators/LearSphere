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
import { BookOpen, PlayCircle, Target } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import {
  formatStudentDate,
  getContinueLearning,
  sortByLastAccessed,
} from "../utils";

export default function StudentLearningPage() {
  const { ready, enrollments, getContinueHref } = useLearningStore();
  const active = sortByLastAccessed(
    enrollments.filter((item) => item.enrollment.status === "in-progress"),
  );
  const focus = getContinueLearning(enrollments);
  const avgProgress =
    active.length === 0
      ? 0
      : Math.round(
          active.reduce((sum, item) => sum + item.enrollment.progress, 0) /
            active.length,
        );

  return (
    <>
      <DashboardHeader
        title="My learning"
        subtitle="Pick up where you left off. Progress is saved in this browser."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
      />

      <div className="space-y-8 p-4 md:p-6">
        {!ready ? (
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
        ) : enrollments.length === 0 ? (
          <EmptyLearningState
            title="Your learning library is empty"
            description="Enroll in a course from the catalog to see it here with live progress tracking."
          />
        ) : (
          <>
            {focus ? (
              <section className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 via-white to-secondary/5 shadow-[var(--shadow-sm)]">
                <div className="grid gap-6 p-5 md:grid-cols-2 md:p-8">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface">
                    <SafeImage
                      src={focus.course.thumbnail}
                      alt={focus.course.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <Badge tone="primary">Up next</Badge>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {focus.course.title}
                    </h2>
                    <p className="text-sm text-muted">{focus.course.subtitle}</p>
                    <p className="text-sm text-muted">
                      {getInstructorById(focus.course.instructorId)?.name} ·
                      Enrolled {formatStudentDate(focus.enrollment.enrolledAt)}
                    </p>
                    <ProgressBar
                      value={focus.enrollment.progress}
                      showLabel
                    />
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {focus.enrollment.completedLessonIds.length} lessons done
                      </span>
                      <span>{formatDuration(focus.course.duration)} total</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        href={getContinueHref(focus.course, focus.enrollment)}
                      >
                        <PlayCircle className="h-4 w-4" />
                        Continue learning
                      </Button>
                      <Button
                        href={`/courses/${focus.course.slug}`}
                        variant="outline"
                      >
                        View course
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">
                    Active courses
                  </h2>
                </div>
                <p className="text-sm text-muted">
                  Average progress:{" "}
                  <span className="font-semibold text-foreground">
                    {avgProgress}%
                  </span>
                </p>
              </div>
              {active.length === 0 ? (
                <p className="text-sm text-muted">
                  All enrolled courses are marked complete. Browse for a new one
                  when you&apos;re ready.
                </p>
              ) : (
                <ul className="space-y-4">
                  {active.map(({ enrollment, course }) => (
                    <li
                      key={course.id}
                      className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                    >
                      <div className="relative h-20 w-full overflow-hidden rounded-lg bg-surface sm:h-16 sm:w-28">
                        <SafeImage
                          src={course.thumbnail}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={getContinueHref(course, enrollment)}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {course.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {getInstructorById(course.instructorId)?.name} · Last
                          studied {formatStudentDate(enrollment.lastAccessed)}
                        </p>
                        <ProgressBar
                          value={enrollment.progress}
                          showLabel
                          className="mt-3"
                        />
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:items-stretch">
                        <Button
                          href={getContinueHref(course, enrollment)}
                          size="sm"
                        >
                          Resume
                        </Button>
                        <Button
                          href={`/courses/${course.slug}`}
                          variant="outline"
                          size="sm"
                        >
                          View course
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
