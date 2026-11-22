"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { currentInstructor } from "@/lib/data/instructor-dashboard";
import { MessageSquareQuote, Star } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { formatStudentDate } from "@/app/student/utils";

export default function InstructorReviewsPage() {
  const { ready: instructorReady, myCourses } = useInstructorStore();
  const { ready, store, getRatingStats } = useEngagementStore();

  const courseIds = useMemo(
    () => new Set(myCourses.map((course) => course.id)),
    [myCourses],
  );

  const reviews = useMemo(
    () =>
      store.reviews
        .filter((review) => courseIds.has(review.courseId))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
    [store.reviews, courseIds],
  );

  const stats = useMemo(() => {
    if (!instructorReady) return { avg: 0, count: 0, coursesWithReviews: 0 };
    let total = 0;
    let count = 0;
    let coursesWithReviews = 0;
    for (const course of myCourses) {
      const courseStats = getRatingStats(course);
      if (courseStats.reviewCount > 0) {
        coursesWithReviews += 1;
        total += courseStats.rating * courseStats.reviewCount;
        count += courseStats.reviewCount;
      }
    }
    return {
      avg: count === 0 ? 0 : Math.round((total / count) * 10) / 10,
      count,
      coursesWithReviews,
    };
  }, [instructorReady, myCourses, getRatingStats]);

  return (
    <>
      <DashboardHeader
        title="Reviews"
        subtitle="Local demo student feedback on your courses in this browser."
        user={{
          name: currentInstructor.name,
          avatar: currentInstructor.avatar,
          role: "Instructor",
        }}
      />

      <div className="space-y-6 p-4 md:p-6">
        {!ready || !instructorReady ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm text-muted">Average rating</p>
                <div className="mt-2">
                  {stats.count > 0 ? (
                    <Rating value={stats.avg} count={stats.count} size="md" />
                  ) : (
                    <p className="text-lg font-semibold text-foreground">—</p>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm text-muted">Local reviews</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {reviews.length}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm text-muted">Courses with ratings</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {stats.coursesWithReviews}
                </p>
              </div>
            </section>

            {reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
                <Star className="mx-auto h-10 w-10 text-muted" />
                <p className="mt-4 font-medium text-foreground">
                  No local reviews yet
                </p>
                <p className="mt-1 text-sm text-muted">
                  When the demo student completes a course and leaves feedback,
                  it appears here.
                </p>
                <Button
                  href="/instructor/discussions"
                  className="mt-6"
                  variant="outline"
                >
                  <MessageSquareQuote className="h-4 w-4" />
                  View discussions
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const course = myCourses.find(
                    (item) => item.id === review.courseId,
                  );
                  return (
                    <article
                      key={review.id}
                      className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {review.studentName}
                          </p>
                          <p className="text-sm text-muted">
                            {course?.title ?? "Course"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Rating value={review.rating} size="md" />
                          <Badge tone="muted">Local demo</Badge>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground">
                        {review.comment}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span>{formatStudentDate(review.updatedAt)}</span>
                        {course ? (
                          <Link
                            href={`/courses/${course.slug}`}
                            className="font-medium text-primary hover:text-primary-dark"
                          >
                            View course
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
