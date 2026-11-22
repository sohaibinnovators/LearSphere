"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/ui/StatsCard";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { BookOpen, CheckCircle2, PieChart, Users } from "lucide-react";
import { useMemo } from "react";

export default function InstructorAnalyticsPage() {
  const { ready, myCourses, profile } = useInstructorStore();
  const learning = useLearningStore();

  const analytics = useMemo(() => {
    const courseIds = new Set(myCourses.map((course) => course.id));
    const enrollments = learning.enrollments.filter((item) =>
      courseIds.has(item.course.id),
    );
    const published = myCourses.filter((course) => course.status === "published");
    const drafts = myCourses.filter((course) => course.status === "draft");
    const completed = enrollments.filter(
      (item) => item.enrollment.status === "completed",
    ).length;
    const avgProgress =
      enrollments.length === 0
        ? 0
        : Math.round(
            enrollments.reduce(
              (sum, item) => sum + item.enrollment.progress,
              0,
            ) / enrollments.length,
          );

    const perCourse = myCourses.map((course) => {
      const rows = enrollments.filter((item) => item.course.id === course.id);
      const avg =
        rows.length === 0
          ? 0
          : Math.round(
              rows.reduce((sum, item) => sum + item.enrollment.progress, 0) /
                rows.length,
            );
      return {
        course,
        enrollments: rows.length,
        completed: rows.filter((item) => item.enrollment.status === "completed")
          .length,
        avgProgress: avg,
      };
    });

    const maxEnrollments = Math.max(
      1,
      ...perCourse.map((row) => row.enrollments),
    );

    return {
      enrollments: enrollments.length,
      completed,
      avgProgress,
      published: published.length,
      drafts: drafts.length,
      perCourse,
      maxEnrollments,
      completionRate:
        enrollments.length === 0
          ? 0
          : Math.round((completed / enrollments.length) * 100),
    };
  }, [myCourses, learning.enrollments]);

  return (
    <>
      <DashboardHeader
        title="Analytics"
        subtitle="Calculated from your local courses and browser enrollments."
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
      />

      <div className="space-y-8 p-4 md:p-6">
        {!ready || !learning.ready ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                label="Local enrollments"
                value={String(analytics.enrollments)}
                icon={Users}
              />
              <StatsCard
                label="Completions"
                value={String(analytics.completed)}
                hint={`${analytics.completionRate}% completion rate`}
                icon={CheckCircle2}
              />
              <StatsCard
                label="Avg. progress"
                value={`${analytics.avgProgress}%`}
                icon={PieChart}
              />
              <StatsCard
                label="Published / Draft"
                value={`${analytics.published} / ${analytics.drafts}`}
                icon={BookOpen}
              />
            </section>

            <section className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
              <h2 className="text-lg font-semibold text-foreground">
                Published vs draft
              </h2>
              <p className="mt-1 text-sm text-muted">
                Distribution of courses in your local instructor catalog.
              </p>
              {myCourses.length === 0 ? (
                <p className="mt-6 text-sm text-muted">No courses available.</p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DistributionBar
                    label="Published"
                    value={analytics.published}
                    total={myCourses.length}
                    tone="bg-primary"
                  />
                  <DistributionBar
                    label="Draft"
                    value={analytics.drafts}
                    total={myCourses.length}
                    tone="bg-warning"
                  />
                </div>
              )}
            </section>

            <section className="rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)]">
              <h2 className="text-lg font-semibold text-foreground">
                Enrollments by course
              </h2>
              <p className="mt-1 text-sm text-muted">
                Local browser enrollments only — not catalog marketing figures.
              </p>
              {analytics.perCourse.length === 0 ? (
                <p className="mt-6 text-sm text-muted">No courses to compare.</p>
              ) : analytics.enrollments === 0 ? (
                <p className="mt-6 text-sm text-muted">
                  No local enrollments yet. Metrics appear after a student
                  enrolls in one of your published courses in this browser.
                </p>
              ) : (
                <ul className="mt-6 space-y-4">
                  {analytics.perCourse.map((row) => (
                    <li key={row.course.id}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-foreground">
                          {row.course.title}
                        </span>
                        <span className="text-muted">
                          {row.enrollments} enrolled · {row.avgProgress}% avg
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{
                            width: `${Math.round(
                              (row.enrollments / analytics.maxEnrollments) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <p className="text-xs text-muted">
              Earnings and payout charts are intentionally omitted. This demo
              does not treat simulated revenue as real income.
            </p>
          </>
        )}
      </div>
    </>
  );
}

function DistributionBar({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: string;
}) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted">
          {value} ({pct}%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
