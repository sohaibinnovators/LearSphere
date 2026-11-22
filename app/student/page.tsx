"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyLearningState } from "@/components/student/EmptyLearningState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatsCard } from "@/components/ui/StatsCard";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useCourseCatalog } from "@/hooks/useInstructorStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { getInstructorById } from "@/lib/data/instructors";
import { currentStudent } from "@/lib/data/student";
import {
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import {
  formatStudentDate,
  formatStudentDateTime,
  getContinueLearning,
  sortByLastAccessed,
} from "./utils";

export default function StudentOverviewPage() {
  const { ready, enrollments, stats, getContinueHref } = useLearningStore();
  const { store: engagement } = useEngagementStore();
  const { catalog } = useCourseCatalog();
  const continueCourse = getContinueLearning(enrollments);
  const recent = sortByLastAccessed(enrollments).slice(0, 3);
  const recentlyViewed = engagement.recentlyViewedCourses
    .map((item) => {
      const course = catalog.find((entry) => entry.id === item.courseId);
      return course ? { course, viewedAt: item.viewedAt } : null;
    })
    .filter(Boolean)
    .slice(0, 4) as { course: (typeof catalog)[number]; viewedAt: string }[];
  const recentActivity = engagement.activity.slice(0, 4);

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${currentStudent.name.split(" ")[0]}`}
        subtitle={currentStudent.headline}
        user={{
          name: currentStudent.name,
          avatar: currentStudent.avatar,
          role: currentStudent.role,
        }}
        showNotifications
        actions={
          <Button href="/student/learning" size="sm" variant="outline">
            <PlayCircle className="h-4 w-4" />
            My learning
          </Button>
        }
      />

      <div className="space-y-8 p-4 md:p-6">
        {!ready ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-border bg-white"
              />
            ))}
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                label="Courses enrolled"
                value={String(stats.enrolledCount)}
                hint="Saved in this browser"
                icon={GraduationCap}
              />
              <StatsCard
                label="Lessons completed"
                value={String(stats.lessonsCompleted)}
                icon={Clock}
              />
              <StatsCard
                label="Courses completed"
                value={String(stats.completedCount)}
                icon={Award}
              />
              <StatsCard
                label="Avg. progress"
                value={`${stats.avgProgress}%`}
                icon={BookOpen}
              />
            </section>

            {enrollments.length === 0 ? (
              <EmptyLearningState />
            ) : (
              <>
                {continueCourse ? (
                  <section className="overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-sm)]">
                    <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <Sparkles className="h-4 w-4" />
                          Continue learning
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-surface sm:h-24 sm:w-40">
                            <SafeImage
                              src={continueCourse.course.thumbnail}
                              alt={continueCourse.course.title}
                              fill
                              className="object-cover"
                              sizes="160px"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-3">
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">
                                {continueCourse.course.title}
                              </h2>
                              <p className="mt-1 text-sm text-muted">
                                Last accessed{" "}
                                {formatStudentDate(
                                  continueCourse.enrollment.lastAccessed,
                                )}
                              </p>
                            </div>
                            <ProgressBar
                              value={continueCourse.enrollment.progress}
                              showLabel
                            />
                            <Button
                              href={getContinueHref(
                                continueCourse.course,
                                continueCourse.enrollment,
                              )}
                              size="sm"
                            >
                              <PlayCircle className="h-4 w-4" />
                              Continue course
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}

                <section className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-foreground">
                      Recently accessed
                    </h2>
                    <Link
                      href="/student/courses"
                      className="text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      View all
                    </Link>
                  </div>
                  <ul className="divide-y divide-border">
                    {recent.map(({ enrollment, course }) => {
                      const instructor = getInstructorById(course.instructorId);
                      return (
                        <li
                          key={course.id}
                          className="flex gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                            <SafeImage
                              src={course.thumbnail}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="80px"
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
                              {instructor?.name ?? "Instructor"} ·{" "}
                              {formatStudentDate(enrollment.lastAccessed)} ·{" "}
                              {enrollment.progress}% complete
                            </p>
                            <ProgressBar
                              value={enrollment.progress}
                              className="mt-2"
                            />
                          </div>
                          {enrollment.status === "completed" ? (
                            <Badge tone="success">Completed</Badge>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </>
            )}

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">
                    Recently viewed courses
                  </h2>
                  <Link
                    href="/courses"
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Browse
                  </Link>
                </div>
                {recentlyViewed.length === 0 ? (
                  <p className="text-sm text-muted">
                    Open a course page to start this local viewing history.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentlyViewed.map(({ course, viewedAt }) => (
                      <li key={course.id} className="py-3 first:pt-0 last:pb-0">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {course.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          Viewed {formatStudentDateTime(viewedAt)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">
                    Learning activity
                  </h2>
                  <Link
                    href="/student/activity"
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    View all
                  </Link>
                </div>
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted">
                    Completions, enrollments, and other demo events will appear
                    here.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentActivity.map((item) => (
                      <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {formatStudentDateTime(item.createdAt)} ·{" "}
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
