"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseForm } from "@/components/instructor/CourseForm";
import { Button } from "@/components/ui/Button";
import { useInstructorStore } from "@/hooks/useInstructorStore";
import { DEMO_INSTRUCTOR_ID } from "@/lib/instructor/types";

export function EditCourseClient({ slug }: { slug: string }) {
  const { ready, myCourses, profile } = useInstructorStore();
  const course = myCourses.find((item) => item.slug === slug);

  return (
    <>
      <DashboardHeader
        title="Edit course"
        subtitle={course?.title ?? "Loading course…"}
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
      />
      <div className="p-4 md:p-6">
        {!ready ? (
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
        ) : !course || course.instructorId !== DEMO_INSTRUCTOR_ID ? (
          <div className="rounded-xl border border-dashed border-border bg-white py-16 text-center">
            <p className="font-medium text-foreground">Course not found</p>
            <p className="mt-2 text-sm text-muted">
              This course is missing from your local instructor catalog.
            </p>
            <Button href="/instructor/courses" className="mt-6">
              Back to My Courses
            </Button>
          </div>
        ) : (
          <CourseForm mode="edit" course={course} />
        )}
      </div>
    </>
  );
}
