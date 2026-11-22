"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseDiscussionPanel } from "@/components/learn/LessonStudyTools";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { currentInstructor } from "@/lib/data/instructor-dashboard";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatStudentDateTime } from "@/app/student/utils";

export default function InstructorDiscussionsPage() {
  const { ready: instructorReady, myCourses } = useInstructorStore();
  const { ready, store } = useEngagementStore();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const courseIds = useMemo(
    () => new Set(myCourses.map((course) => course.id)),
    [myCourses],
  );

  const questions = useMemo(
    () =>
      store.discussions
        .filter(
          (post) =>
            courseIds.has(post.courseId) &&
            !post.parentId &&
            post.authorRole === "student",
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [store.discussions, courseIds],
  );

  const selectedCourse =
    myCourses.find((course) => course.id === activeCourseId) ??
    myCourses.find((course) =>
      questions.some((question) => question.courseId === course.id),
    ) ??
    myCourses[0] ??
    null;

  return (
    <>
      <DashboardHeader
        title="Discussions"
        subtitle="Reply to student questions for your courses (local demo only)."
        user={{
          name: currentInstructor.name,
          avatar: currentInstructor.avatar,
          role: "Instructor",
        }}
      />

      <div className="space-y-6 p-4 md:p-6">
        {!ready || !instructorReady ? (
          <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        ) : myCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-medium text-foreground">No courses yet</p>
            <p className="mt-1 text-sm text-muted">
              Create a course before managing discussions.
            </p>
            <Button href="/instructor/courses/create" className="mt-6">
              Create course
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-4">
              <section className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground">
                  Open questions
                </p>
                {questions.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">
                    No student questions in this browser yet.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {questions.slice(0, 8).map((question) => {
                      const course = myCourses.find(
                        (item) => item.id === question.courseId,
                      );
                      const replyCount = store.discussions.filter(
                        (post) => post.parentId === question.id,
                      ).length;
                      return (
                        <li key={question.id}>
                          <button
                            type="button"
                            className="w-full rounded-lg border border-border px-3 py-2 text-left hover:border-primary/40"
                            onClick={() => setActiveCourseId(question.courseId)}
                          >
                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                              {question.body}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {question.authorName} ·{" "}
                              {formatStudentDateTime(question.createdAt)}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge tone="muted">
                                {course?.title ?? "Course"}
                              </Badge>
                              <Badge tone={replyCount ? "success" : "warning"}>
                                {replyCount
                                  ? `${replyCount} reply`
                                  : "Needs reply"}
                              </Badge>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
              <section className="rounded-xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground">Courses</p>
                <ul className="mt-3 space-y-2">
                  {myCourses.map((course) => (
                    <li key={course.id}>
                      <button
                        type="button"
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                          selectedCourse?.id === course.id
                            ? "bg-primary text-white"
                            : "hover:bg-surface"
                        }`}
                        onClick={() => setActiveCourseId(course.id)}
                      >
                        {course.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>

            <div className="space-y-4">
              {selectedCourse ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {selectedCourse.title}
                      </h2>
                      <p className="text-sm text-muted">
                        Instructor replies are stored locally in this browser.
                      </p>
                    </div>
                    <Link
                      href={`/learn/${selectedCourse.slug}?tab=discussion`}
                      className="text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      Open learning discussion
                    </Link>
                  </div>
                  <CourseDiscussionPanel
                    course={selectedCourse}
                    mode="instructor"
                  />
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
