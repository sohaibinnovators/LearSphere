"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Rating } from "@/components/ui/Rating";
import { StatsCard } from "@/components/ui/StatsCard";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { getAllLessons } from "@/lib/data/courses";
import { currentStudent } from "@/lib/data/student";
import { formatNumber } from "@/lib/utils";
import {
  BookOpen,
  FileEdit,
  Layers,
  MessageSquare,
  PlusCircle,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useMemo } from "react";
import { formatStudentDateTime } from "@/app/student/utils";

export default function InstructorOverviewPage() {
  const { ready, myCourses, profile } = useInstructorStore();
  const learning = useLearningStore();
  const engagement = useEngagementStore();

  const stats = useMemo(() => {
    const published = myCourses.filter((course) => course.status === "published");
    const drafts = myCourses.filter((course) => course.status === "draft");
    const totalLessons = myCourses.reduce(
      (sum, course) => sum + getAllLessons(course).length,
      0,
    );
    const courseIds = new Set(myCourses.map((course) => course.id));
    const localEnrollments = learning.enrollments.filter((item) =>
      courseIds.has(item.course.id),
    );
    const avgProgress =
      localEnrollments.length === 0
        ? 0
        : Math.round(
            localEnrollments.reduce(
              (sum, item) => sum + item.enrollment.progress,
              0,
            ) / localEnrollments.length,
          );

    return {
      total: myCourses.length,
      published: published.length,
      drafts: drafts.length,
      totalLessons,
      localStudents: localEnrollments.length,
      avgProgress,
      recentCourses: [...myCourses]
        .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
        .slice(0, 4),
      recentEnrollments: [...localEnrollments]
        .sort((a, b) =>
          b.enrollment.enrolledAt.localeCompare(a.enrollment.enrolledAt),
        )
        .slice(0, 5),
      performance: myCourses.map((course) => {
        const enrollments = localEnrollments.filter(
          (item) => item.course.id === course.id,
        );
        const avg =
          enrollments.length === 0
            ? 0
            : Math.round(
                enrollments.reduce(
                  (sum, item) => sum + item.enrollment.progress,
                  0,
                ) / enrollments.length,
              );
        return {
          course,
          enrollments: enrollments.length,
          avgProgress: avg,
          completed: enrollments.filter(
            (item) => item.enrollment.status === "completed",
          ).length,
        };
      }),
    };
  }, [myCourses, learning.enrollments]);

  const engagementSnapshot = useMemo(() => {
    const courseIds = new Set(myCourses.map((course) => course.id));
    const reviews = engagement.store.reviews
      .filter((review) => courseIds.has(review.courseId))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 3);
    const questions = engagement.store.discussions
      .filter(
        (post) =>
          courseIds.has(post.courseId) &&
          !post.parentId &&
          post.authorRole === "student",
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
    const activity = engagement.store.activity
      .filter((item) => item.courseId && courseIds.has(item.courseId))
      .slice(0, 4);
    return { reviews, questions, activity };
  }, [myCourses, engagement.store]);

  return (
    <>
      <DashboardHeader
        title="Instructor overview"
        subtitle="Live stats from your local course catalog and student enrollments."
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
        actions={
          <Button href="/instructor/courses/create" size="sm">
            <PlusCircle className="h-4 w-4" />
            New course
          </Button>
        }
      />

      <div className="space-y-8 p-4 md:p-6">
        {!ready || !learning.ready ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-border bg-white"
              />
            ))}
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatsCard
                label="Total courses"
                value={String(stats.total)}
                icon={BookOpen}
              />
              <StatsCard
                label="Published"
                value={String(stats.published)}
                icon={TrendingUp}
              />
              <StatsCard
                label="Drafts"
                value={String(stats.drafts)}
                icon={FileEdit}
              />
              <StatsCard
                label="Local enrollments"
                value={String(stats.localStudents)}
                hint="From local browser enrollments"
                icon={Users}
              />
              <StatsCard
                label="Total lessons"
                value={formatNumber(stats.totalLessons)}
                icon={Layers}
              />
              <StatsCard
                label="Avg. learner progress"
                value={`${stats.avgProgress}%`}
                hint={
                  stats.localStudents === 0
                    ? "No local enrollments yet"
                    : "Across your courses"
                }
                icon={TrendingUp}
              />
            </section>

            <section className="flex flex-wrap gap-3">
              <Button href="/instructor/courses/create">Create course</Button>
              <Button href="/instructor/courses" variant="outline">
                Manage courses
              </Button>
              <Button href="/instructor/students" variant="outline">
                View students
              </Button>
              <Button href="/instructor/analytics" variant="outline">
                Open analytics
              </Button>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent courses
                  </h2>
                  <Link
                    href="/instructor/courses"
                    className="text-sm font-medium text-primary"
                  >
                    View all
                  </Link>
                </div>
                {stats.recentCourses.length === 0 ? (
                  <p className="text-sm text-muted">
                    No courses yet. Create your first course to get started.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {stats.recentCourses.map((course) => (
                      <li key={course.id} className="flex gap-3">
                        <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-surface">
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
                            href={`/instructor/courses/${course.slug}/edit`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {course.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <Badge
                              tone={
                                course.status === "published"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {course.status}
                            </Badge>
                            <span className="text-xs text-muted">
                              Updated {course.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Recent local enrollments
                </h2>
                {stats.recentEnrollments.length === 0 ? (
                  <p className="text-sm text-muted">
                    No browser enrollments in your courses yet. Enroll as a
                    student from a published course detail page to see activity
                    here.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {stats.recentEnrollments.map(({ enrollment, course }) => (
                      <li
                        key={`${course.id}-${enrollment.enrolledAt}`}
                        className="rounded-lg border border-border p-3"
                      >
                        <p className="font-medium text-foreground">
                          {currentStudent.name}
                        </p>
                        <p className="text-sm text-muted">{course.title}</p>
                        <div className="mt-2">
                          <ProgressBar
                            value={enrollment.progress}
                            showLabel
                          />
                        </div>
                        <p className="mt-2 text-xs text-muted">
                          Enrolled {enrollment.enrolledAt}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Course performance summary
              </h2>
              {stats.performance.length === 0 ? (
                <p className="text-sm text-muted">No courses to summarize.</p>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {stats.performance.slice(0, 4).map((row) => (
                    <article
                      key={row.course.id}
                      className="rounded-xl border border-border bg-white p-4 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {row.course.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted">
                            {row.enrollments} local enrollment
                            {row.enrollments === 1 ? "" : "s"} · {row.completed}{" "}
                            completed
                          </p>
                        </div>
                        <Badge tone="muted">{row.course.status}</Badge>
                      </div>
                      <ProgressBar
                        value={row.avgProgress}
                        showLabel
                        className="mt-4"
                      />
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    Recent reviews
                  </h2>
                  <Link
                    href="/instructor/reviews"
                    className="text-sm font-medium text-primary"
                  >
                    All
                  </Link>
                </div>
                {engagementSnapshot.reviews.length === 0 ? (
                  <p className="text-sm text-muted">
                    No local student reviews yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {engagementSnapshot.reviews.map((review) => {
                      const course = myCourses.find(
                        (item) => item.id === review.courseId,
                      );
                      return (
                        <li key={review.id}>
                          <Rating value={review.rating} />
                          <p className="mt-1 line-clamp-2 text-sm text-foreground">
                            {review.comment}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {review.studentName}
                            {course ? ` · ${course.title}` : ""}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Discussion questions
                  </h2>
                  <Link
                    href="/instructor/discussions"
                    className="text-sm font-medium text-primary"
                  >
                    Reply
                  </Link>
                </div>
                {engagementSnapshot.questions.length === 0 ? (
                  <p className="text-sm text-muted">
                    No open student questions in this browser.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {engagementSnapshot.questions.map((question) => {
                      const course = myCourses.find(
                        (item) => item.id === question.courseId,
                      );
                      return (
                        <li key={question.id}>
                          <p className="line-clamp-2 text-sm text-foreground">
                            {question.body}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {question.authorName}
                            {course ? ` · ${course.title}` : ""}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
                <h2 className="mb-3 text-base font-semibold text-foreground">
                  Recent student activity
                </h2>
                {engagementSnapshot.activity.length === 0 ? (
                  <p className="text-sm text-muted">
                    Local learner events for your courses will show here.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {engagementSnapshot.activity.map((item) => (
                      <li key={item.id}>
                        <p className="text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {formatStudentDateTime(item.createdAt)}
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
