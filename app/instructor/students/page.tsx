"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { useLearningStore } from "@/hooks/useLearningStore";
import { currentStudent } from "@/lib/data/student";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function InstructorStudentsPage() {
  const { ready, myCourses, profile } = useInstructorStore();
  const learning = useLearningStore();
  const [query, setQuery] = useState("");
  const [courseId, setCourseId] = useState("all");

  const rows = useMemo(() => {
    const courseIds = new Set(myCourses.map((course) => course.id));
    let list = learning.enrollments.filter((item) =>
      courseIds.has(item.course.id),
    );

    if (courseId !== "all") {
      list = list.filter((item) => item.course.id === courseId);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          currentStudent.name.toLowerCase().includes(q) ||
          currentStudent.email.toLowerCase().includes(q) ||
          item.course.title.toLowerCase().includes(q),
      );
    }

    return list.sort((a, b) =>
      b.enrollment.enrolledAt.localeCompare(a.enrollment.enrolledAt),
    );
  }, [myCourses, learning.enrollments, courseId, query]);

  return (
    <>
      <DashboardHeader
        title="Students"
        subtitle="Local demo enrollments for your courses (browser data only)."
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
      />

      <div className="space-y-6 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Search"
            placeholder="Student or course"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            label="Course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            options={[
              { value: "all", label: "All my courses" },
              ...myCourses.map((course) => ({
                value: course.id,
                label: course.title,
              })),
            ]}
          />
        </div>

        {!ready || !learning.ready ? (
          <div className="h-48 animate-pulse rounded-xl border border-border bg-white" />
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white py-16 text-center">
            <p className="font-medium text-foreground">No student enrollments</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              When someone enrolls in your published courses from this browser,
              course-level enrollment rows appear here. One student can appear
              multiple times if enrolled in multiple courses.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Enrolled</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ enrollment, course }) => (
                  <tr
                    key={`${course.id}-${enrollment.enrolledAt}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {currentStudent.name}
                      </p>
                      <p className="text-xs text-muted">{currentStudent.email}</p>
                      <p className="mt-1 text-[11px] text-muted">
                        Demo local learner identity
                      </p>
                    </td>
                    <td className="px-4 py-4 text-foreground">{course.title}</td>
                    <td className="px-4 py-4">
                      <div className="max-w-[12rem]">
                        <ProgressBar
                          value={enrollment.progress}
                          showLabel
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {enrollment.enrolledAt}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        tone={
                          enrollment.status === "completed"
                            ? "success"
                            : "primary"
                        }
                      >
                        {enrollment.status.replace("-", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
