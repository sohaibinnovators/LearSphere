"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseForm } from "@/components/instructor/CourseForm";
import { useInstructorStore } from "@/hooks/useInstructorStore";

export default function CreateCoursePage() {
  const { profile } = useInstructorStore();

  return (
    <>
      <DashboardHeader
        title="Create course"
        subtitle="Build a draft or publish immediately. Saved in this browser."
        user={{
          name: profile.name,
          avatar: profile.avatar,
          role: "Instructor",
        }}
      />
      <div className="p-4 md:p-6">
        <CourseForm mode="create" />
      </div>
    </>
  );
}
