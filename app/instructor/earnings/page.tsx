"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { formatPrice } from "@/lib/utils";
import { useMemo } from "react";

export default function InstructorEarningsPage() {
  const { ready, myCourses, profile } = useInstructorStore();
  const learning = useLearningStore();

  const summary = useMemo(() => {
    const courseIds = new Set(myCourses.map((course) => course.id));
    const enrollments = learning.enrollments.filter((item) =>
      courseIds.has(item.course.id),
    );
    const demoCatalogValue = myCourses.reduce((sum, course) => {
      const localCount = enrollments.filter(
        (item) => item.course.id === course.id,
      ).length;
      return sum + course.price * localCount;
    }, 0);

    return {
      enrollments: enrollments.length,
      demoCatalogValue,
    };
  }, [myCourses, learning.enrollments]);

  return (
    <>
      <DashboardHeader
        title="Earnings overview"
        subtitle="Portfolio demo metrics only — not real payouts."
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
      />
      <div className="space-y-6 p-4 md:p-6">
        {!ready || !learning.ready ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : (
          <>
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-5 text-sm text-foreground">
              LearnSphere does not process payments in this demo. Any dollar
              figures below are illustrative catalog math from local enrollments
              × listed course price, not revenue or bank payouts.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-sm text-muted">Local enrollments</p>
                <p className="mt-2 text-3xl font-semibold">
                  {summary.enrollments}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-sm text-muted">Illustrative catalog value</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatPrice(summary.demoCatalogValue)}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Demo formula only · unavailable as real earnings
                </p>
              </div>
            </div>
            {summary.enrollments === 0 ? (
              <p className="text-sm text-muted">
                No local enrollments yet, so illustrative value is $0.
              </p>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
