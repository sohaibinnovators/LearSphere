"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyLearningState } from "@/components/student/EmptyLearningState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatsCard } from "@/components/ui/StatsCard";
import { useLearningStore } from "@/hooks/useLearningStore";
import { getAllLessons } from "@/lib/data/courses";
import { currentStudent } from "@/lib/data/student";
import { CheckCircle2, Layers, ListChecks, TrendingUp } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";

export default function StudentProgressPage() {
  const { ready, enrollments, stats, getContinueHref } = useLearningStore();
  const inProgress = stats.enrolledCount - stats.completedCount;

  return (
    <>
      <DashboardHeader
        title="Course progress"
        subtitle="Track completion across enrollments saved in this browser."
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
      />

      <div className="space-y-8 p-4 md:p-6">
        {!ready ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : enrollments.length === 0 ? (
          <EmptyLearningState
            title="No progress to show yet"
            description="Enroll in a course and mark lessons complete to build your progress board."
          />
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                label="Average progress"
                value={`${stats.avgProgress}%`}
                icon={TrendingUp}
              />
              <StatsCard
                label="In progress"
                value={String(inProgress)}
                icon={Layers}
              />
              <StatsCard
                label="Completed"
                value={String(stats.completedCount)}
                icon={CheckCircle2}
              />
              <StatsCard
                label="Lessons finished"
                value={String(stats.lessonsCompleted)}
                icon={ListChecks}
              />
            </section>

            <section className="space-y-4">
              {enrollments.map(({ enrollment, course }) => {
                const totalLessons = getAllLessons(course).length;
                const done = enrollment.completedLessonIds.length;
                const remaining = Math.max(totalLessons - done, 0);

                return (
                  <article
                    key={course.id}
                    className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                      <div className="relative h-24 w-full overflow-hidden rounded-xl bg-surface lg:h-28 lg:w-44">
                        <SafeImage
                          src={course.thumbnail}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="176px"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/courses/${course.slug}`}
                              className="text-lg font-semibold text-foreground hover:text-primary"
                            >
                              {course.title}
                            </Link>
                            <p className="mt-1 text-sm text-muted">
                              {course.level}
                            </p>
                          </div>
                          <Badge
                            tone={
                              enrollment.status === "completed"
                                ? "success"
                                : "primary"
                            }
                          >
                            {enrollment.progress}%
                          </Badge>
                        </div>
                        <ProgressBar value={enrollment.progress} showLabel />
                        <div className="grid gap-2 text-sm text-muted sm:grid-cols-3">
                          <p>
                            <span className="font-medium text-foreground">
                              {done}
                            </span>{" "}
                            / {totalLessons} lessons
                          </p>
                          <p>
                            <span className="font-medium text-foreground">
                              {remaining}
                            </span>{" "}
                            remaining
                          </p>
                          <p className="capitalize">
                            Status:{" "}
                            <span className="font-medium text-foreground">
                              {enrollment.status.replace("-", " ")}
                            </span>
                          </p>
                        </div>
                        <Button
                          href={getContinueHref(course, enrollment)}
                          size="sm"
                          variant="outline"
                        >
                          Open learning
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </>
  );
}
